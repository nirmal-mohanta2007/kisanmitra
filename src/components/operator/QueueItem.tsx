import React from 'react';
import { View, StyleSheet } from 'react-native';
import { colors, spacing, borderRadius } from '../../theme';
import { KisanText } from '../common/KisanText';
import { KisanCard } from '../common/KisanCard';
import { KisanButton } from '../common/KisanButton';

export type QueueItemType = {
  id: string;
  tokenNumber: number;
  farmerName: string;
  crop: string;
  quantity: string;
  status: 'WAITING' | 'NEXT' | 'CALLED' | 'MISSED';
};

interface QueueItemProps {
  item: QueueItemType;
  onCall: () => void;
  onCheckIn: () => void;
  onAction: () => void;
}

export const QueueItem: React.FC<QueueItemProps> = ({ item, onCall, onCheckIn, onAction }) => {
  const getStatusColor = () => {
    switch (item.status) {
      case 'CALLED': return colors.primary;
      case 'NEXT': return colors.secondary;
      case 'MISSED': return colors.error;
      default: return colors.warning;
    }
  };

  const renderActionButtons = () => {
    switch (item.status) {
      case 'WAITING':
      case 'NEXT':
        return (
          <KisanButton 
            title="Call" 
            variant="primary" 
            onPress={onCall}
            style={styles.actionBtn}
          />
        );
      case 'CALLED':
        return (
          <KisanButton 
            title="Check In" 
            variant="secondary" 
            onPress={onCheckIn}
            style={styles.actionBtn}
          />
        );
      default:
        return (
          <KisanButton 
            title="Action" 
            variant="outline" 
            onPress={onAction}
            style={styles.actionBtn}
          />
        );
    }
  };

  return (
    <KisanCard padding="medium" style={styles.card}>
      <View style={styles.leftContent}>
        <View style={styles.tokenBox}>
          <KisanText variant="title" color={colors.primary}>#{item.tokenNumber}</KisanText>
        </View>
        <View style={styles.infoBox}>
          <KisanText variant="body" style={styles.name}>{item.farmerName}</KisanText>
          <KisanText variant="caption" color={colors.textSecondary}>
            {item.crop} • {item.quantity}
          </KisanText>
          <View style={[styles.statusBadge, { backgroundColor: `${getStatusColor()}20` }]}>
            <KisanText variant="caption" color={getStatusColor()} style={styles.statusText}>
              {item.status}
            </KisanText>
          </View>
        </View>
      </View>
      <View style={styles.rightContent}>
        {renderActionButtons()}
      </View>
    </KisanCard>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 4,
  },
  leftContent: {
    flexDirection: 'row',
    flex: 1,
    alignItems: 'center',
  },
  tokenBox: {
    backgroundColor: colors.background,
    padding: spacing.m,
    borderRadius: borderRadius.button,
    marginRight: spacing.m,
    minWidth: 70,
    alignItems: 'center',
  },
  infoBox: {
    flex: 1,
    alignItems: 'flex-start',
  },
  name: {
    fontWeight: '600',
    marginBottom: 2,
  },
  statusBadge: {
    marginTop: 4,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  rightContent: {
    marginLeft: spacing.m,
  },
  actionBtn: {
    minWidth: 90,
    minHeight: 36,
    paddingVertical: spacing.s,
    paddingHorizontal: spacing.s,
  },
});
