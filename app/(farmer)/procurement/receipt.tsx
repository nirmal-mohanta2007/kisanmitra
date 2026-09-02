import { View, Text, StyleSheet } from 'react-native';

export default function ProcurementReceipt() { 
  return <View style={styles.container}><Text style={styles.title}>Receipt</Text></View>; 
}

const styles = StyleSheet.create({ 
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' }, 
  title: { fontSize: 24 } 
});