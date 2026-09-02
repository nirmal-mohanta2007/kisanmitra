import { View, Text, StyleSheet } from 'react-native';

export default function BookingCrop() { 
  return <View style={styles.container}><Text style={styles.title}>Select Crop</Text></View>; 
}

const styles = StyleSheet.create({ 
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' }, 
  title: { fontSize: 24 } 
});