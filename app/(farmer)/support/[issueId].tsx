import { View, Text, StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router';

export default function IssueDetail() { 
  const { issueId } = useLocalSearchParams();
  return <View style={styles.container}><Text style={styles.title}>Issue {issueId}</Text></View>; 
}

const styles = StyleSheet.create({ 
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' }, 
  title: { fontSize: 24 } 
});