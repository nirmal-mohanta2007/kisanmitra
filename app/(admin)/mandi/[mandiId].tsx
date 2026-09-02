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
} from '../../../src/components/common';
import { MOCK_CENTRES } from '../../../src/services/mock-data.service';

export default function AdminMandiDetailScreen() {
  const router = useRouter();
  const { mandiId } = useLocalSearchParams();
  const centre = MOCK_CENTRES.find((c) => c.id === mandiId) || MOCK_CENTRES[0];

  return (
    <ScreenContainer scrollable style={styles.container}>
      <KisanCard style={styles.headerCard}>
        <View style={styles.topRow}>
          <Text style={styles.title}>{centre.name}</Text>
          <StatusBadge status="ACTIVE" variant="success" />
        </View>
        <Text style={styles.meta}>ID: {centre.id} • {centre.address}, {centre.district}</Text>
      </KisanCard>

      <SectionHeader title="Centre Operating Load" />
      <View style={styles.grid}>
        <KisanCard style={styles.gridCard}>
          <Text style={styles.label}>Daily Target</Text>
          <Text style={styles.val}>{centre.capacity} Farmers</Text>
        </KisanCard>
        <KisanCard style={styles.gridCard}>
          <Text style={styles.label}>Current Delay</Text>
          <Text style={[styles.val, { color: colors.warning }]}>{centre.currentDelay} Mins</Text>
        </KisanCard>
        <KisanCard style={styles.gridCard}>
          <Text style={styles.label}>Avg Inspection</Text>
          <Text style={styles.val}>{centre.averageServiceTime} Mins</Text>
        </KisanCard>
        <KisanCard style={styles.gridCard}>
          <Text style={styles.label}>Weighbridges</Text>
          <Text style={styles.val}>2 Operational</Text>
        </KisanCard>
      </View>

      <SectionHeader title="Supported Crops" />
      <KisanCard style={styles.card}>
        <View style={styles.cropList}>
          {centre.supportedCrops.map((c) => (
            <View key={c} style={styles.cropChip}>
              <Text style={styles.cropText}>🌾 {c}</Text>
            </View>
          ))}
        </View>
      </KisanCard>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: spacing.md,
  },
  headerCard: {
    marginBottom: spacing.md,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.textPrimary,
    flex: 1,
  },
  meta: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  gridCard: {
    width: '48%',
    alignItems: 'center',
    paddingVertical: spacing.md,
  },
  label: {
    fontSize: 11,
    color: colors.textSecondary,
  },
  val: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginTop: 2,
  },
  card: {
    marginBottom: spacing.md,
  },
  cropList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  cropChip: {
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: radius.sm,
  },
  cropText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.primary,
  },
});