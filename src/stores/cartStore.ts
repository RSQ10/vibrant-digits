import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

// ─── Config ───────────────────────────────────────────────────────────────────
const SHOPIFY_DOMAIN = import.meta.env.VITE_SHOPIFY_STORE_DOMAIN || "jk0yez-6r.myshopify.com";
const SHOPIFY_TOKEN = import.meta.env.VITE_SHOPIFY_STOREFRONT_TOKEN || "c12677814d108cc0d536f2b653ce71b0";
const SHOPIFY_URL = `https://${SHOPIFY_DOMAIN}/api/2024-01/graphql.json`;

const HEADERS = {
  "Content-Type": "application/json",
  "X-Shopify-Storefront-Access-Token": SHOPIFY_TOKEN,
};

export const OUT_OF_STOCK = "OUT_OF_STOCK" as const;

// ─── Types ────────────────────────────────────────────────────────────────────
export interface CartItem {
  product: any;
  variantId: string;
  variantTitle: string;
  price: { amount: string; currencyCode: string };
  quantity: number;
  selectedOptions: any[];
}

interface CartStore {
  items: CartItem[];
  isLoading: boolean;
  cartId: string | null;
  checkoutUrl: string | null;

  addItem: (item: CartItem) => Promise<string | null>;
  removeItem: (variantId: string) => void;
  updateQuantity: (variantId: string, quantity: number) => void;
  clearCart: () => void;
  getTotal: () => number;
  getItemCount: () => number;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
function toGid(variantId: string): string {
  return variantId.startsWith("gid://")
    ? variantId
    : `gid://shopify/ProductVariant/${variantId}`;
}

// THE FIX: replaces ANY domain in checkoutUrl with raw myshopify.com
// Old code did: url.replace("glow-gadget.shop", SHOPIFY_DOMAIN) — broke if Shopify returned anything else
function fixCheckoutUrl(url: string | null | undefined): string | null {
  if (!url) return null;
  try {
    const parsed = new URL(url);
    parsed.hostname = SHOPIFY_DOMAIN;
    return parsed.toString();
  } catch {
    return url.replace(/^https?:\/\/[^/]+/, `https://${SHOPIFY_DOMAIN}`);
  }
}

function isOutOfStockError(errors: Array<{ message: string }>): boolean {
  return errors.some((e) =>
    e.message.toLowerCase().includes("does not exist") ||
    e.message.toLowerCase().includes("unavailable") ||
    e.message.toLowerCase().includes("out of stock") ||
    e.message.toLowerCase().includes("not available")
  );
}

async function shopifyMutation(query: string, variables: Record<string, unknown>) {
  const res = await fetch(SHOPIFY_URL, {
    method: "POST",
    headers: HEADERS,
    body: JSON.stringify({ query, variables }),
  });
  if (!res.ok) throw new Error(`Shopify API error: ${res.status}`);
  return res.json();
}

// ─── Store ────────────────────────────────────────────────────────────────────
export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isLoading: false,
      cartId: null,
      checkoutUrl: null,

      addItem: async (item: CartItem): Promise<string | null> => {
        set({ isLoading: true });

        try {
          const items = get().items || [];
          const existing = items.find((i) => i.variantId === item.variantId);
          if (existing) {
            set({
              items: items.map((i) =>
                i.variantId === item.variantId
                  ? { ...i, quantity: i.quantity + item.quantity }
                  : i
              ),
            });
          } else {
            set({ items: [...items, item] });
          }

          const merchandiseId = toGid(item.variantId);
          let cartId = get().cartId;
          let checkoutUrl: string | null = null;

          if (!cartId) {
            const data = await shopifyMutation(
              `mutation cartCreate($input: CartInput!) {
                cartCreate(input: $input) {
                  cart { id checkoutUrl }
                  userErrors { field message }
                }
              }`,
              { input: { lines: [{ quantity: item.quantity, merchandiseId }] } }
            );

            const errors = data?.data?.cartCreate?.userErrors ?? [];

            if (errors.length > 0) {
              console.error("Shopify cartCreate errors:", errors);
              set({
                items: (get().items || []).filter((i) => i.variantId !== item.variantId),
                isLoading: false,
              });
              return isOutOfStockError(errors) ? OUT_OF_STOCK : null;
            }

            const cart = data?.data?.cartCreate?.cart;
            if (!cart) {
              console.error(
                "cartCreate returned no cart — verify Storefront API token has " +
                "unauthenticated_write_checkouts permission in Shopify > Settings > Apps > Develop Apps"
              );
              set({ isLoading: false });
              return null;
            }

            cartId = cart.id;
            checkoutUrl = fixCheckoutUrl(cart.checkoutUrl);
            set({ cartId, checkoutUrl });

          } else {
            const data = await shopifyMutation(
              `mutation cartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) {
                cartLinesAdd(cartId: $cartId, lines: $lines) {
                  cart { id checkoutUrl }
                  userErrors { field message }
                }
              }`,
              { cartId, lines: [{ quantity: item.quantity, merchandiseId }] }
            );

            const errors = data?.data?.cartLinesAdd?.userErrors ?? [];
            if (errors.length > 0) {
              console.error("Shopify cartLinesAdd errors:", errors);
              if (isOutOfStockError(errors)) {
                set({ isLoading: false });
                return OUT_OF_STOCK;
              }
            }

            checkoutUrl = fixCheckoutUrl(
              data?.data?.cartLinesAdd?.cart?.checkoutUrl ?? get().checkoutUrl
            );
            set({ checkoutUrl });
          }

          set({ isLoading: false });
          return checkoutUrl;

        } catch (err) {
          console.error("addItem failed:", err);
          set({ isLoading: false });
          return null;
        }
      },

      removeItem: (variantId: string) => {
        set((state) => ({
          items: (state.items || []).filter((i) => i.variantId !== variantId),
        }));
      },

      updateQuantity: (variantId: string, quantity: number) => {
        if (quantity <= 0) {
          get().removeItem(variantId);
          return;
        }
        set((state) => ({
          items: (state.items || []).map((i) =>
            i.variantId === variantId ? { ...i, quantity } : i
          ),
        }));
      },

      clearCart: () => {
        set({ items: [], cartId: null, checkoutUrl: null });
      },

      getTotal: () => {
        return (get().items || []).reduce((sum, item) => {
          return sum + parseFloat(item.price.amount) * item.quantity;
        }, 0);
      },

      getItemCount: () => {
        return (get().items || []).reduce((sum, item) => sum + item.quantity, 0);
      },
    }),
    {
      name: "shopify-cart",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
