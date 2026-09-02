import React from 'react';
import { Stack } from 'expo-router';
import { Colors } from '../../src/constants/theme';

export default function OperatorLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: Colors.secondary,
        },
        headerTintColor: Colors.surface,
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        contentStyle: {
          backgroundColor: Colors.background,
        }
      }}
    >
      <Stack.Screen name="index" options={{ title: 'Operator Dashboard' }} />
      <Stack.Screen name="weigh" options={{ title: 'Record Weight', presentation: 'modal' }} />
      <Stack.Screen name="quality" options={{ title: 'Quality Check', presentation: 'modal' }} />
      <Stack.Screen name="detail" options={{ title: 'Transaction Detail' }} />
    </Stack>
  );
}
