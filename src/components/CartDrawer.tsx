import { useCartStore } from "@/stores/cartStore";
import { Button } from "@/components/ui/button";

const CartDrawer = () => {
  const { items = [] } = useCartStore();

  const handleCheckout = () => {
    const url = useCartStore.getState().checkoutUrl;

    if (url) {
      window.location.href = url;
    }
  };

  return (
    <div className="p-4">
      <h2>Cart</h2>

      {items.map((item, i) => (
        <div key={i}>
          <p>{item.product.node.title}</p>
          <p>{item.quantity}</p>
        </div>
      ))}

      <Button onClick={handleCheckout}>
        Checkout
      </Button>
    </div>
  );
};

export default CartDrawer;
