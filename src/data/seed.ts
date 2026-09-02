import { mockUsers } from './mock/users';
import { mockFarmers } from './mock/farmers';
import { mockMandis } from './mock/mandis';
import { mockBookings } from './mock/bookings';
import { mockTransactions } from './mock/transactions';
import { mockQueue } from './mock/queue';
import { mockWeighmentLogs, mockQualityRecords } from './mock/procurement';
import { mockPayments } from './mock/payments';
import { mockIssues } from './mock/issues';

export function getInitialData() {
  return {
    users: mockUsers,
    farmers: mockFarmers,
    mandis: mockMandis,
    bookings: mockBookings,
    transactions: mockTransactions,
    queues: mockQueue,
    weighmentLogs: mockWeighmentLogs,
    qualityRecords: mockQualityRecords,
    payments: mockPayments,
    issues: mockIssues,
  };
}

export type DatabaseSchema = ReturnType<typeof getInitialData>;
