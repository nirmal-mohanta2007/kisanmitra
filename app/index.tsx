import React from 'react';
import { Redirect } from 'expo-router';
import { View, ActivityIndicator } from 'react-native';
import { useAuthContext } from '../src/context/AuthContext';
import { UserRole } from '../src/types/enums';

/**
 * Root index — redirects the user to the correct dashboard based on their role.
 * If not authenticated, sends to the unified login page.
 * While the session check is in progress, shows a loading indicator
 * (the AuthGate in _layout.tsx also handles this, so this is a safety net).
 */
export default function Index() {
  const { isAuthenticated, role, authLoading } = useAuthContext();

  if (authLoading) {
    return (
      <View style={{ flex: 1, backgroundColor: '#0A2E1A', justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#4CAF50" />
      </View>
    );
  }

  if (!isAuthenticated) {
    return <Redirect href="/(auth)/login" />;
  }

  switch (role) {
    case UserRole.FARMER:
      return <Redirect href="/(farmer)/(tabs)" />;
    case UserRole.OPERATOR:
      return <Redirect href="/(operator)" />;
    case UserRole.ADMIN:
      return <Redirect href="/(admin)" />;
    default:
      return <Redirect href="/(auth)/login" />;
  }
}
