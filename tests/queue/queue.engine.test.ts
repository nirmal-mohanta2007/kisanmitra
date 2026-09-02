import { QueueEngine } from '../../src/features/queue/queue.engine';

describe('Queue Engine', () => {
  it('should generate a valid sequential token', () => {
    const lastToken = 100;
    const newToken = QueueEngine.generateTokenNumber(lastToken);
    expect(newToken).toBe(101);
  });

  it('should calculate queue position correctly', () => {
    const currentTokenBeingServed = 50;
    const myToken = 55;
    const position = QueueEngine.calculateQueuePosition(myToken, currentTokenBeingServed);
    
    expect(position).toBe(5);
  });
});
