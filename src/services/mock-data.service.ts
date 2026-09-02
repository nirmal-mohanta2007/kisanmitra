import {
  Centre,
  Farmer,
  Operator,
  AdminUser,
  ProcurementTransaction,
  TransactionStatus,
  CropType,
  QualityGrade,
  ExceptionType,
  PaymentMethod,
  StatusHistoryEntry,
  UserRole,
} from '../types';
import { transitionStatus } from './transaction.service';

export const MOCK_CENTRES: Centre[] = [
  {
    id: 'C-001',
    name: 'Demo Krishi Upaj Mandi, Bhopal',
    supportedCrops: [CropType.WHEAT, CropType.PADDY, CropType.SOYBEAN, CropType.JOWAR, CropType.MAIZE],
    capacity: 80,
    averageServiceTime: 8,
    currentDelay: 10,
    address: 'Karond Bypass Road, Bhopal',
    district: 'Bhopal',
    state: 'Madhya Pradesh',
    operatingHours: { open: '08:00', close: '17:00' },
    isActive: true,
  },
  {
    id: 'C-002',
    name: 'Kisan Seva Kendra, Indore',
    supportedCrops: [CropType.WHEAT, CropType.SOYBEAN, CropType.JOWAR],
    capacity: 60,
    averageServiceTime: 7,
    currentDelay: 5,
    address: 'Mhow Road, Indore',
    district: 'Indore',
    state: 'Madhya Pradesh',
    operatingHours: { open: '08:00', close: '16:00' },
    isActive: true,
  },
  {
    id: 'C-003',
    name: 'Rajya Kray Kendra, Jabalpur',
    supportedCrops: [CropType.PADDY, CropType.WHEAT, CropType.MAIZE],
    capacity: 50,
    averageServiceTime: 9,
    currentDelay: 15,
    address: 'Wright Town, Jabalpur',
    district: 'Jabalpur',
    state: 'Madhya Pradesh',
    operatingHours: { open: '09:00', close: '17:00' },
    isActive: true,
  }
];

export const MOCK_FARMERS: Farmer[] = [
  {
    id: 'F-001',
    name: 'Ramesh Nayak',
    phone: '9876543210',
    village: 'Sehore',
    district: 'Sehore',
    state: 'Madhya Pradesh',
    profileComplete: true,
  },
  {
    id: 'F-002',
    name: 'Sunita Devi',
    phone: '9876543211',
    village: 'Harda',
    district: 'Harda',
    state: 'Madhya Pradesh',
    profileComplete: true,
  },
  {
    id: 'F-003',
    name: 'Mohan Patel',
    phone: '9876543212',
    village: 'Dewas',
    district: 'Dewas',
    state: 'Madhya Pradesh',
    profileComplete: true,
  },
  {
    id: 'F-004',
    name: 'Lakshmi Bai',
    phone: '9876543213',
    village: 'Chhindwara',
    district: 'Chhindwara',
    state: 'Madhya Pradesh',
    profileComplete: true,
  },
  {
    id: 'F-005',
    name: 'Bhagwan Das',
    phone: '9876543214',
    village: 'Mandla',
    district: 'Mandla',
    state: 'Madhya Pradesh',
    profileComplete: true,
  }
];

export const MOCK_OPERATORS: Operator[] = [
  { id: 'O-001', name: 'Anil Kumar', role: UserRole.OPERATOR, centreId: 'C-001', phone: '9998887770' },
  { id: 'O-002', name: 'Rajesh Verma', role: UserRole.OPERATOR, centreId: 'C-002', phone: '9998887771' },
  { id: 'O-003', name: 'Priya Sharma', role: UserRole.OPERATOR, centreId: 'C-003', phone: '9998887772' }
];

export const MOCK_ADMIN: AdminUser[] = [
  { id: 'A-001', name: 'Collector Shukla', role: UserRole.ADMIN, jurisdiction: 'Bhopal Division', phone: '9998887773' }
];

let transactionCounter = 1000;

export function generateTransactionId(): string {
  transactionCounter++;
  return `KM-2026-${transactionCounter.toString().padStart(5, '0')}`;
}

export function getNextTokenNumber(centreId: string, transactions: ProcurementTransaction[]): number {
  const centreTransactions = transactions.filter(t => t.centreId === centreId);
  if (centreTransactions.length === 0) return 1;
  const maxToken = Math.max(...centreTransactions.map(t => t.tokenNumber));
  return maxToken + 1;
}

