import { View, Text, StyleSheet } from 'react-native';

export default function Bookings() { 
  return <View style={styles.container}><Text style={styles.title}>Bookings</Text></View>; 
}

const styles = StyleSheet.create({ 
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' }, 
  title: { fontSize: 24 } 
});