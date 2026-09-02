import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing } from '../../theme';
import { KisanText } from '../common/KisanText';
import { KisanCard } from '../common/KisanCard';
import { KisanButton } from '../common/KisanButton';

interface MandiCardProps {
  name: string;
  distance: string;
  supportedCrops: string[];
  activeDelay?: string;
  onSelect?: () => void;
  isSelected?: boolean;
}

export const MandiCard: React.FC<MandiCardProps> = ({
  name,
  distance,
  supportedCrops,
  activeDelay,
  onSelect,
  isSelected,
}) => {
  return (
    <KisanCard style={isSelected ? styles.selectedCard : undefined}>
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <KisanText variant="subheading" style={styles.title}>{name}</KisanText>
          <View style={styles.distanceRow}>
            <Ionicons name="location-outline" size={16} color={colors.textSecondary} />
            <KisanText variant="caption" color={colors.textSecondary} style={styles.distanceText}>
              {distance} away
            </KisanText>
          </View>
        </View>
        {isSelected && (
          <Ionicons name="checkmark-circle" size={24} color={colors.primary} />
        )}
      </View>

      {activeDelay && (
        <View style={styles.delayBox}>
          <Ionicons name="warning-outline" size={16} color={colors.warning} />
          <KisanText variant="caption" color={colors.warning} style={styles.delayText}>
            Active Delay: {activeDelay}
          </KisanText>
        </View>
      )}

      <View style={styles.cropsContainer}>
        <KisanText variant="caption" color={colors.textSecondary} style={styles.cropsLabel}>
          Accepts:
        </KisanText>
        <View style={styles.chipsRow}>
          {supportedCrops.map((crop, idx) => (
            <View key={idx} style={styles.chip}>
              <KisanText variant="caption">{crop}</KisanText>
            </View>
          ))}
        </View>
      </View>

      {onSelect && !isSelected && (
        <KisanButton
          title="Select Mandi"
          variant="outline"
          onPress={onSelect}
          style={styles.selectBtn}
        />
      )}
    </KisanCard>
  );
};

const styles = StyleSheet.create({
  selectedCard: {
    borderColor: colors.primary,
    borderWidth: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.s,
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    marginBottom: 4,
  },
  distanceRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  distanceText: {
    marginLeft: 4,
  },
  delayBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF3E0',
    padding: spacing.s,
    borderRadius: 4,
    marginBottom: spacing.m,
  },
  delayText: {
    marginLeft: spacing.s,
    fontWeight: '500',
  },
  cropsContainer: {
    marginTop: spacing.s,
  },
  cropsLabel: {
    marginBottom: spacing.s,
  },
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.s,
  },
  chip: {
    backgroundColor: colors.background,
    paddingHorizontal: spacing.m,
    paddingVertical: 4,
    borderRadius: 16,
  },
  selectBtn: {
    marginTop: spacing.m,
  },
});
