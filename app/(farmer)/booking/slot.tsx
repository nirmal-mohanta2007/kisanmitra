import { View, Text, StyleSheet } from 'react-native';

export default function BookingSlot() { 
  return <View style={styles.container}><Text style={styles.title}>Pick Slot</Text></View>; 
}

const styles = StyleSheet.create({ 
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' }, 
  title: { fontSize: 24 } 
});