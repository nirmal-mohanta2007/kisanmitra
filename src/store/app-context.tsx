import React, { createContext, useContext, useReducer, useEffect, type ReactNode } from 'react';
import { UserRole, TransactionStatus } from '../types/enums';
import type { Centre, Farmer, ProcurementTransaction, CentreStats } from '../types/models';
import { MOCK_CENTRES, MOCK_FARMERS, generateMockTransactions } from '../services/mock-data.service';
import { isFirebaseConfigured } from '../services/firebase/firebase.config';
import { FirestoreService } from '../services/firebase/firestore.service';

interface AppState {
  currentRole: UserRole;
  currentUserId: string;
  centres: Centre[];
  farmers: Farmer[];
  transactions: ProcurementTransaction[];
  isDemoMode: boolean;
  isFirebaseConnected: boolean;
  isSyncing: boolean;
}

type AppAction =
  | { type: 'SET_ROLE'; payload: { role: UserRole; userId: string } }
  | { type: 'LOAD_MOCK_DATA' }
  | { type: 'SET_CENTRES'; payload: Centre[] }
  | { type: 'SET_TRANSACTIONS'; payload: ProcurementTransaction[] }
  | { type: 'SET_FARMERS'; payload: Farmer[] }
  | { type: 'ADD_TRANSACTION'; payload: ProcurementTransaction }
  | { type: 'UPDATE_TRANSACTION'; payload: ProcurementTransaction }
  | { type: 'UPDATE_CENTRE'; payload: Centre }
  | { type: 'SET_FIREBASE_CONNECTED'; payload: boolean }
  | { type: 'SET_SYNCING'; payload: boolean };

const initialState: AppState = {
  currentRole: UserRole.FARMER,
  currentUserId: 'F-001',
  centres: [],
  farmers: [],
  transactions: [],
  isDemoMode: !isFirebaseConfigured(),
  isFirebaseConnected: isFirebaseConfigured(),
  isSyncing: false,
};

interface AppContextValue {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
  createTransaction: (tx: Partial<ProcurementTransaction>) => Promise<ProcurementTransaction>;
  updateTransaction: (tx: ProcurementTransaction) => Promise<void>;
  updateTransactionStatus: (id: string, status: TransactionStatus, notes?: string) => Promise<void>;
  seedFirebaseDatabase: (force?: boolean) => Promise<{ success: boolean; message: string }>;
}

