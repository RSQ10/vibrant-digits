import { ShoppingCart, Trash2, Minus, Plus, X, ArrowRight } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useCartStore } from '@/stores/cartStore';
import { toast } from 'sonner';

interface CartDrawerProps {
  open: boolean;
  onClose: () => void;
}

const CartDrawer = ({ open, onClose }: CartDrawerProps) => {
  const items = useCartStore((state) => state.items) || [];
  const checkoutUrl = useCartStore((state) => state.checkoutUrl);
  const removeItem = useCartStore((state) => state.removeItem);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const getTotal = useCartStore((state) => state.getTotal);
  const getItemCount = useCartStore((state) => state.getItemCount);

  const [checkoutLoading, setCheckoutLoading] = useState(false);

  const handleCheckout = async () => {
    if (!checkoutUrl) {
      toast.error('No items in cart or checkout not ready. Add an item first.');
      return;
    }
    setCheckoutLoading(true);
    window.location.href = checkoutUrl;
  };

  const total = getTotal();
  const itemCount = getItemCount();

  return (
    <>
      {/* Backdrop */}
      {open && (
        <div
          className="fixed inset-0 bg-black/40 z-40 transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-full max-w-md bg-white z-50 shadow-2xl flex flex-col transition-transform duration-300 ease-in-out ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-border">
          <div className="flex items-center gap-2">
            <ShoppingCart className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-bold text-heading">
              Cart
              {itemCount > 0 && (
                <span className="ml-2 text-sm font-semibold bg-primary text-primary-foreground rounded-full px-2 py-0.5">
                  {itemCount}
                </span>
              )}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-blue-soft transition-colors text-muted-foreground hover:text-heading"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-20 gap-4">
              <div className="w-16 h-16 rounded-full bg-blue-soft flex items-center justify-center">
                <ShoppingCart className="w-8 h-8 text-primary/50" />
              </div>
              <div>
                <p className="font-semibold text-heading text-lg">Your cart is empty</p>
                <p className="text-sm text-muted-foreground mt-1">Add items to get started</p>
              </div>
              <Button
                variant="outline"
                className="rounded-pill border-primary text-primary hover:bg-primary hover:text-primary-foreground mt-2"
                onClick={onClose}
              >
                Continue Shopping
              </Button>
            </div>
          ) : (
            items.map((item, index) => {
              const title = item.product?.node?.title || 'Product';
              const image = item.product?.node?.images?.edges?.[0]?.node?.url;
              const itemTotal = parseFloat(item.price.amount) * item.quantity;

              return (
                <div
                  key={`${item.variantId}-${index}`}
                  className="flex gap-4 p-4 rounded-card border border-border bg-white hover:shadow-default transition-shadow"
                >
                  {/* Image */}
                  <div className="w-20 h-20 rounded-lg overflow-hidden bg-surface flex-shrink-0">
                    {image ? (
                      <img
                        src={image}
                        alt={title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-blue-soft flex items-center justify-center text-xs text-muted-foreground">
                        No img
                      </div>
                    )}
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-heading truncate">{title}</p>
                    {item.variantTitle && item.variantTitle !== 'Default Title' && (
                      <p className="text-xs text-muted-foreground mt-0.5">{item.variantTitle}</p>
                    )}

                    {/* Quantity controls */}
                    <div className="flex items-center justify-between mt-3">
                      <div className="inline-flex items-center border border-border rounded-pill overflow-hidden">
                        <button
                          onClick={() => updateQuantity(item.variantId, item.quantity - 1)}
                          className="px-2.5 py-1.5 hover:bg-blue-soft transition-colors text-heading"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-3 py-1.5 text-xs font-bold text-heading border-x border-border min-w-[2rem] text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.variantId, item.quantity + 1)}
                          className="px-2.5 py-1.5 hover:bg-blue-soft transition-colors text-heading"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="text-sm font-bold text-heading">
                          ₹{itemTotal.toFixed(0)}
                        </span>
                        <button
                          onClick={() => {
                            removeItem(item.variantId);
                            toast.success(`${title} removed from cart`);
                          }}
                          className="p-1.5 rounded-full hover:bg-destructive/10 transition-colors text-muted-foreground hover:text-destructive"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-border px-6 py-5 space-y-4 bg-white">
            {/* Subtotal */}
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Subtotal</span>
              <span className="text-lg font-bold text-heading">₹{total.toFixed(0)}</span>
            </div>
            <p className="text-xs text-muted-foreground -mt-2">
              Shipping & taxes calculated at checkout
            </p>

            {/* Checkout Button */}
            <Button
              onClick={handleCheckout}
              disabled={checkoutLoading || !checkoutUrl}
              className="w-full rounded-pill bg-primary text-primary-foreground font-semibold py-3 h-auto hover:bg-primary/90 shadow-hover transition-all"
            >
              {checkoutLoading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  Redirecting...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  Proceed to Checkout
                  <ArrowRight className="w-4 h-4" />
                </span>
              )}
            </Button>

            {/* Continue shopping */}
            <button
              onClick={onClose}
              className="w-full text-sm text-primary font-medium hover:underline transition-all"
            >
              Continue Shopping
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default CartDrawer;
