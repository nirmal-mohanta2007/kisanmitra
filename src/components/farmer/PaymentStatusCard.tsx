import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, borderRadius } from '../../theme';
import { KisanText } from '../common/KisanText';
import { KisanCard } from '../common/KisanCard';

interface PaymentStatusCardProps {
  amount: number;
  method: string;
  referenceId?: string;
  status: 'INITIATED' | 'PROCESSING' | 'COMPLETED' | 'FAILED';
  date?: string;
}

export const PaymentStatusCard: React.FC<PaymentStatusCardProps> = ({
  amount,
  method,
  referenceId,
  status,
  date,
}) => {
  const getStatusColor = () => {
    switch (status) {
      case 'COMPLETED': return colors.primary;
      case 'PROCESSING': 
      case 'INITIATED': return colors.secondary;
      case 'FAILED': return colors.error;
      default: return colors.textSecondary;
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'COMPLETED': return 'checkmark-circle';
      case 'PROCESSING': 
      case 'INITIATED': return 'time';
      case 'FAILED': return 'alert-circle';
      default: return 'help-circle';
    }
  };

  return (
    <KisanCard>
      <View style={styles.header}>
        <KisanText variant="subheading">Payment Details</KisanText>
        <View style={[styles.statusBadge, { backgroundColor: `${getStatusColor()}15` }]}>
          <Ionicons name={getStatusIcon()} size={16} color={getStatusColor()} />
          <KisanText variant="caption" color={getStatusColor()} style={styles.statusText}>
            {status}
          </KisanText>
        </View>
      </View>

      <View style={styles.amountContainer}>
        <KisanText variant="caption" color={colors.textSecondary}>Total Amount</KisanText>
        <KisanText variant="hero" color={colors.textPrimary}>₹{amount.toLocaleString('en-IN')}</KisanText>
      </View>

      <View style={styles.detailsBox}>
        <View style={styles.detailRow}>
          <KisanText variant="body" color={colors.textSecondary}>Method</KisanText>
          <KisanText variant="body" style={styles.detailValue}>{method}</KisanText>
        </View>
        
        {referenceId && (
          <View style={styles.detailRow}>
            <KisanText variant="body" color={colors.textSecondary}>Ref ID</KisanText>
            <KisanText variant="body" style={styles.detailValue}>{referenceId}</KisanText>
          </View>
        )}
        
        {date && (
          <View style={styles.detailRow}>
            <KisanText variant="body" color={colors.textSecondary}>Date</KisanText>
            <KisanText variant="body" style={styles.detailValue}>{date}</KisanText>
          </View>
        )}
      </View>
    </KisanCard>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.l,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.s,
    paddingVertical: 4,
    borderRadius: 16,
    gap: 4,
  },
  statusText: {
    fontWeight: '600',
  },
  amountContainer: {
    alignItems: 'center',
    marginBottom: spacing.l,
  },
  detailsBox: {
    backgroundColor: colors.background,
    padding: spacing.m,
    borderRadius: borderRadius.button,
    gap: spacing.s,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  detailValue: {
    fontWeight: '500',
  },
});
