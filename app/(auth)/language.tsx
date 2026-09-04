import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

export default function LanguageScreen() {
  const router = useRouter();

  const handleLanguageSelect = (lang: string) => {
    router.push('/(auth)/role-selection');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Select Language / भाषा चुनें</Text>
      
      {['हिंदी (Hindi)', 'English'].map((lang) => (
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
});