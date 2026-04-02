import { create } from "zustand";

interface CartStore {
  checkoutId: string | null;
  checkoutUrl: string | null;
  isLoading: boolean;

  createCheckout: () => Promise<string | null>;
  addItem: (variantId: string, quantity: number) => Promise<void>;
  getCheckoutUrl: () => string | null;
}

const SHOPIFY_URL = `https://${import.meta.env.VITE_SHOPIFY_STORE_DOMAIN}/api/2023-10/graphql.json`;
const TOKEN = import.meta.env.VITE_SHOPIFY_STOREFRONT_TOKEN;

export const useCartStore = create<CartStore>((set, get) => ({
  checkoutId: null,
  checkoutUrl: null,
  isLoading: false,

  createCheckout: async () => {
    try {
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
      console.log("Checkout create response:", data);

      const checkout = data?.data?.checkoutCreate?.checkout;

      if (!checkout) {
        console.error("Checkout creation failed", data);
        return null;
      }

      set({
        checkoutId: checkout.id,
        checkoutUrl: checkout.webUrl,
      });

      return checkout.id;
    } catch (err) {
      console.error("Checkout error:", err);
      return null;
    }
  },

  addItem: async (variantId, quantity) => {
    set({ isLoading: true });

    let { checkoutId } = get();

    if (!checkoutId) {
      checkoutId = await get().createCheckout();
      if (!checkoutId) {
        set({ isLoading: false });
        return;
      }
    }

    try {
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
                variantId,
                quantity,
              },
            ],
          },
        }),
      });

      const data = await res.json();
      console.log("Add item response:", data);

      const url = data?.data?.checkoutLineItemsAdd?.checkout?.webUrl;

      if (!url) {
        console.error("Add item failed", data);
      } else {
        set({ checkoutUrl: url });
      }
    } catch (err) {
      console.error("Add item error:", err);
    }

    set({ isLoading: false });
  },

  getCheckoutUrl: () => {
    return get().checkoutUrl;
  },
}));
