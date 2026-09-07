import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  MandiLane,
  OperatorKPIs,
  OperatorSession,
  AuditLogEntry,
  PaymentBatch,
  StationException,
} from '../types/operator';
import { queueService, QueueItemData } from '../services/queueService';
import { weighingService } from '../services/weighingService';
import { qualityService } from '../services/qualityService';
import { procurementService, ProcurementReceipt } from '../services/procurementService';
import { paymentService, PaymentItemModel } from '../services/paymentService';
import { transactionService } from '../services/transactionService';
import { adminService } from '../services/adminService';
import { QualityLabResult } from '../types/quality';
import { WeighbridgeReading } from '../types/weighing';

export interface OperationalAlert {
  id: string;
  icon: string;
  type: 'critical' | 'warning' | 'info' | 'caution';
  message: string;
  token?: string;
  timestamp: string;
}

export interface ServingTokenState {
  token: string;
  farmer: string;
  crop: string;
  vehicle: string;
  quantity: string;
  lane: string;
  stage: string;
  transactionId?: string;
}

interface OperatorContextType {
  kpis: OperatorKPIs;
  currentServing: ServingTokenState;
  queue: QueueItemData[];
  lanes: MandiLane[];
  recentTransactions: Array<{
    token: string;
    farmer: string;
    crop: string;
    qty: string;
    stage: string;
    status: string;
    time: string;
  }>;
  alerts: OperationalAlert[];
  isQueuePaused: boolean;
  paymentItems: PaymentItemModel[];
  approvedBatches: PaymentBatch[];
  exceptions: StationException[];
  auditLogs: AuditLogEntry[];
  currentOperator: OperatorSession;

  // Actions
  callNextToken: (lane?: string) => Promise<{ success: boolean; token?: string; farmer?: string }>;
  callSpecificToken: (item: QueueItemData, lane?: string) => Promise<void>;
  announceToken: (token: string, farmer: string, lane?: string) => Promise<void>;
  allocateLane: (laneNumber: number, token: string, stage: string, farmerName?: string) => void;
  toggleQueuePause: () => boolean;
  registerGateEntry: (token: string, lane: string, txId?: string) => Promise<void>;
  saveQualityResult: (token: string, labResult: QualityLabResult) => Promise<void>;
  confirmWeight: (token: string, reading: WeighbridgeReading) => Promise<void>;
  finalizeProcurement: (receipt: ProcurementReceipt) => Promise<void>;
  createAndApprovePaymentBatch: (selectedIds: string[]) => Promise<PaymentBatch>;
  resolveException: (id: string, resolutionNote: string) => void;
  addException: (exception: Omit<StationException, 'id' | 'timestamp'>) => void;
  dismissAlert: (id: string) => void;
  resetQueue: () => void;
}

const initialKPIs: OperatorKPIs = {
  targetTodayMT: 500,
  procuredTodayMT: 0,
  targetTodayQtl: 5000,
  procuredTodayQtl: 0,
  percentAchieved: 0,
  activeTrucks: 0,
  farmersWaiting: 0,
  completedToday: 0,
  pendingQualityChecks: 0,
};

const initialServing: ServingTokenState = {
  token: '',
  farmer: '',
  crop: '',
  vehicle: '',
  quantity: '',
  lane: '',
  stage: 'Idle',
  transactionId: '',
};

const initialAlerts: OperationalAlert[] = [];

const initialRecentTransactions: Array<{
  token: string;
  farmer: string;
  crop: string;
  qty: string;
  stage: string;
  status: string;
  time: string;
}> = [];

const initialExceptions: StationException[] = [];

const initialOperator: OperatorSession = {
  operatorId: 'OP-104',
  name: 'Suresh Verma',
  designation: 'Mandi Procurement Station Officer',
  mandiId: 'MANDI-BHP-01',
  mandiName: 'Talcher Procurement Centre (Bhopal)',
  shift: 'Day Shift (08:00 - 18:00)',
  loginTime: '08:00 AM',
};

const OperatorContext = createContext<OperatorContextType | undefined>(undefined);

