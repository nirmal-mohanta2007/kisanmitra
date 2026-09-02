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
  KisanButton,
} from '../../../src/components/common';

export default function ProcurementSummaryScreen() {
  const router = useRouter();

  return (
    <ScreenContainer scrollable style={styles.container}>
      <SectionHeader
        title="Procurement Inspection Summary"
        subtitle="Official parameters recorded during your visit"
      />

      {/* Weighment Summary Card */}
      <KisanCard style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>⚖️ Electronic Weighbridge Result</Text>
          <StatusBadge status="VERIFIED" variant="success" />
        </View>
        <View style={styles.dataRow}>
          <Text style={styles.dataLabel}>Gross Truck Weight:</Text>
          <Text style={styles.dataValue}>32.40 Quintals</Text>
        </View>
        <View style={styles.dataRow}>
          <Text style={styles.dataLabel}>Tare (Empty Vehicle) Weight:</Text>
          <Text style={styles.dataValue}>7.40 Quintals</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.dataRowHighlight}>
          <Text style={styles.totalLabel}>Net Crop Weight:</Text>
          <Text style={styles.totalValue}>25.00 Quintals</Text>
        </View>
      </KisanCard>

      {/* Quality Check Card */}
      <KisanCard style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>🔬 Quality & Lab Analysis</Text>
          <StatusBadge status="GRADE A" variant="success" />
        </View>
        <View style={styles.dataRow}>
          <Text style={styles.dataLabel}>Moisture Percentage:</Text>
          <Text style={styles.dataValue}>11.2% (Permissible &lt; 12%)</Text>
        </View>
        <View style={styles.dataRow}>
          <Text style={styles.dataLabel}>Foreign Matter / Husk:</Text>
          <Text style={styles.dataValue}>0.4% (Permissible &lt; 0.75%)</Text>
        </View>
        <View style={styles.dataRow}>
          <Text style={styles.dataLabel}>Damaged Grains:</Text>
          <Text style={styles.dataValue}>0.8% (Within norms)</Text>
        </View>
      </KisanCard>

      {/* Payout Calculation Card */}
      <KisanCard style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>💰 Final Payout Breakdown</Text>
          <StatusBadge status="APPROVED" variant="success" />
        </View>
        <View style={styles.dataRow}>
          <Text style={styles.dataLabel}>Accepted Quantity:</Text>
          <Text style={styles.dataValue}>25.00 Qtl</Text>
        </View>
        <View style={styles.dataRow}>
          <Text style={styles.dataLabel}>Official MSP Rate:</Text>
          <Text style={styles.dataValue}>₹2,275 / Qtl</Text>
        </View>
        <View style={styles.dataRow}>
          <Text style={styles.dataLabel}>Quality Deductions:</Text>
          <Text style={styles.dataValue}>₹0.00 (Nil)</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.dataRowHighlight}>
          <Text style={styles.totalLabel}>Total DBT Credit Amount:</Text>
          <Text style={styles.totalValue}>₹56,875.00</Text>
        </View>
      </KisanCard>

      <View style={styles.btnBox}>
        <KisanButton
          title="View Official Digital Receipt"
          onPress={() => router.push('/(farmer)/procurement/receipt')}
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
  card: {
    marginBottom: spacing.md,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  dataRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  dataLabel: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  dataValue: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  divider: {
    height: 1,
    backgroundColor: '#E0E0E0',
    marginVertical: 8,
  },
  dataRowHighlight: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  totalValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.primary,
  },
  btnBox: {
    marginVertical: spacing.lg,
    marginBottom: spacing.xl,
  },
});