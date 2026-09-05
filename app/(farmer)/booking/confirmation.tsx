import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Share } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../../src/theme/colors';
import { spacing } from '../../../src/theme/spacing';
import { radius } from '../../../src/theme/radius';
import {
  ScreenContainer,
  KisanCard,
  StatusBadge,
  KisanButton,
} from '../../../src/components/common';

export default function BookingConfirmationScreen() {
  const router = useRouter();
  const tokenNumber = 42;
  const bookingId = 'KM-2026-00042';

  const handleShare = () => {
    Share.share({
      message: `Kisan Mitra Booking Confirmed! Token #${tokenNumber}, Booking ID: ${bookingId}, Centre: Bhopal Krishi Upaj Mandi, Date: Tomorrow (08:00 AM - 11:00 AM).`,
    });
  };

  return (
    <ScreenContainer scrollable style={styles.container}>
      {/* Success Header */}
      <View style={styles.successHeader}>
        <View style={styles.checkCircle}>
          <Ionicons name="checkmark" size={36} color="#FFFFFF" />
        </View>
        <Text style={styles.successTitle}>Booking Confirmed! 🎉</Text>
        <Text style={styles.successSub}>Your procurement slot has been scheduled</Text>
      </View>

      {/* Digital Token Pass */}
      <KisanCard style={styles.tokenPassCard}>
        <View style={styles.tokenPassHeader}>
          <Text style={styles.tokenPassBrand}>🌾 KISAN MITRA PASS</Text>
          <StatusBadge status="CONFIRMED" variant="success" />
        </View>

        <View style={styles.tokenNumberContainer}>
          <Text style={styles.tokenNumberLabel}>YOUR APPOINTMENT TOKEN</Text>
          <Text style={styles.tokenNumberText}>#{tokenNumber}</Text>
          <Text style={styles.bookingIdText}>Booking ID: {bookingId}</Text>
        </View>

        <View style={styles.dashedDivider} />

        <View style={styles.passDetails}>
          <View style={styles.passRow}>
            <Text style={styles.passLabel}>Farmer Name:</Text>
            <Text style={styles.passValue}>Ramesh Nayak</Text>
          </View>
          <View style={styles.passRow}>
            <Text style={styles.passLabel}>Crop & Qty:</Text>
            <Text style={styles.passValue}>Wheat (25 Quintals)</Text>
          </View>
          <View style={styles.passRow}>
            <Text style={styles.passLabel}>Procurement Centre:</Text>
            <Text style={styles.passValue}>Krishi Upaj Mandi, Karond Bypass Road, Bhopal</Text>
          </View>
          <View style={styles.passRow}>
            <Text style={styles.passLabel}>Arrival Date & Slot:</Text>
            <Text style={styles.passValue}>Tomorrow • Morning (08:00 - 11:00 AM)</Text>
          </View>
          <View style={styles.passRow}>
            <Text style={styles.passLabel}>Estimated Payout:</Text>
            <Text style={styles.passValueHighlight}>₹56,875 (Govt MSP)</Text>
          </View>
        </View>
      </KisanCard>

      {/* Share / SMS confirmation */}
      <TouchableOpacity style={styles.shareBtn} onPress={handleShare}>
        <Ionicons name="share-social-outline" size={18} color={colors.primary} />
        <Text style={styles.shareBtnText}>Share / Save Pass</Text>
      </TouchableOpacity>

      {/* Readiness Alert */}
      <KisanCard style={styles.alertCard}>
        <View style={styles.alertHeader}>
          <Ionicons name="alert-circle" size={20} color={colors.primary} />
          <Text style={styles.alertTitle}>Next Step: Check Readiness</Text>
        </View>
        <Text style={styles.alertText}>
          Before leaving for the Mandi, verify moisture content and keep your Aadhaar + Bank Passbook ready.
        </Text>
        <TouchableOpacity
          style={styles.checklistBtn}
          onPress={() => router.push('/(farmer)/booking/checklist')}
        >
          <Text style={styles.checklistBtnText}>Open Readiness Checklist ›</Text>
        </TouchableOpacity>
      </KisanCard>

      {/* Actions */}
      <View style={styles.actionButtonsBox}>
        <KisanButton
          title="Track Live Mandi Queue"
          onPress={() => router.push(`/(farmer)/queue/${bookingId}` as any)}
          variant="primary"
        />
        <View style={{ height: 10 }} />
        <KisanButton
          title="Go to Home Dashboard"
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
  successHeader: {
    alignItems: 'center',
    marginVertical: spacing.md,
  },
  checkCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.sm,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  successTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  successSub: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 2,
  },
  tokenPassCard: {
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: colors.primary,
    borderRadius: radius.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  tokenPassHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  tokenPassBrand: {
    fontSize: 12,
    fontWeight: 'bold',
    color: colors.primary,
    letterSpacing: 1,
  },
  tokenNumberContainer: {
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  tokenNumberLabel: {
    fontSize: 11,
    fontWeight: 'bold',
    color: colors.textSecondary,
    letterSpacing: 0.5,
  },
  tokenNumberText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: colors.primary,
    marginVertical: 2,
  },
  bookingIdText: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  dashedDivider: {
    height: 1,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderStyle: 'dashed',
    marginVertical: spacing.md,
  },
  passDetails: {
    gap: 6,
  },
  passRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  passLabel: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  passValue: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  passValueHighlight: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.primary,
  },
  shareBtn: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.sm,
    backgroundColor: '#E8F5E9',
    borderRadius: radius.md,
    marginBottom: spacing.md,
  },
  shareBtnText: {
    fontSize: 13,
    fontWeight: 'bold',
    color: colors.primary,
    marginLeft: 6,
  },
  alertCard: {
    backgroundColor: '#FFF8E1',
    borderLeftWidth: 4,
    borderLeftColor: colors.accent,
    marginBottom: spacing.lg,
  },
  alertHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  alertTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#E65100',
    marginLeft: 6,
  },
  alertText: {
    fontSize: 12,
    color: colors.textPrimary,
    lineHeight: 16,
    marginBottom: 8,
  },
  checklistBtn: {
    alignSelf: 'flex-start',
  },
  checklistBtnText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: colors.primary,
  },
  actionButtonsBox: {
    marginBottom: spacing.xl,
  },
});