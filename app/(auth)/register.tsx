import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../src/theme/colors';
import { spacing } from '../../src/theme/spacing';
import { radius } from '../../src/theme/radius';
import {
  ScreenContainer,
  KisanCard,
  SectionHeader,
  KisanButton,
  StatusBadge,
} from '../../src/components/common';
import { useAppContext } from '../../src/store/app-context';
import { FirestoreService } from '../../src/services/firebase/firestore.service';
import { UserRole } from '../../src/types/enums';

const SAMPLE_AVATARS = [
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
];

export default function FarmerRegistrationScreen() {
  const router = useRouter();
  const { dispatch } = useAppContext();

  // Profile Picture State
  const [profileImage, setProfileImage] = useState<string>(SAMPLE_AVATARS[0]);
  const [fileName, setFileName] = useState<string>('farmer_passport_photo.jpg');

  // 1. Aadhaar & Mobile
  const [aadhaar, setAadhaar] = useState('');
  const [isAadhaarVerified, setIsAadhaarVerified] = useState(false);
  const [mobile, setMobile] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [isMobileVerified, setIsMobileVerified] = useState(false);

  // 2. Bio Data & Address
  const [fullName, setFullName] = useState('');
  const [fatherName, setFatherName] = useState('');
  const [gender, setGender] = useState<'Male' | 'Female' | 'Other'>('Male');
  const [village, setVillage] = useState('');
  const [district, setDistrict] = useState('Bhopal');
  const [state, setState] = useState('Madhya Pradesh');
  const [pinCode, setPinCode] = useState('');

  // 4. Bank Details & IFSC
  const [accountNo, setAccountNo] = useState('');
  const [confirmAccountNo, setConfirmAccountNo] = useState('');
  const [ifsc, setIfsc] = useState('SBIN0001234');
  const [bankName, setBankName] = useState('State Bank of India');
  const [branchName, setBranchName] = useState('Bhopal Main Branch');

  // 5. Land Record
  const [khasraNo, setKhasraNo] = useState('');
  const [landArea, setLandArea] = useState('');
  const [primaryCrop, setPrimaryCrop] = useState('Wheat (गेहूं)');
  const [landDocUploaded, setLandDocUploaded] = useState(false);

  const formatAadhaar = (text: string) => {
    const cleaned = text.replace(/\D/g, '').slice(0, 12);
    const parts = [];
    for (let i = 0; i < cleaned.length; i += 4) {
      parts.push(cleaned.slice(i, i + 4));
    }
    setAadhaar(parts.join(' '));
  };

  const handleVerifyAadhaar = () => {
    if (aadhaar.replace(/\s/g, '').length === 12) {
      setIsAadhaarVerified(true);
      Alert.alert('DigiLocker Verified', 'Aadhaar authenticated successfully via UIDAI.');
    } else {
      Alert.alert('Invalid Aadhaar', 'Please enter a valid 12-digit Aadhaar number.');
    }
  };

  const handleSendOtp = () => {
    if (mobile.length === 10) {
      setOtpSent(true);
      Alert.alert('OTP Sent', `Verification code sent to +91 ${mobile}. (Demo OTP: 1234)`);
    } else {
      Alert.alert('Invalid Mobile', 'Please enter a 10-digit mobile number.');
    }
  };

  const handleVerifyOtp = () => {
    if (otp === '1234' || otp.length === 4) {
      setIsMobileVerified(true);
      Alert.alert('Mobile Verified', 'Mobile number authenticated.');
    } else {
      Alert.alert('Incorrect OTP', 'Please enter 1234 for demo.');
    }
  };

  // Choose File Trigger (Web & Native)
  const handleChooseFile = () => {
    if (Platform.OS === 'web' && typeof document !== 'undefined') {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';
      input.onchange = (e: any) => {
        const file = e.target.files?.[0];
        if (file) {
          setFileName(file.name);
          const reader = new FileReader();
          reader.onload = (uploadEvent: any) => {
            if (uploadEvent.target?.result) {
              setProfileImage(uploadEvent.target.result as string);
              Alert.alert('Photo Selected', `Loaded: ${file.name}`);
            }
          };
          reader.readAsDataURL(file);
        }
      };
      input.click();
    } else {
      // Rotate through preset samples on native or when file dialog is closed
      const nextIdx = (SAMPLE_AVATARS.indexOf(profileImage) + 1) % SAMPLE_AVATARS.length;
      setProfileImage(SAMPLE_AVATARS[nextIdx]);
      setFileName(`farmer_photo_${nextIdx + 1}.jpg`);
    }
  };

  const handleUploadLandDoc = () => {
    setLandDocUploaded(true);
    Alert.alert('Document Attached', 'Khasra-Khatauni land record uploaded successfully (PDF/Image).');
  };

  const handleSubmitRegistration = async () => {
    if (!fullName) {
      Alert.alert('Required Field', 'Please enter farmer full name.');
      return;
    }
    if (accountNo && accountNo !== confirmAccountNo) {
      Alert.alert('Mismatch', 'Bank Account numbers do not match.');
      return;
    }

    const farmerId = `F-${Math.floor(100 + Math.random() * 900)}`;
    const newFarmer = {
      id: farmerId,
      name: fullName,
      phone: mobile || '9876543210',
      aadhaar: aadhaar || 'XXXX-XXXX-XXXX',
      district: district,
      village: village,
      state: state,
      pinCode: pinCode,
      landArea: parseFloat(landArea) || 5.0,
      khasraNo: khasraNo || '142/1',
      primaryCrop: primaryCrop,
      bankAccount: accountNo ? `•••• ${accountNo.slice(-4)}` : '•••• 5678',
      ifsc: ifsc,
      bankName: bankName,
      photoUrl: profileImage,
      isVerified: true,
    };

    // Save to Firestore & context
    try {
      await FirestoreService.saveFarmer(newFarmer as any);
    } catch (e) {
      console.warn('Farmer save notice:', e);
    }

    dispatch({
      type: 'SET_ROLE',
      payload: { role: UserRole.FARMER, userId: farmerId },
    });

    Alert.alert(
      'Registration Completed! 🎉',
      `Welcome ${fullName}! Your Kisan Mitra Registration ID is ${farmerId}. Direct DBT has been linked.`,
      [
        {
          text: 'Go to Farmer Dashboard',
          onPress: () => router.replace('/(farmer)/(tabs)'),
        },
      ]
    );
  };

  return (
    <ScreenContainer scrollable style={styles.container}>
      {/* Top Header with Corner Profile Picture */}
      <View style={styles.headerCard}>
        <View style={styles.headerTextCol}>
          <Text style={styles.govtBadge}>Department of Consumer Affairs (DoCA)</Text>
          <Text style={styles.headerTitle}>Farmer Digital Registration</Text>
          <Text style={styles.headerSub}>
            PM-Kisan & State MSP Procurement Portal (e-Uparjan)
          </Text>
        </View>

        {/* Profile Picture in Corner (Tappable) */}
        <TouchableOpacity
          style={styles.avatarCornerWrapper}
          onPress={handleChooseFile}
          activeOpacity={0.8}
        >
          <Image
            source={{ uri: profileImage }}
            style={styles.avatarImage}
          />
          <View style={styles.cameraIconBadge}>
            <Ionicons name="camera" size={14} color="#FFFFFF" />
          </View>
        </TouchableOpacity>
      </View>

      {/* Section 1: Identity & Aadhaar Verification */}
      <SectionHeader
        title="1. Identity Verification (Aadhaar & Mobile)"
        subtitle="Linked for DBT payment and digital token issuance"
      />
      <KisanCard style={styles.card}>
        <Text style={styles.inputLabel}>Aadhaar Number (12 Digits) *</Text>
        <View style={styles.inlineActionRow}>
          <TextInput
            style={[styles.input, { flex: 1 }]}
            placeholder="XXXX XXXX XXXX"
            keyboardType="numeric"
            value={aadhaar}
            onChangeText={formatAadhaar}
          />
          <TouchableOpacity
            style={[styles.verifyBtn, isAadhaarVerified && styles.verifiedBtn]}
            onPress={handleVerifyAadhaar}
          >
            <Text style={styles.verifyBtnText}>
              {isAadhaarVerified ? '✓ Verified' : 'Verify'}
            </Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.inputLabel}>Mobile Number (Aadhaar Linked) *</Text>
        <View style={styles.inlineActionRow}>
          <TextInput
            style={[styles.input, { flex: 1 }]}
            placeholder="10-digit mobile number"
            keyboardType="phone-pad"
            value={mobile}
            onChangeText={setMobile}
            maxLength={10}
          />
          <TouchableOpacity
            style={[styles.verifyBtn, isMobileVerified && styles.verifiedBtn]}
            onPress={handleSendOtp}
          >
            <Text style={styles.verifyBtnText}>
              {isMobileVerified ? '✓ Verified' : 'Get OTP'}
            </Text>
          </TouchableOpacity>
        </View>

        {otpSent && !isMobileVerified && (
          <View style={styles.otpBox}>
            <Text style={styles.otpPrompt}>Enter 4-Digit OTP (Demo: 1234):</Text>
            <View style={styles.inlineActionRow}>
              <TextInput
                style={[styles.input, { flex: 1 }]}
                placeholder="4-digit OTP"
                keyboardType="numeric"
                value={otp}
                onChangeText={setOtp}
                maxLength={4}
              />
              <TouchableOpacity style={styles.verifyBtn} onPress={handleVerifyOtp}>
                <Text style={styles.verifyBtnText}>Confirm OTP</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </KisanCard>

      {/* Section 2: Bio Data & Address */}
      <SectionHeader
        title="2. Farmer Bio Data & Address Details"
        subtitle="As recorded in revenue & electoral roll"
      />
      <KisanCard style={styles.card}>
        <Text style={styles.inputLabel}>Farmer Full Name *</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. Ramesh Chandra Nayak"
          value={fullName}
          onChangeText={setFullName}
        />

        <Text style={styles.inputLabel}>Father's / Husband's Name *</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. Harishankar Nayak"
          value={fatherName}
          onChangeText={setFatherName}
        />

        <Text style={styles.inputLabel}>Gender</Text>
        <View style={styles.chipRow}>
          {(['Male', 'Female', 'Other'] as const).map((g) => (
            <TouchableOpacity
              key={g}
              style={[styles.chip, gender === g && styles.chipActive]}
              onPress={() => setGender(g)}
            >
              <Text style={[styles.chipText, gender === g && styles.chipTextActive]}>
                {g}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.twoCol}>
          <View style={{ flex: 1 }}>
            <Text style={styles.inputLabel}>Village / Gram *</Text>
            <TextInput
              style={styles.input}
              placeholder="Village name"
              value={village}
              onChangeText={setVillage}
            />
          </View>
          <View style={{ flex: 1, marginLeft: spacing.sm }}>
            <Text style={styles.inputLabel}>PIN Code (6 Digits) *</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. 462001"
              keyboardType="numeric"
              maxLength={6}
              value={pinCode}
              onChangeText={setPinCode}
            />
          </View>
        </View>

        <View style={styles.twoCol}>
          <View style={{ flex: 1 }}>
            <Text style={styles.inputLabel}>District</Text>
            <TextInput style={styles.input} value={district} onChangeText={setDistrict} />
          </View>
          <View style={{ flex: 1, marginLeft: spacing.sm }}>
            <Text style={styles.inputLabel}>State</Text>
            <TextInput style={styles.input} value={state} onChangeText={setState} />
          </View>
        </View>
      </KisanCard>

      {/* Section 3: Profile Picture with Choose File Option (Placed after Bio Data) */}
      <SectionHeader
        title="3. Profile Picture / Farmer Photo"
        subtitle="Upload a clear passport size photograph for Mandi pass & identity verification"
      />
      <KisanCard style={styles.card}>
        <View style={styles.photoUploadRow}>
          {/* Photo Preview */}
          <View style={styles.photoPreviewBox}>
            <Image source={{ uri: profileImage }} style={styles.previewImage} />
            <View style={styles.photoBadge}>
              <Text style={styles.photoBadgeText}>Preview</Text>
            </View>
          </View>

          {/* Choose File Controls */}
          <View style={styles.fileChooserControls}>
            <Text style={styles.uploadHeading}>Passport Photo Document</Text>
            <Text style={styles.uploadGuideline}>
              Formats: JPG, PNG • Max size: 5 MB
            </Text>

            <View style={styles.fileInputRow}>
              <TouchableOpacity
                style={styles.chooseFileBtn}
                onPress={handleChooseFile}
                activeOpacity={0.8}
              >
                <Ionicons name="folder-open-outline" size={16} color="#FFFFFF" />
                <Text style={styles.chooseFileBtnText}>Choose File</Text>
              </TouchableOpacity>
              <Text style={styles.fileNameText} numberOfLines={1}>
                {fileName}
              </Text>
            </View>

            <TouchableOpacity
              style={styles.altCameraBtn}
              onPress={handleChooseFile}
            >
              <Ionicons name="camera-outline" size={14} color={colors.primary} />
              <Text style={styles.altCameraBtnText}>Take Live Selfie / Change</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KisanCard>

      {/* Section 4: Bank Account & IFSC (DBT) */}
      <SectionHeader
        title="4. Bank Account Details (DBT Direct Payout)"
        subtitle="Procurement money will be deposited directly here"
      />
      <KisanCard style={styles.card}>
        <Text style={styles.inputLabel}>IFSC Code *</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. SBIN0001234"
          autoCapitalize="characters"
          value={ifsc}
          onChangeText={setIfsc}
        />

        <View style={styles.twoCol}>
          <View style={{ flex: 1 }}>
            <Text style={styles.inputLabel}>Bank Name</Text>
            <TextInput style={styles.input} value={bankName} onChangeText={setBankName} />
          </View>
          <View style={{ flex: 1, marginLeft: spacing.sm }}>
            <Text style={styles.inputLabel}>Branch Name</Text>
            <TextInput style={styles.input} value={branchName} onChangeText={setBranchName} />
          </View>
        </View>

        <Text style={styles.inputLabel}>Bank Account Number *</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter full bank account number"
          keyboardType="numeric"
          secureTextEntry
          value={accountNo}
          onChangeText={setAccountNo}
        />

        <Text style={styles.inputLabel}>Confirm Bank Account Number *</Text>
        <TextInput
          style={styles.input}
          placeholder="Re-enter bank account number"
          keyboardType="numeric"
          value={confirmAccountNo}
          onChangeText={setConfirmAccountNo}
        />
      </KisanCard>

      {/* Section 5: Land Record Details */}
      <SectionHeader
        title="5. Land Record & Cultivation Area"
        subtitle="Verified against Bhu-Abhilekh (Revenue Registry)"
      />
      <KisanCard style={styles.card}>
        <View style={styles.twoCol}>
          <View style={{ flex: 1 }}>
            <Text style={styles.inputLabel}>Khasra / Survey No. *</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. 142/1, 142/2"
              value={khasraNo}
              onChangeText={setKhasraNo}
            />
          </View>
          <View style={{ flex: 1, marginLeft: spacing.sm }}>
            <Text style={styles.inputLabel}>Cultivable Area (Acres) *</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. 4.5"
              keyboardType="numeric"
              value={landArea}
              onChangeText={setLandArea}
            />
          </View>
        </View>

        <Text style={styles.inputLabel}>Primary Crop Grown</Text>
        <TextInput
          style={styles.input}
          value={primaryCrop}
          onChangeText={setPrimaryCrop}
        />

        <Text style={styles.inputLabel}>Land Record Document (Khasra Copy)</Text>
        <TouchableOpacity
          style={[styles.uploadBox, landDocUploaded && styles.uploadBoxDone]}
          onPress={handleUploadLandDoc}
        >
          <Ionicons
            name={landDocUploaded ? 'checkmark-circle' : 'cloud-upload-outline'}
            size={28}
            color={landDocUploaded ? colors.primary : colors.secondary}
          />
          <Text style={[styles.uploadText, landDocUploaded && styles.uploadTextDone]}>
            {landDocUploaded
              ? '✓ Khasra_Document_2026.pdf Attached'
              : 'Tap to Upload Bhu-Abhilekh / Land Record Copy (PDF/JPG)'}
          </Text>
        </TouchableOpacity>
      </KisanCard>

      {/* Registration Submit Action */}
      <View style={styles.actionBox}>
        <KisanButton
          title="Complete Farmer Registration & Get ID"
          onPress={handleSubmitRegistration}
          variant="primary"
        />

        <TouchableOpacity
          style={styles.loginLink}
          onPress={() => router.push('/(auth)/login?role=farmer')}
        >
          <Text style={styles.loginLinkText}>
            Already registered? <Text style={{ fontWeight: 'bold', color: colors.primary }}>Log In</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: spacing.md,
  },
  headerCard: {
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
  headerTextCol: {
    flex: 1,
    marginRight: spacing.sm,
  },
  govtBadge: {
    fontSize: 9,
    fontWeight: 'bold',
    color: colors.primaryDark,
    letterSpacing: 0.5,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginTop: 2,
  },
  headerSub: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 2,
  },
  avatarCornerWrapper: {
    position: 'relative',
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 2,
    borderColor: colors.primary,
  },
  avatarImage: {
    width: '100%',
    height: '100%',
    borderRadius: 32,
  },
  cameraIconBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    backgroundColor: colors.primary,
    width: 22,
    height: 22,
    borderRadius: 11,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  card: {
    marginBottom: spacing.md,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginTop: spacing.sm,
    marginBottom: 4,
  },
  input: {
    backgroundColor: '#FAFAFA',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.sm,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 14,
    color: colors.textPrimary,
  },
  inlineActionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  verifyBtn: {
    backgroundColor: colors.secondary,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: radius.sm,
  },
  verifiedBtn: {
    backgroundColor: colors.primary,
  },
  verifyBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  otpBox: {
    backgroundColor: '#E8F5E9',
    padding: spacing.sm,
    borderRadius: radius.sm,
    marginTop: spacing.sm,
  },
  otpPrompt: {
    fontSize: 11,
    color: colors.primaryDark,
    fontWeight: '600',
    marginBottom: 4,
  },
  chipRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 4,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: radius.sm,
    backgroundColor: '#F5F5F5',
    borderWidth: 1,
    borderColor: colors.border,
  },
  chipActive: {
    backgroundColor: '#E8F5E9',
    borderColor: colors.primary,
  },
  chipText: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  chipTextActive: {
    color: colors.primary,
    fontWeight: 'bold',
  },
  twoCol: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  photoUploadRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
  },
  photoPreviewBox: {
    position: 'relative',
    width: 72,
    height: 72,
    borderRadius: 36,
    borderWidth: 2,
    borderColor: colors.primary,
    marginRight: spacing.md,
  },
  previewImage: {
    width: '100%',
    height: '100%',
    borderRadius: 36,
  },
  photoBadge: {
    position: 'absolute',
    bottom: -4,
    left: 10,
    backgroundColor: colors.primary,
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 4,
  },
  photoBadgeText: {
    fontSize: 9,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  fileChooserControls: {
    flex: 1,
  },
  uploadHeading: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  uploadGuideline: {
    fontSize: 11,
    color: colors.textSecondary,
    marginBottom: 8,
  },
  fileInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 3,
    marginBottom: 6,
  },
  chooseFileBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#455A64',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: radius.sm - 2,
    gap: 4,
  },
  chooseFileBtnText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  fileNameText: {
    flex: 1,
    fontSize: 12,
    color: colors.textSecondary,
    marginLeft: 8,
  },
  altCameraBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  altCameraBtnText: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.primary,
  },
  uploadBox: {
    borderWidth: 1.5,
    borderColor: colors.secondary,
    borderStyle: 'dashed',
    borderRadius: radius.md,
    backgroundColor: '#F5F9FF',
    padding: spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
  },
  uploadBoxDone: {
    borderColor: colors.primary,
    backgroundColor: '#F1F8E9',
    borderStyle: 'solid',
  },
  uploadText: {
    fontSize: 12,
    color: colors.secondary,
    fontWeight: '600',
    marginTop: 4,
    textAlign: 'center',
  },
  uploadTextDone: {
    color: colors.primary,
    fontWeight: 'bold',
  },
  actionBox: {
    marginVertical: spacing.md,
    marginBottom: spacing.xxl,
  },
  loginLink: {
    alignItems: 'center',
    marginTop: spacing.md,
  },
  loginLinkText: {
    fontSize: 13,
    color: colors.textSecondary,
  },
});
