export interface MandiAnalytics {
  mandiId: string;
  totalProcurement: number; // in quintals
  averageWaitTime: number; // in minutes
  qualityRejectionRate: number; // percentage
}
