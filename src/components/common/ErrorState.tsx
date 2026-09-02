import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, borderRadius } from '../../theme';
import { KisanText } from './KisanText';
import { KisanButton } from './KisanButton';

interface ErrorStateProps {
  title?: string;
  message: string;
  onRetry?: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'Something went wrong',
  message,
  onRetry,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <Ionicons name="alert-circle-outline" size={48} color={colors.error} />
      </View>
      <KisanText variant="subheading" style={styles.title} align="center">
        {title}
      </KisanText>
      <KisanText variant="body" color={colors.textSecondary} align="center" style={styles.message}>
        {message}
      </KisanText>
      {onRetry && (
        <KisanButton
          title="Retry"
          onPress={onRetry}
          variant="outline"
          style={styles.button}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: spacing.xl,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.card,
    margin: spacing.l,
  },
  iconContainer: {
    marginBottom: spacing.m,
  },
  title: {
    marginBottom: spacing.s,
    color: colors.error,
  },
  message: {
    marginBottom: spacing.l,
  },
  button: {
    minWidth: 150,
  },
});
