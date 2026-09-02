import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert } from 'react-native';
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

const CATEGORIES = [
  'Payment Delay',
  'Weighbridge Discrepancy',
  'Quality Grading Issue',
  'Slot Rescheduling',
  'Aadhaar / Bank Update',
  'Other Grievance',
];

export default function CreateIssueScreen() {
  const router = useRouter();
  const [selectedCat, setSelectedCat] = useState('Payment Delay');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = () => {
    Alert.alert('Grievance Registered', 'Your ticket #ISS-2026-0098 has been created. Mandi nodal officer will respond within 24h.', [
      { text: 'OK', onPress: () => router.back() },
    ]);
  };

  return (
    <ScreenContainer scrollable style={styles.container}>
      <SectionHeader
        title="Raise an Issue / Grievance"
        subtitle="Submit a formal complaint or inquiry to Mandi authority"
      />

      <KisanCard style={styles.card}>
        <Text style={styles.label}>Select Category</Text>
        <View style={styles.catChips}>
          {CATEGORIES.map((cat) => (
            <TouchableOpacity
              key={cat}
              style={[styles.chip, selectedCat === cat && styles.chipActive]}
              onPress={() => setSelectedCat(cat)}
            >
              <Text style={[styles.chipText, selectedCat === cat && styles.chipTextActive]}>
                {cat}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.label}>Booking / Transaction ID (Optional)</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. KM-2026-00042"
          placeholderTextColor="#9E9E9E"
        />

        <Text style={styles.label}>Issue Title</Text>
        <TextInput
          style={styles.input}
          placeholder="Brief summary of the issue"
          placeholderTextColor="#9E9E9E"
          value={title}
          onChangeText={setTitle}
        />

        <Text style={styles.label}>Detailed Description</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Provide all relevant details..."
          placeholderTextColor="#9E9E9E"
          multiline
          numberOfLines={4}
          value={description}
          onChangeText={setDescription}
        />
      </KisanCard>

      <View style={styles.btnBox}>
        <KisanButton
          title="Submit Grievance"
          onPress={handleSubmit}
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
  label: {
    fontSize: 13,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginTop: spacing.sm,
    marginBottom: 6,
  },
  catChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: spacing.sm,
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: radius.sm,
    backgroundColor: '#F5F5F5',
    borderWidth: 1,
    borderColor: colors.border,
  },
  chipActive: {
    backgroundColor: '#E8F5E9',
    borderColor: colors.primary,
  },
  chipText: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  chipTextActive: {
    color: colors.primary,
    fontWeight: 'bold',
  },
  input: {
    backgroundColor: '#FAFAFA',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.sm,
    padding: 10,
    fontSize: 14,
    color: colors.textPrimary,
  },
  textArea: {
    height: 90,
    textAlignVertical: 'top',
  },
  btnBox: {
    marginVertical: spacing.md,
    marginBottom: spacing.xl,
  },
});