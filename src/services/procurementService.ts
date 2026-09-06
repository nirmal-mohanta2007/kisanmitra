import { isFirebaseConfigured, db } from './firebase/firebase.config';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export interface ProcurementReceipt {
  receiptNumber: string;
  transactionId: string;
  token: string;
  farmerName: string;
  farmerId: string;
  crop: string;
  grade: string;
  netWeightKg: number;
  netWeightQtl: number;
  mspRatePerQtl: number;
  totalAmount: number;
  mandiName: string;
  mandiId: string;
  operatorName: string;
  operatorId: string;
  weighbridgeSlipNumber?: string;
  labCertificateId?: string;
  timestamp: string;
  paymentStatus: 'PAYMENT_INITIATED';
}

export const MSP_RATES: Record<string, number> = {
  Wheat: 2275,
  'Wheat (गेहूं)': 2275,
  Rice: 2183,
  'Rice (चावल)': 2183,
  Paddy: 2183,
  'Paddy (धान)': 2183,
  Maize: 2090,
  'Maize (मक्का)': 2090,
};

export const procurementService = {
  /**
   * Get government MSP procurement rate for crop
   */
  getMspRate: (crop: string): number => {
    return MSP_RATES[crop] || 2275;
  },

  /**
   * Calculate procurement order settlement total
   */
  calculateSettlement: (netWeightQtl: number, ratePerQtl: number): number => {
    return Math.round(netWeightQtl * ratePerQtl);
  },

  /**
   * Generate official Government Procurement Receipt
   */
  generateReceipt: (params: {
    transactionId: string;
    token: string;
    farmerName: string;
    farmerId: string;
    crop: string;
    grade: string;
    netWeightKg: number;
    netWeightQtl: number;
    mspRatePerQtl: number;
    totalAmount: number;
    mandiName: string;
    mandiId: string;
    operatorName: string;
    operatorId: string;
  }): ProcurementReceipt => {
    const timestamp = new Date().toISOString();
    const receiptNumber = `KM-RCP-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

    return {
      receiptNumber,
      transactionId: params.transactionId,
      token: params.token,
      farmerName: params.farmerName,
      farmerId: params.farmerId,
      crop: params.crop,
      grade: params.grade,
      netWeightKg: params.netWeightKg,
      netWeightQtl: params.netWeightQtl,
      mspRatePerQtl: params.mspRatePerQtl,
      totalAmount: params.totalAmount,
      mandiName: params.mandiName,
      mandiId: params.mandiId,
      operatorName: params.operatorName,
      operatorId: params.operatorId,
      timestamp,
      paymentStatus: 'PAYMENT_INITIATED',
    };
  },

  /**
   * Save procurement record to Firestore or local store
   */
  recordProcurement: async (receipt: ProcurementReceipt): Promise<void> => {
    if (isFirebaseConfigured() && db) {
      try {
        await addDoc(collection(db, 'procurements'), {
          ...receipt,
          createdAt: serverTimestamp(),
        });
        await addDoc(collection(db, 'receipts'), {
          ...receipt,
          createdAt: serverTimestamp(),
        });
      } catch (err) {
        console.log('[ProcurementService] Firestore logging fallback:', err);
      }
    }
  },
};
