import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing } from '../../theme';
import { KisanText } from '../common/KisanText';
import { KisanCard } from '../common/KisanCard';

interface ChecklistItem {
  id: string;
  title: string;
  description?: string;
  required: boolean;
}

interface ReadinessChecklistProps {
  items: ChecklistItem[];
}

export const ReadinessChecklist: React.FC<ReadinessChecklistProps> = ({ items }) => {
  const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set());

  const toggleItem = (id: string) => {
    const newChecked = new Set(checkedItems);
    if (newChecked.has(id)) {
      newChecked.delete(id);
    } else {
      newChecked.add(id);
    }
    setCheckedItems(newChecked);
  };

  const progress = items.length > 0 ? (checkedItems.size / items.length) * 100 : 0;

  return (
    <KisanCard>
      <View style={styles.header}>
        <KisanText variant="subheading">Preparation Checklist</KisanText>
        <KisanText variant="caption" color={colors.textSecondary}>
          {checkedItems.size}/{items.length} Completed
        </KisanText>
      </View>

      <View style={styles.progressBarBg}>
        <View style={[styles.progressBarFill, { width: `${progress}%` }]} />
      </View>

      <View style={styles.list}>
        {items.map((item) => {
          const isChecked = checkedItems.has(item.id);
          return (
            <TouchableOpacity
              key={item.id}
              style={styles.itemRow}
              onPress={() => toggleItem(item.id)}
              activeOpacity={0.7}
            >
              <Ionicons
                name={isChecked ? 'checkbox' : 'square-outline'}
                size={24}
                color={isChecked ? colors.primary : colors.textSecondary}
              />
              <View style={styles.itemTextContainer}>
                <View style={styles.itemTitleRow}>
                  <KisanText
                    variant="body"
                    style={[styles.itemTitle, isChecked && styles.checkedText]}
                  >
                    {item.title}
                  </KisanText>
                  {item.required && (
                    <KisanText variant="caption" color={colors.error} style={styles.requiredMark}>
                      *Required
                    </KisanText>
                  )}
                </View>
                {item.description && (
                  <KisanText variant="caption" color={colors.textSecondary}>
                    {item.description}
                  </KisanText>
                )}
              </View>
            </TouchableOpacity>
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
    alignItems: 'center',
    marginBottom: spacing.m,
  },
  progressBarBg: {
    height: 8,
    backgroundColor: colors.background,
    borderRadius: 4,
    marginBottom: spacing.l,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: colors.primary,
  },
  list: {
    gap: spacing.m,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  itemTextContainer: {
    flex: 1,
    marginLeft: spacing.m,
  },
  itemTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  itemTitle: {
    fontWeight: '500',
  },
  checkedText: {
    textDecorationLine: 'line-through',
    color: colors.textSecondary,
  },
  requiredMark: {
    fontSize: 12,
  },
});
