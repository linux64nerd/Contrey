export type CurrencyCode = 'INR' | 'EUR' | 'USD';

export interface CurrencyConfig {
  code: CurrencyCode;
  symbol: string;
  name: string;
  flag: string;
}

export interface ExchangeRates {
  base: CurrencyCode;
  date: string;
  rates: Record<CurrencyCode, number>;
}
