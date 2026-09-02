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
  FirebaseStatusBadge,
} from '../../src/components/common';
import { MOCK_CENTRES } from '../../src/services/mock-data.service';

export default function AdminDashboard() {
  const router = useRouter();

  return (
    <ScreenContainer scrollable style={styles.container}>
      <FirebaseStatusBadge />

      {/* Admin Title Banner */}
      <View style={styles.adminBanner}>
        <View>
          <Text style={styles.adminSub}>STATE PROCUREMENT COMMAND</Text>
          <Text style={styles.adminTitle}>Central Monitoring Dashboard</Text>
          <Text style={styles.adminMeta}>Jurisdiction: Madhya Pradesh State • 2026 Season</Text>
        </View>
        <TouchableOpacity
          style={styles.switchRoleBtn}
          onPress={() => router.replace('/(auth)/welcome')}
        >
          <Ionicons name="log-out-outline" size={16} color="#FFFFFF" />
          <Text style={styles.switchRoleText}>Logout</Text>
        </TouchableOpacity>
      </View>

      {/* 6 Key Operational KPI Cards (Section 10) */}
      <SectionHeader title="Statewide Live KPIs" subtitle="Real-time procurement & queue aggregate" />
      <View style={styles.kpiGrid}>
        <View style={styles.kpiCard}>
          <Text style={styles.kpiValue}>24</Text>
          <Text style={styles.kpiLabel}>Active Centres</Text>
          <Text style={styles.kpiTrend}>🟢 100% Online</Text>
        </View>

        <View style={styles.kpiCard}>
          <Text style={[styles.kpiValue, { color: colors.secondary }]}>1,420</Text>
          <Text style={styles.kpiLabel}>Today's Bookings</Text>
          <Text style={styles.kpiTrend}>+12% vs Yesterday</Text>
        </View>

        <View style={styles.kpiCard}>
          <Text style={[styles.kpiValue, { color: colors.accent }]}>218</Text>
          <Text style={styles.kpiLabel}>Active Queues</Text>
          <Text style={styles.kpiTrend}>Avg wait 18 min</Text>
        </View>

        <View style={styles.kpiCard}>
          <Text style={[styles.kpiValue, { color: colors.primary }]}>864</Text>
          <Text style={styles.kpiLabel}>Procurement Done</Text>
          <Text style={styles.kpiTrend}>21,600 Quintals</Text>
        </View>

        <View style={styles.kpiCard}>
          <Text style={[styles.kpiValue, { color: colors.warning }]}>3</Text>
          <Text style={styles.kpiLabel}>Delayed Cases</Text>
          <Text style={styles.kpiTrend}>&gt; 25 min wait</Text>
        </View>

        <View style={styles.kpiCard}>
          <Text style={[styles.kpiValue, { color: '#7B1FA2' }]}>₹4.8 Cr</Text>
          <Text style={styles.kpiLabel}>Payment Pending</Text>
          <Text style={styles.kpiTrend}>In Bank Clearing</Text>
        </View>
      </View>

      {/* Quick Navigation Panels */}
      <SectionHeader title="Operational Command Sections" />
      <View style={styles.navRow}>
        <TouchableOpacity
          style={styles.navCard}
          onPress={() => router.push('/(admin)/mandis')}
        >
          <Ionicons name="business" size={24} color={colors.primary} />
          <Text style={styles.navCardTitle}>Mandi Monitoring</Text>
          <Text style={styles.navCardSub}>Centres & capacity</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navCard}
          onPress={() => router.push('/(admin)/analytics')}
        >
          <Ionicons name="bar-chart" size={24} color={colors.secondary} />
          <Text style={styles.navCardTitle}>Analytics</Text>
          <Text style={styles.navCardSub}>Trends & metrics</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.navRow}>
        <TouchableOpacity
          style={styles.navCard}
          onPress={() => router.push('/(admin)/payments')}
        >
          <Ionicons name="cash" size={24} color="#7B1FA2" />
          <Text style={styles.navCardTitle}>Treasury Payments</Text>
          <Text style={styles.navCardSub}>DBT settlement</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navCard}
          onPress={() => router.push('/(admin)/exceptions')}
        >
          <Ionicons name="alert-circle" size={24} color={colors.error} />
          <Text style={styles.navCardTitle}>Exceptions</Text>
          <Text style={styles.navCardSub}>Dispute resolution</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.navRow}>
        <TouchableOpacity
          style={[styles.navCard, { width: '100%' }]}
          onPress={() => router.push('/(admin)/anomalies')}
        >
          <Ionicons name="warning" size={24} color={colors.warning} />
          <Text style={styles.navCardTitle}>Automated Anomaly Detection</Text>
          <Text style={styles.navCardSub}>Queue spikes, weighing variance & suspicious delays</Text>
        </TouchableOpacity>
      </View>

      {/* Centre Live Overview Snippet */}
      <SectionHeader
        title="Procurement Centres Overview"
        actionText="View All Mandis"
        onAction={() => router.push('/(admin)/mandis')}
      />
      {MOCK_CENTRES.map((c) => (
        <KisanCard key={c.id} style={styles.centreCard}>
          <View style={styles.centreHeader}>
            <Text style={styles.centreName}>{c.name}</Text>
            <StatusBadge status={c.isActive ? 'OPERATING' : 'CLOSED'} variant="success" />
          </View>
          <View style={styles.centreMetrics}>
            <Text style={styles.metricText}>📦 Cap: {c.capacity}/day</Text>
            <Text style={styles.metricText}>⏱ Delay: {c.currentDelay} min</Text>
            <Text style={styles.metricText}>📍 {c.district}</Text>
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
  adminBanner: {
    backgroundColor: '#37474F',
    padding: spacing.md,
    borderRadius: radius.md,
    marginBottom: spacing.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  adminSub: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#80CBC4',
    letterSpacing: 0.5,
  },
  adminTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: 2,
  },
  adminMeta: {
    fontSize: 11,
    color: '#B0BEC5',
    marginTop: 2,
  },
  switchRoleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: radius.sm,
    backgroundColor: '#455A64',
  },
  switchRoleText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginLeft: 4,
  },
  kpiGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  kpiCard: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  kpiValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.primary,
  },
  kpiLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textPrimary,
    marginTop: 2,
  },
  kpiTrend: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 4,
  },
  navRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  navCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: spacing.md,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  navCardTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginTop: 6,
  },
  navCardSub: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 2,
  },
  centreCard: {
    marginBottom: spacing.sm,
  },
  centreHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  centreName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  centreMetrics: {
    flexDirection: 'row',
    gap: 12,
  },
  metricText: {
    fontSize: 12,
    color: colors.textSecondary,
  },
});