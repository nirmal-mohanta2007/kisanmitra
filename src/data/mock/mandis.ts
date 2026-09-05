import type { Mandi } from '../../types';

export const mockMandis: Mandi[] = [
  {
    id: 'mandi_001',
    name: 'Krishi Upaj Mandi, Bhopal',
    location: 'Karond Bypass Road, APMC Yard, Bhopal',
    district: 'Bhopal',
    state: 'Madhya Pradesh',
    capacityPerDay: 80,
    supportedCrops: ['Wheat', 'Paddy', 'Soybean', 'Maize', 'Jowar'],
    contactNumber: '+91 7551234567',
    status: 'ACTIVE',
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-01-01T00:00:00Z',
  },
  {
    id: 'mandi_002',
    name: 'Indore Kisan Seva Kendra',
    location: 'Mhow Road, Indore',
    district: 'Indore',
    state: 'Madhya Pradesh',
    capacityPerDay: 60,
    supportedCrops: ['Wheat', 'Soybean', 'Jowar'],
    contactNumber: '+91 7311234567',
    status: 'ACTIVE',
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-01-01T00:00:00Z',
  },
  {
    id: 'mandi_003',
    name: 'Jabalpur Rajya Kray Kendra',
    location: 'Wright Town, Jabalpur',
    district: 'Jabalpur',
    state: 'Madhya Pradesh',
    capacityPerDay: 50,
    supportedCrops: ['Paddy', 'Wheat', 'Maize'],
    contactNumber: '+91 7611234567',
    status: 'ACTIVE',
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-01-01T00:00:00Z',
  }
];
