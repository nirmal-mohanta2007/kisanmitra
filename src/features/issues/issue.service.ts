import { IssueTicket } from './issue.types';
import { apiClient } from '../../services/api/client';

export const IssueService = {
  async raiseTicket(data: Omit<IssueTicket, 'id' | 'status' | 'createdAt'>): Promise<IssueTicket> {
    await apiClient.delay(800);
    return {
      ...data,
      id: `iss_${Date.now()}`,
      status: 'OPEN',
      createdAt: new Date().toISOString()
    };
  },
  
  async resolveTicket(issueId: string): Promise<void> {
    await apiClient.delay(500);
  }
};
