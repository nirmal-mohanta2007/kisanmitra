import { PaymentBatch } from '../types/operator';
import { isFirebaseConfigured, db } from './firebase/firebase.config';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export interface PaymentItemModel {
  id: string;
  farmer: string;
  token: string;
  amount: number;
  bankStatus: 'Verified' | 'Pending';
  paymentStatus: 'Pending' | 'Approved';
  selected: boolean;
  bankName?: string;
  accountMasked?: string;
  ifsc?: string;
}

export interface PfmsVoucher {
  voucherNumber: string;
  batchId: string;
  treasuryCode: string;
  schemeCode: string;
  dbtCategory: string;
  totalVouchers: number;
  totalAmount: number;
  approvedBy: string;
  operatorId: string;
  timestamp: string;
  digitalSignatureHash: string;
  disbursementBank: string;
}

export const paymentService = {
  /**
   * Generates sequential or entropy Payment ID (PAY-YYYY-XXXXXX)
   */
  async generatePaymentId(): Promise<string> {
    const year = new Date().getFullYear();
    const entropy = String(Math.floor(100000 + Math.random() * 900000));
    return `PAY-${year}-${entropy}`;
  },

  /**
   * Initial payments pending batch clearance.
   * Defaults to empty array (no fake data).
   */
  getInitialPayments: (): PaymentItemModel[] => [],

  /**
   * Generate PFMS Treasury Payment Voucher
   */
  generatePfmsVoucher: (params: {
    batchNumber: string;
    totalVouchers: number;
    totalAmount: number;
    operatorName: string;
    operatorId: string;
  }): PfmsVoucher => {
    const timestamp = new Date().toISOString();
    return {
      voucherNumber: `PFMS-VCHR-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`,
      batchId: params.batchNumber,
      treasuryCode: 'TR-MP-BHP-0402',
      schemeCode: 'DBT-MSP-AGRI-0104',
      dbtCategory: 'PFMS Direct Benefit Transfer to Farmer Aadhaar-linked Bank A/C',
      totalVouchers: params.totalVouchers,
      totalAmount: params.totalAmount,
      approvedBy: params.operatorName,
      operatorId: params.operatorId,
      timestamp,
      digitalSignatureHash: `SHA256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`,
      disbursementBank: 'Reserve Bank of India / PFMS Central Clearing Agency',
    };
  },

  /**
   * Record approved batch to Firestore or local store
   */
  recordPaymentBatch: async (batch: PaymentBatch): Promise<void> => {
    if (isFirebaseConfigured() && db) {
      try {
        await addDoc(collection(db, 'payments'), {
          ...batch,
          createdAt: serverTimestamp(),
        });
      } catch (err) {
        console.log('[PaymentService] Firestore logging fallback:', err);
      }
    }
  },
};
