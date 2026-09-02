import React from 'react';
import { TouchableOpacity, ActivityIndicator, StyleSheet, TouchableOpacityProps, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, borderRadius } from '../../theme';
import { KisanText } from './KisanText';

interface KisanButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: 'primary' | 'secondary' | 'outline' | 'danger';
  isLoading?: boolean;
  icon?: keyof typeof Ionicons.glyphMap;
}

export const KisanButton: React.FC<KisanButtonProps> = ({
  title,
  variant = 'primary',
  isLoading = false,
  icon,
  style,
  disabled,
  ...rest
}) => {
  const isOutline = variant === 'outline';
  
  const getBackgroundColor = () => {
    if (isOutline) return 'transparent';
    if (variant === 'primary') return colors.primary;
    if (variant === 'secondary') return colors.secondary;
    if (variant === 'danger') return colors.error;
    return colors.primary;
  };

  const getTextColor = () => {
    if (isOutline) return colors.primary;
    return colors.surface;
  };

  return (
    <TouchableOpacity
      style={[
        styles.button,
        { backgroundColor: getBackgroundColor() },
        isOutline && styles.outlineButton,
        (disabled || isLoading) && styles.disabled,
        style,
      ]}
      disabled={disabled || isLoading}
      {...rest}
    >
      {isLoading ? (
        <ActivityIndicator color={getTextColor()} />
      ) : (
        <View style={styles.content}>
          {icon && (
            <Ionicons name={icon} size={20} color={getTextColor()} style={styles.icon} />
          )}
          <KisanText variant="subheading" color={getTextColor()} style={styles.text}>
            {title}
          </KisanText>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    minHeight: 48,
    borderRadius: borderRadius.button,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.l,
    paddingVertical: spacing.m,
  },
  outlineButton: {
    borderWidth: 1,
    borderColor: colors.primary,
  },
  disabled: {
    opacity: 0.6,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    marginRight: spacing.s,
  },
  text: {
    fontWeight: '600',
  },
});
