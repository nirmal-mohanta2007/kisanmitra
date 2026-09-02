import React from 'react';
import { View, StyleSheet } from 'react-native';
import { colors, spacing, borderRadius } from '../../theme';
import { KisanText } from '../common/KisanText';
import { KisanCard } from '../common/KisanCard';

interface ChartDataPoint {
  label: string;
  value: number;
  color?: string;
}

interface ProcurementChartProps {
  title: string;
  data: ChartDataPoint[];
  totalLabel?: string;
}

export const ProcurementChart: React.FC<ProcurementChartProps> = ({
  title,
  data,
  totalLabel = 'Total Volume',
}) => {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  const max = Math.max(...data.map(item => item.value));

  const defaultColors = [colors.primary, colors.secondary, colors.warning, '#4CAF50', '#9C27B0'];

  return (
    <KisanCard>
      <View style={styles.header}>
        <KisanText variant="subheading">{title}</KisanText>
        <View style={styles.totalBox}>
          <KisanText variant="title">{total}</KisanText>
          <KisanText variant="caption" color={colors.textSecondary}>{totalLabel}</KisanText>
        </View>
      </View>

      <View style={styles.chartArea}>
        {data.map((item, index) => {
          const percentage = max > 0 ? (item.value / max) * 100 : 0;
          const barColor = item.color || defaultColors[index % defaultColors.length];

          return (
            <View key={index} style={styles.barRow}>
              <View style={styles.labelContainer}>
                <KisanText variant="caption" style={styles.label} numberOfLines={1}>
                  {item.label}
                </KisanText>
              </View>
              <View style={styles.barContainer}>
                <View 
                  style={[
                    styles.bar, 
                    { width: `${percentage}%`, backgroundColor: barColor }
                  ]} 
                />
              </View>
              <View style={styles.valueContainer}>
                <KisanText variant="caption" style={styles.valueText}>
                  {item.value}
                </KisanText>
              </View>
            </View>
          );
        })}
      </View>
    </KisanCard>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.xl,
  },
  totalBox: {
    alignItems: 'flex-end',
  },
  chartArea: {
    gap: spacing.m,
  },
  barRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  labelContainer: {
    width: 70,
    marginRight: spacing.s,
  },
  label: {
    fontSize: 12,
  },
  barContainer: {
    flex: 1,
    height: 12,
    backgroundColor: colors.background,
    borderRadius: 6,
    overflow: 'hidden',
  },
  bar: {
    height: '100%',
    borderRadius: 6,
  },
  valueContainer: {
    width: 40,
    alignItems: 'flex-end',
    marginLeft: spacing.s,
  },
  valueText: {
    fontWeight: 'bold',
  },
});
