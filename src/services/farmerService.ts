import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  query,
  where,
  limit,
  orderBy,
  onSnapshot,
  runTransaction,
  serverTimestamp,
  Unsubscribe,
} from 'firebase/firestore';
import { db, isFirebaseConfigured } from './firebase/firebase.config';
import { Farmer } from '../types/models';

const FARMERS_COLLECTION = 'farmers';
const USERS_COLLECTION = 'users';
const COUNTERS_COLLECTION = 'counters';

/**
 * Strips undefined fields for clean Firestore persistence.
 */
function sanitize<T>(obj: T): any {
  if (obj === undefined || obj === null) return null;
  if (Array.isArray(obj)) return obj.map(sanitize);
  if (typeof obj === 'object' && !(obj instanceof Date)) {
    const res: Record<string, any> = {};
    for (const [k, v] of Object.entries(obj)) {
      res[k] = v === undefined ? null : sanitize(v);
    }
    return res;
  }
  return obj;
}

/**
 * Maps raw Firestore document data to a consistent Farmer model with aliases.
 */
function mapDocToFarmer(id: string, data: any): Farmer {
  const fId = data.farmerId || id;
  const fullName = data.fullName || data.name || 'Registered Farmer';
  const mobile = data.mobileNumber || data.phone || '';
  const addr = data.address || {
    village: data.village || '',
    district: data.district || '',
    state: data.state || '',
    pincode: data.pincode || data.pinCode || '',
  };

  return {
    ...data,
    farmerId: fId,
    id: fId,
    userId: data.userId || '',
    fullName,
    name: fullName,
    mobileNumber: mobile,
    phone: mobile,
    email: data.email || '',
    dateOfBirth: data.dateOfBirth || '',
    address: addr,
    village: addr.village,
    district: addr.district,
    state: addr.state,
    pinCode: addr.pincode,
    farmerType: data.farmerType || 'individual',
    landArea: data.landArea ?? data.landAreaHectares ?? 0,
    landAreaUnit: data.landAreaUnit || 'acre',
    primaryCrop: data.primaryCrop || '',
    preferredMandi: data.preferredMandi || '',
    status: data.status || 'active',
    isVerified: data.status === 'verified' || Boolean(data.isVerified),
  };
}

