import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Modal, ScrollView, TextInput } from 'react-native';
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
import { useAppContext } from '../../src/store/app-context';
import { useOperatorStore } from '../../src/store/operator.store';
import { SubScreenHeader } from '../../src/components/operator';
import { paymentService, PfmsVoucher } from '../../src/services/paymentService';
import { PaymentBatch } from '../../src/types/operator';

export default function OperatorPaymentsScreen() {
  const router = useRouter();
  const { state } = useAppContext();
  const scale = state.textScale || 1.0;

  const {
    paymentItems,
    approvedBatches,
    currentOperator,
    createAndApprovePaymentBatch,
  } = useOperatorStore();

  const [items, setItems] = useState(paymentItems);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'ALL' | 'PENDING' | 'APPROVED'>('ALL');

  // Modals
  const [batchModalVisible, setBatchModalVisible] = useState(false);
  const [voucherModalVisible, setVoucherModalVisible] = useState(false);
  const [generatedVoucher, setGeneratedVoucher] = useState<PfmsVoucher | null>(null);
  const [latestBatch, setLatestBatch] = useState<PaymentBatch | null>(null);

  // Keep local items in sync with store
  React.useEffect(() => {
    setItems(paymentItems);
  }, [paymentItems]);

  const selectedList = items.filter((p) => p.selected && p.paymentStatus === 'Pending');
  const selectedCount = selectedList.length;
  const selectedTotal = selectedList.reduce((sum, p) => sum + p.amount, 0);

  // Approved today total calculation
  const approvedTodayTotal = approvedBatches.reduce((sum, b) => sum + b.totalAmount, 825000);

  const toggleSelect = (id: string) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, selected: !item.selected } : item))
    );
  };

  const handleSelectAll = () => {
    const allSelected = selectedList.length === items.filter((p) => p.paymentStatus === 'Pending').length;
    setItems((prev) =>
      prev.map((item) =>
        item.paymentStatus === 'Pending' ? { ...item, selected: !allSelected } : item
      )
    );
  };

  const handleCreateBatch = () => {
    if (selectedCount === 0) {
      Alert.alert('No Selection', 'Please select at least one pending transaction to create a payment batch.');
      return;
    }
    setBatchModalVisible(true);
  };

  const handleApproveBatch = async () => {
    const selectedIds = selectedList.map((p) => p.id);
    const batch = await createAndApprovePaymentBatch(selectedIds);
    setLatestBatch(batch);
    setBatchModalVisible(false);

    Alert.alert(
      'Payment Batch Approved! 🏛️',
      `Payment Batch #${batch.batchNumber} containing ${batch.farmerCount} vouchers (₹${batch.totalAmount.toLocaleString('en-IN')}) authorized and queued for PFMS Central Treasury transfer.`
    );
  };

  const handleGenerateVoucher = () => {
    const voucher = paymentService.generatePfmsVoucher({
      batchNumber: latestBatch?.batchNumber || `PB-2026-${Math.floor(100 + Math.random() * 900)}`,
      totalVouchers: selectedCount || 12,
      totalAmount: selectedTotal || 384500,
      operatorName: currentOperator.name,
      operatorId: currentOperator.operatorId,
    });
    setGeneratedVoucher(voucher);
    setVoucherModalVisible(true);
  };

  const filteredItems = items.filter((item) => {
    const matchSearch =
      !searchQuery ||
      item.farmer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.token.toLowerCase().includes(searchQuery.toLowerCase());

    const matchStatus =
      filterStatus === 'ALL' ||
      (filterStatus === 'PENDING' && item.paymentStatus === 'Pending') ||
      (filterStatus === 'APPROVED' && item.paymentStatus === 'Approved');

    return matchSearch && matchStatus;
  });

  return (
    <ScreenContainer scrollable style={styles.container}>
      <SubScreenHeader
        title="Payment Batches"
        subtitle="Operator payment batch authorization and bank voucher generation"
      />

      {/* 1. DASHBOARD SUMMARY CARDS (Section 16) */}
      <View style={styles.kpiRow}>
        <KisanCard style={styles.kpiCard}>
          <Text style={styles.kpiLabel}>Pending Batches</Text>
          <Text style={[styles.kpiValue, { fontSize: 24 * scale, color: colors.warning }]}>
            {items.filter((p) => p.paymentStatus === 'Pending').length}
          </Text>
          <Text style={styles.kpiSub}>Awaiting Approval</Text>
        </KisanCard>

        <KisanCard style={styles.kpiCard}>
          <Text style={styles.kpiLabel}>Total Batch Amount</Text>
          <Text style={[styles.kpiValue, { fontSize: 18 * scale, color: colors.primary }]}>
            ₹{selectedTotal.toLocaleString('en-IN')}
          </Text>
          <Text style={styles.kpiSub}>{selectedCount} Selected</Text>
        </KisanCard>

        <KisanCard style={styles.kpiCard}>
          <Text style={styles.kpiLabel}>Approved Today</Text>
          <Text style={[styles.kpiValue, { fontSize: 18 * scale, color: colors.secondary }]}>
            ₹{approvedTodayTotal.toLocaleString('en-IN')}
          </Text>
          <Text style={styles.kpiSub}>{approvedBatches.length} Batches</Text>
        </KisanCard>
      </View>

      {/* 2. SEARCH & FILTER (Section 24) */}
      <View style={styles.searchRow}>
        <View style={styles.searchBox}>
          <Ionicons name="search" size={18} color={colors.textSecondary} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search by farmer name or token..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        <View style={styles.filterPills}>
          {(['ALL', 'PENDING', 'APPROVED'] as const).map((tab) => (
            <TouchableOpacity
              key={tab}
              style={[styles.filterPill, filterStatus === tab && styles.filterPillActive]}
              onPress={() => setFilterStatus(tab)}
            >
              <Text style={[styles.filterPillText, filterStatus === tab && styles.filterPillTextActive]}>
                {tab}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* 3. PAYMENT TRANSACTIONS LIST (Section 16) */}
      <KisanCard style={styles.tableCard}>
        <View style={styles.tableHeaderRow}>
          <TouchableOpacity style={styles.selectAllBox} onPress={handleSelectAll}>
            <View style={[styles.checkbox, selectedCount > 0 && styles.checkboxActive]}>
              {selectedCount > 0 && <Ionicons name="checkmark" size={14} color="#FFFFFF" />}
            </View>
            <Text style={styles.tableHeaderCol}>Farmer & Token</Text>
          </TouchableOpacity>
          <Text style={styles.tableHeaderCol}>Amount</Text>
          <Text style={styles.tableHeaderCol}>Bank / Status</Text>
        </View>

        {filteredItems.length === 0 ? (
          <Text style={styles.emptyText}>No payment transactions found matching criteria.</Text>
        ) : (
          filteredItems.map((p) => {
            const isApproved = p.paymentStatus === 'Approved';
            return (
              <TouchableOpacity
                key={p.id}
                style={[styles.itemRow, p.selected && !isApproved && styles.itemRowSelected]}
                onPress={() => !isApproved && toggleSelect(p.id)}
                activeOpacity={isApproved ? 1 : 0.7}
              >
                <View style={styles.farmerCol}>
                  <View
                    style={[
                      styles.checkbox,
                      isApproved ? styles.checkboxApproved : p.selected && styles.checkboxActive,
                    ]}
                  >
                    {(p.selected || isApproved) && (
                      <Ionicons name="checkmark" size={14} color="#FFFFFF" />
                    )}
                  </View>
                  <View style={{ marginLeft: 8 }}>
                    <Text style={styles.farmerName}>{p.farmer}</Text>
                    <Text style={styles.tokenText}>{p.token}</Text>
                  </View>
                </View>

                <View style={styles.amountCol}>
                  <Text style={styles.amountText}>₹{p.amount.toLocaleString('en-IN')}</Text>
                </View>

                <View style={styles.statusCol}>
                  <View style={styles.bankStatusBadge}>
                    <Ionicons name="shield-checkmark" size={12} color="#2E7D32" />
                    <Text style={styles.bankStatusText}>{p.bankStatus}</Text>
                  </View>
                  <Text
                    style={[
                      styles.paymentStatusText,
                      { color: isApproved ? '#2E7D32' : colors.warning },
                    ]}
                  >
                    {p.paymentStatus}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })
        )}
      </KisanCard>

      {/* 4. BATCH ACTION BAR (Section 16) */}
      <View style={styles.batchActionBar}>
        <View>
          <Text style={styles.batchCountLabel}>Selected for DBT Batch:</Text>
          <Text style={styles.batchTotalValue}>
            {selectedCount} Farmers • ₹{selectedTotal.toLocaleString('en-IN')}
          </Text>
        </View>

        <TouchableOpacity
          style={[styles.createBatchBtn, selectedCount === 0 && styles.btnDisabled]}
          onPress={handleCreateBatch}
          activeOpacity={0.8}
        >
          <Ionicons name="layers-outline" size={18} color="#FFFFFF" />
          <Text style={styles.createBatchBtnText}>CREATE PAYMENT BATCH</Text>
        </TouchableOpacity>
      </View>

      <View style={{ height: 32 }} />

      {/* 5. BATCH CONFIRMATION MODAL (Section 16) */}
      <Modal visible={batchModalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalIconCircle}>
              <Ionicons name="card-outline" size={32} color={colors.secondary} />
            </View>
            <Text style={styles.modalTitle}>Payment Batch #PB-2026-091</Text>
            <Text style={styles.modalSub}>
              Review batch authorization for Direct Benefit Transfer via PFMS.
            </Text>

            <View style={styles.modalBreakdown}>
              <View style={styles.breakdownRow}>
                <Text style={styles.breakdownLabel}>Transactions:</Text>
                <Text style={styles.breakdownValue}>{selectedCount}</Text>
              </View>
              <View style={styles.breakdownRow}>
                <Text style={styles.breakdownLabel}>Total Farmers:</Text>
                <Text style={styles.breakdownValue}>{selectedCount}</Text>
              </View>
              <View style={styles.breakdownRow}>
                <Text style={styles.breakdownLabel}>Total Amount:</Text>
                <Text style={[styles.breakdownValue, { color: colors.primary, fontSize: 16 }]}>
                  ₹{selectedTotal.toLocaleString('en-IN')}
                </Text>
              </View>
              <View style={styles.breakdownRow}>
                <Text style={styles.breakdownLabel}>Disbursement Mode:</Text>
                <Text style={styles.breakdownValue}>Aadhaar DBT / PFMS Treasury</Text>
              </View>
            </View>

            <View style={styles.modalActionButtons}>
              <TouchableOpacity
                style={styles.genVoucherBtn}
                onPress={handleGenerateVoucher}
                activeOpacity={0.8}
              >
                <Ionicons name="document-text-outline" size={16} color={colors.secondary} />
                <Text style={styles.genVoucherBtnText}>GENERATE VOUCHER</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.approveBatchBtn}
                onPress={handleApproveBatch}
                activeOpacity={0.8}
              >
                <Ionicons name="checkmark-circle" size={16} color="#FFFFFF" />
                <Text style={styles.approveBatchBtnText}>APPROVE BATCH</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={styles.cancelLink}
              onPress={() => setBatchModalVisible(false)}
            >
              <Text style={{ color: '#757575', fontWeight: '700' }}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* 6. GOVERNMENT PFMS DBT TREASURY VOUCHER MODAL (Section 16) */}
      <Modal visible={voucherModalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.voucherCard}>
            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={styles.voucherHeader}>
                <Text style={styles.vGovtText}>🏛️ PUBLIC FINANCIAL MANAGEMENT SYSTEM (PFMS)</Text>
                <Text style={styles.vTitle}>DIRECT BENEFIT TRANSFER PAYMENT VOUCHER</Text>
                <Text style={styles.vSub}>Department of Agriculture & Farmers Welfare</Text>
                <Text style={styles.vVoucherNo}>{generatedVoucher?.voucherNumber}</Text>
              </View>

              <View style={styles.vDivider} />

              <View style={styles.vDetails}>
                <View style={styles.vRow}>
                  <Text style={styles.vLabel}>Batch Identifier:</Text>
                  <Text style={styles.vVal}>{generatedVoucher?.batchId}</Text>
                </View>
                <View style={styles.vRow}>
                  <Text style={styles.vLabel}>Treasury IFMS Code:</Text>
                  <Text style={styles.vVal}>{generatedVoucher?.treasuryCode}</Text>
                </View>
                <View style={styles.vRow}>
                  <Text style={styles.vLabel}>DBT Scheme Scheme:</Text>
                  <Text style={styles.vVal}>{generatedVoucher?.schemeCode}</Text>
                </View>
                <View style={styles.vRow}>
                  <Text style={styles.vLabel}>Cleared Farmers:</Text>
                  <Text style={styles.vVal}>{generatedVoucher?.totalVouchers} Accounts</Text>
                </View>
                <View style={[styles.vRow, { backgroundColor: '#E8F5E9', padding: 4 }]}>
                  <Text style={[styles.vLabel, { fontWeight: '800' }]}>Total Transfer Sum:</Text>
                  <Text style={[styles.vVal, { color: colors.primary, fontSize: 16 }]}>
                    ₹{generatedVoucher?.totalAmount.toLocaleString('en-IN')}
                  </Text>
                </View>
                <View style={styles.vRow}>
                  <Text style={styles.vLabel}>Authorized Officer:</Text>
                  <Text style={styles.vVal}>{generatedVoucher?.approvedBy}</Text>
                </View>
                <View style={styles.vRow}>
                  <Text style={styles.vLabel}>Digital Hash:</Text>
                  <Text style={[styles.vVal, { fontSize: 10, fontFamily: 'monospace' }]}>
                    {generatedVoucher?.digitalSignatureHash}
                  </Text>
                </View>
              </View>

              <View style={styles.voucherActions}>
                <TouchableOpacity
                  style={styles.vPrintBtn}
                  onPress={() => {
                    Alert.alert(
                      'PFMS Voucher Printed ✓',
                      `Treasury batch voucher ${generatedVoucher?.voucherNumber} exported for records.`
                    );
                  }}
                >
                  <Ionicons name="print-outline" size={18} color={colors.secondary} />
                  <Text style={styles.vPrintBtnText}>PRINT VOUCHER</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.vCloseBtn}
                  onPress={() => setVoucherModalVisible(false)}
                >
                  <Text style={styles.vCloseBtnText}>CLOSE</Text>
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
  kpiRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  kpiCard: {
    flex: 1,
    padding: spacing.sm,
    alignItems: 'center',
  },
  kpiLabel: {
    fontSize: 11,
    color: colors.textSecondary,
    fontWeight: '600',
    textAlign: 'center',
  },
  kpiValue: {
    fontWeight: '900',
    marginVertical: 2,
  },
  kpiSub: {
    fontSize: 10,
    color: '#757575',
  },
  searchRow: {
    marginBottom: spacing.md,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: radius.md,
    paddingHorizontal: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
    height: 44,
    marginBottom: spacing.xs,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    color: colors.textPrimary,
  },
  filterPills: {
    flexDirection: 'row',
    gap: 8,
  },
  filterPill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: radius.round,
    backgroundColor: '#EEEEEE',
  },
  filterPillActive: {
    backgroundColor: colors.secondary,
  },
  filterPillText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.textSecondary,
  },
  filterPillTextActive: {
    color: '#FFFFFF',
  },
  tableCard: {
    padding: spacing.xs,
    marginBottom: spacing.md,
  },
  tableHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    paddingHorizontal: spacing.sm,
    backgroundColor: '#F5F5F5',
    borderRadius: radius.sm,
  },
  selectAllBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1.5,
  },
  tableHeaderCol: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.textSecondary,
  },
  emptyText: {
    padding: spacing.lg,
    textAlign: 'center',
    color: colors.textSecondary,
    fontStyle: 'italic',
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  },
  itemRowSelected: {
    backgroundColor: '#E8F5E9',
  },
  farmerCol: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1.5,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: '#9E9E9E',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  checkboxApproved: {
    backgroundColor: '#2E7D32',
    borderColor: '#2E7D32',
  },
  farmerName: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  tokenText: {
    fontSize: 11,
    color: colors.textSecondary,
  },
  amountCol: {
    flex: 1,
    alignItems: 'center',
  },
  amountText: {
    fontSize: 13,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  statusCol: {
    flex: 1,
    alignItems: 'flex-end',
  },
  bankStatusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  bankStatusText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#2E7D32',
  },
  paymentStatusText: {
    fontSize: 11,
    fontWeight: '700',
    marginTop: 2,
  },
  batchActionBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: spacing.md,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  batchCountLabel: {
    fontSize: 11,
    color: colors.textSecondary,
  },
  batchTotalValue: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  createBatchBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: radius.md,
    gap: 6,
  },
  createBatchBtnText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 12,
  },
  btnDisabled: {
    opacity: 0.5,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.md,
  },
  modalCard: {
    width: '100%',
    maxWidth: 420,
    backgroundColor: '#FFFFFF',
    borderRadius: radius.lg,
    padding: spacing.lg,
    alignItems: 'center',
  },
  modalIconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#E3F2FD',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  modalSub: {
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 4,
    marginBottom: spacing.md,
  },
  modalBreakdown: {
    width: '100%',
    backgroundColor: '#FAFAFA',
    padding: spacing.md,
    borderRadius: radius.md,
    gap: 8,
    marginBottom: spacing.md,
  },
  breakdownRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  breakdownLabel: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  breakdownValue: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  modalActionButtons: {
    flexDirection: 'row',
    gap: 8,
    width: '100%',
  },
  genVoucherBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: radius.md,
    backgroundColor: '#E3F2FD',
    gap: 4,
  },
  genVoucherBtnText: {
    color: colors.secondary,
    fontWeight: '800',
    fontSize: 11,
  },
  approveBatchBtn: {
    flex: 1.2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: radius.md,
    backgroundColor: colors.primary,
    gap: 4,
  },
  approveBatchBtnText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 11,
  },
  cancelLink: {
    marginTop: 14,
  },
  voucherCard: {
    width: '100%',
    maxWidth: 480,
    maxHeight: '85%',
    backgroundColor: '#FFFFFF',
    borderRadius: radius.lg,
    padding: spacing.lg,
  },
  voucherHeader: {
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  vGovtText: {
    fontSize: 10,
    fontWeight: '800',
    color: colors.secondary,
    letterSpacing: 0.5,
  },
  vTitle: {
    fontSize: 15,
    fontWeight: '900',
    color: colors.textPrimary,
    textAlign: 'center',
    marginTop: 4,
  },
  vSub: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 2,
  },
  vVoucherNo: {
    fontSize: 12,
    fontWeight: '800',
    color: colors.primary,
    marginTop: 4,
  },
  vDivider: {
    height: 2,
    backgroundColor: colors.primary,
    marginVertical: spacing.sm,
  },
  vDetails: {
    gap: 6,
    marginVertical: spacing.xs,
  },
  vRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  },
  vLabel: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  vVal: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  voucherActions: {
    flexDirection: 'row',
    gap: 10,
    marginTop: spacing.md,
  },
  vPrintBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    backgroundColor: '#E3F2FD',
    borderRadius: radius.md,
    gap: 6,
  },
  vPrintBtnText: {
    color: colors.secondary,
    fontWeight: '800',
    fontSize: 12,
  },
  vCloseBtn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    backgroundColor: '#EEEEEE',
    borderRadius: radius.md,
  },
  vCloseBtnText: {
    color: colors.textPrimary,
    fontWeight: '700',
    fontSize: 12,
  },
});