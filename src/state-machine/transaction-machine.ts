import { TransactionStatus } from '../types/enums';

export const ALLOWED_TRANSITIONS: Record<TransactionStatus, TransactionStatus[]> = {
  [TransactionStatus.BOOKED]: [TransactionStatus.CHECKED_IN, TransactionStatus.CANCELLED, TransactionStatus.MISSED],
  [TransactionStatus.CHECKED_IN]: [TransactionStatus.WAITING, TransactionStatus.CANCELLED],
  [TransactionStatus.WAITING]: [TransactionStatus.WEIGHING, TransactionStatus.CANCELLED],
  [TransactionStatus.WEIGHING]: [TransactionStatus.QUALITY_CHECK],
  [TransactionStatus.QUALITY_CHECK]: [TransactionStatus.PROCUREMENT_PENDING, TransactionStatus.QUALITY_HOLD],
  [TransactionStatus.QUALITY_HOLD]: [TransactionStatus.QUALITY_CHECK],
  [TransactionStatus.PROCUREMENT_PENDING]: [TransactionStatus.PROCUREMENT_COMPLETED, TransactionStatus.CANCELLED],
  [TransactionStatus.PROCUREMENT_COMPLETED]: [TransactionStatus.RECEIPT_GENERATED],
  [TransactionStatus.RECEIPT_GENERATED]: [TransactionStatus.PAYMENT_INITIATED],
  [TransactionStatus.PAYMENT_INITIATED]: [TransactionStatus.PAYMENT_PROCESSING],
  [TransactionStatus.PAYMENT_PROCESSING]: [TransactionStatus.PAYMENT_COMPLETED, TransactionStatus.PAYMENT_FAILED],
  [TransactionStatus.PAYMENT_FAILED]: [TransactionStatus.PAYMENT_INITIATED],
  [TransactionStatus.CANCELLED]: [],
  [TransactionStatus.MISSED]: [],
  [TransactionStatus.PAYMENT_COMPLETED]: [],
};

export function canTransition(from: TransactionStatus, to: TransactionStatus): boolean {
  return ALLOWED_TRANSITIONS[from]?.includes(to) ?? false;
}

export function getNextStatuses(current: TransactionStatus): TransactionStatus[] {
  return ALLOWED_TRANSITIONS[current] || [];
}

export function isTerminalStatus(status: TransactionStatus): boolean {
  return [
    TransactionStatus.PAYMENT_COMPLETED,
    TransactionStatus.CANCELLED,
    TransactionStatus.MISSED
  ].includes(status);
}

export function getStatusLabel(status: TransactionStatus): string {
  const labels: Record<TransactionStatus, string> = {
    [TransactionStatus.BOOKED]: 'Booked',
    [TransactionStatus.CHECKED_IN]: 'Checked In',
    [TransactionStatus.WAITING]: 'Waiting',
    [TransactionStatus.WEIGHING]: 'Weighing',
    [TransactionStatus.QUALITY_CHECK]: 'Quality Check',
    [TransactionStatus.QUALITY_HOLD]: 'Quality Hold',
    [TransactionStatus.PROCUREMENT_PENDING]: 'Procurement Pending',
    [TransactionStatus.PROCUREMENT_COMPLETED]: 'Procurement Completed',
    [TransactionStatus.RECEIPT_GENERATED]: 'Receipt Generated',
    [TransactionStatus.PAYMENT_INITIATED]: 'Payment Initiated',
    [TransactionStatus.PAYMENT_PROCESSING]: 'Payment Processing',
    [TransactionStatus.PAYMENT_COMPLETED]: 'Payment Completed',
    [TransactionStatus.PAYMENT_FAILED]: 'Payment Failed',
    [TransactionStatus.CANCELLED]: 'Cancelled',
    [TransactionStatus.MISSED]: 'Missed',
  };
  return labels[status] || status;
}

