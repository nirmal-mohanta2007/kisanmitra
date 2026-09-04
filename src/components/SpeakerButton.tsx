import React, { useState, useEffect } from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { speechService, SpeechLanguage } from '../services/speech.service';

interface SpeakerButtonProps {
  cardId: string;
  getText: () => string;
  lang: SpeechLanguage;
  size?: number;
  color?: string;
  activeColor?: string;
  bgColor?: string;
  activeBgColor?: string;
  showLabel?: boolean;
  isHighContrast?: boolean;
}

export const SpeakerButton: React.FC<SpeakerButtonProps> = ({
  cardId,
  getText,
  lang,
  size = 18,
  color = '#184D2B',
  activeColor = '#FFFFFF',
  bgColor = '#F0FDF4',
  activeBgColor = '#DC2626',
  showLabel = false,
  isHighContrast = false,
}) => {
  const [isSpeakingThis, setIsSpeakingThis] = useState(speechService.getActiveId() === cardId);

  useEffect(() => {
    const unsubscribe = speechService.addListener((_isSpeaking, activeId) => {
      setIsSpeakingThis(activeId === cardId);
    });
    return unsubscribe;
  }, [cardId]);

  const handlePress = async () => {
    if (isSpeakingThis) {
      await speechService.stop();
    } else {
      const text = getText();
      await speechService.speak(cardId, text, lang);
    }
  };

  const getLabel = () => {
    if (isSpeakingThis) {
      if (lang === 'or') return 'ବନ୍ଦ';
      if (lang === 'hi') return 'रोकें';
      return 'Stop';
    }
    if (lang === 'or') return 'ଶୁଣନ୍ତୁ';
    if (lang === 'hi') return 'सुनें';
    return 'Listen';
  };

  const getAccessibilityLabel = () => {
    if (isSpeakingThis) {
      if (lang === 'or') return 'ଧ୍ୱନି ବନ୍ଦ କରନ୍ତୁ';
      if (lang === 'hi') return 'आवाज़ बंद करें';
      return 'Stop audio readout';
    }
    if (lang === 'or') return 'କାର୍ଡ ବିବରଣୀ ଶୁଣନ୍ତୁ';
    if (lang === 'hi') return 'कार्ड का विवरण सुनें';
    return 'Read card details aloud';
  };

  const btnBg = isHighContrast
    ? isSpeakingThis
      ? '#FF0000'
      : '#FFE500'
    : isSpeakingThis
    ? activeBgColor
    : bgColor;

  const iconColor = isHighContrast
    ? isSpeakingThis
      ? '#FFFFFF'
      : '#000000'
    : isSpeakingThis
    ? activeColor
    : color;

  return (
    <TouchableOpacity
      style={[
        styles.button,
        { backgroundColor: btnBg },
        isHighContrast && styles.highContrastBorder,
      ]}
      onPress={handlePress}
      activeOpacity={0.7}
      accessible={true}
      accessibilityRole="button"
      accessibilityLabel={getAccessibilityLabel()}
      accessibilityHint={isSpeakingThis ? 'Stops speech readout' : 'Plays text as speech'}
    >
      <Ionicons
        name={isSpeakingThis ? 'stop' : 'volume-medium'}
        size={size}
        color={iconColor}
      />
      {showLabel && (
        <Text style={[styles.labelText, { color: iconColor }]}>
          {getLabel()}
        </Text>
      )}
      {isSpeakingThis && (
        <View style={[styles.pulseDot, { backgroundColor: iconColor }]} />
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.06)',
    gap: 4,
  },
  highContrastBorder: {
    borderWidth: 2,
    borderColor: '#000000',
  },
  labelText: {
    fontSize: 12,
    fontWeight: '700',
  },
  pulseDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginLeft: 2,
  },
});
