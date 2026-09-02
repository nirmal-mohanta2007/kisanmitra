import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
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
import { MOCK_FARMERS } from '../../../src/services/mock-data.service';

export default function FarmerProfileScreen() {
  const router = useRouter();
  const farmer = MOCK_FARMERS[0];

  const handleLogout = () => {
    router.replace('/(auth)/welcome');
  };

  return (
    <ScreenContainer scrollable style={styles.container}>
      {/* Profile Header */}
      <View style={styles.profileHeader}>
        <View style={styles.avatarBox}>
          <Text style={styles.avatarText}>🌾</Text>
        </View>
        <Text style={styles.farmerName}>{farmer.name}</Text>
        <Text style={styles.phoneText}>+91 {farmer.phone}</Text>
        <Text style={styles.locationText}>
          {farmer.village}, {farmer.district}, {farmer.state}
        </Text>
        <View style={styles.kycTag}>
          <StatusBadge status="KYC VERIFIED" variant="success" />
        </View>
      </View>

      {/* Bank Details for DBT (Direct Benefit Transfer) */}
      <SectionHeader
        title="Direct Benefit Transfer (DBT) Bank"
        subtitle="Where your MSP procurement payments are credited"
      />
      <KisanCard style={styles.card}>
        <View style={styles.bankRow}>
          <Ionicons name="business" size={24} color={colors.primary} />
          <View style={styles.bankInfo}>
            <Text style={styles.bankName}>State Bank of India</Text>
            <Text style={styles.bankAccount}>A/C: •••• •••• 5678</Text>
            <Text style={styles.ifscText}>IFSC: SBIN0001234 • Sehore Branch</Text>
          </View>
          <StatusBadge status="ACTIVE" variant="success" />
        </View>
      </KisanCard>

      {/* Land & Crop Registrations */}
      <SectionHeader title="Land & Farmer Registry" />
      <KisanCard style={styles.card}>
        <View style={styles.registryRow}>
          <Text style={styles.regLabel}>Kisan ID:</Text>
          <Text style={styles.regValue}>{farmer.id}</Text>
        </View>
        <View style={styles.registryRow}>
          <Text style={styles.regLabel}>Registered Land:</Text>
          <Text style={styles.regValue}>4.5 Hectares</Text>
        </View>
        <View style={styles.registryRow}>
          <Text style={styles.regLabel}>Primary Crop:</Text>
          <Text style={styles.regValue}>Wheat, Soybean</Text>
        </View>
      </KisanCard>

      {/* Preferences & Settings */}
      <SectionHeader title="App Preferences" />
      <KisanCard style={styles.card}>
        <TouchableOpacity
          style={styles.settingItem}
          onPress={() => router.push('/(auth)/language')}
        >
          <View style={styles.settingLeft}>
            <Ionicons name="language-outline" size={20} color={colors.textPrimary} />
            <Text style={styles.settingText}>Change Language</Text>
          </View>
          <Text style={styles.settingValue}>Hindi (हिंदी) ›</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.settingItem}
          onPress={() => router.push('/(farmer)/support')}
        >
          <View style={styles.settingLeft}>
            <Ionicons name="help-circle-outline" size={20} color={colors.textPrimary} />
            <Text style={styles.settingText}>Help & Support</Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color={colors.textSecondary} />
        </TouchableOpacity>
      </KisanCard>

      {/* Logout / Switch Role */}
      <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
        <Ionicons name="log-out-outline" size={20} color={colors.error} />
        <Text style={styles.logoutBtnText}>Logout / Switch Role</Text>
      </TouchableOpacity>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: spacing.md,
  },
  profileHeader: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: spacing.lg,
    borderRadius: radius.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  avatarBox: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#E8F5E9',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  avatarText: {
    fontSize: 32,
  },
  farmerName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  phoneText: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 2,
  },
  locationText: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 2,
  },
  kycTag: {
    marginTop: spacing.sm,
  },
  card: {
    marginBottom: spacing.md,
  },
  bankRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  bankInfo: {
    flex: 1,
    marginLeft: spacing.md,
  },
  bankName: {
    fontSize: 15,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  bankAccount: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 2,
  },
  ifscText: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 2,
  },
  registryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  regLabel: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  regValue: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingText: {
    fontSize: 14,
    color: colors.textPrimary,
    marginLeft: spacing.sm,
  },
  settingValue: {
    fontSize: 13,
    color: colors.primary,
    fontWeight: '500',
  },
  logoutBtn: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.md,
    backgroundColor: '#FFEBEE',
    borderRadius: radius.md,
    marginTop: spacing.sm,
    marginBottom: spacing.xl,
  },
  logoutBtnText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.error,
    marginLeft: 6,
  },
});