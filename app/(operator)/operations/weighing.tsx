import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Alert, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../../src/theme/colors';
import { spacing } from '../../../src/theme/spacing';
import { radius } from '../../../src/theme/radius';
import {
  ScreenContainer,
  KisanCard,
  SectionHeader,
  KisanButton,
  StatusBadge,
} from '../../../src/components/common';

export default function OperatorWeighingScreen() {
  const router = useRouter();
  const [grossWeight, setGrossWeight] = useState('32.40');
  const [tareWeight, setTareWeight] = useState('7.40');

  const gross = parseFloat(grossWeight) || 0;
  const tare = parseFloat(tareWeight) || 0;
  const net = Math.max(0, gross - tare);

  const handleCaptureGross = () => {
    setGrossWeight('32.40');
  };

  const handleCaptureTare = () => {
    setTareWeight('7.40');
  };

  const handleConfirmWeighing = () => {
    Alert.alert('Weighment Recorded', `Net weight of ${net.toFixed(2)} Quintals recorded for Token #42.`, [
      { text: 'Proceed to Quality Check', onPress: () => router.push('/(operator)/operations/quality-check') },
    ]);
  };

  return (
    <ScreenContainer scrollable style={styles.container}>
      <SectionHeader
        title="Electronic Weighbridge Station"
        subtitle="Live automated IoT weighbridge capture for Token #42"
      />

      {/* Net Weight Display Hero */}
      <KisanCard style={styles.netWeightCard}>
        <Text style={styles.netWeightLabel}>CALCULATED NET CROP WEIGHT</Text>
        <Text style={styles.netWeightValue}>{net.toFixed(2)} Quintals</Text>
        <Text style={styles.netWeightKg}>= {(net * 100).toFixed(0)} Kilograms</Text>
      </KisanCard>

      {/* Gross Weight Capture */}
      <KisanCard style={styles.card}>
        <View style={styles.captureHeader}>
          <Text style={styles.captureTitle}>1. Gross Weight (Loaded Vehicle)</Text>
          <TouchableOpacity style={styles.autoCaptureBtn} onPress={handleCaptureGross}>
            <Ionicons name="hardware-chip-outline" size={14} color={colors.primary} />
            <Text style={styles.autoCaptureText}>IoT Sensor Sync</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.input}
            value={grossWeight}
            onChangeText={setGrossWeight}
            keyboardType="numeric"
          />
          <Text style={styles.unitText}>Quintals</Text>
        </View>
      </KisanCard>

      {/* Tare Weight Capture */}
      <KisanCard style={styles.card}>
        <View style={styles.captureHeader}>
          <Text style={styles.captureTitle}>2. Tare Weight (Empty Vehicle)</Text>
          <TouchableOpacity style={styles.autoCaptureBtn} onPress={handleCaptureTare}>
            <Ionicons name="hardware-chip-outline" size={14} color={colors.primary} />
            <Text style={styles.autoCaptureText}>IoT Sensor Sync</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.input}
            value={tareWeight}
            onChangeText={setTareWeight}
            keyboardType="numeric"
          />
          <Text style={styles.unitText}>Quintals</Text>
        </View>
      </KisanCard>

      {/* Expected vs Actual comparison */}
      <KisanCard style={styles.comparisonCard}>
        <View style={styles.compRow}>
          <Text style={styles.compLabel}>Booked / Expected Quantity:</Text>
          <Text style={styles.compValue}>25.00 Qtl</Text>
        </View>
        <View style={styles.compRow}>
          <Text style={styles.compLabel}>Actual Measured Net Weight:</Text>
          <Text style={styles.compValue}>{net.toFixed(2)} Qtl</Text>
        </View>
        <View style={styles.compRow}>
          <Text style={styles.compLabel}>Variance:</Text>
          <Text style={[styles.compValue, { color: colors.primary }]}>0.00% (Within 5% Tolerance)</Text>
        </View>
      </KisanCard>

      <View style={styles.btnBox}>
        <KisanButton
          title="Save & Proceed to Quality Check →"
          onPress={handleConfirmWeighing}
          variant="primary"
          disabled={net <= 0}
        />
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: spacing.md,
  },
  netWeightCard: {
    backgroundColor: '#E8F5E9',
    alignItems: 'center',
    paddingVertical: spacing.lg,
    borderWidth: 2,
    borderColor: colors.primary,
    marginBottom: spacing.md,
  },
  netWeightLabel: {
    fontSize: 11,
    fontWeight: 'bold',
    color: colors.primaryDark,
    letterSpacing: 0.5,
  },
  netWeightValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.primary,
    marginVertical: 4,
  },
  netWeightKg: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  card: {
    marginBottom: spacing.md,
  },
  captureHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  captureTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  autoCaptureBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    backgroundColor: '#E8F5E9',
  },
  autoCaptureText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: colors.primary,
    marginLeft: 4,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.sm,
    paddingHorizontal: spacing.md,
    backgroundColor: '#FAFAFA',
  },
  input: {
    flex: 1,
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.textPrimary,
    paddingVertical: 8,
  },
  unitText: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  comparisonCard: {
    backgroundColor: '#F5F7FA',
    marginBottom: spacing.lg,
  },
  compRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  compLabel: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  compValue: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  btnBox: {
    marginBottom: spacing.xl,
  },
});