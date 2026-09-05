import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ImageBackground,
  Image,
  Platform,
  Alert,
  ScrollView,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../src/theme/colors';
import { spacing } from '../../src/theme/spacing';
import { radius } from '../../src/theme/radius';
import { useAppContext } from '../../src/store/app-context';
import { StorageService } from '../../src/services/storage/storage.service';
import { Farmer } from '../../src/types/models';
import { UserRole } from '../../src/types/enums';
import { TopVoiceLanguageBar } from '../../src/components/TopVoiceLanguageBar';

const BG_IMAGE = 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=1200&auto=format&fit=crop&q=80';

export default function OtpVerificationScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { state, dispatch } = useAppContext();

  const phone = (params.phone as string) || '';
  const initialName = (params.name as string) || '';
  const initialVillage = (params.village as string) || '';
  const paramRole = (params.role as string) || '';

  const [otp, setOtp] = useState('');
  const [isOtpVerified, setIsOtpVerified] = useState(false);
  const [selectedRole, setSelectedRole] = useState<'farmer' | 'operator' | 'admin'>('farmer');
  const [detectedRole, setDetectedRole] = useState<'farmer' | 'operator' | 'admin'>('farmer');
  const [matchedFarmer, setMatchedFarmer] = useState<Farmer | null>(null);
  const [timer, setTimer] = useState(30);

  // Detect user role & match existing farmer on mount
  useEffect(() => {
    async function detectUser() {
      const current = await StorageService.getItem<Farmer>('kisan_current_farmer');
      const all = (await StorageService.getItem<Farmer[]>('kisan_all_farmers')) || [];
      const found =
        (current && current.phone === phone ? current : null) ||
        all.find((f) => f.phone === phone) ||
        state.farmers.find((f) => f.phone === phone);

      if (found) {
        setMatchedFarmer(found);
      }

      // Check role heuristics
      let detected: 'farmer' | 'operator' | 'admin' = 'farmer';
      if (paramRole === 'admin' || phone.startsWith('999') || phone === '9999999999') {
        detected = 'admin';
      } else if (paramRole === 'operator' || phone.startsWith('888') || phone === '8888888888') {
        detected = 'operator';
      } else {
        detected = 'farmer';
      }

      setDetectedRole(detected);
      setSelectedRole(detected);
    }

    detectUser();
  }, [phone, paramRole]);

  // Resend OTP countdown timer
  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => setTimer((t) => t - 1), 1000);
      return () => clearInterval(interval);
    }
  }, [timer]);

  const handleOtpChange = (value: string) => {
    const cleaned = value.replace(/\D/g, '').slice(0, 6);
    setOtp(cleaned);
    if (cleaned === '1234' || cleaned.length === 4) {
      setIsOtpVerified(true);
    } else {
      setIsOtpVerified(false);
    }
  };

  const handleAutoFillDemo = () => {
    setOtp('1234');
    setIsOtpVerified(true);
  };

  const verifyOtp = (code: string) => {
    if (code === '1234' || code.length === 4) {
      setIsOtpVerified(true);
    } else {
      Alert.alert('Invalid OTP', 'Please enter the 4-digit code (Demo OTP is 1234).');
    }
  };

  const handleResendOtp = () => {
    setTimer(30);
    setOtp('');
    setIsOtpVerified(false);
    Alert.alert('OTP Sent', `A new verification code has been sent to +91 ${phone}. (Demo: 1234)`);
  };

  // Branch & Navigate to chosen Dashboard
  const handleProceedToDashboard = async () => {
    // 1. Farmer Dashboard
    if (selectedRole === 'farmer') {
      let farmerToLogin: Farmer;

      if (matchedFarmer) {
        farmerToLogin = {
          ...matchedFarmer,
          name: initialName.trim() || matchedFarmer.name,
          village: initialVillage.trim() || matchedFarmer.village,
        };
      } else {
        const stored = await StorageService.getItem<Farmer>('kisan_current_farmer');
        if (stored && stored.phone === phone) {
          farmerToLogin = {
            ...stored,
            name: initialName.trim() || stored.name,
            village: initialVillage.trim() || stored.village,
          };
        } else {
          const farmerId = `F-${Math.floor(100 + Math.random() * 900)}`;
          farmerToLogin = {
            id: farmerId,
            name: initialName.trim() || `Farmer ${phone.slice(-4)}`,
            phone: phone,
            village: initialVillage.trim() || 'Gram Panchayat',
            district: 'Bhopal',
            state: 'Madhya Pradesh',
            pinCode: '462001',
            landArea: 4.5,
            khasraNo: '142/1',
            primaryCrop: 'Wheat (गेहूं)',
            bankAccount: '•••• 5678',
            ifsc: 'SBIN0001234',
            bankName: 'State Bank of India',
            branchName: 'Main Branch',
            photoUrl: null,
            isVerified: true,
            profileComplete: true,
            status: 'Active',
            createdAt: new Date().toISOString(),
          };
        }
      }

      try {
        await StorageService.setItem('kisan_current_farmer', farmerToLogin);
        const all = (await StorageService.getItem<Farmer[]>('kisan_all_farmers')) || [];
        const updatedAll = [
          farmerToLogin,
          ...all.filter((f) => f.phone !== farmerToLogin.phone && f.id !== farmerToLogin.id),
        ];
        await StorageService.setItem('kisan_all_farmers', updatedAll);
      } catch (e) {
        console.warn('Storage save error:', e);
      }

      dispatch({
        type: 'SET_CURRENT_FARMER',
        payload: farmerToLogin,
      });

      dispatch({
        type: 'SET_ROLE',
        payload: {
          role: UserRole.FARMER,
          userId: farmerToLogin.id,
          userName: farmerToLogin.name,
        },
      });

      router.replace('/(farmer)/(tabs)');
      return;
    }

    // 2. Mandi Officer Dashboard
    if (selectedRole === 'operator') {
      const opName = initialName.trim() || 'Suresh Verma';
      dispatch({
        type: 'SET_ROLE',
        payload: {
          role: UserRole.OPERATOR,
          userId: 'OP-104',
          userName: opName,
        },
      });
      router.replace('/(operator)');
      return;
    }

    // 3. State Administrator Dashboard
    if (selectedRole === 'admin') {
      const admName = initialName.trim() || 'Central Admin (DoCA)';
      dispatch({
        type: 'SET_ROLE',
        payload: {
          role: UserRole.ADMIN,
          userId: 'ADM-001',
          userName: admName,
        },
      });
      router.replace('/(admin)');
      return;
    }
  };

  return (
    <ImageBackground source={{ uri: BG_IMAGE }} style={styles.bg} resizeMode="cover">
      <View style={styles.overlay} />

      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        <View style={styles.screen}>
          {/* Top Voice Assistance & Language Switcher Bar */}
          <TopVoiceLanguageBar
            variant="transparent"
            title="OTP Verification"
            voiceText="ओटीपी सत्यापन पृष्ठ। कृपया अपने मोबाइल पर आया 6 अंकों का ओटीपी दर्ज करें।"
          />
          {/* Top branding */}
          <View style={styles.brandRow}>
            <Image
              source={require('../../assets/logo.png')}
              style={styles.brandLogo}
              resizeMode="contain"
            />
            <Text style={styles.brandTitle}>Kisan Mitra</Text>
            <Text style={styles.brandSub}>e-Procurement & Digital Identity Flow</Text>
          </View>

          {/* Flow Stepper Indicator */}
          <View style={styles.flowStepper}>
            <View style={styles.stepBadgeDone}>
              <Ionicons name="checkmark" size={12} color="#FFFFFF" />
              <Text style={styles.stepBadgeText}>1. Mobile</Text>
            </View>
            <View style={styles.stepLineActive} />
            <View style={[styles.stepBadge, isOtpVerified ? styles.stepBadgeDone : styles.stepBadgeActive]}>
              <Text style={styles.stepBadgeText}>2. OTP</Text>
            </View>
            <View style={[styles.stepLine, isOtpVerified && styles.stepLineActive]} />
            <View style={[styles.stepBadge, isOtpVerified && styles.stepBadgeActive]}>
              <Text style={styles.stepBadgeText}>3. Role</Text>
            </View>
          </View>

          {/* Glass Card Container */}
          <View style={styles.glassCard}>
            {/* Step 1 & 2: OTP Verification Block */}
            <View style={styles.headerRow}>
              <View style={styles.iconCircle}>
                <Ionicons name="shield-checkmark" size={24} color="#FFFFFF" />
              </View>
              <View style={{ flex: 1, marginLeft: 12 }}>
                <Text style={styles.cardTitle}>🔐 OTP Verification</Text>
                <Text style={styles.cardSub}>Code sent to +91 {phone}</Text>
              </View>
            </View>

            {/* Quick Demo Helper */}
            <TouchableOpacity style={styles.demoPill} onPress={handleAutoFillDemo} activeOpacity={0.8}>
              <Ionicons name="flash" size={14} color="#FFD54F" />
              <Text style={styles.demoPillText}>Demo OTP: 1234 • Tap to auto-fill</Text>
            </TouchableOpacity>

            {/* Single OTP Input Box */}
            <Text style={styles.inputLabel}>Enter 4-Digit OTP Code / ओटीपी कोड *</Text>
            <View style={[styles.singleOtpWrapper, isOtpVerified && styles.singleOtpWrapperVerified]}>
              <Ionicons name="key-outline" size={20} color="rgba(255,255,255,0.7)" style={{ marginRight: 10 }} />
              <TextInput
                style={styles.singleOtpInput}
                placeholder="Enter 4-digit OTP (e.g. 1234)"
                placeholderTextColor="rgba(255,255,255,0.45)"
                keyboardType="numeric"
                maxLength={6}
                value={otp}
                onChangeText={handleOtpChange}
                autoFocus={true}
              />
              {isOtpVerified && (
                <Ionicons name="checkmark-circle" size={22} color="#69F0AE" />
              )}
            </View>

            {/* Resend & Status */}
            <View style={styles.resendRow}>
              {isOtpVerified ? (
                <View style={styles.verifiedRow}>
                  <Ionicons name="checkmark-circle" size={16} color="#69F0AE" />
                  <Text style={styles.verifiedText}>Mobile Number Verified ✓</Text>
                </View>
              ) : timer > 0 ? (
                <Text style={styles.timerText}>Resend code in {timer}s</Text>
              ) : (
                <TouchableOpacity onPress={handleResendOtp}>
                  <Text style={styles.resendLink}>Resend OTP code</Text>
                </TouchableOpacity>
              )}
            </View>

            {/* Manual Verify Button if not verified */}
            {!isOtpVerified && (
              <TouchableOpacity
                style={styles.verifyBtn}
                onPress={() => verifyOtp(otp)}
                activeOpacity={0.85}
              >
                <Ionicons name="checkmark-done" size={18} color="#FFFFFF" style={{ marginRight: 6 }} />
                <Text style={styles.verifyBtnText}>Verify OTP Code</Text>
              </TouchableOpacity>
            )}

            {/* Step 3: Check User Role (Appears after OTP verification) */}
            {isOtpVerified && (
              <View style={styles.roleSelectionBlock}>
                <View style={styles.divider}>
                  <View style={styles.dividerLine} />
                  <Text style={styles.dividerText}>👤 Check & Select Role</Text>
                  <View style={styles.dividerLine} />
                </View>

                <Text style={styles.roleBlockTitle}>Where do you want to proceed?</Text>

                {/* 1. Farmer Role Card */}
                <TouchableOpacity
                  style={[styles.roleCard, selectedRole === 'farmer' && styles.roleCardActive]}
                  onPress={() => setSelectedRole('farmer')}
                  activeOpacity={0.85}
                >
                  <View style={[styles.roleCardIconBox, { backgroundColor: '#2E7D32' }]}>
                    <Ionicons name="leaf" size={20} color="#FFFFFF" />
                  </View>
                  <View style={{ flex: 1, marginLeft: 10 }}>
                    <View style={styles.roleHeaderRow}>
                      <Text style={styles.roleNameText}>🌾 Farmer (किसान)</Text>
                      {detectedRole === 'farmer' && (
                        <View style={styles.detectedBadge}>
                          <Text style={styles.detectedBadgeText}>Detected ✓</Text>
                        </View>
                      )}
                    </View>
                    <Text style={styles.roleDescText}>
                      MSP tokens, crop booking, weight receipts & DBT direct payout
                    </Text>
                    {matchedFarmer && (
                      <Text style={styles.accountHint}>
                        Account: {matchedFarmer.name} ({matchedFarmer.village})
                      </Text>
                    )}
                  </View>
                  <View style={styles.radioCircle}>
                    {selectedRole === 'farmer' && <View style={styles.radioInner} />}
                  </View>
                </TouchableOpacity>

                {/* 2. Mandi Officer / Operator Role Card */}
                <TouchableOpacity
                  style={[styles.roleCard, selectedRole === 'operator' && styles.roleCardActive]}
                  onPress={() => setSelectedRole('operator')}
                  activeOpacity={0.85}
                >
                  <View style={[styles.roleCardIconBox, { backgroundColor: '#1565C0' }]}>
                    <Ionicons name="construct" size={20} color="#FFFFFF" />
                  </View>
                  <View style={{ flex: 1, marginLeft: 10 }}>
                    <View style={styles.roleHeaderRow}>
                      <Text style={styles.roleNameText}>🏢 Mandi Officer (मंडी अधिकारी)</Text>
                      {detectedRole === 'operator' && (
                        <View style={styles.detectedBadge}>
                          <Text style={styles.detectedBadgeText}>Detected ✓</Text>
                        </View>
                      )}
                    </View>
                    <Text style={styles.roleDescText}>
                      Station operations, check-in, weighbridge scale & inspection
                    </Text>
                  </View>
                  <View style={styles.radioCircle}>
                    {selectedRole === 'operator' && <View style={styles.radioInner} />}
                  </View>
                </TouchableOpacity>

                {/* 3. State Administrator Role Card */}
                <TouchableOpacity
                  style={[styles.roleCard, selectedRole === 'admin' && styles.roleCardActive]}
                  onPress={() => setSelectedRole('admin')}
                  activeOpacity={0.85}
                >
                  <View style={[styles.roleCardIconBox, { backgroundColor: '#4A148C' }]}>
                    <Ionicons name="shield-checkmark" size={20} color="#FFFFFF" />
                  </View>
                  <View style={{ flex: 1, marginLeft: 10 }}>
                    <View style={styles.roleHeaderRow}>
                      <Text style={styles.roleNameText}>🏛️ State Admin (राज्य प्रशासक)</Text>
                      {detectedRole === 'admin' && (
                        <View style={styles.detectedBadge}>
                          <Text style={styles.detectedBadgeText}>Detected ✓</Text>
                        </View>
                      )}
                    </View>
                    <Text style={styles.roleDescText}>
                      Statewide procurement KPI command, analytics & audits
                    </Text>
                  </View>
                  <View style={styles.radioCircle}>
                    {selectedRole === 'admin' && <View style={styles.radioInner} />}
                  </View>
                </TouchableOpacity>

                {/* Final Launch Button */}
                <TouchableOpacity
                  style={styles.proceedBtn}
                  onPress={handleProceedToDashboard}
                  activeOpacity={0.85}
                >
                  <Text style={styles.proceedBtnText}>
                    Launch {selectedRole === 'farmer' ? 'Farmer' : selectedRole === 'operator' ? 'Officer' : 'Admin'} Dashboard →
                  </Text>
                </TouchableOpacity>
              </View>
            )}

            {/* Back button */}
            <TouchableOpacity
              style={styles.backBtn}
              onPress={() => router.replace('/(auth)/login')}
            >
              <Ionicons name="arrow-back" size={14} color="rgba(255,255,255,0.6)" style={{ marginRight: 4 }} />
              <Text style={styles.backBtnText}>Change Mobile Number</Text>
            </TouchableOpacity>
          </View>

          {/* Footer */}
          <Text style={styles.footerText}>Government of India • DoCA Digital Initiative</Text>
        </View>
      </ScrollView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  bg: {
    flex: 1,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.55)',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingVertical: spacing.xl,
  },
  screen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
  },
  brandRow: {
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  brandLogo: {
    width: 54,
    height: 54,
    borderRadius: 14,
    marginBottom: 6,
  },
  brandTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#FFFFFF',
    letterSpacing: 1,
  },
  brandSub: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.7)',
    marginTop: 2,
  },
  flowStepper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
    gap: 6,
  },
  stepBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.15)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  stepBadgeActive: {
    backgroundColor: colors.primary,
  },
  stepBadgeDone: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2E7D32',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 3,
  },
  stepBadgeText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  stepLine: {
    width: 20,
    height: 2,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  stepLineActive: {
    backgroundColor: '#69F0AE',
  },
  glassCard: {
    width: '100%',
    maxWidth: 440,
    backgroundColor: Platform.OS === 'web' ? 'rgba(255,255,255,0.14)' : 'rgba(255,255,255,0.16)',
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.22)',
    padding: spacing.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 20,
    elevation: 12,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  cardSub: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.7)',
    marginTop: 2,
  },
  demoPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 213, 79, 0.2)',
    borderWidth: 1,
    borderColor: 'rgba(255, 213, 79, 0.5)',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: radius.sm,
    alignSelf: 'flex-start',
    marginVertical: spacing.sm,
    gap: 6,
  },
  demoPillText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#FFD54F',
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.85)',
    marginTop: spacing.sm,
    marginBottom: 4,
  },
  singleOtpWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.3)',
    borderRadius: radius.sm,
    paddingHorizontal: 14,
    height: 52,
    marginBottom: spacing.md,
  },
  singleOtpWrapperVerified: {
    borderColor: '#69F0AE',
    backgroundColor: 'rgba(105, 240, 174, 0.15)',
  },
  singleOtpInput: {
    flex: 1,
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    letterSpacing: 2,
  },
  resendRow: {
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  verifiedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  verifiedText: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#69F0AE',
  },
  timerText: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.5)',
  },
  resendLink: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#69F0AE',
    textDecorationLine: 'underline',
  },
  verifyBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    borderRadius: radius.sm,
    paddingVertical: 13,
    marginBottom: spacing.sm,
  },
  verifyBtnText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  roleSelectionBlock: {
    marginTop: spacing.sm,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: spacing.sm,
    gap: 8,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  dividerText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#69F0AE',
    letterSpacing: 0.5,
  },
  roleBlockTitle: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.8)',
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  roleCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.2)',
    borderRadius: radius.md,
    padding: spacing.sm + 2,
    marginBottom: spacing.sm,
  },
  roleCardActive: {
    backgroundColor: 'rgba(255,255,255,0.22)',
    borderColor: '#69F0AE',
  },
  roleCardIconBox: {
    width: 38,
    height: 38,
    borderRadius: 19,
    justifyContent: 'center',
    alignItems: 'center',
  },
  roleHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  roleNameText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  detectedBadge: {
    backgroundColor: 'rgba(105, 240, 174, 0.25)',
    borderWidth: 1,
    borderColor: '#69F0AE',
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 4,
  },
  detectedBadgeText: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#69F0AE',
  },
  roleDescText: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.65)',
    marginTop: 2,
    lineHeight: 15,
  },
  accountHint: {
    fontSize: 10,
    fontWeight: '600',
    color: '#81C784',
    marginTop: 2,
  },
  radioCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 6,
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#69F0AE',
  },
  proceedBtn: {
    backgroundColor: '#2E7D32',
    paddingVertical: 14,
    borderRadius: radius.sm,
    alignItems: 'center',
    marginTop: spacing.sm,
    marginBottom: spacing.sm,
    shadowColor: '#2E7D32',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 6,
  },
  proceedBtnText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
    marginTop: 4,
  },
  backBtnText: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.6)',
  },
  footerText: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.4)',
    marginTop: spacing.xl,
    letterSpacing: 0.4,
  },
});
