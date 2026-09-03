import React from 'react';
import { View, ScrollView, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { KisanText } from './KisanText';

export interface ScreenContainerProps {
  title?: string;
  scrollable?: boolean;
  children: React.ReactNode;
  backgroundColor?: string;
  style?: StyleProp<ViewStyle>;
  contentContainerStyle?: StyleProp<ViewStyle>;
}

export const ScreenContainer: React.FC<ScreenContainerProps> = ({
  title,
  scrollable = true,
  children,
  backgroundColor = colors.background,
  style,
  contentContainerStyle,
}) => {
  const content = (
    <View style={[styles.content, { backgroundColor }, style]}>
      {title && (
        <View style={styles.header}>
          <KisanText variant="header">{title}</KisanText>
        </View>
      )}
      {children}
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor }]}>
      {scrollable ? (
        <ScrollView contentContainerStyle={[styles.scrollContent, contentContainerStyle]}>
          {content}
        </ScrollView>
      ) : (
        content
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    padding: spacing.lg,
  },
  header: {
    marginBottom: spacing.md,
  },
});
