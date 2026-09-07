import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Alert, TouchableOpacity, Platform } from 'react-native';
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
import { weighingService } from '../../../src/services/weighingService';
import { getOperatorTexts } from '../../../src/i18n/operator-translations';

export default function OperatorWeighingScreen() {
  const router = useRouter();
  const { txId } = useLocalSearchParams<{ txId?: string }>();
  const { state } = useAppContext();
  const scale = state.textScale || 1.0;
  const t = getOperatorTexts(state.language);

  const { currentServing, currentOperator, confirmWeight } = useOperatorStore();

  // Section 14 Weight Inputs
  const [loadedWeight, setLoadedWeight] = useState('1520'); // Loaded Trolley Weight (kg)
  const [emptyWeight, setEmptyWeight] = useState('420');   // Empty Trolley Weight (kg)
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loaded = parseFloat(loadedWeight) || 0;
  const empty = parseFloat(emptyWeight) || 0;
  const netWeightKg = Math.max(0, loaded - empty);
  const netWeightQtl = Number((netWeightKg / 100).toFixed(2));

  const currentTimeString = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  // Capture Weight (IoT sensor sync simulation)
  const handleCaptureWeight = async () => {
    const reading = await weighingService.simulateIoTSensorReading('WB-02');
    setLoadedWeight(reading.loadedKg.toString());
    setEmptyWeight(reading.emptyKg.toString());
    Alert.alert(
      'IoT Weighbridge Sensor Synced ✓',
      `Electronic scale reading captured from Weighbridge WB-02.\nGross: ${reading.loadedKg} kg, Tare: ${reading.emptyKg} kg.`
    );
  };

  // Confirm Weight with strict validations
  const handleConfirmWeight = async () => {
    const validation = weighingService.calculateNetWeight(loaded, empty);
    if (!validation.isValid) {
      Alert.alert('Validation Error', validation.errorMessage || 'Invalid weight readings.');
      return;
    }

    setIsSubmitting(true);
    try {
      await confirmWeight(currentServing.token, {
        weighbridgeId: 'WB-02',
        grossWeightKg: loaded,
        tareWeightKg: empty,
        netWeightKg,
        netWeightQtl,
        vehicleNumber: currentServing.vehicle,
        timestamp: new Date().toISOString(),
        operatorId: currentOperator.operatorId,
        isCalibrated: true,
      });

      if (Platform.OS === 'web') {
        if (typeof window !== 'undefined') {
          window.alert(
            `Weight Confirmed Successfully ✓\nNet Crop Weight: ${netWeightKg} kg (${netWeightQtl} Quintals) confirmed at Weighbridge WB-02.\nProceeding to Final Procurement Settlement.`
          );
        }
        router.push(
          `/(operator)/operations/procurement?txId=${txId || currentServing.transactionId || 'TX-2026-001'}` as any
        );
      } else {
        Alert.alert(
          'Weight Confirmed Successfully ✓',
          `Net Crop Weight: ${netWeightKg} kg (${netWeightQtl} Quintals) confirmed at Weighbridge WB-02.\nState: WEIGHING → COMPLETED → PROCUREMENT`,
          [
            {
              text: 'Proceed to Final Procurement ›',
              onPress: () =>
                router.push(
                  `/(operator)/operations/procurement?txId=${txId || currentServing.transactionId || 'TX-2026-001'}` as any
                ),
            },
          ]
        );
      }
    } catch {
      Alert.alert('Error', 'Unable to record weighbridge reading.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ScreenContainer scrollable style={styles.container}>
      <SubScreenHeader
        title={t.weighingTitle}
        subtitle={t.weighingSub}
      />

      {/* 1. TRANSACTION & VEHICLE IDENTIFIER CARD (Section 14) */}
      <KisanCard style={styles.identifierCard}>
        <View style={styles.idRow}>
          <View>
            <Text style={styles.idLabel}>{t.currentToken}</Text>
            <Text style={[styles.idToken, { fontSize: 20 * scale }]}>
              {currentServing.token}
            </Text>
          </View>
          <StatusBadge status="WEIGHING" />
        </View>

        <View style={styles.detailsRow}>
          <Text style={styles.detailText}>
            {t.farmer}: <Text style={{ fontWeight: 'bold' }}>{currentServing.farmer}</Text>
          </Text>
          <Text style={styles.detailText}>
            {t.vehicle}: <Text style={{ fontWeight: 'bold' }}>{currentServing.vehicle}</Text>
          </Text>
          <Text style={styles.detailText}>
            {t.crop}: 🌾 {currentServing.crop} • {t.expectedWeight}: {currentServing.quantity}
          </Text>
        </View>
      </KisanCard>

      {/* 2. SCALE WEIGHT INPUTS (Section 14) */}
      <KisanCard style={styles.weightsCard}>
        <Text style={styles.sectionTitle}>SCALE MEASUREMENTS (WB-02)</Text>

        {/* Loaded Trolley Weight */}
        <View style={styles.weightInputGroup}>
          <Text style={styles.inputLabel}>{t.grossWeightTitle}</Text>
          <View style={styles.inputWrapper}>
            <Ionicons name="bus" size={20} color="#E65100" />
            <TextInput
              style={styles.weightInput}
              keyboardType="numeric"
              value={loadedWeight}
              onChangeText={setLoadedWeight}
              placeholder="e.g. 1520"
            />
            <Text style={styles.unitText}>{t.kgUnit}</Text>
          </View>
        </View>

        {/* Empty Trolley Weight */}
        <View style={styles.weightInputGroup}>
          <Text style={styles.inputLabel}>{t.tareWeightTitle}</Text>
          <View style={styles.inputWrapper}>
            <Ionicons name="cube-outline" size={20} color={colors.secondary} />
            <TextInput
              style={styles.weightInput}
              keyboardType="numeric"
              value={emptyWeight}
              onChangeText={setEmptyWeight}
              placeholder="e.g. 420"
            />
            <Text style={styles.unitText}>{t.kgUnit}</Text>
          </View>
        </View>

        {/* Automatically Calculated Net Crop Weight (Section 14) */}
        <View style={styles.netResultBox}>
          <View style={styles.netHeader}>
            <Text style={styles.netHeaderLabel}>{t.netWeightLabel}</Text>
            <Text style={styles.netFormula}>
              {loaded} {t.kgUnit} - {empty} {t.kgUnit} = {netWeightKg} {t.kgUnit}
            </Text>
          </View>

          <View style={styles.netValuesRow}>
            <View>
              <Text style={[styles.netKgValue, { fontSize: 28 * scale }]}>
                {netWeightKg}{' '}
                <Text style={{ fontSize: 16, color: colors.primary }}>{t.kgUnit}</Text>
              </Text>
            </View>
            <View style={styles.quintalBadge}>
              <Text style={styles.quintalBadgeText}>{netWeightQtl} {t.qtlUnit}</Text>
            </View>
          </View>
        </View>

        {/* Weighbridge Metadata */}
        <View style={styles.metaBox}>
          <View style={styles.metaItem}>
            <Text style={styles.metaLabel}>WEIGHBRIDGE ID</Text>
            <Text style={styles.metaVal}>WB-02 (Pitless)</Text>
          </View>
          <View style={styles.metaItem}>
            <Text style={styles.metaLabel}>OPERATOR</Text>
            <Text style={styles.metaVal}>{currentOperator.name}</Text>
          </View>
          <View style={styles.metaItem}>
            <Text style={styles.metaLabel}>TIMESTAMP</Text>
            <Text style={styles.metaVal}>{currentTimeString}</Text>
          </View>
        </View>
      </KisanCard>

      {/* 3. BUTTONS (Section 14) */}
      <View style={styles.actionRow}>
        <TouchableOpacity
          style={styles.captureBtn}
          onPress={handleCaptureWeight}
          activeOpacity={0.8}
        >
          <Ionicons name="hardware-chip-outline" size={18} color={colors.secondary} />
          <Text style={styles.captureBtnText}>{t.iotSensorSync}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.confirmBtn, loaded < empty && styles.btnDisabled]}
          onPress={handleConfirmWeight}
          activeOpacity={0.8}
          disabled={isSubmitting}
        >
          <Ionicons name="checkmark-circle" size={18} color="#FFFFFF" />
          <Text style={styles.confirmBtnText}>
            {isSubmitting ? '...' : t.confirmWeighing}
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
  identifierCard: {
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  idRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  idLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: colors.primary,
    letterSpacing: 0.5,
  },
  idToken: {
    fontWeight: '900',
    color: colors.primary,
  },
  detailsRow: {
    backgroundColor: '#FAFAFA',
    padding: spacing.sm,
    borderRadius: radius.sm,
    gap: 4,
  },
  detailText: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  weightsCard: {
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#616161',
    letterSpacing: 0.5,
    marginBottom: spacing.md,
  },
  weightInputGroup: {
    marginBottom: spacing.md,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 4,
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
  weightInput: {
    flex: 1,
    fontSize: 18,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  unitText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textSecondary,
  },
  netResultBox: {
    backgroundColor: '#E8F5E9',
    borderRadius: radius.md,
    padding: spacing.md,
    borderWidth: 1.5,
    borderColor: '#A5D6A7',
    marginVertical: spacing.sm,
  },
  netHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  netHeaderLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: '#2E7D32',
    letterSpacing: 0.5,
  },
  netFormula: {
    fontSize: 11,
    color: '#388E3C',
    fontWeight: '600',
  },
  netValuesRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  netKgValue: {
    fontWeight: '900',
    color: '#1B5E20',
  },
  quintalBadge: {
    backgroundColor: '#2E7D32',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: radius.round,
  },
  quintalBadgeText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
  },
  metaBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#F5F5F5',
    padding: spacing.sm,
    borderRadius: radius.sm,
    marginTop: spacing.md,
  },
  metaItem: {
    alignItems: 'center',
  },
  metaLabel: {
    fontSize: 9,
    fontWeight: '700',
    color: '#757575',
    marginBottom: 2,
  },
  metaVal: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  actionRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: spacing.xl,
  },
  captureBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: radius.md,
    borderWidth: 1.5,
    borderColor: colors.secondary,
    backgroundColor: '#E3F2FD',
    gap: 6,
  },
  captureBtnText: {
    color: colors.secondary,
    fontWeight: '800',
    fontSize: 12,
  },
  confirmBtn: {
    flex: 1.5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: radius.md,
    backgroundColor: colors.primary,
    gap: 6,
  },
  confirmBtnText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 13,
  },
  btnDisabled: {
    opacity: 0.5,
  },
});