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
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../src/theme/colors';
import { spacing } from '../../src/theme/spacing';
import { radius } from '../../src/theme/radius';
import { TopVoiceLanguageBar } from '../../src/components/TopVoiceLanguageBar';
import { checkUserRegistration, UserLookupResult } from '../../src/services/auth-lookup.service';
import { useAppContext } from '../../src/store/app-context';
import { UserRole } from '../../src/types/enums';

// Farming background image
const BG_IMAGE = 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=1200&auto=format&fit=crop&q=80';

export default function LoginScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ role?: string }>();
  const { dispatch } = useAppContext();

  // Mode: Farmer (Mobile) vs Admin (Email + Password)
  const [authMode, setAuthMode] = useState<'farmer' | 'admin'>(params.role === 'admin' ? 'admin' : 'farmer');
  
  // Farmer login state
  const [phone, setPhone] = useState('');
  const [isChecking, setIsChecking] = useState(false);
  const [lookupResult, setLookupResult] = useState<UserLookupResult | null>(null);

  // Admin auth state
  const [adminTab, setAdminTab] = useState<'login' | 'register'>('login');
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [adminConfirmPassword, setAdminConfirmPassword] = useState('');
  const [adminName, setAdminName] = useState('');
  const [adminDistrict, setAdminDistrict] = useState('Statewide (All MP)');
  const [showPassword, setShowPassword] = useState(false);
  const [adminError, setAdminError] = useState('');

  const adminDistricts = [
    'Statewide (All MP)',
    'Bhopal',
    'Indore',
    'Jabalpur',
    'Sehore',
    'Dewas',
    'Harda',
    'Chhindwara',
  ];

  const handleAdminEmailLogin = () => {
    if (!adminEmail.trim()) {
      setAdminError('Please enter your official Government Email ID / कृपया ईमेल दर्ज करें');
      return;
    }
    if (!adminPassword.trim()) {
      setAdminError('Please enter your password / कृपया पासवर्ड दर्ज करें');
      return;
    }

    setAdminError('');
    setIsChecking(true);

    setTimeout(() => {
      setIsChecking(false);
      const isIndore = adminEmail.toLowerCase().includes('indore');
      const isBhopal = adminEmail.toLowerCase().includes('bhopal');
      const determinedName = isIndore
        ? 'Collector Sharma (Indore)'
        : isBhopal
        ? 'Collector Verma (Bhopal)'
        : 'Collector Shukla (State Admin)';

      dispatch({
        type: 'SET_ROLE',
        payload: {
          role: UserRole.ADMIN,
          userId: 'ADM-001',
          userName: determinedName,
        },
      });

      router.replace('/(admin)');
    }, 600);
  };

  const handleAdminRegister = () => {
    if (!adminName.trim()) {
      setAdminError('Please enter Admin Full Name / प्रशासक का नाम दर्ज करें');
      return;
    }
    if (!adminEmail.trim() || !adminEmail.includes('@')) {
      setAdminError('Please enter a valid Government Email ID / मान्य ईमेल दर्ज करें');
      return;
    }
    if (adminPassword.length < 4) {
      setAdminError('Password must be at least 4 characters / पासवर्ड कम से कम 4 अक्षरों का होना चाहिए');
      return;
    }
    if (adminPassword !== adminConfirmPassword) {
      setAdminError('Passwords do not match / पासवर्ड मेल नहीं खाते');
      return;
    }

    setAdminError('');
    setIsChecking(true);

    setTimeout(() => {
      setIsChecking(false);
      Alert.alert(
        'Registration Successful! / पंजीकरण सफल',
        `Welcome ${adminName} (${adminDistrict}). Official Admin credentials registered.`
      );

      dispatch({
        type: 'SET_ROLE',
        payload: {
          role: UserRole.ADMIN,
          userId: `ADM-${Date.now().toString().slice(-4)}`,
          userName: `${adminName} (${adminDistrict === 'Statewide (All MP)' ? 'State Admin' : adminDistrict})`,
        },
      });

      router.replace('/(admin)');
    }, 600);
  };

  const handleAdminDirectLogin = () => {
    dispatch({
      type: 'SET_ROLE',
      payload: {
        role: UserRole.ADMIN,
        userId: 'ADM-001',
        userName: 'Collector Shukla (State Admin)',
      },
    });
    router.replace('/(admin)');
  };

  const handleOfficerDirectLogin = () => {
    dispatch({
      type: 'SET_ROLE',
      payload: {
        role: UserRole.OPERATOR,
        userId: 'O-001',
        userName: 'Dr Nirmal Kumar Mohanta',
      },
    });
    router.replace('/(operator)');
  };

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
        router.push({
          pathname: '/(auth)/otp',
          params: {
            phone: cleaned,
            name: result.name || '',
            role: result.userType || 'farmer',
          },
        });
        return;
      } else {
        router.push({
          pathname: '/(auth)/register',
          params: {
            phone: cleaned,
            isNew: 'true',
          },
        });
        return;
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
            voiceText={
              authMode === 'admin'
                ? "राज्य व ज़िला प्रशासक पोर्टल। कृपया अपनी अधिकृत ईमेल आईडी और पासवर्ड से लॉगिन या नया पंजीकरण करें।"
                : "किसान मित्र लॉगिन पृष्ठ। यदि आप पहले से पंजीकृत हैं तो ओटीपी सत्यापन होगा, नए किसान सीधे पंजीकरण पृष्ठ पर जा सकते हैं।"
            }
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

          {/* Main Auth Card */}
          <View style={styles.glassCard}>
            {/* Mode Switcher Tabs: Farmer vs Admin */}
            <View style={styles.modeSwitcherContainer}>
              <TouchableOpacity
                style={[styles.modeTab, authMode === 'farmer' && styles.modeTabActiveFarmer]}
                onPress={() => { setAuthMode('farmer'); setAdminError(''); }}
                activeOpacity={0.85}
              >
                <Ionicons
                  name="leaf"
                  size={16}
                  color={authMode === 'farmer' ? '#FFFFFF' : 'rgba(255,255,255,0.7)'}
                  style={{ marginRight: 6 }}
                />
                <Text style={[styles.modeTabText, authMode === 'farmer' && styles.modeTabTextActive]}>
                  Farmer Login
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modeTab, authMode === 'admin' && styles.modeTabActiveAdmin]}
                onPress={() => { setAuthMode('admin'); setAdminError(''); }}
                activeOpacity={0.85}
              >
                <Ionicons
                  name="shield-checkmark"
                  size={16}
                  color={authMode === 'admin' ? '#FFFFFF' : 'rgba(255,255,255,0.7)'}
                  style={{ marginRight: 6 }}
                />
                <Text style={[styles.modeTabText, authMode === 'admin' && styles.modeTabTextActive]}>
                  Admin Portal
                </Text>
              </TouchableOpacity>
            </View>

            {/* ========================================================= */}
            {/* VIEW A: ADMIN LOGIN & REGISTER (EMAIL & PASSWORD) */}
            {/* ========================================================= */}
            {authMode === 'admin' ? (
              <View style={{ width: '100%' }}>
                {/* Admin Sub-tabs: Login vs Register */}
                <View style={styles.adminSubTabRow}>
                  <TouchableOpacity
                    style={[styles.adminSubTab, adminTab === 'login' && styles.adminSubTabActive]}
                    onPress={() => { setAdminTab('login'); setAdminError(''); }}
                    activeOpacity={0.8}
                  >
                    <Ionicons name="log-in-outline" size={15} color={adminTab === 'login' ? '#69F0AE' : 'rgba(255,255,255,0.7)'} style={{ marginRight: 5 }} />
                    <Text style={[styles.adminSubTabText, adminTab === 'login' && styles.adminSubTabTextActive]}>
                      Admin Sign In
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.adminSubTab, adminTab === 'register' && styles.adminSubTabActive]}
                    onPress={() => { setAdminTab('register'); setAdminError(''); }}
                    activeOpacity={0.8}
                  >
                    <Ionicons name="person-add-outline" size={15} color={adminTab === 'register' ? '#69F0AE' : 'rgba(255,255,255,0.7)'} style={{ marginRight: 5 }} />
                    <Text style={[styles.adminSubTabText, adminTab === 'register' && styles.adminSubTabTextActive]}>
                      Register Admin
                    </Text>
                  </TouchableOpacity>
                </View>

                {/* Subtitle description */}
                <Text style={styles.adminPortalBadge}>
                  🏛️ Government of India · DoCA State/District Command Center
                </Text>

                {/* Error Banner if any */}
                {adminError ? (
                  <View style={styles.adminErrorBanner}>
                    <Ionicons name="alert-circle" size={16} color="#FF5252" style={{ marginRight: 6 }} />
                    <Text style={styles.adminErrorText}>{adminError}</Text>
                  </View>
                ) : null}

                {/* --- 1. ADMIN SIGN IN FORM --- */}
                {adminTab === 'login' ? (
                  <View>
                    <Text style={styles.inputLabel}>Official Email ID / अधिकृत ईमेल *</Text>
                    <View style={styles.inputWrapper}>
                      <Ionicons name="mail-outline" size={18} color="rgba(255,255,255,0.7)" style={{ marginRight: 10 }} />
                      <TextInput
                        style={styles.input}
                        placeholder="e.g. collector.bhopal@mp.gov.in"
                        placeholderTextColor="rgba(255,255,255,0.45)"
                        keyboardType="email-address"
                        autoCapitalize="none"
                        value={adminEmail}
                        onChangeText={setAdminEmail}
                      />
                    </View>

                    <Text style={styles.inputLabel}>Password / पासवर्ड *</Text>
                    <View style={styles.inputWrapper}>
                      <Ionicons name="lock-closed-outline" size={18} color="rgba(255,255,255,0.7)" style={{ marginRight: 10 }} />
                      <TextInput
                        style={styles.input}
                        placeholder="Enter registered password"
                        placeholderTextColor="rgba(255,255,255,0.45)"
                        secureTextEntry={!showPassword}
                        value={adminPassword}
                        onChangeText={setAdminPassword}
                      />
                      <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={{ padding: 4 }}>
                        <Ionicons name={showPassword ? 'eye-off-outline' : 'eye-outline'} size={18} color="rgba(255,255,255,0.7)" />
                      </TouchableOpacity>
                    </View>

                    {/* Quick Demo Fill Buttons for Admin */}
                    <View style={styles.quickChipsContainer}>
                      <Text style={styles.quickChipsLabel}>⚡ Quick Demo Fill:</Text>
                      <View style={styles.quickChipsRow}>
                        <TouchableOpacity
                          style={styles.quickChip}
                          onPress={() => {
                            setAdminEmail('admin.state@mp.gov.in');
                            setAdminPassword('admin@2026');
                            setAdminError('');
                          }}
                        >
                          <Text style={styles.quickChipText}>🏛️ State Admin</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                          style={styles.quickChip}
                          onPress={() => {
                            setAdminEmail('collector.bhopal@mp.gov.in');
                            setAdminPassword('admin@2026');
                            setAdminError('');
                          }}
                        >
                          <Text style={styles.quickChipText}>📍 Collector Bhopal</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                          style={styles.quickChip}
                          onPress={() => {
                            setAdminEmail('collector.indore@mp.gov.in');
                            setAdminPassword('admin@2026');
                            setAdminError('');
                          }}
                        >
                          <Text style={styles.quickChipText}>📍 Collector Indore</Text>
                        </TouchableOpacity>
                      </View>
                    </View>

                    {/* Submit Login Button */}
                    <TouchableOpacity
                      style={[styles.adminSubmitBtn, isChecking && { opacity: 0.8 }]}
                      onPress={handleAdminEmailLogin}
                      disabled={isChecking}
                      activeOpacity={0.85}
                    >
                      {isChecking ? (
                        <ActivityIndicator size="small" color="#FFFFFF" style={{ marginRight: 8 }} />
                      ) : (
                        <Ionicons name="log-in" size={18} color="#FFFFFF" style={{ marginRight: 8 }} />
                      )}
                      <Text style={styles.adminSubmitBtnText}>
                        {isChecking ? 'Authenticating Admin...' : 'Login to Admin Dashboard →'}
                      </Text>
                    </TouchableOpacity>
                  </View>
                ) : (
                  /* --- 2. ADMIN REGISTRATION FORM --- */
                  <View>
                    <Text style={styles.inputLabel}>Official Full Name / प्रशासक का नाम *</Text>
                    <View style={styles.inputWrapper}>
                      <Ionicons name="person-outline" size={18} color="rgba(255,255,255,0.7)" style={{ marginRight: 10 }} />
                      <TextInput
                        style={styles.input}
                        placeholder="e.g. Collector Rajesh Shukla"
                        placeholderTextColor="rgba(255,255,255,0.45)"
                        value={adminName}
                        onChangeText={setAdminName}
                      />
                    </View>

                    <Text style={styles.inputLabel}>Government Email ID / सरकारी ईमेल *</Text>
                    <View style={styles.inputWrapper}>
                      <Ionicons name="mail-outline" size={18} color="rgba(255,255,255,0.7)" style={{ marginRight: 10 }} />
                      <TextInput
                        style={styles.input}
                        placeholder="e.g. collector.bhopal@mp.gov.in"
                        placeholderTextColor="rgba(255,255,255,0.45)"
                        keyboardType="email-address"
                        autoCapitalize="none"
                        value={adminEmail}
                        onChangeText={setAdminEmail}
                      />
                    </View>

                    <Text style={styles.inputLabel}>Administrative Jurisdiction / अधिकार क्षेत्र *</Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 12 }}>
                      {adminDistricts.map((d) => (
                        <TouchableOpacity
                          key={d}
                          style={[styles.adminDistChip, adminDistrict === d && styles.adminDistChipActive]}
                          onPress={() => setAdminDistrict(d)}
                        >
                          <Text style={[styles.adminDistChipText, adminDistrict === d && styles.adminDistChipTextActive]}>
                            {d}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </ScrollView>

                    <Text style={styles.inputLabel}>Set Password / पासवर्ड बनाएं *</Text>
                    <View style={styles.inputWrapper}>
                      <Ionicons name="lock-closed-outline" size={18} color="rgba(255,255,255,0.7)" style={{ marginRight: 10 }} />
                      <TextInput
                        style={styles.input}
                        placeholder="At least 4 characters"
                        placeholderTextColor="rgba(255,255,255,0.45)"
                        secureTextEntry={!showPassword}
                        value={adminPassword}
                        onChangeText={setAdminPassword}
                      />
                      <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={{ padding: 4 }}>
                        <Ionicons name={showPassword ? 'eye-off-outline' : 'eye-outline'} size={18} color="rgba(255,255,255,0.7)" />
                      </TouchableOpacity>
                    </View>

                    <Text style={styles.inputLabel}>Confirm Password / पासवर्ड की पुष्टि करें *</Text>
                    <View style={styles.inputWrapper}>
                      <Ionicons name="shield-checkmark-outline" size={18} color="rgba(255,255,255,0.7)" style={{ marginRight: 10 }} />
                      <TextInput
                        style={styles.input}
                        placeholder="Re-enter password"
                        placeholderTextColor="rgba(255,255,255,0.45)"
                        secureTextEntry={!showPassword}
                        value={adminConfirmPassword}
                        onChangeText={setAdminConfirmPassword}
                      />
                    </View>

                    {/* Submit Register Button */}
                    <TouchableOpacity
                      style={[styles.adminSubmitBtn, styles.adminRegisterBtn, isChecking && { opacity: 0.8 }]}
                      onPress={handleAdminRegister}
                      disabled={isChecking}
                      activeOpacity={0.85}
                    >
                      {isChecking ? (
                        <ActivityIndicator size="small" color="#FFFFFF" style={{ marginRight: 8 }} />
                      ) : (
                        <Ionicons name="checkmark-circle" size={18} color="#FFFFFF" style={{ marginRight: 8 }} />
                      )}
                      <Text style={styles.adminSubmitBtnText}>
                        {isChecking ? 'Registering Admin...' : 'Register Official Admin Account →'}
                      </Text>
                    </TouchableOpacity>
                  </View>
                )}

                {/* Quick direct bypass */}
                <TouchableOpacity
                  style={styles.directBypassBtn}
                  onPress={handleAdminDirectLogin}
                >
                  <Text style={styles.directBypassBtnText}>
                    ⚡ 1-Click Collector Shukla Direct Access →
                  </Text>
                </TouchableOpacity>
              </View>
            ) : (
              /* ========================================================= */
              /* VIEW B: FARMER MOBILE NUMBER & OTP LOGIN */
              /* ========================================================= */
              <View style={{ width: '100%' }}>
                <Text style={styles.title}>Secure Farmer Login</Text>
                <Text style={styles.subtitle}>
                  Enter your 10-digit mobile number. Registered farmers receive an OTP; new farmers proceed directly to registration.
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

                {/* Quick Demo Number Chips */}
                <View style={styles.quickChipsContainer}>
                  <Text style={styles.quickChipsLabel}>⚡ Quick Fill Demo:</Text>
                  <View style={styles.quickChipsRow}>
                    <TouchableOpacity
                      style={[styles.quickChip, phone === '9348856994' && styles.quickChipActive]}
                      onPress={() => setPhone('9348856994')}
                      activeOpacity={0.8}
                    >
                      <Ionicons name="construct" size={12} color={phone === '9348856994' ? '#69F0AE' : '#90CAF9'} />
                      <Text style={[styles.quickChipText, phone === '9348856994' && styles.quickChipTextActive]}>
                        🏢 Mandi Officer: 9348856994
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={[styles.quickChip, phone === '9876543210' && styles.quickChipActive]}
                      onPress={() => setPhone('9876543210')}
                      activeOpacity={0.8}
                    >
                      <Ionicons name="leaf" size={12} color={phone === '9876543210' ? '#69F0AE' : '#A5D6A7'} />
                      <Text style={[styles.quickChipText, phone === '9876543210' && styles.quickChipTextActive]}>
                        🌾 Farmer: 9876543210
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>

                {/* If registered farmer found */}
                {phone.replace(/\D/g, '').length === 10 && lookupResult && lookupResult.isRegistered && (
                  <View style={[styles.statusPill, styles.statusPillRegistered]}>
                    <Ionicons name="checkmark-circle" size={16} color="#69F0AE" />
                    <Text style={[styles.statusPillText, { color: '#E8F5E9' }]} numberOfLines={2}>
                      Registered {lookupResult.userType === 'admin' ? 'Admin' : lookupResult.userType === 'operator' ? 'Mandi Officer' : 'Farmer'}: {lookupResult.name || 'Verified User'} · OTP Verification
                    </Text>
                  </View>
                )}

                {/* If first-time user */}
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

                {/* Quick Mandi Officer Access button */}
                <TouchableOpacity
                  style={styles.officerQuickBtn}
                  onPress={handleOfficerDirectLogin}
                  activeOpacity={0.85}
                >
                  <Ionicons name="construct" size={16} color="#90CAF9" style={{ marginRight: 6 }} />
                  <Text style={styles.officerQuickBtnText}>🏢 Mandi Officer Portal (Dr Nirmal Kumar Mohanta)</Text>
                </TouchableOpacity>
              </View>
            )}

            {/* Back to Welcome */}
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
  officerQuickBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(21, 101, 192, 0.75)',
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: 'rgba(144, 202, 249, 0.6)',
    paddingVertical: 12,
    marginBottom: spacing.sm,
  },
  officerQuickBtnText: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#E3F2FD',
    letterSpacing: 0.3,
  },
  adminQuickBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(74, 20, 140, 0.7)',
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: 'rgba(206, 147, 216, 0.6)',
    paddingVertical: 12,
    marginBottom: spacing.md,
  },
  adminQuickBtnText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#F3E5F5',
    letterSpacing: 0.3,
  },
  quickChipsContainer: {
    marginTop: 6,
    marginBottom: spacing.xs,
  },
  quickChipsLabel: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.6)',
    marginBottom: 4,
    fontWeight: '600',
  },
  quickChipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  quickChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.12)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    gap: 5,
  },
  quickChipActive: {
    backgroundColor: 'rgba(105, 240, 174, 0.2)',
    borderColor: '#69F0AE',
  },
  quickChipText: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.85)',
    fontWeight: '500',
  },
  quickChipTextActive: {
    color: '#69F0AE',
    fontWeight: '700',
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

  // Admin Switcher & Forms
  modeSwitcherContainer: {
    flexDirection: 'row',
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: radius.md,
    padding: 4,
    marginBottom: spacing.md,
    gap: 6,
  },
  modeTab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: radius.sm,
  },
  modeTabActiveFarmer: {
    backgroundColor: '#2E7D32',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  modeTabActiveAdmin: {
    backgroundColor: '#37474F',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  modeTabText: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.65)',
    fontWeight: '600',
  },
  modeTabTextActive: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  adminSubTabRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: spacing.sm,
  },
  adminSubTab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    borderRadius: radius.xs,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.18)',
  },
  adminSubTabActive: {
    backgroundColor: 'rgba(255,255,255,0.18)',
    borderColor: '#69F0AE',
  },
  adminSubTabText: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.7)',
    fontWeight: '500',
  },
  adminSubTabTextActive: {
    color: '#69F0AE',
    fontWeight: 'bold',
  },
  adminPortalBadge: {
    textAlign: 'center',
    fontSize: 11,
    color: 'rgba(255,255,255,0.7)',
    marginBottom: spacing.md,
    lineHeight: 16,
  },
  adminErrorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(211, 47, 47, 0.25)',
    borderWidth: 1,
    borderColor: '#FF5252',
    padding: 8,
    borderRadius: radius.xs,
    marginBottom: spacing.md,
  },
  adminErrorText: {
    color: '#FFCDD2',
    fontSize: 12,
    flex: 1,
  },
  adminSubmitBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#37474F',
    borderWidth: 1,
    borderColor: '#78909C',
    paddingVertical: 13,
    borderRadius: radius.sm,
    marginTop: spacing.md,
    marginBottom: spacing.xs,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  adminRegisterBtn: {
    backgroundColor: '#1B5E20',
    borderColor: '#4CAF50',
  },
  adminSubmitBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  adminDistChip: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.22)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
  },
  adminDistChipActive: {
    backgroundColor: '#69F0AE',
    borderColor: '#69F0AE',
  },
  adminDistChipText: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
    fontWeight: '500',
  },
  adminDistChipTextActive: {
    color: '#1B5E20',
    fontWeight: 'bold',
  },
  directBypassBtn: {
    marginTop: spacing.sm,
    paddingVertical: 8,
    alignItems: 'center',
  },
  directBypassBtnText: {
    color: '#80CBC4',
    fontSize: 12,
    fontWeight: 'bold',
  },
});