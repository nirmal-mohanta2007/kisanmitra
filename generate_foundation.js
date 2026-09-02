const fs = require('fs');
const path = require('path');

const data = {
  "src/theme/colors.ts": `export const colors = {
  primary: '#2E7D32',
  secondary: '#1565C0',
  accent: '#FF8F00',
  background: '#F5F7FA',
  surface: '#FFFFFF',
  text: {
    primary: '#212121',
    secondary: '#757575',
    inverse: '#FFFFFF',
  },
  status: {
    success: '#388E3C',
    warning: '#F57C00',
    error: '#D32F2F',
    info: '#0288D1',
  },
  border: '#E0E0E0',
  cardShadow: 'rgba(0, 0, 0, 0.1)',
};
`,
  "src/theme/typography.ts": `export const typography = {
  sizes: {
    hero: 32,
    title: 24,
    header: 20,
    subtitle: 18,
    body: 16,
    caption: 14,
    button: 16,
  },
  weights: {
    regular: '400',
    medium: '500',
    bold: '700',
  },
  lineHeights: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.75,
  }
};
`,
  "src/theme/spacing.ts": `export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
};
`,
  "src/theme/radius.ts": `export const radius = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  round: 999,
};
`,
  "src/theme/index.ts": `export * from './colors';
export * from './typography';
export * from './spacing';
export * from './radius';

export const shadows = {
  card: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
};
`,
  "src/constants/routes.ts": `export const ROUTES = {
  AUTH: {
    LOGIN: '/auth/login',
    OTP: '/auth/otp',
  },
  FARMER: {
    HOME: '/farmer/home',
    BOOKING: '/farmer/booking',
    PROFILE: '/farmer/profile',
    RECEIPTS: '/farmer/receipts',
  },
  OPERATOR: {
    DASHBOARD: '/operator/dashboard',
    SCANNER: '/operator/scanner',
    WEIGHING: '/operator/weighing',
    QUALITY: '/operator/quality',
  },
  ADMIN: {
    DASHBOARD: '/admin/dashboard',
    REPORTS: '/admin/reports',
    SETTINGS: '/admin/settings',
  }
} as const;
`,
  "src/constants/status.ts": `export const TRANSACTION_STATUS = {
  BOOKED: 'BOOKED',
  CHECKED_IN: 'CHECKED_IN',
  WAITING: 'WAITING',
  WEIGHING: 'WEIGHING',
  QUALITY_CHECK: 'QUALITY_CHECK',
  QUALITY_HOLD: 'QUALITY_HOLD',
  PROCUREMENT_PENDING: 'PROCUREMENT_PENDING',
  PROCUREMENT_COMPLETED: 'PROCUREMENT_COMPLETED',
  RECEIPT_GENERATED: 'RECEIPT_GENERATED',
  PAYMENT_INITIATED: 'PAYMENT_INITIATED',
  PAYMENT_PROCESSING: 'PAYMENT_PROCESSING',
  PAYMENT_COMPLETED: 'PAYMENT_COMPLETED',
  PAYMENT_FAILED: 'PAYMENT_FAILED',
  CANCELLED: 'CANCELLED',
  MISSED: 'MISSED',
} as const;

export const STATUS_CONFIG = {
  [TRANSACTION_STATUS.BOOKED]: { en: 'Booked', hi: 'बुक किया गया', color: '#0288D1', icon: 'calendar' },
  [TRANSACTION_STATUS.CHECKED_IN]: { en: 'Checked In', hi: 'चेक इन', color: '#1565C0', icon: 'login' },
  [TRANSACTION_STATUS.WAITING]: { en: 'Waiting', hi: 'प्रतीक्षा में', color: '#FF8F00', icon: 'clock-outline' },
  [TRANSACTION_STATUS.WEIGHING]: { en: 'Weighing', hi: 'वजन हो रहा है', color: '#0288D1', icon: 'scale' },
  [TRANSACTION_STATUS.QUALITY_CHECK]: { en: 'Quality Check', hi: 'गुणवत्ता जांच', color: '#1565C0', icon: 'shield-check' },
  [TRANSACTION_STATUS.QUALITY_HOLD]: { en: 'Quality Hold', hi: 'गुणवत्ता रोक', color: '#F57C00', icon: 'alert' },
  [TRANSACTION_STATUS.PROCUREMENT_PENDING]: { en: 'Procurement Pending', hi: 'खरीद लंबित', color: '#FF8F00', icon: 'timer-sand' },
  [TRANSACTION_STATUS.PROCUREMENT_COMPLETED]: { en: 'Procurement Completed', hi: 'खरीद पूरी हुई', color: '#388E3C', icon: 'check-circle' },
  [TRANSACTION_STATUS.RECEIPT_GENERATED]: { en: 'Receipt Generated', hi: 'रसीद उत्पन्न', color: '#2E7D32', icon: 'receipt' },
  [TRANSACTION_STATUS.PAYMENT_INITIATED]: { en: 'Payment Initiated', hi: 'भुगतान शुरू किया गया', color: '#0288D1', icon: 'bank' },
  [TRANSACTION_STATUS.PAYMENT_PROCESSING]: { en: 'Payment Processing', hi: 'भुगतान प्रक्रिया में', color: '#FF8F00', icon: 'cash-fast' },
  [TRANSACTION_STATUS.PAYMENT_COMPLETED]: { en: 'Payment Completed', hi: 'भुगतान पूरा हुआ', color: '#388E3C', icon: 'cash-check' },
  [TRANSACTION_STATUS.PAYMENT_FAILED]: { en: 'Payment Failed', hi: 'भुगतान विफल', color: '#D32F2F', icon: 'alert-circle' },
  [TRANSACTION_STATUS.CANCELLED]: { en: 'Cancelled', hi: 'रद्द किया गया', color: '#757575', icon: 'cancel' },
  [TRANSACTION_STATUS.MISSED]: { en: 'Missed', hi: 'छूट गया', color: '#D32F2F', icon: 'calendar-remove' },
};

export const ALLOWED_TRANSITIONS: Record<string, string[]> = {
  [TRANSACTION_STATUS.BOOKED]: [TRANSACTION_STATUS.CHECKED_IN, TRANSACTION_STATUS.CANCELLED, TRANSACTION_STATUS.MISSED],
  [TRANSACTION_STATUS.CHECKED_IN]: [TRANSACTION_STATUS.WAITING, TRANSACTION_STATUS.CANCELLED],
  [TRANSACTION_STATUS.WAITING]: [TRANSACTION_STATUS.WEIGHING, TRANSACTION_STATUS.CANCELLED],
  [TRANSACTION_STATUS.WEIGHING]: [TRANSACTION_STATUS.QUALITY_CHECK],
  [TRANSACTION_STATUS.QUALITY_CHECK]: [TRANSACTION_STATUS.PROCUREMENT_PENDING, TRANSACTION_STATUS.QUALITY_HOLD],
  [TRANSACTION_STATUS.QUALITY_HOLD]: [TRANSACTION_STATUS.PROCUREMENT_PENDING, TRANSACTION_STATUS.CANCELLED],
  [TRANSACTION_STATUS.PROCUREMENT_PENDING]: [TRANSACTION_STATUS.PROCUREMENT_COMPLETED],
  [TRANSACTION_STATUS.PROCUREMENT_COMPLETED]: [TRANSACTION_STATUS.RECEIPT_GENERATED],
  [TRANSACTION_STATUS.RECEIPT_GENERATED]: [TRANSACTION_STATUS.PAYMENT_INITIATED],
  [TRANSACTION_STATUS.PAYMENT_INITIATED]: [TRANSACTION_STATUS.PAYMENT_PROCESSING, TRANSACTION_STATUS.PAYMENT_FAILED],
  [TRANSACTION_STATUS.PAYMENT_PROCESSING]: [TRANSACTION_STATUS.PAYMENT_COMPLETED, TRANSACTION_STATUS.PAYMENT_FAILED],
  [TRANSACTION_STATUS.PAYMENT_FAILED]: [TRANSACTION_STATUS.PAYMENT_INITIATED, TRANSACTION_STATUS.CANCELLED],
  [TRANSACTION_STATUS.PAYMENT_COMPLETED]: [],
  [TRANSACTION_STATUS.CANCELLED]: [],
  [TRANSACTION_STATUS.MISSED]: [],
};
`,
  "src/constants/crops.ts": `export const MSP_CROPS = [
  { id: 'c1', name: 'Paddy', nameHi: 'धान', pricePerQtl: 2320, icon: 'barley' },
  { id: 'c2', name: 'Wheat', nameHi: 'गेहूं', pricePerQtl: 2275, icon: 'grain' },
  { id: 'c3', name: 'Maize', nameHi: 'मक्का', pricePerQtl: 2090, icon: 'corn' },
  { id: 'c4', name: 'Soybean', nameHi: 'सोयाबीन', pricePerQtl: 4892, icon: 'sprout' },
  { id: 'c5', name: 'Jowar', nameHi: 'ज्वार', pricePerQtl: 3371, icon: 'grass' },
];
`,
  "src/constants/config.ts": `export const APP_CONFIG = {
  APP_NAME: 'Kisan Mitra',
  APP_VERSION: '1.0.0',
  DEFAULT_LANGUAGE: 'en',
  OPERATING_HOURS: {
    start: '08:00',
    end: '18:00',
  },
  DEFAULT_SERVICETIME_MINS: 8,
} as const;
`,
  "src/types/user.ts": `export type UserRole = 'FARMER' | 'OPERATOR' | 'ADMIN';

export interface User {
  id: string;
  phoneNumber: string;
  role: UserRole;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}
`,
  "src/types/farmer.ts": `import { User } from './user';

export interface LandDetails {
  id: string;
  areaAcres: number;
  surveyNumber: string;
  village: string;
  district: string;
  state: string;
}

export interface BankDetails {
  accountNumber: string;
  ifscCode: string;
  bankName: string;
  branchName: string;
}

export interface FarmerProfile extends User {
  farmerId: string;
  landDetails: LandDetails[];
  bankDetails: BankDetails;
}
`,
  "src/types/mandi.ts": `export interface OperatingHours {
  start: string; // HH:mm
  end: string;
}

export interface MandiCapacity {
  maxDailyProcurementQtl: number;
  currentDailyProcurementQtl: number;
  maxDailyTokens: number;
  currentDailyTokens: number;
}

export interface Mandi {
  id: string;
  name: string;
  district: string;
  state: string;
  operatingHours: OperatingHours;
  capacity: MandiCapacity;
  isActive: boolean;
}
`,
  "src/types/booking.ts": `export type BookingStatus = 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';

export interface BookingSlot {
  date: string;
  startTime: string;
  endTime: string;
  availableCapacityQtl: number;
}

export interface Booking {
  id: string;
  farmerId: string;
  mandiId: string;
  cropId: string;
  estimatedQuantityQtl: number;
  slot: BookingSlot;
  status: BookingStatus;
  createdAt: string;
}
`,
  "src/types/transaction.ts": `import { Booking } from './booking';
import { WeighmentRecord, QualityCheck, ProcurementSummary } from './procurement';
import { PaymentRecord } from './payment';
import { TransactionStatus } from '../constants/status';

export type { TransactionStatus };

export interface StatusHistoryEntry {
  status: TransactionStatus;
  timestamp: string;
  operatorId?: string;
  remarks?: string;
}

export interface Transaction {
  id: string;
  tokenId: string; // e.g., KM-2023-00001
  bookingDetails: Booking;
  status: TransactionStatus;
  statusHistory: StatusHistoryEntry[];
  weighment?: WeighmentRecord;
  quality?: QualityCheck;
  procurement?: ProcurementSummary;
  payment?: PaymentRecord;
  createdAt: string;
  updatedAt: string;
}
`,
  "src/types/queue.ts": `export interface TokenInfo {
  tokenId: string;
  transactionId: string;
  farmerName: string;
  cropName: string;
  estimatedQuantityQtl: number;
  position: number;
}

export interface ETADetails {
  estimatedWaitTimeMins: number;
  estimatedServiceTime: string; // ISO DateTime
}

export interface QueueState {
  mandiId: string;
  activeTokens: TokenInfo[];
  currentServingToken?: TokenInfo;
  averageServiceTimeMins: number;
  lastUpdated: string;
}
`,
  "src/types/procurement.ts": `export interface WeighmentRecord {
  id: string;
  grossWeightKg: number;
  tareWeightKg: number;
  netWeightKg: number;
  bagsCount: number;
  operatorId: string;
  timestamp: string;
}

export interface QualityCheck {
  id: string;
  moistureContentPercent: number;
  foreignMatterPercent: number;
  isAccepted: boolean;
  remarks?: string;
  operatorId: string;
  timestamp: string;
}

export interface ProcurementSummary {
  finalQuantityQtl: number;
  mspRatePerQtl: number;
  totalValue: number;
  receiptNumber: string;
  generatedAt: string;
}
`,
  "src/types/payment.ts": `export type PaymentStatus = 'PENDING' | 'INITIATED' | 'PROCESSING' | 'COMPLETED' | 'FAILED';
export type PaymentMethod = 'DBT' | 'NEFT' | 'UPI';

export interface PaymentRecord {
  id: string;
  transactionId: string;
  amount: number;
  status: PaymentStatus;
  method: PaymentMethod;
  referenceId?: string;
  initiatedAt?: string;
  completedAt?: string;
  failureReason?: string;
}
`,
  "src/types/issue.ts": `export type IssueCategory = 'WEIGHING' | 'QUALITY' | 'PAYMENT' | 'TECHNICAL' | 'OTHER';
export type IssueStatus = 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED';

export interface Issue {
  id: string;
  transactionId?: string;
  reporterId: string;
  category: IssueCategory;
  description: string;
  status: IssueStatus;
  resolutionRemarks?: string;
  createdAt: string;
  updatedAt: string;
}
`,
  "src/types/common.ts": `export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResult<T> {
  items: T[];
  totalCount: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface SelectOption {
  label: string;
  value: string | number;
}
`,
  "src/i18n/en.ts": `export const en = {
  common: {
    submit: 'Submit',
    cancel: 'Cancel',
    save: 'Save',
    loading: 'Loading...',
    error: 'An error occurred',
    success: 'Success',
  },
  auth: {
    login: 'Login',
    phoneNumber: 'Phone Number',
    sendOtp: 'Send OTP',
    verifyOtp: 'Verify OTP',
  },
  dashboard: {
    welcome: 'Welcome',
    activeTokens: 'Active Tokens',
    recentTransactions: 'Recent Transactions',
  },
  status: {
    booked: 'Booked',
    weighing: 'Weighing',
    qualityCheck: 'Quality Check',
    paymentCompleted: 'Payment Completed',
  }
};
`,
  "src/i18n/hi.ts": `export const hi = {
  common: {
    submit: 'जमा करें',
    cancel: 'रद्द करें',
    save: 'सहेजें',
    loading: 'लोड हो रहा है...',
    error: 'एक त्रुटि हुई',
    success: 'सफलता',
  },
  auth: {
    login: 'लॉग इन करें',
    phoneNumber: 'फ़ोन नंबर',
    sendOtp: 'OTP भेजें',
    verifyOtp: 'OTP सत्यापित करें',
  },
  dashboard: {
    welcome: 'स्वागत है',
    activeTokens: 'सक्रिय टोकन',
    recentTransactions: 'हाल के लेनदेन',
  },
  status: {
    booked: 'बुक किया गया',
    weighing: 'वजन हो रहा है',
    qualityCheck: 'गुणवत्ता जांच',
    paymentCompleted: 'भुगतान पूरा हुआ',
  }
};
`,
  "src/i18n/or.ts": `export const or = {
  common: {
    submit: 'ଦାଖଲ କରନ୍ତୁ',
    cancel: 'ବାତିଲ୍ କରନ୍ତୁ',
    save: 'ସେଭ୍ କରନ୍ତୁ',
    loading: 'ଲୋଡ୍ ହେଉଛି...',
    error: 'ଏକ ତ୍ରୁଟି ଘଟିଲା',
    success: 'ସଫଳତା',
  },
  auth: {
    login: 'ଲଗଇନ୍ କରନ୍ତୁ',
    phoneNumber: 'ଫୋନ୍ ନମ୍ବର',
    sendOtp: 'OTP ପଠାନ୍ତୁ',
    verifyOtp: 'OTP ଯାଞ୍ଚ କରନ୍ତୁ',
  },
  dashboard: {
    welcome: 'ସ୍ଵାଗତମ୍',
    activeTokens: 'ସକ୍ରିୟ ଟୋକେନ୍',
    recentTransactions: 'ସାମ୍ପ୍ରତିକ କାରବାର',
  },
  status: {
    booked: 'ବୁକ୍ ହୋଇଛି',
    weighing: 'ଓଜନ କରାଯାଉଛି',
    qualityCheck: 'ଗୁଣବତ୍ତା ଯାଞ୍ଚ',
    paymentCompleted: 'ଦେୟ ସମ୍ପୂର୍ଣ୍ଣ ହୋଇଛି',
  }
};
`,
  "src/i18n/index.ts": `import { en } from './en';
import { hi } from './hi';
import { or } from './or';

export type LanguageCode = 'en' | 'hi' | 'or';
export type TranslationKey = string; // In production, we can strongly type this

const translations: Record<LanguageCode, any> = { en, hi, or };

export const t = (key: TranslationKey, lang: LanguageCode = 'en'): string => {
  const keys = key.split('.');
  let current = translations[lang] || translations['en'];

  for (const k of keys) {
    if (current[k] === undefined) {
      console.warn(\`Translation key not found: \${key}\`);
      return key;
    }
    current = current[k];
  }

  return current as string;
};
`,
  "src/utils/date.ts": `export const formatDate = (isoString: string): string => {
  const date = new Date(isoString);
  return new Intl.DateTimeFormat('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(date);
};

export const formatTime = (isoString: string): string => {
  const date = new Date(isoString);
  return new Intl.DateTimeFormat('en-IN', {
    hour: 'numeric',
    minute: 'numeric',
    hour12: true,
  }).format(date);
};

export const getDateDifferenceMins = (startIso: string, endIso: string): number => {
  const start = new Date(startIso).getTime();
  const end = new Date(endIso).getTime();
  return Math.floor((end - start) / 60000);
};
`,
  "src/utils/currency.ts": `export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};
`,
  "src/utils/quantity.ts": `export const kgToQuintal = (kg: number): number => {
  return kg / 100;
};

export const quintalToKg = (quintal: number): number => {
  return quintal * 100;
};

export const formatQuantity = (quintals: number): string => {
  return \`\${quintals.toFixed(2)} Qtl\`;
};
`,
  "src/utils/validation.ts": `export const validatePhoneNumber = (phone: string): boolean => {
  const phoneRegex = /^[6-9]\\d{9}$/;
  return phoneRegex.test(phone);
};

export const validateQuantity = (quantityQtl: number): boolean => {
  return quantityQtl > 0 && quantityQtl <= 100;
};

export const isRequired = (value: any): boolean => {
  if (value === null || value === undefined) return false;
  if (typeof value === 'string') return value.trim().length > 0;
  return true;
};
`,
  "src/utils/transaction.ts": `import { TRANSACTION_STATUS, ALLOWED_TRANSITIONS } from '../constants/status';

export const generateToken = (counter: number): string => {
  const year = new Date().getFullYear();
  const paddedCounter = String(counter).padStart(5, '0');
  return \`KM-\${year}-\${paddedCounter}\`;
};

export const canTransition = (currentStatus: keyof typeof TRANSACTION_STATUS, nextStatus: keyof typeof TRANSACTION_STATUS): boolean => {
  const allowedNext = ALLOWED_TRANSITIONS[currentStatus] || [];
  return allowedNext.includes(nextStatus);
};
`
};

Object.keys(data).forEach(filePath => {
  const fullPath = path.join(__dirname, filePath);
  const dir = path.dirname(fullPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(fullPath, data[filePath]);
  console.log('Created: ' + filePath);
});
