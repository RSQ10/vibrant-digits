import { useState, useEffect } from 'react';

export const useExchangeRate = (fromCurrency: string, toCurrency: string) => {
  const [rate, setRate] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (fromCurrency === toCurrency) {
      setRate(1);
      setLoading(false);
      return;
    }

    fetch(`https://api.exchangerate-api.com/v4/latest/${fromCurrency}`)
      .then((r) => r.json())
      .then((data) => {
        setRate(data.rates[toCurrency] || 1);
      })
      .catch(() => setRate(1))
      .finally(() => setLoading(false));
  }, [fromCurrency, toCurrency]);

  return { rate, loading };
};
