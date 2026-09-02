import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Stack, useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, FontSizes, BorderRadius, Shadows, TouchTargets } from '../../src/constants/theme';
import { useTransaction, useCentre, useAppContext } from '../../src/store/app-context';
import { CROP_DATA } from '../../src/constants/crops';
import { calculateETA, formatWaitTime, formatArrivalTime } from '../../src/services/eta.service';

export default function FarmerConfirmation() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const tx = useTransaction(id);
  const centre = useCentre(tx?.centreId || '');
  const { state } = useAppContext();

  if (!tx || !centre) {
    return (
      <View style={styles.container}>
        <Text>Transaction not found.</Text>
      </View>
    );
  }

  const crop = CROP_DATA[tx.crop];
  const eta = calculateETA(tx, state.transactions, centre);

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: 'Booking Confirmed', headerLeft: () => null }} />
      
      <View style={styles.successHeader}>
        <Ionicons name="checkmark-circle" size={80} color={Colors.primary} />
        <Text style={styles.successTitle}>Booking Confirmed! / बुकिंग पुष्टि!</Text>
        <Text style={styles.txId}>ID: {tx.id}</Text>
      </View>

      <View style={styles.tokenCard}>
        <Text style={styles.tokenLabel}>Your Token Number / आपका टोकन नंबर</Text>
        <Text style={styles.tokenNumber}>#{tx.tokenNumber}</Text>
      </View>

      <View style={styles.detailsCard}>
        <Text style={styles.detailRow}>Centre: {centre.name}</Text>
        <Text style={styles.detailRow}>Crop: {crop?.displayNameHi || tx.crop} ({tx.expectedQuantity} qtl)</Text>
        <Text style={styles.detailRow}>Date: {new Date(tx.bookingDate).toLocaleDateString()} ({tx.slotLabel})</Text>
      </View>

      <View style={styles.etaCard}>
        <Text style={styles.etaTitle}>Estimated Arrival Time</Text>
        <Text style={styles.etaValue}>{formatArrivalTime(eta.recommendedArrivalTime)}</Text>
        <Text style={styles.etaSubtitle}>Tokens ahead: {eta.tokensAhead} • Wait: {formatWaitTime(eta.estimatedWaitMinutes)}</Text>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity 
          style={styles.trackBtn}
          onPress={() => router.replace(`/farmer/tracking?id=${tx.id}`)}
        >
          <Text style={styles.trackBtnText}>Track Your Booking</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.homeBtn}
          onPress={() => router.replace('/farmer')}
        >
          <Text style={styles.homeBtnText}>Back to Home</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    padding: Spacing[4],
  },
  successHeader: {
    alignItems: 'center',
    marginVertical: Spacing[6],
  },
  successTitle: {
    fontSize: FontSizes.heading,
    fontWeight: 'bold',
    color: Colors.primary,
    marginTop: Spacing[4],
    textAlign: 'center',
  },
  txId: {
    fontSize: FontSizes.caption,
    color: Colors.textSecondary,
    marginTop: Spacing[2],
  },
  tokenCard: {
    backgroundColor: Colors.surface,
    padding: Spacing[6],
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
    marginBottom: Spacing[4],
    ...Shadows.md,
  },
  tokenLabel: {
    fontSize: FontSizes.body,
    color: Colors.textSecondary,
  },
  tokenNumber: {
    fontSize: 64,
    fontWeight: 'bold',
    color: Colors.primary,
  },
  detailsCard: {
    backgroundColor: Colors.surface,
    padding: Spacing[4],
    borderRadius: BorderRadius.md,
    marginBottom: Spacing[4],
    ...Shadows.sm,
  },
  detailRow: {
    fontSize: FontSizes.body,
    color: Colors.textPrimary,
    marginBottom: Spacing[2],
  },
  etaCard: {
    backgroundColor: Colors.secondary + '20',
    padding: Spacing[4],
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    marginBottom: Spacing[6],
  },
  etaTitle: {
    fontSize: FontSizes.body,
    color: Colors.secondary,
    fontWeight: '600',
  },
  etaValue: {
    fontSize: FontSizes.heading,
    fontWeight: 'bold',
    color: Colors.secondary,
    marginVertical: Spacing[2],
  },
  etaSubtitle: {
    fontSize: FontSizes.caption,
    color: Colors.textSecondary,
  },
  actions: {
    marginTop: 'auto',
    gap: Spacing[3],
  },
  trackBtn: {
    backgroundColor: Colors.primary,
    padding: Spacing[4],
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
    minHeight: TouchTargets.minHeight,
  },
  trackBtnText: {
    color: Colors.textLight,
    fontSize: FontSizes.subheading,
    fontWeight: 'bold',
  },
  homeBtn: {
    backgroundColor: Colors.surface,
    padding: Spacing[4],
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
    minHeight: TouchTargets.minHeight,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  homeBtnText: {
    color: Colors.textPrimary,
    fontSize: FontSizes.subheading,
    fontWeight: 'bold',
  }
});
