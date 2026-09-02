import type { Booking } from '../../types';
import { mockFarmers } from './farmers';
import { mockMandis } from './mandis';

export const mockBookings: Booking[] = [
  {
    id: 'book_001',
    farmerId: mockFarmers[0].id,
    mandiId: mockMandis[0].id,
    crop: 'Paddy',
    estimatedQuantity: 20, // Quintals
    date: '2026-09-02',
    slot: 'Morning (8:00 - 12:00)',
    status: 'CONFIRMED',
    tokenNumber: 42,
    createdAt: '2026-08-25T10:00:00Z',
    updatedAt: '2026-08-25T10:00:00Z',
  },
  {
    id: 'book_002',
    farmerId: mockFarmers[1].id,
    mandiId: mockMandis[1].id,
    crop: 'Soybean',
    estimatedQuantity: 15,
    date: '2026-09-02',
    slot: 'Afternoon (12:00 - 16:00)',
    status: 'CONFIRMED',
    tokenNumber: 15,
    createdAt: '2026-08-26T11:30:00Z',
    updatedAt: '2026-08-26T11:30:00Z',
  },
  {
    id: 'book_003',
    farmerId: mockFarmers[2].id,
    mandiId: mockMandis[2].id,
    crop: 'Wheat',
    estimatedQuantity: 50,
    date: '2026-09-03',
    slot: 'Morning (8:00 - 12:00)',
    status: 'PENDING',
    tokenNumber: null,
    createdAt: '2026-09-01T09:15:00Z',
    updatedAt: '2026-09-01T09:15:00Z',
  }
];
