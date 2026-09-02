import { TRANSACTION_STATUS, ALLOWED_TRANSITIONS } from '../constants/status';

export const generateToken = (counter: number): string => {
  const year = new Date().getFullYear();
  const paddedCounter = String(counter).padStart(5, '0');
  return `KM-${year}-${paddedCounter}`;
};

export const canTransition = (currentStatus: keyof typeof TRANSACTION_STATUS, nextStatus: keyof typeof TRANSACTION_STATUS): boolean => {
  const allowedNext = ALLOWED_TRANSITIONS[currentStatus] || [];
  return allowedNext.includes(nextStatus);
};