const AppContext = createContext<AppContextValue | undefined>(undefined);

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_ROLE':
      return {
        ...state,
        currentRole: action.payload.role,
        currentUserId: action.payload.userId,
      };
    case 'LOAD_MOCK_DATA':
      return {
        ...state,
        centres: MOCK_CENTRES,
        farmers: MOCK_FARMERS,
        transactions: generateMockTransactions(),
        isDemoMode: true,
      };
    case 'SET_CENTRES':
      return {
        ...state,
        centres: action.payload,
      };
    case 'SET_TRANSACTIONS':
      return {
        ...state,
        transactions: action.payload,
      };
    case 'SET_FARMERS':
      return {
        ...state,
        farmers: action.payload,
      };
    case 'ADD_TRANSACTION':
      return {
        ...state,
        transactions: [
          ...state.transactions.filter((t) => t.id !== action.payload.id),
          action.payload,
        ],
      };
    case 'UPDATE_TRANSACTION':
      return {
        ...state,
        transactions: state.transactions.map((t) =>
          t.id === action.payload.id ? action.payload : t
        ),
      };
    case 'UPDATE_CENTRE':
      return {
        ...state,
        centres: state.centres.map((c) =>
          c.id === action.payload.id ? action.payload : c
        ),
      };
    case 'SET_FIREBASE_CONNECTED':
      return {
        ...state,
        isFirebaseConnected: action.payload,
        isDemoMode: !action.payload,
      };
    case 'SET_SYNCING':
      return {
        ...state,
        isSyncing: action.payload,
      };
    default:
      return state;
  }
}

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  useEffect(() => {
    const configured = isFirebaseConfigured();
    dispatch({ type: 'SET_FIREBASE_CONNECTED', payload: configured });

    if (!configured) {
      // Fallback to local mock data
      dispatch({ type: 'LOAD_MOCK_DATA' });
      return;
    }

    // Subscribe to Firestore live collections
    dispatch({ type: 'SET_SYNCING', payload: true });

    const unsubscribeCentres = FirestoreService.subscribeCentres((centres) => {
      dispatch({ type: 'SET_CENTRES', payload: centres });
    });

    const unsubscribeTransactions = FirestoreService.subscribeTransactions((transactions) => {
      dispatch({ type: 'SET_TRANSACTIONS', payload: transactions });
      dispatch({ type: 'SET_SYNCING', payload: false });
    });

    // Also fetch initial farmers
    FirestoreService.getFarmers().then((farmers) => {
      dispatch({ type: 'SET_FARMERS', payload: farmers });
    });

    return () => {
      unsubscribeCentres();
      unsubscribeTransactions();
    };
  }, []);

  const createTransaction = async (tx: Partial<ProcurementTransaction>): Promise<ProcurementTransaction> => {
    if (state.isFirebaseConnected) {
      const created = await FirestoreService.createTransaction(tx);
      dispatch({ type: 'ADD_TRANSACTION', payload: created });
      return created;
    } else {
      const now = new Date().toISOString();
      const localTx: ProcurementTransaction = {
        id: `KM-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`,
        farmerId: state.currentUserId || 'F-001',
        farmerName: 'Kisan Kumar',
        farmerPhone: '9876543210',
        centreId: tx.centreId || 'C-001',
        centreName: tx.centreName || 'Demo Krishi Upaj Mandi, Bhopal',
        crop: tx.crop || ('' as any),
        expectedQuantity: tx.expectedQuantity || 10,
        bookingDate: tx.bookingDate || now.split('T')[0],
        slotLabel: tx.slotLabel || 'Morning',
        tokenNumber: Math.floor(10 + Math.random() * 90),
        status: TransactionStatus.BOOKED,
        statusHistory: [{ status: TransactionStatus.BOOKED, timestamp: now, updatedBy: 'USER' }],
        queuePosition: 1,
        estimatedWaitMinutes: 15,
        recommendedArrivalTime: now,
        weighing: null,
        qualityCheck: null,
        procurementAmount: null,
        payment: null,
        exceptions: [],
        createdAt: now,
        updatedAt: now,
        ...tx,
      } as ProcurementTransaction;
      dispatch({ type: 'ADD_TRANSACTION', payload: localTx });
      return localTx;
    }
  };

  const updateTransaction = async (tx: ProcurementTransaction): Promise<void> => {
    dispatch({ type: 'UPDATE_TRANSACTION', payload: tx });
    if (state.isFirebaseConnected) {
      await FirestoreService.updateTransaction(tx.id, tx);
    }
  };

  const updateTransactionStatus = async (id: string, status: TransactionStatus, notes?: string): Promise<void> => {
    const existing = state.transactions.find((t) => t.id === id);
    if (existing) {
      const updated: ProcurementTransaction = {
        ...existing,
        status,
        statusHistory: [
          ...(existing.statusHistory || []),
          { status, timestamp: new Date().toISOString(), updatedBy: state.currentUserId || 'USER', notes },
        ],
        updatedAt: new Date().toISOString(),
      };
      dispatch({ type: 'UPDATE_TRANSACTION', payload: updated });
    }

    if (state.isFirebaseConnected) {
      await FirestoreService.updateTransactionStatus(id, status, state.currentUserId || 'USER', notes);
    }
  };

  const seedFirebaseDatabase = async (force = false) => {
    return await FirestoreService.seedFirestoreData(force);
  };

  return (
    <AppContext.Provider
      value={{
        state,
        dispatch,
        createTransaction,
        updateTransaction,
        updateTransactionStatus,
        seedFirebaseDatabase,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export function useAppContext() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
}

export function useCurrentRole() {
  const { state } = useAppContext();
  return state.currentRole;
}

export function useTransactions() {
  const { state } = useAppContext();
  return state.transactions;
}

export function useTransaction(id: string) {
  const { state } = useAppContext();
  return state.transactions.find((t) => t.id === id);
}

export function useCentres() {
  const { state } = useAppContext();
  return state.centres;
}

export function useCentre(id: string) {
  const { state } = useAppContext();
  return state.centres.find((c) => c.id === id);
}

export function useFarmerTransactions(farmerId: string) {
  const { state } = useAppContext();
  return state.transactions.filter((t) => t.farmerId === farmerId);
}

export function useCentreTransactions(centreId: string) {
  const { state } = useAppContext();
  return state.transactions.filter((t) => t.centreId === centreId);
}

export function useQueueForCentre(centreId: string) {
  const { state } = useAppContext();
  const queueStatuses = [
    TransactionStatus.BOOKED,
    TransactionStatus.CHECKED_IN,
    TransactionStatus.WAITING,
    TransactionStatus.WEIGHING,
    TransactionStatus.QUALITY_CHECK,
  ];
  return state.transactions
    .filter((t) => t.centreId === centreId && queueStatuses.includes(t.status))
    .sort((a, b) => (a.tokenNumber || 0) - (b.tokenNumber || 0));
}

export function useCentreStats(centreId: string): CentreStats | null {
  const { state } = useAppContext();
  const centre = state.centres.find((c) => c.id === centreId);
  if (!centre) return null;

  const centreTransactions = state.transactions.filter((t) => t.centreId === centreId);

  const today = new Date().toISOString().split('T')[0];
  const totalBookingsToday = centreTransactions.filter((t) => {
    const dateStr = typeof t.createdAt === 'string' ? t.createdAt : new Date(t.createdAt).toISOString();
    return dateStr.split('T')[0] === today;
  }).length;

  const queueStatuses = [
    TransactionStatus.BOOKED,
    TransactionStatus.CHECKED_IN,
    TransactionStatus.WAITING,
    TransactionStatus.WEIGHING,
    TransactionStatus.QUALITY_CHECK,
  ];
  const activeQueue = centreTransactions.filter((t) => queueStatuses.includes(t.status)).length;
  const averageWaitMinutes = (centre.averageServiceTime || 8) * activeQueue;

  const completedStatuses = [
    TransactionStatus.PROCUREMENT_COMPLETED,
    TransactionStatus.RECEIPT_GENERATED,
    TransactionStatus.PAYMENT_INITIATED,
    TransactionStatus.PAYMENT_PROCESSING,
    TransactionStatus.PAYMENT_COMPLETED,
  ];
  const procurementCompleted = centreTransactions.filter((t) => completedStatuses.includes(t.status)).length;

  const terminalStatuses = [
    ...completedStatuses,
    TransactionStatus.CANCELLED,
    TransactionStatus.MISSED,
  ];
  const procurementPending = centreTransactions.filter((t) => !terminalStatuses.includes(t.status)).length;

  const paymentPendingStatuses = [
    TransactionStatus.PAYMENT_INITIATED,
    TransactionStatus.PAYMENT_PROCESSING,
  ];
  const paymentPending = centreTransactions.filter((t) => paymentPendingStatuses.includes(t.status)).length;

  const paymentCompleted = centreTransactions.filter(
    (t) => t.status === TransactionStatus.PAYMENT_COMPLETED
  ).length;

  const delayedCases = (centre.currentDelay || 0) > 0 ? activeQueue : 0;
  
  const exceptions = centreTransactions.filter((t) => t.exceptions && t.exceptions.some(e => e.status === 'OPEN')).length;

  return {
    centreId,
    totalBookingsToday,
    activeQueue,
    averageWaitMinutes,
    procurementCompleted,
    procurementPending,
    paymentPending,
    paymentCompleted,
    delayedCases,
    exceptions,
    lastUpdated: new Date().toISOString(),
  };
}
