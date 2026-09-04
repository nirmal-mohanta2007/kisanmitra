import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../../src/theme/colors';
import { typography } from '../../../src/theme/typography';
import { spacing } from '../../../src/theme/spacing';
import { radius } from '../../../src/theme/radius';
import {
  ScreenContainer,
  KisanCard,
  SectionHeader,
  StatusBadge,
  FirebaseStatusBadge,
} from '../../../src/components/common';
import { MOCK_TRANSACTIONS, MOCK_CENTRES } from '../../../src/services/mock-data.service';
import { useAppContext } from '../../../src/store/app-context';

export default function FarmerDashboard() {
  const router = useRouter();
  const { state } = useAppContext();
  const currentFarmer = state.currentFarmer;
  const activeTx = MOCK_TRANSACTIONS[0]; // Active booking
  const activeMandi = MOCK_CENTRES[0];

  return (
    <ScreenContainer scrollable style={styles.container}>
      {/* Firebase Status Badge */}
      <FirebaseStatusBadge />

      {/* Greeting Banner */}
      <View style={styles.greetingBanner}>
        <View>
          <Text style={styles.greetingSub}>Welcome back,</Text>
          <Text style={styles.greetingName}>{currentFarmer ? currentFarmer.name : 'Ramesh Nayak'} 🌾</Text>
          <Text style={styles.farmerId}>
            Farmer ID: {currentFarmer ? currentFarmer.id : 'F-001'} • {currentFarmer?.village || 'Sehore'}, {currentFarmer?.district || currentFarmer?.state || 'MP'}
          </Text>
        </View>
        <TouchableOpacity
          style={styles.langBtn}
          onPress={() => router.push('/(auth)/language')}
        >
          <Ionicons name="language-outline" size={18} color={colors.primary} />
          <Text style={styles.langBtnText}>हिंदी / EN</Text>
        </TouchableOpacity>
      </View>

      {/* Current Active Token & Queue Card */}
      {activeTx && (
        <KisanCard style={styles.activeTokenCard}>
          <View style={styles.cardHeaderRow}>
            <View style={styles.tokenTag}>
              <Text style={styles.tokenTagLabel}>YOUR TOKEN</Text>
              <Text style={styles.tokenTagNumber}>#{activeTx.tokenNumber}</Text>
            </View>
            <StatusBadge status={activeTx.status} />
          </View>

          <View style={styles.tokenDetails}>
            <View style={styles.tokenRow}>
              <Text style={styles.detailLabel}>Crop:</Text>
              <Text style={styles.detailValue}>{activeTx.crop} ({activeTx.expectedQuantity} Qtl)</Text>
            </View>
            <View style={styles.tokenRow}>
              <Text style={styles.detailLabel}>Mandi:</Text>
              <Text style={styles.detailValue}>{activeTx.centreName}</Text>
            </View>
            <View style={styles.tokenRow}>
              <Text style={styles.detailLabel}>Slot:</Text>
              <Text style={styles.detailValue}>{activeTx.slotLabel}</Text>
            </View>
          </View>

          {/* Live ETA Box */}
          <View style={styles.etaBox}>
            <View style={styles.etaItem}>
              <Ionicons name="people-outline" size={20} color={colors.primary} />
              <Text style={styles.etaValue}>3 Ahead</Text>
              <Text style={styles.etaSub}>In Queue</Text>
            </View>
            <View style={styles.etaDivider} />
            <View style={styles.etaItem}>
              <Ionicons name="time-outline" size={20} color={colors.accent} />
              <Text style={styles.etaValue}>~25 Mins</Text>
              <Text style={styles.etaSub}>Estimated Wait</Text>
            </View>
            <View style={styles.etaDivider} />
            <View style={styles.etaItem}>
              <Ionicons name="navigate-circle-outline" size={20} color={colors.secondary} />
              <Text style={styles.etaValue}>10:15 AM</Text>
              <Text style={styles.etaSub}>Arrive By</Text>
            </View>
          </View>

          <TouchableOpacity
            style={styles.trackQueueBtn}
            onPress={() => router.push(`/(farmer)/queue/${activeTx.id}` as any)}
          >
            <Text style={styles.trackQueueText}>Track Live Queue</Text>
            <Ionicons name="arrow-forward" size={18} color="#FFFFFF" />
          </TouchableOpacity>
        </KisanCard>
      )}

      {/* Quick Actions Grid */}
      <SectionHeader title="Quick Actions" subtitle="Procurement journey tools" />
      <View style={styles.quickActionsGrid}>
        <TouchableOpacity
          style={styles.actionItem}
          onPress={() => router.push('/(farmer)/booking/crop')}
        >
          <View style={[styles.actionIconBox, { backgroundColor: '#E8F5E9' }]}>
            <Ionicons name="add-circle" size={26} color={colors.primary} />
          </View>
          <Text style={styles.actionLabel}>Book Visit</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionItem}
          onPress={() => router.push(`/(farmer)/queue/${activeTx.id}` as any)}
        >
          <View style={[styles.actionIconBox, { backgroundColor: '#FFF3E0' }]}>
            <Ionicons name="timer" size={26} color={colors.accent} />
          </View>
          <Text style={styles.actionLabel}>Track Queue</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionItem}
          onPress={() => router.push(`/(farmer)/procurement/${activeTx.id}` as any)}
        >
          <View style={[styles.actionIconBox, { backgroundColor: '#E3F2FD' }]}>
            <Ionicons name="git-branch" size={26} color={colors.secondary} />
          </View>
          <Text style={styles.actionLabel}>Procurement</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionItem}
          onPress={() => router.push(`/(farmer)/payment/${activeTx.id}` as any)}
        >
          <View style={[styles.actionIconBox, { backgroundColor: '#F3E5F5' }]}>
            <Ionicons name="cash" size={26} color="#7B1FA2" />
          </View>
          <Text style={styles.actionLabel}>Payment</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionItem}
          onPress={() => router.push('/(farmer)/mandi')}
        >
          <View style={[styles.actionIconBox, { backgroundColor: '#E0F2F1' }]}>
            <Ionicons name="business" size={26} color="#00796B" />
          </View>
          <Text style={styles.actionLabel}>Mandis</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionItem}
          onPress={() => router.push('/(farmer)/support')}
        >
          <View style={[styles.actionIconBox, { backgroundColor: '#FFEBEE' }]}>
            <Ionicons name="help-buoy" size={26} color={colors.error} />
          </View>
          <Text style={styles.actionLabel}>Support</Text>
        </TouchableOpacity>
      </View>

      {/* Selected Mandi Snapshot */}
      <SectionHeader
        title="Nearest Procurement Centre"
        actionText="View All"
        onAction={() => router.push('/(farmer)/mandi')}
      />
      <KisanCard style={styles.mandiCard}>
        <View style={styles.mandiHeader}>
          <Text style={styles.mandiTitle}>{activeMandi.name}</Text>
          <StatusBadge status="ACTIVE" variant="success" />
        </View>
        <Text style={styles.mandiAddress}>{activeMandi.address}</Text>
        <View style={styles.mandiMeta}>
          <Text style={styles.metaText}>⏱ Current Delay: {activeMandi.currentDelay} mins</Text>
          <Text style={styles.metaText}>📦 Daily Capacity: {activeMandi.capacity} Farmers</Text>
        </View>
      </KisanCard>

      {/* Procurement Journey Readiness Checklist */}
      <SectionHeader
        title="Visit Preparation Checklist"
        subtitle="Make sure you have these ready"
      />
      <KisanCard style={styles.checklistCard}>
        <View style={styles.checkItem}>
          <Ionicons name="checkbox" size={20} color={colors.primary} />
          <Text style={styles.checkText}>Aadhaar Linked Mobile Number</Text>
        </View>
        <View style={styles.checkItem}>
          <Ionicons name="checkbox" size={20} color={colors.primary} />
          <Text style={styles.checkText}>Bank Account Passbook / IFSC Details</Text>
        </View>
        <View style={styles.checkItem}>
          <Ionicons name="checkbox" size={20} color={colors.primary} />
          <Text style={styles.checkText}>Clean, graded crop bags (Moisture &lt; 12%)</Text>
        </View>
      </KisanCard>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: spacing.md,
  },
  greetingBanner: {
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
  greetingSub: {
    fontSize: typography.sizes.caption,
    color: colors.textSecondary,
  },
  greetingName: {
    fontSize: typography.sizes.header,
    fontWeight: typography.weights.bold as any,
    color: colors.textPrimary,
  },
  farmerId: {
    fontSize: typography.sizes.caption,
    color: colors.primary,
    fontWeight: '600',
    marginTop: 2,
  },
  langBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: radius.sm,
    backgroundColor: '#E8F5E9',
  },
  langBtnText: {
    fontSize: 12,
    color: colors.primary,
    fontWeight: 'bold',
    marginLeft: 4,
  },
  activeTokenCard: {
    backgroundColor: '#FFFFFF',
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
    marginBottom: spacing.md,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  tokenTag: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  tokenTagLabel: {
    fontSize: 11,
    fontWeight: 'bold',
    color: colors.textSecondary,
    marginRight: 6,
  },
  tokenTagNumber: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.primary,
  },
  tokenDetails: {
    backgroundColor: '#F9FBE7',
    padding: spacing.sm,
    borderRadius: radius.sm,
    marginBottom: spacing.sm,
  },
  tokenRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  detailLabel: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  detailValue: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  etaBox: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#F5F7FA',
    paddingVertical: spacing.sm,
    borderRadius: radius.sm,
    marginBottom: spacing.md,
  },
  etaItem: {
    alignItems: 'center',
  },
  etaDivider: {
    width: 1,
    height: 30,
    backgroundColor: colors.border,
  },
  etaValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginTop: 2,
  },
  etaSub: {
    fontSize: 11,
    color: colors.textSecondary,
  },
  trackQueueBtn: {
    backgroundColor: colors.primary,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 12,
    borderRadius: radius.sm,
  },
  trackQueueText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: 'bold',
    marginRight: 6,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  actionItem: {
    width: '31%',
    backgroundColor: '#FFFFFF',
    borderRadius: radius.md,
    padding: spacing.sm,
    alignItems: 'center',
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  actionIconBox: {
    width: 46,
    height: 46,
    borderRadius: 23,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
  },
  actionLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textPrimary,
    textAlign: 'center',
  },
  mandiCard: {
    marginBottom: spacing.md,
  },
  mandiHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  mandiTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  mandiAddress: {
    fontSize: 13,
    color: colors.textSecondary,
    marginBottom: 8,
  },
  mandiMeta: {
    backgroundColor: '#F5F5F5',
    padding: 8,
    borderRadius: 6,
  },
  metaText: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 2,
  },
  checklistCard: {
    marginBottom: spacing.xl,
  },
  checkItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  checkText: {
    fontSize: 13,
    color: colors.textPrimary,
    marginLeft: 8,
  },
});