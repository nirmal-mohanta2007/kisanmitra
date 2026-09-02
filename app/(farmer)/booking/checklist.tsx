import { View, Text, StyleSheet } from 'react-native';

export default function BookingChecklist() { 
  return <View style={styles.container}><Text style={styles.title}>Checklist</Text></View>; 
}

const styles = StyleSheet.create({ 
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' }, 
  title: { fontSize: 24 } 
});