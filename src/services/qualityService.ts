import {
  MSPGrade,
  QualityTestParameters,
  QualityLabResult,
  QualityThresholds,
} from '../types/quality';
import { isFirebaseConfigured, db } from './firebase/firebase.config';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export const QUALITY_STANDARDS: Record<string, QualityThresholds> = {
  Wheat: {
    crop: 'Wheat',
    maxMoisturePercent: 14.0,
    maxImpuritiesPercent: 2.0,
    maxForeignMaterialPercent: 0.75,
    maxDamagedGrainPercent: 2.0,
  },
  Rice: {
    crop: 'Rice',
    maxMoisturePercent: 15.0,
    maxImpuritiesPercent: 2.5,
    maxForeignMaterialPercent: 1.0,
    maxDamagedGrainPercent: 3.0,
  },
  Paddy: {
    crop: 'Paddy',
    maxMoisturePercent: 17.0,
    maxImpuritiesPercent: 3.0,
    maxForeignMaterialPercent: 1.5,
    maxDamagedGrainPercent: 4.0,
  },
  Maize: {
    crop: 'Maize',
    maxMoisturePercent: 14.5,
    maxImpuritiesPercent: 2.5,
    maxForeignMaterialPercent: 1.0,
    maxDamagedGrainPercent: 3.0,
  },
};

export const qualityService = {
  /**
   * Validate quality test parameters
   */
  validateParameters: (params: QualityTestParameters): { isValid: boolean; errorMessage?: string } => {
    if (
      isNaN(params.moisturePercent) ||
      isNaN(params.impuritiesPercent) ||
      isNaN(params.foreignMaterialPercent) ||
      isNaN(params.damagedGrainPercent)
    ) {
      return { isValid: false, errorMessage: 'All quality test inputs must be valid numeric values.' };
    }
    if (params.moisturePercent < 0 || params.moisturePercent > 35) {
      return { isValid: false, errorMessage: 'Moisture percentage must be between 0% and 35%.' };
    }
    if (params.impuritiesPercent < 0 || params.impuritiesPercent > 25) {
      return { isValid: false, errorMessage: 'Impurities percentage must be between 0% and 25%.' };
    }
    if (params.foreignMaterialPercent < 0 || params.foreignMaterialPercent > 15) {
      return { isValid: false, errorMessage: 'Foreign material must be between 0% and 15%.' };
    }
    if (params.damagedGrainPercent < 0 || params.damagedGrainPercent > 20) {
      return { isValid: false, errorMessage: 'Damaged grain percentage must be between 0% and 20%.' };
    }
    return { isValid: true };
  },

  /**
   * Auto-evaluate FAQ MSP certified grade based on crop standards
   */
  evaluateGrade: (params: QualityTestParameters, crop = 'Wheat'): {
    recommendedGrade: MSPGrade;
    isMspEligible: boolean;
    advisory: string;
  } => {
    const std = QUALITY_STANDARDS[crop] || QUALITY_STANDARDS['Wheat'];

    if (
      params.moisturePercent > std.maxMoisturePercent ||
      params.impuritiesPercent > std.maxImpuritiesPercent * 1.5
    ) {
      return {
        recommendedGrade: 'Reject',
        isMspEligible: false,
        advisory: `Moisture (${params.moisturePercent}%) or Impurities (${params.impuritiesPercent}%) exceed government Fair Average Quality (FAQ) tolerance limit.`,
      };
    }

    if (
      params.moisturePercent <= 12.0 &&
      params.impuritiesPercent <= 1.0 &&
      params.foreignMaterialPercent <= 0.5
    ) {
      return {
        recommendedGrade: 'Grade A',
        isMspEligible: true,
        advisory: 'Premium quality lot meeting optimal government MSP procurement standards.',
      };
    }

    if (params.moisturePercent <= std.maxMoisturePercent) {
      return {
        recommendedGrade: 'Grade B',
        isMspEligible: true,
        advisory: 'Standard FAQ lot certified for MSP purchase under normal procurement.',
      };
    }

    return {
      recommendedGrade: 'Grade C',
      isMspEligible: true,
      advisory: 'Borderline moisture/foreign material lot. Certified with standard deduction guidance.',
    };
  },

  /**
   * Generates sequential or entropy Quality Check ID (QC-XXXXXX)
   */
  async generateQualityCheckId(): Promise<string> {
    return `QC-${String(Math.floor(100000 + Math.random() * 900000))}`;
  },

  /**
   * Record quality check to Firestore or local store
   */
  recordQualityCheck: async (
    result: Omit<QualityLabResult, 'timestamp'>
  ): Promise<QualityLabResult> => {
    const timestamp = new Date().toISOString();
    const qualityCheckId = `QC-${String(Math.floor(100000 + Math.random() * 900000))}`;
    const entry: QualityLabResult = {
      ...result,
      timestamp,
    };

    if (isFirebaseConfigured() && db) {
      try {
        await addDoc(collection(db, 'qualityChecks'), {
          ...entry,
          qualityCheckId,
          createdAt: serverTimestamp(),
        });
      } catch (err) {
        console.log('[QualityService] Firestore logging fallback:', err);
      }
    }

    return entry;
  },
};
