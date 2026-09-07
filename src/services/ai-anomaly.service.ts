export interface AnomalyKPI {
  title: string;
  count: number;
  subtitle: string;
  scoreRange?: string;
  color: string;
  bgColor: string;
  icon: string;
}

export interface AnomalyItem {
  id: string;
  state?: string;
  type: string;
  district: string;
  mandi: string;
  relatedTransaction: string;
  riskScore: number;
  severity: 'CRITICAL' | 'SUSPICIOUS' | 'MONITOR' | 'NORMAL';
  status: 'Under Review' | 'Assigned' | 'Investigating' | 'New' | 'Resolved';
  timestamp: string;
  details: string;
}

export interface AnomalyTypeStat {
  type: string;
  count: number;
  percentage: number;
  color: string;
}

export interface SeverityDistributionStat {
  label: string;
  percentage: number;
  count: number;
  color: string;
}

export interface StateProfile {
  name: string;
  isPrimary: boolean;
  code: string;
  commandCenterName: string;
  totalAnomalies: number;
  criticalAlerts: number;
  suspiciousActivities: number;
  lowRiskCount: number;
  riskScore: number;
  districts: string[];
  mandis: string[];
  insights: string[];
  recentAnomalies: AnomalyItem[];
}

// All 28 States and 8 Union Territories with Odisha as the PRIMARY state
export const ALL_DASHBOARD_STATES: { name: string; isPrimary: boolean; label: string }[] = [
  { name: 'Odisha', isPrimary: true, label: '🌾 Odisha (Primary State)' },
  { name: 'Andhra Pradesh', isPrimary: false, label: 'Andhra Pradesh' },
  { name: 'Arunachal Pradesh', isPrimary: false, label: 'Arunachal Pradesh' },
  { name: 'Assam', isPrimary: false, label: 'Assam' },
  { name: 'Bihar', isPrimary: false, label: 'Bihar' },
  { name: 'Chhattisgarh', isPrimary: false, label: 'Chhattisgarh' },
  { name: 'Goa', isPrimary: false, label: 'Goa' },
  { name: 'Gujarat', isPrimary: false, label: 'Gujarat' },
  { name: 'Haryana', isPrimary: false, label: 'Haryana' },
  { name: 'Himachal Pradesh', isPrimary: false, label: 'Himachal Pradesh' },
  { name: 'Jharkhand', isPrimary: false, label: 'Jharkhand' },
  { name: 'Karnataka', isPrimary: false, label: 'Karnataka' },
  { name: 'Kerala', isPrimary: false, label: 'Kerala' },
  { name: 'Madhya Pradesh', isPrimary: false, label: 'Madhya Pradesh' },
  { name: 'Maharashtra', isPrimary: false, label: 'Maharashtra' },
  { name: 'Manipur', isPrimary: false, label: 'Manipur' },
  { name: 'Meghalaya', isPrimary: false, label: 'Meghalaya' },
  { name: 'Mizoram', isPrimary: false, label: 'Mizoram' },
  { name: 'Nagaland', isPrimary: false, label: 'Nagaland' },
  { name: 'Punjab', isPrimary: false, label: 'Punjab' },
  { name: 'Rajasthan', isPrimary: false, label: 'Rajasthan' },
  { name: 'Sikkim', isPrimary: false, label: 'Sikkim' },
  { name: 'Tamil Nadu', isPrimary: false, label: 'Tamil Nadu' },
  { name: 'Telangana', isPrimary: false, label: 'Telangana' },
  { name: 'Tripura', isPrimary: false, label: 'Tripura' },
  { name: 'Uttar Pradesh', isPrimary: false, label: 'Uttar Pradesh' },
  { name: 'Uttarakhand', isPrimary: false, label: 'Uttarakhand' },
  { name: 'West Bengal', isPrimary: false, label: 'West Bengal' },
  // Union Territories
  { name: 'Andaman and Nicobar Islands', isPrimary: false, label: 'Andaman and Nicobar Islands (UT)' },
  { name: 'Chandigarh', isPrimary: false, label: 'Chandigarh (UT)' },
  { name: 'Dadra and Nagar Haveli and Daman and Diu', isPrimary: false, label: 'Dadra & Nagar Haveli (UT)' },
  { name: 'Delhi (NCT)', isPrimary: false, label: 'Delhi NCT (UT)' },
  { name: 'Jammu and Kashmir', isPrimary: false, label: 'Jammu and Kashmir (UT)' },
  { name: 'Ladakh', isPrimary: false, label: 'Ladakh (UT)' },
  { name: 'Lakshadweep', isPrimary: false, label: 'Lakshadweep (UT)' },
  { name: 'Puducherry', isPrimary: false, label: 'Puducherry (UT)' },
];

