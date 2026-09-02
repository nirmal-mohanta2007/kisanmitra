import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Alert } from 'react-native';
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

export default function OperatorCheckInScreen() {
  const router = useRouter();
  const [vehicleNo, setVehicleNo] = useState('MP-04-AB-1234');
  const [bagsCount, setBagsCount] = useState('50');

  const handleConfirmCheckIn = () => {
    Alert.alert('Check-In Completed', 'Farmer Token #42 checked in successfully. Routed to Weighbridge #1.', [
      { text: 'Proceed to Weighing', onPress: () => router.push('/(operator)/operations/weighing') },
    ]);
  };

  return (
    <ScreenContainer scrollable style={styles.container}>
      <SectionHeader
        title="Gate Security & Entry Check-in"
        subtitle="Verify farmer identity and vehicle entry at mandi gate"
      />

      {/* Verified Farmer Token Card */}
      <KisanCard style={styles.card}>
        <View style={styles.row}>
          <Text style={styles.label}>Token Number:</Text>
          <Text style={styles.tokenHighlight}>#42</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Farmer Name:</Text>
          <Text style={styles.value}>Ramesh Nayak</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Commodity:</Text>
          <Text style={styles.value}>Wheat (25 Qtl Booked)</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Aadhaar Authentication:</Text>
          <StatusBadge status="VERIFIED" variant="success" />
        </View>
      </KisanCard>

      {/* Vehicle & Bag Input Form */}
      <SectionHeader title="Vehicle & Physical Inspection" />
      <KisanCard style={styles.card}>
        <Text style={styles.inputLabel}>Tractor / Vehicle Registration Number</Text>
        <TextInput
          style={styles.input}
          value={vehicleNo}
          onChangeText={setVehicleNo}
          placeholder="MP-00-XX-0000"
        />

        <Text style={styles.inputLabel}>Estimated Bags Loaded (Jute Bags)</Text>
        <TextInput
          style={styles.input}
          value={bagsCount}
          onChangeText={setBagsCount}
          keyboardType="numeric"
          placeholder="50"
        />

        <View style={styles.gateRoutingBox}>
          <Ionicons name="navigate" size={18} color={colors.secondary} />
          <Text style={styles.gateRoutingText}>
            Allocated Weighbridge: Weighbridge Station #1 (North Gate)
          </Text>
        </View>
      </KisanCard>

      <View style={styles.btnBox}>
        <KisanButton
          title="Confirm Gate Check-in"
          onPress={handleConfirmCheckIn}
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
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  },
  label: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  value: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  tokenHighlight: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.secondary,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginTop: spacing.sm,
    marginBottom: 6,
  },
  input: {
    backgroundColor: '#FAFAFA',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.sm,
    padding: 10,
    fontSize: 15,
    color: colors.textPrimary,
  },
  gateRoutingBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E3F2FD',
    padding: spacing.sm,
    borderRadius: radius.sm,
    marginTop: spacing.md,
  },
  gateRoutingText: {
    fontSize: 12,
    color: colors.secondary,
    fontWeight: 'bold',
    marginLeft: 6,
  },
  btnBox: {
    marginVertical: spacing.lg,
    marginBottom: spacing.xl,
  },
});