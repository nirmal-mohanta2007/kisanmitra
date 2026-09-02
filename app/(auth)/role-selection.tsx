import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
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
});