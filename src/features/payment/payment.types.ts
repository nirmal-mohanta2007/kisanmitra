export interface PaymentDetails {
  transactionId: string;
  amount: number;
  bankAccount: string;
  ifscCode: string;
}

export interface PaymentStatus {
  paymentId: string;
  status: 'PENDING' | 'PROCESSING' | 'SUCCESS' | 'FAILED';
  processedAt?: string;
}
