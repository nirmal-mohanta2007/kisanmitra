import { View, Text, StyleSheet } from 'react-native';

export default function AdminDashboard() { 
  return <View style={styles.container}><Text style={styles.title}>Central Command</Text></View>; 
}

const styles = StyleSheet.create({ 
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' }, 
  title: { fontSize: 24 } 
});