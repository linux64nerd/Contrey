import { CurrencyCode } from './currency';

export type ExpenseCategory = 'Hotels' | 'Food' | 'Transportation' | 'Shopping' | 'Activities';

export interface SplitDetail {
  travelerId: string;
  amount: number;
}

export interface Expense {
  id: string;
  tripId: string;
  title: string;
  amount: number;
  currency: CurrencyCode;
  category: ExpenseCategory;
  paidById: string; // travelerId
  splitType: 'equal' | 'custom';
  splits: SplitDetail[];
  date: string; // ISO string
  notes?: string;
}
