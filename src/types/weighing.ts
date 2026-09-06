export interface WeighbridgeReading {
  weighbridgeId: string;
  grossWeightKg: number;
  tareWeightKg: number;
  netWeightKg: number;
  netWeightQtl: number;
  vehicleNumber: string;
  timestamp: string;
  operatorId: string;
  isCalibrated: boolean;
}

export interface WeighingSlip {
  slipNumber: string;
  transactionId: string;
  token: string;
  farmerName: string;
  crop: string;
  vehicleNumber: string;
  weighbridgeId: string;
  grossWeightKg: number;
  tareWeightKg: number;
  netWeightKg: number;
  netWeightQtl: number;
  timeIn: string;
  timeOut: string;
  operatorName: string;
  notes?: string;
}

export interface WeighingValidationResult {
  isValid: boolean;
  errorMessage?: string;
  netWeightKg?: number;
  netWeightQtl?: number;
}
