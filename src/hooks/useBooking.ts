import { useBookingStore } from '../features/booking/booking.store';

export const useBooking = () => {
  const { bookings, isLoading, createBooking } = useBookingStore();
  
  return {
    bookings,
    isLoading,
    createBooking
  };
};
