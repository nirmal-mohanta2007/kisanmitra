import type { Issue } from '../../types';
import { mockTransactions } from './transactions';
import { mockFarmers } from './farmers';

export const mockIssues: Issue[] = [
  {
    id: 'ISS-2026-001',
    title: 'Moisture Percentage Lab Dispute',
    farmerId: mockFarmers[0]?.id || 'F-001',
    transactionId: mockTransactions?.find((t: any) => t.status === 'QUALITY_HOLD')?.id,
    category: 'QUALITY',
    type: 'QUALITY_DISPUTE',
    description: 'Farmer disputes the high moisture content reading. Requesting re-weighment and re-test.',
    status: 'OPEN',
    createdAt: '02 Sep 2026, 09:35 AM',
    updatedAt: '02 Sep 2026, 09:35 AM',
  },
  {
    id: 'ISS-2026-002',
    title: 'Aadhaar / Bank Name Mismatch',
    farmerId: mockFarmers[2]?.id || 'F-003',
    category: 'PAYMENT',
    type: 'DOCUMENT_MISMATCH',
    description: 'Aadhaar card name does not exactly match bank account passbook name.',
    status: 'IN_PROGRESS',
    resolutionNotes: 'Verification pending with SDM office.',
    createdAt: '01 Sep 2026, 10:00 AM',
    updatedAt: '02 Sep 2026, 08:00 AM',
  },
  {
    id: 'ISS-2026-003',
    title: 'DBT Bank Transfer Delay Beyond 48h',
    farmerId: mockFarmers[1]?.id || 'F-002',
    transactionId: mockTransactions?.find((t: any) => t.status === 'PAYMENT_PROCESSING')?.id,
    category: 'PAYMENT',
    type: 'PAYMENT_DELAY',
    description: 'Payment has been in processing state for 3 days.',
    status: 'RESOLVED',
    resolutionNotes: 'Bank server timeout. Payment re-initiated and processed successfully.',
    createdAt: '28 Aug 2026, 02:00 PM',
    updatedAt: '29 Aug 2026, 10:00 AM',
  },
];

export const MOCK_ISSUES: Issue[] = mockIssues;
