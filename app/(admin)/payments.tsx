import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
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

export default function AdminPaymentsScreen() {
  return (
    <ScreenContainer scrollable style={styles.container}>
      <SectionHeader
        title="Statewide DBT Payment Oversight"
        subtitle="Treasury disbursement clearing and settlement monitor"
      />

      {/* 4 Status Buckets (Section 11: Pending, Processing, Completed, Failed) */}
      <View style={styles.kpiGrid}>
        <KisanCard style={styles.kpiCard}>
          <Text style={styles.kpiLabel}>Pending Approval</Text>
          <Text style={[styles.kpiVal, { color: colors.warning }]}>18</Text>
          <Text style={styles.kpiSub}>₹10.2 Lakh</Text>
        </KisanCard>

        <KisanCard style={styles.kpiCard}>
          <Text style={styles.kpiLabel}>Processing (PFMS)</Text>
          <Text style={[styles.kpiVal, { color: colors.secondary }]}>42</Text>
          <Text style={styles.kpiSub}>₹23.8 Lakh</Text>
        </KisanCard>

        <KisanCard style={styles.kpiCard}>
          <Text style={styles.kpiLabel}>Completed (DBT)</Text>
          <Text style={[styles.kpiVal, { color: colors.primary }]}>804</Text>
          <Text style={styles.kpiSub}>₹4.55 Crore</Text>
        </KisanCard>

        <KisanCard style={styles.kpiCard}>
          <Text style={styles.kpiLabel}>Failed / Bounced</Text>
          <Text style={[styles.kpiVal, { color: colors.error }]}>2</Text>
          <Text style={styles.kpiSub}>Aadhaar Mismatch</Text>
        </KisanCard>
      </View>

      <SectionHeader title="Recent Payment Dispatches" />
      {MOCK_TRANSACTIONS.map((tx) => (
        <KisanCard key={tx.id} style={styles.txCard}>
          <View style={styles.txHeader}>
            <View>
              <Text style={styles.txId}>{tx.id}</Text>
              <Text style={styles.farmerName}>{tx.farmerName}</Text>
            </View>
            <StatusBadge status="COMPLETED" variant="success" />
          </View>
          <View style={styles.txDetails}>
            <Text style={styles.centreText}>📍 {tx.centreName}</Text>
            <Text style={styles.amountText}>₹{(tx.procurementAmount || 56875).toLocaleString()}</Text>
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
  kpiGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  kpiCard: {
    width: '48%',
    alignItems: 'center',
    paddingVertical: spacing.md,
    marginBottom: spacing.sm,
  },
  kpiLabel: {
    fontSize: 11,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  kpiVal: {
    fontSize: 22,
    fontWeight: 'bold',
    marginVertical: 2,
  },
  kpiSub: {
    fontSize: 11,
    color: colors.textSecondary,
  },
  txCard: {
    marginBottom: spacing.sm,
  },
  txHeader: {
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
  txDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  centreText: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  amountText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.primary,
  },
});