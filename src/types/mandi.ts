export interface OperatingHours {
  start?: string; // HH:mm
  end?: string;
  open?: string;
  close?: string;
}

export interface MandiCapacity {
  maxDailyProcurementQtl?: number;
  currentDailyProcurementQtl?: number;
  maxDailyTokens?: number;
  currentDailyTokens?: number;
}

export interface Mandi {
  id: string;
  name: string;
  district: string;
  state: string;
  location?: string;
  address?: string;
  operatingHours?: OperatingHours | string;
  capacity?: MandiCapacity | number;
  capacityPerDay?: number;
  supportedCrops?: string[];
  contactNumber?: string;
  status?: string;
  isActive?: boolean;
  averageServiceTime?: number;
  currentDelay?: number;
  createdAt?: string;
  updatedAt?: string;
}
