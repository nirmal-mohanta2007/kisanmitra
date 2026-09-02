import { MandiAnalytics } from './analytics.types';
import { apiClient } from '../../services/api/client';

export const AnalyticsService = {
  async getMandiAnalytics(mandiId: string): Promise<MandiAnalytics> {
    await apiClient.delay(1000);
    return {
      mandiId,
      totalProcurement: 15400,
      averageWaitTime: 45,
      qualityRejectionRate: 2.5
    };
  }
};
