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
  SectionHeader,
  StatusBadge,
} from '../../../src/components/common';
import { MOCK_CENTRES } from '../../../src/services/mock-data.service';

export default function MandiListScreen() {
  const router = useRouter();

  return (
    <ScreenContainer scrollable style={styles.container}>
      <SectionHeader
        title="Procurement Centres (Mandis)"
        subtitle="Select a government procurement centre near you"
      />

      {MOCK_CENTRES.map((centre) => (
        <KisanCard key={centre.id} style={styles.mandiCard}>
          <View style={styles.headerRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.mandiTitle}>{centre.name}</Text>
              <Text style={styles.mandiAddress}>{centre.address}</Text>
            </View>
            <StatusBadge status={centre.isActive ? 'OPEN' : 'CLOSED'} variant={centre.isActive ? 'success' : 'error'} />
          </View>

          <View style={styles.statsRow}>
            <View style={styles.statBox}>
              <Text style={styles.statLabel}>Delay</Text>
              <Text style={[styles.statValue, { color: centre.currentDelay > 10 ? colors.warning : colors.primary }]}>
                {centre.currentDelay} Mins
              </Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statLabel}>Capacity</Text>
              <Text style={styles.statValue}>{centre.capacity} / Day</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statLabel}>Avg Speed</Text>
              <Text style={styles.statValue}>{centre.averageServiceTime}m / Farmer</Text>
            </View>
          </View>

          <View style={styles.cropsRow}>
            <Text style={styles.cropsLabel}>Supported:</Text>
            <View style={styles.cropTags}>
              {centre.supportedCrops.slice(0, 3).map((crop) => (
                <View key={crop} style={styles.cropBadge}>
                  <Text style={styles.cropBadgeText}>{crop}</Text>
                </View>
              ))}
              {centre.supportedCrops.length > 3 && (
                <Text style={styles.moreCrops}>+{centre.supportedCrops.length - 3} more</Text>
              )}
            </View>
          </View>

          <View style={styles.actionRow}>
            <TouchableOpacity
              style={styles.detailsBtn}
              onPress={() => router.push(`/(farmer)/mandi/${centre.id}` as any)}
            >
              <Text style={styles.detailsBtnText}>View Centre Info</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.bookBtn}
              onPress={() => router.push('/(farmer)/booking/crop')}
            >
              <Text style={styles.bookBtnText}>Book Slot</Text>
              <Ionicons name="arrow-forward" size={14} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </KisanCard>
      ))}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: spacing.md,
  },
  mandiCard: {
    marginBottom: spacing.md,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.sm,
  },
  mandiTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  mandiAddress: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#F5F7FA',
    padding: spacing.sm,
    borderRadius: radius.sm,
    marginBottom: spacing.sm,
  },
  statBox: {
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 11,
    color: colors.textSecondary,
  },
  statValue: {
    fontSize: 13,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginTop: 2,
  },
  cropsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  cropsLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginRight: 6,
  },
  cropTags: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  cropBadge: {
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    marginRight: 4,
  },
  cropBadgeText: {
    fontSize: 11,
    color: colors.primary,
    fontWeight: '500',
  },
  moreCrops: {
    fontSize: 11,
    color: colors.textSecondary,
  },
  actionRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  detailsBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
  },
  detailsBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  bookBtn: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingVertical: 10,
    borderRadius: radius.sm,
    gap: 4,
  },
  bookBtnText: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
});