import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';

import { TransactionStatus } from '../../src/types/enums';
import { useAppContext } from '../../src/store/app-context';
import { getStatusLabel, getStatusColor } from '../../src/state-machine';
import { Colors, Spacing, FontSizes, BorderRadius, Shadows } from '../../src/constants/theme';
import { CROP_DATA } from '../../src/constants/crops';

export default function OperatorDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { state } = useAppContext();
  
  const transaction = state.transactions.find(t => t.id === id);

  if (!transaction) {
    return <View style={styles.center}><Text>Transaction not found.</Text></View>;
  }

  const cropInfo = CROP_DATA[transaction.crop];
  const cropName = cropInfo ? cropInfo.displayName : transaction.crop;
  const statusColor = getStatusColor(transaction.status);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.headerCard}>
        <View style={styles.titleRow}>
          <Text style={styles.farmerName}>{transaction.farmerId}</Text>
          <View style={[styles.badge, { backgroundColor: statusColor }]}>
            <Text style={styles.badgeText}>{getStatusLabel(transaction.status)}</Text>
          </View>
        </View>
        <Text style={styles.cropInfo}>{cropName}</Text>
        <Text style={styles.tokenText}>Token: {transaction.tokenNumber || 'N/A'}</Text>
      </View>

      <Text style={styles.sectionTitle}>Details</Text>
      <View style={styles.card}>
        <View style={styles.row}>
          <Text style={styles.label}>Centre ID</Text>
          <Text style={styles.value}>{transaction.centreId}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Est. Quantity</Text>
          <Text style={styles.value}>{transaction.estimatedQuantity} kg</Text>
        </View>
        {transaction.weighingRecord && (
          <View style={styles.row}>
            <Text style={styles.label}>Net Weight</Text>
            <Text style={styles.value}>{transaction.weighingRecord.netWeight} kg</Text>
          </View>
        )}
        {transaction.qualityResult && (
          <View style={styles.row}>
            <Text style={styles.label}>Quality Grade</Text>
            <Text style={styles.value}>{transaction.qualityResult.grade}</Text>
          </View>
        )}
      </View>

      <Text style={styles.sectionTitle}>Status History</Text>
      <View style={styles.card}>
        {transaction.statusHistory.map((history, idx) => (
          <View key={idx} style={styles.historyRow}>
            <View style={styles.historyDot} />
            <View style={styles.historyContent}>
              <Text style={styles.historyStatus}>{getStatusLabel(history.status)}</Text>
              <Text style={styles.historyTime}>{new Date(history.timestamp).toLocaleString()}</Text>
              {history.notes && <Text style={styles.historyNotes}>{history.notes}</Text>}
            </View>
          </View>
        ))}
      </View>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content: { padding: Spacing.large },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  headerCard: { backgroundColor: Colors.surface, padding: Spacing.large, borderRadius: BorderRadius.medium, marginBottom: Spacing.large, ...Shadows.medium },
  titleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.small },
  farmerName: { fontSize: FontSizes.title, fontWeight: 'bold', color: Colors.textPrimary },
  badge: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: BorderRadius.small },
  badgeText: { color: Colors.surface, fontSize: FontSizes.caption, fontWeight: 'bold' },
  cropInfo: { fontSize: FontSizes.subtitle, color: Colors.textSecondary },
  tokenText: { fontSize: FontSizes.body, fontWeight: '600', color: Colors.secondary, marginTop: 8 },
  sectionTitle: { fontSize: FontSizes.subtitle, fontWeight: 'bold', marginBottom: Spacing.medium, color: Colors.textPrimary },
  card: { backgroundColor: Colors.surface, padding: Spacing.large, borderRadius: BorderRadius.medium, marginBottom: Spacing.large, ...Shadows.light },
  row: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: Spacing.small, borderBottomWidth: 1, borderBottomColor: '#eee' },
  label: { fontSize: FontSizes.body, color: Colors.textSecondary },
  value: { fontSize: FontSizes.body, fontWeight: '600', color: Colors.textPrimary },
  historyRow: { flexDirection: 'row', marginBottom: Spacing.medium },
  historyDot: { width: 12, height: 12, borderRadius: 6, backgroundColor: Colors.secondary, marginTop: 6, marginRight: Spacing.medium },
  historyContent: { flex: 1 },
  historyStatus: { fontSize: FontSizes.body, fontWeight: 'bold', color: Colors.textPrimary },
  historyTime: { fontSize: FontSizes.caption, color: Colors.textSecondary, marginTop: 2 },
  historyNotes: { fontSize: FontSizes.caption, color: Colors.textSecondary, marginTop: 4, fontStyle: 'italic' }
});
