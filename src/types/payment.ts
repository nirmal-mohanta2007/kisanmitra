export type PaymentStatus = 'PENDING' | 'INITIATED' | 'PROCESSING' | 'COMPLETED' | 'SUCCESS' | 'FAILED';
export type PaymentMethod = 'DBT' | 'NEFT' | 'UPI' | 'BANK_TRANSFER';

export type BankFailureReason =
  | 'INVALID_ACCOUNT'
  | 'INVALID_NAME'
  | 'ACCOUNT_CLOSED'
  | 'TRANSACTION_TIMEOUT'
  | 'OTHER';

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

export interface BankFailureStats {
  reason: BankFailureReason;
  label: string;
  labelHindi: string;
  count: number;
  amountLakh: number;
  amountCr: number;
  percentage: number;
  description: string;
  icon: string;
  color: string;
}

export interface CropSettlementStats {
  crop: string;
  cropHindi: string;
  icon: string;
  totalAmountCr: number;
  totalQuantityQtl: number;
  successPct: number;
  pendingPct: number;
  failedPct: number;
  successAmountCr: number;
  pendingAmountCr: number;
  failedAmountCr: number;
  totalFarmers: number;
}

export interface DbtSettlementSummary {
  totalPayableCr: number;
  paidAmountCr: number;
  pendingAmountCr: number;
  failedAmountCr: number;
  totalFarmers: number;
  paidFarmers: number;
  pendingFarmers: number;
  failedFarmers: number;
  overallSuccessPct: number;
  overallPendingPct: number;
  overallFailedPct: number;
  avgDisbursementTimeHours: number;
  pfmsGatewayHealth: 'OPERATIONAL' | 'DEGRADED' | 'MAINTENANCE';
}

export interface DetailedDbtRecord {
  id: string;
  farmerId: string;
  farmerName: string;
  farmerMobile: string;
  aadhaarMasked: string;
  mandiName: string;
  district: string;
  crop: string;
  cropHindi: string;
  quantityQtl: number;
  ratePerQtl: number;
  payableAmount: number;
  status: 'SUCCESS' | 'PENDING' | 'FAILED';
  bankName: string;
  accountMasked: string;
  ifscCode: string;
  utrNumber?: string;
  pfmsBatchId?: string;
  failureReason?: BankFailureReason;
  failureDetail?: string;
  initiatedAt: string;
  clearedAt?: string;
}
