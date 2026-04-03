import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import { storefrontApiRequest, COLLECTIONS_QUERY, type ShopifyCollection } from '@/lib/shopify';
import { motion } from 'framer-motion';
import { ChevronRight, Layers } from 'lucide-react';

const COLLECTION_ICONS: Record<string, string> = {
  'frontpage': '🏠',
  'watches': '⌚',
  'jewelry': '💎',
  'gadgets': '⚡',
  'home': '🏡',
  'beauty': '✨',
  'fashion': '👗',
  'electronics': '📱',
  'kitchen': '🍳',
  'fitness': '💪',
  'default': '🛍️',
};

function getIcon(handle: string, title: string): string {
  const key = Object.keys(COLLECTION_ICONS).find(k =>
    handle.toLowerCase().includes(k) || title.toLowerCase().includes(k)
  );
  return key ? COLLECTION_ICONS[key] : COLLECTION_ICONS['default'];
}

const Collections = () => {
  const [collections, setCollections] = useState<ShopifyCollection[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCollections = async () => {
      try {
        const data = await storefrontApiRequest(COLLECTIONS_QUERY, { first: 20 });
        const all = data?.data?.collections?.edges || [];
        // Filter out frontpage from collections listing
        setCollections(all.filter((c: ShopifyCollection) => c.node.handle !== 'frontpage'));
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    };
    fetchCollections();
  }, []);

  return (
    <Layout>
      <div className="container mx-auto px-4 lg:px-8 py-12 lg:py-16">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>

          {/* Header */}
          <div className="mb-10">
            <h1 className="text-3xl lg:text-4xl font-bold text-heading mb-2">Shop by Category</h1>
            <p className="text-body">Find exactly what you're looking for.</p>
          </div>

          {/* Category Pills Grid */}
          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="h-24 rounded-2xl bg-blue-soft shimmer" />
              ))}
            </div>
          ) : collections.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {collections.map((c, i) => (
                <motion.div
                  key={c.node.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Link
                    to={`/collections/${c.node.handle}`}
                    className="group flex items-center gap-4 bg-blue-soft hover:bg-primary/10 border border-border hover:border-primary rounded-2xl px-5 py-4 transition-all duration-200"
                  >
                    {c.node.image ? (
                      <div className="w-12 h-12 rounded-xl overflow-hidden flex-shrink-0 bg-white shadow-sm">
                        <img
                          src={c.node.image.url}
                          alt={c.node.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                      </div>
                    ) : (
                      <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center flex-shrink-0 shadow-sm text-2xl">
                        {getIcon(c.node.handle, c.node.title)}
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-heading text-sm truncate group-hover:text-primary transition-colors">
                        {c.node.title}
                      </p>
                      {c.node.description && (
                        <p className="text-xs text-muted-foreground truncate mt-0.5">
                          {c.node.description}
                        </p>
                      )}
                    </div>
                    <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary flex-shrink-0 transition-colors" />
                  </Link>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-24">
              <Layers className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No collections found.</p>
              <p className="text-sm text-muted-foreground mt-1">Add collections in Shopify Admin to see them here.</p>
            </div>
          )}
        </motion.div>
      </div>
    </Layout>
  );
};

export default Collections;
