import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../../src/theme/colors';
import { spacing } from '../../../src/theme/spacing';
import { radius } from '../../../src/theme/radius';
import {
  ScreenContainer,
  KisanCard,
  StatusBadge,
  SectionHeader,
  KisanButton,
  AppText as Text,
} from '../../../src/components/common';
import { MOCK_TRANSACTIONS } from '../../../src/services/mock-data.service';
import { useAppContext } from '../../../src/store/app-context';

export default function FarmerBookingsScreen() {
  const router = useRouter();
  const { state } = useAppContext();
  const lang = state.language || 'hi';
  const bookings = MOCK_TRANSACTIONS.filter((t) => t.farmerId === 'F-001');

  const text = {
    title: lang === 'or' ? 'ସକ୍ରିୟ ବୁକିଂ' : lang === 'hi' ? 'सक्रिय बुकिंग' : 'Active Bookings',
    subtitle: lang === 'or' ? 'ଆପଣଙ୍କ ମଣ୍ଡି ସ୍ଲଟ୍ ଟ୍ରାକ୍ ଓ ପରିଚାଳନା କରନ୍ତୁ' : lang === 'hi' ? 'अपनी आगामी मंडी स्लॉट ट्रैक और प्रबंधित करें' : 'Track and manage your upcoming mandi slots',
    qty: lang === 'or' ? 'ପରିମାଣ' : lang === 'hi' ? 'मात्रा' : 'Quantity',
    token: lang === 'or' ? 'ଟୋକନ୍' : lang === 'hi' ? 'टोकन' : 'Token',
    slotDate: lang === 'or' ? 'ସ୍ଲଟ୍ ତାରିଖ' : lang === 'hi' ? 'स्लॉट तिथि' : 'Slot Date',
    quintals: lang === 'or' ? 'କ୍ୱିଣ୍ଟାଲ' : lang === 'hi' ? 'क्विंटल' : 'Quintals',
    checklist: lang === 'or' ? 'ଚେକଲିଷ୍ଟ' : lang === 'hi' ? 'चेकलिस्ट' : 'Checklist',
    trackQueue: lang === 'or' ? 'ଧାଡ଼ି ଦେଖନ୍ତୁ' : lang === 'hi' ? 'कतार देखें' : 'Track Queue',
    bookNew: lang === 'or' ? '+ ନୂତନ ସ୍ଲଟ୍ ବୁକ୍ କରନ୍ତୁ' : lang === 'hi' ? '+ नया खरीद स्लॉट बुक करें' : '+ Book New Procurement Slot',
  };

  return (
    <ScreenContainer scrollable style={styles.container}>
      <SectionHeader
        title={text.title}
        subtitle={text.subtitle}
      />

      {bookings.map((booking) => (
        <KisanCard key={booking.id} style={styles.bookingCard}>
          <View style={styles.cardTop}>
            <View>
              <Text style={styles.bookingId}>{booking.id}</Text>
              <Text style={styles.cropTitle}>{booking.crop}</Text>
            </View>
            <StatusBadge status={booking.status} />
          </View>

          <View style={styles.infoGrid}>
            <View style={styles.infoCol}>
              <Text style={styles.label}>{text.qty}</Text>
              <Text style={styles.value}>{booking.expectedQuantity} {text.quintals}</Text>
            </View>
            <View style={styles.infoCol}>
              <Text style={styles.label}>{text.token}</Text>
              <Text style={styles.tokenValue}>#{booking.tokenNumber}</Text>
            </View>
            <View style={styles.infoCol}>
              <Text style={styles.label}>{text.slotDate}</Text>
              <Text style={styles.value}>{booking.bookingDate}</Text>
            </View>
          </View>

          <View style={styles.mandiBox}>
            <Ionicons name="location-outline" size={16} color={colors.primary} />
            <Text style={styles.mandiText}>{booking.centreName}</Text>
          </View>

          <View style={styles.actionsRow}>
            <TouchableOpacity
              style={styles.secondaryBtn}
              onPress={() => router.push(`/(farmer)/booking/checklist` as any)}
            >
              <Ionicons name="list-outline" size={16} color={colors.primary} />
              <Text style={styles.secondaryBtnText}>{text.checklist}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.primaryBtn}
              onPress={() => router.push(`/(farmer)/queue/${booking.id}` as any)}
            >
              <Ionicons name="timer-outline" size={16} color="#FFFFFF" />
              <Text style={styles.primaryBtnText}>{text.trackQueue}</Text>
            </TouchableOpacity>
          </View>
        </KisanCard>
      ))}

      <View style={styles.newBookingSection}>
        <KisanButton
          title={text.bookNew}
          onPress={() => router.push('/(farmer)/booking/crop')}
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
  bookingCard: {
    marginBottom: spacing.md,
  },
  cardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.sm,
  },
  bookingId: {
    fontSize: 15,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  cropTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  infoGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#F5F7FA',
    padding: spacing.sm,
    borderRadius: radius.sm,
    marginBottom: spacing.sm,
  },
  infoCol: {
    flex: 1,
  },
  label: {
    fontSize: 17,
    color: colors.textSecondary,
    marginBottom: 3,
  },
  value: {
    fontSize: 17.5,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  tokenValue: {
    fontSize: 18.5,
    fontWeight: 'bold',
    color: colors.primary,
  },
  mandiBox: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  mandiText: {
    fontSize: 17,
    color: colors.textSecondary,
    marginLeft: 6,
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  secondaryBtn: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 12,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.primary,
    backgroundColor: '#E8F5E9',
  },
  secondaryBtnText: {
    fontSize: 17,
    fontWeight: '600',
    color: colors.primary,
    marginLeft: 4,
  },
  primaryBtn: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 12,
    borderRadius: radius.sm,
    backgroundColor: colors.primary,
  },
  primaryBtnText: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginLeft: 4,
  },
  newBookingSection: {
    marginVertical: spacing.lg,
  },
});