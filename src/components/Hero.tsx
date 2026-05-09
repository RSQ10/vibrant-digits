import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Lock, Star, Truck, ArrowRight } from 'lucide-react';
import heroImage from '@/assets/hero-home-decor.jpg';

export const Hero = () => (
  <section className="w-full bg-background overflow-hidden">
    <div className="container mx-auto px-4 lg:px-8 py-12 lg:py-20 flex flex-col lg:flex-row items-center gap-10 lg:gap-16">
      {/* Left Column */}
      <motion.div
        className="flex-1 max-w-xl"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      >
        <motion.span
          className="inline-flex items-center gap-2 bg-accent text-primary text-sm font-medium px-4 py-1.5 rounded-full mb-5"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.4 }}
        >
          ✦ New Arrivals Just Dropped
        </motion.span>

        <motion.h1
          className="text-4xl sm:text-5xl lg:text-[54px] font-extrabold text-heading leading-[1.1] mb-5"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.5 }}
        >
          Smart Gadgets for{' '}
          <span className="text-primary">Modern</span>{' '}
          Homes & Workspaces.
        </motion.h1>

        <motion.p
          className="text-body text-lg mb-8 max-w-md leading-relaxed"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          We curate smart gadgets and ambient décor that make your everyday space cleaner, smarter, and more you. Free US shipping on orders over $50.
        </motion.p>

        <motion.div
          className="flex flex-wrap gap-3 mb-8"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55, duration: 0.5 }}
        >
          <Button asChild className="rounded-full px-8 h-12 text-base font-semibold shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-shadow">
            <Link to="/shop">
              Shop Now <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </Button>
          <Button
            asChild
            variant="outline"
            className="rounded-full px-8 h-12 text-base border-primary text-primary hover:bg-primary hover:text-primary-foreground"
          >
            <Link to="/collections">Browse Collections</Link>
          </Button>
        </motion.div>

        <motion.div
          className="flex items-center gap-6 text-sm text-body"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.5 }}
        >
          <span className="flex items-center gap-1.5"><Lock className="w-4 h-4 text-primary" /> Secure Checkout</span>
          <span className="flex items-center gap-1.5"><Star className="w-4 h-4 text-primary" /> 4.8★ Rated</span>
          <span className="flex items-center gap-1.5"><Truck className="w-4 h-4 text-primary" /> Free US Shipping</span>
        </motion.div>
      </motion.div>

      {/* Right Column — Hero Image */}
      <motion.div
        className="flex-1 flex items-center justify-center"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        <div className="relative rounded-2xl overflow-hidden shadow-2xl shadow-primary/10">
          <img
            src={heroImage}
            alt="Smart gadgets and home décor lifestyle scene"
            width={1024}
            height={1024}
            className="w-full max-w-[520px] h-auto object-cover rounded-2xl"
          />
        </div>
      </motion.div>
    </div>
  </section>
);
