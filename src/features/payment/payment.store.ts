import { create } from 'zustand';
import { PaymentStatus, PaymentDetails } from './payment.types';
import { PaymentService } from './payment.service';

interface PaymentStore {
  status: PaymentStatus | null;
  isLoading: boolean;
  initiate: (details: PaymentDetails) => Promise<void>;
  check: (paymentId: string) => Promise<void>;
}

export const usePaymentStore = create<PaymentStore>((set) => ({
  status: null,
  isLoading: false,
  initiate: async (details) => {
    set({ isLoading: true });
    try {
      const status = await PaymentService.initiatePayment(details);
      set({ status, isLoading: false });
    } catch (e) {
      set({ isLoading: false });
    }
  },
  check: async (paymentId) => {
    set({ isLoading: true });
    try {
      const status = await PaymentService.checkStatus(paymentId);
      set({ status, isLoading: false });
    } catch (e) {
      set({ isLoading: false });
    }
  }
}));
