import React from 'react';
import { StyleSheet, View } from 'react-native';
import { ScreenContainer } from '../../src/components/common';
import { SystemExceptionLogs } from '../../src/components/admin';
import { spacing } from '../../src/theme/spacing';

export default function AdminExceptionsScreen() {
  return (
    <ScreenContainer scrollable style={styles.container}>
      <View style={styles.contentWrap}>
        <SystemExceptionLogs embedded={false} />
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: spacing.md,
  },
  contentWrap: {
    paddingBottom: spacing.xl,
  },
});