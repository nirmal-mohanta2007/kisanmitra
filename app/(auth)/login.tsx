/**
 * app/(auth)/login.tsx
 *
 * Unified Kisan Mitra Login Page
 * Handles Farmer, Procurement Operator, and Government Admin login
 * in a single professional screen.
 *
 * Auth flow:
 *   1. User selects role card (Farmer / Operator / Admin)
 *   2. Enters email + password
 *   3. signIn() calls authService.signInWithRole()
 *      a. Firebase mode:  email auth → Firestore users/{uid} role check
 *      b. Demo mode:      mock credential check (no network needed)
 *   4. On success → navigate to the correct dashboard
 *   5. On role mismatch → "Access Denied" error (no navigation)
 */

import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Platform,
  ScrollView,
  ActivityIndicator,
  Animated,
  Easing,
  ImageBackground,
  Image,
  StatusBar,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../src/theme/colors';
import { spacing } from '../../src/theme/spacing';
import { radius } from '../../src/theme/radius';
import { useAuthContext } from '../../src/context/AuthContext';
import { isFirebaseConfigured } from '../../src/services/firebase/firebase.config';
import { DEMO_CREDENTIALS, type AuthRole, AuthError } from '../../src/services/authService';
import { UserRole } from '../../src/types/enums';

// ─── Background image (same as existing auth screens) ───────────────────────
const BG_IMAGE =
  'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=1200&auto=format&fit=crop&q=80';

// ─── Role definitions ────────────────────────────────────────────────────────
interface RoleDef {
  key: AuthRole;
  icon: string;
  label: string;
  labelHi: string;
  description: string;
  accentColor: string;
  bgColor: string;
  borderColor: string;
}

const ROLES: RoleDef[] = [
  {
    key: 'farmer',
    icon: 'leaf',
    label: 'Farmer',
    labelHi: '🌾 Farmer',
    description: 'Book procurement visits, track queue, procurement and payment.',
    accentColor: '#2E7D32',
    bgColor: 'rgba(46,125,50,0.15)',
    borderColor: 'rgba(76,175,80,0.5)',
  },
  {
    key: 'operator',
    icon: 'briefcase',
    label: 'Procurement Operator',
    labelHi: '🏢 Operator',
    description: 'Manage farmer verification, gate queue, weighing and procurement.',
    accentColor: '#1565C0',
    bgColor: 'rgba(21,101,192,0.15)',
    borderColor: 'rgba(33,150,243,0.5)',
  },
  {
    key: 'admin',
    icon: 'business',
    label: 'Government Admin',
    labelHi: '🏛 Admin',
    description: 'Monitor procurement operations, centres, payments and statewide performance.',
    accentColor: '#6A1B9A',
    bgColor: 'rgba(106,27,154,0.15)',
    borderColor: 'rgba(156,39,176,0.5)',
  },
];

