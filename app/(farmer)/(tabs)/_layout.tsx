import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../../src/theme/colors';
import { useAppContext } from '../../../src/store/app-context';

export default function FarmerTabsLayout() {
  const { state } = useAppContext();
  const lang = state.language || 'hi';

  const tabTitles = {
    home: lang === 'or' ? 'ମୂଳପୃଷ୍ଠା' : lang === 'hi' ? 'होम' : 'Home',
    bookings: lang === 'or' ? 'ମୋ ବୁକିଂ' : lang === 'hi' ? 'मेरी बुकिंग' : 'Bookings',
    myBookingsHeader: lang === 'or' ? 'ମୋ ବୁକିଂ ତାଲିକା' : lang === 'hi' ? 'मेरी बुकिंग' : 'My Bookings',
    history: lang === 'or' ? 'ଇତିହାସ' : lang === 'hi' ? 'इतिहास' : 'History',
    historyHeader: lang === 'or' ? 'କ୍ରୟ ଇତିହାସ' : lang === 'hi' ? 'खरीद इतिहास' : 'Procurement History',
    profile: lang === 'or' ? 'ପ୍ରୋଫାଇଲ୍' : lang === 'hi' ? 'प्रोफ़ाइल' : 'Profile',
    profileHeader: lang === 'or' ? 'ଚାଷୀ ପ୍ରୋଫାଇଲ୍' : lang === 'hi' ? 'किसान प्रोफ़ाइल' : 'Farmer Profile',
  };

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
        headerStyle: {
          backgroundColor: colors.primary,
        },
        headerTintColor: '#FFFFFF',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          headerShown: false,
          title: tabTitles.home,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="bookings"
        options={{
          title: tabTitles.bookings,
          headerTitle: tabTitles.myBookingsHeader,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="calendar-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: tabTitles.history,
          headerTitle: tabTitles.historyHeader,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="time-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: tabTitles.profile,
          headerTitle: tabTitles.profileHeader,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-outline" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}