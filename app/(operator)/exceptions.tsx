import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Modal,
  TextInput,
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
import { SubScreenHeader } from '../../src/components/operator';
import { getOperatorTexts } from '../../src/i18n/operator-translations';
import {
  ExceptionCategory,
  ExceptionStatus,
  StationException,
} from '../../src/types/operator';

export default function OperatorExceptionsScreen() {
  const router = useRouter();
  const { state } = useAppContext();
  const scale = state.textScale || 1.0;
  const t = getOperatorTexts(state.language);

  const { exceptions, resolveException, addException, currentServing } = useOperatorStore();

  const [activeCategory, setActiveCategory] = useState<ExceptionCategory | 'All'>('All');
  const [activeStatus, setActiveStatus] = useState<ExceptionStatus | 'All'>('All');

  // Reschedule Modal State
  const [rescheduleModalVisible, setRescheduleModalVisible] = useState(false);
  const [reschedulingItem, setReschedulingItem] = useState<StationException | null>(null);
  const [selectedSlot, setSelectedSlot] = useState('Tomorrow Morning (09:00 AM - 12:00 PM)');

  // New Exception Modal State
  const [newModalVisible, setNewModalVisible] = useState(false);
  const [newToken, setNewToken] = useState('T-104');
  const [newFarmer, setNewFarmer] = useState('Ramesh Kumar');
  const [newCategory, setNewCategory] = useState<ExceptionCategory>('Wet Crop');
  const [newIssue, setNewIssue] = useState('');
  const [newNotes, setNewNotes] = useState('');

  // Resolve Modal State
  const [resolveModalVisible, setResolveModalVisible] = useState(false);
  const [resolvingItem, setResolvingItem] = useState<StationException | null>(null);
  const [resolutionNote, setResolutionNote] = useState('');

  const categories: (ExceptionCategory | 'All')[] = [
    'All',
    'Quality Rejection',
    'Wet Crop',
    'Slot Reschedule',
    'Weight Dispute',
    'Duplicate Booking',
    'Vehicle Mismatch',
    'Farmer Verification Issue',
    'System Issue',
  ];

  const categoryIcons: Record<string, keyof typeof Ionicons.glyphMap> = {
    'All': 'layers-outline',
    'Quality Rejection': 'flask-outline',
    'Wet Crop': 'water-outline',
    'Slot Reschedule': 'calendar-outline',
    'Weight Dispute': 'scale-outline',
    'Duplicate Booking': 'copy-outline',
    'Vehicle Mismatch': 'car-outline',
    'Farmer Verification Issue': 'person-outline',
    'System Issue': 'hardware-chip-outline',
  };

  const filteredExceptions = exceptions.filter((ex) => {
    const matchCat = activeCategory === 'All' || ex.category === activeCategory;
    const matchStat = activeStatus === 'All' || ex.status === activeStatus;
    return matchCat && matchStat;
  });

  const handleOpenReschedule = (item: StationException) => {
    setReschedulingItem(item);
    setRescheduleModalVisible(true);
  };

  const confirmReschedule = () => {
    if (!reschedulingItem) return;
    resolveException(
      reschedulingItem.id,
      `Slot rescheduled to ${selectedSlot}. Pass updated in procurement ledger.`
    );
    setRescheduleModalVisible(false);
    Alert.alert(
      'Slot Rescheduled ✓',
      `Farmer ${reschedulingItem.farmer} (${reschedulingItem.token}) slot rescheduled to: ${selectedSlot}. SMS notification queued.`
    );
  };

  const handleOpenResolve = (item: StationException) => {
    setResolvingItem(item);
    setResolutionNote(`Cleared by Mandi Station Officer after physical inspection.`);
    setResolveModalVisible(true);
  };

  const confirmResolve = () => {
    if (!resolvingItem) return;
    resolveException(resolvingItem.id, resolutionNote);
    setResolveModalVisible(false);
    Alert.alert(
      'Exception Resolved ✓',
      `Ticket #${resolvingItem.id} for Token ${resolvingItem.token} marked as RESOLVED.`
    );
  };

  const handleCreateNewException = () => {
    if (!newIssue.trim()) {
      Alert.alert('Validation Error', 'Please enter a description of the operational issue.');
      return;
    }

    addException({
      token: newToken.trim() || currentServing.token,
      farmer: newFarmer.trim() || currentServing.farmer,
      vehicle: currentServing.vehicle,
      crop: currentServing.crop,
      category: newCategory,
      issue: newIssue.trim(),
      status: 'OPEN',
      notes: newNotes.trim() || 'Logged at Mandi Station terminal.',
    });

    setNewModalVisible(false);
    setNewIssue('');
    setNewNotes('');

    Alert.alert(
      'Exception Ticket Logged ✓',
      `New exception raised for Token ${newToken} (${newFarmer}) under category ${newCategory}.`
    );
  };

  const getStatusBadgeColor = (status: ExceptionStatus) => {
    switch (status) {
      case 'OPEN':
        return { bg: '#FFEBEE', text: '#C62828' };
      case 'UNDER_REVIEW':
        return { bg: '#FFF3E0', text: '#E65100' };
      case 'RESOLVED':
        return { bg: '#E8F5E9', text: '#2E7D32' };
      case 'REJECTED':
        return { bg: '#FFEBEE', text: '#B71C1C' };
      case 'ESCALATED':
        return { bg: '#EDE7F6', text: '#6A1B9A' };
      default:
        return { bg: '#F5F5F5', text: '#616161' };
    }
  };

  return (
    <ScreenContainer scrollable style={styles.container}>
      <SubScreenHeader
        title={t.exceptionsTitle}
        subtitle={t.exceptionsSub}
      />

      <View style={styles.topActionHeader}>
        <View style={{ flex: 1 }}>
          <Text style={styles.exceptionScreenTitle}>{t.stationExceptionsDisputes}</Text>
        </View>
        <TouchableOpacity
          style={styles.newExBtn}
          onPress={() => setNewModalVisible(true)}
          activeOpacity={0.8}
        >
          <View style={styles.newExIconBox}>
            <Ionicons name="add-circle" size={16} color="#FFFFFF" style={{ width: 16, height: 16 }} />
          </View>
          <Text style={styles.newExBtnText}>LOG ISSUE</Text>
        </TouchableOpacity>
      </View>

      {/* 1. CATEGORY SCROLLER (Section 17) */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.catScroll}
        contentContainerStyle={{ gap: 8 }}
      >
        {categories.map((cat) => {
          const iconName = categoryIcons[cat] || 'alert-circle-outline';
          const isActive = activeCategory === cat;
          return (
            <TouchableOpacity
              key={cat}
              style={[styles.catChip, isActive && styles.catChipActive]}
              onPress={() => setActiveCategory(cat)}
              activeOpacity={0.7}
            >
              <View style={styles.catChipIconBox}>
                <Ionicons
                  name={iconName}
                  size={13}
                  color={isActive ? '#FFFFFF' : colors.textSecondary}
                  style={{ width: 13, height: 13 }}
                />
              </View>
              <Text
                style={[styles.catChipText, isActive && styles.catChipTextActive]}
              >
                {cat}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Status Filter */}
      <View style={styles.statusRow}>
        {(['All', 'OPEN', 'UNDER_REVIEW', 'RESOLVED'] as const).map((s) => (
          <TouchableOpacity
            key={s}
            style={[styles.statBtn, activeStatus === s && styles.statBtnActive]}
            onPress={() => setActiveStatus(s as any)}
          >
            <Text style={[styles.statBtnText, activeStatus === s && styles.statBtnTextActive]}>
              {s}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* 2. EXCEPTIONS LIST (Section 17) */}
      {filteredExceptions.length === 0 ? (
        <KisanCard style={styles.emptyCard}>
          <Ionicons name="shield-checkmark-outline" size={40} color={colors.primary} />
          <Text style={styles.emptyTitle}>No Exceptions Found</Text>
          <Text style={styles.emptySub}>
            All operational lots in category "{activeCategory}" are operating smoothly.
          </Text>
        </KisanCard>
      ) : (
        filteredExceptions.map((item) => {
          const badgeTheme = getStatusBadgeColor(item.status);
          const isOpen = item.status === 'OPEN' || item.status === 'UNDER_REVIEW';

          return (
            <KisanCard key={item.id} style={styles.exceptionCard}>
              <View style={styles.exHeader}>
                <View>
                  <Text style={styles.exTicketId}>EXCEPTION #{item.id}</Text>
                  <Text style={[styles.exFarmer, { fontSize: 16 * scale }]}>
                    {item.farmer} • <Text style={{ color: colors.primary }}>{item.token}</Text>
                  </Text>
                </View>

                <View style={[styles.statusBadge, { backgroundColor: badgeTheme.bg }]}>
                  <Text style={[styles.statusBadgeText, { color: badgeTheme.text }]}>
                    {item.status}
                  </Text>
                </View>
              </View>

              <View style={styles.catRow}>
                <View style={styles.catPill}>
                  <View style={styles.pillIconBox}>
                    <Ionicons name="pricetag-outline" size={11} color={colors.secondary} style={{ width: 11, height: 11 }} />
                  </View>
                  <Text style={styles.catPillText}>{item.category}</Text>
                </View>
                <Text style={styles.timeText}>{item.timestamp}</Text>
              </View>

              <View style={styles.issueBox}>
                <Text style={styles.issueText}>
                  <Text style={{ fontWeight: '700' }}>Issue: </Text>
                  {item.issue}
                </Text>
                {item.notes ? (
                  <Text style={styles.notesText}>
                    <Text style={{ fontWeight: '700' }}>Notes: </Text>
                    {item.notes}
                  </Text>
                ) : null}
                {item.resolutionNote ? (
                  <Text style={styles.resolutionText}>
                    <Text style={{ fontWeight: '700' }}>Resolution: </Text>
                    {item.resolutionNote}
                  </Text>
                ) : null}
              </View>

              {/* Action Buttons (Section 17) */}
              {isOpen && (
                <View style={styles.actionsBar}>
                  <TouchableOpacity
                    style={[styles.actBtn, { backgroundColor: colors.primary }]}
                    onPress={() => handleOpenResolve(item)}
                    activeOpacity={0.8}
                  >
                    <View style={styles.actIconBox}>
                      <Ionicons name="checkmark-circle" size={13} color="#FFFFFF" style={{ width: 13, height: 13 }} />
                    </View>
                    <Text style={styles.actBtnText}>RESOLVE</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.actBtn, { backgroundColor: colors.secondary }]}
                    onPress={() => handleOpenReschedule(item)}
                    activeOpacity={0.8}
                  >
                    <View style={styles.actIconBox}>
                      <Ionicons name="calendar-outline" size={13} color="#FFFFFF" style={{ width: 13, height: 13 }} />
                    </View>
                    <Text style={styles.actBtnText}>RESCHEDULE</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.actBtn, { backgroundColor: '#E65100' }]}
                    onPress={() => {
                      resolveException(
                        item.id,
                        'Sent to Mandi Supervisor & Zonal Agriculture Officer for inspection.'
                      );
                      Alert.alert(
                        'Escalated to Supervisor',
                        `Ticket #${item.id} escalated for supervisor review.`
                      );
                    }}
                    activeOpacity={0.8}
                  >
                    <View style={styles.actIconBox}>
                      <Ionicons name="arrow-up-circle-outline" size={13} color="#FFFFFF" style={{ width: 13, height: 13 }} />
                    </View>
                    <Text style={styles.actBtnText}>REVIEW</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.actBtn, { backgroundColor: colors.error }]}
                    onPress={() => {
                      resolveException(item.id, 'Lot rejected permanently under MSP FAQ norms.');
                      Alert.alert('Lot Rejected', `Ticket #${item.id} marked as REJECTED.`);
                    }}
                    activeOpacity={0.8}
                  >
                    <View style={styles.actIconBox}>
                      <Ionicons name="close-circle-outline" size={13} color="#FFFFFF" style={{ width: 13, height: 13 }} />
                    </View>
                    <Text style={styles.actBtnText}>REJECT</Text>
                  </TouchableOpacity>
                </View>
              )}
            </KisanCard>
          );
        })
      )}

      <View style={{ height: 32 }} />

      {/* 3. RESCHEDULE MODAL (Section 17) */}
      <Modal visible={rescheduleModalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Ionicons name="calendar" size={32} color={colors.secondary} />
            <Text style={styles.modalTitle}>Reschedule Procurement Slot</Text>
            <Text style={styles.modalSub}>
              Select an alternative slot for {reschedulingItem?.farmer} ({reschedulingItem?.token}).
            </Text>

            <View style={styles.slotOptionList}>
              {[
                'Today Evening (03:00 PM - 06:00 PM)',
                'Tomorrow Morning (09:00 AM - 12:00 PM)',
                'Tomorrow Afternoon (01:00 PM - 04:00 PM)',
                'Day After Tomorrow (09:00 AM - 12:00 PM)',
              ].map((slot) => (
                <TouchableOpacity
                  key={slot}
                  style={[styles.slotCard, selectedSlot === slot && styles.slotCardActive]}
                  onPress={() => setSelectedSlot(slot)}
                  activeOpacity={0.8}
                >
                  <Ionicons
                    name={selectedSlot === slot ? 'radio-button-on' : 'radio-button-off'}
                    size={18}
                    color={selectedSlot === slot ? colors.primary : '#9E9E9E'}
                  />
                  <Text style={[styles.slotText, selectedSlot === slot && styles.slotTextActive]}>
                    {slot}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.modalBtnRow}>
              <TouchableOpacity
                style={styles.cancelBtn}
                onPress={() => setRescheduleModalVisible(false)}
              >
                <Text style={{ color: colors.textPrimary, fontWeight: '700' }}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.confirmBtn} onPress={confirmReschedule}>
                <Text style={{ color: '#FFFFFF', fontWeight: '800' }}>CONFIRM RESCHEDULE</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* 4. RESOLVE MODAL */}
      <Modal visible={resolveModalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Ionicons name="checkmark-circle" size={36} color={colors.primary} />
            <Text style={styles.modalTitle}>Resolve Exception #{resolvingItem?.id}</Text>
            <Text style={styles.modalSub}>
              Enter resolution summary and operational action taken.
            </Text>

            <TextInput
              style={styles.resInput}
              multiline
              numberOfLines={3}
              value={resolutionNote}
              onChangeText={setResolutionNote}
              placeholder="e.g. Sample re-tested on Secondary Bay. Cleared at 13.5% moisture."
            />

            <View style={styles.modalBtnRow}>
              <TouchableOpacity
                style={styles.cancelBtn}
                onPress={() => setResolveModalVisible(false)}
              >
                <Text style={{ color: colors.textPrimary, fontWeight: '700' }}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.confirmBtn} onPress={confirmResolve}>
                <Text style={{ color: '#FFFFFF', fontWeight: '800' }}>MARK RESOLVED</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* 5. LOG NEW EXCEPTION MODAL */}
      <Modal visible={newModalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Log New Operational Exception</Text>
            <Text style={styles.modalSub}>
              Raise an official station ticket for immediate supervisor or bay attention.
            </Text>

            <ScrollView style={{ width: '100%', maxHeight: 380 }}>
              <View style={styles.formItem}>
                <Text style={styles.formLabel}>Token Number</Text>
                <TextInput
                  style={styles.formInput}
                  value={newToken}
                  onChangeText={setNewToken}
                  placeholder="e.g. T-104"
                />
              </View>

              <View style={styles.formItem}>
                <Text style={styles.formLabel}>Farmer Name</Text>
                <TextInput
                  style={styles.formInput}
                  value={newFarmer}
                  onChangeText={setNewFarmer}
                  placeholder="e.g. Ramesh Kumar"
                />
              </View>

              <View style={styles.formItem}>
                <Text style={styles.formLabel}>Category</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginVertical: 4 }}>
                  {categories.filter((c) => c !== 'All').map((cat) => (
                    <TouchableOpacity
                      key={cat}
                      style={[
                        styles.catChoice,
                        newCategory === cat && { backgroundColor: colors.secondary },
                      ]}
                      onPress={() => setNewCategory(cat as any)}
                    >
                      <Text
                        style={[
                          styles.catChoiceText,
                          newCategory === cat && { color: '#FFFFFF', fontWeight: 'bold' },
                        ]}
                      >
                        {cat}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>

              <View style={styles.formItem}>
                <Text style={styles.formLabel}>Issue Description *</Text>
                <TextInput
                  style={styles.formInput}
                  value={newIssue}
                  onChangeText={setNewIssue}
                  placeholder="e.g. High moisture 16.2% detected at Lab"
                />
              </View>

              <View style={styles.formItem}>
                <Text style={styles.formLabel}>Additional Notes</Text>
                <TextInput
                  style={[styles.formInput, { height: 60 }]}
                  multiline
                  value={newNotes}
                  onChangeText={setNewNotes}
                  placeholder="e.g. Advised farmer to sun-dry in Yard Bay 4"
                />
              </View>
            </ScrollView>

            <View style={styles.modalBtnRow}>
              <TouchableOpacity
                style={styles.cancelBtn}
                onPress={() => setNewModalVisible(false)}
              >
                <Text style={{ color: colors.textPrimary, fontWeight: '700' }}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.confirmBtn} onPress={handleCreateNewException}>
                <Text style={{ color: '#FFFFFF', fontWeight: '800' }}>CREATE TICKET</Text>
              </TouchableOpacity>
            </View>
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
  topActionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  exceptionScreenTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  newExBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#C2185B',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: radius.md,
    gap: 6,
  },
  newExBtnText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 12,
  },
  newExIconBox: {
    width: 16,
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  catScroll: {
    marginVertical: spacing.xs,
    marginBottom: spacing.sm,
  },
  catChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: radius.round,
    backgroundColor: '#EEEEEE',
    gap: 5,
    flexShrink: 0,
  },
  catChipActive: {
    backgroundColor: colors.secondary,
  },
  catChipIconBox: {
    width: 14,
    height: 14,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  catChipText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.textSecondary,
  },
  catChipTextActive: {
    color: '#FFFFFF',
  },
  statusRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: spacing.md,
  },
  statBtn: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: radius.sm,
    backgroundColor: '#FAFAFA',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  statBtnActive: {
    backgroundColor: '#E8F5E9',
    borderColor: colors.primary,
  },
  statBtnText: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  statBtnTextActive: {
    color: colors.primary,
    fontWeight: '800',
  },
  emptyCard: {
    alignItems: 'center',
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
    textAlign: 'center',
    marginTop: 4,
  },
  exceptionCard: {
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  exHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  exTicketId: {
    fontSize: 10,
    fontWeight: '800',
    color: '#C2185B',
    letterSpacing: 0.5,
  },
  exFarmer: {
    fontWeight: '800',
    color: colors.textPrimary,
    marginTop: 2,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: radius.round,
  },
  statusBadgeText: {
    fontSize: 10,
    fontWeight: '800',
  },
  catRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 4,
  },
  catPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E3F2FD',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: radius.round,
    gap: 4,
  },
  pillIconBox: {
    width: 12,
    height: 12,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  catPillText: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.secondary,
  },
  timeText: {
    fontSize: 10,
    color: '#757575',
  },
  issueBox: {
    backgroundColor: '#FAFAFA',
    padding: spacing.sm,
    borderRadius: radius.sm,
    marginVertical: spacing.xs,
    gap: 4,
  },
  issueText: {
    fontSize: 12,
    color: colors.textPrimary,
  },
  notesText: {
    fontSize: 11,
    color: colors.textSecondary,
  },
  resolutionText: {
    fontSize: 11,
    color: '#2E7D32',
    fontStyle: 'italic',
  },
  actionsBar: {
    flexDirection: 'row',
    gap: 6,
    marginTop: spacing.xs,
    alignItems: 'center',
  },
  actBtn: {
    flex: 1,
    minHeight: 32,
    maxHeight: 36,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
    paddingHorizontal: 4,
    borderRadius: radius.sm,
    gap: 4,
  },
  actIconBox: {
    width: 14,
    height: 14,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  actBtnText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.md,
  },
  modalCard: {
    width: '100%',
    maxWidth: 420,
    backgroundColor: '#FFFFFF',
    borderRadius: radius.lg,
    padding: spacing.lg,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.textPrimary,
    marginTop: 8,
    textAlign: 'center',
  },
  modalSub: {
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 4,
    marginBottom: spacing.md,
  },
  slotOptionList: {
    width: '100%',
    gap: 8,
    marginBottom: spacing.md,
  },
  slotCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.sm,
    backgroundColor: '#F5F5F5',
    borderRadius: radius.md,
    borderWidth: 1.5,
    borderColor: '#E0E0E0',
    gap: 10,
  },
  slotCardActive: {
    backgroundColor: '#E8F5E9',
    borderColor: colors.primary,
  },
  slotText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  slotTextActive: {
    color: colors.textPrimary,
    fontWeight: '700',
  },
  modalBtnRow: {
    flexDirection: 'row',
    gap: 10,
    width: '100%',
    marginTop: spacing.sm,
  },
  cancelBtn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    backgroundColor: '#EEEEEE',
    borderRadius: radius.md,
  },
  confirmBtn: {
    flex: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    backgroundColor: colors.primary,
    borderRadius: radius.md,
  },
  resInput: {
    width: '100%',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: spacing.sm,
    fontSize: 13,
    backgroundColor: '#FAFAFA',
    textAlignVertical: 'top',
    marginBottom: spacing.md,
  },
  formItem: {
    marginBottom: spacing.sm,
  },
  formLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  formInput: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: spacing.sm,
    paddingVertical: 8,
    fontSize: 13,
    backgroundColor: '#FAFAFA',
  },
  catChoice: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: radius.round,
    backgroundColor: '#EEEEEE',
    marginRight: 6,
  },
  catChoiceText: {
    fontSize: 11,
    color: colors.textSecondary,
  },
});