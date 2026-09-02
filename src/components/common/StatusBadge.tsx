import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing } from '../../theme/spacing';
import { radius } from '../../theme/radius';

export interface StatusBadgeProps {
  status: string;
  label?: string;
  variant?: 'success' | 'warning' | 'error' | 'info' | 'default';
  style?: ViewStyle;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  label,
  variant,
  style,
}) => {
  const getBadgeConfig = () => {
    if (variant) {
      switch (variant) {
        case 'success':
          return { bg: '#E8F5E9', text: colors.status.success };
        case 'warning':
          return { bg: '#FFF3E0', text: colors.status.warning };
        case 'error':
          return { bg: '#FFEBEE', text: colors.status.error };
        case 'info':
          return { bg: '#E3F2FD', text: colors.status.info };
        default:
          return { bg: '#F5F5F5', text: colors.textPrimary };
      }
    }

    const s = (status || '').toUpperCase();
    if (s.includes('COMPLETED') || s.includes('CONFIRMED') || s.includes('RESOLVED') || s.includes('PASSED') || s.includes('SUCCESS') || s.includes('OPERATING')) {
      return { bg: '#E8F5E9', text: '#2E7D32' };
    }
    if (s.includes('WAITING') || s.includes('PENDING') || s.includes('BOOKED') || s.includes('PROCESSING') || s.includes('DELAY') || s.includes('MEDIUM')) {
      return { bg: '#FFF3E0', text: '#E65100' };
    }
    if (s.includes('CANCELLED') || s.includes('FAILED') || s.includes('REJECTED') || s.includes('MISSED') || s.includes('OPEN') || s.includes('HIGH')) {
      return { bg: '#FFEBEE', text: '#C62828' };
    }
    if (s.includes('CHECK_IN') || s.includes('WEIGHING') || s.includes('QUALITY') || s.includes('ACTIVE') || s.includes('LOW') || s.includes('IN_PROGRESS')) {
      return { bg: '#E3F2FD', text: '#1565C0' };
    }
    return { bg: '#F0F0F0', text: '#616161' };
  };

  const config = getBadgeConfig();
  const displayLabel = label || (status || '').replace(/_/g, ' ');

  return (
    <View style={[styles.badge, { backgroundColor: config.bg }, style]}>
      <Text style={[styles.text, { color: config.text }]}>{displayLabel}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: spacing.xs,
    borderRadius: radius.round || 16,
    alignSelf: 'flex-start',
  },
  text: {
    fontSize: typography.sizes.caption,
    fontWeight: typography.weights.bold as any,
    textTransform: 'uppercase',
  },
});
