import { toast } from "sonner";

const DOMAIN = "jk0yez-6r.myshopify.com"
const TOKEN = "c12677814d108cc0d536f2b653ce71b0"
const ENDPOINT = `https://${DOMAIN}/api/2024-01/graphql.json`
const HEADERS = {
  "Content-Type": "application/json",
  "X-Shopify-Storefront-Access-Token": TOKEN,
}

export interface ShopifyProduct {
  node: {
    id: string;
    title: string;
    description: string;
    handle: string;
    tags: string[];
    compareAtPriceRange?: {
      minVariantPrice: { amount: string; currencyCode: string };
    };
    priceRange: {
      minVariantPrice: { amount: string; currencyCode: string };
    };
    images: {
      edges: Array<{ node: { url: string; altText: string | null } }>;
    };
    variants: {
      edges: Array<{
        node: {
          id: string;
          title: string;
          price: { amount: string; currencyCode: string };
          compareAtPrice?: { amount: string; currencyCode: string } | null;
          availableForSale: boolean;
          selectedOptions: Array<{ name: string; value: string }>;
        };
      }>;
    };
    options: Array<{ name: string; values: string[] }>;
  };
}

export interface ShopifyCollection {
  node: {
    id: string;
    title: string;
    handle: string;
    description: string;
    image: { url: string; altText: string | null } | null;
  };
}

export async function storefrontApiRequest(query: string, variables: Record<string, unknown> = {}) {
  const response = await fetch(ENDPOINT, {
    method: 'POST',
    headers: HEADERS,
    body: JSON.stringify({ query, variables }),
  });

  if (response.status === 402) {
    toast.error("Shopify: Payment required", {
      description: "Your store needs an active billing plan.",
    });
    return null;
  }

  if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

  const data = await response.json();
  if (data.errors) {
    console.error("Shopify API errors:", data.errors);
  }
  return data;
}

export async function shopifyFetch(query: string, variables: Record<string, unknown> = {}) {
  const json = await storefrontApiRequest(query, variables);
  return json?.data;
}

// ── Checkout helpers ──

export async function createCheckout(
  variantId: string,
  quantity: number = 1
): Promise<string | null> {
  const merchandiseId = variantId.includes("gid://")
    ? variantId
    : `gid://shopify/ProductVariant/${variantId}`

  const res = await fetch(ENDPOINT, {
    method: "POST",
    headers: HEADERS,
    body: JSON.stringify({
      query: `
        mutation cartCreate($input: CartInput!) {
          cartCreate(input: $input) {
            cart { id checkoutUrl }
            userErrors { field message }
          }
        }
      `,
      variables: {
        input: {
          lines: [{ quantity, merchandiseId }]
        }
      }
    })
  })

  const json = await res.json()
  const errors = json?.data?.cartCreate?.userErrors
  const url = json?.data?.cartCreate?.cart?.checkoutUrl

  if (errors && errors.length > 0) {
    console.error("Cart errors:", errors)
    return null
  }
  return url || null
}

export async function createCartWithItems(
  lines: Array<{ variantId: string; quantity: number }>
): Promise<string | null> {
  const formattedLines = lines.map(line => ({
    quantity: line.quantity,
    merchandiseId: line.variantId.includes("gid://")
      ? line.variantId
      : `gid://shopify/ProductVariant/${line.variantId}`
  }))

  const res = await fetch(ENDPOINT, {
    method: "POST",
    headers: HEADERS,
    body: JSON.stringify({
      query: `
        mutation cartCreate($input: CartInput!) {
          cartCreate(input: $input) {
            cart { id checkoutUrl }
            userErrors { field message }
          }
        }
      `,
      variables: {
        input: { lines: formattedLines }
      }
    })
  })

  const json = await res.json()
  return json?.data?.cartCreate?.cart?.checkoutUrl || null
}

// ── Queries ──

export const PRODUCTS_QUERY = `
  query GetProducts($first: Int!, $query: String) {
    products(first: $first, query: $query) {
      edges {
        node {
          id title description handle tags
          priceRange { minVariantPrice { amount currencyCode } }
          compareAtPriceRange { minVariantPrice { amount currencyCode } }
          images(first: 5) { edges { node { url altText } } }
          variants(first: 10) {
            edges {
              node {
                id title
                price { amount currencyCode }
                compareAtPrice { amount currencyCode }
                availableForSale
                selectedOptions { name value }
              }
            }
          }
          options { name values }
        }
      }
    }
  }
`;

export const PRODUCT_BY_HANDLE_QUERY = `
  query GetProductByHandle($handle: String!) {
    productByHandle(handle: $handle) {
      id title description handle tags
      priceRange { minVariantPrice { amount currencyCode } }
      compareAtPriceRange { minVariantPrice { amount currencyCode } }
      images(first: 10) { edges { node { url altText } } }
      variants(first: 20) {
        edges {
          node {
            id title
            price { amount currencyCode }
            compareAtPrice { amount currencyCode }
            availableForSale
            selectedOptions { name value }
          }
        }
      }
      options { name values }
    }
  }
`;

export const COLLECTIONS_QUERY = `
  query GetCollections($first: Int!) {
    collections(first: $first) {
      edges {
        node {
          id title handle description
          image { url altText }
        }
      }
    }
  }
`;

export const COLLECTION_PRODUCTS_QUERY = `
  query GetCollectionProducts($handle: String!, $first: Int!) {
    collection(handle: $handle) {
      id title description
      products(first: $first) {
        edges {
          node {
            id title description handle tags
            priceRange { minVariantPrice { amount currencyCode } }
            compareAtPriceRange { minVariantPrice { amount currencyCode } }
            images(first: 5) { edges { node { url altText } } }
            variants(first: 10) {
              edges {
                node {
                  id title
                  price { amount currencyCode }
                  compareAtPrice { amount currencyCode }
                  availableForSale
                  selectedOptions { name value }
                }
              }
            }
            options { name values }
          }
        }
      }
    }
  }
`;

export const NEWEST_PRODUCTS_QUERY = `
  query GetNewestProducts($first: Int!) {
    products(first: $first, sortKey: CREATED_AT, reverse: true) {
      edges {
        node {
          id title description handle tags
          priceRange { minVariantPrice { amount currencyCode } }
          compareAtPriceRange { minVariantPrice { amount currencyCode } }
          images(first: 5) { edges { node { url altText } } }
          variants(first: 10) {
            edges {
              node {
                id title
                price { amount currencyCode }
                compareAtPrice { amount currencyCode }
                availableForSale
                selectedOptions { name value }
              }
            }
          }
          options { name values }
        }
      }
    }
  }
`;
