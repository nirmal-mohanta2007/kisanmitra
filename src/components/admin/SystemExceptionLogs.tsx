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
  EXCEPTION_7DAY_METRICS,
  DISTRICT_OPTIONS,
  MANDI_OPTIONS,
  OFFICER_OPTIONS,
  EXCEPTION_TYPE_OPTIONS,
  SEVERITY_OPTIONS,
  STATUS_OPTIONS,
  DATE_RANGE_OPTIONS,
  DEFAULT_FILTER_CRITERIA,
  INITIAL_EXCEPTION_LOGS,
} from '../../services/exception-logs.service';
import {
  DetailedExceptionLog,
  ExceptionFilterCriteria,
  ExceptionSeverity,
  ExceptionStatus,
  SystemExceptionLogType,
} from '../../types/exception';

interface SystemExceptionLogsProps {
  embedded?: boolean;
}

export const SystemExceptionLogs: React.FC<SystemExceptionLogsProps> = ({ embedded = false }) => {
  // Pending filter selections (edited in filter bar before clicking "Apply")
  const [draftFilters, setDraftFilters] = useState<ExceptionFilterCriteria>(DEFAULT_FILTER_CRITERIA);

  // Active applied filter state (applied when user clicks "Apply")
  const [appliedFilters, setAppliedFilters] = useState<ExceptionFilterCriteria>(DEFAULT_FILTER_CRITERIA);

  // Search keyword query
  const [searchQuery, setSearchQuery] = useState('');

  // Live exception logs state (supports in-memory resolve / updates)
  const [logs, setLogs] = useState<DetailedExceptionLog[]>(INITIAL_EXCEPTION_LOGS);

  // UI Notification banner
  const [feedbackNotice, setFeedbackNotice] = useState<string | null>(null);

  // Expand / collapse filter drawer on mobile
  const [isFilterPanelExpanded, setIsFilterPanelExpanded] = useState(true);

  // Apply filters action
  const handleApplyFilters = () => {
    setAppliedFilters({ ...draftFilters });
    const count = getFilteredCount(draftFilters, searchQuery);
    const notice = `Applied filters: ${count} matching exception record(s) found.`;
    setFeedbackNotice(notice);
  };

  // Restart / Reset action (beside Apply)
  const handleRestartFilters = () => {
    setDraftFilters(DEFAULT_FILTER_CRITERIA);
    setAppliedFilters(DEFAULT_FILTER_CRITERIA);
    setSearchQuery('');
    setFeedbackNotice('All filters restarted to default (Last 7 Days, All Mandis & Categories).');
  };

  // Resolve single exception
  const handleResolveException = (logId: string) => {
    setLogs((prev) =>
      prev.map((item) => {
        if (item.id === logId) {
          return {
            ...item,
            status: 'RESOLVED',
            resolvedAt: 'Just Now',
            resolvedBy: 'State Administrator (Online)',
          };
        }
        return item;
      })
    );
    const msg = `Exception ${logId} marked as RESOLVED. Audit resolution record saved.`;
    setFeedbackNotice(msg);
    if (Platform.OS !== 'web') {
      Alert.alert('Exception Resolved', msg);
    }
  };

  // Auto-clear notice after 5 seconds
  React.useEffect(() => {
    if (feedbackNotice) {
      const timer = setTimeout(() => setFeedbackNotice(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [feedbackNotice]);

  // Helper to count filtered records
  const getFilteredCount = (criteria: ExceptionFilterCriteria, query: string) => {
    return logs.filter((item) => matchFilter(item, criteria, query)).length;
  };

  // Predicate matching
  const matchFilter = (
    item: DetailedExceptionLog,
    criteria: ExceptionFilterCriteria,
    query: string
  ) => {
    // Date Range filter
    if (criteria.dateRange === 'today' && item.daysAgo > 0) return false;
    if (criteria.dateRange === '7days' && item.daysAgo > 6) return false;
    if (criteria.dateRange === '14days' && item.daysAgo > 13) return false;
    if (criteria.dateRange === '30days' && item.daysAgo > 29) return false;

    // District
    if (criteria.district !== 'ALL' && item.district !== criteria.district) return false;

    // Mandi
    if (criteria.mandi !== 'ALL' && item.mandiName !== criteria.mandi) return false;

    // Officer
    if (criteria.officer !== 'ALL' && !item.authorizedBy.includes(criteria.officer)) return false;

    // Exception Type
    if (criteria.exceptionType !== 'ALL' && item.type !== criteria.exceptionType) return false;

    // Severity
    if (criteria.severity !== 'ALL' && item.severity !== criteria.severity) return false;

    // Status
    if (criteria.status !== 'ALL' && item.status !== criteria.status) return false;

    // Search query
    if (query.trim()) {
      const q = query.toLowerCase();
      const matchFarmer = item.farmerName ? item.farmerName.toLowerCase().includes(q) : false;
      const matchId = item.id.toLowerCase().includes(q) || (item.farmerId ? item.farmerId.toLowerCase().includes(q) : false);
      const matchTitle = item.title.toLowerCase().includes(q);
      const matchMandi = item.mandiName.toLowerCase().includes(q);
      const matchCrop = item.cropName ? item.cropName.toLowerCase().includes(q) : false;
      const matchLot = item.lotNumber ? item.lotNumber.toLowerCase().includes(q) : false;
      const matchOfficer = item.authorizedBy.toLowerCase().includes(q);

      if (!matchFarmer && !matchId && !matchTitle && !matchMandi && !matchCrop && !matchLot && !matchOfficer) {
        return false;
      }
    }

    return true;
  };

  // Active displayed list
  const filteredList = useMemo(() => {
    return logs.filter((item) => matchFilter(item, appliedFilters, searchQuery));
  }, [logs, appliedFilters, searchQuery]);

  // Type badge styling helper
  const renderTypeBadge = (type: SystemExceptionLogType) => {
    let bg = '#E3F2FD';
    let color = '#1565C0';
    let label = 'Officer Override';
    let icon: any = 'shield-checkmark';

    if (type === 'REJECTED_LOT') {
      bg = '#FFEBEE';
      color = '#D32F2F';
      label = 'Rejected Lot';
      icon = 'close-circle';
    } else if (type === 'SYSTEM_WARNING') {
      bg = '#FFF3E0';
      color = '#E65100';
      label = 'System Warning';
      icon = 'warning';
    }

    return (
      <View style={[styles.typeBadge, { backgroundColor: bg }]}>
        <Ionicons name={icon} size={12} color={color} style={{ marginRight: 4 }} />
        <Text style={[styles.typeBadgeText, { color }]}>{label}</Text>
      </View>
    );
  };

  // Severity badge styling helper
  const renderSeverityBadge = (sev: ExceptionSeverity) => {
    let bg = '#F5F5F5';
    let color = '#757575';
    if (sev === 'CRITICAL') {
      bg = '#FFCDD2';
      color = '#B71C1C';
    } else if (sev === 'HIGH') {
      bg = '#FFE0B2';
      color = '#E65100';
    } else if (sev === 'MEDIUM') {
      bg = '#FFF9C4';
      color = '#F57F17';
    } else if (sev === 'LOW') {
      bg = '#E8F5E9';
      color = '#2E7D32';
    }

    return (
      <View style={[styles.severityBadge, { backgroundColor: bg }]}>
        <Text style={[styles.severityBadgeText, { color }]}>{sev}</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header Banner */}
      {!embedded && (
        <View style={styles.headerBanner}>
          <View style={{ flex: 1 }}>
            <View style={styles.badgeRow}>
              <View style={styles.liveIndicator}>
                <View style={styles.liveDot} />
                <Text style={styles.liveText}>SYSTEM AUDIT TRAIL</Text>
              </View>
              <Text style={styles.dateLabel}>{EXCEPTION_7DAY_METRICS.dateRangeLabel}</Text>
            </View>
            <Text style={styles.pageTitle}>System Exception Logs</Text>
            <Text style={styles.pageSubtitle}>
              Mandi officer overrides, rejected quality lots, and automated sensory warnings
            </Text>
          </View>
          <TouchableOpacity
            style={styles.exportBtn}
            onPress={() => {
              const msg = 'Audit incident log report downloaded (CSV / Signed PDF).';
              setFeedbackNotice(msg);
              if (Platform.OS !== 'web') Alert.alert('Report Exported', msg);
            }}
          >
            <Ionicons name="download-outline" size={16} color="#FFFFFF" style={{ marginRight: 6 }} />
            <Text style={styles.exportBtnText}>Export Logs</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Floating Action Notice */}
      {feedbackNotice && (
        <View style={styles.noticeCard}>
          <Ionicons name="information-circle" size={20} color="#1565C0" style={{ marginRight: 8 }} />
          <Text style={styles.noticeText}>{feedbackNotice}</Text>
          <TouchableOpacity onPress={() => setFeedbackNotice(null)}>
            <Ionicons name="close" size={18} color="#1565C0" />
          </TouchableOpacity>
        </View>
      )}

      {/* ========================================================================= */}
      {/* 1. 7-DAY EXCEPTION METRICS CARDS */}
      {/* ========================================================================= */}
      <View style={styles.sectionTitleRow}>
        <Ionicons name="calendar-outline" size={20} color={colors.primary} style={{ marginRight: 6 }} />
        <Text style={styles.sectionHeading}>Exception Statistics (Last 7 Days)</Text>
        <Text style={styles.sectionSubHeading}>({EXCEPTION_7DAY_METRICS.dateRangeLabel})</Text>
      </View>

      <View style={styles.kpiGrid}>
        {/* Total Exceptions */}
        <KisanCard style={[styles.kpiCard, { borderTopColor: '#455A64' }]}>
          <View style={styles.kpiHeaderRow}>
            <Text style={styles.kpiLabel}>Total Exceptions</Text>
            <Ionicons name="file-tray-full-outline" size={18} color="#455A64" />
          </View>
          <Text style={[styles.kpiValue, { color: '#263238' }]}>
            {EXCEPTION_7DAY_METRICS.totalExceptions}
          </Text>
          <View style={styles.kpiFooter}>
            <Text style={styles.kpiSub}>Last 7 Days</Text>
            <Text style={[styles.kpiTag, { color: '#D32F2F' }]}>
              {EXCEPTION_7DAY_METRICS.activeOpen} Open
            </Text>
          </View>
        </KisanCard>

        {/* Officer Overrides */}
        <KisanCard style={[styles.kpiCard, { borderTopColor: '#1565C0' }]}>
          <View style={styles.kpiHeaderRow}>
            <Text style={styles.kpiLabel}>Officer Overrides</Text>
            <Ionicons name="shield-checkmark-outline" size={18} color="#1565C0" />
          </View>
          <Text style={[styles.kpiValue, { color: '#0D47A1' }]}>
            {EXCEPTION_7DAY_METRICS.officerOverrides}
          </Text>
          <View style={styles.kpiFooter}>
            <Text style={styles.kpiSub}>Supervisor Approvals</Text>
            <Text style={[styles.kpiTag, { color: '#1565C0' }]}>25.7% Ratio</Text>
          </View>
        </KisanCard>

        {/* Rejected Lots */}
        <KisanCard style={[styles.kpiCard, { borderTopColor: '#D32F2F' }]}>
          <View style={styles.kpiHeaderRow}>
            <Text style={styles.kpiLabel}>Rejected Lots</Text>
            <Ionicons name="close-circle-outline" size={18} color="#D32F2F" />
          </View>
          <Text style={[styles.kpiValue, { color: '#B71C1C' }]}>
            {EXCEPTION_7DAY_METRICS.rejectedLots}
          </Text>
          <View style={styles.kpiFooter}>
            <Text style={styles.kpiSub}>Failed Quality Specs</Text>
            <Text style={[styles.kpiTag, { color: '#D32F2F' }]}>28.4% Ratio</Text>
          </View>
        </KisanCard>

        {/* System Warnings */}
        <KisanCard style={[styles.kpiCard, { borderTopColor: '#E65100' }]}>
          <View style={styles.kpiHeaderRow}>
            <Text style={styles.kpiLabel}>System Warnings</Text>
            <Ionicons name="warning-outline" size={18} color="#E65100" />
          </View>
          <Text style={[styles.kpiValue, { color: '#BF360C' }]}>
            {EXCEPTION_7DAY_METRICS.systemWarnings}
          </Text>
          <View style={styles.kpiFooter}>
            <Text style={styles.kpiSub}>Sensor & Scale Flags</Text>
            <Text style={[styles.kpiTag, { color: '#E65100' }]}>30.4% Ratio</Text>
          </View>
        </KisanCard>

        {/* Resolved */}
        <KisanCard style={[styles.kpiCard, { borderTopColor: '#2E7D32', width: '100%' }]}>
          <View style={styles.kpiHeaderRow}>
            <View>
              <Text style={styles.kpiLabel}>Resolved Exceptions</Text>
              <Text style={styles.kpiSub}>Audited, cleared, or settled disputes</Text>
            </View>
            <View style={[styles.resolvedBadge, { backgroundColor: '#E8F5E9' }]}>
              <Text style={styles.resolvedBadgeText}>
                {EXCEPTION_7DAY_METRICS.resolutionRatePct}% Resolution Rate
              </Text>
            </View>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 8, marginVertical: 4 }}>
            <Text style={[styles.kpiValue, { color: '#1B5E20' }]}>
              {EXCEPTION_7DAY_METRICS.resolved}
            </Text>
            <Text style={styles.kpiResolvedTotal}>
              / {EXCEPTION_7DAY_METRICS.totalExceptions} Total (Avg Time: {EXCEPTION_7DAY_METRICS.avgResolutionTimeHours} Hours)
            </Text>
          </View>
          {/* Progress bar */}
          <View style={styles.resolvedProgressTrack}>
            <View
              style={[
                styles.resolvedProgressBar,
                { width: `${EXCEPTION_7DAY_METRICS.resolutionRatePct}%` },
              ]}
            />
          </View>
        </KisanCard>
      </View>

      {/* ========================================================================= */}
      {/* 2. FILTER CONTROLS (District, Mandi, Officer, Type, Security, Status) */}
      {/* ========================================================================= */}
      <KisanCard style={styles.filterControlCard}>
        {/* Filter Card Header with Collapse Toggle */}
        <View style={styles.filterCardHeader}>
          <View style={styles.filterTitleGroup}>
            <Ionicons name="filter" size={18} color={colors.primary} style={{ marginRight: 6 }} />
            <Text style={styles.filterHeading}>Exception Filter Panel</Text>
            <Text style={styles.filterSub}>
              Configure criteria and press Apply (or Restart)
            </Text>
          </View>
          <TouchableOpacity
            style={styles.toggleCollapseBtn}
            onPress={() => setIsFilterPanelExpanded(!isFilterPanelExpanded)}
          >
            <Text style={styles.toggleCollapseText}>
              {isFilterPanelExpanded ? 'Collapse' : 'Expand Options'}
            </Text>
            <Ionicons
              name={isFilterPanelExpanded ? 'chevron-up' : 'chevron-down'}
              size={16}
              color={colors.primary}
            />
          </TouchableOpacity>
        </View>

        {isFilterPanelExpanded && (
          <View style={styles.filterBody}>
            {/* Row 1: Date Range & District */}
            <View style={styles.filterRow}>
              {/* Date Range Selector */}
              <View style={styles.filterField}>
                <Text style={styles.fieldLabel}>Date Range</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipScroll}>
                  {DATE_RANGE_OPTIONS.map((opt) => (
                    <TouchableOpacity
                      key={opt.value}
                      style={[
                        styles.selectChip,
                        draftFilters.dateRange === opt.value && styles.selectChipActive,
                      ]}
                      onPress={() => setDraftFilters({ ...draftFilters, dateRange: opt.value as any })}
                    >
                      <Text
                        style={[
                          styles.selectChipText,
                          draftFilters.dateRange === opt.value && styles.selectChipTextActive,
                        ]}
                      >
                        {opt.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            </View>

            {/* Row 2: District & Mandi */}
            <View style={styles.filterGrid2Col}>
              {/* District */}
              <View style={styles.filterCol}>
                <Text style={styles.fieldLabel}>District</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipScroll}>
                  {DISTRICT_OPTIONS.map((dist) => (
                    <TouchableOpacity
                      key={dist}
                      style={[
                        styles.selectChip,
                        draftFilters.district === dist && styles.selectChipActive,
                      ]}
                      onPress={() => setDraftFilters({ ...draftFilters, district: dist })}
                    >
                      <Text
                        style={[
                          styles.selectChipText,
                          draftFilters.district === dist && styles.selectChipTextActive,
                        ]}
                      >
                        {dist}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>

              {/* Mandi */}
              <View style={styles.filterCol}>
                <Text style={styles.fieldLabel}>Mandi / APMC Center</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipScroll}>
                  {MANDI_OPTIONS.map((m) => (
                    <TouchableOpacity
                      key={m}
                      style={[
                        styles.selectChip,
                        draftFilters.mandi === m && styles.selectChipActive,
                      ]}
                      onPress={() => setDraftFilters({ ...draftFilters, mandi: m })}
                    >
                      <Text
                        style={[
                          styles.selectChipText,
                          draftFilters.mandi === m && styles.selectChipTextActive,
                        ]}
                      >
                        {m}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            </View>

            {/* Row 3: Authorizing Officer */}
            <View style={styles.filterRow}>
              <Text style={styles.fieldLabel}>Authorized Officer / Sensor Source</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipScroll}>
                {OFFICER_OPTIONS.map((off) => (
                  <TouchableOpacity
                    key={off}
                    style={[
                      styles.selectChip,
                      draftFilters.officer === off && styles.selectChipActive,
                    ]}
                    onPress={() => setDraftFilters({ ...draftFilters, officer: off })}
                  >
                    <Text
                      style={[
                        styles.selectChipText,
                        draftFilters.officer === off && styles.selectChipTextActive,
                      ]}
                    >
                      {off}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            {/* Row 4: Exception Type, Severity / Security, Status */}
            <View style={styles.filterGrid3Col}>
              {/* Exception Type */}
              <View style={styles.filterCol3}>
                <Text style={styles.fieldLabel}>Exception Type</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipScroll}>
                  {EXCEPTION_TYPE_OPTIONS.map((t) => (
                    <TouchableOpacity
                      key={t.value}
                      style={[
                        styles.selectChip,
                        draftFilters.exceptionType === t.value && styles.selectChipActive,
                      ]}
                      onPress={() => setDraftFilters({ ...draftFilters, exceptionType: t.value })}
                    >
                      <Text
                        style={[
                          styles.selectChipText,
                          draftFilters.exceptionType === t.value && styles.selectChipTextActive,
                        ]}
                      >
                        {t.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>

              {/* Severity / Security */}
              <View style={styles.filterCol3}>
                <Text style={styles.fieldLabel}>Severity / Security Level</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipScroll}>
                  {SEVERITY_OPTIONS.map((s) => (
                    <TouchableOpacity
                      key={s.value}
                      style={[
                        styles.selectChip,
                        draftFilters.severity === s.value && styles.selectChipActive,
                      ]}
                      onPress={() => setDraftFilters({ ...draftFilters, severity: s.value })}
                    >
                      <Text
                        style={[
                          styles.selectChipText,
                          draftFilters.severity === s.value && styles.selectChipTextActive,
                        ]}
                      >
                        {s.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>

              {/* Status */}
              <View style={styles.filterCol3}>
                <Text style={styles.fieldLabel}>Resolution Status</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipScroll}>
                  {STATUS_OPTIONS.map((st) => (
                    <TouchableOpacity
                      key={st.value}
                      style={[
                        styles.selectChip,
                        draftFilters.status === st.value && styles.selectChipActive,
                      ]}
                      onPress={() => setDraftFilters({ ...draftFilters, status: st.value })}
                    >
                      <Text
                        style={[
                          styles.selectChipText,
                          draftFilters.status === st.value && styles.selectChipTextActive,
                        ]}
                      >
                        {st.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            </View>
          </View>
        )}

        {/* Action Buttons Row: APPLY BUTTON BESIDE RESTART BUTTON */}
        <View style={styles.actionButtonsRow}>
          <TouchableOpacity style={styles.applyButton} onPress={handleApplyFilters}>
            <Ionicons name="checkmark-done" size={18} color="#FFFFFF" style={{ marginRight: 6 }} />
            <Text style={styles.applyButtonText}>Apply Filters</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.restartButton} onPress={handleRestartFilters}>
            <Ionicons name="refresh" size={18} color="#1565C0" style={{ marginRight: 6 }} />
            <Text style={styles.restartButtonText}>Restart Filters</Text>
          </TouchableOpacity>
        </View>
      </KisanCard>

      {/* ========================================================================= */}
      {/* 3. EXCEPTION LIST (Using User & Transaction Data) */}
      {/* ========================================================================= */}
      <View style={styles.sectionHeaderWrap}>
        <View style={styles.listHeaderRow}>
          <View>
            <View style={styles.sectionTitleRow}>
              <Ionicons name="list-outline" size={20} color={colors.primary} style={{ marginRight: 6 }} />
              <Text style={styles.sectionHeading}>Exception Incident Registry</Text>
            </View>
            <Text style={styles.sectionSubDesc}>
              Showing {filteredList.length} matching exception logs across mandi weighing & assay checkpoints
            </Text>
          </View>
        </View>

        {/* Quick Search Bar */}
        <View style={styles.searchBox}>
          <Ionicons name="search" size={18} color={colors.textSecondary} style={{ marginRight: 8 }} />
          <TextInput
            placeholder="Search by Farmer Name, ID (KM-OD-...), Mandi, Lot ID, or Officer..."
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
      </View>

      {/* List items */}
      <View style={styles.exceptionListContainer}>
        {filteredList.length === 0 ? (
          <KisanCard style={styles.emptyCard}>
            <Ionicons name="shield-checkmark-outline" size={44} color="#4CAF50" />
            <Text style={styles.emptyTitle}>No exceptions match the specified criteria</Text>
            <Text style={styles.emptyDesc}>
              Click "Restart Filters" above to clear filters and view all 7-day logs.
            </Text>
            <TouchableOpacity style={styles.emptyRestartBtn} onPress={handleRestartFilters}>
              <Ionicons name="refresh" size={14} color="#1565C0" style={{ marginRight: 6 }} />
              <Text style={styles.emptyRestartText}>Restart All Filters</Text>
            </TouchableOpacity>
          </KisanCard>
        ) : (
          filteredList.map((log) => {
            const isOpen = log.status === 'OPEN';
            const isInvestigating = log.status === 'INVESTIGATING';
            const isResolved = log.status === 'RESOLVED';

            return (
              <KisanCard key={log.id} style={styles.logCard}>
                {/* Header row with ID, Badges, and Timestamp */}
                <View style={styles.cardTopRow}>
                  <View style={styles.logIdGroup}>
                    <Text style={styles.logId}>{log.id}</Text>
                    {renderTypeBadge(log.type)}
                    {renderSeverityBadge(log.severity)}
                  </View>

                  {/* Status Indicator */}
                  <View
                    style={[
                      styles.statusPill,
                      isOpen && { backgroundColor: '#FFEBEE' },
                      isInvestigating && { backgroundColor: '#FFF3E0' },
                      isResolved && { backgroundColor: '#E8F5E9' },
                    ]}
                  >
                    <Ionicons
                      name={isOpen ? 'alert-circle' : isInvestigating ? 'hourglass' : 'checkmark-circle'}
                      size={12}
                      color={isOpen ? '#D32F2F' : isInvestigating ? '#E65100' : '#2E7D32'}
                      style={{ marginRight: 4 }}
                    />
                    <Text
                      style={[
                        styles.statusPillText,
                        isOpen && { color: '#D32F2F' },
                        isInvestigating && { color: '#E65100' },
                        isResolved && { color: '#2E7D32' },
                      ]}
                    >
                      {log.status}
                    </Text>
                  </View>
                </View>

                {/* Exception Title */}
                <Text style={styles.logTitle}>{log.title}</Text>

                {/* Incident Description */}
                <Text style={styles.logDescription}>{log.description}</Text>

                {/* User / Farmer & Lot Details Grid */}
                <View style={styles.metaDataGrid}>
                  {log.farmerName && (
                    <View style={styles.metaCol}>
                      <Text style={styles.metaLabel}>Farmer Beneficiary</Text>
                      <Text style={styles.metaValue}>{log.farmerName}</Text>
                      <Text style={styles.metaSub}>ID: {log.farmerId} · {log.farmerMobile}</Text>
                    </View>
                  )}

                  {log.cropName && (
                    <View style={styles.metaCol}>
                      <Text style={styles.metaLabel}>Crop Lot Details</Text>
                      <Text style={styles.metaValue}>
                        {log.cropHindi} · {log.quantityQtl} Qtl
                      </Text>
                      <Text style={styles.metaSub}>Lot #{log.lotNumber}</Text>
                    </View>
                  )}

                  <View style={styles.metaCol}>
                    <Text style={styles.metaLabel}>Location & Centre</Text>
                    <Text style={styles.metaValue}>{log.mandiName}</Text>
                    <Text style={styles.metaSub}>District: {log.district}</Text>
                  </View>

                  <View style={styles.metaCol}>
                    <Text style={styles.metaLabel}>Authorized Authority</Text>
                    <Text style={styles.metaValue}>{log.authorizedBy}</Text>
                    <Text style={styles.metaSub}>{log.officerRole}</Text>
                  </View>
                </View>

                {/* Audit Justification Box */}
                <View style={styles.auditBox}>
                  <Ionicons name="document-text-outline" size={14} color="#37474F" style={{ marginRight: 6 }} />
                  <Text style={styles.auditText}>
                    <Text style={{ fontWeight: 'bold' }}>Audit Memo: </Text>
                    {log.auditJustification}
                  </Text>
                </View>

                {/* Footer with Timestamp and Resolution Button */}
                <View style={styles.cardFooterRow}>
                  <View style={styles.timeInfo}>
                    <Ionicons name="time-outline" size={14} color={colors.textSecondary} style={{ marginRight: 4 }} />
                    <Text style={styles.timeText}>Logged on: {log.createdAt}</Text>
                    {log.resolvedAt && (
                      <Text style={styles.resolvedTimeText}> · Resolved: {log.resolvedAt}</Text>
                    )}
                  </View>

                  {/* Actions */}
                  {isOpen ? (
                    <TouchableOpacity
                      style={styles.resolveActionBtn}
                      onPress={() => handleResolveException(log.id)}
                    >
                      <Ionicons name="checkmark-circle-outline" size={14} color="#FFFFFF" style={{ marginRight: 4 }} />
                      <Text style={styles.resolveActionBtnText}>Resolve Exception</Text>
                    </TouchableOpacity>
                  ) : (
                    <View style={styles.settledBadge}>
                      <Ionicons name="checkmark-done" size={14} color="#2E7D32" style={{ marginRight: 4 }} />
                      <Text style={styles.settledBadgeText}>Settled / Audited</Text>
                    </View>
                  )}
                </View>
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
    backgroundColor: '#38BDF8',
    marginRight: 6,
  },
  liveText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#38BDF8',
  },
  dateLabel: {
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
  noticeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E3F2FD',
    borderWidth: 1,
    borderColor: '#90CAF9',
    padding: spacing.sm,
    borderRadius: radius.sm,
    marginBottom: spacing.md,
  },
  noticeText: {
    flex: 1,
    fontSize: 12,
    color: '#0D47A1',
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
  kpiValue: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 2,
  },
  kpiFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  kpiSub: {
    fontSize: 11,
    color: colors.textSecondary,
  },
  kpiTag: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  resolvedBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
  },
  resolvedBadgeText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#2E7D32',
  },
  kpiResolvedTotal: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  resolvedProgressTrack: {
    height: 8,
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
    overflow: 'hidden',
    marginTop: 6,
  },
  resolvedProgressBar: {
    height: '100%',
    backgroundColor: '#2E7D32',
  },
  filterControlCard: {
    padding: spacing.md,
    marginVertical: spacing.sm,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  filterCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
    paddingBottom: 8,
    marginBottom: 10,
  },
  filterTitleGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  filterHeading: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  filterSub: {
    fontSize: 11,
    color: colors.textSecondary,
    marginLeft: 6,
  },
  toggleCollapseBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  toggleCollapseText: {
    fontSize: 11,
    color: colors.primary,
    fontWeight: '600',
  },
  filterBody: {
    gap: 10,
  },
  filterRow: {
    marginBottom: 4,
  },
  filterGrid2Col: {
    flexDirection: 'row',
    gap: 12,
    flexWrap: 'wrap',
  },
  filterCol: {
    flex: 1,
    minWidth: 260,
  },
  filterGrid3Col: {
    flexDirection: 'row',
    gap: 12,
    flexWrap: 'wrap',
  },
  filterCol3: {
    flex: 1,
    minWidth: 180,
  },
  filterField: {
    marginBottom: 4,
  },
  fieldLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#424242',
    marginBottom: 4,
  },
  chipScroll: {
    flexDirection: 'row',
  },
  selectChip: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 14,
    backgroundColor: '#F5F5F5',
    marginRight: 6,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  selectChipActive: {
    backgroundColor: '#1E88E5',
    borderColor: '#1565C0',
  },
  selectChipText: {
    fontSize: 11,
    color: '#424242',
    fontWeight: '500',
  },
  selectChipTextActive: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  actionButtonsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: 14,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  applyButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2E7D32',
    paddingVertical: 10,
    borderRadius: radius.sm,
    shadowColor: '#2E7D32',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  applyButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: 'bold',
  },
  restartButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#E3F2FD',
    borderWidth: 1.5,
    borderColor: '#1E88E5',
    paddingVertical: 10,
    borderRadius: radius.sm,
  },
  restartButtonText: {
    color: '#1565C0',
    fontSize: 13,
    fontWeight: 'bold',
  },
  listHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: radius.sm,
    paddingHorizontal: 12,
    paddingVertical: Platform.OS === 'ios' ? 8 : 6,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    marginTop: 6,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    color: colors.textPrimary,
  },
  exceptionListContainer: {
    gap: spacing.sm,
    marginTop: spacing.xs,
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
    textAlign: 'center',
  },
  emptyRestartBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E3F2FD',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: radius.sm,
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#90CAF9',
  },
  emptyRestartText: {
    fontSize: 12,
    color: '#1565C0',
    fontWeight: '600',
  },
  logCard: {
    padding: spacing.md,
    marginBottom: spacing.xs,
  },
  cardTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
    flexWrap: 'wrap',
    gap: 6,
  },
  logIdGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  logId: {
    fontSize: 12,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  typeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  typeBadgeText: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  severityBadge: {
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 4,
  },
  severityBadgeText: {
    fontSize: 9,
    fontWeight: 'bold',
  },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
  },
  statusPillText: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  logTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  logDescription: {
    fontSize: 12,
    color: '#424242',
    lineHeight: 17,
    marginBottom: 8,
  },
  metaDataGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    backgroundColor: '#F8FAFC',
    padding: 8,
    borderRadius: radius.xs,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 8,
  },
  metaCol: {
    flex: 1,
    minWidth: 140,
  },
  metaLabel: {
    fontSize: 9,
    color: '#64748B',
    textTransform: 'uppercase',
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  metaValue: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0F172A',
    marginTop: 1,
  },
  metaSub: {
    fontSize: 10,
    color: '#64748B',
  },
  auditBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#F1F5F9',
    padding: 8,
    borderRadius: radius.xs,
    borderLeftWidth: 3,
    borderLeftColor: '#475569',
    marginBottom: 10,
  },
  auditText: {
    fontSize: 11,
    color: '#334155',
    lineHeight: 15,
    flex: 1,
  },
  cardFooterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    paddingTop: 8,
    flexWrap: 'wrap',
    gap: 8,
  },
  timeInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeText: {
    fontSize: 11,
    color: colors.textSecondary,
  },
  resolvedTimeText: {
    fontSize: 11,
    color: '#2E7D32',
    fontWeight: '500',
  },
  resolveActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2E7D32',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 14,
  },
  resolveActionBtnText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  settledBadge: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settledBadgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#2E7D32',
  },
});
