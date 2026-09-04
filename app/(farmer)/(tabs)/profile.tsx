import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Alert } from 'react-native';
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
  KisanButton,
} from '../../../src/components/common';
import { MOCK_FARMERS } from '../../../src/services/mock-data.service';
import { useAppContext } from '../../../src/store/app-context';

export default function FarmerProfileScreen() {
  const router = useRouter();
  const { state } = useAppContext();
  const farmer = state.currentFarmer || MOCK_FARMERS[0];
  const avatarUrl = farmer.photoUrl || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80';

  const handleLogout = () => {
    router.replace('/(auth)/welcome');
  };

  return (
    <ScreenContainer scrollable style={styles.container}>
      {/* Profile Header with Profile Picture in Corner */}
      <View style={styles.profileHeader}>
        <View style={styles.headerInfo}>
          <Text style={styles.farmerIdBadge}>FARMER ID: {farmer.id}</Text>
          <Text style={styles.farmerName}>{farmer.name}</Text>
          <Text style={styles.phoneText}>📞 +91 {farmer.phone}</Text>
          <Text style={styles.locationText}>
            📍 {farmer.village ? `${farmer.village}, ` : ''}{farmer.district ? `${farmer.district}, ` : ''}{farmer.state}{farmer.pinCode ? ` (PIN: ${farmer.pinCode})` : ''}
          </Text>
          <View style={styles.kycTag}>
            <StatusBadge status="UIDAI AADHAAR VERIFIED" variant="success" />
          </View>
        </View>

        {/* Profile Picture in Corner */}
        <View style={styles.avatarCornerWrapper}>
          <Image source={{ uri: avatarUrl }} style={styles.avatarImage} />
          <TouchableOpacity
            style={styles.avatarEditBadge}
            onPress={() => router.push('/(auth)/register')}
          >
            <Ionicons name="pencil" size={12} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </View>

      {/* 1. Identity & Aadhaar Verification */}
      <SectionHeader
        title="1. Aadhaar & Contact Details"
        subtitle="Linked for DBT settlement & token pass"
      />
      <KisanCard style={styles.card}>
        <View style={styles.row}>
          <Text style={styles.label}>Aadhaar Card Number:</Text>
          <Text style={styles.value}>{farmer.aadhaar || 'XXXX-XXXX-9012'} (DigiLocker Linked)</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Registered Mobile:</Text>
          <Text style={styles.value}>+91 {farmer.phone} (OTP Active)</Text>
        </View>
        {farmer.fatherName ? (
          <View style={styles.row}>
            <Text style={styles.label}>Father / Husband Name:</Text>
            <Text style={styles.value}>{farmer.fatherName}</Text>
          </View>
        ) : null}
        {farmer.gender ? (
          <View style={styles.row}>
            <Text style={styles.label}>Gender:</Text>
            <Text style={styles.value}>{farmer.gender}</Text>
          </View>
        ) : null}
        <View style={styles.row}>
          <Text style={styles.label}>e-KYC Status:</Text>
          <StatusBadge status="ACTIVE & VERIFIED" variant="success" />
        </View>
      </KisanCard>

      {/* 2. Bank Account Details (DBT) */}
      <SectionHeader
        title="2. Bank Account Details (DBT Payout)"
        subtitle="Verified with Public Financial Management System (PFMS)"
      />
      <KisanCard style={styles.card}>
        <View style={styles.bankRow}>
          <Ionicons name="business" size={26} color={colors.primary} />
          <View style={styles.bankInfo}>
            <Text style={styles.bankName}>{farmer.bankName || farmer.bankDetails?.bankName || 'State Bank of India'}</Text>
            <Text style={styles.bankAccount}>A/C: {farmer.bankAccount || (farmer.bankDetails?.accountNumber ? `•••• ${farmer.bankDetails.accountNumber.slice(-4)}` : '•••• 5678')}</Text>
            <Text style={styles.ifscText}>IFSC: {farmer.ifsc || farmer.bankDetails?.ifscCode || 'SBIN0001234'}{farmer.branchName ? ` • ${farmer.branchName}` : ''}</Text>
          </View>
          <StatusBadge status="Aadhaar Seeded" variant="success" />
        </View>
      </KisanCard>

      {/* 3. Land Record (Bhu-Abhilekh) */}
      <SectionHeader
        title="3. Land Record & Cultivation Area"
        subtitle="Synchronized with State Revenue Department"
      />
      <KisanCard style={styles.card}>
        <View style={styles.row}>
          <Text style={styles.label}>Khasra / Survey No.:</Text>
          <Text style={styles.value}>{farmer.khasraNo || '142/1, 142/2'}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Total Cultivable Area:</Text>
          <Text style={styles.value}>
            {farmer.landArea ? `${farmer.landArea} Hectares (${(farmer.landArea * 2.471).toFixed(1)} Acres)` : '4.5 Hectares (11.1 Acres)'}
          </Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Primary Crops:</Text>
          <Text style={styles.value}>{farmer.primaryCrop || 'Wheat (गेहूं), Soybean, Paddy'}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Land Document:</Text>
          <Text style={[styles.value, { color: colors.primary }]}>
            📄 {farmer.landDocFileName || 'Khasra_Verified.pdf'}
          </Text>
        </View>
      </KisanCard>

      {/* Edit Registration Info Action */}
      <View style={styles.editActionBox}>
        <KisanButton
          title="Update / Edit Registration Details"
          onPress={() => router.push('/(auth)/register')}
          variant="secondary"
        />
      </View>

      {/* Preferences & Settings */}
      <SectionHeader title="App Preferences & Support" />
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
            <Text style={styles.settingText}>Kisan Helpline & Grievances</Text>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    backgroundColor: '#FFFFFF',
    padding: spacing.md,
    borderRadius: radius.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  headerInfo: {
    flex: 1,
    marginRight: spacing.sm,
  },
  farmerIdBadge: {
    fontSize: 10,
    fontWeight: 'bold',
    color: colors.primary,
    letterSpacing: 0.5,
  },
  farmerName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginTop: 2,
  },
  phoneText: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 2,
  },
  locationText: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  kycTag: {
    marginTop: 6,
  },
  avatarCornerWrapper: {
    position: 'relative',
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: colors.primary,
  },
  avatarImage: {
    width: '100%',
    height: '100%',
    borderRadius: 30,
  },
  avatarEditBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    backgroundColor: colors.primary,
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },
  card: {
    marginBottom: spacing.md,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  },
  label: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  value: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textPrimary,
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
  editActionBox: {
    marginBottom: spacing.md,
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
    marginTop: spacing.xs,
    marginBottom: spacing.xl,
  },
  logoutBtnText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.error,
    marginLeft: 6,
  },
});