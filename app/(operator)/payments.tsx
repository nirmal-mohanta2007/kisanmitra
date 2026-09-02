import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../src/theme/colors';
import { spacing } from '../../src/theme/spacing';
import { radius } from '../../src/theme/radius';
import {
  ScreenContainer,
  KisanCard,
  SectionHeader,
  StatusBadge,
} from '../../src/components/common';
import { MOCK_TRANSACTIONS } from '../../src/services/mock-data.service';

export default function OperatorPaymentsScreen() {
  const router = useRouter();

  return (
    <ScreenContainer scrollable style={styles.container}>
      <SectionHeader
        title="Today's DBT Payment Batches"
        subtitle="PFMS transmission status for completed transactions"
      />

      {/* Summary KPI */}
      <View style={styles.kpiRow}>
        <KisanCard style={styles.kpiBox}>
          <Text style={styles.kpiLabel}>Total Disbursed</Text>
          <Text style={styles.kpiValue}>₹14.2 Lakh</Text>
          <Text style={styles.kpiSub}>Today</Text>
        </KisanCard>

        <KisanCard style={styles.kpiBox}>
          <Text style={styles.kpiLabel}>Pending Clearance</Text>
          <Text style={[styles.kpiValue, { color: colors.warning }]}>4 Batches</Text>
          <Text style={styles.kpiSub}>In bank transit</Text>
        </KisanCard>
      </View>

      <SectionHeader title="Transaction Payout List" />
      {MOCK_TRANSACTIONS.map((tx) => (
        <KisanCard key={tx.id} style={styles.paymentCard}>
          <View style={styles.header}>
            <View>
              <Text style={styles.txId}>{tx.id}</Text>
              <Text style={styles.farmerName}>{tx.farmerName}</Text>
            </View>
            <StatusBadge status="PAYMENT INITIATED" variant="warning" />
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.cropText}>🌾 {tx.crop} • {tx.expectedQuantity} Qtl</Text>
            <Text style={styles.amountText}>₹{(tx.procurementAmount || 56875).toLocaleString()}</Text>
          </View>

          <View style={styles.bankRow}>
            <Text style={styles.bankText}>🏛 State Bank of India •••• 5678</Text>
            <Text style={styles.dateText}>{tx.bookingDate}</Text>
          </View>
        </KisanCard>
      ))}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: spacing.md,
  },
  kpiRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  kpiBox: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: spacing.md,
  },
  kpiLabel: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  kpiValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.primary,
    marginVertical: 4,
  },
  kpiSub: {
    fontSize: 11,
    color: colors.textSecondary,
  },
  paymentCard: {
    marginBottom: spacing.sm,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  txId: {
    fontSize: 11,
    color: colors.textSecondary,
  },
  farmerName: {
    fontSize: 15,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 4,
  },
  cropText: {
    fontSize: 13,
    color: colors.textPrimary,
  },
  amountText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: colors.primary,
  },
  bankRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#F5F5F5',
    paddingTop: 6,
    marginTop: 4,
  },
  bankText: {
    fontSize: 11,
    color: colors.textSecondary,
  },
  dateText: {
    fontSize: 11,
    color: colors.textSecondary,
  },
});