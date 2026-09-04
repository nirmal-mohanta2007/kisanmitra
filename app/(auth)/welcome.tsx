import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  Image,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { FirebaseStatusBadge } from '../../src/components/common/FirebaseStatusBadge';
import { colors } from '../../src/theme/colors';
import { radius } from '../../src/theme/radius';
import { spacing } from '../../src/theme/spacing';

const BG_IMAGE = 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=1200&auto=format&fit=crop&q=80';

export default function WelcomeScreen() {
  const router = useRouter();

  return (
    <ImageBackground
      source={{ uri: BG_IMAGE }}
      style={styles.bg}
      resizeMode="cover"
    >
      {/* Dark gradient overlay */}
      <View style={styles.overlay} />

      <View style={styles.screen}>
        {/* Top government strip */}
        <View style={styles.govStrip}>
          <Text style={styles.govStripText}>🇮🇳  Government of India · Department of Consumer Affairs (DoCA)</Text>
        </View>

        {/* Center content */}
        <View style={styles.centerContent}>
          {/* Logo & Brand */}
          <View style={styles.logoBox}>
            <Image
              source={require('../../assets/logo.png')}
              style={styles.logoImg}
              resizeMode="contain"
            />
          </View>
          <Text style={styles.title}>Kisan Mitra</Text>
          <Text style={styles.tagline}>Empowering Farmers, Streamlining Procurement</Text>
          <Text style={styles.scheme}>PM-Kisan · MSP e-Uparjan · DBT Direct Payout</Text>

          {/* Glass card */}
          <View style={styles.glassCard}>
            {/* Firebase status */}
            <View style={styles.badgeRow}>
              <FirebaseStatusBadge />
            </View>

            {/* Sign In button */}
            <TouchableOpacity
              style={styles.primaryBtn}
              onPress={() => router.push('/(auth)/language')}
              activeOpacity={0.85}
            >
              <Ionicons name="log-in-outline" size={18} color="#FFFFFF" style={{ marginRight: 8 }} />
              <Text style={styles.primaryBtnText}>Sign In / Select Role</Text>
            </TouchableOpacity>

            {/* Register button */}
            <TouchableOpacity
              style={styles.secondaryBtn}
              onPress={() => router.push('/(auth)/register')}
              activeOpacity={0.85}
            >
              <Ionicons name="person-add-outline" size={17} color={colors.primary} style={{ marginRight: 8 }} />
              <Text style={styles.secondaryBtnText}>Register as New Farmer</Text>
            </TouchableOpacity>
          </View>

          {/* Stats row */}
          <View style={styles.statsRow}>
            {[
              { icon: 'people-outline', value: '1.2Cr+', label: 'Farmers' },
              { icon: 'storefront-outline', value: '850+', label: 'Mandis' },
              { icon: 'cash-outline', value: '₹4200Cr', label: 'Disbursed' },
            ].map((s) => (
              <View key={s.label} style={styles.statItem}>
                <Ionicons name={s.icon as any} size={18} color="rgba(255,255,255,0.8)" />
                <Text style={styles.statValue}>{s.value}</Text>
                <Text style={styles.statLabel}>{s.label}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Footer */}
        <Text style={styles.footer}>Powered by Digital India Initiative</Text>
      </View>
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
  screen: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.lg,
  },
  govStrip: {
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderRadius: radius.sm,
    paddingHorizontal: 14,
    paddingVertical: 6,
    marginTop: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.18)',
  },
  govStripText: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.8)',
    textAlign: 'center',
    letterSpacing: 0.3,
  },
  centerContent: {
    width: '100%',
    maxWidth: 420,
    alignItems: 'center',
  },
  logoBox: {
    width: 96,
    height: 96,
    borderRadius: 24,
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    overflow: 'hidden',
  },
  logoImg: {
    width: 92,
    height: 92,
    borderRadius: 22,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#FFFFFF',
    letterSpacing: 1,
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
  },
  tagline: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.75)',
    marginTop: 4,
    textAlign: 'center',
  },
  scheme: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.5)',
    marginTop: 4,
    marginBottom: 28,
    letterSpacing: 0.3,
    textAlign: 'center',
  },
  glassCard: {
    width: '100%',
    backgroundColor: 'rgba(255,255,255,0.13)',
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.22)',
    padding: spacing.lg,
    ...(Platform.OS === 'web' ? { backdropFilter: 'blur(16px)' } as any : {}),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
    marginBottom: 28,
  },
  badgeRow: {
    marginBottom: 16,
  },
  primaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    paddingVertical: 15,
    borderRadius: radius.md,
    width: '100%',
    marginBottom: 10,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 6,
  },
  primaryBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 0.3,
  },
  secondaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderWidth: 1.5,
    borderColor: colors.primary,
    paddingVertical: 14,
    borderRadius: radius.md,
    width: '100%',
  },
  secondaryBtnText: {
    color: colors.primaryDark,
    fontSize: 15,
    fontWeight: 'bold',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  statItem: {
    alignItems: 'center',
    gap: 4,
  },
  statValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: 2,
  },
  statLabel: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.55)',
  },
  footer: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.35)',
    letterSpacing: 0.3,
    marginBottom: 4,
  },
});