import { WeighmentRecord } from '../types/models';
import { isFirebaseConfigured, db } from './firebase/firebase.config';
import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
  runTransaction,
} from 'firebase/firestore';

const WEIGHMENTS_COLLECTION = 'weighments';
const COUNTERS_COLLECTION = 'counters';

export const weighmentService = {
  /**
   * Generates sequential Weighment ID (WGH-XXXXXX)
   */
  async generateWeighmentId(): Promise<string> {
    if (isFirebaseConfigured() && db) {
      try {
        const counterRef = doc(db, COUNTERS_COLLECTION, 'weighments');
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
        return `WGH-${padded}`;
      } catch (err) {
        console.warn('[weighmentService] Counter error, using fallback:', err);
      }
    }

    return `WGH-${String(Math.floor(100000 + Math.random() * 900000))}`;
  },

  /**
   * Records a weighment document in Cloud Firestore (`weighments/{weighmentId}`)
   */
  async recordWeighment(record: Partial<WeighmentRecord>): Promise<WeighmentRecord> {
    const weighmentId = record.weighmentId || (await this.generateWeighmentId());
    const gross = Number(record.grossWeight || 0);
    const tare = Number(record.tareWeight || 0);
    const net = Math.max(0, gross - tare);

    const docData: WeighmentRecord = {
      weighmentId,
      transactionId: record.transactionId || '',
      farmerId: record.farmerId || '',
      grossWeight: gross,
      tareWeight: tare,
      netWeight: net,
      unit: record.unit || 'kg',
      operatorId: record.operatorId || 'OP-DEFAULT',
      createdAt: new Date().toISOString(),
      ...record,
    };

    if (isFirebaseConfigured() && db) {
      try {
        const ref = doc(db, WEIGHMENTS_COLLECTION, weighmentId);
        await setDoc(ref, {
          ...docData,
          createdAt: serverTimestamp(),
        });
      } catch (err) {
        console.error('[weighmentService] Error persisting weighment:', err);
      }
    }

    return docData;
  },

  /**
   * Retrieves weighment by transactionId
   */
  async getByTransactionId(transactionId: string): Promise<WeighmentRecord | null> {
    if (!transactionId || !isFirebaseConfigured() || !db) return null;

    try {
      const q = query(
        collection(db, WEIGHMENTS_COLLECTION),
        where('transactionId', '==', transactionId)
      );
      const snap = await getDocs(q);
      if (snap.empty) return null;
      const d = snap.docs[0];
      return { weighmentId: d.id, ...d.data() } as WeighmentRecord;
    } catch (err) {
      console.error('[weighmentService] Error getting weighment by tx:', err);
      return null;
    }
  },
};
