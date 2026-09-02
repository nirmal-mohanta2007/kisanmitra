import type { WeighmentLog, QualityRecord } from '../../types';
import { mockTransactions } from './transactions';

export const mockWeighmentLogs: WeighmentLog[] = mockTransactions
  .filter(t => t.actualQuantity !== undefined)
  .map((t, index) => ({
    id: `weigh_${index + 1}`,
    transactionId: t.id,
    grossWeight: (t.actualQuantity || 0) * 100 + 500, // kg
    tareWeight: 500, // kg
    netWeight: (t.actualQuantity || 0) * 100, // kg
    operatorId: 'usr_002',
    timestamp: t.updatedAt,
    deviceIdentifier: `SCALE-${t.mandiId}-01`,
  }));

export const mockQualityRecords: QualityRecord[] = mockTransactions
  .filter(t => t.qualityGrade !== undefined || t.status === 'QUALITY_HOLD')
  .map((t, index) => ({
    id: `qual_${index + 1}`,
    transactionId: t.id,
    moistureContent: t.status === 'QUALITY_HOLD' ? 14.5 : 11.2, // %
    foreignMatter: t.status === 'QUALITY_HOLD' ? 3.0 : 1.5, // %
    grade: t.qualityGrade || (t.status === 'QUALITY_HOLD' ? 'REJECTED' : 'A'),
    inspectorId: 'usr_002',
    remarks: t.status === 'QUALITY_HOLD' ? 'High moisture content' : 'Good quality',
    timestamp: t.updatedAt,
  }));
