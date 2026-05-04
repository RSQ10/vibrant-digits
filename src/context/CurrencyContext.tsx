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
  currencyCode: 'INR',
  currencySymbol: '₹',
  exchangeRate: 1,
  convertPrice: (p) => p.toFixed(2),
  setCurrency: () => {},
  isLoading: false,
});

export const CurrencyProvider = ({ children }: { children: ReactNode }) => {
  const [isLoading, setIsLoading] = useState(false);

  // No conversion — Shopify already returns INR prices for IN market
  const convertPrice = (price: number): string => price.toFixed(2);

  return (
    <CurrencyContext.Provider
      value={{
        currencyCode: 'INR',
        currencySymbol: '₹',
        exchangeRate: 1,
        convertPrice,
        setCurrency: () => {},
        isLoading,
      }}
    >
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrencyContext = () => useContext(CurrencyContext);
