import React from 'react';
import { Text as RNText, TextProps as RNTextProps, StyleSheet, TextStyle } from 'react-native';
import { useAppContext } from '../../store/app-context';

export interface AppTextProps extends RNTextProps {
  children?: React.ReactNode;
  disableScaling?: boolean;
}

/**
 * AppText - Universal accessible text component
 * Automatically scales font size and line height according to user accessibility
 * preference (A = 1.0x, A+ = 1.15x, A++ = 1.30x) set in AppContext.
 */
export const AppText: React.FC<AppTextProps> = ({
  style,
  children,
  disableScaling = false,
  ...props
}) => {
  let scale = 1.0;
  try {
    const { state } = useAppContext();
    if (state && state.textScale) {
      scale = state.textScale;
    }
  } catch {
    scale = 1.0;
  }

  if (disableScaling || scale === 1.0) {
    return (
      <RNText style={style} {...props}>
        {children}
      </RNText>
    );
  }

  const flattened = (StyleSheet.flatten(style) || {}) as TextStyle;
  const originalFontSize = flattened.fontSize !== undefined ? flattened.fontSize : 17;
  const scaledFontSize = Math.round(originalFontSize * scale);
  const scaledLineHeight = flattened.lineHeight !== undefined
    ? Math.round(flattened.lineHeight * scale)
    : undefined;

  return (
    <RNText
      {...props}
      style={[
        style,
        {
          fontSize: scaledFontSize,
          ...(scaledLineHeight !== undefined ? { lineHeight: scaledLineHeight } : {}),
        },
      ]}
    >
      {children}
    </RNText>
  );
};
