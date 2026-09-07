export type Language = 'en' | 'hi' | 'or';

export interface OperatorTranslations {
  // Navigation & General
  operatingStation: string;
  mandiName: string;
  officerLabel: string;
  logout: string;
  searchPlaceholder: string;
  scanQr: string;
  scanTokenDesc: string;
  searchToken: string;
  filterAll: string;
  filterPending: string;
  filterWeighing: string;
  filterQuality: string;
  filterCompleted: string;
  backToDashboard: string;

  // Bottom Navigation & Modals
  navDashboard: string;
  navQueue: string;
  navOperations: string;
  navExceptions: string;
  navMore: string;
  mandiOperationsTitle: string;
  gateCheckIn: string;
  qualityLab: string;
  weighbridge: string;
  procurementDesk: string;
  additionalModules: string;
  stationExceptionsDisputes: string;
  farmerDossier: string;
  switchRole: string;

  // Dashboard KPIs
  targetToday: string;
  procuredToday: string;
  farmersWaiting: string;
  pendingQualityChecks: string;
  badgeP0: string;
  badgeLiveQueue: string;
  badgeActionReq: string;

  // Dashboard Progress
  procurementProgress: string;
  targetLabel: string;
  completedLabel: string;
  remainingLabel: string;

  // Live Operation Status Hero
  liveOperationStatus: string;
  liveOperationSubtitle: string;
  currentToken: string;
  farmer: string;
  crop: string;
  vehicle: string;
  quantity: string;
  lane: string;
  viewTransaction: string;
  callNextToken: string;
  nextTokensInLine: string;
  queueClear: string;

  // Operations Quick Actions
  quickActionsTitle: string;
  quickActionsSub: string;
  qaScanQr: string;
  qaLiveQueue: string;
  qaQualityCheck: string;
  qaWeighing: string;
  qaProcurement: string;
  qaExceptions: string;

  // Operational Alerts & Ledger
  operationalAlerts: string;
  operationalAlertsSub: string;
  noAlertsPending: string;
  recentTransactionsTitle: string;
  recentTransactionsSub: string;
  noRecentTransactions: string;

  // Queue Screen
  queueTitle: string;
  queueSub: string;
  btnCallNext: string;
  btnAnnounce: string;
  btnAllocateLane: string;
  btnPauseQueue: string;
  btnResumeQueue: string;
  currentlyServing: string;
  waitingCount: string;
  farmersText: string;
  searchQueuePlaceholder: string;

  // Check In Screen
  checkInTitle: string;
  checkInSub: string;
  farmerDetails: string;
  vehicleNo: string;
  bagsCount: string;
  allocatedWeighbridge: string;
  confirmCheckIn: string;
  scanFarmerQrPass: string;
  pointCameraInstruction: string;
  scanningText: string;
  btnSimulateScan: string;

  // Weighing Screen
  weighingTitle: string;
  weighingSub: string;
  netWeightLabel: string;
  grossWeightTitle: string;
  tareWeightTitle: string;
  iotSensorSync: string;
  expectedWeight: string;
  measuredWeight: string;
  confirmWeighing: string;
  weightValidationNotice: string;
  kgUnit: string;
  qtlUnit: string;

  // Quality Check Screen
  qualityTitle: string;
  qualitySub: string;
  moistureLabel: string;
  foreignMatterLabel: string;
  damagedGrainLabel: string;
  impuritiesLabel: string;
  gradeAssessment: string;
  gradeA: string;
  gradeB: string;
  gradeC: string;
  gradeReject: string;
  confirmQuality: string;
  remarksLabel: string;

  // Procurement Screen
  procurementTitle: string;
  procurementSub: string;
  totalPayoutLabel: string;
  settlementBreakdown: string;
  mspRateLabel: string;
  netQuantityLabel: string;
  beneficiaryDetails: string;
  completeProcurement: string;
  receiptIssued: string;
  declarationCertified: string;

  // Exceptions Screen
  exceptionsTitle: string;
  exceptionsSub: string;
  filterWeightDiscrepancy: string;
  filterMoistureHold: string;
  filterGateMismatch: string;
  filterDocumentation: string;
  resolveDispute: string;
  overrideHold: string;

  // Voice Announcements
  voiceDashboard: string;
  voiceQueue: string;
  voiceCheckIn: string;
  voiceWeighing: string;
  voiceQuality: string;
  voiceProcurement: string;
  voiceExceptions: string;
  voicePayments: string;
}

