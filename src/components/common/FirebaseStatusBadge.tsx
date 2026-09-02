import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useAppContext } from '../../store/app-context';
import { colors } from '../../theme/colors';

export const FirebaseStatusBadge: React.FC = () => {
  const { state, seedFirebaseDatabase } = useAppContext();
  const [isSeeding, setIsSeeding] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'info' | 'error'; message: string } | null>(null);

  const handleSeed = async () => {
    setIsSeeding(true);
    setFeedback(null);
    try {
      const result = await seedFirebaseDatabase(true);
      setFeedback({
        type: result.success ? 'success' : 'info',
        message: result.message,
      });
    } catch (e: any) {
      setFeedback({
        type: 'error',
        message: e?.message || 'Database notice during sync.',
      });
    } finally {
      setIsSeeding(false);
    }
  };

  return (
    <View style={styles.wrapper}>
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
            activeOpacity={0.8}
          >
            {isSeeding ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <Text style={styles.seedButtonText}>Seed Firestore Data</Text>
            )}
          </TouchableOpacity>
        )}
      </View>

      {feedback && (
        <View
          style={[
            styles.feedbackBox,
            feedback.type === 'success'
              ? styles.feedbackSuccess
              : feedback.type === 'error'
              ? styles.feedbackError
              : styles.feedbackInfo,
          ]}
        >
          <Text
            style={[
              styles.feedbackText,
              feedback.type === 'success'
                ? styles.textSuccess
                : feedback.type === 'error'
                ? styles.textError
                : styles.textInfo,
            ]}
          >
            {feedback.message}
          </Text>
          <TouchableOpacity onPress={() => setFeedback(null)}>
            <Text style={styles.dismissText}>✕</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    marginVertical: 6,
  },
  container: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
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
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  seedButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  feedbackBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    borderWidth: 1,
  },
  feedbackSuccess: {
    backgroundColor: '#E8F5E9',
    borderColor: '#C8E6C9',
  },
  feedbackInfo: {
    backgroundColor: '#FFF8E1',
    borderColor: '#FFE082',
  },
  feedbackError: {
    backgroundColor: '#FFEBEE',
    borderColor: '#FFCDD2',
  },
  feedbackText: {
    fontSize: 12,
    flex: 1,
    marginRight: 8,
    lineHeight: 16,
  },
  textSuccess: {
    color: '#2E7D32',
    fontWeight: '600',
  },
  textInfo: {
    color: '#F57F17',
    fontWeight: '500',
  },
  textError: {
    color: '#C62828',
    fontWeight: '500',
  },
  dismissText: {
    fontSize: 14,
    color: '#757575',
    fontWeight: 'bold',
    paddingHorizontal: 4,
  },
});
