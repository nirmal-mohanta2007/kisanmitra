import type { Farmer } from '../../types';

export const mockFarmers: Farmer[] = [
  {
    id: 'farmer_001',
    userId: 'usr_001',
    name: 'Ramesh Nayak',
    phone: '+91 9876543210',
    village: 'Sehore',
    district: 'Sehore',
    state: 'Madhya Pradesh',
    landAreaHectares: 5.5,
    registrationNumber: 'MP-SEH-1001',
    bankDetails: {
      accountNumber: 'XXXX-XXXX-1234',
      ifscCode: 'SBIN0001234',
      bankName: 'State Bank of India'
    },
    status: 'VERIFIED',
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z',
  },
  {
    id: 'farmer_002',
    userId: 'usr_004',
    name: 'Sunita Devi',
    phone: '+91 9876543211',
    village: 'Harda',
    district: 'Harda',
    state: 'Madhya Pradesh',
    landAreaHectares: 3.2,
    registrationNumber: 'MP-HAR-1002',
    bankDetails: {
      accountNumber: 'XXXX-XXXX-5678',
      ifscCode: 'HDFC0005678',
      bankName: 'HDFC Bank'
    },
    status: 'VERIFIED',
    createdAt: '2026-01-04T00:00:00Z',
    updatedAt: '2026-01-04T00:00:00Z',
  },
  {
    id: 'farmer_003',
    userId: 'usr_005',
    name: 'Mohan Patel',
    phone: '+91 9876543212',
    village: 'Dewas',
    district: 'Dewas',
    state: 'Madhya Pradesh',
    landAreaHectares: 8.0,
    registrationNumber: 'MP-DEW-1003',
    bankDetails: {
      accountNumber: 'XXXX-XXXX-9012',
      ifscCode: 'PUNB0009012',
      bankName: 'Punjab National Bank'
    },
    status: 'VERIFIED',
    createdAt: '2026-01-05T00:00:00Z',
    updatedAt: '2026-01-05T00:00:00Z',
  },
  {
    id: 'farmer_004',
    userId: 'usr_006',
    name: 'Lakshmi Bai',
    phone: '+91 9876543213',
    village: 'Chhindwara',
    district: 'Chhindwara',
    state: 'Madhya Pradesh',
    landAreaHectares: 2.1,
    registrationNumber: 'MP-CHH-1004',
    bankDetails: {
      accountNumber: 'XXXX-XXXX-3456',
      ifscCode: 'BKID0003456',
      bankName: 'Bank of India'
    },
    status: 'VERIFIED',
    createdAt: '2026-01-06T00:00:00Z',
    updatedAt: '2026-01-06T00:00:00Z',
  },
  {
    id: 'farmer_005',
    userId: 'usr_007',
    name: 'Bhagwan Das',
    phone: '+91 9876543214',
    village: 'Mandla',
    district: 'Mandla',
    state: 'Madhya Pradesh',
    landAreaHectares: 4.7,
    registrationNumber: 'MP-MAN-1005',
    bankDetails: {
      accountNumber: 'XXXX-XXXX-7890',
      ifscCode: 'CNRB0007890',
      bankName: 'Canara Bank'
    },
    status: 'VERIFIED',
    createdAt: '2026-01-07T00:00:00Z',
    updatedAt: '2026-01-07T00:00:00Z',
  }
];
