import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../../src/theme/colors';
import { spacing } from '../../../src/theme/spacing';
import { radius } from '../../../src/theme/radius';
import {
  ScreenContainer,
  KisanCard,
  SectionHeader,
  StatusBadge,
} from '../../../src/components/common';
import { MOCK_ISSUES } from '../../../src/data/mock/issues';

export default function IssueDetailScreen() {
  const router = useRouter();
  const { issueId } = useLocalSearchParams();
  const issue = MOCK_ISSUES.find((i) => i.id === issueId) || MOCK_ISSUES[0];

  return (
    <ScreenContainer scrollable style={styles.container}>
      <KisanCard style={styles.card}>
        <View style={styles.header}>
          <Text style={styles.issueId}>Ticket #{issue.id}</Text>
          <StatusBadge status={issue.status} />
        </View>

        <Text style={styles.title}>{issue.title}</Text>
        <Text style={styles.category}>Category: {issue.category}</Text>
        <Text style={styles.date}>Created on: {issue.createdAt}</Text>

        <View style={styles.divider} />

        <Text style={styles.sectionHeading}>Farmer Grievance Details</Text>
        <Text style={styles.description}>{issue.description}</Text>
      </KisanCard>

      <SectionHeader title="Official Response & Updates" />
      <KisanCard style={styles.responseCard}>
        <View style={styles.officerRow}>
          <Ionicons name="shield-checkmark" size={20} color={colors.primary} />
          <Text style={styles.officerName}>Mandi Nodal Officer (Bhopal)</Text>
        </View>
        <Text style={styles.responseText}>
          Your grievance has been assigned to the electronic weighbridge verification team. Transaction records have been forwarded to the bank for DBT clearance.
        </Text>
        <Text style={styles.responseDate}>Updated: 02 Sep 2026, 04:15 PM</Text>
      </KisanCard>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: spacing.md,
  },
  card: {
    marginBottom: spacing.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  issueId: {
    fontSize: 13,
    fontWeight: 'bold',
    color: colors.textSecondary,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  category: {
    fontSize: 13,
    color: colors.primary,
    fontWeight: '600',
    marginBottom: 2,
  },
  date: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  divider: {
    height: 1,
    backgroundColor: '#EEEEEE',
    marginVertical: spacing.md,
  },
  sectionHeading: {
    fontSize: 13,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  description: {
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 18,
  },
  responseCard: {
    backgroundColor: '#F1F8E9',
    marginBottom: spacing.xl,
  },
  officerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  officerName: {
    fontSize: 13,
    fontWeight: 'bold',
    color: colors.primaryDark,
    marginLeft: 6,
  },
  responseText: {
    fontSize: 13,
    color: colors.textPrimary,
    lineHeight: 18,
  },
  responseDate: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 6,
  },
});