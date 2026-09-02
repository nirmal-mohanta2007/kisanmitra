import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, borderRadius } from '../../theme';
import { KisanText } from '../common/KisanText';
import { KisanCard } from '../common/KisanCard';

interface MandiStatusCardProps {
  mandiName: string;
  activeQueue: number;
  capacity: number;
  delayAlert?: string;
}

export const MandiStatusCard: React.FC<MandiStatusCardProps> = ({
  mandiName,
  activeQueue,
  capacity,
  delayAlert,
}) => {
  const utilization = Math.min((activeQueue / capacity) * 100, 100);
  
  const getUtilizationColor = () => {
    if (utilization > 90) return colors.error;
    if (utilization > 75) return colors.warning;
    return colors.primary;
  };

  return (
    <KisanCard>
      <View style={styles.header}>
        <KisanText variant="subheading">{mandiName}</KisanText>
        {delayAlert && (
          <View style={styles.alertBadge}>
            <Ionicons name="warning" size={14} color={colors.warning} />
            <KisanText variant="caption" color={colors.warning} style={styles.alertText}>
              Delay
            </KisanText>
          </View>
        )}
      </View>

      <View style={styles.statsRow}>
        <View style={styles.stat}>
          <KisanText variant="caption" color={colors.textSecondary}>Active Queue</KisanText>
          <KisanText variant="title">{activeQueue}</KisanText>
        </View>
        <View style={styles.stat}>
          <KisanText variant="caption" color={colors.textSecondary}>Capacity</KisanText>
          <KisanText variant="title">{capacity}</KisanText>
        </View>
      </View>

      <View style={styles.progressContainer}>
        <View style={styles.progressHeader}>
          <KisanText variant="caption" color={colors.textSecondary}>Utilization</KisanText>
          <KisanText variant="caption" style={{ color: getUtilizationColor(), fontWeight: 'bold' }}>
            {utilization.toFixed(0)}%
          </KisanText>
        </View>
        <View style={styles.progressBarBg}>
          <View 
            style={[
              styles.progressBarFill, 
              { width: `${utilization}%`, backgroundColor: getUtilizationColor() }
            ]} 
          />
        </View>
      </View>

      {delayAlert && (
        <View style={styles.delayBox}>
          <KisanText variant="caption" color={colors.warning}>
            {delayAlert}
          </KisanText>
        </View>
      )}
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
  alertBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: `${colors.warning}15`,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  alertText: {
    marginLeft: 4,
    fontWeight: 'bold',
  },
  statsRow: {
    flexDirection: 'row',
    marginBottom: spacing.l,
  },
  stat: {
    flex: 1,
  },
  progressContainer: {
    marginBottom: spacing.s,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.s,
  },
  progressBarBg: {
    height: 6,
    backgroundColor: '#E0E0E0',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 3,
  },
  delayBox: {
    marginTop: spacing.m,
    padding: spacing.s,
    backgroundColor: `${colors.warning}10`,
    borderRadius: 4,
  },
});
