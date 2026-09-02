import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Stack, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, FontSizes, BorderRadius, Shadows } from '../../src/constants/theme';
import { useTransaction, useCentre, useAppContext } from '../../src/store/app-context';
import { getStatusLabel, getStatusLabelHi, getStatusColor, getStatusIcon, isExceptionStatus } from '../../src/state-machine';
import { CROP_DATA } from '../../src/constants/crops';
import { calculateETA, formatWaitTime, formatArrivalTime } from '../../src/services/eta.service';
import { TransactionStatus } from '../../src/types/enums';

export default function FarmerTracking() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const tx = useTransaction(id);
  const centre = useCentre(tx?.centreId || '');
  const { state } = useAppContext();

  if (!tx || !centre) return <View style={styles.container}><Text>Not found</Text></View>;

  const crop = CROP_DATA[tx.crop];
  const statusColor = getStatusColor(tx.status);
  const statusIcon = getStatusIcon(tx.status);
  const isException = isExceptionStatus(tx.status);
  
  const showETA = [TransactionStatus.BOOKED, TransactionStatus.CHECKED_IN, TransactionStatus.WAITING].includes(tx.status);
  const eta = showETA ? calculateETA(tx, state.transactions, centre) : null;

  return (
    <ScrollView style={styles.container}>
      <Stack.Screen options={{ title: 'Track Booking' }} />

      <View style={styles.header}>
        <Text style={styles.tokenNumber}>#{tx.tokenNumber}</Text>
        <View style={styles.headerDetails}>
          <Text style={styles.centreName}>{centre.name}</Text>
          <Text style={styles.cropDetails}>{crop?.displayNameHi || tx.crop} • {tx.expectedQuantity} qtl</Text>
        </View>
      </View>

      <View style={[styles.statusBanner, { backgroundColor: statusColor }]}>
        <Ionicons name={statusIcon as any} size={32} color={Colors.textLight} />
        <View style={styles.statusTextContainer}>
          <Text style={styles.statusLabelEn}>{getStatusLabel(tx.status)}</Text>
          <Text style={styles.statusLabelHi}>{getStatusLabelHi(tx.status)}</Text>
        </View>
      </View>

      {isException && (tx.exceptions?.length > 0 || tx.exceptionData) && (
        <View style={styles.exceptionAlert}>
          <Ionicons name="warning" size={24} color={Colors.error} />
          <View style={styles.exceptionInfo}>
            <Text style={styles.exceptionTitle}>Attention Required</Text>
            <Text style={styles.exceptionText}>{tx.exceptions?.[0]?.reason || tx.exceptionData?.reason}</Text>
          </View>
        </View>
      )}

      {showETA && eta && (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Estimated Time</Text>
          <View style={styles.etaGrid}>
            <View style={styles.etaItem}>
              <Text style={styles.etaLabel}>Queue Position</Text>
              <Text style={styles.etaValue}>{eta.tokensAhead + 1}</Text>
            </View>
            <View style={styles.etaItem}>
              <Text style={styles.etaLabel}>Est. Wait</Text>
              <Text style={styles.etaValue}>{formatWaitTime(eta.estimatedWaitMinutes)}</Text>
            </View>
            <View style={styles.etaItem}>
              <Text style={styles.etaLabel}>Arrival</Text>
              <Text style={styles.etaValue}>{formatArrivalTime(eta.recommendedArrivalTime)}</Text>
            </View>
          </View>
        </View>
      )}

      {(tx.weighing || tx.weighingData) && (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Weighing Details</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Gross Weight:</Text>
            <Text style={styles.value}>{(tx.weighing?.grossWeight ?? tx.weighingData?.grossWeight)} qtl</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Tare Weight:</Text>
            <Text style={styles.value}>{(tx.weighing?.tareWeight ?? tx.weighingData?.tareWeight)} qtl</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Net Weight:</Text>
            <Text style={styles.value}>{(tx.weighing?.netWeight ?? tx.weighingData?.netWeight)} qtl</Text>
          </View>
        </View>
      )}

      {(tx.qualityCheck || tx.qualityData) && (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Quality Report</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Grade:</Text>
            <Text style={styles.value}>{(tx.qualityCheck?.grade ?? tx.qualityData?.grade)}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Moisture:</Text>
            <Text style={styles.value}>{(tx.qualityCheck?.moisturePercent ?? tx.qualityData?.moisture)}%</Text>
          </View>
          {(tx.qualityCheck?.observations || tx.qualityData?.observations) && (
            <View style={styles.row}>
              <Text style={styles.label}>Notes:</Text>
              <Text style={styles.value}>{(tx.qualityCheck?.observations || tx.qualityData?.observations)}</Text>
            </View>
          )}
        </View>
      )}

      {(tx.procurementAmount || tx.receiptData) && (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Receipt Details</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Accepted Qty:</Text>
            <Text style={styles.value}>{(tx.weighing?.netWeight ?? tx.expectedQuantity)} qtl</Text>
          </View>
          <View style={[styles.row, styles.totalRow]}>
            <Text style={styles.totalLabel}>Total Amount:</Text>
            <Text style={styles.totalValue}>₹{(tx.procurementAmount ?? tx.receiptData?.totalAmount)?.toLocaleString('en-IN')}</Text>
          </View>
        </View>
      )}

      {(tx.payment || tx.paymentData) && (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Payment Status</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Status:</Text>
            <Text style={styles.value}>{(tx.payment?.method || 'BANK_TRANSFER')} - {(tx.payment?.referenceNumber ? 'Completed' : 'Processing')}</Text>
          </View>
          {tx.payment?.referenceNumber && (
            <View style={styles.row}>
              <Text style={styles.label}>Reference:</Text>
              <Text style={styles.value}>{tx.payment.referenceNumber}</Text>
            </View>
          )}
        </View>
      )}

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Journey Timeline</Text>
        {tx.statusHistory.map((history, index) => (
          <View key={index} style={styles.timelineItem}>
            <View style={styles.timelineLine} />
            <View style={[styles.timelineDot, { backgroundColor: getStatusColor(history.status) }]} />
            <View style={styles.timelineContent}>
              <Text style={styles.timelineStatus}>{getStatusLabel(history.status)}</Text>
              <Text style={styles.timelineTime}>{new Date(history.timestamp).toLocaleString()}</Text>
              {history.notes && <Text style={styles.timelineNotes}>{history.notes}</Text>}
            </View>
          </View>
        ))}
      </View>

      <View style={{height: Spacing[8]}} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    padding: Spacing[4],
    backgroundColor: Colors.surface,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  tokenNumber: {
    fontSize: 48,
    fontWeight: 'bold',
    color: Colors.primary,
    marginRight: Spacing[4],
  },
  headerDetails: {
    flex: 1,
  },
  centreName: {
    fontSize: FontSizes.subheading,
    fontWeight: 'bold',
    color: Colors.textPrimary,
  },
  cropDetails: {
    fontSize: FontSizes.body,
    color: Colors.textSecondary,
    marginTop: Spacing[1],
  },
  statusBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing[4],
  },
  statusTextContainer: {
    marginLeft: Spacing[4],
  },
  statusLabelEn: {
    fontSize: FontSizes.subheading,
    fontWeight: 'bold',
    color: Colors.textLight,
  },
  statusLabelHi: {
    fontSize: FontSizes.body,
    color: Colors.textLight,
    opacity: 0.9,
  },
  exceptionAlert: {
    flexDirection: 'row',
    backgroundColor: Colors.error + '20',
    padding: Spacing[4],
    margin: Spacing[4],
    borderRadius: BorderRadius.md,
    alignItems: 'center',
  },
  exceptionInfo: {
    marginLeft: Spacing[3],
    flex: 1,
  },
  exceptionTitle: {
    color: Colors.error,
    fontWeight: 'bold',
    fontSize: FontSizes.body,
  },
  exceptionText: {
    color: Colors.error,
    fontSize: FontSizes.caption,
    marginTop: Spacing[1],
  },
  card: {
    backgroundColor: Colors.surface,
    margin: Spacing[4],
    marginBottom: 0,
    padding: Spacing[4],
    borderRadius: BorderRadius.md,
    ...Shadows.sm,
  },
  cardTitle: {
    fontSize: FontSizes.subheading,
    fontWeight: 'bold',
    color: Colors.textPrimary,
    marginBottom: Spacing[3],
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    paddingBottom: Spacing[2],
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing[2],
  },
  label: {
    fontSize: FontSizes.body,
    color: Colors.textSecondary,
  },
  value: {
    fontSize: FontSizes.body,
    color: Colors.textPrimary,
    fontWeight: '500',
  },
  totalRow: {
    marginTop: Spacing[2],
    paddingTop: Spacing[2],
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  totalLabel: {
    fontSize: FontSizes.subheading,
    color: Colors.textPrimary,
    fontWeight: 'bold',
  },
  totalValue: {
    fontSize: FontSizes.subheading,
    color: Colors.primary,
    fontWeight: 'bold',
  },
  etaGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  etaItem: {
    alignItems: 'center',
  },
  etaLabel: {
    fontSize: FontSizes.caption,
    color: Colors.textSecondary,
    marginBottom: Spacing[1],
  },
  etaValue: {
    fontSize: FontSizes.body,
    fontWeight: 'bold',
    color: Colors.secondary,
  },
  timelineItem: {
    flexDirection: 'row',
    marginBottom: Spacing[4],
  },
  timelineLine: {
    position: 'absolute',
    left: 7,
    top: 20,
    bottom: -20,
    width: 2,
    backgroundColor: Colors.border,
  },
  timelineDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginTop: 4,
    marginRight: Spacing[3],
    zIndex: 1,
  },
  timelineContent: {
    flex: 1,
  },
  timelineStatus: {
    fontSize: FontSizes.body,
    fontWeight: 'bold',
    color: Colors.textPrimary,
  },
  timelineTime: {
    fontSize: FontSizes.caption,
    color: Colors.textSecondary,
  },
  timelineNotes: {
    fontSize: FontSizes.caption,
    color: Colors.textPrimary,
    marginTop: Spacing[1],
    backgroundColor: Colors.background,
    padding: Spacing[2],
    borderRadius: BorderRadius.sm,
  }
});
