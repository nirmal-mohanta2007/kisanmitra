import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Platform,
  Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../src/theme/colors';
import { spacing } from '../../src/theme/spacing';
import { radius } from '../../src/theme/radius';
import {
  ScreenContainer,
  KisanCard,
  SectionHeader,
  StatusBadge,
  FirebaseStatusBadge,
} from '../../src/components/common';
import { MOCK_CENTRES, MOCK_FARMERS, MOCK_OPERATORS } from '../../src/services/mock-data.service';
import { PaymentSettlementOversight, SystemExceptionLogs, AiAnomalyDetectionDashboard } from '../../src/components/admin';
import { ALL_INDIAN_STATES, ALL_INDIA_DISTRICTS } from '../../src/data/india-locations';
import { useAppContext } from '../../src/store/app-context';
import { UserRole } from '../../src/types/enums';

// Navigation column page types
type AdminPage =
  | 'Dashboard'
  | 'Mandis'
  | 'Analytics'
  | 'Payment'
  | 'Exceptions'
  | 'Anomalies'
  | 'FarmerData'
  | 'OperatorData'
  | 'Alerts'
  | 'Reports'
  | 'Settings';

type DateRangeOption = 'today' | 'week' | 'month' | 'season' | 'custom';
type DistrictOption = string;
type CropFilterOption = 'ALL' | 'Wheat' | 'Paddy' | 'Soybean' | 'Maize' | 'Jowar' | 'Gram';

