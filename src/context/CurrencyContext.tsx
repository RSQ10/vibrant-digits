import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';

// ── Types ─────────────────────────────────────────────────────────────────────

interface CurrencyContextType {
  currencyCode: string;
  currencySymbol: string;
  exchangeRate: number;
  convertPrice: (priceInUSD: number) => string;
  setCurrency: (code: string) => void;
  isLoading: boolean;
}

// ── Constants ─────────────────────────────────────────────────────────────────

// Only USD, EUR and INR supported (as required)
const SUPPORTED_CURRENCIES: Record<string, { symbol: string }> = {
  USD: { symbol: '$' },
  EUR: { symbol: '€' },
  INR: { symbol: '₹' },
};

// Country → currency mapping (only supported currencies)
const COUNTRY_TO_CURRENCY: Record<string, string> = {
  US: 'USD',
  DE: 'EUR', FR: 'EUR', IT: 'EUR', ES: 'EUR', NL: 'EUR',
  PT: 'EUR', BE: 'EUR', AT: 'EUR', FI: 'EUR', IE: 'EUR',
  GR: 'EUR', SK: 'EUR', SI: 'EUR', LT: 'EUR', LV: 'EUR',
  EE: 'EUR', LU: 'EUR', MT: 'EUR', CY: 'EUR', HR: 'EUR',
  IN: 'INR',
};

const DEFAULT_CURRENCY = 'USD';

// ── Shopify cart buyer identity update ───────────────────────────────────────

const SHOPIFY_DOMAIN = 'gadget-shop-9908.myshopify.com';
const SHOPIFY_TOKEN = '8231c1471c1a83020e70349c567d217f';
const SHOPIFY_ENDPOINT = `https://${SHOPIFY_DOMAIN}/api/2024-10/graphql.json`;
const SHOPIFY_HEADERS = {
  'Content-Type': 'application/json',
  'X-Shopify-Storefront-Access-Token': SHOPIFY_TOKEN,
};

function currencyToCountry(code: string): string {
  const map: Record<string, string> = { USD: 'US', EUR: 'DE', INR: 'IN' };
  return map[code] || 'US';
}

async function updateShopifyCartCurrency(cartId: string, currencyCode: string) {
  try {
    await fetch(SHOPIFY_ENDPOINT, {
      method: 'POST',
      headers: SHOPIFY_HEADERS,
      body: JSON.stringify({
        query: `
          mutation cartBuyerIdentityUpdate($cartId: ID!, $buyerIdentity: CartBuyerIdentityInput!) {
            cartBuyerIdentityUpdate(cartId: $cartId, buyerIdentity: $buyerIdentity) {
              cart { id checkoutUrl }
              userErrors { field message }
            }
          }
        `,
        variables: {
          cartId,
          buyerIdentity: { countryCode: currencyToCountry(currencyCode) },
        },
      }),
    });
  } catch (err) {
    console.error('Shopify cart currency update failed:', err);
  }
}

function notifyShopify(currencyCode: string) {
  const cartId = localStorage.getItem('shopify_cart_id');
  if (cartId) updateShopifyCartCurrency(cartId, currencyCode);
}

// ── Context ──────────────────────────────────────────────────────────────────

const CurrencyContext = createContext<CurrencyContextType>({
  currencyCode: DEFAULT_CURRENCY,
  currencySymbol: '$',
  exchangeRate: 1,
  convertPrice: (p) => p.toFixed(2),
  setCurrency: () => {},
  isLoading: false,
});

// ── Provider ─────────────────────────────────────────────────────────────────

export const CurrencyProvider = ({ children }: { children: ReactNode }) => {
  const [currencyCode, setCurrencyCode] = useState(DEFAULT_CURRENCY);
  const [currencySymbol, setCurrencySymbol] = useState('$');
  const [exchangeRate, setExchangeRate] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  const fetchRate = async (code: string): Promise<number> => {
    if (code === 'USD') return 1;
    try {
      const res = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
      const data = await res.json();
      const rate = data?.rates?.[code];
      if (typeof rate === 'number' && rate > 0) return rate;
    } catch { /* ignore */ }
    try {
      const res = await fetch(`https://api.frankfurter.app/latest?from=USD&to=${code}`);
      const data = await res.json();
      const rate = data?.rates?.[code];
      if (typeof rate === 'number' && rate > 0) return rate;
    } catch { /* ignore */ }
    return 1;
  };

  const updateCurrency = useCallback(async (code: string) => {
    const safeCode = SUPPORTED_CURRENCIES[code] ? code : DEFAULT_CURRENCY;
    const symbol = SUPPORTED_CURRENCIES[safeCode]?.symbol ?? '$';
    setCurrencyCode(safeCode);
    setCurrencySymbol(symbol);
    localStorage.setItem('preferred_currency', safeCode);
    const rate = await fetchRate(safeCode);
    setExchangeRate(rate);
    notifyShopify(safeCode);
  }, []);

  useEffect(() => {
    const init = async () => {
      setIsLoading(true);
      try {
        const saved = localStorage.getItem('preferred_currency');
        if (saved && SUPPORTED_CURRENCIES[saved]) {
          await updateCurrency(saved);
          return;
        }
        const res = await fetch('https://ipapi.co/json/');
        const data = await res.json();
        const detected = COUNTRY_TO_CURRENCY[data.country_code] ?? DEFAULT_CURRENCY;
        await updateCurrency(detected);
      } catch {
        await updateCurrency(DEFAULT_CURRENCY);
      } finally {
        setIsLoading(false);
      }
    };
    init();
  }, [updateCurrency]);

  const convertPrice = (priceInUSD: number): string =>
    (priceInUSD * exchangeRate).toFixed(2);

  return (
    <CurrencyContext.Provider
      value={{ currencyCode, currencySymbol, exchangeRate, convertPrice, setCurrency: updateCurrency, isLoading }}
    >
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrencyContext = () => useContext(CurrencyContext);
