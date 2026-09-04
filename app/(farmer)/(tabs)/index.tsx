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
  Modal,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { MOCK_TRANSACTIONS, MOCK_CENTRES } from '../../../src/services/mock-data.service';
import { useAppContext } from '../../../src/store/app-context';
import { SpeakerButton } from '../../../src/components/SpeakerButton';
import { AccessibilityToolbar, TextScale } from '../../../src/components/AccessibilityToolbar';

// Translation dictionary for Simple Hindi, Odia, and English
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
    urgentAlertTitle: '🚨 मौसम चेतावनी (अगले 24-48 घंटे)',
    urgentAlertSub: 'बेमौसम बारिश (75%) व तेज हवा (32 km/h) की आशंका! सुरक्षा उपाय देखें →',
    agroMetTitle: 'कृषि-मौसम सलाह',
    alertTag: 'चेतावनी',
    agroMetDuration: '24-48 घंटे',
    rainProbLabel: 'बारिश संभावना:',
    windSpeedText: 'हवा: 18 km/h',
    advisorySnippet: 'कटी फसल को ढकें, छिड़काव रोकें',
    tapForAdvisory: 'पूरी सलाह और उपाय देखें ›',
    modalTitle: '🚨 कृषि-मौसम चेतावनी (Agro-Met Alert)',
    modalSub: 'भारत मौसम विज्ञान विभाग (IMD) एवं कृषि विज्ञान केंद्र',
    tabRain: '🌧️ बेमौसम बारिश',
    tabFrost: '❄️ पाला / शीतलहर',
    tabHeat: '☀️ लू / प्रचंड गर्मी',
    precautionsTitle: 'फसल सुरक्षा के जरूरी कदम (किसान सलाह):',
    rainStep1: 'कटी हुई फसल व अनाज को तुरंत सुरक्षित गोदाम में रखें या तिरपाल (प्लास्टिक शीट) से अच्छी तरह ढकें।',
    rainStep2: 'अगले 48 घंटों तक खेतों में किसी भी कीटनाशक, उर्वरक या अतिरिक्त सिंचाई का छिड़काव न करें।',
    rainStep3: 'खेतों में जलनिकासी की नालियां साफ रखें ताकि गेहूं व सब्जी की फसलों में जलभराव से नुकसान न हो।',
    frostStep1: 'पाला पड़ने की आशंका पर खेत में शाम के समय हल्की सिंचाई करें ताकि जमीन का तापमान न गिरे।',
    frostStep2: 'खेत की उत्तर-पश्चिम मेड़ों पर शाम के समय जैविक कचरा जलाकर धुआं करें।',
    frostStep3: 'सब्जियों और नर्सरी को पुआल, घास-फूस या प्लास्टिक शीट से ढककर बचाएं।',
    heatStep1: 'फसलों को लू से बचाने के लिए केवल सुबह या देर शाम के समय ही हल्की सिंचाई करें।',
    heatStep2: 'जमीन में नमी संजोने के लिए पुआल की मल्चिंग (Mulching) बिछाएं।',
    heatStep3: 'पशुओं को दोपहर 12 से 4 बजे तक छायादार जगह में रखें और भरपूर ठंडा पानी दें।',
    kisanCallCenter: 'किसान कॉल सेंटर टोल-फ्री: 1800-180-1551 (मुफ्त वैज्ञानिक सलाह)',
    dismissBtn: 'समझ गया / सावधानी बरती जाएगी',
  },
  or: {
    brand: 'କିଷାନ ମିତ୍ର',
    liveConnected: 'ଅନଲାଇନ୍ ସକ୍ରିୟ',
    tokenHeader: (num: number | string) => `ଆପଣଙ୍କ ସକ୍ରିୟ ଟୋକନ୍ #${num}`,
    booked: 'ବୁକ୍ ହୋଇଛି',
    ahead: '୩ ଚାଷୀ ଆଗରେ',
    estWait: 'ଆନୁମାନିକ ସମୟ',
    waitMins: '~୨୫ ମିନିଟ୍',
    arriveBy: 'ପହଞ୍ଚିବା ସମୟ',
    arriveTime: 'ସକାଳ ୧୦:୧୫',
    cropLabel: 'ଫସଲ: ',
    mandiLabel: 'ମଣ୍ଡି: ',
    slotLabel: 'ସମୟ: ',
    quintal: 'କ୍ୱିଣ୍ଟାଲ',
    trackStatus: 'ଲାଇଭ୍ ସ୍ଥିତି ଦେଖନ୍ତୁ',
    farmerId: (id: string) => `ଚାଷୀ ଆଇଡି: ${id}`,
    defaultLocation: 'ଗ୍ରାମ ପଞ୍ଚାୟତ, ଭୁବନେଶ୍ୱର / ଭୋପାଲ',
    landHolding: 'ଜମି (ଭୂମି)',
    acres: 'ଏକର',
    primaryCrop: 'ପ୍ରମୁଖ ଫସଲ',
    cropDefault: 'ଗହମ (Wheat)',
    aadhaar: 'ଆଧାର କାର୍ଡ',
    verified: 'ଯାଞ୍ଚ ହୋଇଛି ✓',
    dbtBank: 'ଡିବିଟି ବ୍ୟାଙ୍କ',
    bankDefault: 'ଷ୍ଟେଟ୍ ବ୍ୟାଙ୍କ ଅଫ୍ ଇଣ୍ଡିଆ, ୫୬୭୮',
    viewProfile: 'ବିସ୍ତୃତ ପ୍ରୋଫାଇଲ୍ ଏବଂ ଜମି ରେକର୍ଡ ଦେଖନ୍ତୁ →',
    envSection: 'ସଦ୍ୟତମ ତଥ୍ୟ ଏବଂ ପାଣିପାଗ',
    marketPrice: 'ମଣ୍ଡି ଦର',
    marketCropLocation: '(ଧାନ, ଭୁବନେଶ୍ୱର/ଭୋପାଲ)',
    currentPriceUp: 'ସାମ୍ପ୍ରତିକ ଦର ↑',
    weatherTitle: 'ପାଣିପାଗ ସ୍ଥିତି',
    bhopal: '(ଭୋପାଲ)',
    quickActions: 'ଦ୍ରୁତ ସେବା',
    seedData: 'ତଥ୍ୟ ସିଙ୍କ କରନ୍ତୁ',
    bookVisit: 'ନୂଆ ଟୋକନ୍ ବୁକ୍',
    trackQueue: 'ଧାଡ଼ି ଦେଖନ୍ତୁ',
    procurement: 'କ୍ରୟ ପ୍ରକ୍ରିୟା',
    payment: 'ଦେୟ ସ୍ଥିତି',
    mandis: 'ମଣ୍ଡି କେନ୍ଦ୍ର',
    support: 'ଚାଷୀ ସହାୟତା',
    dataSynced: 'ତଥ୍ୟ ସଫଳତାର ସହ ସିଙ୍କ୍ ହେଲା!',
    syncError: 'ସିଙ୍କରେ ତ୍ରୁଟି ଘଟିଲା',
    unitBelowPrice: '/ପ୍ରତି କ୍ୱିଣ୍ଟାଲ (୧୦୦ କିଗ୍ରା)',
    mandiPrefix: 'ମଣ୍ଡି:',
    mspPrefix: 'MSP:',
    urgentAlertTitle: '🚨 କୃଷି-ପାଣିପାଗ ସତର୍କତା (ଆଗାମୀ ୨୪-୪୮ ଘଣ୍ଟା)',
    urgentAlertSub: 'ଅସାମୟିକ ବର୍ଷା (୭୫%) ଏବଂ ପ୍ରବଳ ପବନ (୩୨ କିମି/ଘଣ୍ଟା) ସମ୍ଭାବନା! ସତର୍କତା ଦେଖନ୍ତୁ →',
    agroMetTitle: 'କୃଷି-ପାଣିପାଗ ପରାମର୍ଶ',
    alertTag: 'ସତର୍କତା',
    agroMetDuration: '୨୪-୪୮ ଘଣ୍ଟା',
    rainProbLabel: 'ବର୍ଷା ସମ୍ଭାବନା:',
    windSpeedText: 'ପବନ: ୧୮ କିମି/ଘଣ୍ଟା',
    advisorySnippet: 'କଟା ଫସଲ ଘୋଡ଼ାନ୍ତୁ, କୀଟନାଶକ ସ୍ପ୍ରେ ବନ୍ଦ ରଖନ୍ତୁ',
    tapForAdvisory: 'ସମ୍ପୂର୍ଣ୍ଣ ପରାମର୍ଶ ଏବଂ ସତର୍କତା ଦେଖନ୍ତୁ ›',
    modalTitle: '🚨 ଜରୁରୀ କୃଷି-ପାଣିପାଗ ପରାମର୍ଶ (Agro-Met Alert)',
    modalSub: 'ଭାରତ ପାଣିପାଗ ବିଭାଗ (IMD) ଏବଂ କୃଷି ବିଜ୍ଞାନ କେନ୍ଦ୍ର (KVK)',
    tabRain: '🌧️ ଅସାମୟିକ ବର୍ଷା',
    tabFrost: '❄️ କାକର / ଶୀତଲହରୀ',
    tabHeat: '☀️ ଲୁ / ପ୍ରଚଣ୍ଡ ଖରା',
    precautionsTitle: 'ଫସଲ ସୁରକ୍ଷା ପାଇଁ ଜରୁରୀ ପଦକ୍ଷେପ (ଚାଷୀ ପରାମର୍ଶ):',
    rainStep1: 'କଟା ଯାଇଥିବା ଫସଲ ଓ ଶସ୍ୟକୁ ତୁରନ୍ତ ସୁରକ୍ଷିତ ସ୍ଥାନକୁ ନିଅନ୍ତୁ କିମ୍ବା ପଲିଥିନ ତାରପୋଲିନ ଦ୍ୱାରା ଭଲ ଭାବରେ ଘୋଡ଼ାଇ ରଖନ୍ତୁ।',
    rainStep2: 'ଆଗାମୀ ୪୮ ଘଣ୍ଟା ପର୍ଯ୍ୟନ୍ତ କ୍ଷେତରେ କୌଣସି କୀଟନାଶକ, ରାସାୟନିକ ସାର କିମ୍ବା ଜଳସେଚନ କରନ୍ତୁ ନାହିଁ।',
    rainStep3: 'ଜଳବନ୍ଦୀ ସମସ୍ୟାରୁ ଫସଲକୁ ବଞ୍ଚାଇବା ପାଇଁ କ୍ଷେତରେ ନାଳୀ ସଫା କରି ପାଣି ନିଷ୍କାସନର ବ୍ୟବସ୍ଥା କରନ୍ତୁ।',
    frostStep1: 'କାକର ଓ ଶୀତଲହରୀରୁ ବଞ୍ଚାଇବା ପାଇଁ ସନ୍ଧ୍ୟା ସମୟରେ କ୍ଷେତରେ ହାଲୁକା ପାଣି ମଡ଼ାନ୍ତୁ ଯାହାଦ୍ୱାରା ମାଟିର ତାପମାତ୍ରା ସ୍ଥିର ରହିବ।',
    frostStep2: 'କ୍ଷେତର ଉତ୍ତର-ପଶ୍ଚିମ ସୀମାରେ ସନ୍ଧ୍ୟା ସମୟରେ ଅଳିଆ ଆବର୍ଜନା ଜଳାଇ ଧୂଆଁ ସୃଷ୍ଟି କରନ୍ତୁ।',
    frostStep3: 'ପନିପରିବା ଏବଂ ଛୋଟ ଚାରା ଗଛଗୁଡ଼ିକୁ ନଡ଼ା କିମ୍ବା ପ୍ଲାଷ୍ଟିକ ଚାଦର ଦ୍ୱାରା ଢାଙ୍କି ସୁରକ୍ଷା ଦିଅନ୍ତୁ।',
    heatStep1: 'ପ୍ରଚଣ୍ଡ ଖରା ଓ ଲୁରୁ ଫସଲକୁ ରକ୍ଷା କରିବା ପାଇଁ କେବଳ ସକାଳେ କିମ୍ବା ବିଳମ୍ବିତ ସନ୍ଧ୍ୟାରେ ଜଳସେଚନ କରନ୍ତୁ।',
    heatStep2: 'ମାଟିରେ ଆର୍ଦ୍ରତା ବଜାୟ ରଖିବା ପାଇଁ ଫସଲ ଅବଶିଷ୍ଟାଂଶ ବା ନଡ଼ାର ମଲଚିଂ (Mulching) ବ୍ୟବହାର କରନ୍ତୁ।',
    heatStep3: 'ଗୃହପାଳିତ ପଶୁମାନଙ୍କୁ ମଧ୍ୟାହ୍ନ ୧୨ ରୁ ୪ ଟା ପର୍ଯ୍ୟନ୍ତ ଛାଇରେ ରଖନ୍ତୁ ଏବଂ ପର୍ଯ୍ୟାପ୍ତ ଥଣ୍ଡା ପିଇବା ପାଣି ଦିଅନ୍ତୁ।',
    kisanCallCenter: 'କିଷାନ କଲ୍ ସେଣ୍ଟର୍ ଟୋଲ୍-ଫ୍ରି: ୧୮୦୦-୧୮୦-୧୫୫୧ (ବିଶେଷଜ୍ଞ କୃଷି ପରାମର୍ଶ)',
    dismissBtn: 'ବୁଝିଲି / ଆବଶ୍ୟକ ସତର୍କତା ଅବଲମ୍ବନ କରିବି',
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
    urgentAlertTitle: '🚨 Agro-Met Weather Alert (Next 24-48h)',
    urgentAlertSub: 'Unseasonal rain (75%) & gusty winds (32 km/h) expected! Tap for advisory →',
    agroMetTitle: 'Agro-met Advisory',
    alertTag: 'WARNING',
    agroMetDuration: '24-48h',
    rainProbLabel: 'Rain Probability:',
    windSpeedText: 'Wind: 18 km/h',
    advisorySnippet: 'Cover harvested produce, pause spray',
    tapForAdvisory: 'View Full Advisory & Actions ›',
    modalTitle: '🚨 Critical Agro-Met Advisory',
    modalSub: 'India Meteorological Dept (IMD) & Agri Science Centre (KVK)',
    tabRain: '🌧️ Unseasonal Rain',
    tabFrost: '❄️ Frost / Cold Wave',
    tabHeat: '☀️ Heatwave Alert',
    precautionsTitle: 'Crucial Crop Protection Steps (Farmer Action Plan):',
    rainStep1: 'Move harvested grain to sheds immediately or cover heaps tightly with waterproof tarpaulins.',
    rainStep2: 'Postpone all chemical spraying, fertilizer application & irrigation for the next 48 hours.',
    rainStep3: 'Clear drainage furrows in standing crops to prevent root waterlogging and lodging.',
    frostStep1: 'Apply light irrigation in evening hours to buffer ground temperature against freezing.',
    frostStep2: 'Create light smoke on the north-west border of fields during early night hours.',
    frostStep3: 'Cover nurseries and young vegetable plants with straw or plastic sheets.',
    heatStep1: 'Irrigate fields strictly during early morning or late evening hours to reduce heat stress.',
    heatStep2: 'Apply organic mulch or crop residue to conserve root moisture and cool the soil.',
    heatStep3: 'Keep dairy cattle in well-ventilated shaded shelters with plenty of clean drinking water.',
    kisanCallCenter: 'Kisan Call Centre Toll-Free: 1800-180-1551 (Agri Expert Advisory)',
    dismissBtn: 'Acknowledge / I Will Take Precautions',
  },
};

