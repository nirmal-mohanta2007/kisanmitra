import {
  UserRole,
  TransactionStatus,
  CropType,
  QualityGrade,
  ExceptionType,
  PaymentMethod,
} from './enums';

/**
 * Represents a farmer user in the system.
 */
export interface Farmer {
  id: string;
  name: string;
  phone: string;
  village: string;
  district: string;
  state: string;
  profileComplete?: boolean;
  userId?: string;
  landAreaHectares?: number;
  registrationNumber?: string;
  bankDetails?: {
    accountNumber: string;
    ifscCode: string;
    bankName: string;
    branchName?: string;
  };
  status?: string;
  createdAt?: string;
  updatedAt?: string;
  aadhaar?: string;
  pinCode?: string;
  fatherName?: string;
  gender?: string;
  khasraNo?: string;
  landArea?: number;
  primaryCrop?: string;
  bankAccount?: string;
  ifsc?: string;
  bankName?: string;
  branchName?: string;
  photoUrl?: string | null;
  landDocFileName?: string;
  isVerified?: boolean;
}

/**
 * Represents an operator working at a procurement centre.
 */
export interface Operator {
  id: string;
  name: string;
  phone: string;
  centreId: string;
  role: UserRole.OPERATOR;
}

/**
 * Represents an administrator user.
 */
export interface AdminUser {
  id: string;
  name: string;
  phone: string;
  role: UserRole.ADMIN;
  jurisdiction: string;
}

/**
 * Operating hours for a centre.
 */
export interface OperatingHours {
  open: string;
  close: string;
}

/**
 * Represents a procurement centre.
 */
export interface Centre {
  id: string;
  name: string;
  address: string;
  district: string;
  state: string;
  supportedCrops: CropType[];
  /** Number of farmers the centre can handle per day */
  capacity: number;
  operatingHours: OperatingHours;
  isActive: boolean;
  /** Current delay at the centre in minutes */
  currentDelay: number;
  /** Average service time per farmer in minutes */
  averageServiceTime: number;
}

/**
 * Information about a specific crop type.
 */
export interface CropInfo {
  type: CropType;
  displayName: string;
  displayNameHi: string;
  nameHi?: string;
  emoji?: string;
  /** MSP (Minimum Support Price) in rupees per quintal */
  mspPerQuintal: number;
  unit: 'quintal';
}

/**
 * Represents a booking slot at a centre.
 */
export interface BookingSlot {
  /** Date in ISO format */
  date: string;
  /** Label for the slot, e.g., 'Morning 8-12' */
  slotLabel: string;
  maxCapacity: number;
  currentBookings: number;
}

/**
 * A history entry for status transitions of a transaction.
 */
export interface StatusHistoryEntry {
  status: TransactionStatus;
  /** Timestamp in ISO format */
  timestamp: string;
  /** User ID who updated the status */
  updatedBy: string;
  notes?: string;
}

/**
 * Results of the quality check process.
 */
export interface QualityCheckResult {
  grade: QualityGrade;
  moisturePercent: number;
  foreignMatterPercent: number;
  observations: string;
  /** User ID who performed the check */
  checkedBy: string;
}

/**
 * Results of the weighing process.
 */
export interface WeighingRecord {
  grossWeight: number;
  tareWeight: number;
  netWeight: number;
  unit: 'quintal';
  /** User ID who recorded the weight */
  recordedBy: string;
  /** Timestamp in ISO format */
  timestamp: string;
}

/**
 * Record of an exception or issue in the procurement process.
 */
export interface ExceptionRecord {
  id: string;
  type: ExceptionType;
  status: 'OPEN' | 'RESOLVED';
  reason: string;
  actionRequired: string;
  responsibleParty: 'FARMER' | 'OPERATOR' | 'SYSTEM';
  nextStep: string;
  /** Timestamp in ISO format */
  createdAt: string;
  /** Timestamp in ISO format, if resolved */
  resolvedAt?: string;
}

/**
 * Payment information associated with a transaction.
 */
export interface PaymentInfo {
  method: PaymentMethod;
  amount: number;
  referenceNumber?: string;
  /** Timestamp in ISO format */
  initiatedAt?: string;
  /** Timestamp in ISO format */
  completedAt?: string;
}

/**
 * The CORE TYPE: Represents the entire procurement transaction state.
 */
export interface ProcurementTransaction {
  /** Format: KM-YYYY-NNNNN */
  id: string;
  farmerId: string;
  farmerName: string;
  farmerPhone: string;
  centreId: string;
  centreName: string;
  crop: CropType;
  /** Expected quantity in quintals */
  expectedQuantity: number;
  /** Booking date in ISO format */
  bookingDate: string;
  slotLabel: string;
  tokenNumber: number;
  status: TransactionStatus;
  statusHistory: StatusHistoryEntry[];
  queuePosition: number | null;
  /** Estimated wait time in minutes */
  estimatedWaitMinutes: number | null;
  /** Recommended arrival time in ISO format */
  recommendedArrivalTime: string | null;
  weighing: WeighingRecord | null;
  qualityCheck: QualityCheckResult | null;
  procurementAmount: number | null;
  payment: PaymentInfo | null;
  exceptions: ExceptionRecord[];
  /** Timestamp in ISO format */
  createdAt: string;
  /** Timestamp in ISO format */
  updatedAt: string;
  // Optional convenience aliases for mock compatibility
  bookingId?: string;
  mandiId?: string;
  actualQuantity?: number;
  estimatedQuantity?: number;
  quantity?: number;
  bookedDate?: string;
  bookedSlot?: string;
  qualityGrade?: string;
  receiptId?: string;
  checkInTime?: string;
  timeSlot?: string;
  weighingRecord?: WeighingRecord | null;
  qualityResult?: QualityCheckResult | null;
  exceptionData?: any;
  weighingData?: any;
  qualityData?: any;
  receiptData?: any;
  paymentData?: any;
}

/**
 * Provides Estimated Time of Arrival and wait details.
 */
export interface ETAInfo {
  tokensAhead: number;
  averageServiceTimeMinutes: number;
  currentDelayMinutes: number;
  estimatedWaitMinutes: number;
  /** ISO format */
  recommendedArrivalTime: string;
  explanation: string;
  queuePosition?: number;
  estimatedArrival?: string;
}

/**
 * Aggregate statistics for a procurement centre.
 */
export interface CentreStats {
  centreId: string;
  totalBookingsToday: number;
  activeQueue: number;
  averageWaitMinutes: number;
  procurementCompleted: number;
  procurementPending: number;
  paymentPending: number;
  paymentCompleted: number;
  delayedCases: number;
  exceptions: number;
  /** Timestamp in ISO format */
  lastUpdated: string;
}
