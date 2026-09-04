import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { MOCK_TRANSACTIONS, MOCK_CENTRES } from '../../../src/services/mock-data.service';
import { useAppContext } from '../../../src/store/app-context';
import { WeatherAlertBanner } from '../../../src/components/common';

// Translation dictionary for Simple Hindi and English
const TRANSLATIONS = {
  hi: {
    brand: 'किसान मित्र',
    liveConnected: 'ऑनलाइन चालू',
    tokenHeader: (num: number | string) => `आपका सक्रिय टोकन #${num}`,
    booked: 'बुक्ड',
    ahead: '3 किसान आगे',
    estWait: 'अनुमानित समय',
    waitMins: '~25 मिनट',
    arriveBy: 'पहुंचने का समय',
    arriveTime: 'सुबह 10:15',
    cropLabel: 'फसल: ',
    mandiLabel: 'मंडी: ',
    slotLabel: 'समय: ',
    quintal: 'क्विंटल',
    trackStatus: 'लाइव स्थिति देखें',
    farmerId: (id: string) => `किसान आईडी: ${id}`,
    defaultLocation: 'ग्राम पंचायत, भोपाल, मध्य प्रदेश',
    landHolding: 'जमीन (भूमि)',
    acres: 'एकड़',
    primaryCrop: 'मुख्य फसल',
    cropDefault: 'गेहूं (Wheat)',
    aadhaar: 'आधार कार्ड',
    verified: 'सत्यापित ✓',
    dbtBank: 'डीबीटी बैंक',
    bankDefault: 'भारतीय स्टेट बैंक, 5678',
    viewProfile: 'विस्तृत प्रोफ़ाइल और जमीन रिकॉर्ड देखें →',
    envSection: 'ताज़ा जानकारी और मौसम',
    marketPrice: 'मंडी भाव',
    marketCropLocation: '(धान, भोपाल)',
    currentPriceUp: 'ताज़ा भाव ↑',
    weatherTitle: 'मौसम का हाल',
    bhopal: '(भोपाल)',
    quickActions: 'त्वरित सेवाएं',
    seedData: 'डेटा सिंक करें',
    bookVisit: 'नया टोकन बुक',
    trackQueue: 'कतार देखें',
    procurement: 'खरीद प्रक्रिया',
    payment: 'भुगतान स्थिति',
    mandis: 'मंडी केंद्र',
    support: 'किसान सहायता',
    dataSynced: 'डेटा सफलतापूर्वक सिंक हो गया!',
    syncError: 'सिंक में त्रुटि हुई',
    unitBelowPrice: '/प्रति क्विंटल (100 किग्रा)',
    mandiPrefix: 'मंडी:',
    mspPrefix: 'MSP:',
    weatherCondition: 'धूप और हल्के बादल',
    humidity: 'नमी',
    rain: 'बारिश',
    agrometTitle: 'कृषि-मौसम सलाह',
    agrometRainProb: 'बारिश: 75% (24-48 घंटे)',
    agrometWind: 'हवा: 26 किमी/घं',
    agrometAdvisory: 'कटी फसल तुरंत शेड में रखें; कीटनाशक छिड़काव स्थगित रखें।',
    humidityText: 'नमी: 65%',
  },
  en: {
    brand: 'Kisan Mitra',
    liveConnected: 'Live Connected',
    tokenHeader: (num: number | string) => `YOUR ACTIVE TOKEN #${num}`,
    booked: 'BOOKED',
    ahead: '3 AHEAD',
    estWait: 'EST. WAIT',
    waitMins: '~25 MINS',
    arriveBy: 'ARRIVE BY',
    arriveTime: '10:15 AM',
    cropLabel: 'CROP: ',
    mandiLabel: 'MANDI: ',
    slotLabel: 'SLOT: ',
    quintal: 'Qu',
    trackStatus: 'Track Live Status',
    farmerId: (id: string) => `Farmer ID: ${id}`,
    defaultLocation: 'Gram Panchayat, Madhya, Bhopal',
    landHolding: 'Land Holding',
    acres: 'Acres',
    primaryCrop: 'Primary Crop',
    cropDefault: 'Wheat',
    aadhaar: 'Aadhaar',
    verified: 'Verified',
    dbtBank: 'DBT Bank',
    bankDefault: 'State Bank of India, 5678',
    viewProfile: 'View Detailed Profile & Land Records →',
    envSection: 'New Added & Environment',
    marketPrice: 'Market Price',
    marketCropLocation: '(Paddy, Bhopal)',
    currentPriceUp: 'Current Price ↑',
    weatherTitle: 'Agro-met Advisory',
    bhopal: '(Bhopal)',
    quickActions: 'Quick Actions',
    seedData: 'Seed Firestore Data',
    bookVisit: 'Book Visit',
    trackQueue: 'Track Queue',
    procurement: 'Procurement',
    payment: 'Payment',
    mandis: 'Mandis',
    support: 'Support',
    dataSynced: 'Data synced successfully!',
    syncError: 'Sync error',
    unitBelowPrice: '/quintal (100 kg)',
    mandiPrefix: 'mandi:',
    mspPrefix: 'MSP:',
    weatherCondition: 'Partly Sunny',
    humidity: 'Humidity',
    rain: 'Rain',
    agrometTitle: 'Agro-met Advisory',
    agrometRainProb: 'Rain: 75% (24-48h)',
    agrometWind: 'Wind: 26 km/h',
    agrometAdvisory: 'Cover harvested grains immediately; postpone pesticide spraying.',
    humidityText: 'Humidity: 65%',
  },
};

