import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppContext } from '../../store/app-context';

export type WeatherAlertType = 'unseasonal_rain' | 'frost' | 'heatwave';

interface WeatherAlertData {
  id: WeatherAlertType;
  tabLabelEn: string;
  tabLabelHi: string;
  badgeEn: string;
  badgeHi: string;
  titleEn: string;
  titleHi: string;
  metricsEn: string;
  metricsHi: string;
  advisoryEn: string;
  advisoryHi: string;
  bgTint: string;
  borderColor: string;
  badgeBg: string;
  badgeColor: string;
  icon: keyof typeof Ionicons.glyphMap;
  iconColor: string;
}

export const WEATHER_ALERTS: Record<WeatherAlertType, WeatherAlertData> = {
  unseasonal_rain: {
    id: 'unseasonal_rain',
    tabLabelEn: '🌧️ Rain Alert',
    tabLabelHi: '🌧️ बारिश चेतावनी',
    badgeEn: 'HIGH RISK: 24-48 HRS',
    badgeHi: 'उच्च जोखिम: 24-48 घंटे',
    titleEn: '⚠️ Unseasonal Rain & Gusty Winds Forecast',
    titleHi: '⚠️ बेमौसम बारिश और तेज हवाओं की चेतावनी',
    metricsEn: 'Rain Prob: 75% (Next 24-48h) • Wind: 26 km/h • Hail Risk: Moderate',
    metricsHi: 'बारिश संभावना: 75% (24-48 घंटे) • हवा: 26 किमी/घं • ओलावृष्टि जोखिम: मध्यम',
    advisoryEn: 'Cover harvested grain at mandis and open yards immediately. Suspend all pesticide spraying and field irrigation.',
    advisoryHi: 'मंडी व खलिहान में खुले अनाज को तुरंत तिरपाल से ढकें। सिंचाई और कीटनाशक छिड़काव अगले 48 घंटे स्थगित रखें।',
    bgTint: '#FEF3C7',
    borderColor: '#F59E0B',
    badgeBg: '#FDE68A',
    badgeColor: '#B45309',
    icon: 'rainy',
    iconColor: '#D97706',
  },
  frost: {
    id: 'frost',
    tabLabelEn: '❄️ Frost Alert',
    tabLabelHi: '❄️ पाला चेतावनी',
    badgeEn: 'COLD WAVE: NIGHT HAZARD',
    badgeHi: 'शीत लहर: रात्रि जोखिम',
    titleEn: '❄️ Ground Frost & Severe Cold Wave Warning',
    titleHi: '❄️ पाला (तुषार) एवं तीव्र शीत लहर चेतावनी',
    metricsEn: 'Min Temp: 2.5°C • Wind: 8 km/h • Frost Probability: 80%',
    metricsHi: 'न्यूनतम तापमान: 2.5°C • हवा: 8 किमी/घं • पाला संभावना: 80%',
    advisoryEn: 'Apply light evening irrigation to maintain soil temperature. Create smoke blankets around sensitive vegetable & mustard crops.',
    advisoryHi: 'जमीन का तापमान बनाए रखने हेतु शाम को हल्की सिंचाई करें। पाले से बचाव हेतु मेड़ों पर धुआं करें।',
    bgTint: '#E0F2FE',
    borderColor: '#0284C7',
    badgeBg: '#BAE6FD',
    badgeColor: '#0369A1',
    icon: 'snow',
    iconColor: '#0284C7',
  },
  heatwave: {
    id: 'heatwave',
    tabLabelEn: '🔥 Heatwave Alert',
    tabLabelHi: '🔥 लू चेतावनी',
    badgeEn: 'EXTREME HEAT WARNING',
    badgeHi: 'भीषण गर्मी / लू अलर्ट',
    titleEn: '🔥 Severe Heatwave & Desiccating Winds',
    titleHi: '🔥 तीव्र लू और गर्म शुष्क हवाओं की चेतावनी',
    metricsEn: 'Max Temp: 44.0°C • Humidity: 18% • Direct Sun Exposure: Dangerous',
    metricsHi: 'अधिकतम तापमान: 44.0°C • आर्द्रता: 18% • तेज धूप: अत्यंत हानिकारक',
    advisoryEn: 'Conduct harvesting and mandi transport only before 10 AM or after 5 PM. Provide frequent water and shade to livestock.',
    advisoryHi: 'कटाई और मंडी परिवहन केवल सुबह 10 बजे से पहले या शाम 5 बजे बाद करें। पशुओं को छाया और पर्याप्त जल दें।',
    bgTint: '#FFEDD5',
    borderColor: '#EA580C',
    badgeBg: '#FED7AA',
    badgeColor: '#C2410C',
    icon: 'flame',
    iconColor: '#EA580C',
  },
};

