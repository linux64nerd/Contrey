import { CurrencyCode } from './currency';

export interface Traveler {
  id: string;
  name: string;
  email?: string;
  phone: string; // WhatsApp phone number e.g. +919876543210
  upiId?: string; // UPI ID e.g. alex@okaxis
}

export interface Settlement {
  id: string;
  tripId: string;
  fromTravelerId: string;
  toTravelerId: string;
  amount: number; // in trip base currency
  isSettled: boolean;
  settledAt?: string;
}

export interface Trip {
  id: string;
  userId: string;
  name: string;
  destination: string;
  destinationCoords?: { lat: number; lng: number };
  startDate: string;
  endDate: string;
  totalBudget: number;
  baseCurrency: CurrencyCode;
  travelers: Traveler[];
  createdAt: string;
}

export type AlertSeverity = 'urgent' | 'warning' | 'info';

export interface InAppNotification {
  id: string;
  tripId?: string;
  title: string;
  message: string;
  severity: AlertSeverity;
  timestamp: string;
  read: boolean;
  actionUrl?: string;
}
