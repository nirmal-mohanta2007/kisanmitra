import { ETAEngine } from '../../src/features/eta/eta.engine';

describe('ETA Engine', () => {
  it('should calculate ETA correctly based on tokens ahead', () => {
    const tokensAhead = 5;
    const avgServiceTime = 10;
    const currentDelay = 5;

    const expectedWaitTime = (5 * 10) + 5; 
    const result = ETAEngine.calculateETA(tokensAhead, avgServiceTime, currentDelay);

    expect(result.estimatedMinutes).toBe(expectedWaitTime);
  });

  it('should return current delay if no tokens ahead', () => {
    const result = ETAEngine.calculateETA(0, 10, 5);
    expect(result.estimatedMinutes).toBe(5);
  });
});
