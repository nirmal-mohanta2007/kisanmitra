import { collection, getDocs, query, where, Timestamp } from 'firebase/firestore';
import { db, isFirebaseConfigured } from './firebase/firebase.config';
import { TransactionStatus } from '../types/enums';
import { ProcurementTransaction } from '../types/models';

export interface DashboardMetrics {
  totalFarmers: number;
  activeFarmers: number;
  todayBookings: number;
  gateCheckIns: number;
  waitingInQueue: number;
  currentlyWeighing: number;
  completedToday: number;
  pendingPayments: number;
  totalProcuredQtl: number;
  totalProcuredMT: number;
}

export const adminService = {
  /**
   * Computes live aggregated metrics from Cloud Firestore collections.
   * Returns zeros if database is empty. Never returns fake numbers.
   */
  async getDashboardMetrics(): Promise<DashboardMetrics> {
    if (!isFirebaseConfigured() || !db) {
      return {
        totalFarmers: 0,
        activeFarmers: 0,
        todayBookings: 0,
        gateCheckIns: 0,
        waitingInQueue: 0,
        currentlyWeighing: 0,
        completedToday: 0,
        pendingPayments: 0,
        totalProcuredQtl: 0,
        totalProcuredMT: 0,
      };
    }

    try {
      // 1. Query Farmers
      const farmersSnap = await getDocs(collection(db, 'farmers'));
      const totalFarmers = farmersSnap.size;
      let activeFarmers = 0;
      farmersSnap.forEach((doc) => {
        const d = doc.data();
        if (d.status === 'active' || d.status === 'verified' || !d.status) {
          activeFarmers++;
        }
      });

      // 2. Query Transactions
      const transactionsSnap = await getDocs(collection(db, 'transactions'));
      let todayBookings = 0;
      let gateCheckIns = 0;
      let waitingInQueue = 0;
      let currentlyWeighing = 0;
      let completedToday = 0;
      let pendingPayments = 0;
      let totalProcuredQtl = 0;

      const todayStr = new Date().toISOString().split('T')[0];

      transactionsSnap.forEach((doc) => {
        const tx = doc.data() as ProcurementTransaction;
        const status = tx.status;
        const dateStr = (tx.bookingDate || tx.bookedDate || '').split('T')[0];

        if (dateStr === todayStr || tx.status === TransactionStatus.BOOKED) {
          todayBookings++;
        }

        if (status === TransactionStatus.CHECKED_IN) {
          gateCheckIns++;
          waitingInQueue++;
        } else if (status === TransactionStatus.WAITING) {
          waitingInQueue++;
        } else if (status === TransactionStatus.WEIGHING) {
          currentlyWeighing++;
        } else if (
          status === TransactionStatus.PROCUREMENT_COMPLETED ||
          (status as string) === 'COMPLETED'
        ) {
          completedToday++;
          const qty = Number(tx.actualQuantity || tx.quantity || tx.expectedQuantity || 0);
          totalProcuredQtl += qty;
        } else if (
          status === TransactionStatus.PAYMENT_INITIATED ||
          status === TransactionStatus.PAYMENT_PROCESSING
        ) {
          pendingPayments++;
        }
      });

      const totalProcuredMT = Number((totalProcuredQtl / 10).toFixed(2));

      return {
        totalFarmers,
        activeFarmers,
        todayBookings,
        gateCheckIns,
        waitingInQueue,
        currentlyWeighing,
        completedToday,
        pendingPayments,
        totalProcuredQtl,
        totalProcuredMT,
      };
    } catch (err) {
      console.error('[adminService] Error fetching dashboard metrics:', err);
      return {
        totalFarmers: 0,
        activeFarmers: 0,
        todayBookings: 0,
        gateCheckIns: 0,
        waitingInQueue: 0,
        currentlyWeighing: 0,
        completedToday: 0,
        pendingPayments: 0,
        totalProcuredQtl: 0,
        totalProcuredMT: 0,
      };
    }
  },
};
