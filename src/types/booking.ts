export type BookingStatus = 'CONFIRMED' | 'CANCELLED' | 'COMPLETED' | 'PENDING';

export interface BookingSlot {
  date: string;
  startTime?: string;
  endTime?: string;
  availableCapacityQtl?: number;
}

export interface Booking {
  id: string;
  farmerId: string;
  mandiId: string;
  cropId?: string;
  crop?: string;
  estimatedQuantityQtl?: number;
  estimatedQuantity?: number;
  date?: string;
  slot: BookingSlot | string;
  status: BookingStatus;
  tokenNumber?: number | null;
  createdAt: string;
  updatedAt?: string;
}
