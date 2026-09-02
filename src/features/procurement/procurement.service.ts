import { apiClient } from '../../services/api/client';
import { ENDPOINTS } from '../../services/api/endpoints';
import { ProcurementTransaction, TransactionStatus } from './procurement.types';
import { TransactionStateMachine } from './procurement.state-machine';

export const ProcurementService = {
  async advanceTransaction(transaction: ProcurementTransaction, nextStatus: TransactionStatus): Promise<ProcurementTransaction> {
    const updatedTransaction = TransactionStateMachine.transition(transaction, nextStatus);
    await apiClient.post(ENDPOINTS.TRANSACTION_UPDATE, updatedTransaction);
    return updatedTransaction;
  }
};
