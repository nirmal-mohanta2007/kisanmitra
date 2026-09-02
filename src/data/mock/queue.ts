import type { QueueState } from '../../types';
import { mockMandis } from './mandis';
import { mockTransactions } from './transactions';

export const mockQueue: QueueState[] = mockMandis.map((mandi) => {
  const activeTxns = mockTransactions.filter(
    (t) => t.mandiId === mandi.id && 
    ['CHECKED_IN', 'WAITING', 'WEIGHING', 'QUALITY_CHECK', 'QUALITY_HOLD'].includes(t.status)
  );

  return {
    mandiId: mandi.id,
    currentServingToken: activeTxns.length > 0 ? activeTxns[0].tokenNumber || 0 : 0,
    waitingCount: activeTxns.filter(t => t.status === 'WAITING').length,
    activeTokens: activeTxns.map(t => t.tokenNumber).filter((n): n is number => n !== null),
    lastUpdatedAt: new Date().toISOString(),
  };
});
