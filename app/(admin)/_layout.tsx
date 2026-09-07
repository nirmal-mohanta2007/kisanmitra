import React from 'react';
import { TouchableOpacity, Alert } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuthContext } from '../../src/context/AuthContext';

export default function AdminLayout() {
  const { signOut } = useAuthContext();
  const router = useRouter();

  const handleLogout = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out of the Admin Console?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: async () => {
            await signOut();
            router.replace('/(auth)/login');
          },
        },
      ]
    );
  };

  const LogoutButton = () => (
    <TouchableOpacity onPress={handleLogout} style={{ marginRight: 12, padding: 4 }} activeOpacity={0.7}>
      <Ionicons name="log-out-outline" size={22} color="#FFFFFF" />
    </TouchableOpacity>
  );

  return (
    <Stack
      screenOptions={{
        headerShown: true,
        headerStyle: { backgroundColor: '#424242' },
        headerTintColor: '#fff',
        headerRight: () => <LogoutButton />,
      }}
    >
      <Stack.Screen name="index" options={{ title: 'State & District Command Center' }} />
      <Stack.Screen name="mandis" options={{ title: 'All Mandis' }} />
      <Stack.Screen name="mandi/[mandiId]" options={{ title: 'Mandi Detail' }} />
      <Stack.Screen name="analytics" options={{ title: 'Analytics' }} />
      <Stack.Screen name="payments" options={{ title: 'Payment Dashboard' }} />
      <Stack.Screen name="exceptions" options={{ title: 'System Exceptions' }} />
      <Stack.Screen name="anomalies" options={{ title: 'Anomalies' }} />
    </Stack>
  );
}
