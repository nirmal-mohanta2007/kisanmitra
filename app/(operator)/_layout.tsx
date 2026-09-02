import { Stack } from 'expo-router';

export default function OperatorLayout() {
  return (
    <Stack screenOptions={{ headerShown: true, headerStyle: { backgroundColor: '#1565C0' }, headerTintColor: '#fff' }}>
      <Stack.Screen name="index" options={{ title: 'Dashboard' }} />
      <Stack.Screen name="queue" options={{ title: 'Queue Manager' }} />
      <Stack.Screen name="farmer/[transactionId]" options={{ title: 'Farmer Details' }} />
      <Stack.Screen name="operations/check-in" options={{ title: 'Check In' }} />
      <Stack.Screen name="operations/weighing" options={{ title: 'Weighing' }} />
      <Stack.Screen name="operations/quality-check" options={{ title: 'Quality Check' }} />
      <Stack.Screen name="operations/procurement" options={{ title: 'Procurement' }} />
      <Stack.Screen name="exceptions" options={{ title: 'Exceptions' }} />
      <Stack.Screen name="payments" options={{ title: 'Payments' }} />
    </Stack>
  );
}