import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Minus, Plus, ShoppingCart, Zap, Star } from 'lucide-react';
import { Layout } from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { storefrontApiRequest, PRODUCT_BY_HANDLE_QUERY, type ShopifyProduct } from '@/lib/shopify';
import { useCartStore, OUT_OF_STOCK } from '@/stores/cartStore';
import { toast } from 'sonner';
import { ReviewSection } from '@/lib/ReviewSection';

// ─── Delivery Estimation ──────────────────────────────────────────────────────
function getDeliveryRange(): string {
  const now = new Date();
  const start = new Date(now);
  const end = new Date(now);
  start.setDate(now.getDate() + 3);
  end.setDate(now.getDate() + 5);
  const fmt = (d: Date) =>
    d.toLocaleDateString('en-IN', { weekday: 'short', month: 'short', day: 'numeric' });
  return `${fmt(start)} – ${fmt(end)}`;
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────
const ProductDetailSkeleton = () => (
  <Layout>
    <div className="max-w-6xl mx-auto px-4 py-10 animate-pulse">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <div className="space-y-4">
          <div className="aspect-square rounded-card bg-blue-soft shimmer" />
          <div className="flex gap-2">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="w-16 h-16 rounded-lg bg-blue-soft shimmer" />
            ))}
          </div>
        </div>
        <div className="space-y-4 py-4">
          <div className="h-8 w-3/4 bg-blue-soft rounded shimmer" />
          <div className="h-5 w-1/3 bg-blue-soft rounded shimmer" />
          <div className="h-6 w-1/4 bg-blue-soft rounded shimmer" />
          <div className="h-20 w-full bg-blue-soft rounded shimmer" />
          <div className="h-12 w-full bg-blue-soft rounded-pill shimmer" />
          <div className="h-12 w-full bg-blue-soft rounded-pill shimmer" />
        </div>
      </div>
    </div>
  </Layout>
);

