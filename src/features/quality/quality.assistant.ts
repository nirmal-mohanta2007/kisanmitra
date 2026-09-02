import { QualityMetrics, QualityResult } from './quality.types';

export const QualityAssistant = {
  evaluateRules(metrics: QualityMetrics): QualityResult {
    let grade: QualityResult['grade'] = 'REJECTED';
    let isApproved = false;
    let remarks = '';

    if (metrics.moistureContent > 14) {
      remarks = 'Moisture content too high (Max 14%)';
    } else if (metrics.foreignMatter > 5) {
      remarks = 'Foreign matter exceeds limit (Max 5%)';
    } else if (metrics.damagedGrains > 10) {
      remarks = 'Too many damaged grains (Max 10%)';
    } else {
      isApproved = true;
      if (metrics.moistureContent <= 10 && metrics.foreignMatter <= 1) {
        grade = 'A';
      } else if (metrics.moistureContent <= 12 && metrics.foreignMatter <= 3) {
        grade = 'B';
      } else {
        grade = 'C';
      }
      remarks = 'Quality acceptable';
    }

    return {
      grade,
      metrics,
      isApproved,
      remarks
    };
  }
};
