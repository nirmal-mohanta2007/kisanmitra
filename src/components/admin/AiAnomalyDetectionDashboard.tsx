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
import {
  AI_ANOMALY_DATA,
  AnomalyItem,
  ALL_DASHBOARD_STATES,
  PRIMARY_STATE,
  getStateProfile,
} from '../../services/ai-anomaly.service';

interface Props {
  embedded?: boolean;
}

export const AiAnomalyDetectionDashboard: React.FC<Props> = ({ embedded = false }) => {
  // Primary State Selection (Defaults to Odisha as primary)
  const [selectedState, setSelectedState] = useState<string>(PRIMARY_STATE);

  // Active state profile with districts, mandis, and state-specific metrics
  const activeProfile = useMemo(() => getStateProfile(selectedState), [selectedState]);

  // Filter States
  const [selectedDateRange, setSelectedDateRange] = useState('Last 30 Days');
  const [selectedDistrict, setSelectedDistrict] = useState('All Districts');
  const [selectedMandi, setSelectedMandi] = useState('All Mandis');
  const [selectedAnomalyType, setSelectedAnomalyType] = useState('All Types');
  const [searchQuery, setSearchQuery] = useState('');

  // Selected anomaly details modal/drawer state
  const [selectedAnomaly, setSelectedAnomaly] = useState<AnomalyItem | null>(null);
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  // Handler for state change
  const handleStateChange = (stateName: string) => {
    setSelectedState(stateName);
    setSelectedDistrict('All Districts');
    setSelectedMandi('All Mandis');
  };

  // Filtered anomalies table
  const filteredAnomalies = useMemo(() => {
    return activeProfile.recentAnomalies.filter((item) => {
      if (selectedDistrict !== 'All Districts' && item.district !== selectedDistrict) return false;
      if (selectedMandi !== 'All Mandis' && item.mandi !== selectedMandi) return false;
      if (selectedAnomalyType !== 'All Types' && item.type !== selectedAnomalyType) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesId = item.id.toLowerCase().includes(q);
        const matchesType = item.type.toLowerCase().includes(q);
        const matchesMandi = item.mandi.toLowerCase().includes(q);
        const matchesDistrict = item.district.toLowerCase().includes(q);
        const matchesTx = item.relatedTransaction.toLowerCase().includes(q);
        if (!matchesId && !matchesType && !matchesMandi && !matchesDistrict && !matchesTx) {
          return false;
        }
      }
      return true;
    });
  }, [activeProfile, selectedDistrict, selectedMandi, selectedAnomalyType, searchQuery]);

  const handleAction = (item: AnomalyItem) => {
    setSelectedAnomaly(item);
    const msg = `Investigative case opened for ${item.id} (${item.type} at ${item.mandi}).`;
    setActionNotice(msg);
  };

  const getSeverityBadgeStyle = (severity: string) => {
    switch (severity) {
      case 'CRITICAL':
        return { bg: 'rgba(239, 68, 68, 0.2)', border: '#EF4444', text: '#F87171' };
      case 'SUSPICIOUS':
        return { bg: 'rgba(249, 115, 22, 0.2)', border: '#F97316', text: '#FB923C' };
      case 'MONITOR':
        return { bg: 'rgba(234, 179, 8, 0.2)', border: '#EAB308', text: '#FACC15' };
      case 'NORMAL':
        return { bg: 'rgba(16, 185, 129, 0.2)', border: '#10B981', text: '#34D399' };
      default:
        return { bg: 'rgba(148, 163, 184, 0.2)', border: '#94A3B8', text: '#CBD5E1' };
    }
  };

  const getStatusBadgeStyle = (status: string) => {
    switch (status) {
      case 'Under Review':
        return { bg: 'rgba(56, 189, 248, 0.2)', border: '#0284C7', text: '#38BDF8' };
      case 'Assigned':
        return { bg: 'rgba(129, 140, 248, 0.2)', border: '#6366F1', text: '#818CF8' };
      case 'Investigating':
        return { bg: 'rgba(249, 115, 22, 0.2)', border: '#EA580C', text: '#FB923C' };
      case 'New':
        return { bg: 'rgba(239, 68, 68, 0.2)', border: '#DC2626', text: '#F87171' };
      case 'Resolved':
        return { bg: 'rgba(16, 185, 129, 0.2)', border: '#059669', text: '#34D399' };
      default:
        return { bg: 'rgba(148, 163, 184, 0.2)', border: '#64748B', text: '#94A3B8' };
    }
  };

  return (
    <View style={styles.dashboardContainer}>
      {/* ========================================================================= */}
      {/* TOP HEADER */}
      {/* ========================================================================= */}
      <View style={styles.headerContainer}>
        {/* Left branding */}
        <View style={styles.headerLeft}>
          <View style={styles.govBadgeRow}>
            <View style={styles.govBadge}>
              <Text style={styles.paddyLeafIcon}>🌾</Text>
              <Text style={styles.govBadgeText}>{activeProfile.commandCenterName}</Text>
              <View style={styles.livePulseDot} />
              <Text style={styles.aiNeuralTag}>AI NEURAL MONITOR</Text>
            </View>
            {selectedState !== PRIMARY_STATE && (
              <TouchableOpacity
                style={styles.resetOdishaBtn}
                onPress={() => handleStateChange(PRIMARY_STATE)}
              >
                <Text style={styles.resetOdishaBtnText}>🌾 Switch to Odisha (Primary)</Text>
              </TouchableOpacity>
            )}
          </View>
          <Text style={styles.headerMainTitle}>KISAN MITRA — AI ANOMALY DETECTION</Text>
          <Text style={styles.headerSubtitle}>
            Monitor suspicious procurement activities using AI-powered risk analysis ({selectedState === PRIMARY_STATE ? 'Primary State Command' : `${selectedState} State APMC`})
          </Text>
        </View>

        {/* Right Filter Dropdowns (Horizontal Header Layout) */}
        <View style={styles.headerFilters}>
          {/* State Filter (All 28 States & 8 UTs with Odisha as Primary) */}
          <View style={[styles.filterGroup, { minWidth: 260 }]}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
              <Text style={styles.filterGroupLabel}>STATE / राज्य</Text>
              <Text style={styles.primaryIndicatorText}>ODISHA PRIMARY</Text>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterChipScroll}>
              {ALL_DASHBOARD_STATES.map((s) => {
                const isSelected = selectedState === s.name;
                return (
                  <TouchableOpacity
                    key={s.name}
                    style={[
                      styles.headerFilterChip,
                      s.isPrimary && styles.primaryStateChip,
                      isSelected && styles.headerFilterChipActive,
                      s.isPrimary && isSelected && styles.primaryStateChipActive,
                    ]}
                    onPress={() => handleStateChange(s.name)}
                  >
                    <Text
                      style={[
                        styles.headerFilterChipText,
                        s.isPrimary && styles.primaryStateChipText,
                        isSelected && styles.headerFilterChipTextActive,
                      ]}
                    >
                      {s.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>

          {/* Date Range Dropdown */}
          <View style={styles.filterGroup}>
            <Text style={styles.filterGroupLabel}>DATE RANGE</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterChipScroll}>
              {AI_ANOMALY_DATA.dateRanges.map((dr) => (
                <TouchableOpacity
                  key={dr}
                  style={[styles.headerFilterChip, selectedDateRange === dr && styles.headerFilterChipActive]}
                  onPress={() => setSelectedDateRange(dr)}
                >
                  <Text style={[styles.headerFilterChipText, selectedDateRange === dr && styles.headerFilterChipTextActive]}>
                    {dr}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* District Dropdown */}
          <View style={styles.filterGroup}>
            <Text style={styles.filterGroupLabel}>DISTRICT ({selectedState})</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterChipScroll}>
              {activeProfile.districts.map((dist) => (
                <TouchableOpacity
                  key={dist}
                  style={[styles.headerFilterChip, selectedDistrict === dist && styles.headerFilterChipActive]}
                  onPress={() => setSelectedDistrict(dist)}
                >
                  <Text style={[styles.headerFilterChipText, selectedDistrict === dist && styles.headerFilterChipTextActive]}>
                    {dist}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* Mandi Dropdown */}
          <View style={styles.filterGroup}>
            <Text style={styles.filterGroupLabel}>MANDI / APMC</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterChipScroll}>
              {activeProfile.mandis.map((m) => (
                <TouchableOpacity
                  key={m}
                  style={[styles.headerFilterChip, selectedMandi === m && styles.headerFilterChipActive]}
                  onPress={() => setSelectedMandi(m)}
                >
                  <Text style={[styles.headerFilterChipText, selectedMandi === m && styles.headerFilterChipTextActive]}>
                    {m}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* Anomaly Type Dropdown */}
          <View style={styles.filterGroup}>
            <Text style={styles.filterGroupLabel}>ANOMALY TYPE</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterChipScroll}>
              {AI_ANOMALY_DATA.anomalyTypes.map((t) => (
                <TouchableOpacity
                  key={t}
                  style={[styles.headerFilterChip, selectedAnomalyType === t && styles.headerFilterChipActive]}
                  onPress={() => setSelectedAnomalyType(t)}
                >
                  <Text style={[styles.headerFilterChipText, selectedAnomalyType === t && styles.headerFilterChipTextActive]}>
                    {t}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </View>

      {/* Action Notification Toast */}
      {actionNotice && (
        <View style={styles.toastBanner}>
          <Ionicons name="shield-checkmark" size={18} color="#38BDF8" style={{ marginRight: 8 }} />
          <Text style={styles.toastBannerText}>{actionNotice}</Text>
          <TouchableOpacity onPress={() => setActionNotice(null)}>
            <Ionicons name="close" size={16} color="#94A3B8" />
          </TouchableOpacity>
        </View>
      )}

      {/* ========================================================================= */}
      {/* FIRST ROW — AI RISK SUMMARY (4 KPIs) */}
      {/* ========================================================================= */}
      <View style={styles.kpiRow}>
        {/* 1. TOTAL ANOMALIES */}
        <View style={[styles.kpiCard, { borderTopColor: '#38BDF8' }]}>
          <View style={styles.kpiTop}>
            <Text style={styles.kpiHeading}>TOTAL ANOMALIES</Text>
            <View style={[styles.kpiIconBox, { backgroundColor: 'rgba(56, 189, 248, 0.15)' }]}>
              <Ionicons name="hardware-chip-outline" size={20} color="#38BDF8" />
            </View>
          </View>
          <Text style={[styles.kpiNumber, { color: '#F8FAFC' }]}>{activeProfile.totalAnomalies}</Text>
          <Text style={styles.kpiSubtitle}>Detected in {selectedState}</Text>
          <View style={styles.kpiMicroTag}>
            <Text style={[styles.kpiMicroTagText, { color: '#38BDF8' }]}>
              {selectedState === PRIMARY_STATE ? 'Primary State Network' : `${selectedState} State APMC`}
            </Text>
          </View>
        </View>

        {/* 2. CRITICAL ALERTS */}
        <View style={[styles.kpiCard, { borderTopColor: '#EF4444' }]}>
          <View style={styles.kpiTop}>
            <Text style={styles.kpiHeading}>CRITICAL ALERTS</Text>
            <View style={[styles.kpiIconBox, { backgroundColor: 'rgba(239, 68, 68, 0.15)' }]}>
              <Ionicons name="alert-circle" size={20} color="#EF4444" />
            </View>
          </View>
          <Text style={[styles.kpiNumber, { color: '#EF4444' }]}>{activeProfile.criticalAlerts}</Text>
          <Text style={styles.kpiSubtitle}>Risk Score 81–100</Text>
          <View style={[styles.kpiMicroTag, { backgroundColor: 'rgba(239, 68, 68, 0.1)' }]}>
            <Text style={[styles.kpiMicroTagText, { color: '#F87171' }]}>Immediate Halt Required</Text>
          </View>
        </View>

        {/* 3. SUSPICIOUS ACTIVITIES */}
        <View style={[styles.kpiCard, { borderTopColor: '#F97316' }]}>
          <View style={styles.kpiTop}>
            <Text style={styles.kpiHeading}>SUSPICIOUS ACTIVITIES</Text>
            <View style={[styles.kpiIconBox, { backgroundColor: 'rgba(249, 115, 22, 0.15)' }]}>
              <Ionicons name="warning" size={20} color="#F97316" />
            </View>
          </View>
          <Text style={[styles.kpiNumber, { color: '#F97316' }]}>{activeProfile.suspiciousActivities}</Text>
          <Text style={styles.kpiSubtitle}>Risk Score 61–80</Text>
          <View style={[styles.kpiMicroTag, { backgroundColor: 'rgba(249, 115, 22, 0.1)' }]}>
            <Text style={[styles.kpiMicroTagText, { color: '#FB923C' }]}>Assigned to Field Vigilance</Text>
          </View>
        </View>

        {/* 4. NORMAL / LOW RISK */}
        <View style={[styles.kpiCard, { borderTopColor: '#10B981' }]}>
          <View style={styles.kpiTop}>
            <Text style={styles.kpiHeading}>NORMAL / LOW RISK</Text>
            <View style={[styles.kpiIconBox, { backgroundColor: 'rgba(16, 185, 129, 0.15)' }]}>
              <Ionicons name="shield-checkmark" size={20} color="#10B981" />
            </View>
          </View>
          <Text style={[styles.kpiNumber, { color: '#10B981' }]}>{activeProfile.lowRiskCount}</Text>
          <Text style={styles.kpiSubtitle}>Risk Score 0–30</Text>
          <View style={[styles.kpiMicroTag, { backgroundColor: 'rgba(16, 185, 129, 0.1)' }]}>
            <Text style={[styles.kpiMicroTagText, { color: '#34D399' }]}>Verified FAQ Compliant</Text>
          </View>
        </View>
      </View>

      {/* ========================================================================= */}
      {/* SECOND SECTION — ANOMALY RISK PERFORMANCE (GAUGE & METRICS) */}
      {/* ========================================================================= */}
      <View style={styles.twoColSection}>
        {/* LEFT CARD: AI Risk Score Distribution (SEMICIRCULAR GAUGE) */}
        <View style={styles.panelCard}>
          <View style={styles.panelCardHeader}>
            <View style={styles.cardHeaderTitleRow}>
              <Ionicons name="speedometer-outline" size={18} color="#F97316" style={{ marginRight: 8 }} />
              <Text style={styles.panelCardTitle}>AI Risk Score Distribution ({selectedState})</Text>
            </View>
            <View style={styles.liveRiskBadge}>
              <Text style={styles.liveRiskBadgeText}>{selectedState.toUpperCase()} COMPOSITE RISK</Text>
            </View>
          </View>

          {/* Semicircular Gauge Representation */}
          <View style={styles.gaugeWrapper}>
            {/* Arc Track (0–100) */}
            <View style={styles.gaugeArcContainer}>
              <View style={styles.gaugeSegmentGreen} />
              <View style={styles.gaugeSegmentYellow} />
              <View style={styles.gaugeSegmentOrange} />
              <View style={styles.gaugeSegmentRed} />
            </View>

            {/* Gauge Needle pointing towards active score */}
            <View style={styles.needlePivot}>
              <View
                style={[
                  styles.needleArm,
                  {
                    transform: [
                      { rotate: `${Math.round(-90 + (activeProfile.riskScore / 100) * 180)}deg` },
                    ],
                  },
                ]}
              >
                <View style={styles.needlePointer} />
              </View>
              <View style={styles.needleCenterDot} />
            </View>

            {/* Gauge Center Value & Label */}
            <View style={styles.gaugeCenterDisplay}>
              <Text style={styles.gaugeCenterScore}>{activeProfile.riskScore}</Text>
              <Text style={styles.gaugeCenterScoreMax}>/ 100</Text>
              <Text style={styles.gaugeCenterLabel}>Current AI Risk Level</Text>
              <View
                style={[
                  styles.gaugeZoneBadge,
                  activeProfile.riskScore > 75 && { backgroundColor: 'rgba(239, 68, 68, 0.2)' },
                ]}
              >
                <Text
                  style={[
                    styles.gaugeZoneBadgeText,
                    activeProfile.riskScore > 75 && { color: '#EF4444' },
                  ]}
                >
                  {activeProfile.riskScore >= 80
                    ? 'CRITICAL ALERT ZONE'
                    : activeProfile.riskScore >= 60
                    ? 'HIGH SUSPICION ZONE'
                    : 'MODERATE MONITOR ZONE'}
                </Text>
              </View>
            </View>
          </View>

          {/* Gauge Range Bands Guide */}
          <View style={styles.gaugeBandsLegend}>
            <View style={styles.gaugeBandItem}>
              <View style={[styles.bandDot, { backgroundColor: '#10B981' }]} />
              <Text style={styles.bandRange}>0–30</Text>
              <Text style={[styles.bandLabel, { color: '#10B981' }]}>Normal</Text>
            </View>
            <View style={styles.gaugeBandItem}>
              <View style={[styles.bandDot, { backgroundColor: '#EAB308' }]} />
              <Text style={styles.bandRange}>31–60</Text>
              <Text style={[styles.bandLabel, { color: '#EAB308' }]}>Monitor</Text>
            </View>
            <View style={styles.gaugeBandItem}>
              <View style={[styles.bandDot, { backgroundColor: '#F97316' }]} />
              <Text style={styles.bandRange}>61–80</Text>
              <Text style={[styles.bandLabel, { color: '#F97316' }]}>Suspicious</Text>
            </View>
            <View style={styles.gaugeBandItem}>
              <View style={[styles.bandDot, { backgroundColor: '#EF4444' }]} />
              <Text style={styles.bandRange}>81–100</Text>
              <Text style={[styles.bandLabel, { color: '#EF4444' }]}>Critical</Text>
            </View>
          </View>

          {/* Also display counters */}
          <View style={styles.gaugeCountersGrid}>
            <View style={[styles.counterBox, { borderLeftColor: '#EF4444' }]}>
              <Text style={styles.counterBoxLabel}>Critical</Text>
              <Text style={[styles.counterBoxVal, { color: '#EF4444' }]}>12</Text>
            </View>
            <View style={[styles.counterBox, { borderLeftColor: '#F97316' }]}>
              <Text style={styles.counterBoxLabel}>Suspicious</Text>
              <Text style={[styles.counterBoxVal, { color: '#F97316' }]}>16</Text>
            </View>
            <View style={[styles.counterBox, { borderLeftColor: '#EAB308' }]}>
              <Text style={styles.counterBoxLabel}>Monitor</Text>
              <Text style={[styles.counterBoxVal, { color: '#EAB308' }]}>14</Text>
            </View>
            <View style={[styles.counterBox, { borderLeftColor: '#10B981' }]}>
              <Text style={styles.counterBoxLabel}>Normal</Text>
              <Text style={[styles.counterBoxVal, { color: '#10B981' }]}>6</Text>
            </View>
          </View>
        </View>

        {/* RIGHT CARD: AI Detection Performance (4 METRICS) */}
        <View style={styles.panelCard}>
          <View style={styles.panelCardHeader}>
            <View style={styles.cardHeaderTitleRow}>
              <Ionicons name="analytics" size={18} color="#38BDF8" style={{ marginRight: 8 }} />
              <Text style={styles.panelCardTitle}>AI Detection Performance</Text>
            </View>
            <View style={[styles.liveRiskBadge, { borderColor: '#38BDF8' }]}>
              <Text style={[styles.liveRiskBadgeText, { color: '#38BDF8' }]}>MODEL CONFIDENCE: v4.8</Text>
            </View>
          </View>

          <View style={styles.perfMetricsGrid}>
            {/* 1. Detection Confidence */}
            <View style={styles.perfItemCard}>
              <View style={styles.perfTop}>
                <View style={[styles.perfRing, { borderColor: '#38BDF8' }]}>
                  <Text style={[styles.perfPercent, { color: '#38BDF8' }]}>92%</Text>
                </View>
                <View style={[styles.aiIconBox, { backgroundColor: 'rgba(56, 189, 248, 0.15)' }]}>
                  <Ionicons name="finger-print-outline" size={20} color="#38BDF8" />
                </View>
              </View>
              <Text style={styles.perfTitle}>Detection Confidence</Text>
              <Text style={styles.perfDesc}>Ensemble neural score across 24 checkpoints</Text>
              <View style={styles.perfProgressBar}>
                <View style={[styles.perfProgressFill, { width: '92%', backgroundColor: '#38BDF8' }]}>
                </View>
              </View>
            </View>

            {/* 2. Weight Manipulation Detection */}
            <View style={styles.perfItemCard}>
              <View style={styles.perfTop}>
                <View style={[styles.perfRing, { borderColor: '#10B981' }]}>
                  <Text style={[styles.perfPercent, { color: '#10B981' }]}>87%</Text>
                </View>
                <View style={[styles.aiIconBox, { backgroundColor: 'rgba(16, 185, 129, 0.15)' }]}>
                  <Ionicons name="scale-outline" size={20} color="#10B981" />
                </View>
              </View>
              <Text style={styles.perfTitle}>Weight Manipulation Detection</Text>
              <Text style={styles.perfDesc}>Tare-to-gross sensor correlation precision</Text>
              <View style={styles.perfProgressBar}>
                <View style={[styles.perfProgressFill, { width: '87%', backgroundColor: '#10B981' }]}>
                </View>
              </View>
            </View>

            {/* 3. Fake Booking Detection */}
            <View style={styles.perfItemCard}>
              <View style={styles.perfTop}>
                <View style={[styles.perfRing, { borderColor: '#818CF8' }]}>
                  <Text style={[styles.perfPercent, { color: '#818CF8' }]}>78%</Text>
                </View>
                <View style={[styles.aiIconBox, { backgroundColor: 'rgba(129, 140, 248, 0.15)' }]}>
                  <Ionicons name="id-card-outline" size={20} color="#818CF8" />
                </View>
              </View>
              <Text style={styles.perfTitle}>Fake Booking Detection</Text>
              <Text style={styles.perfDesc}>Aadhaar-to-land registry satellite verification</Text>
              <View style={styles.perfProgressBar}>
                <View style={[styles.perfProgressFill, { width: '78%', backgroundColor: '#818CF8' }]}>
                </View>
              </View>
            </View>

            {/* 4. Suspicious Transaction Detection */}
            <View style={styles.perfItemCard}>
              <View style={styles.perfTop}>
                <View style={[styles.perfRing, { borderColor: '#F59E0B' }]}>
                  <Text style={[styles.perfPercent, { color: '#F59E0B' }]}>84%</Text>
                </View>
                <View style={[styles.aiIconBox, { backgroundColor: 'rgba(245, 158, 11, 0.15)' }]}>
                  <Ionicons name="cash-outline" size={20} color="#F59E0B" />
                </View>
              </View>
              <Text style={styles.perfTitle}>Suspicious Transaction Detection</Text>
              <Text style={styles.perfDesc}>Rapid token velocity and cyclical UTR tracking</Text>
              <View style={styles.perfProgressBar}>
                <View style={[styles.perfProgressFill, { width: '84%', backgroundColor: '#F59E0B' }]}>
                </View>
              </View>
            </View>
          </View>
        </View>
      </View>

      {/* ========================================================================= */}
      {/* THIRD SECTION — ANOMALY TYPE ANALYSIS (BAR CHART & DONUT) */}
      {/* ========================================================================= */}
      <View style={styles.twoColSection}>
        {/* LEFT CARD: Anomalies by Type (Horizontal Bar Chart) */}
        <View style={styles.panelCard}>
          <View style={styles.panelCardHeader}>
            <View style={styles.cardHeaderTitleRow}>
              <Ionicons name="bar-chart-outline" size={18} color="#A78BFA" style={{ marginRight: 8 }} />
              <Text style={styles.panelCardTitle}>Anomalies by Type</Text>
            </View>
            <Text style={styles.panelCardSubtitle}>Category frequency distribution</Text>
          </View>

          <View style={styles.barChartContainer}>
            {AI_ANOMALY_DATA.anomaliesByType.map((item) => {
              const maxCount = 16;
              const fillWidth = `${(item.count / maxCount) * 100}%`;
              return (
                <View key={item.type} style={styles.barRow}>
                  <View style={styles.barLabelCol}>
                    <Text style={styles.barTypeLabel}>{item.type}</Text>
                    <Text style={styles.barCountNumber}>{item.count} Cases</Text>
                  </View>
                  <View style={styles.barTrack}>
                    <View
                      style={[
                        styles.barFill,
                        { width: fillWidth as any, backgroundColor: item.color },
                      ]}
                    />
                  </View>
                  <Text style={[styles.barPctText, { color: item.color }]}>{item.percentage}%</Text>
                </View>
              );
            })}
          </View>
        </View>

        {/* RIGHT CARD: Risk Severity Distribution (Donut / Segmented Chart) */}
        <View style={styles.panelCard}>
          <View style={styles.panelCardHeader}>
            <View style={styles.cardHeaderTitleRow}>
              <Ionicons name="pie-chart-outline" size={18} color="#F87171" style={{ marginRight: 8 }} />
              <Text style={styles.panelCardTitle}>Risk Severity Distribution</Text>
            </View>
            <Text style={styles.panelCardSubtitle}>Proportional severity classification</Text>
          </View>

          {/* Donut representation */}
          <View style={styles.donutContainer}>
            <View style={styles.donutGraphic}>
              <View style={styles.donutRingOuter}>
                <View style={styles.donutRingHole}>
                  <Text style={styles.donutCenterValue}>48</Text>
                  <Text style={styles.donutCenterLabel}>TOTAL ALERTS</Text>
                </View>
              </View>
            </View>

            {/* Severity Breakdown Legend */}
            <View style={styles.donutLegendList}>
              {AI_ANOMALY_DATA.severityDistribution.map((sev) => (
                <View key={sev.label} style={styles.donutLegendItem}>
                  <View style={[styles.donutDot, { backgroundColor: sev.color }]} />
                  <View style={{ flex: 1 }}>
                    <Text style={styles.donutLegendLabel}>{sev.label}</Text>
                    <Text style={styles.donutLegendSub}>{sev.count} incidents flagged</Text>
                  </View>
                  <Text style={[styles.donutLegendPct, { color: sev.color }]}>{sev.percentage}%</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Visual multi-segment bar */}
          <View style={styles.segmentedBar}>
            <View style={[styles.segmentPart, { width: '25%', backgroundColor: '#EF4444' }]} />
            <View style={[styles.segmentPart, { width: '33%', backgroundColor: '#F97316' }]} />
            <View style={[styles.segmentPart, { width: '29%', backgroundColor: '#EAB308' }]} />
            <View style={[styles.segmentPart, { width: '13%', backgroundColor: '#10B981' }]} />
          </View>
        </View>
      </View>

      {/* ========================================================================= */}
      {/* AI INSIGHTS PANEL */}
      {/* ========================================================================= */}
      <View style={styles.insightsCard}>
        <View style={styles.insightsHeader}>
          <View style={styles.insightsTitleGroup}>
            <Ionicons name="bulb-outline" size={20} color="#FBBF24" style={{ marginRight: 8 }} />
            <Text style={styles.insightsTitle}>AI INSIGHTS & THREAT VECTORS</Text>
          </View>
          <View style={styles.neuralStatusBadge}>
            <Ionicons name="pulse" size={12} color="#10B981" style={{ marginRight: 4 }} />
            <Text style={styles.neuralStatusText}>LIVE PATTERN RECOGNITION</Text>
          </View>
        </View>

        <View style={styles.insightsList}>
          {activeProfile.insights.map((insight, idx) => (
            <View key={idx} style={styles.insightRow}>
              <Text style={styles.insightBullet}>•</Text>
              <Text style={styles.insightText}>{insight}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* ========================================================================= */}
      {/* BOTTOM SECTION — RECENT AI ANOMALIES TABLE */}
      {/* ========================================================================= */}
      <View style={styles.tablePanelCard}>
        <View style={styles.tableCardHeader}>
          <View style={styles.tableTitleGroup}>
            <Ionicons name="file-tray-full-outline" size={18} color="#38BDF8" style={{ marginRight: 8 }} />
            <Text style={styles.tableTitle}>Recent AI Anomalies</Text>
            <Text style={styles.tableCountTag}>{filteredAnomalies.length} Records Shown</Text>
          </View>

          {/* Quick Table Search */}
          <View style={styles.tableSearchBar}>
            <Ionicons name="search" size={14} color="#94A3B8" style={{ marginRight: 6 }} />
            <TextInput
              placeholder="Search Anomaly ID, Mandi, District, or Transaction..."
              placeholderTextColor="#64748B"
              value={searchQuery}
              onChangeText={setSearchQuery}
              style={styles.tableSearchInput}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery('')}>
                <Ionicons name="close-circle" size={14} color="#94A3B8" />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Scrollable Wide Desktop Table */}
        <ScrollView horizontal showsHorizontalScrollIndicator={true} style={styles.tableHorizontalScroll}>
          <View style={styles.tableWrapper}>
            {/* Table Header Row */}
            <View style={styles.tableHeaderRow}>
              <Text style={[styles.thCell, { width: 110 }]}>ANOMALY ID</Text>
              <Text style={[styles.thCell, { width: 180 }]}>ANOMALY TYPE</Text>
              <Text style={[styles.thCell, { width: 120 }]}>DISTRICT</Text>
              <Text style={[styles.thCell, { width: 160 }]}>MANDI</Text>
              <Text style={[styles.thCell, { width: 140 }]}>RELATED TXN</Text>
              <Text style={[styles.thCell, { width: 110 }]}>RISK SCORE</Text>
              <Text style={[styles.thCell, { width: 130 }]}>SEVERITY</Text>
              <Text style={[styles.thCell, { width: 130 }]}>STATUS</Text>
              <Text style={[styles.thCell, { width: 120 }]}>ACTION</Text>
            </View>

            {/* Table Body Rows */}
            {filteredAnomalies.map((item, index) => {
              const sevStyle = getSeverityBadgeStyle(item.severity);
              const statusStyle = getStatusBadgeStyle(item.status);
              const isEven = index % 2 === 0;

              return (
                <View
                  key={item.id}
                  style={[styles.tableDataRow, isEven && { backgroundColor: 'rgba(255, 255, 255, 0.02)' }]}
                >
                  {/* Anomaly ID */}
                  <View style={[styles.tdCell, { width: 110 }]}>
                    <Text style={styles.anomalyIdText}>{item.id}</Text>
                    <Text style={styles.timeAgoText}>{item.timestamp}</Text>
                  </View>

                  {/* Anomaly Type */}
                  <View style={[styles.tdCell, { width: 180 }]}>
                    <Text style={styles.tdPrimaryText}>{item.type}</Text>
                    <Text style={styles.tdSubText} numberOfLines={1}>{item.details}</Text>
                  </View>

                  {/* District */}
                  <View style={[styles.tdCell, { width: 120 }]}>
                    <Text style={styles.tdText}>{item.district}</Text>
                  </View>

                  {/* Mandi */}
                  <View style={[styles.tdCell, { width: 160 }]}>
                    <Text style={styles.tdText}>{item.mandi}</Text>
                  </View>

                  {/* Related Transaction */}
                  <View style={[styles.tdCell, { width: 140 }]}>
                    <View style={styles.txnCodePill}>
                      <Text style={styles.txnCodeText}>{item.relatedTransaction}</Text>
                    </View>
                  </View>

                  {/* Risk Score */}
                  <View style={[styles.tdCell, { width: 110 }]}>
                    <View style={styles.scoreRow}>
                      <Text
                        style={[
                          styles.scoreNumber,
                          {
                            color:
                              item.riskScore >= 80
                                ? '#EF4444'
                                : item.riskScore >= 60
                                ? '#F97316'
                                : item.riskScore >= 30
                                ? '#EAB308'
                                : '#10B981',
                          },
                        ]}
                      >
                        {item.riskScore}
                      </Text>
                      <Text style={styles.scoreMax}>/100</Text>
                    </View>
                  </View>

                  {/* Severity Badge */}
                  <View style={[styles.tdCell, { width: 130 }]}>
                    <View
                      style={[
                        styles.tableBadge,
                        { backgroundColor: sevStyle.bg, borderColor: sevStyle.border },
                      ]}
                    >
                      <Text style={[styles.tableBadgeText, { color: sevStyle.text }]}>
                        {item.severity}
                      </Text>
                    </View>
                  </View>

                  {/* Status Badge */}
                  <View style={[styles.tdCell, { width: 130 }]}>
                    <View
                      style={[
                        styles.tableBadge,
                        { backgroundColor: statusStyle.bg, borderColor: statusStyle.border },
                      ]}
                    >
                      <Text style={[styles.tableBadgeText, { color: statusStyle.text }]}>
                        {item.status}
                      </Text>
                    </View>
                  </View>

                  {/* Action Button */}
                  <View style={[styles.tdCell, { width: 120 }]}>
                    <TouchableOpacity
                      style={styles.reviewActionBtn}
                      onPress={() => handleAction(item)}
                    >
                      <Text style={styles.reviewActionBtnText}>Review →</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              );
            })}
          </View>
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  dashboardContainer: {
    backgroundColor: '#0A0E1A',
    padding: 16,
    paddingBottom: 40,
  },
  headerContainer: {
    backgroundColor: '#111827',
    borderRadius: 12,
    padding: 18,
    borderWidth: 1,
    borderColor: '#1F2937',
    marginBottom: 16,
  },
  headerLeft: {
    marginBottom: 14,
  },
  govBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 6,
  },
  govBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexWrap: 'wrap',
  },
  resetOdishaBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    borderWidth: 1,
    borderColor: '#10B981',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  resetOdishaBtnText: {
    fontSize: 11,
    color: '#34D399',
    fontWeight: 'bold',
  },
  paddyLeafIcon: {
    fontSize: 16,
  },
  govBadgeText: {
    color: '#10B981',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  livePulseDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#38BDF8',
  },
  aiNeuralTag: {
    color: '#38BDF8',
    fontSize: 10,
    fontWeight: '700',
    backgroundColor: 'rgba(56, 189, 248, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  headerMainTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: '#F8FAFC',
    letterSpacing: 0.5,
  },
  headerSubtitle: {
    fontSize: 13,
    color: '#94A3B8',
    marginTop: 4,
  },
  headerFilters: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 14,
    borderTopWidth: 1,
    borderTopColor: '#1F2937',
    paddingTop: 12,
  },
  filterGroup: {
    minWidth: 200,
    flex: 1,
  },
  filterGroupLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: '#64748B',
    marginBottom: 6,
    letterSpacing: 0.6,
  },
  filterChipScroll: {
    flexDirection: 'row',
  },
  primaryIndicatorText: {
    fontSize: 9,
    color: '#10B981',
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  headerFilterChip: {
    backgroundColor: '#1E293B',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    marginRight: 6,
    borderWidth: 1,
    borderColor: '#334155',
  },
  primaryStateChip: {
    backgroundColor: '#064E3B',
    borderColor: '#059669',
    borderWidth: 1.5,
  },
  primaryStateChipActive: {
    backgroundColor: '#047857',
    borderColor: '#34D399',
  },
  primaryStateChipText: {
    color: '#6EE7B7',
    fontWeight: '800',
  },
  headerFilterChipActive: {
    backgroundColor: '#0F766E',
    borderColor: '#10B981',
  },
  headerFilterChipText: {
    fontSize: 11,
    color: '#94A3B8',
    fontWeight: '600',
  },
  headerFilterChipTextActive: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  toastBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0F172A',
    borderWidth: 1,
    borderColor: '#0284C7',
    padding: 10,
    borderRadius: 8,
    marginBottom: 16,
  },
  toastBannerText: {
    flex: 1,
    fontSize: 12,
    color: '#E0F2FE',
    fontWeight: '500',
  },
  kpiRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 16,
  },
  kpiCard: {
    flex: 1,
    minWidth: 240,
    backgroundColor: '#111827',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#1F2937',
    borderTopWidth: 4,
  },
  kpiTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  kpiHeading: {
    fontSize: 11,
    fontWeight: '800',
    color: '#94A3B8',
    letterSpacing: 0.5,
  },
  kpiIconBox: {
    width: 34,
    height: 34,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  kpiNumber: {
    fontSize: 32,
    fontWeight: '900',
    marginBottom: 2,
  },
  kpiSubtitle: {
    fontSize: 12,
    color: '#64748B',
    marginBottom: 8,
  },
  kpiMicroTag: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  kpiMicroTagText: {
    fontSize: 10,
    fontWeight: '700',
  },
  twoColSection: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    marginBottom: 16,
  },
  panelCard: {
    flex: 1,
    minWidth: 360,
    backgroundColor: '#111827',
    borderRadius: 12,
    padding: 18,
    borderWidth: 1,
    borderColor: '#1F2937',
  },
  panelCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#1F2937',
    paddingBottom: 10,
    flexWrap: 'wrap',
    gap: 8,
  },
  cardHeaderTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  panelCardTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#F8FAFC',
  },
  panelCardSubtitle: {
    fontSize: 11,
    color: '#64748B',
  },
  liveRiskBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#F97316',
  },
  liveRiskBadgeText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#F97316',
    letterSpacing: 0.5,
  },
  gaugeWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 14,
  },
  gaugeArcContainer: {
    width: 220,
    height: 110,
    borderTopLeftRadius: 110,
    borderTopRightRadius: 110,
    backgroundColor: '#1E293B',
    overflow: 'hidden',
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#334155',
  },
  gaugeSegmentGreen: {
    width: '30%',
    height: '100%',
    backgroundColor: '#10B981',
    opacity: 0.85,
  },
  gaugeSegmentYellow: {
    width: '30%',
    height: '100%',
    backgroundColor: '#EAB308',
    opacity: 0.85,
  },
  gaugeSegmentOrange: {
    width: '20%',
    height: '100%',
    backgroundColor: '#F97316',
    opacity: 0.9,
  },
  gaugeSegmentRed: {
    width: '20%',
    height: '100%',
    backgroundColor: '#EF4444',
    opacity: 0.95,
  },
  needlePivot: {
    position: 'absolute',
    bottom: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  needleArm: {
    width: 4,
    height: 75,
    backgroundColor: '#FFFFFF',
    borderRadius: 2,
    transformOrigin: 'bottom center' as any,
  },
  needlePointer: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#F97316',
    alignSelf: 'center',
    marginTop: -4,
  },
  needleCenterDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#F8FAFC',
    borderWidth: 3,
    borderColor: '#0F172A',
  },
  gaugeCenterDisplay: {
    alignItems: 'center',
    marginTop: 10,
  },
  gaugeCenterScore: {
    fontSize: 38,
    fontWeight: '900',
    color: '#F97316',
  },
  gaugeCenterScoreMax: {
    fontSize: 12,
    color: '#64748B',
    marginTop: -4,
  },
  gaugeCenterLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#CBD5E1',
    marginTop: 2,
  },
  gaugeZoneBadge: {
    backgroundColor: 'rgba(249, 115, 22, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    marginTop: 4,
    borderWidth: 1,
    borderColor: '#F97316',
  },
  gaugeZoneBadgeText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#FB923C',
  },
  gaugeBandsLegend: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderTopWidth: 1,
    borderTopColor: '#1F2937',
    paddingTop: 12,
    marginTop: 8,
  },
  gaugeBandItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  bandDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  bandRange: {
    fontSize: 10,
    color: '#64748B',
  },
  bandLabel: {
    fontSize: 11,
    fontWeight: '700',
  },
  gaugeCountersGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
    gap: 8,
  },
  counterBox: {
    flex: 1,
    backgroundColor: '#0F172A',
    padding: 10,
    borderRadius: 8,
    borderLeftWidth: 3,
    borderWidth: 1,
    borderColor: '#1E293B',
  },
  counterBoxLabel: {
    fontSize: 10,
    color: '#94A3B8',
    fontWeight: '600',
  },
  counterBoxVal: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 2,
  },
  perfMetricsGrid: {
    gap: 12,
  },
  perfItemCard: {
    backgroundColor: '#0F172A',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#1E293B',
  },
  perfTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  perfRing: {
    borderWidth: 2,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 14,
  },
  perfPercent: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  aiIconBox: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  perfTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#F1F5F9',
  },
  perfDesc: {
    fontSize: 11,
    color: '#64748B',
    marginVertical: 4,
  },
  perfProgressBar: {
    height: 4,
    backgroundColor: '#1E293B',
    borderRadius: 2,
    overflow: 'hidden',
  },
  perfProgressFill: {
    height: '100%',
  },
  barChartContainer: {
    gap: 12,
  },
  barRow: {
    gap: 4,
  },
  barLabelCol: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  barTypeLabel: {
    fontSize: 12,
    color: '#E2E8F0',
    fontWeight: '600',
  },
  barCountNumber: {
    fontSize: 11,
    color: '#94A3B8',
  },
  barTrack: {
    height: 10,
    backgroundColor: '#1E293B',
    borderRadius: 5,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: 5,
  },
  barPctText: {
    fontSize: 10,
    fontWeight: 'bold',
    alignSelf: 'flex-end',
  },
  donutContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 18,
    marginVertical: 8,
  },
  donutGraphic: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  donutRingOuter: {
    width: 110,
    height: 110,
    borderRadius: 55,
    borderWidth: 10,
    borderColor: '#F97316',
    borderTopColor: '#EF4444',
    borderRightColor: '#EAB308',
    borderBottomColor: '#10B981',
    alignItems: 'center',
    justifyContent: 'center',
  },
  donutRingHole: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: '#111827',
    alignItems: 'center',
    justifyContent: 'center',
  },
  donutCenterValue: {
    fontSize: 20,
    fontWeight: '900',
    color: '#F8FAFC',
  },
  donutCenterLabel: {
    fontSize: 7,
    fontWeight: '800',
    color: '#64748B',
  },
  donutLegendList: {
    flex: 1,
    gap: 6,
  },
  donutLegendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  donutDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  donutLegendLabel: {
    fontSize: 11,
    color: '#F1F5F9',
    fontWeight: '600',
  },
  donutLegendSub: {
    fontSize: 9,
    color: '#64748B',
  },
  donutLegendPct: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  segmentedBar: {
    height: 6,
    flexDirection: 'row',
    backgroundColor: '#1E293B',
    borderRadius: 3,
    overflow: 'hidden',
    marginTop: 14,
  },
  segmentPart: {
    height: '100%',
  },
  insightsCard: {
    backgroundColor: '#111827',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#1F2937',
    borderLeftWidth: 4,
    borderLeftColor: '#FBBF24',
    marginBottom: 16,
  },
  insightsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    flexWrap: 'wrap',
    gap: 8,
  },
  insightsTitleGroup: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  insightsTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#F8FAFC',
    letterSpacing: 0.5,
  },
  neuralStatusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
  },
  neuralStatusText: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#10B981',
  },
  insightsList: {
    gap: 6,
  },
  insightRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  insightBullet: {
    color: '#FBBF24',
    fontSize: 14,
    lineHeight: 18,
  },
  insightText: {
    fontSize: 12,
    color: '#CBD5E1',
    flex: 1,
    lineHeight: 18,
  },
  tablePanelCard: {
    backgroundColor: '#111827',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#1F2937',
  },
  tableCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    flexWrap: 'wrap',
    gap: 10,
  },
  tableTitleGroup: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tableTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#F8FAFC',
    marginRight: 8,
  },
  tableCountTag: {
    fontSize: 11,
    color: '#38BDF8',
    backgroundColor: 'rgba(56, 189, 248, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  tableSearchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0F172A',
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: Platform.OS === 'ios' ? 6 : 4,
    borderWidth: 1,
    borderColor: '#334155',
    minWidth: 260,
  },
  tableSearchInput: {
    flex: 1,
    fontSize: 12,
    color: '#F8FAFC',
  },
  tableHorizontalScroll: {
    marginTop: 4,
  },
  tableWrapper: {
    minWidth: 1050,
  },
  tableHeaderRow: {
    flexDirection: 'row',
    backgroundColor: '#0F172A',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#1F2937',
    borderRadius: 6,
  },
  thCell: {
    fontSize: 10,
    fontWeight: '800',
    color: '#64748B',
    letterSpacing: 0.6,
  },
  tableDataRow: {
    flexDirection: 'row',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#1F2937',
    alignItems: 'center',
  },
  tdCell: {
    justifyContent: 'center',
  },
  anomalyIdText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#38BDF8',
  },
  timeAgoText: {
    fontSize: 10,
    color: '#64748B',
  },
  tdPrimaryText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#F1F5F9',
  },
  tdSubText: {
    fontSize: 10,
    color: '#64748B',
  },
  tdText: {
    fontSize: 12,
    color: '#CBD5E1',
  },
  txnCodePill: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    alignSelf: 'flex-start',
  },
  txnCodeText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#A5B4FC',
  },
  scoreRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  scoreNumber: {
    fontSize: 16,
    fontWeight: '900',
  },
  scoreMax: {
    fontSize: 10,
    color: '#64748B',
  },
  tableBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
    borderWidth: 1,
    alignSelf: 'flex-start',
  },
  tableBadgeText: {
    fontSize: 10,
    fontWeight: '800',
  },
  reviewActionBtn: {
    backgroundColor: '#0284C7',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  reviewActionBtnText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
});
