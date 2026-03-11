import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

export const Newsletter = () => {
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      toast.success('Thanks for subscribing!');
      setEmail('');
    }
  };

  return (
    <section className="w-full bg-primary py-16 lg:py-24">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="container mx-auto px-4 lg:px-8 text-center max-w-2xl"
      >
        <h2 className="text-3xl lg:text-4xl font-bold text-primary-foreground mb-3">Stay in the Loop</h2>
        <p className="text-primary-foreground/80 mb-8">Get exclusive deals, new arrivals, and insider tips straight to your inbox.</p>
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="flex-1 h-12 px-5 rounded-pill bg-primary-foreground/10 border border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary-foreground/30 text-sm"
            required
          />
          <Button type="submit" className="h-12 rounded-pill px-8 bg-primary-foreground text-primary hover:bg-primary-foreground/90 font-semibold">
            Subscribe
          </Button>
        </form>
      </motion.div>
    </section>
  );
};
