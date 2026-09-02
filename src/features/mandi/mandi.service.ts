import { apiClient } from '../../services/api/client';
import { ENDPOINTS } from '../../services/api/endpoints';
import { Mandi } from './mandi.types';

export const MandiService = {
  async getMandis(): Promise<Mandi[]> {
    // Mock response
    await apiClient.get(ENDPOINTS.MANDI_LIST);
    return [
      {
        id: 'm1',
        name: 'APMC Azadpur',
        location: 'Delhi',
        capacity: 1000,
        currentLoad: 850,
        delays: 30,
        status: 'CONGESTED'
      },
      {
        id: 'm2',
        name: 'Karnal Mandi',
        location: 'Haryana',
        capacity: 500,
        currentLoad: 200,
        delays: 5,
        status: 'OPEN'
      }
    ];
  },
  
  async getMandiCapacity(mandiId: string): Promise<{ capacity: number, load: number }> {
    return { capacity: 1000, load: 850 };
  }
};
