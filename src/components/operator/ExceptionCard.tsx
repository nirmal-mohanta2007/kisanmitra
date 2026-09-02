import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, borderRadius } from '../../theme';
import { KisanText } from '../common/KisanText';
import { KisanCard } from '../common/KisanCard';
import { KisanButton } from '../common/KisanButton';

interface ExceptionCardProps {
  title: string;
  reason: string;
  responsibleParty: 'FARMER' | 'MANDI' | 'SYSTEM';
  onResolve?: () => void;
}

export const ExceptionCard: React.FC<ExceptionCardProps> = ({
  title,
  reason,
  responsibleParty,
  onResolve,
}) => {
  return (
    <KisanCard style={styles.card}>
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <Ionicons name="warning" size={24} color={colors.error} />
          <KisanText variant="subheading" style={styles.title}>{title}</KisanText>
        </View>
        <View style={styles.badge}>
          <KisanText variant="caption" color={colors.error} style={styles.badgeText}>
            {responsibleParty}
          </KisanText>
        </View>
      </View>

      <KisanText variant="body" style={styles.reason}>
        {reason}
      </KisanText>

      {onResolve && (
        <KisanButton
          title="Resolve Exception"
          variant="danger"
          onPress={onResolve}
          style={styles.button}
        />
      )}
    </KisanCard>
  );
};

const styles = StyleSheet.create({
  card: {
    borderColor: colors.error,
    borderWidth: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.m,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  title: {
    marginLeft: spacing.s,
    color: colors.error,
  },
  badge: {
    backgroundColor: `${colors.error}15`,
    paddingHorizontal: spacing.s,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    fontWeight: 'bold',
    fontSize: 10,
  },
  reason: {
    marginBottom: spacing.l,
    color: colors.textPrimary,
  },
  button: {
    marginTop: spacing.s,
  },
});