interface CropPriceInfo {
  nameEn: string;
  nameHi: string;
  priceDisplay: string;
  mspDisplay: string;
  trendTextEn: string;
  trendTextHi: string;
}

const CROP_PRICE_MAP: Record<string, CropPriceInfo> = {
  wheat: {
    nameEn: 'Wheat',
    nameHi: 'गेहूं',
    priceDisplay: '₹2,450',
    mspDisplay: '₹2,275',
    trendTextEn: 'Current Price ↑ (MSP ₹2,275)',
    trendTextHi: 'ताज़ा भाव ↑ (MSP ₹2,275)',
  },
  गेहूं: {
    nameEn: 'Wheat',
    nameHi: 'गेहूं',
    priceDisplay: '₹2,450',
    mspDisplay: '₹2,275',
    trendTextEn: 'Current Price ↑ (MSP ₹2,275)',
    trendTextHi: 'ताज़ा भाव ↑ (MSP ₹2,275)',
  },
  paddy: {
    nameEn: 'Paddy',
    nameHi: 'धान',
    priceDisplay: '₹2,900',
    mspDisplay: '₹2,320',
    trendTextEn: 'Current Price ↑ (MSP ₹2,320)',
    trendTextHi: 'ताज़ा भाव ↑ (MSP ₹2,320)',
  },
  धान: {
    nameEn: 'Paddy',
    nameHi: 'धान',
    priceDisplay: '₹2,900',
    mspDisplay: '₹2,320',
    trendTextEn: 'Current Price ↑ (MSP ₹2,320)',
    trendTextHi: 'ताज़ा भाव ↑ (MSP ₹2,320)',
  },
  rice: {
    nameEn: 'Paddy (Rice)',
    nameHi: 'धान (चावल)',
    priceDisplay: '₹2,900',
    mspDisplay: '₹2,320',
    trendTextEn: 'Current Price ↑ (MSP ₹2,320)',
    trendTextHi: 'ताज़ा भाव ↑ (MSP ₹2,320)',
  },
  soybean: {
    nameEn: 'Soybean',
    nameHi: 'सोयाबीन',
    priceDisplay: '₹4,892',
    mspDisplay: '₹4,892',
    trendTextEn: 'Current Price ↑ (MSP ₹4,892)',
    trendTextHi: 'ताज़ा भाव ↑ (MSP ₹4,892)',
  },
  सोयाबीन: {
    nameEn: 'Soybean',
    nameHi: 'सोयाबीन',
    priceDisplay: '₹4,892',
    mspDisplay: '₹4,892',
    trendTextEn: 'Current Price ↑ (MSP ₹4,892)',
    trendTextHi: 'ताज़ा भाव ↑ (MSP ₹4,892)',
  },
  mustard: {
    nameEn: 'Mustard',
    nameHi: 'सरसों',
    priceDisplay: '₹5,650',
    mspDisplay: '₹5,650',
    trendTextEn: 'Current Price ↑ (MSP ₹5,650)',
    trendTextHi: 'ताज़ा भाव ↑ (MSP ₹5,650)',
  },
  सरसों: {
    nameEn: 'Mustard',
    nameHi: 'सरसों',
    priceDisplay: '₹5,650',
    mspDisplay: '₹5,650',
    trendTextEn: 'Current Price ↑ (MSP ₹5,650)',
    trendTextHi: 'ताज़ा भाव ↑ (MSP ₹5,650)',
  },
  maize: {
    nameEn: 'Maize',
    nameHi: 'मक्का',
    priceDisplay: '₹2,090',
    mspDisplay: '₹2,090',
    trendTextEn: 'Current Price ↑ (MSP ₹2,090)',
    trendTextHi: 'ताज़ा भाव ↑ (MSP ₹2,090)',
  },
  मक्का: {
    nameEn: 'Maize',
    nameHi: 'मक्का',
    priceDisplay: '₹2,090',
    mspDisplay: '₹2,090',
    trendTextEn: 'Current Price ↑ (MSP ₹2,090)',
    trendTextHi: 'ताज़ा भाव ↑ (MSP ₹2,090)',
  },
  cotton: {
    nameEn: 'Cotton',
    nameHi: 'कपास',
    priceDisplay: '₹7,121',
    mspDisplay: '₹7,121',
    trendTextEn: 'Current Price ↑ (MSP ₹7,121)',
    trendTextHi: 'ताज़ा भाव ↑ (MSP ₹7,121)',
  },
  कपास: {
    nameEn: 'Cotton',
    nameHi: 'कपास',
    priceDisplay: '₹7,121',
    mspDisplay: '₹7,121',
    trendTextEn: 'Current Price ↑ (MSP ₹7,121)',
    trendTextHi: 'ताज़ा भाव ↑ (MSP ₹7,121)',
  },
  gram: {
    nameEn: 'Gram (Chana)',
    nameHi: 'चना',
    priceDisplay: '₹5,440',
    mspDisplay: '₹5,440',
    trendTextEn: 'Current Price ↑ (MSP ₹5,440)',
    trendTextHi: 'ताज़ा भाव ↑ (MSP ₹5,440)',
  },
  chana: {
    nameEn: 'Gram (Chana)',
    nameHi: 'चना',
    priceDisplay: '₹5,440',
    mspDisplay: '₹5,440',
    trendTextEn: 'Current Price ↑ (MSP ₹5,440)',
    trendTextHi: 'ताज़ा भाव ↑ (MSP ₹5,440)',
  },
  चना: {
    nameEn: 'Gram (Chana)',
    nameHi: 'चना',
    priceDisplay: '₹5,440',
    mspDisplay: '₹5,440',
    trendTextEn: 'Current Price ↑ (MSP ₹5,440)',
    trendTextHi: 'ताज़ा भाव ↑ (MSP ₹5,440)',
  },
};

