import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
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
  KisanButton,
} from '../../../src/components/common';

export default function FarmerProcurementDetailScreen() {
  const router = useRouter();
  const { transactionId } = useLocalSearchParams();

  return (
    <ScreenContainer scrollable style={styles.container}>
      {/* Header Info */}
      <KisanCard style={styles.headerCard}>
        <View style={styles.topRow}>
          <View>
            <Text style={styles.idText}>Transaction: {transactionId || 'KM-2026-00042'}</Text>
            <Text style={styles.cropTitle}>Wheat (25 Quintals)</Text>
          </View>
          <StatusBadge status="IN_PROGRESS" variant="info" />
        </View>
        <Text style={styles.centreText}>📍 Bhopal Krishi Upaj Mandi • Gate #2</Text>
      </KisanCard>

      {/* Complete Step-by-Step Journey Stepper */}
      <SectionHeader
        title="Complete Procurement Journey"
        subtitle="Live status from gate arrival to bank payment"
      />

      <KisanCard style={styles.stepperCard}>
        {/* Step 1: Booked */}
        <View style={styles.stepItem}>
          <View style={styles.iconCol}>
            <View style={[styles.stepCircle, styles.stepCompleted]}>
              <Ionicons name="checkmark" size={16} color="#FFFFFF" />
            </View>
            <View style={[styles.line, styles.lineCompleted]} />
          </View>
          <View style={styles.stepDetails}>
            <Text style={styles.stepTitleDone}>1. Slot Booked & Token Issued</Text>
            <Text style={styles.stepTime}>02 Sep, 09:15 AM • Token #42</Text>
          </View>
        </View>

        {/* Step 2: Check-in */}
        <View style={styles.stepItem}>
          <View style={styles.iconCol}>
            <View style={[styles.stepCircle, styles.stepCompleted]}>
              <Ionicons name="checkmark" size={16} color="#FFFFFF" />
            </View>
            <View style={[styles.line, styles.lineCompleted]} />
          </View>
          <View style={styles.stepDetails}>
            <Text style={styles.stepTitleDone}>2. Mandi Gate Check-in</Text>
            <Text style={styles.stepTime}>02 Sep, 10:10 AM • Verified by Gate Officer</Text>
          </View>
        </View>

        {/* Step 3: Weighing */}
        <View style={styles.stepItem}>
          <View style={styles.iconCol}>
            <View style={[styles.stepCircle, styles.stepCompleted]}>
              <Ionicons name="checkmark" size={16} color="#FFFFFF" />
            </View>
            <View style={[styles.line, styles.lineActive]} />
          </View>
          <View style={styles.stepDetails}>
            <Text style={styles.stepTitleDone}>3. Electronic Weighbridge</Text>
            <Text style={styles.stepTime}>Gross: 32.4 Qtl • Tare: 7.4 Qtl • Net: 25.0 Qtl</Text>
          </View>
        </View>

        {/* Step 4: Quality Check */}
        <View style={styles.stepItem}>
          <View style={styles.iconCol}>
            <View style={[styles.stepCircle, styles.stepActive]}>
              <Ionicons name="ellipse" size={12} color="#FFFFFF" />
            </View>
            <View style={styles.line} />
          </View>
          <View style={styles.stepDetails}>
            <Text style={styles.stepTitleActive}>4. Quality Lab Inspection</Text>
            <Text style={styles.stepSubActive}>Grade A • Moisture: 11.2% (Passed)</Text>
          </View>
        </View>

        {/* Step 5: Procurement */}
        <View style={styles.stepItem}>
          <View style={styles.iconCol}>
            <View style={styles.stepCircle}>
              <Text style={styles.pendingNum}>5</Text>
            </View>
            <View style={styles.line} />
          </View>
          <View style={styles.stepDetails}>
            <Text style={styles.stepTitlePending}>5. Procurement Acceptance</Text>
            <Text style={styles.stepTime}>Rate: ₹2,275/Qtl • Accepted: 25.0 Qtl</Text>
          </View>
        </View>

        {/* Step 6: Receipt */}
        <View style={styles.stepItem}>
          <View style={styles.iconCol}>
            <View style={styles.stepCircle}>
              <Text style={styles.pendingNum}>6</Text>
            </View>
            <View style={styles.line} />
          </View>
          <View style={styles.stepDetails}>
            <Text style={styles.stepTitlePending}>6. Digital Procurement Receipt</Text>
            <Text style={styles.stepTime}>Official signed receipt generation</Text>
          </View>
        </View>

        {/* Step 7: Payment */}
        <View style={styles.stepItem}>
          <View style={styles.iconCol}>
            <View style={styles.stepCircle}>
              <Text style={styles.pendingNum}>7</Text>
            </View>
          </View>
          <View style={styles.stepDetails}>
            <Text style={styles.stepTitlePending}>7. Direct DBT Bank Transfer</Text>
            <Text style={styles.stepTime}>₹56,875 to State Bank of India (A/C ••5678)</Text>
          </View>
        </View>
      </KisanCard>

      {/* Quick Navigation to Receipt & Payment */}
      <View style={styles.actionRow}>
        <TouchableOpacity
          style={styles.btnSecondary}
          onPress={() => router.push('/(farmer)/procurement/receipt' as any)}
        >
          <Ionicons name="receipt-outline" size={18} color={colors.primary} />
          <Text style={styles.btnSecondaryText}>View Digital Receipt</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.btnPrimary}
          onPress={() => router.push(`/(farmer)/payment/${transactionId || 'KM-2026-00042'}` as any)}
        >
          <Ionicons name="cash-outline" size={18} color="#FFFFFF" />
          <Text style={styles.btnPrimaryText}>Track Payment</Text>
        </TouchableOpacity>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: spacing.md,
  },
  headerCard: {
    marginBottom: spacing.md,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  idText: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  cropTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  centreText: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 4,
  },
  stepperCard: {
    paddingVertical: spacing.md,
    marginBottom: spacing.lg,
  },
  stepItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  iconCol: {
    alignItems: 'center',
    width: 32,
  },
  stepCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#E0E0E0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepCompleted: {
    backgroundColor: colors.primary,
  },
  stepActive: {
    backgroundColor: colors.secondary,
  },
  pendingNum: {
    fontSize: 11,
    color: '#757575',
    fontWeight: 'bold',
  },
  line: {
    width: 2,
    height: 36,
    backgroundColor: '#E0E0E0',
    marginVertical: 2,
  },
  lineCompleted: {
    backgroundColor: colors.primary,
  },
  lineActive: {
    backgroundColor: colors.secondary,
  },
  stepDetails: {
    flex: 1,
    marginLeft: spacing.sm,
    paddingBottom: 20,
  },
  stepTitleDone: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.primary,
  },
  stepTitleActive: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.secondary,
  },
  stepTitlePending: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  stepTime: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  stepSubActive: {
    fontSize: 12,
    color: colors.secondary,
    fontWeight: '500',
    marginTop: 2,
  },
  actionRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.xl,
  },
  btnSecondary: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 12,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.primary,
    backgroundColor: '#E8F5E9',
  },
  btnSecondaryText: {
    fontSize: 13,
    fontWeight: 'bold',
    color: colors.primary,
    marginLeft: 4,
  },
  btnPrimary: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 12,
    borderRadius: radius.md,
    backgroundColor: colors.primary,
  },
  btnPrimaryText: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginLeft: 4,
  },
});