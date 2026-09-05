import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { speechService, SpeechLanguage } from '../services/speech.service';
import { useAppContext, TextScale } from '../store/app-context';

export type { TextScale };

interface AccessibilityToolbarProps {
  lang?: SpeechLanguage;
  textScale?: TextScale;
  onChangeTextScale?: (scale: TextScale) => void;
  isHighContrast?: boolean;
  onToggleHighContrast?: () => void;
}

export const AccessibilityToolbar: React.FC<AccessibilityToolbarProps> = ({
  lang = 'hi',
  textScale: propTextScale,
  onChangeTextScale,
  isHighContrast = false,
  onToggleHighContrast,
}) => {
  const { state, setTextScale } = useAppContext();
  const textScale = propTextScale ?? state?.textScale ?? 1.0;

  const handleScaleChange = (scale: TextScale) => {
    setTextScale(scale);
    onChangeTextScale?.(scale);
  };
  const [isSpeaking, setIsSpeaking] = useState(speechService.isSpeaking());

  useEffect(() => {
    const unsub = speechService.addListener((speaking) => {
      setIsSpeaking(speaking);
    });
    return unsub;
  }, []);

  const getContrastLabel = () => {
    if (lang === 'or') return isHighContrast ? 'ସାଧାରଣ ଦୃଶ୍ୟ' : 'ଉଚ୍ଚ କଣ୍ଟ୍ରାଷ୍ଟ';
    if (lang === 'hi') return isHighContrast ? 'सामान्य दृश्य' : 'हाई कंट्रास्ट';
    return isHighContrast ? 'Normal' : 'High Contrast';
  };

  const getTextSizeLabel = () => {
    if (lang === 'or') return 'ଅକ୍ଷର:';
    if (lang === 'hi') return 'आकार:';
    return 'Font:';
  };

  const getAudioSpeakingLabel = () => {
    if (lang === 'or') return 'ପଢ଼ୁଛି...';
    if (lang === 'hi') return 'बोल रहा है...';
    return 'Speaking...';
  };

  return (
    <View
      style={[
        styles.toolbar,
        isHighContrast && styles.toolbarHighContrast,
      ]}
      accessible={true}
      accessibilityRole="toolbar"
      accessibilityLabel={
        lang === 'or'
          ? 'ସୁଗମତା ଟୁଲବାର୍'
          : lang === 'hi'
          ? 'सुलभता टूलबार'
          : 'Accessibility toolbar'
      }
    >
      {/* Left: Font Size Scaling (A-, A, A+) */}
      <View style={styles.fontScalingRow}>
        <Text
          style={[
            styles.toolbarLabel,
            isHighContrast && styles.textHighContrast,
          ]}
        >
          {getTextSizeLabel()}
        </Text>

        <TouchableOpacity
          style={[
            styles.scaleBtn,
            textScale === 1.0 && styles.scaleBtnActive,
            isHighContrast && styles.scaleBtnHighContrast,
            isHighContrast && textScale === 1.0 && styles.scaleBtnActiveHighContrast,
          ]}
          onPress={() => handleScaleChange(1.0)}
          accessible={true}
          accessibilityRole="button"
          accessibilityLabel="Normal text size"
        >
          <Text
            style={[
              styles.scaleBtnTextSmall,
              textScale === 1.0 && styles.scaleBtnTextActive,
              isHighContrast && styles.textHighContrast,
              isHighContrast && textScale === 1.0 && styles.textBlackHighContrast,
            ]}
          >
            A
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.scaleBtn,
            textScale === 1.15 && styles.scaleBtnActive,
            isHighContrast && styles.scaleBtnHighContrast,
            isHighContrast && textScale === 1.15 && styles.scaleBtnActiveHighContrast,
          ]}
          onPress={() => handleScaleChange(1.15)}
          accessible={true}
          accessibilityRole="button"
          accessibilityLabel="Large text size"
        >
          <Text
            style={[
              styles.scaleBtnTextMedium,
              textScale === 1.15 && styles.scaleBtnTextActive,
              isHighContrast && styles.textHighContrast,
              isHighContrast && textScale === 1.15 && styles.textBlackHighContrast,
            ]}
          >
            A+
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.scaleBtn,
            textScale === 1.3 && styles.scaleBtnActive,
            isHighContrast && styles.scaleBtnHighContrast,
            isHighContrast && textScale === 1.3 && styles.scaleBtnActiveHighContrast,
          ]}
          onPress={() => handleScaleChange(1.3)}
          accessible={true}
          accessibilityRole="button"
          accessibilityLabel="Extra large text size"
        >
          <Text
            style={[
              styles.scaleBtnTextLarge,
              textScale === 1.3 && styles.scaleBtnTextActive,
              isHighContrast && styles.textHighContrast,
              isHighContrast && textScale === 1.3 && styles.textBlackHighContrast,
            ]}
          >
            A++
          </Text>
        </TouchableOpacity>
      </View>

      {/* Right side: High Contrast Toggle & Active Voice indicator */}
      <View style={styles.rightActionsRow}>
        {/* Active Audio Stop Button (if audio is currently speaking) */}
        {isSpeaking && (
          <TouchableOpacity
            style={[styles.audioSpeakingPill, isHighContrast && styles.audioPillHighContrast]}
            onPress={() => speechService.stop()}
            accessible={true}
            accessibilityRole="button"
            accessibilityLabel="Stop speaking audio"
          >
            <Ionicons name="volume-high" size={13} color="#FFFFFF" />
            <Text style={styles.audioSpeakingText}>{getAudioSpeakingLabel()}</Text>
            <Ionicons name="stop-circle" size={14} color="#FFFFFF" />
          </TouchableOpacity>
        )}

        {/* High Contrast Mode Toggle */}
        <TouchableOpacity
          style={[
            styles.contrastToggle,
            isHighContrast && styles.contrastToggleActive,
          ]}
          onPress={onToggleHighContrast}
          accessible={true}
          accessibilityRole="button"
          accessibilityLabel={getContrastLabel()}
        >
          <Ionicons
            name={isHighContrast ? 'contrast' : 'contrast-outline'}
            size={14}
            color={isHighContrast ? '#000000' : '#E6F4EA'}
          />
          <Text
            style={[
              styles.contrastToggleText,
              isHighContrast && styles.contrastToggleTextActive,
            ]}
          >
            {getContrastLabel()}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  toolbar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(20, 63, 35, 0.95)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.12)',
  },
  toolbarHighContrast: {
    backgroundColor: '#000000',
    borderBottomWidth: 2,
    borderBottomColor: '#FFE500',
  },
  fontScalingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  toolbarLabel: {
    fontSize: 11,
    color: '#D1E7DD',
    fontWeight: '600',
    marginRight: 2,
  },
  textHighContrast: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  textBlackHighContrast: {
    color: '#000000',
    fontWeight: '800',
  },
  scaleBtn: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  scaleBtnHighContrast: {
    backgroundColor: '#1C1C1E',
    borderColor: '#FFE500',
  },
  scaleBtnActive: {
    backgroundColor: '#E6F4EA',
  },
  scaleBtnActiveHighContrast: {
    backgroundColor: '#FFE500',
  },
  scaleBtnTextSmall: {
    fontSize: 11,
    fontWeight: '700',
    color: '#E6F4EA',
  },
  scaleBtnTextMedium: {
    fontSize: 13,
    fontWeight: '800',
    color: '#E6F4EA',
  },
  scaleBtnTextLarge: {
    fontSize: 15,
    fontWeight: '900',
    color: '#E6F4EA',
  },
  scaleBtnTextActive: {
    color: '#143F23',
  },
  rightActionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  audioSpeakingPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#DC2626',
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 12,
    gap: 4,
  },
  audioPillHighContrast: {
    backgroundColor: '#FF0000',
    borderWidth: 1,
    borderColor: '#FFFFFF',
  },
  audioSpeakingText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  contrastToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
    gap: 4,
  },
  contrastToggleActive: {
    backgroundColor: '#FFE500',
  },
  contrastToggleText: {
    fontSize: 11,
    color: '#E6F4EA',
    fontWeight: '600',
  },
  contrastToggleTextActive: {
    color: '#000000',
    fontWeight: '800',
  },
});
