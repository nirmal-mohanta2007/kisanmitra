import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { colors, spacing, borderRadius } from '../../theme';
import { KisanText } from '../common/KisanText';
import { QueueItem, QueueItemType } from './QueueItem';

interface QueueListProps {
  items: QueueItemType[];
  onAction: (item: QueueItemType, action: string) => void;
}

const FILTERS = ['All', 'Waiting', 'Next', 'Called', 'Missed'];

export const QueueList: React.FC<QueueListProps> = ({ items, onAction }) => {
  const [activeFilter, setActiveFilter] = useState('All');

  const filteredItems = items.filter(item => {
    if (activeFilter === 'All') return true;
    return item.status.toLowerCase() === activeFilter.toLowerCase();
  });

  return (
    <View style={styles.container}>
      <View style={styles.filterContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterScroll}>
          {FILTERS.map(filter => (
            <TouchableOpacity
              key={filter}
              style={[
                styles.filterChip,
                activeFilter === filter && styles.activeFilterChip
              ]}
              onPress={() => setActiveFilter(filter)}
            >
              <KisanText 
                variant="caption" 
                color={activeFilter === filter ? colors.surface : colors.textPrimary}
              >
                {filter}
              </KisanText>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <ScrollView contentContainerStyle={styles.listContent}>
        {filteredItems.map(item => (
          <QueueItem
            key={item.id}
            item={item}
            onCall={() => onAction(item, 'call')}
            onCheckIn={() => onAction(item, 'check_in')}
            onAction={() => onAction(item, 'other')}
          />
        ))}
        {filteredItems.length === 0 && (
          <View style={styles.emptyContainer}>
            <KisanText variant="body" color={colors.textSecondary} align="center">
              No farmers found for this filter.
            </KisanText>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  filterContainer: {
    marginBottom: spacing.m,
  },
  filterScroll: {
    paddingHorizontal: spacing.l,
    gap: spacing.s,
  },
  filterChip: {
    paddingHorizontal: spacing.m,
    paddingVertical: spacing.s,
    borderRadius: 20,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  activeFilterChip: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  listContent: {
    paddingHorizontal: spacing.l,
    paddingBottom: spacing.xl,
    gap: spacing.m,
  },
  emptyContainer: {
    padding: spacing.xl,
    alignItems: 'center',
  },
});
