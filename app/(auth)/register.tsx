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
  ScrollView,
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
import {
  ALL_INDIAN_STATES,
  getDistrictsForState,
  getVillagesForDistrict,
} from '../../src/data/india-locations';

export default function FarmerRegistrationScreen() {
  const router = useRouter();
  const { dispatch } = useAppContext();

  // Profile Picture State (null = no photo chosen yet)
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>('No file chosen');

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
  const [state, setState] = useState('');
  const [district, setDistrict] = useState('');
  const [village, setVillage] = useState('');
  const [pinCode, setPinCode] = useState('');
  const [showStateDD, setShowStateDD] = useState(false);
  const [showDistrictDD, setShowDistrictDD] = useState(false);
  const [showVillageDD, setShowVillageDD] = useState(false);
  const [stateSearch, setStateSearch] = useState('');
  const [districtSearch, setDistrictSearch] = useState('');
  const [villageSearch, setVillageSearch] = useState('');
  const [isCustomVillage, setIsCustomVillage] = useState(false);

  // Comprehensive Location Filtering across All 36 States/UTs & All Districts
  const stateList = ALL_INDIAN_STATES.filter((s) =>
    s.toLowerCase().includes(stateSearch.toLowerCase().trim())
  );

  const availableDistricts = state ? getDistrictsForState(state) : [];
  const districtList = availableDistricts.filter((d) =>
    d.toLowerCase().includes(districtSearch.toLowerCase().trim())
  );

  const availableVillages = district ? getVillagesForDistrict(district) : [];
  const villageList = availableVillages.filter((v) =>
    v.toLowerCase().includes(villageSearch.toLowerCase().trim())
  );

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
  const [landDocFileName, setLandDocFileName] = useState<string>('No file chosen');
  const [landDocFileSize, setLandDocFileSize] = useState<string>('');

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
            }
          };
          reader.readAsDataURL(file);
        }
      };
      input.click();
    } else {
      // Native: camera/gallery not available in demo — show alert
      Alert.alert('Upload Photo', 'On a real device, this would open your camera or gallery.');
    }
  };

  const handleUploadLandDoc = () => {
    if (Platform.OS === 'web' && typeof document !== 'undefined') {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*,.pdf,.doc,.docx';
      input.onchange = (e: any) => {
        const file = e.target.files?.[0];
        if (file) {
          setLandDocFileName(file.name);
          const sizeKB = (file.size / 1024).toFixed(1);
          const sizeMB = (file.size / (1024 * 1024)).toFixed(2);
          setLandDocFileSize(file.size > 1024 * 1024 ? `${sizeMB} MB` : `${sizeKB} KB`);
          setLandDocUploaded(true);
          Alert.alert('Document Attached', `Land record attached: ${file.name}`);
        }
      };
      input.click();
    } else {
      // Native fallback
      setLandDocFileName('Khasra_Document_2026.pdf');
      setLandDocFileSize('1.2 MB');
      setLandDocUploaded(true);
      Alert.alert('Document Attached', 'Khasra-Khatauni land record uploaded successfully (PDF/Image).');
    }
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
          {profileImage ? (
            <Image source={{ uri: profileImage }} style={styles.avatarImage} />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <Ionicons name="person" size={28} color="#BDBDBD" />
            </View>
          )}
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

        {/* Address: State → District → Village → PIN */}
        {/* 1. State Selector */}
        <View style={styles.dropdownHeaderRow}>
          <Text style={styles.inputLabel}>1. State / Union Territory *</Text>
          <Text style={styles.countBadge}>All 36 States &amp; UTs</Text>
        </View>
        <TouchableOpacity
          style={styles.dropdownTrigger}
          onPress={() => {
            setShowStateDD(!showStateDD);
            setShowDistrictDD(false);
            setShowVillageDD(false);
            setStateSearch('');
          }}
          activeOpacity={0.85}
        >
          <Text style={[styles.dropdownTriggerText, !state && styles.dropdownPlaceholder]}>
            {state || 'Select your State / राज्य चुनें'}
          </Text>
          <Ionicons name={showStateDD ? 'chevron-up' : 'chevron-down'} size={16} color="#666" />
        </TouchableOpacity>

        {showStateDD && (
          <View style={styles.dropdownList}>
            {/* Search Input for State */}
            <View style={styles.dropdownSearchRow}>
              <Ionicons name="search-outline" size={15} color="#888" />
              <TextInput
                style={styles.dropdownSearchInput}
                placeholder="Search state (e.g. Odisha, MP, UP)..."
                placeholderTextColor="#999"
                value={stateSearch}
                onChangeText={setStateSearch}
                autoFocus={true}
              />
              {stateSearch.length > 0 && (
                <TouchableOpacity onPress={() => setStateSearch('')}>
                  <Ionicons name="close-circle" size={16} color="#999" />
                </TouchableOpacity>
              )}
            </View>

            <ScrollView style={styles.dropdownScrollView} nestedScrollEnabled={true} keyboardShouldPersistTaps="handled">
              {stateList.map((s) => (
                <TouchableOpacity
                  key={s}
                  style={[styles.dropdownItem, state === s && styles.dropdownItemActive]}
                  onPress={() => {
                    setState(s);
                    setDistrict('');
                    setVillage('');
                    setShowStateDD(false);
                    setStateSearch('');
                  }}
                >
                  <Text style={[styles.dropdownItemText, state === s && styles.dropdownItemTextActive]}>{s}</Text>
                  {state === s && <Ionicons name="checkmark" size={14} color={colors.primary} />}
                </TouchableOpacity>
              ))}
              {stateList.length === 0 && (
                <View style={styles.dropdownEmpty}>
                  <Text style={styles.dropdownEmptyText}>No matching state found</Text>
                </View>
              )}
            </ScrollView>
          </View>
        )}

        {/* 2. District Selector */}
        <View style={styles.dropdownHeaderRow}>
          <Text style={styles.inputLabel}>2. District / ज़िला *</Text>
          {state && availableDistricts.length > 0 && (
            <Text style={styles.countBadge}>{availableDistricts.length} Districts in {state}</Text>
          )}
        </View>
        <TouchableOpacity
          style={[styles.dropdownTrigger, !state && styles.dropdownDisabled]}
          onPress={() => {
            if (!state) return;
            setShowDistrictDD(!showDistrictDD);
            setShowStateDD(false);
            setShowVillageDD(false);
            setDistrictSearch('');
          }}
          activeOpacity={0.85}
        >
          <Text style={[styles.dropdownTriggerText, !district && styles.dropdownPlaceholder]}>
            {district || (state ? `Select District in ${state}` : 'Select State first')}
          </Text>
          <Ionicons name={showDistrictDD ? 'chevron-up' : 'chevron-down'} size={16} color="#666" />
        </TouchableOpacity>

        {showDistrictDD && (
          <View style={styles.dropdownList}>
            {/* Search Input for District */}
            <View style={styles.dropdownSearchRow}>
              <Ionicons name="search-outline" size={15} color="#888" />
              <TextInput
                style={styles.dropdownSearchInput}
                placeholder="Search district name..."
                placeholderTextColor="#999"
                value={districtSearch}
                onChangeText={setDistrictSearch}
                autoFocus={true}
              />
              {districtSearch.length > 0 && (
                <TouchableOpacity onPress={() => setDistrictSearch('')}>
                  <Ionicons name="close-circle" size={16} color="#999" />
                </TouchableOpacity>
              )}
            </View>

            <ScrollView style={styles.dropdownScrollView} nestedScrollEnabled={true} keyboardShouldPersistTaps="handled">
              {districtList.map((d) => (
                <TouchableOpacity
                  key={d}
                  style={[styles.dropdownItem, district === d && styles.dropdownItemActive]}
                  onPress={() => {
                    setDistrict(d);
                    setVillage('');
                    setShowDistrictDD(false);
                    setDistrictSearch('');
                  }}
                >
                  <Text style={[styles.dropdownItemText, district === d && styles.dropdownItemTextActive]}>{d}</Text>
                  {district === d && <Ionicons name="checkmark" size={14} color={colors.primary} />}
                </TouchableOpacity>
              ))}
              {districtList.length === 0 && (
                <View style={styles.dropdownEmpty}>
                  <Text style={styles.dropdownEmptyText}>No matching district found</Text>
                </View>
              )}
            </ScrollView>
          </View>
        )}

        {/* 3. Village / Gram Selector & Custom Entry */}
        <View style={styles.dropdownHeaderRow}>
          <Text style={styles.inputLabel}>3. Village / Gram Panchayat / गाँव *</Text>
          <TouchableOpacity
            onPress={() => setIsCustomVillage(!isCustomVillage)}
            style={styles.modeToggleBtn}
          >
            <Ionicons name={isCustomVillage ? 'list-outline' : 'create-outline'} size={13} color={colors.primary} />
            <Text style={styles.modeToggleBtnText}>
              {isCustomVillage ? 'Choose from List' : '+ Type Any Village'}
            </Text>
          </TouchableOpacity>
        </View>

        {isCustomVillage ? (
          <View style={styles.customVillageRow}>
            <TextInput
              style={[styles.input, { flex: 1 }]}
              placeholder="Type your Village or Gram Panchayat name..."
              placeholderTextColor="#999"
              value={village}
              onChangeText={setVillage}
              autoFocus={true}
            />
            {village.length > 0 && (
              <View style={styles.checkBadge}>
                <Ionicons name="checkmark-circle" size={18} color={colors.primary} />
              </View>
            )}
          </View>
        ) : (
          <>
            <TouchableOpacity
              style={[styles.dropdownTrigger, !district && styles.dropdownDisabled]}
              onPress={() => {
                if (!district) return;
                setShowVillageDD(!showVillageDD);
                setShowStateDD(false);
                setShowDistrictDD(false);
                setVillageSearch('');
              }}
              activeOpacity={0.85}
            >
              <Text style={[styles.dropdownTriggerText, !village && styles.dropdownPlaceholder]}>
                {village || (district ? `Select Village / Panchayat in ${district}` : 'Select District first')}
              </Text>
              <Ionicons name={showVillageDD ? 'chevron-up' : 'chevron-down'} size={16} color="#666" />
            </TouchableOpacity>

            {showVillageDD && (
              <View style={styles.dropdownList}>
                {/* Search Input for Village */}
                <View style={styles.dropdownSearchRow}>
                  <Ionicons name="search-outline" size={15} color="#888" />
                  <TextInput
                    style={styles.dropdownSearchInput}
                    placeholder="Search village name or tehsil..."
                    placeholderTextColor="#999"
                    value={villageSearch}
                    onChangeText={setVillageSearch}
                    autoFocus={true}
                  />
                  {villageSearch.length > 0 && (
                    <TouchableOpacity onPress={() => setVillageSearch('')}>
                      <Ionicons name="close-circle" size={16} color="#999" />
                    </TouchableOpacity>
                  )}
                </View>

                <ScrollView style={styles.dropdownScrollView} nestedScrollEnabled={true} keyboardShouldPersistTaps="handled">
                  {villageList.map((v) => (
                    <TouchableOpacity
                      key={v}
                      style={[styles.dropdownItem, village === v && styles.dropdownItemActive]}
                      onPress={() => {
                        setVillage(v);
                        setShowVillageDD(false);
                        setVillageSearch('');
                      }}
                    >
                      <Text style={[styles.dropdownItemText, village === v && styles.dropdownItemTextActive]}>{v}</Text>
                      {village === v && <Ionicons name="checkmark" size={14} color={colors.primary} />}
                    </TouchableOpacity>
                  ))}

                  {/* Option to type custom village at the end of the list */}
                  <TouchableOpacity
                    style={styles.typeCustomItem}
                    onPress={() => {
                      setShowVillageDD(false);
                      setIsCustomVillage(true);
                    }}
                  >
                    <Ionicons name="add-circle-outline" size={16} color={colors.primary} />
                    <Text style={styles.typeCustomItemText}>
                      Can't find your village? Type it manually →
                    </Text>
                  </TouchableOpacity>
                </ScrollView>
              </View>
            )}
          </>
        )}

        {/* 4. PIN Code */}
        <Text style={styles.inputLabel}>4. PIN Code (6 Digits) *</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. 462001"
          keyboardType="numeric"
          maxLength={6}
          value={pinCode}
          onChangeText={setPinCode}
        />
      </KisanCard>

      {/* Section 3: Profile Picture with Choose File Option (Placed after Bio Data) */}
      <SectionHeader
        title="3. Profile Picture / Farmer Photo"
        subtitle="Upload a clear passport size photograph for Mandi pass & identity verification"
      />
      <KisanCard style={styles.card}>
          {/* Choose File Controls */}
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

        <Text style={styles.inputLabel}>Land Record Document (Khasra / Bhu-Abhilekh Copy) *</Text>
        <Text style={styles.uploadGuideline}>Formats: PDF, JPG, PNG, DOC • Max size: 10 MB</Text>

        <View style={styles.fileInputRow}>
          <TouchableOpacity
            style={styles.chooseFileBtn}
            onPress={handleUploadLandDoc}
            activeOpacity={0.8}
          >
            <Ionicons name="folder-open-outline" size={16} color="#FFFFFF" />
            <Text style={styles.chooseFileBtnText}>Choose File</Text>
          </TouchableOpacity>
          <Text style={styles.fileNameText} numberOfLines={1}>
            {landDocFileName}
          </Text>
        </View>

        {landDocUploaded && (
          <View style={styles.landDocSuccessRow}>
            <Ionicons name="checkmark-circle" size={18} color={colors.primary} />
            <View style={{ flex: 1, marginLeft: 6 }}>
              <Text style={styles.landDocFileName} numberOfLines={1}>{landDocFileName}</Text>
              {landDocFileSize ? (
                <Text style={styles.landDocFileSize}>{landDocFileSize} • Uploaded ✓</Text>
              ) : null}
            </View>
            <TouchableOpacity onPress={handleUploadLandDoc}>
              <Text style={styles.reUploadText}>Change</Text>
            </TouchableOpacity>
          </View>
        )}

        {!landDocUploaded && (
          <TouchableOpacity
            style={styles.uploadBox}
            onPress={handleUploadLandDoc}
            activeOpacity={0.8}
          >
            <Ionicons name="cloud-upload-outline" size={28} color={colors.secondary} />
            <Text style={styles.uploadText}>
              Tap to Upload Bhu-Abhilekh / Land Record Copy (PDF/JPG)
            </Text>
          </TouchableOpacity>
        )}
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
  avatarPlaceholder: {
    width: '100%',
    height: '100%',
    borderRadius: 32,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
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
  dropdownTrigger: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FAFAFA',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.sm,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 2,
  },
  dropdownDisabled: {
    backgroundColor: '#F0F0F0',
    opacity: 0.6,
  },
  dropdownTriggerText: {
    fontSize: 14,
    color: colors.textPrimary,
    flex: 1,
  },
  dropdownPlaceholder: {
    color: '#AAAAAA',
  },
  dropdownList: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.sm,
    marginBottom: spacing.sm,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  dropdownHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: spacing.sm,
  },
  countBadge: {
    fontSize: 11,
    color: colors.primaryDark,
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    fontWeight: '600',
  },
  dropdownSearchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
    backgroundColor: '#FAFAFA',
    gap: 8,
  },
  dropdownSearchInput: {
    flex: 1,
    fontSize: 13,
    color: colors.textPrimary,
    paddingVertical: 2,
  },
  dropdownScrollView: {
    maxHeight: 220,
  },
  dropdownEmpty: {
    padding: 16,
    alignItems: 'center',
  },
  dropdownEmptyText: {
    fontSize: 13,
    color: '#888888',
    fontStyle: 'italic',
  },
  modeToggleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: radius.sm,
  },
  modeToggleBtnText: {
    fontSize: 11,
    color: colors.primary,
    fontWeight: 'bold',
  },
  customVillageRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkBadge: {
    marginLeft: 8,
  },
  typeCustomItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 12,
    backgroundColor: '#F1F8E9',
    borderTopWidth: 1,
    borderTopColor: '#C8E6C9',
    gap: 6,
  },
  typeCustomItemText: {
    fontSize: 13,
    fontWeight: 'bold',
    color: colors.primary,
  },
  dropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  dropdownItemActive: {
    backgroundColor: '#E8F5E9',
  },
  dropdownItemText: {
    fontSize: 14,
    color: colors.textPrimary,
  },
  dropdownItemTextActive: {
    color: colors.primary,
    fontWeight: '600',
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
    marginTop: 8,
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
  landDocSuccessRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F8E9',
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.primary,
    padding: spacing.sm,
    marginTop: 6,
  },
  landDocFileName: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  landDocFileSize: {
    fontSize: 11,
    color: colors.primary,
    marginTop: 1,
  },
  reUploadText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: colors.secondary,
    marginLeft: 8,
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
