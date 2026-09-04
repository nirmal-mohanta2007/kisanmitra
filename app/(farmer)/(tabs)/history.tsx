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
import { useAppContext } from '../../../src/store/app-context';

export default function FarmerHistoryScreen() {
  const router = useRouter();
  const { state } = useAppContext();
  const lang = state.language || 'hi';

  const text = {
    title: lang === 'or' ? 'କ୍ରୟ ଇତିହାସ' : lang === 'hi' ? 'खरीद इतिहास' : 'Procurement History',
    subtitle: lang === 'or' ? 'ସମ୍ପନ୍ନ କ୍ରୟ, ଓଜନ ରସିଦ ଏବଂ ଦେୟ ବିବରଣୀ' : lang === 'hi' ? 'पूर्ण हुई विज़िट, वज़न रसीदें और भुगतान रिकॉर्ड' : 'Completed visits, weight receipts, and payment records',
    emptyTitle: lang === 'or' ? 'ଏପର୍ଯ୍ୟନ୍ତ କୌଣସି ସମ୍ପୂର୍ଣ୍ଣ କାରବାର ନାହିଁ' : lang === 'hi' ? 'अभी तक कोई पूर्ण विज़िट नहीं' : 'No Completed Visits Yet',
    emptySub: lang === 'or' ? 'ଆପଣଙ୍କ ମଣ୍ଡି ବିକ୍ରୟ ରସିଦ ଏଠାରେ ଦେଖାଯିବ।' : lang === 'hi' ? 'आपकी पूरी हुई मंडी बिक्री रसीदें यहाँ दिखाई देंगी।' : 'Your completed mandi sales receipts will appear here.',
    deliveredWeight: lang === 'or' ? 'ପ୍ରଦତ୍ତ ଓଜନ' : lang === 'hi' ? 'दिया गया वज़न' : 'Delivered Weight',
    qualityGrade: lang === 'or' ? 'ଗୁଣବତ୍ତା ଗ୍ରେଡ୍' : lang === 'hi' ? 'गुणवत्ता ग्रेड' : 'Quality Grade',
    totalPayout: lang === 'or' ? 'ମୋଟ ଦେୟ' : lang === 'hi' ? 'कुल भुगतान' : 'Total Payout',
    viewReceipt: lang === 'or' ? 'ରସିଦ ଦେଖନ୍ତୁ' : lang === 'hi' ? 'रसीद देखें' : 'View Receipt',
    paymentStatus: lang === 'or' ? 'ଦେୟ ସ୍ଥିତି' : lang === 'hi' ? 'भुगतान स्थिति' : 'Payment Status',
    grade: lang === 'or' ? 'ଗ୍ରେଡ୍' : lang === 'hi' ? 'ग्रेड' : 'Grade',
    qtl: lang === 'or' ? 'କ୍ୱି' : lang === 'hi' ? 'क्वि' : 'Qtl',
  };

  const pastTransactions = MOCK_TRANSACTIONS.filter(
    (t) =>
      t.status === TransactionStatus.PROCUREMENT_COMPLETED ||
      t.status === TransactionStatus.PAYMENT_COMPLETED ||
      t.status === TransactionStatus.RECEIPT_GENERATED
  );

  return (
    <ScreenContainer scrollable style={styles.container}>
      <SectionHeader
        title={text.title}
        subtitle={text.subtitle}
      />

      {pastTransactions.length === 0 ? (
        <KisanCard style={styles.emptyCard}>
          <Ionicons name="document-text-outline" size={48} color={colors.textSecondary} />
          <Text style={styles.emptyTitle}>{text.emptyTitle}</Text>
          <Text style={styles.emptySub}>{text.emptySub}</Text>
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
                <Text style={styles.label}>{text.deliveredWeight}</Text>
                <Text style={styles.value}>
                  {tx.weighing ? `${tx.weighing.netWeight} ${text.qtl}` : `${tx.expectedQuantity} ${text.qtl}`}
                </Text>
              </View>
              <View style={styles.detailItem}>
                <Text style={styles.label}>{text.qualityGrade}</Text>
                <Text style={styles.value}>
                  {tx.qualityCheck ? `${text.grade} ${tx.qualityCheck.grade}` : `${text.grade} A`}
                </Text>
              </View>
              <View style={styles.detailItem}>
                <Text style={styles.label}>{text.totalPayout}</Text>
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
                <Text style={styles.receiptBtnText}>{text.viewReceipt}</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.paymentBtn}
                onPress={() => router.push(`/(farmer)/payment/${tx.id}` as any)}
              >
                <Ionicons name="cash-outline" size={16} color={colors.secondary} />
                <Text style={styles.paymentBtnText}>{text.paymentStatus}</Text>
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