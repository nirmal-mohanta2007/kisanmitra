import React from 'react';
import { Text, TextProps, TextStyle } from 'react-native';
import { colors, FontSizes } from '../../theme';

type TextVariant = keyof typeof FontSizes;

interface KisanTextProps extends TextProps {
  variant?: TextVariant;
  color?: string;
  align?: 'auto' | 'left' | 'right' | 'center' | 'justify';
  weight?: '400' | '500' | '600' | '700' | 'bold' | 'normal';
}

export const KisanText: React.FC<KisanTextProps> = ({
  variant = 'body',
  color = colors.textPrimary || colors.text.primary,
  align = 'left',
  weight = 'normal',
  style,
  children,
  ...rest
}) => {
  const fontSize = FontSizes[variant] || FontSizes.body;
  const textStyle: TextStyle = {
    fontSize,
    color,
    textAlign: align,
    fontWeight: weight,
  };

  return (
    <Text style={[textStyle, style]} {...rest}>
      {children}
    </Text>
  );
};
