import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, X } from 'lucide-react';
import { Layout } from '@/components/Layout';
import { ProductCard, ProductCardSkeleton } from '@/components/ProductCard';
import { storefrontApiRequest, PRODUCTS_QUERY, type ShopifyProduct } from '@/lib/shopify';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { motion } from 'framer-motion';

const Shop = () => {
  const [products, setProducts] = useState<ShopifyProduct[]>([]);
  const [filtered, setFiltered] = useState<ShopifyProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();

  const sort = searchParams.get('sort') || 'newest';
  const searchQuery = searchParams.get('search') || '';
  const [localSearch, setLocalSearch] = useState(searchQuery);

  // Fetch all products once
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const data = await storefrontApiRequest(PRODUCTS_QUERY, { first: 24 });
        const edges: ShopifyProduct[] = data?.data?.products?.edges || [];
        setProducts(edges);
      } catch (error) {
        console.error('Failed to fetch products:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Filter + sort whenever products, search or sort changes
  useEffect(() => {
    let result = [...products];

    // Search filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(p =>
        p.node.title.toLowerCase().includes(q) ||
        p.node.description?.toLowerCase().includes(q) ||
        p.node.tags?.some(t => t.toLowerCase().includes(q))
      );
    }

    // Sort
    if (sort === 'price-asc') result.sort((a, b) =>
      parseFloat(a.node.priceRange.minVariantPrice.amount) -
      parseFloat(b.node.priceRange.minVariantPrice.amount)
    );
    if (sort === 'price-desc') result.sort((a, b) =>
      parseFloat(b.node.priceRange.minVariantPrice.amount) -
      parseFloat(a.node.priceRange.minVariantPrice.amount)
    );

    setFiltered(result);
  }, [products, searchQuery, sort]);

  // Sync local search input with URL param
  useEffect(() => { setLocalSearch(searchQuery); }, [searchQuery]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params: Record<string, string> = {};
    if (sort !== 'newest') params.sort = sort;
    if (localSearch.trim()) params.search = localSearch.trim();
    setSearchParams(params);
  };

  const clearSearch = () => {
    setLocalSearch('');
    const params: Record<string, string> = {};
    if (sort !== 'newest') params.sort = sort;
    setSearchParams(params);
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 lg:px-8 py-12 lg:py-16">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold text-heading">All Products</h1>
              <p className="text-body mt-1">
                {loading ? '...' : `${filtered.length} product${filtered.length !== 1 ? 's' : ''}${searchQuery ? ` for "${searchQuery}"` : ''}`}
              </p>
            </div>

            <div className="flex items-center gap-3">
              {/* Search bar */}
              <form onSubmit={handleSearchSubmit} className="relative flex items-center">
                <Search className="absolute left-3 h-4 w-4 text-muted-foreground pointer-events-none" />
                <input
                  type="text"
                  value={localSearch}
                  onChange={e => setLocalSearch(e.target.value)}
                  placeholder="Search products..."
                  className="h-10 w-48 sm:w-56 pl-9 pr-8 rounded-full border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                />
                {localSearch && (
                  <button type="button" onClick={clearSearch}
                    className="absolute right-3 text-muted-foreground hover:text-heading">
                    <X className="h-3.5 w-3.5" />
                  </button>
                )}
              </form>

              {/* Sort */}
              <Select value={sort} onValueChange={v => {
                const params: Record<string, string> = { sort: v };
                if (searchQuery) params.search = searchQuery;
                setSearchParams(params);
              }}>
                <SelectTrigger className="w-[160px] rounded-lg">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest</SelectItem>
                  <SelectItem value="price-asc">Price: Low to High</SelectItem>
                  <SelectItem value="price-desc">Price: High to Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Active search badge */}
          {searchQuery && (
            <div className="flex items-center gap-2 mb-6">
              <span className="text-sm text-muted-foreground">Results for:</span>
              <span className="inline-flex items-center gap-1.5 bg-primary/10 text-primary text-sm font-medium px-3 py-1 rounded-full">
                {searchQuery}
                <button onClick={clearSearch} className="hover:opacity-70">
                  <X className="h-3 w-3" />
                </button>
              </span>
            </div>
          )}

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {loading
              ? Array.from({ length: 8 }).map((_, i) => <ProductCardSkeleton key={i} />)
              : filtered.length > 0
                ? filtered.map(p => <ProductCard key={p.node.id} product={p} />)
                : (
                  <div className="col-span-full text-center py-16">
                    <div className="text-4xl mb-4">🔍</div>
                    <p className="text-lg font-semibold text-heading mb-2">
                      No products found{searchQuery ? ` for "${searchQuery}"` : ''}
                    </p>
                    <p className="text-muted-foreground text-sm mb-4">
                      Try a different search term
                    </p>
                    {searchQuery && (
                      <button onClick={clearSearch}
                        className="text-primary text-sm font-medium underline underline-offset-2">
                        Clear search
                      </button>
                    )}
                  </div>
                )
            }
          </div>
        </motion.div>
      </div>
    </Layout>
  );
};

export default Shop;
