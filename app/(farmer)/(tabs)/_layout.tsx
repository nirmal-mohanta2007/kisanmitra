import { Tabs } from 'expo-router';

export default function FarmerTabsLayout() {
  return (
    <Tabs screenOptions={{ tabBarActiveTintColor: '#2E7D32' }}>
      <Tabs.Screen name="index" options={{ title: 'Home' }} />
      <Tabs.Screen name="bookings" options={{ title: 'Bookings' }} />
      <Tabs.Screen name="history" options={{ title: 'History' }} />
      <Tabs.Screen name="profile" options={{ title: 'Profile' }} />
    </Tabs>
  );
}