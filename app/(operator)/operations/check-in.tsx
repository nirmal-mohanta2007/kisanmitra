import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
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

export default function OperatorCheckInScreen() {
  const router = useRouter();
  const { txId } = useLocalSearchParams<{ txId?: string }>();
  const { state } = useAppContext();
  const scale = state.textScale || 1.0;
  const t = getOperatorTexts(state.language);

  const { currentServing, registerGateEntry } = useOperatorStore();

  const [isScanning, setIsScanning] = useState(false);
  const [qrScanned, setQrScanned] = useState(true); // Pre-loaded with verified pass for hackathon demo
  const [entryRegistered, setEntryRegistered] = useState(false);
  const [registrationTime, setRegistrationTime] = useState('11:04 AM');
  const [assignedLane, setAssignedLane] = useState('Lane 2');

  const handleSimulateScan = () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      setQrScanned(true);
      Alert.alert(
        'QR Pass Verified ✓',
        `Digital gate pass verified for ${currentServing.farmer} (${currentServing.token}).`
      );
    }, 1000);
  };

  const handleRegisterGateEntry = async () => {
    const now = new Date();
    const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setRegistrationTime(timeString);
    setEntryRegistered(true);

    await registerGateEntry(currentServing.token, assignedLane, txId || currentServing.transactionId);

    Alert.alert(
      'Gate Entry Registered Successfully ✓',
      `Gate entry recorded at ${timeString}.\nAllocated Lane: ${assignedLane}\nState updated: BOOKED → CHECKED_IN.`,
      [
        {
          text: 'Proceed to Quality Check ›',
          onPress: () =>
            router.push(
              `/(operator)/operations/quality-check?txId=${txId || currentServing.transactionId || 'TX-2026-001'}` as any
            ),
        },
      ]
    );
  };

  return (
    <ScreenContainer scrollable style={styles.container}>
      <SubScreenHeader
        title={t.checkInTitle}
        subtitle={t.checkInSub}
      />

      {/* 1. QR SCANNER AREA (Section 12) */}
      <KisanCard style={styles.scannerBoxCard}>
        <Text style={styles.scannerHeaderTitle}>{t.scanFarmerQrPass}</Text>

        <View style={styles.viewfinder}>
          <View style={styles.cornerTL} />
          <View style={styles.cornerTR} />
          <View style={styles.cornerBL} />
          <View style={styles.cornerBR} />

          <Ionicons
            name={isScanning ? 'barcode' : 'qr-code'}
            size={48}
            color="#FFFFFF"
            style={{ opacity: 0.8 }}
          />

          <Text style={styles.viewfinderInstruction}>
            {isScanning ? t.scanningText : t.pointCameraInstruction}
          </Text>

          {isScanning && <View style={styles.laserLine} />}
        </View>

        <TouchableOpacity
          style={styles.scanActionBtn}
          onPress={handleSimulateScan}
          activeOpacity={0.8}
        >
          <Ionicons name="camera-reverse-outline" size={18} color="#FFFFFF" />
          <Text style={styles.scanActionBtnText}>{t.btnSimulateScan}</Text>
        </TouchableOpacity>
      </KisanCard>

      {/* 2. SCANNED DETAILS (Section 12) */}
      {qrScanned && (
        <KisanCard style={styles.scannedCard}>
          <View style={styles.scannedHeader}>
            <View style={styles.scannedBadge}>
              <Ionicons name="checkmark-done" size={16} color="#2E7D32" />
              <Text style={styles.scannedBadgeText}>QR VERIFIED ✓</Text>
            </View>
            <StatusBadge status={entryRegistered ? 'CHECKED_IN' : 'BOOKED'} />
          </View>

          <View style={styles.detailsList}>
            <View style={styles.detailRow}>
              <Text style={styles.label}>{t.farmer}:</Text>
              <Text style={styles.value}>{currentServing.farmer}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.label}>{t.currentToken}:</Text>
              <Text style={[styles.value, { color: colors.primary, fontWeight: '800' }]}>
                {currentServing.token}
              </Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.label}>Booking ID:</Text>
              <Text style={styles.value}>{txId || 'BK-2026-00981'}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.label}>{t.vehicle}:</Text>
              <Text style={styles.value}>{currentServing.vehicle}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.label}>{t.crop}:</Text>
              <Text style={styles.value}>🌾 {currentServing.crop}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.label}>{t.expectedWeight}:</Text>
              <Text style={styles.value}>{currentServing.quantity}</Text>
            </View>
          </View>

          {/* Lane Selection for Gate Clearance */}
          <View style={styles.laneSelectSection}>
            <Text style={styles.laneSelectLabel}>Assign Entry Inspection Lane:</Text>
            <View style={styles.laneButtonGroup}>
              {['Lane 1', 'Lane 2', 'Lane 3', 'Lane 4'].map((lane) => (
                <TouchableOpacity
                  key={lane}
                  style={[
                    styles.laneButton,
                    assignedLane === lane && styles.laneButtonActive,
                  ]}
                  onPress={() => setAssignedLane(lane)}
                >
                  <Text
                    style={[
                      styles.laneButtonText,
                      assignedLane === lane && styles.laneButtonTextActive,
                    ]}
                  >
                    {lane}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Registration Confirmation Feedback */}
          {entryRegistered ? (
            <View style={styles.successBanner}>
              <Ionicons name="checkmark-circle" size={24} color="#2E7D32" />
              <View style={{ flex: 1, marginLeft: 10 }}>
                <Text style={styles.successTitle}>Gate entry registered successfully.</Text>
                <Text style={styles.successSub}>
                  Time: {registrationTime} • Lane: {assignedLane}
                </Text>
              </View>
            </View>
          ) : (
            <TouchableOpacity
              style={styles.registerBtn}
              onPress={handleRegisterGateEntry}
              activeOpacity={0.8}
            >
              <Ionicons name="enter-outline" size={20} color="#FFFFFF" />
              <Text style={styles.registerBtnText}>{t.confirmCheckIn}</Text>
            </TouchableOpacity>
          )}
        </KisanCard>
      )}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: spacing.md,
  },
  scannerBoxCard: {
    padding: spacing.md,
    marginBottom: spacing.md,
    alignItems: 'center',
  },
  scannerHeaderTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  viewfinder: {
    width: '100%',
    height: 180,
    backgroundColor: '#1E293B',
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  cornerTL: {
    position: 'absolute',
    top: 12,
    left: 12,
    width: 20,
    height: 20,
    borderTopWidth: 3,
    borderLeftWidth: 3,
    borderColor: '#4CAF50',
  },
  cornerTR: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 20,
    height: 20,
    borderTopWidth: 3,
    borderRightWidth: 3,
    borderColor: '#4CAF50',
  },
  cornerBL: {
    position: 'absolute',
    bottom: 12,
    left: 12,
    width: 20,
    height: 20,
    borderBottomWidth: 3,
    borderLeftWidth: 3,
    borderColor: '#4CAF50',
  },
  cornerBR: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    width: 20,
    height: 20,
    borderBottomWidth: 3,
    borderRightWidth: 3,
    borderColor: '#4CAF50',
  },
  viewfinderInstruction: {
    color: '#94A3B8',
    fontSize: 12,
    marginTop: 8,
  },
  laserLine: {
    position: 'absolute',
    width: '80%',
    height: 2,
    backgroundColor: '#EF4444',
    shadowColor: '#EF4444',
    shadowOpacity: 0.8,
    shadowRadius: 4,
  },
  scanActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.secondary,
    paddingVertical: 10,
    paddingHorizontal: spacing.md,
    borderRadius: radius.md,
    marginTop: spacing.md,
    gap: 8,
    width: '100%',
  },
  scanActionBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 13,
  },
  scannedCard: {
    padding: spacing.md,
    marginBottom: spacing.xl,
  },
  scannedHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
    paddingBottom: spacing.xs,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  scannedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: radius.round,
    gap: 4,
  },
  scannedBadgeText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#2E7D32',
  },
  detailsList: {
    gap: 6,
    marginVertical: spacing.xs,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
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
  laneSelectSection: {
    marginVertical: spacing.md,
  },
  laneSelectLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  laneButtonGroup: {
    flexDirection: 'row',
    gap: 8,
  },
  laneButton: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  laneButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  laneButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  laneButtonTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  registerBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    paddingVertical: 14,
    borderRadius: radius.md,
    marginTop: spacing.sm,
    gap: 8,
  },
  registerBtnText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 14,
  },
  successBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F5E9',
    padding: spacing.md,
    borderRadius: radius.md,
    marginTop: spacing.sm,
    borderWidth: 1,
    borderColor: '#A5D6A7',
  },
  successTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#2E7D32',
  },
  successSub: {
    fontSize: 12,
    color: '#388E3C',
    marginTop: 2,
  },
});