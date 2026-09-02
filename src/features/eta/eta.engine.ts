import { ETA } from './eta.types';

export const ETAEngine = {
  calculateETA(tokensAhead: number, averageServiceTime: number, baseDelay: number = 0): ETA {
    const estimatedMinutes = (tokensAhead * averageServiceTime) + baseDelay;
    
    return {
      estimatedMinutes,
      formattedTime: `${estimatedMinutes} mins`,
      explanation: `${tokensAhead} farmers ahead x ${averageServiceTime} mins/farmer + ${baseDelay} mins delay.`
    };
  }
};
