import { useEffect, useState, useRef } from 'react';
import { storefrontApiRequest, PRODUCTS_QUERY, type ShopifyProduct } from '@/lib/shopify';
import { ProductCard, ProductCardSkeleton } from './ProductCard';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export const FeaturedProducts = () => {
  const [products, setProducts] = useState<ShopifyProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await storefrontApiRequest(PRODUCTS_QUERY, {
          first: 12,
          query: 'tag:featured',
        });
        let edges = data?.data?.products?.edges || [];
        if (edges.length === 0) {
          const fallback = await storefrontApiRequest(PRODUCTS_QUERY, { first: 12 });
          edges = fallback?.data?.products?.edges || [];
        }
        setProducts(edges);
      } catch (error) {
        console.error('Failed to fetch featured products:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const updateScrollButtons = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 0);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 1);
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener('scroll', updateScrollButtons);
    updateScrollButtons();
    return () => el.removeEventListener('scroll', updateScrollButtons);
  }, [products]);

  const scroll = (dir: 'left' | 'right') => {
    const el = scrollRef.current;
    if (!el) return;
    // Scroll exactly one card width at a time
    const card = el.querySelector('div') as HTMLElement;
    const cardWidth = card ? card.offsetWidth + 24 : 300;
    el.scrollBy({ left: dir === 'left' ? -cardWidth : cardWidth, behavior: 'smooth' });
  };

  return (
    <section className="w-full bg-background py-16 lg:py-24">
      <div className="container mx-auto px-4 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.3 }}
          className="flex items-center justify-between mb-12"
        >
          <div>
            <h2 className="text-3xl lg:text-4xl font-bold text-heading mb-3">Featured Products</h2>
            <p className="text-body max-w-md">Handpicked essentials loved by thousands across India.</p>
          </div>

          {!loading && products.length > 4 && (
            <div className="flex items-center gap-2 flex-shrink-0">
              <button
                onClick={() => scroll('left')}
                disabled={!canScrollLeft}
                className={`w-10 h-10 rounded-full border flex items-center justify-center transition-all ${
                  canScrollLeft
                    ? 'border-primary text-primary hover:bg-primary hover:text-white'
                    : 'border-border text-muted-foreground opacity-40 cursor-not-allowed'
                }`}
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={() => scroll('right')}
                disabled={!canScrollRight}
                className={`w-10 h-10 rounded-full border flex items-center justify-center transition-all ${
                  canScrollRight
                    ? 'border-primary text-primary hover:bg-primary hover:text-white'
                    : 'border-border text-muted-foreground opacity-40 cursor-not-allowed'
                }`}
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </motion.div>

        {/* Single horizontal scrollable row — always 4 cards visible */}
        <div
          ref={scrollRef}
          className="flex gap-6 overflow-x-auto scroll-smooth pb-2"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          <style>{`div::-webkit-scrollbar { display: none; }`}</style>
          {loading
            ? Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex-shrink-0" style={{ width: 'calc(25% - 18px)' }}>
                  <ProductCardSkeleton />
                </div>
              ))
            : products.length > 0
              ? products.map(p => (
                  <div key={p.node.id} className="flex-shrink-0" style={{ width: 'calc(25% - 18px)' }}>
                    <ProductCard product={p} />
                  </div>
                ))
              : <p className="text-center text-muted-foreground w-full">No products found.</p>
          }
        </div>
      </div>
    </section>
  );
};
