import * as transactionOperations from './transaction.service';
import { FirestoreService } from './firebase/firestore.service';
import { isFirebaseConfigured, db } from './firebase/firebase.config';
import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  query,
  where,
  orderBy,
  limit,
  addDoc,
  serverTimestamp,
  runTransaction,
  Unsubscribe,
} from 'firebase/firestore';
import { AuditLogEntry } from '../types/operator';
import { ProcurementTransaction, StatusHistoryEntry } from '../types/models';
import { TransactionStatus } from '../types/enums';

const TRANSACTIONS_COLLECTION = 'transactions';
const COUNTERS_COLLECTION = 'counters';

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

export const transactionService = {
  ...transactionOperations,

  /**
   * Generates a sequential Transaction ID (TXN-YYYY-XXXXXX).
   */
  async generateTransactionId(): Promise<string> {
    const currentYear = new Date().getFullYear();

    if (isFirebaseConfigured() && db) {
      try {
        const counterRef = doc(db, COUNTERS_COLLECTION, `transactions_${currentYear}`);
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
        return `TXN-${currentYear}-${padded}`;
      } catch (err) {
        console.warn('[transactionService] Counter transaction failed, using fallback:', err);
      }
    }

    const entropy = String(Math.floor(100000 + Math.random() * 900000));
    return `TXN-${currentYear}-${entropy}`;
  },

  /**
   * Create a new procurement transaction in Cloud Firestore.
   */
  async createTransaction(tx: Partial<ProcurementTransaction>): Promise<ProcurementTransaction> {
    const id = tx.transactionId || tx.id || (await this.generateTransactionId());
    return FirestoreService.createTransaction({
      ...tx,
      id,
      transactionId: id,
    });
  },

  /**
   * Get single transaction by ID (e.g. TXN-YYYY-XXXXXX). Returns null if not found.
   */
  async getTransactionById(id: string): Promise<ProcurementTransaction | null> {
    if (!id || !isFirebaseConfigured() || !db) return null;

    try {
      // 1. Direct doc lookup
      const snap = await getDoc(doc(db, TRANSACTIONS_COLLECTION, id));
      if (snap.exists()) {
        return { id: snap.id, transactionId: snap.id, ...snap.data() } as ProcurementTransaction;
      }

      // 2. Query where transactionId or id matches
      const q = query(
        collection(db, TRANSACTIONS_COLLECTION),
        where('transactionId', '==', id),
        limit(1)
      );
      const querySnap = await getDocs(q);
      if (!querySnap.empty) {
        const d = querySnap.docs[0];
        return { id: d.id, transactionId: d.id, ...d.data() } as ProcurementTransaction;
      }

      return null;
    } catch (err) {
      console.error(`[transactionService] Error fetching transaction ${id}:`, err);
      return null;
    }
  },

  /**
   * Fetch all transactions for a registered farmer.
   */
  async getTransactionsByFarmerId(farmerId: string): Promise<ProcurementTransaction[]> {
    if (!farmerId || !isFirebaseConfigured() || !db) return [];

    try {
      const q = query(
        collection(db, TRANSACTIONS_COLLECTION),
        where('farmerId', '==', farmerId),
        orderBy('createdAt', 'desc')
      );
      const snap = await getDocs(q);
      if (snap.empty) return [];
      return snap.docs.map(
        (d) => ({ id: d.id, transactionId: d.id, ...d.data() } as ProcurementTransaction)
      );
    } catch (err) {
      console.error(`[transactionService] Error fetching txs for farmer ${farmerId}:`, err);
      return [];
    }
  },

  /**
   * Fetch all transactions for a mandi.
   */
  async getTransactionsByMandi(mandiId: string): Promise<ProcurementTransaction[]> {
    if (!mandiId || !isFirebaseConfigured() || !db) return [];

    try {
      const q = query(
        collection(db, TRANSACTIONS_COLLECTION),
        where('mandiId', '==', mandiId),
        orderBy('createdAt', 'desc')
      );
      const snap = await getDocs(q);
      if (snap.empty) return [];
      return snap.docs.map(
        (d) => ({ id: d.id, transactionId: d.id, ...d.data() } as ProcurementTransaction)
      );
    } catch (err) {
      console.error(`[transactionService] Error fetching txs for mandi ${mandiId}:`, err);
      return [];
    }
  },

  /**
   * Fetch all transactions.
   */
  async getTransactions(limitCount = 50): Promise<ProcurementTransaction[]> {
    return FirestoreService.getTransactions();
  },

  /**
   * Subscribe to transactions with real-time updates.
   */
  subscribeTransactions(
    callback: (transactions: ProcurementTransaction[]) => void,
    filters?: { centreId?: string; farmerId?: string; status?: TransactionStatus }
  ): Unsubscribe {
    return FirestoreService.subscribeTransactions(callback, filters);
  },

  /**
   * Update transaction status with full audit history.
   */
  async updateTransactionStatus(
    id: string,
    newStatus: TransactionStatus,
    updatedBy: string,
    notes?: string
  ): Promise<void> {
    return FirestoreService.updateTransactionStatus(id, newStatus, updatedBy, notes);
  },

  /**
   * Log mandi operational audit entry
   */
  async logAuditTrail(entry: Omit<AuditLogEntry, 'id' | 'timestamp'>): Promise<AuditLogEntry> {
    const timestamp = new Date().toISOString();
    const log: AuditLogEntry = {
      ...entry,
      id: `AUDIT-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      timestamp,
    };

    if (isFirebaseConfigured() && db) {
      try {
        await addDoc(collection(db, 'auditLogs'), {
          ...log,
          createdAt: serverTimestamp(),
        });
      } catch (err) {
        console.log('[TransactionService] Firestore audit logging fallback:', err);
      }
    }

    return log;
  },
};

export default transactionService;
