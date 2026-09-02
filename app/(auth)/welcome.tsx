import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { FirebaseStatusBadge } from '../../src/components/common/FirebaseStatusBadge';
import { colors } from '../../src/theme/colors';
import { radius } from '../../src/theme/radius';

export default function WelcomeScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.emblem}>🌾</Text>
        <Text style={styles.title}>Kisan Mitra</Text>
        <Text style={styles.subtitle}>Empowering Farmers, Streamlining Procurement</Text>

        <View style={styles.badgeContainer}>
          <FirebaseStatusBadge />
        </View>

        <TouchableOpacity 
          style={styles.primaryButton} 
          onPress={() => router.push('/(auth)/language')}
          activeOpacity={0.8}
        >
          <Text style={styles.primaryButtonText}>Sign In / Select Role</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.secondaryButton} 
          onPress={() => router.push('/(auth)/register')}
          activeOpacity={0.8}
        >
          <Text style={styles.secondaryButtonText}>+ Register as New Farmer</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F7FA',
    padding: 24,
  },
  content: {
    width: '100%',
    maxWidth: 380,
    alignItems: 'center',
  },
  emblem: {
    fontSize: 48,
    marginBottom: 4,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 20,
  },
  badgeContainer: {
    width: '100%',
    marginBottom: 24,
  },
  primaryButton: {
    backgroundColor: colors.primary,
    paddingVertical: 14,
    borderRadius: radius.md,
    width: '100%',
    alignItems: 'center',
    marginBottom: 12,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  secondaryButton: {
    backgroundColor: '#E8F5E9',
    borderWidth: 1.5,
    borderColor: colors.primary,
    paddingVertical: 14,
    borderRadius: radius.md,
    width: '100%',
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: colors.primaryDark,
    fontSize: 15,
    fontWeight: 'bold',
  },
});