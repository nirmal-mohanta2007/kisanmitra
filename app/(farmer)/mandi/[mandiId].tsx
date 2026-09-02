import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../../src/theme/colors';
import { spacing } from '../../../src/theme/spacing';
import { radius } from '../../../src/theme/radius';
import {
  ScreenContainer,
  KisanCard,
  SectionHeader,
  StatusBadge,
  KisanButton,
} from '../../../src/components/common';
import { MOCK_CENTRES } from '../../../src/services/mock-data.service';

export default function MandiDetailScreen() {
  const router = useRouter();
  const { mandiId } = useLocalSearchParams();
  const centre = MOCK_CENTRES.find((c) => c.id === mandiId) || MOCK_CENTRES[0];

  return (
    <ScreenContainer scrollable style={styles.container}>
      {/* Centre Overview Card */}
      <KisanCard style={styles.overviewCard}>
        <View style={styles.topRow}>
          <Text style={styles.mandiName}>{centre.name}</Text>
          <StatusBadge status={centre.isActive ? 'OPERATIONAL' : 'CLOSED'} variant="success" />
        </View>

        <Text style={styles.address}>📍 {centre.address}, {centre.district}, {centre.state}</Text>

        <View style={styles.hoursBox}>
          <Ionicons name="time-outline" size={18} color={colors.primary} />
          <Text style={styles.hoursText}>
            Operating Hours: {centre.operatingHours.open} AM - {centre.operatingHours.close} PM
          </Text>
        </View>
      </KisanCard>

      {/* Real-time Status */}
      <SectionHeader title="Real-Time Mandi Status" subtitle="Live queue and delay metrics" />
      <View style={styles.metricGrid}>
        <KisanCard style={styles.metricCard}>
          <Text style={styles.metricLabel}>Current Delay</Text>
          <Text style={[styles.metricValue, { color: colors.warning }]}>{centre.currentDelay} Mins</Text>
          <Text style={styles.metricSub}>Average queue wait</Text>
        </KisanCard>

        <KisanCard style={styles.metricCard}>
          <Text style={styles.metricLabel}>Daily Capacity</Text>
          <Text style={styles.metricValue}>{centre.capacity}</Text>
          <Text style={styles.metricSub}>Farmers / Day</Text>
        </KisanCard>
      </View>

      {/* Supported Crops & MSP */}
      <SectionHeader title="Procured Crops & Prices" subtitle="Government Minimum Support Price (MSP)" />
      <KisanCard style={styles.card}>
        {centre.supportedCrops.map((crop) => (
          <View key={crop} style={styles.cropRow}>
            <View>
              <Text style={styles.cropName}>{crop}</Text>
              <Text style={styles.cropGrade}>Grade A Quality Standard</Text>
            </View>
            <Text style={styles.mspPrice}>₹2,275 / Qtl</Text>
          </View>
        ))}
      </KisanCard>

      {/* Facilities & Infrastructure */}
      <SectionHeader title="Available Facilities" />
      <KisanCard style={styles.card}>
        <View style={styles.facilityItem}>
          <Ionicons name="checkmark-circle" size={18} color={colors.primary} />
          <Text style={styles.facilityText}>Automated Electronic Weighbridge</Text>
        </View>
        <View style={styles.facilityItem}>
          <Ionicons name="checkmark-circle" size={18} color={colors.primary} />
          <Text style={styles.facilityText}>Digital Moisture Analyzer Lab</Text>
        </View>
        <View style={styles.facilityItem}>
          <Ionicons name="checkmark-circle" size={18} color={colors.primary} />
          <Text style={styles.facilityText}>Direct DBT Payment Counter</Text>
        </View>
        <View style={styles.facilityItem}>
          <Ionicons name="checkmark-circle" size={18} color={colors.primary} />
          <Text style={styles.facilityText}>Farmer Rest Shed & Drinking Water</Text>
        </View>
      </KisanCard>

      <View style={styles.bookButtonBox}>
        <KisanButton
          title="Proceed to Book Slot"
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
  overviewCard: {
    marginBottom: spacing.md,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.xs,
  },
  mandiName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.textPrimary,
    flex: 1,
    marginRight: spacing.sm,
  },
  address: {
    fontSize: 13,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },
  hoursBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F5E9',
    padding: spacing.sm,
    borderRadius: radius.sm,
  },
  hoursText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.primary,
    marginLeft: 6,
  },
  metricGrid: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  metricCard: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: spacing.md,
  },
  metricLabel: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  metricValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.primary,
    marginVertical: 4,
  },
  metricSub: {
    fontSize: 11,
    color: colors.textSecondary,
  },
  card: {
    marginBottom: spacing.md,
  },
  cropRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  cropName: {
    fontSize: 15,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  cropGrade: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  mspPrice: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.primary,
  },
  facilityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  facilityText: {
    fontSize: 13,
    color: colors.textPrimary,
    marginLeft: 8,
  },
  bookButtonBox: {
    marginVertical: spacing.lg,
  },
});