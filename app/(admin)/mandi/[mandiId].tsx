import { View, Text, StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router';

export default function AdminMandiDetail() { 
  const { mandiId } = useLocalSearchParams();
  return <View style={styles.container}><Text style={styles.title}>Mandi Monitor: {mandiId}</Text></View>; 
}

const styles = StyleSheet.create({ 
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' }, 
  title: { fontSize: 24 } 
});