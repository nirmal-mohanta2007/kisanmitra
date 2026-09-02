import React from 'react';
import { View, ScrollView, StyleSheet, SafeAreaView } from 'react-native';
import { colors, spacing } from '../../theme';
import { KisanText } from './KisanText';

interface ScreenContainerProps {
  title?: string;
  scrollable?: boolean;
  children: React.ReactNode;
  backgroundColor?: string;
}

export const ScreenContainer: React.FC<ScreenContainerProps> = ({
  title,
  scrollable = true,
  children,
  backgroundColor = colors.background,
}) => {
  const content = (
    <View style={[styles.content, { backgroundColor }]}>
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
        <ScrollView contentContainerStyle={styles.scrollContent}>
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
    padding: spacing.l,
  },
  header: {
    marginBottom: spacing.l,
  },
});
