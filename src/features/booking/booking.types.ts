export interface Booking {
  id: string;
  farmerId: string;
  mandiId: string;
  date: string;
  slot: string;
  cropType: string;
  estimatedQuantity: number;
  token: string;
  status: 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED';
}
