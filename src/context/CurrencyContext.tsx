import React, { createContext, useContext, useState, useEffect } from 'react';
import { CurrencyCode, ExchangeRates } from '../types/currency';

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

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export const CurrencyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentCurrency, setCurrentCurrency] = useState<CurrencyCode>(() => {
    const saved = localStorage.getItem('tripmate_currency');
    return (saved as CurrencyCode) || 'INR';
  });

  const [rates, setRates] = useState<ExchangeRates>(() => {
    const cached = localStorage.getItem('tripmate_rates');
    if (cached) {
      try {
        return JSON.parse(cached);
      } catch {
        // fallback
      }
    }
    return DEFAULT_RATES;
  });

  const [isLoadingRates, setIsLoadingRates] = useState<boolean>(false);

  useEffect(() => {
    localStorage.setItem('tripmate_currency', currentCurrency);
  }, [currentCurrency]);

  useEffect(() => {
    let isMounted = true;
    const fetchRates = async () => {
      setIsLoadingRates(true);
      try {
        const res = await fetch('https://api.frankfurter.app/latest?from=EUR&to=USD,INR');
        if (!res.ok) throw new Error('Failed to fetch rates');
        const data = await res.json();
        if (isMounted && data && data.rates) {
          const newRates: ExchangeRates = {
            base: 'EUR',
            date: data.date,
            rates: {
              EUR: 1,
              USD: data.rates.USD || 1.09,
              INR: data.rates.INR || 91.50,
            },
          };
          setRates(newRates);
          localStorage.setItem('tripmate_rates', JSON.stringify(newRates));
        }
      } catch (err) {
        // Fallback silently without throwing error
        console.warn('Using offline fallback exchange rates', err);
      } finally {
        if (isMounted) setIsLoadingRates(false);
      }
    };

    fetchRates();
    return () => {
      isMounted = false;
    };
  }, []);

  const convertAmount = (amount: number, from: CurrencyCode, to: CurrencyCode = currentCurrency): number => {
    if (from === to) return amount;
    // Normalize to EUR first
    const fromRate = rates.rates[from] || 1;
    const toRate = rates.rates[to] || 1;
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
    const formatted = new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(amount);
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
