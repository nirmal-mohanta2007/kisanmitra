import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../../src/theme/colors';
import { spacing } from '../../src/theme/spacing';
import { radius } from '../../src/theme/radius';
import {
  ScreenContainer,
  KisanCard,
  SectionHeader,
} from '../../src/components/common';

export default function AdminAnalyticsScreen() {
  return (
    <ScreenContainer scrollable style={styles.container}>
      <SectionHeader
        title="Procurement & Financial Analytics"
        subtitle="Statewide intake, payout distribution, and queue volume trends"
      />

      {/* Daily Procurement Volume */}
      <KisanCard style={styles.chartCard}>
        <Text style={styles.chartTitle}>📊 Daily Procurement Intake (Quintals)</Text>
        <View style={styles.barChartPlaceholder}>
          <View style={styles.barCol}>
            <View style={[styles.bar, { height: 60 }]} />
            <Text style={styles.barLabel}>Mon</Text>
          </View>
          <View style={styles.barCol}>
            <View style={[styles.bar, { height: 90 }]} />
            <Text style={styles.barLabel}>Tue</Text>
          </View>
          <View style={styles.barCol}>
            <View style={[styles.bar, { height: 120, backgroundColor: colors.primary }]} />
            <Text style={styles.barLabel}>Wed</Text>
          </View>
          <View style={styles.barCol}>
            <View style={[styles.bar, { height: 80 }]} />
            <Text style={styles.barLabel}>Thu</Text>
          </View>
          <View style={styles.barCol}>
            <View style={[styles.bar, { height: 110 }]} />
            <Text style={styles.barLabel}>Fri</Text>
          </View>
        </View>
      </KisanCard>

      {/* Queue Waiting Time Distribution */}
      <KisanCard style={styles.chartCard}>
        <Text style={styles.chartTitle}>⏱ Average Waiting Time by District</Text>
        <View style={styles.districtRow}>
          <Text style={styles.distName}>Bhopal District</Text>
          <View style={styles.meterTrack}>
            <View style={[styles.meterFill, { width: '40%' }]} />
          </View>
          <Text style={styles.distVal}>12 min</Text>
        </View>

        <View style={styles.districtRow}>
          <Text style={styles.distName}>Indore District</Text>
          <View style={styles.meterTrack}>
            <View style={[styles.meterFill, { width: '60%', backgroundColor: colors.accent }]} />
          </View>
          <Text style={styles.distVal}>18 min</Text>
        </View>

        <View style={styles.districtRow}>
          <Text style={styles.distName}>Jabalpur District</Text>
          <View style={styles.meterTrack}>
            <View style={[styles.meterFill, { width: '30%' }]} />
          </View>
          <Text style={styles.distVal}>9 min</Text>
        </View>
      </KisanCard>

      {/* Financial Payouts Summary */}
      <KisanCard style={styles.chartCard}>
        <Text style={styles.chartTitle}>💳 DBT Financial Disbursements</Text>
        <View style={styles.payoutRow}>
          <Text style={styles.payoutLabel}>Total Cleared This Week:</Text>
          <Text style={styles.payoutVal}>₹38.5 Crore</Text>
        </View>
        <View style={styles.payoutRow}>
          <Text style={styles.payoutLabel}>Average Time to Credit:</Text>
          <Text style={styles.payoutVal}>28 Hours</Text>
        </View>
      </KisanCard>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: spacing.md,
  },
  chartCard: {
    marginBottom: spacing.md,
  },
  chartTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  barChartPlaceholder: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    height: 140,
    paddingBottom: 8,
  },
  barCol: {
    alignItems: 'center',
    width: 36,
  },
  bar: {
    width: 24,
    backgroundColor: '#81C784',
    borderRadius: 4,
    marginBottom: 4,
  },
  barLabel: {
    fontSize: 11,
    color: colors.textSecondary,
  },
  districtRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  distName: {
    width: 100,
    fontSize: 12,
    color: colors.textPrimary,
  },
  meterTrack: {
    flex: 1,
    height: 10,
    backgroundColor: '#EEEEEE',
    borderRadius: 5,
    marginHorizontal: 8,
    overflow: 'hidden',
  },
  meterFill: {
    height: '100%',
    backgroundColor: colors.primary,
  },
  distVal: {
    width: 50,
    fontSize: 12,
    fontWeight: 'bold',
    color: colors.textPrimary,
    textAlign: 'right',
  },
  payoutRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  },
  payoutLabel: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  payoutVal: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.primary,
  },
});