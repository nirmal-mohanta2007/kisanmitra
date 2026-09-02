import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing } from '../../theme';
import { KisanText } from '../common/KisanText';

const STEPS = [
  { id: 'checkin', title: 'Check-in' },
  { id: 'weighing', title: 'Weighing' },
  { id: 'quality', title: 'Quality' },
  { id: 'payment', title: 'Payment' }
];

interface OperationStepperProps {
  currentStepId: string;
}

export const OperationStepper: React.FC<OperationStepperProps> = ({ currentStepId }) => {
  const currentIndex = STEPS.findIndex(s => s.id === currentStepId);

  return (
    <View style={styles.container}>
      {STEPS.map((step, index) => {
        const isCompleted = index < currentIndex;
        const isActive = index === currentIndex;
        const isPending = index > currentIndex;
        
        const isLast = index === STEPS.length - 1;

        return (
          <View key={step.id} style={styles.stepContainer}>
            <View style={styles.iconWrapper}>
              <View 
                style={[
                  styles.circle,
                  isCompleted ? styles.completedCircle : isActive ? styles.activeCircle : styles.pendingCircle
                ]}
              >
                {isCompleted ? (
                  <Ionicons name="checkmark" size={14} color={colors.surface} />
                ) : (
                  <KisanText 
                    variant="caption" 
                    color={isActive ? colors.surface : colors.textSecondary}
                    style={styles.stepNumber}
                  >
                    {index + 1}
                  </KisanText>
                )}
              </View>
              <KisanText 
                variant="caption" 
                style={[
                  styles.title,
                  isActive && styles.activeTitle,
                  isCompleted && styles.completedTitle
                ]}
              >
                {step.title}
              </KisanText>
            </View>
            
            {!isLast && (
              <View 
                style={[
                  styles.connector,
                  isCompleted ? styles.completedConnector : styles.pendingConnector
                ]} 
              />
            )}
          </View>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingVertical: spacing.m,
  },
  stepContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    flex: 1,
  },
  iconWrapper: {
    alignItems: 'center',
    width: 60,
  },
  circle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  completedCircle: {
    backgroundColor: colors.primary,
  },
  activeCircle: {
    backgroundColor: colors.secondary,
  },
  pendingCircle: {
    backgroundColor: '#E0E0E0',
  },
  stepNumber: {
    fontWeight: 'bold',
  },
  title: {
    fontSize: 10,
    textAlign: 'center',
    color: colors.textSecondary,
  },
  activeTitle: {
    color: colors.secondary,
    fontWeight: 'bold',
  },
  completedTitle: {
    color: colors.primary,
  },
  connector: {
    flex: 1,
    height: 2,
    marginTop: 11,
    marginHorizontal: -15,
    zIndex: -1,
  },
  completedConnector: {
    backgroundColor: colors.primary,
  },
  pendingConnector: {
    backgroundColor: '#E0E0E0',
  },
});
