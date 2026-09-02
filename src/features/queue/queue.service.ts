import { apiClient } from '../../services/api/client';
import { ENDPOINTS } from '../../services/api/endpoints';
import { QueueStatus } from './queue.types';
import { QueueEngine } from './queue.engine';

export const QueueService = {
  async getStatus(tokenId: string, mandiId: string): Promise<QueueStatus> {
    await apiClient.get(ENDPOINTS.QUEUE_STATUS);
    // Mock implementation
    const mockQueue = ['TKN-1234', 'TKN-5678', tokenId, 'TKN-9999'];
    return QueueEngine.calculateMetrics(mockQueue, tokenId, 12);
  }
};
