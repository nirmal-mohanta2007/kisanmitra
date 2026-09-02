import React from 'react';
import { View, StyleSheet } from 'react-native';
import { colors, spacing, borderRadius } from '../../theme';
import { KisanText } from '../common/KisanText';
import { KisanCard } from '../common/KisanCard';

type Grade = 'A' | 'B' | 'C' | 'REJECTED';

interface QualityCardProps {
  moisturePercentage: number;
  foreignMatterPercentage: number;
  grade: Grade;
}

export const QualityCard: React.FC<QualityCardProps> = ({
  moisturePercentage,
  foreignMatterPercentage,
  grade,
}) => {
  const getGradeColor = () => {
    switch (grade) {
      case 'A': return colors.primary;
      case 'B': return colors.secondary;
      case 'C': return colors.warning;
      case 'REJECTED': return colors.error;
      default: return colors.textSecondary;
    }
  };

  return (
    <KisanCard>
      <View style={styles.header}>
        <KisanText variant="subheading">Quality Assessment</KisanText>
        <View style={[styles.gradeBadge, { backgroundColor: getGradeColor() }]}>
          <KisanText variant="body" color={colors.surface} style={styles.gradeText}>
            Grade {grade}
          </KisanText>
        </View>
      </View>

      <View style={styles.metricsContainer}>
        <View style={styles.metricBox}>
          <KisanText variant="caption" color={colors.textSecondary}>Moisture</KisanText>
          <View style={styles.valueRow}>
            <KisanText variant="title" style={styles.value}>{moisturePercentage}</KisanText>
            <KisanText variant="body" color={colors.textSecondary}>%</KisanText>
          </View>
        </View>
        
        <View style={styles.divider} />
        
        <View style={styles.metricBox}>
          <KisanText variant="caption" color={colors.textSecondary}>Foreign Matter</KisanText>
          <View style={styles.valueRow}>
            <KisanText variant="title" style={styles.value}>{foreignMatterPercentage}</KisanText>
            <KisanText variant="body" color={colors.textSecondary}>%</KisanText>
          </View>
        </View>
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
  gradeBadge: {
    paddingHorizontal: spacing.l,
    paddingVertical: spacing.s,
    borderRadius: borderRadius.button,
  },
  gradeText: {
    fontWeight: 'bold',
  },
  metricsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    borderRadius: borderRadius.card,
    padding: spacing.m,
  },
  metricBox: {
    flex: 1,
    alignItems: 'center',
  },
  divider: {
    width: 1,
    height: 40,
    backgroundColor: '#D0D0D0',
  },
  valueRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginTop: spacing.s,
  },
  value: {
    marginRight: 2,
  },
});
