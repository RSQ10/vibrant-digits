import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

const messages = [
  "🚚 Free US Shipping on Orders Over $50",
  "🛡️ 30-Day Money-Back Guarantee — No Questions Asked",
  "🔒 Secure Checkout — Visa · Mastercard · PayPal",
  "📦 Orders Dispatched Within 24 Hours",
  "⭐ 4.8-Star Rated by Thousands of Happy Customers",
  "↩️ Easy 30-Day Returns. Hassle-Free.",
];

export const AnnouncementBar = () => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => setIndex(i => (i + 1) % messages.length), 3500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full h-[42px] bg-primary flex items-center justify-center overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.p
          key={index}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.25 }}
          className="text-primary-foreground text-sm font-medium"
        >
          {messages[index]}
        </motion.p>
      </AnimatePresence>
    </div>
  );
};
