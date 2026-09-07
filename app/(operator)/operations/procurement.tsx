import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert, Modal, TouchableOpacity, ScrollView } from 'react-native';
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
} from '../../../src/components/common';
import { useAppContext } from '../../../src/store/app-context';
import { useOperatorStore } from '../../../src/store/operator.store';
import { SubScreenHeader } from '../../../src/components/operator';
import { procurementService, ProcurementReceipt } from '../../../src/services/procurementService';
import { getOperatorTexts } from '../../../src/i18n/operator-translations';

export default function OperatorProcurementFinalizationScreen() {
  const router = useRouter();
  const { txId } = useLocalSearchParams<{ txId?: string }>();
  const { state } = useAppContext();
  const scale = state.textScale || 1.0;
  const t = getOperatorTexts(state.language);

  const { currentServing, currentOperator, finalizeProcurement } = useOperatorStore();

  // Parse net weight from store or fallback
  const rawQty = parseFloat(currentServing.quantity.replace(/[^\d.]/g, '')) || 11.0;
  const netWeightQtl = rawQty > 50 ? Number((rawQty / 100).toFixed(2)) : rawQty;
  const netWeightKg = Math.round(netWeightQtl * 100);

  const grade = 'Grade A';
  const procurementRatePerQtl = procurementService.getMspRate(currentServing.crop);
  const totalAmount = procurementService.calculateSettlement(netWeightQtl, procurementRatePerQtl);

  // Confirmation Checkbox
  const [isConfirmed, setIsConfirmed] = useState(true);
  const [isProcured, setIsProcured] = useState(false);
  const [receiptModalVisible, setReceiptModalVisible] = useState(false);
  const [createdReceipt, setCreatedReceipt] = useState<ProcurementReceipt | null>(null);

  const handleFinalize = async () => {
    if (!isConfirmed) {
      Alert.alert(
        'Confirmation Required',
        'Please check the declaration box verifying that all procurement details and weights are certified.'
      );
      return;
    }

    const receipt = procurementService.generateReceipt({
      transactionId: txId || currentServing.transactionId || 'TX-2026-001',
      token: currentServing.token,
      farmerName: currentServing.farmer,
      farmerId: 'KM-F-10234',
      crop: currentServing.crop,
      grade,
      netWeightKg,
      netWeightQtl,
      mspRatePerQtl: procurementRatePerQtl,
      totalAmount,
      mandiName: currentOperator.mandiName,
      mandiId: currentOperator.mandiId,
      operatorName: currentOperator.name,
      operatorId: currentOperator.operatorId,
    });

    setCreatedReceipt(receipt);
    setIsProcured(true);
    await finalizeProcurement(receipt);
    setReceiptModalVisible(true);
  };

  return (
    <ScreenContainer scrollable style={styles.container}>
      <SubScreenHeader
        title={t.procurementTitle}
        subtitle={t.procurementSub}
      />

      {/* 1. PROCUREMENT FINAL FIGURES CARD (Section 15) */}
      <KisanCard style={styles.figuresCard}>
        <View style={styles.cardHeader}>
          <View>
            <Text style={styles.cardToken}>{t.currentToken} {currentServing.token}</Text>
            <Text style={[styles.cardFarmer, { fontSize: 18 * scale }]}>
              {currentServing.farmer}
            </Text>
          </View>
          <StatusBadge status={isProcured ? 'PROCUREMENT_COMPLETED' : 'PROCUREMENT_PENDING'} />
        </View>

        <View style={styles.divider} />

        <View style={styles.row}>
          <Text style={styles.label}>{t.crop}:</Text>
          <Text style={styles.value}>🌾 {currentServing.crop}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>{t.gradeAssessment}:</Text>
          <Text style={[styles.value, { color: colors.primary, fontWeight: '800' }]}>
            {grade}
          </Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>{t.netWeightLabel}:</Text>
          <Text style={styles.value}>
            {netWeightKg} {t.kgUnit} ({netWeightQtl} {t.qtlUnit})
          </Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>{t.mspRateLabel}:</Text>
          <Text style={styles.value}>₹{procurementRatePerQtl.toLocaleString('en-IN')} / Q</Text>
        </View>

        <View style={styles.divider} />

        {/* Prominent Total Amount */}
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>{t.totalPayoutLabel}:</Text>
          <Text style={[styles.totalAmount, { fontSize: 24 * scale }]}>
            ₹{totalAmount.toLocaleString('en-IN')}
          </Text>
        </View>
        <Text style={styles.calculationHint}>
          {netWeightQtl} Q × ₹{procurementRatePerQtl.toLocaleString('en-IN')} = ₹
          {totalAmount.toLocaleString('en-IN')}
        </Text>
      </KisanCard>

      {/* 2. VERIFICATION CRITERIA CHECKLIST (Section 15) */}
      <SectionHeader
        title="Procurement Integrity Checklist"
        subtitle="Mandatory approvals recorded across all inspection bays"
      />
      <KisanCard style={styles.checklistCard}>
        {[
          { label: 'Quality & Moisture Lab Certification', status: 'Passed (Grade A)', icon: 'flask' },
          { label: 'Electronic Pitless Weighbridge (WB-02)', status: 'Captured & Confirmed', icon: 'scale' },
          { label: 'Farmer Biometric & Gate Identity', status: 'Verified', icon: 'person-circle' },
          { label: 'Mandi Booking Pass & Khasra Clearance', status: 'Valid', icon: 'document-text' },
        ].map((item, idx) => (
          <View key={idx} style={[styles.checkItem, idx > 0 && styles.checkBorder]}>
            <Ionicons name={item.icon as any} size={18} color={colors.primary} />
            <Text style={styles.checkItemLabel}>{item.label}</Text>
            <View style={styles.verifiedPill}>
              <Ionicons name="checkmark" size={12} color="#2E7D32" />
              <Text style={styles.verifiedText}>{item.status}</Text>
            </View>
          </View>
        ))}
      </KisanCard>

      {/* 3. SIGN-OFF DECLARATION (Section 15) */}
      <TouchableOpacity
        style={styles.declarationBox}
        onPress={() => setIsConfirmed(!isConfirmed)}
        activeOpacity={0.8}
      >
        <View style={[styles.checkbox, isConfirmed && styles.checkboxActive]}>
          {isConfirmed && <Ionicons name="checkmark" size={16} color="#FFFFFF" />}
        </View>
        <Text style={styles.declarationText}>
          {t.declarationCertified}
        </Text>
      </TouchableOpacity>

      {/* 4. FINALIZE BUTTON (Section 15) */}
      <TouchableOpacity
        style={[styles.finalizeBtn, !isConfirmed && styles.btnDisabled]}
        onPress={handleFinalize}
        activeOpacity={0.8}
      >
        <Ionicons name="shield-checkmark" size={20} color="#FFFFFF" />
        <Text style={styles.finalizeBtnText}>{t.completeProcurement}</Text>
      </TouchableOpacity>

      <View style={{ height: 32 }} />

      {/* 5. OFFICIAL GOVERNMENT RECEIPT MODAL (Section 15) */}
      <Modal visible={receiptModalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.receiptCard}>
            <ScrollView showsVerticalScrollIndicator={false}>
              {/* Receipt Header */}
              <View style={styles.receiptTop}>
                <Text style={styles.govtEmblem}>🏛️ GOVERNMENT OF INDIA / MP AGRI</Text>
                <Text style={styles.receiptTitle}>OFFICIAL PROCUREMENT RECEIPT</Text>
                <Text style={styles.receiptSub}>Direct Mandi Procurement Order & Farmer Voucher</Text>
                <Text style={styles.receiptRefText}>Receipt No: {createdReceipt?.receiptNumber}</Text>
              </View>

              <View style={styles.receiptDivider} />

              {/* Grid details */}
              <View style={styles.receiptGrid}>
                <View style={styles.receiptRow}>
                  <Text style={styles.rLabel}>Farmer Name:</Text>
                  <Text style={styles.rVal}>{createdReceipt?.farmerName}</Text>
                </View>
                <View style={styles.receiptRow}>
                  <Text style={styles.rLabel}>Farmer ID / Aadhaar:</Text>
                  <Text style={styles.rVal}>KM-F-10234 (XXXX XXXX 4821)</Text>
                </View>
                <View style={styles.receiptRow}>
                  <Text style={styles.rLabel}>Procurement Centre:</Text>
                  <Text style={styles.rVal}>{createdReceipt?.mandiName}</Text>
                </View>
                <View style={styles.receiptRow}>
                  <Text style={styles.rLabel}>Token & Vehicle:</Text>
                  <Text style={styles.rVal}>
                    {createdReceipt?.token} • {currentServing.vehicle}
                  </Text>
                </View>
                <View style={styles.receiptRow}>
                  <Text style={styles.rLabel}>Certified Crop & Grade:</Text>
                  <Text style={styles.rVal}>
                    {createdReceipt?.crop} • {createdReceipt?.grade}
                  </Text>
                </View>
                <View style={styles.receiptRow}>
                  <Text style={styles.rLabel}>Net Weight:</Text>
                  <Text style={styles.rVal}>
                    {createdReceipt?.netWeightKg} kg ({createdReceipt?.netWeightQtl} Quintals)
                  </Text>
                </View>
                <View style={styles.receiptRow}>
                  <Text style={styles.rLabel}>Procurement Rate:</Text>
                  <Text style={styles.rVal}>₹{createdReceipt?.mspRatePerQtl} / Q</Text>
                </View>
                <View style={[styles.receiptRow, styles.receiptTotalHighlight]}>
                  <Text style={[styles.rLabel, { fontWeight: '800' }]}>Total Payment Due:</Text>
                  <Text style={[styles.rVal, { color: colors.primary, fontSize: 18 }]}>
                    ₹{createdReceipt?.totalAmount.toLocaleString('en-IN')}
                  </Text>
                </View>
              </View>

              <View style={styles.stampBox}>
                <View style={styles.sealCircle}>
                  <Text style={styles.sealText}>MANDI CERTIFIED</Text>
                  <Text style={styles.sealSub}>MSP 2026</Text>
                </View>
                <View style={{ flex: 1, marginLeft: 12 }}>
                  <Text style={styles.signLabel}>Authorized By:</Text>
                  <Text style={styles.signOfficer}>{currentOperator.name}</Text>
                  <Text style={styles.signId}>Station Officer (OP-104)</Text>
                  <Text style={styles.signState}>State: PAYMENT_INITIATED</Text>
                </View>
              </View>

              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={styles.printBtn}
                  onPress={() => {
                    Alert.alert(
                      'Receipt Downloaded ✓',
                      `Procurement slip ${createdReceipt?.receiptNumber} exported for farmer printout.`
                    );
                  }}
                >
                  <Ionicons name="print-outline" size={18} color={colors.secondary} />
                  <Text style={styles.printBtnText}>PRINT / PDF</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.doneBtn}
                  onPress={() => {
                    setReceiptModalVisible(false);
                    router.push('/(operator)/payments');
                  }}
                >
                  <Ionicons name="arrow-forward" size={18} color="#FFFFFF" />
                  <Text style={styles.doneBtnText}>VIEW PAYMENT BATCHES</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: spacing.md,
  },
  figuresCard: {
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  cardToken: {
    fontSize: 10,
    fontWeight: '800',
    color: colors.primary,
    letterSpacing: 0.5,
  },
  cardFarmer: {
    fontWeight: '800',
    color: colors.textPrimary,
  },
  divider: {
    height: 1,
    backgroundColor: colors.divider,
    marginVertical: spacing.sm,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 5,
  },
  label: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  value: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
  },
  totalLabel: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  totalAmount: {
    fontWeight: '900',
    color: colors.primary,
  },
  calculationHint: {
    fontSize: 11,
    color: '#757575',
    marginTop: 2,
    fontStyle: 'italic',
  },
  checklistCard: {
    padding: spacing.sm,
    marginBottom: spacing.md,
  },
  checkItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    gap: 8,
  },
  checkBorder: {
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  checkItemLabel: {
    flex: 1,
    fontSize: 12,
    color: colors.textPrimary,
    fontWeight: '600',
  },
  verifiedPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: radius.round,
    gap: 4,
  },
  verifiedText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#2E7D32',
  },
  declarationBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.md,
    gap: 12,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#9E9E9E',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  declarationText: {
    flex: 1,
    fontSize: 12,
    color: colors.textPrimary,
    lineHeight: 16,
    fontWeight: '600',
  },
  finalizeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    paddingVertical: 14,
    borderRadius: radius.md,
    gap: 8,
  },
  finalizeBtnText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 14,
  },
  btnDisabled: {
    opacity: 0.5,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.md,
  },
  receiptCard: {
    width: '100%',
    maxWidth: 460,
    maxHeight: '90%',
    backgroundColor: '#FFFFFF',
    borderRadius: radius.lg,
    padding: spacing.lg,
  },
  receiptTop: {
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  govtEmblem: {
    fontSize: 11,
    fontWeight: '800',
    color: '#1565C0',
    letterSpacing: 1,
  },
  receiptTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: colors.textPrimary,
    marginTop: 4,
  },
  receiptSub: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 2,
  },
  receiptRefText: {
    fontSize: 11,
    fontWeight: '800',
    color: colors.primary,
    marginTop: 4,
  },
  receiptDivider: {
    height: 2,
    backgroundColor: colors.primary,
    marginVertical: spacing.sm,
  },
  receiptGrid: {
    gap: 4,
    marginVertical: spacing.xs,
  },
  receiptRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 3,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  },
  rLabel: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  rVal: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  receiptTotalHighlight: {
    backgroundColor: '#E8F5E9',
    padding: spacing.xs,
    borderRadius: radius.sm,
    marginTop: 6,
  },
  stampBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9F9F9',
    padding: spacing.sm,
    borderRadius: radius.sm,
    marginVertical: spacing.md,
    borderWidth: 1,
    borderColor: '#EEEEEE',
  },
  sealCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 2,
    borderColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderStyle: 'dashed',
  },
  sealText: {
    fontSize: 8,
    fontWeight: '900',
    color: colors.primary,
    textAlign: 'center',
  },
  sealSub: {
    fontSize: 8,
    fontWeight: '700',
    color: colors.secondary,
  },
  signLabel: {
    fontSize: 10,
    color: '#757575',
  },
  signOfficer: {
    fontSize: 12,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  signId: {
    fontSize: 11,
    color: colors.textSecondary,
  },
  signState: {
    fontSize: 10,
    fontWeight: '800',
    color: '#1E88E5',
    marginTop: 2,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 10,
    marginTop: spacing.sm,
  },
  printBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: radius.md,
    backgroundColor: '#E3F2FD',
    gap: 6,
  },
  printBtnText: {
    color: colors.secondary,
    fontWeight: '800',
    fontSize: 12,
  },
  doneBtn: {
    flex: 1.5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: radius.md,
    backgroundColor: colors.primary,
    gap: 6,
  },
  doneBtnText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 12,
  },
});