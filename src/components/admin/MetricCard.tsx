import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, borderRadius } from '../../theme';
import { KisanText } from '../common/KisanText';
import { KisanCard } from '../common/KisanCard';

interface MetricCardProps {
  title: string;
  value: string | number;
  icon: keyof typeof Ionicons.glyphMap;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  subtext?: string;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  icon,
  trend,
  trendValue,
  subtext,
}) => {
  const getTrendColor = () => {
    if (trend === 'up') return colors.primary;
    if (trend === 'down') return colors.error;
    return colors.textSecondary;
  };

  const getTrendIcon = () => {
    if (trend === 'up') return 'arrow-up';
    if (trend === 'down') return 'arrow-down';
    return 'remove';
  };

  return (
    <KisanCard style={styles.card}>
      <View style={styles.header}>
        <KisanText variant="caption" color={colors.textSecondary} style={styles.title}>
          {title}
        </KisanText>
        <View style={styles.iconContainer}>
          <Ionicons name={icon} size={20} color={colors.secondary} />
        </View>
      </View>
      
      <KisanText variant="hero" style={styles.value}>{value}</KisanText>
      
      <View style={styles.footer}>
        {trend && (
          <View style={styles.trendContainer}>
            <Ionicons name={getTrendIcon()} size={14} color={getTrendColor()} />
            <KisanText variant="caption" color={getTrendColor()} style={styles.trendText}>
              {trendValue}
            </KisanText>
          </View>
        )}
        {subtext && (
          <KisanText variant="caption" color={colors.textSecondary} style={styles.subtext}>
            {trend ? ` vs last ${subtext}` : subtext}
          </KisanText>
        )}
      </View>
    </KisanCard>
  );
};

const styles = StyleSheet.create({
  card: {
    flex: 1,
    minWidth: 150,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.m,
  },
  title: {
    flex: 1,
    marginRight: spacing.s,
  },
  iconContainer: {
    backgroundColor: `${colors.secondary}15`,
    padding: 6,
    borderRadius: 8,
  },
  value: {
    marginBottom: spacing.m,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  trendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: spacing.s,
  },
  trendText: {
    fontWeight: 'bold',
    marginLeft: 2,
  },
  subtext: {
    fontSize: 12,
  },
});
