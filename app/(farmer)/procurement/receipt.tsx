import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Share } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../../src/theme/colors';
import { spacing } from '../../../src/theme/spacing';
import { radius } from '../../../src/theme/radius';
import {
  ScreenContainer,
  KisanCard,
  StatusBadge,
  KisanButton,
} from '../../../src/components/common';

export default function DigitalReceiptScreen() {
  const router = useRouter();
  const receiptNo = 'KM-RCP-2026-08921';

  const handleShareReceipt = () => {
    Share.share({
      message: `Kisan Mitra Procurement Receipt: ${receiptNo}, Farmer: Ramesh Nayak, Crop: Wheat, Net Weight: 25.00 Qtl, Total Amount: ₹56,875. Centre: Bhopal Krishi Upaj Mandi.`,
    });
  };

  return (
    <ScreenContainer scrollable style={styles.container}>
      {/* Official Receipt Paper Card */}
      <KisanCard style={styles.receiptPaper}>
        <View style={styles.receiptHeader}>
          <Text style={styles.emblemText}>🌾</Text>
          <Text style={styles.govtTitle}>Department of Consumer Affairs (DoCA)</Text>
          <Text style={styles.deptTitle}>Department of Food, Civil Supplies & Consumer Protection</Text>
          <Text style={styles.receiptMainTitle}>PROCUREMENT WEIGHMENT & SETTLEMENT SLIP</Text>
        </View>

        <View style={styles.receiptMeta}>
          <Text style={styles.receiptNo}>Receipt No: {receiptNo}</Text>
          <Text style={styles.receiptDate}>Date: 02 Sep 2026, 11:30 AM</Text>
        </View>

        <View style={styles.dashedDivider} />

        {/* Farmer & Centre Details */}
        <View style={styles.section}>
          <View style={styles.row}>
            <Text style={styles.lbl}>Farmer Name:</Text>
            <Text style={styles.valBold}>Ramesh Nayak (ID: F-001)</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.lbl}>Village / Dist:</Text>
            <Text style={styles.val}>Sehore, Madhya Pradesh</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.lbl}>Procurement Centre:</Text>
            <Text style={styles.val}>Demo Krishi Upaj Mandi, Bhopal</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.lbl}>Weighbridge Operator:</Text>
            <Text style={styles.val}>Suresh Verma (OP-104)</Text>
          </View>
        </View>

        <View style={styles.dashedDivider} />

        {/* Crop & Weighment Table */}
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={[styles.th, { flex: 2 }]}>Commodity</Text>
            <Text style={styles.th}>Grade</Text>
            <Text style={styles.th}>Net Qtl</Text>
            <Text style={styles.th}>Rate</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={[styles.td, { flex: 2, fontWeight: 'bold' }]}>Wheat (गेहूं)</Text>
            <Text style={styles.td}>Grade A</Text>
            <Text style={styles.td}>25.00</Text>
            <Text style={styles.td}>₹2,275</Text>
          </View>
        </View>

        <View style={styles.dashedDivider} />

        {/* Total Settlement Amount */}
        <View style={styles.settlementBox}>
          <View style={styles.row}>
            <Text style={styles.lbl}>Gross Amount:</Text>
            <Text style={styles.val}>₹56,875.00</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.lbl}>Mandi Cess / Deductions:</Text>
            <Text style={styles.val}>₹0.00</Text>
          </View>
          <View style={[styles.row, { marginTop: 4 }]}>
            <Text style={styles.totalLbl}>Net Payable Amount:</Text>
            <Text style={styles.totalVal}>₹56,875.00</Text>
          </View>
        </View>

        <View style={styles.dashedDivider} />

        {/* DBT Payment Status */}
        <View style={styles.bankStatusRow}>
          <View>
            <Text style={styles.dbtLabel}>DBT Bank Settlement Status</Text>
            <Text style={styles.dbtBank}>SBI •••• •••• 5678</Text>
          </View>
          <StatusBadge status="INITIATED" variant="info" />
        </View>

        <View style={styles.qrPlaceholder}>
          <Ionicons name="qr-code-outline" size={64} color={colors.textPrimary} />
          <Text style={styles.qrText}>Digitally Verified by Kisan Mitra System</Text>
        </View>
      </KisanCard>

      {/* Share & Download Actions */}
      <View style={styles.actionsBox}>
        <TouchableOpacity style={styles.downloadBtn} onPress={handleShareReceipt}>
          <Ionicons name="share-outline" size={18} color="#FFFFFF" />
          <Text style={styles.downloadBtnText}>Share & Download PDF Receipt</Text>
        </TouchableOpacity>

        <View style={{ height: 10 }} />

        <KisanButton
          title="Track Bank Payment Status"
          onPress={() => router.push('/(farmer)/payment/KM-2026-00042' as any)}
          variant="secondary"
        />
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: spacing.md,
  },
  receiptPaper: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#CCCCCC',
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  receiptHeader: {
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  emblemText: {
    fontSize: 28,
  },
  govtTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#333333',
    letterSpacing: 0.5,
  },
  deptTitle: {
    fontSize: 10,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 2,
  },
  receiptMainTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: colors.primary,
    marginTop: 6,
    textAlign: 'center',
  },
  receiptMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  receiptNo: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  receiptDate: {
    fontSize: 11,
    color: colors.textSecondary,
  },
  dashedDivider: {
    height: 1,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderStyle: 'dashed',
    marginVertical: 8,
  },
  section: {
    gap: 4,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  lbl: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  val: {
    fontSize: 12,
    color: colors.textPrimary,
  },
  valBold: {
    fontSize: 12,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  table: {
    marginVertical: 4,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#F5F5F5',
    paddingVertical: 4,
    paddingHorizontal: 6,
    borderRadius: 4,
  },
  th: {
    flex: 1,
    fontSize: 11,
    fontWeight: 'bold',
    color: colors.textSecondary,
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 6,
    paddingHorizontal: 6,
  },
  td: {
    flex: 1,
    fontSize: 12,
    color: colors.textPrimary,
  },
  settlementBox: {
    gap: 4,
  },
  totalLbl: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  totalVal: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.primary,
  },
  bankStatusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
  },
  dbtLabel: {
    fontSize: 11,
    color: colors.textSecondary,
  },
  dbtBank: {
    fontSize: 13,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  qrPlaceholder: {
    alignItems: 'center',
    paddingTop: spacing.md,
  },
  qrText: {
    fontSize: 10,
    color: colors.textSecondary,
    marginTop: 4,
  },
  actionsBox: {
    marginBottom: spacing.xl,
  },
  downloadBtn: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingVertical: 14,
    borderRadius: radius.md,
  },
  downloadBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 6,
  },
});