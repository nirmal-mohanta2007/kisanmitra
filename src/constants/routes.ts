export const ROUTES = {
  AUTH: {
    LOGIN: '/auth/login',
    OTP: '/auth/otp',
  },
  FARMER: {
    HOME: '/farmer/home',
    BOOKING: '/farmer/booking',
    PROFILE: '/farmer/profile',
    RECEIPTS: '/farmer/receipts',
  },
  OPERATOR: {
    DASHBOARD: '/operator/dashboard',
    SCANNER: '/operator/scanner',
    WEIGHING: '/operator/weighing',
    QUALITY: '/operator/quality',
  },
  ADMIN: {
    DASHBOARD: '/admin/dashboard',
    REPORTS: '/admin/reports',
    SETTINGS: '/admin/settings',
  }
} as const;
