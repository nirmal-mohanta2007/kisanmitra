import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
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
  KisanButton,
} from '../../../src/components/common';

export default function FarmerQueueScreen() {
  const router = useRouter();
  const { bookingId } = useLocalSearchParams();

  const yourToken = 42;
  const currentToken = 38;
  const tokensAhead = yourToken - currentToken;
  const avgServiceTime = 8; // mins
  const estimatedWaitMins = tokensAhead * avgServiceTime;

  return (
    <ScreenContainer scrollable style={styles.container}>
      {/* Live Status Pill */}
      <View style={styles.liveHeader}>
        <View style={styles.liveDot} />
        <Text style={styles.liveText}>LIVE MANDI QUEUE TRACKER</Text>
        <StatusBadge status="WAITING" variant="warning" />
      </View>

      {/* Main Token Comparison Card */}
      <KisanCard style={styles.queueMainCard}>
        <View style={styles.tokenCompareRow}>
          <View style={styles.tokenBox}>
            <Text style={styles.tokenBoxLabel}>NOW SERVING</Text>
            <Text style={styles.currentTokenText}>#{currentToken}</Text>
            <Text style={styles.tokenBoxSub}>Weighbridge #2</Text>
          </View>

          <View style={styles.tokenArrowBox}>
            <Ionicons name="arrow-forward" size={24} color={colors.primary} />
            <Text style={styles.tokensAheadCount}>{tokensAhead} Ahead</Text>
          </View>

          <View style={[styles.tokenBox, styles.yourTokenBox]}>
            <Text style={styles.tokenBoxLabel}>YOUR TOKEN</Text>
            <Text style={styles.yourTokenText}>#{yourToken}</Text>
            <Text style={styles.tokenBoxSub}>Ramesh Nayak</Text>
          </View>
        </View>

        <View style={styles.progressTrack}>
          <View style={[styles.progressFill, { width: '60%' }]} />
        </View>
      </KisanCard>

      {/* ETA & Arrival Recommendations */}
      <SectionHeader title="Smart Time Prediction" subtitle="Calculated from real-time weighbridge speed" />
      <View style={styles.etaGrid}>
        <KisanCard style={styles.etaCard}>
          <Ionicons name="hourglass-outline" size={24} color={colors.accent} />
          <Text style={styles.etaValue}>~{estimatedWaitMins} Mins</Text>
          <Text style={styles.etaLabel}>Estimated Waiting Time</Text>
        </KisanCard>

        <KisanCard style={styles.etaCard}>
          <Ionicons name="alarm-outline" size={24} color={colors.primary} />
          <Text style={styles.etaValue}>10:45 AM</Text>
          <Text style={styles.etaLabel}>Recommended Arrival</Text>
        </KisanCard>
      </View>

      {/* Queue Stages Breakdown */}
      <SectionHeader title="Queue Progression" subtitle="What happens when your token is called" />
      <KisanCard style={styles.timelineCard}>
        <View style={styles.stepRow}>
          <Ionicons name="checkmark-circle" size={22} color={colors.primary} />
          <View style={styles.stepContent}>
            <Text style={styles.stepDoneTitle}>1. Gate Check-in & Security</Text>
            <Text style={styles.stepSub}>Vehicle token verified</Text>
          </View>
        </View>

        <View style={styles.stepDividerActive} />

        <View style={styles.stepRow}>
          <View style={styles.activeStepCircle}><Text style={styles.activeStepNum}>2</Text></View>
          <View style={styles.stepContent}>
            <Text style={styles.stepActiveTitle}>2. Electronic Weighbridge</Text>
            <Text style={styles.stepSub}>Gross weight recorded on weighbridge</Text>
          </View>
        </View>

        <View style={styles.stepDivider} />

        <View style={styles.stepRow}>
          <View style={styles.inactiveStepCircle}><Text style={styles.inactiveStepNum}>3</Text></View>
          <View style={styles.stepContent}>
            <Text style={styles.stepInactiveTitle}>3. Quality & Moisture Lab</Text>
            <Text style={styles.stepSub}>Grade determination</Text>
          </View>
        </View>

        <View style={styles.stepDivider} />

        <View style={styles.stepRow}>
          <View style={styles.inactiveStepCircle}><Text style={styles.inactiveStepNum}>4</Text></View>
          <View style={styles.stepContent}>
            <Text style={styles.stepInactiveTitle}>4. Payout Confirmation & Receipt</Text>
            <Text style={styles.stepSub}>DBT credit initiated</Text>
          </View>
        </View>
      </KisanCard>

      {/* Action to view Procurement Journey */}
      <View style={styles.actionBox}>
        <KisanButton
          title="Open Procurement Journey Tracker"
          onPress={() => router.push(`/(farmer)/procurement/${bookingId}` as any)}
          variant="primary"
        />
        <View style={{ height: 10 }} />
        <KisanButton
          title="Back to Dashboard"
          onPress={() => router.replace('/(farmer)/(tabs)')}
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
  liveHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  liveDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#E65100',
  },
  liveText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: colors.textPrimary,
    letterSpacing: 0.5,
  },
  queueMainCard: {
    backgroundColor: '#FFFFFF',
    marginBottom: spacing.md,
  },
  tokenCompareRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  tokenBox: {
    alignItems: 'center',
    flex: 1,
  },
  yourTokenBox: {
    backgroundColor: '#E8F5E9',
    padding: spacing.sm,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  tokenBoxLabel: {
    fontSize: 10,
    fontWeight: 'bold',
    color: colors.textSecondary,
    marginBottom: 2,
  },
  currentTokenText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.textSecondary,
  },
  yourTokenText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.primary,
  },
  tokenBoxSub: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 2,
  },
  tokenArrowBox: {
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  tokensAheadCount: {
    fontSize: 11,
    fontWeight: 'bold',
    color: colors.primary,
    marginTop: 2,
  },
  progressTrack: {
    height: 8,
    backgroundColor: '#F0F0F0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.primary,
  },
  etaGrid: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  etaCard: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: spacing.md,
  },
  etaValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginVertical: 4,
  },
  etaLabel: {
    fontSize: 11,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  timelineCard: {
    marginBottom: spacing.lg,
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stepContent: {
    marginLeft: spacing.md,
  },
  stepDoneTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.primary,
  },
  stepActiveTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  stepInactiveTitle: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  stepSub: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 1,
  },
  activeStepCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeStepNum: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: 'bold',
  },
  inactiveStepCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#E0E0E0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  inactiveStepNum: {
    color: '#757575',
    fontSize: 11,
  },
  stepDividerActive: {
    width: 2,
    height: 24,
    backgroundColor: colors.primary,
    marginLeft: 10,
    marginVertical: 4,
  },
  stepDivider: {
    width: 2,
    height: 24,
    backgroundColor: '#E0E0E0',
    marginLeft: 10,
    marginVertical: 4,
  },
  actionBox: {
    marginBottom: spacing.xl,
  },
});