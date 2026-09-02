import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, borderRadius } from '../../theme';
import { KisanText } from '../common/KisanText';
import { KisanCard } from '../common/KisanCard';

interface FarmerInfoCardProps {
  name: string;
  phone: string;
  farmerId: string;
  isVerified: boolean;
  tokenNumber: number;
  cropInfo: {
    name: string;
    expectedQty: string;
    variety?: string;
  };
}

export const FarmerInfoCard: React.FC<FarmerInfoCardProps> = ({
  name,
  phone,
  farmerId,
  isVerified,
  tokenNumber,
  cropInfo,
}) => {
  return (
    <KisanCard>
      <View style={styles.header}>
        <View style={styles.nameContainer}>
          <KisanText variant="subheading" style={styles.name}>{name}</KisanText>
          {isVerified && (
            <Ionicons name="checkmark-circle" size={18} color={colors.primary} style={styles.verifiedIcon} />
          )}
        </View>
        <View style={styles.tokenBadge}>
          <KisanText variant="caption" color={colors.primary} style={styles.tokenText}>
            Token #{tokenNumber}
          </KisanText>
        </View>
      </View>

      <View style={styles.infoGrid}>
        <View style={styles.infoItem}>
          <KisanText variant="caption" color={colors.textSecondary}>Farmer ID</KisanText>
          <KisanText variant="body" style={styles.infoValue}>{farmerId}</KisanText>
        </View>
        <View style={styles.infoItem}>
          <KisanText variant="caption" color={colors.textSecondary}>Phone</KisanText>
          <KisanText variant="body" style={styles.infoValue}>{phone}</KisanText>
        </View>
      </View>

      <View style={styles.divider} />

      <KisanText variant="caption" color={colors.textSecondary} style={styles.sectionTitle}>
        Procurement Details
      </KisanText>
      
      <View style={styles.infoGrid}>
        <View style={styles.infoItem}>
          <KisanText variant="caption" color={colors.textSecondary}>Crop</KisanText>
          <KisanText variant="body" style={styles.infoValue}>{cropInfo.name}</KisanText>
        </View>
        <View style={styles.infoItem}>
          <KisanText variant="caption" color={colors.textSecondary}>Expected Qty</KisanText>
          <KisanText variant="body" style={styles.infoValue}>{cropInfo.expectedQty}</KisanText>
        </View>
        {cropInfo.variety && (
          <View style={styles.infoItem}>
            <KisanText variant="caption" color={colors.textSecondary}>Variety</KisanText>
            <KisanText variant="body" style={styles.infoValue}>{cropInfo.variety}</KisanText>
          </View>
        )}
      </View>
    </KisanCard>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.m,
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  name: {
    fontWeight: 'bold',
  },
  verifiedIcon: {
    marginLeft: 4,
  },
  tokenBadge: {
    backgroundColor: `${colors.primary}15`,
    paddingHorizontal: spacing.m,
    paddingVertical: 4,
    borderRadius: 16,
  },
  tokenText: {
    fontWeight: 'bold',
  },
  infoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.m,
  },
  infoItem: {
    width: '45%',
  },
  infoValue: {
    fontWeight: '500',
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: '#E0E0E0',
    marginVertical: spacing.m,
  },
  sectionTitle: {
    marginBottom: spacing.s,
  },
});
