export type TransactionStatus = 
  | 'ENTRY'
  | 'WEIGHING'
  | 'QUALITY_CHECK'
  | 'PAYMENT_PENDING'
  | 'COMPLETED'
  | 'REJECTED';

export interface ProcurementTransaction {
  id: string;
  tokenId: string;
  farmerId: string;
  mandiId: string;
  status: TransactionStatus;
  weights?: {
    gross?: number;
    tare?: number;
    net?: number;
  };
  quality?: {
    grade: string;
    moisture: number;
    approved: boolean;
  };
  paymentInfo?: {
    amount: number;
    status: string;
  };
}
