# Firebase Setup Guide for Kisan Mitra

This guide provides step-by-step instructions to connect your **Firebase** backend to the **Kisan Mitra** Expo / React Native application.

---

## 1. Create a Firebase Project

1. Open the [Firebase Console](https://console.firebase.google.com/).
2. Click **Add project** (or **Create a project**).
3. Enter a project name (e.g., `kisan-mitra-app`) and click **Continue**.
4. (Optional) Enable Google Analytics if desired, then click **Create project**.

---

## 2. Register a Web App in Firebase Console

1. In the Project Overview page, click the **Web icon (`</>`)** to add a web application.
2. Enter an App nickname (e.g., `Kisan Mitra Mobile/Web`).
3. Click **Register app**.
4. Firebase will display your `firebaseConfig` object containing:
   - `apiKey`
   - `authDomain`
   - `projectId`
   - `storageBucket`
   - `messagingSenderId`
   - `appId`
   - `measurementId`

---

## 3. Add Keys to Your `.env` File

In your `kisan-mitra-app` root directory, open or create `.env` and paste your credentials:

```env
EXPO_PUBLIC_API_URL=http://localhost:3000/api/v1
EXPO_PUBLIC_DEMO_MODE=false

EXPO_PUBLIC_FIREBASE_API_KEY=AIzaSy...
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=kisan-mitra-xxx.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=kisan-mitra-xxx
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=kisan-mitra-xxx.appspot.com
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789012
EXPO_PUBLIC_FIREBASE_APP_ID=1:123456789012:web:abcdef123456
EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX
```

> **Note:** Whenever you update `.env`, restart the Expo development server with `npm start -- -c` to clear the cache.

---

## 4. Enable Authentication Providers

1. In Firebase Console, go to **Build** -> **Authentication** in the left sidebar.
2. Click **Get Started**.
3. Under the **Sign-in method** tab:
   - **Anonymous**: Enable this for quick guest/demo access.
   - **Phone**: Enable Phone authentication for SMS OTP farmer verification.
     - *(Tip: In testing, add test phone numbers like `+91 9876543210` with test OTP `123456` in the Phone auth settings).*
   - **Email/Password**: (Optional) Enable for operator and administrator accounts.

---

## 5. Enable Cloud Firestore Database

1. In Firebase Console, go to **Build** -> **Firestore Database**.
2. Click **Create database**.
3. Choose a database location close to your users (e.g., `asia-south1` for India).
4. Select **Start in production mode** or **Start in test mode**.
5. Click **Create**.

---

## 6. Deploy Security Rules & Indexes

### Option A: Using Firebase CLI
If you have `firebase-tools` installed:
```bash
firebase login
firebase use --add <your-project-id>
firebase deploy --only firestore
```

### Option B: Using Firebase Console
- Copy the contents of [`firestore.rules`](../firestore.rules) into **Firestore Database** -> **Rules** tab and click **Publish**.
- Copy the index configuration from [`firestore.indexes.json`](../firestore.indexes.json) into **Firestore Database** -> **Indexes** tab if needed.

---

## 7. Seed Initial Data (Mandis, Farmers, Queues)

Once your `.env` is configured and you launch the app, you can seed the database in two ways:

1. **From the UI**: Look for the `FirebaseStatusBadge` on the dashboard or admin screen and tap **Seed Firestore Data**.
2. **Programmatically**: Use `seedFirebaseDatabase(true)` from `useAppContext()` or `FirestoreService.seedFirestoreData(true)`.

This creates:
- `centres`: Default Mandis (Bhopal, Indore, Jabalpur) with operating hours and wait time capacities.
- `farmers`: Registered farmer profiles.
- `transactions`: Sample procurement bookings across different stages (`BOOKED`, `CHECKED_IN`, `WEIGHING`, `QUALITY_CHECK`, `PAYMENT_COMPLETED`).

---

## 8. Firestore Collections Structure

| Collection | Description | Key Fields |
|---|---|---|
| `users` | User accounts and roles | `uid`, `phone`, `role`, `name`, `createdAt` |
| `centres` | Mandi procurement centres | `id`, `name`, `address`, `capacity`, `averageServiceTime`, `currentDelay`, `supportedCrops` |
| `farmers` | Farmer details & bank KYC | `id`, `name`, `phone`, `village`, `district`, `bankDetails` |
| `transactions` | Live procurement & queue | `id`, `farmerId`, `centreId`, `status`, `tokenNumber`, `queuePosition`, `expectedQuantity`, `statusHistory`, `weighing`, `qualityCheck`, `payment` |

---

## 9. Offline / Demo Mode Graceful Fallback

The app is designed so that if Firebase credentials are omitted or internet is unavailable, it automatically switches to local mock data mode seamlessly. You can verify connection status via `isFirebaseConfigured()` or the `state.isFirebaseConnected` flag in `AppContext`.
