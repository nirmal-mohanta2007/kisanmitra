import React from 'react';
import { View, StyleSheet } from 'react-native';
import { colors, spacing, borderRadius } from '../../theme';
import { KisanText } from '../common/KisanText';
import { KisanCard } from '../common/KisanCard';

interface TokenCardProps {
  tokenNumber: string;
  status: 'PENDING' | 'ACTIVE' | 'COMPLETED' | 'CANCELLED';
  cropName: string;
  quantity: string;
  date: string;
}

export const TokenCard: React.FC<TokenCardProps> = ({
  tokenNumber,
  status,
  cropName,
  quantity,
  date,
}) => {
  const getStatusColor = () => {
    switch (status) {
      case 'ACTIVE': return colors.primary;
      case 'COMPLETED': return colors.secondary;
      case 'CANCELLED': return colors.error;
      default: return colors.warning;
    }
  };

  return (
    <KisanCard>
      <View style={styles.header}>
        <View style={styles.tokenContainer}>
          <KisanText variant="caption" color={colors.textSecondary}>Token No.</KisanText>
          <KisanText variant="title" color={colors.primary}>{tokenNumber}</KisanText>
        </View>
        <View style={[styles.badge, { backgroundColor: getStatusColor() }]}>
          <KisanText variant="caption" color={colors.surface} style={styles.badgeText}>
            {status}
          </KisanText>
        </View>
      </View>

      <View style={styles.divider} />

      <View style={styles.detailsRow}>
        <View style={styles.detailItem}>
          <KisanText variant="caption" color={colors.textSecondary}>Crop</KisanText>
          <KisanText variant="body" style={styles.detailValue}>{cropName}</KisanText>
        </View>
        <View style={styles.detailItem}>
          <KisanText variant="caption" color={colors.textSecondary}>Quantity</KisanText>
          <KisanText variant="body" style={styles.detailValue}>{quantity}</KisanText>
        </View>
        <View style={styles.detailItem}>
          <KisanText variant="caption" color={colors.textSecondary}>Date</KisanText>
          <KisanText variant="body" style={styles.detailValue}>{date}</KisanText>
        </View>
      </View>
    </KisanCard>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.m,
  },
  tokenContainer: {
    flex: 1,
  },
  badge: {
    paddingHorizontal: spacing.s,
    paddingVertical: 2,
    borderRadius: borderRadius.button,
  },
  badgeText: {
    fontWeight: '600',
  },
  divider: {
    height: 1,
    backgroundColor: '#E0E0E0',
    marginVertical: spacing.m,
  },
  detailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  detailItem: {
    flex: 1,
  },
  detailValue: {
    fontWeight: '500',
    marginTop: 2,
  },
});
