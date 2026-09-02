export interface WeighmentRecord {
  id?: string;
  transactionId?: string;
  grossWeightKg?: number;
  tareWeightKg?: number;
  netWeightKg?: number;
  grossWeight?: number;
  tareWeight?: number;
  netWeight?: number;
  unit?: 'quintal';
  bagsCount?: number;
  operatorId?: string;
  recordedBy?: string;
  deviceIdentifier?: string;
  timestamp: string;
}

export type WeighmentLog = WeighmentRecord;

export interface QualityCheck {
  id?: string;
  transactionId?: string;
  grade?: string;
  moistureContentPercent?: number;
  moisturePercent?: number;
  moistureContent?: number;
  foreignMatterPercent?: number;
  foreignMatter?: number;
  isAccepted?: boolean;
  observations?: string;
  remarks?: string;
  operatorId?: string;
  inspectorId?: string;
  checkedBy?: string;
  timestamp?: string;
}

export type QualityRecord = QualityCheck;

export interface ProcurementSummary {
  finalQuantityQtl?: number;
  mspRatePerQtl?: number;
  totalValue?: number;
  receiptNumber?: string;
  generatedAt?: string;
}
