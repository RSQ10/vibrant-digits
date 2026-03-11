import { useEffect, useState } from 'react';
import { storefrontApiRequest, PRODUCTS_QUERY, type ShopifyProduct } from '@/lib/shopify';
import { ProductCard, ProductCardSkeleton } from './ProductCard';
import { motion } from 'framer-motion';

export const FeaturedProducts = () => {
  const [products, setProducts] = useState<ShopifyProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // Try featured tag first, fallback to first 4
        let data = await storefrontApiRequest(PRODUCTS_QUERY, { first: 4, query: 'tag:featured' });
        let edges = data?.data?.products?.edges || [];
        if (edges.length === 0) {
          data = await storefrontApiRequest(PRODUCTS_QUERY, { first: 4 });
          edges = data?.data?.products?.edges || [];
        }
        setProducts(edges);
      } catch (error) {
        console.error('Failed to fetch products:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  return (
    <section className="w-full bg-background py-16 lg:py-24">
      <div className="container mx-auto px-4 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.3 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl lg:text-4xl font-bold text-heading mb-3">Featured Products</h2>
          <p className="text-body max-w-md mx-auto">Handpicked essentials loved by thousands across India.</p>
        </motion.div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {loading
            ? Array.from({ length: 4 }).map((_, i) => <ProductCardSkeleton key={i} />)
            : products.length > 0
              ? products.map(p => <ProductCard key={p.node.id} product={p} />)
              : <p className="col-span-full text-center text-muted-foreground">No products found.</p>
          }
        </div>
      </div>
    </section>
  );
};
