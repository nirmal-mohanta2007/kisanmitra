import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { LogBox } from 'react-native';
import { AppProvider } from '../src/store/app-context';

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

export default function RootLayout() {
  return (
    <AppProvider>
      <StatusBar style="auto" />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(farmer)" />
        <Stack.Screen name="(operator)" />
        <Stack.Screen name="(admin)" />
      </Stack>
    </AppProvider>
  );
}