import type { PaymentRecord } from '../../types';
import { mockTransactions } from './transactions';

export const mockPayments: PaymentRecord[] = mockTransactions
  .filter(t => ['PAYMENT_INITIATED', 'PAYMENT_PROCESSING', 'PAYMENT_COMPLETED'].includes(t.status))
  .map((t, index) => {
    const isCompleted = t.status === 'PAYMENT_COMPLETED';
    return {
      id: `pay_${index + 1}`,
      transactionId: t.id,
      farmerId: t.farmerId,
      amount: (t.actualQuantity || 0) * 2275, // Assuming MSP rate 2275 per quintal
      status: isCompleted ? 'SUCCESS' : (t.status === 'PAYMENT_PROCESSING' ? 'PROCESSING' : 'INITIATED'),
      referenceNumber: isCompleted ? `REF${Math.floor(Math.random() * 1000000000)}` : undefined,
      bankName: index % 2 === 0 ? 'State Bank of India' : 'HDFC Bank',
      accountLastFour: '1234',
      initiatedAt: t.createdAt,
      completedAt: isCompleted ? t.updatedAt : undefined,
    };
  });
