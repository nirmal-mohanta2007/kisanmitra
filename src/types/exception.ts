export type SystemExceptionLogType = 'OFFICER_OVERRIDE' | 'REJECTED_LOT' | 'SYSTEM_WARNING';
export type ExceptionSeverity = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
export type ExceptionStatus = 'OPEN' | 'INVESTIGATING' | 'RESOLVED';

export interface ExceptionMetrics7Days {
  dateRangeLabel: string;
  totalExceptions: number;
  officerOverrides: number;
  rejectedLots: number;
  systemWarnings: number;
  resolved: number;
  activeOpen: number;
  resolutionRatePct: number;
  avgResolutionTimeHours: number;
}

export interface DetailedExceptionLog {
  id: string;
  type: SystemExceptionLogType;
  title: string;
  description: string;
  severity: ExceptionSeverity;
  status: ExceptionStatus;
  mandiName: string;
  district: string;
  farmerName?: string;
  farmerId?: string;
  farmerMobile?: string;
  cropName?: string;
  cropHindi?: string;
  lotNumber?: string;
  quantityQtl?: number;
  authorizedBy: string;
  officerRole: string;
  auditJustification: string;
  createdAt: string;
  daysAgo: number;
  resolvedAt?: string;
  resolvedBy?: string;
}

export interface ExceptionFilterCriteria {
  dateRange: '7days' | 'today' | '14days' | '30days';
  district: string;
  mandi: string;
  officer: string;
  exceptionType: string;
  severity: string;
  status: string;
}
