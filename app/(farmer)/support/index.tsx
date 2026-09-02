import React from 'react';
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
  StatusBadge,
  KisanButton,
} from '../../../src/components/common';
import { MOCK_ISSUES } from '../../../src/data/mock/issues';

export default function FarmerSupportScreen() {
  const router = useRouter();

  return (
    <ScreenContainer scrollable style={styles.container}>
      {/* Helpline Contact Card */}
      <KisanCard style={styles.helplineCard}>
        <View style={styles.helplineRow}>
          <View style={styles.iconCircle}>
            <Ionicons name="call" size={24} color="#FFFFFF" />
          </View>
          <View style={{ flex: 1, marginLeft: 12 }}>
            <Text style={styles.helplineTitle}>Toll-Free Kisan Procurement Helpline</Text>
            <Text style={styles.helplineNumber}>📞 1800-180-1551</Text>
            <Text style={styles.helplineHours}>Available: 7:00 AM - 9:00 PM (Daily)</Text>
          </View>
        </View>
      </KisanCard>

      {/* Raise New Issue Action */}
      <View style={styles.createBtnBox}>
        <KisanButton
          title="+ Report a Problem / Grievance"
          onPress={() => router.push('/(farmer)/support/create-issue')}
          variant="primary"
        />
      </View>

      {/* Active & Past Issues */}
      <SectionHeader title="Your Grievances & Tickets" subtitle="Track resolution of your raised concerns" />
      {MOCK_ISSUES.map((issue) => (
        <TouchableOpacity
          key={issue.id}
          activeOpacity={0.7}
          onPress={() => router.push(`/(farmer)/support/${issue.id}` as any)}
        >
          <KisanCard style={styles.issueCard}>
            <View style={styles.issueHeader}>
              <Text style={styles.issueId}>{issue.id}</Text>
              <StatusBadge status={issue.status} />
            </View>
            <Text style={styles.issueTitle}>{issue.title}</Text>
            <Text style={styles.issueDesc} numberOfLines={2}>{issue.description}</Text>
            <View style={styles.issueFooter}>
              <Text style={styles.issueCategory}>📂 {issue.category}</Text>
              <Text style={styles.issueDate}>{issue.createdAt}</Text>
            </View>
          </KisanCard>
        </TouchableOpacity>
      ))}

      {/* Frequently Asked Questions */}
      <SectionHeader title="Frequently Asked Questions (FAQ)" />
      <KisanCard style={styles.faqCard}>
        <Text style={styles.faqQ}>Q: What is the maximum moisture percentage accepted?</Text>
        <Text style={styles.faqA}>A: Up to 12% moisture is accepted at 100% full MSP price.</Text>
        <View style={styles.divider} />
        <Text style={styles.faqQ}>Q: How long does DBT bank transfer take?</Text>
        <Text style={styles.faqA}>A: Usually within 24 to 48 working hours from receipt generation.</Text>
      </KisanCard>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: spacing.md,
  },
  helplineCard: {
    backgroundColor: '#E8F5E9',
    borderWidth: 1.5,
    borderColor: colors.primary,
    marginBottom: spacing.md,
  },
  helplineRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  helplineTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: colors.primaryDark,
  },
  helplineNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.primary,
    marginVertical: 2,
  },
  helplineHours: {
    fontSize: 11,
    color: colors.textSecondary,
  },
  createBtnBox: {
    marginBottom: spacing.md,
  },
  issueCard: {
    marginBottom: spacing.sm,
  },
  issueHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  issueId: {
    fontSize: 11,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  issueTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  issueDesc: {
    fontSize: 12,
    color: colors.textSecondary,
    lineHeight: 16,
    marginBottom: 8,
  },
  issueFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#F5F5F5',
    paddingTop: 6,
  },
  issueCategory: {
    fontSize: 11,
    color: colors.textSecondary,
  },
  issueDate: {
    fontSize: 11,
    color: colors.textSecondary,
  },
  faqCard: {
    marginBottom: spacing.xl,
  },
  faqQ: {
    fontSize: 13,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 2,
  },
  faqA: {
    fontSize: 12,
    color: colors.textSecondary,
    lineHeight: 16,
  },
  divider: {
    height: 1,
    backgroundColor: '#EEEEEE',
    marginVertical: 10,
  },
});