// ─── Main Component ───────────────────────────────────────────────────────────
const ProductDetail = () => {
  const { handle } = useParams<{ handle: string }>();
  const navigate = useNavigate();

  const [product, setProduct] = useState<ShopifyProduct['node'] | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});
  const [quantity, setQuantity] = useState(1);
  const [buyNowLoading, setBuyNowLoading] = useState(false);
  const [addToCartLoading, setAddToCartLoading] = useState(false);

  const addItem = useCartStore((state) => state.addItem);
  const deliveryRange = getDeliveryRange();

  useEffect(() => {
    if (!handle) return;
    setLoading(true);
    storefrontApiRequest(PRODUCT_BY_HANDLE_QUERY, { handle })
      .then((data) => {
        const p = data?.data?.productByHandle || null;
        setProduct(p);
        if (p?.options) {
          const defaults: Record<string, string> = {};
          p.options.forEach((opt: { name: string; values: string[] }) => {
            defaults[opt.name] = opt.values[0];
          });
          setSelectedOptions(defaults);
        }
      })
      .catch(() => setProduct(null))
      .finally(() => setLoading(false));
  }, [handle]);

  if (loading) return <ProductDetailSkeleton />;
  if (!product) {
    return (
      <Layout>
        <div className="max-w-6xl mx-auto px-4 py-20 text-center">
          <h2 className="text-2xl font-bold text-heading mb-4">Product not found</h2>
          <Button onClick={() => navigate('/shop')} variant="outline" className="rounded-pill">
            Back to Shop
          </Button>
        </div>
      </Layout>
    );
  }

  const images = product.images.edges.map((e) => e.node);
  const variants = product.variants.edges.map((e) => e.node);

  const selectedVariant = variants.find((v) =>
    v.selectedOptions.every((opt) => selectedOptions[opt.name] === opt.value)
  ) || variants[0];

  const price = parseFloat(selectedVariant?.price.amount || '0');
  const compareAt = selectedVariant?.compareAtPrice
    ? parseFloat(selectedVariant.compareAtPrice.amount)
    : null;
  const isOnSale = compareAt && compareAt > price;
  const discount = isOnSale ? Math.round(((compareAt - price) / compareAt) * 100) : 0;
  const available = selectedVariant?.availableForSale === true;

  const handleOptionSelect = (optionName: string, value: string) => {
    setSelectedOptions((prev) => ({ ...prev, [optionName]: value }));
  };

  const handleImageNav = (dir: 'prev' | 'next') => {
    setActiveImageIndex((i) =>
      dir === 'prev'
        ? (i - 1 + images.length) % images.length
        : (i + 1) % images.length
    );
  };

  const buildCartItem = () => ({
    product: { node: product },
    variantId: selectedVariant.id,
    variantTitle: selectedVariant.title,
    price: selectedVariant.price,
    quantity,
    selectedOptions: selectedVariant.selectedOptions || [],
  });

  const handleAddToCart = async () => {
    if (!selectedVariant || !available) return;
    setAddToCartLoading(true);
    try {
      const result = await addItem(buildCartItem());
      if (result === OUT_OF_STOCK) {
        toast.error('This product is out of stock.');
      } else if (result) {
        toast.success(`${product.title} added to cart!`);
      } else {
        toast.error('Failed to add to cart. Please try again.');
      }
    } catch {
      toast.error('Failed to add to cart. Please try again.');
    } finally {
      setAddToCartLoading(false);
    }
  };

  const handleBuyNow = async () => {
    if (!selectedVariant || !available) return;
    setBuyNowLoading(true);
    try {
      const result = await addItem(buildCartItem());
      if (result === OUT_OF_STOCK) {
        toast.error('This product is out of stock.');
      } else if (result && result !== OUT_OF_STOCK) {
        window.location.href = result;
      } else {
        toast.error('Could not start checkout. Please try again.');
      }
    } catch {
      toast.error('Checkout failed. Please try again.');
    } finally {
      setBuyNowLoading(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">

        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
          <button onClick={() => navigate('/')} className="hover:text-primary transition-colors">Home</button>
          <span>/</span>
          <button onClick={() => navigate('/shop')} className="hover:text-primary transition-colors">Shop</button>
          <span>/</span>
          <span className="text-heading font-medium truncate max-w-[200px]">{product.title}</span>
        </nav>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16">

          {/* Left: Images */}
          <div className="space-y-4">
            <div className="relative aspect-square rounded-card overflow-hidden bg-surface shadow-default group">
              {images.length > 0 ? (
                <img
                  src={images[activeImageIndex]?.url}
                  alt={images[activeImageIndex]?.altText || product.title}
                  className="w-full h-full object-cover transition-all duration-300"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-muted-foreground">No image</div>
              )}
              {isOnSale && (
                <span className="absolute top-4 left-4 bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-pill">
                  {discount}% OFF
                </span>
              )}
              {!available && (
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <span className="bg-white text-heading font-bold px-6 py-2 rounded-pill text-sm">Out of Stock</span>
                </div>
              )}
              {images.length > 1 && (
                <>
                  <button onClick={() => handleImageNav('prev')} className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-1.5 shadow-default opacity-0 group-hover:opacity-100 transition-opacity">
                    <ChevronLeft className="w-4 h-4 text-heading" />
                  </button>
                  <button onClick={() => handleImageNav('next')} className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-1.5 shadow-default opacity-0 group-hover:opacity-100 transition-opacity">
                    <ChevronRight className="w-4 h-4 text-heading" />
                  </button>
                </>
              )}
            </div>
            {images.length > 1 && (
              <div className="flex gap-2 flex-wrap">
                {images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImageIndex(i)}
                    className={`w-16 h-16 rounded-lg overflow-hidden border-2 transition-all duration-200 flex-shrink-0 ${
                      i === activeImageIndex ? 'border-primary shadow-hover' : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <img src={img.url} alt={img.altText || `${product.title} ${i + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right: Details */}
          <div className="flex flex-col gap-6">

            {/* Title & Tags */}
            <div>
              {product.tags?.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-3">
                  {product.tags.slice(0, 3).map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs rounded-pill">{tag}</Badge>
                  ))}
                </div>
              )}
              <h1 className="text-2xl sm:text-3xl font-bold text-heading leading-tight">{product.title}</h1>
            </div>

            {/* Rating */}
            <div className="flex items-center gap-1.5">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              ))}
              <span className="text-sm text-muted-foreground ml-1">(4.8)</span>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-bold text-heading">₹{price.toFixed(0)}</span>
              {isOnSale && compareAt && (
                <>
                  <span className="text-lg text-muted-foreground line-through">₹{compareAt.toFixed(0)}</span>
                  <span className="text-sm font-semibold text-green-600 bg-green-50 px-2 py-0.5 rounded-pill">Save {discount}%</span>
                </>
              )}
            </div>

            {/* Delivery */}
            {available && (
              <div className="flex items-center gap-2.5 bg-green-50 border border-green-200 rounded-xl px-4 py-3">
                <span className="text-green-600 text-base">🚚</span>
                <div className="text-sm">
                  <span className="text-green-800 font-semibold">Estimated delivery: </span>
                  <span className="text-green-700 font-medium">{deliveryRange}</span>
                </div>
              </div>
            )}

            {/* Stock */}
            <div>
              {available ? (
                <span className="inline-flex items-center gap-1.5 text-sm font-medium text-green-600">
                  <span className="w-2 h-2 rounded-full bg-green-500 inline-block" />In Stock
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 text-sm font-medium text-destructive">
                  <span className="w-2 h-2 rounded-full bg-destructive inline-block" />Out of Stock
                </span>
              )}
            </div>

            {/* Variants */}
            {product.options
              ?.filter((opt) => !(opt.values.length === 1 && opt.values[0] === 'Default Title'))
              .map((option) => (
                <div key={option.name}>
                  <p className="text-sm font-semibold text-heading mb-2">
                    {option.name}: <span className="font-normal text-body">{selectedOptions[option.name]}</span>
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {option.values.map((val) => (
                      <button
                        key={val}
                        onClick={() => handleOptionSelect(option.name, val)}
                        className={`px-4 py-2 rounded-pill text-sm font-medium border transition-all duration-200 ${
                          selectedOptions[option.name] === val
                            ? 'bg-primary text-primary-foreground border-primary shadow-hover'
                            : 'bg-white text-body border-border hover:border-primary hover:text-primary'
                        }`}
                      >
                        {val}
                      </button>
                    ))}
                  </div>
                </div>
              ))}

            {/* Quantity */}
            {available && (
              <div>
                <p className="text-sm font-semibold text-heading mb-2">Quantity</p>
                <div className="inline-flex items-center border border-border rounded-pill overflow-hidden">
                  <button onClick={() => setQuantity((q) => Math.max(1, q - 1))} className="px-4 py-2.5 hover:bg-blue-soft transition-colors text-heading" disabled={quantity <= 1}>
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="px-5 py-2.5 text-sm font-semibold text-heading min-w-[3rem] text-center border-x border-border">{quantity}</span>
                  <button onClick={() => setQuantity((q) => q + 1)} className="px-4 py-2.5 hover:bg-blue-soft transition-colors text-heading">
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              {available ? (
                <>
                  <Button onClick={handleBuyNow} disabled={buyNowLoading} className="flex-1 rounded-pill bg-primary text-primary-foreground font-semibold py-3 h-auto hover:bg-primary/90 transition-all shadow-hover">
                    {buyNowLoading ? (
                      <span className="flex items-center gap-2">
                        <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />Processing...
                      </span>
                    ) : (
                      <span className="flex items-center gap-2"><Zap className="w-4 h-4" />Buy Now</span>
                    )}
                  </Button>
                  <Button variant="outline" onClick={handleAddToCart} disabled={addToCartLoading} className="flex-1 rounded-pill border-primary text-primary font-semibold py-3 h-auto hover:bg-primary hover:text-primary-foreground transition-all">
                    {addToCartLoading ? (
                      <span className="flex items-center gap-2">
                        <span className="w-4 h-4 border-2 border-primary/40 border-t-primary rounded-full animate-spin" />Adding...
                      </span>
                    ) : (
                      <span className="flex items-center gap-2"><ShoppingCart className="w-4 h-4" />Add to Cart</span>
                    )}
                  </Button>
                </>
              ) : (
                <Button disabled className="flex-1 rounded-pill bg-muted text-muted-foreground font-semibold py-3 h-auto cursor-not-allowed">Out of Stock</Button>
              )}
            </div>

            {/* Description */}
            {product.description && (
              <div className="pt-4 border-t border-border">
                <h3 className="text-sm font-semibold text-heading mb-3">Description</h3>
                <p className="text-sm text-body leading-relaxed whitespace-pre-line">{product.description}</p>
              </div>
            )}

            {/* Trust badges */}
            <div className="grid grid-cols-3 gap-3 pt-2">
              {[
                { icon: '🔒', label: 'Secure Payment' },
                { icon: '🚚', label: 'Fast Shipping' },
                { icon: '↩️', label: 'Easy Returns' },
              ].map((b) => (
                <div key={b.label} className="flex flex-col items-center gap-1 p-3 rounded-card bg-blue-soft text-center">
                  <span className="text-lg">{b.icon}</span>
                  <span className="text-xs font-medium text-body">{b.label}</span>
                </div>
              ))}
            </div>

            {/* ── Reviews ── */}
            <ReviewSection
              productHandle={product.handle}
              productTitle={product.title}
            />

          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ProductDetail;
