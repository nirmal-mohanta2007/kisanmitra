import { create } from 'zustand';
import { Booking } from './booking.types';
import { BookingService } from './booking.service';

interface BookingStore {
  bookings: Booking[];
  isLoading: boolean;
  createBooking: (data: Partial<Booking>) => Promise<void>;
}

export const useBookingStore = create<BookingStore>((set, get) => ({
  bookings: [],
  isLoading: false,
  createBooking: async (data) => {
    set({ isLoading: true });
    try {
      const booking = await BookingService.createBooking(data);
      set({ bookings: [...get().bookings, booking], isLoading: false });
    } catch (e) {
      set({ isLoading: false });
      throw e;
    }
  }
}));
