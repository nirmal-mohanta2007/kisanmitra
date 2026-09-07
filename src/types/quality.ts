export type MSPGrade = 'Grade A' | 'Grade B' | 'Grade C' | 'Reject';

export interface QualityTestParameters {
  moisturePercent: number;
  impuritiesPercent: number;
  foreignMaterialPercent: number;
  damagedGrainPercent: number;
  remarks?: string;
}

export interface QualityLabResult {
  testId: string;
  transactionId: string;
  token: string;
  farmerName: string;
  crop: string;
  parameters: QualityTestParameters;
  certifiedGrade: MSPGrade;
  testedBy: string;
  timestamp: string;
  passed: boolean;
  mspEligibility: boolean;
  remarks?: string;
}

export interface QualityThresholds {
  crop: string;
  maxMoisturePercent: number;
  maxImpuritiesPercent: number;
  maxForeignMaterialPercent: number;
  maxDamagedGrainPercent: number;
}
