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
import { MOCK_TRANSACTIONS } from '../../src/services/mock-data.service';

export default function OperatorDashboard() {
  const router = useRouter();
  const currentFarmer = MOCK_TRANSACTIONS[0];

  return (
    <ScreenContainer scrollable style={styles.container}>
      <FirebaseStatusBadge />

      {/* Operator Centre Header */}
      <View style={styles.centreBanner}>
        <View>
          <Text style={styles.centreLabel}>OPERATING STATION</Text>
          <Text style={styles.centreName}>Bhopal Krishi Upaj Mandi</Text>
          <Text style={styles.operatorName}>Officer: Suresh Verma (OP-104)</Text>
        </View>
        <TouchableOpacity
          style={styles.switchRoleBtn}
          onPress={() => router.replace('/(auth)/welcome')}
        >
          <Ionicons name="log-out-outline" size={16} color={colors.secondary} />
          <Text style={styles.switchRoleText}>Logout</Text>
        </TouchableOpacity>
      </View>

      {/* Currently Serving Farmer Card */}
      <SectionHeader title="Now at Station" subtitle="Active farmer at weighbridge / inspection" />
      {currentFarmer && (
        <KisanCard style={styles.activeFarmerCard}>
          <View style={styles.activeHeader}>
            <View style={styles.tokenPill}>
              <Text style={styles.tokenPillText}>TOKEN #{currentFarmer.tokenNumber}</Text>
            </View>
            <StatusBadge status={currentFarmer.status} />
          </View>

          <Text style={styles.farmerName}>{currentFarmer.farmerName}</Text>
          <Text style={styles.farmerPhone}>📞 {currentFarmer.farmerPhone} • ID: {currentFarmer.farmerId}</Text>
          <Text style={styles.cropDetails}>
            🌾 {currentFarmer.crop} • Expected: {currentFarmer.expectedQuantity} Qtl
          </Text>

          <View style={styles.actionButtonsGrid}>
            <TouchableOpacity
              style={[styles.stepBtn, { backgroundColor: '#E3F2FD' }]}
              onPress={() => router.push('/(operator)/operations/check-in')}
            >
              <Ionicons name="log-in" size={18} color={colors.secondary} />
              <Text style={[styles.stepBtnText, { color: colors.secondary }]}>Check-in</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.stepBtn, { backgroundColor: '#E8F5E9' }]}
              onPress={() => router.push('/(operator)/operations/weighing')}
            >
              <Ionicons name="scale" size={18} color={colors.primary} />
              <Text style={[styles.stepBtnText, { color: colors.primary }]}>Weighing</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.stepBtn, { backgroundColor: '#FFF3E0' }]}
              onPress={() => router.push('/(operator)/operations/quality-check')}
            >
              <Ionicons name="flask" size={18} color={colors.accent} />
              <Text style={[styles.stepBtnText, { color: colors.accent }]}>Quality</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.stepBtn, { backgroundColor: '#F3E5F5' }]}
              onPress={() => router.push('/(operator)/operations/procurement')}
            >
              <Ionicons name="checkmark-done-circle" size={18} color="#7B1FA2" />
              <Text style={[styles.stepBtnText, { color: '#7B1FA2' }]}>Procure</Text>
            </TouchableOpacity>
          </View>
        </KisanCard>
      )}

      {/* Operations Quick Counters */}
      <SectionHeader title="Today's Procurement Operations" />
      <View style={styles.counterGrid}>
        <TouchableOpacity
          style={styles.counterCard}
          onPress={() => router.push('/(operator)/queue')}
        >
          <Text style={styles.counterNumber}>14</Text>
          <Text style={styles.counterLabel}>In Queue</Text>
          <Text style={styles.counterAction}>Manage Queue ›</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.counterCard}
          onPress={() => router.push('/(operator)/exceptions')}
        >
          <Text style={[styles.counterNumber, { color: colors.warning }]}>2</Text>
          <Text style={styles.counterLabel}>Exceptions</Text>
          <Text style={styles.counterAction}>Resolve ›</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.counterCard}
          onPress={() => router.push('/(operator)/payments')}
        >
          <Text style={[styles.counterNumber, { color: colors.primary }]}>38</Text>
          <Text style={styles.counterLabel}>Completed</Text>
          <Text style={styles.counterAction}>Payments ›</Text>
        </TouchableOpacity>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: spacing.md,
  },
  centreBanner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: spacing.md,
    borderRadius: radius.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  centreLabel: {
    fontSize: 10,
    fontWeight: 'bold',
    color: colors.secondary,
    letterSpacing: 0.5,
  },
  centreName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  operatorName: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  switchRoleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: radius.sm,
    backgroundColor: '#E3F2FD',
  },
  switchRoleText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: colors.secondary,
    marginLeft: 4,
  },
  activeFarmerCard: {
    backgroundColor: '#FFFFFF',
    borderLeftWidth: 4,
    borderLeftColor: colors.secondary,
    marginBottom: spacing.md,
  },
  activeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  tokenPill: {
    backgroundColor: '#E3F2FD',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  tokenPillText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: colors.secondary,
  },
  farmerName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  farmerPhone: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 2,
  },
  cropDetails: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
    marginTop: 4,
    marginBottom: spacing.md,
  },
  actionButtonsGrid: {
    flexDirection: 'row',
    gap: 6,
  },
  stepBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepBtnText: {
    fontSize: 11,
    fontWeight: 'bold',
    marginTop: 4,
  },
  counterGrid: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.xl,
  },
  counterCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: spacing.md,
    borderRadius: radius.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  counterNumber: {
    fontSize: 26,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  counterLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginVertical: 2,
  },
  counterAction: {
    fontSize: 11,
    fontWeight: 'bold',
    color: colors.secondary,
    marginTop: 4,
  },
});