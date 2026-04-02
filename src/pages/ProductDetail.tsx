import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import {
  storefrontApiRequest,
  PRODUCT_BY_HANDLE_QUERY,
  PRODUCTS_QUERY,
  createCheckout,
  type ShopifyProduct
} from '@/lib/shopify';
import { useCartStore } from '@/stores/cartStore';
import { Button } from '@/components/ui/button';
import { ProductCard } from '@/components/ProductCard';
import { Minus, Plus, Loader2, ChevronRight } from 'lucide-react';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

const ProductDetail = () => {
  const { handle } = useParams<{ handle: string }>();

  const [product, setProduct] = useState<ShopifyProduct['node'] | null>(null);
  const [related, setRelated] = useState<ShopifyProduct[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedVariantIdx, setSelectedVariantIdx] = useState(0);
  const [quantity, setQuantity] = useState(1);

  const [checkoutUrl, setCheckoutUrl] = useState<string | null>(null);
  const [loadingCheckout, setLoadingCheckout] = useState(false);

  const addItem = useCartStore(s => s.addItem);
  const isLoading = useCartStore(s => s.isLoading);

  useEffect(() => {
    if (!handle) return; // ✅ IMPORTANT FIX

    const fetchProduct = async () => {
      setLoading(true);

      try {
        console.log("Fetching product with handle:", handle);

        const data = await storefrontApiRequest(PRODUCT_BY_HANDLE_QUERY, { handle });

        const fetchedProduct = data?.data?.productByHandle || null;
        console.log("Product response:", fetchedProduct);

        setProduct(fetchedProduct);

        // Related products
        const relData = await storefrontApiRequest(PRODUCTS_QUERY, { first: 4 });

        const filtered =
          (relData?.data?.products?.edges || [])
            .filter((p: ShopifyProduct) => p.node.handle !== handle)
            .slice(0, 4);

        setRelated(filtered);

      } catch (err) {
        console.error("Error fetching product:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();

    setSelectedImage(0);
    setSelectedVariantIdx(0);
    setQuantity(1);

    window.scrollTo(0, 0);
  }, [handle]);

  // ⛔ Loading state
  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16 text-center">
          <Loader2 className="w-6 h-6 animate-spin mx-auto" />
        </div>
      </Layout>
    );
  }

  // ❌ Product not found
  if (!product) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16 text-center">
          <p className="text-muted-foreground">Product not found.</p>
          <Button asChild className="mt-4">
            <Link to="/shop">Back to Shop</Link>
          </Button>
        </div>
      </Layout>
    );
  }

  const variant = product.variants.edges[selectedVariantIdx]?.node;
  const price = parseFloat(variant?.price.amount || '0');

  const images = product.images.edges;

  const [checkoutUrl, setCheckoutUrl] = useState<string | null>(null);
  const [loadingCheckout, setLoadingCheckout] = useState(false);

  const handleAddToCart = () => {
    if (!variant) return;
    addItem({
      product: { node: product },
      variantId: variant.id,
      variantTitle: variant.title,
      price: variant.price,
      quantity,
      selectedOptions: variant.selectedOptions || [],
    });
    toast.success(`${product.title} added to cart`);
  };

  const generateCheckoutUrl = async () => {
    setLoadingCheckout(true);
    const variantId = variant?.id || product?.variants?.edges?.[0]?.node?.id;
    if (!variantId) { setLoadingCheckout(false); return; }
    const url = await createCheckout(variantId, quantity);
    if (url) setCheckoutUrl(url);
    setLoadingCheckout(false);
  };

  return (
    <Layout>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="container mx-auto px-4 py-10"
      >

        {/* Breadcrumb */}
        <div className="flex items-center gap-1 text-sm mb-6">
          <Link to="/">Home</Link>
          <ChevronRight className="w-3 h-3" />
          <Link to="/shop">Shop</Link>
          <ChevronRight className="w-3 h-3" />
          <span>{product.title}</span>
        </div>

        <div className="grid lg:grid-cols-2 gap-10">

          {/* Image */}
          <div>
            {images[0] && (
              <img
                src={images[selectedImage]?.node.url}
                alt={product.title}
                className="w-full rounded-lg"
              />
            )}
          </div>

          {/* Info */}
          <div>
            <h1 className="text-2xl font-bold mb-3">{product.title}</h1>
            <p className="text-lg font-semibold mb-4">₹{price}</p>

            {/* Quantity */}
            <div className="flex items-center gap-3 mb-6">
              <Button onClick={() => setQuantity(q => Math.max(1, q - 1))}>
                <Minus />
              </Button>
              <span>{quantity}</span>
              <Button onClick={() => setQuantity(q => q + 1)}>
                <Plus />
              </Button>
            </div>

            {/* CTA */}
            <div className="flex gap-3">
              <Button onClick={handleAddToCart} disabled={isLoading} variant="outline" className="flex-1">
                {isLoading ? <Loader2 className="animate-spin" /> : "Add to Cart"}
              </Button>

              {checkoutUrl ? (
                <a
                  href={checkoutUrl}
                  target="_self"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center py-2.5 px-6 bg-primary text-primary-foreground rounded-md font-medium hover:bg-primary/90 transition-colors"
                >
                  Proceed to Checkout →
                </a>
              ) : (
                <Button onClick={generateCheckoutUrl} disabled={loadingCheckout} className="flex-1">
                  {loadingCheckout ? <Loader2 className="animate-spin" /> : "Buy Now"}
                </Button>
              )}
            </div>

            {/* Description */}
            <div className="mt-6 text-sm">
              {product.description}
            </div>
          </div>

        </div>

        {/* Related */}
        {related.length > 0 && (
          <div className="mt-16">
            <h2 className="text-xl font-bold mb-6">Related Products</h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {related.map(p => (
                <ProductCard key={p.node.id} product={p} />
              ))}
            </div>
          </div>
        )}

      </motion.div>
    </Layout>
  );
};

export default ProductDetail;
