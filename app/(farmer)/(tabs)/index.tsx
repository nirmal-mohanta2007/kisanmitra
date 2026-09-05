import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  StatusBar,
  ActivityIndicator,
  Modal,
  Share,
} from 'react-native';
import { AppText as Text } from '../../../src/components/common/AppText';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { MOCK_TRANSACTIONS, MOCK_CENTRES } from '../../../src/services/mock-data.service';
import { useAppContext } from '../../../src/store/app-context';
import { SpeakerButton } from '../../../src/components/SpeakerButton';
import { AccessibilityToolbar, TextScale } from '../../../src/components/AccessibilityToolbar';
import { weatherService, RealTimeWeather } from '../../../src/services/weather.service';

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
    qualityPassed: 'क्वालिटी जांच पास • ग्रेड A',
    payoutTitle: 'अनुमानित भुगतान विवरण (Payout Breakdown)',
    netWeight: 'शुद्ध वजन',
    mspRateLabel: 'एमएसपी दर',
    totalPayoutLabel: 'कुल भुगतान',
    qtlShort: 'क्विंटल',
    dbtCreditNote: 'डीबीटी द्वारा बैंक खाते में सीधा भुगतान',
    downloadJForm: 'बिक्री रसीद / J-फॉर्म डाउनलोड करें',
    jFormSub: 'स्थानीय रिकॉर्ड हेतु हस्ताक्षरित वजन एवं भुगतान पर्ची',
    viewDigitalReceipt: 'पूरी डिजिटल वजन पर्ची व रसीद देखें →',
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
    qualityPassed: 'ଗୁଣବତ୍ତା ଯାଞ୍ଚ ସଫଳ • ଗ୍ରେଡ୍ A',
    payoutTitle: 'ଆନୁମାନିକ ପାଉଣା ହିସାବ (Payout Breakdown)',
    netWeight: 'ନିଟ୍ ଓଜନ',
    mspRateLabel: 'MSP ଦର',
    totalPayoutLabel: 'ସମୁଦାୟ ପାଉଣା',
    qtlShort: 'କ୍ୱିଣ୍ଟାଲ',
    dbtCreditNote: 'ଡିବିଟି ଦ୍ୱାରା ବ୍ୟାଙ୍କ ଖାତାକୁ ସିଧାସଳଖ ଦେୟ',
    downloadJForm: 'ବିକ୍ରି ରସିଦ / J-ଫର୍ମ ଡାଉନଲୋଡ୍ କରନ୍ତୁ',
    jFormSub: 'ସ୍ଥାନୀୟ ରେକର୍ଡ ପାଇଁ ହସ୍ତାକ୍ଷରିତ ଓଜନ ଓ ଦେୟ ରସିଦ',
    viewDigitalReceipt: 'ସମ୍ପୂର୍ଣ୍ଣ ଡିଜିଟାଲ୍ ଓଜନ ପର୍ଚି ଦେଖନ୍ତୁ →',
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
    qualityPassed: 'Quality Check Passed • Grade A',
    payoutTitle: 'Estimated Payout Breakdown',
    netWeight: 'Net Weight',
    mspRateLabel: 'MSP Rate',
    totalPayoutLabel: 'Total Payout',
    qtlShort: 'Qtl',
    dbtCreditNote: 'Direct DBT settlement to bank account',
    downloadJForm: 'Download Sale Receipt / J-Form',
    jFormSub: 'Signed weight and payment slip for local records',
    viewDigitalReceipt: 'View Full Digital Weight Slip & Receipt →',
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

interface CropMandiInfo {
  mandiName: string;
  mandiAddress: string;
  fullDisplay: string;
}

