import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';

interface CurrencyContextType {
  currencyCode: string;
  currencySymbol: string;
  exchangeRate: number;
  convertPrice: (priceInUSD: number) => string;
  setCurrency: (code: string) => void;
  isLoading: boolean;
}

const SUPPORTED_CURRENCIES: Record<string, { symbol: string }> = {
  USD: { symbol: '$' },
  EUR: { symbol: '€' },
  INR: { symbol: '₹' },
};

// ── Shopify ───────────────────────────────────────────────────────────────────

const SHOPIFY_DOMAIN = 'gadget-shop-9908.myshopify.com';
const SHOPIFY_TOKEN = '8231c1471c1a83020e70349c567d217f';
const SHOPIFY_ENDPOINT = `https://${SHOPIFY_DOMAIN}/api/2024-10/graphql.json`;
const SHOPIFY_HEADERS = {
  'Content-Type': 'application/json',
  'X-Shopify-Storefront-Access-Token': SHOPIFY_TOKEN,
};

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
          buyerIdentity: { countryCode: 'IN' }, // forced India for INR
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

// ── Context ───────────────────────────────────────────────────────────────────

const CurrencyContext = createContext<CurrencyContextType>({
  currencyCode: 'INR',
  currencySymbol: '₹',
  exchangeRate: 1,
  convertPrice: (p) => p.toFixed(2),
  setCurrency: () => {},
  isLoading: false,
});

export const CurrencyProvider = ({ children }: { children: ReactNode }) => {
  const [currencyCode, setCurrencyCode] = useState('INR');
  const [currencySymbol, setCurrencySymbol] = useState('₹');
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
    const safeCode = SUPPORTED_CURRENCIES[code] ? code : 'INR';
    const symbol = SUPPORTED_CURRENCIES[safeCode]?.symbol ?? '₹';
    setCurrencyCode(safeCode);
    setCurrencySymbol(symbol);
    localStorage.setItem('preferred_currency', safeCode);
    const rate = await fetchRate(safeCode);
    setExchangeRate(rate);
    notifyShopify(safeCode);
  }, []);

  useEffect(() => {
    // FORCED INR — ignore IP and saved preference
    localStorage.removeItem('preferred_currency');
    updateCurrency('INR').finally(() => setIsLoading(false));
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
