import { TransactionStatus, ProcurementTransaction } from './procurement.types';

export const TransactionStateMachine = {
  allowedTransitions: {
    'ENTRY': ['WEIGHING', 'REJECTED'],
    'WEIGHING': ['QUALITY_CHECK', 'REJECTED'],
    'QUALITY_CHECK': ['PAYMENT_PENDING', 'REJECTED'],
    'PAYMENT_PENDING': ['COMPLETED', 'REJECTED'],
    'COMPLETED': [],
    'REJECTED': []
  } as Record<TransactionStatus, TransactionStatus[]>,

  canTransition(currentStatus: TransactionStatus, nextStatus: TransactionStatus): boolean {
    return this.allowedTransitions[currentStatus].includes(nextStatus);
  },

  transition(transaction: ProcurementTransaction, nextStatus: TransactionStatus): ProcurementTransaction {
    if (!this.canTransition(transaction.status, nextStatus)) {
      throw new Error(`Invalid transition from ${transaction.status} to ${nextStatus}`);
    }
    
    return {
      ...transaction,
      status: nextStatus
    };
  }
};
