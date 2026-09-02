import { WeighingResult } from './weighing.types';

export const WeighingService = {
  calculateNetWeight(gross: number, tare: number): number {
    if (gross <= tare) {
      throw new Error('Gross weight must be greater than tare weight');
    }
    return gross - tare;
  },

  async recordWeights(gross: number, tare: number): Promise<WeighingResult> {
    return {
      grossWeight: gross,
      tareWeight: tare,
      netWeight: this.calculateNetWeight(gross, tare),
      timestamp: new Date().toISOString()
    };
  }
};
