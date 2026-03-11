import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import { storefrontApiRequest, PRODUCT_BY_HANDLE_QUERY, PRODUCTS_QUERY, type ShopifyProduct } from '@/lib/shopify';
import { useCartStore } from '@/stores/cartStore';
import { Button } from '@/components/ui/button';
import { ProductCard, ProductCardSkeleton } from '@/components/ProductCard';
import { Minus, Plus, Loader2, Lock, Truck, RotateCcw, ChevronRight } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
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

  const addItem = useCartStore(s => s.addItem);
  const isLoading = useCartStore(s => s.isLoading);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        const data = await storefrontApiRequest(PRODUCT_BY_HANDLE_QUERY, { handle });
        setProduct(data?.data?.productByHandle || null);
        // Fetch related
        const relData = await storefrontApiRequest(PRODUCTS_QUERY, { first: 4 });
        setRelated((relData?.data?.products?.edges || []).filter((p: ShopifyProduct) => p.node.handle !== handle).slice(0, 4));
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    };
    fetch();
    setSelectedImage(0);
    setSelectedVariantIdx(0);
    setQuantity(1);
    window.scrollTo(0, 0);
  }, [handle]);

  if (loading) return (
    <Layout>
      <div className="container mx-auto px-4 lg:px-8 py-16">
        <div className="grid lg:grid-cols-2 gap-12">
          <div className="aspect-square rounded-card shimmer" />
          <div className="space-y-4">
            <div className="h-8 w-3/4 shimmer rounded" />
            <div className="h-6 w-1/2 shimmer rounded" />
            <div className="h-12 w-full shimmer rounded-pill mt-6" />
          </div>
        </div>
      </div>
    </Layout>
  );

  if (!product) return (
    <Layout>
      <div className="container mx-auto px-4 py-16 text-center">
        <p className="text-muted-foreground">Product not found.</p>
        <Button asChild className="mt-4 rounded-pill"><Link to="/shop">Back to Shop</Link></Button>
      </div>
    </Layout>
  );

  const variant = product.variants.edges[selectedVariantIdx]?.node;
  const price = parseFloat(variant?.price.amount || '0');
  const compareAt = variant?.compareAtPrice ? parseFloat(variant.compareAtPrice.amount) : null;
  const isOnSale = compareAt && compareAt > price;
  const discount = isOnSale ? Math.round(((compareAt - price) / compareAt) * 100) : 0;
  const images = product.images.edges;

  const handleAddToCart = async () => {
    if (!variant) return;
    await addItem({
      product: { node: product },
      variantId: variant.id,
      variantTitle: variant.title,
      price: variant.price,
      quantity,
      selectedOptions: variant.selectedOptions || [],
    });
    toast.success(`${product.title} added to cart`);
  };

  const handleBuyNow = async () => {
    if (!variant) return;
    await addItem({
      product: { node: product },
      variantId: variant.id,
      variantTitle: variant.title,
      price: variant.price,
      quantity,
      selectedOptions: variant.selectedOptions || [],
    });
    const checkoutUrl = useCartStore.getState().getCheckoutUrl();
    if (checkoutUrl) window.open(checkoutUrl, '_blank');
  };

  return (
    <Layout>
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="container mx-auto px-4 lg:px-8 py-8 lg:py-16">
        {/* Breadcrumb */}
        <div className="flex items-center gap-1 text-sm text-muted-foreground mb-8">
          <Link to="/" className="hover:text-primary">Home</Link>
          <ChevronRight className="w-3 h-3" />
          <Link to="/shop" className="hover:text-primary">Shop</Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-heading">{product.title}</span>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Images */}
          <div className="space-y-3">
            <div className="aspect-square rounded-card overflow-hidden bg-surface">
              {images[selectedImage] && (
                <img src={images[selectedImage].node.url} alt={images[selectedImage].node.altText || product.title} className="w-full h-full object-cover" />
              )}
            </div>
            {images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto">
                {images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(i)}
                    className={`w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 border-2 transition-colors ${i === selectedImage ? 'border-primary' : 'border-transparent'}`}
                  >
                    <img src={img.node.url} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div>
            {isOnSale && (
              <span className="inline-block bg-primary text-primary-foreground text-xs font-semibold px-3 py-1 rounded-pill mb-3">SALE</span>
            )}
            <h1 className="text-2xl lg:text-3xl font-bold text-heading mb-3">{product.title}</h1>

            {/* Price */}
            <div className="flex items-center gap-3 mb-6">
              {isOnSale && <span className="text-lg text-muted-foreground line-through">₹{compareAt.toFixed(0)}</span>}
              <span className="text-2xl font-bold text-heading">₹{price.toFixed(0)}</span>
              {isOnSale && <span className="text-sm font-semibold text-green-600 bg-green-50 px-2 py-0.5 rounded-pill">{discount}% OFF</span>}
            </div>

            {/* Variants */}
            {product.options.filter(o => o.name !== 'Title' || o.values[0] !== 'Default Title').map(option => (
              <div key={option.name} className="mb-4">
                <p className="text-sm font-semibold text-heading mb-2">{option.name}</p>
                <div className="flex flex-wrap gap-2">
                  {option.values.map(value => {
                    const variantIdx = product.variants.edges.findIndex(v => v.node.selectedOptions.some(o => o.name === option.name && o.value === value));
                    const isSelected = variantIdx === selectedVariantIdx;
                    return (
                      <button
                        key={value}
                        onClick={() => setSelectedVariantIdx(variantIdx >= 0 ? variantIdx : 0)}
                        className={`px-4 py-2 text-sm rounded-lg border transition-colors ${isSelected ? 'bg-primary text-primary-foreground border-primary' : 'border-border text-body hover:border-primary'}`}
                      >
                        {value}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}

            {/* Quantity */}
            <div className="mb-6">
              <p className="text-sm font-semibold text-heading mb-2">Quantity</p>
              <div className="flex items-center gap-3">
                <Button variant="outline" size="icon" className="h-10 w-10 rounded-lg" onClick={() => setQuantity(q => Math.max(1, q - 1))}>
                  <Minus className="w-4 h-4" />
                </Button>
                <span className="w-8 text-center font-semibold">{quantity}</span>
                <Button variant="outline" size="icon" className="h-10 w-10 rounded-lg" onClick={() => setQuantity(q => q + 1)}>
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-col gap-3 mb-6">
              <Button variant="outline" className="w-full rounded-pill h-12 border-primary text-primary hover:bg-primary hover:text-primary-foreground" onClick={handleAddToCart} disabled={isLoading}>
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Add to Cart'}
              </Button>
              <Button className="w-full rounded-pill h-12" onClick={handleBuyNow} disabled={isLoading}>
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Buy Now'}
              </Button>
            </div>

            {/* Trust */}
            <div className="flex items-center gap-4 text-xs text-body mb-6 pb-6 border-b border-border">
              <span className="flex items-center gap-1"><Lock className="w-3 h-3" /> Secure</span>
              <span className="flex items-center gap-1"><Truck className="w-3 h-3" /> 3–5 Days</span>
              <span className="flex items-center gap-1"><RotateCcw className="w-3 h-3" /> 7-Day Returns</span>
            </div>

            {/* Description */}
            <Accordion type="single" collapsible defaultValue="description">
              <AccordionItem value="description">
                <AccordionTrigger className="text-sm font-semibold text-heading">Description</AccordionTrigger>
                <AccordionContent className="text-sm text-body">{product.description || 'No description available.'}</AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>

        {/* Related */}
        {related.length > 0 && (
          <div className="mt-16 lg:mt-24">
            <h2 className="text-2xl font-bold text-heading mb-8">You May Also Like</h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {related.map(p => <ProductCard key={p.node.id} product={p} />)}
            </div>
          </div>
        )}
      </motion.div>
    </Layout>
  );
};

export default ProductDetail;
