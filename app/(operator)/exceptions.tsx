import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
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
import { MOCK_ISSUES } from '../../src/data/mock/issues';

export default function OperatorExceptionsScreen() {
  const router = useRouter();

  const handleResolve = (id: string) => {
    Alert.alert('Resolve Exception', `Exception ${id} marked as reviewed and resolved.`);
  };

  return (
    <ScreenContainer scrollable style={styles.container}>
      <SectionHeader
        title="Mandi Station Exceptions"
        subtitle="Manage weighment discrepancies, moisture rejections, and gate holds"
      />

      {MOCK_ISSUES.map((issue) => (
        <KisanCard key={issue.id} style={styles.exceptionCard}>
          <View style={styles.header}>
            <View>
              <Text style={styles.id}>{issue.id}</Text>
              <Text style={styles.title}>{issue.title}</Text>
            </View>
            <StatusBadge status={issue.status} />
          </View>

          <Text style={styles.desc}>{issue.description}</Text>
          <Text style={styles.meta}>Category: {issue.category} • {issue.createdAt}</Text>

          <View style={styles.actionRow}>
            <TouchableOpacity style={styles.contactBtn}>
              <Ionicons name="call-outline" size={16} color={colors.secondary} />
              <Text style={styles.contactBtnText}>Call Farmer</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.resolveBtn} onPress={() => handleResolve(issue.id)}>
              <Ionicons name="checkmark-done" size={16} color="#FFFFFF" />
              <Text style={styles.resolveBtnText}>Resolve Exception</Text>
            </TouchableOpacity>
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
  exceptionCard: {
    marginBottom: spacing.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.xs,
  },
  id: {
    fontSize: 11,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  desc: {
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 18,
    marginVertical: 6,
  },
  meta: {
    fontSize: 11,
    color: colors.textSecondary,
    marginBottom: spacing.md,
  },
  actionRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  contactBtn: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.secondary,
    backgroundColor: '#E3F2FD',
    gap: 4,
  },
  contactBtnText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: colors.secondary,
  },
  resolveBtn: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,
    borderRadius: radius.sm,
    backgroundColor: colors.primary,
    gap: 4,
  },
  resolveBtnText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
});