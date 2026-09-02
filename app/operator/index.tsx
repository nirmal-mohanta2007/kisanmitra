import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { TransactionStatus } from '../../src/types/enums';
import type { ProcurementTransaction } from '../../src/types/models';
import { getStatusLabel, getStatusColor } from '../../src/state-machine';
import { useAppContext, useQueueForCentre } from '../../src/store/app-context';
import { Colors, Spacing, FontSizes, BorderRadius, Shadows } from '../../src/constants/theme';
import { CROP_DATA } from '../../src/constants/crops';
import {
  checkInFarmer,
  moveToWaiting,
  startWeighing,
  completeProcurement,
  generateReceipt,
  initiatePayment,
  processPayment,
  completePayment
} from '../../src/services/transaction.service';

type FilterType = 'All' | 'Waiting' | 'In Progress' | 'Completed' | 'Exceptions';

export default function OperatorDashboardScreen() {
  const router = useRouter();
  const { dispatch } = useAppContext();
  const centreId = 'centre-1';
  const operatorId = 'operator-1';
  
  const allTransactions = useQueueForCentre(centreId);
  const [filter, setFilter] = useState<FilterType>('All');

  const stats = useMemo(() => {
    return {
      todayCount: allTransactions.length,
      inQueue: allTransactions.filter(t => [TransactionStatus.CHECKED_IN, TransactionStatus.WAITING].includes(t.status)).length,
      completed: allTransactions.filter(t => [TransactionStatus.PROCUREMENT_COMPLETED, TransactionStatus.RECEIPT_GENERATED, TransactionStatus.PAYMENT_COMPLETED].includes(t.status)).length,
      pendingPayment: allTransactions.filter(t => [TransactionStatus.RECEIPT_GENERATED, TransactionStatus.PAYMENT_INITIATED, TransactionStatus.PAYMENT_PROCESSING].includes(t.status)).length,
    };
  }, [allTransactions]);

  const filteredTransactions = useMemo(() => {
    let filtered = allTransactions;
    switch (filter) {
      case 'Waiting':
        filtered = allTransactions.filter(t => [TransactionStatus.BOOKED, TransactionStatus.CHECKED_IN, TransactionStatus.WAITING].includes(t.status));
        break;
      case 'In Progress':
        filtered = allTransactions.filter(t => [TransactionStatus.WEIGHING, TransactionStatus.QUALITY_CHECK, TransactionStatus.PROCUREMENT_PENDING].includes(t.status));
        break;
      case 'Completed':
        filtered = allTransactions.filter(t => [TransactionStatus.PROCUREMENT_COMPLETED, TransactionStatus.RECEIPT_GENERATED, TransactionStatus.PAYMENT_COMPLETED].includes(t.status));
        break;
      case 'Exceptions':
        filtered = allTransactions.filter(t => [TransactionStatus.QUALITY_HOLD, TransactionStatus.PAYMENT_FAILED, TransactionStatus.MISSED, TransactionStatus.CANCELLED].includes(t.status));
        break;
    }
    return filtered.sort((a, b) => (a.tokenNumber || 0) - (b.tokenNumber || 0));
  }, [allTransactions, filter]);

  const handleAction = async (transaction: ProcurementTransaction) => {
    try {
      let updatedTransaction;
      switch (transaction.status) {
        case TransactionStatus.BOOKED:
          updatedTransaction = checkInFarmer(transaction, operatorId);
          break;
        case TransactionStatus.CHECKED_IN:
          updatedTransaction = moveToWaiting(transaction, operatorId);
          break;
        case TransactionStatus.WAITING:
          updatedTransaction = startWeighing(transaction, operatorId);
          break;
        case TransactionStatus.WEIGHING:
          router.push(`/operator/weigh?id=${transaction.id}`);
          return;
        case TransactionStatus.QUALITY_CHECK:
          router.push(`/operator/quality?id=${transaction.id}`);
          return;
        case TransactionStatus.PROCUREMENT_PENDING:
          updatedTransaction = completeProcurement(transaction, operatorId);
          break;
        case TransactionStatus.PROCUREMENT_COMPLETED:
          updatedTransaction = generateReceipt(transaction, operatorId);
          break;
        case TransactionStatus.RECEIPT_GENERATED:
          updatedTransaction = initiatePayment(transaction, operatorId);
          break;
        case TransactionStatus.PAYMENT_INITIATED:
          updatedTransaction = processPayment(transaction, operatorId);
          break;
        case TransactionStatus.PAYMENT_PROCESSING:
          updatedTransaction = completePayment(transaction, operatorId);
          break;
        default:
          router.push(`/operator/detail?id=${transaction.id}`);
          return;
      }
      
      if (updatedTransaction) {
        dispatch({ type: 'UPDATE_TRANSACTION', payload: updatedTransaction });
      }
    } catch (error: any) {
      Alert.alert('Action Failed', error.message || 'An error occurred.');
    }
  };

  const getActionButtonLabel = (status: TransactionStatus): string | null => {
    switch (status) {
      case TransactionStatus.BOOKED: return 'Check In';
      case TransactionStatus.CHECKED_IN: return 'Move to Queue';
      case TransactionStatus.WAITING: return 'Start Weighing';
      case TransactionStatus.WEIGHING: return 'Record Weight';
      case TransactionStatus.QUALITY_CHECK: return 'Quality Check';
      case TransactionStatus.PROCUREMENT_PENDING: return 'Complete';
      case TransactionStatus.PROCUREMENT_COMPLETED: return 'Generate Receipt';
      case TransactionStatus.RECEIPT_GENERATED: return 'Initiate Payment';
      case TransactionStatus.PAYMENT_INITIATED: return 'Process Payment';
      case TransactionStatus.PAYMENT_PROCESSING: return 'Complete Payment';
      default: return 'View Details';
    }
  };

  const renderTransactionItem = ({ item }: { item: ProcurementTransaction }) => {
    const actionLabel = getActionButtonLabel(item.status);
    const cropInfo = CROP_DATA[item.crop];
    const cropName = cropInfo ? cropInfo.displayName : item.crop;
    const statusColor = getStatusColor(item.status);

    return (
      <TouchableOpacity 
        style={styles.card}
        onPress={() => router.push(`/operator/detail?id=${item.id}`)}
      >
        <View style={styles.cardHeader}>
          <Text style={[styles.tokenText, { color: statusColor }]}>{item.tokenNumber || 'No Token'}</Text>
          <View style={[styles.badge, { backgroundColor: statusColor + '20' }]}>
            <Text style={[styles.badgeText, { color: statusColor }]}>{getStatusLabel(item.status)}</Text>
          </View>
        </View>
        
        <View style={styles.cardBody}>
          <Text style={styles.farmerName}>{item.farmerId}</Text>
          <Text style={styles.cropInfo}>{cropName} • {item.estimatedQuantity} kg est.</Text>
        </View>

        {actionLabel && (
          <TouchableOpacity 
            style={[styles.actionButton, { backgroundColor: statusColor }]}
            onPress={() => handleAction(item)}
          >
            <Text style={styles.actionButtonText}>{actionLabel}</Text>
          </TouchableOpacity>
        )}
      </TouchableOpacity>
    );
  };

  const renderStatCard = (title: string, value: number) => (
    <View style={styles.statCard}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statTitle}>{title}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.statsContainer}>
        {renderStatCard('Today', stats.todayCount)}
        {renderStatCard('Queue', stats.inQueue)}
        {renderStatCard('Done', stats.completed)}
        {renderStatCard('To Pay', stats.pendingPayment)}
      </View>

      <View style={styles.filterContainer}>
        {(['All', 'Waiting', 'In Progress', 'Completed', 'Exceptions'] as FilterType[]).map((f) => (
          <TouchableOpacity
            key={f}
            style={[styles.filterTab, filter === f && styles.filterTabActive]}
            onPress={() => setFilter(f)}
          >
            <Text style={[styles.filterText, filter === f && styles.filterTextActive]}>{f}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={filteredTransactions}
        keyExtractor={(item) => item.id}
        renderItem={renderTransactionItem}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={<Text style={styles.emptyText}>No transactions found.</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  statsContainer: { flexDirection: 'row', padding: Spacing.medium, justifyContent: 'space-between', backgroundColor: Colors.surface, ...Shadows.light },
  statCard: { alignItems: 'center', flex: 1 },
  statValue: { fontSize: FontSizes.title, fontWeight: 'bold', color: Colors.secondary },
  statTitle: { fontSize: FontSizes.caption, color: Colors.textSecondary, marginTop: 4 },
  filterContainer: { flexDirection: 'row', paddingHorizontal: Spacing.small, paddingVertical: Spacing.medium },
  filterTab: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, marginHorizontal: 4, backgroundColor: '#e0e0e0' },
  filterTabActive: { backgroundColor: Colors.secondary },
  filterText: { fontSize: FontSizes.caption, color: Colors.textSecondary, fontWeight: '600' },
  filterTextActive: { color: Colors.surface },
  listContainer: { padding: Spacing.medium },
  card: { backgroundColor: Colors.surface, borderRadius: BorderRadius.medium, padding: Spacing.medium, marginBottom: Spacing.medium, ...Shadows.medium },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.small },
  tokenText: { fontSize: FontSizes.subtitle, fontWeight: 'bold' },
  badge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4 },
  badgeText: { fontSize: FontSizes.caption, fontWeight: 'bold' },
  cardBody: { marginBottom: Spacing.medium },
  farmerName: { fontSize: FontSizes.body, fontWeight: '600', color: Colors.textPrimary },
  cropInfo: { fontSize: FontSizes.body, color: Colors.textSecondary, marginTop: 2 },
  actionButton: { padding: Spacing.medium, borderRadius: BorderRadius.small, alignItems: 'center' },
  actionButtonText: { color: Colors.surface, fontWeight: 'bold', fontSize: FontSizes.body },
  emptyText: { textAlign: 'center', color: Colors.textSecondary, marginTop: 40, fontSize: FontSizes.body },
});
