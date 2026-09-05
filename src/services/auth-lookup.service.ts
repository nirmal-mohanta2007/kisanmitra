import { StorageService } from './storage/storage.service';
import { FirestoreService } from './firebase/firestore.service';
import { isFirebaseConfigured } from './firebase/firebase.config';
import { MOCK_FARMERS, MOCK_OPERATORS, MOCK_ADMIN } from './mock-data.service';
import { mockFarmers } from '../data/mock/farmers';
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
 * Inspects local storage (registered farmers), in-memory mock farmers, and live Firestore DB.
 */
export async function checkUserRegistration(phoneInput: string): Promise<UserLookupResult> {
  const cleaned = normalizePhone(phoneInput);
  if (cleaned.length !== 10) {
    return { isRegistered: false, phone: cleaned };
  }

  // 1. Check current farmer in device storage
  try {
    const current = await StorageService.getItem<Farmer>('kisan_current_farmer');
    if (current && normalizePhone(current.phone) === cleaned) {
      return {
        isRegistered: true,
        userType: 'farmer',
        farmer: current,
        name: current.name,
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
      const match = allStored.find((f) => normalizePhone(f.phone) === cleaned);
      if (match) {
        return {
          isRegistered: true,
          userType: 'farmer',
          farmer: match,
          name: match.name,
          phone: cleaned,
        };
      }
    }
  } catch {
    // continue checking
  }

  // 3. Check MOCK_FARMERS from mock-data.service.ts
  const mockMatch = MOCK_FARMERS.find((f) => normalizePhone(f.phone) === cleaned);
  if (mockMatch) {
    return {
      isRegistered: true,
      userType: 'farmer',
      farmer: mockMatch,
      name: mockMatch.name,
      phone: cleaned,
    };
  }

  // 4. Check mockFarmers from src/data/mock/farmers.ts
  const mockFarmersMatch = mockFarmers.find((f) => normalizePhone(f.phone) === cleaned);
  if (mockFarmersMatch) {
    return {
      isRegistered: true,
      userType: 'farmer',
      farmer: mockFarmersMatch as any,
      name: mockFarmersMatch.name,
      phone: cleaned,
    };
  }

  // 5. Check operators
  const opMatch = MOCK_OPERATORS.find((o) => normalizePhone(o.phone) === cleaned);
  if (opMatch) {
    return {
      isRegistered: true,
      userType: 'operator',
      name: opMatch.name,
      phone: cleaned,
    };
  }

  // 6. Check admin
  const adminMatch = MOCK_ADMIN.find((a) => normalizePhone(a.phone) === cleaned);
  if (adminMatch) {
    return {
      isRegistered: true,
      userType: 'admin',
      name: adminMatch.name,
      phone: cleaned,
    };
  }

  // 7. Check Firestore if configured
  try {
    const firestoreFarmers = await FirestoreService.getFarmers();
    if (Array.isArray(firestoreFarmers)) {
      const fMatch = firestoreFarmers.find((f) => normalizePhone(f.phone) === cleaned);
      if (fMatch) {
        return {
          isRegistered: true,
          userType: 'farmer',
          farmer: fMatch,
          name: fMatch.name,
          phone: cleaned,
        };
      }
    }
  } catch {
    // continue
  }

  return {
    isRegistered: false,
    phone: cleaned,
  };
}

/**
 * Saves a newly registered farmer's profile, mobile number, and Aadhaar number
 * to both the Server Database (Cloud Firestore) and Local Device Storage.
 */
export async function saveRegisteredFarmer(
  farmer: Farmer
): Promise<{ success: boolean; serverSaved: boolean; message: string }> {
  let serverSaved = false;

  // 1. Save to Cloud Firestore server database (if configured)
  try {
    if (isFirebaseConfigured()) {
      await FirestoreService.saveFarmer(farmer);
      serverSaved = true;
    }
  } catch (err) {
    console.warn('[Server DB] Firestore save notice:', err);
  }

  // 2. Save to persistent device storage (survives app reboots & reloads)
  try {
    await StorageService.setItem('kisan_current_farmer', farmer);
    const existing = (await StorageService.getItem<Farmer[]>('kisan_all_farmers')) || [];
    const updated = [
      farmer,
      ...existing.filter(
        (f) => normalizePhone(f.phone) !== normalizePhone(farmer.phone) && f.id !== farmer.id
      ),
    ];
    await StorageService.setItem('kisan_all_farmers', updated);
  } catch (err) {
    console.warn('[Local DB] Device storage notice:', err);
  }

  // 3. Keep in-memory mock farmers updated for instantaneous access
  const cleanPhone = normalizePhone(farmer.phone);
  const existsInMock = MOCK_FARMERS.some((f) => normalizePhone(f.phone) === cleanPhone);
  if (!existsInMock) {
    MOCK_FARMERS.unshift(farmer);
  }

  return {
    success: true,
    serverSaved,
    message: serverSaved
      ? `Mobile (+91 ${farmer.phone}) and Aadhaar (${farmer.aadhaar || 'N/A'}) saved to Cloud Server and Local Database.`
      : `Mobile (+91 ${farmer.phone}) and Aadhaar (${farmer.aadhaar || 'N/A'}) saved to Local Secure Database.`,
  };
}

