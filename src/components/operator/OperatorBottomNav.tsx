import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import { useRouter, usePathname } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { radius } from '../../theme/radius';
import { useOperatorStore } from '../../store/operator.store';
import { useAppContext } from '../../store/app-context';
import { getOperatorTexts } from '../../i18n/operator-translations';

export const OperatorBottomNav: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { state } = useAppContext();
  const t = getOperatorTexts(state.language);
  const { kpis } = useOperatorStore();
  const [operationsModalVisible, setOperationsModalVisible] = useState(false);
  const [moreModalVisible, setMoreModalVisible] = useState(false);

  const isTabActive = (tab: 'dashboard' | 'queue' | 'operations' | 'exceptions' | 'more') => {
    if (tab === 'dashboard') return pathname === '/(operator)' || pathname === '/(operator)/index';
    if (tab === 'queue') return pathname.includes('/(operator)/queue');
    if (tab === 'operations') return pathname.includes('/operations');
    if (tab === 'exceptions') return pathname.includes('/exceptions');
    if (tab === 'more') return pathname.includes('/farmer');
    return false;
  };

  return (
    <>
      <View style={styles.bar}>
        {/* 1. Dashboard */}
        <TouchableOpacity
          style={styles.tab}
          onPress={() => router.push('/(operator)')}
          activeOpacity={0.7}
        >
          <Ionicons
            name={isTabActive('dashboard') ? 'speedometer' : 'speedometer-outline'}
            size={22}
            color={isTabActive('dashboard') ? colors.primary : '#757575'}
          />
          <Text style={[styles.tabText, isTabActive('dashboard') && styles.tabTextActive]}>
            {t.navDashboard}
          </Text>
        </TouchableOpacity>

        {/* 2. Queue */}
        <TouchableOpacity
          style={styles.tab}
          onPress={() => router.push('/(operator)/queue')}
          activeOpacity={0.7}
        >
          <View style={{ position: 'relative' }}>
            <Ionicons
              name={isTabActive('queue') ? 'list' : 'list-outline'}
              size={22}
              color={isTabActive('queue') ? colors.primary : '#757575'}
            />
            {kpis.farmersWaiting > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{kpis.farmersWaiting}</Text>
              </View>
            )}
          </View>
          <Text style={[styles.tabText, isTabActive('queue') && styles.tabTextActive]}>
            {t.navQueue}
          </Text>
        </TouchableOpacity>

        {/* 3. Operations (Center Action Button) */}
        <TouchableOpacity
          style={styles.centerTab}
          onPress={() => setOperationsModalVisible(true)}
          activeOpacity={0.8}
        >
          <View style={styles.centerIconBox}>
            <Ionicons name="apps" size={24} color="#FFFFFF" />
          </View>
          <Text style={[styles.tabText, isTabActive('operations') && styles.tabTextActive]}>
            {t.navOperations}
          </Text>
        </TouchableOpacity>

        {/* 4. Exceptions */}
        <TouchableOpacity
          style={styles.tab}
          onPress={() => router.push('/(operator)/exceptions')}
          activeOpacity={0.7}
        >
          <Ionicons
            name={isTabActive('exceptions') ? 'warning' : 'warning-outline'}
            size={22}
            color={isTabActive('exceptions') ? colors.primary : '#757575'}
          />
          <Text style={[styles.tabText, isTabActive('exceptions') && styles.tabTextActive]}>
            {t.navExceptions}
          </Text>
        </TouchableOpacity>

        {/* 5. More */}
        <TouchableOpacity
          style={styles.tab}
          onPress={() => setMoreModalVisible(true)}
          activeOpacity={0.7}
        >
          <Ionicons
            name={isTabActive('more') ? 'ellipsis-horizontal' : 'ellipsis-horizontal-outline'}
            size={22}
            color={isTabActive('more') ? colors.primary : '#757575'}
          />
          <Text style={[styles.tabText, isTabActive('more') && styles.tabTextActive]}>
            {t.navMore}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Operations Quick Menu Modal */}
      <Modal visible={operationsModalVisible} transparent animationType="slide">
        <TouchableOpacity
          style={styles.sheetOverlay}
          activeOpacity={1}
          onPress={() => setOperationsModalVisible(false)}
        >
          <View style={styles.sheetContent}>
            <View style={styles.sheetHandle} />
            <Text style={styles.sheetTitle}>{t.mandiOperationsTitle}</Text>

            <View style={styles.sheetGrid}>
              <TouchableOpacity
                style={styles.sheetItem}
                onPress={() => {
                  setOperationsModalVisible(false);
                  router.push('/(operator)/operations/check-in');
                }}
              >
                <View style={[styles.sheetIcon, { backgroundColor: '#0D47A1' }]}>
                  <Ionicons name="qr-code" size={22} color="#FFFFFF" />
                </View>
                <Text style={styles.sheetItemText}>{t.gateCheckIn}</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.sheetItem}
                onPress={() => {
                  setOperationsModalVisible(false);
                  router.push('/(operator)/operations/quality-check');
                }}
              >
                <View style={[styles.sheetIcon, { backgroundColor: colors.accent }]}>
                  <Ionicons name="flask" size={22} color="#FFFFFF" />
                </View>
                <Text style={styles.sheetItemText}>{t.qualityLab}</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.sheetItem}
                onPress={() => {
                  setOperationsModalVisible(false);
                  router.push('/(operator)/operations/weighing');
                }}
              >
                <View style={[styles.sheetIcon, { backgroundColor: colors.primary }]}>
                  <Ionicons name="scale" size={22} color="#FFFFFF" />
                </View>
                <Text style={styles.sheetItemText}>{t.weighbridge}</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.sheetItem}
                onPress={() => {
                  setOperationsModalVisible(false);
                  router.push('/(operator)/operations/procurement');
                }}
              >
                <View style={[styles.sheetIcon, { backgroundColor: '#7B1FA2' }]}>
                  <Ionicons name="checkmark-done" size={22} color="#FFFFFF" />
                </View>
                <Text style={styles.sheetItemText}>{t.procurementDesk}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* More Options Modal */}
      <Modal visible={moreModalVisible} transparent animationType="slide">
        <TouchableOpacity
          style={styles.sheetOverlay}
          activeOpacity={1}
          onPress={() => setMoreModalVisible(false)}
        >
          <View style={styles.sheetContent}>
            <View style={styles.sheetHandle} />
            <Text style={styles.sheetTitle}>{t.additionalModules}</Text>

            <TouchableOpacity
              style={styles.listMenuItem}
              onPress={() => {
                setMoreModalVisible(false);
                router.push('/(operator)/exceptions');
              }}
            >
              <Ionicons name="warning-outline" size={20} color="#C2185B" />
              <Text style={styles.listMenuText}>{t.stationExceptionsDisputes}</Text>
              <Ionicons name="chevron-forward" size={18} color="#BDBDBD" />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.listMenuItem}
              onPress={() => {
                setMoreModalVisible(false);
                router.push('/(operator)/farmer/TX-2026-001' as any);
              }}
            >
              <Ionicons name="person-circle-outline" size={20} color={colors.secondary} />
              <Text style={styles.listMenuText}>{t.farmerDossier}</Text>
              <Ionicons name="chevron-forward" size={18} color="#BDBDBD" />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.listMenuItem}
              onPress={() => {
                setMoreModalVisible(false);
                router.replace('/(auth)/welcome');
              }}
            >
              <Ionicons name="swap-horizontal" size={20} color="#616161" />
              <Text style={styles.listMenuText}>{t.switchRole}</Text>
              <Ionicons name="chevron-forward" size={18} color="#BDBDBD" />
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    height: 64,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: colors.border,
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingBottom: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 4,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerTab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    top: -8,
  },
  centerIconBox: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  tabText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#757575',
    marginTop: 2,
  },
  tabTextActive: {
    color: colors.primary,
    fontWeight: '800',
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -8,
    backgroundColor: colors.error,
    borderRadius: 8,
    width: 16,
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: 'bold',
  },
  sheetOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  sheetContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    padding: spacing.lg,
    paddingBottom: spacing.xl,
  },
  sheetHandle: {
    width: 40,
    height: 4,
    backgroundColor: '#E0E0E0',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: spacing.md,
  },
  sheetTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: spacing.md,
    textAlign: 'center',
  },
  sheetGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
    justifyContent: 'space-around',
  },
  sheetItem: {
    width: '44%',
    alignItems: 'center',
    padding: spacing.md,
    backgroundColor: '#F9F9F9',
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: '#EEEEEE',
  },
  sheetIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  sheetItemText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  listMenuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
    gap: 12,
  },
  listMenuText: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    color: colors.textPrimary,
  },
});
