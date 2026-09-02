import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, borderRadius } from '../../theme';
import { KisanText } from '../common/KisanText';
import { KisanCard } from '../common/KisanCard';

interface ETACardProps {
  estimatedWaitTime: string;
  tokensAhead: number;
  recommendedTime: string;
  reasoning: string;
}

export const ETACard: React.FC<ETACardProps> = ({
  estimatedWaitTime,
  tokensAhead,
  recommendedTime,
  reasoning,
}) => {
  return (
    <KisanCard>
      <View style={styles.header}>
        <Ionicons name="time-outline" size={24} color={colors.primary} />
        <KisanText variant="subheading" style={styles.title}>Wait Time Estimate</KisanText>
      </View>

      <View style={styles.mainStats}>
        <View style={styles.statBox}>
          <KisanText variant="title" color={colors.primary}>{estimatedWaitTime}</KisanText>
          <KisanText variant="caption" color={colors.textSecondary}>Estimated Wait</KisanText>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statBox}>
          <KisanText variant="title">{tokensAhead}</KisanText>
          <KisanText variant="caption" color={colors.textSecondary}>Tokens Ahead</KisanText>
        </View>
      </View>

      <View style={styles.recommendationBox}>
        <Ionicons name="information-circle" size={20} color={colors.secondary} />
        <View style={styles.recommendationText}>
          <KisanText variant="body" style={styles.recTitle}>
            Recommended Arrival: {recommendedTime}
          </KisanText>
          <KisanText variant="caption" color={colors.textSecondary}>
            {reasoning}
          </KisanText>
        </View>
      </View>
    </KisanCard>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.l,
  },
  title: {
    marginLeft: spacing.s,
  },
  mainStats: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.l,
  },
  statBox: {
    flex: 1,
    alignItems: 'center',
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: '#E0E0E0',
  },
  recommendationBox: {
    flexDirection: 'row',
    backgroundColor: '#E3F2FD',
    padding: spacing.m,
    borderRadius: borderRadius.button,
    alignItems: 'flex-start',
  },
  recommendationText: {
    flex: 1,
    marginLeft: spacing.s,
  },
  recTitle: {
    fontWeight: '600',
    color: colors.secondary,
    marginBottom: 2,
  },
});
