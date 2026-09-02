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
import { MOCK_TRANSACTIONS } from '../../src/services/mock-data.service';

export default function OperatorQueueScreen() {
  const router = useRouter();

  return (
    <ScreenContainer scrollable style={styles.container}>
      <SectionHeader
        title="Today's Live Procurement Queue"
        subtitle="Manage tokens, call next farmers to weighbridge"
      />

      {MOCK_TRANSACTIONS.map((tx) => (
        <KisanCard key={tx.id} style={styles.queueItemCard}>
          <View style={styles.topRow}>
            <View style={styles.tokenBox}>
              <Text style={styles.tokenText}>#{tx.tokenNumber}</Text>
            </View>
            <View style={{ flex: 1, marginLeft: 10 }}>
              <Text style={styles.farmerName}>{tx.farmerName}</Text>
              <Text style={styles.farmerMeta}>📞 {tx.farmerPhone} • {tx.id}</Text>
            </View>
            <StatusBadge status={tx.status} />
          </View>

          <View style={styles.cropRow}>
            <Text style={styles.cropText}>🌾 {tx.crop} • {tx.expectedQuantity} Quintals</Text>
            <Text style={styles.slotText}>Slot: {tx.slotLabel}</Text>
          </View>

          <View style={styles.actionsRow}>
            <TouchableOpacity
              style={styles.detailsBtn}
              onPress={() => router.push(`/(operator)/farmer/${tx.id}` as any)}
            >
              <Text style={styles.detailsBtnText}>View File</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.callNextBtn}
              onPress={() => router.push('/(operator)/operations/check-in')}
            >
              <Ionicons name="megaphone-outline" size={16} color="#FFFFFF" />
              <Text style={styles.callNextBtnText}>Call / Process</Text>
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
  queueItemCard: {
    marginBottom: spacing.md,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  tokenBox: {
    width: 44,
    height: 44,
    borderRadius: radius.sm,
    backgroundColor: '#E3F2FD',
    justifyContent: 'center',
    alignItems: 'center',
  },
  tokenText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.secondary,
  },
  farmerName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  farmerMeta: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  cropRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#F5F7FA',
    padding: spacing.sm,
    borderRadius: radius.sm,
    marginBottom: spacing.sm,
  },
  cropText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  slotText: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  actionsRow: {
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
  callNextBtn: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.secondary,
    paddingVertical: 10,
    borderRadius: radius.sm,
    gap: 4,
  },
  callNextBtnText: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
});