import { 
  ProcurementTransaction, 
  StatusHistoryEntry, 
  WeighingRecord, 
  QualityCheckResult, 
  PaymentInfo, 
  ExceptionRecord,
  TransactionStatus, 
  QualityGrade, 
  ExceptionType, 
  PaymentMethod, 
  CropType 
} from '../types';
import { canTransition } from '../state-machine';
import { CROP_DATA } from '../constants/crops';

/** Transition a transaction to a new status with validation */
export function transitionStatus(
  transaction: ProcurementTransaction,
  newStatus: TransactionStatus,
  updatedBy: string,
  notes?: string
): ProcurementTransaction {
  if (!canTransition(transaction.status, newStatus)) {
    throw new Error(
      `Invalid transition: ${transaction.status} → ${newStatus} for transaction ${transaction.id}`
    );
  }

  const historyEntry: StatusHistoryEntry = {
    status: newStatus,
    timestamp: new Date().toISOString(),
    updatedBy,
    notes: notes || null as any,
  };

  return {
    ...transaction,
    status: newStatus,
    statusHistory: [...transaction.statusHistory, historyEntry],
    updatedAt: new Date().toISOString(),
  };
}

/** Check-in a farmer — moves from BOOKED to CHECKED_IN */
export function checkInFarmer(
  transaction: ProcurementTransaction,
  operatorId: string
): ProcurementTransaction {
  return transitionStatus(transaction, TransactionStatus.CHECKED_IN, operatorId, 'Farmer checked in at centre');
}

/** Move farmer to waiting queue */
export function moveToWaiting(
  transaction: ProcurementTransaction,
  operatorId: string
): ProcurementTransaction {
  return transitionStatus(transaction, TransactionStatus.WAITING, operatorId, 'Added to waiting queue');
}

/** Start weighing */
export function startWeighing(
  transaction: ProcurementTransaction,
  operatorId: string
): ProcurementTransaction {
  return transitionStatus(transaction, TransactionStatus.WEIGHING, operatorId, 'Weighing started');
}

/** Record weighing result */
export function recordWeighing(
  transaction: ProcurementTransaction,
  weighing: WeighingRecord,
  operatorId: string
): ProcurementTransaction {
  const updated = transitionStatus(transaction, TransactionStatus.QUALITY_CHECK, operatorId, `Net weight: ${weighing.netWeight} quintals`);
  return {
    ...updated,
    weighing,
  };
}

/** Record quality check result */
export function recordQualityCheck(
  transaction: ProcurementTransaction,
  qualityCheck: QualityCheckResult,
  operatorId: string
): ProcurementTransaction {
  if (qualityCheck.grade === QualityGrade.REJECTED) {
    // Quality hold
    const updated = transitionStatus(transaction, TransactionStatus.QUALITY_HOLD, operatorId, 'Quality check: Rejected');
    const exception: ExceptionRecord = {
      id: `EXC-${Date.now()}`,
      type: ExceptionType.QUALITY_HOLD,
      status: 'OPEN',
      reason: `Quality rejected: ${qualityCheck.observations}`,
      actionRequired: 'Review quality parameters with operator',
      responsibleParty: 'OPERATOR',
      nextStep: 'Re-evaluate or discuss with farmer',
      createdAt: new Date().toISOString(),
    };
    return {
      ...updated,
      qualityCheck,
      exceptions: [...(updated.exceptions || []), exception],
    };
  }

  const updated = transitionStatus(transaction, TransactionStatus.PROCUREMENT_PENDING, operatorId, `Quality: ${qualityCheck.grade}`);
  return {
    ...updated,
    qualityCheck,
  };
}

/** Complete procurement — calculate amount based on MSP * net weight */
export function completeProcurement(
  transaction: ProcurementTransaction,
  operatorId: string
): ProcurementTransaction {
  const netWeight = transaction.weighing?.netWeight ?? transaction.expectedQuantity;
  const msp = CROP_DATA[transaction.crop]?.mspPerQuintal ?? 0;
  const amount = netWeight * msp;

  const updated = transitionStatus(transaction, TransactionStatus.PROCUREMENT_COMPLETED, operatorId, `Amount: ₹${amount.toLocaleString('en-IN')}`);
  return {
    ...updated,
    procurementAmount: amount,
  };
}

