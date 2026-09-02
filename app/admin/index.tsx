import React, { useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { TransactionStatus } from '../../src/types/enums';
import type { ProcurementTransaction, Centre } from '../../src/types/models';
import { getStatusLabel, getStatusColor, isExceptionStatus } from '../../src/state-machine';
import { useTransactions, useCentres } from '../../src/store/app-context';
import { Colors, Spacing, FontSizes, BorderRadius, Shadows } from '../../src/constants/theme';
import { CROP_DATA } from '../../src/constants/crops';

export default function AdminDashboard() {
  const transactions = useTransactions();
  const centres = useCentres();

  const now = new Date();
  
  // Calculate aggregate stats
  const stats = useMemo(() => {
    let todayBookings = 0;
    let activeQueue = 0;
    let totalWaitTime = 0;
    let waitTimeCount = 0;
    let procCompleted = 0;
    let procPending = 0;
    let payPending = 0;
    let payCompleted = 0;
    let payAmount = 0;

    const todayStr = now.toISOString().split('T')[0];

    transactions.forEach(t => {
      // Today's bookings
      if (t.createdAt.startsWith(todayStr)) {
        todayBookings++;
      }

      // Active Queue (e.g. BOOKED, CHECKED_IN, WAITING, WEIGHING, QUALITY_CHECK)
      if ([TransactionStatus.BOOKED, TransactionStatus.CHECKED_IN, TransactionStatus.WAITING, TransactionStatus.WEIGHING, TransactionStatus.QUALITY_CHECK].includes(t.status)) {
        activeQueue++;
      }

      if (t.status === TransactionStatus.PROCUREMENT_COMPLETED) {
        procCompleted++;
      }
      
      if (t.status === TransactionStatus.PROCUREMENT_PENDING) {
         procPending++;
      }
      
      if (t.status === TransactionStatus.PAYMENT_INITIATED || t.status === TransactionStatus.PAYMENT_PROCESSING) {
        payPending++;
      }

      if (t.status === TransactionStatus.PAYMENT_COMPLETED) {
        payCompleted++;
        payAmount += t.procurementAmount || 0;
      }

      // Wait time approximation (using diff from createdAt to now if not terminal)
      if (t.status === TransactionStatus.CHECKED_IN || t.status === TransactionStatus.WAITING) {
         const waitMin = (now.getTime() - new Date(t.updatedAt).getTime()) / 60000;
         totalWaitTime += waitMin;
         waitTimeCount++;
      }
    });

    return {
      totalCentres: centres.length,
      todayBookings,
      activeQueue,
      avgWaitTime: waitTimeCount > 0 ? Math.round(totalWaitTime / waitTimeCount) : 0,
      procCompleted,
      procPending,
      payPending,
      payCompleted,
      payAmount,
    };
  }, [transactions, centres]);

  // Centre performance
  const centreStats = useMemo(() => {
    return centres.map(centre => {
      const centreTx = transactions.filter(t => t.centreId === centre.id);
      
      let queueSize = 0;
      let completedToday = 0;
      let totalWait = 0;
      let waitCount = 0;
      let exceptions = 0;

      const todayStr = now.toISOString().split('T')[0];

      centreTx.forEach(t => {
        if ([TransactionStatus.BOOKED, TransactionStatus.CHECKED_IN, TransactionStatus.WAITING].includes(t.status)) queueSize++;
        if (t.status === TransactionStatus.PAYMENT_COMPLETED && t.updatedAt.startsWith(todayStr)) completedToday++;
        if (isExceptionStatus(t.status)) exceptions++;

        if (t.status === TransactionStatus.CHECKED_IN || t.status === TransactionStatus.WAITING) {
           const waitMin = (now.getTime() - new Date(t.updatedAt).getTime()) / 60000;
           totalWait += waitMin;
           waitCount++;
        }
      });

      const avgWait = waitCount > 0 ? Math.round(totalWait / waitCount) : 0;

      return {
        ...centre,
        queueSize,
        completedToday,
        avgWait,
        exceptions
      };
    });
  }, [centres, transactions]);

  // Recent transactions
  const recentTransactions = useMemo(() => {
    return [...transactions]
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
      .slice(0, 10);
  }, [transactions]);

  // Exceptions
  const exceptions = useMemo(() => {
    return transactions.filter(t => isExceptionStatus(t.status));
  }, [transactions]);

  const KPICard = ({ title, value, icon, color }: any) => (
    <View style={styles.kpiCard}>
      <View style={[styles.kpiIconBox, { backgroundColor: color + '20' }]}>
        <Ionicons name={icon} size={24} color={color} />
      </View>
      <Text style={styles.kpiTitle}>{title}</Text>
      <Text style={[styles.kpiValue, { color }]}>{value}</Text>
    </View>
  );

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Stack.Screen options={{ title: 'Admin Dashboard' }} />
      
      {/* Header Section */}
      <View style={styles.header}>
        <Text style={styles.title}>Kisan Mitra — Admin Dashboard</Text>
        <View style={styles.demoBadge}>
          <Text style={styles.demoText}>Demo Mode · Not connected to government systems</Text>
        </View>
        <Text style={styles.timestamp}>Last updated: {now.toLocaleString()}</Text>
      </View>

      {/* KPI Cards */}
      <View style={styles.kpiGrid}>
        <KPICard title="Total Centres" value={stats.totalCentres} icon="business-outline" color="#1565C0" />
        <KPICard title="Today's Bookings" value={stats.todayBookings} icon="calendar-outline" color="#2E7D32" />
        <KPICard title="Active Queue" value={stats.activeQueue} icon="people-outline" color="#E65100" />
        <KPICard title="Avg Wait Time" value={`${stats.avgWaitTime}m`} icon="time-outline" color="#1565C0" />
        <KPICard title="Procurement Done" value={stats.procCompleted} icon="checkmark-done-outline" color="#2E7D32" />
        <KPICard title="Procurement Pnd" value={stats.procPending} icon="hourglass-outline" color="#9C27B0" />
        <KPICard title="Payment Pending" value={stats.payPending} icon="card-outline" color="#E65100" />
        <KPICard title="Payment Done" value={`${stats.payCompleted} (₹${stats.payAmount.toLocaleString()})`} icon="cash-outline" color="#2E7D32" />
      </View>

      {/* Centre Performance Table */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Centre Performance</Text>
        {centreStats.map(centre => {
           let indicatorColor = '#2E7D32'; // Green
           if (centre.avgWait > 30) indicatorColor = '#C62828'; // Red
           else if (centre.avgWait >= 10) indicatorColor = '#F9A825'; // Yellow

           return (
             <View key={centre.id} style={styles.centreCard}>
                <View style={styles.centreHeader}>
                   <View style={styles.centreNameRow}>
                      <View style={[styles.indicator, { backgroundColor: indicatorColor }]} />
                      <Text style={styles.centreName}>{centre.name}</Text>
                   </View>
                   <Text style={styles.centreDistrict}>{centre.district}</Text>
                </View>
                <View style={styles.centreStatsRow}>
                   <View style={styles.cStat}>
                      <Text style={styles.cStatLabel}>Queue</Text>
                      <Text style={styles.cStatValue}>{centre.queueSize}</Text>
                   </View>
                   <View style={styles.cStat}>
                      <Text style={styles.cStatLabel}>Completed</Text>
                      <Text style={styles.cStatValue}>{centre.completedToday}</Text>
                   </View>
                   <View style={styles.cStat}>
                      <Text style={styles.cStatLabel}>Avg Wait</Text>
                      <Text style={styles.cStatValue}>{centre.avgWait}m</Text>
                   </View>
                   <View style={styles.cStat}>
                      <Text style={styles.cStatLabel}>Exceptions</Text>
                      <Text style={[styles.cStatValue, centre.exceptions > 0 && { color: '#C62828' }]}>{centre.exceptions}</Text>
                   </View>
                </View>
             </View>
           );
        })}
      </View>

      {/* Exception Monitor */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: '#C62828' }]}>Exception Monitor ({exceptions.length})</Text>
        {exceptions.length === 0 ? (
           <Text style={styles.emptyText}>No active exceptions.</Text>
        ) : (
          exceptions.map(ex => (
            <View key={ex.id} style={styles.exceptionCard}>
              <View style={styles.exRow}>
                <Text style={styles.exToken}>{ex.tokenNumber ? `#${ex.tokenNumber}` : ex.id}</Text>
                <Text style={styles.exTime}>{new Date(ex.updatedAt).toLocaleTimeString()}</Text>
              </View>
              <Text style={styles.exFarmer}>Farmer ID: {ex.farmerId}</Text>
              <View style={styles.exBadge}>
                 <Text style={styles.exBadgeText}>{getStatusLabel(ex.status)}</Text>
              </View>
            </View>
          ))
        )}
      </View>

      {/* Recent Transactions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recent Transactions</Text>
        {recentTransactions.map(tx => {
           const centre = centres.find(c => c.id === tx.centreId);
           const cropInfo = CROP_DATA[tx.crop];
           const cropName = cropInfo ? cropInfo.displayName : tx.crop;
           const statusColor = getStatusColor(tx.status);
           return (
            <View key={tx.id} style={styles.txCard}>
               <View style={styles.txHeader}>
                 <Text style={styles.txToken}>{tx.tokenNumber ? `#${tx.tokenNumber}` : tx.id}</Text>
                 <Text style={styles.txTime}>{new Date(tx.updatedAt).toLocaleTimeString()}</Text>
               </View>
               <Text style={styles.txDetails}>{tx.farmerName || tx.farmerId} • {centre?.name || tx.centreName} • {cropName}</Text>
               <View style={[styles.txBadge, { backgroundColor: statusColor + '20' }]}>
                 <Text style={[styles.txBadgeText, { color: statusColor }]}>{getStatusLabel(tx.status)}</Text>
               </View>
            </View>
           );
        })}
      </View>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  content: {
    padding: Spacing[4],
  },
  header: {
    marginBottom: Spacing[4],
  },
  title: {
    fontSize: FontSizes.heading,
    fontWeight: 'bold',
    color: '#212121',
    marginBottom: Spacing[2],
  },
  demoBadge: {
    backgroundColor: '#FF8F0020',
    paddingHorizontal: Spacing[3],
    paddingVertical: Spacing[1],
    borderRadius: BorderRadius.round,
    alignSelf: 'flex-start',
    marginBottom: Spacing[2],
  },
  demoText: {
    color: '#FF8F00',
    fontSize: FontSizes.caption,
    fontWeight: 'bold',
  },
  timestamp: {
    color: '#757575',
    fontSize: FontSizes.caption,
  },
  kpiGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: Spacing[4],
  },
  kpiCard: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderRadius: BorderRadius.card,
    padding: Spacing[3],
    marginBottom: Spacing[3],
    ...Shadows.sm,
  },
  kpiIconBox: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing[2],
  },
  kpiTitle: {
    fontSize: FontSizes.caption,
    color: '#757575',
    marginBottom: Spacing[1],
  },
  kpiValue: {
    fontSize: FontSizes.subheading,
    fontWeight: 'bold',
  },
  section: {
    marginBottom: Spacing[5],
  },
  sectionTitle: {
    fontSize: FontSizes.subheading,
    fontWeight: 'bold',
    color: '#212121',
    marginBottom: Spacing[3],
  },
  centreCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: BorderRadius.card,
    padding: Spacing[3],
    marginBottom: Spacing[3],
    ...Shadows.sm,
  },
  centreHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing[3],
  },
  centreNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  indicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: Spacing[2],
  },
  centreName: {
    fontSize: FontSizes.body,
    fontWeight: 'bold',
    color: '#212121',
  },
  centreDistrict: {
    fontSize: FontSizes.caption,
    color: '#757575',
  },
  centreStatsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cStat: {
    alignItems: 'center',
  },
  cStatLabel: {
    fontSize: 12,
    color: '#757575',
    marginBottom: 2,
  },
  cStatValue: {
    fontSize: FontSizes.body,
    fontWeight: 'bold',
    color: '#212121',
  },
  exceptionCard: {
    backgroundColor: '#FFF0F0',
    borderLeftWidth: 4,
    borderLeftColor: '#C62828',
    borderRadius: BorderRadius.card,
    padding: Spacing[3],
    marginBottom: Spacing[2],
  },
  exRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing[1],
  },
  exToken: {
    fontWeight: 'bold',
    color: '#C62828',
  },
  exTime: {
    fontSize: FontSizes.caption,
    color: '#757575',
  },
  exFarmer: {
    fontSize: FontSizes.body,
    color: '#212121',
    marginBottom: Spacing[2],
  },
  exBadge: {
    backgroundColor: '#C62828',
    alignSelf: 'flex-start',
    paddingHorizontal: Spacing[2],
    paddingVertical: 2,
    borderRadius: 4,
  },
  exBadgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  txCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: BorderRadius.card,
    padding: Spacing[3],
    marginBottom: Spacing[2],
    ...Shadows.sm,
  },
  txHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing[1],
  },
  txToken: {
    fontWeight: 'bold',
    color: '#212121',
  },
  txTime: {
    fontSize: FontSizes.caption,
    color: '#757575',
  },
  txDetails: {
    fontSize: FontSizes.caption,
    color: '#757575',
    marginBottom: Spacing[2],
  },
  txBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: Spacing[2],
    paddingVertical: 4,
    borderRadius: 4,
  },
  txBadgeText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  emptyText: {
    color: '#757575',
    fontStyle: 'italic',
  }
});