export default function AdminDashboard() {
  const router = useRouter();
  const { state } = useAppContext();
  const adminName = state.currentUserName || 'Collector Shukla (State Admin)';

  // Active page state
  const [activePage, setActivePage] = useState<AdminPage>('Dashboard');

  // Filter states (Odisha is Primary State)
  const [selectedState, setSelectedState] = useState<string>('Odisha');
  const [selectedDistrict, setSelectedDistrict] = useState<DistrictOption>('ALL');
  const [dateRange, setDateRange] = useState<DateRangeOption>('today');
  const [selectedCrop, setSelectedCrop] = useState<CropFilterOption>('ALL');

  // Farmer & Operator data search/filter states
  const [farmerSearchQuery, setFarmerSearchQuery] = useState('');
  const [farmerFilterDistrict, setFarmerFilterDistrict] = useState('ALL');

  // Mandis Monitor specific filter & search states
  const [mandiReportType, setMandiReportType] = useState<'ALL' | 'GOVT_MSP' | 'PRIVATE_APMC' | 'FPO'>('ALL');
  const [mandiCropFilter, setMandiCropFilter] = useState<'ALL' | 'Wheat' | 'Paddy' | 'Soybean' | 'Maize' | 'Gram' | 'Jowar'>('ALL');
  const [mandiDateRange, setMandiDateRange] = useState<'today' | '7days' | '30days' | 'season'>('today');
  const [mandiSearchQuery, setMandiSearchQuery] = useState('');
  const [mandiDistrictFilter, setMandiDistrictFilter] = useState('ALL');

  // Dismissed alerts tracking
  const [dismissedAlerts, setDismissedAlerts] = useState<string[]>([]);

  // Navigation items configuration (Strictly formatted serial options)
  const navItems: { id: AdminPage; label: string; icon: keyof typeof Ionicons.glyphMap; badge?: string; badgeColor?: string }[] = [
    { id: 'Dashboard', label: 'Dashboard', icon: 'speedometer', badge: 'Live', badgeColor: colors.primary },
    { id: 'Mandis', label: 'Mandis', icon: 'business', badge: '24 Active', badgeColor: colors.secondary },
    { id: 'Analytics', label: 'Analytics', icon: 'bar-chart' },
    { id: 'Payment', label: 'Payment', icon: 'cash', badge: '₹68.5Cr DBT', badgeColor: '#7B1FA2' },
    { id: 'Exceptions', label: 'Exceptions', icon: 'alert-circle', badge: '148 Logs (7D)', badgeColor: colors.error },
    { id: 'Anomalies', label: 'Anomalies', icon: 'warning', badge: '48 Alerts', badgeColor: '#EF4444' },
    { id: 'FarmerData', label: 'Farmer Data', icon: 'leaf', badge: '12.4k', badgeColor: '#2E7D32' },
    { id: 'OperatorData', label: 'Operator Data', icon: 'construct', badge: '48 Active', badgeColor: '#1565C0' },
    { id: 'Alerts', label: 'Alerts', icon: 'notifications', badge: '4 New', badgeColor: '#D32F2F' },
    { id: 'Reports', label: 'Reports', icon: 'document-text' },
    { id: 'Settings', label: 'Settings', icon: 'settings' },
  ];

  // Dynamic calculations based on filters
  const metrics = useMemo(() => {
    // Multipliers based on date range
    const rangeMultiplier = dateRange === 'today' ? 1 : dateRange === 'week' ? 6.5 : dateRange === 'month' ? 24 : 78;
    const districtFactor = selectedDistrict === 'ALL' ? 1.0 : selectedDistrict === 'Bhopal' ? 0.35 : selectedDistrict === 'Indore' ? 0.28 : selectedDistrict === 'Jabalpur' ? 0.22 : 0.15;
    const cropFactor = selectedCrop === 'ALL' ? 1.0 : selectedCrop === 'Wheat' ? 0.45 : selectedCrop === 'Paddy' ? 0.30 : selectedCrop === 'Soybean' ? 0.15 : 0.10;

    // Combined scale
    const scale = rangeMultiplier * districtFactor * cropFactor;

    // Farmers & Slots
    const totalFarmers = Math.round(12450 * (selectedDistrict === 'ALL' ? 1 : 0.25));
    const activeParticipating = Math.round(8920 * (selectedDistrict === 'ALL' ? 1 : 0.25));
    const bookedSlots = Math.round(1420 * scale);
    const morningSlots = Math.round(bookedSlots * 0.58);
    const afternoonSlots = bookedSlots - morningSlots;

    // Checked in and completed
    const checkedIn = Math.round(218 * (dateRange === 'today' ? districtFactor : scale * 0.2));
    const completedProcurement = Math.round(864 * scale);

    // Crops Collected in MT (Metric Tonnes) and Value
    const cropCollectedMT = Number((10050 * (scale / (dateRange === 'today' ? 1 : rangeMultiplier * 0.85))).toFixed(1));
    const targetMT = Math.round(cropCollectedMT * 1.24);
    const targetAchievedPct = Number(((cropCollectedMT / targetMT) * 100).toFixed(1));

    // Financial Values (₹ in Crores)
    const procurementValueCr = Number((cropCollectedMT * 0.00266).toFixed(2));
    const totalBudgetCr = Number((procurementValueCr * 1.38).toFixed(2));
    const paymentCompletedCr = Number((procurementValueCr * 0.81).toFixed(2));
    const paymentPendingCr = Number((procurementValueCr - paymentCompletedCr).toFixed(2));
    const remainingBudgetCr = Number((totalBudgetCr - procurementValueCr).toFixed(2));
    const budgetUtilizedPct = Number(((paymentCompletedCr / totalBudgetCr) * 100).toFixed(1));

    // Mandis
    const activeMandis = selectedDistrict === 'ALL' ? 24 : 4;
    const totalMandis = selectedDistrict === 'ALL' ? 25 : 4;
    const mandiEfficiency = 94.8;
    const avgWaitingTime = selectedDistrict === 'ALL' ? 11 : selectedDistrict === 'Bhopal' ? 10 : selectedDistrict === 'Indore' ? 5 : 15;

    return {
      totalFarmers,
      activeParticipating,
      bookedSlots,
      morningSlots,
      afternoonSlots,
      checkedIn,
      completedProcurement,
      cropCollectedMT,
      targetMT,
      targetAchievedPct,
      procurementValueCr,
      totalBudgetCr,
      paymentCompletedCr,
      paymentPendingCr,
      remainingBudgetCr,
      budgetUtilizedPct,
      activeMandis,
      totalMandis,
      mandiEfficiency,
      avgWaitingTime,
    };
  }, [selectedDistrict, dateRange, selectedCrop]);

  // Crop Target vs Achieved Table Data (includes Mandi Capacity Fill Percentage)
  const cropTargets = [
    { crop: 'Wheat (गेहूं)', targetMT: 5000, achievedMT: 4120, pct: 82.4, mandiFillPct: 86.5, valCr: 9.37, msp: '₹2,275/Qtl', status: 'On Track' },
    { crop: 'Paddy (धान)', targetMT: 3500, achievedMT: 2890, pct: 82.5, mandiFillPct: 79.2, valCr: 6.31, msp: '₹2,183/Qtl', status: 'On Track' },
    { crop: 'Soybean (सोयाबीन)', targetMT: 2000, achievedMT: 1640, pct: 82.0, mandiFillPct: 74.8, valCr: 7.54, msp: '₹4,600/Qtl', status: 'On Track' },
    { crop: 'Maize (मक्का)', targetMT: 1200, achievedMT: 860, pct: 71.7, mandiFillPct: 62.0, valCr: 1.80, msp: '₹2,090/Qtl', status: 'Attention' },
    { crop: 'Jowar (ज्वार)', targetMT: 800, achievedMT: 540, pct: 67.5, mandiFillPct: 58.4, valCr: 1.72, msp: '₹3,180/Qtl', status: 'Behind' },
    { crop: 'Gram/Chana (चना)', targetMT: 600, achievedMT: 410, pct: 68.3, mandiFillPct: 55.0, valCr: 2.23, msp: '₹5,440/Qtl', status: 'Attention' },
  ];

  // Daily Procurement Data (MT)
  const dailyData = [
    { day: 'Mon', mt: 420, label: '420 MT' },
    { day: 'Tue', mt: 610, label: '610 MT' },
    { day: 'Wed', mt: 890, label: '890 MT' },
    { day: 'Thu', mt: 580, label: '580 MT' },
    { day: 'Fri', mt: 760, label: '760 MT' },
    { day: 'Sat', mt: 920, label: '920 MT' },
    { day: 'Sun', mt: 450, label: '450 MT' },
  ];
  const maxDailyMT = Math.max(...dailyData.map((d) => d.mt));

  // District-wise Procurement Data (MT)
  const districtData = [
    { name: 'Bhopal', mt: 2840, target: 3200, pct: 88.7, mandis: 6, delay: '10 min' },
    { name: 'Indore', mt: 2420, target: 2800, pct: 86.4, mandis: 5, delay: '5 min' },
    { name: 'Jabalpur', mt: 1980, target: 2500, pct: 79.2, mandis: 5, delay: '15 min' },
    { name: 'Sehore', mt: 1650, target: 2100, pct: 78.5, mandis: 4, delay: '8 min' },
    { name: 'Dewas', mt: 1160, target: 1600, pct: 72.5, mandis: 3, delay: '12 min' },
  ];

  // Crop-wise Procurement Data (MT)
  const cropShareData = [
    { crop: 'Wheat', mt: 4120, pct: 41, color: '#4CAF50' },
    { crop: 'Paddy', mt: 2890, pct: 29, color: '#2196F3' },
    { crop: 'Soybean', mt: 1640, pct: 16, color: '#FF9800' },
    { crop: 'Maize', mt: 860, pct: 9, color: '#9C27B0' },
    { crop: 'Jowar', mt: 540, pct: 5, color: '#00BCD4' },
  ];

  // Live Alerts List
  const liveAlerts = [
    {
      id: 'ALT-101',
      type: 'PAYMENT',
      severity: 'CRITICAL',
      title: 'PFMS Clearance Pending (>24 Hours)',
      desc: '₹4.80 Cr Treasury payout to 380 farmers awaiting clearing acknowledgment.',
      action: 'Accelerate Bank Batch',
      time: '12 min ago',
      icon: 'cash-outline',
      color: '#D32F2F',
    },
    {
      id: 'ALT-102',
      type: 'CAPACITY',
      severity: 'WARNING',
      title: 'Karond Mandi Capacity at 92%',
      desc: '74 of 80 capacity slots occupied. Traffic diversion to Sehore advised.',
      action: 'Divert New Tokens',
      time: '25 min ago',
      icon: 'warning-outline',
      color: '#E65100',
    },
    {
      id: 'ALT-103',
      type: 'WAIT_TIME',
      severity: 'WARNING',
      title: 'Wright Town Mandi Queue Spike (18 min wait)',
      desc: 'Average weighbridge turnaround exceeded 15-minute standard.',
      action: 'Open Weighbridge 2',
      time: '45 min ago',
      icon: 'time-outline',
      color: '#F57C00',
    },
    {
      id: 'ALT-104',
      type: 'QUALITY',
      severity: 'INFO',
      title: '3 Moisture Exception Holds in Sehore',
      desc: 'Lots kept on quality drying hold pending second moisture re-test.',
      action: 'Review Lab Reports',
      time: '1 hour ago',
      icon: 'leaf-outline',
      color: '#1565C0',
    },
  ];

  // Comprehensive All Mandis Surveillance Data (Har mandi ki efficiency, stock capacity aur bottleneck alerts)
  const mandiDetailedList = [
    {
      id: 'C-001',
      name: 'Krishi Upaj Mandi, Karond',
      district: 'Bhopal',
      address: 'Karond Bypass Road, APMC Yard, Bhopal',
      operatingHours: '08:00 - 17:00',
      isActive: true,
      efficiency: 96.2,
      avgTurnaroundMin: 7.8,
      stockCapacityMT: 4200,
      currentStockMT: 3450,
      stockFillPct: 82.1,
      availableCapacityMT: 750,
      bottleneckStatus: 'WARNING',
      bottleneckTitle: 'Weighbridge 2 Queue Delay',
      bottleneckMessage: 'Weighbridge 2 queue spike (14 min delay) · Scale 3 opening advised',
      supportedCrops: ['Wheat', 'Paddy', 'Soybean', 'Maize', 'Gram'],
      procurementType: 'GOVT_MSP',
      todayIntakeMT: 640,
      totalIntakeMT: 2840,
      intakeTargetMT: 3100,
      intakeTargetPct: 91.6,
      farmerTurnout: {
        booked: 80,
        checkedIn: 76,
        procured: 74,
        turnoutPct: 92.5,
      },
      mspExpenditureCr: 7.55,
      paymentCompletedCr: 6.18,
      paymentPendingCr: 1.37,
      scalesOnline: 4,
      totalScales: 4,
    },
    {
      id: 'C-002',
      name: 'Kisan Seva Kendra, Mhow Road',
      district: 'Indore',
      address: 'Mhow-Neemuch Road, Sector A, Indore',
      operatingHours: '08:00 - 16:00',
      isActive: true,
      efficiency: 97.4,
      avgTurnaroundMin: 6.9,
      stockCapacityMT: 3800,
      currentStockMT: 2890,
      stockFillPct: 76.1,
      availableCapacityMT: 910,
      bottleneckStatus: 'OPTIMAL',
      bottleneckTitle: 'Optimal Throughput',
      bottleneckMessage: 'Smooth throughput · Both weighbridges operating with < 6 min wait',
      supportedCrops: ['Wheat', 'Soybean', 'Gram', 'Jowar'],
      procurementType: 'GOVT_MSP',
      todayIntakeMT: 580,
      totalIntakeMT: 2420,
      intakeTargetMT: 2800,
      intakeTargetPct: 86.4,
      farmerTurnout: {
        booked: 65,
        checkedIn: 61,
        procured: 59,
        turnoutPct: 90.8,
      },
      mspExpenditureCr: 6.44,
      paymentCompletedCr: 5.30,
      paymentPendingCr: 1.14,
      scalesOnline: 3,
      totalScales: 3,
    },
    {
      id: 'C-003',
      name: 'Rajya Kray Kendra, Wright Town',
      district: 'Jabalpur',
      address: 'APMC Market Complex, Wright Town, Jabalpur',
      operatingHours: '09:00 - 17:00',
      isActive: true,
      efficiency: 91.8,
      avgTurnaroundMin: 13.5,
      stockCapacityMT: 3500,
      currentStockMT: 3220,
      stockFillPct: 92.0,
      availableCapacityMT: 280,
      bottleneckStatus: 'CRITICAL',
      bottleneckTitle: 'Storage Yard Near Max Limit',
      bottleneckMessage: 'Storage yard capacity at 92% · Divert incoming tractor-trolleys to Sehore',
      supportedCrops: ['Paddy', 'Wheat', 'Maize', 'Soybean'],
      procurementType: 'GOVT_MSP',
      todayIntakeMT: 490,
      totalIntakeMT: 1980,
      intakeTargetMT: 2500,
      intakeTargetPct: 79.2,
      farmerTurnout: {
        booked: 55,
        checkedIn: 52,
        procured: 47,
        turnoutPct: 85.5,
      },
      mspExpenditureCr: 5.27,
      paymentCompletedCr: 4.32,
      paymentPendingCr: 0.95,
      scalesOnline: 3,
      totalScales: 4,
    },
    {
      id: 'C-004',
      name: 'Krishi Upaj Mandi Samiti, Sehore',
      district: 'Sehore',
      address: 'Shyampur Road, Mandi Yard, Sehore',
      operatingHours: '08:00 - 17:00',
      isActive: true,
      efficiency: 95.5,
      avgTurnaroundMin: 8.4,
      stockCapacityMT: 3200,
      currentStockMT: 2410,
      stockFillPct: 75.3,
      availableCapacityMT: 790,
      bottleneckStatus: 'OPTIMAL',
      bottleneckTitle: 'Optimal Throughput',
      bottleneckMessage: 'Traffic moving normally · Moisture test turnaround at 4.5 minutes',
      supportedCrops: ['Wheat', 'Gram', 'Soybean'],
      procurementType: 'GOVT_MSP',
      todayIntakeMT: 430,
      totalIntakeMT: 1650,
      intakeTargetMT: 2100,
      intakeTargetPct: 78.6,
      farmerTurnout: {
        booked: 50,
        checkedIn: 47,
        procured: 45,
        turnoutPct: 90.0,
      },
      mspExpenditureCr: 4.39,
      paymentCompletedCr: 3.60,
      paymentPendingCr: 0.79,
      scalesOnline: 3,
      totalScales: 3,
    },
    {
      id: 'C-005',
      name: 'Dewas Anaj Mandi Kendra',
      district: 'Dewas',
      address: 'Ujjain Road Industrial Area, Dewas',
      operatingHours: '08:30 - 16:30',
      isActive: true,
      efficiency: 92.4,
      avgTurnaroundMin: 11.2,
      stockCapacityMT: 2900,
      currentStockMT: 2380,
      stockFillPct: 82.1,
      availableCapacityMT: 520,
      bottleneckStatus: 'WARNING',
      bottleneckTitle: 'Bagging & Labor Delay',
      bottleneckMessage: 'Bagging & packaging labor delay · Extra 30 porters dispatched',
      supportedCrops: ['Soybean', 'Wheat', 'Gram', 'Maize'],
      procurementType: 'GOVT_MSP',
      todayIntakeMT: 360,
      totalIntakeMT: 1160,
      intakeTargetMT: 1600,
      intakeTargetPct: 72.5,
      farmerTurnout: {
        booked: 42,
        checkedIn: 39,
        procured: 36,
        turnoutPct: 85.7,
      },
      mspExpenditureCr: 3.09,
      paymentCompletedCr: 2.53,
      paymentPendingCr: 0.56,
      scalesOnline: 2,
      totalScales: 3,
    },
    {
      id: 'C-006',
      name: 'Harda Kray & Bhandaran Kendra',
      district: 'Harda',
      address: 'Timarni Bypass Road, Harda',
      operatingHours: '08:00 - 17:00',
      isActive: true,
      efficiency: 94.1,
      avgTurnaroundMin: 9.1,
      stockCapacityMT: 2600,
      currentStockMT: 1980,
      stockFillPct: 76.2,
      availableCapacityMT: 620,
      bottleneckStatus: 'OPTIMAL',
      bottleneckTitle: 'Optimal Throughput',
      bottleneckMessage: 'Weighbridge calibrated today · No pending dispute tickets',
      supportedCrops: ['Wheat', 'Gram', 'Paddy'],
      procurementType: 'GOVT_MSP',
      todayIntakeMT: 290,
      totalIntakeMT: 890,
      intakeTargetMT: 1300,
      intakeTargetPct: 68.5,
      farmerTurnout: {
        booked: 35,
        checkedIn: 32,
        procured: 31,
        turnoutPct: 88.6,
      },
      mspExpenditureCr: 2.37,
      paymentCompletedCr: 1.94,
      paymentPendingCr: 0.43,
      scalesOnline: 2,
      totalScales: 2,
    },
    {
      id: 'C-007',
      name: 'Chhindwara Mukhya Mandi',
      district: 'Chhindwara',
      address: 'Parasia Road, APMC Yard, Chhindwara',
      operatingHours: '08:30 - 17:00',
      isActive: true,
      efficiency: 93.8,
      avgTurnaroundMin: 9.8,
      stockCapacityMT: 3300,
      currentStockMT: 2120,
      stockFillPct: 64.2,
      availableCapacityMT: 1180,
      bottleneckStatus: 'OPTIMAL',
      bottleneckTitle: 'Optimal Throughput',
      bottleneckMessage: 'Capacity green · Active maize & wheat intake within standard time',
      supportedCrops: ['Maize', 'Wheat', 'Jowar'],
      procurementType: 'GOVT_MSP',
      todayIntakeMT: 310,
      totalIntakeMT: 1110,
      intakeTargetMT: 1500,
      intakeTargetPct: 74.0,
      farmerTurnout: {
        booked: 38,
        checkedIn: 35,
        procured: 33,
        turnoutPct: 86.8,
      },
      mspExpenditureCr: 2.95,
      paymentCompletedCr: 2.42,
      paymentPendingCr: 0.53,
      scalesOnline: 3,
      totalScales: 3,
    },
  ];

  // Live Farmer Data (Admin Access)
  const adminFarmerRecords = [
    {
      id: 'F-101',
      name: 'Ramesh Nayak',
      fatherName: 'Late Shivram Nayak',
      phone: '9876543210',
      village: 'Jamonia',
      district: 'Sehore',
      landAcres: 6.5,
      tokenNumber: 'TK-0421',
      slotTime: '06 Sep 2026 · Morning (09:00 - 11:00)',
      crop: 'Wheat (गेहूं)',
      expectedMT: 12.0,
      weighedMT: 11.8,
      moisturePct: 11.2,
      grade: 'Grade A (FAQ)',
      status: 'COMPLETED',
      paymentAmount: '₹2,68,450',
      dbtStatus: 'CREDITED (PFMS)',
    },
    {
      id: 'F-102',
      name: 'Sunita Devi',
      fatherName: 'W/o Radheshyam',
      phone: '9876543211',
      village: 'Khirkiya',
      district: 'Harda',
      landAcres: 4.2,
      tokenNumber: 'TK-0422',
      slotTime: '06 Sep 2026 · Morning (10:00 - 12:00)',
      crop: 'Soybean (सोयाबीन)',
      expectedMT: 8.5,
      weighedMT: 8.4,
      moisturePct: 10.8,
      grade: 'Grade A (FAQ)',
      status: 'CHECKED_IN',
      paymentAmount: '₹3,86,400',
      dbtStatus: 'INSPECTION_QUEUE',
    },
    {
      id: 'F-103',
      name: 'Mohan Patel',
      fatherName: 'S/o Shankarlal Patel',
      phone: '9876543212',
      village: 'Sonkatch',
      district: 'Dewas',
      landAcres: 9.0,
      tokenNumber: 'TK-0423',
      slotTime: '06 Sep 2026 · Afternoon (12:30 - 14:30)',
      crop: 'Wheat (गेहूं)',
      expectedMT: 18.0,
      weighedMT: 0.0,
      moisturePct: 0.0,
      grade: 'Pending Assay',
      status: 'SLOT_BOOKED',
      paymentAmount: '₹4,09,500',
      dbtStatus: 'AWAITING_DELIVERY',
    },
    {
      id: 'F-104',
      name: 'Lakshmi Bai',
      fatherName: 'W/o Jagdish',
      phone: '9876543213',
      village: 'Parasia',
      district: 'Chhindwara',
      landAcres: 3.8,
      tokenNumber: 'TK-0424',
      slotTime: '06 Sep 2026 · Morning (08:30 - 10:30)',
      crop: 'Maize (मक्का)',
      expectedMT: 7.2,
      weighedMT: 7.1,
      moisturePct: 12.0,
      grade: 'Grade A (FAQ)',
      status: 'COMPLETED',
      paymentAmount: '₹1,48,390',
      dbtStatus: 'CREDITED (PFMS)',
    },
    {
      id: 'F-105',
      name: 'Bhagwan Das',
      fatherName: 'S/o Dinanath',
      phone: '9876543214',
      village: 'Narsinghpur Rd',
      district: 'Jabalpur',
      landAcres: 7.5,
      tokenNumber: 'TK-0425',
      slotTime: '06 Sep 2026 · Afternoon (14:00 - 16:00)',
      crop: 'Paddy (धान)',
      expectedMT: 15.0,
      weighedMT: 14.9,
      moisturePct: 13.1,
      grade: 'Grade B (Drying Hold)',
      status: 'HOLD_EXCEPTION',
      paymentAmount: '₹3,25,267',
      dbtStatus: 'HOLD (RETEST)',
    },
    {
      id: 'F-106',
      name: 'Devendra Singh Tomar',
      fatherName: 'S/o Brijendra Singh',
      phone: '9876543215',
      village: 'Berasia',
      district: 'Bhopal',
      landAcres: 12.0,
      tokenNumber: 'TK-0426',
      slotTime: '06 Sep 2026 · Morning (09:00 - 11:00)',
      crop: 'Wheat (गेहूं)',
      expectedMT: 24.0,
      weighedMT: 23.8,
      moisturePct: 11.4,
      grade: 'Grade A (FAQ)',
      status: 'COMPLETED',
      paymentAmount: '₹5,41,450',
      dbtStatus: 'CREDITED (PFMS)',
    },
  ];

  // Live Operator Staff Data (Admin Access)
  const adminOperatorRecords = [
    {
      id: 'O-101',
      name: 'Dr Nirmal Kumar Mohanta',
      designation: 'Mandi Superintendent & Assayer',
      mandi: 'Krishi Upaj Mandi, Karond (Bhopal)',
      counter: 'Weighbridge Gate 01',
      phone: '9348856994',
      shift: 'Morning (08:00 - 16:00)',
      tokensProcessedToday: 42,
      lotsWeighedMT: 512.4,
      moistureTestsLogged: 42,
      calibrationStatus: '100% Sensor OK',
      turnaroundSpeed: '7.8 min/token',
      status: 'ACTIVE_ONLINE',
    },
    {
      id: 'O-102',
      name: 'Rajesh Verma',
      designation: 'Senior Scale Operator',
      mandi: 'Kisan Seva Kendra, Mhow Rd (Indore)',
      counter: 'Weighbridge Counter 02',
      phone: '9998887771',
      shift: 'Morning (08:00 - 16:00)',
      tokensProcessedToday: 38,
      lotsWeighedMT: 448.0,
      moistureTestsLogged: 38,
      calibrationStatus: 'Tare Calibrated',
      turnaroundSpeed: '6.9 min/token',
      status: 'ACTIVE_ONLINE',
    },
    {
      id: 'O-103',
      name: 'Priya Sharma',
      designation: 'Quality Control Assayer',
      mandi: 'Rajya Kray Kendra, Wright Town (Jabalpur)',
      counter: 'Moisture Testing Lab 01',
      phone: '9998887772',
      shift: 'General (09:00 - 17:00)',
      tokensProcessedToday: 31,
      lotsWeighedMT: 380.5,
      moistureTestsLogged: 35,
      calibrationStatus: 'Oven Tested',
      turnaroundSpeed: '8.4 min/token',
      status: 'ACTIVE_ONLINE',
    },
    {
      id: 'O-104',
      name: 'Vikramaditya Chouhan',
      designation: 'APMC Yard Traffic Officer',
      mandi: 'Sehore APMC Sub-Yard (Sehore)',
      counter: 'Entry Barrier Gate 01',
      phone: '9998887773',
      shift: 'Morning (07:30 - 15:30)',
      tokensProcessedToday: 29,
      lotsWeighedMT: 310.2,
      moistureTestsLogged: 29,
      calibrationStatus: 'Boom Barrier Active',
      turnaroundSpeed: '5.2 min/token',
      status: 'ACTIVE_ONLINE',
    },
  ];

  const handleDismissAlert = (id: string) => {
    setDismissedAlerts((prev) => [...prev, id]);
  };

  return (
    <ScreenContainer scrollable style={styles.container}>
      {/* 1. National Portal Strip */}
      <View style={styles.govHeaderStrip}>
        <Text style={styles.govHeaderText}>
          🇮🇳 Government of India · Department of Consumer Affairs (DoCA) · e-Uparjan 2026
        </Text>
      </View>

      {/* 2. Command Banner */}
      <View style={styles.commandBanner}>
        <View style={{ flex: 1 }}>
          <View style={styles.liveIndicatorRow}>
            <View style={styles.pulseCircle} />
            <Text style={styles.liveIndicatorText}>LIVE STATE PROCUREMENT COMMAND</Text>
          </View>
          <Text style={styles.commandTitle}>Statewide Procurement Operations Center</Text>
          <Text style={styles.commandSub}>
            Administrator: <Text style={{ color: '#80CBC4', fontWeight: 'bold' }}>{adminName}</Text> · Madhya Pradesh Division
          </Text>
        </View>

        <TouchableOpacity
          style={styles.logoutBtn}
          onPress={() => router.replace('/(auth)/welcome')}
          activeOpacity={0.85}
        >
          <Ionicons name="log-out-outline" size={16} color="#FFFFFF" style={{ marginRight: 4 }} />
          <Text style={styles.logoutBtnText}>Logout</Text>
        </TouchableOpacity>
      </View>

      <FirebaseStatusBadge showSeedButton={true} />

      {/* 3. Navigation Column / Bar (10 Pages) */}
      <View style={styles.navColumnContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.navColumnScroll}
        >
          {navItems.map((item) => {
            const isActive = activePage === item.id;
            return (
              <TouchableOpacity
                key={item.id}
                style={[styles.navColumnItem, isActive && styles.navColumnItemActive]}
                onPress={() => setActivePage(item.id)}
                activeOpacity={0.8}
              >
                <Ionicons
                  name={item.icon}
                  size={16}
                  color={isActive ? '#FFFFFF' : '#B0BEC5'}
                  style={{ marginRight: 6 }}
                />
                <Text style={[styles.navColumnText, isActive && styles.navColumnTextActive]}>
                  {item.label}
                </Text>
                {item.badge && (
                  <View
                    style={[
                      styles.navBadge,
                      { backgroundColor: isActive ? 'rgba(255,255,255,0.25)' : item.badgeColor || 'rgba(0,0,0,0.2)' },
                    ]}
                  >
                    <Text style={styles.navBadgeText}>{item.badge}</Text>
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* ========================================================================= */}
      {/* PAGE 1: DASHBOARD (MAIN PROCUREMENT STATE & DISTRICT MONITOR) */}
      {/* ========================================================================= */}
      {activePage === 'Dashboard' && (
        <View style={styles.pageContent}>
          {/* Multi-Level Filters Bar */}
          <KisanCard style={styles.filterCard}>
            <View style={styles.filterHeaderRow}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Ionicons name="funnel" size={16} color={colors.primary} style={{ marginRight: 6 }} />
                <Text style={styles.filterCardTitle}>State & District Procurement Filters</Text>
              </View>
              <Text style={styles.filterActiveLabel}>
                {selectedDistrict === 'ALL' ? `Statewide (${selectedState})` : `${selectedDistrict} (${selectedState})`} · {dateRange.toUpperCase()}
              </Text>
            </View>

            {/* Filter 0: State Selector with Odisha Primary */}
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 4 }}>
              <Text style={styles.filterSectionTitle}>🗺️ Select State / राज्य चुनें:</Text>
              <Text style={{ fontSize: 10, color: '#1B5E20', fontWeight: '800', backgroundColor: '#E8F5E9', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 }}>
                🌾 ODISHA PRIMARY STATE
              </Text>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterChipScroll}>
              {['Odisha', ...ALL_INDIAN_STATES.filter(s => s !== 'Odisha')].map((st) => (
                <TouchableOpacity
                  key={st}
                  style={[
                    styles.filterChip,
                    st === 'Odisha' && { backgroundColor: '#E8F5E9', borderColor: '#2E7D32', borderWidth: 1.5 },
                    selectedState === st && styles.filterChipActive,
                  ]}
                  onPress={() => {
                    setSelectedState(st);
                    setSelectedDistrict('ALL');
                  }}
                >
                  <Text
                    style={[
                      styles.filterChipText,
                      st === 'Odisha' && { color: '#1B5E20', fontWeight: 'bold' },
                      selectedState === st && styles.filterChipTextActive,
                    ]}
                  >
                    {st === 'Odisha' ? '🌾 Odisha (Primary)' : st}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            {/* Filter 1: District Selector */}
            <Text style={styles.filterSectionTitle}>📍 Select District ({selectedState}) / ज़िला चुनें:</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterChipScroll}>
              {['ALL', ...(ALL_INDIA_DISTRICTS[selectedState] || ['Central', 'North', 'South', 'East', 'West'])].slice(0, 18).map((dist) => (
                <TouchableOpacity
                  key={dist}
                  style={[styles.filterChip, selectedDistrict === dist && styles.filterChipActive]}
                  onPress={() => setSelectedDistrict(dist)}
                >
                  <Text style={[styles.filterChipText, selectedDistrict === dist && styles.filterChipTextActive]}>
                    {dist === 'ALL' ? `🗺️ All ${selectedState}` : dist}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            {/* Filter 2: Date Range Selector */}
            <Text style={styles.filterSectionTitle}>📅 Date Range / समयावधि:</Text>
            <View style={styles.dateRangeRow}>
              {[
                { id: 'today', label: 'Today (Live)' },
                { id: 'week', label: 'Last 7 Days' },
                { id: 'month', label: 'Last 30 Days' },
                { id: 'season', label: '2026 Season' },
              ].map((range) => (
                <TouchableOpacity
                  key={range.id}
                  style={[styles.dateRangeBtn, dateRange === range.id && styles.dateRangeBtnActive]}
                  onPress={() => setDateRange(range.id as DateRangeOption)}
                >
                  <Text style={[styles.dateRangeText, dateRange === range.id && styles.dateRangeTextActive]}>
                    {range.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Filter 3: Crop Selector */}
            <Text style={styles.filterSectionTitle}>🌾 Crop Type / फसल प्रकार:</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterChipScroll}>
              {(['ALL', 'Wheat', 'Paddy', 'Soybean', 'Maize', 'Jowar'] as CropFilterOption[]).map((crop) => (
                <TouchableOpacity
                  key={crop}
                  style={[styles.filterChip, selectedCrop === crop && styles.filterChipActiveCrop]}
                  onPress={() => setSelectedCrop(crop)}
                >
                  <Text style={[styles.filterChipText, selectedCrop === crop && styles.filterChipTextActive]}>
                    {crop === 'ALL' ? 'All Crops (सभी फसलें)' : crop}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </KisanCard>

          {/* Hero: Target vs. Achieved Procurement Card */}
          <KisanCard style={styles.targetHeroCard}>
            <View style={styles.targetHeroHeader}>
              <View>
                <Text style={styles.targetHeroSub}>MSP PROCUREMENT TARGET STATUS</Text>
                <Text style={styles.targetHeroTitle}>
                  {selectedDistrict === 'ALL' ? `${selectedState} State Target ${selectedState === 'Odisha' ? '(Primary APMC Command)' : ''}` : `${selectedDistrict} District Target (${selectedState})`}
                </Text>
              </View>
              <View style={styles.targetBadge}>
                <Text style={styles.targetBadgeText}>{metrics.targetAchievedPct}% Achieved</Text>
              </View>
            </View>

            {/* Target vs Achieved Numbers */}
            <View style={styles.targetComparisonGrid}>
              <View style={styles.targetCol}>
                <Text style={styles.targetColLabel}>🎯 Target Procurement</Text>
                <Text style={styles.targetColValue}>{metrics.targetMT.toLocaleString()} MT</Text>
                <Text style={styles.targetColSub}>Target Budget: ₹{metrics.totalBudgetCr} Cr</Text>
              </View>

              <View style={styles.targetDivider} />

              <View style={styles.targetCol}>
                <Text style={[styles.targetColLabel, { color: '#69F0AE' }]}>✅ Achieved Procurement</Text>
                <Text style={[styles.targetColValue, { color: '#FFFFFF' }]}>{metrics.cropCollectedMT.toLocaleString()} MT</Text>
                <Text style={[styles.targetColSub, { color: '#E0F2F1' }]}>Procured Value: ₹{metrics.procurementValueCr} Cr</Text>
              </View>
            </View>

            {/* Visual Progress Bar */}
            <View style={styles.progressBarWrapper}>
              <View style={styles.progressBarTrack}>
                <View style={[styles.progressBarFill, { width: `${Math.min(metrics.targetAchievedPct, 100)}%` }]} />
              </View>
              <View style={styles.progressLabelRow}>
                <Text style={styles.progressLabelText}>0 MT</Text>
                <Text style={styles.progressLabelCenter}>
                  Remaining: {(metrics.targetMT - metrics.cropCollectedMT).toLocaleString()} MT ({Number((100 - metrics.targetAchievedPct).toFixed(1))}%)
                </Text>
                <Text style={styles.progressLabelText}>{metrics.targetMT.toLocaleString()} MT</Text>
              </View>
            </View>
          </KisanCard>

          {/* 4 Core Procurement Counters */}
          <SectionHeader
            title="Core Procurement Indicators"
            subtitle="Farmers, booking slots, check-ins, and verified completions"
          />
          <View style={styles.kpiGrid}>
            {/* 1. Total Farmers */}
            <KisanCard style={styles.kpiBox}>
              <View style={styles.kpiTopRow}>
                <View style={[styles.kpiIconCircle, { backgroundColor: '#E8F5E9' }]}>
                  <Ionicons name="people" size={20} color="#2E7D32" />
                </View>
                <StatusBadge status="ACTIVE" variant="success" />
              </View>
              <Text style={styles.kpiNumber}>{metrics.totalFarmers.toLocaleString()}</Text>
              <Text style={styles.kpiTitle}>Total Registered Farmers</Text>
              <Text style={styles.kpiFootnote}>
                👨‍🌾 {metrics.activeParticipating.toLocaleString()} participating in season
              </Text>
            </KisanCard>

            {/* 2. Booking Slots of Farmers */}
            <KisanCard style={styles.kpiBox}>
              <View style={styles.kpiTopRow}>
                <View style={[styles.kpiIconCircle, { backgroundColor: '#E3F2FD' }]}>
                  <Ionicons name="calendar" size={20} color="#1565C0" />
                </View>
                <View style={styles.slotPill}>
                  <Text style={styles.slotPillText}>{dateRange.toUpperCase()}</Text>
                </View>
              </View>
              <Text style={[styles.kpiNumber, { color: colors.secondary }]}>
                {metrics.bookedSlots.toLocaleString()}
              </Text>
              <Text style={styles.kpiTitle}>Farmer Booking Slots</Text>
              <Text style={styles.kpiFootnote}>
                🌅 Morn: {metrics.morningSlots.toLocaleString()} · 🌇 Aft: {metrics.afternoonSlots.toLocaleString()}
              </Text>
            </KisanCard>

            {/* 3. Persons Checked In */}
            <KisanCard style={styles.kpiBox}>
              <View style={styles.kpiTopRow}>
                <View style={[styles.kpiIconCircle, { backgroundColor: '#FFF3E0' }]}>
                  <Ionicons name="enter-outline" size={20} color="#E65100" />
                </View>
                <View style={styles.livePill}>
                  <Text style={styles.livePillText}>At Mandis</Text>
                </View>
              </View>
              <Text style={[styles.kpiNumber, { color: colors.warning }]}>
                {metrics.checkedIn.toLocaleString()}
              </Text>
              <Text style={styles.kpiTitle}>Persons Checked In</Text>
              <Text style={styles.kpiFootnote}>
                ⏱ In queue & weighbridge inspection
              </Text>
            </KisanCard>

            {/* 4. Completed Procurement */}
            <KisanCard style={styles.kpiBox}>
              <View style={styles.kpiTopRow}>
                <View style={[styles.kpiIconCircle, { backgroundColor: '#F3E5F5' }]}>
                  <Ionicons name="checkmark-done-circle" size={20} color="#7B1FA2" />
                </View>
                <StatusBadge status="VERIFIED" variant="info" />
              </View>
              <Text style={[styles.kpiNumber, { color: '#7B1FA2' }]}>
                {metrics.completedProcurement.toLocaleString()}
              </Text>
              <Text style={styles.kpiTitle}>Procurement Completed</Text>
              <Text style={styles.kpiFootnote}>
                ✅ Weighed, receipts & payouts logged
              </Text>
            </KisanCard>
          </View>

          {/* Financial Budget & Payment Settlement Section */}
          <SectionHeader
            title="Procurement Value & Treasury Budget"
            subtitle="Completed payments vs total allocated budget and pending clearance"
          />
          <KisanCard style={styles.budgetCard}>
            <View style={styles.budgetHeader}>
              <View>
                <Text style={styles.budgetSub}>TREASURY DBT EXPENDITURE STATUS</Text>
                <Text style={styles.budgetMainTitle}>Budget Settlement Overview</Text>
              </View>
              <View style={styles.budgetBadge}>
                <Text style={styles.budgetBadgeText}>{metrics.budgetUtilizedPct}% Budget Utilized</Text>
              </View>
            </View>

            <View style={styles.budgetRow}>
              <View style={styles.budgetItem}>
                <Text style={styles.budgetItemLabel}>Total Procurement Value</Text>
                <Text style={styles.budgetItemVal}>₹{metrics.procurementValueCr} Cr</Text>
                <Text style={styles.budgetItemSub}>{metrics.cropCollectedMT.toLocaleString()} MT Intake</Text>
              </View>

              <View style={styles.budgetItem}>
                <Text style={[styles.budgetItemLabel, { color: '#2E7D32' }]}>Payments Completed</Text>
                <Text style={[styles.budgetItemVal, { color: '#2E7D32' }]}>₹{metrics.paymentCompletedCr} Cr</Text>
                <Text style={styles.budgetItemSub}>Credited via DBT/PFMS</Text>
              </View>

              <View style={styles.budgetItem}>
                <Text style={[styles.budgetItemLabel, { color: '#D32F2F' }]}>Payments Pending</Text>
                <Text style={[styles.budgetItemVal, { color: '#D32F2F' }]}>₹{metrics.paymentPendingCr} Cr</Text>
                <Text style={styles.budgetItemSub}>In Bank Clearing Queue</Text>
              </View>
            </View>

            {/* Total Budget Meter */}
            <View style={styles.budgetMeterContainer}>
              <View style={styles.budgetMeterLabels}>
                <Text style={styles.budgetMeterText}>Total Budget: ₹{metrics.totalBudgetCr} Cr</Text>
                <Text style={styles.budgetMeterText}>Remaining: ₹{metrics.remainingBudgetCr} Cr</Text>
              </View>
              <View style={styles.budgetTrack}>
                <View style={[styles.budgetFillDone, { width: `${metrics.budgetUtilizedPct}%` }]} />
                <View style={[styles.budgetFillPending, { width: `${Math.min(18, 100 - metrics.budgetUtilizedPct)}%` }]} />
              </View>
              <View style={styles.budgetLegend}>
                <View style={styles.legendItem}>
                  <View style={[styles.legendDot, { backgroundColor: '#2E7D32' }]} />
                  <Text style={styles.legendText}>Completed (₹{metrics.paymentCompletedCr} Cr)</Text>
                </View>
                <View style={styles.legendItem}>
                  <View style={[styles.legendDot, { backgroundColor: '#FF8F00' }]} />
                  <Text style={styles.legendText}>Pending (₹{metrics.paymentPendingCr} Cr)</Text>
                </View>
                <View style={styles.legendItem}>
                  <View style={[styles.legendDot, { backgroundColor: '#CFD8DC' }]} />
                  <Text style={styles.legendText}>Unutilized (₹{metrics.remainingBudgetCr} Cr)</Text>
                </View>
              </View>
            </View>
          </KisanCard>

          {/* Mandi Efficiency & Waiting Times */}
          <SectionHeader
            title="Mandi Operational Status & Waiting Time"
            subtitle="Active mandis, average wait times, and facility capacity"
          />
          <View style={styles.mandiStatusRow}>
            <KisanCard style={styles.mandiStatCard}>
              <Ionicons name="business" size={24} color={colors.primary} />
              <Text style={styles.mandiStatValue}>{metrics.activeMandis} / {metrics.totalMandis}</Text>
              <Text style={styles.mandiStatLabel}>Active Mandis Online</Text>
              <Text style={styles.mandiStatSub}>🟢 96% Operational</Text>
            </KisanCard>

            <KisanCard style={styles.mandiStatCard}>
              <Ionicons name="speedometer" size={24} color={colors.secondary} />
              <Text style={styles.mandiStatValue}>{metrics.mandiEfficiency}%</Text>
              <Text style={styles.mandiStatLabel}>Operational Efficiency</Text>
              <Text style={styles.mandiStatSub}>⚡ 8.2 min avg service</Text>
            </KisanCard>

            <KisanCard style={styles.mandiStatCard}>
              <Ionicons name="time" size={24} color={colors.warning} />
              <Text style={styles.mandiStatValue}>{metrics.avgWaitingTime} min</Text>
              <Text style={styles.mandiStatLabel}>Avg Queue Waiting Time</Text>
              <Text style={styles.mandiStatSub}>🎯 Target: &lt; 15 min</Text>
            </KisanCard>
          </View>

          {/* ========================================================================= */}
          {/* 3 VISUAL GRAPHS (IN MT - METRIC TONNES) */}
          {/* ========================================================================= */}
          <SectionHeader
            title="Procurement Volume Analytics (MT)"
            subtitle="Daily intake, district-wise comparison, and crop distribution in Metric Tonnes"
          />

          {/* Graph 1: Daily Procurement Intake (MT) */}
          <KisanCard style={styles.chartCard}>
            <View style={styles.chartHeaderRow}>
              <View>
                <Text style={styles.chartCardTitle}>📊 Daily Procurement Intake (Metric Tonnes)</Text>
                <Text style={styles.chartCardSub}>7-Day rolling procurement volume across mandis</Text>
              </View>
              <View style={styles.chartMetricPill}>
                <Text style={styles.chartMetricPillText}>Peak: 920 MT (Sat)</Text>
              </View>
            </View>

            <View style={styles.barChartContainer}>
              {dailyData.map((d) => {
                const barHeight = Math.round((d.mt / maxDailyMT) * 120);
                const isPeak = d.mt === maxDailyMT;
                return (
                  <View key={d.day} style={styles.chartBarCol}>
                    <Text style={styles.chartBarValText}>{d.mt}</Text>
                    <View
                      style={[
                        styles.chartBar,
                        {
                          height: Math.max(barHeight, 20),
                          backgroundColor: isPeak ? colors.primary : '#81C784',
                        },
                      ]}
                    />
                    <Text style={[styles.chartBarDayText, isPeak && { fontWeight: 'bold', color: colors.primary }]}>
                      {d.day}
                    </Text>
                  </View>
                );
              })}
            </View>
            <Text style={styles.chartFooterNote}>Total Weekly Intake: 4,630 Metric Tonnes (MT)</Text>
          </KisanCard>

          {/* Graph 2: District-wise Procurement (MT) */}
          <KisanCard style={styles.chartCard}>
            <Text style={styles.chartCardTitle}>🗺️ District-wise Procurement vs Target (Metric Tonnes)</Text>
            <Text style={styles.chartCardSub}>Volume and queue delays across major administrative districts</Text>

            <View style={{ marginTop: 12 }}>
              {districtData.map((dist) => (
                <View key={dist.name} style={styles.districtBarRow}>
                  <View style={styles.distLabelBox}>
                    <Text style={styles.distLabelName}>{dist.name}</Text>
                    <Text style={styles.distLabelMandis}>{dist.mandis} Mandis · {dist.delay}</Text>
                  </View>
                  <View style={styles.distBarTrack}>
                    <View style={[styles.distBarFill, { width: `${dist.pct}%` }]} />
                  </View>
                  <View style={styles.distValBox}>
                    <Text style={styles.distValMT}>{dist.mt.toLocaleString()} MT</Text>
                    <Text style={styles.distValPct}>{dist.pct}% of tgt</Text>
                  </View>
                </View>
              ))}
            </View>
          </KisanCard>

          {/* Graph 3: Crop-wise Procurement Distribution (MT) */}
          <KisanCard style={styles.chartCard}>
            <Text style={styles.chartCardTitle}>🌾 Crop-wise Procurement Intake (Metric Tonnes)</Text>
            <Text style={styles.chartCardSub}>Breakdown of intake volume by crop commodity</Text>

            <View style={styles.cropBarMultiTrack}>
              {cropShareData.map((c) => (
                <View
                  key={c.crop}
                  style={{
                    width: `${c.pct}%`,
                    height: 18,
                    backgroundColor: c.color,
                  }}
                />
              ))}
            </View>

            <View style={styles.cropLegendGrid}>
              {cropShareData.map((c) => (
                <View key={c.crop} style={styles.cropLegendItem}>
                  <View style={[styles.cropLegendDot, { backgroundColor: c.color }]} />
                  <View>
                    <Text style={styles.cropLegendName}>{c.crop}</Text>
                    <Text style={styles.cropLegendMT}>{c.mt.toLocaleString()} MT ({c.pct}%)</Text>
                  </View>
                </View>
              ))}
            </View>
          </KisanCard>

          {/* Crop Target vs Achieved Table */}
          <SectionHeader
            title="Crop-wise Target vs. Achieved Breakdown"
            subtitle="Official MSP procurement progress, financial valuation & mandi capacity fill percentage"
          />
          <KisanCard style={styles.tableCard}>
            <View style={styles.tableHeaderRow}>
              <Text style={[styles.tableHeadCell, { flex: 2.2 }]}>Crop / फसल</Text>
              <Text style={[styles.tableHeadCell, { flex: 1.3, textAlign: 'right' }]}>Target</Text>
              <Text style={[styles.tableHeadCell, { flex: 1.3, textAlign: 'right' }]}>Achieved</Text>
              <Text style={[styles.tableHeadCell, { flex: 1.1, textAlign: 'right' }]}>% Done</Text>
              <Text style={[styles.tableHeadCell, { flex: 1.8, textAlign: 'right' }]}>Mandi Fill %</Text>
              <Text style={[styles.tableHeadCell, { flex: 1.4, textAlign: 'right' }]}>Value</Text>
            </View>

            {cropTargets.map((c, idx) => (
              <View key={c.crop} style={[styles.tableBodyRow, idx % 2 === 1 && { backgroundColor: '#FAFAFA' }]}>
                <View style={{ flex: 2.2 }}>
                  <Text style={styles.tableCropName}>{c.crop}</Text>
                  <Text style={styles.tableCropMsp}>MSP: {c.msp}</Text>
                </View>
                <Text style={[styles.tableBodyCell, { flex: 1.3, textAlign: 'right' }]}>{c.targetMT} MT</Text>
                <Text style={[styles.tableBodyCell, { flex: 1.3, textAlign: 'right', fontWeight: 'bold', color: colors.primary }]}>
                  {c.achievedMT} MT
                </Text>
                <View style={{ flex: 1.1, alignItems: 'flex-end' }}>
                  <View
                    style={[
                      styles.tableStatusPill,
                      { backgroundColor: c.pct >= 80 ? '#E8F5E9' : c.pct >= 70 ? '#FFF8E1' : '#FFEBEE' },
                    ]}
                  >
                    <Text
                      style={[
                        styles.tableStatusText,
                        { color: c.pct >= 80 ? '#2E7D32' : c.pct >= 70 ? '#F57C00' : '#D32F2F' },
                      ]}
                    >
                      {c.pct}%
                    </Text>
                  </View>
                </View>
                {/* Mandi Capacity Fill Percentage & Progress Bar */}
                <View style={{ flex: 1.8, alignItems: 'flex-end', paddingHorizontal: 4 }}>
                  <View
                    style={[
                      styles.mandiFillPill,
                      {
                        backgroundColor:
                          c.mandiFillPct >= 80
                            ? '#FFF3E0'
                            : c.mandiFillPct >= 70
                            ? '#E8F5E9'
                            : '#E3F2FD',
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.mandiFillText,
                        {
                          color:
                            c.mandiFillPct >= 80
                              ? '#E65100'
                              : c.mandiFillPct >= 70
                              ? '#2E7D32'
                              : '#1565C0',
                        },
                      ]}
                    >
                      {c.mandiFillPct}% Fill
                    </Text>
                  </View>
                  <View style={styles.miniMandiFillTrack}>
                    <View
                      style={[
                        styles.miniMandiFillBar,
                        {
                          width: `${Math.min(100, c.mandiFillPct)}%`,
                          backgroundColor:
                            c.mandiFillPct >= 80
                              ? '#FF9800'
                              : c.mandiFillPct >= 70
                              ? '#4CAF50'
                              : '#2196F3',
                        },
                      ]}
                    />
                  </View>
                </View>
                <Text style={[styles.tableBodyCell, { flex: 1.4, textAlign: 'right', fontWeight: 'bold' }]}>
                  ₹{c.valCr} Cr
                </Text>
              </View>
            ))}
          </KisanCard>

          {/* Live Operational Alerts Feed */}
          <SectionHeader
            title="Real-time Operational Alerts"
            subtitle="System alerts on payment clearance, capacity limits, and delays"
          />
          {liveAlerts
            .filter((a) => !dismissedAlerts.includes(a.id))
            .map((alert) => (
              <KisanCard key={alert.id} style={[styles.alertItemCard, { borderLeftColor: alert.color }]}>
                <View style={styles.alertItemHeader}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                    <Ionicons name={alert.icon as any} size={20} color={alert.color} style={{ marginRight: 8 }} />
                    <View style={{ flex: 1 }}>
                      <Text style={styles.alertItemTitle}>{alert.title}</Text>
                      <Text style={styles.alertItemTime}>{alert.time}</Text>
                    </View>
                  </View>
                  <TouchableOpacity onPress={() => handleDismissAlert(alert.id)}>
                    <Ionicons name="close" size={18} color="#9E9E9E" />
                  </TouchableOpacity>
                </View>
                <Text style={styles.alertItemDesc}>{alert.desc}</Text>
                <View style={styles.alertActionRow}>
                  <TouchableOpacity style={[styles.alertActionBtn, { backgroundColor: alert.color }]} activeOpacity={0.85}>
                    <Text style={styles.alertActionText}>{alert.action} →</Text>
                  </TouchableOpacity>
                </View>
              </KisanCard>
            ))}

          {/* Respective Mandis Overview Table */}
          <SectionHeader
            title="Active Procurement Centres (Mandis)"
            subtitle="Live status, capacity, and current delay by centre"
            actionText="All Mandis"
            onAction={() => setActivePage('Mandis')}
          />
          {MOCK_CENTRES.map((c) => (
            <KisanCard key={c.id} style={styles.centreCard}>
              <View style={styles.centreHeader}>
                <View>
                  <Text style={styles.centreName}>{c.name}</Text>
                  <Text style={styles.centreDistrict}>📍 {c.district}, MP · {c.address}</Text>
                </View>
                <StatusBadge status={c.isActive ? 'OPERATING' : 'CLOSED'} variant="success" />
              </View>
              <View style={styles.centreMetrics}>
                <View style={styles.centreMetricBadge}>
                  <Text style={styles.metricText}>📦 Cap: {c.capacity} tokens/day</Text>
                </View>
                <View style={[styles.centreMetricBadge, { backgroundColor: c.currentDelay > 10 ? '#FFF3E0' : '#E8F5E9' }]}>
                  <Text style={[styles.metricText, { color: c.currentDelay > 10 ? '#E65100' : '#2E7D32' }]}>
                    ⏱ Wait: {c.currentDelay} min delay
                  </Text>
                </View>
                <View style={styles.centreMetricBadge}>
                  <Text style={styles.metricText}>⚡ Service: {c.averageServiceTime} min/token</Text>
                </View>
              </View>
            </KisanCard>
          ))}
        </View>
      )}

      {/* ========================================================================= */}
      {/* PAGE 2: MANDIS MONITOR (HAR MANDI KI EFFICIENCY, STOCK CAPACITY, BOTTLENECK ALERTS) */}
      {/* ========================================================================= */}
      {activePage === 'Mandis' && (() => {
        // Multiplier based on selected date range for Mandis
        const dateMultiplier = mandiDateRange === 'today' ? 1 : mandiDateRange === '7days' ? 5.8 : mandiDateRange === '30days' ? 22 : 68;

        // Filtered mandis list
        const filteredMandis = mandiDetailedList.filter((m) => {
          const matchesReportType = mandiReportType === 'ALL' || m.procurementType === mandiReportType;
          const matchesCrop = mandiCropFilter === 'ALL' || m.supportedCrops.some((c) => c.toLowerCase().includes(mandiCropFilter.toLowerCase()));
          const matchesDistrict = mandiDistrictFilter === 'ALL' || m.district.toLowerCase() === mandiDistrictFilter.toLowerCase();
          const q = mandiSearchQuery.trim().toLowerCase();
          const matchesQuery = !q || m.name.toLowerCase().includes(q) || m.district.toLowerCase().includes(q) || m.id.toLowerCase().includes(q);
          return matchesReportType && matchesCrop && matchesDistrict && matchesQuery;
        });

        // Summary calculations
        const totalStockCapacity = filteredMandis.reduce((acc, m) => acc + m.stockCapacityMT, 0);
        const totalStockStored = filteredMandis.reduce((acc, m) => acc + m.currentStockMT, 0);
        const networkStockFillPct = totalStockCapacity > 0 ? Number(((totalStockStored / totalStockCapacity) * 100).toFixed(1)) : 0;
        const avgEfficiency = filteredMandis.length > 0 ? Number((filteredMandis.reduce((acc, m) => acc + m.efficiency, 0) / filteredMandis.length).toFixed(1)) : 94.8;
        const totalBottlenecks = filteredMandis.filter((m) => m.bottleneckStatus !== 'OPTIMAL').length;
        const totalTodayIntake = filteredMandis.reduce((acc, m) => acc + m.todayIntakeMT, 0);
        const totalMspCr = Number(filteredMandis.reduce((acc, m) => acc + m.mspExpenditureCr, 0).toFixed(2));

        return (
          <View style={styles.pageContent}>
            {/* Header Banner */}
            <SectionHeader
              title="All Mandis Monitor (राज्य मंडी निगरानी)"
              subtitle="Har mandi ki efficiency, stock capacity aur bottleneck alerts"
            />

            {/* Top Multi-Option Filter Panel */}
            <KisanCard style={styles.mandiFilterCard}>
              {/* Option 1: Report Type of Procurement */}
              <View style={styles.filterSection}>
                <Text style={styles.filterSectionTitle}>📋 Report Type of Procurement / उपार्जन का प्रकार:</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterChipRow}>
                  {[
                    { id: 'ALL', label: 'All Procurement (सभी प्रकार)' },
                    { id: 'GOVT_MSP', label: '🏛️ Govt MSP (e-Uparjan)' },
                    { id: 'PRIVATE_APMC', label: '🏢 Private APMC Yard' },
                    { id: 'FPO', label: '🤝 FPO Aggregation' },
                  ].map((t) => (
                    <TouchableOpacity
                      key={t.id}
                      style={[styles.mandiPill, mandiReportType === t.id && styles.mandiPillActive]}
                      onPress={() => setMandiReportType(t.id as any)}
                    >
                      <Text style={[styles.mandiPillText, mandiReportType === t.id && styles.mandiPillTextActive]}>
                        {t.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>

              {/* Option 2: Crops Type */}
              <View style={styles.filterSection}>
                <Text style={styles.filterSectionTitle}>🌾 Crops Type / फसल का चयन:</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterChipRow}>
                  {[
                    { id: 'ALL', label: 'All Crops (सभी फसलें)' },
                    { id: 'Wheat', label: 'Wheat (गेहूं)' },
                    { id: 'Paddy', label: 'Paddy (धान)' },
                    { id: 'Soybean', label: 'Soybean (सोयाबीन)' },
                    { id: 'Maize', label: 'Maize (मक्का)' },
                    { id: 'Gram', label: 'Gram/Chana (चना)' },
                    { id: 'Jowar', label: 'Jowar (ज्वार)' },
                  ].map((c) => (
                    <TouchableOpacity
                      key={c.id}
                      style={[styles.mandiPill, mandiCropFilter === c.id && styles.mandiPillActive]}
                      onPress={() => setMandiCropFilter(c.id as any)}
                    >
                      <Text style={[styles.mandiPillText, mandiCropFilter === c.id && styles.mandiPillTextActive]}>
                        {c.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>

              {/* Option 3: Date Range */}
              <View style={styles.filterSection}>
                <Text style={styles.filterSectionTitle}>📅 Date Range / समय सीमा:</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterChipRow}>
                  {[
                    { id: 'today', label: '⚡ Today (Live Live)' },
                    { id: '7days', label: '📊 7-Day Rolling' },
                    { id: '30days', label: '📅 30-Day (Month)' },
                    { id: 'season', label: '🌾 Full Season 2026' },
                  ].map((d) => (
                    <TouchableOpacity
                      key={d.id}
                      style={[styles.mandiPill, mandiDateRange === d.id && styles.mandiPillActive]}
                      onPress={() => setMandiDateRange(d.id as any)}
                    >
                      <Text style={[styles.mandiPillText, mandiDateRange === d.id && styles.mandiPillTextActive]}>
                        {d.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>

              {/* Fast Search & District Quick Filters */}
              <View style={styles.mandiSearchContainer}>
                <View style={styles.mandiSearchInputRow}>
                  <Ionicons name="search" size={17} color="#78909C" style={{ marginLeft: 10, marginRight: 8 }} />
                  <TextInput
                    style={styles.mandiSearchInput}
                    placeholder="Search mandi name, ID (e.g. C-001), or district..."
                    placeholderTextColor="#90A4AE"
                    value={mandiSearchQuery}
                    onChangeText={setMandiSearchQuery}
                  />
                  {mandiSearchQuery.length > 0 && (
                    <TouchableOpacity onPress={() => setMandiSearchQuery('')} style={{ padding: 6 }}>
                      <Ionicons name="close-circle" size={17} color="#90A4AE" />
                    </TouchableOpacity>
                  )}
                </View>

                {/* District Filter Chips */}
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterChipRow}>
                  {['ALL', 'Bhopal', 'Indore', 'Jabalpur', 'Sehore', 'Dewas', 'Harda', 'Chhindwara'].map((dist) => (
                    <TouchableOpacity
                      key={dist}
                      style={[styles.districtChip, mandiDistrictFilter === dist && styles.districtChipActive]}
                      onPress={() => setMandiDistrictFilter(dist)}
                    >
                      <Text style={[styles.districtChipText, mandiDistrictFilter === dist && styles.districtChipTextActive]}>
                        {dist === 'ALL' ? 'All Districts' : dist}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            </KisanCard>

            {/* Statewide Mandis Live Summary KPI Bar */}
            <View style={styles.mandiKpiGrid}>
              <View style={[styles.mandiKpiBox, { borderLeftColor: colors.primary }]}>
                <Text style={styles.mandiKpiValue}>{filteredMandis.length} Mandis</Text>
                <Text style={styles.mandiKpiLabel}>Active Centres</Text>
                <Text style={styles.mandiKpiSub}>🟢 100% Operational</Text>
              </View>

              <View style={[styles.mandiKpiBox, { borderLeftColor: colors.secondary }]}>
                <Text style={styles.mandiKpiValue}>{avgEfficiency}%</Text>
                <Text style={styles.mandiKpiLabel}>Avg Efficiency</Text>
                <Text style={styles.mandiKpiSub}>⚡ 8.1 min avg wait</Text>
              </View>

              <View style={[styles.mandiKpiBox, { borderLeftColor: '#FF9800' }]}>
                <Text style={styles.mandiKpiValue}>{networkStockFillPct}%</Text>
                <Text style={styles.mandiKpiLabel}>Stock Capacity</Text>
                <Text style={styles.mandiKpiSub}>{totalStockStored.toLocaleString()} / {totalStockCapacity.toLocaleString()} MT</Text>
              </View>

              <View style={[styles.mandiKpiBox, { borderLeftColor: totalBottlenecks > 0 ? '#D32F2F' : '#2E7D32' }]}>
                <Text style={[styles.mandiKpiValue, { color: totalBottlenecks > 0 ? '#D32F2F' : '#2E7D32' }]}>
                  {totalBottlenecks} {totalBottlenecks === 1 ? 'Alert' : 'Alerts'}
                </Text>
                <Text style={styles.mandiKpiLabel}>Bottlenecks</Text>
                <Text style={styles.mandiKpiSub}>
                  {totalBottlenecks > 0 ? '⚠️ Action needed' : '🟢 Optimal flow'}
                </Text>
              </View>
            </View>

            {/* ========================================================================= */}
            {/* 4 MANDI ANALYTICS & VISUAL MODULES */}
            {/* ========================================================================= */}

            {/* 1. Procurement MT Graph for Intake */}
            <SectionHeader
              title="Procurement Intake (MT) by Mandi"
              subtitle="Mandi-wise Metric Tonnes intake volume compared against official targets"
            />
            <KisanCard style={styles.chartCard}>
              <View style={styles.chartHeaderRow}>
                <View>
                  <Text style={styles.chartCardTitle}>📊 Procurement Intake by Mandi (MT)</Text>
                  <Text style={styles.chartCardSub}>Intake volume & capacity targets across active centres</Text>
                </View>
                <View style={styles.chartMetricPill}>
                  <Text style={styles.chartMetricPillText}>{totalTodayIntake} MT Today</Text>
                </View>
              </View>

              <View style={{ marginTop: 14 }}>
                {filteredMandis.map((m) => (
                  <View key={m.id} style={styles.mandiBarRow}>
                    <View style={styles.mandiBarLabelCol}>
                      <Text style={styles.mandiBarName}>{m.name.replace('Krishi Upaj Mandi, ', '').replace('Kisan Seva Kendra, ', '').replace('Rajya Kray Kendra, ', '')}</Text>
                      <Text style={styles.mandiBarDistrict}>📍 {m.district} · {m.todayIntakeMT} MT today</Text>
                    </View>
                    <View style={styles.mandiBarTrack}>
                      <View style={[styles.mandiBarFill, { width: `${m.intakeTargetPct}%`, backgroundColor: colors.primary }]} />
                    </View>
                    <View style={styles.mandiBarValCol}>
                      <Text style={styles.mandiBarValMT}>{m.totalIntakeMT.toLocaleString()} MT</Text>
                      <Text style={styles.mandiBarValPct}>{m.intakeTargetPct}% tgt</Text>
                    </View>
                  </View>
                ))}
              </View>
            </KisanCard>

            {/* 2. Farmer Turnout Analysis */}
            <SectionHeader
              title="Farmer Turnout & Attendance"
              subtitle="Slot bookings vs actual arrivals and procurement completions per mandi"
            />
            <KisanCard style={styles.chartCard}>
              <View style={styles.chartHeaderRow}>
                <View>
                  <Text style={styles.chartCardTitle}>👨‍🌾 Farmer Turnout Ratio per Mandi</Text>
                  <Text style={styles.chartCardSub}>Booked slots vs checked-in and completed weighments</Text>
                </View>
                <View style={[styles.chartMetricPill, { backgroundColor: '#E8F5E9' }]}>
                  <Text style={[styles.chartMetricPillText, { color: '#2E7D32' }]}>Avg Turnout: 89.9%</Text>
                </View>
              </View>

              <View style={{ marginTop: 12 }}>
                {filteredMandis.map((m) => (
                  <View key={m.id} style={styles.turnoutRow}>
                    <View style={styles.turnoutInfoCol}>
                      <Text style={styles.turnoutMandiName}>{m.name.split(',')[0]}</Text>
                      <Text style={styles.turnoutCountText}>
                        Booked: <Text style={{ fontWeight: 'bold' }}>{m.farmerTurnout.booked}</Text> · Checked-In: <Text style={{ fontWeight: 'bold' }}>{m.farmerTurnout.checkedIn}</Text> · Procured: <Text style={{ fontWeight: 'bold', color: colors.primary }}>{m.farmerTurnout.procured}</Text>
                      </Text>
                    </View>
                    <View style={styles.turnoutPillCol}>
                      <View
                        style={[
                          styles.turnoutPill,
                          {
                            backgroundColor:
                              m.farmerTurnout.turnoutPct >= 90
                                ? '#E8F5E9'
                                : m.farmerTurnout.turnoutPct >= 80
                                ? '#FFF8E1'
                                : '#FFEBEE',
                          },
                        ]}
                      >
                        <Text
                          style={[
                            styles.turnoutPillText,
                            {
                              color:
                                m.farmerTurnout.turnoutPct >= 90
                                ? '#2E7D32'
                                : m.farmerTurnout.turnoutPct >= 80
                                ? '#F57C00'
                                : '#D32F2F',
                            },
                          ]}
                        >
                          {m.farmerTurnout.turnoutPct}% Turnout
                        </Text>
                      </View>
                    </View>
                  </View>
                ))}
              </View>
            </KisanCard>

            {/* 3. MSP Expenditure per Mandi */}
            <SectionHeader
              title="MSP Expenditure & DBT Payouts"
              subtitle="Treasury disbursements and clearing status per procurement centre"
            />
            <KisanCard style={styles.chartCard}>
              <View style={styles.chartHeaderRow}>
                <View>
                  <Text style={styles.chartCardTitle}>💰 MSP Expenditure Breakdown (₹ Crores)</Text>
                  <Text style={styles.chartCardSub}>Total procurement outlay: ₹{totalMspCr} Cr across mandis</Text>
                </View>
                <View style={[styles.chartMetricPill, { backgroundColor: '#EDE7F6' }]}>
                  <Text style={[styles.chartMetricPillText, { color: '#7B1FA2' }]}>81.2% Cleared via PFMS</Text>
                </View>
              </View>

              <View style={{ marginTop: 14 }}>
                {filteredMandis.map((m) => {
                  const paidPct = Math.round((m.paymentCompletedCr / m.mspExpenditureCr) * 100);
                  return (
                    <View key={m.id} style={styles.expenditureRow}>
                      <View style={styles.expenditureLabelCol}>
                        <Text style={styles.expenditureMandiName}>{m.name.split(',')[1]?.trim() || m.name}</Text>
                        <Text style={styles.expenditureTotalVal}>Total: ₹{m.mspExpenditureCr} Cr</Text>
                      </View>
                      <View style={styles.expenditureMeterCol}>
                        <View style={styles.expenditureTrack}>
                          <View style={[styles.expenditureFillPaid, { width: `${paidPct}%` }]} />
                        </View>
                        <View style={styles.expenditureSubRow}>
                          <Text style={styles.expenditurePaidText}>₹{m.paymentCompletedCr} Cr Paid ({paidPct}%)</Text>
                          <Text style={styles.expenditurePendingText}>₹{m.paymentPendingCr} Cr Pending</Text>
                        </View>
                      </View>
                    </View>
                  );
                })}
              </View>
            </KisanCard>

            {/* 4. Procurement Trend MT */}
            <SectionHeader
              title="Procurement Trend MT (Intake Velocity)"
              subtitle="Daily procurement trajectory and intake velocity across the network"
            />
            <KisanCard style={styles.chartCard}>
              <View style={styles.chartHeaderRow}>
                <View>
                  <Text style={styles.chartCardTitle}>📈 Daily Procurement Trend (Metric Tonnes)</Text>
                  <Text style={styles.chartCardSub}>Intake flow velocity over the active period</Text>
                </View>
                <View style={[styles.chartMetricPill, { backgroundColor: '#E1F5FE' }]}>
                  <Text style={[styles.chartMetricPillText, { color: '#0288D1' }]}>Peak: 920 MT/day</Text>
                </View>
              </View>

              <View style={styles.barChartContainer}>
                {dailyData.map((d) => {
                  const barHeight = Math.round((d.mt / maxDailyMT) * 120);
                  const isPeak = d.mt === maxDailyMT;
                  return (
                    <View key={d.day} style={styles.chartBarCol}>
                      <Text style={styles.chartBarValText}>{d.mt}</Text>
                      <View
                        style={[
                          styles.chartBar,
                          {
                            height: Math.max(barHeight, 20),
                            backgroundColor: isPeak ? colors.primary : '#81C784',
                          },
                        ]}
                      />
                      <Text style={[styles.chartBarDayText, isPeak && { fontWeight: 'bold', color: colors.primary }]}>
                        {d.day}
                      </Text>
                    </View>
                  );
                })}
              </View>
              <Text style={styles.chartFooterNote}>Network Intake Run-rate: ~660 MT / day · All 24 Mandis Reporting</Text>
            </KisanCard>

            {/* ========================================================================= */}
            {/* ALL MANDIS SURVEILLANCE CARDS (EFFICIENCY, STOCK CAPACITY & BOTTLENECK ALERTS) */}
            {/* ========================================================================= */}
            <SectionHeader
              title="All Mandis Live Surveillance"
              subtitle="Har mandi ki live efficiency, stock capacity aur bottleneck alerts"
            />

            {filteredMandis.map((mandi) => (
              <KisanCard key={mandi.id} style={styles.mandiMonitorCard}>
                {/* Mandi Card Header */}
                <View style={styles.mandiCardHeader}>
                  <View style={{ flex: 1 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap' }}>
                      <Text style={styles.mandiCardTitle}>{mandi.name}</Text>
                      <View style={styles.mandiIdBadge}>
                        <Text style={styles.mandiIdBadgeText}>{mandi.id}</Text>
                      </View>
                    </View>
                    <Text style={styles.mandiCardLocation}>
                      📍 {mandi.district}, MP · {mandi.address}
                    </Text>
                    <Text style={styles.mandiHoursText}>
                      🕒 Hours: {mandi.operatingHours} · Scales: {mandi.scalesOnline}/{mandi.totalScales} Online
                    </Text>
                  </View>
                  <StatusBadge status="ONLINE" variant="success" />
                </View>

                {/* Mandi Efficiency & Turnaround Row */}
                <View style={styles.mandiEfficiencyRow}>
                  <View style={styles.mandiEfficiencyBadge}>
                    <Ionicons name="speedometer" size={18} color="#2E7D32" style={{ marginRight: 6 }} />
                    <View>
                      <Text style={styles.mandiEfficiencyVal}>{mandi.efficiency}%</Text>
                      <Text style={styles.mandiEfficiencyLabel}>Mandi Efficiency</Text>
                    </View>
                  </View>

                  <View style={styles.mandiTurnaroundBadge}>
                    <Ionicons name="time" size={18} color={mandi.avgTurnaroundMin > 10 ? '#E65100' : '#1565C0'} style={{ marginRight: 6 }} />
                    <View>
                      <Text style={[styles.mandiTurnaroundVal, { color: mandi.avgTurnaroundMin > 10 ? '#E65100' : '#1565C0' }]}>
                        {mandi.avgTurnaroundMin} min
                      </Text>
                      <Text style={styles.mandiTurnaroundLabel}>Avg Turnaround</Text>
                    </View>
                  </View>

                  <View style={styles.mandiIntakeBadge}>
                    <Ionicons name="leaf" size={18} color={colors.primary} style={{ marginRight: 6 }} />
                    <View>
                      <Text style={styles.mandiIntakeVal}>{mandi.todayIntakeMT} MT</Text>
                      <Text style={styles.mandiIntakeLabel}>Today's Intake</Text>
                    </View>
                  </View>
                </View>

                {/* Stock Capacity & Utilization Meter */}
                <View style={styles.mandiStockSection}>
                  <View style={styles.mandiStockHeader}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                      <Ionicons name="cube" size={16} color="#455A64" style={{ marginRight: 6 }} />
                      <Text style={styles.mandiStockTitle}>Stock Storage Capacity:</Text>
                    </View>
                    <View
                      style={[
                        styles.mandiStockPill,
                        {
                          backgroundColor:
                            mandi.stockFillPct >= 90
                              ? '#FFEBEE'
                              : mandi.stockFillPct >= 80
                              ? '#FFF3E0'
                              : '#E8F5E9',
                        },
                      ]}
                    >
                      <Text
                        style={[
                          styles.mandiStockPillText,
                          {
                            color:
                              mandi.stockFillPct >= 90
                                ? '#D32F2F'
                                : mandi.stockFillPct >= 80
                                ? '#E65100'
                                : '#2E7D32',
                          },
                        ]}
                      >
                        {mandi.stockFillPct}% Capacity Full
                      </Text>
                    </View>
                  </View>

                  <View style={styles.mandiStockMeterLabels}>
                    <Text style={styles.mandiStockStoredText}>
                      Stored: <Text style={{ fontWeight: 'bold', color: colors.textPrimary }}>{mandi.currentStockMT.toLocaleString()} MT</Text>
                    </Text>
                    <Text style={styles.mandiStockCapacityText}>
                      Max Limit: <Text style={{ fontWeight: 'bold' }}>{mandi.stockCapacityMT.toLocaleString()} MT</Text>
                    </Text>
                  </View>

                  {/* Stock Bar */}
                  <View style={styles.mandiStockTrack}>
                    <View
                      style={[
                        styles.mandiStockFill,
                        {
                          width: `${Math.min(100, mandi.stockFillPct)}%`,
                          backgroundColor:
                            mandi.stockFillPct >= 90
                              ? '#D32F2F'
                              : mandi.stockFillPct >= 80
                              ? '#FF9800'
                              : '#4CAF50',
                        },
                      ]}
                    />
                  </View>
                  <Text style={styles.mandiAvailableSpaceText}>
                    📦 Available Storage Space: <Text style={{ fontWeight: 'bold' }}>{mandi.availableCapacityMT.toLocaleString()} MT</Text> remaining
                  </Text>
                </View>

                {/* Bottleneck Alerts Banner */}
                <View
                  style={[
                    styles.mandiBottleneckBanner,
                    {
                      backgroundColor:
                        mandi.bottleneckStatus === 'CRITICAL'
                          ? '#FFEBEE'
                          : mandi.bottleneckStatus === 'WARNING'
                          ? '#FFF8E1'
                          : '#F1F8E9',
                      borderLeftColor:
                        mandi.bottleneckStatus === 'CRITICAL'
                          ? '#D32F2F'
                          : mandi.bottleneckStatus === 'WARNING'
                          ? '#F57C00'
                          : '#388E3C',
                    },
                  ]}
                >
                  <Ionicons
                    name={
                      mandi.bottleneckStatus === 'CRITICAL'
                        ? 'alert-circle'
                        : mandi.bottleneckStatus === 'WARNING'
                        ? 'warning'
                        : 'checkmark-circle'
                    }
                    size={20}
                    color={
                      mandi.bottleneckStatus === 'CRITICAL'
                        ? '#D32F2F'
                        : mandi.bottleneckStatus === 'WARNING'
                        ? '#F57C00'
                        : '#388E3C'
                    }
                    style={{ marginRight: 8, marginTop: 1 }}
                  />
                  <View style={{ flex: 1 }}>
                    <Text
                      style={[
                        styles.mandiBottleneckTitle,
                        {
                          color:
                            mandi.bottleneckStatus === 'CRITICAL'
                              ? '#B71C1C'
                              : mandi.bottleneckStatus === 'WARNING'
                              ? '#E65100'
                              : '#1B5E20',
                        },
                      ]}
                    >
                      {mandi.bottleneckTitle}
                    </Text>
                    <Text style={styles.mandiBottleneckDesc}>{mandi.bottleneckMessage}</Text>
                  </View>
                </View>

                {/* Supported Crops */}
                <View style={styles.mandiCropsRow}>
                  <Text style={styles.mandiCropsLabel}>Crops Accepted:</Text>
                  <View style={styles.mandiCropsChips}>
                    {mandi.supportedCrops.map((crop) => (
                      <View key={crop} style={styles.mandiCropBadge}>
                        <Text style={styles.mandiCropBadgeText}>{crop}</Text>
                      </View>
                    ))}
                  </View>
                </View>

                {/* Direct Action Buttons */}
                <View style={styles.mandiActionRow}>
                  <TouchableOpacity
                    style={styles.mandiInspectBtn}
                    onPress={() => router.push(`/mandi/${mandi.id}` as any)}
                    activeOpacity={0.85}
                  >
                    <Ionicons name="scan-outline" size={15} color="#FFFFFF" style={{ marginRight: 6 }} />
                    <Text style={styles.mandiInspectBtnText}>Inspect Live Tokens & Scale →</Text>
                  </TouchableOpacity>

                  <TouchableOpacity style={styles.mandiSecondaryBtn} activeOpacity={0.85}>
                    <Ionicons name="shuffle-outline" size={15} color="#37474F" style={{ marginRight: 4 }} />
                    <Text style={styles.mandiSecondaryBtnText}>Divert Queue</Text>
                  </TouchableOpacity>

                  <TouchableOpacity style={styles.mandiSecondaryBtn} activeOpacity={0.85}>
                    <Ionicons name="shield-checkmark-outline" size={15} color="#37474F" style={{ marginRight: 4 }} />
                    <Text style={styles.mandiSecondaryBtnText}>Audit Tare</Text>
                  </TouchableOpacity>
                </View>
              </KisanCard>
            ))}
          </View>
        );
      })()}

      {/* ========================================================================= */}
      {/* PAGE 3: ANALYTICS VIEW */}
      {/* ========================================================================= */}
      {activePage === 'Analytics' && (
        <View style={styles.pageContent}>
          <SectionHeader
            title="Procurement & Financial Analytics"
            subtitle="Statewide intake, payout distribution, and queue volume trends"
          />
          <KisanCard style={styles.chartCard}>
            <Text style={styles.chartTitle}>📊 Weekly Procurement Flow</Text>
            <Text style={{ fontSize: 12, color: colors.textSecondary, marginBottom: 12 }}>
              Intake volume across wheat and paddy clusters in Metric Tonnes (MT).
            </Text>
            <View style={styles.barChartPlaceholder}>
              {dailyData.map((d) => (
                <View key={d.day} style={styles.barCol}>
                  <View style={[styles.bar, { height: Math.round((d.mt / 920) * 100) }]} />
                  <Text style={styles.barLabel}>{d.day}</Text>
                  <Text style={{ fontSize: 9, color: colors.textSecondary }}>{d.mt}MT</Text>
                </View>
              ))}
            </View>
          </KisanCard>
        </View>
      )}

      {/* ========================================================================= */}
      {/* PAGE 4: PAYMENT VIEW */}
      {/* ========================================================================= */}
      {activePage === 'Payment' && (
        <View style={styles.pageContent}>
          <PaymentSettlementOversight embedded={true} />
        </View>
      )}


      {/* ========================================================================= */}
      {/* PAGE 5: EXCEPTIONS VIEW */}
      {/* ========================================================================= */}
      {activePage === 'Exceptions' && (
        <View style={styles.pageContent}>
          <SystemExceptionLogs embedded={true} />
        </View>
      )}


      {/* ========================================================================= */}
      {/* PAGE 6: ANOMALIES VIEW */}
      {/* ========================================================================= */}
      {activePage === 'Anomalies' && (
        <View style={[styles.pageContent, { padding: 0 }]}>
          <AiAnomalyDetectionDashboard embedded={true} />
        </View>
      )}


      {/* ========================================================================= */}
      {/* PAGE 7: ALERTS VIEW */}
      {/* ========================================================================= */}
      {activePage === 'Alerts' && (
        <View style={styles.pageContent}>
          <SectionHeader
            title="Active Operational Alerts"
            subtitle="Emergency notifications, bottlenecks, and administrative alerts"
          />
          {liveAlerts.map((alert) => (
            <KisanCard key={alert.id} style={[styles.alertItemCard, { borderLeftColor: alert.color }]}>
              <View style={styles.alertItemHeader}>
                <Ionicons name={alert.icon as any} size={20} color={alert.color} style={{ marginRight: 8 }} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.alertItemTitle}>{alert.title}</Text>
                  <Text style={styles.alertItemTime}>{alert.time} · {alert.severity}</Text>
                </View>
              </View>
              <Text style={styles.alertItemDesc}>{alert.desc}</Text>
              <TouchableOpacity style={[styles.alertActionBtn, { backgroundColor: alert.color, alignSelf: 'flex-start', marginTop: 8 }]}>
                <Text style={styles.alertActionText}>{alert.action} →</Text>
              </TouchableOpacity>
            </KisanCard>
          ))}
        </View>
      )}

      {/* ========================================================================= */}
      {/* PAGE 8: REPORTS VIEW */}
      {/* ========================================================================= */}
      {activePage === 'Reports' && (
        <View style={styles.pageContent}>
          <SectionHeader
            title="Official MSP Procurement Reports"
            subtitle="Audit-compliant records for state and central government submission"
          />
          {[
            { title: 'Daily e-Uparjan Procurement Summary', code: 'REP-2026-DLY', date: '05 Sep 2026' },
            { title: 'District Target vs. Achieved Audit Sheet', code: 'REP-2026-DIST', date: '05 Sep 2026' },
            { title: 'DBT Bank Disbursement & PFMS Reconciliation', code: 'REP-2026-FIN', date: '04 Sep 2026' },
          ].map((rep) => (
            <KisanCard key={rep.code} style={styles.centreCard}>
              <View style={styles.centreHeader}>
                <View>
                  <Text style={styles.centreName}>{rep.title}</Text>
                  <Text style={styles.centreDistrict}>{rep.code} · Generated {rep.date}</Text>
                </View>
                <TouchableOpacity style={styles.downloadBtn}>
                  <Ionicons name="download-outline" size={16} color={colors.primary} style={{ marginRight: 4 }} />
                  <Text style={styles.downloadBtnText}>Export CSV</Text>
                </TouchableOpacity>
              </View>
            </KisanCard>
          ))}
        </View>
      )}

      {/* ========================================================================= */}
      {/* PAGE: FARMER DATA (ADMIN ACCESS) */}
      {/* ========================================================================= */}
      {activePage === 'FarmerData' && (
        <View style={styles.pageContent}>
          <SectionHeader
            title="Farmer Registry & Procurement Records"
            subtitle="Access live farmer slot bookings, check-ins, weighments & DBT payouts"
          />

          {/* Search & Filter Bar */}
          <View style={styles.searchFilterContainer}>
            <View style={styles.searchInputRow}>
              <Ionicons name="search" size={18} color="#78909C" style={{ marginLeft: 10, marginRight: 8 }} />
              <TextInput
                style={styles.farmerSearchInput}
                placeholder="Search by farmer name, phone, or token ID..."
                placeholderTextColor="#90A4AE"
                value={farmerSearchQuery}
                onChangeText={setFarmerSearchQuery}
              />
              {farmerSearchQuery.length > 0 && (
                <TouchableOpacity onPress={() => setFarmerSearchQuery('')} style={{ padding: 6 }}>
                  <Ionicons name="close-circle" size={18} color="#90A4AE" />
                </TouchableOpacity>
              )}
            </View>

            {/* District Quick Filter Chips */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.districtChipsRow}>
              {['ALL', 'Sehore', 'Harda', 'Dewas', 'Chhindwara', 'Jabalpur', 'Bhopal'].map((dist) => (
                <TouchableOpacity
                  key={dist}
                  style={[
                    styles.districtChip,
                    farmerFilterDistrict === dist && styles.districtChipActive,
                  ]}
                  onPress={() => setFarmerFilterDistrict(dist)}
                >
                  <Text
                    style={[
                      styles.districtChipText,
                      farmerFilterDistrict === dist && styles.districtChipTextActive,
                    ]}
                  >
                    {dist === 'ALL' ? 'All Districts' : dist}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* Farmer Status Counters */}
          <View style={styles.farmerStatsRow}>
            <View style={[styles.farmerStatMiniCard, { borderLeftColor: '#2E7D32' }]}>
              <Text style={styles.farmerStatMiniVal}>12,450</Text>
              <Text style={styles.farmerStatMiniLabel}>Total Registered</Text>
            </View>
            <View style={[styles.farmerStatMiniCard, { borderLeftColor: '#1565C0' }]}>
              <Text style={styles.farmerStatMiniVal}>1,420</Text>
              <Text style={styles.farmerStatMiniLabel}>Slots Booked</Text>
            </View>
            <View style={[styles.farmerStatMiniCard, { borderLeftColor: '#F57C00' }]}>
              <Text style={styles.farmerStatMiniVal}>218</Text>
              <Text style={styles.farmerStatMiniLabel}>Checked In</Text>
            </View>
            <View style={[styles.farmerStatMiniCard, { borderLeftColor: colors.primary }]}>
              <Text style={styles.farmerStatMiniVal}>864</Text>
              <Text style={styles.farmerStatMiniLabel}>Completed</Text>
            </View>
          </View>

          {/* Farmer Cards List */}
          {adminFarmerRecords
            .filter((f) => {
              const matchesDist = farmerFilterDistrict === 'ALL' || f.district.toLowerCase() === farmerFilterDistrict.toLowerCase();
              const q = farmerSearchQuery.trim().toLowerCase();
              const matchesQuery =
                !q ||
                f.name.toLowerCase().includes(q) ||
                f.phone.includes(q) ||
                f.tokenNumber.toLowerCase().includes(q) ||
                f.crop.toLowerCase().includes(q);
              return matchesDist && matchesQuery;
            })
            .map((farmer) => (
              <KisanCard key={farmer.id} style={styles.farmerCard}>
                <View style={styles.farmerCardHeader}>
                  <View style={{ flex: 1 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                      <Text style={styles.farmerCardName}>{farmer.name}</Text>
                      <View style={styles.tokenPill}>
                        <Text style={styles.tokenPillText}>{farmer.tokenNumber}</Text>
                      </View>
                    </View>
                    <Text style={styles.farmerCardSub}>
                      {farmer.fatherName} · 📞 +91 {farmer.phone}
                    </Text>
                    <Text style={styles.farmerCardLocation}>
                      📍 {farmer.village}, {farmer.district} · Land: {farmer.landAcres} Acres
                    </Text>
                  </View>
                  <View style={{ alignItems: 'flex-end' }}>
                    <StatusBadge
                      status={farmer.status.replace('_', ' ')}
                      variant={
                        farmer.status === 'COMPLETED'
                          ? 'success'
                          : farmer.status === 'CHECKED_IN'
                          ? 'warning'
                          : farmer.status === 'HOLD_EXCEPTION'
                          ? 'error'
                          : 'default'
                      }
                    />
                    <Text style={styles.farmerTimeText}>{farmer.slotTime.split('·')[1]?.trim() || farmer.slotTime}</Text>
                  </View>
                </View>

                {/* Procurement Intake & Assay Details */}
                <View style={styles.farmerIntakeRow}>
                  <View style={styles.intakeCol}>
                    <Text style={styles.intakeLabel}>Crop</Text>
                    <Text style={styles.intakeVal}>{farmer.crop}</Text>
                  </View>
                  <View style={styles.intakeCol}>
                    <Text style={styles.intakeLabel}>Expected / Weighed</Text>
                    <Text style={styles.intakeVal}>
                      {farmer.weighedMT > 0 ? `${farmer.weighedMT} MT` : `${farmer.expectedMT} MT (Exp)`}
                    </Text>
                  </View>
                  <View style={styles.intakeCol}>
                    <Text style={styles.intakeLabel}>Moisture & Grade</Text>
                    <Text style={[styles.intakeVal, farmer.moisturePct > 12.5 && { color: colors.error }]}>
                      {farmer.moisturePct > 0 ? `${farmer.moisturePct}% · ${farmer.grade}` : 'Awaiting Test'}
                    </Text>
                  </View>
                </View>

                {/* DBT Payment Status Box */}
                <View style={styles.farmerPaymentBox}>
                  <View>
                    <Text style={styles.paymentBoxLabel}>Estimated Procurement Payout</Text>
                    <Text style={styles.paymentBoxAmount}>{farmer.paymentAmount}</Text>
                  </View>
                  <View style={[styles.dbtStatusBadge, { backgroundColor: farmer.dbtStatus.includes('CREDITED') ? '#E8F5E9' : farmer.dbtStatus.includes('HOLD') ? '#FFEBEE' : '#FFF8E1' }]}>
                    <Text style={[styles.dbtStatusText, { color: farmer.dbtStatus.includes('CREDITED') ? '#2E7D32' : farmer.dbtStatus.includes('HOLD') ? '#D32F2F' : '#F57C00' }]}>
                      {farmer.dbtStatus}
                    </Text>
                  </View>
                </View>

                {/* Admin Verification Action Row */}
                <View style={styles.farmerActionRow}>
                  <TouchableOpacity style={styles.adminSmallBtn}>
                    <Ionicons name="document-text-outline" size={14} color={colors.primary} style={{ marginRight: 4 }} />
                    <Text style={styles.adminSmallBtnText}>Weighment Slip</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.adminSmallBtn}>
                    <Ionicons name="shield-checkmark-outline" size={14} color="#1565C0" style={{ marginRight: 4 }} />
                    <Text style={[styles.adminSmallBtnText, { color: '#1565C0' }]}>e-Girdawari</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.adminSmallBtn}>
                    <Ionicons name="call-outline" size={14} color="#455A64" style={{ marginRight: 4 }} />
                    <Text style={[styles.adminSmallBtnText, { color: '#455A64' }]}>Call Farmer</Text>
                  </TouchableOpacity>
                </View>
              </KisanCard>
            ))}
        </View>
      )}

      {/* ========================================================================= */}
      {/* PAGE: OPERATOR DATA (ADMIN ACCESS) */}
      {/* ========================================================================= */}
      {activePage === 'OperatorData' && (
        <View style={styles.pageContent}>
          <SectionHeader
            title="Mandi Operators & Scale Staff Roster"
            subtitle="Live operational monitoring of mandi superintendents, weighbridge and lab assayers"
          />

          {/* Operator KPI Summary */}
          <View style={styles.farmerStatsRow}>
            <View style={[styles.farmerStatMiniCard, { borderLeftColor: '#1565C0' }]}>
              <Text style={styles.farmerStatMiniVal}>48</Text>
              <Text style={styles.farmerStatMiniLabel}>Active Operators</Text>
            </View>
            <View style={[styles.farmerStatMiniCard, { borderLeftColor: '#2E7D32' }]}>
              <Text style={styles.farmerStatMiniVal}>32</Text>
              <Text style={styles.farmerStatMiniLabel}>Scales Calibrated</Text>
            </View>
            <View style={[styles.farmerStatMiniCard, { borderLeftColor: '#7B1FA2' }]}>
              <Text style={styles.farmerStatMiniVal}>1,372</Text>
              <Text style={styles.farmerStatMiniLabel}>Lots Weighed</Text>
            </View>
            <View style={[styles.farmerStatMiniCard, { borderLeftColor: colors.primary }]}>
              <Text style={styles.farmerStatMiniVal}>7.8 min</Text>
              <Text style={styles.farmerStatMiniLabel}>Avg Turnaround</Text>
            </View>
          </View>

          {/* Operator Cards List */}
          {adminOperatorRecords.map((op) => (
            <KisanCard key={op.id} style={styles.farmerCard}>
              <View style={styles.farmerCardHeader}>
                <View style={{ flex: 1 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Text style={styles.farmerCardName}>{op.name}</Text>
                    <View style={[styles.tokenPill, { backgroundColor: '#E3F2FD' }]}>
                      <Text style={[styles.tokenPillText, { color: '#1565C0' }]}>{op.id}</Text>
                    </View>
                  </View>
                  <Text style={styles.farmerCardSub}>
                    {op.designation} · 📞 +91 {op.phone}
                  </Text>
                  <Text style={styles.farmerCardLocation}>
                    🏢 {op.mandi} · ⚖️ {op.counter}
                  </Text>
                </View>
                <View style={{ alignItems: 'flex-end' }}>
                  <StatusBadge status="ACTIVE ONLINE" variant="success" />
                  <Text style={styles.farmerTimeText}>{op.shift}</Text>
                </View>
              </View>

              {/* Operator Metrics Breakdown */}
              <View style={styles.farmerIntakeRow}>
                <View style={styles.intakeCol}>
                  <Text style={styles.intakeLabel}>Today's Tokens</Text>
                  <Text style={styles.intakeVal}>{op.tokensProcessedToday} Tokens</Text>
                </View>
                <View style={styles.intakeCol}>
                  <Text style={styles.intakeLabel}>Intake Weighed</Text>
                  <Text style={styles.intakeVal}>{op.lotsWeighedMT} MT</Text>
                </View>
                <View style={styles.intakeCol}>
                  <Text style={styles.intakeLabel}>Scale Calibration</Text>
                  <Text style={[styles.intakeVal, { color: '#2E7D32' }]}>{op.calibrationStatus}</Text>
                </View>
              </View>

              {/* Performance Indicator Bar */}
              <View style={styles.operatorPerfRow}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Ionicons name="speedometer-outline" size={16} color="#455A64" style={{ marginRight: 6 }} />
                  <Text style={styles.operatorPerfText}>Service Speed: <Text style={{ fontWeight: 'bold' }}>{op.turnaroundSpeed}</Text></Text>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Ionicons name="flask-outline" size={16} color="#455A64" style={{ marginRight: 6 }} />
                  <Text style={styles.operatorPerfText}>Moisture Tests: <Text style={{ fontWeight: 'bold' }}>{op.moistureTestsLogged}</Text></Text>
                </View>
              </View>

              {/* Operator Admin Control Actions */}
              <View style={styles.farmerActionRow}>
                <TouchableOpacity style={styles.adminSmallBtn}>
                  <Ionicons name="shield-outline" size={14} color="#2E7D32" style={{ marginRight: 4 }} />
                  <Text style={[styles.adminSmallBtnText, { color: '#2E7D32' }]}>Audit Scale Tare</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.adminSmallBtn}>
                  <Ionicons name="sync-outline" size={14} color="#1565C0" style={{ marginRight: 4 }} />
                  <Text style={[styles.adminSmallBtnText, { color: '#1565C0' }]}>Reassign Counter</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.adminSmallBtn}>
                  <Ionicons name="call-outline" size={14} color="#455A64" style={{ marginRight: 4 }} />
                  <Text style={[styles.adminSmallBtnText, { color: '#455A64' }]}>Call Operator</Text>
                </TouchableOpacity>
              </View>
            </KisanCard>
          ))}
        </View>
      )}

      {/* ========================================================================= */}
      {/* PAGE 10: SETTINGS VIEW */}
      {/* ========================================================================= */}
      {activePage === 'Settings' && (
        <View style={styles.pageContent}>
          <SectionHeader
            title="System Parameters & MSP Configuration"
            subtitle="Threshold limits, crop pricing, and administrative policies"
          />
          <KisanCard style={styles.chartCard}>
            <Text style={styles.chartTitle}>⚙️ Operating Thresholds</Text>
            <View style={styles.payoutRow}>
              <Text style={styles.payoutLabel}>Mandi Capacity Warning Alert:</Text>
              <Text style={styles.payoutVal}>&gt; 90% Utilization</Text>
            </View>
            <View style={styles.payoutRow}>
              <Text style={styles.payoutLabel}>Max Acceptable Queue Waiting Time:</Text>
              <Text style={styles.payoutVal}>15 Minutes</Text>
            </View>
            <View style={styles.payoutRow}>
              <Text style={styles.payoutLabel}>Active Season:</Text>
              <Text style={[styles.payoutVal, { color: colors.primary, fontWeight: 'bold' }]}>Rabi / Kharif 2026</Text>
            </View>
          </KisanCard>
        </View>
      )}

      {/* Bottom Footer */}
      <View style={styles.footerBox}>
        <Text style={styles.footerText}>
          🇮🇳 National Agriculture Market · e-Uparjan System · DoCA Government of India
        </Text>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: spacing.md,
    backgroundColor: '#F5F7FA',
  },
  govHeaderStrip: {
    backgroundColor: '#263238',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: radius.xs,
    marginBottom: spacing.xs,
    alignItems: 'center',
  },
  govHeaderText: {
    fontSize: 11,
    color: '#ECEFF1',
    fontWeight: '500',
    letterSpacing: 0.3,
  },
  commandBanner: {
    backgroundColor: '#37474F',
    padding: spacing.md,
    borderRadius: radius.md,
    marginBottom: spacing.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  liveIndicatorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  pulseCircle: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#69F0AE',
    marginRight: 6,
  },
  liveIndicatorText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#80CBC4',
    letterSpacing: 0.8,
  },
  commandTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  commandSub: {
    fontSize: 12,
    color: '#B0BEC5',
    marginTop: 2,
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.25)',
  },
  logoutBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },

  // Navigation column container
  navColumnContainer: {
    marginBottom: spacing.md,
  },
  navColumnScroll: {
    flexDirection: 'row',
    gap: 8,
    paddingVertical: 2,
  },
  navColumnItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: '#CFD8DC',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  navColumnItemActive: {
    backgroundColor: '#37474F',
    borderColor: '#263238',
  },
  navColumnText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#455A64',
  },
  navColumnTextActive: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  navBadge: {
    marginLeft: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
  },
  navBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: 'bold',
  },

  pageContent: {
    gap: spacing.md,
  },

  // Filter Card
  filterCard: {
    padding: spacing.md,
    backgroundColor: '#FFFFFF',
    borderColor: '#CFD8DC',
    borderWidth: 1,
  },
  filterHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ECEFF1',
    paddingBottom: 8,
  },
  filterCardTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  filterActiveLabel: {
    fontSize: 11,
    fontWeight: 'bold',
    color: colors.primary,
  },
  filterSectionTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#546E7A',
    marginTop: 8,
    marginBottom: 6,
  },
  filterChipScroll: {
    flexDirection: 'row',
    marginBottom: 6,
  },
  filterChip: {
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  filterChipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primaryDark,
  },
  filterChipActiveCrop: {
    backgroundColor: colors.secondary,
    borderColor: colors.secondary,
  },
  filterChipText: {
    fontSize: 12,
    color: colors.textPrimary,
    fontWeight: '500',
  },
  filterChipTextActive: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  dateRangeRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 6,
  },
  dateRangeBtn: {
    flex: 1,
    paddingVertical: 7,
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  dateRangeBtnActive: {
    backgroundColor: '#263238',
    borderColor: '#263238',
  },
  dateRangeText: {
    fontSize: 11,
    color: colors.textPrimary,
    fontWeight: '500',
  },
  dateRangeTextActive: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },

  // Target Hero Card
  targetHeroCard: {
    backgroundColor: '#1E3A8A',
    padding: spacing.md,
    borderRadius: radius.md,
  },
  targetHeroHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.md,
  },
  targetHeroSub: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#93C5FD',
    letterSpacing: 0.8,
  },
  targetHeroTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: 2,
  },
  targetBadge: {
    backgroundColor: '#10B981',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  targetBadgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  targetComparisonGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  targetCol: {
    flex: 1,
  },
  targetColLabel: {
    fontSize: 11,
    color: '#BFDBFE',
    fontWeight: '600',
  },
  targetColValue: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: 2,
  },
  targetColSub: {
    fontSize: 11,
    color: '#93C5FD',
    marginTop: 2,
  },
  targetDivider: {
    width: 1,
    height: 44,
    backgroundColor: 'rgba(255,255,255,0.25)',
    marginHorizontal: 12,
  },
  progressBarWrapper: {
    marginTop: 4,
  },
  progressBarTrack: {
    height: 12,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 6,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#10B981',
    borderRadius: 6,
  },
  progressLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 6,
  },
  progressLabelText: {
    fontSize: 10,
    color: '#BFDBFE',
  },
  progressLabelCenter: {
    fontSize: 10,
    color: '#E0E7FF',
    fontWeight: 'bold',
  },

  // KPI Grid
  kpiGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  kpiBox: {
    width: '48.5%',
    padding: spacing.md,
    minHeight: 125,
    justifyContent: 'space-between',
  },
  kpiTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  kpiIconCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    justifyContent: 'center',
    alignItems: 'center',
  },
  slotPill: {
    backgroundColor: '#E3F2FD',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  slotPillText: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#1565C0',
  },
  livePill: {
    backgroundColor: '#FFF3E0',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  livePillText: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#E65100',
  },
  kpiNumber: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.primary,
    marginTop: 6,
  },
  kpiTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  kpiFootnote: {
    fontSize: 10,
    color: colors.textSecondary,
    marginTop: 2,
  },

  // Budget Card
  budgetCard: {
    padding: spacing.md,
  },
  budgetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.md,
  },
  budgetSub: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#546E7A',
    letterSpacing: 0.5,
  },
  budgetMainTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  budgetBadge: {
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
  },
  budgetBadgeText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#2E7D32',
  },
  budgetRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  budgetItem: {
    flex: 1,
    alignItems: 'center',
  },
  budgetItemLabel: {
    fontSize: 11,
    color: colors.textSecondary,
    fontWeight: '500',
    textAlign: 'center',
  },
  budgetItemVal: {
    fontSize: 17,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginTop: 3,
  },
  budgetItemSub: {
    fontSize: 10,
    color: '#78909C',
    marginTop: 2,
    textAlign: 'center',
  },
  budgetMeterContainer: {
    marginTop: 6,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#ECEFF1',
  },
  budgetMeterLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  budgetMeterText: {
    fontSize: 11,
    color: '#546E7A',
    fontWeight: '600',
  },
  budgetTrack: {
    height: 10,
    backgroundColor: '#CFD8DC',
    borderRadius: 5,
    flexDirection: 'row',
    overflow: 'hidden',
  },
  budgetFillDone: {
    height: '100%',
    backgroundColor: '#2E7D32',
  },
  budgetFillPending: {
    height: '100%',
    backgroundColor: '#FF8F00',
  },
  budgetLegend: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 8,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 4,
  },
  legendText: {
    fontSize: 10,
    color: colors.textSecondary,
  },

  // Mandi Status Row
  mandiStatusRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  mandiStatCard: {
    flex: 1,
    padding: spacing.md,
    alignItems: 'center',
  },
  mandiStatValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginTop: 6,
  },
  mandiStatLabel: {
    fontSize: 10,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 2,
  },
  mandiStatSub: {
    fontSize: 10,
    color: '#546E7A',
    fontWeight: 'bold',
    marginTop: 4,
  },

  // Visual Charts
  chartCard: {
    padding: spacing.md,
  },
  chartHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  chartCardTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  chartCardSub: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 2,
  },
  chartMetricPill: {
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
  },
  chartMetricPillText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: colors.primary,
  },
  barChartContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    height: 150,
    paddingTop: 16,
    paddingBottom: 4,
    borderBottomWidth: 1,
    borderBottomColor: '#ECEFF1',
  },
  chartBarCol: {
    alignItems: 'center',
    width: 38,
  },
  chartBarValText: {
    fontSize: 9,
    color: '#546E7A',
    fontWeight: 'bold',
    marginBottom: 4,
  },
  chartBar: {
    width: 22,
    borderRadius: 4,
  },
  chartBarDayText: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 6,
  },
  chartFooterNote: {
    fontSize: 11,
    color: '#546E7A',
    fontWeight: '600',
    marginTop: 8,
    textAlign: 'center',
  },

  // District Bar Row
  districtBarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  distLabelBox: {
    width: 95,
  },
  distLabelName: {
    fontSize: 12,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  distLabelMandis: {
    fontSize: 10,
    color: colors.textSecondary,
  },
  distBarTrack: {
    flex: 1,
    height: 12,
    backgroundColor: '#ECEFF1',
    borderRadius: 6,
    marginHorizontal: 8,
    overflow: 'hidden',
  },
  distBarFill: {
    height: '100%',
    backgroundColor: colors.secondary,
    borderRadius: 6,
  },
  distValBox: {
    width: 85,
    alignItems: 'flex-end',
  },
  distValMT: {
    fontSize: 12,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  distValPct: {
    fontSize: 10,
    color: colors.secondary,
  },

  // Crop Multi-track
  cropBarMultiTrack: {
    flexDirection: 'row',
    borderRadius: 9,
    overflow: 'hidden',
    marginTop: 12,
    marginBottom: 12,
  },
  cropLegendGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  cropLegendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '45%',
  },
  cropLegendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 6,
  },
  cropLegendName: {
    fontSize: 11,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  cropLegendMT: {
    fontSize: 10,
    color: colors.textSecondary,
  },

  // Table Card
  tableCard: {
    padding: spacing.md,
  },
  tableHeaderRow: {
    flexDirection: 'row',
    paddingBottom: 8,
    borderBottomWidth: 1.5,
    borderBottomColor: '#CFD8DC',
  },
  tableHeadCell: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#546E7A',
  },
  tableBodyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ECEFF1',
  },
  tableCropName: {
    fontSize: 12,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  tableCropMsp: {
    fontSize: 10,
    color: colors.textSecondary,
  },
  tableBodyCell: {
    fontSize: 12,
    color: colors.textPrimary,
  },
  tableStatusPill: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  tableStatusText: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  mandiFillPill: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    marginBottom: 3,
  },
  mandiFillText: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  miniMandiFillTrack: {
    width: 52,
    height: 4,
    backgroundColor: '#ECEFF1',
    borderRadius: 2,
    overflow: 'hidden',
  },
  miniMandiFillBar: {
    height: '100%',
    borderRadius: 2,
  },

  // Alert Item Card
  alertItemCard: {
    padding: spacing.md,
    borderLeftWidth: 4,
    marginBottom: spacing.xs,
  },
  alertItemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  alertItemTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  alertItemTime: {
    fontSize: 10,
    color: '#78909C',
  },
  alertItemDesc: {
    fontSize: 12,
    color: colors.textSecondary,
    lineHeight: 16,
  },
  alertActionRow: {
    marginTop: 8,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  alertActionBtn: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: radius.xs,
  },
  alertActionText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: 'bold',
  },

  // Centre Card
  centreCard: {
    padding: spacing.md,
    marginBottom: spacing.xs,
  },
  centreHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  centreName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  centreDistrict: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 2,
  },
  centreMetrics: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 6,
  },
  centreMetricBadge: {
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: radius.xs,
  },
  metricText: {
    fontSize: 11,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  openDetailBtn: {
    marginTop: 10,
    backgroundColor: '#263238',
    paddingVertical: 8,
    borderRadius: radius.xs,
    alignItems: 'center',
  },
  openDetailBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  downloadBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: radius.xs,
  },
  downloadBtnText: {
    color: colors.primary,
    fontSize: 11,
    fontWeight: 'bold',
  },

  // Analytics placeholder
  chartTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  barChartPlaceholder: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    height: 120,
    paddingBottom: 8,
  },
  barCol: {
    alignItems: 'center',
    width: 36,
  },
  bar: {
    width: 20,
    backgroundColor: '#81C784',
    borderRadius: 4,
    marginBottom: 4,
  },
  barLabel: {
    fontSize: 11,
    color: colors.textSecondary,
  },
  payoutRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#ECEFF1',
  },
  payoutLabel: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  payoutVal: {
    fontSize: 12,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },

  // Farmer & Operator Views Styles
  searchFilterContainer: {
    marginBottom: spacing.sm,
  },
  searchInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: '#CFD8DC',
    paddingVertical: 4,
    paddingRight: 8,
    marginBottom: 8,
  },
  farmerSearchInput: {
    flex: 1,
    fontSize: 13,
    color: colors.textPrimary,
    paddingVertical: 6,
  },
  districtChipsRow: {
    flexDirection: 'row',
    gap: 6,
    paddingVertical: 2,
  },
  districtChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#CFD8DC',
  },
  districtChipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  districtChipText: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  districtChipTextActive: {
    color: '#FFFFFF',
  },
  farmerStatsRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: spacing.sm,
  },
  farmerStatMiniCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 10,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderLeftWidth: 4,
  },
  farmerStatMiniVal: {
    fontSize: 15,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  farmerStatMiniLabel: {
    fontSize: 10,
    color: colors.textSecondary,
    marginTop: 2,
  },
  farmerCard: {
    padding: spacing.md,
    marginBottom: spacing.xs,
  },
  farmerCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  farmerCardName: {
    fontSize: 15,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  tokenPill: {
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    marginLeft: 8,
  },
  tokenPillText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#2E7D32',
  },
  farmerCardSub: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 2,
  },
  farmerCardLocation: {
    fontSize: 11,
    color: '#546E7A',
    marginTop: 2,
  },
  farmerTimeText: {
    fontSize: 10,
    color: colors.textSecondary,
    marginTop: 4,
    textAlign: 'right',
  },
  farmerIntakeRow: {
    flexDirection: 'row',
    backgroundColor: '#F8F9FA',
    padding: 8,
    borderRadius: radius.xs,
    marginTop: 6,
    marginBottom: 8,
  },
  intakeCol: {
    flex: 1,
  },
  intakeLabel: {
    fontSize: 10,
    color: colors.textSecondary,
    marginBottom: 2,
  },
  intakeVal: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  farmerPaymentBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: '#ECEFF1',
    marginTop: 4,
  },
  paymentBoxLabel: {
    fontSize: 10,
    color: colors.textSecondary,
  },
  paymentBoxAmount: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.primary,
    marginTop: 2,
  },
  dbtStatusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  dbtStatusText: {
    fontSize: 11,
    fontWeight: 'bold',
  },
  farmerActionRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 8,
  },
  adminSmallBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F4F8',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: radius.xs,
  },
  adminSmallBtnText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: colors.primary,
  },
  operatorPerfRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#ECEFF1',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: radius.xs,
    marginVertical: 6,
  },
  operatorPerfText: {
    fontSize: 11,
    color: '#37474F',
  },

  // Mandis Monitor Specific Styles
  mandiFilterCard: {
    padding: spacing.md,
    marginBottom: spacing.md,
    backgroundColor: '#FFFFFF',
  },
  filterSection: {
    marginBottom: 10,
  },
  filterChipRow: {
    flexDirection: 'row',
    gap: 6,
    paddingVertical: 2,
  },
  mandiPill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#F5F5F5',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  mandiPillActive: {
    backgroundColor: '#37474F',
    borderColor: '#263238',
  },
  mandiPillText: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  mandiPillTextActive: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  mandiSearchContainer: {
    marginTop: 4,
  },
  mandiSearchInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FAFAFA',
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: '#CFD8DC',
    paddingVertical: 4,
    paddingRight: 8,
    marginBottom: 8,
  },
  mandiSearchInput: {
    flex: 1,
    fontSize: 13,
    color: colors.textPrimary,
    paddingVertical: 4,
  },

  // Mandi KPI Grid
  mandiKpiGrid: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: spacing.md,
  },
  mandiKpiBox: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 10,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderLeftWidth: 4,
  },
  mandiKpiValue: {
    fontSize: 15,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  mandiKpiLabel: {
    fontSize: 10,
    color: colors.textSecondary,
    marginTop: 2,
  },
  mandiKpiSub: {
    fontSize: 9,
    color: '#546E7A',
    fontWeight: '600',
    marginTop: 2,
  },

  // Mandi Graph 1: Intake Bar Row
  mandiBarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  mandiBarLabelCol: {
    width: 110,
  },
  mandiBarName: {
    fontSize: 11,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  mandiBarDistrict: {
    fontSize: 9,
    color: colors.textSecondary,
    marginTop: 1,
  },
  mandiBarTrack: {
    flex: 1,
    height: 12,
    backgroundColor: '#ECEFF1',
    borderRadius: 6,
    marginHorizontal: 8,
    overflow: 'hidden',
  },
  mandiBarFill: {
    height: '100%',
    borderRadius: 6,
  },
  mandiBarValCol: {
    width: 80,
    alignItems: 'flex-end',
  },
  mandiBarValMT: {
    fontSize: 11,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  mandiBarValPct: {
    fontSize: 9,
    color: colors.primary,
    fontWeight: '600',
  },

  // Mandi Graph 2: Farmer Turnout Row
  turnoutRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#ECEFF1',
  },
  turnoutInfoCol: {
    flex: 1,
  },
  turnoutMandiName: {
    fontSize: 12,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  turnoutCountText: {
    fontSize: 10,
    color: colors.textSecondary,
    marginTop: 2,
  },
  turnoutPillCol: {
    marginLeft: 10,
  },
  turnoutPill: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  turnoutPillText: {
    fontSize: 10,
    fontWeight: 'bold',
  },

  // Mandi Graph 3: MSP Expenditure Row
  expenditureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  expenditureLabelCol: {
    width: 105,
  },
  expenditureMandiName: {
    fontSize: 11,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  expenditureTotalVal: {
    fontSize: 9,
    color: colors.textSecondary,
    marginTop: 1,
  },
  expenditureMeterCol: {
    flex: 1,
    marginLeft: 8,
  },
  expenditureTrack: {
    height: 10,
    backgroundColor: '#FFE0B2',
    borderRadius: 5,
    overflow: 'hidden',
  },
  expenditureFillPaid: {
    height: '100%',
    backgroundColor: '#7B1FA2',
    borderRadius: 5,
  },
  expenditureSubRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 2,
  },
  expenditurePaidText: {
    fontSize: 9,
    color: '#7B1FA2',
    fontWeight: '600',
  },
  expenditurePendingText: {
    fontSize: 9,
    color: '#E65100',
  },

  // Mandi Surveillance Card
  mandiMonitorCard: {
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  mandiCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  mandiCardTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  mandiIdBadge: {
    backgroundColor: '#ECEFF1',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    marginLeft: 6,
  },
  mandiIdBadgeText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#455A64',
  },
  mandiCardLocation: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 2,
  },
  mandiHoursText: {
    fontSize: 10,
    color: '#78909C',
    marginTop: 2,
  },

  // Efficiency & Turnaround Row
  mandiEfficiencyRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 10,
  },
  mandiEfficiencyBadge: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F5E9',
    padding: 8,
    borderRadius: radius.xs,
  },
  mandiEfficiencyVal: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2E7D32',
  },
  mandiEfficiencyLabel: {
    fontSize: 9,
    color: '#2E7D32',
  },
  mandiTurnaroundBadge: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E3F2FD',
    padding: 8,
    borderRadius: radius.xs,
  },
  mandiTurnaroundVal: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  mandiTurnaroundLabel: {
    fontSize: 9,
    color: colors.textSecondary,
  },
  mandiIntakeBadge: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    padding: 8,
    borderRadius: radius.xs,
  },
  mandiIntakeVal: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.primary,
  },
  mandiIntakeLabel: {
    fontSize: 9,
    color: colors.textSecondary,
  },

  // Stock Capacity Section
  mandiStockSection: {
    backgroundColor: '#FAFAFA',
    padding: 10,
    borderRadius: radius.sm,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ECEFF1',
  },
  mandiStockHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  mandiStockTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  mandiStockPill: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  mandiStockPillText: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  mandiStockMeterLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  mandiStockStoredText: {
    fontSize: 10,
    color: colors.textSecondary,
  },
  mandiStockCapacityText: {
    fontSize: 10,
    color: colors.textSecondary,
  },
  mandiStockTrack: {
    height: 8,
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 4,
  },
  mandiStockFill: {
    height: '100%',
    borderRadius: 4,
  },
  mandiAvailableSpaceText: {
    fontSize: 10,
    color: '#546E7A',
    marginTop: 2,
  },

  // Bottleneck Banner
  mandiBottleneckBanner: {
    flexDirection: 'row',
    padding: 10,
    borderRadius: radius.xs,
    borderLeftWidth: 4,
    marginBottom: 10,
  },
  mandiBottleneckTitle: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  mandiBottleneckDesc: {
    fontSize: 11,
    color: colors.textPrimary,
    marginTop: 2,
    lineHeight: 15,
  },

  // Crops Row
  mandiCropsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginBottom: 10,
  },
  mandiCropsLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.textSecondary,
    marginRight: 6,
  },
  mandiCropsChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
  },
  mandiCropBadge: {
    backgroundColor: '#ECEFF1',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  mandiCropBadgeText: {
    fontSize: 9,
    color: '#455A64',
    fontWeight: '500',
  },

  // Mandi Action Buttons
  mandiActionRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 2,
  },
  mandiInspectBtn: {
    flex: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: radius.xs,
  },
  mandiInspectBtnText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: 'bold',
  },
  mandiSecondaryBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ECEFF1',
    paddingVertical: 8,
    paddingHorizontal: 8,
    borderRadius: radius.xs,
  },
  mandiSecondaryBtnText: {
    color: '#37474F',
    fontSize: 10,
    fontWeight: 'bold',
  },

  footerBox: {
    alignItems: 'center',
    paddingVertical: spacing.lg,
    marginTop: spacing.md,
  },
  footerText: {
    fontSize: 11,
    color: '#90A4AE',
    textAlign: 'center',
  },
});