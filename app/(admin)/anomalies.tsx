import React from 'react';
import { StyleSheet, View } from 'react-native';
import { ScreenContainer } from '../../src/components/common';
import { AiAnomalyDetectionDashboard } from '../../src/components/admin';

export default function AdminAnomaliesScreen() {
  return (
    <ScreenContainer scrollable style={styles.container}>
      <View style={styles.contentWrap}>
        <AiAnomalyDetectionDashboard embedded={false} />
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#0A0E1A',
    padding: 0,
  },
  contentWrap: {
    paddingBottom: 40,
  },
});