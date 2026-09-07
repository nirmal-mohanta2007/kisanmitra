import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ScrollView } from 'react-native';
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
} from '../../../src/components/common';
import { useAppContext } from '../../../src/store/app-context';
import { useOperatorStore } from '../../../src/store/operator.store';
import { SubScreenHeader } from '../../../src/components/operator';
import { getOperatorTexts } from '../../../src/i18n/operator-translations';

export default function OperatorFarmerVerificationScreen() {
  const router = useRouter();
  const { transactionId } = useLocalSearchParams<{ transactionId?: string }>();
  const { state } = useAppContext();
  const scale = state.textScale || 1.0;
  const t = getOperatorTexts(state.language);

  const { currentServing, addException } = useOperatorStore();

  // Section 11 Verification Checklist State
  const [checklist, setChecklist] = useState({
    identityVerified: true,
    bookingValid: true,
    tokenValid: true,
    cropMatches: true,
    vehicleVerified: true,
  });

  const toggleCheck = (key: keyof typeof checklist) => {
    setChecklist((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const allChecked = Object.values(checklist).every(Boolean);

  const handleVerifyAndContinue = () => {
    if (!allChecked) {
      Alert.alert(
        'Checklist Incomplete',
        'Please verify all 5 identity & booking checklist items before clearing the farmer at gate.'
      );
      return;
    }

    Alert.alert(
      'Farmer Identity Verified ✓',
      `Farmer ${currentServing.farmer} (${currentServing.token}) passed biometric and document validation.`,
      [
        {
          text: 'Proceed to Gate Entry Scanner ›',
          onPress: () =>
            router.push(
              `/(operator)/operations/check-in?txId=${transactionId || currentServing.transactionId || 'TX-2026-001'}` as any
            ),
        },
      ]
    );
  };

  const handleReject = () => {
    Alert.alert(
      'Reject Verification',
      'Are you sure you want to flag a verification issue for this booking? This will log an exception ticket.',
      [
        {
          text: 'Flag Exception',
          style: 'destructive',
          onPress: () => {
            addException({
              token: currentServing.token,
              farmer: currentServing.farmer,
              vehicle: currentServing.vehicle,
              crop: currentServing.crop,
              category: 'Farmer Verification Issue',
              issue: 'Discrepancy in farmer identity / vehicle particulars at gate',
              status: 'OPEN',
              notes: 'Flagged during physical identity document verification checklist.',
            });
            router.push('/(operator)/exceptions');
          },
        },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  return (
    <ScreenContainer scrollable style={styles.container}>
      <SubScreenHeader
        title={t.farmerDossier}
        subtitle={t.farmerDetails}
      />

      {/* 1. FARMER PROFILE & PHOTO CARD (Section 11) */}
      <KisanCard style={styles.profileCard}>
        <View style={styles.photoRow}>
          <View style={styles.avatarBox}>
            <Ionicons name="person" size={44} color={colors.secondary} />
          </View>

          <View style={{ flex: 1, marginLeft: 14 }}>
            <Text style={[styles.farmerName, { fontSize: 20 * scale }]}>
              {currentServing.farmer}
            </Text>
            <Text style={styles.farmerIdText}>Farmer ID: KM-F-10234</Text>
            <Text style={styles.bookingIdText}>
              Booking ID: {transactionId || 'BK-2026-00981'}
            </Text>
            {/* Masked Aadhaar (Section 11) */}
            <View style={styles.aadhaarBadge}>
              <Ionicons name="shield-checkmark" size={13} color="#2E7D32" />
              <Text style={styles.aadhaarText}>Aadhaar: XXXX XXXX 4821</Text>
            </View>
          </View>
        </View>

        <View style={styles.divider} />

        {/* Booking & Crop Details Grid */}
        <View style={styles.detailsGrid}>
          <View style={styles.gridItem}>
            <Text style={styles.gridLabel}>{t.currentToken}</Text>
            <Text style={[styles.gridValue, { color: colors.primary }]}>
              {currentServing.token}
            </Text>
          </View>

          <View style={styles.gridItem}>
            <Text style={styles.gridLabel}>{t.crop}</Text>
            <Text style={styles.gridValue}>🌾 {currentServing.crop}</Text>
          </View>

          <View style={styles.gridItem}>
            <Text style={styles.gridLabel}>{t.expectedWeight}</Text>
            <Text style={styles.gridValue}>{currentServing.quantity}</Text>
          </View>

          <View style={styles.gridItem}>
            <Text style={styles.gridLabel}>{t.vehicle}</Text>
            <Text style={styles.gridValue}>🚛 {currentServing.vehicle}</Text>
          </View>

          <View style={[styles.gridItem, { width: '100%' }]}>
            <Text style={styles.gridLabel}>Designated Procurement Centre</Text>
            <Text style={styles.gridValue}>Talcher Procurement Centre (Bhopal)</Text>
          </View>
        </View>
      </KisanCard>

      {/* 2. VERIFICATION CHECKLIST (Section 11) */}
      <SectionHeader
        title="Verification Checklist"
        subtitle="Mandatory 5-point physical verification before gate clearance"
      />
      <KisanCard style={styles.checklistCard}>
        {[
          { key: 'identityVerified', label: 'Farmer identity verified against Aadhaar / Photo ID' },
          { key: 'bookingValid', label: 'Booking valid for current slot & date' },
          { key: 'tokenValid', label: 'Token valid on live mandi procurement ledger' },
          { key: 'cropMatches', label: 'Crop matches booking declaration (Wheat - FAQ)' },
          { key: 'vehicleVerified', label: 'Vehicle number matches physical tractor/trolley' },
        ].map((item) => {
          const isChecked = checklist[item.key as keyof typeof checklist];
          return (
            <TouchableOpacity
              key={item.key}
              style={styles.checkRow}
              onPress={() => toggleCheck(item.key as keyof typeof checklist)}
              activeOpacity={0.7}
            >
              <View
                style={[
                  styles.checkbox,
                  isChecked && { backgroundColor: colors.primary, borderColor: colors.primary },
                ]}
              >
                {isChecked && <Ionicons name="checkmark" size={16} color="#FFFFFF" />}
              </View>
              <Text style={[styles.checkLabel, isChecked && styles.checkLabelChecked]}>
                {item.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </KisanCard>

      {/* 3. ACTION BUTTONS (Section 11) */}
      <View style={styles.actionRow}>
        <TouchableOpacity
          style={styles.rejectBtn}
          onPress={handleReject}
          activeOpacity={0.8}
        >
          <Ionicons name="close-circle-outline" size={18} color={colors.error} />
          <Text style={styles.rejectBtnText}>REJECT</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.verifyBtn, !allChecked && styles.btnDisabled]}
          onPress={handleVerifyAndContinue}
          activeOpacity={0.8}
        >
          <Ionicons name="checkmark-circle" size={18} color="#FFFFFF" />
          <Text style={styles.verifyBtnText}>VERIFY & CONTINUE</Text>
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
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  photoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarBox: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#E3F2FD',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#BBDEFB',
  },
  farmerName: {
    fontWeight: '800',
    color: colors.textPrimary,
  },
  farmerIdText: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  bookingIdText: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  aadhaarBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: radius.round,
    marginTop: 4,
    alignSelf: 'flex-start',
    gap: 4,
  },
  aadhaarText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#2E7D32',
  },
  divider: {
    height: 1,
    backgroundColor: colors.divider,
    marginVertical: spacing.md,
  },
  detailsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  gridItem: {
    width: '48%',
    backgroundColor: '#FAFAFA',
    padding: spacing.sm,
    borderRadius: radius.sm,
  },
  gridLabel: {
    fontSize: 10,
    color: colors.textSecondary,
    marginBottom: 2,
  },
  gridValue: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  checklistCard: {
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  checkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
    gap: 12,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#BDBDBD',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkLabel: {
    flex: 1,
    fontSize: 13,
    color: colors.textPrimary,
  },
  checkLabelChecked: {
    fontWeight: '600',
  },
  actionRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: spacing.xl,
  },
  rejectBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: radius.md,
    borderWidth: 1.5,
    borderColor: colors.error,
    gap: 6,
    backgroundColor: '#FFEBEE',
  },
  rejectBtnText: {
    color: colors.error,
    fontWeight: '800',
    fontSize: 14,
  },
  verifyBtn: {
    flex: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: radius.md,
    backgroundColor: colors.primary,
    gap: 6,
  },
  verifyBtnText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 14,
  },
  btnDisabled: {
    opacity: 0.5,
  },
});