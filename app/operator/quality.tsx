import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';

import { QualityGrade, TransactionStatus } from '../../src/types/enums';
import type { QualityCheckResult } from '../../src/types/models';
import { useAppContext } from '../../src/store/app-context';
import { recordQualityCheck } from '../../src/services/transaction.service';
import { Colors, Spacing, FontSizes, BorderRadius } from '../../src/constants/theme';
import { CROP_DATA } from '../../src/constants/crops';

export default function QualityCheckScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { state, dispatch } = useAppContext();
  
  const transaction = state.transactions.find(t => t.id === id);
  const operatorId = 'operator-1';

  const [grade, setGrade] = useState<QualityGrade | null>(null);
  const [moisture, setMoisture] = useState<string>('0');
  const [foreignMatter, setForeignMatter] = useState<string>('0');
  const [observations, setObservations] = useState<string>('');

  if (!transaction) {
    return <View style={styles.center}><Text>Transaction not found.</Text></View>;
  }

  const cropInfo = CROP_DATA[transaction.crop];
  const cropName = cropInfo ? cropInfo.displayName : transaction.crop;
  const netWeight = transaction.weighing?.netWeight || 0;

  const handleSubmit = () => {
    if (!grade) {
      Alert.alert('Validation Error', 'Please select a quality grade.');
      return;
    }

    if (grade === QualityGrade.REJECTED) {
      Alert.alert(
        'Warning',
        'Rejecting this crop will place the transaction on QUALITY_HOLD. Do you want to proceed?',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Proceed', style: 'destructive', onPress: performSubmit }
        ]
      );
    } else {
      performSubmit();
    }
  };

  const performSubmit = () => {
    try {
      const qualityCheckResult: QualityCheckResult = {
        grade: grade as QualityGrade,
        moisturePercent: parseFloat(moisture || '0'),
        foreignMatterPercent: parseFloat(foreignMatter || '0'),
        observations,
        checkedBy: operatorId,
      };

      const updatedTransaction = recordQualityCheck(transaction, qualityCheckResult, operatorId);
      dispatch({ type: 'UPDATE_TRANSACTION', payload: updatedTransaction });
      Alert.alert('Success', 'Quality check recorded successfully.', [
        { text: 'OK', onPress: () => router.back() }
      ]);
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to record quality check.');
    }
  };

  const grades = [
    { value: QualityGrade.GRADE_A, label: 'Grade A', color: Colors.primary },
    { value: QualityGrade.GRADE_B, label: 'Grade B', color: Colors.secondary },
    { value: QualityGrade.GRADE_C, label: 'Grade C', color: Colors.warning },
    { value: QualityGrade.REJECTED, label: 'Reject', color: Colors.error },
  ];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.headerInfo}>
        <Text style={styles.farmerName}>{transaction.farmerName || transaction.farmerId}</Text>
        <Text style={styles.cropName}>{cropName} • {netWeight} qtl</Text>
        <Text style={styles.tokenNumber}>Token: {transaction.tokenNumber}</Text>
      </View>

      <Text style={styles.sectionTitle}>Select Grade</Text>
      <View style={styles.gradeGrid}>
        {grades.map((g) => (
          <TouchableOpacity
            key={g.value}
            style={[
              styles.gradeCard,
              { borderColor: g.color, backgroundColor: grade === g.value ? g.color : Colors.surface }
            ]}
            onPress={() => setGrade(g.value)}
          >
            <Text style={[styles.gradeText, { color: grade === g.value ? Colors.surface : g.color }]}>
              {g.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.sectionTitle}>Parameters</Text>
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Moisture Content (%)</Text>
        <TextInput
          style={styles.input}
          value={moisture}
          onChangeText={setMoisture}
          keyboardType="numeric"
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Foreign Matter (%)</Text>
        <TextInput
          style={styles.input}
          value={foreignMatter}
          onChangeText={setForeignMatter}
          keyboardType="numeric"
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Observations</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={observations}
          onChangeText={setObservations}
          multiline
          numberOfLines={3}
          placeholder="Any specific notes or issues..."
        />
      </View>

      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitButtonText}>Submit Quality Check</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content: { padding: Spacing.lg },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  headerInfo: { marginBottom: Spacing.xl, alignItems: 'center' },
  farmerName: { fontSize: FontSizes.title, fontWeight: 'bold', color: Colors.textPrimary },
  cropName: { fontSize: FontSizes.subtitle, color: Colors.textSecondary, marginTop: 4 },
  tokenNumber: { fontSize: FontSizes.body, color: Colors.secondary, marginTop: 4, fontWeight: '600' },
  sectionTitle: { fontSize: FontSizes.subtitle, fontWeight: 'bold', marginBottom: Spacing.md, color: Colors.textPrimary },
  gradeGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginBottom: Spacing.lg },
  gradeCard: { width: '48%', padding: Spacing.md, borderWidth: 2, borderRadius: BorderRadius.md, alignItems: 'center', marginBottom: Spacing.md },
  gradeText: { fontSize: FontSizes.body, fontWeight: 'bold' },
  inputGroup: { marginBottom: Spacing.md },
  label: { fontSize: FontSizes.body, fontWeight: '600', marginBottom: Spacing.sm, color: Colors.textSecondary },
  input: { backgroundColor: Colors.surface, padding: Spacing.md, borderRadius: BorderRadius.sm, borderWidth: 1, borderColor: '#ccc', fontSize: FontSizes.body },
  textArea: { height: 100, textAlignVertical: 'top' },
  submitButton: { marginTop: Spacing.xl, backgroundColor: Colors.secondary, padding: Spacing.md, borderRadius: BorderRadius.md, alignItems: 'center' },
  submitButtonText: { color: Colors.surface, fontSize: FontSizes.subtitle, fontWeight: 'bold' }
});
