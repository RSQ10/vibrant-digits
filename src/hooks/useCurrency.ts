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
  // ✅ Default forced to USD — no IP detection
  const [currency, setCurrency] = useState({ code: 'USD', symbol: '$' });
  const [country, setCountry] = useState('US');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // ✅ Check if user manually picked a currency
    const saved = localStorage.getItem('selected_currency');
    if (saved && CURRENCY_MAP[saved]) {
      setCurrency({ code: saved, symbol: CURRENCY_MAP[saved].code });
    }
    // ✅ No IP fetch — USD stays as default always
    setLoading(false);
  }, []);

  return { currency, country, loading };
};
