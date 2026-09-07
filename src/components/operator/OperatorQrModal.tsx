import React, { useState } from 'react';
import {
  View,
  Text,
  Modal,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { radius } from '../../theme/radius';
import { spacing } from '../../theme/spacing';
import type { ProcurementTransaction } from '../../types/models';
import { useAppContext } from '../../store/app-context';
import { getOperatorTexts } from '../../i18n/operator-translations';

interface OperatorQrModalProps {
  visible: boolean;
  onClose: () => void;
  onSelectTransaction: (tx: ProcurementTransaction) => void;
  transactions: ProcurementTransaction[];
}

export const OperatorQrModal: React.FC<OperatorQrModalProps> = ({
  visible,
  onClose,
  onSelectTransaction,
  transactions,
}) => {
  const { state } = useAppContext();
  const t = getOperatorTexts(state.language);
  const scale = state.textScale || 1.0;
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = transactions.filter((tx) => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      (tx.tokenNumber && tx.tokenNumber.toString().includes(q)) ||
      (tx.farmerName && tx.farmerName.toLowerCase().includes(q)) ||
      (tx.farmerPhone && tx.farmerPhone.includes(q)) ||
      (tx.id && tx.id.toLowerCase().includes(q)) ||
      (tx.crop && tx.crop.toLowerCase().includes(q))
    );
  });

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContent}>
          {/* Header */}
          <View style={styles.modalHeader}>
            <View style={styles.modalTitleRow}>
              <Ionicons name="qr-code-outline" size={24} color={colors.secondary} />
              <Text style={[styles.modalTitle, { fontSize: 18 * scale }]}>
                {t.scanQr}
              </Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Ionicons name="close" size={22} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>

          {/* Scanner Card with Web Camera Scan trigger */}
          <View style={styles.scannerBox}>
            <View style={styles.targetCornerTL} />
            <View style={styles.targetCornerTR} />
            <View style={styles.targetCornerBL} />
            <View style={styles.targetCornerBR} />

            <Ionicons name="camera-outline" size={40} color="#FFFFFF" style={{ opacity: 0.9 }} />
            <Text style={[styles.scannerHint, { fontSize: 12 * scale }]}>
              {t.scanTokenDesc}
            </Text>

            {/* Quick Web Scanner Trigger */}
            <TouchableOpacity
              style={styles.webScanBtn}
              onPress={() => {
                // Auto select first matching token or show quick scan confirmation
                if (filtered.length > 0) {
                  onSelectTransaction(filtered[0]);
                  onClose();
                }
              }}
              activeOpacity={0.8}
            >
              <Ionicons name="scan-circle-outline" size={16} color="#00E676" />
              <Text style={styles.webScanBtnText}>📷 Auto Scan Top Queue Token (#{filtered[0]?.tokenNumber || '101'})</Text>
            </TouchableOpacity>

            <View style={styles.scanLaser} />
          </View>

          {/* Search Input */}
          <View style={styles.searchBar}>
            <Ionicons name="search" size={18} color={colors.textSecondary} style={{ marginRight: 8 }} />
            <TextInput
              style={[styles.searchInput, { fontSize: 14 * scale }]}
              placeholder={t.searchPlaceholder}
              placeholderTextColor={colors.textSecondary}
              value={searchQuery}
              onChangeText={setSearchQuery}
              keyboardType="default"
              autoCapitalize="none"
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery('')}>
                <Ionicons name="close-circle" size={18} color={colors.textSecondary} />
              </TouchableOpacity>
            )}
          </View>

          {/* Selectable Transactions List */}
          <Text style={[styles.listHeader, { fontSize: 12 * scale }]}>
            {t.filterPending} / Incoming Farmer Queue ({filtered.length})
          </Text>

          <ScrollView style={styles.listContainer} showsVerticalScrollIndicator={false}>
            {filtered.length === 0 ? (
              <View style={styles.emptyBox}>
                <Ionicons name="alert-circle-outline" size={32} color={colors.textSecondary} />
                <Text style={[styles.emptyText, { fontSize: 13 * scale }]}>
                  No matching token found
                </Text>
              </View>
            ) : (
              filtered.map((tx) => (
                <TouchableOpacity
                  key={tx.id}
                  style={styles.tokenCard}
                  onPress={() => {
                    onSelectTransaction(tx);
                    onClose();
                  }}
                >
                  <View style={styles.tokenBadge}>
                    <Text style={styles.tokenNumber}>#{tx.tokenNumber}</Text>
                  </View>

                  <View style={{ flex: 1, marginLeft: 12 }}>
                    <Text style={[styles.farmerName, { fontSize: 15 * scale }]}>
                      {tx.farmerName}
                    </Text>
                    <Text style={[styles.farmerMeta, { fontSize: 12 * scale }]}>
                      🌾 {tx.crop} • {tx.expectedQuantity} Qtl • 📞 {tx.farmerPhone}
                    </Text>
                  </View>

                  <View style={styles.selectBtn}>
                    <Text style={styles.selectBtnText}>Select ›</Text>
                  </View>
                </TouchableOpacity>
              ))
            )}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: radius.lg,
    borderTopRightRadius: radius.lg,
    padding: spacing.md,
    maxHeight: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  modalTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  modalTitle: {
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  closeBtn: {
    padding: 6,
  },
  scannerBox: {
    height: 160,
    backgroundColor: '#1A237E',
    borderRadius: radius.md,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    overflow: 'hidden',
    marginBottom: spacing.md,
  },
  targetCornerTL: {
    position: 'absolute',
    top: 16,
    left: 20,
    width: 24,
    height: 24,
    borderTopWidth: 3,
    borderLeftWidth: 3,
    borderColor: '#4CAF50',
  },
  targetCornerTR: {
    position: 'absolute',
    top: 16,
    right: 20,
    width: 24,
    height: 24,
    borderTopWidth: 3,
    borderRightWidth: 3,
    borderColor: '#4CAF50',
  },
  targetCornerBL: {
    position: 'absolute',
    bottom: 16,
    left: 20,
    width: 24,
    height: 24,
    borderBottomWidth: 3,
    borderLeftWidth: 3,
    borderColor: '#4CAF50',
  },
  targetCornerBR: {
    position: 'absolute',
    bottom: 16,
    right: 20,
    width: 24,
    height: 24,
    borderBottomWidth: 3,
    borderRightWidth: 3,
    borderColor: '#4CAF50',
  },
  scannerHint: {
    color: '#E0E0E0',
    textAlign: 'center',
    marginTop: 6,
    paddingHorizontal: spacing.lg,
  },
  webScanBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(0, 230, 118, 0.2)',
    borderWidth: 1,
    borderColor: '#00E676',
    borderRadius: radius.sm,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginTop: 10,
    zIndex: 10,
  },
  webScanBtnText: {
    color: '#00E676',
    fontSize: 12,
    fontWeight: '700',
  },
  scanLaser: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: '#00E676',
    top: '50%',
    shadowColor: '#00E676',
    shadowOpacity: 0.8,
    shadowRadius: 6,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: radius.sm,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.sm,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 10,
    color: colors.textPrimary,
  },
  listHeader: {
    fontWeight: 'bold',
    color: colors.textSecondary,
    marginBottom: spacing.xs,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  listContainer: {
    maxHeight: 280,
  },
  emptyBox: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
  },
  emptyText: {
    color: colors.textSecondary,
    marginTop: 6,
  },
  tokenCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FAFAFA',
    padding: spacing.sm,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 8,
  },
  tokenBadge: {
    backgroundColor: '#E3F2FD',
    width: 44,
    height: 44,
    borderRadius: radius.sm,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tokenNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.secondary,
  },
  farmerName: {
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  farmerMeta: {
    color: colors.textSecondary,
    marginTop: 2,
  },
  selectBtn: {
    backgroundColor: colors.secondary,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: radius.sm,
  },
  selectBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
});
