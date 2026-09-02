import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { TransactionStatus } from '../../src/types/enums';
import { WeighingRecord } from '../../src/types/models';
import { useAppContext } from '../../src/store/app-context';
import { recordWeighing } from '../../src/services/transaction.service';
import { Colors, Spacing, FontSizes, BorderRadius } from '../../src/constants/theme';
import { CROP_DATA } from '../../src/constants/crops';

export default function RecordWeighingScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { state, dispatch } = useAppContext();
  
  const transaction = state.transactions.find(t => t.id === id);
  const operatorId = 'operator-1';

  const [grossWeight, setGrossWeight] = useState<string>('0');
  const [tareWeight, setTareWeight] = useState<string>('0');

  if (!transaction) {
    return (
      <View style={styles.center}>
        <Text>Transaction not found.</Text>
      </View>
    );
  }

  const cropInfo = CROP_DATA[transaction.crop];
  const cropName = cropInfo ? cropInfo.displayName : transaction.crop;
  const netWeight = Math.max(0, parseFloat(grossWeight || '0') - parseFloat(tareWeight || '0'));

  const handleAdjust = (setter: React.Dispatch<React.SetStateAction<string>>, amount: number, currentVal: string) => {
    const current = parseFloat(currentVal || '0');
    setter(Math.max(0, current + amount).toString());
  };

  const handleSubmit = () => {
    if (netWeight <= 0) {
      Alert.alert('Invalid Weight', 'Net weight must be greater than zero.');
      return;
    }

    try {
      const weighingRecord: WeighingRecord = {
        grossWeight: parseFloat(grossWeight),
        tareWeight: parseFloat(tareWeight),
        netWeight,
        unit: 'quintal',
        recordedBy: operatorId,
        timestamp: new Date().toISOString(),
      };

      const updatedTransaction = recordWeighing(transaction, weighingRecord, operatorId);
      dispatch({ type: 'UPDATE_TRANSACTION', payload: updatedTransaction });
      Alert.alert('Success', 'Weight recorded successfully.', [
        { text: 'OK', onPress: () => router.back() }
      ]);
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to record weight.');
    }
  };

  const renderInputControl = (label: string, value: string, setter: React.Dispatch<React.SetStateAction<string>>) => (
    <View style={styles.inputGroup}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.controlRow}>
        <TouchableOpacity style={styles.stepperButton} onPress={() => handleAdjust(setter, -10, value)}>
          <Ionicons name="remove" size={24} color={Colors.surface} />
        </TouchableOpacity>
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={setter}
          keyboardType="numeric"
          selectTextOnFocus
        />
        <TouchableOpacity style={styles.stepperButton} onPress={() => handleAdjust(setter, 10, value)}>
          <Ionicons name="add" size={24} color={Colors.surface} />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.headerInfo}>
        <Text style={styles.farmerName}>{transaction.farmerName || transaction.farmerId}</Text>
        <Text style={styles.cropName}>{cropName}</Text>
        <Text style={styles.tokenNumber}>Token: {transaction.tokenNumber}</Text>
      </View>

      {renderInputControl('Gross Weight (qtl)', grossWeight, setGrossWeight)}
      {renderInputControl('Tare Weight (qtl)', tareWeight, setTareWeight)}

      <View style={styles.netWeightContainer}>
        <Text style={styles.netWeightLabel}>Net Weight</Text>
        <Text style={styles.netWeightValue}>{netWeight.toFixed(2)} qtl</Text>
      </View>

      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitButtonText}>Record Weight</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: Spacing.lg, backgroundColor: Colors.background },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  headerInfo: { marginBottom: Spacing.xl, alignItems: 'center' },
  farmerName: { fontSize: FontSizes.title, fontWeight: 'bold', color: Colors.textPrimary },
  cropName: { fontSize: FontSizes.subtitle, color: Colors.textSecondary, marginTop: 4 },
  tokenNumber: { fontSize: FontSizes.body, color: Colors.secondary, marginTop: 4, fontWeight: '600' },
  inputGroup: { marginBottom: Spacing.lg },
  label: { fontSize: FontSizes.body, fontWeight: '600', marginBottom: Spacing.sm, color: Colors.textPrimary },
  controlRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  stepperButton: { width: 50, height: 50, backgroundColor: Colors.primary, borderRadius: BorderRadius.sm, justifyContent: 'center', alignItems: 'center' },
  input: { flex: 1, height: 50, backgroundColor: Colors.surface, marginHorizontal: Spacing.md, borderRadius: BorderRadius.sm, textAlign: 'center', fontSize: FontSizes.title, fontWeight: 'bold', borderWidth: 1, borderColor: '#ccc' },
  netWeightContainer: { marginTop: Spacing.xl, alignItems: 'center', padding: Spacing.lg, backgroundColor: '#E8F5E9', borderRadius: BorderRadius.md },
  netWeightLabel: { fontSize: FontSizes.subtitle, color: Colors.primary },
  netWeightValue: { fontSize: 36, fontWeight: 'bold', color: Colors.primary, marginTop: 8 },
  submitButton: { marginTop: 'auto', backgroundColor: Colors.secondary, padding: Spacing.md, borderRadius: BorderRadius.md, alignItems: 'center' },
  submitButtonText: { color: Colors.surface, fontSize: FontSizes.subtitle, fontWeight: 'bold' }
});
