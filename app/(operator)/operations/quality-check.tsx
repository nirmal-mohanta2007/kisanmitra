import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Alert, TouchableOpacity, ScrollView, Platform } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../../src/theme/colors';
import { spacing } from '../../../src/theme/spacing';
import { radius } from '../../../src/theme/radius';
import {
  ScreenContainer,
  KisanCard,
  SectionHeader,
  StatusBadge,
} from '../../../src/components/common';
import { useAppContext } from '../../../src/store/app-context';
import { useOperatorStore } from '../../../src/store/operator.store';
import { SubScreenHeader } from '../../../src/components/operator';
import { qualityService } from '../../../src/services/qualityService';
import { MSPGrade } from '../../../src/types/quality';
import { getOperatorTexts } from '../../../src/i18n/operator-translations';

export default function OperatorQualityCheckScreen() {
  const router = useRouter();
  const { txId } = useLocalSearchParams<{ txId?: string }>();
  const { state } = useAppContext();
  const scale = state.textScale || 1.0;
  const t = getOperatorTexts(state.language);

  const { currentServing, saveQualityResult, addException } = useOperatorStore();

  // Section 13 Input Fields
  const [moisture, setMoisture] = useState('13.5');
  const [impurities, setImpurities] = useState('1.8');
  const [foreignMaterial, setForeignMaterial] = useState('0.4');
  const [damagedGrain, setDamagedGrain] = useState('0.8');
  const [selectedGrade, setSelectedGrade] = useState<MSPGrade>('Grade A');
  const [remarks, setRemarks] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Auto-evaluation advisory
  const evaluation = qualityService.evaluateGrade(
    {
      moisturePercent: parseFloat(moisture) || 0,
      impuritiesPercent: parseFloat(impurities) || 0,
      foreignMaterialPercent: parseFloat(foreignMaterial) || 0,
      damagedGrainPercent: parseFloat(damagedGrain) || 0,
    },
    currentServing.crop
  );

  const handleSaveQuality = async () => {
    const moistureNum = parseFloat(moisture);
    const impuritiesNum = parseFloat(impurities);
    const foreignNum = parseFloat(foreignMaterial);
    const damagedNum = parseFloat(damagedGrain);

    const validation = qualityService.validateParameters({
      moisturePercent: moistureNum,
      impuritiesPercent: impuritiesNum,
      foreignMaterialPercent: foreignNum,
      damagedGrainPercent: damagedNum,
    });

    if (!validation.isValid) {
      Alert.alert('Validation Error', validation.errorMessage || 'Invalid test inputs.');
      return;
    }

    if (selectedGrade === 'Reject') {
      handleRejectLot();
      return;
    }

    setIsSubmitting(true);
    try {
      await saveQualityResult(currentServing.token, {
        testId: `QLAB-${Date.now()}`,
        transactionId: txId || currentServing.transactionId || 'TX-2026-001',
        token: currentServing.token,
        farmerName: currentServing.farmer,
        crop: currentServing.crop,
        parameters: {
          moisturePercent: moistureNum,
          impuritiesPercent: impuritiesNum,
          foreignMaterialPercent: foreignNum,
          damagedGrainPercent: damagedNum,
          remarks,
        },
        certifiedGrade: selectedGrade,
        testedBy: 'Lab Inspector (OP-104)',
        timestamp: new Date().toISOString(),
        passed: true,
        mspEligibility: true,
        remarks,
      });

      if (Platform.OS === 'web') {
        if (typeof window !== 'undefined') {
          window.alert(
            `Quality Inspection Approved ✓\nQuality test PASSED for Token ${currentServing.token} (${currentServing.farmer}).\nCertified Grade: ${selectedGrade}\nProceeding to Electronic Weighbridge.`
          );
        }
        router.push(
          `/(operator)/operations/weighing?txId=${txId || currentServing.transactionId || 'TX-2026-001'}` as any
        );
      } else {
        Alert.alert(
          'Quality Result Saved ✓',
          `Quality test PASSED for Token ${currentServing.token} (${currentServing.farmer}).\nCertified Grade: ${selectedGrade}\nState: QUALITY_CHECK → PASSED → WEIGHING`,
          [
            {
              text: 'Proceed to Weighbridge ›',
              onPress: () =>
                router.push(
                  `/(operator)/operations/weighing?txId=${txId || currentServing.transactionId || 'TX-2026-001'}` as any
                ),
            },
          ]
        );
      }
    } catch {
      Alert.alert('Error', 'Unable to record quality check result.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRejectLot = () => {
    const doReject = () => {
      addException({
        token: currentServing.token,
        farmer: currentServing.farmer,
        vehicle: currentServing.vehicle,
        crop: currentServing.crop,
        category: 'Quality Rejection',
        issue: `Moisture ${moisture}%, Impurities ${impurities}%, Foreign Material ${foreignMaterial}%. Grade: Reject.`,
        status: 'OPEN',
        notes: remarks || 'Sample tested in Moisture & FAQ Lab bay.',
      });

      if (Platform.OS === 'web') {
        if (typeof window !== 'undefined') {
          window.alert(
            `Lot Rejected: Token ${currentServing.token} (${currentServing.farmer}) marked as REJECTED.\nOperational exception ticket created.\nRedirecting to Exceptions Dashboard.`
          );
        }
        router.push('/(operator)/exceptions');
      } else {
        Alert.alert(
          'Lot Rejected',
          `Lot for Token ${currentServing.token} marked as REJECTED. Exception ticket generated.`,
          [
            {
              text: 'View Exceptions Dashboard ›',
              onPress: () => router.push('/(operator)/exceptions'),
            },
          ]
        );
      }
    };

    if (Platform.OS === 'web') {
      const confirmed = typeof window !== 'undefined'
        ? window.confirm(`Confirm lot rejection for Token ${currentServing.token} (${currentServing.farmer}) due to moisture (${moisture}%) or impurity limits? This will log an operational exception.`)
        : true;
      if (confirmed) {
        doReject();
      }
    } else {
      Alert.alert(
        'Reject Crop Lot',
        `Confirm lot rejection for Token ${currentServing.token} due to moisture (${moisture}%) or impurity limits? This will log an operational exception.`,
        [
          {
            text: 'Confirm Reject',
            style: 'destructive',
            onPress: doReject,
          },
          { text: 'Cancel', style: 'cancel' },
        ]
      );
    }
  };

  return (
    <ScreenContainer scrollable style={styles.container}>
      <SubScreenHeader
        title={t.qualityTitle}
        subtitle={t.qualitySub}
      />

      {/* 1. TRANSACTION SUMMARY CARD (Section 13) */}
      <KisanCard style={styles.summaryCard}>
        <View style={styles.summaryHeader}>
          <View>
            <Text style={styles.summaryTokenLabel}>{t.currentToken}</Text>
            <Text style={[styles.summaryToken, { fontSize: 20 * scale }]}>
              {currentServing.token}
            </Text>
          </View>
          <StatusBadge status="QUALITY_CHECK" />
        </View>

        <View style={styles.summaryDetails}>
          <Text style={styles.summaryText}>
            {t.farmer}: <Text style={{ fontWeight: 'bold' }}>{currentServing.farmer}</Text>
          </Text>
          <Text style={styles.summaryText}>
            {t.crop}: <Text style={{ fontWeight: 'bold' }}>{currentServing.crop}</Text> • {t.expectedWeight}:{' '}
            {currentServing.quantity}
          </Text>
          <Text style={styles.summaryText}>{t.vehicle}: {currentServing.vehicle}</Text>
        </View>
      </KisanCard>

      {/* 2. PARAMETERS INPUT FORM (Section 13) */}
      <KisanCard style={styles.formCard}>
        <Text style={styles.formSectionTitle}>LAB TEST PARAMETERS</Text>

        {/* Moisture % */}
        <View style={styles.inputGroup}>
          <View style={styles.labelRow}>
            <Text style={styles.inputLabel}>{t.moistureLabel}</Text>
            <Text style={styles.toleranceHint}>FAQ Max: 14.0%</Text>
          </View>
          <View style={styles.inputWrapper}>
            <Ionicons name="water-outline" size={20} color={colors.secondary} />
            <TextInput
              style={styles.textInput}
              keyboardType="numeric"
              value={moisture}
              onChangeText={setMoisture}
              placeholder="e.g. 13.5"
            />
            <Text style={styles.unitText}>%</Text>
          </View>
        </View>

        {/* Impurities / Kachra % */}
        <View style={styles.inputGroup}>
          <View style={styles.labelRow}>
            <Text style={styles.inputLabel}>{t.impuritiesLabel}</Text>
            <Text style={styles.toleranceHint}>FAQ Max: 2.0%</Text>
          </View>
          <View style={styles.inputWrapper}>
            <Ionicons name="sparkles-outline" size={20} color="#E65100" />
            <TextInput
              style={styles.textInput}
              keyboardType="numeric"
              value={impurities}
              onChangeText={setImpurities}
              placeholder="e.g. 1.8"
            />
            <Text style={styles.unitText}>%</Text>
          </View>
        </View>

        {/* Foreign Material % */}
        <View style={styles.inputGroup}>
          <View style={styles.labelRow}>
            <Text style={styles.inputLabel}>{t.foreignMatterLabel}</Text>
            <Text style={styles.toleranceHint}>FAQ Max: 0.75%</Text>
          </View>
          <View style={styles.inputWrapper}>
            <Ionicons name="leaf-outline" size={20} color={colors.primary} />
            <TextInput
              style={styles.textInput}
              keyboardType="numeric"
              value={foreignMaterial}
              onChangeText={setForeignMaterial}
              placeholder="e.g. 0.4"
            />
            <Text style={styles.unitText}>%</Text>
          </View>
        </View>

        {/* Damaged Grain % */}
        <View style={styles.inputGroup}>
          <View style={styles.labelRow}>
            <Text style={styles.inputLabel}>{t.damagedGrainLabel}</Text>
            <Text style={styles.toleranceHint}>FAQ Max: 2.0%</Text>
          </View>
          <View style={styles.inputWrapper}>
            <Ionicons name="alert-circle-outline" size={20} color="#C2185B" />
            <TextInput
              style={styles.textInput}
              keyboardType="numeric"
              value={damagedGrain}
              onChangeText={setDamagedGrain}
              placeholder="e.g. 0.8"
            />
            <Text style={styles.unitText}>%</Text>
          </View>
        </View>

        {/* Advisory Box */}
        <View style={styles.advisoryBox}>
          <Ionicons
            name={evaluation.isMspEligible ? 'checkmark-circle' : 'warning'}
            size={18}
            color={evaluation.isMspEligible ? '#2E7D32' : '#C2185B'}
          />
          <Text style={styles.advisoryText}>{evaluation.advisory}</Text>
        </View>
      </KisanCard>

      {/* 3. QUALITY RESULT GRADE (Section 13) */}
      <KisanCard style={styles.gradeCard}>
        <Text style={styles.formSectionTitle}>{t.gradeAssessment}</Text>

        <View style={styles.gradeGrid}>
          {(['Grade A', 'Grade B', 'Grade C', 'Reject'] as MSPGrade[]).map((grade) => {
            const isSelected = selectedGrade === grade;
            const isReject = grade === 'Reject';

            return (
              <TouchableOpacity
                key={grade}
                style={[
                  styles.gradeOption,
                  isSelected && (isReject ? styles.gradeOptionReject : styles.gradeOptionSelected),
                ]}
                onPress={() => setSelectedGrade(grade)}
                activeOpacity={0.8}
              >
                <View
                  style={[
                    styles.radioCircle,
                    isSelected && (isReject ? styles.radioReject : styles.radioActive),
                  ]}
                >
                  {isSelected && <View style={styles.radioInner} />}
                </View>
                <Text
                  style={[
                    styles.gradeLabel,
                    isSelected && { fontWeight: '800' },
                    isReject && isSelected && { color: colors.error },
                  ]}
                >
                  {grade === 'Grade A' ? t.gradeA : grade === 'Grade B' ? t.gradeB : grade === 'Grade C' ? t.gradeC : t.gradeReject}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Remarks Input */}
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>{t.remarksLabel}</Text>
          <TextInput
            style={styles.remarksInput}
            multiline
            numberOfLines={2}
            placeholder="e.g. Grains lustrous, moisture within optimal range. Lot cleared."
            value={remarks}
            onChangeText={setRemarks}
          />
        </View>
      </KisanCard>

      {/* 4. SUBMIT BUTTONS (Section 13) */}
      <View style={styles.actionsRow}>
        <TouchableOpacity
          style={styles.rejectLotBtn}
          onPress={handleRejectLot}
          activeOpacity={0.8}
        >
          <Ionicons name="trash-outline" size={18} color={colors.error} />
          <Text style={styles.rejectLotBtnText}>REJECT LOT</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.saveBtn}
          onPress={handleSaveQuality}
          activeOpacity={0.8}
          disabled={isSubmitting}
        >
          <Ionicons name="checkmark-done" size={18} color="#FFFFFF" />
          <Text style={styles.saveBtnText}>
            {isSubmitting ? '...' : t.confirmQuality}
          </Text>
        </TouchableOpacity>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: spacing.md,
  },
  summaryCard: {
    padding: spacing.md,
    marginBottom: spacing.md,
    backgroundColor: '#FFFFFF',
  },
  summaryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  summaryTokenLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: colors.primary,
    letterSpacing: 0.5,
  },
  summaryToken: {
    fontWeight: '900',
    color: colors.primary,
  },
  summaryDetails: {
    backgroundColor: '#FAFAFA',
    padding: spacing.sm,
    borderRadius: radius.sm,
    gap: 2,
  },
  summaryText: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  formCard: {
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  formSectionTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#616161',
    letterSpacing: 0.5,
    marginBottom: spacing.md,
  },
  inputGroup: {
    marginBottom: spacing.md,
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  toleranceHint: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.secondary,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: spacing.sm,
    backgroundColor: '#FFFFFF',
    height: 48,
    gap: 8,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  unitText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textSecondary,
  },
  advisoryBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F8E9',
    padding: spacing.sm,
    borderRadius: radius.sm,
    gap: 8,
    borderWidth: 1,
    borderColor: '#C5E1A5',
  },
  advisoryText: {
    flex: 1,
    fontSize: 12,
    color: '#33691E',
    fontWeight: '600',
  },
  gradeCard: {
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  gradeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  gradeOption: {
    width: '48%',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: spacing.sm,
    borderRadius: radius.md,
    borderWidth: 1.5,
    borderColor: colors.border,
    backgroundColor: '#FAFAFA',
    gap: 8,
  },
  gradeOptionSelected: {
    borderColor: colors.primary,
    backgroundColor: '#E8F5E9',
  },
  gradeOptionReject: {
    borderColor: colors.error,
    backgroundColor: '#FFEBEE',
  },
  radioCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#9E9E9E',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioActive: {
    borderColor: colors.primary,
  },
  radioReject: {
    borderColor: colors.error,
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.primary,
  },
  gradeLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  remarksInput: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: spacing.sm,
    marginTop: 4,
    fontSize: 13,
    backgroundColor: '#FAFAFA',
    textAlignVertical: 'top',
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: spacing.xl,
  },
  rejectLotBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: radius.md,
    borderWidth: 1.5,
    borderColor: colors.error,
    backgroundColor: '#FFEBEE',
    gap: 6,
  },
  rejectLotBtnText: {
    color: colors.error,
    fontWeight: '800',
    fontSize: 13,
  },
  saveBtn: {
    flex: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: radius.md,
    backgroundColor: colors.primary,
    gap: 6,
  },
  saveBtnText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 13,
  },
});