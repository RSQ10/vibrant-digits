import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { ShoppingCart, Minus, Plus, Trash2, ExternalLink, Loader2, CreditCard, Banknote, Gift, X } from "lucide-react";
import { useCartStore } from "@/stores/cartStore";
import { motion, AnimatePresence } from "framer-motion";

export const CartDrawer = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showPrepaidPopup, setShowPrepaidPopup] = useState(false);
  const { items, isLoading, isSyncing, updateQuantity, removeItem, getCheckoutUrl, syncCart } = useCartStore();
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce((sum, item) => sum + (parseFloat(item.price.amount) * item.quantity), 0);

  useEffect(() => { if (isOpen) syncCart(); }, [isOpen, syncCart]);

  const proceedToCheckout = () => {
    const checkoutUrl = getCheckoutUrl();
    if (checkoutUrl) {
      window.open(checkoutUrl, '_blank');
      setIsOpen(false);
      setShowPrepaidPopup(false);
    }
  };

  const handleCheckout = () => {
    // Show prepaid incentive popup before redirecting
    setShowPrepaidPopup(true);
  };

  const handlePayPrepaid = () => {
    proceedToCheckout();
  };

  const handlePayCOD = () => {
    proceedToCheckout();
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
                  <Button onClick={handleCheckout} className="w-full rounded-pill" size="lg" disabled={items.length === 0 || isLoading || isSyncing}>
                    {isLoading || isSyncing ? <Loader2 className="w-4 h-4 animate-spin" /> : <><ExternalLink className="w-4 h-4 mr-2" />Proceed to Checkout</>}
                  </Button>
                  <p className="text-xs text-center text-muted-foreground">🔒 Secure checkout via Shopify</p>
                </div>
              </>
            )}
          </div>
        </SheetContent>
      </Sheet>

      {/* Prepaid Incentive Popup */}
      <Dialog open={showPrepaidPopup} onOpenChange={setShowPrepaidPopup}>
        <DialogContent className="sm:max-w-md p-0 overflow-hidden rounded-2xl border-0">
          <div className="bg-gradient-to-br from-primary/10 via-blue-soft to-primary/5 p-6 pb-4">
            <DialogHeader>
              <div className="mx-auto mb-3 w-14 h-14 rounded-full bg-primary/15 flex items-center justify-center">
                <Gift className="w-7 h-7 text-primary" />
              </div>
              <DialogTitle className="text-center text-xl text-heading">
                Save ₹40 Instantly! 🎉
              </DialogTitle>
              <DialogDescription className="text-center text-body mt-2">
                Pay online and get <span className="font-bold text-primary">₹40 OFF</span> on your order. No coupon needed!
              </DialogDescription>
            </DialogHeader>
          </div>

          <div className="p-6 space-y-3">
            {/* Prepaid Option - Highlighted */}
            <motion.button
              onClick={handlePayPrepaid}
              className="w-full flex items-center gap-4 p-4 rounded-xl border-2 border-primary bg-primary/5 hover:bg-primary/10 transition-all group cursor-pointer"
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
            >
              <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                <CreditCard className="w-5 h-5 text-primary-foreground" />
              </div>
              <div className="flex-1 text-left">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-heading">Pay Online</span>
                  <span className="text-xs font-bold bg-green-100 text-green-700 px-2 py-0.5 rounded-full">SAVE ₹40</span>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">UPI, Cards, Net Banking, Wallets</p>
              </div>
              <div className="text-right flex-shrink-0">
                <div className="text-sm font-bold text-primary">₹{Math.max(0, totalPrice - 40).toFixed(0)}</div>
                <div className="text-xs text-muted-foreground line-through">₹{totalPrice.toFixed(0)}</div>
              </div>
            </motion.button>

            {/* COD Option */}
            <motion.button
              onClick={handlePayCOD}
              className="w-full flex items-center gap-4 p-4 rounded-xl border border-border hover:border-muted-foreground/30 transition-all group cursor-pointer"
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
            >
              <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                <Banknote className="w-5 h-5 text-muted-foreground" />
              </div>
              <div className="flex-1 text-left">
                <span className="font-medium text-body">Cash on Delivery</span>
                <p className="text-xs text-muted-foreground mt-0.5">Pay when you receive</p>
              </div>
              <div className="text-right flex-shrink-0">
                <div className="text-sm font-semibold text-body">₹{totalPrice.toFixed(0)}</div>
              </div>
            </motion.button>

            <p className="text-[11px] text-center text-muted-foreground pt-2">
              🔒 100% secure payment · Free shipping on prepaid orders
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