function getCropMandiInfo(rawCrop: string | undefined, isOr: boolean, isHi: boolean): CropMandiInfo {
  const c = (rawCrop || 'wheat').toLowerCase();

  // 1. Paddy / Dhan / Rice
  if (c.includes('paddy') || c.includes('धान') || c.includes('ଧାନ') || c.includes('rice')) {
    if (isOr) {
      return {
        mandiName: 'ଆରଏମସି କ୍ରୟ କେନ୍ଦ୍ର, ଭୁବନେଶ୍ୱର',
        mandiAddress: 'NH-୧୬, କ୍ରୟ ମଣ୍ଡି, ଭୁବନେଶ୍ୱର',
        fullDisplay: 'ଆରଏମସି ମଣ୍ଡି, NH-୧୬, ଭୁବନେଶ୍ୱର (ଓଡ଼ିଶା)',
      };
    }
    if (isHi) {
      return {
        mandiName: 'राज्य क्रय केंद्र (धान मंडी), जबलपुर',
        mandiAddress: 'राइट टाउन, मंडी यार्ड, जबलपुर, म.प्र.',
        fullDisplay: 'राज्य क्रय केंद्र, राइट टाउन, जबलपुर (म.प्र.)',
      };
    }
    return {
      mandiName: 'Rajya Kray Kendra, Jabalpur',
      mandiAddress: 'Wright Town, APMC Yard, Jabalpur, MP',
      fullDisplay: 'Rajya Kray Kendra, Wright Town, Jabalpur (MP)',
    };
  }

  // 2. Soybean
  if (c.includes('soybean') || c.includes('सोयाबीन') || c.includes('ସୋୟାବିନ୍')) {
    if (isOr) {
      return {
        mandiName: 'କିଷାନ ସେବା କେନ୍ଦ୍ର, ଇନ୍ଦୋର',
        mandiAddress: 'ମହୁ ରୋଡ୍, ମଣ୍ଡି ପରିସର, ଇନ୍ଦୋର',
        fullDisplay: 'କିଷାନ ସେବା କେନ୍ଦ୍ର, ମହୁ ରୋଡ୍, ଇନ୍ଦୋର (ମ.ପ୍ର.)',
      };
    }
    if (isHi) {
      return {
        mandiName: 'किसान सेवा केंद्र, इंदौर',
        mandiAddress: 'महू रोड, मंडी परिसर, इंदौर, म.प्र.',
        fullDisplay: 'किसान सेवा केंद्र, महू रोड, इंदौर (म.प्र.)',
      };
    }
    return {
      mandiName: 'Kisan Seva Kendra, Indore',
      mandiAddress: 'Mhow Road, Mandi Parisar, Indore, MP',
      fullDisplay: 'Kisan Seva Kendra, Mhow Road, Indore (MP)',
    };
  }

  // 3. Mustard / Sarson
  if (c.includes('mustard') || c.includes('सरसों') || c.includes('ସୋରିଷ')) {
    if (isOr) {
      return {
        mandiName: 'କୃଷି ଉପଜ ମଣ୍ଡି, ମୋରେନା',
        mandiAddress: 'ଏବି ରୋଡ୍, ମଣ୍ଡି ୟାର୍ଡ, ମୋରେନା',
        fullDisplay: 'କୃଷି ଉପଜ ମଣ୍ଡି, ଏବି ରୋଡ୍, ମୋରେନା (ମ.ପ୍ର.)',
      };
    }
    if (isHi) {
      return {
        mandiName: 'कृषि उपज मंडी (तिलहन केंद्र), मुरैना',
        mandiAddress: 'एबी रोड, कृषि मंडी यार्ड, मुरैना, म.प्र.',
        fullDisplay: 'कृषि उपज मंडी, एबी रोड, मुरैना (म.प्र.)',
      };
    }
    return {
      mandiName: 'Krishi Upaj Mandi, Morena',
      mandiAddress: 'AB Road, APMC Yard, Morena, MP',
      fullDisplay: 'Krishi Upaj Mandi, AB Road, Morena (MP)',
    };
  }

  // 4. Maize / Makka
  if (c.includes('maize') || c.includes('मक्का') || c.includes('ମକା')) {
    if (isOr) {
      return {
        mandiName: 'କୃଷି ଉପଜ ମଣ୍ଡି, ଛିନ୍ଦୱାଡ଼ା',
        mandiAddress: 'ନାଗପୁର ରୋଡ୍, ଛିନ୍ଦୱାଡ଼ା',
        fullDisplay: 'କୃଷି ଉପଜ ମଣ୍ଡି, ନାଗପୁର ରୋଡ୍, ଛିନ୍ଦୱାଡ଼ା',
      };
    }
    if (isHi) {
      return {
        mandiName: 'कृषि उपज मंडी, छिंदवाड़ा',
        mandiAddress: 'नागपुर रोड, मंडी परिसर, छिंदवाड़ा, म.प्र.',
        fullDisplay: 'कृषि उपज मंडी, नागपुर रोड, छिंदवाड़ा (म.प्र.)',
      };
    }
    return {
      mandiName: 'Krishi Upaj Mandi, Chhindwara',
      mandiAddress: 'Nagpur Road, Mandi Complex, Chhindwara, MP',
      fullDisplay: 'Krishi Upaj Mandi, Nagpur Road, Chhindwara (MP)',
    };
  }

  // 5. Cotton / Kapas
  if (c.includes('cotton') || c.includes('कपास') || c.includes('କପା')) {
    if (isOr) {
      return {
        mandiName: 'ସିସିଆଇ କପା କ୍ରୟ କେନ୍ଦ୍ର, ଖାରଗୋନ୍',
        mandiAddress: 'ସନାୱଦ ରୋଡ୍, ଖାରଗୋନ୍',
        fullDisplay: 'ସିସିଆଇ କପା କ୍ରୟ କେନ୍ଦ୍ର, ସନାୱଦ ରୋଡ୍, ଖାରଗୋନ୍',
      };
    }
    if (isHi) {
      return {
        mandiName: 'सीसीआई कपास खरीद केंद्र, खरगोन',
        mandiAddress: 'सनावद रोड, कपास मंडी यार्ड, खरगोन, म.प्र.',
        fullDisplay: 'सीसीआई कपास खरीद केंद्र, सनावद रोड, खरगोन (म.प्र.)',
      };
    }
    return {
      mandiName: 'CCI Cotton Procurement Centre, Khargone',
      mandiAddress: 'Sanawad Road, Cotton Yard, Khargone, MP',
      fullDisplay: 'CCI Cotton Procurement Centre, Sanawad Road, Khargone (MP)',
    };
  }

  // 6. Gram / Chana
  if (c.includes('gram') || c.includes('chana') || c.includes('चना') || c.includes('ଚଣା') || c.includes('ବୁଟ')) {
    if (isOr) {
      return {
        mandiName: 'କୃଷି ଉପଜ ମଣ୍ଡି, ଉଜ୍ଜୈନ',
        mandiAddress: 'ଦେୱାସ ରୋଡ୍, ଉଜ୍ଜୈନ',
        fullDisplay: 'କୃଷି ଉପଜ ମଣ୍ଡି, ଦେୱାସ ରୋଡ୍, ଉଜ୍ଜୈନ',
      };
    }
    if (isHi) {
      return {
        mandiName: 'कृषि उपज मंडी (दलहन केंद्र), उज्जैन',
        mandiAddress: 'देवास रोड, मंडी प्रांगण, उज्जैन, म.प्र.',
        fullDisplay: 'कृषि उपज मंडी, देवास रोड, उज्जैन (म.प्र.)',
      };
    }
    return {
      mandiName: 'Krishi Upaj Mandi, Ujjain',
      mandiAddress: 'Dewas Road, APMC Yard, Ujjain, MP',
      fullDisplay: 'Krishi Upaj Mandi, Dewas Road, Ujjain (MP)',
    };
  }

  // Default Wheat (Krishi Upaj Mandi, Karond, Bhopal / Sehore Division)
  if (isOr) {
    return {
      mandiName: 'କୃଷି ଉପଜ ମଣ୍ଡି, ଭୋପାଲ',
      mandiAddress: 'କରୋନ୍ଦ ବାଇପାସ୍ ରୋଡ୍, ଭୋପାଲ',
      fullDisplay: 'କୃଷି ଉପଜ ମଣ୍ଡି, କରୋନ୍ଦ ବାଇପାସ୍ ରୋଡ୍, ଭୋପାଲ',
    };
  }
  if (isHi) {
    return {
      mandiName: 'कृषि उपज मंडी, करोंद, भोपाल',
      mandiAddress: 'करोंद बायपास रोड, मंडी प्रांगण, भोपाल, म.प्र.',
      fullDisplay: 'कृषि उपज मंडी, करोंद बायपास रोड, भोपाल',
    };
  }
  return {
    mandiName: 'Krishi Upaj Mandi, Bhopal',
    mandiAddress: 'Karond Bypass Road, APMC Yard, Bhopal, MP',
    fullDisplay: 'Krishi Upaj Mandi, Karond Bypass Road, Bhopal',
  };
}

