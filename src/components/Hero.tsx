import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Lock, Star, Truck, Sparkles, ArrowRight } from 'lucide-react';
import { storefrontApiRequest, NEWEST_PRODUCTS_QUERY, type ShopifyProduct } from '@/lib/shopify';

const HeroProductCard = ({ product }: { product: ShopifyProduct }) => {
  const { node } = product;
  const firstVariant = node.variants.edges[0]?.node;
  const price = parseFloat(firstVariant?.price.amount || '0');
  const compareAt = firstVariant?.compareAtPrice ? parseFloat(firstVariant.compareAtPrice.amount) : null;
  const isOnSale = compareAt && compareAt > price;
  const discount = isOnSale ? Math.round(((compareAt - price) / compareAt) * 100) : 0;
  const image = node.images.edges[0]?.node.url;

  return (
    <Link to={`/product/${node.handle}`} className="group block">
      <div className="relative rounded-xl overflow-hidden bg-white shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
        <div className="aspect-square overflow-hidden">
          {image && (
            <img
              src={image}
              alt={node.images.edges[0]?.node.altText || node.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              loading="eager"
            />
          )}
        </div>
        {isOnSale && (
          <span className="absolute top-2 left-2 bg-primary text-primary-foreground text-[10px] font-bold px-2 py-0.5 rounded-full">
            -{discount}%
          </span>
        )}
        <div className="p-3">
          <h3 className="text-xs font-semibold text-heading truncate">{node.title}</h3>
          <div className="flex items-center gap-1.5 mt-1">
            <span className="text-sm font-bold text-primary">₹{price.toFixed(0)}</span>
            {isOnSale && (
              <span className="text-[10px] text-muted-foreground line-through">₹{compareAt.toFixed(0)}</span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};

const HeroProductSkeleton = () => (
  <div className="rounded-xl overflow-hidden bg-white shadow-md">
    <div className="aspect-square shimmer" />
    <div className="p-3">
      <div className="h-3 w-3/4 rounded shimmer mb-2" />
      <div className="h-4 w-1/2 rounded shimmer" />
    </div>
  </div>
);

export const Hero = () => {
  const [products, setProducts] = useState<ShopifyProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNewest = async () => {
      try {
        const data = await storefrontApiRequest(NEWEST_PRODUCTS_QUERY, { first: 4 });
        setProducts(data?.data?.products?.edges || []);
      } catch (e) {
        console.error('Failed to fetch newest products:', e);
      } finally {
        setLoading(false);
      }
    };
    fetchNewest();
  }, []);

  return (
    <section className="w-full bg-background overflow-hidden">
      <style>{`
        @keyframes hero-ring-spin {
          from { transform: translate(-50%,-50%) rotate(0deg) }
          to   { transform: translate(-50%,-50%) rotate(360deg) }
        }
        @keyframes hero-ring-spin-reverse {
          from { transform: translate(-50%,-50%) rotate(0deg) }
          to   { transform: translate(-50%,-50%) rotate(-360deg) }
        }
        @keyframes hero-glow-pulse {
          0%,100% { opacity: 0.4; transform: translate(-50%,-50%) scale(1) }
          50%     { opacity: 0.8; transform: translate(-50%,-50%) scale(1.12) }
        }
        @keyframes hero-dot-orbit {
          from { transform: rotate(0deg) }
          to   { transform: rotate(360deg) }
        }
        @keyframes hero-dot-orbit-reverse {
          from { transform: rotate(0deg) }
          to   { transform: rotate(-360deg) }
        }
        @keyframes hero-float {
          0%,100% { transform: translateY(0) }
          50% { transform: translateY(-8px) }
        }
        @keyframes hero-shimmer-bar {
          0% { transform: translateX(-100%) }
          100% { transform: translateX(200%) }
        }
      `}</style>

      <div className="container mx-auto px-4 lg:px-8 py-12 lg:py-20 flex flex-col lg:flex-row items-center gap-10 lg:gap-16">
        {/* Left Column */}
        <motion.div
          className="flex-1 max-w-xl"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        >
          <motion.span
            className="inline-flex items-center gap-2 bg-accent text-primary text-sm font-medium px-4 py-1.5 rounded-full mb-5"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.4 }}
          >
            <Sparkles className="w-4 h-4" /> New Arrivals Just Dropped
          </motion.span>

          <motion.h1
            className="text-4xl sm:text-5xl lg:text-[54px] font-extrabold text-heading leading-[1.1] mb-5"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.5 }}
          >
            Smart Gadgets,{' '}
            <span className="text-primary">Stunning</span>{' '}
            Home Décor.
          </motion.h1>

          <motion.p
            className="text-body text-lg mb-8 max-w-md leading-relaxed"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            Elevate your space with handpicked gadgets & décor pieces. Where technology meets elegance — delivered across India.
          </motion.p>

          <motion.div
            className="flex flex-wrap gap-3 mb-8"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55, duration: 0.5 }}
          >
            <Button asChild className="rounded-full px-8 h-12 text-base font-semibold shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-shadow">
              <Link to="/shop">
                Shop Now <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="rounded-full px-8 h-12 text-base border-primary text-primary hover:bg-primary hover:text-primary-foreground"
            >
              <Link to="/collections">Browse Collections</Link>
            </Button>
          </motion.div>

          <motion.div
            className="flex items-center gap-6 text-sm text-body"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.5 }}
          >
            <span className="flex items-center gap-1.5"><Lock className="w-4 h-4 text-primary" /> Secure Pay</span>
            <span className="flex items-center gap-1.5"><Star className="w-4 h-4 text-primary" /> 4.8★ Rated</span>
            <span className="flex items-center gap-1.5"><Truck className="w-4 h-4 text-primary" /> Fast Delivery</span>
          </motion.div>
        </motion.div>

        {/* Right Column — Product Grid with CSS animations */}
        <motion.div
          className="flex-1 relative overflow-hidden rounded-3xl min-h-[420px] lg:min-h-[480px]"
          style={{ background: 'hsl(var(--surface))' }}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {/* CSS Animated Background Elements */}
          {/* Ring 1 — Large */}
          <div
            className="pointer-events-none"
            style={{
              position: 'absolute', zIndex: 1,
              width: 340, height: 340, borderRadius: '50%',
              border: '1px solid hsl(var(--primary) / 0.08)',
              top: '50%', left: '50%',
              animation: 'hero-ring-spin 30s linear infinite',
            }}
          />
          {/* Ring 2 — Medium */}
          <div
            className="pointer-events-none"
            style={{
              position: 'absolute', zIndex: 1,
              width: 220, height: 220, borderRadius: '50%',
              border: '1px solid hsl(var(--primary) / 0.12)',
              top: '50%', left: '50%',
              animation: 'hero-ring-spin-reverse 20s linear infinite',
            }}
          />
          {/* Ring 3 — Small */}
          <div
            className="pointer-events-none"
            style={{
              position: 'absolute', zIndex: 1,
              width: 120, height: 120, borderRadius: '50%',
              border: '1px solid hsl(var(--primary) / 0.18)',
              top: '50%', left: '50%',
              animation: 'hero-ring-spin 14s linear infinite',
            }}
          />
          {/* Orbiting dot — large ring */}
          <div
            className="pointer-events-none"
            style={{
              position: 'absolute', zIndex: 1,
              width: 6, height: 6, borderRadius: '50%',
              background: 'hsl(var(--primary))',
              top: 'calc(50% - 170px)', left: '50%',
              transformOrigin: '0 170px',
              animation: 'hero-dot-orbit 30s linear infinite',
            }}
          />
          {/* Orbiting dot — medium ring */}
          <div
            className="pointer-events-none"
            style={{
              position: 'absolute', zIndex: 1,
              width: 4, height: 4, borderRadius: '50%',
              background: 'hsl(var(--primary) / 0.5)',
              top: 'calc(50% - 110px)', left: '50%',
              transformOrigin: '0 110px',
              animation: 'hero-dot-orbit-reverse 20s linear infinite',
            }}
          />
          {/* Center glow */}
          <div
            className="pointer-events-none"
            style={{
              position: 'absolute', zIndex: 1,
              width: 260, height: 260, borderRadius: '50%',
              background: 'radial-gradient(circle, hsl(var(--primary) / 0.06) 0%, transparent 70%)',
              top: '50%', left: '50%',
              animation: 'hero-glow-pulse 5s ease-in-out infinite',
            }}
          />

          {/* Product Grid */}
          <div className="relative z-10 p-6 lg:p-8">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-sm font-bold text-heading uppercase tracking-wider">Just Added</h3>
              <Link to="/shop" className="text-xs font-semibold text-primary hover:underline flex items-center gap-1">
                View All <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {loading
                ? Array.from({ length: 4 }).map((_, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 + i * 0.1 }}
                    >
                      <HeroProductSkeleton />
                    </motion.div>
                  ))
                : products.length > 0
                  ? products.map((p, i) => (
                      <motion.div
                        key={p.node.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 + i * 0.12, duration: 0.5 }}
                        style={{ animation: `hero-float ${3 + i * 0.5}s ease-in-out infinite ${i * 0.7}s` }}
                      >
                        <HeroProductCard product={p} />
                      </motion.div>
                    ))
                  : (
                    <p className="col-span-2 text-center text-muted-foreground text-sm py-8">
                      No products found.
                    </p>
                  )
              }
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
