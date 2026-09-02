import { create } from 'zustand';
import { ProcurementTransaction, TransactionStatus } from '../features/procurement/procurement.types';
import { ProcurementService } from '../features/procurement/procurement.service';

interface TransactionStore {
  activeTransaction: ProcurementTransaction | null;
  isLoading: boolean;
  setActiveTransaction: (transaction: ProcurementTransaction | null) => void;
  advanceStatus: (nextStatus: TransactionStatus) => Promise<void>;
}

export const useTransactionStore = create<TransactionStore>((set, get) => ({
  activeTransaction: null,
  isLoading: false,
  setActiveTransaction: (transaction) => set({ activeTransaction: transaction }),
  
  advanceStatus: async (nextStatus) => {
    const currentTx = get().activeTransaction;
    if (!currentTx) return;
    
    set({ isLoading: true });
    try {
      const updatedTx = await ProcurementService.advanceTransaction(currentTx, nextStatus);
      set({ activeTransaction: updatedTx, isLoading: false });
    } catch (e) {
      set({ isLoading: false });
      throw e;
    }
  }
}));
