import type { User } from '../../types';

export const mockUsers: User[] = [
  {
    id: 'usr_001',
    name: 'Ramesh Nayak',
    phone: '+91 9876543210',
    role: 'FARMER',
    status: 'ACTIVE',
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z',
  },
  {
    id: 'usr_002',
    name: 'Anil Kumar',
    phone: '+91 9876543211',
    role: 'OPERATOR',
    status: 'ACTIVE',
    mandiId: 'mandi_001',
    createdAt: '2026-01-02T00:00:00Z',
    updatedAt: '2026-01-02T00:00:00Z',
  },
  {
    id: 'usr_003',
    name: 'Collector Shukla',
    phone: '+91 9876543212',
    role: 'ADMIN',
    status: 'ACTIVE',
    createdAt: '2026-01-03T00:00:00Z',
    updatedAt: '2026-01-03T00:00:00Z',
  }
];
