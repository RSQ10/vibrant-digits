import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface CartItem {
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

  checkoutId: string | null;
  checkoutUrl: string | null;

  addItem: (item: CartItem) => Promise<void>;
  getCheckoutUrl: () => string | null;
}

const SHOPIFY_URL = `https://${import.meta.env.VITE_SHOPIFY_STORE_DOMAIN}/api/2023-10/graphql.json`;
const TOKEN = import.meta.env.VITE_SHOPIFY_STOREFRONT_TOKEN;

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isLoading: false,
      checkoutId: null,
      checkoutUrl: null,

      addItem: async (item) => {
        set({ isLoading: true });

        // ✅ keep existing cart logic
        const { items } = get();
        const existing = items.find(i => i.variantId === item.variantId);

        if (existing) {
          set({
            items: items.map(i =>
              i.variantId === item.variantId
                ? { ...i, quantity: i.quantity + item.quantity }
                : i
            ),
          });
        } else {
          set({ items: [...items, item] });
        }

        // ✅ Shopify checkout logic starts
        let { checkoutId } = get();

        // create checkout if not exists
        if (!checkoutId) {
          const res = await fetch(SHOPIFY_URL, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "X-Shopify-Storefront-Access-Token": TOKEN,
            },
            body: JSON.stringify({
              query: `
                mutation {
                  checkoutCreate(input: {}) {
                    checkout {
                      id
                      webUrl
                    }
                  }
                }
              `,
            }),
          });

          const data = await res.json();
          const checkout = data?.data?.checkoutCreate?.checkout;

          if (!checkout) {
            console.error("Checkout create failed", data);
            set({ isLoading: false });
            return;
          }

          checkoutId = checkout.id;

          set({
            checkoutId,
            checkoutUrl: checkout.webUrl,
          });
        }

        // add item to checkout
        const res = await fetch(SHOPIFY_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-Shopify-Storefront-Access-Token": TOKEN,
          },
          body: JSON.stringify({
            query: `
              mutation checkoutLineItemsAdd($checkoutId: ID!, $lineItems: [CheckoutLineItemInput!]!) {
                checkoutLineItemsAdd(checkoutId: $checkoutId, lineItems: $lineItems) {
                  checkout {
                    webUrl
                  }
                }
              }
            `,
            variables: {
              checkoutId,
              lineItems: [
                {
                  variantId: item.variantId,
                  quantity: item.quantity,
                },
              ],
            },
          }),
        });

        const data = await res.json();
        const url = data?.data?.checkoutLineItemsAdd?.checkout?.webUrl;

        console.log("Checkout URL:", url);

        if (url) {
          set({ checkoutUrl: url });
        } else {
          console.error("Add item failed", data);
        }

        set({ isLoading: false });
      },

      getCheckoutUrl: () => get().checkoutUrl,
    }),
    {
      name: "shopify-cart",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
