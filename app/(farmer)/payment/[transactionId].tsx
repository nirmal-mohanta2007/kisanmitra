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

export default function FarmerPaymentScreen() {
  const router = useRouter();
  const { transactionId } = useLocalSearchParams();

  return (
    <ScreenContainer scrollable style={styles.container}>
      {/* Payment Amount Hero Card */}
      <KisanCard style={styles.amountCard}>
        <Text style={styles.amountHeroSub}>Direct Benefit Transfer (DBT)</Text>
        <Text style={styles.amountHeroValue}>₹56,875.00</Text>
        <View style={styles.badgeBox}>
          <StatusBadge status="PAYMENT PROCESSING" variant="warning" />
        </View>
        <Text style={styles.accountText}>
          Crediting to: State Bank of India (A/C •••• •••• 5678)
        </Text>
      </KisanCard>

      {/* Payment Processing Timeline */}
      <SectionHeader
        title="Payment Status Timeline"
        subtitle="Government treasury disbursement milestones"
      />
      <KisanCard style={styles.timelineCard}>
        <View style={styles.step}>
          <View style={styles.stepLeft}>
            <View style={[styles.circle, styles.circleDone]}>
              <Ionicons name="checkmark" size={14} color="#FFFFFF" />
            </View>
            <View style={[styles.line, styles.lineDone]} />
          </View>
          <View style={styles.stepRight}>
            <Text style={styles.stepTitleDone}>Procurement Verified & Approved</Text>
            <Text style={styles.stepDesc}>Weight slip and quality grading authenticated</Text>
            <Text style={styles.stepTimestamp}>02 Sep 2026, 11:35 AM</Text>
          </View>
        </View>

        <View style={styles.step}>
          <View style={styles.stepLeft}>
            <View style={[styles.circle, styles.circleDone]}>
              <Ionicons name="checkmark" size={14} color="#FFFFFF" />
            </View>
            <View style={[styles.line, styles.lineActive]} />
          </View>
          <View style={styles.stepRight}>
            <Text style={styles.stepTitleDone}>Payment Order Generated</Text>
            <Text style={styles.stepDesc}>Ref: PFMS-MP-2026-98129482</Text>
            <Text style={styles.stepTimestamp}>02 Sep 2026, 12:00 PM</Text>
          </View>
        </View>

        <View style={styles.step}>
          <View style={styles.stepLeft}>
            <View style={[styles.circle, styles.circleActive]}>
              <Ionicons name="sync" size={14} color="#FFFFFF" />
            </View>
            <View style={styles.line} />
          </View>
          <View style={styles.stepRight}>
            <Text style={styles.stepTitleActive}>Bank Processing (PFMS / NPCI)</Text>
            <Text style={styles.stepDescActive}>Clearing through National Automated Clearing House</Text>
            <Text style={styles.stepTimestamp}>Expected within 24-48 hours</Text>
          </View>
        </View>

        <View style={styles.step}>
          <View style={styles.stepLeft}>
            <View style={styles.circle}>
              <Text style={styles.pendingNum}>4</Text>
            </View>
          </View>
          <View style={styles.stepRight}>
            <Text style={styles.stepTitlePending}>Credited to Farmer Account</Text>
            <Text style={styles.stepDesc}>SMS confirmation will be sent to registered mobile</Text>
          </View>
        </View>
      </KisanCard>

      {/* Bank & Reference Details */}
      <SectionHeader title="Transaction Reference Details" />
      <KisanCard style={styles.card}>
        <View style={styles.row}>
          <Text style={styles.label}>Transaction ID:</Text>
          <Text style={styles.value}>{transactionId || 'KM-2026-00042'}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>PFMS Reference:</Text>
          <Text style={styles.value}>PFMS-MP-98129482</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Beneficiary Name:</Text>
          <Text style={styles.value}>Ramesh Nayak</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Aadhaar Linked Bank:</Text>
          <Text style={styles.value}>State Bank of India</Text>
        </View>
      </KisanCard>

      {/* Support / Grievance Button */}
      <TouchableOpacity
        style={styles.helpBtn}
        onPress={() => router.push('/(farmer)/support/create-issue')}
      >
        <Ionicons name="call-outline" size={18} color={colors.primary} />
        <Text style={styles.helpBtnText}>Payment Delayed? Raise an Issue</Text>
      </TouchableOpacity>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: spacing.md,
  },
  amountCard: {
    backgroundColor: '#F1F8E9',
    alignItems: 'center',
    paddingVertical: spacing.lg,
    borderWidth: 1.5,
    borderColor: colors.primary,
    marginBottom: spacing.md,
  },
  amountHeroSub: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  amountHeroValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.primary,
    marginVertical: 4,
  },
  badgeBox: {
    marginVertical: 4,
  },
  accountText: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 4,
  },
  timelineCard: {
    marginBottom: spacing.md,
  },
  step: {
    flexDirection: 'row',
  },
  stepLeft: {
    alignItems: 'center',
    width: 30,
  },
  circle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#E0E0E0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  circleDone: {
    backgroundColor: colors.primary,
  },
  circleActive: {
    backgroundColor: colors.accent,
  },
  pendingNum: {
    fontSize: 10,
    color: '#757575',
    fontWeight: 'bold',
  },
  line: {
    width: 2,
    height: 40,
    backgroundColor: '#E0E0E0',
    marginVertical: 2,
  },
  lineDone: {
    backgroundColor: colors.primary,
  },
  lineActive: {
    backgroundColor: colors.accent,
  },
  stepRight: {
    flex: 1,
    marginLeft: spacing.sm,
    paddingBottom: 16,
  },
  stepTitleDone: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.primary,
  },
  stepTitleActive: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.accent,
  },
  stepTitlePending: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  stepDesc: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  stepDescActive: {
    fontSize: 12,
    color: colors.textPrimary,
    fontWeight: '500',
    marginTop: 2,
  },
  stepTimestamp: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 2,
  },
  card: {
    marginBottom: spacing.md,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  },
  label: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  value: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  helpBtn: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.md,
    backgroundColor: '#E8F5E9',
    borderRadius: radius.md,
    marginTop: spacing.sm,
    marginBottom: spacing.xl,
  },
  helpBtnText: {
    fontSize: 13,
    fontWeight: 'bold',
    color: colors.primary,
    marginLeft: 6,
  },
});