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
import { MOCK_TRANSACTIONS } from '../../../src/services/mock-data.service';

export default function OperatorFarmerDetailScreen() {
  const router = useRouter();
  const { transactionId } = useLocalSearchParams();
  const tx = MOCK_TRANSACTIONS.find((t) => t.id === transactionId) || MOCK_TRANSACTIONS[0];

  return (
    <ScreenContainer scrollable style={styles.container}>
      {/* Farmer Profile Card */}
      <KisanCard style={styles.profileCard}>
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.farmerName}>{tx.farmerName}</Text>
            <Text style={styles.farmerMeta}>Farmer ID: {tx.farmerId} • Mobile: +91 {tx.farmerPhone}</Text>
          </View>
          <StatusBadge status={tx.status} />
        </View>

        <View style={styles.tokenTagBox}>
          <Text style={styles.tokenTag}>Assigned Token: #{tx.tokenNumber}</Text>
          <Text style={styles.bookingId}>Ref: {tx.id}</Text>
        </View>
      </KisanCard>

      {/* Booking Details */}
      <SectionHeader title="Procurement Booking Information" />
      <KisanCard style={styles.card}>
        <View style={styles.row}>
          <Text style={styles.label}>Commodity / Crop:</Text>
          <Text style={styles.value}>{tx.crop}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Expected Quantity:</Text>
          <Text style={styles.value}>{tx.expectedQuantity} Quintals</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Booking Date & Slot:</Text>
          <Text style={styles.value}>{tx.bookingDate} • {tx.slotLabel}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Govt Minimum Support Price:</Text>
          <Text style={styles.valueHighlight}>₹2,275 / Quintal</Text>
        </View>
      </KisanCard>

      {/* Operator Workflow Stepper Actions */}
      <SectionHeader title="Execute Operation Step" subtitle="Advance the farmer through the procurement station" />
      <View style={styles.actionsList}>
        <TouchableOpacity
          style={styles.actionBtn}
          onPress={() => router.push('/(operator)/operations/check-in')}
        >
          <View style={styles.actionIconBox}><Ionicons name="log-in" size={20} color="#FFFFFF" /></View>
          <View style={{ flex: 1, marginLeft: 12 }}>
            <Text style={styles.actionBtnTitle}>1. Gate Check-in & Verification</Text>
            <Text style={styles.actionBtnSub}>Verify vehicle and identity</Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color={colors.textSecondary} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionBtn}
          onPress={() => router.push('/(operator)/operations/weighing')}
        >
          <View style={[styles.actionIconBox, { backgroundColor: colors.primary }]}>
            <Ionicons name="scale" size={20} color="#FFFFFF" />
          </View>
          <View style={{ flex: 1, marginLeft: 12 }}>
            <Text style={styles.actionBtnTitle}>2. Electronic Weighment</Text>
            <Text style={styles.actionBtnSub}>Record gross & tare weights</Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color={colors.textSecondary} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionBtn}
          onPress={() => router.push('/(operator)/operations/quality-check')}
        >
          <View style={[styles.actionIconBox, { backgroundColor: colors.accent }]}>
            <Ionicons name="flask" size={20} color="#FFFFFF" />
          </View>
          <View style={{ flex: 1, marginLeft: 12 }}>
            <Text style={styles.actionBtnTitle}>3. Quality Inspection Lab</Text>
            <Text style={styles.actionBtnSub}>Analyze moisture % & assign grade</Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color={colors.textSecondary} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionBtn}
          onPress={() => router.push('/(operator)/operations/procurement')}
        >
          <View style={[styles.actionIconBox, { backgroundColor: '#7B1FA2' }]}>
            <Ionicons name="checkmark-done" size={20} color="#FFFFFF" />
          </View>
          <View style={{ flex: 1, marginLeft: 12 }}>
            <Text style={styles.actionBtnTitle}>4. Final Settlement & Receipt</Text>
            <Text style={styles.actionBtnSub}>Confirm payout & issue slip</Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color={colors.textSecondary} />
        </TouchableOpacity>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: spacing.md,
  },
  profileCard: {
    marginBottom: spacing.md,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.sm,
  },
  farmerName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  farmerMeta: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  tokenTagBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#E3F2FD',
    padding: spacing.sm,
    borderRadius: radius.sm,
  },
  tokenTag: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.secondary,
  },
  bookingId: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  card: {
    marginBottom: spacing.md,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  },
  label: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  value: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  valueHighlight: {
    fontSize: 13,
    fontWeight: 'bold',
    color: colors.primary,
  },
  actionsList: {
    gap: spacing.sm,
    marginBottom: spacing.xl,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: spacing.md,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  actionIconBox: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: colors.secondary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionBtnTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  actionBtnSub: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
});