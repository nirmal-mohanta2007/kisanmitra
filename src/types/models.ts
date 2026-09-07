import {
  UserRole,
  TransactionStatus,
  CropType,
  QualityGrade,
  ExceptionType,
  PaymentMethod,
} from './enums';

export interface FarmerAddress {
  village: string;
  district: string;
  state: string;
  pincode: string;
}

export interface Farmer {
  id: string;
  name: string;
  phone: string;
  farmerId?: string; // "FMR-YYYY-XXXXXX"
  userId?: string; // Firebase Auth UID
  fullName?: string;
  mobileNumber?: string;
  email?: string;
  dateOfBirth?: string; // "YYYY-MM-DD"
  address?: FarmerAddress;
  farmerType?: 'individual' | 'tenant' | 'sharecropper' | string;
  landArea?: number;
  landAreaUnit?: 'acre' | 'hectare' | string;
  primaryCrop?: string;
  preferredMandi?: string;
  status?: 'active' | 'inactive' | 'pending' | 'verified' | string;
  createdAt?: any;
  updatedAt?: any;

  // Backward-compatibility and UI convenience aliases
  village?: string;
  district?: string;
  state?: string;
  pinCode?: string;
  profileComplete?: boolean;
  landAreaHectares?: number;
  registrationNumber?: string;
  bankDetails?: {
    accountNumber: string;
    ifscCode: string;
    bankName: string;
    branchName?: string;
  };
  aadhaar?: string;
  fatherName?: string;
  gender?: string;
  khasraNo?: string;
  bankAccount?: string;
  ifsc?: string;
  bankName?: string;
  branchName?: string;
  photoUrl?: string | null;
  landDocFileName?: string;
  isVerified?: boolean;
}

/**
 * Represents a user document in Cloud Firestore (`users/{uid}`)
 */
export interface AppUser {
  uid: string; // Firebase Auth UID
  role: 'farmer' | 'operator' | 'admin';
  farmerId?: string; // "FMR-YYYY-XXXXXX" if role is farmer
  name: string;
  phone: string;
  email?: string;
  status: 'active' | 'inactive' | string;
  createdAt?: any;
  updatedAt?: any;
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
 * Represents a booking document in Cloud Firestore (`bookings/{bookingId}`)
 */
export interface Booking {
  bookingId: string; // "BOOK-YYYY-XXXXXX"
  farmerId: string; // "FMR-YYYY-XXXXXX"
  mandiId: string;
  crop: string;
  scheduledDate: string; // "YYYY-MM-DD"
  slot: string; // "10:00-11:00"
  tokenNumber: number;
  status: 'CONFIRMED' | 'CANCELLED' | 'COMPLETED' | 'CHECKED_IN';
  createdAt?: any;
  updatedAt?: any;
}

export interface TransactionCrop {
  name: string;
  variety?: string;
  quantityExpected: number;
  quantityUnit: 'kg' | 'quintal' | string;
}

/**
 * Represents a queue event in Cloud Firestore (`queueEvents/{eventId}`)
 */
export interface QueueEvent {
  eventId: string; // "QUEUE-XXXXXX"
  transactionId: string; // "TXN-YYYY-XXXXXX"
  farmerId: string; // "FMR-YYYY-XXXXXX"
  mandiId: string;
  tokenNumber: number;
  lane?: string;
  status: 'WAITING' | 'CALLED' | 'SERVED' | 'SKIPPED';
  calledAt?: any | null;
  createdAt: any;
  farmerName?: string;
  crop?: string;
  quantity?: string;
  operatorId?: string;
  notes?: string;
}

/**
 * Represents a weighment record in Cloud Firestore (`weighments/{weighmentId}`)
 */
export interface WeighmentRecord {
  weighmentId: string; // "WGH-XXXXXX"
  transactionId: string; // "TXN-YYYY-XXXXXX"
  farmerId: string; // "FMR-YYYY-XXXXXX"
  grossWeight: number;
  tareWeight: number;
  netWeight: number;
  unit: 'kg' | 'quintal' | string;
  operatorId: string;
  createdAt: any;
}

/**
 * Represents a quality check record in Cloud Firestore (`qualityChecks/{qualityCheckId}`)
 */
export interface QualityCheckRecord {
  qualityCheckId: string; // "QC-XXXXXX"
  transactionId: string; // "TXN-YYYY-XXXXXX"
  farmerId: string; // "FMR-YYYY-XXXXXX"
  status: 'PASSED' | 'REJECTED';
  moisture: number;
  qualityGrade: 'A' | 'B' | 'C' | 'Reject' | string;
  remarks?: string;
  operatorId: string;
  createdAt: any;
}

/**
 * Represents a payment record in Cloud Firestore (`payments/{paymentId}`)
 */
export interface PaymentRecord {
  paymentId: string; // "PAY-YYYY-XXXXXX"
  transactionId: string; // "TXN-YYYY-XXXXXX"
  farmerId: string; // "FMR-YYYY-XXXXXX"
  amount: number;
  currency: 'INR' | string;
  status: 'PROCESSING' | 'COMPLETED' | 'FAILED' | 'PENDING';
  paymentReference: string | null;
  initiatedAt: any;
  completedAt: any | null;
  updatedAt: any;
}

/**
 * The CORE TYPE: Represents the entire procurement transaction state in Cloud Firestore (`transactions/{transactionId}`)
 */
export interface ProcurementTransaction {
  transactionId?: string; // "TXN-YYYY-XXXXXX"
  id: string; // backward compatible / doc id
  farmerId: string; // "FMR-YYYY-XXXXXX"
  userId?: string; // Firebase Auth UID
  mandiId?: string;
  bookingId?: string; // "BOOK-YYYY-XXXXXX"
  crop: CropType | TransactionCrop | any;
  farmerName?: string;
  farmerPhone?: string;
  centreId?: string;
  centreName?: string;
  /** Expected quantity in quintals / kg */
  expectedQuantity?: number;
  /** Booking date in ISO format */
  bookingDate?: string;
  slotLabel?: string;
  tokenNumber?: number;
  status: TransactionStatus;
  statusHistory?: StatusHistoryEntry[];
  queuePosition?: number | null;
  /** Estimated wait time in minutes */
  estimatedWaitMinutes?: number | null;
  /** Recommended arrival time in ISO format */
  recommendedArrivalTime?: string | null;
  weighing?: WeighingRecord | null;
  qualityCheck?: QualityCheckResult | null;
  procurementAmount?: number | null;
  payment?: PaymentInfo | null;
  exceptions?: ExceptionRecord[];
  /** Timestamp in Firestore / ISO */
  createdAt?: any;
  /** Timestamp in Firestore / ISO */
  updatedAt?: any;
  // Optional convenience aliases for backward compatibility
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
