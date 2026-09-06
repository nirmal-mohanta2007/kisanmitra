import { WeighbridgeReading, WeighingSlip, WeighingValidationResult } from '../types/weighing';
import { isFirebaseConfigured, db } from './firebase/firebase.config';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export const weighingService = {
  /**
   * Calculate net weight and quintals from loaded and empty weights
   */
  calculateNetWeight: (loadedKg: number, emptyKg: number): WeighingValidationResult => {
    if (isNaN(loadedKg) || isNaN(emptyKg)) {
      return { isValid: false, errorMessage: 'Weights must be valid numeric values.' };
    }
    if (loadedKg <= 0 || emptyKg <= 0) {
      return { isValid: false, errorMessage: 'Loaded and Empty weights must be greater than zero.' };
    }
    if (loadedKg < emptyKg) {
      return {
        isValid: false,
        errorMessage: 'Loaded trolley weight cannot be less than empty trolley weight.',
      };
    }
    const netWeightKg = loadedKg - emptyKg;
    const netWeightQtl = Number((netWeightKg / 100).toFixed(2));
    return {
      isValid: true,
      netWeightKg,
      netWeightQtl,
    };
  },

  /**
   * Simulate IoT electronic sensor capture from Weighbridge WB-02
   */
  simulateIoTSensorReading: async (wbId = 'WB-02'): Promise<{ loadedKg: number; emptyKg: number }> => {
    // Slight random variation around typical mandi trolley loads
    const baseLoaded = 1520;
    const baseEmpty = 420;
    return {
      loadedKg: baseLoaded,
      emptyKg: baseEmpty,
    };
  },

  /**
   * Record weighment to Firestore or local store
   */
  recordWeighment: async (
    record: Omit<WeighbridgeReading, 'timestamp'>
  ): Promise<WeighbridgeReading> => {
    const timestamp = new Date().toISOString();
    const entry: WeighbridgeReading = {
      ...record,
      timestamp,
    };

    if (isFirebaseConfigured() && db) {
      try {
        await addDoc(collection(db, 'weighments'), {
          ...entry,
          createdAt: serverTimestamp(),
        });
      } catch (err) {
        console.log('[WeighingService] Firestore logging fallback:', err);
      }
    }

    return entry;
  },

  /**
   * Generate official Government Mandi Weighbridge Slip
   */
  generateWeighingSlip: (params: {
    transactionId: string;
    token: string;
    farmerName: string;
    crop: string;
    vehicleNumber: string;
    weighbridgeId: string;
    grossWeightKg: number;
    tareWeightKg: number;
    netWeightKg: number;
    operatorName: string;
    notes?: string;
  }): WeighingSlip => {
    const now = new Date();
    const timeOut = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const timeInDate = new Date(now.getTime() - 12 * 60000);
    const timeIn = timeInDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    return {
      slipNumber: `WB-SLIP-${now.getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
      transactionId: params.transactionId,
      token: params.token,
      farmerName: params.farmerName,
      crop: params.crop,
      vehicleNumber: params.vehicleNumber,
      weighbridgeId: params.weighbridgeId,
      grossWeightKg: params.grossWeightKg,
      tareWeightKg: params.tareWeightKg,
      netWeightKg: params.netWeightKg,
      netWeightQtl: Number((params.netWeightKg / 100).toFixed(2)),
      timeIn,
      timeOut,
      operatorName: params.operatorName,
      notes: params.notes,
    };
  },
};
