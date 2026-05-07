import { createContext, useContext, useState, ReactNode } from 'react';

interface CurrencyContextType {
  currencyCode: string;
  currencySymbol: string;
  exchangeRate: number;
  convertPrice: (price: number) => string;
  setCurrency: (code: string) => void;
  isLoading: boolean;
}

const CurrencyContext = createContext<CurrencyContextType>({
  currencyCode: 'USD',
  currencySymbol: '$',
  exchangeRate: 1,
  convertPrice: (p) => p.toFixed(2),
  setCurrency: () => {},
  isLoading: false,
});

const CURRENCY_DATA: Record<string, { symbol: string }> = {
  INR: { symbol: '₹' },
  USD: { symbol: '$' },
  GBP: { symbol: '£' },
  AED: { symbol: 'AED ' },
  AUD: { symbol: 'A$' },
  CAD: { symbol: 'CA$' },
  SGD: { symbol: 'S$' },
  EUR: { symbol: '€' },
};

export const CurrencyProvider = ({ children }: { children: ReactNode }) => {
  // ✅ Default USD — no IP detection, no conversion
  const saved = localStorage.getItem('selected_currency') || 'USD';
  const [currencyCode, setCurrencyCode] = useState(saved);
  const [currencySymbol, setCurrencySymbol] = useState(
    CURRENCY_DATA[saved]?.symbol || '$'
  );

  const updateCurrency = (code: string) => {
    const symbol = CURRENCY_DATA[code]?.symbol || '$';
    setCurrencyCode(code);
    setCurrencySymbol(symbol);
    localStorage.setItem('selected_currency', code);
  };

  // ✅ No conversion — return price as-is with 2 decimal places
  const convertPrice = (price: number): string => price.toFixed(2);

  return (
    <CurrencyContext.Provider
      value={{
        currencyCode,
        currencySymbol,
        exchangeRate: 1,
        convertPrice,
        setCurrency: updateCurrency,
        isLoading: false,
      }}
    >
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrencyContext = () => useContext(CurrencyContext);
