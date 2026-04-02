import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Loader2, Check, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCartStore, OUT_OF_STOCK } from '@/stores/cartStore';
import type { ShopifyProduct } from '@/lib/shopify';
import { toast } from 'sonner';

interface ProductCardProps {
  product: ShopifyProduct;
}

export const ProductCard = ({ product }: ProductCardProps) => {
  const { node } = product;
  const addItem = useCartStore(state => state.addItem);
  const isLoading = useCartStore(state => state.isLoading);
  const [added, setAdded] = useState(false);
  const [hovered, setHovered] = useState(false);

  const firstVariant = node.variants.edges[0]?.node;
  const price = parseFloat(firstVariant?.price.amount || '0');
  const compareAt = firstVariant?.compareAtPrice ? parseFloat(firstVariant.compareAtPrice.amount) : null;
  const isOnSale = compareAt && compareAt > price;
  const discount = isOnSale ? Math.round(((compareAt - price) / compareAt) * 100) : 0;

  // Use Shopify's availableForSale as the source of truth
  const available = firstVariant?.availableForSale === true;

  const image1 = node.images.edges[0]?.node.url;
  const image2 = node.images.edges[1]?.node.url;

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!firstVariant || !available) return;

    const result = await addItem({
      product,
      variantId: firstVariant.id,
      variantTitle: firstVariant.title,
      price: firstVariant.price,
      quantity: 1,
      selectedOptions: firstVariant.selectedOptions || [],
    });

    if (result === OUT_OF_STOCK) {
      toast.error(`${node.title} is out of stock.`);
    } else if (result) {
      setAdded(true);
      toast.success(`${node.title} added to cart!`);
      setTimeout(() => setAdded(false), 1500);
    } else {
      toast.error('Failed to add to cart. Please try again.');
    }
  };

  return (
    <Link
      to={`/product/${node.handle}`}
      className="group block"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="relative rounded-card overflow-hidden bg-surface aspect-square mb-3 shadow-default transition-shadow duration-200 group-hover:shadow-hover">
        {image1 && (
          <img
            src={hovered && image2 ? image2 : image1}
            alt={node.images.edges[0]?.node.altText || node.title}
            className={`w-full h-full object-cover transition-all duration-300 ${!available ? 'opacity-60' : ''}`}
            loading="lazy"
          />
        )}

        {isOnSale && available && (
          <span className="absolute top-3 left-3 bg-primary text-primary-foreground text-xs font-semibold px-3 py-1 rounded-pill">
            {discount}% OFF
          </span>
        )}

        {!available && (
          <div className="absolute inset-0 flex items-end justify-center pb-3">
            <span className="bg-white/90 text-heading text-xs font-semibold px-4 py-1.5 rounded-pill shadow-default">
              Out of Stock
            </span>
          </div>
        )}
      </div>

      <h3 className="text-sm font-semibold text-heading mb-1 truncate">{node.title}</h3>
      <div className="flex items-center gap-2 mb-3">
        {isOnSale && compareAt && (
          <span className="text-sm text-muted-foreground line-through">₹{compareAt.toFixed(0)}</span>
        )}
        <span className="text-sm font-bold text-heading">₹{price.toFixed(0)}</span>
        {isOnSale && (
          <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-0.5 rounded-pill">{discount}% OFF</span>
        )}
      </div>

      {available ? (
        <Button
          variant="outline"
          className="w-full rounded-pill border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-colors duration-200"
          onClick={handleAddToCart}
          disabled={isLoading}
        >
          {isLoading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : added ? (
            <><Check className="w-4 h-4 mr-1" />Added</>
          ) : (
            <><ShoppingCart className="w-4 h-4 mr-1" />Add to Cart</>
          )}
        </Button>
      ) : (
        <Button
          disabled
          variant="outline"
          className="w-full rounded-pill border-border text-muted-foreground cursor-not-allowed"
        >
          Out of Stock
        </Button>
      )}
    </Link>
  );
};

export const ProductCardSkeleton = () => (
  <div className="block">
    <div className="rounded-card overflow-hidden bg-blue-soft aspect-square mb-3 shimmer" />
    <div className="h-4 w-3/4 bg-blue-soft rounded shimmer mb-2" />
    <div className="h-4 w-1/2 bg-blue-soft rounded shimmer mb-3" />
    <div className="h-10 w-full bg-blue-soft rounded-pill shimmer" />
  </div>
);
