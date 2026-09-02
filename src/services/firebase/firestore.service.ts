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
import { db, isFirebaseConfigured } from './firebase.config';
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
};

export const FirestoreService = {
  // ==========================================
  // CENTRES / MANDIS
  // ==========================================

  /**
   * Fetch all procurement centres
   */
  async getCentres(): Promise<Centre[]> {
    if (!isFirebaseConfigured() || !db) {
      return MOCK_CENTRES;
    }
    try {
      const snap = await getDocs(collection(db, COLLECTIONS.CENTRES));
      if (snap.empty) return MOCK_CENTRES;
      return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Centre));
    } catch (e) {
      console.warn('[Firestore] Error fetching centres, fallback to mock:', e);
      return MOCK_CENTRES;
    }
  },

  /**
   * Subscribe to real-time updates for procurement centres
   */
  subscribeCentres(callback: (centres: Centre[]) => void): Unsubscribe {
    if (!isFirebaseConfigured() || !db) {
      callback(MOCK_CENTRES);
      return () => {};
    }
    const q = collection(db, COLLECTIONS.CENTRES);
    return onSnapshot(
      q,
      (snap) => {
        if (snap.empty) {
          callback(MOCK_CENTRES);
        } else {
          const items = snap.docs.map((d) => ({ id: d.id, ...d.data() } as Centre));
          callback(items);
        }
      },
      (error) => {
        console.warn('[Firestore] Error in centres subscription:', error);
        callback(MOCK_CENTRES);
      }
    );
  },

  /**
   * Update centre delay, capacity, or operating hours
   */
  async updateCentre(centreId: string, updates: Partial<Centre>): Promise<void> {
    if (!isFirebaseConfigured() || !db) return;
    const ref = doc(db, COLLECTIONS.CENTRES, centreId);
    await updateDoc(ref, {
      ...updates,
      updatedAt: serverTimestamp(),
    });
  },

  // ==========================================
  // FARMERS
  // ==========================================

  /**
   * Fetch all registered farmers
   */
  async getFarmers(): Promise<Farmer[]> {
    if (!isFirebaseConfigured() || !db) {
      return MOCK_FARMERS;
    }
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
   * Save or update farmer profile
   */
  async saveFarmer(farmer: Farmer): Promise<void> {
    if (!isFirebaseConfigured() || !db) return;
    const ref = doc(db, COLLECTIONS.FARMERS, farmer.id);
    await setDoc(ref, {
      ...farmer,
      updatedAt: serverTimestamp(),
    }, { merge: true });
  },

  // ==========================================
  // TRANSACTIONS & LIVE QUEUE
  // ==========================================

  /**
   * Fetch all procurement transactions
   */
  async getTransactions(): Promise<ProcurementTransaction[]> {
    if (!isFirebaseConfigured() || !db) {
      return generateMockTransactions();
    }
    try {
      const snap = await getDocs(collection(db, COLLECTIONS.TRANSACTIONS));
      if (snap.empty) return generateMockTransactions();
      return snap.docs.map((d) => ({ id: d.id, ...d.data() } as ProcurementTransaction));
    } catch (e) {
      console.warn('[Firestore] Error fetching transactions:', e);
      return generateMockTransactions();
    }
  },

  /**
   * Subscribe to all transactions in real time
   */
  subscribeTransactions(callback: (txs: ProcurementTransaction[]) => void): Unsubscribe {
    if (!isFirebaseConfigured() || !db) {
      callback(generateMockTransactions());
      return () => {};
    }
    const q = collection(db, COLLECTIONS.TRANSACTIONS);
    return onSnapshot(
      q,
      (snap) => {
        if (snap.empty) {
          callback(generateMockTransactions());
        } else {
          const items = snap.docs.map((d) => ({ id: d.id, ...d.data() } as ProcurementTransaction));
          callback(items);
        }
      },
      (error) => {
        console.warn('[Firestore] Error subscribing to transactions:', error);
      }
    );
  },

  /**
   * Subscribe to transactions for a specific farmer
   */
  subscribeFarmerTransactions(
    farmerId: string,
    callback: (txs: ProcurementTransaction[]) => void
  ): Unsubscribe {
    if (!isFirebaseConfigured() || !db) {
      const all = generateMockTransactions();
      callback(all.filter((t) => t.farmerId === farmerId));
      return () => {};
    }
    const q = query(
      collection(db, COLLECTIONS.TRANSACTIONS),
      where('farmerId', '==', farmerId)
    );
    return onSnapshot(
      q,
      (snap) => {
        const items = snap.docs.map((d) => ({ id: d.id, ...d.data() } as ProcurementTransaction));
        callback(items);
      },
      (error) => {
        console.warn(`[Firestore] Error subscribing to farmer transactions for ${farmerId}:`, error);
      }
    );
  },

  /**
   * Subscribe to real-time live queue for a specific centre
   */
  subscribeCentreQueue(
    centreId: string,
    callback: (queue: ProcurementTransaction[]) => void
  ): Unsubscribe {
    if (!isFirebaseConfigured() || !db) {
      const all = generateMockTransactions();
      const queueStatuses = [
        TransactionStatus.BOOKED,
        TransactionStatus.CHECKED_IN,
        TransactionStatus.WAITING,
        TransactionStatus.WEIGHING,
        TransactionStatus.QUALITY_CHECK,
      ];
      callback(
        all
          .filter((t) => t.centreId === centreId && queueStatuses.includes(t.status))
          .sort((a, b) => a.tokenNumber - b.tokenNumber)
      );
      return () => {};
    }

    const q = query(
      collection(db, COLLECTIONS.TRANSACTIONS),
      where('centreId', '==', centreId)
    );

    return onSnapshot(
      q,
      (snap) => {
        const queueStatuses = [
          TransactionStatus.BOOKED,
          TransactionStatus.CHECKED_IN,
          TransactionStatus.WAITING,
          TransactionStatus.WEIGHING,
          TransactionStatus.QUALITY_CHECK,
        ];
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
        await setDoc(doc(db, COLLECTIONS.TRANSACTIONS, id), newTx);
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
      await updateDoc(ref, {
        ...updates,
        updatedAt: new Date().toISOString(),
      });
    } catch (e) {
      console.warn(`[Firestore] Error updating transaction ${id}:`, e);
    }
  },

  /**
   * Advance transaction status with a history audit record
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

      await updateDoc(ref, {
        status: newStatus,
        statusHistory: updatedHistory,
        updatedAt: new Date().toISOString(),
      });
    } catch (e) {
      console.warn(`[Firestore] Error transitioning status for ${id}:`, e);
    }
  },

  // ==========================================
  // DATABASE SEEDING UTILITY
  // ==========================================

  /**
   * Seeds initial Centres, Farmers, and sample Transactions into Cloud Firestore.
   * Safe: will not overwrite unless force is true.
   */
  async seedFirestoreData(force = false): Promise<{ success: boolean; message: string }> {
    if (!isFirebaseConfigured() || !db) {
      return {
        success: false,
        message: 'Firebase is not configured. Please add your credentials in .env first.',
      };
    }

    try {
      // Check if already seeded
      const existingCentres = await getDocs(collection(db, COLLECTIONS.CENTRES));
      if (!existingCentres.empty && !force) {
        return {
          success: true,
          message: `Database already populated with ${existingCentres.size} centres. Skipping seeding.`,
        };
      }

      const batch = writeBatch(db);

      // 1. Seed Centres
      for (const centre of MOCK_CENTRES) {
        const ref = doc(db, COLLECTIONS.CENTRES, centre.id);
        batch.set(ref, centre);
      }

      // 2. Seed Farmers
      for (const farmer of MOCK_FARMERS) {
        const ref = doc(db, COLLECTIONS.FARMERS, farmer.id);
        batch.set(ref, farmer);
      }

      // 3. Seed Mock Transactions
      const initialTransactions = generateMockTransactions();
      for (const tx of initialTransactions) {
        const ref = doc(db, COLLECTIONS.TRANSACTIONS, tx.id);
        batch.set(ref, tx);
      }

      await batch.commit();
      return {
        success: true,
        message: `Successfully seeded Firestore with ${MOCK_CENTRES.length} centres, ${MOCK_FARMERS.length} farmers, and ${initialTransactions.length} transactions!`,
      };
    } catch (error: any) {
      console.error('[Firestore] Seeding failed:', error);
      return {
        success: false,
        message: `Seeding failed: ${error?.message || error}`,
      };
    }
  },
};
