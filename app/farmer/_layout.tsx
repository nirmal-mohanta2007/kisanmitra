import { Stack } from 'expo-router';
import { Colors } from '../../src/constants/theme';

export default function FarmerLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: Colors.primary },
        headerTintColor: Colors.textLight,
        headerTitleStyle: { fontWeight: '600' },
        contentStyle: { backgroundColor: Colors.background },
      }}
    />
  );
}
