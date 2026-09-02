import { View, Text, StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router';

export default function QueueTracker() { 
  const { bookingId } = useLocalSearchParams();
  return <View style={styles.container}><Text style={styles.title}>Queue for {bookingId}</Text></View>; 
}

const styles = StyleSheet.create({ 
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' }, 
  title: { fontSize: 24 } 
});