function getCropPriceInfo(rawCrop?: string): CropPriceInfo {
  if (!rawCrop) {
    return CROP_PRICE_MAP.wheat;
  }
  const clean = rawCrop.toLowerCase();
  for (const key of Object.keys(CROP_PRICE_MAP)) {
    if (clean.includes(key)) {
      return CROP_PRICE_MAP[key];
    }
  }
  const name = rawCrop.split('(')[0].trim();
  return {
    nameEn: name || 'Wheat',
    nameHi: name || 'गेहूं',
    priceDisplay: '₹2,450',
    mspDisplay: '₹2,275',
    trendTextEn: 'Current Price ↑',
    trendTextHi: 'ताज़ा भाव ↑',
  };
}

export default function FarmerDashboard() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { state, setLanguage, seedFirebaseDatabase } = useAppContext();
  const currentFarmer = state.currentFarmer;

  const currentLang = state.language || 'hi';
  const isHi = currentLang === 'hi';
  const t = TRANSLATIONS[currentLang];

  const [isSeeding, setIsSeeding] = useState(false);
  const [seedMessage, setSeedMessage] = useState<string | null>(null);

  // Active transaction and centre
  const activeTx = state.transactions?.find((t) => t.farmerId === currentFarmer?.id) || MOCK_TRANSACTIONS[0];
  const activeMandi = state.centres?.[0] || MOCK_CENTRES[0];

  // Seed handler for quick action link
  const handleSeed = async () => {
    if (isSeeding) return;
    setIsSeeding(true);
    setSeedMessage(null);
    try {
      const res = await seedFirebaseDatabase(true);
      setSeedMessage(res.message || t.dataSynced);
      setTimeout(() => setSeedMessage(null), 3500);
    } catch (e: any) {
      setSeedMessage(e?.message || t.syncError);
      setTimeout(() => setSeedMessage(null), 3500);
    } finally {
      setIsSeeding(false);
    }
  };

  // Farmer dynamic values with fallback matching reference screenshot
  const farmerName = currentFarmer?.name || (isHi ? 'किसान 7888' : 'Farmer 7888');
  const farmerId = currentFarmer?.id || 'F-523';
  const farmerPhone = currentFarmer?.phone
    ? currentFarmer.phone.startsWith('+')
      ? currentFarmer.phone
      : `+91 ${currentFarmer.phone}`
    : '+11234567888';
  const farmerLocation = currentFarmer?.village
    ? `${currentFarmer.village}, ${currentFarmer.district || 'Bhopal'}, ${currentFarmer.state || 'MP'}`
    : t.defaultLocation;
  const landArea = currentFarmer?.landArea || currentFarmer?.landAreaHectares || '4.5';
  
  // Crop name display & dynamic alignment with Market Price
  const rawFarmerCrop = currentFarmer?.primaryCrop || 'Wheat';
  const cropPriceInfo = getCropPriceInfo(rawFarmerCrop);

  const primaryCrop = currentFarmer?.primaryCrop
    ? isHi && currentFarmer.primaryCrop.toLowerCase().includes('wheat')
      ? 'गेहूं (Wheat)'
      : isHi && currentFarmer.primaryCrop.toLowerCase().includes('paddy')
      ? 'धान (Paddy)'
      : isHi
      ? cropPriceInfo.nameHi
      : cropPriceInfo.nameEn
    : t.cropDefault;

  // Mandi district/city location
  const mandiLocationRaw = currentFarmer?.district || activeMandi?.district || 'Bhopal';
  const mandiLocation = isHi && (mandiLocationRaw.toLowerCase() === 'bhopal' || mandiLocationRaw.toLowerCase() === 'mp')
    ? 'भोपाल'
    : isHi && mandiLocationRaw.toLowerCase() === 'sehore'
    ? 'सीहोर'
    : mandiLocationRaw;

  // Market price card data derived directly from farmer's primary crop
  const cropMarketSubtitle = isHi
    ? `(${cropPriceInfo.nameHi}, ${mandiLocation})`
    : `(${cropPriceInfo.nameEn}, ${mandiLocation})`;
  const cropMarketPrice = cropPriceInfo.priceDisplay;
  const cropMarketTrend = isHi ? cropPriceInfo.trendTextHi : cropPriceInfo.trendTextEn;

  const bankAccount = currentFarmer?.bankAccount
    ? currentFarmer.bankAccount.slice(-4)
    : currentFarmer?.bankDetails?.accountNumber
    ? currentFarmer.bankDetails.accountNumber.slice(-4)
    : '5678';
  const rawBankName = currentFarmer?.bankName || currentFarmer?.bankDetails?.bankName || 'State Bank of India';
  const bankName = isHi && (rawBankName.includes('State Bank') || rawBankName.includes('SBI'))
    ? 'भारतीय स्टेट बैंक'
    : rawBankName;

  // Active token details
  const tokenNumber = activeTx?.tokenNumber || 42;
  const tokenCrop = activeTx?.crop
    ? isHi && activeTx.crop.toLowerCase().includes('paddy')
      ? 'धान'
      : isHi && activeTx.crop.toLowerCase().includes('wheat')
      ? 'गेहूं'
      : isHi
      ? cropPriceInfo.nameHi
      : activeTx.crop
    : isHi
    ? cropPriceInfo.nameHi
    : cropPriceInfo.nameEn;
  const tokenQuantity = activeTx?.expectedQuantity || 20;
  const tokenMandi = activeTx?.centreName
    ? (isHi ? 'डेमो कृषि उपज मंडी, भोपाल' : activeTx.centreName)
    : (isHi ? 'डेमो कृषि उपज मंडी, भोपाल' : 'Demo Krishi Upaj Mandi, Bhopal');
  const tokenSlot = isHi ? 'सुबह (8:00 - 12:00)' : (activeTx?.slotLabel || 'Morning (8:00 - 12:00)');

  return (
    <View style={styles.screenWrapper}>
      <StatusBar barStyle="light-content" backgroundColor="#143F23" />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 24 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* TOP FOREST GREEN BANNER AREA */}
        <View style={[styles.forestGreenHeader, { paddingTop: Math.max(insets.top, 16) + 8 }]}>
          {/* Subtle decorative leaf watermarks in header corner */}
          <Ionicons
            name="leaf"
            size={110}
            color="#FFFFFF"
            style={styles.leafDecor1}
          />
          <Ionicons
            name="leaf"
            size={70}
            color="#FFFFFF"
            style={styles.leafDecor2}
          />

          {/* Top Row: Kisan Mitra Title + Language Pill Toggle (Hindi / English) */}
          <View style={styles.headerTopRow}>
            <View style={styles.brandRow}>
              <Text style={styles.wheatIcon}>🌾</Text>
              <Text style={styles.brandTitle}>{t.brand}</Text>
            </View>

            {/* Language Switcher Pill: Hindi or English */}
            <View style={styles.langPill}>
              <TouchableOpacity
                style={[styles.langOption, isHi && styles.langOptionActive]}
                onPress={() => setLanguage('hi')}
                activeOpacity={0.8}
              >
                <Text style={[styles.langText, isHi && styles.langTextActive]}>
                  हिंदी
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.langOption, !isHi && styles.langOptionActive]}
                onPress={() => setLanguage('en')}
                activeOpacity={0.8}
              >
                <Text style={[styles.langText, !isHi && styles.langTextActive]}>
                  English
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Live Connected Status Pill */}
          <View style={styles.liveStatusPill}>
            <Ionicons name="pulse" size={14} color="#6EE7B7" />
            <Text style={styles.liveStatusText}>{t.liveConnected}</Text>
          </View>

          {/* ACTIVE TOKEN CARD (MATCHING REFERENCE UI) */}
          <View style={styles.activeTokenCard}>
            {/* Top Ribbon Row */}
            <View style={styles.tokenRibbonRow}>
              <View style={styles.goldRibbon}>
                <Ionicons name="ribbon-outline" size={20} color="#382506" />
                <Text style={styles.goldRibbonText}>
                  {t.tokenHeader(tokenNumber)}
                </Text>
              </View>

              <View style={styles.bookedBadge}>
                <Text style={styles.bookedBadgeText}>{t.booked}</Text>
              </View>
            </View>

            {/* Queue Metrics 3-Box Flow */}
            <View style={styles.queueStatsContainer}>
              {/* Box 1: Ahead */}
              <View style={styles.queueMetricBox}>
                <View style={styles.metricLabelRow}>
                  <Ionicons name="people" size={14} color="#184D2B" />
                  <Text style={styles.metricTitle}>{t.ahead}</Text>
                </View>
                <View style={styles.aheadBarTrack}>
                  <View style={styles.aheadBarFill} />
                </View>
              </View>

              <Text style={styles.queueDottedDivider}>····</Text>

              {/* Box 2: Estimated Wait */}
              <View style={styles.queueMetricBox}>
                <View style={styles.metricLabelRow}>
                  <Ionicons name="time-outline" size={15} color="#184D2B" />
                  <Text style={styles.metricTitle}>{t.estWait}</Text>
                </View>
                <Text style={styles.metricBigValue}>{t.waitMins}</Text>
              </View>

              <Text style={styles.queueDottedDivider}>····</Text>

              {/* Box 3: Arrive By */}
              <View style={styles.queueMetricBox}>
                <View style={styles.metricLabelRow}>
                  <Ionicons name="location-outline" size={15} color="#184D2B" />
                  <Text style={styles.metricTitle}>{t.arriveBy}</Text>
                </View>
                <Text style={styles.metricBigValue}>{t.arriveTime}</Text>
              </View>
            </View>

            {/* Crop, Mandi & Slot Detail Strip */}
            <View style={styles.tokenMetaStrip}>
              <Text style={styles.tokenMetaText}>
                <Text style={styles.tokenMetaBold}>{t.cropLabel}</Text>
                {tokenCrop} ({tokenQuantity} {t.quintal}) |{' '}
                <Text style={styles.tokenMetaBold}>{t.mandiLabel}</Text>
                {tokenMandi}{' '}
                <Text>🗓️ </Text>
                <Text style={styles.tokenMetaBold}>{t.slotLabel}</Text>
                {tokenSlot}
              </Text>
            </View>

            {/* CTA: Track Live Status */}
            <TouchableOpacity
              style={styles.trackStatusBtn}
              onPress={() => router.push(`/(farmer)/queue/${activeTx?.id || 'tx-001'}` as any)}
              activeOpacity={0.85}
            >
              <Text style={styles.trackStatusBtnText}>{t.trackStatus}</Text>
              <Ionicons name="arrow-forward" size={16} color="#FFFFFF" style={{ marginLeft: 6 }} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Sync feedback notification banner if triggered */}
        {seedMessage && (
          <View style={styles.syncBanner}>
            <Ionicons name="checkmark-circle" size={16} color="#2E7D32" />
            <Text style={styles.syncBannerText}>{seedMessage}</Text>
          </View>
        )}

        {/* MAIN BODY AREA */}
        <View style={styles.mainBodyContainer}>
          {/* VERIFIED FARMER IDENTITY CARD */}
          <View style={styles.farmerCard}>
            {/* Dark green decorative top-left arch */}
            <View style={styles.farmerCardArch} />

            {/* Header: Photo + Info */}
            <View style={styles.farmerHeaderRow}>
              <View style={styles.farmerPhotoRing}>
                <Image
                  source={
                    currentFarmer?.photoUrl
                      ? { uri: currentFarmer.photoUrl }
                      : require('../../../assets/farmer_avatar.jpg')
                  }
                  style={styles.farmerPhotoImage}
                  resizeMode="cover"
                />
              </View>

              <View style={styles.farmerDetailsCol}>
                <Text style={styles.farmerCardName} numberOfLines={1}>
                  {farmerName}
                </Text>
                <Text style={styles.farmerCardId}>{t.farmerId(farmerId)}</Text>
                <Text style={styles.farmerCardPhone} numberOfLines={1}>
                  📞 {farmerPhone}
                </Text>
                <Text style={styles.farmerCardLocation} numberOfLines={1}>
                  📍 {farmerLocation}
                </Text>
              </View>
            </View>

            {/* Land Holding & Primary Crop 2-Col Strip */}
            <View style={styles.holdingRow}>
              {/* Land Holding Box */}
              <View style={styles.holdingBox}>
                <View style={styles.holdingIconBg}>
                  <Ionicons name="grid-outline" size={20} color="#2E7D32" />
                </View>
                <View style={styles.holdingTextCol}>
                  <Text style={styles.holdingLabel}>{t.landHolding}</Text>
                  <Text style={styles.holdingValue}>{landArea} {t.acres}</Text>
                </View>
              </View>

              {/* Primary Crop Box */}
              <View style={styles.holdingBox}>
                <View style={styles.holdingIconBg}>
                  <Text style={{ fontSize: 18 }}>🌾</Text>
                </View>
                <View style={styles.holdingTextCol}>
                  <Text style={styles.holdingLabel}>{t.primaryCrop}</Text>
                  <Text style={styles.holdingValue}>{primaryCrop}</Text>
                </View>
              </View>
            </View>

            {/* Verification Strip: Aadhaar & DBT Bank */}
            <View style={styles.verificationStrip}>
              {/* Aadhaar Verified */}
              <View style={styles.verifyItem}>
                <Ionicons name="checkmark-circle" size={18} color="#2E7D32" />
                <View style={styles.verifyTextCol}>
                  <Text style={styles.verifyTitle}>{t.aadhaar}</Text>
                  <Text style={styles.verifySub}>{t.verified}</Text>
                </View>
              </View>

              {/* Bank Account */}
              <View style={styles.verifyItem}>
                <Ionicons name="checkmark-circle" size={18} color="#2E7D32" />
                <View style={styles.sbiBadge}>
                  <Text style={styles.sbiBadgeText}>SBI</Text>
                </View>
                <View style={styles.verifyTextCol}>
                  <Text style={styles.verifyTitle}>{t.dbtBank}</Text>
                  <Text style={styles.verifySub} numberOfLines={1}>
                    {bankName}, {bankAccount}
                  </Text>
                </View>
              </View>
            </View>

            {/* View Full Profile Link */}
            <TouchableOpacity
              style={styles.viewDetailedProfileBtn}
              onPress={() => router.push('/(farmer)/(tabs)/profile')}
              activeOpacity={0.7}
            >
              <Text style={styles.viewDetailedProfileText}>
                {t.viewProfile}
              </Text>
            </TouchableOpacity>
          </View>

          {/* WEATHER ALERTS BANNER (SITE & APP NOTIFICATION WARNING) */}
          <WeatherAlertBanner defaultType="unseasonal_rain" />

          {/* SECTION: NEW ADDED & ENVIRONMENT */}
          <Text style={styles.sectionHeaderTitle}>{t.envSection}</Text>

          <View style={styles.environmentRow}>
            {/* Market Price Card: Aligned dynamically with farmer's primary crop + MSP comparison */}
            <View style={styles.environmentCard}>
              <Text style={styles.envCardTitle}>{t.marketPrice}</Text>
              <Text style={styles.envCardSub} numberOfLines={1}>{cropMarketSubtitle}</Text>

              {/* Main Price Row with /q */}
              <View style={styles.priceRow}>
                <Text style={styles.envPriceBig}>
                  {cropMarketPrice}
                  <Text style={styles.priceUnitSlash}>/q</Text>
                </Text>
                <View style={styles.arrowUpPill}>
                  <Ionicons name="arrow-up" size={12} color="#2E7D32" />
                </View>
              </View>

              {/* Explicit unit below the market price */}
              <Text style={styles.unitSubText}>{t.unitBelowPrice}</Text>

              {/* MSP Comparison display */}
              <View style={styles.mspCompareBox}>
                <Text style={styles.mspCompareText}>
                  {t.mandiPrefix} {cropMarketPrice}/q / {t.mspPrefix} {cropPriceInfo.mspDisplay}/q
                </Text>
                <View style={styles.mspBenefitTag}>
                  <Text style={styles.mspBenefitTagText}>{cropMarketTrend}</Text>
                </View>
              </View>
            </View>

            {/* Actionable Agro-met Advisory Card (Replacing generic weather forecast) */}
            <View style={styles.environmentCard}>
              <View style={styles.agrometHeaderRow}>
                <Text style={styles.envCardTitle}>{t.agrometTitle}</Text>
                <View style={styles.liveRadarDot} />
              </View>
              <Text style={styles.envCardSub} numberOfLines={1}>({mandiLocation})</Text>

              {/* Temperature & Rain Probability (24-48h) */}
              <View style={styles.agrometTempRow}>
                <Text style={styles.weatherEmoji}>⛅</Text>
                <Text style={styles.weatherTempBig}>32°C</Text>
              </View>
              
              <View style={styles.rainProbBadge}>
                <Ionicons name="rainy" size={12} color="#0284C7" />
                <Text style={styles.rainProbText}>{t.agrometRainProb}</Text>
              </View>

              {/* Wind Speed & Humidity Specs */}
              <View style={styles.windSpeedRow}>
                <Ionicons name="speedometer-outline" size={11} color="#475569" />
                <Text style={styles.windSpeedText} numberOfLines={1}>{t.agrometWind} • {t.humidityText}</Text>
              </View>

              {/* Actionable Advisory Box */}
              <View style={styles.actionAdvisoryBox}>
                <Text style={styles.actionAdvisoryLabel}>{isHi ? '⚠️ सलाह:' : '⚠️ Advisory:'}</Text>
                <Text style={styles.actionAdvisoryText} numberOfLines={2}>
                  {t.agrometAdvisory}
                </Text>
              </View>
            </View>
          </View>

          {/* SECTION: QUICK ACTIONS */}
          <View style={styles.quickActionsHeaderRow}>
            <Text style={styles.sectionHeaderTitleNoMargin}>{t.quickActions}</Text>
            <TouchableOpacity
              onPress={handleSeed}
              disabled={isSeeding}
              activeOpacity={0.7}
              style={styles.seedLinkBtn}
            >
              {isSeeding ? (
                <ActivityIndicator size="small" color="#184D2B" />
              ) : (
                <Text style={styles.seedLinkText}>{t.seedData}</Text>
              )}
            </TouchableOpacity>
          </View>

          {/* Quick Actions 3-Column Grid */}
          <View style={styles.quickActionsGrid}>
            <TouchableOpacity
              style={styles.quickActionCard}
              onPress={() => router.push('/(farmer)/booking/crop')}
              activeOpacity={0.75}
            >
              <View style={[styles.actionIconBox, { backgroundColor: '#E8F5E9' }]}>
                <Ionicons name="add-circle" size={24} color="#2E7D32" />
              </View>
              <Text style={styles.actionLabel}>{t.bookVisit}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.quickActionCard}
              onPress={() => router.push(`/(farmer)/queue/${activeTx?.id || 'tx-001'}` as any)}
              activeOpacity={0.75}
            >
              <View style={[styles.actionIconBox, { backgroundColor: '#FFF3E0' }]}>
                <Ionicons name="timer" size={24} color="#F57C00" />
              </View>
              <Text style={styles.actionLabel}>{t.trackQueue}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.quickActionCard}
              onPress={() => router.push(`/(farmer)/procurement/${activeTx?.id || 'tx-001'}` as any)}
              activeOpacity={0.75}
            >
              <View style={[styles.actionIconBox, { backgroundColor: '#E3F2FD' }]}>
                <Ionicons name="git-branch" size={24} color="#1976D2" />
              </View>
              <Text style={styles.actionLabel}>{t.procurement}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.quickActionCard}
              onPress={() => router.push(`/(farmer)/payment/${activeTx?.id || 'tx-001'}` as any)}
              activeOpacity={0.75}
            >
              <View style={[styles.actionIconBox, { backgroundColor: '#F3E5F5' }]}>
                <Ionicons name="cash" size={24} color="#7B1FA2" />
              </View>
              <Text style={styles.actionLabel}>{t.payment}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.quickActionCard}
              onPress={() => router.push('/(farmer)/mandi')}
              activeOpacity={0.75}
            >
              <View style={[styles.actionIconBox, { backgroundColor: '#E0F2F1' }]}>
                <Ionicons name="business" size={24} color="#00796B" />
              </View>
              <Text style={styles.actionLabel}>{t.mandis}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.quickActionCard}
              onPress={() => router.push('/(farmer)/support')}
              activeOpacity={0.75}
            >
              <View style={[styles.actionIconBox, { backgroundColor: '#FFEBEE' }]}>
                <Ionicons name="help-buoy" size={24} color="#D32F2F" />
              </View>
              <Text style={styles.actionLabel}>{t.support}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screenWrapper: {
    flex: 1,
    backgroundColor: '#F3F5F2',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },

  /* TOP FOREST GREEN BANNER */
  forestGreenHeader: {
    backgroundColor: '#154326',
    paddingHorizontal: 16,
    paddingBottom: 22,
    position: 'relative',
    overflow: 'hidden',
  },
  leafDecor1: {
    position: 'absolute',
    top: -10,
    right: -10,
    opacity: 0.08,
    transform: [{ rotate: '45deg' }],
  },
  leafDecor2: {
    position: 'absolute',
    top: 50,
    right: 40,
    opacity: 0.06,
    transform: [{ rotate: '15deg' }],
  },
  headerTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  wheatIcon: {
    fontSize: 22,
    marginRight: 8,
  },
  brandTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.3,
  },
  langPill: {
    flexDirection: 'row',
    backgroundColor: '#1E5330',
    borderRadius: 20,
    padding: 2,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.25)',
  },
  langOption: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 16,
  },
  langOptionActive: {
    backgroundColor: '#2A6F42',
  },
  langText: {
    fontSize: 13,
    color: '#B0D8BC',
    fontWeight: '600',
  },
  langTextActive: {
    color: '#FFFFFF',
    fontWeight: '800',
  },
  liveStatusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 14,
  },
  liveStatusText: {
    fontSize: 12,
    color: '#A7F3D0',
    fontWeight: '600',
    marginLeft: 6,
  },

  /* ACTIVE TOKEN CARD */
  activeTokenCard: {
    backgroundColor: '#11351D',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 4,
  },
  tokenRibbonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  goldRibbon: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#CCA258',
    borderBottomRightRadius: 14,
    paddingVertical: 7,
    paddingHorizontal: 12,
  },
  goldRibbonText: {
    fontSize: 14,
    fontWeight: '900',
    color: '#382506',
    letterSpacing: 0.5,
    marginLeft: 6,
  },
  bookedBadge: {
    backgroundColor: '#1E6532',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#2E7D32',
  },
  bookedBadgeText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#A5D6A7',
    letterSpacing: 0.5,
  },
  queueStatsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  queueMetricBox: {
    flex: 1,
    backgroundColor: '#FCFAF5',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 6,
    alignItems: 'center',
  },
  metricLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metricTitle: {
    fontSize: 10,
    fontWeight: '700',
    color: '#4A5568',
    marginLeft: 4,
  },
  aheadBarTrack: {
    width: '75%',
    height: 4,
    backgroundColor: '#E2E8F0',
    borderRadius: 2,
    marginTop: 6,
    overflow: 'hidden',
  },
  aheadBarFill: {
    width: '50%',
    height: '100%',
    backgroundColor: '#CCA258',
  },
  metricBigValue: {
    fontSize: 13,
    fontWeight: '900',
    color: '#1A202C',
    marginTop: 3,
  },
  queueDottedDivider: {
    color: 'rgba(255, 255, 255, 0.4)',
    fontSize: 14,
    marginHorizontal: 2,
    fontWeight: 'bold',
  },
  tokenMetaStrip: {
    backgroundColor: '#FDFBF7',
    borderRadius: 8,
    marginHorizontal: 10,
    paddingVertical: 8,
    paddingHorizontal: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#EFE7D5',
  },
  tokenMetaText: {
    fontSize: 12,
    color: '#2D3748',
    lineHeight: 18,
    textAlign: 'center',
  },
  tokenMetaBold: {
    fontWeight: '800',
    color: '#1A202C',
  },
  trackStatusBtn: {
    backgroundColor: '#1E5830',
    marginHorizontal: 10,
    marginBottom: 10,
    borderRadius: 8,
    paddingVertical: 11,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#2E7D32',
  },
  trackStatusBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },

  /* SYNC FEEDBACK BANNER */
  syncBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#E8F5E9',
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginHorizontal: 16,
    marginTop: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#C8E6C9',
  },
  syncBannerText: {
    fontSize: 12,
    color: '#2E7D32',
    fontWeight: '600',
    marginLeft: 6,
  },

  /* MAIN BODY */
  mainBodyContainer: {
    paddingHorizontal: 16,
    paddingTop: 12,
  },

  /* FARMER CARD */
  farmerCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 14,
    position: 'relative',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#E6EAE5',
  },
  farmerCardArch: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 95,
    height: 95,
    borderTopLeftRadius: 18,
    borderBottomRightRadius: 65,
    backgroundColor: '#184E29',
  },
  farmerHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  farmerPhotoRing: {
    width: 72,
    height: 72,
    borderRadius: 36,
    borderWidth: 3,
    borderColor: '#2E7D32',
    overflow: 'hidden',
    backgroundColor: '#E0E0E0',
    marginRight: 14,
  },
  farmerPhotoImage: {
    width: '100%',
    height: '100%',
  },
  farmerDetailsCol: {
    flex: 1,
    justifyContent: 'center',
  },
  farmerCardName: {
    fontSize: 19,
    fontWeight: '800',
    color: '#1A202C',
  },
  farmerCardId: {
    fontSize: 13,
    fontWeight: '600',
    color: '#4A5568',
    marginTop: 1,
  },
  farmerCardPhone: {
    fontSize: 12,
    color: '#2D3748',
    marginTop: 2,
  },
  farmerCardLocation: {
    fontSize: 11,
    color: '#4A5568',
    marginTop: 2,
  },
  holdingRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 10,
  },
  holdingBox: {
    flex: 1,
    backgroundColor: '#FAF5EA',
    borderRadius: 10,
    padding: 9,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#EFE5D0',
  },
  holdingIconBg: {
    width: 34,
    height: 34,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  holdingTextCol: {
    flex: 1,
  },
  holdingLabel: {
    fontSize: 10,
    color: '#64748B',
    fontWeight: '600',
  },
  holdingValue: {
    fontSize: 15,
    fontWeight: '800',
    color: '#1A202C',
    marginTop: 1,
  },
  verificationStrip: {
    backgroundColor: '#FAF5EA',
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#EFE5D0',
    marginBottom: 10,
  },
  verifyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  verifyTextCol: {
    marginLeft: 6,
  },
  verifyTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#1A202C',
  },
  verifySub: {
    fontSize: 10,
    color: '#64748B',
  },
  sbiBadge: {
    backgroundColor: '#0054A6',
    borderRadius: 4,
    paddingHorizontal: 4,
    paddingVertical: 1,
    marginLeft: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sbiBadgeText: {
    fontSize: 8,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  viewDetailedProfileBtn: {
    paddingTop: 6,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#F0F2F0',
  },
  viewDetailedProfileText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#184E29',
  },

  /* NEW ADDED & ENVIRONMENT SECTION */
  sectionHeaderTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1A202C',
    marginTop: 18,
    marginBottom: 10,
  },
  sectionHeaderTitleNoMargin: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1A202C',
  },
  environmentRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 16,
  },
  environmentCard: {
    flex: 1,
    backgroundColor: '#FAF5EA',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#EFE5D0',
  },
  envCardTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1A202C',
  },
  envCardSub: {
    fontSize: 10,
    color: '#64748B',
    marginTop: 1,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  envPriceBig: {
    fontSize: 20,
    fontWeight: '900',
    color: '#1A202C',
  },
  arrowUpPill: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#C8E6C9',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 6,
  },
  priceUnitSlash: {
    fontSize: 13,
    fontWeight: '700',
    color: '#64748B',
    marginLeft: 2,
  },
  unitSubText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#64748B',
    marginTop: 2,
    marginBottom: 4,
  },
  mspCompareBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    paddingVertical: 5,
    paddingHorizontal: 7,
    borderWidth: 1,
    borderColor: '#EFE5D0',
    marginTop: 3,
  },
  mspCompareText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#1E293B',
    lineHeight: 14,
  },
  mspBenefitTag: {
    backgroundColor: '#E8F5E9',
    borderRadius: 4,
    paddingVertical: 2,
    paddingHorizontal: 5,
    marginTop: 4,
    alignSelf: 'flex-start',
  },
  mspBenefitTagText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#2E7D32',
  },
  agrometHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  liveRadarDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#0284C7',
  },
  agrometTempRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  rainProbBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E0F2FE',
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 6,
    marginTop: 3,
    alignSelf: 'flex-start',
  },
  rainProbText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#0369A1',
    marginLeft: 3,
  },
  windSpeedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  windSpeedText: {
    fontSize: 9,
    fontWeight: '700',
    color: '#475569',
    marginLeft: 3,
  },
  actionAdvisoryBox: {
    backgroundColor: '#FFFBEB',
    borderRadius: 6,
    paddingVertical: 4,
    paddingHorizontal: 6,
    borderWidth: 1,
    borderColor: '#FDE68A',
    marginTop: 5,
  },
  actionAdvisoryLabel: {
    fontSize: 9,
    fontWeight: '900',
    color: '#B45309',
  },
  actionAdvisoryText: {
    fontSize: 9,
    color: '#78350F',
    lineHeight: 12,
    marginTop: 1,
  },
  weatherEmoji: {
    fontSize: 24,
    marginRight: 6,
  },
  weatherTempBig: {
    fontSize: 20,
    fontWeight: '900',
    color: '#1A202C',
  },

  /* QUICK ACTIONS */
  quickActionsHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  seedLinkBtn: {
    paddingVertical: 4,
    paddingHorizontal: 6,
  },
  seedLinkText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#184E29',
    textDecorationLine: 'underline',
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  quickActionCard: {
    width: '31%',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 6,
    alignItems: 'center',
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#E6EAE5',
  },
  actionIconBox: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
  },
  actionLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#1A202C',
    textAlign: 'center',
  },
});