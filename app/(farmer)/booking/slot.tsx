import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../../src/theme/colors';
import { spacing } from '../../../src/theme/spacing';
import { radius } from '../../../src/theme/radius';
import {
  ScreenContainer,
  KisanCard,
  SectionHeader,
  KisanButton,
  StatusBadge,
} from '../../../src/components/common';

const DATES = [
  { id: '2026-09-03', dayName: 'Tomorrow', dateStr: '03 Sep', dayOfWeek: 'Thu', available: true },
  { id: '2026-09-04', dayName: 'Friday', dateStr: '04 Sep', dayOfWeek: 'Fri', available: true },
  { id: '2026-09-05', dayName: 'Saturday', dateStr: '05 Sep', dayOfWeek: 'Sat', available: true },
  { id: '2026-09-06', dayName: 'Sunday', dateStr: '06 Sep', dayOfWeek: 'Sun', available: false },
  { id: '2026-09-07', dayName: 'Monday', dateStr: '07 Sep', dayOfWeek: 'Mon', available: true },
];

const SLOTS = [
  { id: 'SLOT_1', label: 'Morning Slot (08:00 AM - 11:00 AM)', tokensLeft: 12, rush: 'Low Rush' },
  { id: 'SLOT_2', label: 'Midday Slot (11:00 AM - 02:00 PM)', tokensLeft: 4, rush: 'Medium Rush' },
  { id: 'SLOT_3', label: 'Afternoon Slot (02:00 PM - 05:00 PM)', tokensLeft: 18, rush: 'Low Rush' },
];

export default function BookingSlotScreen() {
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState('2026-09-03');
  const [selectedSlot, setSelectedSlot] = useState('SLOT_1');

  return (
    <ScreenContainer scrollable style={styles.container}>
      {/* Progress Bar */}
      <View style={styles.progressRow}>
        <View style={[styles.stepDot, styles.completedStep]}><Ionicons name="checkmark" size={14} color="#FFFFFF" /></View>
        <View style={[styles.stepLine, styles.activeLine]} />
        <View style={[styles.stepDot, styles.completedStep]}><Ionicons name="checkmark" size={14} color="#FFFFFF" /></View>
        <View style={[styles.stepLine, styles.activeLine]} />
        <View style={[styles.stepDot, styles.activeStep]}><Text style={styles.stepNum}>3</Text></View>
      </View>
      <Text style={styles.stepTitle}>Step 3 of 3: Choose Date & Arrival Slot</Text>

      {/* Date Selector */}
      <SectionHeader title="1. Select Date" subtitle="Choose your preferred mandi arrival day" />
      <View style={styles.datesRow}>
        {DATES.map((d) => {
          const isSelected = selectedDate === d.id;
          return (
            <TouchableOpacity
              key={d.id}
              disabled={!d.available}
              style={[
                styles.dateCard,
                isSelected && styles.dateCardSelected,
                !d.available && styles.dateCardDisabled,
              ]}
              onPress={() => setSelectedDate(d.id)}
            >
              <Text style={[styles.dayOfWeek, isSelected && styles.textSelected]}>{d.dayOfWeek}</Text>
              <Text style={[styles.dateNumber, isSelected && styles.textSelected]}>{d.dateStr}</Text>
              <Text style={[styles.dayName, isSelected && styles.textSelected]}>
                {d.available ? d.dayName : 'Holiday'}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Slot Selector */}
      <SectionHeader title="2. Select Arrival Time Window" subtitle="Helps reduce waiting queue at the centre" />
      <View style={styles.slotsList}>
        {SLOTS.map((slot) => {
          const isSelected = selectedSlot === slot.id;
          return (
            <TouchableOpacity
              key={slot.id}
              style={[styles.slotCard, isSelected && styles.slotCardSelected]}
              onPress={() => setSelectedSlot(slot.id)}
            >
              <View style={styles.slotLeft}>
                <Ionicons
                  name={isSelected ? 'radio-button-on' : 'radio-button-off'}
                  size={20}
                  color={isSelected ? colors.primary : colors.textSecondary}
                />
                <View style={{ marginLeft: 10 }}>
                  <Text style={[styles.slotLabel, isSelected && styles.slotLabelActive]}>{slot.label}</Text>
                  <Text style={styles.slotMeta}>
                    🟢 {slot.tokensLeft} slots available • {slot.rush}
                  </Text>
                </View>
              </View>
              {isSelected && <StatusBadge status="SELECTED" variant="success" />}
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Recommended Time Tip */}
      <KisanCard style={styles.tipCard}>
        <View style={styles.tipRow}>
          <Ionicons name="information-circle" size={22} color={colors.info} />
          <View style={{ marginLeft: 8, flex: 1 }}>
            <Text style={styles.tipTitle}>Smart Queue Scheduling</Text>
            <Text style={styles.tipText}>
              By booking a specific slot, your token will be prioritized upon arrival to keep your waiting time under 30 minutes.
            </Text>
          </View>
        </View>
      </KisanCard>

      <View style={styles.confirmBtnBox}>
        <KisanButton
          title="Review & Confirm Booking →"
          onPress={() => router.push('/(farmer)/booking/confirmation')}
          variant="primary"
        />
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: spacing.md,
  },
  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: spacing.sm,
  },
  stepDot: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#E0E0E0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeStep: {
    backgroundColor: colors.primary,
  },
  completedStep: {
    backgroundColor: colors.primary,
  },
  stepNum: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 12,
  },
  stepLine: {
    width: 40,
    height: 2,
    backgroundColor: '#E0E0E0',
    marginHorizontal: 4,
  },
  activeLine: {
    backgroundColor: colors.primary,
  },
  stepTitle: {
    textAlign: 'center',
    fontSize: 13,
    color: colors.primary,
    fontWeight: 'bold',
    marginBottom: spacing.sm,
  },
  datesRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  dateCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: radius.md,
    paddingVertical: 10,
    alignItems: 'center',
    marginHorizontal: 2,
    borderWidth: 1.5,
    borderColor: colors.border,
  },
  dateCardSelected: {
    borderColor: colors.primary,
    backgroundColor: '#E8F5E9',
  },
  dateCardDisabled: {
    backgroundColor: '#EEEEEE',
    opacity: 0.5,
  },
  dayOfWeek: {
    fontSize: 11,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  dateNumber: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginVertical: 2,
  },
  dayName: {
    fontSize: 10,
    color: colors.textSecondary,
  },
  textSelected: {
    color: colors.primary,
    fontWeight: 'bold',
  },
  slotsList: {
    marginBottom: spacing.md,
  },
  slotCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: spacing.md,
    borderRadius: radius.md,
    marginBottom: spacing.sm,
    borderWidth: 1.5,
    borderColor: colors.border,
  },
  slotCardSelected: {
    borderColor: colors.primary,
    backgroundColor: '#F9FBE7',
  },
  slotLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  slotLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  slotLabelActive: {
    color: colors.primary,
  },
  slotMeta: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  tipCard: {
    backgroundColor: '#E3F2FD',
    marginBottom: spacing.lg,
  },
  tipRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  tipTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: colors.info,
  },
  tipText: {
    fontSize: 12,
    color: colors.textPrimary,
    marginTop: 2,
    lineHeight: 16,
  },
  confirmBtnBox: {
    marginBottom: spacing.xl,
  },
});