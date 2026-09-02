import { Booking } from './booking';
import { WeighmentRecord, QualityCheck, ProcurementSummary } from './procurement';
import { PaymentRecord } from './payment';
import { TRANSACTION_STATUS } from '../constants/status';

export type TransactionStatus = keyof typeof TRANSACTION_STATUS;

export interface StatusHistoryEntry {
  status: TransactionStatus;
  timestamp: string;
  operatorId?: string;
  remarks?: string;
}

export interface Transaction {
  id: string;
  tokenId: string; // e.g., KM-2023-00001
  bookingDetails: Booking;
  status: TransactionStatus;
  statusHistory: StatusHistoryEntry[];
  weighment?: WeighmentRecord;
  quality?: QualityCheck;
  procurement?: ProcurementSummary;
  payment?: PaymentRecord;
  createdAt: string;
  updatedAt: string;
}