interface CropPriceInfo {
  nameEn: string;
  nameHi: string;
  nameOr: string;
  priceDisplay: string;
  mspDisplay: string;
  trendTextEn: string;
  trendTextHi: string;
  trendTextOr: string;
}

const CROP_PRICE_MAP: Record<string, CropPriceInfo> = {
  wheat: {
    nameEn: 'Wheat',
    nameHi: 'गेहूं',
    nameOr: 'ଗହମ',
    priceDisplay: '₹2,450',
    mspDisplay: '₹2,275',
    trendTextEn: 'Current Price ↑ (MSP ₹2,275)',
    trendTextHi: 'ताज़ा भाव ↑ (MSP ₹2,275)',
    trendTextOr: 'ସାମ୍ପ୍ରତିକ ଦର ↑ (MSP ₹୨,୨୭୫)',
  },
  गेहूं: {
    nameEn: 'Wheat',
    nameHi: 'गेहूं',
    nameOr: 'ଗହମ',
    priceDisplay: '₹2,450',
    mspDisplay: '₹2,275',
    trendTextEn: 'Current Price ↑ (MSP ₹2,275)',
    trendTextHi: 'ताज़ा भाव ↑ (MSP ₹2,275)',
    trendTextOr: 'ସାମ୍ପ୍ରତିକ ଦର ↑ (MSP ₹୨,୨୭୫)',
  },
  ଗହମ: {
    nameEn: 'Wheat',
    nameHi: 'गेहूं',
    nameOr: 'ଗହମ',
    priceDisplay: '₹2,450',
    mspDisplay: '₹2,275',
    trendTextEn: 'Current Price ↑ (MSP ₹2,275)',
    trendTextHi: 'ताज़ा भाव ↑ (MSP ₹2,275)',
    trendTextOr: 'ସାମ୍ପ୍ରତିକ ଦର ↑ (MSP ₹୨,୨୭୫)',
  },
  paddy: {
    nameEn: 'Paddy',
    nameHi: 'धान',
    nameOr: 'ଧାନ',
    priceDisplay: '₹2,900',
    mspDisplay: '₹2,320',
    trendTextEn: 'Current Price ↑ (MSP ₹2,320)',
    trendTextHi: 'ताज़ा भाव ↑ (MSP ₹2,320)',
    trendTextOr: 'ସାମ୍ପ୍ରତିକ ଦର ↑ (MSP ₹୨,୩୨୦)',
  },
  धान: {
    nameEn: 'Paddy',
    nameHi: 'धान',
    nameOr: 'ଧାନ',
    priceDisplay: '₹2,900',
    mspDisplay: '₹2,320',
    trendTextEn: 'Current Price ↑ (MSP ₹2,320)',
    trendTextHi: 'ताज़ा भाव ↑ (MSP ₹2,320)',
    trendTextOr: 'ସାମ୍ପ୍ରତିକ ଦର ↑ (MSP ₹୨,୩୨୦)',
  },
  ଧାନ: {
    nameEn: 'Paddy',
    nameHi: 'धान',
    nameOr: 'ଧାନ',
    priceDisplay: '₹2,900',
    mspDisplay: '₹2,320',
    trendTextEn: 'Current Price ↑ (MSP ₹2,320)',
    trendTextHi: 'ताज़ा भाव ↑ (MSP ₹2,320)',
    trendTextOr: 'ସାମ୍ପ୍ରତିକ ଦର ↑ (MSP ₹୨,୩୨୦)',
  },
  rice: {
    nameEn: 'Paddy (Rice)',
    nameHi: 'धान (चावल)',
    nameOr: 'ଧାନ (ଚାଉଳ)',
    priceDisplay: '₹2,900',
    mspDisplay: '₹2,320',
    trendTextEn: 'Current Price ↑ (MSP ₹2,320)',
    trendTextHi: 'ताज़ा भाव ↑ (MSP ₹2,320)',
    trendTextOr: 'ସାମ୍ପ୍ରତିକ ଦର ↑ (MSP ₹୨,୩୨୦)',
  },
  soybean: {
    nameEn: 'Soybean',
    nameHi: 'सोयाबीन',
    nameOr: 'ସୋୟାବିନ୍',
    priceDisplay: '₹4,892',
    mspDisplay: '₹4,892',
    trendTextEn: 'Current Price ↑ (MSP ₹4,892)',
    trendTextHi: 'ताज़ा भाव ↑ (MSP ₹4,892)',
    trendTextOr: 'ସାମ୍ପ୍ରତିକ ଦର ↑ (MSP ₹୪,୮୯୨)',
  },
  सोयाबीन: {
    nameEn: 'Soybean',
    nameHi: 'सोयाबीन',
    nameOr: 'ସୋୟାବିନ୍',
    priceDisplay: '₹4,892',
    mspDisplay: '₹4,892',
    trendTextEn: 'Current Price ↑ (MSP ₹4,892)',
    trendTextHi: 'ताज़ा भाव ↑ (MSP ₹4,892)',
    trendTextOr: 'ସାମ୍ପ୍ରତିକ ଦର ↑ (MSP ₹୪,୮୯୨)',
  },
  mustard: {
    nameEn: 'Mustard',
    nameHi: 'सरसों',
    nameOr: 'ସୋରିଷ',
    priceDisplay: '₹5,650',
    mspDisplay: '₹5,650',
    trendTextEn: 'Current Price ↑ (MSP ₹5,650)',
    trendTextHi: 'ताज़ा भाव ↑ (MSP ₹5,650)',
    trendTextOr: 'ସାମ୍ପ୍ରତିକ ଦର ↑ (MSP ₹୫,୬୫୦)',
  },
  सरसों: {
    nameEn: 'Mustard',
    nameHi: 'सरसों',
    nameOr: 'ସୋରିଷ',
    priceDisplay: '₹5,650',
    mspDisplay: '₹5,650',
    trendTextEn: 'Current Price ↑ (MSP ₹5,650)',
    trendTextHi: 'ताज़ा भाव ↑ (MSP ₹5,650)',
    trendTextOr: 'ସାମ୍ପ୍ରତିକ ଦର ↑ (MSP ₹୫,୬୫୦)',
  },
  ସୋରିଷ: {
    nameEn: 'Mustard',
    nameHi: 'सरसों',
    nameOr: 'ସୋରିଷ',
    priceDisplay: '₹5,650',
    mspDisplay: '₹5,650',
    trendTextEn: 'Current Price ↑ (MSP ₹5,650)',
    trendTextHi: 'ताज़ा भाव ↑ (MSP ₹5,650)',
    trendTextOr: 'ସାମ୍ପ୍ରତିକ ଦର ↑ (MSP ₹୫,୬୫୦)',
  },
  maize: {
    nameEn: 'Maize',
    nameHi: 'मक्का',
    nameOr: 'ମକା',
    priceDisplay: '₹2,090',
    mspDisplay: '₹2,090',
    trendTextEn: 'Current Price ↑ (MSP ₹2,090)',
    trendTextHi: 'ताज़ा भाव ↑ (MSP ₹2,090)',
    trendTextOr: 'ସାମ୍ପ୍ରତିକ ଦର ↑ (MSP ₹୨,୦୯୦)',
  },
  मक्का: {
    nameEn: 'Maize',
    nameHi: 'मक्का',
    nameOr: 'ମକା',
    priceDisplay: '₹2,090',
    mspDisplay: '₹2,090',
    trendTextEn: 'Current Price ↑ (MSP ₹2,090)',
    trendTextHi: 'ताज़ा भाव ↑ (MSP ₹2,090)',
    trendTextOr: 'ସାମ୍ପ୍ରତିକ ଦର ↑ (MSP ₹୨,୦୯୦)',
  },
  cotton: {
    nameEn: 'Cotton',
    nameHi: 'कपास',
    nameOr: 'କପା',
    priceDisplay: '₹7,121',
    mspDisplay: '₹7,121',
    trendTextEn: 'Current Price ↑ (MSP ₹7,121)',
    trendTextHi: 'ताज़ा भाव ↑ (MSP ₹7,121)',
    trendTextOr: 'ସାମ୍ପ୍ରତିକ ଦର ↑ (MSP ₹୭,୧୨୧)',
  },
  कपास: {
    nameEn: 'Cotton',
    nameHi: 'कपास',
    nameOr: 'କପା',
    priceDisplay: '₹7,121',
    mspDisplay: '₹7,121',
    trendTextEn: 'Current Price ↑ (MSP ₹7,121)',
    trendTextHi: 'ताज़ा भाव ↑ (MSP ₹7,121)',
    trendTextOr: 'ସାମ୍ପ୍ରତିକ ଦର ↑ (MSP ₹୭,୧୨୧)',
  },
  gram: {
    nameEn: 'Gram (Chana)',
    nameHi: 'चना',
    nameOr: 'ବୁଟ/ଚଣା',
    priceDisplay: '₹5,440',
    mspDisplay: '₹5,440',
    trendTextEn: 'Current Price ↑ (MSP ₹5,440)',
    trendTextHi: 'ताज़ा भाव ↑ (MSP ₹5,440)',
    trendTextOr: 'ସାମ୍ପ୍ରତିକ ଦର ↑ (MSP ₹୫,୪୪୦)',
  },
  chana: {
    nameEn: 'Gram (Chana)',
    nameHi: 'चना',
    nameOr: 'ବୁଟ/ଚଣା',
    priceDisplay: '₹5,440',
    mspDisplay: '₹5,440',
    trendTextEn: 'Current Price ↑ (MSP ₹5,440)',
    trendTextHi: 'ताज़ा भाव ↑ (MSP ₹5,440)',
    trendTextOr: 'ସାମ୍ପ୍ରତିକ ଦର ↑ (MSP ₹୫,୪୪୦)',
  },
  चना: {
    nameEn: 'Gram (Chana)',
    nameHi: 'चना',
    nameOr: 'ବୁଟ/ଚଣା',
    priceDisplay: '₹5,440',
    mspDisplay: '₹5,440',
    trendTextEn: 'Current Price ↑ (MSP ₹5,440)',
    trendTextHi: 'ताज़ा भाव ↑ (MSP ₹5,440)',
    trendTextOr: 'ସାମ୍ପ୍ରତିକ ଦର ↑ (MSP ₹୫,୪୪୦)',
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
    nameOr: name || 'ଗହମ',
    priceDisplay: '₹2,450',
    mspDisplay: '₹2,275',
    trendTextEn: 'Current Price ↑',
    trendTextHi: 'ताज़ा भाव ↑',
    trendTextOr: 'ସାମ୍ପ୍ରତିକ ଦର ↑',
  };
}

