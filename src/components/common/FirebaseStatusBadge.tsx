import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { useAppContext } from '../../store/app-context';
import { colors } from '../../theme/colors';

export const FirebaseStatusBadge: React.FC = () => {
  const { state, seedFirebaseDatabase } = useAppContext();
  const [isSeeding, setIsSeeding] = useState(false);

  const handleSeed = async () => {
    setIsSeeding(true);
    try {
      const result = await seedFirebaseDatabase(true);
      Alert.alert(
        result.success ? 'Firebase Seeding' : 'Notice',
        result.message
      );
    } catch (e: any) {
      Alert.alert('Error', e.message || 'Failed to seed database');
    } finally {
      setIsSeeding(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.statusRow}>
        <View
          style={[
            styles.dot,
            { backgroundColor: state.isFirebaseConnected ? colors.status.success : colors.status.warning },
          ]}
        />
        <Text style={styles.statusText}>
          {state.isFirebaseConnected ? 'Firebase Live Connected' : 'Demo / Offline Mode'}
        </Text>
        {state.isSyncing && (
          <ActivityIndicator size="small" color={colors.primary} style={{ marginLeft: 6 }} />
        )}
      </View>

      {state.isFirebaseConnected && (
        <TouchableOpacity
          style={styles.seedButton}
          onPress={handleSeed}
          disabled={isSeeding}
        >
          {isSeeding ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <Text style={styles.seedButtonText}>Seed Firestore Data</Text>
          )}
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    marginVertical: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 8,
  },
  statusText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#333333',
  },
  seedButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  seedButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
});