export const farmerService = {
  /**
   * Generates a sequential Farmer ID (FMR-YYYY-XXXXXX) using Firestore transactions.
   * Falls back to high-entropy timestamp if Firestore counters are inaccessible.
   */
  async generateFarmerId(): Promise<string> {
    const currentYear = new Date().getFullYear();

    if (isFirebaseConfigured() && db) {
      try {
        const counterRef = doc(db, COUNTERS_COLLECTION, `farmers_${currentYear}`);
        const newSeq = await runTransaction(db, async (transaction) => {
          const counterDoc = await transaction.get(counterRef);
          let currentVal = 0;
          if (counterDoc.exists()) {
            currentVal = counterDoc.data()?.lastNumber || 0;
          }
          const nextVal = currentVal + 1;
          transaction.set(
            counterRef,
            { lastNumber: nextVal, updatedAt: serverTimestamp() },
            { merge: true }
          );
          return nextVal;
        });

        const padded = String(newSeq).padStart(6, '0');
        return `FMR-${currentYear}-${padded}`;
      } catch (err) {
        console.warn('[farmerService] Counter transaction failed, using entropy fallback:', err);
      }
    }

    const entropy = String(Math.floor(100000 + Math.random() * 900000));
    return `FMR-${currentYear}-${entropy}`;
  },

  /**
   * Registers a new farmer in Cloud Firestore (`farmers/{farmerId}`)
   * and links with `users/{uid}`.
   */
  async registerFarmer(input: Partial<Farmer>): Promise<Farmer> {
    const farmerId = input.farmerId || (await this.generateFarmerId());
    const now = new Date().toISOString();

    const newFarmer: Farmer = {
      farmerId,
      id: farmerId,
      userId: input.userId || '',
      fullName: input.fullName || input.name || '',
      name: input.fullName || input.name || '',
      mobileNumber: input.mobileNumber || input.phone || '',
      phone: input.mobileNumber || input.phone || '',
      email: input.email || '',
      dateOfBirth: input.dateOfBirth || '',
      address: input.address || {
        village: input.village || '',
        district: input.district || '',
        state: input.state || '',
        pincode: input.pinCode || '',
      },
      farmerType: input.farmerType || 'individual',
      landArea: input.landArea ?? 0,
      landAreaUnit: input.landAreaUnit || 'acre',
      primaryCrop: input.primaryCrop || '',
      preferredMandi: input.preferredMandi || '',
      status: input.status || 'active',
      isVerified: input.status === 'verified',
      createdAt: now,
      updatedAt: now,
      ...input,
    };

    if (isFirebaseConfigured() && db) {
      try {
        const farmerRef = doc(db, FARMERS_COLLECTION, farmerId);
        await setDoc(farmerRef, sanitize({
          ...newFarmer,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        }));

        // Also update users/{uid} if userId is present
        if (input.userId) {
          const userRef = doc(db, USERS_COLLECTION, input.userId);
          await setDoc(
            userRef,
            sanitize({
              uid: input.userId,
              role: 'farmer',
              farmerId,
              name: newFarmer.fullName,
              phone: newFarmer.mobileNumber,
              email: newFarmer.email || null,
              status: 'active',
              updatedAt: serverTimestamp(),
            }),
            { merge: true }
          );
        }
      } catch (error) {
        console.error('[farmerService] Error registering farmer to Firestore:', error);
        throw error;
      }
    }

    return newFarmer;
  },

  /**
   * Fetch a single farmer by their Farmer ID (e.g. FMR-YYYY-XXXXXX).
   * Returns null if not found. NEVER returns mock data.
   */
  async getFarmerById(farmerId: string): Promise<Farmer | null> {
    if (!farmerId) return null;
    if (!isFirebaseConfigured() || !db) return null;

    try {
      // 1. Direct doc lookup by farmerId
      const farmerDoc = await getDoc(doc(db, FARMERS_COLLECTION, farmerId));
      if (farmerDoc.exists()) {
        return mapDocToFarmer(farmerDoc.id, farmerDoc.data());
      }

      // 2. Query where farmerId or registrationNumber matches
      const q = query(
        collection(db, FARMERS_COLLECTION),
        where('farmerId', '==', farmerId),
        limit(1)
      );
      const snap = await getDocs(q);
      if (!snap.empty) {
        const d = snap.docs[0];
        return mapDocToFarmer(d.id, d.data());
      }

      return null;
    } catch (err) {
      console.error(`[farmerService] Error fetching farmer ${farmerId}:`, err);
      return null;
    }
  },

  /**
   * Fetch farmer by Firebase Auth user UID.
   */
  async getFarmerByUserId(userId: string): Promise<Farmer | null> {
    if (!userId) return null;
    if (!isFirebaseConfigured() || !db) return null;

    try {
      const q = query(
        collection(db, FARMERS_COLLECTION),
        where('userId', '==', userId),
        limit(1)
      );
      const snap = await getDocs(q);
      if (!snap.empty) {
        const d = snap.docs[0];
        return mapDocToFarmer(d.id, d.data());
      }
      return null;
    } catch (err) {
      console.error(`[farmerService] Error fetching farmer by userId ${userId}:`, err);
      return null;
    }
  },

  /**
   * Search registered farmers by Farmer ID, Mobile Number, or Full Name.
   * Never returns mock data. Returns empty array if none found.
   */
  async searchFarmers(searchStr: string): Promise<Farmer[]> {
    if (!searchStr || !searchStr.trim()) return [];
    if (!isFirebaseConfigured() || !db) return [];

    const term = searchStr.trim();
    try {
      // Check exact farmerId match
      const byId = await this.getFarmerById(term);
      if (byId) return [byId];

      // Check mobile number match
      const qPhone = query(
        collection(db, FARMERS_COLLECTION),
        where('mobileNumber', '==', term),
        limit(5)
      );
      const phoneSnap = await getDocs(qPhone);
      if (!phoneSnap.empty) {
        return phoneSnap.docs.map((d) => mapDocToFarmer(d.id, d.data()));
      }

      // Check fullName match
      const qName = query(
        collection(db, FARMERS_COLLECTION),
        where('fullName', '>=', term),
        where('fullName', '<=', term + '\uf8ff'),
        limit(10)
      );
      const nameSnap = await getDocs(qName);
      return nameSnap.docs.map((d) => mapDocToFarmer(d.id, d.data()));
    } catch (err) {
      console.error('[farmerService] Search farmers error:', err);
      return [];
    }
  },

  /**
   * Fetch all registered farmers. Returns empty array if none exist in Cloud Firestore.
   */
  async getRegisteredFarmers(limitCount = 50): Promise<Farmer[]> {
    if (!isFirebaseConfigured() || !db) return [];

    try {
      const q = query(
        collection(db, FARMERS_COLLECTION),
        orderBy('createdAt', 'desc'),
        limit(limitCount)
      );
      const snap = await getDocs(q);
      if (snap.empty) return [];
      return snap.docs.map((d) => mapDocToFarmer(d.id, d.data()));
    } catch (err) {
      console.error('[farmerService] getRegisteredFarmers error:', err);
      return [];
    }
  },

  /**
   * Updates an existing farmer's profile fields.
   */
  async updateFarmer(farmerId: string, updates: Partial<Farmer>): Promise<void> {
    if (!farmerId || !isFirebaseConfigured() || !db) return;

    try {
      const ref = doc(db, FARMERS_COLLECTION, farmerId);
      await updateDoc(ref, sanitize({
        ...updates,
        updatedAt: serverTimestamp(),
      }));
    } catch (err) {
      console.error(`[farmerService] Error updating farmer ${farmerId}:`, err);
      throw err;
    }
  },

  /**
   * Sets verification status for a farmer (e.g. by Operator or Admin).
   */
  async verifyFarmer(
    farmerId: string,
    status: 'verified' | 'rejected' | 'pending',
    notes?: string
  ): Promise<void> {
    return this.updateFarmer(farmerId, {
      status,
      isVerified: status === 'verified',
      ...(notes ? { verificationNotes: notes } : {}),
    } as any);
  },

  /**
   * Real-time subscription to registered farmers list.
   */
  subscribeFarmers(callback: (farmers: Farmer[]) => void): Unsubscribe {
    if (!isFirebaseConfigured() || !db) {
      callback([]);
      return () => {};
    }

    try {
      const q = query(
        collection(db, FARMERS_COLLECTION),
        orderBy('createdAt', 'desc'),
        limit(50)
      );
      return onSnapshot(
        q,
        (snap) => {
          if (snap.empty) {
            callback([]);
            return;
          }
          const list = snap.docs.map((d) => mapDocToFarmer(d.id, d.data()));
          callback(list);
        },
        (err) => {
          console.error('[farmerService] subscribeFarmers snapshot error:', err);
          callback([]);
        }
      );
    } catch (err) {
      console.error('[farmerService] subscribeFarmers setup error:', err);
      callback([]);
      return () => {};
    }
  },
};
