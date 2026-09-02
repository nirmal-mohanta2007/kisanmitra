import type { Issue } from '../../types';
import { mockTransactions } from './transactions';
import { mockFarmers } from './farmers';

export const mockIssues: Issue[] = [
  {
    id: 'issue_001',
    farmerId: mockFarmers[0].id,
    transactionId: mockTransactions.find(t => t.status === 'QUALITY_HOLD')?.id,
    type: 'QUALITY_DISPUTE',
    description: 'Farmer disputes the high moisture content reading. Requesting re-weighment and re-test.',
    status: 'OPEN',
    createdAt: '2026-09-02T09:35:00Z',
    updatedAt: '2026-09-02T09:35:00Z',
  },
  {
    id: 'issue_002',
    farmerId: mockFarmers[2].id,
    type: 'DOCUMENT_MISMATCH',
    description: 'Aadhar card name does not exactly match bank account name.',
    status: 'IN_PROGRESS',
    resolutionNotes: 'Verification pending with SDM office.',
    createdAt: '2026-09-01T10:00:00Z',
    updatedAt: '2026-09-02T08:00:00Z',
  },
  {
    id: 'issue_003',
    farmerId: mockFarmers[1].id,
    transactionId: mockTransactions.find(t => t.status === 'PAYMENT_PROCESSING')?.id,
    type: 'PAYMENT_DELAY',
    description: 'Payment has been in processing state for 3 days.',
    status: 'RESOLVED',
    resolutionNotes: 'Bank server timeout. Payment re-initiated and processed successfully.',
    createdAt: '2026-08-28T14:00:00Z',
    updatedAt: '2026-08-29T10:00:00Z',
  }
];
