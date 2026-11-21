/**
 * Storage Service
 * Modular abstraction over browser localStorage with schema validation and corruption resilience.
 */

import { User } from '../types/auth';

export const STORAGE_KEYS = {
  USER: 'contrey_user',
  TOKEN: 'contrey_auth_token',
  TRIPS: 'contrey_trips',
  ACTIVE_TRIP_ID: 'contrey_active_trip_id',
  EXPENSES: 'contrey_expenses',
  NOTIFICATIONS: 'contrey_notifications',
  CURRENCY: 'contrey_currency',
  EXCHANGE_RATES: 'contrey_rates',
  SETTLEMENT_STATES: 'contrey_settlement_states',
} as const;

export function isValidUser(data: unknown): data is User {
  if (!data || typeof data !== 'object') return false;
  const u = data as Record<string, unknown>;
  return (
    typeof u.id === 'string' &&
    u.id.trim().length > 0 &&
    typeof u.name === 'string' &&
    u.name.trim().length > 0 &&
    typeof u.authMethod === 'string'
  );
}

export const storageService = {
  // Auth with schema verification
  getUser: <T extends User = User>(): T | null => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.USER);
      if (!data) return null;
      const parsed = JSON.parse(data);
      if (isValidUser(parsed)) {
        return parsed as T;
      }
      console.warn('Invalid user schema detected in storage. Purging corrupted session.');
      localStorage.removeItem(STORAGE_KEYS.USER);
      localStorage.removeItem(STORAGE_KEYS.TOKEN);
      return null;
    } catch (e) {
      console.error('Failed to parse stored user', e);
      localStorage.removeItem(STORAGE_KEYS.USER);
      localStorage.removeItem(STORAGE_KEYS.TOKEN);
      return null;
    }
  },

  setUser: <T>(user: T | null): void => {
    try {
      if (user === null) {
        localStorage.removeItem(STORAGE_KEYS.USER);
        localStorage.removeItem(STORAGE_KEYS.TOKEN);
      } else {
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
        localStorage.setItem(STORAGE_KEYS.TOKEN, `token_${Date.now()}`);
      }
    } catch (e) {
      console.error('Failed to persist user session', e);
    }
  },

  // Generic getter with runtime type guards
  getItem: <T>(key: string, defaultValue: T): T => {
    try {
      const val = localStorage.getItem(key);
      if (val === null || val === undefined) return defaultValue;
      const parsed = JSON.parse(val);

      // Guard: If expected type is an Array, verify parsed item is an Array
      if (Array.isArray(defaultValue)) {
        if (!Array.isArray(parsed)) {
          console.warn(`Storage key "${key}" expected an array, got ${typeof parsed}. Using fallback.`);
          return defaultValue;
        }
        return parsed as T;
      }

      // Guard: If expected type is an Object, verify parsed item is a non-null, non-array object
      if (defaultValue !== null && typeof defaultValue === 'object') {
        if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) {
          console.warn(`Storage key "${key}" expected an object, got ${typeof parsed}. Using fallback.`);
          return defaultValue;
        }
        return parsed as T;
      }

      return parsed as T;
    } catch {
      return defaultValue;
    }
  },

  setItem: <T>(key: string, value: T): void => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e: any) {
      if (e?.name === 'QuotaExceededError') {
        console.error(`Storage quota exceeded while writing ${key}. Data cannot be saved.`);
      } else {
        console.error(`Failed to store item ${key}`, e);
      }
    }
  },

  removeItem: (key: string): void => {
    try {
      localStorage.removeItem(key);
    } catch (e) {
      console.error(`Failed to remove item ${key}`, e);
    }
  },
};
