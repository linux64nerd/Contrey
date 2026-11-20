/**
 * Storage Service
 * Modular abstraction over browser localStorage.
 * Structured so Firebase Authentication / Firestore or Supabase can be swapped in seamlessly.
 */

const STORAGE_KEYS = {
  USER: 'contrey_user',
  TOKEN: 'contrey_auth_token',
  TRIPS: 'contrey_trips',
  EXPENSES: 'contrey_expenses',
  NOTIFICATIONS: 'contrey_notifications',
  CURRENCY: 'contrey_currency',
  EXCHANGE_RATES: 'contrey_rates',
} as const;

export const storageService = {
  // Auth
  getUser: <T>(): T | null => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.USER);
      return data ? JSON.parse(data) : null;
    } catch (e) {
      console.error('Failed to parse stored user', e);
      return null;
    }
  },
  setUser: <T>(user: T | null): void => {
    if (user === null) {
      localStorage.removeItem(STORAGE_KEYS.USER);
      localStorage.removeItem(STORAGE_KEYS.TOKEN);
    } else {
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
      localStorage.setItem(STORAGE_KEYS.TOKEN, `token_${Date.now()}`);
    }
  },

  // Generic getter/setter
  getItem: <T>(key: string, defaultValue: T): T => {
    try {
      const val = localStorage.getItem(key);
      return val ? JSON.parse(val) : defaultValue;
    } catch {
      return defaultValue;
    }
  },
  setItem: <T>(key: string, value: T): void => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.error(`Failed to store item ${key}`, e);
    }
  },
};
