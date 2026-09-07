import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Modal,
  Alert,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../src/theme/colors';
import { spacing } from '../../src/theme/spacing';
import { radius } from '../../src/theme/radius';
import {
  ScreenContainer,
  KisanCard,
  SectionHeader,
  StatusBadge,
} from '../../src/components/common';
import { useAppContext } from '../../src/store/app-context';
import { useOperatorStore } from '../../src/store/operator.store';
import { QueueCard, SubScreenHeader } from '../../src/components/operator';
import { QueueItemData } from '../../src/services/queueService';
import { getOperatorTexts } from '../../src/i18n/operator-translations';

export default function OperatorQueueScreen() {
  const router = useRouter();
  const { state } = useAppContext();
  const scale = state.textScale || 1.0;
  const t = getOperatorTexts(state.language);

  const {
    kpis,
    currentServing,
    queue,
    isQueuePaused,
    callNextToken,
    callSpecificToken,
    announceToken,
    allocateLane,
    toggleQueuePause,
    resetQueue,
  } = useOperatorStore();

  const [searchQuery, setSearchQuery] = useState('');

  // Announcement Modal State (Section 10)
  const [announceModalVisible, setAnnounceModalVisible] = useState(false);
  const [announcingTarget, setAnnouncingTarget] = useState<QueueItemData | null>(null);
  const [targetLane, setTargetLane] = useState('Lane 1');

  // Lane Allocation Modal State
  const [laneModalVisible, setLaneModalVisible] = useState(false);
  const [selectedQueueItem, setSelectedQueueItem] = useState<QueueItemData | null>(null);

  // Call Next Token
  const handleCallNext = async () => {
    if (isQueuePaused) {
      Alert.alert('Queue Paused', 'Please resume the gate queue before calling tokens.');
      return;
    }

    const res = await callNextToken(targetLane);
    if (res.success) {
      Alert.alert(
        'Token Called! 📢',
        `Token ${res.token} (${res.farmer}) called to ${targetLane}. Audio broadcast activated.`
      );
    } else {
      Alert.alert('Queue Empty', 'No more farmers currently waiting in line.');
    }
  };

  // Open Announcement Confirmation Modal
  const openAnnounceDialog = (item?: QueueItemData) => {
    const target = item || queue[0] || {
      position: 1,
      token: currentServing.token,
      farmer: currentServing.farmer,
      crop: currentServing.crop,
      quantity: currentServing.quantity,
      waitTime: '0 min',
      status: 'Serving',
    };
    setAnnouncingTarget(target);
    setAnnounceModalVisible(true);
  };

  // Confirm Announcement
  const confirmAnnouncement = async () => {
    if (!announcingTarget) return;

    await announceToken(announcingTarget.token, announcingTarget.farmer, targetLane);
    setAnnounceModalVisible(false);

    Alert.alert(
      'Announcement Broadcasted! 🔊',
      `Token ${announcingTarget.token} (${announcingTarget.farmer}) announced successfully over Mandi Public Address system on ${targetLane}.`
    );
  };

  // Confirm Lane Allocation
  const confirmLaneAllocation = (laneNum: number) => {
    if (!selectedQueueItem) return;
    allocateLane(laneNum, selectedQueueItem.token, 'Quality Check', selectedQueueItem.farmer);
    setLaneModalVisible(false);
    Alert.alert(
      'Lane Allocated ✓',
      `Token ${selectedQueueItem.token} (${selectedQueueItem.farmer}) assigned to Lane ${laneNum}.`
    );
  };

  const filteredQueue = queue.filter(
    (q) =>
      !searchQuery ||
      q.token.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.farmer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.crop.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <ScreenContainer scrollable style={styles.container}>
      <SubScreenHeader
        title={t.queueTitle}
        subtitle={t.queueSub}
      />

      {/* 1. CURRENTLY SERVING HERO CARD (Section 10) */}
      <KisanCard style={styles.servingCard}>
        <View style={styles.servingHeader}>
          <View style={styles.servingPill}>
            <Text style={styles.servingPillTitle}>{t.currentlyServing}</Text>
            <Text style={[styles.servingTokenNumber, { fontSize: 28 * scale }]}>
              {currentServing.token}
            </Text>
          </View>

          <View style={styles.servingStatusCol}>
            <View style={styles.laneTagBox}>
              <Ionicons name="git-branch" size={14} color="#FFFFFF" />
              <Text style={styles.laneTagText}>{currentServing.lane}</Text>
            </View>
            <View style={styles.statusBox}>
              <Text style={styles.statusBoxText}>{currentServing.stage}</Text>
            </View>
          </View>
        </View>

        <View style={styles.servingDivider} />

        <View style={styles.servingFooter}>
          <View>
            <Text style={styles.servingFarmerText}>
              {t.farmer}: <Text style={{ fontWeight: 'bold' }}>{currentServing.farmer}</Text>
            </Text>
            <Text style={styles.servingCropText}>
              🌾 {currentServing.crop} • {currentServing.quantity} ({currentServing.vehicle})
            </Text>
          </View>

          <View style={styles.waitingCountBadge}>
            <Ionicons name="people" size={14} color={colors.secondary} />
            <Text style={styles.waitingCountText}>
              {t.waitingCount}: {kpis.farmersWaiting} {t.farmersText}
            </Text>
          </View>
        </View>
      </KisanCard>

      {/* 2. CONTROLLER ACTIONS BAR (Section 10) */}
      <View style={styles.controllerBar}>
        <TouchableOpacity
          style={[styles.ctrlBtn, { backgroundColor: colors.primary }]}
          onPress={handleCallNext}
          activeOpacity={0.8}
        >
          <Ionicons name="megaphone" size={15} color="#FFFFFF" />
          <Text style={styles.ctrlBtnText}>{t.btnCallNext}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.ctrlBtn, { backgroundColor: '#E65100' }]}
          onPress={() => openAnnounceDialog()}
          activeOpacity={0.8}
        >
          <Ionicons name="volume-high" size={15} color="#FFFFFF" />
          <Text style={styles.ctrlBtnText}>{t.btnAnnounce}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.ctrlBtn, { backgroundColor: colors.secondary }]}
          onPress={() => {
            setSelectedQueueItem(queue[0] || null);
            setLaneModalVisible(true);
          }}
          activeOpacity={0.8}
        >
          <Ionicons name="navigate" size={15} color="#FFFFFF" />
          <Text style={styles.ctrlBtnText}>{t.btnAllocateLane}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.ctrlBtn,
            { backgroundColor: isQueuePaused ? '#2E7D32' : '#C2185B' },
          ]}
          onPress={() => {
            const paused = toggleQueuePause();
            Alert.alert(
              paused ? 'Queue Paused ⏸' : 'Queue Resumed ▶',
              paused
                ? 'Mandi gate entry paused. No incoming tokens will be routed.'
                : 'Mandi gate entry resumed. Traffic intake active.'
            );
          }}
          activeOpacity={0.8}
        >
          <Ionicons name={isQueuePaused ? 'play' : 'pause'} size={15} color="#FFFFFF" />
          <Text style={styles.ctrlBtnText}>{isQueuePaused ? t.btnResumeQueue : t.btnPauseQueue}</Text>
        </TouchableOpacity>
      </View>

      {/* Search Input */}
      <View style={styles.searchBar}>
        <Ionicons name="search" size={18} color={colors.textSecondary} />
        <TextInput
          style={styles.searchInput}
          placeholder={t.searchQueuePlaceholder}
          placeholderTextColor={colors.textSecondary}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <Ionicons name="close-circle" size={18} color="#9E9E9E" />
          </TouchableOpacity>
        )}
      </View>

      {/* 3. LIVE QUEUE LIST (Section 10) */}
      <View style={styles.queueHeaderRow}>
        <Text style={styles.queueSectionTitle}>
          WAITING FARMERS IN GATE QUEUE ({filteredQueue.length})
        </Text>
        {queue.length < 18 && (
          <TouchableOpacity
            style={styles.headerReloadBtn}
            onPress={resetQueue}
            activeOpacity={0.7}
          >
            <Ionicons name="refresh" size={14} color={colors.primary} />
            <Text style={styles.headerReloadText}>Reset 18 Farmers</Text>
          </TouchableOpacity>
        )}
      </View>

      {filteredQueue.length === 0 ? (
        <KisanCard style={styles.emptyCard}>
          <Ionicons name="checkmark-circle-outline" size={40} color={colors.primary} />
          <Text style={styles.emptyTitle}>No Farmers Waiting</Text>
          <Text style={styles.emptySub}>All registered arrival passes have been cleared.</Text>
          <TouchableOpacity
            style={styles.reloadQueueBtn}
            onPress={resetQueue}
            activeOpacity={0.8}
          >
            <Ionicons name="refresh-circle-outline" size={20} color="#FFFFFF" />
            <Text style={styles.reloadQueueBtnText}>Reload 18 Waiting Farmers</Text>
          </TouchableOpacity>
        </KisanCard>
      ) : (
        filteredQueue.map((item) => (
          <QueueCard
            key={item.token}
            item={item}
            scale={scale}
            onCall={(q) => callSpecificToken(q, targetLane)}
            onAnnounce={(q) => openAnnounceDialog(q)}
            onAllocateLane={(q) => {
              setSelectedQueueItem(q);
              setLaneModalVisible(true);
            }}
            onViewDetails={(q) => router.push(`/(operator)/farmer/TX-${q.token}` as any)}
          />
        ))
      )}

      <View style={{ height: 32 }} />

      {/* 4. ANNOUNCE CONFIRMATION MODAL (Section 10) */}
      <Modal visible={announceModalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <View style={styles.modalIconBox}>
              <Ionicons name="megaphone" size={32} color="#E65100" />
            </View>
            <Text style={styles.modalTitle}>
              Announce Token {announcingTarget?.token}?
            </Text>
            <Text style={styles.modalSubtitle}>
              Broadcast voice announcement over Mandi Public Address loudspeakers.
            </Text>

            <View style={styles.modalDetailBox}>
              <Text style={styles.modalDetailLabel}>Farmer:</Text>
              <Text style={styles.modalDetailVal}>{announcingTarget?.farmer}</Text>
            </View>

            <View style={styles.modalDetailBox}>
              <Text style={styles.modalDetailLabel}>Assigned Lane:</Text>
              <View style={styles.laneSelectorRow}>
                {['Lane 1', 'Lane 2', 'Lane 3', 'Lane 4'].map((l) => (
                  <TouchableOpacity
                    key={l}
                    style={[styles.laneChip, targetLane === l && styles.laneChipActive]}
                    onPress={() => setTargetLane(l)}
                  >
                    <Text style={[styles.laneChipText, targetLane === l && styles.laneChipTextActive]}>
                      {l}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.modalBtn, { backgroundColor: '#EEEEEE' }]}
                onPress={() => setAnnounceModalVisible(false)}
              >
                <Text style={{ color: colors.textPrimary, fontWeight: '700' }}>CANCEL</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalBtn, { backgroundColor: '#E65100' }]}
                onPress={confirmAnnouncement}
              >
                <Ionicons name="volume-high" size={16} color="#FFFFFF" />
                <Text style={{ color: '#FFFFFF', fontWeight: '800' }}>ANNOUNCE</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* 5. ALLOCATE LANE MODAL */}
      <Modal visible={laneModalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>
              Allocate Lane for {selectedQueueItem?.token}
            </Text>
            <Text style={styles.modalSubtitle}>
              Assign an operational inspection lane for {selectedQueueItem?.farmer}.
            </Text>

            <View style={styles.laneOptionsList}>
              {[1, 2, 3, 4].map((num) => (
                <TouchableOpacity
                  key={num}
                  style={styles.laneOptionCard}
                  onPress={() => confirmLaneAllocation(num)}
                  activeOpacity={0.7}
                >
                  <View style={styles.laneOptionNumberBox}>
                    <Text style={styles.laneOptionNumberText}>{num}</Text>
                  </View>
                  <View style={{ flex: 1, marginLeft: 12 }}>
                    <Text style={styles.laneOptionTitle}>Lane {num}</Text>
                    <Text style={styles.laneOptionSub}>
                      {num === 1 ? 'Quality Check Bay' : num === 2 ? 'Weighbridge WB-02' : num === 3 ? 'Procurement Shed' : 'General Clearance'}
                    </Text>
                  </View>
                  <Ionicons name="chevron-forward" size={18} color={colors.primary} />
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity
              style={[styles.modalBtn, { backgroundColor: '#EEEEEE', marginTop: 12 }]}
              onPress={() => setLaneModalVisible(false)}
            >
              <Text style={{ color: colors.textPrimary, fontWeight: '700' }}>CANCEL</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: spacing.md,
  },
  servingCard: {
    padding: spacing.md,
    marginBottom: spacing.md,
    backgroundColor: '#FFFFFF',
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
  },
  servingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  servingPill: {
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: radius.md,
  },
  servingPillTitle: {
    fontSize: 10,
    fontWeight: '800',
    color: colors.primary,
    letterSpacing: 0.5,
  },
  servingTokenNumber: {
    fontWeight: '900',
    color: colors.primary,
    marginTop: 2,
  },
  servingStatusCol: {
    alignItems: 'flex-end',
    gap: 6,
  },
  laneTagBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.secondary,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: radius.round,
    gap: 4,
  },
  laneTagText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },
  statusBox: {
    backgroundColor: '#FFF3E0',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: radius.round,
  },
  statusBoxText: {
    color: '#E65100',
    fontSize: 11,
    fontWeight: '700',
  },
  servingDivider: {
    height: 1,
    backgroundColor: colors.divider,
    marginVertical: spacing.sm,
  },
  servingFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  servingFarmerText: {
    fontSize: 13,
    color: colors.textPrimary,
  },
  servingCropText: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 2,
  },
  waitingCountBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EDE7F6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: radius.round,
    gap: 4,
  },
  waitingCountText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#5E35B1',
  },
  controllerBar: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: spacing.md,
  },
  ctrlBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: radius.md,
    gap: 4,
  },
  ctrlBtnText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: spacing.sm,
    paddingVertical: 8,
    marginBottom: spacing.md,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    color: colors.textPrimary,
    padding: 0,
  },
  queueHeaderRow: {
    marginBottom: spacing.xs,
  },
  queueSectionTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#616161',
    letterSpacing: 0.5,
  },
  emptyCard: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textPrimary,
    marginTop: spacing.sm,
  },
  emptySub: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.md,
  },
  modalBox: {
    width: '100%',
    maxWidth: 420,
    backgroundColor: '#FFFFFF',
    borderRadius: radius.lg,
    padding: spacing.lg,
    alignItems: 'center',
  },
  modalIconBox: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FFF3E0',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.textPrimary,
    textAlign: 'center',
  },
  modalSubtitle: {
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 4,
    marginBottom: spacing.md,
  },
  modalDetailBox: {
    width: '100%',
    backgroundColor: '#FAFAFA',
    padding: spacing.sm,
    borderRadius: radius.sm,
    marginBottom: spacing.sm,
  },
  modalDetailLabel: {
    fontSize: 11,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  modalDetailVal: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  laneSelectorRow: {
    flexDirection: 'row',
    gap: 6,
    marginTop: 4,
  },
  laneChip: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: radius.round,
    backgroundColor: '#EEEEEE',
  },
  laneChipActive: {
    backgroundColor: colors.primary,
  },
  laneChipText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.textSecondary,
  },
  laneChipTextActive: {
    color: '#FFFFFF',
  },
  modalActions: {
    flexDirection: 'row',
    gap: 10,
    marginTop: spacing.md,
    width: '100%',
  },
  modalBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: radius.md,
    gap: 6,
  },
  laneOptionsList: {
    width: '100%',
    gap: 8,
    marginVertical: spacing.sm,
  },
  laneOptionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.sm,
    backgroundColor: '#FAFAFA',
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: '#EEEEEE',
  },
  laneOptionNumberBox: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  laneOptionNumberText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  laneOptionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  laneOptionSub: {
    fontSize: 11,
    color: colors.textSecondary,
  },
  headerReloadBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    backgroundColor: '#E8F5E9',
    borderRadius: radius.round,
  },
  headerReloadText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.primary,
  },
  reloadQueueBtn: {
    marginTop: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.md,
  },
  reloadQueueBtnText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 13,
  },
});