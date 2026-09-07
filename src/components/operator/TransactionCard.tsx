import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { radius } from '../../theme/radius';

interface TransactionCardProps {
  token: string;
  farmer: string;
  crop: string;
  quantity: string;
  stage: string;
  status: string;
  time: string;
  onPress?: () => void;
  scale?: number;
}

export const TransactionCard: React.FC<TransactionCardProps> = ({
  token,
  farmer,
  crop,
  quantity,
  stage,
  time,
  onPress,
  scale = 1.0,
}) => {
  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={onPress ? 0.7 : 1}
      disabled={!onPress}
    >
      <View style={styles.tokenBox}>
        <Text style={styles.tokenText}>{token}</Text>
      </View>

      <View style={styles.infoCol}>
        <Text style={[styles.farmerName, { fontSize: 14 * scale }]}>{farmer}</Text>
        <Text style={styles.cropText}>
          🌾 {crop} • <Text style={{ fontWeight: '600' }}>{quantity}</Text>
        </Text>
      </View>

      <View style={styles.statusCol}>
        <View style={styles.stagePill}>
          <Text style={styles.stageText}>{stage}</Text>
        </View>
        <Text style={styles.timeText}>{time}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  tokenBox: {
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: radius.sm,
    marginRight: 10,
  },
  tokenText: {
    fontSize: 12,
    fontWeight: '800',
    color: colors.primary,
  },
  infoCol: {
    flex: 1,
  },
  farmerName: {
    fontWeight: '700',
    color: colors.textPrimary,
  },
  cropText: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  statusCol: {
    alignItems: 'flex-end',
  },
  stagePill: {
    backgroundColor: '#E3F2FD',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: radius.round,
  },
  stageText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.secondary,
  },
  timeText: {
    fontSize: 10,
    color: '#757575',
    marginTop: 3,
  },
});
