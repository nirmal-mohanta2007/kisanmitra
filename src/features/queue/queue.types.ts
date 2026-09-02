export interface QueueStatus {
  position: number;
  tokensAhead: number;
  averageServiceTime: number; // minutes
  totalQueueLength: number;
  currentProcessingToken: string;
}
