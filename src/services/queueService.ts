import { QueueEvent, MandiLane } from '../types/operator';
import { speechService } from './speech.service';
import { isFirebaseConfigured, db } from './firebase/firebase.config';
import {
  collection,
  doc,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  addDoc,
  serverTimestamp,
  onSnapshot,
  Unsubscribe,
} from 'firebase/firestore';
import { TransactionStatus } from '../types/enums';
import { ProcurementTransaction } from '../types/models';

export interface QueueItemData {
  position: number;
  token: string;
  farmer: string;
  farmerId?: string;
  crop: string;
  quantity: string;
  waitTime: string;
  status: string;
  lane?: string;
  transactionId?: string;
}

export const queueService = {
  /**
   * Broadcast token announcement via text-to-speech
   */
  announceToken: async (token: string, farmer: string, lane: string): Promise<void> => {
    const text = `ध्यान दें: टोकन नंबर ${token}, किसान ${farmer}, कृपया लेन नंबर ${lane} पर पधारें। Attention: Token ${token}, farmer ${farmer}, please report to ${lane}.`;
    speechService.speak(text, `token-announce-${token}`, 'hi');
  },

  /**
   * Log queue event to Firestore (`queueEvents/{eventId}`)
   */
  logQueueEvent: async (event: Omit<QueueEvent, 'id' | 'timestamp'>): Promise<QueueEvent> => {
    const timestamp = new Date().toISOString();
    const eventId = `QUEUE-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`;
    const eventRecord: QueueEvent = {
      ...event,
      id: eventId,
      timestamp,
    };

    if (isFirebaseConfigured() && db) {
      try {
        await addDoc(collection(db, 'queueEvents'), {
          ...eventRecord,
          eventId,
          createdAt: serverTimestamp(),
        });
      } catch (err) {
        console.log('[QueueService] Firestore logging fallback:', err);
      }
    }

    return eventRecord;
  },

  /**
   * Real-time subscription to active queue from Firestore transactions.
   * Filters by CHECKED_IN, WAITING, WEIGHING, QUALITY_CHECK.
   * Returns empty array if no transactions are in the queue.
   */
  subscribeActiveQueue(
    centreId: string,
    callback: (queue: QueueItemData[]) => void
  ): Unsubscribe {
    if (!isFirebaseConfigured() || !db) {
      callback([]);
      return () => {};
    }

    try {
      const activeStatuses = [
        TransactionStatus.BOOKED,
        TransactionStatus.CHECKED_IN,
        TransactionStatus.WAITING,
        TransactionStatus.WEIGHING,
        TransactionStatus.QUALITY_CHECK,
      ];

      const q = centreId
        ? query(collection(db, 'transactions'), where('centreId', '==', centreId), limit(50))
        : query(collection(db, 'transactions'), limit(50));

      return onSnapshot(
        q,
        (snap) => {
          if (snap.empty) {
            callback([]);
            return;
          }

          const docs = snap.docs.map((d) => ({ id: d.id, ...d.data() } as ProcurementTransaction));
          const filtered = docs
            .filter((t) => activeStatuses.includes(t.status))
            .sort((a, b) => (a.tokenNumber || 0) - (b.tokenNumber || 0));

          const queueItems: QueueItemData[] = filtered.map((t, idx) => ({
            position: idx + 1,
            token: `T-${t.tokenNumber || (idx + 101)}`,
            farmer: t.farmerName || 'Registered Farmer',
            farmerId: t.farmerId,
            crop: typeof t.crop === 'string' ? t.crop : t.crop?.name || 'Wheat',
            quantity: `${t.expectedQuantity || t.actualQuantity || 20} Q`,
            waitTime: `${Math.max(5, (idx + 1) * 4)} min`,
            status: t.status === TransactionStatus.CHECKED_IN ? 'Checked In' : 'Waiting',
            lane: undefined,
            transactionId: t.transactionId || t.id,
          }));

          callback(queueItems);
        },
        (err) => {
          console.error('[queueService] subscribeActiveQueue error:', err);
          callback([]);
        }
      );
    } catch (err) {
      console.error('[queueService] Query setup error:', err);
      callback([]);
      return () => {};
    }
  },

  /**
   * Clean initial queue data for mandi gate.
   * Does NOT populate fake names. Production begins with real data or empty list.
   */
  getInitialQueue: (): QueueItemData[] => [],

  /**
   * Initial lane statuses without fake farmers.
   */
  getInitialLanes: (): MandiLane[] => [
    { id: 'L-1', laneNumber: 1, laneLabel: 'Lane 1', status: 'Available', lastUpdated: 'Ready' },
    { id: 'L-2', laneNumber: 2, laneLabel: 'Lane 2', status: 'Available', lastUpdated: 'Ready' },
    { id: 'L-3', laneNumber: 3, laneLabel: 'Lane 3', status: 'Available', lastUpdated: 'Ready' },
    { id: 'L-4', laneNumber: 4, laneLabel: 'Lane 4', status: 'Available', lastUpdated: 'Ready' },
  ],
};