export default function FarmerDashboard() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { state, setLanguage, seedFirebaseDatabase } = useAppContext();
  const currentFarmer = state.currentFarmer;

  const currentLang = (state.language || 'hi') as 'hi' | 'en' | 'or';
  const isHi = currentLang === 'hi';
  const isOr = currentLang === 'or';
  const t = TRANSLATIONS[currentLang] || TRANSLATIONS.hi;

  const [textScale, setTextScale] = useState<TextScale>(1.0);
  const [isHighContrast, setIsHighContrast] = useState(false);

  const [isSeeding, setIsSeeding] = useState(false);
  const [seedMessage, setSeedMessage] = useState<string | null>(null);
  const [showWeatherModal, setShowWeatherModal] = useState(false);
  const [activeWeatherTab, setActiveWeatherTab] = useState<'rain' | 'frost' | 'heat'>('rain');
  const [alertBannerVisible, setAlertBannerVisible] = useState(true);

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
  const farmerName = currentFarmer?.name || (isOr ? 'ଚାଷୀ ୭୮୮୮' : isHi ? 'किसान 7888' : 'Farmer 7888');
  const farmerId = currentFarmer?.id || 'F-523';
  const farmerPhone = currentFarmer?.phone
    ? currentFarmer.phone.startsWith('+')
      ? currentFarmer.phone
      : `+91 ${currentFarmer.phone}`
    : '+11234567888';
  const farmerLocation = currentFarmer?.village
    ? `${currentFarmer.village}, ${currentFarmer.district || (isOr ? 'ଭୁବନେଶ୍ୱର' : 'Bhopal')}, ${currentFarmer.state || (isOr ? 'ଓଡ଼ିଶା' : 'MP')}`
    : t.defaultLocation;
  const landArea = currentFarmer?.landArea || currentFarmer?.landAreaHectares || '4.5';
  
  // Crop name display & dynamic alignment with Market Price
  const rawFarmerCrop = currentFarmer?.primaryCrop || 'Wheat';
  const cropPriceInfo = getCropPriceInfo(rawFarmerCrop);

  const primaryCrop = currentFarmer?.primaryCrop
    ? isOr
      ? cropPriceInfo.nameOr
      : isHi && currentFarmer.primaryCrop.toLowerCase().includes('wheat')
      ? 'गेहूं (Wheat)'
      : isHi && currentFarmer.primaryCrop.toLowerCase().includes('paddy')
      ? 'धान (Paddy)'
      : isHi
      ? cropPriceInfo.nameHi
      : cropPriceInfo.nameEn
    : t.cropDefault;

  // Mandi district/city location
  const mandiLocationRaw = currentFarmer?.district || activeMandi?.district || 'Bhopal';
  const mandiLocation = isOr && (mandiLocationRaw.toLowerCase() === 'bhopal' || mandiLocationRaw.toLowerCase() === 'mp')
    ? 'ଭୋପାଲ / ଭୁବନେଶ୍ୱର'
    : isHi && (mandiLocationRaw.toLowerCase() === 'bhopal' || mandiLocationRaw.toLowerCase() === 'mp')
    ? 'भोपाल'
    : isHi && mandiLocationRaw.toLowerCase() === 'sehore'
    ? 'सीहोर'
    : mandiLocationRaw;

  // Market price card data derived directly from farmer's primary crop
  const cropMarketSubtitle = isOr
    ? `(${cropPriceInfo.nameOr}, ${mandiLocation})`
    : isHi
    ? `(${cropPriceInfo.nameHi}, ${mandiLocation})`
    : `(${cropPriceInfo.nameEn}, ${mandiLocation})`;
  const cropMarketPrice = cropPriceInfo.priceDisplay;
  const cropMarketTrend = isOr ? cropPriceInfo.trendTextOr : isHi ? cropPriceInfo.trendTextHi : cropPriceInfo.trendTextEn;

  const bankAccount = currentFarmer?.bankAccount
    ? currentFarmer.bankAccount.slice(-4)
    : currentFarmer?.bankDetails?.accountNumber
    ? currentFarmer.bankDetails.accountNumber.slice(-4)
    : '5678';
  const rawBankName = currentFarmer?.bankName || currentFarmer?.bankDetails?.bankName || 'State Bank of India';
  const bankName = isOr && (rawBankName.includes('State Bank') || rawBankName.includes('SBI'))
    ? 'ଷ୍ଟେଟ୍ ବ୍ୟାଙ୍କ ଅଫ୍ ଇଣ୍ଡିଆ'
    : isHi && (rawBankName.includes('State Bank') || rawBankName.includes('SBI'))
    ? 'भारतीय स्टेट बैंक'
    : rawBankName;

  // Active token details
  const tokenNumber = activeTx?.tokenNumber || 42;
  const tokenCrop = activeTx?.crop
    ? isOr
      ? cropPriceInfo.nameOr
      : isHi && activeTx.crop.toLowerCase().includes('paddy')
      ? 'धान'
      : isHi && activeTx.crop.toLowerCase().includes('wheat')
      ? 'गेहूं'
      : isHi
      ? cropPriceInfo.nameHi
      : activeTx.crop
    : isOr
    ? cropPriceInfo.nameOr
    : isHi
    ? cropPriceInfo.nameHi
    : cropPriceInfo.nameEn;
  const tokenQuantity = activeTx?.expectedQuantity || 20;
  const tokenMandi = activeTx?.centreName
    ? (isOr ? 'ଡେମୋ କୃଷି ଉପଜ ମଣ୍ଡି' : isHi ? 'डेमो कृषि उपज मंडी, भोपाल' : activeTx.centreName)
    : (isOr ? 'ଡେମୋ କୃଷି ଉପଜ ମଣ୍ଡି' : isHi ? 'डेमो कृषि उपज मंडी, भोपाल' : 'Demo Krishi Upaj Mandi, Bhopal');
  const tokenSlot = isOr ? 'ସକାଳ (୮:୦୦ - ୧୨:୦୦)' : isHi ? 'सुबह (8:00 - 12:00)' : (activeTx?.slotLabel || 'Morning (8:00 - 12:00)');

  return (
    <View style={[styles.screenWrapper, isHighContrast && styles.screenWrapperHighContrast]}>
      <StatusBar
        barStyle="light-content"
        backgroundColor={isHighContrast ? '#000000' : '#143F23'}
      />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 24 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* TOP FOREST GREEN / HIGH-CONTRAST BANNER AREA */}
        <View
          style={[
            styles.forestGreenHeader,
            isHighContrast && styles.forestGreenHeaderHighContrast,
            { paddingTop: Math.max(insets.top, 16) + 8 },
          ]}
        >
          {/* Subtle decorative leaf watermarks in header corner */}
          {!isHighContrast && (
            <>
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
            </>
          )}

          {/* Top Row: Brand Title + 3-Language Toggle Pill (Hindi / Odia / English) */}
          <View style={styles.headerTopRow}>
            <View style={styles.brandRow}>
              <Text style={styles.wheatIcon}>🌾</Text>
              <Text style={[styles.brandTitle, isHighContrast && styles.brandTitleHighContrast]}>
                {t.brand}
              </Text>
            </View>

            {/* Language Switcher Pill: Hindi / Odia / English */}
            <View style={[styles.langPill, isHighContrast && styles.langPillHighContrast]}>
              <TouchableOpacity
                style={[styles.langOption, isHi && styles.langOptionActive]}
                onPress={() => setLanguage('hi')}
                activeOpacity={0.8}
                accessible={true}
                accessibilityRole="button"
                accessibilityLabel="हिंदी भाषा चुनें"
              >
                <Text style={[styles.langText, isHi && styles.langTextActive]}>
                  हिंदी
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.langOption, isOr && styles.langOptionActive]}
                onPress={() => setLanguage('or')}
                activeOpacity={0.8}
                accessible={true}
                accessibilityRole="button"
                accessibilityLabel="ଓଡ଼ିଆ ଭାଷା ବାଛନ୍ତୁ"
              >
                <Text style={[styles.langText, isOr && styles.langTextActive]}>
                  ଓଡ଼ିଆ
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.langOption, !isHi && !isOr && styles.langOptionActive]}
                onPress={() => setLanguage('en')}
                activeOpacity={0.8}
                accessible={true}
                accessibilityRole="button"
                accessibilityLabel="Select English"
              >
                <Text style={[styles.langText, !isHi && !isOr && styles.langTextActive]}>
                  English
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Accessibility & Usability Toolbar: Text Size Scaler (A-, A, A+) & High Contrast Mode */}
          <AccessibilityToolbar
            lang={currentLang}
            textScale={textScale}
            onChangeTextScale={setTextScale}
            isHighContrast={isHighContrast}
            onToggleHighContrast={() => setIsHighContrast((prev) => !prev)}
          />

          {/* Live Connected Status Pill */}
          <View style={[styles.liveStatusPill, isHighContrast && styles.liveStatusPillHighContrast]}>
            <Ionicons name="pulse" size={14} color={isHighContrast ? '#FFE500' : '#6EE7B7'} />
            <Text style={[styles.liveStatusText, isHighContrast && styles.liveStatusTextHighContrast]}>
              {t.liveConnected}
            </Text>
          </View>

          {/* ACTIVE TOKEN CARD (MATCHING REFERENCE UI) */}
          <View style={[styles.activeTokenCard, isHighContrast && styles.activeTokenCardHighContrast]}>
            {/* Top Ribbon Row */}
            <View style={styles.tokenRibbonRow}>
              <View style={styles.goldRibbon}>
                <Ionicons name="ribbon-outline" size={20} color="#382506" />
                <Text style={styles.goldRibbonText}>
                  {t.tokenHeader(tokenNumber)}
                </Text>
              </View>

              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                <SpeakerButton
                  cardId="token-card"
                  getText={() => {
                    if (isOr) {
                      return `ଆପଣଙ୍କ ସକ୍ରିୟ ଟୋକନ୍ ନମ୍ବର ${tokenNumber}। ସ୍ଥିତି ବୁକ୍ ହୋଇଛି। ୩ ଜଣ ଚାଷୀ ଆଗରେ ଅଛନ୍ତି। ଆନୁମାନିକ ଅପେକ୍ଷା ସମୟ ୨୫ ମିନିଟ୍। ପହଞ୍ଚିବା ସମୟ ସକାଳ ୧୦:୧୫।`;
                    }
                    if (isHi) {
                      return `आपका सक्रिय टोकन नंबर ${tokenNumber}। स्थिति बुक्ड है। तीन किसान आगे हैं। अनुमानित प्रतीक्षा पच्चीस मिनट। पहुंचने का समय सुबह सवा दस बजे।`;
                    }
                    return `Your active token number ${tokenNumber}. Status is Booked. 3 farmers ahead. Estimated wait 25 minutes. Arrive by 10:15 AM.`;
                  }}
                  lang={currentLang}
                  size={15}
                  bgColor="rgba(255, 255, 255, 0.15)"
                  color="#E6F4EA"
                  isHighContrast={isHighContrast}
                />
                <View style={styles.bookedBadge}>
                  <Text style={styles.bookedBadgeText}>{t.booked}</Text>
                </View>
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
          {/* Urgent Agro-Met Weather Alert Banner */}
          {alertBannerVisible && (
            <TouchableOpacity
              style={[
                styles.weatherAlertBanner,
                isHighContrast && styles.bannerHighContrast,
              ]}
              onPress={() => setShowWeatherModal(true)}
              activeOpacity={0.9}
            >
              <View style={styles.weatherAlertIconBox}>
                <Ionicons name="warning" size={18} color="#FFFFFF" />
              </View>
              <View style={styles.weatherAlertTextBox}>
                <Text style={[styles.weatherAlertTitle, isHighContrast && styles.textHighContrast]} numberOfLines={1}>
                  {t.urgentAlertTitle}
                </Text>
                <Text style={[styles.weatherAlertSub, isHighContrast && styles.textSubHighContrast]} numberOfLines={1}>
                  {t.urgentAlertSub}
                </Text>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                <SpeakerButton
                  cardId="urgent-weather-alert"
                  getText={() => {
                    if (isOr) {
                      return `କୃଷି-ପାଣିପାଗ ସତର୍କତା: ଆଗାମୀ ୨୪ ରୁ ୪୮ ଘଣ୍ଟା ମଧ୍ୟରେ ୭୫ ପ୍ରତିଶତ ଅସାମୟିକ ବର୍ଷା ଏବଂ ୩୨ କିଲୋମିଟର ବେଗରେ ପ୍ରବଳ ପବନ ହେବାର ସମ୍ଭାବନା ରହିଛି। ସୁରକ୍ଷା ପାଇଁ ପରାମର୍ଶ ଦେଖନ୍ତୁ।`;
                    }
                    if (isHi) {
                      return `मौसम चेतावनी: अगले चौबीस से अड़तालीस घंटे में पिचहत्तर प्रतिशत बेमौसम बारिश और बत्तीस किलोमीटर प्रति घंटा तेज हवा की आशंका है। सुरक्षा उपाय देखें।`;
                    }
                    return `Agro-Met Weather Alert: Unseasonal rain at 75 percent and gusty winds up to 32 kilometers per hour expected in next 24 to 48 hours. Tap to view advisory.`;
                  }}
                  lang={currentLang}
                  size={15}
                  bgColor="#FEF3C7"
                  color="#B45309"
                  isHighContrast={isHighContrast}
                />
                <Ionicons name="chevron-forward" size={18} color={isHighContrast ? '#FFE500' : '#92400E'} />
              </View>
            </TouchableOpacity>
          )}

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

          {/* SECTION: NEW ADDED & ENVIRONMENT */}
          <Text style={styles.sectionHeaderTitle}>{t.envSection}</Text>

          <View style={styles.environmentRow}>
            {/* Market Price Card: Aligned dynamically with farmer's primary crop + MSP comparison */}
            <View style={[styles.environmentCard, isHighContrast && styles.cardHighContrast]}>
              <View style={styles.envCardHeaderRow}>
                <Text style={[styles.envCardTitle, isHighContrast && styles.textHighContrast]}>{t.marketPrice}</Text>
                <SpeakerButton
                  cardId="market-price-card"
                  getText={() => {
                    if (isOr) {
                      return `${primaryCrop}ର ମଣ୍ଡି ଦର। ବର୍ତ୍ତମାନ ମଣ୍ଡି ଦର ${cropMarketPrice} ପ୍ରତି କ୍ୱିଣ୍ଟାଲ। ସରକାରୀ ନିମ୍ନତମ ସହାୟକ ମୂଲ୍ୟ ଏମଏସପି ${cropPriceInfo.mspDisplay} ପ୍ରତି କ୍ୱିଣ୍ଟାଲ।`;
                    }
                    if (isHi) {
                      return `${primaryCrop} का मंडी भाव। ताज़ा मंडी भाव ${cropMarketPrice} प्रति क्विंटल। न्यूनतम समर्थन मूल्य MSP ${cropPriceInfo.mspDisplay} प्रति क्विंटल।`;
                    }
                    return `Market price for ${primaryCrop}. Current mandi price is ${cropMarketPrice} per quintal. Minimum Support Price MSP is ${cropPriceInfo.mspDisplay} per quintal.`;
                  }}
                  lang={currentLang}
                  size={14}
                  isHighContrast={isHighContrast}
                />
              </View>
              <Text style={[styles.envCardSub, isHighContrast && styles.textSubHighContrast]} numberOfLines={1}>
                {cropMarketSubtitle}
              </Text>

              {/* Main Price Row with /q */}
              <View style={styles.priceRow}>
                <Text style={[styles.envPriceBig, isHighContrast && styles.priceHighContrast]}>
                  {cropMarketPrice}
                  <Text style={[styles.priceUnitSlash, isHighContrast && styles.textSubHighContrast]}>/q</Text>
                </Text>
                <View style={styles.arrowUpPill}>
                  <Ionicons name="arrow-up" size={12} color="#2E7D32" />
                </View>
              </View>

              {/* Explicit unit below the market price */}
              <Text style={[styles.unitSubText, isHighContrast && styles.textSubHighContrast]}>{t.unitBelowPrice}</Text>

              {/* MSP Comparison display */}
              <View style={[styles.mspCompareBox, isHighContrast && styles.mspCompareBoxHighContrast]}>
                <Text style={[styles.mspCompareText, isHighContrast && styles.textHighContrast]}>
                  {t.mandiPrefix} {cropMarketPrice}/q / {t.mspPrefix} {cropPriceInfo.mspDisplay}/q
                </Text>
                <View style={styles.mspBenefitTag}>
                  <Text style={styles.mspBenefitTagText}>{cropMarketTrend}</Text>
                </View>
              </View>
            </View>

            {/* Actionable Weather Insights (Agro-met Advisory) Card */}
            <TouchableOpacity
              style={[styles.environmentCard, isHighContrast && styles.cardHighContrast]}
              onPress={() => setShowWeatherModal(true)}
              activeOpacity={0.85}
            >
              <View style={styles.agroHeaderRow}>
                <Text style={[styles.envCardTitle, isHighContrast && styles.textHighContrast]}>{t.agroMetTitle}</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                  <SpeakerButton
                    cardId="agro-met-card"
                    getText={() => {
                      if (isOr) {
                        return `କୃଷି-ପାଣିପାଗ ପରାମର୍ଶ। ତାପମାତ୍ରା ୩୨ ଡିଗ୍ରୀ, ପବନ ୧୮ କିମି ପ୍ରତି ଘଣ୍ଟା। ବର୍ଷା ସମ୍ଭାବନା: ୨୪ ଘଣ୍ଟାରେ ୨୦ ପ୍ରତିଶତ, ୪୮ ଘଣ୍ଟାରେ ୭୫ ପ୍ରତିଶତ। ଜରୁରୀ ପରାମର୍ଶ: କଟା ଫସଲକୁ ତାରପୋଲିନରେ ଘୋଡ଼ାନ୍ତୁ ଏବଂ କୀଟନାଶକ ସ୍ପ୍ରେ ବନ୍ଦ ରଖନ୍ତୁ।`;
                      }
                      if (isHi) {
                        return `कृषि-मौसम सलाह। तापमान बत्तीस डिग्री, हवा अठारह किलोमीटर प्रति घंटा। बारिश की संभावना: चौबीस घंटे में बीस प्रतिशत, अड़तालीस घंटे में पिचहत्तर प्रतिशत। जरूरी सलाह: कटी फसल को ढकें, कीटनाशक छिड़काव रोकें।`;
                      }
                      return `Agro-met Advisory. Temperature 32 degrees, wind speed 18 kilometers per hour. Rain probability: 20 percent in 24 hours, 75 percent in 48 hours. Advisory: Cover harvested produce and pause spray.`;
                    }}
                    lang={currentLang}
                    size={14}
                    isHighContrast={isHighContrast}
                  />
                  <View style={styles.alertMiniPill}>
                    <Ionicons name="warning" size={10} color="#D97706" />
                    <Text style={styles.alertMiniPillText}>{t.alertTag}</Text>
                  </View>
                </View>
              </View>
              <Text style={[styles.envCardSub, isHighContrast && styles.textSubHighContrast]} numberOfLines={1}>
                {mandiLocation} • {t.agroMetDuration}
              </Text>

              {/* Temp & Wind Speed Row */}
              <View style={styles.agroMetricsRow}>
                <View style={styles.weatherRow}>
                  <Text style={styles.weatherEmoji}>⛅</Text>
                  <Text style={[styles.weatherTempBig, isHighContrast && styles.textHighContrast]}>32°C</Text>
                </View>
                <View style={styles.windSpeedBadge}>
                  <Ionicons name="speedometer-outline" size={11} color="#1E3A8A" />
                  <Text style={styles.windSpeedText}>{t.windSpeedText}</Text>
                </View>
              </View>

              {/* Rain Probability for next 24-48 Hours */}
              <View style={[styles.rainProbBox, isHighContrast && styles.rainProbBoxHighContrast]}>
                <Text style={[styles.rainProbTitle, isHighContrast && styles.textHighContrast]}>🌧️ {t.rainProbLabel}</Text>
                <View style={styles.rainProbItemsRow}>
                  <Text style={styles.rainProb24}>24h: 20%</Text>
                  <Text style={styles.rainProbDivider}>|</Text>
                  <Text style={styles.rainProb48}>48h: 75% ⚠️</Text>
                </View>
              </View>

              {/* Actionable Advisory CTA */}
              <View style={styles.agroSnippetBox}>
                <Text style={styles.agroSnippetText} numberOfLines={1}>
                  ⚠️ {t.advisorySnippet}
                </Text>
              </View>
              <Text style={[styles.viewAdvisoryLink, isHighContrast && styles.textHighlightHighContrast]}>{t.tapForAdvisory}</Text>
            </TouchableOpacity>
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

      {/* AGRO-MET WEATHER WARNING & PRECAUTION POP-UP MODAL */}
      <Modal
        visible={showWeatherModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowWeatherModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContentCard}>
            {/* Modal Header */}
            <View style={styles.modalHeaderRow}>
              <View style={styles.modalTitleBadge}>
                <Ionicons name="warning" size={18} color="#D97706" />
                <Text style={[styles.modalHeaderTitle, isHighContrast && styles.textHighContrast]} numberOfLines={1}>
                  {t.modalTitle}
                </Text>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                <SpeakerButton
                  cardId="modal-weather-advisory"
                  getText={() => {
                    if (activeWeatherTab === 'rain') {
                      return isOr
                        ? `ଅସାମୟିକ ବର୍ଷା ସତର୍କତା: ୪୮ ଘଣ୍ଟାରେ ୭୫ ପ୍ରତିଶତ ବର୍ଷା ସମ୍ଭାବନା। ପଦକ୍ଷେପ ଏକ: କଟା ଫସଲକୁ ତାରପୋଲିନ ଦ୍ୱାରା ଘୋଡ଼ାନ୍ତୁ। ପଦକ୍ଷେପ ଦୁଇ: ୪୮ ଘଣ୍ଟା ଯାଏଁ ସାର ଓ କୀଟନାଶକ ପ୍ରୟୋଗ ବନ୍ଦ ରଖନ୍ତୁ। ପଦକ୍ଷେପ ତିନି: କ୍ଷେତରେ ନାଳୀ ସଫା କରି ଜଳ ନିଷ୍କାସନ ବ୍ୟବସ୍ଥା କରନ୍ତୁ। କିଷାନ କଲ୍ ସେଣ୍ଟର: ୧୮୦୦-୧୮୦-୧୫୫୧।`
                        : isHi
                        ? `बेमौसम बारिश सलाह: अड़तालीस घंटे में पिचहत्तर प्रतिशत बारिश। कदम एक: कटी फसल को तिरपाल से ढकें। कदम दो: अड़तालीस घंटे तक कीटनाशक छिड़काव रोकें। कदम तीन: जलनिकासी नालियां साफ रखें। किसान कॉल सेंटर: 1800-180-1551।`
                        : `Unseasonal Rain Advisory: 75 percent rain probability in 48 hours. Step 1: Cover harvested crops with tarpaulin. Step 2: Postpone chemical spraying and irrigation for 48 hours. Step 3: Clear drainage furrows. Kisan Call Centre toll free: 1800-180-1551.`;
                    }
                    if (activeWeatherTab === 'frost') {
                      return isOr
                        ? `କାକର ଓ ଶୀତଲହରୀ ପରାମର୍ଶ। ପଦକ୍ଷେପ ଏକ: ସନ୍ଧ୍ୟାରେ ହାଲୁକା ପାଣି ମଡ଼ାନ୍ତୁ। ପଦକ୍ଷେପ ଦୁଇ: କ୍ଷେତର ଉତ୍ତର-ପଶ୍ଚିମ ସୀମାରେ ଧୂଆଁ ସୃଷ୍ଟି କରନ୍ତୁ। ପଦକ୍ଷେପ ତିନି: ପନିପରିବା ନର୍ସରୀକୁ ନଡ଼ା କିମ୍ବା ପଲିଥିନରେ ଢାଙ୍କନ୍ତୁ।`
                        : isHi
                        ? `पाला और शीतलहर सलाह। कदम एक: शाम के समय हल्की सिंचाई करें। कदम दो: उत्तर पश्चिम मेड़ों पर जैविक कचरे का धुआं करें। कदम तीन: नर्सरी और सब्जियों को पुआल से ढकें।`
                        : `Frost and cold wave advisory. Step 1: Apply light evening irrigation. Step 2: Create light smoke on north-west border. Step 3: Cover nurseries and vegetable plants with straw or plastic.`;
                    }
                    return isOr
                      ? `ପ୍ରଚଣ୍ଡ ଖରା ଓ ଲୁ ପରାମର୍ଶ। ପଦକ୍ଷେପ ଏକ: କେବଳ ସକାଳେ କିମ୍ବା ସନ୍ଧ୍ୟାରେ ଜଳସେଚନ କରନ୍ତୁ। ପଦକ୍ଷେପ ଦୁଇ: ନଡ଼ାର ମଲଚିଂ ବ୍ୟବହାର କରନ୍ତୁ। ପଦକ୍ଷେପ ତିନି: ଗୃହପାଳିତ ପଶୁଙ୍କୁ ଛାଇରେ ରଖନ୍ତୁ ଓ ପ୍ରଚୁର ଥଣ୍ଡା ପାଣି ଦିଅନ୍ତୁ।`
                      : isHi
                      ? `लू और प्रचंड गर्मी सलाह। कदम एक: केवल सुबह या देर शाम हल्की सिंचाई करें। कदम दो: पुआल की मल्चिंग बिछाएं। कदम तीन: पशुओं को छायादार जगह में रखें और भरपूर ठंडा पानी दें।`
                      : `Heatwave advisory. Step 1: Irrigate strictly during early morning or late evening. Step 2: Apply organic mulch to conserve moisture. Step 3: Keep cattle in shaded shelters with plenty of clean water.`;
                  }}
                  lang={currentLang}
                  size={15}
                  showLabel={true}
                  isHighContrast={isHighContrast}
                />
                <TouchableOpacity
                  onPress={() => setShowWeatherModal(false)}
                  style={styles.modalCloseBtn}
                  accessible={true}
                  accessibilityRole="button"
                  accessibilityLabel="Close weather modal"
                >
                  <Ionicons name="close" size={22} color="#64748B" />
                </TouchableOpacity>
              </View>
            </View>

            <Text style={styles.modalSubHeader}>
              {t.modalSub} • {mandiLocation}
            </Text>

            {/* Advisory Type Tabs: Unseasonal Rain, Frost, Heatwave */}
            <View style={styles.warningTabsRow}>
              <TouchableOpacity
                style={[
                  styles.warningTab,
                  activeWeatherTab === 'rain' && styles.warningTabActiveRain,
                ]}
                onPress={() => setActiveWeatherTab('rain')}
              >
                <Text
                  style={[
                    styles.warningTabText,
                    activeWeatherTab === 'rain' && styles.warningTabTextActive,
                  ]}
                >
                  {t.tabRain}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.warningTab,
                  activeWeatherTab === 'frost' && styles.warningTabActiveFrost,
                ]}
                onPress={() => setActiveWeatherTab('frost')}
              >
                <Text
                  style={[
                    styles.warningTabText,
                    activeWeatherTab === 'frost' && styles.warningTabTextActive,
                  ]}
                >
                  {t.tabFrost}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.warningTab,
                  activeWeatherTab === 'heat' && styles.warningTabActiveHeat,
                ]}
                onPress={() => setActiveWeatherTab('heat')}
              >
                <Text
                  style={[
                    styles.warningTabText,
                    activeWeatherTab === 'heat' && styles.warningTabTextActive,
                  ]}
                >
                  {t.tabHeat}
                </Text>
              </TouchableOpacity>
            </View>

            {/* Key Metrics Strip based on selected tab */}
            <View style={styles.modalMetricsBox}>
              {activeWeatherTab === 'rain' && (
                <>
                  <View style={styles.modalMetricItem}>
                    <Text style={styles.modalMetricLabel}>Rain Prob (24h)</Text>
                    <Text style={styles.modalMetricVal}>20% (Light)</Text>
                  </View>
                  <View style={styles.modalMetricDivider} />
                  <View style={styles.modalMetricItem}>
                    <Text style={styles.modalMetricLabel}>Rain Prob (48h)</Text>
                    <Text style={[styles.modalMetricVal, { color: '#DC2626' }]}>75% (Heavy ⚠️)</Text>
                  </View>
                  <View style={styles.modalMetricDivider} />
                  <View style={styles.modalMetricItem}>
                    <Text style={styles.modalMetricLabel}>Wind Gusts</Text>
                    <Text style={styles.modalMetricVal}>32 km/h</Text>
                  </View>
                </>
              )}

              {activeWeatherTab === 'frost' && (
                <>
                  <View style={styles.modalMetricItem}>
                    <Text style={styles.modalMetricLabel}>Min Temp</Text>
                    <Text style={[styles.modalMetricVal, { color: '#2563EB' }]}>3.5°C ❄️</Text>
                  </View>
                  <View style={styles.modalMetricDivider} />
                  <View style={styles.modalMetricItem}>
                    <Text style={styles.modalMetricLabel}>Ground Temp</Text>
                    <Text style={styles.modalMetricVal}>1.8°C</Text>
                  </View>
                  <View style={styles.modalMetricDivider} />
                  <View style={styles.modalMetricItem}>
                    <Text style={styles.modalMetricLabel}>Risk Window</Text>
                    <Text style={styles.modalMetricVal}>2:00 - 6:00 AM</Text>
                  </View>
                </>
              )}

              {activeWeatherTab === 'heat' && (
                <>
                  <View style={styles.modalMetricItem}>
                    <Text style={styles.modalMetricLabel}>Max Temp</Text>
                    <Text style={[styles.modalMetricVal, { color: '#EA580C' }]}>43.2°C ☀️</Text>
                  </View>
                  <View style={styles.modalMetricDivider} />
                  <View style={styles.modalMetricItem}>
                    <Text style={styles.modalMetricLabel}>Heat Index</Text>
                    <Text style={styles.modalMetricVal}>Extreme</Text>
                  </View>
                  <View style={styles.modalMetricDivider} />
                  <View style={styles.modalMetricItem}>
                    <Text style={styles.modalMetricLabel}>Peak Hours</Text>
                    <Text style={styles.modalMetricVal}>12:00 - 4:00 PM</Text>
                  </View>
                </>
              )}
            </View>

            {/* Actionable Steps for Farmer */}
            <Text style={styles.checklistHeading}>{t.precautionsTitle}</Text>

            <View style={styles.modalStepList}>
              {activeWeatherTab === 'rain' && (
                <>
                  <View style={styles.stepItemRow}>
                    <View style={styles.stepNumberBadge}><Text style={styles.stepNumberText}>1</Text></View>
                    <Text style={styles.stepText}>{t.rainStep1}</Text>
                  </View>
                  <View style={styles.stepItemRow}>
                    <View style={styles.stepNumberBadge}><Text style={styles.stepNumberText}>2</Text></View>
                    <Text style={styles.stepText}>{t.rainStep2}</Text>
                  </View>
                  <View style={styles.stepItemRow}>
                    <View style={styles.stepNumberBadge}><Text style={styles.stepNumberText}>3</Text></View>
                    <Text style={styles.stepText}>{t.rainStep3}</Text>
                  </View>
                </>
              )}

              {activeWeatherTab === 'frost' && (
                <>
                  <View style={styles.stepItemRow}>
                    <View style={styles.stepNumberBadge}><Text style={styles.stepNumberText}>1</Text></View>
                    <Text style={styles.stepText}>{t.frostStep1}</Text>
                  </View>
                  <View style={styles.stepItemRow}>
                    <View style={styles.stepNumberBadge}><Text style={styles.stepNumberText}>2</Text></View>
                    <Text style={styles.stepText}>{t.frostStep2}</Text>
                  </View>
                  <View style={styles.stepItemRow}>
                    <View style={styles.stepNumberBadge}><Text style={styles.stepNumberText}>3</Text></View>
                    <Text style={styles.stepText}>{t.frostStep3}</Text>
                  </View>
                </>
              )}

              {activeWeatherTab === 'heat' && (
                <>
                  <View style={styles.stepItemRow}>
                    <View style={styles.stepNumberBadge}><Text style={styles.stepNumberText}>1</Text></View>
                    <Text style={styles.stepText}>{t.heatStep1}</Text>
                  </View>
                  <View style={styles.stepItemRow}>
                    <View style={styles.stepNumberBadge}><Text style={styles.stepNumberText}>2</Text></View>
                    <Text style={styles.stepText}>{t.heatStep2}</Text>
                  </View>
                  <View style={styles.stepItemRow}>
                    <View style={styles.stepNumberBadge}><Text style={styles.stepNumberText}>3</Text></View>
                    <Text style={styles.stepText}>{t.heatStep3}</Text>
                  </View>
                </>
              )}
            </View>

            {/* Kisan Call Center Helpline Info */}
            <View style={styles.kisanHelpBox}>
              <Ionicons name="call" size={14} color="#15803D" />
              <Text style={styles.kisanHelpText}>{t.kisanCallCenter}</Text>
            </View>

            {/* Acknowledge CTA Button */}
            <TouchableOpacity
              style={styles.modalDismissBtn}
              onPress={() => setShowWeatherModal(false)}
              activeOpacity={0.85}
            >
              <Text style={styles.modalDismissBtnText}>{t.dismissBtn}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
  langPillHighContrast: {
    backgroundColor: '#000000',
    borderColor: '#FFE500',
    borderWidth: 2,
  },
  langOption: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 16,
  },
  langOptionActive: {
    backgroundColor: '#2A6F42',
  },
  langText: {
    fontSize: 12,
    color: '#B0D8BC',
    fontWeight: '700',
  },
  langTextActive: {
    color: '#FFFFFF',
    fontWeight: '900',
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
  /* AGRO-MET & WEATHER ALERT STYLES */
  weatherAlertBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginBottom: 12,
    borderWidth: 1.5,
    borderColor: '#F59E0B',
  },
  weatherAlertIconBox: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#D97706',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  weatherAlertTextBox: {
    flex: 1,
  },
  weatherAlertTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#92400E',
  },
  weatherAlertSub: {
    fontSize: 10,
    color: '#B45309',
    marginTop: 1,
  },

  agroHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  alertMiniPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    borderRadius: 6,
    paddingHorizontal: 5,
    paddingVertical: 1.5,
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  alertMiniPillText: {
    fontSize: 8,
    fontWeight: '800',
    color: '#B45309',
    marginLeft: 2,
  },
  agroMetricsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  windSpeedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#DBEAFE',
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  windSpeedText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#1E3A8A',
    marginLeft: 3,
  },
  rainProbBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    paddingVertical: 5,
    paddingHorizontal: 7,
    borderWidth: 1,
    borderColor: '#EFE5D0',
    marginTop: 4,
  },
  rainProbTitle: {
    fontSize: 9,
    fontWeight: '700',
    color: '#1E293B',
  },
  rainProbItemsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 2,
  },
  rainProb24: {
    fontSize: 10,
    color: '#475569',
    fontWeight: '700',
  },
  rainProbDivider: {
    fontSize: 10,
    color: '#CBD5E1',
    marginHorizontal: 3,
  },
  rainProb48: {
    fontSize: 10,
    color: '#DC2626',
    fontWeight: '900',
  },
  agroSnippetBox: {
    marginTop: 4,
  },
  agroSnippetText: {
    fontSize: 9,
    fontWeight: '700',
    color: '#B45309',
  },
  viewAdvisoryLink: {
    fontSize: 9,
    fontWeight: '800',
    color: '#1E5631',
    marginTop: 4,
    textDecorationLine: 'underline',
  },

  weatherRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  weatherEmoji: {
    fontSize: 20,
    marginRight: 4,
  },
  weatherTempBig: {
    fontSize: 18,
    fontWeight: '900',
    color: '#1A202C',
  },

  /* MODAL STYLES */
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  modalContentCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 18,
    width: '100%',
    maxWidth: 420,
    maxHeight: '90%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 8,
  },
  modalHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  modalTitleBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  modalHeaderTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#92400E',
    marginLeft: 6,
  },
  modalCloseBtn: {
    padding: 4,
  },
  modalSubHeader: {
    fontSize: 10,
    color: '#64748B',
    marginBottom: 12,
  },
  warningTabsRow: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: 10,
  },
  warningTab: {
    flex: 1,
    paddingVertical: 7,
    paddingHorizontal: 2,
    borderRadius: 8,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#CBD5E1',
  },
  warningTabActiveRain: {
    backgroundColor: '#EFF6FF',
    borderColor: '#3B82F6',
  },
  warningTabActiveFrost: {
    backgroundColor: '#F0FDF4',
    borderColor: '#10B981',
  },
  warningTabActiveHeat: {
    backgroundColor: '#FFF7ED',
    borderColor: '#F97316',
  },
  warningTabText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#475569',
  },
  warningTabTextActive: {
    color: '#0F172A',
    fontWeight: '900',
  },
  modalMetricsBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#FEF3C7',
    borderRadius: 10,
    padding: 8,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  modalMetricItem: {
    alignItems: 'center',
    flex: 1,
  },
  modalMetricLabel: {
    fontSize: 9,
    color: '#78350F',
    fontWeight: '600',
  },
  modalMetricVal: {
    fontSize: 11,
    fontWeight: '800',
    color: '#92400E',
    marginTop: 2,
  },
  modalMetricDivider: {
    width: 1,
    height: '80%',
    backgroundColor: '#FCD34D',
    alignSelf: 'center',
  },
  checklistHeading: {
    fontSize: 12,
    fontWeight: '800',
    color: '#1E293B',
    marginBottom: 8,
  },
  modalStepList: {
    marginBottom: 10,
    gap: 6,
  },
  stepItemRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  stepNumberBadge: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#166534',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
    marginTop: 1,
  },
  stepNumberText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
  },
  stepText: {
    flex: 1,
    fontSize: 11,
    color: '#334155',
    lineHeight: 15,
  },
  kisanHelpBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0FDF4',
    borderRadius: 8,
    padding: 7,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#BBF7D0',
  },
  kisanHelpText: {
    fontSize: 9,
    fontWeight: '700',
    color: '#166534',
    marginLeft: 6,
    flex: 1,
  },
  modalDismissBtn: {
    backgroundColor: '#15803D',
    borderRadius: 10,
    paddingVertical: 11,
    alignItems: 'center',
  },
  modalDismissBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
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

  /* HEADER & ENVIRONMENT FLEX HELPERS */
  envCardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  /* HIGH CONTRAST OUTDOOR ACCESSIBILITY THEME */
  screenWrapperHighContrast: {
    backgroundColor: '#000000',
  },
  forestGreenHeaderHighContrast: {
    backgroundColor: '#000000',
    borderBottomWidth: 3,
    borderBottomColor: '#FFE500',
  },
  brandTitleHighContrast: {
    color: '#FFE500',
  },
  liveStatusPillHighContrast: {
    backgroundColor: '#1C1C1E',
    borderColor: '#FFE500',
    borderWidth: 1,
  },
  liveStatusTextHighContrast: {
    color: '#FFE500',
    fontWeight: '800',
  },
  activeTokenCardHighContrast: {
    backgroundColor: '#000000',
    borderColor: '#FFE500',
    borderWidth: 2,
  },
  cardHighContrast: {
    backgroundColor: '#000000',
    borderColor: '#FFE500',
    borderWidth: 2,
  },
  bannerHighContrast: {
    backgroundColor: '#000000',
    borderColor: '#FFE500',
    borderWidth: 2,
  },
  textHighContrast: {
    color: '#FFFFFF',
    fontWeight: '800',
  },
  textSubHighContrast: {
    color: '#E2E8F0',
    fontWeight: '700',
  },
  textHighlightHighContrast: {
    color: '#FFE500',
    fontWeight: '900',
  },
  priceHighContrast: {
    color: '#00FF66',
  },
  mspCompareBoxHighContrast: {
    backgroundColor: '#111111',
    borderColor: '#FFFFFF',
  },
  rainProbBoxHighContrast: {
    backgroundColor: '#111111',
    borderColor: '#FFFFFF',
  },
});