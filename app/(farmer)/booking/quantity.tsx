import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
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
} from '../../../src/components/common';

export default function BookingQuantityScreen() {
  const router = useRouter();
  const [quantity, setQuantity] = useState('25');
  const mspRate = 2275;
  const numQty = parseFloat(quantity) || 0;
  const estimatedPayout = numQty * mspRate;

  const quickQuantities = [10, 25, 50, 80, 100];

  return (
    <ScreenContainer scrollable style={styles.container}>
      {/* Progress Bar */}
      <View style={styles.progressRow}>
        <View style={[styles.stepDot, styles.completedStep]}><Ionicons name="checkmark" size={14} color="#FFFFFF" /></View>
        <View style={[styles.stepLine, styles.activeLine]} />
        <View style={[styles.stepDot, styles.activeStep]}><Text style={styles.stepNum}>2</Text></View>
        <View style={styles.stepLine} />
        <View style={styles.stepDot}><Text style={styles.stepNumInactive}>3</Text></View>
      </View>
      <Text style={styles.stepTitle}>Step 2 of 3: Enter Expected Quantity</Text>

      <SectionHeader
        title="How much crop are you bringing?"
        subtitle="Enter quantity in Quintals (1 Quintal = 100 kg)"
      />

      <KisanCard style={styles.inputCard}>
        <Text style={styles.inputLabel}>Estimated Harvest / Stock</Text>
        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.textInput}
            value={quantity}
            onChangeText={setQuantity}
            keyboardType="numeric"
            placeholder="0"
          />
          <Text style={styles.unitText}>Quintals</Text>
        </View>

        <Text style={styles.quickLabel}>Quick Select:</Text>
        <View style={styles.quickRow}>
          {quickQuantities.map((q) => (
            <TouchableOpacity
              key={q}
              style={[styles.quickChip, numQty === q && styles.quickChipActive]}
              onPress={() => setQuantity(q.toString())}
            >
              <Text style={[styles.quickChipText, numQty === q && styles.quickChipTextActive]}>
                {q} Qtl
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </KisanCard>

      {/* Estimated Payout Calculator */}
      <SectionHeader title="Estimated Payout Calculation" subtitle="Based on Official MSP ₹2,275 / Qtl" />
      <KisanCard style={styles.payoutCard}>
        <View style={styles.payoutRow}>
          <Text style={styles.payoutLabel}>Quantity</Text>
          <Text style={styles.payoutValue}>{numQty} Quintals</Text>
        </View>
        <View style={styles.payoutRow}>
          <Text style={styles.payoutLabel}>Govt MSP Rate</Text>
          <Text style={styles.payoutValue}>₹{mspRate} / Qtl</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.payoutRowTotal}>
          <Text style={styles.totalLabel}>Estimated Total</Text>
          <Text style={styles.totalValue}>₹{estimatedPayout.toLocaleString()}</Text>
        </View>
        <Text style={styles.disclaimerText}>
          *Final payout will be calculated after digital weighbridge and moisture grading at mandi.
        </Text>
      </KisanCard>

      <View style={styles.nextBtnBox}>
        <KisanButton
          title="Continue to Select Slot →"
          onPress={() => router.push('/(farmer)/booking/slot')}
          variant="primary"
          disabled={numQty <= 0}
        />
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: spacing.md,
  },
  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: spacing.sm,
  },
  stepDot: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#E0E0E0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeStep: {
    backgroundColor: colors.primary,
  },
  completedStep: {
    backgroundColor: colors.primary,
  },
  stepNum: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 12,
  },
  stepNumInactive: {
    color: '#757575',
    fontSize: 12,
  },
  stepLine: {
    width: 40,
    height: 2,
    backgroundColor: '#E0E0E0',
    marginHorizontal: 4,
  },
  activeLine: {
    backgroundColor: colors.primary,
  },
  stepTitle: {
    textAlign: 'center',
    fontSize: 13,
    color: colors.primary,
    fontWeight: 'bold',
    marginBottom: spacing.sm,
  },
  inputCard: {
    marginBottom: spacing.md,
  },
  inputLabel: {
    fontSize: 13,
    color: colors.textSecondary,
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: colors.primary,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    backgroundColor: '#FAFAFA',
    marginBottom: spacing.md,
  },
  textInput: {
    flex: 1,
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.textPrimary,
    paddingVertical: 12,
  },
  unitText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  quickLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 6,
  },
  quickRow: {
    flexDirection: 'row',
    gap: spacing.xs,
  },
  quickChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: radius.sm,
    backgroundColor: '#F5F5F5',
    borderWidth: 1,
    borderColor: colors.border,
  },
  quickChipActive: {
    backgroundColor: '#E8F5E9',
    borderColor: colors.primary,
  },
  quickChipText: {
    fontSize: 12,
    color: colors.textPrimary,
  },
  quickChipTextActive: {
    fontWeight: 'bold',
    color: colors.primary,
  },
  payoutCard: {
    marginBottom: spacing.lg,
    backgroundColor: '#F9FBE7',
  },
  payoutRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  payoutLabel: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  payoutValue: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  divider: {
    height: 1,
    backgroundColor: '#E0E0E0',
    marginVertical: 8,
  },
  payoutRowTotal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  totalLabel: {
    fontSize: 15,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  totalValue: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.primary,
  },
  disclaimerText: {
    fontSize: 11,
    color: colors.textSecondary,
    fontStyle: 'italic',
    marginTop: 4,
  },
  nextBtnBox: {
    marginBottom: spacing.xl,
  },
});