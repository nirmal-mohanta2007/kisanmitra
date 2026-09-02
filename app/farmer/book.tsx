import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, FontSizes, BorderRadius, Shadows, TouchTargets } from '../../src/constants/theme';
import { useAppContext, useCentres } from '../../src/store/app-context';
import { CROP_DATA } from '../../src/constants/crops';
import { generateTransactionId, getNextTokenNumber, generateBookingSlots } from '../../src/services/mock-data.service';
import { TransactionStatus, CropType } from '../../src/types/enums';
import type { ProcurementTransaction } from '../../src/types/models';

export default function FarmerBook() {
  const router = useRouter();
  const { state, dispatch } = useAppContext();
  const centres = useCentres();

  const [selectedCentreId, setSelectedCentreId] = useState<string | null>(null);
  const [selectedCrop, setSelectedCrop] = useState<CropType | null>(null);
  const [quantityStr, setQuantityStr] = useState<string>('');
  const [selectedSlot, setSelectedSlot] = useState<any | null>(null);

  const selectedCentre = useMemo(() => centres.find(c => c.id === selectedCentreId), [centres, selectedCentreId]);
  
  const availableCrops = useMemo(() => {
    if (!selectedCentre) return [];
    return selectedCentre.supportedCrops.map(c => CROP_DATA[c]).filter(Boolean);
  }, [selectedCentre]);

  const slots = useMemo(() => {
    if (!selectedCentreId) return [];
    return generateBookingSlots(selectedCentreId);
  }, [selectedCentreId]);

  const quantity = parseInt(quantityStr, 10);
  const isQuantityValid = !isNaN(quantity) && quantity >= 1 && quantity <= 100;

  const isFormValid = selectedCentreId && selectedCrop && isQuantityValid && selectedSlot;

  const handleSubmit = () => {
    if (!isFormValid || !selectedCentre) return;

    const newId = generateTransactionId();
    const token = getNextTokenNumber(selectedCentreId, state.transactions);
    
    const newTx: ProcurementTransaction = {
      id: newId,
      farmerId: 'farmer-1',
      farmerName: 'Ramesh Nayak',
      farmerPhone: '9876543210',
      centreId: selectedCentreId,
      centreName: selectedCentre.name,
      crop: selectedCrop,
      expectedQuantity: quantity,
      tokenNumber: token,
      bookingDate: selectedSlot.date,
      slotLabel: selectedSlot.slotLabel,
      bookedDate: selectedSlot.date,
      bookedSlot: selectedSlot.slotLabel,
      status: TransactionStatus.BOOKED,
      statusHistory: [{
        status: TransactionStatus.BOOKED,
        timestamp: new Date().toISOString(),
        updatedBy: 'farmer-1',
        notes: 'Booked by farmer'
      }],
      queuePosition: null,
      estimatedWaitMinutes: null,
      recommendedArrivalTime: null,
      weighing: null,
      qualityCheck: null,
      procurementAmount: null,
      payment: null,
      exceptions: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    dispatch({ type: 'ADD_TRANSACTION', payload: newTx });
    router.replace(`/farmer/confirmation?id=${newId}`);
  };

  return (
    <ScrollView style={styles.container}>
      <Stack.Screen options={{ title: 'Book Visit · विज़िट बुक करें' }} />

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>1. Select Centre / केंद्र चुनें</Text>
        {centres.map(centre => (
          <TouchableOpacity 
            key={centre.id}
            style={[styles.card, selectedCentreId === centre.id && styles.cardSelected]}
            onPress={() => {
              setSelectedCentreId(centre.id);
              setSelectedCrop(null);
              setSelectedSlot(null);
            }}
          >
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>{centre.name}</Text>
              {centre.currentDelay > 0 && (
                <View style={styles.delayBadge}>
                  <Text style={styles.delayText}>Delay: {centre.currentDelay}m</Text>
                </View>
              )}
            </View>
            <Text style={styles.cardSubtitle}>{centre.address}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {selectedCentreId && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>2. Select Crop / फसल चुनें</Text>
          <View style={styles.grid}>
            {availableCrops.map(crop => (
              <TouchableOpacity 
                key={crop.type}
                style={[styles.gridCard, selectedCrop === crop.type && styles.cardSelected]}
                onPress={() => setSelectedCrop(crop.type)}
              >
                <Text style={styles.emojiText}>{crop.emoji || '🌾'}</Text>
                <Text style={styles.cropNameText}>{crop.displayNameHi}</Text>
                <Text style={styles.cropNameSubText}>{crop.displayName}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}

      {selectedCrop && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>3. Enter Quantity / मात्रा दर्ज करें</Text>
          <View style={styles.quantityRow}>
            <TouchableOpacity 
              style={styles.qtyBtn}
              onPress={() => setQuantityStr(Math.max(1, (parseInt(quantityStr)||1)-1).toString())}
            >
              <Ionicons name="remove" size={24} color={Colors.textPrimary} />
            </TouchableOpacity>
            <View style={styles.qtyInputWrapper}>
              <TextInput 
                style={styles.qtyInput}
                keyboardType="numeric"
                value={quantityStr}
                onChangeText={setQuantityStr}
                placeholder="0"
              />
              <Text style={styles.qtyUnit}>quintals / क्विंटल</Text>
            </View>
            <TouchableOpacity 
              style={styles.qtyBtn}
              onPress={() => setQuantityStr(Math.min(100, (parseInt(quantityStr)||0)+1).toString())}
            >
              <Ionicons name="add" size={24} color={Colors.textPrimary} />
            </TouchableOpacity>
          </View>
        </View>
      )}

      {isQuantityValid && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>4. Select Slot / समय चुनें</Text>
          {slots.map((slot, idx) => (
            <TouchableOpacity 
              key={idx}
              style={[styles.card, selectedSlot === slot && styles.cardSelected]}
              onPress={() => setSelectedSlot(slot)}
            >
              <Text style={styles.cardTitle}>{new Date(slot.date).toLocaleDateString()} - {slot.slotLabel}</Text>
              <Text style={styles.cardSubtitle}>Available: {slot.maxCapacity - slot.currentBookings}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      <TouchableOpacity 
        style={[styles.submitBtn, !isFormValid && styles.submitBtnDisabled]}
        onPress={handleSubmit}
        disabled={!isFormValid}
      >
        <Text style={styles.submitBtnText}>Book Visit / विज़िट बुक करें</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    padding: Spacing.base,
  },
  section: {
    marginBottom: Spacing.xl,
  },
  sectionTitle: {
    fontSize: FontSizes.subtitle,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: Spacing.md,
  },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.base,
    marginBottom: Spacing.md,
    borderWidth: 2,
    borderColor: Colors.border,
    ...Shadows.small,
  },
  cardSelected: {
    borderColor: Colors.primary,
    backgroundColor: Colors.surfaceVariant,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  cardTitle: {
    fontSize: FontSizes.body,
    fontWeight: '600',
    color: Colors.textPrimary,
    flex: 1,
  },
  cardSubtitle: {
    fontSize: FontSizes.small,
    color: Colors.textSecondary,
  },
  delayBadge: {
    backgroundColor: '#FFF3E0',
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: BorderRadius.sm,
  },
  delayText: {
    fontSize: FontSizes.caption,
    color: Colors.warning,
    fontWeight: '600',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.md,
  },
  gridCard: {
    width: '47%',
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.base,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.border,
    ...Shadows.small,
  },
  emojiText: {
    fontSize: 32,
    marginBottom: Spacing.xs,
  },
  cropNameText: {
    fontSize: FontSizes.body,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  cropNameSubText: {
    fontSize: FontSizes.caption,
    color: Colors.textSecondary,
  },
  quantityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  qtyBtn: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  qtyInputWrapper: {
    flex: 1,
    alignItems: 'center',
  },
  qtyInput: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.primary,
    textAlign: 'center',
    minWidth: 80,
  },
  qtyUnit: {
    fontSize: FontSizes.caption,
    color: Colors.textSecondary,
  },
  submitBtn: {
    backgroundColor: Colors.primary,
    minHeight: TouchTargets.minimum,
    borderRadius: BorderRadius.lg,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.xxl,
    ...Shadows.medium,
  },
  submitBtnDisabled: {
    backgroundColor: Colors.disabled,
  },
  submitBtnText: {
    fontSize: FontSizes.subtitle,
    fontWeight: '700',
    color: Colors.textLight,
  },
});
