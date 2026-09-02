export interface Mandi {
  id: string;
  name: string;
  location: string;
  capacity: number;
  currentLoad: number;
  delays: number; // in minutes
  status: 'OPEN' | 'CLOSED' | 'CONGESTED';
}
