import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { radius } from '../../theme/radius';
import { MandiLane, LaneStatusType } from '../../types/operator';

interface LaneStatusProps {
  lanes: MandiLane[];
  onSelectLane?: (lane: MandiLane) => void;
}

export const LaneStatus: React.FC<LaneStatusProps> = ({ lanes, onSelectLane }) => {
  const getBadgeStyle = (status: LaneStatusType) => {
    switch (status) {
      case 'Available':
        return { bg: '#F5F5F5', text: '#616161', border: '#E0E0E0' };
      case 'Waiting':
        return { bg: '#FFF8E1', text: '#F57F17', border: '#FFE082' };
      case 'Checking':
        return { bg: '#FFF3E0', text: '#E65100', border: '#FFCC80' };
      case 'Weighing':
        return { bg: '#E8F5E9', text: '#2E7D32', border: '#A5D6A7' };
      case 'Procurement':
        return { bg: '#F3E5F5', text: '#7B1FA2', border: '#CE93D8' };
      case 'Blocked':
        return { bg: '#FFEBEE', text: '#C62828', border: '#FFCDD2' };
      default:
        return { bg: '#F5F5F5', text: '#616161', border: '#E0E0E0' };
    }
  };

  return (
    <View style={styles.grid}>
      {lanes.map((lane) => {
        const theme = getBadgeStyle(lane.status);
        return (
          <TouchableOpacity
            key={lane.id}
            style={[styles.laneBox, { borderColor: theme.border }]}
            onPress={() => onSelectLane?.(lane)}
            activeOpacity={onSelectLane ? 0.75 : 1}
          >
            <View style={styles.topRow}>
              <Text style={styles.laneTitle}>{lane.laneLabel}</Text>
              <Text style={[styles.tokenTag, !lane.token && styles.tokenEmpty]}>
                {lane.token || 'Empty'}
              </Text>
            </View>

            {lane.farmerName && (
              <Text style={styles.farmerName} numberOfLines={1}>
                {lane.farmerName}
              </Text>
            )}

            <View style={[styles.statusBadge, { backgroundColor: theme.bg }]}>
              <Text style={[styles.statusText, { color: theme.text }]}>
                {lane.stage || lane.status}
              </Text>
            </View>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  laneBox: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderRadius: radius.md,
    padding: spacing.sm,
    borderWidth: 1.5,
    minHeight: 88,
    justifyContent: 'space-between',
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  laneTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  tokenTag: {
    fontSize: 12,
    fontWeight: '800',
    color: colors.primary,
  },
  tokenEmpty: {
    color: '#9E9E9E',
    fontWeight: '500',
    fontSize: 11,
  },
  farmerName: {
    fontSize: 11,
    color: colors.textSecondary,
    marginVertical: 2,
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: radius.round,
    marginTop: 4,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '700',
  },
});
