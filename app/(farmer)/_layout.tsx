import { Stack } from 'expo-router';

export default function FarmerLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="mandi" />
      <Stack.Screen name="booking" />
      <Stack.Screen name="queue" />
      <Stack.Screen name="procurement" />
      <Stack.Screen name="payment" />
      <Stack.Screen name="support" />
    </Stack>
  );
}