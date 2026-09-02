import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing } from '../../theme';
import { KisanText } from '../common/KisanText';
import { KisanCard } from '../common/KisanCard';

export type TimelineStage = {
  id: string;
  title: string;
  description?: string;
  status: 'COMPLETED' | 'ACTIVE' | 'PENDING' | 'ERROR';
  time?: string;
};

interface ProcurementTimelineProps {
  stages: TimelineStage[];
}

export const ProcurementTimeline: React.FC<ProcurementTimelineProps> = ({ stages }) => {
  return (
    <KisanCard>
      <KisanText variant="subheading" style={styles.title}>Procurement Status</KisanText>
      
      <View style={styles.timelineContainer}>
        {stages.map((stage, index) => {
          const isLast = index === stages.length - 1;
          const isActive = stage.status === 'ACTIVE';
          const isCompleted = stage.status === 'COMPLETED';
          const isError = stage.status === 'ERROR';
          
          let iconColor = colors.textSecondary;
          let iconName: keyof typeof Ionicons.glyphMap = 'ellipse-outline';
          
          if (isCompleted) {
            iconColor = colors.primary;
            iconName = 'checkmark-circle';
          } else if (isActive) {
            iconColor = colors.secondary;
            iconName = 'time';
          } else if (isError) {
            iconColor = colors.error;
            iconName = 'close-circle';
          }

          return (
            <View key={stage.id} style={styles.stageRow}>
              <View style={styles.iconContainer}>
                <Ionicons name={iconName} size={24} color={iconColor} />
                {!isLast && (
                  <View style={[styles.line, { backgroundColor: isCompleted ? colors.primary : '#E0E0E0' }]} />
                )}
              </View>
              
              <View style={styles.contentContainer}>
                <View style={styles.headerRow}>
                  <KisanText 
                    variant="body" 
                    style={[styles.stageTitle, isActive && styles.activeTitle]}
                    color={isActive ? colors.secondary : colors.textPrimary}
                  >
                    {stage.title}
                  </KisanText>
                  {stage.time && (
                    <KisanText variant="caption" color={colors.textSecondary}>
                      {stage.time}
                    </KisanText>
                  )}
                </View>
                
                {stage.description && (
                  <KisanText variant="caption" color={colors.textSecondary} style={styles.description}>
                    {stage.description}
                  </KisanText>
                )}
              </View>
            </View>
          );
        })}
      </View>
    </KisanCard>
  );
};

const styles = StyleSheet.create({
  title: {
    marginBottom: spacing.l,
  },
  timelineContainer: {
    paddingLeft: spacing.s,
  },
  stageRow: {
    flexDirection: 'row',
  },
  iconContainer: {
    alignItems: 'center',
    width: 30,
  },
  line: {
    width: 2,
    flex: 1,
    marginVertical: 4,
  },
  contentContainer: {
    flex: 1,
    paddingLeft: spacing.m,
    paddingBottom: spacing.xl,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  stageTitle: {
    fontWeight: '500',
  },
  activeTitle: {
    fontWeight: 'bold',
  },
  description: {
    marginTop: 4,
  },
});
