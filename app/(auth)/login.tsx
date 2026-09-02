import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../src/theme/colors';
import { spacing } from '../../src/theme/spacing';
import { radius } from '../../src/theme/radius';
import { ScreenContainer, KisanCard, KisanButton } from '../../src/components/common';

export default function LoginScreen() {
  const router = useRouter();
  const { role } = useLocalSearchParams();
  const [phone, setPhone] = useState('9876543210');
  const roleName = role ? String(role).toUpperCase() : 'FARMER';

  const handleLogin = () => {
    if (role === 'farmer') router.replace('/(farmer)/(tabs)');
    else if (role === 'operator') router.replace('/(operator)');
    else if (role === 'admin') router.replace('/(admin)');
    else router.replace('/(farmer)/(tabs)');
  };

  return (
    <ScreenContainer scrollable style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.emblem}>🌾</Text>
          <Text style={styles.roleTag}>{roleName} PORTAL</Text>
          <Text style={styles.title}>Secure Login</Text>
          <Text style={styles.subtitle}>
            Enter your registered 10-digit mobile number to receive an instant verification OTP
          </Text>
        </View>

        <KisanCard style={styles.card}>
          <Text style={styles.inputLabel}>Mobile Number (Aadhaar Linked)</Text>
          <View style={styles.inputWrapper}>
            <Text style={styles.countryCode}>+91</Text>
            <TextInput
              style={styles.input}
              placeholder="10-digit mobile number"
              keyboardType="phone-pad"
              maxLength={10}
              value={phone}
              onChangeText={setPhone}
            />
          </View>

          <KisanButton
            title="Send OTP & Login"
            onPress={handleLogin}
            variant="primary"
          />
        </KisanCard>

        {/* Farmer Registration Action Card */}
        {role !== 'operator' && role !== 'admin' && (
          <KisanCard style={styles.registerCard}>
            <View style={styles.registerRow}>
              <Ionicons name="person-add" size={24} color={colors.primary} />
              <View style={{ flex: 1, marginLeft: 10 }}>
                <Text style={styles.registerTitle}>New Farmer Registration</Text>
                <Text style={styles.registerSub}>
                  Register your Aadhaar, Land Record & DBT Bank Account
                </Text>
              </View>
            </View>
            <TouchableOpacity
              style={styles.registerBtn}
              onPress={() => router.push('/(auth)/register')}
            >
              <Text style={styles.registerBtnText}>Open Registration Form →</Text>
            </TouchableOpacity>
          </KisanCard>
        )}

        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => router.replace('/(auth)/welcome')}
        >
          <Text style={styles.backBtnText}>← Switch Role / Back to Welcome</Text>
        </TouchableOpacity>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: spacing.lg,
    justifyContent: 'center',
  },
  content: {
    maxWidth: 480,
    width: '100%',
    alignSelf: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  emblem: {
    fontSize: 42,
    marginBottom: 4,
  },
  roleTag: {
    fontSize: 11,
    fontWeight: 'bold',
    color: colors.primary,
    letterSpacing: 1,
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: radius.sm,
    marginBottom: 6,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  subtitle: {
    fontSize: 13,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 6,
    lineHeight: 18,
  },
  card: {
    marginBottom: spacing.md,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.sm,
    backgroundColor: '#FAFAFA',
    paddingHorizontal: 12,
    marginBottom: spacing.lg,
  },
  countryCode: {
    fontSize: 15,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: colors.textPrimary,
    paddingVertical: 10,
  },
  registerCard: {
    backgroundColor: '#F1F8E9',
    borderColor: '#C8E6C9',
    marginBottom: spacing.lg,
  },
  registerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  registerTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: colors.primaryDark,
  },
  registerSub: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  registerBtn: {
    backgroundColor: colors.primary,
    paddingVertical: 10,
    borderRadius: radius.sm,
    alignItems: 'center',
  },
  registerBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: 'bold',
  },
  backBtn: {
    alignItems: 'center',
    paddingVertical: 10,
  },
  backBtnText: {
    fontSize: 13,
    color: colors.textSecondary,
    fontWeight: '500',
  },
});