import { create } from 'zustand';
import { QueueStatus } from './queue.types';
import { QueueService } from './queue.service';

interface QueueStore {
  status: QueueStatus | null;
  isLoading: boolean;
  refreshStatus: (tokenId: string, mandiId: string) => Promise<void>;
}

export const useQueueStore = create<QueueStore>((set) => ({
  status: null,
  isLoading: false,
  refreshStatus: async (tokenId, mandiId) => {
    set({ isLoading: true });
    try {
      const status = await QueueService.getStatus(tokenId, mandiId);
      set({ status, isLoading: false });
    } catch (e) {
      set({ isLoading: false });
    }
  }
}));
