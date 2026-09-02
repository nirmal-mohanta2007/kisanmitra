import React from 'react';
import { View, StyleSheet } from 'react-native';
import { KisanCard } from '../common/KisanCard';
import { KisanText } from '../common/KisanText';
import { colors, spacing, borderRadius } from '../../theme';

interface WeighmentCardProps {
  grossWeight: number;
  tareWeight: number;
  netWeight: number;
}

export const WeighmentCard: React.FC<WeighmentCardProps> = ({
  grossWeight,
  tareWeight,
  netWeight,
}) => {
  const isCalculated = netWeight > 0;

  return (
    <KisanCard>
      <KisanText variant="heading" style={styles.title}>Weighment Breakdown</KisanText>
      
      <View style={styles.readingRow}>
        <View style={styles.readingBox}>
          <KisanText variant="caption" color={colors.text.secondary}>Gross Weight (kg)</KisanText>
          <KisanText variant="title" style={styles.readingValue}>{grossWeight || '--'}</KisanText>
        </View>
        <View style={styles.operator}>
          <KisanText variant="title" color={colors.text.secondary}>-</KisanText>
        </View>
        <View style={styles.readingBox}>
          <KisanText variant="caption" color={colors.text.secondary}>Tare Weight (kg)</KisanText>
          <KisanText variant="title" style={styles.readingValue}>{tareWeight || '--'}</KisanText>
        </View>
      </View>

      <View style={styles.divider} />

      <View style={[styles.netWeightBox, isCalculated && styles.netWeightCalculated]}>
        <KisanText 
          variant="body" 
          color={isCalculated ? colors.surface : colors.text.secondary}
          style={styles.netWeightLabel}
        >
          Net Weight (kg)
        </KisanText>
        <KisanText 
          variant="hero" 
          color={isCalculated ? colors.surface : colors.text.primary}
        >
          {isCalculated ? netWeight.toFixed(2) : '--'}
        </KisanText>
      </View>
    </KisanCard>
  );
};

const styles = StyleSheet.create({
  title: {
    marginBottom: spacing.lg,
  },
  readingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  readingBox: {
    flex: 1,
    backgroundColor: colors.background,
    padding: spacing.md,
    borderRadius: borderRadius.card,
    alignItems: 'center',
  },
  operator: {
    paddingHorizontal: spacing.md,
  },
  readingValue: {
    marginTop: spacing.sm,
    fontWeight: '600',
  },
  divider: {
    height: 1,
    backgroundColor: '#E0E0E0',
    marginVertical: spacing.lg,
  },
  netWeightBox: {
    backgroundColor: colors.background,
    padding: spacing.lg,
    borderRadius: borderRadius.card,
    alignItems: 'center',
  },
  netWeightCalculated: {
    backgroundColor: colors.primary,
  },
  netWeightLabel: {
    marginBottom: spacing.sm,
  },
});
