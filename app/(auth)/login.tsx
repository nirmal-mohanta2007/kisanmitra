import React, { useState } from 'react';
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
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../src/theme/colors';
import { spacing } from '../../src/theme/spacing';
import { radius } from '../../src/theme/radius';

// Farming background image
const BG_IMAGE = 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=1200&auto=format&fit=crop&q=80';

export default function LoginScreen() {
  const router = useRouter();
  const [phone, setPhone] = useState('');

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
      },
    });
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
            <Text style={styles.title}>Secure Login</Text>
            <Text style={styles.subtitle}>
              Enter your 10-digit mobile number to receive an OTP verification code.
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
              {phone.length === 10 && (
                <Ionicons name="checkmark-circle" size={18} color="#69F0AE" />
              )}
            </View>

            {/* Get OTP button */}
            <TouchableOpacity style={styles.loginBtn} onPress={handleSendOtp} activeOpacity={0.85}>
              <Ionicons name="key-outline" size={18} color="#FFFFFF" style={{ marginRight: 8 }} />
              <Text style={styles.loginBtnText}>Get OTP / ओटीपी प्राप्त करें</Text>
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