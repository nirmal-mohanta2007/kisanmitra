export interface IssueTicket {
  id: string;
  transactionId: string;
  issueType: 'QUALITY_DISPUTE' | 'WEIGHING_ERROR' | 'PAYMENT_DELAY' | 'OTHER';
  description: string;
  status: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED';
  createdAt: string;
}