// ─── Main component ──────────────────────────────────────────────────────────
export default function UnifiedLoginScreen() {
  const router = useRouter();
  const { signIn, isAuthenticated, role: currentRole } = useAuthContext();

  const [selectedRole, setSelectedRole] = useState<AuthRole>('farmer');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const isDemoMode = !isFirebaseConfigured();

  // Entrance animations
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const shakeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        damping: 20,
        stiffness: 150,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  // If already authenticated, redirect to dashboard
  useEffect(() => {
    if (!isAuthenticated || !currentRole) return;
    switch (currentRole) {
      case UserRole.FARMER:
        router.replace('/(farmer)/(tabs)');
        break;
      case UserRole.OPERATOR:
        router.replace('/(operator)');
        break;
      case UserRole.ADMIN:
        router.replace('/(admin)');
        break;
    }
  }, [isAuthenticated, currentRole, router]);

  const selectedRoleDef = ROLES.find((r) => r.key === selectedRole)!;

  // Auto-fill demo credentials when switching role in demo mode
  const handleRoleSelect = (roleKey: AuthRole) => {
    setSelectedRole(roleKey);
    setError('');
    if (isDemoMode) {
      setEmail(DEMO_CREDENTIALS[roleKey].email);
      setPassword(DEMO_CREDENTIALS[roleKey].password);
    }
  };

  const shakeCard = () => {
    Animated.sequence([
      Animated.timing(shakeAnim, { toValue: 10, duration: 55, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -10, duration: 55, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 8, duration: 55, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -8, duration: 55, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 0, duration: 55, useNativeDriver: true }),
    ]).start();
  };

  const handleLogin = async () => {
    setError('');

    if (!email.trim()) {
      setError('Please enter your email address.');
      shakeCard();
      return;
    }
    if (!password) {
      setError('Please enter your password.');
      shakeCard();
      return;
    }

    setIsLoading(true);
    try {
      const profile = await signIn(email.trim(), password, selectedRole);

      // Navigate to the correct dashboard
      switch (profile.role) {
        case UserRole.FARMER:
          router.replace('/(farmer)/(tabs)');
          break;
        case UserRole.OPERATOR:
          router.replace('/(operator)');
          break;
        case UserRole.ADMIN:
          router.replace('/(admin)');
          break;
        default:
          router.replace('/(auth)/login');
      }
    } catch (err: any) {
      const message = err instanceof AuthError ? err.message : 'Login failed. Please try again.';
      setError(message);
      shakeCard();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ImageBackground source={{ uri: BG_IMAGE }} style={styles.bg} resizeMode="cover">
      <StatusBar barStyle="light-content" />
      {/* Dark overlay */}
      <View style={styles.overlay} />

      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Animated.View
          style={[
            styles.outerContainer,
            { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
          ]}
        >
          {/* ── Government strip ── */}
          <View style={styles.govStrip}>
            <Text style={styles.govStripText}>
              🇮🇳  Government of India · Department of Consumer Affairs
            </Text>
          </View>

          {/* ── Logo & Branding ── */}
          <View style={styles.brandSection}>
            <Image
              source={require('../../assets/logo.png')}
              style={styles.logoImg}
              resizeMode="contain"
            />
            <Text style={styles.appName}>Kisan Mitra</Text>
            <Text style={styles.appTagline}>
              Smart Procurement &amp; Farmer Assistance Platform
            </Text>
            <Text style={styles.schemeLine}>PM-Kisan · e-Uparjan · MSP Direct Benefit Transfer</Text>
          </View>

          {/* ── Glassmorphism Login Card ── */}
          <Animated.View
            style={[styles.card, { transform: [{ translateX: shakeAnim }] }]}
          >
            {/* Demo mode banner */}
            {isDemoMode && (
              <View style={styles.demoBanner}>
                <Ionicons name="flask" size={13} color="#F57F17" />
                <Text style={styles.demoBannerText}>
                  Demo Mode — Credentials auto-filled. No Firebase required.
                </Text>
              </View>
            )}

            {/* ── Role selector ── */}
            <Text style={styles.sectionLabel}>SELECT LOGIN TYPE</Text>
            <View style={styles.roleRow}>
              {ROLES.map((rd) => {
                const active = selectedRole === rd.key;
                return (
                  <TouchableOpacity
                    key={rd.key}
                    style={[
                      styles.roleCard,
                      { borderColor: active ? rd.accentColor : 'rgba(255,255,255,0.2)' },
                      active && { backgroundColor: rd.bgColor },
                    ]}
                    onPress={() => handleRoleSelect(rd.key)}
                    activeOpacity={0.8}
                  >
                    <View
                      style={[
                        styles.roleIconCircle,
                        { backgroundColor: active ? rd.accentColor : 'rgba(255,255,255,0.12)' },
                      ]}
                    >
                      <Ionicons
                        name={rd.icon as any}
                        size={18}
                        color={active ? '#FFFFFF' : 'rgba(255,255,255,0.65)'}
                      />
                    </View>
                    <Text
                      style={[
                        styles.roleCardLabel,
                        active && { color: '#FFFFFF', fontWeight: '800' },
                      ]}
                      numberOfLines={2}
                    >
                      {rd.label}
                    </Text>
                    <Text style={styles.roleCardLabelHi}>{rd.labelHi}</Text>
                    {active && (
                      <View style={[styles.roleActiveBar, { backgroundColor: rd.accentColor }]} />
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Role description */}
            <View
              style={[
                styles.roleDescBox,
                { borderLeftColor: selectedRoleDef.accentColor },
              ]}
            >
              <Text style={styles.roleDescText}>{selectedRoleDef.description}</Text>
            </View>

            {/* ── Fields ── */}
            <View style={styles.fieldsSection}>
              {/* Email */}
              <Text style={styles.fieldLabel}>
                {selectedRole === 'farmer'
                  ? 'Mobile / Email'
                  : selectedRole === 'operator'
                  ? 'Operator Email / ID'
                  : 'Admin Email / Government ID'}
              </Text>
              <View style={styles.inputWrapper}>
                <Ionicons
                  name={selectedRole === 'farmer' ? 'phone-portrait-outline' : 'mail-outline'}
                  size={16}
                  color="rgba(255,255,255,0.6)"
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  placeholder={
                    selectedRole === 'farmer'
                      ? 'Email or mobile number'
                      : selectedRole === 'operator'
                      ? 'operator@kisanmitra.gov.in'
                      : 'admin@kisanmitra.gov.in'
                  }
                  placeholderTextColor="rgba(255,255,255,0.38)"
                  value={email}
                  onChangeText={(t) => { setEmail(t); setError(''); }}
                  keyboardType={selectedRole === 'farmer' ? 'email-address' : 'email-address'}
                  autoCapitalize="none"
                  autoCorrect={false}
                  returnKeyType="next"
                />
              </View>

              {/* Password */}
              <Text style={[styles.fieldLabel, { marginTop: spacing.md }]}>Password</Text>
              <View style={styles.inputWrapper}>
                <Ionicons
                  name="lock-closed-outline"
                  size={16}
                  color="rgba(255,255,255,0.6)"
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Enter your password"
                  placeholderTextColor="rgba(255,255,255,0.38)"
                  secureTextEntry={!showPassword}
                  value={password}
                  onChangeText={(t) => { setPassword(t); setError(''); }}
                  returnKeyType="done"
                  onSubmitEditing={handleLogin}
                />
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                  style={styles.eyeBtn}
                  activeOpacity={0.7}
                >
                  <Ionicons
                    name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                    size={18}
                    color="rgba(255,255,255,0.55)"
                  />
                </TouchableOpacity>
              </View>

              {/* Forgot password */}
              <TouchableOpacity style={styles.forgotBtn} activeOpacity={0.7}>
                <Text style={styles.forgotText}>Forgot password? Contact administrator</Text>
              </TouchableOpacity>
            </View>

            {/* ── Error box ── */}
            {!!error && (
              <View style={styles.errorBox}>
                <Ionicons name="alert-circle" size={16} color="#EF9A9A" />
                <Text style={styles.errorText}>{error}</Text>
              </View>
            )}

            {/* ── Login button ── */}
            <TouchableOpacity
              style={[
                styles.loginBtn,
                { backgroundColor: selectedRoleDef.accentColor },
                isLoading && { opacity: 0.75 },
              ]}
              onPress={handleLogin}
              disabled={isLoading}
              activeOpacity={0.88}
            >
              {isLoading ? (
                <>
                  <ActivityIndicator size="small" color="#FFFFFF" style={{ marginRight: 8 }} />
                  <Text style={styles.loginBtnText}>Signing you in…</Text>
                </>
              ) : (
                <>
                  <Ionicons name="log-in-outline" size={20} color="#FFFFFF" style={{ marginRight: 8 }} />
                  <Text style={styles.loginBtnText}>
                    {selectedRole === 'farmer'
                      ? 'Sign In as Farmer'
                      : selectedRole === 'operator'
                      ? 'Sign In as Operator'
                      : 'Sign In as Admin'}
                  </Text>
                </>
              )}
            </TouchableOpacity>

            {/* ── Demo credentials hint ── */}
            {isDemoMode && (
              <View style={styles.demoHint}>
                <Text style={styles.demoHintLabel}>Demo credentials (auto-filled):</Text>
                <Text style={styles.demoHintValue}>
                  {DEMO_CREDENTIALS[selectedRole].email} / {DEMO_CREDENTIALS[selectedRole].password}
                </Text>
              </View>
            )}

            {/* ── Farmer-only extras ── */}
            {selectedRole === 'farmer' && (
              <>
                <View style={styles.divider}>
                  <View style={styles.dividerLine} />
                  <Text style={styles.dividerText}>or</Text>
                  <View style={styles.dividerLine} />
                </View>
                <TouchableOpacity
                  style={styles.secondaryBtn}
                  onPress={() => router.push('/(auth)/register')}
                  activeOpacity={0.85}
                >
                  <Ionicons name="person-add-outline" size={16} color={colors.primary} style={{ marginRight: 6 }} />
                  <Text style={styles.secondaryBtnText}>New Farmer Registration</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.otpBtn}
                  onPress={() => router.push('/(auth)/login-otp')}
                  activeOpacity={0.85}
                >
                  <Ionicons name="phone-portrait-outline" size={15} color="rgba(255,255,255,0.7)" style={{ marginRight: 5 }} />
                  <Text style={styles.otpBtnText}>Login with Mobile OTP instead</Text>
                </TouchableOpacity>
              </>
            )}

            {/* ── Operator / Admin help ── */}
            {(selectedRole === 'operator' || selectedRole === 'admin') && (
              <Text style={styles.contactHint}>
                Don't have an account? Contact your{' '}
                {selectedRole === 'operator' ? 'Centre Manager' : 'District Nodal Officer'}.
              </Text>
            )}
          </Animated.View>

          {/* ── Footer navigation ── */}
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => router.replace('/(auth)/welcome')}
            activeOpacity={0.7}
          >
            <Ionicons name="arrow-back" size={14} color="rgba(255,255,255,0.5)" style={{ marginRight: 4 }} />
            <Text style={styles.backBtnText}>Back to Welcome</Text>
          </TouchableOpacity>

          <Text style={styles.footerText}>
            Powered by Digital India Initiative · Secure Login
          </Text>
        </Animated.View>
      </ScrollView>
    </ImageBackground>
  );
}

// ─── Styles ──────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  bg: {
    flex: 1,
  },
  overlay: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.60)',
  },
  scroll: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingVertical: spacing.xxl,
    paddingHorizontal: spacing.lg,
  },
  outerContainer: {
    alignItems: 'center',
    width: '100%',
  },

  // ── Government strip ──
  govStrip: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: radius.sm,
    paddingHorizontal: 12,
    paddingVertical: 5,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.18)',
  },
  govStripText: {
    fontSize: 10.5,
    color: 'rgba(255,255,255,0.7)',
    letterSpacing: 0.3,
    textAlign: 'center',
  },

  // ── Branding ──
  brandSection: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  logoImg: {
    width: 68,
    height: 68,
    borderRadius: 16,
    marginBottom: spacing.sm,
  },
  appName: {
    fontSize: 34,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 0.5,
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
  },
  appTagline: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.75)',
    marginTop: 4,
    textAlign: 'center',
    letterSpacing: 0.2,
  },
  schemeLine: {
    fontSize: 10.5,
    color: 'rgba(255,255,255,0.4)',
    marginTop: 3,
    letterSpacing: 0.3,
  },

  // ── Card ──
  card: {
    width: '100%',
    maxWidth: 480,
    backgroundColor:
      Platform.OS === 'web'
        ? 'rgba(10,20,40,0.82)'
        : 'rgba(10,20,40,0.90)',
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    padding: spacing.xl,
    ...(Platform.OS === 'web'
      ? ({ backdropFilter: 'blur(24px)' } as any)
      : {}),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.4,
    shadowRadius: 24,
    elevation: 16,
    marginBottom: spacing.lg,
  },

  // Demo banner
  demoBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(245,127,23,0.18)',
    borderWidth: 1,
    borderColor: 'rgba(245,127,23,0.4)',
    borderRadius: radius.sm,
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginBottom: spacing.lg,
  },
  demoBannerText: {
    fontSize: 11.5,
    color: '#FFCC80',
    flex: 1,
    fontWeight: '600',
  },

  // ── Role selector ──
  sectionLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: 'rgba(255,255,255,0.5)',
    letterSpacing: 1.2,
    marginBottom: spacing.md,
  },
  roleRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  roleCard: {
    flex: 1,
    alignItems: 'center',
    borderRadius: radius.md,
    borderWidth: 1.5,
    paddingVertical: spacing.md,
    paddingHorizontal: 6,
    position: 'relative',
    overflow: 'hidden',
  },
  roleIconCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  roleCardLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.65)',
    textAlign: 'center',
    lineHeight: 14,
  },
  roleCardLabelHi: {
    fontSize: 10,
    color: 'rgba(255,255,255,0.35)',
    marginTop: 2,
    textAlign: 'center',
  },
  roleActiveBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 3,
    borderBottomLeftRadius: radius.md,
    borderBottomRightRadius: radius.md,
  },

  // Role description
  roleDescBox: {
    borderLeftWidth: 3,
    paddingLeft: 10,
    marginBottom: spacing.lg,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 4,
    paddingVertical: 8,
    paddingRight: 8,
  },
  roleDescText: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.6)',
    lineHeight: 17,
  },

  // ── Fields ──
  fieldsSection: {
    marginBottom: spacing.md,
  },
  fieldLabel: {
    fontSize: 11.5,
    fontWeight: '700',
    color: 'rgba(255,255,255,0.65)',
    marginBottom: 6,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.09)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.18)',
    borderRadius: radius.md,
    paddingHorizontal: 12,
    height: 50,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 14.5,
    color: '#FFFFFF',
    fontWeight: '500',
  },
  eyeBtn: {
    padding: 4,
  },
  forgotBtn: {
    alignSelf: 'flex-end',
    marginTop: 8,
  },
  forgotText: {
    fontSize: 11.5,
    color: 'rgba(255,255,255,0.45)',
  },

  // ── Error ──
  errorBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    backgroundColor: 'rgba(198,40,40,0.25)',
    borderWidth: 1,
    borderColor: 'rgba(198,40,40,0.5)',
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  errorText: {
    flex: 1,
    fontSize: 12.5,
    color: '#EF9A9A',
    lineHeight: 18,
    fontWeight: '500',
  },

  // ── Login button ──
  loginBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.md,
    paddingVertical: 16,
    marginBottom: spacing.md,
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.45,
    shadowRadius: 12,
    elevation: 8,
  },
  loginBtnText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.3,
  },

  // Demo hint
  demoHint: {
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: radius.sm,
    padding: spacing.sm,
    marginBottom: spacing.sm,
    alignItems: 'center',
  },
  demoHintLabel: {
    fontSize: 10.5,
    color: 'rgba(255,255,255,0.38)',
    marginBottom: 2,
  },
  demoHintValue: {
    fontSize: 11.5,
    color: 'rgba(255,204,128,0.85)',
    fontWeight: '600',
    fontFamily: Platform.OS === 'ios' ? 'Courier New' : 'monospace',
  },

  // ── Divider ──
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginVertical: spacing.sm,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.12)',
  },
  dividerText: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.35)',
  },

  // Farmer extras
  secondaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: radius.md,
    paddingVertical: 13,
    marginBottom: spacing.sm,
  },
  secondaryBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.primary,
  },
  otpBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
  },
  otpBtnText: {
    fontSize: 12.5,
    color: 'rgba(255,255,255,0.55)',
  },

  // Operator/Admin contact hint
  contactHint: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.4)',
    textAlign: 'center',
    lineHeight: 17,
    marginTop: spacing.xs,
  },

  // ── Footer ──
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    marginBottom: 6,
  },
  backBtnText: {
    fontSize: 12.5,
    color: 'rgba(255,255,255,0.45)',
  },
  footerText: {
    fontSize: 10.5,
    color: 'rgba(255,255,255,0.22)',
    letterSpacing: 0.4,
    textAlign: 'center',
  },
});
