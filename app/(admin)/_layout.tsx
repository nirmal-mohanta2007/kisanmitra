import { Stack } from 'expo-router';

export default function AdminLayout() {
  return (
    <Stack screenOptions={{ headerShown: true, headerStyle: { backgroundColor: '#424242' }, headerTintColor: '#fff' }}>
      <Stack.Screen name="index" options={{ title: 'Admin Command' }} />
      <Stack.Screen name="mandis" options={{ title: 'All Mandis' }} />
      <Stack.Screen name="mandi/[mandiId]" options={{ title: 'Mandi Detail' }} />
      <Stack.Screen name="analytics" options={{ title: 'Analytics' }} />
      <Stack.Screen name="payments" options={{ title: 'Payment Dashboard' }} />
      <Stack.Screen name="exceptions" options={{ title: 'System Exceptions' }} />
      <Stack.Screen name="anomalies" options={{ title: 'Anomalies' }} />
    </Stack>
  );
}