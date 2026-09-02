import { usePaymentStore } from '../features/payment/payment.store';

export const usePayment = () => {
  const { status, isLoading, initiate, check } = usePaymentStore();
  
  return {
    status,
    isLoading,
    initiate,
    check
  };
};
