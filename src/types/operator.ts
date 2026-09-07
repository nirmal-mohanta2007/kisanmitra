export type LaneStatusType = 
  | 'Available' 
  | 'Waiting' 
  | 'Checking' 
  | 'Weighing' 
  | 'Procurement' 
  | 'Blocked';

export interface MandiLane {
  id: string;
  laneNumber: number;
  laneLabel: string;
  token?: string;
  farmerName?: string;
  crop?: string;
  stage?: string;
  status: LaneStatusType;
  lastUpdated: string;
}

export interface OperatorSession {
  operatorId: string;
  name: string;
  designation: string;
  mandiId: string;
  mandiName: string;
  shift: string;
  loginTime: string;
}

export type QueueEventType = 
  | 'CALLED' 
  | 'ANNOUNCED' 
  | 'LANE_ALLOCATED' 
  | 'CHECKED_IN' 
  | 'PAUSED' 
  | 'RESUMED';

export interface QueueEvent {
  id: string;
  token: string;
  farmerName: string;
  lane: string;
  eventType: QueueEventType;
  timestamp: string;
  operatorId: string;
  notes?: string;
}

export interface AuditLogEntry {
  id: string;
  operatorId: string;
  transactionId: string;
  token?: string;
  action: string;
  timestamp: string;
  previousStatus?: string;
  newStatus?: string;
  remarks?: string;
}

export interface OperatorKPIs {
  targetTodayMT: number;
  procuredTodayMT: number;
  targetTodayQtl?: number;
  procuredTodayQtl?: number;
  percentAchieved: number;
  activeTrucks: number;
  farmersWaiting: number;
  completedToday: number;
  pendingQualityChecks: number;
}

export interface PaymentBatch {
  id: string;
  batchNumber: string;
  transactionIds: string[];
  farmerCount: number;
  totalAmount: number;
  status: 'PENDING' | 'APPROVED' | 'PROCESSING' | 'COMPLETED';
  createdAt: string;
  approvedAt?: string;
  approvedBy?: string;
  treasuryVoucherRef?: string;
}

export type ExceptionCategory =
  | 'Quality Rejection'
  | 'Wet Crop'
  | 'Slot Reschedule'
  | 'Weight Dispute'
  | 'Duplicate Booking'
  | 'Vehicle Mismatch'
  | 'Farmer Verification Issue'
  | 'System Issue';

export type ExceptionStatus = 
  | 'OPEN' 
  | 'UNDER_REVIEW' 
  | 'RESOLVED' 
  | 'REJECTED' 
  | 'ESCALATED';

export interface StationException {
  id: string;
  token: string;
  farmer: string;
  phone?: string;
  crop?: string;
  vehicle?: string;
  category: ExceptionCategory;
  issue: string;
  status: ExceptionStatus;
  notes: string;
  timestamp: string;
  resolutionNote?: string;
  resolvedAt?: string;
  resolvedBy?: string;
}
