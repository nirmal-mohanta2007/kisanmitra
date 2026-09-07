import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, useWindowDimensions } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAppContext } from '../../src/store/app-context';
import { UserRole } from '../../src/types/enums';
import { colors } from '../../src/theme/colors';
import { spacing } from '../../src/theme/spacing';
import { radius } from '../../src/theme/radius';
import { OperatorProvider } from '../../src/store/operator.store';
import { OperatorSidebar, OperatorBottomNav } from '../../src/components/operator';

import { useAuthContext } from '../../src/context/AuthContext';

export default function OperatorLayout() {
  const { state, dispatch } = useAppContext();
  const { appUser } = useAuthContext();
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isDesktop = width >= 800;

  // Auto-sync Operator role & authenticated user profile into AppContext
  React.useEffect(() => {
    if (state.currentRole !== UserRole.OPERATOR) {
      dispatch({
        type: 'SET_ROLE',
        payload: {
          role: UserRole.OPERATOR,
          userId: appUser?.uid || 'OP-104',
          userName: appUser?.name || 'Suresh Verma',
        },
      });
    }
  }, [state.currentRole, appUser, dispatch]);

  return (
    <OperatorProvider>
      <View style={styles.rootContainer}>
        <View style={isDesktop ? styles.desktopLayout : styles.mobileLayout}>
          {isDesktop && <OperatorSidebar />}

          <View style={styles.contentArea}>
            <Stack
              screenOptions={{
                headerShown: false,
              }}
            >
              <Stack.Screen
                name="index"
                options={{
                  title: 'Operator Command Station',
                  headerShown: false,
                }}
              />
              <Stack.Screen
                name="queue"
                options={{
                  title: 'Live Procurement Queue',
                }}
              />
              <Stack.Screen
                name="farmer/[transactionId]"
                options={{
                  title: 'Farmer Dossier & Workflow',
                }}
              />
              <Stack.Screen
                name="operations/check-in"
                options={{
                  title: 'Gate Entry Check-in',
                }}
              />
              <Stack.Screen
                name="operations/weighing"
                options={{
                  title: 'Electronic Weighbridge',
                }}
              />
              <Stack.Screen
                name="operations/quality-check"
                options={{
                  title: 'Quality & Moisture Lab',
                }}
              />
              <Stack.Screen
                name="operations/procurement"
                options={{
                  title: 'Procurement Settlement',
                }}
              />
              <Stack.Screen
                name="exceptions"
                options={{
                  title: 'Station Exceptions',
                }}
              />
              <Stack.Screen
                name="payments"
                options={{
                  title: 'DBT Payment Batches',
                }}
              />
            </Stack>
          </View>
        </View>

        {!isDesktop && <OperatorBottomNav />}
      </View>
    </OperatorProvider>
  );
}

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  desktopLayout: {
    flex: 1,
    flexDirection: 'row',
  },
  mobileLayout: {
    flex: 1,
  },
  contentArea: {
    flex: 1,
  },
  accessDeniedContainer: {
    flex: 1,
    backgroundColor: '#F5F7FA',
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.lg,
  },
  accessCard: {
    width: '100%',
    maxWidth: 440,
    backgroundColor: '#FFFFFF',
    borderRadius: radius.lg,
    padding: spacing.xl,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  lockCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#FFEBEE',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  accessTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.error,
    marginBottom: spacing.xs,
    textAlign: 'center',
  },
  accessSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: spacing.md,
  },
  roleHint: {
    fontSize: 12,
    color: '#757575',
    marginBottom: spacing.lg,
  },
  switchOperatorBtn: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: colors.secondary,
    paddingVertical: 14,
    borderRadius: radius.md,
    marginBottom: spacing.sm,
  },
  switchOperatorBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 15,
  },
  returnBtn: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 12,
    borderRadius: radius.md,
    backgroundColor: '#EEEEEE',
  },
  returnBtnText: {
    color: colors.textSecondary,
    fontWeight: '600',
    fontSize: 14,
  },
});