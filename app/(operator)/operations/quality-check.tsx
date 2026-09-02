import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Alert, TouchableOpacity } from 'react-native';
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

export default function OperatorQualityCheckScreen() {
  const router = useRouter();
  const [moisture, setMoisture] = useState('11.2');
  const [foreignMatter, setForeignMatter] = useState('0.4');
  const [damagedGrain, setDamagedGrain] = useState('0.8');
  const [selectedGrade, setSelectedGrade] = useState<'GRADE_A' | 'GRADE_B' | 'GRADE_C'>('GRADE_A');
  const [decision, setDecision] = useState<'ACCEPT' | 'HOLD' | 'REJECT'>('ACCEPT');

  const handleConfirmQuality = () => {
    Alert.alert('Quality Inspection Passed', 'Sample cleared Grade A standards with 11.2% moisture.', [
      { text: 'Proceed to Settlement', onPress: () => router.push('/(operator)/operations/procurement') },
    ]);
  };

  return (
    <ScreenContainer scrollable style={styles.container}>
      <SectionHeader
        title="Quality & Moisture Lab Inspection"
        subtitle="Physical sample analysis for Token #42 (Wheat)"
      />

      {/* Lab Parameter Input Cards */}
      <KisanCard style={styles.card}>
        <View style={styles.paramRow}>
          <View style={{ flex: 1 }}>
            <Text style={styles.paramTitle}>Moisture Percentage (%)</Text>
            <Text style={styles.paramLimit}>Permissible limit: Up to 12.0%</Text>
          </View>
          <View style={styles.paramInputBox}>
            <TextInput
              style={styles.paramInput}
              value={moisture}
              onChangeText={setMoisture}
              keyboardType="numeric"
            />
            <Text style={styles.unitText}>%</Text>
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.paramRow}>
          <View style={{ flex: 1 }}>
            <Text style={styles.paramTitle}>Foreign Matter / Husk (%)</Text>
            <Text style={styles.paramLimit}>Permissible limit: Up to 0.75%</Text>
          </View>
          <View style={styles.paramInputBox}>
            <TextInput
              style={styles.paramInput}
              value={foreignMatter}
              onChangeText={setForeignMatter}
              keyboardType="numeric"
            />
            <Text style={styles.unitText}>%</Text>
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.paramRow}>
          <View style={{ flex: 1 }}>
            <Text style={styles.paramTitle}>Damaged / Shriveled Grains (%)</Text>
            <Text style={styles.paramLimit}>Permissible limit: Up to 2.0%</Text>
          </View>
          <View style={styles.paramInputBox}>
            <TextInput
              style={styles.paramInput}
              value={damagedGrain}
              onChangeText={setDamagedGrain}
              keyboardType="numeric"
            />
            <Text style={styles.unitText}>%</Text>
          </View>
        </View>
      </KisanCard>

      {/* Assigned Grade Selection */}
      <SectionHeader title="Grade Assessment" subtitle="Quality grade determines procurement MSP eligibility" />
      <View style={styles.gradeRow}>
        {(['GRADE_A', 'GRADE_B', 'GRADE_C'] as const).map((grade) => {
          const isSelected = selectedGrade === grade;
          return (
            <TouchableOpacity
              key={grade}
              style={[styles.gradeCard, isSelected && styles.gradeCardSelected]}
              onPress={() => setSelectedGrade(grade)}
            >
              <Text style={[styles.gradeText, isSelected && styles.gradeTextSelected]}>
                {grade.replace('_', ' ')}
              </Text>
              <Text style={styles.gradeSub}>
                {grade === 'GRADE_A' ? '100% MSP' : grade === 'GRADE_B' ? '95% MSP' : '90% MSP'}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Decision Buttons (Pass / Hold / Reject) */}
      <SectionHeader title="Officer Decision" />
      <View style={styles.decisionRow}>
        <TouchableOpacity
          style={[styles.decisionBtn, decision === 'ACCEPT' && styles.acceptActive]}
          onPress={() => setDecision('ACCEPT')}
        >
          <Ionicons name="checkmark-circle" size={18} color={decision === 'ACCEPT' ? '#FFFFFF' : colors.primary} />
          <Text style={[styles.decisionText, decision === 'ACCEPT' && styles.textWhite]}>Accept Crop</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.decisionBtn, decision === 'HOLD' && styles.holdActive]}
          onPress={() => setDecision('HOLD')}
        >
          <Ionicons name="pause-circle" size={18} color={decision === 'HOLD' ? '#FFFFFF' : colors.accent} />
          <Text style={[styles.decisionText, decision === 'HOLD' && styles.textWhite]}>Hold / Re-dry</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.decisionBtn, decision === 'REJECT' && styles.rejectActive]}
          onPress={() => setDecision('REJECT')}
        >
          <Ionicons name="close-circle" size={18} color={decision === 'REJECT' ? '#FFFFFF' : colors.error} />
          <Text style={[styles.decisionText, decision === 'REJECT' && styles.textWhite]}>Reject Lot</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.btnBox}>
        <KisanButton
          title="Save Quality Result & Settle →"
          onPress={handleConfirmQuality}
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
  card: {
    marginBottom: spacing.md,
  },
  paramRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
  },
  paramTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  paramLimit: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 2,
  },
  paramInputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.sm,
    paddingHorizontal: 8,
    backgroundColor: '#FAFAFA',
    width: 90,
  },
  paramInput: {
    flex: 1,
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.textPrimary,
    paddingVertical: 6,
    textAlign: 'center',
  },
  unitText: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  divider: {
    height: 1,
    backgroundColor: '#EEEEEE',
    marginVertical: 8,
  },
  gradeRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  gradeCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: spacing.md,
    borderRadius: radius.md,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: colors.border,
  },
  gradeCardSelected: {
    borderColor: colors.primary,
    backgroundColor: '#E8F5E9',
  },
  gradeText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  gradeTextSelected: {
    color: colors.primary,
  },
  gradeSub: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 2,
  },
  decisionRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  decisionBtn: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: '#FFFFFF',
    gap: 4,
  },
  acceptActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  holdActive: {
    backgroundColor: colors.accent,
    borderColor: colors.accent,
  },
  rejectActive: {
    backgroundColor: colors.error,
    borderColor: colors.error,
  },
  decisionText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  textWhite: {
    color: '#FFFFFF',
  },
  btnBox: {
    marginBottom: spacing.xl,
  },
});