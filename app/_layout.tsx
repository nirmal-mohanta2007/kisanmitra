import React, { useEffect } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { LogBox, View, ActivityIndicator, Text } from 'react-native';
import { AppProvider } from '../src/store/app-context';
import { AuthProvider, useAuthContext } from '../src/context/AuthContext';

// Suppress known non-fatal Firebase WebChannel connection and stream recovery warnings in React Native
LogBox.ignoreLogs([
  '@firebase/firestore',
  "WebChannelConnection RPC 'Listen' stream",
  'transport errored',
  'Firestore (12.18.0)',
  'Setting a timer',
]);

// Intercept console.warn to guarantee that WebChannel RPC stream transport notices never trigger LogBox
if (typeof console !== 'undefined' && console.warn) {
  const originalWarn = console.warn;
  console.warn = (...args: any[]) => {
    const msg = args.map((a) => (typeof a === 'string' ? a : JSON.stringify(a) || '')).join(' ');
    if (
      msg.includes('WebChannelConnection') ||
      msg.includes("'Listen' stream") ||
      msg.includes('@firebase/firestore') ||
      msg.includes('transport errored')
    ) {
      return;
    }
    originalWarn(...args);
  };
}

// ─── Auth Gate ───────────────────────────────────────────────────────────────
// Watches Firebase auth state and redirects unauthenticated users to login.
// Must be rendered INSIDE AuthProvider.
import { UserRole } from '../src/types/enums';

function AuthGate({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, role, authLoading } = useAuthContext();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (authLoading) return;

    const group = segments[0];

    // Unauthenticated users trying to access protected screens → send to login
    if (!isAuthenticated) {
      if (group !== '(auth)' && group !== 'index' && group !== undefined) {
        router.replace('/(auth)/login');
      }
      return;
    }

    // Authenticated users: enforce role-based route protection
    if (role) {
      if (group === '(farmer)' && role !== UserRole.FARMER) {
        if (role === UserRole.OPERATOR) router.replace('/(operator)');
        else if (role === UserRole.ADMIN) router.replace('/(admin)');
      } else if (group === '(operator)' && role !== UserRole.OPERATOR) {
        if (role === UserRole.FARMER) router.replace('/(farmer)/(tabs)');
        else if (role === UserRole.ADMIN) router.replace('/(admin)');
      } else if (group === '(admin)' && role !== UserRole.ADMIN) {
        if (role === UserRole.FARMER) router.replace('/(farmer)/(tabs)');
        else if (role === UserRole.OPERATOR) router.replace('/(operator)');
      }
    }
  }, [isAuthenticated, role, authLoading, segments, router]);

  // Show full-screen splash while checking session (only on first load)
  if (authLoading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: '#0A2E1A',
        }}
      >
        <ActivityIndicator size="large" color="#4CAF50" />
        <Text
          style={{
            marginTop: 16,
            fontSize: 14,
            color: 'rgba(255,255,255,0.6)',
            letterSpacing: 0.5,
          }}
        >
          Kisan Mitra — Loading…
        </Text>
      </View>
    );
  }

  return <>{children}</>;
}

// ─── Root Layout ─────────────────────────────────────────────────────────────
export default function RootLayout() {
  return (
    <AppProvider>
      {/* AuthProvider is inside AppProvider so it can dispatch SET_ROLE */}
      <AuthProvider>
        <AuthGate>
          <StatusBar style="auto" />
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="index" />
            <Stack.Screen name="(auth)" />
            <Stack.Screen name="(farmer)" />
            <Stack.Screen name="(operator)" />
            <Stack.Screen name="(admin)" />
          </Stack>
        </AuthGate>
      </AuthProvider>
    </AppProvider>
  );
}
