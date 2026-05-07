import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface CurrencyContextType {
  currencyCode: string;
  currencySymbol: string;
  exchangeRate: number;
  convertPrice: (priceInINR: number) => string;
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
  // ✅ Force USD as default — no IP detection
  const [currencyCode, setCurrencyCode] = useState('USD');
  const [currencySymbol, setCurrencySymbol] = useState('$');
  const [exchangeRate, setExchangeRate] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    initializeCurrency();
  }, []);

  const initializeCurrency = async () => {
    try {
      setIsLoading(true);

      // ✅ Check if user manually selected a currency before
      const savedCurrency = localStorage.getItem('selected_currency');

      // ✅ Default is always USD — no IP detection
      await updateCurrency(savedCurrency || 'USD');
    } finally {
      setIsLoading(false);
    }
  };

  const updateCurrency = async (code: string) => {
    try {
      const symbol = CURRENCY_DATA[code]?.symbol || '$';

      setCurrencyCode(code);
      setCurrencySymbol(symbol);
      // ✅ Save only when USER manually picks — key changed to avoid
      // stale INR from old localStorage key 'currency'
      localStorage.setItem('selected_currency', code);

      if (code === 'USD') {
        // USD is base — fetch rate from INR to USD
        const res = await fetch('https://api.exchangerate-api.com/v4/latest/INR');
        const data = await res.json();
        setExchangeRate(data.rates['USD'] || 0.012);
      } else if (code === 'INR') {
        setExchangeRate(1);
      } else {
        const res = await fetch('https://api.exchangerate-api.com/v4/latest/INR');
        const data = await res.json();
        setExchangeRate(data.rates[code] || 1);
      }
    } catch (err) {
      console.error('Currency error:', err);
      // ✅ Fallback stays USD
      setCurrencyCode('USD');
      setCurrencySymbol('$');
      setExchangeRate(0.012);
    }
  };

  const convertPrice = (priceInINR: number): string => {
    const converted = priceInINR * exchangeRate;
    return currencyCode === 'INR'
      ? converted.toFixed(0)
      : converted.toFixed(2);
  };

  return (
    <CurrencyContext.Provider
      value={{
        currencyCode,
        currencySymbol,
        exchangeRate,
        convertPrice,
        setCurrency: updateCurrency,
        isLoading,
      }}
    >
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrencyContext = () => useContext(CurrencyContext);
