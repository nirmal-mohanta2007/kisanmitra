import { View, Text, StyleSheet } from 'react-native';

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
});