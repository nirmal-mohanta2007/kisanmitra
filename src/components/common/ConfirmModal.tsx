import React from 'react';
import { Modal, View, StyleSheet, TouchableOpacity } from 'react-native';
import { colors, spacing, borderRadius } from '../../theme';
import { KisanText } from './KisanText';
import { KisanButton } from './KisanButton';

interface ConfirmModalProps {
  visible: boolean;
  title: string;
  message: string;
  confirmTitle?: string;
  cancelTitle?: string;
  onConfirm: () => void;
  onCancel: () => void;
  isDestructive?: boolean;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  visible,
  title,
  message,
  confirmTitle = 'Confirm',
  cancelTitle = 'Cancel',
  onConfirm,
  onCancel,
  isDestructive = false,
}) => {
  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      onRequestClose={onCancel}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <KisanText variant="subheading" style={styles.title}>
            {title}
          </KisanText>
          <KisanText variant="body" color={colors.textSecondary} style={styles.message}>
            {message}
          </KisanText>
          
          <View style={styles.buttonContainer}>
            <KisanButton
              title={cancelTitle}
              variant="outline"
              onPress={onCancel}
              style={styles.button}
            />
            <KisanButton
              title={confirmTitle}
              variant={isDestructive ? 'danger' : 'primary'}
              onPress={onConfirm}
              style={styles.button}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.l,
  },
  modalContainer: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.card,
    padding: spacing.xl,
    width: '100%',
    maxWidth: 400,
  },
  title: {
    marginBottom: spacing.m,
  },
  message: {
    marginBottom: spacing.xl,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.m,
  },
  button: {
    flex: 1,
  },
});
