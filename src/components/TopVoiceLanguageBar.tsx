import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppContext } from '../store/app-context';
import { speechService } from '../services/speech.service';

export interface TopVoiceLanguageBarProps {
  title?: string;
  voiceText?: string;
  variant?: 'light' | 'dark' | 'transparent';
  showVoice?: boolean;
  showLang?: boolean;
  showScale?: boolean;
}

export const TopVoiceLanguageBar: React.FC<TopVoiceLanguageBarProps> = ({
  title,
  voiceText,
  variant = 'light',
  showVoice = true,
  showLang = true,
  showScale = true,
}) => {
  const { state, setLanguage, setTextScale } = useAppContext();
  const currentLang = (state.language || 'hi') as 'hi' | 'or' | 'en';
  const currentScale = state.textScale || 1.0;
  const isHi = currentLang === 'hi';
  const isOr = currentLang === 'or';
  const isEn = currentLang === 'en';

  const barId = `top-bar-${title ? title.toLowerCase().replace(/\s+/g, '-') : 'global'}`;
  const [isSpeaking, setIsSpeaking] = useState(speechService.getActiveId() === barId);

  useEffect(() => {
    const unsubscribe = speechService.addListener((_speaking, activeId) => {
      setIsSpeaking(activeId === barId);
    });
    return unsubscribe;
  }, [barId]);

  const getSpeechContent = (): string => {
    if (voiceText && voiceText.trim().length > 0) {
      return voiceText;
    }

    if (title) {
      if (isOr) {
        return `କିଷାନ ମିତ୍ର: ${title} ପୃଷ୍ଠା। ଆପଣ ଏଠାରେ ସମ୍ପୂର୍ଣ୍ଣ ବିବରଣୀ ଦେଖିପାରିବେ ଏବଂ ପରିଚାଳନା କରିପାରିବେ।`;
      }
      if (isHi) {
        return `किसान मित्र: ${title} पृष्ठ। यहाँ आप सभी विवरण देख सकते हैं और सेवाओं का लाभ उठा सकते हैं।`;
      }
      return `Kisan Mitra: ${title} screen. You can view all information and manage procurement services here.`;
    }

    if (isOr) {
      return 'କିଷାନ ମିତ୍ର - ସ୍ୱଚ୍ଛ ସରକାରୀ କୃଷି ମଣ୍ଡି ଏବଂ DBT ସହାୟତା ଆପ୍।';
    }
    if (isHi) {
      return 'किसान मित्र - पारदर्शी सरकारी कृषि मंडी खरीद एवं डीबीटी भुगतान सहायक ऐप।';
    }
    return 'Kisan Mitra - Transparent Government APMC Mandi Procurement & DBT Assistance.';
  };

  const handleToggleVoice = async () => {
    if (isSpeaking) {
      await speechService.stop();
    } else {
      const text = getSpeechContent();
      await speechService.speak(barId, text, currentLang);
    }
  };

  const isDark = variant === 'dark';
  const isTrans = variant === 'transparent';

  const containerBg = isDark ? '#143F23' : isTrans ? 'transparent' : '#FFFFFF';
  const borderBottomColor = isDark ? '#1F5A34' : isTrans ? 'transparent' : '#E6EAE5';
  const textColor = isDark ? '#FFFFFF' : '#1A202C';

  return (
    <View style={[styles.container, { backgroundColor: containerBg, borderBottomColor }]}>
      {/* Left side: Brand or Screen Indicator */}
      <View style={styles.leftRow}>
        <Text style={styles.brandEmoji}>🌾</Text>
        <Text style={[styles.brandText, { color: textColor }]} numberOfLines={1}>
          {title || (isOr ? 'କିଷାନ ମିତ୍ର' : isHi ? 'किसान मित्र' : 'Kisan Mitra')}
        </Text>
      </View>

      {/* Right side: Font Scaling, Language Switcher & Small Speaker Voice Assistant */}
      <View style={styles.rightRow}>
        {/* Font Scaling Pill (A, A+, A++) */}
        {showScale && (
          <View style={[styles.scalePill, isDark && styles.scalePillDark]}>
            <TouchableOpacity
              style={[styles.scaleBtn, currentScale === 1.0 && styles.scaleBtnActive]}
              onPress={() => setTextScale(1.0)}
              activeOpacity={0.75}
              accessibilityRole="button"
              accessibilityLabel="Normal text size (A)"
            >
              <Text style={[styles.scaleText, currentScale === 1.0 && styles.scaleTextActive]}>
                A
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.scaleBtn, currentScale === 1.15 && styles.scaleBtnActive]}
              onPress={() => setTextScale(1.15)}
              activeOpacity={0.75}
              accessibilityRole="button"
              accessibilityLabel="Large text size (A+)"
            >
              <Text style={[styles.scaleText, currentScale === 1.15 && styles.scaleTextActive]}>
                A+
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.scaleBtn, currentScale === 1.3 && styles.scaleBtnActive]}
              onPress={() => setTextScale(1.3)}
              activeOpacity={0.75}
              accessibilityRole="button"
              accessibilityLabel="Extra large text size (A++)"
            >
              <Text style={[styles.scaleText, currentScale === 1.3 && styles.scaleTextActive]}>
                A++
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Language Switcher Pill (Hindi / Odia / English) */}
        {showLang && (
          <View style={[styles.langPill, isDark && styles.langPillDark]}>
            <TouchableOpacity
              style={[styles.langBtn, isHi && styles.langBtnActive]}
              onPress={() => setLanguage('hi')}
              activeOpacity={0.75}
              accessibilityRole="button"
              accessibilityLabel="हिंदी भाषा चुनें"
            >
              <Text style={[styles.langText, isHi && styles.langTextActive]}>
                हिंदी
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.langBtn, isOr && styles.langBtnActive]}
              onPress={() => setLanguage('or')}
              activeOpacity={0.75}
              accessibilityRole="button"
              accessibilityLabel="ଓଡ଼ିଆ ଭାଷା ବାଛନ୍ତୁ"
            >
              <Text style={[styles.langText, isOr && styles.langTextActive]}>
                ଓଡ଼ିଆ
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.langBtn, isEn && styles.langBtnActive]}
              onPress={() => setLanguage('en')}
              activeOpacity={0.75}
              accessibilityRole="button"
              accessibilityLabel="Select English language"
            >
              <Text style={[styles.langText, isEn && styles.langTextActive]}>
                EN
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Small Speaker Voice Assistance Button */}
        {showVoice && (
          <TouchableOpacity
            style={[
              styles.speakerBtn,
              isSpeaking && styles.speakerBtnSpeaking,
              isDark && !isSpeaking && styles.speakerBtnDark,
            ]}
            onPress={handleToggleVoice}
            activeOpacity={0.75}
            accessibilityRole="button"
            accessibilityLabel={
              isSpeaking
                ? (isOr ? 'ଧ୍ୱନି ବନ୍ଦ କରନ୍ତୁ' : isHi ? 'आवाज़ बंद करें' : 'Stop voice readout')
                : (isOr ? 'ଏହି ପୃଷ୍ଠା ବିଷୟରେ ଶୁଣନ୍ତୁ' : isHi ? 'इस पृष्ठ का विवरण सुनें' : 'Listen to page summary')
            }
          >
            <Ionicons
              name={isSpeaking ? 'stop' : 'volume-high'}
              size={15}
              color={isSpeaking ? '#FFFFFF' : isDark ? '#6EE7B7' : '#15803D'}
            />
            {isSpeaking && <View style={styles.pulseIndicator} />}
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderBottomWidth: 1,
    zIndex: 99,
  },
  leftRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 8,
  },
  brandEmoji: {
    fontSize: 14,
    marginRight: 5,
  },
  brandText: {
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: -0.2,
  },
  rightRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  scalePill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    borderRadius: 20,
    padding: 2,
    borderWidth: 1,
    borderColor: '#CBD5E1',
  },
  scalePillDark: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderColor: 'rgba(255, 255, 255, 0.25)',
  },
  scaleBtn: {
    paddingVertical: 3,
    paddingHorizontal: 6,
    borderRadius: 14,
  },
  scaleBtnActive: {
    backgroundColor: '#15803D',
  },
  scaleText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#475569',
  },
  scaleTextActive: {
    color: '#FFFFFF',
    fontWeight: '800',
  },
  langPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    borderRadius: 20,
    padding: 2,
    borderWidth: 1,
    borderColor: '#CBD5E1',
  },
  langPillDark: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderColor: 'rgba(255, 255, 255, 0.25)',
  },
  langBtn: {
    paddingVertical: 3,
    paddingHorizontal: 7,
    borderRadius: 14,
  },
  langBtnActive: {
    backgroundColor: '#15803D',
  },
  langText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#475569',
  },
  langTextActive: {
    color: '#FFFFFF',
    fontWeight: '800',
  },
  speakerBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#DCFCE7',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#86EFAC',
    position: 'relative',
  },
  speakerBtnDark: {
    backgroundColor: 'rgba(255, 255, 255, 0.18)',
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  speakerBtnSpeaking: {
    backgroundColor: '#DC2626',
    borderColor: '#EF4444',
  },
  pulseIndicator: {
    position: 'absolute',
    top: -2,
    right: -2,
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: '#EF4444',
    borderWidth: 1,
    borderColor: '#FFFFFF',
  },
});
