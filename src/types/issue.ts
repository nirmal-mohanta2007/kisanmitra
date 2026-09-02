export type IssueCategory = 'WEIGHING' | 'QUALITY' | 'PAYMENT' | 'TECHNICAL' | 'OTHER';
export type IssueStatus = 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED';

export interface Issue {
  id: string;
  transactionId?: string;
  farmerId?: string;
  reporterId?: string;
  category?: IssueCategory | string;
  type?: string;
  description: string;
  status: IssueStatus | string;
  resolutionRemarks?: string;
  resolutionNotes?: string;
  createdAt: string;
  updatedAt?: string;
}
