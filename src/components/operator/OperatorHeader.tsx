import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { radius } from '../../theme/radius';
import { useOperatorStore } from '../../store/operator.store';

interface OperatorHeaderProps {
  scale?: number;
}

export const OperatorHeader: React.FC<OperatorHeaderProps> = ({ scale = 1.0 }) => {
  const router = useRouter();
  const { currentOperator, alerts, dismissAlert, isQueuePaused, toggleQueuePause } = useOperatorStore();
  const [showNotificationModal, setShowNotificationModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);

  return (
    <View style={styles.headerCard}>
      <View style={styles.headerTop}>
        <View style={{ flex: 1 }}>
          <View style={styles.brandRow}>
            <Text style={styles.brandTitle}>KISAN MITRA</Text>
            <View style={styles.liveTagBox}>
              <View style={styles.livePulseDot} />
              <Text style={styles.liveTagText}>Live</Text>
            </View>
          </View>
          <Text style={[styles.consoleTitle, { fontSize: 18 * scale }]}>Operator Console</Text>
          <Text style={styles.mandiName}>Mandi: {currentOperator.mandiName}</Text>
          <Text style={styles.officerName}>
            Operator: {currentOperator.name} ({currentOperator.operatorId})
          </Text>
        </View>

        <View style={styles.headerRight}>
          {/* Notification Button */}
          <TouchableOpacity
            style={styles.iconBtn}
            onPress={() => setShowNotificationModal(true)}
            activeOpacity={0.7}
          >
            <Ionicons name="notifications-outline" size={20} color={colors.secondary} />
            {alerts.length > 0 && (
              <View style={styles.badgeCount}>
                <Text style={styles.badgeCountText}>{alerts.length}</Text>
              </View>
            )}
          </TouchableOpacity>

          {/* Profile / Station Button */}
          <TouchableOpacity
            style={styles.iconBtn}
            onPress={() => setShowProfileModal(true)}
            activeOpacity={0.7}
          >
            <Ionicons name="person-circle-outline" size={24} color={colors.primary} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Notification Drawer Modal */}
      <Modal visible={showNotificationModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <Ionicons name="notifications" size={20} color={colors.secondary} />
                <Text style={styles.modalTitle}>Mandi Operational Alerts ({alerts.length})</Text>
              </View>
              <TouchableOpacity onPress={() => setShowNotificationModal(false)}>
                <Ionicons name="close" size={22} color={colors.textPrimary} />
              </TouchableOpacity>
            </View>

            <ScrollView style={{ maxHeight: 350 }}>
              {alerts.length === 0 ? (
                <Text style={styles.emptyText}>No active alerts at this time.</Text>
              ) : (
                alerts.map((a) => (
                  <View key={a.id} style={styles.alertRow}>
                    <Text style={{ fontSize: 16 }}>{a.icon}</Text>
                    <View style={{ flex: 1, marginHorizontal: 8 }}>
                      <Text style={styles.alertMsg}>{a.message}</Text>
                      <Text style={styles.alertTime}>{a.timestamp}</Text>
                    </View>
                    <TouchableOpacity onPress={() => dismissAlert(a.id)}>
                      <Ionicons name="checkmark-circle-outline" size={20} color={colors.primary} />
                    </TouchableOpacity>
                  </View>
                ))
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Profile / Mandi Session Modal */}
      <Modal visible={showProfileModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Mandi Station Operator Profile</Text>
              <TouchableOpacity onPress={() => setShowProfileModal(false)}>
                <Ionicons name="close" size={22} color={colors.textPrimary} />
              </TouchableOpacity>
            </View>

            <View style={styles.profileDetails}>
              <View style={styles.profileRow}>
                <Text style={styles.profileLabel}>Officer Name:</Text>
                <Text style={styles.profileValue}>{currentOperator.name}</Text>
              </View>
              <View style={styles.profileRow}>
                <Text style={styles.profileLabel}>Operator ID:</Text>
                <Text style={styles.profileValue}>{currentOperator.operatorId}</Text>
              </View>
              <View style={styles.profileRow}>
                <Text style={styles.profileLabel}>Designation:</Text>
                <Text style={styles.profileValue}>{currentOperator.designation}</Text>
              </View>
              <View style={styles.profileRow}>
                <Text style={styles.profileLabel}>Procurement Center:</Text>
                <Text style={styles.profileValue}>{currentOperator.mandiName}</Text>
              </View>
              <View style={styles.profileRow}>
                <Text style={styles.profileLabel}>Active Shift:</Text>
                <Text style={styles.profileValue}>{currentOperator.shift}</Text>
              </View>
              <View style={styles.profileRow}>
                <Text style={styles.profileLabel}>Gate Intake Status:</Text>
                <Text style={[styles.profileValue, { color: isQueuePaused ? '#C62828' : '#2E7D32' }]}>
                  {isQueuePaused ? 'PAUSED' : 'ACTIVE'}
                </Text>
              </View>
            </View>

            <View style={styles.profileActions}>
              <TouchableOpacity
                style={[styles.actionBtn, { backgroundColor: isQueuePaused ? '#2E7D32' : '#C2185B' }]}
                onPress={() => {
                  toggleQueuePause();
                  setShowProfileModal(false);
                }}
              >
                <Ionicons name={isQueuePaused ? 'play' : 'pause'} size={16} color="#FFFFFF" />
                <Text style={styles.actionBtnText}>{isQueuePaused ? 'Resume Gate Intake' : 'Pause Gate Intake'}</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.actionBtn, { backgroundColor: '#424242' }]}
                onPress={() => {
                  setShowProfileModal(false);
                  router.replace('/(auth)/welcome');
                }}
              >
                <Ionicons name="log-out-outline" size={16} color="#FFFFFF" />
                <Text style={styles.actionBtnText}>Sign Out Station</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  headerCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  brandTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: colors.primary,
    letterSpacing: 0.8,
  },
  liveTagBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: radius.round,
    gap: 4,
  },
  livePulseDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#2E7D32',
  },
  liveTagText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#2E7D32',
  },
  consoleTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.textPrimary,
    marginTop: 2,
  },
  mandiName: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textSecondary,
    marginTop: 2,
  },
  officerName: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  iconBtn: {
    padding: 6,
    position: 'relative',
    backgroundColor: '#F5F5F5',
    borderRadius: radius.round,
  },
  badgeCount: {
    position: 'absolute',
    top: 2,
    right: 2,
    backgroundColor: colors.error,
    borderRadius: 8,
    width: 16,
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeCountText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.md,
  },
  modalContent: {
    width: '100%',
    maxWidth: 480,
    backgroundColor: '#FFFFFF',
    borderRadius: radius.lg,
    padding: spacing.lg,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
    paddingBottom: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  emptyText: {
    padding: spacing.md,
    textAlign: 'center',
    color: colors.textSecondary,
  },
  alertRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  alertMsg: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  alertTime: {
    fontSize: 10,
    color: '#757575',
    marginTop: 2,
  },
  profileDetails: {
    gap: 8,
    marginVertical: spacing.sm,
  },
  profileRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  },
  profileLabel: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  profileValue: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  profileActions: {
    marginTop: spacing.md,
    gap: 8,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: radius.md,
    gap: 8,
  },
  actionBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
  },
});