export const PRIMARY_STATE = 'Odisha';

export const ODISHA_ANOMALIES: AnomalyItem[] = [
  {
    id: 'ANM-9281',
    state: 'Odisha',
    type: 'Weight Manipulation',
    district: 'Balasore',
    mandi: 'Balasore Central',
    relatedTransaction: 'LOT-92831',
    riskScore: 92,
    severity: 'CRITICAL',
    status: 'Under Review',
    timestamp: '12 mins ago',
    details: 'Automated tare deviation detected: Truck registered 4.8 tons tare vs previous 3.9 tons baseline.',
  },
  {
    id: 'ANM-9282',
    state: 'Odisha',
    type: 'Fake Booking',
    district: 'Ganjam',
    mandi: 'Ganjam Mandi',
    relatedTransaction: 'BK-2231',
    riskScore: 78,
    severity: 'SUSPICIOUS',
    status: 'Assigned',
    timestamp: '34 mins ago',
    details: 'Same mobile and Aadhaar registered across 3 different mandi tokens within 20-minute window.',
  },
  {
    id: 'ANM-9283',
    state: 'Odisha',
    type: 'Officer Behaviour',
    district: 'Cuttack',
    mandi: 'Cuttack Mandi',
    relatedTransaction: 'OP-1938',
    riskScore: 88,
    severity: 'CRITICAL',
    status: 'Investigating',
    timestamp: '1 hour ago',
    details: '14 consecutive moisture override approvals without laboratory grain assay photolog.',
  },
  {
    id: 'ANM-9284',
    state: 'Odisha',
    type: 'Repetitive Transaction',
    district: 'Bhadrak',
    mandi: 'Bhadrak Mandi',
    relatedTransaction: 'TXN-7821',
    riskScore: 65,
    severity: 'SUSPICIOUS',
    status: 'New',
    timestamp: '2 hours ago',
    details: 'Same bank account credited 4 times for maximum DBT ceiling within 48 hours.',
  },
  {
    id: 'ANM-9285',
    state: 'Odisha',
    type: 'Mandi Activity Spike',
    district: 'Kendujhar',
    mandi: 'Kendujhar Central',
    relatedTransaction: 'GATE-0912',
    riskScore: 54,
    severity: 'MONITOR',
    status: 'Under Review',
    timestamp: '3 hours ago',
    details: 'Inflow surged +240% above historical average between 07:00 AM and 09:00 AM.',
  },
  {
    id: 'ANM-9286',
    state: 'Odisha',
    type: 'Payment Anomaly',
    district: 'Puri',
    mandi: 'Puri APMC',
    relatedTransaction: 'PAY-4419',
    riskScore: 72,
    severity: 'SUSPICIOUS',
    status: 'Assigned',
    timestamp: '4 hours ago',
    details: 'Beneficiary IFSC switched to merged entity right before ₹1.48L payout batch generation.',
  },
  {
    id: 'ANM-9287',
    state: 'Odisha',
    type: 'Weight Manipulation',
    district: 'Sambalpur',
    mandi: 'Sambalpur APMC',
    relatedTransaction: 'LOT-33102',
    riskScore: 28,
    severity: 'NORMAL',
    status: 'Resolved',
    timestamp: '5 hours ago',
    details: 'Scale sensor recalibration verified. Sensor drift cleared with standard 500kg weight.',
  },
];

