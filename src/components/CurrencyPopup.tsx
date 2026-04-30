import { useEffect, useState } from 'react';
import { useCurrencyContext } from '../context/CurrencyContext';

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

export default function CurrencyPopup() {
  const { setCurrency } = useCurrencyContext();
  const [show, setShow] = useState(false);
  const [detectedCurrency, setDetectedCurrency] = useState('USD');
  const [country, setCountry] = useState('');

  useEffect(() => {
    const alreadyShown = localStorage.getItem('currency_popup_shown');
    const savedCurrency = localStorage.getItem('currency');

    if (alreadyShown || savedCurrency) return;

    detectUser();
  }, []);

  const detectUser = async () => {
    try {
      const res = await fetch('https://ipapi.co/json/');
      const data = await res.json();

      const countryCode = data.country;
      const currency = COUNTRY_TO_CURRENCY[countryCode] || 'USD';

      if (currency !== 'USD') {
        setDetectedCurrency(currency);
        setCountry(countryCode);
        setShow(true);
      }
    } catch (err) {
      console.error('Popup detection failed');
    }
  };

  const handleYes = () => {
    setCurrency(detectedCurrency);
    localStorage.setItem('currency_popup_shown', 'true');
    setShow(false);
  };

  const handleNo = () => {
    localStorage.setItem('currency', 'USD');
    localStorage.setItem('currency_popup_shown', 'true');
    setShow(false);
  };

  if (!show) return null;

  return (
    <div className="fixed bottom-5 left-1/2 transform -translate-x-1/2 bg-white shadow-lg rounded-xl px-6 py-4 z-50 border">
      <p className="text-sm font-medium mb-3">
        We detected you're in {country} — switch to {detectedCurrency}?
      </p>

      <div className="flex gap-3 justify-center">
        <button
          onClick={handleYes}
          className="px-4 py-2 bg-black text-white rounded-lg text-sm"
        >
          Yes
        </button>

        <button
          onClick={handleNo}
          className="px-4 py-2 border rounded-lg text-sm"
        >
          Stay in USD
        </button>
      </div>
    </div>
  );
}
