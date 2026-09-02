import { isFirebaseConfigured, firebaseConfig } from '../../src/services/firebase/firebase.config';
import { FirestoreService } from '../../src/services/firebase/firestore.service';
import { FirebaseAuthService } from '../../src/services/firebase/auth.firebase';
import { MOCK_CENTRES, MOCK_FARMERS } from '../../src/services/mock-data.service';

describe('Firebase Configuration and Fallback Behavior', () => {
  it('should detect unconfigured or default firebase environment without throwing', () => {
    const isConfigured = isFirebaseConfigured();
    expect(typeof isConfigured).toBe('boolean');
  });

  it('should gracefully fallback to mock centres when Firebase is not connected', async () => {
    const centres = await FirestoreService.getCentres();
    expect(centres).toBeDefined();
    expect(centres.length).toBeGreaterThan(0);
    expect(centres[0].id).toBe(MOCK_CENTRES[0].id);
  });

  it('should gracefully fallback to mock farmers when Firebase is not connected', async () => {
    const farmers = await FirestoreService.getFarmers();
    expect(farmers).toBeDefined();
    expect(farmers.length).toBeGreaterThan(0);
    expect(farmers[0].id).toBe(MOCK_FARMERS[0].id);
  });

  it('should gracefully fallback to mock transactions when Firebase is not connected', async () => {
    const transactions = await FirestoreService.getTransactions();
    expect(transactions).toBeDefined();
    expect(transactions.length).toBeGreaterThan(0);
  });

  it('should return null or safe guest profile for Auth when not configured', async () => {
    const user = FirebaseAuthService.getCurrentUser();
    expect(user).toBeNull();
  });
});