/** Generate receipt */
export function generateReceipt(
  transaction: ProcurementTransaction,
  operatorId: string
): ProcurementTransaction {
  return transitionStatus(transaction, TransactionStatus.RECEIPT_GENERATED, operatorId, 'Receipt generated');
}

/** Initiate payment */
export function initiatePayment(
  transaction: ProcurementTransaction,
  operatorId: string
): ProcurementTransaction {
  const payment: PaymentInfo = {
    method: PaymentMethod.BANK_TRANSFER,
    amount: transaction.procurementAmount ?? 0,
    initiatedAt: new Date().toISOString(),
  };
  const updated = transitionStatus(transaction, TransactionStatus.PAYMENT_INITIATED, operatorId, 'Payment initiated');
  return {
    ...updated,
    payment,
  };
}

/** Process payment (mock transition) */
export function processPayment(
  transaction: ProcurementTransaction,
  operatorId: string
): ProcurementTransaction {
  return transitionStatus(transaction, TransactionStatus.PAYMENT_PROCESSING, operatorId, 'Payment is being processed');
}

/** Complete payment */
export function completePayment(
  transaction: ProcurementTransaction,
  operatorId: string
): ProcurementTransaction {
  const updated = transitionStatus(transaction, TransactionStatus.PAYMENT_COMPLETED, operatorId, 'Payment completed');
  return {
    ...updated,
    payment: updated.payment ? {
      ...updated.payment,
      referenceNumber: `PAY-${Date.now()}`,
      completedAt: new Date().toISOString(),
    } : null,
  };
}

/** Cancel a transaction */
export function cancelTransaction(
  transaction: ProcurementTransaction,
  cancelledBy: string,
  reason: string
): ProcurementTransaction {
  const updated = transitionStatus(transaction, TransactionStatus.CANCELLED, cancelledBy, reason);
  const exception: ExceptionRecord = {
    id: `EXC-${Date.now()}`,
    type: ExceptionType.CANCELLATION,
    status: 'RESOLVED',
    reason,
    actionRequired: 'None',
    responsibleParty: 'SYSTEM',
    nextStep: 'Book a new visit if needed',
    createdAt: new Date().toISOString(),
    resolvedAt: new Date().toISOString(),
  };
  return {
    ...updated,
    exceptions: [...(updated.exceptions || []), exception],
  };
}

/** Mark as missed */
export function markAsMissed(
  transaction: ProcurementTransaction,
  operatorId: string
): ProcurementTransaction {
  const updated = transitionStatus(transaction, TransactionStatus.MISSED, operatorId, 'Farmer did not arrive');
  const exception: ExceptionRecord = {
    id: `EXC-${Date.now()}`,
    type: ExceptionType.MISSED_TOKEN,
    status: 'RESOLVED',
    reason: 'Farmer did not arrive for scheduled slot',
    actionRequired: 'Rebook visit',
    responsibleParty: 'FARMER',
    nextStep: 'Book a new visit',
    createdAt: new Date().toISOString(),
    resolvedAt: new Date().toISOString(),
  };
  return {
    ...updated,
    exceptions: [...(updated.exceptions || []), exception],
  };
}

/** Calculate queue position for a transaction */
export function calculateQueuePosition(
  transaction: ProcurementTransaction,
  allTransactions: ProcurementTransaction[]
): number {
  const activeStatuses = [
    TransactionStatus.BOOKED,
    TransactionStatus.CHECKED_IN,
    TransactionStatus.WAITING,
  ];
  
  const ahead = allTransactions.filter(
    (t) =>
      t.centreId === transaction.centreId &&
      t.id !== transaction.id &&
      t.tokenNumber < transaction.tokenNumber &&
      activeStatuses.includes(t.status)
  );
  
  return ahead.length + 1; // 1-based position
}
