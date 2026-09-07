import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { radius } from '../../theme/radius';
import { OperationalAlert } from '../../store/operator.store';

interface AlertCardProps {
  alert: OperationalAlert;
  onPress?: (alert: OperationalAlert) => void;
  onDismiss?: (id: string) => void;
}

export const AlertCard: React.FC<AlertCardProps> = ({ alert, onPress, onDismiss }) => {
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => onPress?.(alert)}
      activeOpacity={onPress ? 0.75 : 1}
      disabled={!onPress}
    >
      <Text style={styles.dot}>{alert.icon}</Text>
      <View style={styles.textCol}>
        <Text style={styles.message}>{alert.message}</Text>
        <Text style={styles.time}>{alert.timestamp}</Text>
      </View>

      {onDismiss && (
        <TouchableOpacity
          style={styles.dismissBtn}
          onPress={() => onDismiss(alert.id)}
          activeOpacity={0.7}
        >
          <Ionicons name="close" size={16} color="#9E9E9E" />
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 10,
    backgroundColor: '#FAFAFA',
    borderRadius: radius.sm,
    marginBottom: spacing.xs,
    borderWidth: 1,
    borderColor: '#EEEEEE',
  },
  dot: {
    fontSize: 14,
    marginRight: 8,
  },
  textCol: {
    flex: 1,
  },
  message: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textPrimary,
    lineHeight: 16,
  },
  time: {
    fontSize: 10,
    color: '#757575',
    marginTop: 2,
  },
  dismissBtn: {
    padding: 4,
  },
});
