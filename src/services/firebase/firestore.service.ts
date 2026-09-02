import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  onSnapshot,
  serverTimestamp,
  writeBatch,
  Unsubscribe,
} from 'firebase/firestore';
import { db, auth, isFirebaseConfigured } from './firebase.config';
import {
  Centre,
  Farmer,
  ProcurementTransaction,
  StatusHistoryEntry,
} from '../../types/models';
import { TransactionStatus, UserRole } from '../../types/enums';
import { MOCK_CENTRES, MOCK_FARMERS, generateMockTransactions } from '../mock-data.service';

const COLLECTIONS = {
  CENTRES: 'centres',
  FARMERS: 'farmers',
  TRANSACTIONS: 'transactions',
  USERS: 'users',
} as const;

/**
 * Recursively removes/replaces undefined fields so Cloud Firestore never throws invalid data errors.
 */
function sanitizeForFirestore<T>(obj: T): any {
  if (obj === undefined) {
    return null;
  }
  if (obj === null) {
    return null;
  }
  if (Array.isArray(obj)) {
    return obj.map((item) => sanitizeForFirestore(item));
  }
  if (typeof obj === 'object' && !(obj instanceof Date)) {
    const cleaned: Record<string, any> = {};
    for (const [key, value] of Object.entries(obj)) {
      if (value !== undefined) {
        cleaned[key] = sanitizeForFirestore(value);
      } else {
        cleaned[key] = null;
      }
    }
    return cleaned;
  }
  return obj;
}

