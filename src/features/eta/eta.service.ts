import { ETAEngine } from './eta.engine';
import { QueueService } from '../queue/queue.service';
import { MandiService } from '../mandi/mandi.service';

export const ETAService = {
  async getETAForToken(tokenId: string, mandiId: string): Promise<string> {
    const queueStatus = await QueueService.getStatus(tokenId, mandiId);
    const mandiStatus = await MandiService.getMandis();
    const mandi = mandiStatus.find(m => m.id === mandiId);
    
    const baseDelay = mandi ? mandi.delays : 0;
    
    const eta = ETAEngine.calculateETA(
      queueStatus.tokensAhead,
      queueStatus.averageServiceTime,
      baseDelay
    );
    
    return eta.explanation;
  }
};
