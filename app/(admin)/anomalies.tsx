import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
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

const ANOMALIES = [
  {
    id: 'ANM-001',
    type: 'Unusual Queue Delay',
    severity: 'HIGH',
    mandi: 'Rajya Kray Kendra, Jabalpur',
    description: 'Average waiting time spiked to 45 mins (+200% above threshold). Weighbridge sensor reporting slow throughput.',
    timestamp: '10 mins ago',
  },
  {
    id: 'ANM-002',
    type: 'Queue Traffic Spike',
    severity: 'MEDIUM',
    mandi: 'Demo Krishi Upaj Mandi, Bhopal',
    description: 'Unscheduled arrival of 24 tractor trolleys without slot reservation at North Gate.',
    timestamp: '25 mins ago',
  },
  {
    id: 'ANM-003',
    type: 'Weighment Variance Anomaly',
    severity: 'LOW',
    mandi: 'Kisan Seva Kendra, Indore',
    description: 'Gross to tare ratio deviation detected on Scale #3 (+8.2% vs expected vehicle tare baseline).',
    timestamp: '1 hour ago',
  },
  {
    id: 'ANM-004',
    type: 'DBT Batch Holding Warning',
    severity: 'HIGH',
    mandi: 'State Treasury Gate #4',
    description: 'PFMS batch response delayed beyond 36-hour SLA for 12 farmer transactions.',
    timestamp: '2 hours ago',
  },
];

export default function AdminAnomaliesScreen() {
  return (
    <ScreenContainer scrollable style={styles.container}>
      <SectionHeader
        title="AI & Heuristic Anomaly Alerts"
        subtitle="Automated real-time operational deviation detection"
      />

      {ANOMALIES.map((item) => (
        <KisanCard key={item.id} style={styles.anomalyCard}>
          <View style={styles.header}>
            <View style={styles.titleRow}>
              <Ionicons
                name={item.severity === 'HIGH' ? 'alert-circle' : 'warning'}
                size={20}
                color={item.severity === 'HIGH' ? colors.error : colors.warning}
              />
              <Text style={styles.typeTitle}>{item.type}</Text>
            </View>
            <StatusBadge
              status={item.severity}
              variant={item.severity === 'HIGH' ? 'error' : item.severity === 'MEDIUM' ? 'warning' : 'info'}
            />
          </View>

          <Text style={styles.mandiName}>📍 {item.mandi}</Text>
          <Text style={styles.desc}>{item.description}</Text>

          <View style={styles.footer}>
            <Text style={styles.id}>{item.id}</Text>
            <Text style={styles.time}>{item.timestamp}</Text>
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
  anomalyCard: {
    marginBottom: spacing.md,
    borderLeftWidth: 4,
    borderLeftColor: colors.warning,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  typeTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  mandiName: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.secondary,
    marginBottom: 4,
  },
  desc: {
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 18,
    marginBottom: 8,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#F5F5F5',
    paddingTop: 6,
  },
  id: {
    fontSize: 11,
    color: colors.textSecondary,
  },
  time: {
    fontSize: 11,
    color: colors.textSecondary,
  },
});