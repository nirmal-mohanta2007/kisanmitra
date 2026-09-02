import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, borderRadius } from '../../theme';
import { KisanText } from '../common/KisanText';
import { KisanCard } from '../common/KisanCard';

interface DelayReason {
  reason: string;
  duration: string;
  impact: 'HIGH' | 'MEDIUM' | 'LOW';
}

interface DelayCardProps {
  mandiName: string;
  totalDelay: string;
  bottleneck: string;
  reasons: DelayReason[];
}

export const DelayCard: React.FC<DelayCardProps> = ({
  mandiName,
  totalDelay,
  bottleneck,
  reasons,
}) => {
  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'HIGH': return colors.error;
      case 'MEDIUM': return colors.warning;
      case 'LOW': return colors.secondary;
      default: return colors.textSecondary;
    }
  };

  return (
    <KisanCard style={styles.card}>
      <View style={styles.header}>
        <View>
          <KisanText variant="subheading">{mandiName}</KisanText>
          <KisanText variant="caption" color={colors.error} style={styles.delayText}>
            Total Delay: {totalDelay}
          </KisanText>
        </View>
        <Ionicons name="time" size={32} color={colors.error} />
      </View>

      <View style={styles.bottleneckBox}>
        <KisanText variant="caption" color={colors.warning}>Primary Bottleneck</KisanText>
        <KisanText variant="body" style={styles.bottleneckText}>{bottleneck}</KisanText>
      </View>

      <KisanText variant="caption" color={colors.textSecondary} style={styles.reasonsTitle}>
        Contributing Factors
      </KisanText>

      <View style={styles.reasonsList}>
        {reasons.map((item, index) => (
          <View key={index} style={styles.reasonRow}>
            <View style={styles.reasonInfo}>
              <View 
                style={[
                  styles.impactIndicator, 
                  { backgroundColor: getImpactColor(item.impact) }
                ]} 
              />
              <KisanText variant="body" style={styles.reasonName}>{item.reason}</KisanText>
            </View>
            <KisanText variant="body" color={colors.textSecondary}>{item.duration}</KisanText>
          </View>
        ))}
      </View>
    </KisanCard>
  );
};

const styles = StyleSheet.create({
  card: {
    borderColor: `${colors.error}30`,
    borderWidth: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.m,
  },
  delayText: {
    fontWeight: 'bold',
    marginTop: 4,
  },
  bottleneckBox: {
    backgroundColor: `${colors.warning}15`,
    padding: spacing.m,
    borderRadius: borderRadius.button,
    marginBottom: spacing.l,
  },
  bottleneckText: {
    fontWeight: '600',
    marginTop: 4,
  },
  reasonsTitle: {
    marginBottom: spacing.s,
  },
  reasonsList: {
    gap: spacing.s,
  },
  reasonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
  },
  reasonInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  impactIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: spacing.s,
  },
  reasonName: {
    fontSize: 14,
  },
});