export const FirestoreService = {
  // ==========================================
  // CENTRES / MANDIS
  // ==========================================

  /**
   * Fetch all procurement centres
   */
  async getCentres(): Promise<Centre[]> {
    if (!isFirebaseConfigured() || !db) return MOCK_CENTRES;

    try {
      const snap = await getDocs(collection(db, COLLECTIONS.CENTRES));
      if (snap.empty) {
        return MOCK_CENTRES;
      }
      return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Centre));
    } catch (e) {
      console.warn('[Firestore] Error fetching centres, using mock data:', e);
      return MOCK_CENTRES;
    }
  },

  /**
   * Listen to real-time updates for centres
   */
  subscribeCentres(callback: (centres: Centre[]) => void): Unsubscribe {
    if (!isFirebaseConfigured() || !db) {
      callback(MOCK_CENTRES);
      return () => {};
    }

    const q = query(collection(db, COLLECTIONS.CENTRES));
    return onSnapshot(
      q,
      (snap) => {
        if (snap.empty) {
          callback(MOCK_CENTRES);
          return;
        }
        const centres = snap.docs.map((d) => ({ id: d.id, ...d.data() } as Centre));
        callback(centres);
      },
      (error) => {
        console.warn('[Firestore] Error subscribing to centres, falling back to mock data:', error);
        callback(MOCK_CENTRES);
      }
    );
  },

  /**
   * Get single centre by ID
   */
  async getCentreById(id: string): Promise<Centre | null> {
    if (!isFirebaseConfigured() || !db) {
      return MOCK_CENTRES.find((c) => c.id === id) || null;
    }

    try {
      const snap = await getDoc(doc(db, COLLECTIONS.CENTRES, id));
      if (snap.exists()) {
        return { id: snap.id, ...snap.data() } as Centre;
      }
      return MOCK_CENTRES.find((c) => c.id === id) || null;
    } catch (e) {
      console.warn(`[Firestore] Error fetching centre ${id}:`, e);
      return MOCK_CENTRES.find((c) => c.id === id) || null;
    }
  },

  // ==========================================
  // FARMERS
  // ==========================================

  /**
   * Fetch all registered farmers
   */
  async getFarmers(): Promise<Farmer[]> {
    if (!isFirebaseConfigured() || !db) return MOCK_FARMERS;

    try {
      const snap = await getDocs(collection(db, COLLECTIONS.FARMERS));
      if (snap.empty) return MOCK_FARMERS;
      return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Farmer));
    } catch (e) {
      console.warn('[Firestore] Error fetching farmers:', e);
      return MOCK_FARMERS;
    }
  },

  /**
   * Get farmer by ID
   */
  async getFarmerById(id: string): Promise<Farmer | null> {
    if (!isFirebaseConfigured() || !db) {
      return MOCK_FARMERS.find((f) => f.id === id) || null;
    }

    try {
      const snap = await getDoc(doc(db, COLLECTIONS.FARMERS, id));
      if (snap.exists()) {
        return { id: snap.id, ...snap.data() } as Farmer;
      }
      return MOCK_FARMERS.find((f) => f.id === id) || null;
    } catch (e) {
      console.warn(`[Firestore] Error fetching farmer ${id}:`, e);
      return MOCK_FARMERS.find((f) => f.id === id) || null;
    }
  },

  /**
   * Create or update a farmer profile
   */
  async saveFarmer(farmer: Farmer): Promise<void> {
    if (!isFirebaseConfigured() || !db) return;

    try {
      await setDoc(doc(db, COLLECTIONS.FARMERS, farmer.id), sanitizeForFirestore(farmer), { merge: true });
    } catch (e) {
      console.warn(`[Firestore] Error saving farmer ${farmer.id}:`, e);
    }
  },

  // ==========================================
  // TRANSACTIONS / BOOKINGS / QUEUE
  // ==========================================

  /**
   * Fetch all transactions
   */
  async getTransactions(): Promise<ProcurementTransaction[]> {
    const mockTxs = generateMockTransactions();
    if (!isFirebaseConfigured() || !db) return mockTxs;

    try {
      const snap = await getDocs(collection(db, COLLECTIONS.TRANSACTIONS));
      if (snap.empty) return mockTxs;
      return snap.docs.map((d) => ({ id: d.id, ...d.data() } as ProcurementTransaction));
    } catch (e) {
      console.warn('[Firestore] Error fetching transactions:', e);
      return mockTxs;
    }
  },

  /**
   * Real-time subscription to transactions
   */
  subscribeTransactions(
    callback: (transactions: ProcurementTransaction[]) => void,
    filters?: { centreId?: string; farmerId?: string; status?: TransactionStatus }
  ): Unsubscribe {
    const mockTxs = generateMockTransactions();
    if (!isFirebaseConfigured() || !db) {
      let filtered = mockTxs;
      if (filters?.centreId) filtered = filtered.filter((t) => t.centreId === filters.centreId);
      if (filters?.farmerId) filtered = filtered.filter((t) => t.farmerId === filters.farmerId);
      if (filters?.status) filtered = filtered.filter((t) => t.status === filters.status);
      callback(filtered);
      return () => {};
    }

    try {
      let q = query(collection(db, COLLECTIONS.TRANSACTIONS));

      if (filters?.centreId) {
        q = query(q, where('centreId', '==', filters.centreId));
      }
      if (filters?.farmerId) {
        q = query(q, where('farmerId', '==', filters.farmerId));
      }
      if (filters?.status) {
        q = query(q, where('status', '==', filters.status));
      }

      return onSnapshot(
        q,
        (snap) => {
          if (snap.empty) {
            callback(mockTxs);
            return;
          }
          const items = snap.docs.map((d) => ({ id: d.id, ...d.data() } as ProcurementTransaction));
          callback(items);
        },
        (error) => {
          console.warn('[Firestore] Error subscribing to transactions:', error);
          callback(mockTxs);
        }
      );
    } catch (e) {
      console.warn('[Firestore] Query creation error:', e);
      callback(mockTxs);
      return () => {};
    }
  },

  /**
   * Listen to active queue for a specific Mandi centre
   */
  subscribeCentreQueue(
    centreId: string,
    callback: (queue: ProcurementTransaction[]) => void
  ): Unsubscribe {
    if (!isFirebaseConfigured() || !db) {
      const mockTxs = generateMockTransactions();
      const queue = mockTxs
        .filter((t) => t.centreId === centreId)
        .sort((a, b) => (a.tokenNumber || 0) - (b.tokenNumber || 0));
      callback(queue);
      return () => {};
    }

    const queueStatuses = [
      TransactionStatus.CHECKED_IN,
      TransactionStatus.WEIGHING,
      TransactionStatus.QUALITY_CHECK,
      TransactionStatus.PROCUREMENT_COMPLETED,
    ];

    const q = query(
      collection(db, COLLECTIONS.TRANSACTIONS),
      where('centreId', '==', centreId)
    );

    return onSnapshot(
      q,
      (snap) => {
        const items = snap.docs
          .map((d) => ({ id: d.id, ...d.data() } as ProcurementTransaction))
          .filter((t) => queueStatuses.includes(t.status))
          .sort((a, b) => (a.tokenNumber || 0) - (b.tokenNumber || 0));
        callback(items);
      },
      (error) => {
        console.warn(`[Firestore] Error subscribing to queue for ${centreId}:`, error);
      }
    );
  },

  /**
   * Create a new procurement transaction (booking)
   */
  async createTransaction(tx: Partial<ProcurementTransaction>): Promise<ProcurementTransaction> {
    const id = tx.id || `KM-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`;
    const now = new Date().toISOString();

    const initialHistoryEntry: StatusHistoryEntry = {
      status: tx.status || TransactionStatus.BOOKED,
      timestamp: now,
      updatedBy: tx.farmerId || 'SYSTEM',
      notes: 'Initial booking created',
    };

    const newTx: ProcurementTransaction = {
      id,
      farmerId: tx.farmerId || 'F-001',
      farmerName: tx.farmerName || 'Kisan Kumar',
      farmerPhone: tx.farmerPhone || '9876543210',
      centreId: tx.centreId || 'C-001',
      centreName: tx.centreName || 'Demo Krishi Upaj Mandi, Bhopal',
      crop: tx.crop || ('' as any),
      expectedQuantity: tx.expectedQuantity || 10,
      bookingDate: tx.bookingDate || now.split('T')[0],
      slotLabel: tx.slotLabel || 'Morning (09:00 - 12:00)',
      tokenNumber: tx.tokenNumber || Math.floor(10 + Math.random() * 90),
      status: tx.status || TransactionStatus.BOOKED,
      statusHistory: [initialHistoryEntry],
      queuePosition: tx.queuePosition ?? 1,
      estimatedWaitMinutes: tx.estimatedWaitMinutes ?? 15,
      recommendedArrivalTime: tx.recommendedArrivalTime || now,
      weighing: null,
      qualityCheck: null,
      procurementAmount: null,
      payment: null,
      exceptions: [],
      createdAt: now,
      updatedAt: now,
      ...tx,
    };

    if (isFirebaseConfigured() && db) {
      try {
        await setDoc(doc(db, COLLECTIONS.TRANSACTIONS, id), sanitizeForFirestore(newTx));
      } catch (e) {
        console.warn('[Firestore] Failed to persist transaction to Firestore:', e);
      }
    }

    return newTx;
  },

  /**
   * Update transaction details
   */
  async updateTransaction(id: string, updates: Partial<ProcurementTransaction>): Promise<void> {
    if (!isFirebaseConfigured() || !db) return;

    try {
      const ref = doc(db, COLLECTIONS.TRANSACTIONS, id);
      await updateDoc(ref, sanitizeForFirestore({
        ...updates,
        updatedAt: new Date().toISOString(),
      }));
    } catch (e) {
      console.warn(`[Firestore] Error updating transaction ${id}:`, e);
    }
  },

  /**
   * Transition transaction status with audit trail
   */
  async updateTransactionStatus(
    id: string,
    newStatus: TransactionStatus,
    updatedBy: string,
    notes?: string
  ): Promise<void> {
    if (!isFirebaseConfigured() || !db) return;

    try {
      const ref = doc(db, COLLECTIONS.TRANSACTIONS, id);
      const snap = await getDoc(ref);

      if (!snap.exists()) return;

      const tx = snap.data() as ProcurementTransaction;
      const historyEntry: StatusHistoryEntry = {
        status: newStatus,
        timestamp: new Date().toISOString(),
        updatedBy,
        notes: notes || `Transitioned to ${newStatus}`,
      };

      const updatedHistory = [...(tx.statusHistory || []), historyEntry];

      await updateDoc(ref, sanitizeForFirestore({
        status: newStatus,
        statusHistory: updatedHistory,
        updatedAt: new Date().toISOString(),
      }));
    } catch (e) {
      console.warn(`[Firestore] Error transitioning status for ${id}:`, e);
    }
  },

  // ==========================================
  // DATABASE SEEDING UTILITY
  // ==========================================

  /**
   * Seeds initial Centres, Farmers, and sample Transactions into Cloud Firestore.
   */
  async seedFirestoreData(force = false): Promise<{ success: boolean; message: string }> {
    if (!isFirebaseConfigured() || !db) {
      return {
        success: false,
        message: 'Firebase configuration is missing in .env.',
      };
    }

    try {
      // Auto-authenticate anonymously if not logged in yet
      if (auth && !auth.currentUser) {
        try {
          const { signInAnonymously } = await import('firebase/auth');
          await signInAnonymously(auth);
        } catch (authErr) {
          console.warn('[Firestore] Anonymous auth before seed:', authErr);
        }
      }

      // Check if already seeded (catch read permissions gracefully)
      try {
        const existingCentres = await getDocs(collection(db, COLLECTIONS.CENTRES));
        if (!existingCentres.empty && !force) {
          return {
            success: true,
            message: `Cloud Firestore is already populated with ${existingCentres.size} centres!`,
          };
        }
      } catch (readErr) {
        console.warn('[Firestore] Read check error:', readErr);
      }

      const batch = writeBatch(db);

      // 1. Seed Centres
      for (const centre of MOCK_CENTRES) {
        const ref = doc(db, COLLECTIONS.CENTRES, centre.id);
        batch.set(ref, sanitizeForFirestore(centre));
      }

      // 2. Seed Farmers
      for (const farmer of MOCK_FARMERS) {
        const ref = doc(db, COLLECTIONS.FARMERS, farmer.id);
        batch.set(ref, sanitizeForFirestore(farmer));
      }

      // 3. Seed Mock Transactions
      const initialTransactions = generateMockTransactions();
      for (const tx of initialTransactions) {
        const ref = doc(db, COLLECTIONS.TRANSACTIONS, tx.id);
        batch.set(ref, sanitizeForFirestore(tx));
      }

      await batch.commit();
      return {
        success: true,
        message: `Successfully seeded Cloud Firestore with ${MOCK_CENTRES.length} centres, ${MOCK_FARMERS.length} farmers, and ${initialTransactions.length} transactions! 🎉`,
      };
    } catch (error: any) {
      console.error('[Firestore] Seeding failed:', error);
      const code = error?.code || '';
      const msg = error?.message || String(error);

      if (code.includes('permission-denied') || msg.includes('permission') || msg.includes('Missing or insufficient')) {
        return {
          success: false,
          message: 'Firestore Security Rules blocked write. In Firebase Console > Firestore Database > Rules, change to "allow read, write: if true;" and click Publish.',
        };
      }
      if (code.includes('not-found') || msg.includes('database') || msg.includes('does not exist')) {
        return {
          success: false,
          message: 'Firestore Database is not yet created in your Firebase Console. Go to Build > Firestore Database > Create Database.',
        };
      }
      return {
        success: false,
        message: `Firestore Notice: ${msg}`,
      };
    }
  },
};
