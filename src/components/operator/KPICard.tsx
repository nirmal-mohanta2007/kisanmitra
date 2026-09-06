import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { radius } from '../../theme/radius';

interface KPICardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  badge?: string;
  badgeColor?: string;
  badgeBg?: string;
  iconName?: keyof typeof Ionicons.glyphMap;
  iconColor?: string;
  scale?: number;
  borderColor?: string;
  style?: ViewStyle;
  onPress?: () => void;
}

export const KPICard: React.FC<KPICardProps> = ({
  title,
  value,
  subtitle,
  badge,
  badgeColor = colors.primary,
  badgeBg = '#E8F5E9',
  iconName,
  iconColor = colors.secondary,
  scale = 1.0,
  borderColor,
  style,
  onPress,
}) => {
  const Container = onPress ? TouchableOpacity : View;

  return (
    <Container
      style={[
        styles.card,
        borderColor ? { borderColor } : null,
        style,
      ]}
      onPress={onPress}
      activeOpacity={0.75}
    >
      <View style={styles.topRow}>
        {iconName && (
          <View style={styles.iconBox}>
            <Ionicons name={iconName} size={18} color={iconColor} />
          </View>
        )}
        {badge ? (
          <View style={[styles.badgeBox, { backgroundColor: badgeBg }]}>
            <Text style={[styles.badgeText, { color: badgeColor }]}>{badge}</Text>
          </View>
        ) : null}
      </View>

      <Text style={[styles.value, { fontSize: 22 * scale }]}>{value}</Text>
      <Text style={styles.title} numberOfLines={2}>
        {title}
      </Text>
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
    </Container>
  );
};

export const KPIcard = KPICard;

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: radius.md,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
    minHeight: 110,
    justifyContent: 'space-between',
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  iconBox: {
    padding: 4,
    borderRadius: radius.sm,
  },
  badgeBox: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: radius.round,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  value: {
    fontWeight: '800',
    color: colors.textPrimary,
    letterSpacing: -0.5,
  },
  title: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary,
    marginTop: 2,
  },
  subtitle: {
    fontSize: 10,
    color: '#757575',
    marginTop: 2,
  },
});
