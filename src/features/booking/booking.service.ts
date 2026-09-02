import { apiClient } from '../../services/api/client';
import { ENDPOINTS } from '../../services/api/endpoints';
import { Booking } from './booking.types';
import { BookingValidation } from './booking.validation';

export const BookingService = {
  async createBooking(data: Partial<Booking>): Promise<Booking> {
    if (!data.mandiId || !data.estimatedQuantity) {
      throw new Error('Mandi ID and estimated quantity are required');
    }
    
    const isValid = await BookingValidation.validateSlotCapacity(data.mandiId, data.estimatedQuantity);
    if (!isValid) {
      throw new Error('Mandi capacity exceeded for this slot');
    }

    await apiClient.post(ENDPOINTS.BOOKING_CREATE, data);
    
    return {
      id: `bk_${Date.now()}`,
      farmerId: data.farmerId || 'unknown',
      mandiId: data.mandiId,
      date: data.date || new Date().toISOString(),
      slot: data.slot || 'MORNING',
      cropType: data.cropType || 'WHEAT',
      estimatedQuantity: data.estimatedQuantity,
      token: `TKN-${Math.floor(Math.random() * 10000)}`,
      status: 'CONFIRMED'
    };
  }
};