export const OPERATOR_I18N: Record<Language, OperatorTranslations> = {
  en: {
    operatingStation: 'OPERATING STATION',
    mandiName: 'Bhopal Krishi Upaj Mandi',
    officerLabel: 'Procurement Officer',
    logout: 'Logout',
    searchPlaceholder: 'Search token # or farmer name...',
    scanQr: 'Scan Token QR',
    scanTokenDesc: 'Scan farmer digital booking pass or token slip for instant arrival processing',
    searchToken: 'Quick Search',
    filterAll: 'All',
    filterPending: 'Check-in',
    filterWeighing: 'Weighing',
    filterQuality: 'Quality Lab',
    filterCompleted: 'Completed',
    backToDashboard: '‹ Back to Dashboard',

    navDashboard: 'Dashboard',
    navQueue: 'Queue',
    navOperations: 'Operations',
    navExceptions: 'Exceptions',
    navMore: 'More',
    mandiOperationsTitle: 'Mandi Station Operations',
    gateCheckIn: 'Gate Check-in',
    qualityLab: 'Quality Lab',
    weighbridge: 'Weighbridge',
    procurementDesk: 'Procurement',
    additionalModules: 'Additional Station Modules',
    stationExceptionsDisputes: 'Station Exceptions & Disputes',
    farmerDossier: 'Farmer Identity Dossier',
    switchRole: 'Switch Application Role',

    targetToday: "Today's Target",
    procuredToday: 'Procured Today',
    farmersWaiting: 'Farmers Waiting',
    pendingQualityChecks: 'Pending Quality Checks',
    badgeP0: 'P0',
    badgeLiveQueue: 'Live Queue',
    badgeActionReq: 'Action Req',

    procurementProgress: "TODAY'S PROCUREMENT PROGRESS",
    targetLabel: 'Target',
    completedLabel: 'Completed',
    remainingLabel: 'Remaining',

    liveOperationStatus: 'Live Operation Status',
    liveOperationSubtitle: 'Currently serving at inspection and live token workflow',
    currentToken: 'CURRENT TOKEN',
    farmer: 'Farmer',
    crop: 'Crop',
    vehicle: 'Vehicle',
    quantity: 'Quantity',
    lane: 'Lane',
    viewTransaction: 'VIEW TRANSACTION',
    callNextToken: 'CALL NEXT TOKEN',
    nextTokensInLine: 'NEXT TOKENS IN LINE',
    queueClear: 'Queue is clear. No waiting tokens.',

    quickActionsTitle: 'Operations Quick Actions',
    quickActionsSub: 'Direct station terminal controls',
    qaScanQr: 'Scan QR',
    qaLiveQueue: 'Live Queue',
    qaQualityCheck: 'Quality Check',
    qaWeighing: 'Weighing',
    qaProcurement: 'Procurement',
    qaExceptions: 'Exceptions',

    operationalAlerts: 'Operational Alerts',
    operationalAlertsSub: 'Urgent mandi flags requiring immediate station resolution',
    noAlertsPending: 'No operational alerts currently pending.',
    recentTransactionsTitle: 'Recent Mandi Transactions',
    recentTransactionsSub: 'Live procurement ledger entries',
    noRecentTransactions: 'No recent transactions found',

    queueTitle: 'Live Gate Queue',
    queueSub: 'Manage incoming tokens and gate entry traffic',
    btnCallNext: 'CALL NEXT',
    btnAnnounce: 'ANNOUNCE',
    btnAllocateLane: 'ALLOCATE LANE',
    btnPauseQueue: 'PAUSE QUEUE',
    btnResumeQueue: 'RESUME QUEUE',
    currentlyServing: 'CURRENTLY SERVING',
    waitingCount: 'Waiting',
    farmersText: 'Farmers',
    searchQueuePlaceholder: 'Search token, farmer or crop...',

    checkInTitle: 'Gate Entry Check-in',
    checkInSub: 'Scan farmer QR pass and register vehicle entrance',
    farmerDetails: 'Verified Booking Details',
    vehicleNo: 'Tractor / Vehicle Registration Number',
    bagsCount: 'Estimated Jute Bags Loaded',
    allocatedWeighbridge: 'Allocated Weighbridge Station #1 (North Gate)',
    confirmCheckIn: 'Confirm Gate Check-in & Route',
    scanFarmerQrPass: 'Scan Farmer QR Pass',
    pointCameraInstruction: "Point camera at farmer's QR code",
    scanningText: 'Scanning barcode / QR...',
    btnSimulateScan: 'Simulate Scanner Capture',

    weighingTitle: 'Electronic Weighbridge Station',
    weighingSub: 'Live automated IoT weighbridge capture and tare calibration',
    netWeightLabel: 'CALCULATED NET CROP WEIGHT',
    grossWeightTitle: '1. Gross Weight (Loaded Vehicle)',
    tareWeightTitle: '2. Tare Weight (Empty Vehicle)',
    iotSensorSync: 'IoT Sensor Sync',
    expectedWeight: 'Booked / Expected Quantity',
    measuredWeight: 'Actual Measured Net Weight',
    confirmWeighing: 'Confirm Recorded Net Weight',
    weightValidationNotice: 'Net weight automatically derived from IoT weighbridge load cells.',
    kgUnit: 'kg',
    qtlUnit: 'Quintal',

    qualityTitle: 'Quality & Moisture Lab Inspection',
    qualitySub: 'Physical sample analysis and MSP grade classification',
    moistureLabel: 'Moisture Percentage (%)',
    foreignMatterLabel: 'Foreign Matter / Husk (%)',
    damagedGrainLabel: 'Damaged / Shriveled Grains (%)',
    impuritiesLabel: 'Total Impurities (%)',
    gradeAssessment: 'Assigned MSP Grade Assessment',
    gradeA: 'Grade A (MSP + Bonus)',
    gradeB: 'Grade B (Standard MSP)',
    gradeC: 'Grade C (Deductions Apply)',
    gradeReject: 'Reject (Exceeds Tolerance Limits)',
    confirmQuality: 'Approve Quality Inspection',
    remarksLabel: 'Inspector Inspection Remarks',

    procurementTitle: 'Procurement Final Settlement',
    procurementSub: 'Verify calculations before issuing digital receipt & DBT order',
    totalPayoutLabel: 'TOTAL DBT PAYOUT AMOUNT',
    settlementBreakdown: 'Procurement Settlement Breakdown',
    mspRateLabel: 'Govt MSP Procurement Rate',
    netQuantityLabel: 'Accepted Net Quantity',
    beneficiaryDetails: 'Aadhaar-Seeded DBT Beneficiary Account',
    completeProcurement: 'Complete Procurement & Issue Slip',
    receiptIssued: 'Official procurement receipt generated and dispatched to PFMS Treasury.',
    declarationCertified: 'I hereby certify that the weight and quality metrics have been physically verified.',

    exceptionsTitle: 'Station Exceptions & Disputes',
    exceptionsSub: 'Resolve weighment discrepancies and moisture holds',
    filterWeightDiscrepancy: 'Weight Discrepancy',
    filterMoistureHold: 'Moisture Hold',
    filterGateMismatch: 'Gate Mismatch',
    filterDocumentation: 'Documentation',
    resolveDispute: 'Resolve Dispute',
    overrideHold: 'Supervisor Override',

    voiceDashboard: "Kisan Mitra Operator Dashboard. Today's target 5,000 Quintals, 18 farmers waiting in queue, live queue management and procurement workflow.",
    voiceQueue: 'Live procurement queue. Select a token to call the farmer to the gate or weighbridge.',
    voiceCheckIn: 'Gate check-in screen. Verify farmer vehicle number and issue weighbridge routing token.',
    voiceWeighing: 'Electronic weighbridge. Capture gross and tare weights using IoT sensors to compute net crop weight.',
    voiceQuality: 'Quality inspection lab. Enter moisture percentage and grade sample for MSP procurement.',
    voiceProcurement: 'Final procurement settlement. Review net weight, MSP rate, and trigger DBT payment.',
    voiceExceptions: 'Station exceptions manager. Resolve weighment discrepancies and moisture holds.',
    voicePayments: 'Direct benefit transfer payout batches transmitted to PFMS treasury.',
  },

  hi: {
    operatingStation: 'संचालन केंद्र',
    mandiName: 'भोपाल कृषि उपज मंडी',
    officerLabel: 'खरीद अधिकारी',
    logout: 'लॉगआउट',
    searchPlaceholder: 'टोकन संख्या या किसान का नाम खोजें...',
    scanQr: 'टोकन QR स्कैन करें',
    scanTokenDesc: 'किसान का डिजिटल बुकिंग पास या टोकन तुरंत स्कैन कर प्रवेश दर्ज करें',
    searchToken: 'त्वरित खोज',
    filterAll: 'सभी',
    filterPending: 'चेक-इन',
    filterWeighing: 'तौल केंद्र',
    filterQuality: 'गुणवत्ता लैब',
    filterCompleted: 'पूर्ण',
    backToDashboard: '‹ डैशबोर्ड पर वापस जाएं',

    navDashboard: 'डैशबोर्ड',
    navQueue: 'कतार',
    navOperations: 'संचालन',
    navExceptions: 'आपत्तियां',
    navMore: 'अधिक',
    mandiOperationsTitle: 'मंडी स्टेशन संचालन',
    gateCheckIn: 'गेट चेक-इन',
    qualityLab: 'गुणवत्ता लैब',
    weighbridge: 'धर्मकांटा तौल',
    procurementDesk: 'खरीद काउंटर',
    additionalModules: 'अतिरिक्त स्टेशन मॉड्यूल',
    stationExceptionsDisputes: 'मंडी आपत्तियां एवं विवाद',
    farmerDossier: 'किसान पहचान विवरण',
    switchRole: 'भूमिका बदलें',

    targetToday: 'आज का लक्ष्य',
    procuredToday: 'आज की खरीद',
    farmersWaiting: 'प्रतीक्षारत किसान',
    pendingQualityChecks: 'लंबित गुणवत्ता जांच',
    badgeP0: 'P0 प्राथमिकता',
    badgeLiveQueue: 'लाइव कतार',
    badgeActionReq: 'कार्रवाई आवश्यक',

    procurementProgress: 'आज की खरीद प्रगति',
    targetLabel: 'लक्ष्य',
    completedLabel: 'पूर्ण',
    remainingLabel: 'शेष',

    liveOperationStatus: 'सक्रिय संचालन स्थिति',
    liveOperationSubtitle: 'निरीक्षण केंद्र पर सक्रिय किसान और टोकन कार्यप्रवाह',
    currentToken: 'सक्रिय टोकन',
    farmer: 'किसान',
    crop: 'फसल',
    vehicle: 'वाहन',
    quantity: 'मात्रा',
    lane: 'लेन',
    viewTransaction: 'विवरण देखें',
    callNextToken: 'अगला टोकन बुलाएं',
    nextTokensInLine: 'कतार में अगले टोकन',
    queueClear: 'कतार रिक्त है। कोई प्रतीक्षारत टोकन नहीं।',

    quickActionsTitle: 'त्वरित संचालन कार्य',
    quickActionsSub: 'मंडी स्टेशन टर्मिनल नियंत्रण',
    qaScanQr: 'QR स्कैन',
    qaLiveQueue: 'लाइव कतार',
    qaQualityCheck: 'गुणवत्ता जांच',
    qaWeighing: 'धर्मकांटा तौल',
    qaProcurement: 'खरीद निपटान',
    qaExceptions: 'आपत्तियां',

    operationalAlerts: 'संचालन अलर्ट',
    operationalAlertsSub: 'तत्काल समाधान हेतु मंडी चेतावनियां',
    noAlertsPending: 'वर्तमान में कोई लंबित अलर्ट नहीं है।',
    recentTransactionsTitle: 'हाल के खरीद लेनदेन',
    recentTransactionsSub: 'सत्यापित खरीद रजिस्टर प्रविष्टियां',
    noRecentTransactions: 'कोई हालिया लेनदेन नहीं मिला',

    queueTitle: 'लाइव गेट कतार',
    queueSub: 'आने वाले टोकन और गेट प्रवेश का प्रबंधन',
    btnCallNext: 'अगला बुलाएं',
    btnAnnounce: 'घोषणा करें',
    btnAllocateLane: 'लेन दें',
    btnPauseQueue: 'कतार रोकें',
    btnResumeQueue: 'कतार चालू करें',
    currentlyServing: 'वर्तमान सेवा जारी',
    waitingCount: 'प्रतीक्षारत',
    farmersText: 'किसान',
    searchQueuePlaceholder: 'टोकन, किसान या फसल खोजें...',

    checkInTitle: 'गेट प्रवेश चेक-इन',
    checkInSub: 'किसान QR पास स्कैन करें और वाहन प्रवेश दर्ज करें',
    farmerDetails: 'सत्यापित बुकिंग विवरण',
    vehicleNo: 'ट्रैक्टर / वाहन पंजीकरण संख्या',
    bagsCount: 'भरी हुई बोरी की संख्या',
    allocatedWeighbridge: 'आवंटित तौल कांटा #1 (उत्तरी गेट)',
    confirmCheckIn: 'गेट चेक-इन दर्ज करें एवं आगे भेजें',
    scanFarmerQrPass: 'किसान QR पास स्कैन करें',
    pointCameraInstruction: 'किसान का QR कोड कैमरे के सामने लाएं',
    scanningText: 'बारकोड / QR स्कैन हो रहा है...',
    btnSimulateScan: 'स्कैनर सिमुलेट करें',

    weighingTitle: 'इलेक्ट्रॉनिक तौल कांटा केंद्र',
    weighingSub: 'आईओटी सेंसर आधारित स्वचालित वाहन तौल एवं नेट वजन गणना',
    netWeightLabel: 'गणना किया गया शुद्ध फसल वजन',
    grossWeightTitle: '1. कुल वजन (भरे हुए वाहन सहित)',
    tareWeightTitle: '2. खाली वाहन का वजन',
    iotSensorSync: 'आईओटी सेंसर सिंक',
    expectedWeight: 'अनुमानित / बुक की गई मात्रा',
    measuredWeight: 'वास्तविक मापा गया शुद्ध वजन',
    confirmWeighing: 'तौल वजन की पुष्टि करें',
    weightValidationNotice: 'नेट वजन सीधे आईओटी तौल कांटे से स्वतः प्राप्त किया गया है।',
    kgUnit: 'किग्रा',
    qtlUnit: 'क्विंटल',

    qualityTitle: 'गुणवत्ता एवं नमी परीक्षण प्रयोगशाला',
    qualitySub: 'फसल नमूने का भौतिक विश्लेषण और एमएसपी ग्रेड निर्धारण',
    moistureLabel: 'नमी प्रतिशत (%)',
    foreignMatterLabel: 'बाहरी कचरा / भूसी (%)',
    damagedGrainLabel: 'क्षतिग्रस्त / सिकुड़े दाने (%)',
    impuritiesLabel: 'कुल अशुद्धियां (%)',
    gradeAssessment: 'आवंटित एमएसपी गुणवत्ता ग्रेड',
    gradeA: 'ग्रेड A (पूर्ण एमएसपी + बोनस)',
    gradeB: 'ग्रेड B (मानक एमएसपी)',
    gradeC: 'ग्रेड C (कटौती लागू)',
    gradeReject: 'अस्वीकृत (मानक सीमा से अधिक)',
    confirmQuality: 'गुणवत्ता परीक्षण स्वीकृत करें',
    remarksLabel: 'निरीक्षक की विशेष टिप्पणी',

    procurementTitle: 'खरीद अंतिम निपटान एवं रसीद',
    procurementSub: 'रसीद जारी करने और डीबीटी भुगतान आदेश से पहले आंकड़ों की पुष्टि करें',
    totalPayoutLabel: 'कुल डीबीटी भुगतान राशि',
    settlementBreakdown: 'खरीद मूल्य निपटान विवरण',
    mspRateLabel: 'सरकारी एमएसपी खरीद दर',
    netQuantityLabel: 'स्वीकृत शुद्ध मात्रा',
    beneficiaryDetails: 'आधार से जुड़ा डीबीटी बैंक खाता',
    completeProcurement: 'खरीद पूर्ण करें एवं डिजिटल रसीद जारी करें',
    receiptIssued: 'आधिकारिक खरीद रसीद जारी कर पीएफएमएस ट्रेजरी को प्रेषित की गई।',
    declarationCertified: 'मैं प्रमाणित करता हूँ कि वजन और गुणवत्ता मानकों का भौतिक सत्यापन किया गया है।',

    exceptionsTitle: 'मंडी आपत्तियां एवं विवाद',
    exceptionsSub: 'वजन अंतर और नमी संबंधी आपत्तियों का त्वरित समाधान करें',
    filterWeightDiscrepancy: 'वजन अंतर',
    filterMoistureHold: 'नमी आपत्ति',
    filterGateMismatch: 'गेट बेमेल',
    filterDocumentation: 'दस्तावेज',
    resolveDispute: 'विवाद सुलझाएं',
    overrideHold: 'पर्यवेक्षक स्वीकृति',

    voiceDashboard: 'किसान मित्र ऑपरेटर डैशबोर्ड। आज का लक्ष्य 5,000 क्विंटल, कतार में 18 किसान प्रतीक्षारत, लाइव कतार प्रबंधन एवं खरीद प्रक्रिया।',
    voiceQueue: 'मंडी कतार प्रबंधन। किसान को चेक-इन अथवा तौल कांटे पर बुलाने हेतु टोकन चुनें।',
    voiceCheckIn: 'गेट चेक-इन। वाहन संख्या दर्ज करें और तौल कांटा आवंटित करें।',
    voiceWeighing: 'इलेक्ट्रॉनिक तौल कांटा। आईओटी सेंसर से कुल व खाली वजन लेकर शुद्ध फसल वजन प्राप्त करें।',
    voiceQuality: 'गुणवत्ता लैब। नमी और दानों की जांच कर उचित एमएसपी ग्रेड निर्धारित करें।',
    voiceProcurement: 'अंतिम खरीद निपटान। शुद्ध वजन एवं एमएसपी दर की पुष्टि कर डीबीटी भुगतान आदेश भेजें।',
    voiceExceptions: 'मंडी आपत्ति समाधान। वजन या गुणवत्ता विवाद का त्वरित समाधान करें।',
    voicePayments: 'डीबीटी बैंक भुगतान प्रेषण एवं पीएफएमएस ट्रेजरी स्थिति।',
  },

  or: {
    operatingStation: 'କାର୍ଯ୍ୟ କେନ୍ଦ୍ର',
    mandiName: 'ଭୋପାଳ କୃଷି ଉପଜ ମଣ୍ଡି',
    officerLabel: 'କ୍ରୟ ଅଧିକାରୀ',
    logout: 'ଲଗଆଉଟ୍',
    searchPlaceholder: 'ଟୋକନ୍ ନମ୍ବର କିମ୍ବା ଚାଷୀଙ୍କ ନାମ ଖୋଜନ୍ତୁ...',
    scanQr: 'ଟୋକନ୍ QR ସ୍କାନ୍ କରନ୍ତୁ',
    scanTokenDesc: 'ଚାଷୀଙ୍କ ଡିଜିଟାଲ୍ ବୁକିଂ କିମ୍ବା ଟୋକନ୍ ସ୍କାନ୍ କରି ତୁରନ୍ତ ପ୍ରବେଶ କରନ୍ତୁ',
    searchToken: 'ଦ୍ରୁତ ସନ୍ଧାନ',
    filterAll: 'ସମସ୍ତ',
    filterPending: 'ଚେକ୍-ଇନ୍',
    filterWeighing: 'ଓଜନ କେନ୍ଦ୍ର',
    filterQuality: 'ଗୁଣବତ୍ତା ଲ୍ୟାବ୍',
    filterCompleted: 'ସମ୍ପନ୍ନ',
    backToDashboard: '‹ ଡ୍ୟାସବୋର୍ଡକୁ ଫେରନ୍ତୁ',

    navDashboard: 'ଡ୍ୟାସବୋର୍ଡ',
    navQueue: 'ଧାଡ଼ି',
    navOperations: 'କାର୍ଯ୍ୟ',
    navExceptions: 'ଆପତ୍ତି',
    navMore: 'ଅଧିକ',
    mandiOperationsTitle: 'ମଣ୍ଡି ଷ୍ଟେସନ କାର୍ଯ୍ୟ',
    gateCheckIn: 'ଗେଟ୍ ଚେକ୍-ଇନ୍',
    qualityLab: 'ଗୁଣବତ୍ତା ଲ୍ୟାବ୍',
    weighbridge: 'ଓଜନ କଣ୍ଟା',
    procurementDesk: 'କ୍ରୟ ଡେସ୍କ',
    additionalModules: 'ଅତିରିକ୍ତ ଷ୍ଟେସନ ମଡ୍ୟୁଲ୍',
    stationExceptionsDisputes: 'ମଣ୍ଡି ଆପତ୍ତି ଓ ବିବାଦ',
    farmerDossier: 'ଚାଷୀ ପରିଚୟ ବିବରଣୀ',
    switchRole: 'ଭୂମିକା ପରିବର୍ତ୍ତନ',

    targetToday: 'ଆଜିର ଲକ୍ଷ୍ୟ',
    procuredToday: 'ଆଜି କ୍ରୟ',
    farmersWaiting: 'ଅପେକ୍ଷା ଚାଷୀ',
    pendingQualityChecks: 'ବାକି ଗୁଣବତ୍ତା ଯାଞ୍ଚ',
    badgeP0: 'P0 ପ୍ରାଥମିକତା',
    badgeLiveQueue: 'ଲାଇଭ୍ ଧାଡ଼ି',
    badgeActionReq: 'କାର୍ଯ୍ୟ ଆବଶ୍ୟକ',

    procurementProgress: 'ଆଜିର କ୍ରୟ ପ୍ରଗତି',
    targetLabel: 'ଲକ୍ଷ୍ୟ',
    completedLabel: 'ସମ୍ପନ୍ନ',
    remainingLabel: 'ବାକି',

    liveOperationStatus: 'ସକ୍ରିୟ କାର୍ଯ୍ୟ ସ୍ଥିତି',
    liveOperationSubtitle: 'ନିରୀକ୍ଷଣ କେନ୍ଦ୍ରରେ ସକ୍ରିୟ ଚାଷୀ ଓ ଟୋକନ୍ କାର୍ଯ୍ୟ',
    currentToken: 'ବର୍ତ୍ତମାନର ଟୋକନ୍',
    farmer: 'ଚାଷୀ',
    crop: 'ଫସଲ',
    vehicle: 'ଗାଡ଼ି',
    quantity: 'ପରିମାଣ',
    lane: 'ଲେନ୍',
    viewTransaction: 'ବିବରଣୀ ଦେଖନ୍ତୁ',
    callNextToken: 'ପରବର୍ତ୍ତୀ ଟୋକନ୍ ଡାକନ୍ତୁ',
    nextTokensInLine: 'ଧାଡ଼ିରେ ପରବର୍ତ୍ତୀ ଟୋକନ୍',
    queueClear: 'ଧାଡ଼ି ଖାଲି ଅଛି। କୌଣସି ଟୋକନ୍ ନାହିଁ।',

    quickActionsTitle: 'ଦ୍ରୁତ କାର୍ଯ୍ୟ',
    quickActionsSub: 'ମଣ୍ଡି ଷ୍ଟେସନ ଟର୍ମିନାଲ୍ ନିୟନ୍ତ୍ରଣ',
    qaScanQr: 'QR ସ୍କାନ୍',
    qaLiveQueue: 'ଲାଇଭ୍ ଧାଡ଼ି',
    qaQualityCheck: 'ଗୁଣବତ୍ତା ଯାଞ୍ଚ',
    qaWeighing: 'ଓଜନ କଣ୍ଟା',
    qaProcurement: 'କ୍ରୟ ଫଇସଲା',
    qaExceptions: 'ଆପତ୍ତି ସମାଧାନ',

    operationalAlerts: 'କାର୍ଯ୍ୟ ସତର୍କତା',
    operationalAlertsSub: 'ତୁରନ୍ତ ସମାଧାନ ଆବଶ୍ୟକ କରୁଥିବା ସତର୍କତା',
    noAlertsPending: 'କୌଣସି ବିଚାରାଧୀନ ସତର୍କତା ନାହିଁ।',
    recentTransactionsTitle: 'ନିକଟତମ କ୍ରୟ କାରବାର',
    recentTransactionsSub: 'କ୍ରୟ ଖାତା ପଞ୍ଜିକରଣ',
    noRecentTransactions: 'କୌଣସି କାରବାର ମିଳିଲା ନାହିଁ',

    queueTitle: 'ଲାଇଭ୍ ଗେଟ୍ ଧାଡ଼ି',
    queueSub: 'ଆସୁଥିବା ଟୋକନ୍ ଓ ଗେଟ୍ ପ୍ରବେଶ ପରିଚାଳନା',
    btnCallNext: 'ପରବର୍ତ୍ତୀ ଡାକନ୍ତୁ',
    btnAnnounce: 'ଘୋଷଣା କରନ୍ତୁ',
    btnAllocateLane: 'ଲେନ୍ ଦିଅନ୍ତୁ',
    btnPauseQueue: 'ଧାଡ଼ି ରୋକନ୍ତୁ',
    btnResumeQueue: 'ଧାଡ଼ି ଆରମ୍ଭ କରନ୍ତୁ',
    currentlyServing: 'ବର୍ତ୍ତମାନ ସେବା ଜାରି',
    waitingCount: 'ଅପେକ୍ଷା',
    farmersText: 'ଚାଷୀ',
    searchQueuePlaceholder: 'ଟୋକନ୍, ଚାଷୀ କିମ୍ବା ଫସଲ ଖୋଜନ୍ତୁ...',

    checkInTitle: 'ଗେଟ୍ ପ୍ରବେଶ ଚେକ୍-ଇନ୍',
    checkInSub: 'ଚାଷୀ QR ପାସ୍ ସ୍କାନ୍ କରି ଗାଡ଼ି ପ୍ରବେଶ ପଞ୍ଜିକରଣ କରନ୍ତୁ',
    farmerDetails: 'ଯାଞ୍ଚ ହୋଇଥିବା ବୁକିଂ ବିବରଣୀ',
    vehicleNo: 'ଟ୍ରାକ୍ଟର / ଗାଡ଼ି ପଞ୍ଜିକରଣ ସଂଖ୍ୟା',
    bagsCount: 'ଭରା ବସ୍ତା ସଂଖ୍ୟା',
    allocatedWeighbridge: 'ଆବଣ୍ଟିତ ଓଜନ କଣ୍ଟା #1 (ଉତ୍ତର ଫାଟକ)',
    confirmCheckIn: 'ଗେଟ୍ ଚେକ୍-ଇନ୍ ନିଶ୍ଚିତ କରନ୍ତୁ',
    scanFarmerQrPass: 'ଚାଷୀ QR ପାସ୍ ସ୍କାନ୍ କରନ୍ତୁ',
    pointCameraInstruction: 'ଚାଷୀଙ୍କ QR କୋଡ୍ କ୍ୟାମେରା ଆଗରେ ରଖନ୍ତୁ',
    scanningText: 'ବାରକୋଡ୍ / QR ସ୍କାନ୍ ହେଉଛି...',
    btnSimulateScan: 'ସ୍କାନର୍ ସିମ୍ୟୁଲେଟ୍ କରନ୍ତୁ',

    weighingTitle: 'ଇଲେକ୍ଟ୍ରୋନିକ୍ ଓଜନ କଣ୍ଟା କେନ୍ଦ୍ର',
    weighingSub: 'ଆଇଓଟି ସେନ୍ସର ଆଧାରିତ ସ୍ୱୟଂଚାଳିତ ଶୁଦ୍ଧ ଫସଲ ଓଜନ ନିର୍ଣ୍ଣୟ',
    netWeightLabel: 'ଗଣନା କରାଯାଇଥିବା ଶୁଦ୍ଧ ଫସଲ ଓଜନ',
    grossWeightTitle: '1. ସମୁଦାୟ ଓଜନ (ଭରା ଗାଡ଼ି ସହିତ)',
    tareWeightTitle: '2. ଖାଲି ଗାଡ଼ିର ଓଜନ',
    iotSensorSync: 'ଆଇଓଟି ସେନ୍ସର ସିଙ୍କ୍',
    expectedWeight: 'ଆନୁମାନିକ / ବୁକ୍ ହୋଇଥିବା ପରିମାଣ',
    measuredWeight: 'ପ୍ରକୃତ ଶୁଦ୍ଧ ଓଜନ',
    confirmWeighing: 'ଓଜନ ନିଶ୍ଚିତ କରନ୍ତୁ',
    weightValidationNotice: 'ଶୁଦ୍ଧ ଓଜନ ଆଇଓଟି ଓଜନ କଣ୍ଟାରୁ ସିଧାସଳଖ ମାପ କରାଯାଇଛି।',
    kgUnit: 'କିଲୋଗ୍ରାମ',
    qtlUnit: 'କ୍ୱିଣ୍ଟାଲ୍',

    qualityTitle: 'ଗୁଣବତ୍ତା ଓ ଆର୍ଦ୍ରତା ପରୀକ୍ଷାଗାର',
    qualitySub: 'ଫସଲ ନମୁନାର ଭୌତିକ ବିଶ୍ଳେଷଣ ଏବଂ ଏମ୍ଏସପି ଗ୍ରେଡ୍ ଚୟନ',
    moistureLabel: 'ଆର୍ଦ୍ରତା ପ୍ରତିଶତ (%)',
    foreignMatterLabel: 'ବାହ୍ୟ ଆବର୍ଜନା (%)',
    damagedGrainLabel: 'ନଷ୍ଟ ହୋଇଥିବା ଶସ୍ୟ (%)',
    impuritiesLabel: 'ମୋଟ ଅପଦ୍ରବ୍ୟ (%)',
    gradeAssessment: 'ନିର୍ଦ୍ଧାରିତ ଏମ୍ଏସପି ଗ୍ରେଡ୍',
    gradeA: 'ଗ୍ରେଡ୍ A (ପୂର୍ଣ୍ଣ ଏମ୍ଏସପି + ବୋନସ୍)',
    gradeB: 'ଗ୍ରେଡ୍ B (ମାନକ ଏମ୍ଏସପି)',
    gradeC: 'ଗ୍ରେଡ୍ C (କଟତି ଲାଗୁ)',
    gradeReject: 'ଅଗ୍ରାହ୍ୟ (ମାନକ ସୀମାରୁ ଅଧିକ)',
    confirmQuality: 'ଗୁଣବତ୍ତା ଯାଞ୍ଚ ଅନୁମୋଦନ କରନ୍ତୁ',
    remarksLabel: 'ନିରୀକ୍ଷକଙ୍କ ମନ୍ତବ୍ୟ',

    procurementTitle: 'କ୍ରୟ ଚୂଡ଼ାନ୍ତ ଫଇସଲା ଓ ରସିଦ୍',
    procurementSub: 'ଡିଜିଟାଲ୍ ରସିଦ୍ ଓ ଡିବିଟି ପେମେଣ୍ଟ ପୂର୍ବରୁ ହିସାବ ଯାଞ୍ଚ କରନ୍ତୁ',
    totalPayoutLabel: 'ମୋଟ ଡିବିଟି ପ୍ରଦାନ ରାଶି',
    settlementBreakdown: 'କ୍ରୟ ହିସାବ ବିବରଣୀ',
    mspRateLabel: 'ସରକାରୀ ଏମ୍ଏସପି ଦର',
    netQuantityLabel: 'ଗ୍ରହଣ କରାଯାଇଥିବା ଶୁଦ୍ଧ ପରିମାଣ',
    beneficiaryDetails: 'ଆଧାର ସଂଯୁକ୍ତ ଡିବିଟି ବ୍ୟାଙ୍କ ଖାତା',
    completeProcurement: 'କ୍ରୟ ସମ୍ପୂର୍ଣ୍ଣ କରନ୍ତୁ ଓ ରସିଦ୍ ଦିଅନ୍ତୁ',
    receiptIssued: 'ସରକାରୀ କ୍ରୟ ରସିଦ୍ ପ୍ରଦାନ କରାଗଲା ଏବଂ ପିଏଫଏମଏସ କୋଷାଗାରକୁ ପଠାଗଲା।',
    declarationCertified: 'ମୁଁ ପ୍ରମାଣିତ କରୁଛି ଯେ ଓଜନ ଏବଂ ଗୁଣବତ୍ତା ମାନକର ଭୌତିକ ଯାଞ୍ଚ କରାଯାଇଛି।',

    exceptionsTitle: 'ମଣ୍ଡି ଆପତ୍ତି ଓ ବିବାଦ',
    exceptionsSub: 'ଓଜନ ବା ଗୁଣବତ୍ତା ବିବାଦର ସମାଧାନ କରନ୍ତୁ',
    filterWeightDiscrepancy: 'ଓଜନ ଅନ୍ତର',
    filterMoistureHold: 'ଆର୍ଦ୍ରତା ଆପତ୍ତି',
    filterGateMismatch: 'ଗେଟ୍ ମେଳ ନାହିଁ',
    filterDocumentation: 'ଦସ୍ତାବିଜ୍',
    resolveDispute: 'ସମାଧାନ କରନ୍ତୁ',
    overrideHold: 'ତତ୍ତ୍ୱାବଧାରକ ଅନୁମତି',

    voiceDashboard: 'କିଷାନ ମିତ୍ର ଅପରେଟର ଡ୍ୟାସବୋର୍ଡ। ଆଜିର ଲକ୍ଷ୍ୟ 5,000 କ୍ୱିଣ୍ଟାଲ, ଧାଡ଼ିରେ 18 ଜଣ ଚାଷୀ ଅପେକ୍ଷାରତ, ଧାଡ଼ି ପରିଚାଳନା ଓ କ୍ରୟ ପ୍ରକ୍ରିୟା।',
    voiceQueue: 'ମଣ୍ଡି ଧାଡ଼ି ପରିଚାଳନା। ଚାଷୀଙ୍କୁ ଡାକିବା ପାଇଁ ଟୋକନ୍ ଚୟନ କରନ୍ତୁ।',
    voiceCheckIn: 'ଗେଟ୍ ଚେକ୍-ଇନ୍। ଗାଡ଼ି ନମ୍ବର ଏଣ୍ଟ୍ରି କରନ୍ତୁ ଏବଂ ଓଜନ କଣ୍ଟା ଆବଣ୍ଟନ କରନ୍ତୁ।',
    voiceWeighing: 'ଇଲେକ୍ଟ୍ରୋନିକ୍ ଓଜନ କଣ୍ଟା। ଆଇଓଟି ସେନ୍ସର ସାହାଯ୍ୟରେ ଶୁଦ୍ଧ ଓଜନ ମାପନ୍ତୁ।',
    voiceQuality: 'ଗୁଣବତ୍ତା ପରୀକ୍ଷାଗାର। ଆର୍ଦ୍ରତା ମାପି ଉଚିତ ଏମ୍ଏସପି ଗ୍ରେଡ୍ ଚୟନ କରନ୍ତୁ।',
    voiceProcurement: 'ଚୂଡ଼ାନ୍ତ କ୍ରୟ ସମାଧାନ। ଶୁଦ୍ଧ ଓଜନ ଓ ଏମ୍ଏସପି ଦର ଯାଞ୍ଚ କରି ଡିବିଟି ପେମେଣ୍ଟ ଆଦେଶ ପଠାନ୍ତୁ।',
    voiceExceptions: 'ମଣ୍ଡି ଆପତ୍ତି ସମାଧାନ। ଓଜନ ବା ଗୁଣବତ୍ତା ବିବାଦର ସମାଧାନ କରନ୍ତୁ।',
    voicePayments: 'ଡିବିଟି ବ୍ୟାଙ୍କ ପ୍ରଦାନ ଏବଂ ପିଏଫଏମଏସ ସ୍ଥିତି।',
  },
};

export function getOperatorTexts(lang?: string): OperatorTranslations {
  const code = (lang === 'hi' || lang === 'or' ? lang : 'en') as Language;
  return OPERATOR_I18N[code] || OPERATOR_I18N.en;
}
