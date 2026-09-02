import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing } from '../../theme';
import { KisanText } from './KisanText';
import { KisanButton } from './KisanButton';

interface EmptyStateProps {
  icon?: keyof typeof Ionicons.glyphMap;
  title: string;
  description: string;
  actionTitle?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon = 'document-text-outline',
  title,
  description,
  actionTitle,
  onAction,
}) => {
  return (
    <View style={styles.container}>
      <Ionicons name={icon} size={64} color={colors.textSecondary} style={styles.icon} />
      <KisanText variant="subheading" style={styles.title} align="center">
        {title}
      </KisanText>
      <KisanText variant="body" color={colors.textSecondary} align="center" style={styles.description}>
        {description}
      </KisanText>
      {actionTitle && onAction && (
        <KisanButton
          title={actionTitle}
          onPress={onAction}
          style={styles.button}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  icon: {
    marginBottom: spacing.l,
    opacity: 0.8,
  },
  title: {
    marginBottom: spacing.s,
  },
  description: {
    marginBottom: spacing.xl,
  },
  button: {
    minWidth: 200,
  },
});
