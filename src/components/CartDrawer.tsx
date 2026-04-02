import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { ShoppingCart, Minus, Plus, Trash2, ExternalLink, Loader2, CreditCard, Banknote, Gift, X, ShieldCheck, Sparkles } from "lucide-react";
import { useCartStore } from "@/stores/cartStore";
import { createCartWithItems } from "@/lib/shopify";
import { motion, AnimatePresence } from "framer-motion";

const PrepaidPopup = ({
  open,
  onClose,
  totalPrice,
  onPayPrepaid,
  onPayCOD,
}: {
  open: boolean;
  onClose: () => void;
  totalPrice: number;
  onPayPrepaid: () => void;
  onPayCOD: () => void;
}) => {
  if (!open) return null;

  return createPortal(
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center">
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            className="relative z-10 w-[92vw] max-w-md rounded-2xl bg-background shadow-2xl overflow-hidden"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-background/80 flex items-center justify-center hover:bg-muted transition-colors"
            >
              <X className="w-4 h-4 text-muted-foreground" />
            </button>

            {/* Header with gradient */}
            <div className="relative bg-gradient-to-br from-primary via-primary to-primary/80 p-6 pb-8 text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="mx-auto mb-3 w-16 h-16 rounded-full bg-primary-foreground/20 backdrop-blur-sm flex items-center justify-center"
              >
                <Sparkles className="w-8 h-8 text-primary-foreground" />
              </motion.div>
              <h2 className="text-xl font-bold text-primary-foreground mb-1">
                Save ₹40 Instantly! 🎉
              </h2>
              <p className="text-sm text-primary-foreground/80">
                Switch to online payment & save more
              </p>
              {/* Price comparison */}
              <div className="mt-4 inline-flex items-center gap-3 bg-primary-foreground/15 backdrop-blur-sm rounded-full px-5 py-2">
                <span className="text-primary-foreground/60 line-through text-sm">₹{totalPrice.toFixed(0)}</span>
                <span className="text-primary-foreground font-bold text-lg">₹{Math.max(0, totalPrice - 40).toFixed(0)}</span>
              </div>
            </div>

            {/* Options */}
            <div className="p-5 space-y-3">
              {/* Prepaid - Recommended */}
              <motion.button
                onClick={onPayPrepaid}
                className="w-full flex items-center gap-4 p-4 rounded-xl border-2 border-primary bg-primary/5 hover:bg-primary/10 transition-all cursor-pointer relative overflow-hidden"
                whileHover={{ scale: 1.015 }}
                whileTap={{ scale: 0.99 }}
              >
                <span className="absolute top-0 right-0 bg-primary text-primary-foreground text-[10px] font-bold px-2.5 py-0.5 rounded-bl-lg">
                  RECOMMENDED
                </span>
                <div className="w-11 h-11 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                  <CreditCard className="w-5 h-5 text-primary-foreground" />
                </div>
                <div className="flex-1 text-left">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-heading text-sm">Pay Online</span>
                    <span className="text-[10px] font-bold bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full">SAVE ₹40</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">UPI · Cards · Net Banking · Wallets</p>
                </div>
                <div className="text-right flex-shrink-0 pr-1">
                  <div className="text-sm font-bold text-primary">₹{Math.max(0, totalPrice - 40).toFixed(0)}</div>
                </div>
              </motion.button>

              {/* COD */}
              <motion.button
                onClick={onPayCOD}
                className="w-full flex items-center gap-4 p-4 rounded-xl border border-border hover:border-muted-foreground/30 transition-all cursor-pointer"
                whileHover={{ scale: 1.015 }}
                whileTap={{ scale: 0.99 }}
              >
                <div className="w-11 h-11 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                  <Banknote className="w-5 h-5 text-muted-foreground" />
                </div>
                <div className="flex-1 text-left">
                  <span className="font-medium text-body text-sm">Cash on Delivery</span>
                  <p className="text-xs text-muted-foreground mt-0.5">Pay when you receive your order</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <div className="text-sm font-semibold text-body">₹{totalPrice.toFixed(0)}</div>
                </div>
              </motion.button>

              <div className="flex items-center justify-center gap-1.5 pt-2 text-muted-foreground">
                <ShieldCheck className="w-3.5 h-3.5" />
                <p className="text-[11px]">100% secure · Free shipping on prepaid</p>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
};

export const CartDrawer = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showPrepaidPopup, setShowPrepaidPopup] = useState(false);
  const [cartCheckoutUrl, setCartCheckoutUrl] = useState<string | null>(null);
  const [preparing, setPreparing] = useState(false);
  const { items, isLoading, updateQuantity, removeItem } = useCartStore();
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce((sum, item) => sum + (parseFloat(item.price.amount) * item.quantity), 0);

  const handlePrepareCheckout = async () => {
    setPreparing(true);
    const lines = items.map(item => ({
      variantId: item.variantId,
      quantity: item.quantity,
    }));
    const url = await createCartWithItems(lines);
    if (url) setCartCheckoutUrl(url);
    setPreparing(false);
  };

  const handleCheckout = () => {
    setIsOpen(false);
    setTimeout(() => setShowPrepaidPopup(true), 300);
  };

  return (
    <>
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="relative">
            <ShoppingCart className="h-5 w-5" />
            {totalItems > 0 && (
              <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs bg-primary text-primary-foreground animate-bounce-badge">
                {totalItems}
              </Badge>
            )}
          </Button>
        </SheetTrigger>
        <SheetContent className="w-full sm:max-w-lg flex flex-col h-full">
          <SheetHeader>
            <SheetTitle>Shopping Cart</SheetTitle>
            <SheetDescription>
              {totalItems === 0 ? "Your cart is empty" : `${totalItems} item${totalItems !== 1 ? 's' : ''} in your cart`}
            </SheetDescription>
          </SheetHeader>
          <div className="flex flex-col flex-1 pt-6 min-h-0">
            {items.length === 0 ? (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <ShoppingCart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">Your cart is empty</p>
                </div>
              </div>
            ) : (
              <>
                <div className="flex-1 overflow-y-auto pr-2 min-h-0 space-y-4">
                  {items.map((item) => (
                    <div key={item.variantId} className="flex gap-4 p-3 rounded-card bg-surface">
                      <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-blue-soft">
                        {item.product.node.images?.edges?.[0]?.node && (
                          <img src={item.product.node.images.edges[0].node.url} alt={item.product.node.title} className="w-full h-full object-cover" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm truncate text-heading">{item.product.node.title}</h4>
                        <p className="text-xs text-muted-foreground">{item.selectedOptions.map(o => o.value).join(' · ')}</p>
                        <p className="font-semibold text-sm mt-1">₹{parseFloat(item.price.amount).toFixed(0)}</p>
                      </div>
                      <div className="flex flex-col items-end gap-2 flex-shrink-0">
                        <Button variant="ghost" size="icon" className="h-6 w-6 text-muted-foreground hover:text-destructive" onClick={() => removeItem(item.variantId)}>
                          <Trash2 className="h-3 w-3" />
                        </Button>
                        <div className="flex items-center gap-1">
                          <Button variant="outline" size="icon" className="h-6 w-6 rounded-full" onClick={() => updateQuantity(item.variantId, item.quantity - 1)}>
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="w-6 text-center text-xs font-medium">{item.quantity}</span>
                          <Button variant="outline" size="icon" className="h-6 w-6 rounded-full" onClick={() => updateQuantity(item.variantId, item.quantity + 1)}>
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex-shrink-0 space-y-4 pt-4 border-t">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold text-heading">Total</span>
                    <span className="text-xl font-bold text-primary">₹{totalPrice.toFixed(0)}</span>
                  </div>
                  <Button onClick={handleCheckout} className="w-full rounded-pill" size="lg" disabled={items.length === 0 || isLoading || preparing}>
                    {isLoading || preparing ? <Loader2 className="w-4 h-4 animate-spin" /> : <><ExternalLink className="w-4 h-4 mr-2" />Proceed to Checkout</>}
                  </Button>
                  <p className="text-xs text-center text-muted-foreground">🔒 Secure checkout via Shopify</p>
                </div>
              </>
            )}
          </div>
        </SheetContent>
      </Sheet>

      <PrepaidPopup
        open={showPrepaidPopup}
        onClose={() => setShowPrepaidPopup(false)}
        totalPrice={totalPrice}
        onPayPrepaid={proceedToCheckout}
        onPayCOD={proceedToCheckout}
      />
    </>
  );
};
