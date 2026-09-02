import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../../src/theme/colors';
import { spacing } from '../../../src/theme/spacing';
import { radius } from '../../../src/theme/radius';
import {
  ScreenContainer,
  KisanCard,
  StatusBadge,
  SectionHeader,
} from '../../../src/components/common';
import { MOCK_TRANSACTIONS } from '../../../src/services/mock-data.service';
import { TransactionStatus } from '../../../src/types/enums';

export default function FarmerHistoryScreen() {
  const router = useRouter();
  const pastTransactions = MOCK_TRANSACTIONS.filter(
    (t) =>
      t.status === TransactionStatus.PROCUREMENT_COMPLETED ||
      t.status === TransactionStatus.PAYMENT_COMPLETED ||
      t.status === TransactionStatus.RECEIPT_GENERATED
  );

  return (
    <ScreenContainer scrollable style={styles.container}>
      <SectionHeader
        title="Procurement History"
        subtitle="Completed visits, weight receipts, and payment records"
      />

      {pastTransactions.length === 0 ? (
        <KisanCard style={styles.emptyCard}>
          <Ionicons name="document-text-outline" size={48} color={colors.textSecondary} />
          <Text style={styles.emptyTitle}>No Completed Visits Yet</Text>
          <Text style={styles.emptySub}>Your completed mandi sales receipts will appear here.</Text>
        </KisanCard>
      ) : (
        pastTransactions.map((tx) => (
          <KisanCard key={tx.id} style={styles.historyCard}>
            <View style={styles.topRow}>
              <View>
                <Text style={styles.txId}>{tx.id}</Text>
                <Text style={styles.cropTitle}>{tx.crop}</Text>
              </View>
              <StatusBadge status={tx.status} />
            </View>

            <View style={styles.detailsBox}>
              <View style={styles.detailItem}>
                <Text style={styles.label}>Delivered Weight</Text>
                <Text style={styles.value}>
                  {tx.weighing ? `${tx.weighing.netWeight} Qtl` : `${tx.expectedQuantity} Qtl`}
                </Text>
              </View>
              <View style={styles.detailItem}>
                <Text style={styles.label}>Quality Grade</Text>
                <Text style={styles.value}>
                  {tx.qualityCheck ? `Grade ${tx.qualityCheck.grade}` : 'Grade A'}
                </Text>
              </View>
              <View style={styles.detailItem}>
                <Text style={styles.label}>Total Payout</Text>
                <Text style={styles.amountValue}>
                  ₹{(tx.procurementAmount || 22750).toLocaleString()}
                </Text>
              </View>
            </View>

            <View style={styles.mandiDateRow}>
              <Text style={styles.mandiName}>📍 {tx.centreName}</Text>
              <Text style={styles.dateText}>{tx.bookingDate}</Text>
            </View>

            <View style={styles.actionButtonsRow}>
              <TouchableOpacity
                style={styles.receiptBtn}
                onPress={() => router.push('/(farmer)/procurement/receipt' as any)}
              >
                <Ionicons name="receipt-outline" size={16} color={colors.primary} />
                <Text style={styles.receiptBtnText}>View Receipt</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.paymentBtn}
                onPress={() => router.push(`/(farmer)/payment/${tx.id}` as any)}
              >
                <Ionicons name="cash-outline" size={16} color={colors.secondary} />
                <Text style={styles.paymentBtnText}>Payment Status</Text>
              </TouchableOpacity>
            </View>
          </KisanCard>
        ))
      )}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: spacing.md,
  },
  historyCard: {
    marginBottom: spacing.md,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.sm,
  },
  txId: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  cropTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  detailsBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#F5F7FA',
    padding: spacing.sm,
    borderRadius: radius.sm,
    marginBottom: spacing.sm,
  },
  detailItem: {
    flex: 1,
  },
  label: {
    fontSize: 11,
    color: colors.textSecondary,
    marginBottom: 2,
  },
  value: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  amountValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.primary,
  },
  mandiDateRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  mandiName: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  dateText: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  actionButtonsRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  receiptBtn: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 8,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.primary,
    backgroundColor: '#E8F5E9',
  },
  receiptBtnText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: colors.primary,
    marginLeft: 4,
  },
  paymentBtn: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 8,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.secondary,
    backgroundColor: '#E3F2FD',
  },
  paymentBtnText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: colors.secondary,
    marginLeft: 4,
  },
  emptyCard: {
    alignItems: 'center',
    padding: spacing.xl,
    marginTop: spacing.lg,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginTop: spacing.md,
  },
  emptySub: {
    fontSize: 13,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 4,
  },
});