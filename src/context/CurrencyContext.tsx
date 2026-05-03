import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface CurrencyContextType {
  currencyCode: string;
  currencySymbol: string;
  exchangeRate: number;
  convertPrice: (priceInUSD: number) => string;
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
  USD: { symbol: '$' },
  GBP: { symbol: '£' },
  EUR: { symbol: '€' },
  AUD: { symbol: 'A$' },
  CAD: { symbol: 'CA$' },
  SGD: { symbol: 'S$' },
  AED: { symbol: 'AED ' },
};

// India (IN) intentionally excluded — store sells to Western markets only
const COUNTRY_TO_CURRENCY: Record<string, string> = {
  US: 'USD',
  GB: 'GBP',
  DE: 'EUR',
  FR: 'EUR',
  IT: 'EUR',
  ES: 'EUR',
  NL: 'EUR',
  AU: 'AUD',
  CA: 'CAD',
  SG: 'SGD',
  AE: 'AED',
};

export const CurrencyProvider = ({ children }: { children: ReactNode }) => {
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
      const savedCurrency = localStorage.getItem('preferred_currency');
      if (savedCurrency && CURRENCY_DATA[savedCurrency]) {
        await updateCurrency(savedCurrency);
        return;
      }
      try {
        const res = await fetch('https://ipapi.co/json/');
        const data = await res.json();
        const detectedCurrency = COUNTRY_TO_CURRENCY[data.country] || 'USD';
        await updateCurrency(detectedCurrency);
      } catch {
        await updateCurrency('USD');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const updateCurrency = async (code: string) => {
    const safeCode = CURRENCY_DATA[code] ? code : 'USD';
    try {
      const symbol = CURRENCY_DATA[safeCode]?.symbol || '$';
      setCurrencyCode(safeCode);
      setCurrencySymbol(symbol);
      localStorage.setItem('preferred_currency', safeCode);
      if (safeCode === 'USD') {
        setExchangeRate(1);
      } else {
        const res = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
        const data = await res.json();
        setExchangeRate(data.rates[safeCode] || 1);
      }
    } catch (err) {
      console.error('Currency update error:', err);
      setCurrencyCode('USD');
      setCurrencySymbol('$');
      setExchangeRate(1);
    }
  };

  const convertPrice = (priceInUSD: number): string => {
    const converted = priceInUSD * exchangeRate;
    return converted.toFixed(2);
  };

  return (
    <CurrencyContext.Provider value={{ currencyCode, currencySymbol, exchangeRate, convertPrice, setCurrency: updateCurrency, isLoading }}>
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrencyContext = () => useContext(CurrencyContext);