export default function FarmerDashboard() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { state, setLanguage, setTextScale } = useAppContext();
  const currentFarmer = state.currentFarmer;

  const currentLang = (state.language || 'hi') as 'hi' | 'en' | 'or';
  const isHi = currentLang === 'hi';
  const isOr = currentLang === 'or';
  const t = TRANSLATIONS[currentLang] || TRANSLATIONS.hi;

  const textScale = state.textScale || 1.0;
  const [isHighContrast, setIsHighContrast] = useState(false);

  const [showWeatherModal, setShowWeatherModal] = useState(false);
  const [activeWeatherTab, setActiveWeatherTab] = useState<'rain' | 'frost' | 'heat'>('rain');
  const [alertBannerVisible, setAlertBannerVisible] = useState(true);
  const [jFormDownloaded, setJFormDownloaded] = useState(false);

  // Real-time location-based weather state
  const [weather, setWeather] = useState<RealTimeWeather | null>(null);
  const [isLoadingWeather, setIsLoadingWeather] = useState(false);

  const fetchLiveWeather = async () => {
    setIsLoadingWeather(true);
    try {
      const data = await weatherService.getRealTimeWeather();
      setWeather(data);
    } catch (e) {
      console.warn('Real-time weather fetch error:', e);
    } finally {
      setIsLoadingWeather(false);
    }
  };

  useEffect(() => {
    fetchLiveWeather();
  }, []);

  // Sync active weather modal tab to detected hazard (unseasonal rain, frost, or heatwave)
  useEffect(() => {
    if (weather?.hazardType && weather.hazardType !== 'favorable') {
      setActiveWeatherTab(weather.hazardType);
    }
  }, [weather?.hazardType]);

  // Live weather metrics derived dynamically from real-time GPS & meteorological server
  const liveTemp = weather ? `${weather.temperature}°C` : '32°C';
  const liveWindText = weather ? `${weather.windSpeed} km/h` : '18 km/h';
  const liveGusts = weather ? weather.windGusts : 32;
  const liveRain24 = weather ? weather.rainProb24h : 20;
  const liveRain48 = weather ? weather.rainProb48h : 75;
  const liveLocation = weather?.locationName || (isOr ? 'ଭୁବନେଶ୍ୱର / ଭୋପାଲ' : isHi ? 'भोपाल' : 'Bhopal');
  const liveIsGPS = weather?.isLiveGPS ?? false;
  const liveEmoji = weather?.conditionEmoji || '⛅';
  const liveConditionText = isOr
    ? (weather?.conditionOr || 'ଖଣ୍ଡିଆ ମେଘୁଆ')
    : isHi
    ? (weather?.conditionHi || 'आंशिक बादल')
    : (weather?.conditionEn || 'Partly Cloudy');
  const liveAdvisory = isOr
    ? (weather?.advisoryOr || t.advisorySnippet)
    : isHi
    ? (weather?.advisoryHi || t.advisorySnippet)
    : (weather?.advisoryEn || t.advisorySnippet);
  const isSevereHazard = weather ? weather.hazardType !== 'favorable' : true;

  // Active transaction and centre
  const activeTx = state.transactions?.find((t) => t.farmerId === currentFarmer?.id) || MOCK_TRANSACTIONS[0];
  const activeMandi = state.centres?.[0] || MOCK_CENTRES[0];

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

  // Active token details - derived as per the farmer primary crop and dedicated Mandi address
  const tokenNumber = activeTx?.tokenNumber || 42;
  const mandiInfo = getCropMandiInfo(rawFarmerCrop, isOr, isHi);
  const tokenCrop = isOr
    ? cropPriceInfo.nameOr
    : isHi
    ? cropPriceInfo.nameHi
    : cropPriceInfo.nameEn;
  const tokenQuantity = activeTx?.expectedQuantity || 20;
  const tokenMandi = mandiInfo.fullDisplay;
  const tokenMandiAddress = mandiInfo.mandiAddress;
  const tokenSlot = isOr ? 'ସକାଳ (୮:୦୦ - ୧୨:୦୦)' : isHi ? 'सुबह (8:00 - 12:00)' : (activeTx?.slotLabel || 'Morning (8:00 - 12:00)');

  // Post-Quality-Check Estimated Payout & J-Form calculations
  const payoutQuantity = tokenQuantity || 20; // 20 Quintals
  const parsedMsp = parseInt(cropPriceInfo.priceDisplay.replace(/[^0-9]/g, ''), 10);
  const mspRate = parsedMsp > 0 ? parsedMsp : 2450;
  const estimatedPayout = payoutQuantity * mspRate;
  const jFormReceiptNo = 'J-FORM-2026-08921';

  const handleDownloadJForm = async () => {
    const slipText = `================================================
GOVERNMENT OF INDIA • APMC MANDI
FORM 'J' - OFFICIAL WEIGHMENT & SALE RECEIPT
(Issued under State Agricultural Produce Marketing Act)
================================================
J-Form Slip No : ${jFormReceiptNo}
Date & Time    : ${new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}, 11:30 AM
Mandi Centre   : ${mandiInfo.mandiName}
Mandi Address  : ${tokenMandiAddress}

--- FARMER DETAILS ---
Farmer Name    : ${farmerName}
Farmer ID      : ${farmerId}
Mobile         : ${farmerPhone}
Aadhaar Status : UIDAI Verified (DBT Linked)
Bank Account   : ${bankName} (A/C: ••${bankAccount})

--- COMMODITY & QUALITY CERTIFICATE ---
Crop Commodity : ${tokenCrop}
Quality Grade  : Grade A (FAQ Standard - Passed ✓)
Moisture Level : 11.2% (Permissible Limit: ≤ 12.0%)
Weighbridge    : Gross: 26.40 Qtl | Tare: 6.40 Qtl | Net: ${payoutQuantity}.00 Qtl

--- ESTIMATED PAYOUT BREAKDOWN ---
Net Weight     : ${payoutQuantity} Quintals
MSP Rate       : ₹${mspRate.toLocaleString('en-IN')} / Quintal
Breakdown      : ${payoutQuantity} Quintals × ₹${mspRate.toLocaleString('en-IN')} (MSP) = ₹${estimatedPayout.toLocaleString('en-IN')}
Mandi Cess/Fee : ₹0.00 (Zero Fee for Farmer)
------------------------------------------------
TOTAL PAYOUT   : ₹${estimatedPayout.toLocaleString('en-IN')}
------------------------------------------------
Settlement     : Electronic DBT Transfer to Bank Account
Signatures     : Digitally Signed by Weighbridge Officer & Quality Lab Inspector (OP-104)
Status         : OFFICIALLY CERTIFIED & RECORDED
================================================`;

    try {
      await Share.share({
        title: `J-Form Sale Receipt - ${jFormReceiptNo}`,
        message: slipText,
      });
      setJFormDownloaded(true);
      setTimeout(() => setJFormDownloaded(false), 5000);
    } catch (err) {
      console.log('Error sharing J-Form:', err);
    }
  };

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

            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
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
                    EN
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Small Speaker Voice Assistance Button at Page Top */}
              <SpeakerButton
                cardId="home-top-voice-assistant"
                getText={() => {
                  if (isOr) {
                    return `କିଷାନ ମିତ୍ର ମୂଳପୃଷ୍ଠାରେ ସ୍ୱାଗତ। ଚାଷୀ ${farmerName}। ଆପଣଙ୍କ ସକ୍ରିୟ ଟୋକନ୍ ନମ୍ବର ${tokenNumber}। ଫସଲ ${tokenCrop}, ${tokenQuantity} କ୍ୱିଣ୍ଟାଲ। ମଣ୍ଡି: ${tokenMandi}। ଗୁଣବତ୍ତା ଯାଞ୍ଚ ପରେ ଆନୁମାନିକ ପାଉଣା ୪୯୦୦୦ ଟଙ୍କା। J-ଫର୍ମ ବିକ୍ରି ରସିଦ ଡାଉନଲୋଡ୍ କରନ୍ତୁ।`;
                  }
                  if (isHi) {
                    return `किसान मित्र मुख्य पृष्ठ में आपका स्वागत है। किसान ${farmerName}। आपका सक्रिय टोकन नंबर ${tokenNumber}। फसल ${tokenCrop}, ${tokenQuantity} क्विंटल। मंडी: ${tokenMandi}। क्वालिटी जांच के बाद अनुमानित भुगतान 49000 रुपये। बिक्री रसीद J-फॉर्म डाउनलोड करें।`;
                  }
                  return `Welcome to Kisan Mitra Home. Farmer ${farmerName}. Your active token number is ${tokenNumber}. Crop ${tokenCrop}, ${tokenQuantity} quintals. Mandi: ${tokenMandi}. Post-quality check estimated payout is 49,000 rupees. Download J-Form sale receipt for your records.`;
                }}
                lang={currentLang}
                size={16}
                bgColor={isHighContrast ? '#FFE500' : 'rgba(255,255,255,0.22)'}
                color={isHighContrast ? '#000000' : '#FFFFFF'}
                activeBgColor="#DC2626"
                activeColor="#FFFFFF"
                isHighContrast={isHighContrast}
              />
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

        {/* MAIN BODY AREA */}
        <View style={styles.mainBodyContainer}>
          {/* Urgent Agro-Met Weather Alert Banner */}
          {alertBannerVisible && (
            <TouchableOpacity
              style={[
                styles.weatherAlertBanner,
                !isSevereHazard && styles.weatherAlertBannerFavorable,
                isHighContrast && styles.bannerHighContrast,
              ]}
              onPress={() => setShowWeatherModal(true)}
              activeOpacity={0.9}
            >
              <View style={[styles.weatherAlertIconBox, !isSevereHazard && styles.weatherAlertIconBoxFavorable]}>
                <Ionicons name={isSevereHazard ? "warning" : "partly-sunny"} size={18} color="#FFFFFF" />
              </View>
              <View style={styles.weatherAlertTextBox}>
                <Text style={[styles.weatherAlertTitle, !isSevereHazard && styles.weatherAlertTitleFavorable, isHighContrast && styles.textHighContrast]} numberOfLines={1}>
                  {isSevereHazard ? t.urgentAlertTitle : (isOr ? `☀️ କୃଷି ପାଣିପାଗ ସ୍ଥିତି (ଆଗାମୀ ୨୪-୪୮ ଘଣ୍ଟା)` : isHi ? `☀️ कृषि मौसम स्थिति (अगले 24-48 घंटे)` : `☀️ Agro-Met Weather Status (Next 24-48h)`)}
                </Text>
                <Text style={[styles.weatherAlertSub, !isSevereHazard && styles.weatherAlertSubFavorable, isHighContrast && styles.textSubHighContrast]} numberOfLines={1}>
                  📍 {liveLocation}: {liveAdvisory}
                </Text>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                <SpeakerButton
                  cardId="urgent-weather-alert"
                  getText={() => {
                    if (isOr) {
                      return `ପାଣିପାଗ ସୂଚନା, ସ୍ଥାନ ${liveLocation}। ତାପମାତ୍ରା ${liveTemp}। ଆଗାମୀ ୨୪ ରୁ ୪୮ ଘଣ୍ଟା ମଧ୍ୟରେ ବର୍ଷା ସମ୍ଭାବନା ${liveRain48} ପ୍ରତିଶତ ଏବଂ ପବନ ବେଗ ${liveWindText}। କୃଷି ପରାମର୍ଶ: ${liveAdvisory}`;
                    }
                    if (isHi) {
                      return `मौसम सूचना, स्थान ${liveLocation}। तापमान ${liveTemp}। अगले 24 से 48 घंटे में बारिश की संभावना ${liveRain48} प्रतिशत और हवा की गति ${liveWindText}। कृषि सलाह: ${liveAdvisory}`;
                    }
                    return `Weather information for ${liveLocation}. Temperature ${liveTemp}. Rain probability ${liveRain48} percent and wind speed ${liveWindText} in next 24 to 48 hours. Agri advisory: ${liveAdvisory}`;
                  }}
                  lang={currentLang}
                  size={15}
                  bgColor={isSevereHazard ? "#FEF3C7" : "#DCFCE7"}
                  color={isSevereHazard ? "#B45309" : "#15803D"}
                  isHighContrast={isHighContrast}
                />
                <Ionicons name="chevron-forward" size={18} color={isHighContrast ? '#FFE500' : isSevereHazard ? '#92400E' : '#15803D'} />
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
                {currentFarmer?.photoUrl ? (
                  <Image
                    source={{ uri: currentFarmer.photoUrl }}
                    style={styles.farmerPhotoImage}
                    resizeMode="cover"
                  />
                ) : (
                  <View style={styles.farmerPhotoPlaceholder}>
                    <Ionicons name="person" size={38} color={isHighContrast ? '#FFE500' : '#2E7D32'} />
                  </View>
                )}
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
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5, flex: 1 }}>
                  <Text style={[styles.envCardTitle, isHighContrast && styles.textHighContrast]}>{t.agroMetTitle}</Text>
                  {liveIsGPS && (
                    <View style={styles.liveGpsBadge}>
                      <Ionicons name="navigate-circle" size={11} color="#15803D" />
                      <Text style={styles.liveGpsText}>GPS</Text>
                    </View>
                  )}
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
                  {/* Real-time Weather Refresh Button */}
                  <TouchableOpacity
                    onPress={(e) => {
                      e.stopPropagation();
                      fetchLiveWeather();
                    }}
                    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                    style={styles.refreshWeatherBtn}
                    accessibilityRole="button"
                    accessibilityLabel="Refresh real-time weather"
                  >
                    <Ionicons
                      name="refresh"
                      size={13}
                      color="#0F766E"
                      style={isLoadingWeather ? { opacity: 0.5 } : undefined}
                    />
                  </TouchableOpacity>

                  <SpeakerButton
                    cardId="agro-met-card"
                    getText={() => {
                      if (isOr) {
                        return `କୃଷି-ପାଣିପାଗ ପରାମର୍ଶ, ସ୍ଥାନ ${liveLocation}। ତାପମାତ୍ରା ${liveTemp}, ପବନ ${liveWindText}। ବର୍ଷା ସମ୍ଭାବନା ୨୪ ଘଣ୍ଟାରେ ${liveRain24} ପ୍ରତିଶତ, ୪୮ ଘଣ୍ଟାରେ ${liveRain48} ପ୍ରତିଶତ। ପରାମର୍ଶ: ${liveAdvisory}`;
                      }
                      if (isHi) {
                        return `कृषि-मौसम सलाह, स्थान ${liveLocation}। तापमान ${liveTemp}, हवा ${liveWindText}। बारिश की संभावना 24 घंटे में ${liveRain24} प्रतिशत, 48 घंटे में ${liveRain48} प्रतिशत। सलाह: ${liveAdvisory}`;
                      }
                      return `Agro-met advisory for ${liveLocation}. Temperature ${liveTemp}, wind speed ${liveWindText}. Rain probability: 24 hours ${liveRain24} percent, 48 hours ${liveRain48} percent. Advisory: ${liveAdvisory}`;
                    }}
                    lang={currentLang}
                    size={14}
                    isHighContrast={isHighContrast}
                  />

                  <View style={isSevereHazard ? styles.alertMiniPill : styles.alertMiniPillOk}>
                    <Ionicons name={isSevereHazard ? "warning" : "checkmark-circle"} size={10} color={isSevereHazard ? "#D97706" : "#15803D"} />
                    <Text style={isSevereHazard ? styles.alertMiniPillText : styles.alertMiniPillTextOk}>
                      {isSevereHazard ? t.alertTag : (isOr ? 'ଅନୁକୂଳ' : isHi ? 'अनुकूल' : 'FAVORABLE')}
                    </Text>
                  </View>
                </View>
              </View>

              <Text style={[styles.envCardSub, isHighContrast && styles.textSubHighContrast]} numberOfLines={1}>
                📍 {liveLocation} • {t.agroMetDuration}
              </Text>

              {/* Temp & Wind Speed Row */}
              <View style={styles.agroMetricsRow}>
                <View style={styles.weatherRow}>
                  <Text style={styles.weatherEmoji}>{liveEmoji}</Text>
                  <Text style={[styles.weatherTempBig, isHighContrast && styles.textHighContrast]}>{liveTemp}</Text>
                </View>
                <View style={styles.windSpeedBadge}>
                  <Ionicons name="speedometer-outline" size={11} color="#1E3A8A" />
                  <Text style={styles.windSpeedText}>{liveWindText}</Text>
                </View>
              </View>

              {/* Rain Probability for next 24-48 Hours */}
              <View style={[styles.rainProbBox, isHighContrast && styles.rainProbBoxHighContrast]}>
                <Text style={[styles.rainProbTitle, isHighContrast && styles.textHighContrast]}>🌧️ {t.rainProbLabel}</Text>
                <View style={styles.rainProbItemsRow}>
                  <Text style={styles.rainProb24}>24h: {liveRain24}%</Text>
                  <Text style={styles.rainProbDivider}>|</Text>
                  <Text style={[styles.rainProb48, liveRain48 >= 50 && { color: '#DC2626' }]}>
                    48h: {liveRain48}% {liveRain48 >= 50 ? '⚠️' : ''}
                  </Text>
                </View>
              </View>

              {/* Actionable Advisory CTA */}
              <View style={styles.agroSnippetBox}>
                <Text style={styles.agroSnippetText} numberOfLines={1}>
                  {liveEmoji} {liveAdvisory}
                </Text>
              </View>
              <Text style={[styles.viewAdvisoryLink, isHighContrast && styles.textHighlightHighContrast]}>{t.tapForAdvisory}</Text>
            </TouchableOpacity>
          </View>

          {/* POST-QUALITY CHECK ESTIMATED PAYOUT BREAKDOWN & J-FORM DOWNLOAD ROW */}
          <View style={[styles.payoutCard, isHighContrast && styles.payoutCardHighContrast]}>
            {/* Top Bar: Quality Status & Verified Seal */}
            <View style={styles.payoutTopBar}>
              <View style={styles.qualityBadgeRow}>
                <View style={styles.qualitySuccessPill}>
                  <Ionicons name="checkmark-circle" size={14} color="#15803D" />
                  <Text style={styles.qualitySuccessText}>
                    {t.qualityPassed}
                  </Text>
                </View>
                <View style={styles.moistureTag}>
                  <Text style={styles.moistureTagText}>Moisture 11.2% ✓</Text>
                </View>
              </View>
              <Text style={styles.jFormIdTag}>{jFormReceiptNo}</Text>
            </View>

            {/* Payout Breakdown Section */}
            <View style={styles.payoutContentBox}>
              <View style={styles.payoutHeaderRow}>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.payoutCardTitle, isHighContrast && styles.textHighContrast]}>
                    {t.payoutTitle}
                  </Text>
                  <Text style={[styles.payoutFormulaText, isHighContrast && styles.textHighlightHighContrast]}>
                    {payoutQuantity} {t.quintal} × ₹{mspRate.toLocaleString('en-IN')} (MSP) = ₹{estimatedPayout.toLocaleString('en-IN')}
                  </Text>
                </View>

                {/* Speaker Button for Audio Assistance */}
                <SpeakerButton
                  cardId="payout-card"
                  getText={() => {
                    if (isOr) {
                      return `ଗୁଣବତ୍ତା ଯାଞ୍ଚ ସଫଳ ହୋଇଛି, ଗ୍ରେଡ୍ A। ଆନୁମାନିକ ପାଉଣା ହିସାବ: ${payoutQuantity} କ୍ୱିଣ୍ଟାଲ ଗୁଣନ ୨୪୫୦ ଟଙ୍କା MSP, ସମୁଦାୟ ପାଉଣା ୪୯ ହଜାର ଟଙ୍କା। ସିଧାସଳଖ ଆପଣଙ୍କ ବ୍ୟାଙ୍କ ଖାତାକୁ DBT ଜମା ହେବ। ବିକ୍ରି ରସିଦ ବା J-ଫର୍ମ ଡାଉନଲୋଡ୍ କରନ୍ତୁ।`;
                    }
                    if (isHi) {
                      return `क्वालिटी जांच पास, ग्रेड A। अनुमानित भुगतान विवरण: ${payoutQuantity} क्विंटल गुना 2450 रुपये एमएसपी, कुल भुगतान 49000 रुपये। सीधे आपके बैंक खाते में डीबीटी जमा होगा। स्थानीय रिकॉर्ड हेतु J-फॉर्म बिक्री रसीद डाउनलोड करें।`;
                    }
                    return `Quality check passed, Grade A. Estimated payout breakdown: ${payoutQuantity} quintals multiplied by 2,450 rupees MSP equals 49,000 rupees. Direct DBT transfer to your linked bank account. One-tap download available for signed weight and payment slip J-Form.`;
                  }}
                  lang={currentLang}
                  size={15}
                  isHighContrast={isHighContrast}
                />
              </View>

              {/* 3-Pillar Breakdown Strip */}
              <View style={styles.breakdownGrid}>
                <View style={styles.breakdownCol}>
                  <Text style={styles.breakdownColLabel}>{t.netWeight}</Text>
                  <Text style={[styles.breakdownColVal, isHighContrast && styles.textHighContrast]}>
                    {payoutQuantity}.00 {t.qtlShort}
                  </Text>
                </View>
                <View style={styles.breakdownColDivider} />
                <View style={styles.breakdownCol}>
                  <Text style={styles.breakdownColLabel}>{t.mspRateLabel}</Text>
                  <Text style={[styles.breakdownColVal, isHighContrast && styles.textHighContrast]}>
                    ₹{mspRate.toLocaleString('en-IN')}/{t.qtlShort}
                  </Text>
                </View>
                <View style={styles.breakdownColDivider} />
                <View style={styles.breakdownCol}>
                  <Text style={styles.breakdownColLabel}>{t.totalPayoutLabel}</Text>
                  <Text style={[styles.breakdownColTotal, isHighContrast && styles.textHighlightHighContrast]}>
                    ₹{estimatedPayout.toLocaleString('en-IN')}
                  </Text>
                </View>
              </View>

              {/* DBT Linked Note */}
              <View style={styles.dbtNoteRow}>
                <Ionicons name="shield-checkmark" size={13} color="#15803D" />
                <Text style={styles.dbtNoteText} numberOfLines={1}>
                  {bankName} (••{bankAccount}) • {t.dbtCreditNote}
                </Text>
              </View>
            </View>

            {/* ONE-TAP DOWNLOAD J-FORM / SALE RECEIPT BUTTON */}
            <TouchableOpacity
              style={[styles.downloadJFormBtn, isHighContrast && styles.downloadJFormBtnHighContrast]}
              onPress={handleDownloadJForm}
              activeOpacity={0.85}
              accessibilityRole="button"
              accessibilityLabel="Download Sale Receipt J-Form"
            >
              <View style={styles.downloadBtnIconCircle}>
                <Ionicons name="download-outline" size={18} color="#FFFFFF" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.downloadBtnTitle}>{t.downloadJForm}</Text>
                <Text style={styles.downloadBtnSub}>{t.jFormSub}</Text>
              </View>
              <View style={styles.jFormOfficialBadge}>
                <Text style={styles.jFormOfficialBadgeText}>J-FORM</Text>
              </View>
            </TouchableOpacity>

            {/* Success toast if downloaded */}
            {jFormDownloaded && (
              <View style={styles.jFormSuccessBanner}>
                <Ionicons name="checkmark-circle" size={15} color="#15803D" />
                <Text style={styles.jFormSuccessText}>
                  {isOr
                    ? 'J-ଫର୍ମ ବିକ୍ରି ରସିଦ ପ୍ରସ୍ତୁତ ଏବଂ ରେକର୍ଡ ପାଇଁ ଉପଲବ୍ଧ!'
                    : isHi
                    ? 'J-फॉर्म बिक्री रसीद तैयार और रिकॉर्ड हेतु उपलब्ध!'
                    : 'J-Form sale receipt downloaded & ready for local records!'}
                </Text>
              </View>
            )}

            {/* View Full Digital Receipt Link */}
            <TouchableOpacity
              style={styles.viewDigitalSlipRow}
              onPress={() => router.push('/(farmer)/procurement/receipt' as any)}
              activeOpacity={0.75}
            >
              <Text style={[styles.viewDigitalSlipText, isHighContrast && styles.textHighlightHighContrast]}>
                {t.viewDigitalReceipt}
              </Text>
              <Ionicons name="arrow-forward" size={13} color={isHighContrast ? '#FFE500' : '#15803D'} />
            </TouchableOpacity>
          </View>

          {/* SECTION: QUICK ACTIONS */}
          <View style={styles.quickActionsHeaderRow}>
            <Text style={styles.sectionHeaderTitleNoMargin}>{t.quickActions}</Text>
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
                <Ionicons name="call" size={24} color="#D32F2F" />
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
                    const loc = `ସ୍ଥାନ ${liveLocation}, ତାପମାତ୍ରା ${liveTemp}, ପବନ ${liveWindText}। `;
                    const locHi = `स्थान ${liveLocation}, तापमान ${liveTemp}, हवा ${liveWindText}। `;
                    const locEn = `Location ${liveLocation}, temperature ${liveTemp}, wind speed ${liveWindText}. `;

                    if (activeWeatherTab === 'rain') {
                      return isOr
                        ? `${loc}ଅସାମୟିକ ବର୍ଷା ପରାମର୍ଶ। ଆଗାମୀ ୨୪ ଘଣ୍ଟାରେ ବର୍ଷା ସମ୍ଭାବନା ${liveRain24} ପ୍ରତିଶତ, ୪୮ ଘଣ୍ଟାରେ ${liveRain48} ପ୍ରତିଶତ। ପଦକ୍ଷେପ ଏକ: କଟା ଫସଲକୁ ସୁରକ୍ଷିତ ସ୍ଥାନକୁ ନିଅନ୍ତୁ ବା ତାରପୋଲିନରେ ଘୋଡ଼ାନ୍ତୁ। ପଦକ୍ଷେପ ଦୁଇ: ଆଗାମୀ ୪୮ ଘଣ୍ଟା କୌଣସି କୀଟନାଶକ ସ୍ପ୍ରେ ବା ଜଳସେଚନ କରନ୍ତୁ ନାହିଁ। ପଦକ୍ଷେପ ତିନି: କ୍ଷେତରେ ନାଳୀ ସଫା କରି ପାଣି ନିଷ୍କାସନ ବ୍ୟବସ୍ଥା କରନ୍ତୁ।`
                        : isHi
                        ? `${locHi}बेमौसम बारिश सलाह। 24 घंटे में बारिश की संभावना ${liveRain24} प्रतिशत, 48 घंटे में ${liveRain48} प्रतिशत। कदम एक: कटी फसल व अनाज को तिरपाल से अच्छी तरह ढकें। कदम दो: अगले 48 घंटे तक कीटनाशक छिड़काव व सिंचाई टालें। कदम तीन: खेतों में जल निकासी की व्यवस्था करें।`
                        : `${locEn}Unseasonal rain advisory. Rain probability 24 hours ${liveRain24} percent, 48 hours ${liveRain48} percent. Step 1: Move harvested crop under cover or tarp immediately. Step 2: Postpone chemical spraying and irrigation for 48 hours. Step 3: Clear drainage channels to prevent waterlogging.`;
                    }
                    if (activeWeatherTab === 'frost') {
                      return isOr
                        ? `${loc}କାକର ଓ ଶୀତଲହରୀ ପରାମର୍ଶ। ପଦକ୍ଷେପ ଏକ: ସନ୍ଧ୍ୟାରେ ହାଲୁକା ପାଣି ମଡ଼ାନ୍ତୁ। ପଦକ୍ଷେପ ଦୁଇ: କ୍ଷେତର ଉତ୍ତର-ପଶ୍ଚିମ ସୀମାରେ ଧୂଆଁ ସୃଷ୍ଟି କରନ୍ତୁ। ପଦକ୍ଷେପ ତିନି: ପନିପରିବା ନର୍ସରୀକୁ ନଡ଼ା କିମ୍ବା ପଲିଥିନରେ ଢାଙ୍କନ୍ତୁ।`
                        : isHi
                        ? `${locHi}पाला और शीतलहर सलाह। कदम एक: शाम के समय हल्की सिंचाई करें। कदम दो: उत्तर पश्चिम मेड़ों पर जैविक कचरे का धुआं करें। कदम तीन: नर्सरी और सब्जियों को पुआल से ढकें।`
                        : `${locEn}Frost and cold wave advisory. Step 1: Apply light evening irrigation. Step 2: Create light smoke on north-west border. Step 3: Cover nurseries and vegetable plants with straw or plastic.`;
                    }
                    return isOr
                      ? `${loc}ପ୍ରଚଣ୍ଡ ଖରା ଓ ଲୁ ପରାମର୍ଶ। ପଦକ୍ଷେପ ଏକ: କେବଳ ସକାଳେ କିମ୍ବା ସନ୍ଧ୍ୟାରେ ଜଳସେଚନ କରନ୍ତୁ। ପଦକ୍ଷେପ ଦୁଇ: ନଡ଼ାର ମଲଚିଂ ବ୍ୟବହାର କରନ୍ତୁ। ପଦକ୍ଷେପ ତିନି: ଗୃହପାଳିତ ପଶୁଙ୍କୁ ଛାଇରେ ରଖନ୍ତୁ ଓ ପ୍ରଚୁର ଥଣ୍ଡା ପାଣି ଦିଅନ୍ତୁ।`
                      : isHi
                      ? `${locHi}लू और प्रचंड गर्मी सलाह। कदम एक: केवल सुबह या देर शाम हल्की सिंचाई करें। कदम दो: पुआल की मल्चिंग बिछाएं। कदम तीन: पशुओं को छायादार जगह में रखें और भरपूर ठंडा पानी दें।`
                      : `${locEn}Heatwave advisory. Step 1: Irrigate strictly during early morning or late evening. Step 2: Apply organic mulch to conserve moisture. Step 3: Keep cattle in shaded shelters with plenty of clean water.`;
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
              {t.modalSub} • 📍 {liveLocation} {liveIsGPS ? '(Live GPS)' : ''}
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
                    <Text style={styles.modalMetricVal}>{liveRain24}% {liveRain24 > 40 ? '⚠️' : '(Light)'}</Text>
                  </View>
                  <View style={styles.modalMetricDivider} />
                  <View style={styles.modalMetricItem}>
                    <Text style={styles.modalMetricLabel}>Rain Prob (48h)</Text>
                    <Text style={[styles.modalMetricVal, { color: liveRain48 >= 50 ? '#DC2626' : '#2E7D32' }]}>
                      {liveRain48}% {liveRain48 >= 50 ? '(Heavy ⚠️)' : '(Normal)'}
                    </Text>
                  </View>
                  <View style={styles.modalMetricDivider} />
                  <View style={styles.modalMetricItem}>
                    <Text style={styles.modalMetricLabel}>Wind Gusts</Text>
                    <Text style={styles.modalMetricVal}>{liveGusts} km/h</Text>
                  </View>
                </>
              )}

              {activeWeatherTab === 'frost' && (
                <>
                  <View style={styles.modalMetricItem}>
                    <Text style={styles.modalMetricLabel}>Min / Air Temp</Text>
                    <Text style={[styles.modalMetricVal, { color: '#2563EB' }]}>{liveTemp} ❄️</Text>
                  </View>
                  <View style={styles.modalMetricDivider} />
                  <View style={styles.modalMetricItem}>
                    <Text style={styles.modalMetricLabel}>Ground Temp</Text>
                    <Text style={styles.modalMetricVal}>
                      {weather ? `${Math.round(weather.temperature - 2)}°C` : '1.8°C'}
                    </Text>
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
                    <Text style={styles.modalMetricLabel}>Max / Air Temp</Text>
                    <Text style={[styles.modalMetricVal, { color: '#EA580C' }]}>{liveTemp} ☀️</Text>
                  </View>
                  <View style={styles.modalMetricDivider} />
                  <View style={styles.modalMetricItem}>
                    <Text style={styles.modalMetricLabel}>Humidity</Text>
                    <Text style={styles.modalMetricVal}>{weather ? `${weather.humidity}%` : '65%'}</Text>
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
    fontSize: 14,
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
    fontSize: 17.5,
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
    borderRadius: 10,
    marginHorizontal: 10,
    paddingVertical: 10,
    paddingHorizontal: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#EFE7D5',
  },
  tokenMetaText: {
    fontSize: 18.5,
    fontWeight: '600',
    color: '#333333',
    lineHeight: 26,
    textAlign: 'center',
  },
  tokenMetaBold: {
    fontSize: 18.5,
    fontWeight: '800',
    color: '#1F2937',
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
    fontSize: 17.5,
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
  farmerPhotoPlaceholder: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#E8F5E9',
  },
  farmerDetailsCol: {
    flex: 1,
    justifyContent: 'center',
  },
  farmerCardName: {
    fontSize: 22,
    fontWeight: '800',
    color: '#1A202C',
  },
  farmerCardId: {
    fontSize: 17,
    fontWeight: '600',
    color: '#4A5568',
    marginTop: 2,
  },
  farmerCardPhone: {
    fontSize: 17,
    color: '#2D3748',
    marginTop: 2,
  },
  farmerCardLocation: {
    fontSize: 16.5,
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
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#EFE5D0',
  },
  holdingIconBg: {
    width: 38,
    height: 38,
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
    fontSize: 15,
    color: '#64748B',
    fontWeight: '600',
  },
  holdingValue: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1A202C',
    marginTop: 2,
  },
  verificationStrip: {
    backgroundColor: '#FAF5EA',
    borderRadius: 10,
    paddingVertical: 10,
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
    fontSize: 17,
    fontWeight: '800',
    color: '#1A202C',
  },
  verifySub: {
    fontSize: 15,
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
    fontSize: 10,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  viewDetailedProfileBtn: {
    paddingTop: 8,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#F0F2F0',
  },
  viewDetailedProfileText: {
    fontSize: 17,
    fontWeight: '700',
    color: '#184E29',
  },

  /* NEW ADDED & ENVIRONMENT SECTION */
  sectionHeaderTitle: {
    fontSize: 19,
    fontWeight: '800',
    color: '#1A202C',
    marginTop: 18,
    marginBottom: 10,
  },
  sectionHeaderTitleNoMargin: {
    fontSize: 19,
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
    fontSize: 17.5,
    fontWeight: '700',
    color: '#1A202C',
  },
  envCardSub: {
    fontSize: 15,
    color: '#64748B',
    marginTop: 2,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  envPriceBig: {
    fontSize: 24,
    fontWeight: '900',
    color: '#1A202C',
  },
  arrowUpPill: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#C8E6C9',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 6,
  },
  priceUnitSlash: {
    fontSize: 17,
    fontWeight: '700',
    color: '#64748B',
    marginLeft: 2,
  },
  unitSubText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#64748B',
    marginTop: 2,
    marginBottom: 4,
  },
  mspCompareBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderWidth: 1,
    borderColor: '#EFE5D0',
    marginTop: 4,
  },
  mspCompareText: {
    fontSize: 15.5,
    fontWeight: '800',
    color: '#1E293B',
    lineHeight: 20,
  },
  mspBenefitTag: {
    backgroundColor: '#E8F5E9',
    borderRadius: 4,
    paddingVertical: 3,
    paddingHorizontal: 6,
    marginTop: 5,
    alignSelf: 'flex-start',
  },
  mspBenefitTagText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#2E7D32',
  },
  /* AGRO-MET & WEATHER ALERT STYLES */
  weatherAlertBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 12,
    marginBottom: 12,
    borderWidth: 1.5,
    borderColor: '#F59E0B',
  },
  weatherAlertBannerFavorable: {
    backgroundColor: '#DCFCE7',
    borderColor: '#86EFAC',
  },
  weatherAlertIconBox: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#D97706',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  weatherAlertIconBoxFavorable: {
    backgroundColor: '#16A34A',
  },
  weatherAlertTextBox: {
    flex: 1,
  },
  weatherAlertTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#92400E',
  },
  weatherAlertTitleFavorable: {
    color: '#14532D',
  },
  weatherAlertSub: {
    fontSize: 15.5,
    color: '#B45309',
    marginTop: 2,
  },
  weatherAlertSubFavorable: {
    color: '#166534',
  },

  agroHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  liveGpsBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 4,
    paddingVertical: 1,
    borderRadius: 4,
    borderWidth: 0.5,
    borderColor: '#86EFAC',
  },
  liveGpsText: {
    fontSize: 8,
    fontWeight: '800',
    color: '#15803D',
    marginLeft: 2,
  },
  refreshWeatherBtn: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#CCFBF1',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 0.5,
    borderColor: '#99F6E4',
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
  alertMiniPillOk: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#DCFCE7',
    borderRadius: 6,
    paddingHorizontal: 5,
    paddingVertical: 1.5,
    borderWidth: 1,
    borderColor: '#BBF7D0',
  },
  alertMiniPillTextOk: {
    fontSize: 8,
    fontWeight: '800',
    color: '#15803D',
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

  /* POST-QUALITY CHECK ESTIMATED PAYOUT & J-FORM */
  payoutCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    marginBottom: 16,
    borderWidth: 1.5,
    borderColor: '#BBF7D0',
    shadowColor: '#15803D',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  payoutCardHighContrast: {
    backgroundColor: '#000000',
    borderColor: '#FFE500',
    borderWidth: 2,
  },
  payoutTopBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  qualityBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  qualitySuccessPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#DCFCE7',
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#86EFAC',
  },
  qualitySuccessText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#15803D',
  },
  moistureTag: {
    backgroundColor: '#FEF3C7',
    paddingVertical: 3,
    paddingHorizontal: 7,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  moistureTagText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#92400E',
  },
  jFormIdTag: {
    fontSize: 10,
    fontWeight: '700',
    color: '#64748B',
    backgroundColor: '#F1F5F9',
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 4,
  },
  payoutContentBox: {
    backgroundColor: '#F8FAF9',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 10,
  },
  payoutHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 6,
  },
  payoutCardTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
  },
  payoutFormulaText: {
    fontSize: 18.5,
    fontWeight: '900',
    color: '#15803D',
    marginTop: 3,
    letterSpacing: -0.2,
  },
  breakdownGrid: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 4,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginTop: 6,
    marginBottom: 8,
  },
  breakdownCol: {
    alignItems: 'center',
    flex: 1,
  },
  breakdownColLabel: {
    fontSize: 15,
    color: '#64748B',
    fontWeight: '600',
  },
  breakdownColVal: {
    fontSize: 17.5,
    fontWeight: '700',
    color: '#1E293B',
    marginTop: 1,
  },
  breakdownColTotal: {
    fontSize: 18.5,
    fontWeight: '900',
    color: '#15803D',
    marginTop: 1,
  },
  breakdownColDivider: {
    width: 1,
    height: 24,
    backgroundColor: '#E2E8F0',
  },
  dbtNoteRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginTop: 2,
  },
  dbtNoteText: {
    fontSize: 16,
    color: '#475569',
    fontWeight: '500',
    flex: 1,
  },
  downloadJFormBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#15803D',
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 10,
    gap: 10,
    shadowColor: '#15803D',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 3,
  },
  downloadJFormBtnHighContrast: {
    backgroundColor: '#000000',
    borderColor: '#FFE500',
    borderWidth: 2,
  },
  downloadBtnIconCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  downloadBtnTitle: {
    fontSize: 17.5,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  downloadBtnSub: {
    fontSize: 14,
    color: '#D1FAE5',
    marginTop: 1,
  },
  jFormOfficialBadge: {
    backgroundColor: '#FEF3C7',
    paddingVertical: 3,
    paddingHorizontal: 6,
    borderRadius: 6,
  },
  jFormOfficialBadgeText: {
    fontSize: 11,
    fontWeight: '900',
    color: '#92400E',
    letterSpacing: 0.5,
  },
  jFormSuccessBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#DCFCE7',
    borderRadius: 8,
    padding: 8,
    marginTop: 8,
    borderWidth: 1,
    borderColor: '#86EFAC',
  },
  jFormSuccessText: {
    fontSize: 16,
    color: '#15803D',
    fontWeight: '600',
    flex: 1,
  },
  viewDigitalSlipRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    marginTop: 8,
    paddingVertical: 6,
  },
  viewDigitalSlipText: {
    fontSize: 17,
    fontWeight: '700',
    color: '#15803D',
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
    fontSize: 16,
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
    paddingHorizontal: 4,
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
    fontSize: 16,
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