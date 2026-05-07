import { useState, useEffect } from 'react';

const CURRENCY_MAP: Record<string, { code: string; symbol: string }> = {
  IN: { code: 'INR', symbol: '₹' },
  US: { code: 'USD', symbol: '$' },
  GB: { code: 'GBP', symbol: '£' },
  AE: { code: 'AED', symbol: 'AED' },
  AU: { code: 'AUD', symbol: 'A$' },
  CA: { code: 'CAD', symbol: 'CA$' },
  SG: { code: 'SGD', symbol: 'S$' },
  EU: { code: 'EUR', symbol: '€' },
};

export const useCurrency = () => {
  const [currency, setCurrency] = useState({ code: 'INR', symbol: '₹' });
  const [country, setCountry] = useState('IN');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('https://ipapi.co/json/')
      .then((r) => r.json())
      .then((data) => {
        const countryCode = data.country_code;
        setCountry(countryCode);
        const detected = CURRENCY_MAP[countryCode] || { code: 'USD', symbol: '$' };
        setCurrency(detected);
      })
      .catch(() => {
        setCurrency({ code: 'INR', symbol: '₹' });
      })
      .finally(() => setLoading(false));
  }, []);

  return { currency, country, loading };
};
