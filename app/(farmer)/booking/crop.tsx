import React, { useState } from 'react';
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
  KisanButton,
} from '../../../src/components/common';

const CROPS = [
  { id: 'WHEAT', name: 'Wheat (गेहूं)', emoji: '🌾', msp: '₹2,275 / Qtl', season: 'Rabi 2026' },
  { id: 'PADDY', name: 'Paddy / Rice (धान)', emoji: '🍚', msp: '₹2,183 / Qtl', season: 'Kharif 2026' },
  { id: 'SOYBEAN', name: 'Soybean (सोयाबीन)', emoji: '🌱', msp: '₹4,600 / Qtl', season: 'Kharif 2026' },
  { id: 'MUSTARD', name: 'Mustard (सरसों)', emoji: '🌼', msp: '₹5,650 / Qtl', season: 'Rabi 2026' },
  { id: 'MAIZE', name: 'Maize (मक्का)', emoji: '🌽', msp: '₹2,090 / Qtl', season: 'Kharif 2026' },
  { id: 'JOWAR', name: 'Jowar (ज्वार)', emoji: '🌾', msp: '₹3,180 / Qtl', season: 'Kharif 2026' },
];

export default function BookingCropScreen() {
  const router = useRouter();
  const [selectedCrop, setSelectedCrop] = useState('WHEAT');

  return (
    <ScreenContainer scrollable style={styles.container}>
      {/* Progress Bar */}
      <View style={styles.progressRow}>
        <View style={[styles.stepDot, styles.activeStep]}><Text style={styles.stepNum}>1</Text></View>
        <View style={styles.stepLine} />
        <View style={styles.stepDot}><Text style={styles.stepNumInactive}>2</Text></View>
        <View style={styles.stepLine} />
        <View style={styles.stepDot}><Text style={styles.stepNumInactive}>3</Text></View>
      </View>
      <Text style={styles.stepTitle}>Step 1 of 3: Select Crop</Text>

      <SectionHeader
        title="Which crop are you selling?"
        subtitle="Choose crop supported at your chosen procurement centre"
      />

      <View style={styles.cropsGrid}>
        {CROPS.map((crop) => {
          const isSelected = selectedCrop === crop.id;
          return (
            <TouchableOpacity
              key={crop.id}
              style={[styles.cropCard, isSelected && styles.cropCardSelected]}
              onPress={() => setSelectedCrop(crop.id)}
              activeOpacity={0.8}
            >
              <Text style={styles.cropEmoji}>{crop.emoji}</Text>
              <Text style={styles.cropName}>{crop.name}</Text>
              <Text style={styles.cropMsp}>MSP: {crop.msp}</Text>
              <Text style={styles.cropSeason}>{crop.season}</Text>

              {isSelected && (
                <View style={styles.checkBadge}>
                  <Ionicons name="checkmark-circle" size={20} color={colors.primary} />
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </View>

      <View style={styles.nextBtnBox}>
        <KisanButton
          title="Continue to Quantity →"
          onPress={() => router.push('/(farmer)/booking/quantity')}
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
  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: spacing.sm,
  },
  stepDot: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#E0E0E0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeStep: {
    backgroundColor: colors.primary,
  },
  stepNum: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 12,
  },
  stepNumInactive: {
    color: '#757575',
    fontSize: 12,
  },
  stepLine: {
    width: 40,
    height: 2,
    backgroundColor: '#E0E0E0',
    marginHorizontal: 4,
  },
  stepTitle: {
    textAlign: 'center',
    fontSize: 13,
    color: colors.primary,
    fontWeight: 'bold',
    marginBottom: spacing.sm,
  },
  cropsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: spacing.lg,
  },
  cropCard: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 1.5,
    borderColor: colors.border,
    position: 'relative',
  },
  cropCardSelected: {
    borderColor: colors.primary,
    backgroundColor: '#F1F8E9',
  },
  cropEmoji: {
    fontSize: 32,
    marginBottom: 6,
  },
  cropName: {
    fontSize: 15,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  cropMsp: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.primary,
    marginBottom: 2,
  },
  cropSeason: {
    fontSize: 11,
    color: colors.textSecondary,
  },
  checkBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
  },
  nextBtnBox: {
    marginBottom: spacing.xl,
  },
});