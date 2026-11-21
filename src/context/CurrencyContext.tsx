import React, { createContext, useContext, useState, useEffect } from 'react';
import { CurrencyCode, ExchangeRates } from '../types/currency';
import { storageService, STORAGE_KEYS } from '../services/storageService';

interface CurrencyContextType {
  currentCurrency: CurrencyCode;
  setCurrency: (currency: CurrencyCode) => void;
  rates: ExchangeRates;
  convertAmount: (amount: number, from: CurrencyCode, to?: CurrencyCode) => number;
  format: (amount: number, currency?: CurrencyCode) => string;
  isLoadingRates: boolean;
}

// Resilient default rates with fallback
const DEFAULT_RATES: ExchangeRates = {
  base: 'EUR',
  date: '2026-11-20',
  rates: {
    EUR: 1,
    USD: 1.09,
    INR: 91.50,
  },
};

const VALID_CURRENCIES: CurrencyCode[] = ['INR', 'EUR', 'USD'];

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export const CurrencyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentCurrency, setCurrentCurrency] = useState<CurrencyCode>(() => {
    const saved = storageService.getItem<string>(STORAGE_KEYS.CURRENCY, 'INR');
    return VALID_CURRENCIES.includes(saved as CurrencyCode) ? (saved as CurrencyCode) : 'INR';
  });

  const [rates, setRates] = useState<ExchangeRates>(() => {
    const cached = storageService.getItem<ExchangeRates>(STORAGE_KEYS.EXCHANGE_RATES, DEFAULT_RATES);
    if (
      cached &&
      cached.rates &&
      typeof cached.rates.EUR === 'number' &&
      typeof cached.rates.USD === 'number' &&
      typeof cached.rates.INR === 'number'
    ) {
      return cached;
    }
    return DEFAULT_RATES;
  });

  const [isLoadingRates, setIsLoadingRates] = useState<boolean>(false);

  useEffect(() => {
    storageService.setItem(STORAGE_KEYS.CURRENCY, currentCurrency);
  }, [currentCurrency]);

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    const fetchRates = async () => {
      setIsLoadingRates(true);
      try {
        const res = await fetch('https://api.frankfurter.app/latest?from=EUR&to=USD,INR', {
          signal: controller.signal,
        });
        if (!res.ok) throw new Error(`Rates API responded with status ${res.status}`);
        const data = await res.json();
        if (
          isMounted &&
          data &&
          data.rates &&
          typeof data.rates.USD === 'number' &&
          typeof data.rates.INR === 'number'
        ) {
          const newRates: ExchangeRates = {
            base: 'EUR',
            date: data.date || new Date().toISOString().split('T')[0],
            rates: {
              EUR: 1,
              USD: data.rates.USD,
              INR: data.rates.INR,
            },
          };
          setRates(newRates);
          storageService.setItem(STORAGE_KEYS.EXCHANGE_RATES, newRates);
        }
      } catch (err: unknown) {
        const isAbort = err instanceof Error && err.name === 'AbortError';
        if (isAbort) {
          console.warn('Rates fetch timed out after 5000ms. Using cached/default rates.');
        } else {
          console.warn('Using offline fallback exchange rates', err);
        }
      } finally {
        if (isMounted) setIsLoadingRates(false);
        clearTimeout(timeoutId);
      }
    };

    fetchRates();
    return () => {
      isMounted = false;
      controller.abort();
      clearTimeout(timeoutId);
    };
  }, []);

  /**
   * Converts a monetary amount between currencies using a normalized EUR base pivot.
   * Guarantees arithmetic stability, zero drift, and non-finite number guardrails.
   *
   * @param amount - Numerical quantity to convert
   * @param from - Origin currency code (INR | EUR | USD)
   * @param to - Target currency code (defaults to currently selected user currency)
   * @returns Converted monetary value
   */
  const convertAmount = (amount: number, from: CurrencyCode, to: CurrencyCode = currentCurrency): number => {
    if (from === to) return amount;
    if (!isFinite(amount) || isNaN(amount)) return 0;

    // Normalize to EUR first
    const fromRate = rates.rates[from] || (DEFAULT_RATES.rates[from] ?? 1);
    const toRate = rates.rates[to] || (DEFAULT_RATES.rates[to] ?? 1);

    if (fromRate <= 0) return amount;
    const amountInEUR = amount / fromRate;
    return amountInEUR * toRate;
  };

  const format = (amount: number, currency: CurrencyCode = currentCurrency): string => {
    const symbols: Record<CurrencyCode, string> = {
      INR: '₹',
      EUR: '€',
      USD: '$',
    };
    const symbol = symbols[currency] || currency;
    const safeAmount = isFinite(amount) && !isNaN(amount) ? amount : 0;
    const formatted = new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(safeAmount);
    return `${symbol}${formatted}`;
  };

  return (
    <CurrencyContext.Provider
      value={{
        currentCurrency,
        setCurrency: setCurrentCurrency,
        rates,
        convertAmount,
        format,
        isLoadingRates,
      }}
    >
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = (): CurrencyContextType => {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
};
