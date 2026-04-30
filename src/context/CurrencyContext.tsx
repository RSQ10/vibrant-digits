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

const COUNTRY_TO_CURRENCY: Record<string, string> = {
  IN: 'INR',
  US: 'USD',
  GB: 'GBP',
  AE: 'AED',
  AU: 'AUD',
  CA: 'CAD',
  SG: 'SGD',
  DE: 'EUR',
  FR: 'EUR',
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

      const savedCurrency = localStorage.getItem('currency');

      // ✅ Step 1: If user already selected currency → use it
      if (savedCurrency) {
        await updateCurrency(savedCurrency);
        return;
      }

      // ✅ Step 2: Detect user country via IP
      try {
        const res = await fetch('https://ipapi.co/json/');
        const data = await res.json();

        const countryCode = data.country;
        const detectedCurrency =
          COUNTRY_TO_CURRENCY[countryCode] || 'USD';

        await updateCurrency(detectedCurrency);
      } catch (err) {
        // fallback if API fails
        await updateCurrency('USD');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const updateCurrency = async (code: string) => {
    try {
      const symbol = CURRENCY_DATA[code]?.symbol || '$';

      setCurrencyCode(code);
      setCurrencySymbol(symbol);
      localStorage.setItem('currency', code);

      if (code === 'INR') {
        setExchangeRate(1);
      } else {
        const res = await fetch(
          'https://api.exchangerate-api.com/v4/latest/INR'
        );
        const data = await res.json();
        setExchangeRate(data.rates[code] || 1);
      }
    } catch (err) {
      console.error('Currency error:', err);
      setCurrencyCode('USD');
      setCurrencySymbol('$');
      setExchangeRate(1);
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
