import React, { createContext, useContext, useState, useEffect } from 'react';
import { Trip, Traveler, Settlement } from '../types/trip';
import { Expense } from '../types/expense';
import { storageService } from '../services/storageService';
import { computeSettlements, SettlementEngineResult } from '../services/settlementEngine';
import { toast } from 'sonner';

interface TripContextType {
  trips: Trip[];
  activeTrip: Trip | null;
  activeTripId: string | null;
  setActiveTripId: (id: string) => void;
  createTrip: (trip: Omit<Trip, 'id' | 'createdAt'>) => string;
  updateTrip: (id: string, trip: Partial<Trip>) => void;
  deleteTrip: (id: string) => void;

  expenses: Expense[];
  activeTripExpenses: Expense[];
  addExpense: (expense: Omit<Expense, 'id'>) => void;
  updateExpense: (id: string, expense: Partial<Expense>) => void;
  deleteExpense: (id: string) => void;

  settlements: Settlement[];
  toggleSettlementStatus: (settlementId: string) => void;
  settlementResult: SettlementEngineResult;
}

// Initial realistic demo trip with expenses so the user can test all charts & splits right away
const INITIAL_DEMO_TRAVELERS: Traveler[] = [
  { id: 't1', name: 'Rohan Mehta', phone: '+919820012345', email: 'rohan@contrey.travel', upiId: 'rohan@okaxis' },
  { id: 't2', name: 'Aisha Khan', phone: '+919876543210', email: 'aisha@contrey.travel', upiId: 'aisha@okhdfc' },
  { id: 't3', name: 'Kabir Verma', phone: '+919123456789', email: 'kabir@contrey.travel', upiId: 'kabir@icici' },
  { id: 't4', name: 'Priya Sharma', phone: '+919988776655', email: 'priya@contrey.travel', upiId: 'priya@paytm' },
];

const INITIAL_DEMO_TRIP: Trip = {
  id: 'trip_goa_001',
  userId: 'usr_demo_101',
  name: 'Goa Coastal Getaway 🌴',
  destination: 'Goa, India',
  destinationCoords: { lat: 15.2993, lng: 74.1240 },
  startDate: '2026-11-20',
  endDate: '2026-11-25',
  totalBudget: 80000,
  baseCurrency: 'INR',
  travelers: INITIAL_DEMO_TRAVELERS,
  createdAt: new Date().toISOString(),
};

const INITIAL_DEMO_EXPENSES: Expense[] = [
  {
    id: 'exp_1',
    tripId: 'trip_goa_001',
    title: 'Heritage Beach Villa 3 Nights',
    amount: 32000,
    currency: 'INR',
    category: 'Hotels',
    paidById: 't1', // Rohan paid
    splitType: 'equal',
    splits: [
      { travelerId: 't1', amount: 8000 },
      { travelerId: 't2', amount: 8000 },
      { travelerId: 't3', amount: 8000 },
      { travelerId: 't4', amount: 8000 },
    ],
    date: '2026-11-20T10:30:00.000Z',
    notes: 'Direct beach access cottage',
  },
  {
    id: 'exp_2',
    tripId: 'trip_goa_001',
    title: 'Seafood Dinner & Drinks at Curlies',
    amount: 6800,
    currency: 'INR',
    category: 'Food',
    paidById: 't2', // Aisha paid
    splitType: 'equal',
    splits: [
      { travelerId: 't1', amount: 1700 },
      { travelerId: 't2', amount: 1700 },
      { travelerId: 't3', amount: 1700 },
      { travelerId: 't4', amount: 1700 },
    ],
    date: '2026-11-20T20:15:00.000Z',
  },
  {
    id: 'exp_3',
    tripId: 'trip_goa_001',
    title: 'Goa Self-Drive Thar Rental',
    amount: 11000,
    currency: 'INR',
    category: 'Transportation',
    paidById: 't3', // Kabir paid
    splitType: 'equal',
    splits: [
      { travelerId: 't1', amount: 2750 },
      { travelerId: 't2', amount: 2750 },
      { travelerId: 't3', amount: 2750 },
      { travelerId: 't4', amount: 2750 },
    ],
    date: '2026-11-21T09:00:00.000Z',
  },
  {
    id: 'exp_4',
    tripId: 'trip_goa_001',
    title: 'Scuba Diving & Jet Ski at Grand Island',
    amount: 9600,
    currency: 'INR',
    category: 'Activities',
    paidById: 't1', // Rohan paid
    splitType: 'equal',
    splits: [
      { travelerId: 't1', amount: 2400 },
      { travelerId: 't2', amount: 2400 },
      { travelerId: 't3', amount: 2400 },
      { travelerId: 't4', amount: 2400 },
    ],
    date: '2026-11-22T11:00:00.000Z',
  },
  {
    id: 'exp_5',
    tripId: 'trip_goa_001',
    title: 'Anjuna Flea Market Souvenirs',
    amount: 4200,
    currency: 'INR',
    category: 'Shopping',
    paidById: 't4', // Priya paid
    splitType: 'equal',
    splits: [
      { travelerId: 't1', amount: 1050 },
      { travelerId: 't2', amount: 1050 },
      { travelerId: 't3', amount: 1050 },
      { travelerId: 't4', amount: 1050 },
    ],
    date: '2026-11-23T16:00:00.000Z',
  },
];

const TripContext = createContext<TripContextType | undefined>(undefined);

