import React from 'react';
import { View, StyleSheet, ViewProps } from 'react-native';
import { colors, borderRadius, spacing } from '../../theme';

interface KisanCardProps extends ViewProps {
  padding?: 'none' | 'small' | 'medium' | 'large';
  noShadow?: boolean;
}

export const KisanCard: React.FC<KisanCardProps> = ({
  padding = 'medium',
  noShadow = false,
  style,
  children,
  ...rest
}) => {
  const getPadding = () => {
    switch (padding) {
      case 'none': return 0;
      case 'small': return spacing.s;
      case 'medium': return spacing.l;
      case 'large': return spacing.xxl;
      default: return spacing.l;
    }
  };

  return (
    <View
      style={[
        styles.card,
        !noShadow && styles.shadow,
        { padding: getPadding() },
        style,
      ]}
      {...rest}
    >
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.card,
    marginVertical: spacing.s,
  },
  shadow: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
});