export function generateBookingSlots(centreId: string) {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const dayAfter = new Date();
  dayAfter.setDate(dayAfter.getDate() + 2);

  return [
    { date: tomorrow.toISOString().split('T')[0], slotLabel: 'Morning (8:00 - 12:00)', maxCapacity: 40, currentBookings: 18 },
    { date: tomorrow.toISOString().split('T')[0], slotLabel: 'Afternoon (12:00 - 16:00)', maxCapacity: 40, currentBookings: 24 },
    { date: dayAfter.toISOString().split('T')[0], slotLabel: 'Morning (8:00 - 12:00)', maxCapacity: 40, currentBookings: 12 },
    { date: dayAfter.toISOString().split('T')[0], slotLabel: 'Afternoon (12:00 - 16:00)', maxCapacity: 40, currentBookings: 8 },
  ];
}

export function generateMockTransactions(): ProcurementTransaction[] {
  const transactions: ProcurementTransaction[] = [];
  const todayStr = new Date().toISOString().split('T')[0];
  const centreMap = new Map(MOCK_CENTRES.map(c => [c.id, c.name]));
  
  const createTx = (
    farmer: Farmer,
    centreId: string,
    crop: CropType,
    status: TransactionStatus,
    qty: number,
    token: number,
    isHero = false
  ): ProcurementTransaction => {
    const txId = isHero ? 'KM-2026-00421' : generateTransactionId();
    const centreName = centreMap.get(centreId) || 'Demo Mandi';
    
    const baseTx: ProcurementTransaction = {
      id: txId,
      farmerId: farmer.id,
      farmerName: farmer.name,
      farmerPhone: farmer.phone,
      centreId,
      centreName,
      crop,
      expectedQuantity: qty,
      tokenNumber: token,
      bookingDate: todayStr,
      slotLabel: 'Morning (8:00 - 12:00)',
      status: TransactionStatus.BOOKED,
      statusHistory: [{
        status: TransactionStatus.BOOKED,
        timestamp: new Date().toISOString(),
        updatedBy: 'SYSTEM'
      }],
      queuePosition: null,
      estimatedWaitMinutes: null,
      recommendedArrivalTime: null,
      weighing: null,
      qualityCheck: null,
      procurementAmount: null,
      payment: null,
      exceptions: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    if (status === TransactionStatus.BOOKED) return baseTx;
    
    let currentTx = baseTx;
    const transitions = getTransitionsForStatus(status);
    
    for (const t of transitions) {
      currentTx = transitionStatus(currentTx, t, 'SYSTEM');
    }
    
    if (status === TransactionStatus.QUALITY_HOLD) {
      currentTx.exceptions = [{
        id: `EXC-${Date.now()}`,
        type: ExceptionType.QUALITY_HOLD,
        status: 'OPEN',
        reason: 'Moisture content too high',
        actionRequired: 'Dry crop and return',
        responsibleParty: 'FARMER',
        nextStep: 'Re-weighing required',
        createdAt: new Date().toISOString()
      }];
    } else if (status === TransactionStatus.CANCELLED) {
      currentTx.exceptions = [{
        id: `EXC-${Date.now()}`,
        type: ExceptionType.CANCELLATION,
        status: 'RESOLVED',
        reason: 'Farmer request',
        actionRequired: 'None',
        responsibleParty: 'FARMER',
        nextStep: 'None',
        createdAt: new Date().toISOString(),
        resolvedAt: new Date().toISOString()
      }];
    }
    
    return currentTx;
  };

  const getTransitionsForStatus = (status: TransactionStatus): TransactionStatus[] => {
    const path: TransactionStatus[] = [];
    const sequence = [
      TransactionStatus.CHECKED_IN,
      TransactionStatus.WAITING,
      TransactionStatus.WEIGHING,
      TransactionStatus.QUALITY_CHECK,
      TransactionStatus.PROCUREMENT_PENDING,
      TransactionStatus.PROCUREMENT_COMPLETED,
      TransactionStatus.RECEIPT_GENERATED,
      TransactionStatus.PAYMENT_INITIATED,
      TransactionStatus.PAYMENT_PROCESSING,
      TransactionStatus.PAYMENT_COMPLETED
    ];
    
    if (status === TransactionStatus.CANCELLED) return [TransactionStatus.CANCELLED];
    if (status === TransactionStatus.QUALITY_HOLD) return [TransactionStatus.CHECKED_IN, TransactionStatus.WAITING, TransactionStatus.WEIGHING, TransactionStatus.QUALITY_CHECK, TransactionStatus.QUALITY_HOLD];
    
    for (const s of sequence) {
      path.push(s);
      if (s === status) break;
    }
    
    return path;
  };

  // Hero Transaction
  transactions.push(createTx(MOCK_FARMERS[0], 'C-001', CropType.PADDY, TransactionStatus.BOOKED, 20, 42, true));

  // 4 more BOOKED
  transactions.push(createTx(MOCK_FARMERS[1], 'C-001', CropType.WHEAT, TransactionStatus.BOOKED, 15, 43));
  transactions.push(createTx(MOCK_FARMERS[2], 'C-002', CropType.SOYBEAN, TransactionStatus.BOOKED, 25, 10));
  transactions.push(createTx(MOCK_FARMERS[3], 'C-003', CropType.MAIZE, TransactionStatus.BOOKED, 30, 5));
  transactions.push(createTx(MOCK_FARMERS[4], 'C-001', CropType.JOWAR, TransactionStatus.BOOKED, 10, 44));

  // 3 CHECKED_IN
  transactions.push(createTx(MOCK_FARMERS[1], 'C-002', CropType.WHEAT, TransactionStatus.CHECKED_IN, 40, 8));
  transactions.push(createTx(MOCK_FARMERS[2], 'C-003', CropType.PADDY, TransactionStatus.CHECKED_IN, 35, 3));
  transactions.push(createTx(MOCK_FARMERS[3], 'C-001', CropType.WHEAT, TransactionStatus.CHECKED_IN, 20, 40));

  // 4 WAITING
  transactions.push(createTx(MOCK_FARMERS[0], 'C-002', CropType.JOWAR, TransactionStatus.WAITING, 12, 6));
  transactions.push(createTx(MOCK_FARMERS[4], 'C-003', CropType.WHEAT, TransactionStatus.WAITING, 45, 2));
  transactions.push(createTx(MOCK_FARMERS[1], 'C-001', CropType.SOYBEAN, TransactionStatus.WAITING, 18, 38));
  transactions.push(createTx(MOCK_FARMERS[2], 'C-001', CropType.PADDY, TransactionStatus.WAITING, 22, 39));

  // 2 WEIGHING
  transactions.push(createTx(MOCK_FARMERS[3], 'C-002', CropType.WHEAT, TransactionStatus.WEIGHING, 50, 4));
  transactions.push(createTx(MOCK_FARMERS[4], 'C-003', CropType.MAIZE, TransactionStatus.WEIGHING, 28, 1));

  // 2 QUALITY_CHECK
  transactions.push(createTx(MOCK_FARMERS[0], 'C-001', CropType.WHEAT, TransactionStatus.QUALITY_CHECK, 15, 36));
  transactions.push(createTx(MOCK_FARMERS[1], 'C-002', CropType.SOYBEAN, TransactionStatus.QUALITY_CHECK, 30, 2));

  // 1 QUALITY_HOLD
  transactions.push(createTx(MOCK_FARMERS[2], 'C-001', CropType.JOWAR, TransactionStatus.QUALITY_HOLD, 8, 35));

  // 2 PROCUREMENT_COMPLETED
  transactions.push(createTx(MOCK_FARMERS[3], 'C-003', CropType.PADDY, TransactionStatus.PROCUREMENT_COMPLETED, 42, 70));
  transactions.push(createTx(MOCK_FARMERS[4], 'C-001', CropType.WHEAT, TransactionStatus.PROCUREMENT_COMPLETED, 16, 34));

  // 2 RECEIPT_GENERATED
  transactions.push(createTx(MOCK_FARMERS[0], 'C-002', CropType.JOWAR, TransactionStatus.RECEIPT_GENERATED, 20, 1));
  transactions.push(createTx(MOCK_FARMERS[1], 'C-001', CropType.SOYBEAN, TransactionStatus.RECEIPT_GENERATED, 25, 30));

  // 1 PAYMENT_INITIATED
  transactions.push(createTx(MOCK_FARMERS[2], 'C-003', CropType.WHEAT, TransactionStatus.PAYMENT_INITIATED, 35, 60));

  // 1 PAYMENT_PROCESSING
  transactions.push(createTx(MOCK_FARMERS[3], 'C-001', CropType.PADDY, TransactionStatus.PAYMENT_PROCESSING, 18, 25));

  // 1 PAYMENT_COMPLETED
  transactions.push(createTx(MOCK_FARMERS[4], 'C-002', CropType.SOYBEAN, TransactionStatus.PAYMENT_COMPLETED, 40, 75));

  // 1 CANCELLED
  transactions.push(createTx(MOCK_FARMERS[0], 'C-001', CropType.WHEAT, TransactionStatus.CANCELLED, 10, 80));

  return transactions;
}
