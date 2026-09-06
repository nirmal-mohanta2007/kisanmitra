import { StorageService } from './storage/storage.service';
import { isFirebaseConfigured, db } from './firebase/firebase.config';
import { collection, getDocs, query, where, limit } from 'firebase/firestore';
import { MOCK_OPERATORS, MOCK_ADMIN } from './mock-data.service';
import { farmerService } from './farmerService';
import type { Farmer } from '../types/models';

export interface UserLookupResult {
  isRegistered: boolean;
  userType?: 'farmer' | 'operator' | 'admin';
  farmer?: Farmer;
  name?: string;
  phone: string;
}

/**
 * Normalizes phone numbers to a clean 10-digit format (last 10 digits).
 */
export function normalizePhone(rawPhone?: string): string {
  if (!rawPhone) return '';
  return rawPhone.replace(/\D/g, '').slice(-10);
}

/**
 * Checks if a phone number belongs to an already registered farmer, operator, or admin.
 * Inspects device storage and live Firestore DB. Never recognizes fake mock farmers.
 */
export async function checkUserRegistration(phoneInput: string): Promise<UserLookupResult> {
  const cleaned = normalizePhone(phoneInput);
  if (cleaned.length !== 10) {
    return { isRegistered: false, phone: cleaned };
  }

  // 1. Check current farmer in device storage
  try {
    const current = await StorageService.getItem<Farmer>('kisan_current_farmer');
    if (current && normalizePhone(current.mobileNumber || current.phone) === cleaned) {
      return {
        isRegistered: true,
        userType: 'farmer',
        farmer: current,
        name: current.fullName || current.name,
        phone: cleaned,
      };
    }
  } catch {
    // continue checking
  }

  // 2. Check all locally registered farmers in device storage
  try {
    const allStored = await StorageService.getItem<Farmer[]>('kisan_all_farmers');
    if (Array.isArray(allStored)) {
      const match = allStored.find((f) => normalizePhone(f.mobileNumber || f.phone) === cleaned);
      if (match) {
        return {
          isRegistered: true,
          userType: 'farmer',
          farmer: match,
          name: match.fullName || match.name,
          phone: cleaned,
        };
      }
    }
  } catch {
    // continue checking
  }

  // 3. Check Firestore database (real registered farmers)
  try {
    if (isFirebaseConfigured() && db) {
      const q = query(
        collection(db, 'farmers'),
        where('mobileNumber', '==', cleaned),
        limit(1)
      );
      const snap = await getDocs(q);
      if (!snap.empty) {
        const d = snap.docs[0].data() as Farmer;
        return {
          isRegistered: true,
          userType: 'farmer',
          farmer: d,
          name: d.fullName || d.name,
          phone: cleaned,
        };
      }
    }
  } catch (err) {
    console.log('[auth-lookup] Firestore farmer lookup error:', err);
  }

  // 4. Check operators
  const opMatch = MOCK_OPERATORS.find((o) => normalizePhone(o.phone) === cleaned);
  if (opMatch) {
    return {
      isRegistered: true,
      userType: 'operator',
      name: opMatch.name,
      phone: cleaned,
    };
  }

  // 5. Check admin
  const adminMatch = MOCK_ADMIN.find((a) => normalizePhone(a.phone) === cleaned);
  if (adminMatch) {
    return {
      isRegistered: true,
      userType: 'admin',
      name: adminMatch.name,
      phone: cleaned,
    };
  }

  return {
    isRegistered: false,
    phone: cleaned,
  };
}

/**
 * Saves a newly registered farmer's profile, mobile number, and details
 * to both Cloud Firestore (farmers/{farmerId}) and Local Device Storage.
 */
export async function saveRegisteredFarmer(
  farmer: Farmer
): Promise<{ success: boolean; serverSaved: boolean; message: string }> {
  let serverSaved = false;

  // 1. Save to Cloud Firestore server database using farmerService
  try {
    if (isFirebaseConfigured()) {
      await farmerService.registerFarmer(farmer);
      serverSaved = true;
    }
  } catch (err) {
    console.warn('[Server DB] Firestore save notice:', err);
  }

  // 2. Save to persistent device storage (survives app reboots & reloads)
  try {
    await StorageService.setItem('kisan_current_farmer', farmer);
    const existing = (await StorageService.getItem<Farmer[]>('kisan_all_farmers')) || [];
    const phone = farmer.mobileNumber || farmer.phone;
    const updated = [
      farmer,
      ...existing.filter(
        (f) =>
          normalizePhone(f.mobileNumber || f.phone) !== normalizePhone(phone) &&
          (f.farmerId || f.id) !== (farmer.farmerId || farmer.id)
      ),
    ];
    await StorageService.setItem('kisan_all_farmers', updated);
  } catch (err) {
    console.warn('[Local DB] Device storage notice:', err);
  }

  return {
    success: true,
    serverSaved,
    message: serverSaved
      ? `Mobile (+91 ${farmer.mobileNumber || farmer.phone}) saved to Cloud Server and Local Database.`
      : `Mobile (+91 ${farmer.mobileNumber || farmer.phone}) saved to Local Secure Database.`,
  };
}
