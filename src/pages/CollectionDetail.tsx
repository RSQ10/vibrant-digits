import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import { storefrontApiRequest, COLLECTION_PRODUCTS_QUERY, type ShopifyProduct } from '@/lib/shopify';
import { ProductCard, ProductCardSkeleton } from '@/components/ProductCard';
import { ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

const CollectionDetail = () => {
  const { handle } = useParams<{ handle: string }>();
  const [products, setProducts] = useState<ShopifyProduct[]>([]);
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        const data = await storefrontApiRequest(COLLECTION_PRODUCTS_QUERY, { handle, first: 24 });
        const collection = data?.data?.collection;
        setTitle(collection?.title || '');
        setProducts(collection?.products?.edges || []);
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    };
    fetch();
  }, [handle]);

  return (
    <Layout>
      <div className="container mx-auto px-4 lg:px-8 py-12 lg:py-16">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center gap-1 text-sm text-muted-foreground mb-6">
            <Link to="/" className="hover:text-primary">Home</Link>
            <ChevronRight className="w-3 h-3" />
            <Link to="/collections" className="hover:text-primary">Collections</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-heading">{title}</span>
          </div>
          <h1 className="text-3xl lg:text-4xl font-bold text-heading mb-8">{title}</h1>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {loading
              ? Array.from({ length: 8 }).map((_, i) => <ProductCardSkeleton key={i} />)
              : products.length > 0
                ? products.map(p => <ProductCard key={p.node.id} product={p} />)
                : <p className="col-span-full text-center text-muted-foreground py-12">No products in this collection.</p>
            }
          </div>
        </motion.div>
      </div>
    </Layout>
  );
};

export default CollectionDetail;
