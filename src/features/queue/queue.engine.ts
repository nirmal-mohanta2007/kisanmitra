import { QueueStatus } from './queue.types';

export const QueueEngine = {
  generateTokenNumber(lastToken: number): number {
    return lastToken + 1;
  },

  calculateQueuePosition(myToken: number, currentServingToken: number): number {
    return Math.max(0, myToken - currentServingToken);
  },

  calculatePosition(tokenId: string, queue: string[]): number {
    return queue.indexOf(tokenId) + 1;
  },

  calculateMetrics(queue: string[], currentTokenId: string, averageServiceTime: number = 10): QueueStatus {
    const position = this.calculatePosition(currentTokenId, queue);
    const tokensAhead = Math.max(0, position - 1);
    
    return {
      position,
      tokensAhead,
      averageServiceTime,
      totalQueueLength: queue.length,
      currentProcessingToken: queue[0] || ''
    };
  }
};
