import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

// ─── Config ───────────────────────────────────────────────────────────────────
const SHOPIFY_DOMAIN = import.meta.env.VITE_SHOPIFY_STORE_DOMAIN || "gadget-shop-9908.myshopify.com";
const SHOPIFY_TOKEN = import.meta.env.VITE_SHOPIFY_STOREFRONT_TOKEN || "8231c1471c1a83020e70349c567d217f";
const SHOPIFY_URL = `https://${SHOPIFY_DOMAIN}/api/2024-10/graphql.json`;

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
  lineId?: string;
}

interface CartStore {
  items: CartItem[];
  isLoading: boolean;
  cartId: string | null;
  checkoutUrl: string | null;

  addItem: (item: CartItem) => Promise<string | null>;
  removeItem: (variantId: string) => Promise<void>;
  updateQuantity: (variantId: string, quantity: number) => Promise<void>;
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

// Always force checkout URL to use the raw myshopify.com domain to avoid
// landing on the Shopify theme (custom domain) instead of the checkout page.
function fixCheckoutUrl(url: string | null | undefined): string | null {
  if (!url) return null;
  try {
    const parsed = new URL(url);
    // Force host to myshopify domain regardless of custom domain
    parsed.host = SHOPIFY_DOMAIN;
    return parsed.toString();
  } catch {
    // Fallback to simple string replace if URL parsing fails
    return url
      .replace("glow-gadget.shop", SHOPIFY_DOMAIN)
      .replace(/^https?:\/\/[^/]+/, `https://${SHOPIFY_DOMAIN}`);
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

// ─── Cart Lines Fragment ──────────────────────────────────────────────────────
const CART_FIELDS = `
  id
  checkoutUrl
  lines(first: 50) {
    edges {
      node {
        id
        quantity
        merchandise {
          ... on ProductVariant {
            id
          }
        }
      }
    }
  }
`;

// ─── Store ────────────────────────────────────────────────────────────────────
export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isLoading: false,
      cartId: null,
      checkoutUrl: null,

      // ── Add item ─────────────────────────────────────────────────────────
      addItem: async (item: CartItem): Promise<string | null> => {
        set({ isLoading: true });

        try {
          const items = get().items || [];
          const existing = items.find((i) => i.variantId === item.variantId);
          const merchandiseId = toGid(item.variantId);
          let cartId = get().cartId;
          let checkoutUrl: string | null = null;

          if (!cartId) {
            // Create new cart
            const data = await shopifyMutation(
              `mutation cartCreate($input: CartInput!) {
                cartCreate(input: $input) {
                  cart { ${CART_FIELDS} }
                  userErrors { field message }
                }
              }`,
              { input: { lines: [{ quantity: item.quantity, merchandiseId }] } }
            );

            const errors = data?.data?.cartCreate?.userErrors ?? [];
            if (errors.length > 0) {
              console.error("cartCreate errors:", errors);
              set({ isLoading: false });
              return isOutOfStockError(errors) ? OUT_OF_STOCK : null;
            }

            const cart = data?.data?.cartCreate?.cart;
            if (!cart) {
              set({ isLoading: false });
              return null;
            }

            cartId = cart.id;
            checkoutUrl = fixCheckoutUrl(cart.checkoutUrl);

            const lineId = cart.lines?.edges?.[0]?.node?.id ?? undefined;
            const newItem = { ...item, lineId };

            set({
              cartId,
              checkoutUrl,
              items: existing
                ? items.map((i) =>
                    i.variantId === item.variantId
                      ? { ...i, quantity: i.quantity + item.quantity, lineId }
                      : i
                  )
                : [...items, newItem],
            });

          } else {
            // Add to existing cart
            const data = await shopifyMutation(
              `mutation cartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) {
                cartLinesAdd(cartId: $cartId, lines: $lines) {
                  cart { ${CART_FIELDS} }
                  userErrors { field message }
                }
              }`,
              { cartId, lines: [{ quantity: item.quantity, merchandiseId }] }
            );

            const errors = data?.data?.cartLinesAdd?.userErrors ?? [];

            if (errors.length > 0) {
              console.error("cartLinesAdd errors:", errors);
              if (isOutOfStockError(errors)) {
                set({ isLoading: false });
                return OUT_OF_STOCK;
              }
              // Reset cart and retry
              set({ cartId: null, checkoutUrl: null });
              set({ isLoading: false });
              return get().addItem(item);
            }

            const cart = data?.data?.cartLinesAdd?.cart;
            checkoutUrl = fixCheckoutUrl(cart?.checkoutUrl ?? get().checkoutUrl);

            const cartLines = cart?.lines?.edges ?? [];
            const matchedLine = cartLines.find(
              (edge: any) => edge.node.merchandise?.id === merchandiseId
            );
            const lineId = matchedLine?.node?.id ?? undefined;

            set({
              checkoutUrl,
              items: existing
                ? items.map((i) =>
                    i.variantId === item.variantId
                      ? { ...i, quantity: i.quantity + item.quantity, lineId }
                      : i
                  )
                : [...items, { ...item, lineId }],
            });
          }

          set({ isLoading: false });
          return checkoutUrl;

        } catch (err) {
          console.error("addItem failed:", err);
          set({ isLoading: false });
          return null;
        }
      },

      // ── Remove item ───────────────────────────────────────────────────────
      removeItem: async (variantId: string): Promise<void> => {
        set({ isLoading: true });
        try {
          const items = get().items || [];
          const cartId = get().cartId;
          const itemToRemove = items.find((i) => i.variantId === variantId);

          if (cartId && itemToRemove?.lineId) {
            const data = await shopifyMutation(
              `mutation cartLinesRemove($cartId: ID!, $lineIds: [ID!]!) {
                cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
                  cart { ${CART_FIELDS} }
                  userErrors { field message }
                }
              }`,
              { cartId, lineIds: [itemToRemove.lineId] }
            );

            const cart = data?.data?.cartLinesRemove?.cart;
            const newItems = items.filter((i) => i.variantId !== variantId);

            if (newItems.length === 0) {
              set({ cartId: null, checkoutUrl: null });
            } else {
              const checkoutUrl = fixCheckoutUrl(cart?.checkoutUrl);
              set({ checkoutUrl });
            }
          }

          set({ items: items.filter((i) => i.variantId !== variantId) });
        } catch (err) {
          console.error("removeItem failed:", err);
          set({ items: get().items.filter((i) => i.variantId !== variantId) });
        } finally {
          set({ isLoading: false });
        }
      },

      // ── Update quantity ───────────────────────────────────────────────────
      updateQuantity: async (variantId: string, quantity: number): Promise<void> => {
        set({ isLoading: true });
        try {
          const items = get().items || [];
          const cartId = get().cartId;
          const itemToUpdate = items.find((i) => i.variantId === variantId);

          if (quantity <= 0) {
            await get().removeItem(variantId);
            return;
          }

          if (cartId && itemToUpdate?.lineId) {
            const data = await shopifyMutation(
              `mutation cartLinesUpdate($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
                cartLinesUpdate(cartId: $cartId, lines: $lines) {
                  cart { ${CART_FIELDS} }
                  userErrors { field message }
                }
              }`,
              { cartId, lines: [{ id: itemToUpdate.lineId, quantity }] }
            );

            const cart = data?.data?.cartLinesUpdate?.cart;
            const checkoutUrl = fixCheckoutUrl(cart?.checkoutUrl);
            if (checkoutUrl) set({ checkoutUrl });
          }

          set({
            items: items.map((i) =>
              i.variantId === variantId ? { ...i, quantity } : i
            ),
          });
        } catch (err) {
          console.error("updateQuantity failed:", err);
        } finally {
          set({ isLoading: false });
        }
      },

      clearCart: () => {
        set({ items: [], cartId: null, checkoutUrl: null });
      },

      getTotal: () => {
        return (get().items || []).reduce(
          (sum, item) => sum + parseFloat(item.price.amount) * item.quantity,
          0
        );
      },

      getItemCount: () => {
        return (get().items || []).reduce((sum, item) => sum + item.quantity, 0);
      },
    }),
    {
      name: "cart-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        items: state.items,
        cartId: state.cartId,
        checkoutUrl: state.checkoutUrl,
      }),
    }
  )
);
