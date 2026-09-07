import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  query,
  where,
  limit,
  orderBy,
  onSnapshot,
  runTransaction,
  serverTimestamp,
  Unsubscribe,
} from 'firebase/firestore';
import { db, isFirebaseConfigured } from './firebase/firebase.config';
import { Booking } from '../types/models';

const BOOKINGS_COLLECTION = 'bookings';
const COUNTERS_COLLECTION = 'counters';

function sanitize<T>(obj: T): any {
  if (obj === undefined || obj === null) return null;
  if (Array.isArray(obj)) return obj.map(sanitize);
  if (typeof obj === 'object' && !(obj instanceof Date)) {
    const res: Record<string, any> = {};
    for (const [k, v] of Object.entries(obj)) {
      res[k] = v === undefined ? null : sanitize(v);
    }
    return res;
  }
  return obj;
}

export const bookingService = {
  /**
   * Generates a sequential Booking ID (BOOK-YYYY-XXXXXX).
   */
  async generateBookingId(): Promise<string> {
    const currentYear = new Date().getFullYear();

    if (isFirebaseConfigured() && db) {
      try {
        const counterRef = doc(db, COUNTERS_COLLECTION, `bookings_${currentYear}`);
        const newSeq = await runTransaction(db, async (transaction) => {
          const counterDoc = await transaction.get(counterRef);
          let currentVal = 0;
          if (counterDoc.exists()) {
            currentVal = counterDoc.data()?.lastNumber || 0;
          }
          const nextVal = currentVal + 1;
          transaction.set(
            counterRef,
            { lastNumber: nextVal, updatedAt: serverTimestamp() },
            { merge: true }
          );
          return nextVal;
        });

        const padded = String(newSeq).padStart(6, '0');
        return `BOOK-${currentYear}-${padded}`;
      } catch (err) {
        console.warn('[bookingService] Counter transaction failed, using fallback:', err);
      }
    }

    const entropy = String(Math.floor(100000 + Math.random() * 900000));
    return `BOOK-${currentYear}-${entropy}`;
  },

  /**
   * Creates a new booking in Cloud Firestore (`bookings/{bookingId}`).
   */
  async createBooking(input: Partial<Booking>): Promise<Booking> {
    const bookingId = input.bookingId || (await this.generateBookingId());
    const now = new Date().toISOString();
    const tokenNumber = input.tokenNumber || Math.floor(10 + Math.random() * 90);

    const newBooking: Booking = {
      bookingId,
      farmerId: input.farmerId || '',
      mandiId: input.mandiId || '',
      crop: input.crop || '',
      scheduledDate: input.scheduledDate || now.split('T')[0],
      slot: input.slot || 'Morning (09:00 - 12:00)',
      tokenNumber,
      status: input.status || 'CONFIRMED',
      createdAt: now,
      updatedAt: now,
    };

    if (isFirebaseConfigured() && db) {
      try {
        const bookingRef = doc(db, BOOKINGS_COLLECTION, bookingId);
        await setDoc(bookingRef, sanitize({
          ...newBooking,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        }));
      } catch (err) {
        console.error('[bookingService] Error persisting booking to Firestore:', err);
        throw err;
      }
    }

    return newBooking;
  },

  /**
   * Retrieves a single booking by bookingId.
   */
  async getBookingById(bookingId: string): Promise<Booking | null> {
    if (!bookingId || !isFirebaseConfigured() || !db) return null;

    try {
      const snap = await getDoc(doc(db, BOOKINGS_COLLECTION, bookingId));
      if (snap.exists()) {
        return { bookingId: snap.id, ...snap.data() } as Booking;
      }
      return null;
    } catch (err) {
      console.error(`[bookingService] Error fetching booking ${bookingId}:`, err);
      return null;
    }
  },

  /**
   * Retrieves all bookings made by a specific registered farmer.
   */
  async getBookingsByFarmerId(farmerId: string): Promise<Booking[]> {
    if (!farmerId || !isFirebaseConfigured() || !db) return [];

    try {
      const q = query(
        collection(db, BOOKINGS_COLLECTION),
        where('farmerId', '==', farmerId),
        orderBy('createdAt', 'desc')
      );
      const snap = await getDocs(q);
      if (snap.empty) return [];
      return snap.docs.map((d) => ({ bookingId: d.id, ...d.data() } as Booking));
    } catch (err) {
      console.error(`[bookingService] Error fetching bookings for farmer ${farmerId}:`, err);
      return [];
    }
  },

  /**
   * Retrieves all bookings for a given Mandi and scheduled date.
   */
  async getBookingsByMandiAndDate(mandiId: string, scheduledDate: string): Promise<Booking[]> {
    if (!mandiId || !isFirebaseConfigured() || !db) return [];

    try {
      const q = query(
        collection(db, BOOKINGS_COLLECTION),
        where('mandiId', '==', mandiId),
        where('scheduledDate', '==', scheduledDate)
      );
      const snap = await getDocs(q);
      if (snap.empty) return [];
      return snap.docs.map((d) => ({ bookingId: d.id, ...d.data() } as Booking));
    } catch (err) {
      console.error('[bookingService] Error fetching mandi bookings:', err);
      return [];
    }
  },

  /**
   * Updates booking status.
   */
  async updateBookingStatus(bookingId: string, status: Booking['status']): Promise<void> {
    if (!bookingId || !isFirebaseConfigured() || !db) return;

    try {
      const ref = doc(db, BOOKINGS_COLLECTION, bookingId);
      await updateDoc(ref, {
        status,
        updatedAt: serverTimestamp(),
      });
    } catch (err) {
      console.error(`[bookingService] Error updating booking ${bookingId}:`, err);
      throw err;
    }
  },

  /**
   * Real-time subscription to bookings for a Mandi.
   */
  subscribeMandiBookings(mandiId: string, callback: (bookings: Booking[]) => void): Unsubscribe {
    if (!mandiId || !isFirebaseConfigured() || !db) {
      callback([]);
      return () => {};
    }

    try {
      const q = query(
        collection(db, BOOKINGS_COLLECTION),
        where('mandiId', '==', mandiId),
        limit(100)
      );
      return onSnapshot(
        q,
        (snap) => {
          if (snap.empty) {
            callback([]);
            return;
          }
          const list = snap.docs.map((d) => ({ bookingId: d.id, ...d.data() } as Booking));
          callback(list);
        },
        (err) => {
          console.error('[bookingService] subscribeMandiBookings error:', err);
          callback([]);
        }
      );
    } catch (err) {
      console.error('[bookingService] subscribeMandiBookings setup error:', err);
      callback([]);
      return () => {};
    }
  },
};
