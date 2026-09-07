import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Platform,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { radius } from '../../theme/radius';
import { KisanCard, SectionHeader, StatusBadge } from '../common';
import {
  DBT_METRICS,
  CROP_SETTLEMENT_DATA,
  BANK_FAILURE_STATS,
  INITIAL_DBT_RECORDS,
} from '../../services/dbt-settlement.service';
import { BankFailureReason, DetailedDbtRecord } from '../../types/payment';

interface PaymentSettlementOversightProps {
  embedded?: boolean;
}

export const PaymentSettlementOversight: React.FC<PaymentSettlementOversightProps> = ({ embedded = false }) => {
  // State for search and filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<'ALL' | 'SUCCESS' | 'PENDING' | 'FAILED'>('ALL');
  const [selectedCropFilter, setSelectedCropFilter] = useState<string>('ALL');
  const [selectedFailureReason, setSelectedFailureReason] = useState<BankFailureReason | 'ALL'>('ALL');
  
  // Interactive records state (supports retries)
  const [records, setRecords] = useState<DetailedDbtRecord[]>(INITIAL_DBT_RECORDS);
  const [isRetryingBulk, setIsRetryingBulk] = useState(false);
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  // Filtered records
  const filteredRecords = useMemo(() => {
    return records.filter((r) => {
      // Status filter
      if (selectedStatusFilter !== 'ALL' && r.status !== selectedStatusFilter) {
        return false;
      }
      // Crop filter
      if (selectedCropFilter !== 'ALL' && r.crop !== selectedCropFilter) {
        return false;
      }
      // Bank failure reason filter
      if (selectedFailureReason !== 'ALL') {
        if (r.status !== 'FAILED' || r.failureReason !== selectedFailureReason) {
          return false;
        }
      }
      // Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesName = r.farmerName.toLowerCase().includes(query);
        const matchesId = r.farmerId.toLowerCase().includes(query);
        const matchesBank = r.bankName.toLowerCase().includes(query);
        const matchesUtr = r.utrNumber ? r.utrNumber.toLowerCase().includes(query) : false;
        const matchesMobile = r.farmerMobile.includes(query);
        if (!matchesName && !matchesId && !matchesBank && !matchesUtr && !matchesMobile) {
          return false;
        }
      }
      return true;
    });
  }, [records, selectedStatusFilter, selectedCropFilter, selectedFailureReason, searchQuery]);

  // Handle single record retry
  const handleRetryRecord = (recordId: string) => {
    setRecords((prev) =>
      prev.map((r) => {
        if (r.id === recordId) {
          return {
            ...r,
            status: 'SUCCESS',
            failureReason: undefined,
            failureDetail: undefined,
            utrNumber: `RETRY${Date.now().toString().slice(-10)}`,
            clearedAt: 'Just Now (Re-verified via NPCI)',
          };
        }
        return r;
      })
    );
    const msg = `Record ${recordId} re-dispatched successfully via PFMS gateway!`;
    setActionNotice(msg);
    if (Platform.OS === 'web') {
      // non-blocking
    } else {
      Alert.alert('DBT Re-dispatched', msg);
    }
  };

  // Handle bulk retry of all failed payments
  const handleBulkRetry = () => {
    setIsRetryingBulk(true);
    setTimeout(() => {
      setRecords((prev) =>
        prev.map((r) => {
          if (r.status === 'FAILED') {
            return {
              ...r,
              status: 'SUCCESS',
              failureReason: undefined,
              failureDetail: undefined,
              utrNumber: `NPCI${Date.now().toString().slice(-10)}`,
              clearedAt: 'Re-dispatched (Bulk Batch)',
            };
          }
          return r;
        })
      );
      setIsRetryingBulk(false);
      const msg = 'Bulk DBT settlement batch initiated for 1,495 farmers. ₹2.40 Cr queued for immediate clearing!';
      setActionNotice(msg);
      if (Platform.OS !== 'web') {
        Alert.alert('Bulk Retry Triggered', msg);
      }
    }, 900);
  };

  // Clear notice after 5 seconds
  React.useEffect(() => {
    if (actionNotice) {
      const timer = setTimeout(() => setActionNotice(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [actionNotice]);

  return (
    <View style={styles.container}>
      {/* Header Banner */}
      {!embedded && (
        <View style={styles.headerBanner}>
          <View style={{ flex: 1 }}>
            <View style={styles.badgeRow}>
              <View style={styles.liveIndicator}>
                <View style={styles.liveDot} />
                <Text style={styles.liveText}>PFMS / NPCI LIVE</Text>
              </View>
              <Text style={styles.gatewayStatusText}>Gateway: {DBT_METRICS.pfmsGatewayHealth}</Text>
            </View>
            <Text style={styles.pageTitle}>Payment Settlement Oversight</Text>
            <Text style={styles.pageSubtitle}>
              Direct Benefit Transfer (DBT) disbursement monitoring and bank failure analytics
            </Text>
          </View>
          <TouchableOpacity
            style={styles.exportBtn}
            onPress={() => {
              const msg = 'Official DBT Treasury Settlement Audit Sheet downloaded (Excel / PDF format).';
              setActionNotice(msg);
              if (Platform.OS !== 'web') Alert.alert('Report Exported', msg);
            }}
          >
            <Ionicons name="download-outline" size={16} color="#FFFFFF" style={{ marginRight: 6 }} />
            <Text style={styles.exportBtnText}>Export Audit</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Floating Action Notice */}
      {actionNotice && (
        <View style={styles.actionNoticeCard}>
          <Ionicons name="checkmark-circle" size={20} color="#2E7D32" style={{ marginRight: 8 }} />
          <Text style={styles.actionNoticeText}>{actionNotice}</Text>
          <TouchableOpacity onPress={() => setActionNotice(null)}>
            <Ionicons name="close" size={18} color="#2E7D32" />
          </TouchableOpacity>
        </View>
      )}

      {/* ========================================================================= */}
      {/* 1. FINANCIAL KPI CARDS (Crores of Rupees DBT Tracking) */}
      {/* ========================================================================= */}
      <View style={styles.sectionTitleRow}>
        <Ionicons name="cash-outline" size={20} color={colors.primary} style={{ marginRight: 6 }} />
        <Text style={styles.sectionHeading}>Statewide DBT Settlement Overview</Text>
        <Text style={styles.sectionSubHeading}>(Disbursement in Crores of Rupees)</Text>
      </View>

      <View style={styles.kpiGrid}>
        {/* Total Payable */}
        <KisanCard style={[styles.kpiCard, { borderTopColor: '#3F51B5' }]}>
          <View style={styles.kpiHeaderRow}>
            <Text style={styles.kpiLabel}>Total Payable Amount</Text>
            <Ionicons name="wallet-outline" size={18} color="#3F51B5" />
          </View>
          <Text style={[styles.kpiAmount, { color: '#1A237E' }]}>
            ₹{DBT_METRICS.totalPayableCr.toFixed(2)} <Text style={styles.crUnit}>Cr</Text>
          </Text>
          <View style={styles.kpiFooter}>
            <Text style={styles.kpiCount}>{DBT_METRICS.totalFarmers.toLocaleString()} Farmers</Text>
            <Text style={styles.kpiSubtag}>100% Allocated</Text>
          </View>
        </KisanCard>

        {/* Paid Amount */}
        <KisanCard style={[styles.kpiCard, { borderTopColor: '#2E7D32' }]}>
          <View style={styles.kpiHeaderRow}>
            <Text style={styles.kpiLabel}>Paid Amount (Success)</Text>
            <Ionicons name="checkmark-circle-outline" size={18} color="#2E7D32" />
          </View>
          <Text style={[styles.kpiAmount, { color: '#1B5E20' }]}>
            ₹{DBT_METRICS.paidAmountCr.toFixed(2)} <Text style={styles.crUnit}>Cr</Text>
          </Text>
          <View style={styles.kpiFooter}>
            <Text style={styles.kpiCount}>{DBT_METRICS.paidFarmers.toLocaleString()} Farmers</Text>
            <View style={[styles.pctBadge, { backgroundColor: '#E8F5E9' }]}>
              <Text style={[styles.pctText, { color: '#2E7D32' }]}>
                {DBT_METRICS.overallSuccessPct}% Paid
              </Text>
            </View>
          </View>
        </KisanCard>

        {/* Pending Amount */}
        <KisanCard style={[styles.kpiCard, { borderTopColor: '#E65100' }]}>
          <View style={styles.kpiHeaderRow}>
            <Text style={styles.kpiLabel}>Pending Amount</Text>
            <Ionicons name="time-outline" size={18} color="#E65100" />
          </View>
          <Text style={[styles.kpiAmount, { color: '#BF360C' }]}>
            ₹{DBT_METRICS.pendingAmountCr.toFixed(2)} <Text style={styles.crUnit}>Cr</Text>
          </Text>
          <View style={styles.kpiFooter}>
            <Text style={styles.kpiCount}>{DBT_METRICS.pendingFarmers.toLocaleString()} Farmers</Text>
            <View style={[styles.pctBadge, { backgroundColor: '#FFF3E0' }]}>
              <Text style={[styles.pctText, { color: '#E65100' }]}>
                {DBT_METRICS.overallPendingPct}% Clearing
              </Text>
            </View>
          </View>
        </KisanCard>

        {/* Failed Amount */}
        <KisanCard style={[styles.kpiCard, { borderTopColor: '#D32F2F' }]}>
          <View style={styles.kpiHeaderRow}>
            <Text style={styles.kpiLabel}>Failed Amount (Bounced)</Text>
            <Ionicons name="alert-circle-outline" size={18} color="#D32F2F" />
          </View>
          <Text style={[styles.kpiAmount, { color: '#B71C1C' }]}>
            ₹{DBT_METRICS.failedAmountCr.toFixed(2)} <Text style={styles.crUnit}>Cr</Text>
          </Text>
          <View style={styles.kpiFooter}>
            <Text style={styles.kpiCount}>{DBT_METRICS.failedFarmers.toLocaleString()} Farmers</Text>
            <View style={[styles.pctBadge, { backgroundColor: '#FFEBEE' }]}>
              <Text style={[styles.pctText, { color: '#D32F2F' }]}>
                {DBT_METRICS.overallFailedPct}% Failed
              </Text>
            </View>
          </View>
        </KisanCard>
      </View>

      {/* Macro Graphical Status Bar */}
      <KisanCard style={styles.macroGraphCard}>
        <View style={styles.macroHeader}>
          <View>
            <Text style={styles.macroTitle}>Overall DBT Settlement Distribution</Text>
            <Text style={styles.macroSubtitle}>
              Avg Clearing Speed: {DBT_METRICS.avgDisbursementTimeHours}h via Aadhaar Payment Bridge (APB)
            </Text>
          </View>
          <View style={styles.macroSummaryPills}>
            <Text style={[styles.macroPill, { color: '#2E7D32' }]}>
              ● {DBT_METRICS.overallSuccessPct}% Success
            </Text>
            <Text style={[styles.macroPill, { color: '#E65100' }]}>
              ● {DBT_METRICS.overallPendingPct}% Pending
            </Text>
            <Text style={[styles.macroPill, { color: '#D32F2F' }]}>
              ● {DBT_METRICS.overallFailedPct}% Failed
            </Text>
          </View>
        </View>

        {/* Multi-segment Graphical Bar */}
        <View style={styles.multiBarContainer}>
          <View
            style={[
              styles.barSegment,
              { width: `${DBT_METRICS.overallSuccessPct}%`, backgroundColor: '#2E7D32' },
            ]}
          />
          <View
            style={[
              styles.barSegment,
              { width: `${DBT_METRICS.overallPendingPct}%`, backgroundColor: '#FF9800' },
            ]}
          />
          <View
            style={[
              styles.barSegment,
              { width: `${DBT_METRICS.overallFailedPct}%`, backgroundColor: '#D32F2F' },
            ]}
          />
        </View>
      </KisanCard>

      {/* ========================================================================= */}
      {/* 2. CROP-WISE GRAPHICAL REPRESENTATION (Success %, Pending %, Failed %) */}
      {/* ========================================================================= */}
      <View style={styles.sectionHeaderWrap}>
        <View>
          <View style={styles.sectionTitleRow}>
            <Ionicons name="pie-chart-outline" size={20} color={colors.primary} style={{ marginRight: 6 }} />
            <Text style={styles.sectionHeading}>Crop-wise Payment Status Breakdown (Graphical)</Text>
          </View>
          <Text style={styles.sectionSubDesc}>
            Percentage of crop procurement value in Success, Pending, and Failed settlement states
          </Text>
        </View>

        {/* Crop Filter Selector */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.cropFilterScroll}>
          <TouchableOpacity
            style={[
              styles.cropChip,
              selectedCropFilter === 'ALL' && styles.cropChipActive,
            ]}
            onPress={() => setSelectedCropFilter('ALL')}
          >
            <Text
              style={[
                styles.cropChipText,
                selectedCropFilter === 'ALL' && styles.cropChipTextActive,
              ]}
            >
              All Crops (5)
            </Text>
          </TouchableOpacity>
          {CROP_SETTLEMENT_DATA.map((c) => (
            <TouchableOpacity
              key={c.crop}
              style={[
                styles.cropChip,
                selectedCropFilter === c.crop && styles.cropChipActive,
              ]}
              onPress={() => setSelectedCropFilter(c.crop)}
            >
              <Text style={{ marginRight: 4 }}>{c.icon}</Text>
              <Text
                style={[
                  styles.cropChipText,
                  selectedCropFilter === c.crop && styles.cropChipTextActive,
                ]}
              >
                {c.crop}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Crop Cards Grid */}
      <View style={styles.cropGrid}>
        {CROP_SETTLEMENT_DATA.filter(
          (c) => selectedCropFilter === 'ALL' || c.crop === selectedCropFilter
        ).map((crop) => (
          <KisanCard key={crop.crop} style={styles.cropCard}>
            {/* Crop Header */}
            <View style={styles.cropCardHeader}>
              <View style={styles.cropIconTitle}>
                <Text style={styles.cropBigEmoji}>{crop.icon}</Text>
                <View>
                  <Text style={styles.cropCardTitle}>{crop.cropHindi}</Text>
                  <Text style={styles.cropCardSub}>
                    {crop.totalQuantityQtl.toLocaleString()} Qtl · {crop.totalFarmers.toLocaleString()} Farmers
                  </Text>
                </View>
              </View>
              <View style={{ alignItems: 'flex-end' }}>
                <Text style={styles.cropTotalCr}>₹{crop.totalAmountCr.toFixed(2)} Cr</Text>
                <Text style={styles.cropTotalLabel}>Total Payable</Text>
              </View>
            </View>

            {/* Graphical Segmented Progress Bar */}
            <View style={styles.cropBarContainer}>
              <View
                style={[
                  styles.cropBarSegment,
                  { width: `${crop.successPct}%`, backgroundColor: '#2E7D32' },
                ]}
              />
              <View
                style={[
                  styles.cropBarSegment,
                  { width: `${crop.pendingPct}%`, backgroundColor: '#FF9800' },
                ]}
              />
              <View
                style={[
                  styles.cropBarSegment,
                  { width: `${crop.failedPct}%`, backgroundColor: '#D32F2F' },
                ]}
              />
            </View>

            {/* Exact Percentages Legend Row */}
            <View style={styles.cropLegendGrid}>
              {/* Success */}
              <View style={styles.cropLegendItem}>
                <View style={[styles.legendIndicator, { backgroundColor: '#2E7D32' }]} />
                <View>
                  <Text style={styles.cropLegendLabel}>Success / Paid</Text>
                  <Text style={[styles.cropLegendVal, { color: '#2E7D32' }]}>
                    {crop.successPct}% <Text style={styles.cropLegendAmt}>(₹{crop.successAmountCr} Cr)</Text>
                  </Text>
                </View>
              </View>

              {/* Pending */}
              <View style={styles.cropLegendItem}>
                <View style={[styles.legendIndicator, { backgroundColor: '#FF9800' }]} />
                <View>
                  <Text style={styles.cropLegendLabel}>Pending (PFMS)</Text>
                  <Text style={[styles.cropLegendVal, { color: '#E65100' }]}>
                    {crop.pendingPct}% <Text style={styles.cropLegendAmt}>(₹{crop.pendingAmountCr} Cr)</Text>
                  </Text>
                </View>
              </View>

              {/* Failed */}
              <View style={styles.cropLegendItem}>
                <View style={[styles.legendIndicator, { backgroundColor: '#D32F2F' }]} />
                <View>
                  <Text style={styles.cropLegendLabel}>Failed / Bounced</Text>
                  <Text style={[styles.cropLegendVal, { color: '#D32F2F' }]}>
                    {crop.failedPct}% <Text style={styles.cropLegendAmt}>(₹{crop.failedAmountCr} Cr)</Text>
                  </Text>
                </View>
              </View>
            </View>
          </KisanCard>
        ))}
      </View>

      {/* ========================================================================= */}
      {/* 3. BANK FAILURE REASONS ANALYSIS */}
      {/* ========================================================================= */}
      <View style={styles.sectionHeaderWrap}>
        <View style={styles.failureHeaderRow}>
          <View style={{ flex: 1 }}>
            <View style={styles.sectionTitleRow}>
              <Ionicons name="warning-outline" size={20} color="#D32F2F" style={{ marginRight: 6 }} />
              <Text style={[styles.sectionHeading, { color: '#C62828' }]}>
                Bank Failure Reasons Analysis (₹2.40 Cr Bounced)
              </Text>
            </View>
            <Text style={styles.sectionSubDesc}>
              Categorized failure analysis for 1,495 transactions across core banking servers
            </Text>
          </View>

          {/* Bulk Retry Button */}
          <TouchableOpacity
            style={[styles.bulkRetryBtn, isRetryingBulk && { opacity: 0.7 }]}
            onPress={handleBulkRetry}
            disabled={isRetryingBulk}
          >
            <Ionicons
              name={isRetryingBulk ? 'refresh' : 'sync-outline'}
              size={16}
              color="#FFFFFF"
              style={{ marginRight: 6 }}
            />
            <Text style={styles.bulkRetryBtnText}>
              {isRetryingBulk ? 'Clearing Batch...' : 'Bulk Retry All Failed (1,495)'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Filter instructions */}
        <Text style={styles.clickToFilterHint}>
          💡 Tap any failure card below to filter and inspect the affected beneficiary records:
        </Text>
      </View>

      {/* Bank Failure Reasons Grid */}
      <View style={styles.failureGrid}>
        {BANK_FAILURE_STATS.map((fail) => {
          const isSelected = selectedFailureReason === fail.reason;
          return (
            <TouchableOpacity
              key={fail.reason}
              activeOpacity={0.8}
              style={{ width: '48.5%', marginBottom: spacing.sm }}
              onPress={() => {
                if (isSelected) {
                  setSelectedFailureReason('ALL');
                } else {
                  setSelectedFailureReason(fail.reason);
                  setSelectedStatusFilter('FAILED');
                }
              }}
            >
              <KisanCard
                style={[
                  styles.failureCard,
                  { borderLeftColor: fail.color },
                  isSelected && styles.failureCardSelected,
                ]}
              >
                <View style={styles.failureTopRow}>
                  <View style={[styles.failureIconBox, { backgroundColor: `${fail.color}15` }]}>
                    <Ionicons name={fail.icon as any} size={18} color={fail.color} />
                  </View>
                  <View style={[styles.failurePctBadge, { backgroundColor: `${fail.color}15` }]}>
                    <Text style={[styles.failurePctText, { color: fail.color }]}>
                      {fail.percentage}% of Failures
                    </Text>
                  </View>
                </View>

                <Text style={styles.failureLabel}>{fail.label}</Text>
                <Text style={styles.failureHindi}>{fail.labelHindi}</Text>

                <View style={styles.failureNumbersRow}>
                  <Text style={[styles.failureCount, { color: fail.color }]}>
                    {fail.count} <Text style={styles.failureCountSub}>Farmers</Text>
                  </Text>
                  <Text style={styles.failureAmount}>₹{fail.amountLakh} Lakh</Text>
                </View>

                <Text style={styles.failureDesc}>{fail.description}</Text>

                <View style={styles.failureCardAction}>
                  <Text style={[styles.failureActionText, { color: fail.color }]}>
                    {isSelected ? '✓ Showing in table' : 'Filter Records →'}
                  </Text>
                </View>
              </KisanCard>
            </TouchableOpacity>
          );
        })}

        {/* Reset Filter Card if any filter active */}
        {selectedFailureReason !== 'ALL' && (
          <TouchableOpacity
            style={{ width: '100%', marginBottom: spacing.sm }}
            onPress={() => {
              setSelectedFailureReason('ALL');
              setSelectedStatusFilter('ALL');
            }}
          >
            <View style={styles.resetFilterBox}>
              <Ionicons name="refresh" size={16} color={colors.primary} style={{ marginRight: 6 }} />
              <Text style={styles.resetFilterText}>
                Clear "{selectedFailureReason}" filter & show all 1,495 payment records
              </Text>
            </View>
          </TouchableOpacity>
        )}
      </View>

      {/* ========================================================================= */}
      {/* 4. ALL PAYMENT RECORD DETAILS REGISTRY */}
      {/* ========================================================================= */}
      <View style={styles.sectionHeaderWrap}>
        <View style={styles.sectionTitleRow}>
          <Ionicons name="receipt-outline" size={20} color={colors.primary} style={{ marginRight: 6 }} />
          <Text style={styles.sectionHeading}>Payment Settlement Records & Registry</Text>
        </View>
        <Text style={styles.sectionSubDesc}>
          Live PFMS DBT clearing audit logs with beneficiary bank validation and UTR clearing details
        </Text>
      </View>

      {/* Search & Filter Controls */}
      <KisanCard style={styles.filterCard}>
        {/* Search Input */}
        <View style={styles.searchBar}>
          <Ionicons name="search" size={18} color={colors.textSecondary} style={{ marginRight: 8 }} />
          <TextInput
            placeholder="Search by Farmer Name, ID (KM-OD-...), Bank, Mobile or UTR..."
            placeholderTextColor="#888888"
            value={searchQuery}
            onChangeText={setSearchQuery}
            style={styles.searchInput}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={18} color="#888888" />
            </TouchableOpacity>
          )}
        </View>

        {/* Status Filter Tabs */}
        <View style={styles.statusFilterRow}>
          {(['ALL', 'SUCCESS', 'PENDING', 'FAILED'] as const).map((st) => {
            const isActive = selectedStatusFilter === st;
            let badgeBg = '#E0E0E0';
            let activeBg = colors.primary;
            let label = 'All Records';
            if (st === 'SUCCESS') {
              label = 'Paid / Success';
              activeBg = '#2E7D32';
            } else if (st === 'PENDING') {
              label = 'Pending';
              activeBg = '#E65100';
            } else if (st === 'FAILED') {
              label = 'Failed (Bounced)';
              activeBg = '#D32F2F';
            }

            return (
              <TouchableOpacity
                key={st}
                style={[
                  styles.statusTabBtn,
                  isActive && { backgroundColor: activeBg, borderColor: activeBg },
                ]}
                onPress={() => setSelectedStatusFilter(st)}
              >
                <Text
                  style={[
                    styles.statusTabBtnText,
                    isActive && styles.statusTabBtnTextActive,
                  ]}
                >
                  {label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Active Filter summary */}
        <View style={styles.activeFilterSummary}>
          <Text style={styles.resultsCountText}>
            Showing <Text style={{ fontWeight: 'bold' }}>{filteredRecords.length}</Text> records
            {selectedCropFilter !== 'ALL' ? ` · Crop: ${selectedCropFilter}` : ''}
            {selectedFailureReason !== 'ALL' ? ` · Failure: ${selectedFailureReason}` : ''}
          </Text>
          {(selectedCropFilter !== 'ALL' || selectedFailureReason !== 'ALL' || selectedStatusFilter !== 'ALL' || searchQuery) && (
            <TouchableOpacity
              onPress={() => {
                setSelectedCropFilter('ALL');
                setSelectedFailureReason('ALL');
                setSelectedStatusFilter('ALL');
                setSearchQuery('');
              }}
            >
              <Text style={styles.clearAllFiltersText}>Reset All Filters</Text>
            </TouchableOpacity>
          )}
        </View>
      </KisanCard>

      {/* Record Cards List */}
      <View style={styles.recordsList}>
        {filteredRecords.length === 0 ? (
          <KisanCard style={styles.emptyCard}>
            <Ionicons name="document-text-outline" size={42} color="#9E9E9E" />
            <Text style={styles.emptyTitle}>No payment records match your criteria</Text>
            <Text style={styles.emptyDesc}>Try adjusting your search query, crop, or status filter.</Text>
          </KisanCard>
        ) : (
          filteredRecords.map((record) => {
            const isSuccess = record.status === 'SUCCESS';
            const isPending = record.status === 'PENDING';
            const isFailed = record.status === 'FAILED';

            return (
              <KisanCard
                key={record.id}
                style={[
                  styles.recordCard,
                  isFailed && { borderLeftColor: '#D32F2F', borderLeftWidth: 4 },
                  isSuccess && { borderLeftColor: '#2E7D32', borderLeftWidth: 4 },
                  isPending && { borderLeftColor: '#FF9800', borderLeftWidth: 4 },
                ]}
              >
                {/* Card Header */}
                <View style={styles.recordHeader}>
                  <View style={{ flex: 1 }}>
                    <View style={styles.recordIdRow}>
                      <Text style={styles.recordId}>{record.id}</Text>
                      <View style={styles.batchPill}>
                        <Text style={styles.batchPillText}>{record.pfmsBatchId}</Text>
                      </View>
                    </View>
                    <Text style={styles.recordFarmerName}>{record.farmerName}</Text>
                    <Text style={styles.recordFarmerMeta}>
                      ID: {record.farmerId} · Mobile: {record.farmerMobile}
                    </Text>
                  </View>

                  {/* Status Badge */}
                  <View style={{ alignItems: 'flex-end' }}>
                    <View
                      style={[
                        styles.recordStatusBadge,
                        isSuccess && { backgroundColor: '#E8F5E9' },
                        isPending && { backgroundColor: '#FFF3E0' },
                        isFailed && { backgroundColor: '#FFEBEE' },
                      ]}
                    >
                      <Ionicons
                        name={
                          isSuccess
                            ? 'checkmark-circle'
                            : isPending
                            ? 'time'
                            : 'alert-circle'
                        }
                        size={14}
                        color={isSuccess ? '#2E7D32' : isPending ? '#E65100' : '#D32F2F'}
                        style={{ marginRight: 4 }}
                      />
                      <Text
                        style={[
                          styles.recordStatusText,
                          isSuccess && { color: '#2E7D32' },
                          isPending && { color: '#E65100' },
                          isFailed && { color: '#D32F2F' },
                        ]}
                      >
                        {isSuccess ? 'PAID / CLEARED' : isPending ? 'PENDING PFMS' : 'FAILED / BOUNCED'}
                      </Text>
                    </View>
                    <Text style={styles.recordPayableAmount}>
                      ₹{record.payableAmount.toLocaleString()}
                    </Text>
                  </View>
                </View>

                {/* Procurement Details Row */}
                <View style={styles.recordDetailsRow}>
                  <View style={styles.detailCol}>
                    <Text style={styles.detailLabel}>Crop & Mandi</Text>
                    <Text style={styles.detailValue}>
                      {record.cropHindi} · {record.quantityQtl} Qtl
                    </Text>
                    <Text style={styles.detailSub}>{record.mandiName} ({record.district})</Text>
                  </View>

                  <View style={styles.detailCol}>
                    <Text style={styles.detailLabel}>Beneficiary Bank Account</Text>
                    <Text style={styles.detailValue}>
                      {record.bankName}
                    </Text>
                    <Text style={styles.detailSub}>
                      A/C: {record.accountMasked} · IFSC: {record.ifscCode}
                    </Text>
                  </View>
                </View>

                {/* Status Specific Footnote */}
                {isSuccess && (
                  <View style={styles.successFootnote}>
                    <Ionicons name="checkmark-done" size={14} color="#2E7D32" style={{ marginRight: 6 }} />
                    <Text style={styles.successFootnoteText}>
                      UTR: <Text style={{ fontWeight: 'bold' }}>{record.utrNumber}</Text> · Cleared on {record.clearedAt}
                    </Text>
                  </View>
                )}

                {isPending && (
                  <View style={styles.pendingFootnote}>
                    <Ionicons name="hourglass-outline" size={14} color="#E65100" style={{ marginRight: 6 }} />
                    <Text style={styles.pendingFootnoteText}>
                      Sent to Core Banking Switch at {record.initiatedAt}. Expected clearing within 24 hours.
                    </Text>
                  </View>
                )}

                {isFailed && (
                  <View style={styles.failedFootnote}>
                    <View style={styles.failedReasonBadge}>
                      <Ionicons name="warning" size={13} color="#D32F2F" style={{ marginRight: 4 }} />
                      <Text style={styles.failedReasonTitle}>
                        Reason: {record.failureReason ? record.failureReason.replace('_', ' ') : 'Bank Error'}
                      </Text>
                    </View>
                    <Text style={styles.failedDetailText}>{record.failureDetail}</Text>

                    {/* Retry Action */}
                    <TouchableOpacity
                      style={styles.retrySingleBtn}
                      onPress={() => handleRetryRecord(record.id)}
                    >
                      <Ionicons name="refresh" size={14} color="#FFFFFF" style={{ marginRight: 4 }} />
                      <Text style={styles.retrySingleBtnText}>Re-verify & Retry Payout</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </KisanCard>
            );
          })
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingBottom: spacing.xxl,
  },
  headerBanner: {
    backgroundColor: '#1E293B',
    padding: spacing.md,
    borderRadius: radius.md,
    marginBottom: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  liveIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0F172A',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#4CAF50',
    marginRight: 6,
  },
  liveText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  gatewayStatusText: {
    fontSize: 11,
    color: '#94A3B8',
  },
  pageTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: 2,
  },
  pageSubtitle: {
    fontSize: 12,
    color: '#CBD5E1',
    marginTop: 2,
  },
  exportBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#334155',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: '#475569',
  },
  exportBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  actionNoticeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F5E9',
    borderWidth: 1,
    borderColor: '#A5D6A7',
    padding: spacing.sm,
    borderRadius: radius.sm,
    marginBottom: spacing.md,
  },
  actionNoticeText: {
    flex: 1,
    fontSize: 12,
    color: '#1B5E20',
    fontWeight: '500',
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  sectionHeading: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  sectionSubHeading: {
    fontSize: 12,
    color: colors.textSecondary,
    marginLeft: 6,
  },
  sectionSubDesc: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },
  sectionHeaderWrap: {
    marginTop: spacing.md,
    marginBottom: spacing.xs,
  },
  kpiGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: spacing.xs,
  },
  kpiCard: {
    width: '48.5%',
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderTopWidth: 4,
  },
  kpiHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  kpiLabel: {
    fontSize: 11,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  kpiAmount: {
    fontSize: 22,
    fontWeight: 'bold',
    marginVertical: 4,
  },
  crUnit: {
    fontSize: 14,
    fontWeight: '600',
  },
  kpiFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  kpiCount: {
    fontSize: 11,
    color: colors.textSecondary,
  },
  kpiSubtag: {
    fontSize: 10,
    color: '#3F51B5',
    fontWeight: '600',
  },
  pctBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
  },
  pctText: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  macroGraphCard: {
    padding: spacing.md,
    marginBottom: spacing.md,
    backgroundColor: '#FFFFFF',
  },
  macroHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 10,
  },
  macroTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  macroSubtitle: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 2,
  },
  macroSummaryPills: {
    flexDirection: 'row',
    gap: 12,
  },
  macroPill: {
    fontSize: 11,
    fontWeight: '600',
  },
  multiBarContainer: {
    height: 14,
    flexDirection: 'row',
    backgroundColor: '#E0E0E0',
    borderRadius: 7,
    overflow: 'hidden',
  },
  barSegment: {
    height: '100%',
  },
  cropFilterScroll: {
    flexDirection: 'row',
    marginVertical: spacing.xs,
  },
  cropChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#ECEFF1',
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#CFD8DC',
  },
  cropChipActive: {
    backgroundColor: '#2E7D32',
    borderColor: '#2E7D32',
  },
  cropChipText: {
    fontSize: 12,
    color: '#37474F',
    fontWeight: '500',
  },
  cropChipTextActive: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  cropGrid: {
    gap: spacing.sm,
  },
  cropCard: {
    padding: spacing.md,
    marginBottom: spacing.xs,
  },
  cropCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  cropIconTitle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  cropBigEmoji: {
    fontSize: 26,
  },
  cropCardTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  cropCardSub: {
    fontSize: 11,
    color: colors.textSecondary,
  },
  cropTotalCr: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.primary,
  },
  cropTotalLabel: {
    fontSize: 10,
    color: colors.textSecondary,
  },
  cropBarContainer: {
    height: 10,
    flexDirection: 'row',
    backgroundColor: '#E0E0E0',
    borderRadius: 5,
    overflow: 'hidden',
    marginBottom: 10,
  },
  cropBarSegment: {
    height: '100%',
  },
  cropLegendGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 8,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    paddingTop: 8,
  },
  cropLegendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  cropLegendLabel: {
    fontSize: 10,
    color: colors.textSecondary,
  },
  cropLegendVal: {
    fontSize: 11,
    fontWeight: 'bold',
  },
  cropLegendAmt: {
    fontSize: 10,
    color: colors.textSecondary,
    fontWeight: 'normal',
  },
  failureHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 4,
  },
  bulkRetryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#D32F2F',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: radius.sm,
  },
  bulkRetryBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  clickToFilterHint: {
    fontSize: 11,
    color: '#757575',
    fontStyle: 'italic',
    marginBottom: spacing.xs,
  },
  failureGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  failureCard: {
    padding: spacing.sm,
    borderLeftWidth: 4,
    height: '100%',
  },
  failureCardSelected: {
    backgroundColor: '#FFF8E1',
    borderColor: '#FFB300',
    borderWidth: 1,
  },
  failureTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  failureIconBox: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  failurePctBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
  },
  failurePctText: {
    fontSize: 9,
    fontWeight: 'bold',
  },
  failureLabel: {
    fontSize: 13,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  failureHindi: {
    fontSize: 10,
    color: colors.textSecondary,
    marginBottom: 6,
  },
  failureNumbersRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: 4,
  },
  failureCount: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  failureCountSub: {
    fontSize: 10,
    color: colors.textSecondary,
    fontWeight: 'normal',
  },
  failureAmount: {
    fontSize: 12,
    fontWeight: '600',
    color: '#424242',
  },
  failureDesc: {
    fontSize: 10,
    color: '#616161',
    lineHeight: 14,
    marginBottom: 6,
  },
  failureCardAction: {
    borderTopWidth: 1,
    borderTopColor: '#EEEEEE',
    paddingTop: 4,
    marginTop: 2,
  },
  failureActionText: {
    fontSize: 10,
    fontWeight: '600',
  },
  resetFilterBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#E8F5E9',
    padding: spacing.sm,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: '#C8E6C9',
  },
  resetFilterText: {
    fontSize: 12,
    color: colors.primary,
    fontWeight: '600',
  },
  filterCard: {
    padding: spacing.sm,
    marginBottom: spacing.sm,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: radius.sm,
    paddingHorizontal: 10,
    paddingVertical: Platform.OS === 'ios' ? 8 : 4,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    marginBottom: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    color: colors.textPrimary,
  },
  statusFilterRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 8,
  },
  statusTabBtn: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#F5F5F5',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  statusTabBtnText: {
    fontSize: 11,
    color: '#616161',
    fontWeight: '500',
  },
  statusTabBtnTextActive: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  activeFilterSummary: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#F5F5F5',
    paddingTop: 6,
  },
  resultsCountText: {
    fontSize: 11,
    color: colors.textSecondary,
  },
  clearAllFiltersText: {
    fontSize: 11,
    color: colors.primary,
    fontWeight: 'bold',
  },
  recordsList: {
    gap: spacing.sm,
  },
  emptyCard: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
  },
  emptyTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginTop: 8,
  },
  emptyDesc: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  recordCard: {
    padding: spacing.md,
    marginBottom: spacing.xs,
  },
  recordHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  recordIdRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  recordId: {
    fontSize: 11,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  batchPill: {
    backgroundColor: '#ECEFF1',
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 8,
  },
  batchPillText: {
    fontSize: 9,
    color: '#546E7A',
    fontWeight: '600',
  },
  recordFarmerName: {
    fontSize: 15,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginTop: 2,
  },
  recordFarmerMeta: {
    fontSize: 11,
    color: colors.textSecondary,
  },
  recordStatusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
    marginBottom: 4,
  },
  recordStatusText: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  recordPayableAmount: {
    fontSize: 17,
    fontWeight: 'bold',
    color: colors.primaryDark,
  },
  recordDetailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#F5F5F5',
    paddingTop: 8,
    marginTop: 4,
    flexWrap: 'wrap',
    gap: 8,
  },
  detailCol: {
    flex: 1,
    minWidth: 140,
  },
  detailLabel: {
    fontSize: 10,
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  detailValue: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textPrimary,
    marginTop: 1,
  },
  detailSub: {
    fontSize: 10,
    color: colors.textSecondary,
  },
  successFootnote: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F5E9',
    padding: 6,
    borderRadius: radius.xs,
    marginTop: 8,
  },
  successFootnoteText: {
    fontSize: 10,
    color: '#1B5E20',
  },
  pendingFootnote: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF3E0',
    padding: 6,
    borderRadius: radius.xs,
    marginTop: 8,
  },
  pendingFootnoteText: {
    fontSize: 10,
    color: '#BF360C',
  },
  failedFootnote: {
    backgroundColor: '#FFEBEE',
    padding: 8,
    borderRadius: radius.xs,
    marginTop: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#D32F2F',
  },
  failedReasonBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  failedReasonTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#C62828',
  },
  failedDetailText: {
    fontSize: 11,
    color: '#B71C1C',
    lineHeight: 15,
    marginBottom: 6,
  },
  retrySingleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: '#D32F2F',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  retrySingleBtnText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
});
