import React from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { useRouter } from 'expo-router';
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

export default function OperatorProcurementScreen() {
  const router = useRouter();

  const handleCompleteProcurement = () => {
    Alert.alert('Procurement Completed! 🎉', 'Official Receipt generated and DBT payment order forwarded to PFMS Treasury.', [
      { text: 'View Completed Queue', onPress: () => router.replace('/(operator)/queue') },
    ]);
  };

  return (
    <ScreenContainer scrollable style={styles.container}>
      <SectionHeader
        title="Procurement Final Settlement"
        subtitle="Review verified figures before generating digital receipt"
      />

      {/* Settlement Summary Hero */}
      <KisanCard style={styles.settlementCard}>
        <Text style={styles.heroSub}>TOTAL DBT PAYOUT AMOUNT</Text>
        <Text style={styles.heroAmount}>₹56,875.00</Text>
        <Text style={styles.heroFarmer}>Payable to: Ramesh Nayak (F-001)</Text>
      </KisanCard>

      {/* Calculation Breakdown */}
      <SectionHeader title="Settlement Breakdown" />
      <KisanCard style={styles.card}>
        <View style={styles.row}>
          <Text style={styles.label}>Commodity:</Text>
          <Text style={styles.value}>Wheat (Grade A Standard)</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Accepted Net Quantity:</Text>
          <Text style={styles.value}>25.00 Quintals</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Govt MSP Procurement Rate:</Text>
          <Text style={styles.value}>₹2,275.00 / Qtl</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Quality Moisture Deduction:</Text>
          <Text style={styles.value}>₹0.00 (Nil)</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Gross Settlement Payout:</Text>
          <Text style={styles.totalValue}>₹56,875.00</Text>
        </View>
      </KisanCard>

      {/* Direct Bank Account */}
      <SectionHeader title="Beneficiary DBT Details" />
      <KisanCard style={styles.card}>
        <View style={styles.bankRow}>
          <Ionicons name="business" size={24} color={colors.primary} />
          <View style={{ flex: 1, marginLeft: 10 }}>
            <Text style={styles.bankName}>State Bank of India</Text>
            <Text style={styles.accountNo}>Account: •••• •••• 5678 (Aadhaar Seeded)</Text>
          </View>
          <StatusBadge status="ACTIVE DBT" variant="success" />
        </View>
      </KisanCard>

      <View style={styles.btnBox}>
        <KisanButton
          title="Complete Procurement & Issue Slip"
          onPress={handleCompleteProcurement}
          variant="primary"
        />
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: spacing.md,
  },
  settlementCard: {
    backgroundColor: '#E8F5E9',
    alignItems: 'center',
    paddingVertical: spacing.lg,
    borderWidth: 2,
    borderColor: colors.primary,
    marginBottom: spacing.md,
  },
  heroSub: {
    fontSize: 11,
    fontWeight: 'bold',
    color: colors.primaryDark,
    letterSpacing: 0.5,
  },
  heroAmount: {
    fontSize: 34,
    fontWeight: 'bold',
    color: colors.primary,
    marginVertical: 4,
  },
  heroFarmer: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  card: {
    marginBottom: spacing.md,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
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
  divider: {
    height: 1,
    backgroundColor: '#EEEEEE',
    marginVertical: 8,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  totalValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.primary,
  },
  bankRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  bankName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  accountNo: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  btnBox: {
    marginVertical: spacing.lg,
    marginBottom: spacing.xl,
  },
});