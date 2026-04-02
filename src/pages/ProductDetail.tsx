import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import {
  storefrontApiRequest,
  PRODUCT_BY_HANDLE_QUERY,
  type ShopifyProduct
} from '@/lib/shopify';
import { useCartStore } from '@/stores/cartStore';
import { Button } from '@/components/ui/button';

const ProductDetail = () => {
  const { handle } = useParams<{ handle: string }>();

  const [product, setProduct] = useState<ShopifyProduct['node'] | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (!handle) return;

    const fetchProduct = async () => {
      setLoading(true);
      const data = await storefrontApiRequest(PRODUCT_BY_HANDLE_QUERY, { handle });
      setProduct(data?.data?.productByHandle || null);
      setLoading(false);
    };

    fetchProduct();
  }, [handle]);

  if (loading) return <Layout>Loading...</Layout>;
  if (!product) return <Layout>Not Found</Layout>;

  const variant = product.variants.edges[0]?.node;

  const handleBuyNow = async () => {
    if (!variant) return;

    const url = await useCartStore.getState().addItem({
      product: { node: product },
      variantId: variant.id,
      variantTitle: variant.title,
      price: variant.price,
      quantity,
      selectedOptions: variant.selectedOptions || [],
    });

    if (url) {
      window.location.href = url;
    }
  };

  return (
    <Layout>
      <div className="p-4">
        <h1>{product.title}</h1>
        <p>₹{variant?.price.amount}</p>

        <Button onClick={handleBuyNow}>
          Buy Now
        </Button>
      </div>
    </Layout>
  );
};

export default ProductDetail;