export const TripProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [trips, setTrips] = useState<Trip[]>(() => {
    return storageService.getItem<Trip[]>('contrey_trips', [INITIAL_DEMO_TRIP]);
  });

  const [activeTripId, setActiveTripId] = useState<string | null>(() => {
    const saved = localStorage.getItem('contrey_active_trip_id');
    return saved || 'trip_goa_001';
  });

  const [expenses, setExpenses] = useState<Expense[]>(() => {
    return storageService.getItem<Expense[]>('contrey_expenses', INITIAL_DEMO_EXPENSES);
  });

  const [settlementOverrides, setSettlementOverrides] = useState<Record<string, { isSettled: boolean; settledAt?: string }>>(() => {
    return storageService.getItem<Record<string, { isSettled: boolean; settledAt?: string }>>('contrey_settlement_states', {});
  });

  // Sync with localStorage
  useEffect(() => {
    storageService.setItem('contrey_trips', trips);
  }, [trips]);

  useEffect(() => {
    if (activeTripId) {
      localStorage.setItem('contrey_active_trip_id', activeTripId);
    }
  }, [activeTripId]);

  useEffect(() => {
    storageService.setItem('contrey_expenses', expenses);
  }, [expenses]);

  useEffect(() => {
    storageService.setItem('contrey_settlement_states', settlementOverrides);
  }, [settlementOverrides]);

  const activeTrip = trips.find((t) => t.id === activeTripId) || trips[0] || null;
  const activeTripExpenses = expenses.filter((e) => e.tripId === activeTripId);

  // Compute minimum transactions dynamically
  const existingSettlementsList: Settlement[] = Object.entries(settlementOverrides).map(([id, state]) => ({
    id,
    tripId: activeTripId || '',
    fromTravelerId: '',
    toTravelerId: '',
    amount: 0,
    isSettled: state.isSettled,
    settledAt: state.settledAt,
  }));

  const settlementResult = activeTrip
    ? computeSettlements(activeTrip.id, activeTrip.travelers, activeTripExpenses, existingSettlementsList)
    : { totalSpent: 0, balances: [], settlements: [] };

  // Re-apply settled status overrides
  const computedSettlements = settlementResult.settlements.map((s) => {
    const override = settlementOverrides[s.id];
    if (override) {
      return { ...s, isSettled: override.isSettled, settledAt: override.settledAt };
    }
    return s;
  });

  // Trip CRUD
  const createTrip = (tripData: Omit<Trip, 'id' | 'createdAt'>): string => {
    const newId = `trip_${Date.now()}`;
    const newTrip: Trip = {
      ...tripData,
      id: newId,
      createdAt: new Date().toISOString(),
    };
    setTrips((prev) => [newTrip, ...prev]);
    setActiveTripId(newId);
    toast.success(`Trip "${newTrip.name}" created!`);
    return newId;
  };

  const updateTrip = (id: string, tripData: Partial<Trip>) => {
    setTrips((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...tripData } : t))
    );
    toast.success('Trip updated successfully');
  };

  const deleteTrip = (id: string) => {
    setTrips((prev) => prev.filter((t) => t.id !== id));
    setExpenses((prev) => prev.filter((e) => e.tripId !== id));
    if (activeTripId === id) {
      const remaining = trips.filter((t) => t.id !== id);
      setActiveTripId(remaining.length > 0 ? remaining[0].id : null);
    }
    toast.info('Trip deleted');
  };

  // Expense CRUD
  const addExpense = (expenseData: Omit<Expense, 'id'>) => {
    const newExpense: Expense = {
      ...expenseData,
      id: `exp_${Date.now()}`,
    };
    setExpenses((prev) => [newExpense, ...prev]);
    toast.success(`Added "${newExpense.title}"`);
  };

  const updateExpense = (id: string, expenseData: Partial<Expense>) => {
    setExpenses((prev) =>
      prev.map((e) => (e.id === id ? { ...e, ...expenseData } : e))
    );
    toast.success('Expense updated');
  };

  const deleteExpense = (id: string) => {
    setExpenses((prev) => prev.filter((e) => e.id !== id));
    toast.info('Expense removed');
  };

  const toggleSettlementStatus = (settlementId: string) => {
    setSettlementOverrides((prev) => {
      const current = prev[settlementId];
      const isSettled = current ? !current.isSettled : true;
      const updated = {
        ...prev,
        [settlementId]: {
          isSettled,
          settledAt: isSettled ? new Date().toISOString() : undefined,
        },
      };

      if (isSettled) {
        toast.success('Debt marked as settled! 🎉');
      } else {
        toast.info('Debt marked as unpaid');
      }

      return updated;
    });
  };

  return (
    <TripContext.Provider
      value={{
        trips,
        activeTrip,
        activeTripId,
        setActiveTripId,
        createTrip,
        updateTrip,
        deleteTrip,
        expenses,
        activeTripExpenses,
        addExpense,
        updateExpense,
        deleteExpense,
        settlements: computedSettlements,
        toggleSettlementStatus,
        settlementResult: {
          ...settlementResult,
          settlements: computedSettlements,
        },
      }}
    >
      {children}
    </TripContext.Provider>
  );
};

export const useTrip = (): TripContextType => {
  const context = useContext(TripContext);
  if (!context) {
    throw new Error('useTrip must be used within a TripProvider');
  }
  return context;
};
