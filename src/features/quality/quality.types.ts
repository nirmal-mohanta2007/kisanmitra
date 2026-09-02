export interface QualityMetrics {
  moistureContent: number; // percentage
  foreignMatter: number; // percentage
  damagedGrains: number; // percentage
}

export interface QualityResult {
  grade: 'A' | 'B' | 'C' | 'REJECTED';
  metrics: QualityMetrics;
  isApproved: boolean;
  remarks: string;
}
