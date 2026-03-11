import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import { storefrontApiRequest, COLLECTIONS_QUERY, type ShopifyCollection } from '@/lib/shopify';
import { motion } from 'framer-motion';

const Collections = () => {
  const [collections, setCollections] = useState<ShopifyCollection[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await storefrontApiRequest(COLLECTIONS_QUERY, { first: 20 });
        setCollections(data?.data?.collections?.edges || []);
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    };
    fetch();
  }, []);

  return (
    <Layout>
      <div className="container mx-auto px-4 lg:px-8 py-12 lg:py-16">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-3xl lg:text-4xl font-bold text-heading mb-3">Collections</h1>
          <p className="text-body mb-8">Browse our curated collections.</p>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
            {loading
              ? Array.from({ length: 6 }).map((_, i) => <div key={i} className="aspect-[4/3] rounded-card shimmer" />)
              : collections.length > 0
                ? collections.map(c => (
                  <Link
                    key={c.node.id}
                    to={`/collections/${c.node.handle}`}
                    className="group relative rounded-card overflow-hidden aspect-[4/3] bg-surface shadow-default hover:shadow-hover transition-all duration-200"
                  >
                    {c.node.image && (
                      <img src={c.node.image.url} alt={c.node.image.altText || c.node.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute bottom-4 left-4">
                      <h3 className="text-lg font-semibold text-white">{c.node.title}</h3>
                    </div>
                  </Link>
                ))
                : <p className="col-span-full text-center text-muted-foreground">No collections found.</p>
            }
          </div>
        </motion.div>
      </div>
    </Layout>
  );
};

export default Collections;