export const OperatorProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [kpis, setKpis] = useState<OperatorKPIs>(initialKPIs);
  const [currentServing, setCurrentServing] = useState<ServingTokenState>(initialServing);
  const [queue, setQueue] = useState<QueueItemData[]>(queueService.getInitialQueue());
  const [lanes, setLanes] = useState<MandiLane[]>(queueService.getInitialLanes());
  const [recentTransactions, setRecentTransactions] = useState(initialRecentTransactions);
  const [alerts, setAlerts] = useState<OperationalAlert[]>(initialAlerts);
  const [isQueuePaused, setIsQueuePaused] = useState(false);
  const [paymentItems, setPaymentItems] = useState<PaymentItemModel[]>(paymentService.getInitialPayments());
  const [approvedBatches, setApprovedBatches] = useState<PaymentBatch[]>([]);
  const [exceptions, setExceptions] = useState<StationException[]>(initialExceptions);
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>([]);
  const [currentOperator] = useState<OperatorSession>(initialOperator);

  // Helper to record audit log
  const logAudit = async (action: string, token?: string, txId?: string, prev?: string, next?: string, remarks?: string) => {
    const entry = await transactionService.logAuditTrail({
      operatorId: currentOperator.operatorId,
      transactionId: txId || `TX-${token || 'SYS'}`,
      token: token || currentServing.token,
      action,
      previousStatus: prev,
      newStatus: next,
      remarks,
    });
    setAuditLogs((prevLogs) => [entry, ...prevLogs]);
  };

  /**
   * Call Next Waiting Token
   */
  const callNextToken = async (lane = 'Lane 1') => {
    if (isQueuePaused) {
      return { success: false };
    }
    if (queue.length === 0) {
      return { success: false };
    }

    const next = queue[0];
    const remaining = queue.slice(1);

    const prevToken = currentServing.token;
    setCurrentServing({
      token: next.token,
      farmer: next.farmer,
      crop: next.crop,
      vehicle: 'OD-02-CD-5678',
      quantity: next.quantity,
      lane,
      stage: 'CHECKED_IN',
      transactionId: `TX-${next.token}`,
    });

    setQueue(remaining);
    setKpis((prev) => ({
      ...prev,
      farmersWaiting: Math.max(0, prev.farmersWaiting - 1),
    }));

    // Update lane status
    setLanes((prevLanes) =>
      prevLanes.map((l) =>
        l.laneLabel === lane
          ? {
              ...l,
              token: next.token,
              farmerName: next.farmer,
              crop: next.crop,
              stage: 'Checked In',
              status: 'Checking',
              lastUpdated: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            }
          : l
      )
    );

    // Audio announcement & logging
    await queueService.announceToken(next.token, next.farmer, lane);
    await queueService.logQueueEvent({
      token: next.token,
      farmerName: next.farmer,
      lane,
      eventType: 'CALLED',
      operatorId: currentOperator.operatorId,
      notes: `Called to ${lane}`,
    });

    await logAudit('CALL_TOKEN', next.token, `TX-${next.token}`, prevToken, next.token, `Token ${next.token} called to ${lane}`);

    return { success: true, token: next.token, farmer: next.farmer };
  };

  /**
   * Call specific token
   */
  const callSpecificToken = async (item: QueueItemData, lane = 'Lane 1') => {
    if (isQueuePaused) return;

    setCurrentServing({
      token: item.token,
      farmer: item.farmer,
      crop: item.crop,
      vehicle: 'OD-02-XX-9999',
      quantity: item.quantity,
      lane,
      stage: 'GATE CHECKED-IN',
      transactionId: `TX-${item.token}`,
    });

    setQueue((prev) => prev.filter((q) => q.token !== item.token));
    setKpis((prev) => ({ ...prev, farmersWaiting: Math.max(0, prev.farmersWaiting - 1) }));

    await queueService.announceToken(item.token, item.farmer, lane);
    await logAudit('CALL_SPECIFIC_TOKEN', item.token, `TX-${item.token}`, undefined, 'CHECKED_IN', `Direct call to ${lane}`);
  };

  /**
   * Announce Token Public Address
   */
  const announceToken = async (token: string, farmer: string, lane = 'Lane 1') => {
    await queueService.announceToken(token, farmer, lane);
    await queueService.logQueueEvent({
      token,
      farmerName: farmer,
      lane,
      eventType: 'ANNOUNCED',
      operatorId: currentOperator.operatorId,
      notes: `Public announcement broadcast on ${lane}`,
    });
    await logAudit('ANNOUNCE_TOKEN', token, `TX-${token}`, undefined, undefined, `Public address broadcast on ${lane}`);
  };

  /**
   * Allocate Lane
   */
  const allocateLane = (laneNumber: number, token: string, stage: string, farmerName?: string) => {
    setLanes((prev) =>
      prev.map((l) =>
        l.laneNumber === laneNumber
          ? {
              ...l,
              token,
              farmerName: farmerName || 'Farmer',
              stage,
              status: (stage === 'Quality Check' ? 'Checking' : stage === 'Weighing' ? 'Weighing' : 'Procurement') as any,
              lastUpdated: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            }
          : l
      )
    );
    logAudit('ALLOCATE_LANE', token, `TX-${token}`, undefined, stage, `Allocated to Lane ${laneNumber}`);
  };

  /**
   * Toggle Queue Pause
   */
  const toggleQueuePause = () => {
    const newState = !isQueuePaused;
    setIsQueuePaused(newState);
    logAudit(newState ? 'PAUSE_QUEUE' : 'RESUME_QUEUE', undefined, undefined, undefined, undefined, `Mandi gate entry ${newState ? 'paused' : 'resumed'}`);
    return newState;
  };

  /**
   * Register Gate Entry
   */
  const registerGateEntry = async (token: string, lane: string, txId?: string) => {
    setCurrentServing((prev) => ({
      ...prev,
      token,
      lane,
      stage: 'CHECKED_IN',
    }));
    await logAudit('REGISTER_GATE_ENTRY', token, txId || `TX-${token}`, 'BOOKED', 'CHECKED_IN', `Gate entry registered at ${lane}`);
  };

  /**
   * Save Quality Result
   */
  const saveQualityResult = async (token: string, labResult: QualityLabResult) => {
    setCurrentServing((prev) => ({
      ...prev,
      stage: 'PASSED (WEIGHING)',
    }));
    setKpis((prev) => ({
      ...prev,
      pendingQualityChecks: Math.max(0, prev.pendingQualityChecks - 1),
    }));
    setLanes((prev) =>
      prev.map((l) =>
        l.token === token
          ? {
              ...l,
              stage: 'Weighing',
              status: 'Weighing',
              lastUpdated: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            }
          : l
      )
    );
    await qualityService.recordQualityCheck(labResult);
    await logAudit(
      'QUALITY_CHECK_COMPLETED',
      token,
      labResult.transactionId,
      'QUALITY_CHECK',
      'WEIGHING',
      `Certified ${labResult.certifiedGrade}. Moisture: ${labResult.parameters.moisturePercent}%`
    );
  };

  /**
   * Confirm Weight
   */
  const confirmWeight = async (token: string, reading: WeighbridgeReading) => {
    setCurrentServing((prev) => ({
      ...prev,
      quantity: `${reading.netWeightQtl} Q`,
      stage: 'PROCUREMENT_PENDING',
    }));
    setLanes((prev) =>
      prev.map((l) =>
        l.token === token
          ? {
              ...l,
              stage: 'Procurement',
              status: 'Procurement',
              lastUpdated: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            }
          : l
      )
    );
    await weighingService.recordWeighment(reading);
    await logAudit(
      'WEIGHING_CONFIRMED',
      token,
      `TX-${token}`,
      'WEIGHING',
      'PROCUREMENT_PENDING',
      `Gross: ${reading.grossWeightKg}kg, Tare: ${reading.tareWeightKg}kg, Net: ${reading.netWeightKg}kg (${reading.netWeightQtl}Q)`
    );
  };

  /**
   * Finalize Procurement
   */
  const finalizeProcurement = async (receipt: ProcurementReceipt) => {
    const qtyInMT = Number((receipt.netWeightKg / 1000).toFixed(1));
    const newProcured = Math.min(kpis.targetTodayMT, Number((kpis.procuredTodayMT + qtyInMT).toFixed(1)));
    const percent = Number(((newProcured / kpis.targetTodayMT) * 100).toFixed(1));

    setKpis((prev) => ({
      ...prev,
      procuredTodayMT: newProcured,
      percentAchieved: percent,
      completedToday: prev.completedToday + 1,
    }));

    setCurrentServing((prev) => ({
      ...prev,
      stage: 'COMPLETED',
    }));

    // Add to recent transactions
    const newTx = {
      token: receipt.token,
      farmer: receipt.farmerName,
      crop: receipt.crop,
      qty: `${receipt.netWeightQtl} Q`,
      stage: 'Completed',
      status: 'Settled',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setRecentTransactions((prev) => [newTx, ...prev.slice(0, 4)]);

    // Add to pending payment batches
    const newPayItem: PaymentItemModel = {
      id: receipt.transactionId,
      farmer: receipt.farmerName,
      token: receipt.token,
      amount: receipt.totalAmount,
      bankStatus: 'Verified',
      paymentStatus: 'Pending',
      selected: true,
      bankName: 'State Bank of India',
      accountMasked: '•••• 4821',
      ifsc: 'SBIN0001234',
    };
    setPaymentItems((prev) => [newPayItem, ...prev]);

    await procurementService.recordProcurement(receipt);
    await logAudit(
      'PROCUREMENT_FINALIZED',
      receipt.token,
      receipt.transactionId,
      'PROCUREMENT_PENDING',
      'PAYMENT_INITIATED',
      `Receipt #${receipt.receiptNumber}. Net: ${receipt.netWeightQtl}Q @ ₹${receipt.mspRatePerQtl}/Q = ₹${receipt.totalAmount}`
    );
  };

  /**
   * Create and Approve Payment Batch
   */
  const createAndApprovePaymentBatch = async (selectedIds: string[]): Promise<PaymentBatch> => {
    const selected = paymentItems.filter((p) => selectedIds.includes(p.id));
    const totalAmount = selected.reduce((sum, p) => sum + p.amount, 0);
    const batchNumber = `PB-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`;

    const batch: PaymentBatch = {
      id: `BATCH-${Date.now()}`,
      batchNumber,
      transactionIds: selectedIds,
      farmerCount: selected.length,
      totalAmount,
      status: 'APPROVED',
      createdAt: new Date().toISOString(),
      approvedAt: new Date().toISOString(),
      approvedBy: currentOperator.name,
      treasuryVoucherRef: `PFMS-VCHR-${Math.floor(10000 + Math.random() * 90000)}`,
    };

    setApprovedBatches((prev) => [batch, ...prev]);

    // Update items to approved
    setPaymentItems((prev) =>
      prev.map((item) =>
        selectedIds.includes(item.id) ? { ...item, paymentStatus: 'Approved' } : item
      )
    );

    // Update alert
    setAlerts((prev) =>
      prev.map((a) =>
        a.id === 'ALT-4'
          ? {
              ...a,
              message: `Payment batch #${batchNumber} approved for ₹${totalAmount.toLocaleString('en-IN')}`,
              type: 'info',
            }
          : a
      )
    );

    await paymentService.recordPaymentBatch(batch);
    await logAudit(
      'PAYMENT_BATCH_APPROVED',
      undefined,
      batch.batchNumber,
      'PENDING',
      'APPROVED',
      `Approved batch ${batch.batchNumber} with ${batch.farmerCount} vouchers totaling ₹${batch.totalAmount.toLocaleString('en-IN')}`
    );

    return batch;
  };

  /**
   * Resolve Exception
   */
  const resolveException = (id: string, resolutionNote: string) => {
    setExceptions((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              status: 'RESOLVED',
              resolutionNote,
              resolvedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              resolvedBy: currentOperator.name,
            }
          : item
      )
    );
    logAudit('EXCEPTION_RESOLVED', undefined, id, 'OPEN', 'RESOLVED', resolutionNote);
  };

  /**
   * Add new exception
   */
  const addException = (exception: Omit<StationException, 'id' | 'timestamp'>) => {
    const newEx: StationException = {
      ...exception,
      id: `EX-${Math.floor(1000 + Math.random() * 9000)}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setExceptions((prev) => [newEx, ...prev]);
    logAudit('EXCEPTION_CREATED', newEx.token, newEx.id, undefined, 'OPEN', `${newEx.category}: ${newEx.issue}`);
  };

  /**
   * Dismiss alert
   */
  const dismissAlert = (id: string) => {
    setAlerts((prev) => prev.filter((a) => a.id !== id));
  };

  /**
   * Reset / Reload initial 18 waiting queue items
   */
  const resetQueue = () => {
    const initialList = queueService.getInitialQueue();
    setQueue(initialList);
    setKpis((prev) => ({ ...prev, farmersWaiting: initialList.length }));
  };

  return (
    <OperatorContext.Provider
      value={{
        kpis,
        currentServing,
        queue,
        lanes,
        recentTransactions,
        alerts,
        isQueuePaused,
        paymentItems,
        approvedBatches,
        exceptions,
        auditLogs,
        currentOperator,
        callNextToken,
        callSpecificToken,
        announceToken,
        allocateLane,
        toggleQueuePause,
        registerGateEntry,
        saveQualityResult,
        confirmWeight,
        finalizeProcurement,
        createAndApprovePaymentBatch,
        resolveException,
        addException,
        dismissAlert,
        resetQueue,
      }}
    >
      {children}
    </OperatorContext.Provider>
  );
};

export const useOperatorStore = (): OperatorContextType => {
  const context = useContext(OperatorContext);
  if (!context) {
    throw new Error('useOperatorStore must be used within an OperatorProvider');
  }
  return context;
};
