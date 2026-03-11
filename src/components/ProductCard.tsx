import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Loader2, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCartStore } from '@/stores/cartStore';
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

  const image1 = node.images.edges[0]?.node.url;
  const image2 = node.images.edges[1]?.node.url;

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!firstVariant) return;
    await addItem({
      product,
      variantId: firstVariant.id,
      variantTitle: firstVariant.title,
      price: firstVariant.price,
      quantity: 1,
      selectedOptions: firstVariant.selectedOptions || [],
    });
    setAdded(true);
    toast.success(`${node.title} added to cart`);
    setTimeout(() => setAdded(false), 1500);
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
            className="w-full h-full object-cover transition-all duration-300"
            loading="lazy"
          />
        )}
        {isOnSale && (
          <span className="absolute top-3 left-3 bg-primary text-primary-foreground text-xs font-semibold px-3 py-1 rounded-pill">
            SALE
          </span>
        )}
      </div>
      <h3 className="text-sm font-semibold text-heading mb-1 truncate">{node.title}</h3>
      <div className="flex items-center gap-2 mb-3">
        {isOnSale && (
          <span className="text-sm text-muted-foreground line-through">₹{compareAt.toFixed(0)}</span>
        )}
        <span className="text-sm font-bold text-heading">₹{price.toFixed(0)}</span>
        {isOnSale && (
          <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-0.5 rounded-pill">{discount}% OFF</span>
        )}
      </div>
      <Button
        variant="outline"
        className="w-full rounded-pill border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-colors duration-200"
        onClick={handleAddToCart}
        disabled={isLoading}
      >
        {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : added ? <><Check className="w-4 h-4 mr-1" />Added</> : 'Add to Cart'}
      </Button>
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
