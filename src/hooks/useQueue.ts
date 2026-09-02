import { useQueueStore } from '../features/queue/queue.store';

export const useQueue = () => {
  const { status, isLoading, refreshStatus } = useQueueStore();
  
  return {
    status,
    isLoading,
    refreshStatus
  };
};
