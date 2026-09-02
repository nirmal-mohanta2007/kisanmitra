import { PaymentDetails, PaymentStatus } from './payment.types';
import { apiClient } from '../../services/api/client';

export const PaymentService = {
  calculateTotalAmount(mspPerQtl: number, netWeightQtl: number): number {
    return mspPerQtl * netWeightQtl;
  },

  async initiatePayment(details: PaymentDetails): Promise<PaymentStatus> {
    await apiClient.delay(1000);
    return {
      paymentId: `pay_${Date.now()}`,
      status: 'PROCESSING'
    };
  },
  
  async checkStatus(paymentId: string): Promise<PaymentStatus> {
    await apiClient.delay(500);
    return {
      paymentId,
      status: 'SUCCESS',
      processedAt: new Date().toISOString()
    };
  }
};
