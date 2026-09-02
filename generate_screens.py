import os

project_root = r'd:\KISAN MITRA\kisan-mitra-app'

files = {
    'app/_layout.tsx': '''import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

export default function RootLayout() {
  return (
    <>
      <StatusBar style="auto" />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(farmer)" />
        <Stack.Screen name="(operator)" />
        <Stack.Screen name="(admin)" />
      </Stack>
    </>
  );
}''',
    
    'app/index.tsx': '''import { Redirect } from 'expo-router';

export default function Index() {
  return <Redirect href="/(auth)/welcome" />;
}''',

    'app/(auth)/_layout.tsx': '''import { Stack } from 'expo-router';

export default function AuthLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="welcome" />
      <Stack.Screen name="language" />
      <Stack.Screen name="role-selection" />
      <Stack.Screen name="login" />
    </Stack>
  );
}''',

    'app/(auth)/welcome.tsx': '''import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

export default function WelcomeScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Kisan Mitra</Text>
      <Text style={styles.subtitle}>Empowering Farmers, Streamlining Procurement</Text>
      
      <TouchableOpacity 
        style={styles.button} 
        onPress={() => router.push('/(auth)/language')}
      >
        <Text style={styles.buttonText}>Get Started</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: '#757575',
    textAlign: 'center',
    marginBottom: 40,
  },
  button: {
    backgroundColor: '#2E7D32',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  }
});''',

    'app/(auth)/language.tsx': '''import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

export default function LanguageScreen() {
  const router = useRouter();

  const handleLanguageSelect = (lang: string) => {
    router.push('/(auth)/role-selection');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Select Language</Text>
      
      {['English', 'हिंदी', 'ଓଡ଼ିଆ'].map((lang) => (
        <TouchableOpacity 
          key={lang}
          style={styles.button} 
          onPress={() => handleLanguageSelect(lang)}
        >
          <Text style={styles.buttonText}>{lang}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#212121',
    marginBottom: 30,
  },
  button: {
    backgroundColor: '#FFFFFF',
    borderColor: '#2E7D32',
    borderWidth: 1,
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
    marginBottom: 16,
  },
  buttonText: {
    color: '#2E7D32',
    fontSize: 18,
    fontWeight: '600',
  }
});''',

    'app/(auth)/role-selection.tsx': '''import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

export default function RoleSelectionScreen() {
  const router = useRouter();

  const handleRoleSelect = (role: string) => {
    router.push({
      pathname: '/(auth)/login',
      params: { role }
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Who are you?</Text>
      
      <TouchableOpacity style={styles.button} onPress={() => handleRoleSelect('farmer')}>
        <Text style={styles.buttonText}>Farmer</Text>
      </TouchableOpacity>
      
      <TouchableOpacity style={[styles.button, styles.operatorBtn]} onPress={() => handleRoleSelect('operator')}>
        <Text style={styles.buttonText}>Operator</Text>
      </TouchableOpacity>
      
      <TouchableOpacity style={[styles.button, styles.adminBtn]} onPress={() => handleRoleSelect('admin')}>
        <Text style={styles.buttonText}>Admin</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#212121',
    marginBottom: 30,
  },
  button: {
    backgroundColor: '#2E7D32',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
    marginBottom: 16,
  },
  operatorBtn: {
    backgroundColor: '#1565C0',
  },
  adminBtn: {
    backgroundColor: '#424242',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  }
});''',

    'app/(auth)/login.tsx': '''import { View, Text, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';

export default function LoginScreen() {
  const router = useRouter();
  const { role } = useLocalSearchParams();
  const [phone, setPhone] = useState('');
  
  const handleLogin = () => {
    if (role === 'farmer') router.replace('/(farmer)/(tabs)');
    else if (role === 'operator') router.replace('/(operator)');
    else if (role === 'admin') router.replace('/(admin)');
    else router.replace('/(farmer)/(tabs)');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <Text style={styles.subtitle}>Enter mobile number</Text>
      
      <TextInput 
        style={styles.input}
        placeholder="10-digit mobile number"
        keyboardType="phone-pad"
        value={phone}
        onChangeText={setPhone}
      />
      
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Send OTP</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#F5F5F5',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#212121',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#757575',
    marginBottom: 24,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    padding: 16,
    fontSize: 16,
    marginBottom: 24,
  },
  button: {
    backgroundColor: '#2E7D32',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  }
});''',

    'app/(farmer)/_layout.tsx': '''import { Stack } from 'expo-router';

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
}''',

    'app/(farmer)/(tabs)/_layout.tsx': '''import { Tabs } from 'expo-router';

export default function FarmerTabsLayout() {
  return (
    <Tabs screenOptions={{ tabBarActiveTintColor: '#2E7D32' }}>
      <Tabs.Screen name="index" options={{ title: 'Home' }} />
      <Tabs.Screen name="bookings" options={{ title: 'Bookings' }} />
      <Tabs.Screen name="history" options={{ title: 'History' }} />
      <Tabs.Screen name="profile" options={{ title: 'Profile' }} />
    </Tabs>
  );
}''',

    'app/(farmer)/(tabs)/index.tsx': '''import { View, Text, StyleSheet } from 'react-native';

export default function FarmerDashboard() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Farmer Dashboard</Text>
    </View>
  );
}

const styles = StyleSheet.create({ 
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' }, 
  title: { fontSize: 24 } 
});''',

    'app/(farmer)/(tabs)/bookings.tsx': '''import { View, Text, StyleSheet } from 'react-native';

export default function Bookings() { 
  return <View style={styles.container}><Text style={styles.title}>Bookings</Text></View>; 
}

const styles = StyleSheet.create({ 
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' }, 
  title: { fontSize: 24 } 
});''',

    'app/(farmer)/(tabs)/history.tsx': '''import { View, Text, StyleSheet } from 'react-native';

export default function History() { 
  return <View style={styles.container}><Text style={styles.title}>History</Text></View>; 
}

const styles = StyleSheet.create({ 
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' }, 
  title: { fontSize: 24 } 
});''',

    'app/(farmer)/(tabs)/profile.tsx': '''import { View, Text, StyleSheet } from 'react-native';

export default function Profile() { 
  return <View style={styles.container}><Text style={styles.title}>Profile</Text></View>; 
}

const styles = StyleSheet.create({ 
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' }, 
  title: { fontSize: 24 } 
});''',

    'app/(farmer)/mandi/index.tsx': '''import { View, Text, StyleSheet } from 'react-native';

export default function Mandis() { 
  return <View style={styles.container}><Text style={styles.title}>Nearby Mandis</Text></View>; 
}

const styles = StyleSheet.create({ 
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' }, 
  title: { fontSize: 24 } 
});''',

    'app/(farmer)/mandi/[mandiId].tsx': '''import { View, Text, StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router';

export default function MandiDetail() { 
  const { mandiId } = useLocalSearchParams();
  return <View style={styles.container}><Text style={styles.title}>Mandi {mandiId}</Text></View>; 
}

const styles = StyleSheet.create({ 
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' }, 
  title: { fontSize: 24 } 
});''',

    'app/(farmer)/booking/crop.tsx': '''import { View, Text, StyleSheet } from 'react-native';

export default function BookingCrop() { 
  return <View style={styles.container}><Text style={styles.title}>Select Crop</Text></View>; 
}

const styles = StyleSheet.create({ 
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' }, 
  title: { fontSize: 24 } 
});''',

    'app/(farmer)/booking/quantity.tsx': '''import { View, Text, StyleSheet } from 'react-native';

export default function BookingQuantity() { 
  return <View style={styles.container}><Text style={styles.title}>Enter Quantity</Text></View>; 
}

const styles = StyleSheet.create({ 
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' }, 
  title: { fontSize: 24 } 
});''',

    'app/(farmer)/booking/slot.tsx': '''import { View, Text, StyleSheet } from 'react-native';

export default function BookingSlot() { 
  return <View style={styles.container}><Text style={styles.title}>Pick Slot</Text></View>; 
}

const styles = StyleSheet.create({ 
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' }, 
  title: { fontSize: 24 } 
});''',

    'app/(farmer)/booking/confirmation.tsx': '''import { View, Text, StyleSheet } from 'react-native';

export default function BookingConfirmation() { 
  return <View style={styles.container}><Text style={styles.title}>Booking Confirmed</Text></View>; 
}

const styles = StyleSheet.create({ 
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' }, 
  title: { fontSize: 24 } 
});''',

    'app/(farmer)/booking/checklist.tsx': '''import { View, Text, StyleSheet } from 'react-native';

export default function BookingChecklist() { 
  return <View style={styles.container}><Text style={styles.title}>Checklist</Text></View>; 
}

const styles = StyleSheet.create({ 
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' }, 
  title: { fontSize: 24 } 
});''',

    'app/(farmer)/queue/[bookingId].tsx': '''import { View, Text, StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router';

export default function QueueTracker() { 
  const { bookingId } = useLocalSearchParams();
  return <View style={styles.container}><Text style={styles.title}>Queue for {bookingId}</Text></View>; 
}

const styles = StyleSheet.create({ 
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' }, 
  title: { fontSize: 24 } 
});''',

    'app/(farmer)/procurement/[transactionId].tsx': '''import { View, Text, StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router';

export default function ProcurementStage() { 
  const { transactionId } = useLocalSearchParams();
  return <View style={styles.container}><Text style={styles.title}>Procurement {transactionId}</Text></View>; 
}

const styles = StyleSheet.create({ 
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' }, 
  title: { fontSize: 24 } 
});''',

    'app/(farmer)/procurement/summary.tsx': '''import { View, Text, StyleSheet } from 'react-native';

export default function ProcurementSummary() { 
  return <View style={styles.container}><Text style={styles.title}>Procurement Summary</Text></View>; 
}

const styles = StyleSheet.create({ 
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' }, 
  title: { fontSize: 24 } 
});''',

    'app/(farmer)/procurement/receipt.tsx': '''import { View, Text, StyleSheet } from 'react-native';

export default function ProcurementReceipt() { 
  return <View style={styles.container}><Text style={styles.title}>Receipt</Text></View>; 
}

const styles = StyleSheet.create({ 
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' }, 
  title: { fontSize: 24 } 
});''',

    'app/(farmer)/payment/[transactionId].tsx': '''import { View, Text, StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router';

export default function PaymentTracker() { 
  const { transactionId } = useLocalSearchParams();
  return <View style={styles.container}><Text style={styles.title}>Payment for {transactionId}</Text></View>; 
}

const styles = StyleSheet.create({ 
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' }, 
  title: { fontSize: 24 } 
});''',

    'app/(farmer)/support/index.tsx': '''import { View, Text, StyleSheet } from 'react-native';

export default function Support() { 
  return <View style={styles.container}><Text style={styles.title}>Support Center</Text></View>; 
}

const styles = StyleSheet.create({ 
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' }, 
  title: { fontSize: 24 } 
});''',

    'app/(farmer)/support/create-issue.tsx': '''import { View, Text, StyleSheet } from 'react-native';

export default function CreateIssue() { 
  return <View style={styles.container}><Text style={styles.title}>Create Issue</Text></View>; 
}

const styles = StyleSheet.create({ 
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' }, 
  title: { fontSize: 24 } 
});''',

    'app/(farmer)/support/[issueId].tsx': '''import { View, Text, StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router';

export default function IssueDetail() { 
  const { issueId } = useLocalSearchParams();
  return <View style={styles.container}><Text style={styles.title}>Issue {issueId}</Text></View>; 
}

const styles = StyleSheet.create({ 
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' }, 
  title: { fontSize: 24 } 
});''',

    'app/(operator)/_layout.tsx': '''import { Stack } from 'expo-router';

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
}''',

    'app/(operator)/index.tsx': '''import { View, Text, StyleSheet } from 'react-native';

export default function OperatorDashboard() { 
  return <View style={styles.container}><Text style={styles.title}>Operator Dashboard</Text></View>; 
}

const styles = StyleSheet.create({ 
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' }, 
  title: { fontSize: 24 } 
});''',

    'app/(operator)/queue.tsx': '''import { View, Text, StyleSheet } from 'react-native';

export default function QueueManager() { 
  return <View style={styles.container}><Text style={styles.title}>Queue Manager</Text></View>; 
}

const styles = StyleSheet.create({ 
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' }, 
  title: { fontSize: 24 } 
});''',

    'app/(operator)/farmer/[transactionId].tsx': '''import { View, Text, StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router';

export default function OperatorFarmerDetail() { 
  const { transactionId } = useLocalSearchParams();
  return <View style={styles.container}><Text style={styles.title}>Farmer Tx {transactionId}</Text></View>; 
}

const styles = StyleSheet.create({ 
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' }, 
  title: { fontSize: 24 } 
});''',

    'app/(operator)/operations/check-in.tsx': '''import { View, Text, StyleSheet } from 'react-native';

export default function CheckIn() { 
  return <View style={styles.container}><Text style={styles.title}>Check In</Text></View>; 
}

const styles = StyleSheet.create({ 
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' }, 
  title: { fontSize: 24 } 
});''',

    'app/(operator)/operations/weighing.tsx': '''import { View, Text, StyleSheet } from 'react-native';

export default function Weighing() { 
  return <View style={styles.container}><Text style={styles.title}>Weighing</Text></View>; 
}

const styles = StyleSheet.create({ 
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' }, 
  title: { fontSize: 24 } 
});''',

    'app/(operator)/operations/quality-check.tsx': '''import { View, Text, StyleSheet } from 'react-native';

export default function QualityCheck() { 
  return <View style={styles.container}><Text style={styles.title}>Quality Check</Text></View>; 
}

const styles = StyleSheet.create({ 
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' }, 
  title: { fontSize: 24 } 
});''',

    'app/(operator)/operations/procurement.tsx': '''import { View, Text, StyleSheet } from 'react-native';

export default function Procurement() { 
  return <View style={styles.container}><Text style={styles.title}>Finalize Procurement</Text></View>; 
}

const styles = StyleSheet.create({ 
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' }, 
  title: { fontSize: 24 } 
});''',

    'app/(operator)/exceptions.tsx': '''import { View, Text, StyleSheet } from 'react-native';

export default function Exceptions() { 
  return <View style={styles.container}><Text style={styles.title}>Exceptions</Text></View>; 
}

const styles = StyleSheet.create({ 
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' }, 
  title: { fontSize: 24 } 
});''',

    'app/(operator)/payments.tsx': '''import { View, Text, StyleSheet } from 'react-native';

export default function OperatorPayments() { 
  return <View style={styles.container}><Text style={styles.title}>Payments</Text></View>; 
}

const styles = StyleSheet.create({ 
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' }, 
  title: { fontSize: 24 } 
});''',

    'app/(admin)/_layout.tsx': '''import { Stack } from 'expo-router';

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
}''',

    'app/(admin)/index.tsx': '''import { View, Text, StyleSheet } from 'react-native';

export default function AdminDashboard() { 
  return <View style={styles.container}><Text style={styles.title}>Central Command</Text></View>; 
}

const styles = StyleSheet.create({ 
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' }, 
  title: { fontSize: 24 } 
});''',

    'app/(admin)/mandis.tsx': '''import { View, Text, StyleSheet } from 'react-native';

export default function AdminMandis() { 
  return <View style={styles.container}><Text style={styles.title}>All Mandis</Text></View>; 
}

const styles = StyleSheet.create({ 
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' }, 
  title: { fontSize: 24 } 
});''',

    'app/(admin)/mandi/[mandiId].tsx': '''import { View, Text, StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router';

export default function AdminMandiDetail() { 
  const { mandiId } = useLocalSearchParams();
  return <View style={styles.container}><Text style={styles.title}>Mandi Monitor: {mandiId}</Text></View>; 
}

const styles = StyleSheet.create({ 
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' }, 
  title: { fontSize: 24 } 
});''',

    'app/(admin)/analytics.tsx': '''import { View, Text, StyleSheet } from 'react-native';

export default function AdminAnalytics() { 
  return <View style={styles.container}><Text style={styles.title}>Analytics</Text></View>; 
}

const styles = StyleSheet.create({ 
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' }, 
  title: { fontSize: 24 } 
});''',

    'app/(admin)/payments.tsx': '''import { View, Text, StyleSheet } from 'react-native';

export default function AdminPayments() { 
  return <View style={styles.container}><Text style={styles.title}>Payment Dashboard</Text></View>; 
}

const styles = StyleSheet.create({ 
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' }, 
  title: { fontSize: 24 } 
});''',

    'app/(admin)/exceptions.tsx': '''import { View, Text, StyleSheet } from 'react-native';

export default function AdminExceptions() { 
  return <View style={styles.container}><Text style={styles.title}>System Exceptions</Text></View>; 
}

const styles = StyleSheet.create({ 
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' }, 
  title: { fontSize: 24 } 
});''',

    'app/(admin)/anomalies.tsx': '''import { View, Text, StyleSheet } from 'react-native';

export default function AdminAnomalies() { 
  return <View style={styles.container}><Text style={styles.title}>Anomalies Detection</Text></View>; 
}

const styles = StyleSheet.create({ 
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' }, 
  title: { fontSize: 24 } 
});'''
}

for rel_path, content in files.items():
    full_path = os.path.join(project_root, rel_path)
    os.makedirs(os.path.dirname(full_path), exist_ok=True)
    with open(full_path, 'w', encoding='utf-8') as f:
        f.write(content)
print("Files generated successfully.")
