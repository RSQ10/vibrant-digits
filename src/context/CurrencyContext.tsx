import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface CurrencyContextType {
  currencyCode: string;
  currencySymbol: string;
  exchangeRate: number;
  convertPrice: (priceInINR: number) => string;
  isLoading: boolean;
}

const CurrencyContext = createContext<CurrencyContextType>({
  currencyCode: 'INR',
  currencySymbol: '₹',
  exchangeRate: 1,
  convertPrice: (p) => p.toFixed(0),
  isLoading: false,
});

const CURRENCY_MAP: Record<string, { code: string; symbol: string }> = {
  IN: { code: 'INR', symbol: '₹' },
  US: { code: 'USD', symbol: '$' },
  GB: { code: 'GBP', symbol: '£' },
  AE: { code: 'AED', symbol: 'AED ' },
  AU: { code: 'AUD', symbol: 'A$' },
  CA: { code: 'CAD', symbol: 'CA$' },
  SG: { code: 'SGD', symbol: 'S$' },
  DE: { code: 'EUR', symbol: '€' },
  FR: { code: 'EUR', symbol: '€' },
};

export const CurrencyProvider = ({ children }: { children: ReactNode }) => {
  const [currencyCode, setCurrencyCode] = useState('INR');
  const [currencySymbol, setCurrencySymbol] = useState('₹');
  const [exchangeRate, setExchangeRate] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const detect = async () => {
      try {
        const geoRes = await fetch('https://ipapi.co/json/');
        const geoData = await geoRes.json();
        const countryCode = geoData.country_code || 'IN';
        const detected = CURRENCY_MAP[countryCode] || { code: 'USD', symbol: '$' };
        setCurrencyCode(detected.code);
        setCurrencySymbol(detected.symbol);

        if (detected.code !== 'INR') {
          const rateRes = await fetch(
            `https://api.exchangerate-api.com/v4/latest/INR`
          );
          const rateData = await rateRes.json();
          const rate = rateData.rates[detected.code] || 1;
          setExchangeRate(rate);
        }
      } catch {
        setCurrencyCode('INR');
        setCurrencySymbol('₹');
        setExchangeRate(1);
      } finally {
        setIsLoading(false);
      }
    };

    detect();
  }, []);

  const convertPrice = (priceInINR: number): string => {
    const converted = priceInINR * exchangeRate;
    if (currencyCode === 'INR') return converted.toFixed(0);
    return converted.toFixed(2);
  };

  return (
    <CurrencyContext.Provider
      value={{
        currencyCode,
        currencySymbol,
        exchangeRate,
        convertPrice,
        isLoading,
      }}
    >
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrencyContext = () => useContext(CurrencyContext);
