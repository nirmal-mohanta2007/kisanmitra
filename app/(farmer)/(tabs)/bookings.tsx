import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../../src/theme/colors';
import { spacing } from '../../../src/theme/spacing';
import { radius } from '../../../src/theme/radius';
import {
  ScreenContainer,
  KisanCard,
  StatusBadge,
  SectionHeader,
  KisanButton,
} from '../../../src/components/common';
import { MOCK_TRANSACTIONS } from '../../../src/services/mock-data.service';

export default function FarmerBookingsScreen() {
  const router = useRouter();
  const bookings = MOCK_TRANSACTIONS.filter((t) => t.farmerId === 'F-001');

  return (
    <ScreenContainer scrollable style={styles.container}>
      <SectionHeader
        title="Active Bookings"
        subtitle="Track and manage your upcoming mandi slots"
      />

      {bookings.map((booking) => (
        <KisanCard key={booking.id} style={styles.bookingCard}>
          <View style={styles.cardTop}>
            <View>
              <Text style={styles.bookingId}>{booking.id}</Text>
              <Text style={styles.cropTitle}>{booking.crop}</Text>
            </View>
            <StatusBadge status={booking.status} />
          </View>

          <View style={styles.infoGrid}>
            <View style={styles.infoCol}>
              <Text style={styles.label}>Quantity</Text>
              <Text style={styles.value}>{booking.expectedQuantity} Quintals</Text>
            </View>
            <View style={styles.infoCol}>
              <Text style={styles.label}>Token</Text>
              <Text style={styles.tokenValue}>#{booking.tokenNumber}</Text>
            </View>
            <View style={styles.infoCol}>
              <Text style={styles.label}>Slot Date</Text>
              <Text style={styles.value}>{booking.bookingDate}</Text>
            </View>
          </View>

          <View style={styles.mandiBox}>
            <Ionicons name="location-outline" size={16} color={colors.primary} />
            <Text style={styles.mandiText}>{booking.centreName}</Text>
          </View>

          <View style={styles.actionsRow}>
            <TouchableOpacity
              style={styles.secondaryBtn}
              onPress={() => router.push(`/(farmer)/booking/checklist` as any)}
            >
              <Ionicons name="list-outline" size={16} color={colors.primary} />
              <Text style={styles.secondaryBtnText}>Checklist</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.primaryBtn}
              onPress={() => router.push(`/(farmer)/queue/${booking.id}` as any)}
            >
              <Ionicons name="timer-outline" size={16} color="#FFFFFF" />
              <Text style={styles.primaryBtnText}>Track Queue</Text>
            </TouchableOpacity>
          </View>
        </KisanCard>
      ))}

      <View style={styles.newBookingSection}>
        <KisanButton
          title="+ Book New Procurement Slot"
          onPress={() => router.push('/(farmer)/booking/crop')}
          variant="primary"
        />
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: spacing.md,
  },
  bookingCard: {
    marginBottom: spacing.md,
  },
  cardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.sm,
  },
  bookingId: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  cropTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  infoGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#F5F7FA',
    padding: spacing.sm,
    borderRadius: radius.sm,
    marginBottom: spacing.sm,
  },
  infoCol: {
    flex: 1,
  },
  label: {
    fontSize: 11,
    color: colors.textSecondary,
    marginBottom: 2,
  },
  value: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  tokenValue: {
    fontSize: 15,
    fontWeight: 'bold',
    color: colors.primary,
  },
  mandiBox: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  mandiText: {
    fontSize: 13,
    color: colors.textSecondary,
    marginLeft: 6,
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  secondaryBtn: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.primary,
    backgroundColor: '#E8F5E9',
  },
  secondaryBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.primary,
    marginLeft: 4,
  },
  primaryBtn: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,
    borderRadius: radius.sm,
    backgroundColor: colors.primary,
  },
  primaryBtnText: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginLeft: 4,
  },
  newBookingSection: {
    marginVertical: spacing.lg,
  },
});