interface WeatherAlertBannerProps {
  style?: any;
  defaultType?: WeatherAlertType;
  onDismiss?: () => void;
}

export const WeatherAlertBanner: React.FC<WeatherAlertBannerProps> = ({
  style,
  defaultType = 'unseasonal_rain',
  onDismiss,
}) => {
  const { state } = useAppContext();
  const isHi = state.language === 'hi';
  const [selectedAlert, setSelectedAlert] = useState<WeatherAlertType>(defaultType);
  const [isDismissed, setIsDismissed] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  if (isDismissed) return null;

  const current = WEATHER_ALERTS[selectedAlert];

  return (
    <View style={[styles.wrapper, { backgroundColor: current.bgTint, borderColor: current.borderColor }, style]}>
      {/* Top Header: Badge + Tabs + Close Button */}
      <View style={styles.topRow}>
        <View style={[styles.badge, { backgroundColor: current.badgeBg }]}>
          <Text style={[styles.badgeText, { color: current.badgeColor }]}>
            {isHi ? current.badgeHi : current.badgeEn}
          </Text>
        </View>

        <TouchableOpacity
          onPress={() => {
            setIsDismissed(true);
            onDismiss?.();
          }}
          hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
          style={styles.closeBtn}
        >
          <Ionicons name="close" size={16} color="#64748B" />
        </TouchableOpacity>
      </View>

      {/* Main Title & Icon */}
      <View style={styles.titleRow}>
        <Ionicons name={current.icon} size={22} color={current.iconColor} style={{ marginRight: 8 }} />
        <Text style={styles.titleText}>{isHi ? current.titleHi : current.titleEn}</Text>
      </View>

      {/* 24-48 Hours Rain / Metric Specs */}
      <View style={styles.metricsBox}>
        <Ionicons name="speedometer-outline" size={14} color="#475569" style={{ marginRight: 4 }} />
        <Text style={styles.metricsText}>{isHi ? current.metricsHi : current.metricsEn}</Text>
      </View>

      {/* Actionable Agro-met Advisory Message */}
      <View style={styles.advisoryRow}>
        <Text style={styles.advisoryBold}>{isHi ? 'कृषि सलाह: ' : 'Action Advisory: '}</Text>
        <Text style={styles.advisoryBody}>
          {isHi ? current.advisoryHi : current.advisoryEn}
        </Text>
      </View>

      {/* Interactive Selector Pill Tabs: Unseasonal Rain / Frost / Heatwave */}
      <View style={styles.tabsRow}>
        {(['unseasonal_rain', 'frost', 'heatwave'] as WeatherAlertType[]).map((type) => {
          const item = WEATHER_ALERTS[type];
          const active = selectedAlert === type;
          return (
            <TouchableOpacity
              key={type}
              style={[
                styles.tabBtn,
                active && { backgroundColor: item.borderColor, borderColor: item.borderColor },
              ]}
              onPress={() => setSelectedAlert(type)}
              activeOpacity={0.8}
            >
              <Text style={[styles.tabBtnText, active && styles.tabBtnTextActive]}>
                {isHi ? item.tabLabelHi : item.tabLabelEn}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    borderRadius: 14,
    borderWidth: 1.5,
    padding: 12,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 5,
    elevation: 3,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  closeBtn: {
    padding: 4,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  titleText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
    flex: 1,
  },
  metricsBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.75)',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 6,
    marginBottom: 6,
  },
  metricsText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#334155',
  },
  advisoryRow: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 8,
    padding: 8,
    marginBottom: 10,
  },
  advisoryBold: {
    fontSize: 11,
    fontWeight: '900',
    color: '#0F172A',
    marginBottom: 2,
  },
  advisoryBody: {
    fontSize: 11,
    color: '#334155',
    lineHeight: 16,
  },
  tabsRow: {
    flexDirection: 'row',
    gap: 6,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0, 0, 0, 0.06)',
    paddingTop: 8,
  },
  tabBtn: {
    flex: 1,
    paddingVertical: 5,
    borderRadius: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabBtnText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#475569',
  },
  tabBtnTextActive: {
    color: '#FFFFFF',
    fontWeight: '900',
  },
});
