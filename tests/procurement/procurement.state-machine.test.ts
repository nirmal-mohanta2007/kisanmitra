import { canTransition } from '../../src/state-machine/transaction-machine';
import { TransactionStatus } from '../../src/types/enums';

describe('Transaction State Machine', () => {
  it('should transition from BOOKED to CHECKED_IN', () => {
    const isValid = canTransition(TransactionStatus.BOOKED, TransactionStatus.CHECKED_IN);
    expect(isValid).toBe(true);
  });

  it('should fail on invalid transition', () => {
    const isValid = canTransition(TransactionStatus.BOOKED, TransactionStatus.PAYMENT_COMPLETED);
    expect(isValid).toBe(false);
  });
});
