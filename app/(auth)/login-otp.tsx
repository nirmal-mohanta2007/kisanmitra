/**
 * login-otp.tsx
 *
 * Thin redirect screen: farmer mobile-OTP login entry point.
 * Loads the existing login.tsx phone+OTP flow by passing role=farmer.
 * Linked from the unified login page's "Login with Mobile OTP" button.
 */
import React, { useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';

export default function LoginOtpRedirect() {
  const router = useRouter();
  useEffect(() => {
    // Redirect to the original OTP-based login screen
    // (the existing login screen renamed to original-login or reachable via otp page)
    router.replace({ pathname: '/(auth)/otp', params: { phone: '', role: 'farmer' } });
  }, [router]);
  return (
    <View style={{ flex: 1, backgroundColor: '#0A2E1A', justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator size="large" color="#4CAF50" />
    </View>
  );
}
