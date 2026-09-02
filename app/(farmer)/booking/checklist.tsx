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
} from '../../../src/components/common';

const CHECKLIST_ITEMS = [
  { id: 'aadhaar', title: 'Aadhaar Card Original / DigiLocker', desc: 'Required at the gate check-in point' },
  { id: 'bank', title: 'Bank Account Passbook / Cancelled Cheque', desc: 'Must match DBT registration name' },
  { id: 'land', title: 'Land Ownership Document / Khasra-Khatauni', desc: 'Proof of cultivated area' },
  { id: 'bags', title: 'Standard 50kg Clean Jute Bags', desc: 'Required for official weighbridge handling' },
  { id: 'moisture', title: 'Moisture Content Under 12%', desc: 'Ensure grains are sun-dried to avoid price deduction' },
];

export default function BookingChecklistScreen() {
  const router = useRouter();
  const [checkedItems, setCheckedItems] = useState<{ [key: string]: boolean }>({
    aadhaar: true,
    bank: true,
    land: false,
    bags: true,
    moisture: true,
  });

  const toggleCheck = (id: string) => {
    setCheckedItems((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const allChecked = CHECKLIST_ITEMS.every((item) => checkedItems[item.id]);

  return (
    <ScreenContainer scrollable style={styles.container}>
      <SectionHeader
        title="Mandi Visit Readiness Checklist"
        subtitle="Complete these items before heading to the procurement centre"
      />

      <KisanCard style={styles.summaryCard}>
        <View style={styles.summaryRow}>
          <Ionicons
            name={allChecked ? 'checkmark-circle' : 'time'}
            size={24}
            color={allChecked ? colors.primary : colors.accent}
          />
          <View style={{ marginLeft: 10, flex: 1 }}>
            <Text style={styles.summaryTitle}>
              {allChecked ? 'You are 100% Ready!' : '4 of 5 Items Ready'}
            </Text>
            <Text style={styles.summarySub}>
              Having all documents prevents delays at the verification gate.
            </Text>
          </View>
        </View>
      </KisanCard>

      <View style={styles.itemsList}>
        {CHECKLIST_ITEMS.map((item) => {
          const isDone = Boolean(checkedItems[item.id]);
          return (
            <TouchableOpacity
              key={item.id}
              style={[styles.itemCard, isDone && styles.itemCardDone]}
              onPress={() => toggleCheck(item.id)}
              activeOpacity={0.7}
            >
              <Ionicons
                name={isDone ? 'checkbox' : 'square-outline'}
                size={24}
                color={isDone ? colors.primary : colors.textSecondary}
              />
              <View style={styles.itemContent}>
                <Text style={[styles.itemTitle, isDone && styles.itemTitleDone]}>
                  {item.title}
                </Text>
                <Text style={styles.itemDesc}>{item.desc}</Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>

      <View style={styles.tipsCard}>
        <Text style={styles.tipsHeading}>💡 Pro Tip from Mandi Officer</Text>
        <Text style={styles.tipsText}>
          Arrive exactly 15 minutes before your estimated slot time to pass through the vehicle check-in gate without getting stuck in traffic.
        </Text>
      </View>

      <View style={styles.btnBox}>
        <KisanButton
          title="Back to Token & Queue"
          onPress={() => router.back()}
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
  summaryCard: {
    backgroundColor: '#E8F5E9',
    marginBottom: spacing.md,
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.primaryDark,
  },
  summarySub: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  itemsList: {
    marginBottom: spacing.md,
  },
  itemCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#FFFFFF',
    padding: spacing.md,
    borderRadius: radius.md,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  itemCardDone: {
    borderColor: colors.primary,
    backgroundColor: '#FAFAFA',
  },
  itemContent: {
    flex: 1,
    marginLeft: spacing.sm,
  },
  itemTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  itemTitleDone: {
    color: colors.primaryDark,
  },
  itemDesc: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  tipsCard: {
    backgroundColor: '#FFF9C4',
    padding: spacing.md,
    borderRadius: radius.md,
    marginBottom: spacing.lg,
  },
  tipsHeading: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#F57F17',
    marginBottom: 4,
  },
  tipsText: {
    fontSize: 12,
    color: '#5D4037',
    lineHeight: 16,
  },
  btnBox: {
    marginBottom: spacing.xl,
  },
});