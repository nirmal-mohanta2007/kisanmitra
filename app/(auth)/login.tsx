import React, { useState, useEffect } from 'react';
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
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../src/theme/colors';
import { spacing } from '../../src/theme/spacing';
import { radius } from '../../src/theme/radius';
import { TopVoiceLanguageBar } from '../../src/components/TopVoiceLanguageBar';
import { checkUserRegistration, UserLookupResult } from '../../src/services/auth-lookup.service';

// Farming background image
const BG_IMAGE = 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=1200&auto=format&fit=crop&q=80';

export default function LoginScreen() {
  const router = useRouter();
  const [phone, setPhone] = useState('');
  const [isChecking, setIsChecking] = useState(false);
  const [lookupResult, setLookupResult] = useState<UserLookupResult | null>(null);

  // Auto-detect whether number is registered as soon as 10 digits are entered
  useEffect(() => {
    const cleaned = phone.replace(/\D/g, '').slice(-10);
    if (cleaned.length === 10) {
      let active = true;
      checkUserRegistration(cleaned).then((res) => {
        if (active) {
          setLookupResult(res);
        }
      });
      return () => {
        active = false;
      };
    } else {
      setLookupResult(null);
    }
  }, [phone]);

  const handleSendOtp = async () => {
    const cleaned = phone.replace(/\D/g, '').slice(-10);
    if (cleaned.length !== 10) {
      Alert.alert(
        'Invalid Mobile Number / अमान्य मोबाइल नंबर',
        'Please enter a valid 10-digit mobile number.'
      );
      return;
    }

    setIsChecking(true);
    try {
      const result = await checkUserRegistration(cleaned);

      if (result.isRegistered) {
        // Registered user -> Send OTP to verify and proceed
        Alert.alert(
          'OTP Sent / ओटीपी भेजा गया',
          `Registered account found (${result.name || 'Verified User'}).\n\nA verification code has been sent to +91 ${cleaned}.\n(Demo OTP: 1234)`,
          [
            {
              text: 'Verify & Proceed / आगे बढ़ें',
              onPress: () => {
                router.push({
                  pathname: '/(auth)/otp',
                  params: {
                    phone: cleaned,
                    name: result.name || '',
                    role: result.userType || 'farmer',
                  },
                });
              },
            },
          ],
          { cancelable: false }
        );
      } else {
        // First-time user (new registration) -> Directly ask them to create an account
        Alert.alert(
          'Account Not Found / खाता नहीं मिला',
          `Mobile number +91 ${cleaned} is not registered in the system.\n\nWould you like to register a new Kisan Mitra account now?`,
          [
            {
              text: 'Cancel / रद्द करें',
              style: 'cancel',
            },
            {
              text: 'Create New Account / नया खाता बनाएं',
              onPress: () => {
                router.push({
                  pathname: '/(auth)/register',
                  params: {
                    phone: cleaned,
                    isNew: 'true',
                  },
                });
              },
            },
          ],
          { cancelable: true }
        );
      }
    } catch (e) {
      console.warn('Registration lookup notice:', e);
      router.push({
        pathname: '/(auth)/otp',
        params: { phone: cleaned },
      });
    } finally {
      setIsChecking(false);
    }
  };

  return (
    <ImageBackground
      source={{ uri: BG_IMAGE }}
      style={styles.bg}
      resizeMode="cover"
    >
      {/* Dark gradient overlay */}
      <View style={styles.overlay} />

      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        <View style={styles.screen}>
          {/* Top Voice Assistance & Language Switcher Bar */}
          <TopVoiceLanguageBar
            variant="transparent"
            title="Login"
            voiceText="किसान मित्र लॉगिन पृष्ठ। यदि आप पहले से पंजीकृत हैं तो ओटीपी सत्यापन होगा, नए किसान सीधे पंजीकरण पृष्ठ पर जा सकते हैं।"
          />
          {/* Top branding */}
          <View style={styles.brandRow}>
            <Image
              source={require('../../assets/logo.png')}
              style={styles.brandLogo}
              resizeMode="contain"
            />
            <Text style={styles.brandTitle}>Kisan Mitra</Text>
            <Text style={styles.brandSub}>PM-Kisan · e-Uparjan · MSP Portal</Text>
          </View>

          {/* Glassmorphism login card */}
          <View style={styles.glassCard}>
            <Text style={styles.title}>Secure Login</Text>
            <Text style={styles.subtitle}>
              Enter your 10-digit mobile number. Registered users receive an OTP; new farmers proceed directly to registration.
            </Text>

            {/* Mobile number input */}
            <Text style={styles.inputLabel}>Mobile Number / मोबाइल नंबर *</Text>
            <View style={styles.inputWrapper}>
              <Text style={styles.countryCode}>+91</Text>
              <TextInput
                style={styles.input}
                placeholder="10-digit mobile number"
                placeholderTextColor="rgba(255,255,255,0.45)"
                keyboardType="phone-pad"
                maxLength={10}
                value={phone}
                onChangeText={setPhone}
              />
              {phone.replace(/\D/g, '').length === 10 && (
                <Ionicons
                  name={lookupResult?.isRegistered ? 'checkmark-circle' : 'person-add'}
                  size={18}
                  color={lookupResult?.isRegistered ? '#69F0AE' : '#FFD54F'}
                />
              )}
            </View>

            {/* If registered farmer found */}
            {phone.replace(/\D/g, '').length === 10 && lookupResult && lookupResult.isRegistered && (
              <View style={[styles.statusPill, styles.statusPillRegistered]}>
                <Ionicons name="checkmark-circle" size={16} color="#69F0AE" />
                <Text style={[styles.statusPillText, { color: '#E8F5E9' }]} numberOfLines={2}>
                  Registered Farmer: {lookupResult.name || 'Verified User'} · OTP Verification
                </Text>
              </View>
            )}

            {/* If first-time user: Directly ask to create an account */}
            {phone.replace(/\D/g, '').length === 10 && lookupResult && !lookupResult.isRegistered && (
              <View style={styles.firstTimePromptCard}>
                <View style={styles.firstTimeHeader}>
                  <Ionicons name="person-add" size={18} color="#FBBF24" />
                  <Text style={styles.firstTimeTitle}>New Registration / नया किसान पंजीकरण</Text>
                </View>
                <Text style={styles.firstTimeSub}>
                  No account exists for +91 {phone.replace(/\D/g, '').slice(-10)}. Create a new account to access mandi procurement and DBT services.
                </Text>
                <TouchableOpacity
                  style={styles.firstTimeDirectBtn}
                  onPress={() => {
                    const cleaned = phone.replace(/\D/g, '').slice(-10);
                    router.push({
                      pathname: '/(auth)/register',
                      params: { phone: cleaned, isNew: 'true' },
                    });
                  }}
                  activeOpacity={0.85}
                >
                  <Text style={styles.firstTimeDirectBtnText}>
                    ✨ Create New Account / नया खाता बनाएं →
                  </Text>
                </TouchableOpacity>
              </View>
            )}

            {/* Action button */}
            <TouchableOpacity
              style={[
                styles.loginBtn,
                lookupResult && !lookupResult.isRegistered && styles.registerPrimaryBtn,
                isChecking && { opacity: 0.8 },
              ]}
              onPress={handleSendOtp}
              disabled={isChecking}
              activeOpacity={0.85}
            >
              {isChecking ? (
                <ActivityIndicator size="small" color="#FFFFFF" style={{ marginRight: 8 }} />
              ) : (
                <Ionicons
                  name={
                    lookupResult
                      ? lookupResult.isRegistered
                        ? 'key-outline'
                        : 'person-add-outline'
                      : 'arrow-forward-outline'
                  }
                  size={18}
                  color="#FFFFFF"
                  style={{ marginRight: 8 }}
                />
              )}
              <Text style={styles.loginBtnText}>
                {isChecking
                  ? 'Checking / जाँच रहे हैं...'
                  : lookupResult
                  ? lookupResult.isRegistered
                    ? 'Get OTP & Verify / ओटीपी प्राप्त करें'
                    : 'Create New Account / नया खाता बनाएं'
                  : 'Continue / आगे बढ़ें'}
              </Text>
            </TouchableOpacity>

            {/* Divider */}
            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>or</Text>
              <View style={styles.dividerLine} />
            </View>

            {/* New Farmer Registration link */}
            <TouchableOpacity
              style={styles.registerBtn}
              onPress={() => router.push('/(auth)/register')}
              activeOpacity={0.85}
            >
              <Ionicons name="person-add-outline" size={16} color={colors.primary} style={{ marginRight: 6 }} />
              <Text style={styles.registerBtnText}>New Farmer Registration</Text>
            </TouchableOpacity>

            {/* Back */}
            <TouchableOpacity
              style={styles.backBtn}
              onPress={() => router.replace('/(auth)/welcome')}
            >
              <Ionicons name="arrow-back" size={14} color="rgba(255,255,255,0.6)" style={{ marginRight: 4 }} />
              <Text style={styles.backBtnText}>Back to Welcome</Text>
            </TouchableOpacity>
          </View>

          {/* Bottom tag */}
          <Text style={styles.footerText}>Powered by Digital India Initiative</Text>
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
    backgroundColor: 'rgba(0,0,0,0.52)',
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
    marginBottom: spacing.xl,
  },
  brandLogo: {
    width: 64,
    height: 64,
    borderRadius: 16,
    marginBottom: 8,
  },
  brandTitle: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#FFFFFF',
    letterSpacing: 1,
    textShadowColor: 'rgba(0,0,0,0.6)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 6,
  },
  brandSub: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.7)',
    marginTop: 4,
    letterSpacing: 0.5,
  },
  glassCard: {
    width: '100%',
    maxWidth: 420,
    backgroundColor: Platform.OS === 'web' ? 'rgba(255,255,255,0.13)' : 'rgba(255,255,255,0.15)',
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.22)',
    padding: spacing.xl,
    ...(Platform.OS === 'web'
      ? ({ backdropFilter: 'blur(18px)' } as any)
      : {}),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 20,
    elevation: 12,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.65)',
    lineHeight: 19,
    marginBottom: spacing.lg,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.8)',
    marginBottom: 6,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.25)',
    borderRadius: radius.sm,
    paddingHorizontal: 14,
    marginBottom: spacing.md,
    height: 48,
  },
  countryCode: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginRight: 10,
    paddingRight: 10,
    borderRightWidth: 1,
    borderRightColor: 'rgba(255,255,255,0.25)',
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#FFFFFF',
  },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderRadius: radius.sm,
    paddingVertical: 9,
    paddingHorizontal: 12,
    marginBottom: spacing.md,
    borderWidth: 1,
  },
  statusPillRegistered: {
    backgroundColor: 'rgba(21, 128, 61, 0.35)',
    borderColor: '#86EFAC',
  },
  statusPillNew: {
    backgroundColor: 'rgba(217, 119, 6, 0.35)',
    borderColor: '#FDE68A',
  },
  statusPillText: {
    fontSize: 12.5,
    fontWeight: '600',
    flex: 1,
    lineHeight: 17,
  },
  firstTimePromptCard: {
    backgroundColor: 'rgba(217, 119, 6, 0.25)',
    borderWidth: 1,
    borderColor: '#FBBF24',
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  firstTimeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  firstTimeTitle: {
    fontSize: 13.5,
    fontWeight: 'bold',
    color: '#FDE68A',
  },
  firstTimeSub: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.85)',
    lineHeight: 16,
    marginBottom: 10,
  },
  firstTimeDirectBtn: {
    backgroundColor: '#059669',
    borderRadius: radius.sm,
    paddingVertical: 10,
    paddingHorizontal: 12,
    alignItems: 'center',
  },
  firstTimeDirectBtnText: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  registerPrimaryBtn: {
    backgroundColor: '#059669',
    shadowColor: '#059669',
  },
  loginBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    borderRadius: radius.sm,
    paddingVertical: 14,
    marginBottom: spacing.sm,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 6,
  },
  loginBtnText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#FFFFFF',
    letterSpacing: 0.5,
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
    color: 'rgba(255,255,255,0.45)',
  },
  registerBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.92)',
    borderRadius: radius.sm,
    paddingVertical: 12,
    marginBottom: spacing.md,
  },
  registerBtnText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.primary,
  },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
  },
  backBtnText: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.55)',
  },
  footerText: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.4)',
    marginTop: spacing.xl,
    letterSpacing: 0.4,
  },
});