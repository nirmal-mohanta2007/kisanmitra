import React from 'react';
import { View, StyleSheet } from 'react-native';
import { colors, spacing, borderRadius } from '../../theme';
import { KisanText } from '../common/KisanText';
import { KisanCard } from '../common/KisanCard';

interface PaymentStatus {
  completed: number;
  processing: number;
  pending: number;
  failed: number;
  totalAmount: number;
}

interface PaymentChartProps {
  data: PaymentStatus;
}

export const PaymentChart: React.FC<PaymentChartProps> = ({ data }) => {
  const total = data.completed + data.processing + data.pending + data.failed;
  
  const getPercentage = (value: number) => {
    return total > 0 ? (value / total) * 100 : 0;
  };

  const segments = [
    { label: 'Completed', value: data.completed, color: colors.primary },
    { label: 'Processing', value: data.processing, color: colors.secondary },
    { label: 'Pending', value: data.pending, color: colors.warning },
    { label: 'Failed', value: data.failed, color: colors.error },
  ];

  return (
    <KisanCard>
      <View style={styles.header}>
        <KisanText variant="subheading">Payment Distribution</KisanText>
        <KisanText variant="title">₹{(data.totalAmount / 100000).toFixed(2)}L</KisanText>
      </View>

      {/* Segmented Bar */}
      <View style={styles.barContainer}>
        {segments.map((segment, index) => {
          const width = getPercentage(segment.value);
          if (width === 0) return null;
          
          return (
            <View 
              key={index} 
              style={[
                styles.barSegment, 
                { 
                  width: `${width}%`, 
                  backgroundColor: segment.color,
                  borderTopLeftRadius: index === 0 ? 8 : 0,
                  borderBottomLeftRadius: index === 0 ? 8 : 0,
                  borderTopRightRadius: index === segments.length - 1 ? 8 : 0,
                  borderBottomRightRadius: index === segments.length - 1 ? 8 : 0,
                }
              ]} 
            />
          );
        })}
      </View>

      {/* Legend */}
      <View style={styles.legendContainer}>
        {segments.map((segment, index) => (
          <View key={index} style={styles.legendItem}>
            <View style={[styles.legendColor, { backgroundColor: segment.color }]} />
            <View>
              <KisanText variant="caption" color={colors.textSecondary}>
                {segment.label}
              </KisanText>
              <KisanText variant="body" style={styles.legendValue}>
                {segment.value} ({getPercentage(segment.value).toFixed(0)}%)
              </KisanText>
            </View>
          </View>
        ))}
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
  barContainer: {
    height: 16,
    flexDirection: 'row',
    backgroundColor: colors.background,
    borderRadius: 8,
    marginBottom: spacing.xl,
  },
  barSegment: {
    height: '100%',
  },
  legendContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: spacing.m,
  },
  legendItem: {
    width: '45%',
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: spacing.s,
    marginTop: 4,
  },
  legendValue: {
    fontWeight: 'bold',
    marginTop: 2,
  },
});
