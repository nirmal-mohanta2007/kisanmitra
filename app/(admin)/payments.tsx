import React from 'react';
import { StyleSheet, View } from 'react-native';
import { ScreenContainer } from '../../src/components/common';
import { PaymentSettlementOversight } from '../../src/components/admin';
import { spacing } from '../../src/theme/spacing';

export default function AdminPaymentsScreen() {
  return (
    <ScreenContainer scrollable style={styles.container}>
      <View style={styles.contentWrap}>
        <PaymentSettlementOversight embedded={false} />
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