// Generates state-specific profiles dynamically
export function getStateProfile(stateName: string): StateProfile {
  if (stateName === 'Odisha') {
    return {
      name: 'Odisha',
      isPrimary: true,
      code: 'OD',
      commandCenterName: 'ODISHA STATE APMC COMMAND CENTER (PRIMARY)',
      totalAnomalies: 48,
      criticalAlerts: 12,
      suspiciousActivities: 16,
      lowRiskCount: 20,
      riskScore: 72,
      districts: ['All Districts', 'Balasore', 'Ganjam', 'Cuttack', 'Bhadrak', 'Kendujhar', 'Puri', 'Sambalpur', 'Mayurbhanj', 'Khordha', 'Bargarh'],
      mandis: ['All Mandis', 'Balasore Central', 'Ganjam Mandi', 'Cuttack Mandi', 'Bhadrak Mandi', 'Kendujhar Central', 'Puri APMC', 'Sambalpur APMC', 'Bargarh APMC Yard'],
      insights: [
        'Odisha Primary: Weight anomalies increased by 23% across coastal mandi corridors.',
        'Balasore district has highest cumulative AI risk score (88.4) in Odisha APMC network.',
        'Multiple duplicate booking tokens detected across unverified land khata IDs in Ganjam.',
        'Officer OP-1938 shows unusual override behaviour (+14 manual moisture clearances).',
        'Direct DBT settlement to Odisha Gramya Bank batches functioning at 99.4% precision.',
      ],
      recentAnomalies: ODISHA_ANOMALIES,
    };
  }

  // Generic generator for any other state
  const cleanName = stateName.replace(/\s*\(UT\)$/, '');
  const baseDistricts = ['All Districts', `${cleanName} Central`, `${cleanName} North`, `${cleanName} South`, `${cleanName} East`, `${cleanName} West`];
  const baseMandis = ['All Mandis', `${cleanName} Main APMC`, `${cleanName} Grain Mandi`, `${cleanName} Kisan Upaj Mandi`];

  const hash = cleanName.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const riskScore = 40 + (hash % 45);
  const total = 15 + (hash % 35);
  const critical = Math.max(2, Math.floor(total * 0.22));
  const suspicious = Math.max(3, Math.floor(total * 0.35));
  const lowRisk = total - critical - suspicious;

  const stateAnomalies: AnomalyItem[] = [
    {
      id: `ANM-${cleanName.substring(0, 2).toUpperCase()}-101`,
      state: cleanName,
      type: 'Weight Manipulation',
      district: `${cleanName} Central`,
      mandi: `${cleanName} Main APMC`,
      relatedTransaction: `LOT-${hash}`,
      riskScore: Math.min(95, riskScore + 15),
      severity: 'CRITICAL',
      status: 'Under Review',
      timestamp: '18 mins ago',
      details: `Weighbridge tare sensor variance (+12%) recorded during peak intake at ${cleanName} Main APMC.`,
    },
    {
      id: `ANM-${cleanName.substring(0, 2).toUpperCase()}-102`,
      state: cleanName,
      type: 'Fake Booking',
      district: `${cleanName} North`,
      mandi: `${cleanName} Grain Mandi`,
      relatedTransaction: `BK-${hash + 12}`,
      riskScore: Math.min(85, riskScore + 5),
      severity: 'SUSPICIOUS',
      status: 'Assigned',
      timestamp: '45 mins ago',
      details: `Discrepancy between geo-tagged land coordinates and Aadhaar registry in ${cleanName} North.`,
    },
    {
      id: `ANM-${cleanName.substring(0, 2).toUpperCase()}-103`,
      state: cleanName,
      type: 'Payment Anomaly',
      district: `${cleanName} South`,
      mandi: `${cleanName} Kisan Upaj Mandi`,
      relatedTransaction: `PAY-${hash + 33}`,
      riskScore: 35,
      severity: 'NORMAL',
      status: 'Resolved',
      timestamp: '2 hours ago',
      details: `Routine PFMS clearing delay resolved. Automated reconciliation confirmed.`,
    },
  ];

  return {
    name: cleanName,
    isPrimary: false,
    code: cleanName.substring(0, 2).toUpperCase(),
    commandCenterName: `${cleanName.toUpperCase()} STATE APMC COMMAND CENTER`,
    totalAnomalies: total,
    criticalAlerts: critical,
    suspiciousActivities: suspicious,
    lowRiskCount: lowRisk,
    riskScore,
    districts: baseDistricts,
    mandis: baseMandis,
    insights: [
      `${cleanName} State: Automated anomaly sentinel operational with ${total} active flags.`,
      `Critical procurement risk index currently at ${riskScore}/100.`,
      `Primary national baseline comparison anchored against Odisha State APMC standards.`,
      `Weighbridge sensors synced with regional MSP procurement gateway.`,
    ],
    recentAnomalies: stateAnomalies,
  };
}

