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
  const { state, setLanguage } = useAppContext();
  const farmer = state.currentFarmer || MOCK_FARMERS[0];
  const lang = state.language || 'hi';

  const text = {
    farmerId: lang === 'or' ? `ଚାଷୀ ଆଇଡି: ${farmer.id}` : lang === 'hi' ? `किसान आईडी: ${farmer.id}` : `FARMER ID: ${farmer.id}`,
    sec1Title: lang === 'or' ? '୧. ଆଧାର ଓ ଯୋଗାଯୋଗ ବିବରଣୀ' : lang === 'hi' ? '1. आधार एवं संपर्क विवरण' : '1. Aadhaar & Contact Details',
    sec1Sub: lang === 'or' ? 'ଡିବିଟି ଏବଂ ଟୋକନ୍ ପାସ୍ ସହିତ ସଂଯୁକ୍ତ' : lang === 'hi' ? 'डीबीटी एवं टोकन पास हेतु लिंक' : 'Linked for DBT settlement & token pass',
    aadhaarNo: lang === 'or' ? 'ଆଧାର କାର୍ଡ ନମ୍ବର:' : lang === 'hi' ? 'आधार कार्ड नंबर:' : 'Aadhaar Card Number:',
    regMobile: lang === 'or' ? 'ପଞ୍ଜୀକୃତ ମୋବାଇଲ୍:' : lang === 'hi' ? 'पंजीकृत मोबाइल:' : 'Registered Mobile:',
    kycStatus: lang === 'or' ? 'ଇ-କେୱାଇସି ସ୍ଥିତି:' : lang === 'hi' ? 'ई-केवाईसी स्थिति:' : 'e-KYC Status:',
    sec2Title: lang === 'or' ? '୨. ବ୍ୟାଙ୍କ ଆକାଉଣ୍ଟ ବିବରଣୀ (DBT)' : lang === 'hi' ? '2. बैंक खाता विवरण (DBT)' : '2. Bank Account Details (DBT Payout)',
    sec2Sub: lang === 'or' ? 'PFMS ଦ୍ୱାରା ଯାଞ୍ଚ ହୋଇଛି' : lang === 'hi' ? 'PFMS द्वारा सत्यापित' : 'Verified with Public Financial Management System (PFMS)',
    sec3Title: lang === 'or' ? '୩. ଜମି ରେକର୍ଡ ଓ ଚାଷ ଜମି' : lang === 'hi' ? '3. भूमि रिकॉर्ड एवं कृषि क्षेत्र' : '3. Land Record & Cultivation Area',
    sec3Sub: lang === 'or' ? 'ରାଜସ୍ୱ ବିଭାଗ ସହିତ ସିଙ୍କ୍ ହୋଇଛି' : lang === 'hi' ? 'राजस्व विभाग से सिंक' : 'Synchronized with State Revenue Department',
    khasra: lang === 'or' ? 'ଖସରା / ସର୍ଭେ ନଂ:' : lang === 'hi' ? 'खसरा / सर्वे नंबर:' : 'Khasra / Survey No.:',
    cultivable: lang === 'or' ? 'ମୋଟ ଚାଷ ଜମି:' : lang === 'hi' ? 'कुल कृषि क्षेत्र:' : 'Total Cultivable Area:',
    primaryCrops: lang === 'or' ? 'ପ୍ରମୁଖ ଫସଲ:' : lang === 'hi' ? 'मुख्य फसलें:' : 'Primary Crops:',
    landDoc: lang === 'or' ? 'ଜମି ଦସ୍ତାବିଜ:' : lang === 'hi' ? 'भूमि दस्तावेज़:' : 'Land Document:',
    editReg: lang === 'or' ? 'ପଞ୍ଜୀକରଣ ବିବରଣୀ ସଂଶୋଧନ କରନ୍ତୁ' : lang === 'hi' ? 'पंजीकरण विवरण संशोधित करें' : 'Update / Edit Registration Details',
    appPref: lang === 'or' ? 'ଆପ୍ ସେଟିଙ୍ଗ୍ ଏବଂ ସହାୟତା' : lang === 'hi' ? 'ऐप प्राथमिकताएं एवं सहायता' : 'App Preferences & Support',
    changeLang: lang === 'or' ? 'ଭାଷା ବଦଳାନ୍ତୁ (Change Language)' : lang === 'hi' ? 'भाषा बदलें (Change Language)' : 'Change Language',
    currentLangDisplay: lang === 'or' ? 'ଓଡ଼ିଆ (Odia) ›' : lang === 'hi' ? 'हिंदी (Hindi) ›' : 'English ›',
    helpline: lang === 'or' ? 'କିଷାନ ହେଲ୍ପଲାଇନ୍ ଓ ସମସ୍ୟା ନିବାରଣ' : lang === 'hi' ? 'किसान हेल्पलाइन एवं शिकायतें' : 'Kisan Helpline & Grievances',
    logout: lang === 'or' ? 'ଲଗଆଉଟ୍ / ଭୂମିକା ପରିବର୍ତ୍ତନ କରନ୍ତୁ' : lang === 'hi' ? 'लॉगआउट / भूमिका बदलें' : 'Logout / Switch Role',
  };

  const handleLogout = () => {
    router.replace('/(auth)/welcome');
  };

  const toggleLanguage = () => {
    if (lang === 'hi') {
      setLanguage('or');
    } else if (lang === 'or') {
      setLanguage('en');
    } else {
      setLanguage('hi');
    }
  };

  return (
    <ScreenContainer scrollable style={styles.container}>
      {/* Profile Header with Profile Picture in Corner */}
      <View style={styles.profileHeader}>
        <View style={styles.headerInfo}>
          <Text style={styles.farmerIdBadge}>{text.farmerId}</Text>
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
          <Image
            source={
              farmer.photoUrl
                ? { uri: farmer.photoUrl }
                : require('../../../assets/farmer_avatar.png')
            }
            style={styles.avatarImage}
          />
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
        title={text.sec1Title}
        subtitle={text.sec1Sub}
      />
      <KisanCard style={styles.card}>
        <View style={styles.row}>
          <Text style={styles.label}>{text.aadhaarNo}</Text>
          <Text style={styles.value}>{farmer.aadhaar || '4751 3699 6443'} (UIDAI Verified)</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Aadhaar Address:</Text>
          <Text style={styles.value}>
            {farmer.village || 'Silipada'}, Patana, {farmer.district || 'Kendujhar'}, {farmer.state || 'Odisha'} - {farmer.pinCode || '758045'}
          </Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>{text.regMobile}</Text>
          <Text style={styles.value}>+91 {farmer.phone || '9777173473'} (OTP Active)</Text>
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
          <Text style={styles.label}>{text.kycStatus}</Text>
          <StatusBadge status="ACTIVE & VERIFIED" variant="success" />
        </View>
      </KisanCard>

      {/* 2. Bank Account Details (DBT) */}
      <SectionHeader
        title={text.sec2Title}
        subtitle={text.sec2Sub}
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
        title={text.sec3Title}
        subtitle={text.sec3Sub}
      />
      <KisanCard style={styles.card}>
        <View style={styles.row}>
          <Text style={styles.label}>{text.khasra}</Text>
          <Text style={styles.value}>{farmer.khasraNo || '142/1, 142/2'}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>{text.cultivable}</Text>
          <Text style={styles.value}>
            {farmer.landArea ? `${farmer.landArea} Hectares (${(farmer.landArea * 2.471).toFixed(1)} Acres)` : '4.5 Hectares (11.1 Acres)'}
          </Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>{text.primaryCrops}</Text>
          <Text style={styles.value}>{farmer.primaryCrop || 'Wheat (गेहूं / ଗହମ), Soybean, Paddy'}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>{text.landDoc}</Text>
          <Text style={[styles.value, { color: colors.primary }]}>
            📄 {farmer.landDocFileName || 'Khasra_Verified.pdf'}
          </Text>
        </View>
      </KisanCard>

      {/* Edit Registration Info Action */}
      <View style={styles.editActionBox}>
        <KisanButton
          title={text.editReg}
          onPress={() => router.push('/(auth)/register')}
          variant="secondary"
        />
      </View>

      {/* Preferences & Settings */}
      <SectionHeader title={text.appPref} />
      <KisanCard style={styles.card}>
        <TouchableOpacity
          style={styles.settingItem}
          onPress={toggleLanguage}
        >
          <View style={styles.settingLeft}>
            <Ionicons name="language-outline" size={20} color={colors.textPrimary} />
            <Text style={styles.settingText}>{text.changeLang}</Text>
          </View>
          <Text style={styles.settingValue}>{text.currentLangDisplay}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.settingItem}
          onPress={() => router.push('/(farmer)/support')}
        >
          <View style={styles.settingLeft}>
            <Ionicons name="help-circle-outline" size={20} color={colors.textPrimary} />
            <Text style={styles.settingText}>{text.helpline}</Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color={colors.textSecondary} />
        </TouchableOpacity>
      </KisanCard>

      {/* Logout / Switch Role */}
      <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
        <Ionicons name="log-out-outline" size={20} color={colors.error} />
        <Text style={styles.logoutBtnText}>{text.logout}</Text>
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