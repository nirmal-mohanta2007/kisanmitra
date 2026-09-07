import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter, usePathname } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { radius } from '../../theme/radius';
import { useOperatorStore } from '../../store/operator.store';

interface NavItem {
  title: string;
  route: string;
  icon: keyof typeof Ionicons.glyphMap;
  badge?: string;
}

export const OperatorSidebar: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { kpis, currentOperator } = useOperatorStore();

  const navItems: NavItem[] = [
    { title: 'Dashboard', route: '/(operator)', icon: 'speedometer-outline' },
    { title: 'Live Queue', route: '/(operator)/queue', icon: 'list-outline', badge: `${kpis.farmersWaiting}` },
    { title: 'Farmer Dossier', route: '/(operator)/farmer/TX-2026-001', icon: 'person-outline' },
    { title: 'Gate Check-in', route: '/(operator)/operations/check-in', icon: 'qr-code-outline' },
    { title: 'Quality Lab', route: '/(operator)/operations/quality-check', icon: 'flask-outline', badge: `${kpis.pendingQualityChecks}` },
    { title: 'Weighbridge', route: '/(operator)/operations/weighing', icon: 'scale-outline' },
    { title: 'Procurement', route: '/(operator)/operations/procurement', icon: 'checkmark-done-circle-outline' },
    { title: 'Exceptions', route: '/(operator)/exceptions', icon: 'warning-outline' },
  ];

  const isActive = (route: string) => {
    if (route === '/(operator)') {
      return pathname === '/(operator)' || pathname === '/(operator)/index';
    }
    return pathname.startsWith(route);
  };

  return (
    <View style={styles.sidebar}>
      {/* Brand Header */}
      <View style={styles.brandContainer}>
        <View style={styles.logoRow}>
          <View style={styles.logoIcon}>
            <Ionicons name="leaf" size={20} color="#FFFFFF" />
          </View>
          <View>
            <Text style={styles.brandTitle}>KISAN MITRA</Text>
            <Text style={styles.brandSubtitle}>Mandi Command Center</Text>
          </View>
        </View>

        <View style={styles.liveBadge}>
          <View style={styles.pulseDot} />
          <Text style={styles.liveText}>Talcher Mandi • Live</Text>
        </View>
      </View>

      {/* Nav Items */}
      <ScrollView style={styles.navList} showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionHeader}>STATION OPERATIONS</Text>
        {navItems.map((item) => {
          const active = isActive(item.route);
          return (
            <TouchableOpacity
              key={item.route}
              style={[styles.navItem, active && styles.navItemActive]}
              onPress={() => router.push(item.route as any)}
              activeOpacity={0.7}
            >
              <Ionicons
                name={item.icon}
                size={18}
                color={active ? colors.primary : colors.textSecondary}
              />
              <Text style={[styles.navText, active && styles.navTextActive]}>{item.title}</Text>
              {item.badge ? (
                <View
                  style={[
                    styles.navBadge,
                    active ? { backgroundColor: colors.primary } : { backgroundColor: '#EEEEEE' },
                  ]}
                >
                  <Text style={[styles.navBadgeText, active && { color: '#FFFFFF' }]}>
                    {item.badge}
                  </Text>
                </View>
              ) : null}
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Operator Session Footer */}
      <View style={styles.footer}>
        <View style={styles.operatorRow}>
          <View style={styles.operatorAvatar}>
            <Ionicons name="person" size={16} color={colors.secondary} />
          </View>
          <View style={{ flex: 1, marginLeft: 8 }}>
            <Text style={styles.operatorName} numberOfLines={1}>
              {currentOperator.name}
            </Text>
            <Text style={styles.operatorRole}>{currentOperator.operatorId} • Officer</Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.switchRoleBtn}
          onPress={() => router.replace('/(auth)/welcome')}
          activeOpacity={0.7}
        >
          <Ionicons name="swap-horizontal-outline" size={14} color="#757575" />
          <Text style={styles.switchRoleText}>Switch Role</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  sidebar: {
    width: 260,
    backgroundColor: '#FFFFFF',
    borderRightWidth: 1,
    borderRightColor: colors.border,
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  brandContainer: {
    padding: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  logoIcon: {
    backgroundColor: colors.primary,
    width: 36,
    height: 36,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.primary,
    letterSpacing: 0.5,
  },
  brandSubtitle: {
    fontSize: 11,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  liveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: radius.round,
    marginTop: 10,
    alignSelf: 'flex-start',
    gap: 6,
  },
  pulseDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#2E7D32',
  },
  liveText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#2E7D32',
  },
  navList: {
    flex: 1,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.md,
  },
  sectionHeader: {
    fontSize: 10,
    fontWeight: '800',
    color: '#9E9E9E',
    letterSpacing: 1,
    marginBottom: spacing.xs,
    paddingHorizontal: spacing.sm,
  },
  navItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: spacing.sm,
    borderRadius: radius.sm,
    marginBottom: 4,
  },
  navItemActive: {
    backgroundColor: '#E8F5E9',
  },
  navText: {
    flex: 1,
    marginLeft: 10,
    fontSize: 13,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  navTextActive: {
    color: colors.primary,
    fontWeight: '800',
  },
  navBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: radius.round,
  },
  navBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.textSecondary,
  },
  footer: {
    padding: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.divider,
    backgroundColor: '#FAFAFA',
  },
  operatorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  operatorAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#E3F2FD',
    alignItems: 'center',
    justifyContent: 'center',
  },
  operatorName: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  operatorRole: {
    fontSize: 11,
    color: colors.textSecondary,
  },
  switchRoleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 6,
    backgroundColor: '#EEEEEE',
    borderRadius: radius.sm,
  },
  switchRoleText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#616161',
  },
});
