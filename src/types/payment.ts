export type PaymentStatus = 'PENDING' | 'INITIATED' | 'PROCESSING' | 'COMPLETED' | 'SUCCESS' | 'FAILED';
export type PaymentMethod = 'DBT' | 'NEFT' | 'UPI' | 'BANK_TRANSFER';

export interface PaymentRecord {
  id: string;
  transactionId: string;
  farmerId?: string;
  amount: number;
  status: PaymentStatus | string;
  method?: PaymentMethod | string;
  referenceId?: string;
  referenceNumber?: string;
  bankName?: string;
  accountLastFour?: string;
  initiatedAt?: string;
  completedAt?: string;
  failureReason?: string;
}
