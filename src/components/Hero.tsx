import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Lock, Star, Truck } from 'lucide-react';

export const Hero = () => (
  <section className="w-full bg-background">
    <div className="container mx-auto px-4 lg:px-8 py-16 lg:py-24 flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
      {/* Left */}
      <motion.div
        className="flex-1 max-w-xl"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
      >
        <span className="inline-flex items-center gap-2 bg-blue-soft text-primary text-sm font-medium px-4 py-1.5 rounded-pill mb-6">
          🇮🇳 Delivering Across India
        </span>
        <h1 className="text-4xl sm:text-5xl lg:text-[56px] font-bold text-heading leading-tight mb-4">
          Premium Gadgets.<br />Delivered Fast.
        </h1>
        <p className="text-body text-lg mb-8 max-w-md">
          Discover handpicked gadgets and lifestyle products that blend quality with elegance.
        </p>
        <div className="flex flex-wrap gap-3 mb-8">
          <Button asChild className="rounded-pill px-8 h-12 text-base">
            <Link to="/shop">Shop Now</Link>
          </Button>
          <Button asChild variant="outline" className="rounded-pill px-8 h-12 text-base border-primary text-primary hover:bg-primary hover:text-primary-foreground">
            <Link to="/collections">Browse Collections</Link>
          </Button>
        </div>
        <div className="flex items-center gap-6 text-sm text-body">
          <span className="flex items-center gap-1.5"><Lock className="w-4 h-4 text-primary" /> Secure</span>
          <span className="flex items-center gap-1.5"><Star className="w-4 h-4 text-primary" /> 4.8 Rating</span>
          <span className="flex items-center gap-1.5"><Truck className="w-4 h-4 text-primary" /> Fast Delivery</span>
        </div>
      </motion.div>

      {/* Right */}
      <motion.div
        className="flex-1 flex justify-center"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <div className="relative w-full max-w-md aspect-square rounded-card bg-blue-soft flex items-center justify-center overflow-hidden shadow-hover">
          <div className="text-center p-8">
            <p className="text-6xl mb-4">✨</p>
            <p className="text-heading font-semibold text-lg">Premium Quality</p>
            <p className="text-body text-sm mt-1">Curated just for you</p>
          </div>
        </div>
      </motion.div>
    </div>
  </section>
);
