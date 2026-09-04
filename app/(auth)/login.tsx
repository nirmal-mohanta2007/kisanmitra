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

// Farming background image
const BG_IMAGE = 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=1200&auto=format&fit=crop&q=80';

export default function LoginScreen() {
  const router = useRouter();
  const { role } = useLocalSearchParams();
  const { state, dispatch } = useAppContext();

  const [phone, setPhone] = useState('');
  const [fullName, setFullName] = useState('');
  const [village, setVillage] = useState('');
  const [matchedFarmer, setMatchedFarmer] = useState<Farmer | null>(null);
  const [savedFarmer, setSavedFarmer] = useState<Farmer | null>(null);

  const roleName = role ? String(role).toUpperCase() : 'FARMER';
  const roleIcon =
    role === 'farmer' ? 'leaf' :
    role === 'operator' ? 'construct' :
    role === 'admin' ? 'shield-checkmark' : 'leaf';

  // Load registered farmer from persistent storage on mount
  useEffect(() => {
    StorageService.getItem<Farmer>('kisan_current_farmer').then((f) => {
      if (f && f.id) {
        setSavedFarmer(f);
        if (role === 'farmer' || !role) {
          setPhone(f.phone || '');
          setFullName(f.name || '');
          setVillage(f.village || '');
          setMatchedFarmer(f);
        }
      } else {
        setPhone('9876543210');
      }
    });
  }, [role]);

  // Handle phone input & auto-lookup registered farmer
  const handlePhoneChange = async (text: string) => {
    setPhone(text);
    const cleaned = text.trim();
    if (cleaned.length >= 4) {
      const current = await StorageService.getItem<Farmer>('kisan_current_farmer');
      const all = (await StorageService.getItem<Farmer[]>('kisan_all_farmers')) || [];
      const found =
        (current && current.phone === cleaned ? current : null) ||
        all.find((f) => f.phone === cleaned) ||
        state.farmers.find((f) => f.phone === cleaned);

      if (found) {
        setMatchedFarmer(found);
        if (!fullName || fullName === 'Ramesh Nayak') {
          setFullName(found.name);
        }
        if (!village) {
          setVillage(found.village);
        }
      } else {
        setMatchedFarmer(null);
      }
    } else {
      setMatchedFarmer(null);
    }
  };

  const handleSendOtp = () => {
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length !== 10) {
      Alert.alert('Invalid Mobile Number', 'Please enter a valid 10-digit mobile number.');
      return;
    }

    router.push({
      pathname: '/(auth)/otp',
      params: {
        phone: cleaned,
        name: fullName.trim(),
        village: village.trim(),
        role: (role as string) || '',
      },
    });
  };

  const handleDirectLogin = async () => {
    // Direct bypass if needed
    if (role === 'operator') {
      const opName = fullName.trim() || 'Suresh Verma';
      dispatch({
        type: 'SET_ROLE',
        payload: { role: UserRole.OPERATOR, userId: 'OP-104', userName: opName },
      });
      router.replace('/(operator)');
      return;
    }

    if (role === 'admin') {
      const admName = fullName.trim() || 'Central Admin (DoCA)';
      dispatch({
        type: 'SET_ROLE',
        payload: { role: UserRole.ADMIN, userId: 'ADM-001', userName: admName },
      });
      router.replace('/(admin)');
      return;
    }

    let farmerToLogin: Farmer;
    if (matchedFarmer) {
      farmerToLogin = {
        ...matchedFarmer,
        name: fullName.trim() || matchedFarmer.name,
        phone: phone.trim() || matchedFarmer.phone,
        village: village.trim() || matchedFarmer.village,
      };
    } else {
      const stored = await StorageService.getItem<Farmer>('kisan_current_farmer');
      if (stored && (!phone || stored.phone === phone.trim())) {
        farmerToLogin = {
          ...stored,
          name: fullName.trim() || stored.name,
          village: village.trim() || stored.village,
        };
      } else {
        const farmerId = `F-${Math.floor(100 + Math.random() * 900)}`;
        farmerToLogin = {
          id: farmerId,
          name: fullName.trim() || `Farmer ${phone.slice(-4) || 'User'}`,
          phone: phone.trim() || '9876543210',
          village: village.trim() || 'Gram Panchayat',
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
      const updatedAll = [farmerToLogin, ...all.filter((f) => f.phone !== farmerToLogin.phone && f.id !== farmerToLogin.id)];
      await StorageService.setItem('kisan_all_farmers', updatedAll);
    } catch (e) {
      console.warn('Storage save notice:', e);
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
            {/* Role badge */}
            <View style={styles.roleRow}>
              <View style={styles.roleIconCircle}>
                <Ionicons name={roleIcon as any} size={22} color="#FFFFFF" />
              </View>
              <View>
                <Text style={styles.roleLabel}>{roleName} PORTAL</Text>
                <Text style={styles.roleHint}>Government of India · DoCA</Text>
              </View>
            </View>

            <Text style={styles.title}>Secure Login</Text>
            <Text style={styles.subtitle}>
              {role === 'farmer'
                ? 'Enter your name & mobile number to access your farmer dashboard & mandi bookings.'
                : 'Enter your credentials to access the departmental monitoring terminal.'}
            </Text>

            {/* Matched Farmer Alert Banner */}
            {matchedFarmer && (
              <View style={styles.matchedCard}>
                <Ionicons name="checkmark-circle" size={22} color="#69F0AE" />
                <View style={{ flex: 1, marginLeft: 8 }}>
                  <Text style={styles.matchedTitle}>Registered Account Found ✓</Text>
                  <Text style={styles.matchedName}>{matchedFarmer.name} ({matchedFarmer.id})</Text>
                  <Text style={styles.matchedMeta}>
                    📍 {matchedFarmer.village}, {matchedFarmer.district} • Crop: {matchedFarmer.primaryCrop || 'Wheat'}
                  </Text>
                </View>
              </View>
            )}

            {/* User Full Name Input */}
            <Text style={styles.inputLabel}>
              {role === 'farmer' ? 'Farmer Full Name / किसान का पूरा नाम *' : 'Officer / Admin Name *'}
            </Text>
            <View style={styles.inputWrapper}>
              <Ionicons name="person-outline" size={18} color="rgba(255,255,255,0.7)" style={{ marginRight: 8 }} />
              <TextInput
                style={styles.input}
                placeholder={role === 'farmer' ? 'e.g. Ramesh Patel / Enter your name' : 'Enter your name'}
                placeholderTextColor="rgba(255,255,255,0.45)"
                value={fullName}
                onChangeText={setFullName}
              />
            </View>

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
                onChangeText={handlePhoneChange}
              />
              {phone.length === 10 && (
                <Ionicons name="checkmark-circle" size={18} color="#69F0AE" />
              )}
            </View>

            {/* Village / Gram Panchayat (For Farmers) */}
            {(role === 'farmer' || !role) && (
              <>
                <Text style={styles.inputLabel}>Village / Gram Panchayat (गाँव / शहर)</Text>
                <View style={styles.inputWrapper}>
                  <Ionicons name="location-outline" size={18} color="rgba(255,255,255,0.7)" style={{ marginRight: 8 }} />
                  <TextInput
                    style={styles.input}
                    placeholder="e.g. Berasia, Bhopal (Optional)"
                    placeholderTextColor="rgba(255,255,255,0.45)"
                    value={village}
                    onChangeText={setVillage}
                  />
                </View>
              </>
            )}

            {/* Send OTP button */}
            <TouchableOpacity style={styles.loginBtn} onPress={handleSendOtp} activeOpacity={0.85}>
              <Ionicons name="send" size={16} color="#FFFFFF" style={{ marginRight: 8 }} />
              <Text style={styles.loginBtnText}>Send OTP / ओटीपी भेजें →</Text>
            </TouchableOpacity>

            {/* Quick direct login option */}
            <TouchableOpacity
              style={styles.directLoginBtn}
              onPress={handleDirectLogin}
            >
              <Text style={styles.directLoginText}>⚡ Quick Login without OTP</Text>
            </TouchableOpacity>

            {/* Divider */}
            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>or</Text>
              <View style={styles.dividerLine} />
            </View>

            {/* Register link */}
            {role !== 'operator' && role !== 'admin' && (
              <TouchableOpacity
                style={styles.registerBtn}
                onPress={() => router.push('/(auth)/register')}
                activeOpacity={0.85}
              >
                <Ionicons name="person-add-outline" size={16} color={colors.primary} style={{ marginRight: 6 }} />
                <Text style={styles.registerBtnText}>New Farmer Registration</Text>
              </TouchableOpacity>
            )}

            {/* Back */}
            <TouchableOpacity
              style={styles.backBtn}
              onPress={() => router.replace('/(auth)/welcome')}
            >
              <Ionicons name="arrow-back" size={14} color="rgba(255,255,255,0.6)" style={{ marginRight: 4 }} />
              <Text style={styles.backBtnText}>Switch Role / Back to Welcome</Text>
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
  matchedCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(46, 125, 50, 0.3)',
    borderWidth: 1.5,
    borderColor: '#69F0AE',
    borderRadius: radius.sm,
    padding: spacing.sm,
    marginBottom: spacing.md,
  },
  matchedTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#69F0AE',
    letterSpacing: 0.5,
  },
  matchedName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: 1,
  },
  matchedMeta: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.75)',
    marginTop: 1,
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
      ? { backdropFilter: 'blur(18px)' } as any
      : {}),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 20,
    elevation: 12,
  },
  roleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
    gap: 12,
  },
  roleIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  roleLabel: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#FFFFFF',
    letterSpacing: 1,
  },
  roleHint: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.55)',
    marginTop: 1,
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
  loginBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    borderRadius: radius.sm,
    paddingVertical: 14,
    marginBottom: spacing.md,
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
  directLoginBtn: {
    alignItems: 'center',
    paddingVertical: 8,
    marginBottom: spacing.xs,
  },
  directLoginText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#69F0AE',
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