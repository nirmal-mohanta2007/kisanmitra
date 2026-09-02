import React from 'react';
import { View, StyleSheet } from 'react-native';
import { colors, spacing, borderRadius } from '../../theme';
import { KisanText } from '../common/KisanText';
import { KisanCard } from '../common/KisanCard';

interface QueueCardProps {
  currentServingToken: number;
  yourToken: number;
  status: 'WAITING' | 'NEXT' | 'CALLED' | 'MISSED';
}

export const QueueCard: React.FC<QueueCardProps> = ({
  currentServingToken,
  yourToken,
  status,
}) => {
  const getStatusColor = () => {
    switch (status) {
      case 'CALLED': return colors.primary;
      case 'NEXT': return colors.secondary;
      case 'MISSED': return colors.error;
      default: return colors.warning;
    }
  };

  const getStatusMessage = () => {
    switch (status) {
      case 'CALLED': return 'Please proceed to the weighing station now.';
      case 'NEXT': return 'Get ready! You are next in line.';
      case 'MISSED': return 'You missed your turn. Please see the operator.';
      default: return 'Please wait in the designated area.';
    }
  };

  return (
    <KisanCard>
      <View style={styles.header}>
        <KisanText variant="subheading">Live Queue Status</KisanText>
        <View style={[styles.badge, { backgroundColor: getStatusColor() }]}>
          <KisanText variant="caption" color={colors.surface} style={styles.badgeText}>
            {status}
          </KisanText>
        </View>
      </View>

      <View style={styles.numbersContainer}>
        <View style={styles.numberBox}>
          <KisanText variant="caption" color={colors.textSecondary}>Currently Serving</KisanText>
          <KisanText variant="hero" color={colors.textPrimary}>#{currentServingToken}</KisanText>
        </View>
        
        <View style={styles.divider} />
        
        <View style={styles.numberBox}>
          <KisanText variant="caption" color={colors.textSecondary}>Your Token</KisanText>
          <KisanText variant="hero" color={getStatusColor()}>#{yourToken}</KisanText>
        </View>
      </View>

      <View style={[styles.messageBox, { backgroundColor: `${getStatusColor()}15` }]}>
        <KisanText variant="body" color={getStatusColor()} align="center" style={styles.messageText}>
          {getStatusMessage()}
        </KisanText>
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
  badge: {
    paddingHorizontal: spacing.m,
    paddingVertical: 4,
    borderRadius: borderRadius.button,
  },
  badgeText: {
    fontWeight: 'bold',
  },
  numbersContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.l,
  },
  numberBox: {
    flex: 1,
    alignItems: 'center',
  },
  divider: {
    width: 2,
    height: 50,
    backgroundColor: '#E0E0E0',
  },
  messageBox: {
    padding: spacing.m,
    borderRadius: borderRadius.button,
  },
  messageText: {
    fontWeight: '500',
  },
});
