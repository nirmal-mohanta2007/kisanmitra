import { useTransactionStore } from '../store/transaction.store';

export const useTransaction = () => {
  const { activeTransaction, isLoading, advanceStatus, setActiveTransaction } = useTransactionStore();
  
  return {
    activeTransaction,
    isLoading,
    advanceStatus,
    setActiveTransaction
  };
};
