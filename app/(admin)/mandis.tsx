import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../src/theme/colors';
import { spacing } from '../../src/theme/spacing';
import { radius } from '../../src/theme/radius';
import {
  ScreenContainer,
  KisanCard,
  SectionHeader,
  StatusBadge,
} from '../../src/components/common';
import { MOCK_CENTRES } from '../../src/services/mock-data.service';

export default function AdminMandisScreen() {
  const router = useRouter();

  return (
    <ScreenContainer scrollable style={styles.container}>
      <SectionHeader
        title="Procurement Centres Monitoring"
        subtitle="Live load, delay status, and daily intake per centre"
      />

      {MOCK_CENTRES.map((centre) => (
        <TouchableOpacity
          key={centre.id}
          activeOpacity={0.7}
          onPress={() => router.push(`/(admin)/mandi/${centre.id}` as any)}
        >
          <KisanCard style={styles.mandiCard}>
            <View style={styles.header}>
              <View>
                <Text style={styles.id}>{centre.id}</Text>
                <Text style={styles.name}>{centre.name}</Text>
                <Text style={styles.address}>📍 {centre.district}, {centre.state}</Text>
              </View>
              <StatusBadge status={centre.isActive ? 'OPERATING' : 'IDLE'} variant="success" />
            </View>

            <View style={styles.metricsRow}>
              <View style={styles.metric}>
                <Text style={styles.metricLabel}>Current Delay</Text>
                <Text style={[styles.metricVal, { color: centre.currentDelay > 10 ? colors.warning : colors.primary }]}>
                  {centre.currentDelay} min
                </Text>
              </View>

              <View style={styles.metric}>
                <Text style={styles.metricLabel}>Capacity</Text>
                <Text style={styles.metricVal}>{centre.capacity} / Day</Text>
              </View>

              <View style={styles.metric}>
                <Text style={styles.metricLabel}>Speed</Text>
                <Text style={styles.metricVal}>{centre.averageServiceTime}m / Farmer</Text>
              </View>
            </View>
          </KisanCard>
        </TouchableOpacity>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.sm,
  },
  id: {
    fontSize: 11,
    color: colors.textSecondary,
    fontWeight: 'bold',
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  address: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  metricsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#F5F7FA',
    padding: spacing.sm,
    borderRadius: radius.sm,
  },
  metric: {
    alignItems: 'center',
  },
  metricLabel: {
    fontSize: 11,
    color: colors.textSecondary,
  },
  metricVal: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginTop: 2,
  },
});