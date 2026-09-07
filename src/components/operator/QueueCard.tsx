import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { radius } from '../../theme/radius';
import { QueueItemData } from '../../services/queueService';

interface QueueCardProps {
  item: QueueItemData;
  onCall: (item: QueueItemData) => void;
  onAnnounce?: (item: QueueItemData) => void;
  onAllocateLane?: (item: QueueItemData) => void;
  onViewDetails?: (item: QueueItemData) => void;
  scale?: number;
}

export const QueueCard: React.FC<QueueCardProps> = ({
  item,
  onCall,
  onAnnounce,
  onAllocateLane,
  onViewDetails,
  scale = 1.0,
}) => {
  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <View style={styles.tokenBox}>
          <Text style={styles.positionText}>#{item.position}</Text>
          <Text style={[styles.tokenText, { fontSize: 16 * scale }]}>{item.token}</Text>
        </View>

        <View style={styles.infoCol}>
          <TouchableOpacity onPress={() => onViewDetails?.(item)} activeOpacity={0.7}>
            <Text style={[styles.farmerName, { fontSize: 15 * scale }]}>{item.farmer}</Text>
          </TouchableOpacity>
          <View style={styles.metaRow}>
            <Text style={styles.cropText}>🌾 {item.crop}</Text>
            <Text style={styles.bullet}>•</Text>
            <Text style={styles.qtyText}>📦 {item.quantity}</Text>
          </View>
        </View>

        <View style={styles.waitBadge}>
          <Ionicons name="time-outline" size={13} color="#E65100" />
          <Text style={styles.waitText}>{item.waitTime}</Text>
        </View>
      </View>

      <View style={styles.divider} />

      <View style={styles.actionsRow}>
        <TouchableOpacity
          style={[styles.btn, styles.callBtn]}
          onPress={() => onCall(item)}
          activeOpacity={0.8}
        >
          <Ionicons name="megaphone" size={14} color="#FFFFFF" />
          <Text style={styles.callBtnText}>CALL</Text>
        </TouchableOpacity>

        {onAnnounce && (
          <TouchableOpacity
            style={[styles.btn, styles.announceBtn]}
            onPress={() => onAnnounce(item)}
            activeOpacity={0.8}
          >
            <Ionicons name="volume-high" size={14} color="#FFFFFF" />
            <Text style={styles.announceBtnText}>ANNOUNCE</Text>
          </TouchableOpacity>
        )}

        {onAllocateLane && (
          <TouchableOpacity
            style={[styles.btn, styles.laneBtn]}
            onPress={() => onAllocateLane(item)}
            activeOpacity={0.8}
          >
            <Ionicons name="git-branch" size={14} color="#FFFFFF" />
            <Text style={styles.laneBtnText}>LANE</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tokenBox: {
    backgroundColor: '#E8F5E9',
    borderRadius: radius.sm,
    paddingVertical: 6,
    paddingHorizontal: 10,
    alignItems: 'center',
    marginRight: 12,
  },
  positionText: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.primary,
  },
  tokenText: {
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
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 3,
  },
  cropText: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  bullet: {
    marginHorizontal: 6,
    color: '#9E9E9E',
  },
  qtyText: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  waitBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF3E0',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: radius.round,
    gap: 4,
  },
  waitText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#E65100',
  },
  divider: {
    height: 1,
    backgroundColor: colors.divider,
    marginVertical: spacing.sm,
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  btn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    borderRadius: radius.sm,
    gap: 4,
  },
  callBtn: {
    backgroundColor: colors.primary,
  },
  callBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  announceBtn: {
    backgroundColor: '#E65100',
  },
  announceBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  laneBtn: {
    backgroundColor: colors.secondary,
  },
  laneBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
});

export const OperatorQueueCard = QueueCard;