export const AI_ANOMALY_DATA = {
  header: {
    title: 'KISAN MITRA — AI ANOMALY DETECTION',
    subtitle: 'Monitor suspicious procurement activities using AI-powered risk analysis',
    location: 'Odisha State Procurement Command Center (Primary State)',
    lastUpdated: '06 Sep 2026, 11:30 AM IST',
  },
  kpis: [
    {
      title: 'TOTAL ANOMALIES',
      count: 48,
      subtitle: 'Detected suspicious activities',
      color: '#38BDF8',
      bgColor: 'rgba(56, 189, 248, 0.12)',
      icon: 'hardware-chip-outline',
    },
    {
      title: 'CRITICAL ALERTS',
      count: 12,
      subtitle: 'Risk Score 81–100',
      color: '#EF4444',
      bgColor: 'rgba(239, 68, 68, 0.15)',
      icon: 'alert-circle',
    },
    {
      title: 'SUSPICIOUS ACTIVITIES',
      count: 16,
      subtitle: 'Risk Score 61–80',
      color: '#F97316',
      bgColor: 'rgba(249, 115, 22, 0.15)',
      icon: 'warning',
    },
    {
      title: 'NORMAL / LOW RISK',
      count: 20,
      subtitle: 'Risk Score 0–30',
      color: '#10B981',
      bgColor: 'rgba(16, 185, 129, 0.15)',
      icon: 'shield-checkmark',
    },
  ],
  riskScoreGauge: {
    currentScore: 72,
    label: 'Current AI Risk Level',
    statusZone: 'SUSPICIOUS',
    zoneColor: '#F97316',
    breakdown: [
      { label: 'Critical', count: 12, range: '81–100', color: '#EF4444' },
      { label: 'Suspicious', count: 16, range: '61–80', color: '#F97316' },
      { label: 'Monitor', count: 14, range: '31–60', color: '#EAB308' },
      { label: 'Normal', count: 6, range: '0–30', color: '#10B981' },
    ],
  },
  aiPerformanceMetrics: [
    {
      percentage: 92,
      label: 'Detection Confidence',
      icon: 'analytics',
      color: '#38BDF8',
      desc: 'Deep learning ensemble score across 24 checkpoints',
    },
    {
      percentage: 87,
      label: 'Weight Manipulation Detection',
      icon: 'scale',
      color: '#10B981',
      desc: 'Tare-to-gross sensor correlation precision',
    },
    {
      percentage: 78,
      label: 'Fake Booking Detection',
      icon: 'calendar',
      color: '#818CF8',
      desc: 'Aadhaar-to-land registry satellite verification',
    },
    {
      percentage: 84,
      label: 'Suspicious Transaction Detection',
      icon: 'cash',
      color: '#F59E0B',
      desc: 'Rapid token velocity and cyclical UTR tracking',
    },
  ],
  anomaliesByType: [
    { type: 'Weight Manipulation', count: 16, percentage: 33, color: '#EF4444' },
    { type: 'Fake/Duplicate Booking', count: 10, percentage: 21, color: '#F97316' },
    { type: 'Suspicious Transactions', count: 8, percentage: 17, color: '#F59E0B' },
    { type: 'Officer Behaviour', count: 7, percentage: 15, color: '#8B5CF6' },
    { type: 'Payment Anomaly', count: 4, percentage: 8, color: '#38BDF8' },
    { type: 'Mandi Activity Spike', count: 3, percentage: 6, color: '#10B981' },
  ],
  severityDistribution: [
    { label: 'Critical', percentage: 25, count: 12, color: '#EF4444' },
    { label: 'Suspicious', percentage: 33, count: 16, color: '#F97316' },
    { label: 'Monitor', percentage: 29, count: 14, color: '#EAB308' },
    { label: 'Normal', percentage: 13, count: 6, color: '#10B981' },
  ],
  insights: [
    'Odisha Primary: Weight anomalies increased by 23% across coastal mandi corridors.',
    'Balasore district has highest cumulative AI risk score (88.4) in Odisha APMC network.',
    'Multiple fake bookings detected from similar IP clusters and unverified land khata IDs in Ganjam.',
    'Officer OP-1938 shows unusual override behaviour (+14 manual moisture clearances).',
    'Suspicious repetitive transactions increased this week on PFMS batch clearances.',
  ],
  recentAnomalies: ODISHA_ANOMALIES,
  districts: ['All Districts', 'Balasore', 'Ganjam', 'Cuttack', 'Bhadrak', 'Kendujhar', 'Puri', 'Sambalpur'],
  mandis: ['All Mandis', 'Balasore Central', 'Ganjam Mandi', 'Cuttack Mandi', 'Bhadrak Mandi', 'Kendujhar Central', 'Puri APMC', 'Sambalpur APMC'],
  anomalyTypes: ['All Types', 'Weight Manipulation', 'Fake/Duplicate Booking', 'Suspicious Transactions', 'Officer Behaviour', 'Payment Anomaly', 'Mandi Activity Spike'],
  dateRanges: ['Last 30 Days', 'Last 7 Days', 'Today', 'Current Kharif Season'],
};
