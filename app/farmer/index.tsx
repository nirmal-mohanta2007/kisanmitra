import React, { useMemo } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, FontSizes, BorderRadius, Shadows, TouchTargets } from '../../src/constants/theme';
import { useFarmerTransactions, useCentres } from '../../src/store/app-context';
import { getStatusLabel, getStatusLabelHi, getStatusColor, isTerminalStatus } from '../../src/state-machine';
import { CROP_DATA } from '../../src/constants/crops';
import type { ProcurementTransaction } from '../../src/types/models';

export default function FarmerHome() {
  const router = useRouter();
  const transactions = useFarmerTransactions('farmer-1');
  const centres = useCentres();

  const sortedTransactions = useMemo(() => {
    return [...transactions].sort((a, b) => {
      const aTerminal = isTerminalStatus(a.status);
      const bTerminal = isTerminalStatus(b.status);
      if (aTerminal === bTerminal) {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
      return aTerminal ? 1 : -1;
    });
  }, [transactions]);

  const renderTransaction = ({ item }: { item: ProcurementTransaction }) => {
    const centre = centres.find(c => c.id === item.centreId);
    const crop = CROP_DATA[item.crop];
    const statusColor = getStatusColor(item.status);

    return (
      <TouchableOpacity 
        style={styles.card}
        onPress={() => router.push(`/farmer/tracking?id=${item.id}`)}
      >
        <View style={styles.cardHeader}>
          <Text style={styles.tokenText}>Token #{item.tokenNumber}</Text>
          <View style={[styles.statusBadge, { backgroundColor: statusColor + '20' }]}>
            <Text style={[styles.statusText, { color: statusColor }]}>
              {getStatusLabelHi(item.status)}
            </Text>
          </View>
        </View>
        <Text style={styles.centreText}>{centre?.name || 'Unknown Centre'}</Text>
        <View style={styles.cardFooter}>
          <Text style={styles.cropText}>{crop?.emoji || '🌾'} {crop?.displayNameHi || item.crop} • {item.expectedQuantity} quintals</Text>
          <Text style={styles.dateText}>{new Date(item.bookingDate || item.createdAt).toLocaleDateString()}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: 'Kisan Mitra · किसान मित्र' }} />
      
      <View style={styles.header}>
        <Text style={styles.welcomeText}>नमस्ते, Ramesh Nayak</Text>
      </View>

      <TouchableOpacity 
        style={styles.bookButton}
        onPress={() => router.push('/farmer/book')}
      >
        <Ionicons name="calendar" size={24} color={Colors.textLight} />
        <Text style={styles.bookButtonText}>Book New Visit / विज़िट बुक करें</Text>
      </TouchableOpacity>

      <Text style={styles.sectionTitle}>My Bookings / मेरी बुकिंग</Text>
      
      <FlatList
        data={sortedTransactions}
        keyExtractor={item => item.id}
        renderItem={renderTransaction}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No bookings yet.</Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    padding: Spacing[4],
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  welcomeText: {
    fontSize: FontSizes.heading,
    fontWeight: 'bold',
    color: Colors.textPrimary,
  },
  bookButton: {
    margin: Spacing[4],
    backgroundColor: Colors.primary,
    padding: Spacing[4],
    borderRadius: BorderRadius.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: TouchTargets.minHeight,
    ...Shadows.sm,
  },
  bookButtonText: {
    color: Colors.textLight,
    fontSize: FontSizes.subheading,
    fontWeight: '600',
    marginLeft: Spacing[2],
  },
  sectionTitle: {
    fontSize: FontSizes.subheading,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginHorizontal: Spacing[4],
    marginBottom: Spacing[2],
  },
  listContainer: {
    padding: Spacing[4],
    paddingTop: 0,
  },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.md,
    padding: Spacing[4],
    marginBottom: Spacing[3],
    ...Shadows.sm,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing[2],
  },
  tokenText: {
    fontSize: FontSizes.subheading,
    fontWeight: 'bold',
    color: Colors.textPrimary,
  },
  statusBadge: {
    paddingHorizontal: Spacing[2],
    paddingVertical: Spacing[1],
    borderRadius: BorderRadius.sm,
  },
  statusText: {
    fontSize: FontSizes.caption,
    fontWeight: 'bold',
  },
  centreText: {
    fontSize: FontSizes.body,
    color: Colors.textSecondary,
    marginBottom: Spacing[2],
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: Spacing[2],
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    paddingTop: Spacing[2],
  },
  cropText: {
    fontSize: FontSizes.body,
    color: Colors.textPrimary,
  },
  dateText: {
    fontSize: FontSizes.caption,
    color: Colors.textSecondary,
  },
  emptyText: {
    textAlign: 'center',
    color: Colors.textSecondary,
    marginTop: Spacing[8],
    fontSize: FontSizes.body,
  }
});
