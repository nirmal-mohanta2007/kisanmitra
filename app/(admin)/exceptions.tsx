import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../../src/theme/colors';
import { spacing } from '../../src/theme/spacing';
import { radius } from '../../src/theme/radius';
import {
  ScreenContainer,
  KisanCard,
  SectionHeader,
  StatusBadge,
} from '../../src/components/common';
import { MOCK_ISSUES } from '../../src/data/mock/issues';

export default function AdminExceptionsScreen() {
  return (
    <ScreenContainer scrollable style={styles.container}>
      <SectionHeader
        title="Statewide Procurement Exceptions"
        subtitle="Operational escalations, weighment variances, and moisture disputes"
      />

      {MOCK_ISSUES.map((issue) => (
        <KisanCard key={issue.id} style={styles.issueCard}>
          <View style={styles.header}>
            <View>
              <Text style={styles.id}>{issue.id}</Text>
              <Text style={styles.title}>{issue.title}</Text>
            </View>
            <StatusBadge status={issue.status} />
          </View>

          <Text style={styles.desc}>{issue.description}</Text>
          <View style={styles.footer}>
            <Text style={styles.category}>Category: {issue.category}</Text>
            <Text style={styles.date}>{issue.createdAt}</Text>
          </View>
        </KisanCard>
      ))}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: spacing.md,
  },
  issueCard: {
    marginBottom: spacing.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  id: {
    fontSize: 11,
    color: colors.textSecondary,
    fontWeight: 'bold',
  },
  title: {
    fontSize: 15,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  desc: {
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 18,
    marginVertical: 4,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#F5F5F5',
    paddingTop: 6,
    marginTop: 4,
  },
  category: {
    fontSize: 11,
    color: colors.primary,
    fontWeight: '600',
  },
  date: {
    fontSize: 11,
    color: colors.textSecondary,
  },
});