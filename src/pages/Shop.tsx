import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import { ProductCard, ProductCardSkeleton } from '@/components/ProductCard';
import { storefrontApiRequest, PRODUCTS_QUERY, type ShopifyProduct } from '@/lib/shopify';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { motion } from 'framer-motion';

const Shop = () => {
  const [products, setProducts] = useState<ShopifyProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const sort = searchParams.get('sort') || 'newest';

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const data = await storefrontApiRequest(PRODUCTS_QUERY, { first: 24 });
        let edges: ShopifyProduct[] = data?.data?.products?.edges || [];
        
        // Client-side sort
        if (sort === 'price-asc') edges = [...edges].sort((a, b) => parseFloat(a.node.priceRange.minVariantPrice.amount) - parseFloat(b.node.priceRange.minVariantPrice.amount));
        if (sort === 'price-desc') edges = [...edges].sort((a, b) => parseFloat(b.node.priceRange.minVariantPrice.amount) - parseFloat(a.node.priceRange.minVariantPrice.amount));
        
        setProducts(edges);
      } catch (error) {
        console.error('Failed to fetch products:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [sort]);

  return (
    <Layout>
      <div className="container mx-auto px-4 lg:px-8 py-12 lg:py-16">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold text-heading">All Products</h1>
              <p className="text-body mt-1">{loading ? '...' : `${products.length} products`}</p>
            </div>
            <Select value={sort} onValueChange={v => setSearchParams({ sort: v })}>
              <SelectTrigger className="w-[180px] rounded-lg">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest</SelectItem>
                <SelectItem value="price-asc">Price: Low to High</SelectItem>
                <SelectItem value="price-desc">Price: High to Low</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {loading
              ? Array.from({ length: 8 }).map((_, i) => <ProductCardSkeleton key={i} />)
              : products.length > 0
                ? products.map(p => <ProductCard key={p.node.id} product={p} />)
                : <p className="col-span-full text-center text-muted-foreground py-12">No products found.</p>
            }
          </div>
        </motion.div>
      </div>
    </Layout>
  );
};

export default Shop;