export function getStatusLabelHi(status: TransactionStatus): string {
  const labelsHi: Record<TransactionStatus, string> = {
    [TransactionStatus.BOOKED]: 'बुक किया गया',
    [TransactionStatus.CHECKED_IN]: 'चेक-इन हुआ',
    [TransactionStatus.WAITING]: 'प्रतीक्षा में',
    [TransactionStatus.WEIGHING]: 'तौल हो रही है',
    [TransactionStatus.QUALITY_CHECK]: 'गुणवत्ता जाँच',
    [TransactionStatus.QUALITY_HOLD]: 'गुणवत्ता रोक',
    [TransactionStatus.PROCUREMENT_PENDING]: 'खरीद लंबित',
    [TransactionStatus.PROCUREMENT_COMPLETED]: 'खरीद पूर्ण',
    [TransactionStatus.RECEIPT_GENERATED]: 'रसीद बनी',
    [TransactionStatus.PAYMENT_INITIATED]: 'भुगतान शुरू',
    [TransactionStatus.PAYMENT_PROCESSING]: 'भुगतान प्रक्रिया में',
    [TransactionStatus.PAYMENT_COMPLETED]: 'भुगतान पूर्ण',
    [TransactionStatus.PAYMENT_FAILED]: 'भुगतान विफल',
    [TransactionStatus.CANCELLED]: 'रद्द',
    [TransactionStatus.MISSED]: 'छूट गया',
  };
  return labelsHi[status] || status;
}

export function getStatusColor(status: TransactionStatus): string {
  const colors: Record<TransactionStatus, string> = {
    [TransactionStatus.BOOKED]: '#66BB6A',
    [TransactionStatus.CHECKED_IN]: '#43A047',
    [TransactionStatus.WAITING]: '#FFA726',
    [TransactionStatus.WEIGHING]: '#29B6F6',
    [TransactionStatus.QUALITY_CHECK]: '#AB47BC',
    [TransactionStatus.QUALITY_HOLD]: '#E65100',
    [TransactionStatus.PROCUREMENT_PENDING]: '#7E57C2',
    [TransactionStatus.PROCUREMENT_COMPLETED]: '#2E7D32',
    [TransactionStatus.RECEIPT_GENERATED]: '#1565C0',
    [TransactionStatus.PAYMENT_INITIATED]: '#1E88E5',
    [TransactionStatus.PAYMENT_PROCESSING]: '#1E88E5',
    [TransactionStatus.PAYMENT_COMPLETED]: '#2E7D32',
    [TransactionStatus.PAYMENT_FAILED]: '#C62828',
    [TransactionStatus.CANCELLED]: '#9E9E9E',
    [TransactionStatus.MISSED]: '#9E9E9E',
  };
  return colors[status] || '#757575';
}

export function getStatusIcon(status: TransactionStatus): string {
  const icons: Record<TransactionStatus, string> = {
    [TransactionStatus.BOOKED]: 'ticket-outline',
    [TransactionStatus.CHECKED_IN]: 'checkmark-circle-outline',
    [TransactionStatus.WAITING]: 'time-outline',
    [TransactionStatus.WEIGHING]: 'scale-outline',
    [TransactionStatus.QUALITY_CHECK]: 'search-outline',
    [TransactionStatus.QUALITY_HOLD]: 'alert-circle-outline',
    [TransactionStatus.PROCUREMENT_PENDING]: 'hourglass-outline',
    [TransactionStatus.PROCUREMENT_COMPLETED]: 'checkmark-done-outline',
    [TransactionStatus.RECEIPT_GENERATED]: 'receipt-outline',
    [TransactionStatus.PAYMENT_INITIATED]: 'card-outline',
    [TransactionStatus.PAYMENT_PROCESSING]: 'sync-outline',
    [TransactionStatus.PAYMENT_COMPLETED]: 'checkmark-circle',
    [TransactionStatus.PAYMENT_FAILED]: 'close-circle-outline',
    [TransactionStatus.CANCELLED]: 'close-outline',
    [TransactionStatus.MISSED]: 'remove-circle-outline',
  };
  return icons[status] || 'help-outline';
}

export function isExceptionStatus(status: TransactionStatus): boolean {
  return [
    TransactionStatus.QUALITY_HOLD,
    TransactionStatus.PAYMENT_FAILED,
    TransactionStatus.MISSED,
    TransactionStatus.CANCELLED
  ].includes(status);
}
