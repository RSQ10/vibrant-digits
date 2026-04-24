import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

const SHOPIFY_DOMAIN = import.meta.env.VITE_SHOPIFY_STORE_DOMAIN || "gadget-shop-9908.myshopify.com";
const SHOPIFY_TOKEN = import.meta.env.VITE_SHOPIFY_STOREFRONT_TOKEN || "8231c1471c1a83020e70349c567d217f";
const SHOPIFY_URL = `https://${SHOPIFY_DOMAIN}/api/2024-01/graphql.json`;

const HEADERS = {
  "Content-Type": "application/json",
  "X-Shopify-Storefront-Access-Token": SHOPIFY_TOKEN,
};

export const OUT_OF_STOCK = "OUT_OF_STOCK" as const;

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
  addItem: (item: CartItem) => Promise<string | typeof OUT_OF_STOCK | null>;
  removeItem: (variantId: string) => void;
  updateQuantity: (variantId: string, quantity: number) => void;
  clearCart: () => void;
  getTotal: () => number;
  getItemCount: () => number;
}

function toGid(variantId: string): string {
  return variantId.startsWith("gid://")
    ? variantId
    : `gid://shopify/ProductVariant/${variantId}`;
}

function fixCheckoutUrl(url: string | null | undefined): string | null {
  if (!url) return null;
  try {
    const parsed = new URL(url);
    // Replace custom domain with myshopify.com domain
    if (parsed.hostname !== SHOPIFY_DOMAIN) {
      parsed.hostname = SHOPIFY_DOMAIN;
    }
    // Add channel=online_store to bypass password protection
    parsed.searchParams.set("channel", "online_store");
    return parsed.toString();
  } catch {
    return url
      .replace(/^https?:\/\/[^/]+/, `https://${SHOPIFY_DOMAIN}`);
  }
}

function isOutOfStockError(errors: Array<{ message: string }>): boolean {
  return errors.some((e) => {
    const msg = e.message.toLowerCase();
    return (
      msg.includes("does not exist") ||
      msg.includes("unavailable") ||
      msg.includes("out of stock") ||
      msg.includes("not available")
    );
  });
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

const CART_CREATE_MUTATION = `
  mutation cartCreate($input: CartInput!) {
    cartCreate(input: $input) {
      cart { id checkoutUrl }
      userErrors { field message }
    }
  }
`;

const CART_LINES_ADD_MUTATION = `
  mutation cartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) {
    cartLinesAdd(cartId: $cartId, lines: $lines) {
      cart { id checkoutUrl }
      userErrors { field message }
    }
  }
`;

async function createCart(merchandiseId: string, quantity: number) {
  return shopifyMutation(CART_CREATE_MUTATION, {
    input: { lines: [{ quantity, merchandiseId }] },
  });
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isLoading: false,
      cartId: null,
      checkoutUrl: null,

      addItem: async (item: CartItem): Promise<string | typeof OUT_OF_STOCK | null> => {
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
            // Create fresh cart
            const data = await createCart(merchandiseId, item.quantity);
            const errors = data?.data?.cartCreate?.userErrors ?? [];
            if (errors.length > 0) {
              console.error("cartCreate errors:", errors);
              set({
                items: (get().items || []).filter((i) => i.variantId !== item.variantId),
                isLoading: false,
              });
              return isOutOfStockError(errors) ? OUT_OF_STOCK : null;
            }

            const cart = data?.data?.cartCreate?.cart;
            if (!cart) {
              console.error("cartCreate returned no cart");
              set({ isLoading: false });
              return null;
            }

            cartId = cart.id;
            checkoutUrl = fixCheckoutUrl(cart.checkoutUrl);
            set({ cartId, checkoutUrl });
          } else {
            // Add to existing cart
            const data = await shopifyMutation(CART_LINES_ADD_MUTATION, {
              cartId,
              lines: [{ quantity: item.quantity, merchandiseId }],
            });

            const errors = data?.data?.cartLinesAdd?.userErrors ?? [];
            if (errors.length > 0) {
              console.error("cartLinesAdd errors:", errors);
              if (isOutOfStockError(errors)) {
                set({ isLoading: false });
                return OUT_OF_STOCK;
              }

              // Cart might be expired/invalid — reset and retry with fresh cart
              console.warn("cartLinesAdd failed, retrying with fresh cart...");
              set({ cartId: null, checkoutUrl: null });

              const retryData = await createCart(merchandiseId, item.quantity);
              const retryErrors = retryData?.data?.cartCreate?.userErrors ?? [];
              if (retryErrors.length > 0) {
                console.error("Retry cartCreate errors:", retryErrors);
                set({
                  items: (get().items || []).filter((i) => i.variantId !== item.variantId),
                  isLoading: false,
                });
                return isOutOfStockError(retryErrors) ? OUT_OF_STOCK : null;
              }

              const retryCart = retryData?.data?.cartCreate?.cart;
              if (!retryCart) {
                set({ isLoading: false });
                return null;
              }

              cartId = retryCart.id;
              checkoutUrl = fixCheckoutUrl(retryCart.checkoutUrl);
              set({ cartId, checkoutUrl });
              set({ isLoading: false });
              return checkoutUrl;
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
      name: "shopify-cart",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
