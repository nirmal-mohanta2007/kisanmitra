import { QualityMetrics, QualityResult } from './quality.types';
import { QualityAssistant } from './quality.assistant';

export const QualityService = {
  async assessQuality(metrics: QualityMetrics): Promise<QualityResult> {
    return QualityAssistant.evaluateRules(metrics);
  }
};
