import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

const messages = [
  "🔥 Limited Stock — Grab Yours Before It's Gone!",
  "✨ Save 10% — Pay via UPI or Card at Checkout",
  "🚀 Order Today · Delivered in 3–5 Days",
  "💥 Up to 56% OFF on Selected Products",
  "📦 Free Dispatch Within 24 Hours",
  "🛡️ 100% Secure — UPI · Cards · COD",
  "↩️ Easy 7-Day Returns. No Questions Asked.",
  "🌟 Trusted by Thousands Across India",
];

export const AnnouncementBar = () => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => setIndex(i => (i + 1) % messages.length), 3000);
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
