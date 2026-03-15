import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Lock, Star, Truck } from 'lucide-react';
import heroImage from '@/assets/hero-image.jpg';

export const Hero = () => (
  <section className="w-full bg-background">
    <style>{`
      @keyframes hero-spin {
        from { transform: translate(-50%,-50%) rotate(0deg) }
        to   { transform: translate(-50%,-50%) rotate(360deg) }
      }
      @keyframes hero-spin-reverse {
        from { transform: translate(-50%,-50%) rotate(0deg) }
        to   { transform: translate(-50%,-50%) rotate(-360deg) }
      }
      @keyframes hero-pulse-glow {
        0%,100% { opacity: 0.6; transform: translate(-50%,-50%) scale(1) }
        50%     { opacity: 1;   transform: translate(-50%,-50%) scale(1.15) }
      }
      @keyframes hero-dot-orbit {
        from { transform: rotate(0deg) }
        to   { transform: rotate(360deg) }
      }
      @keyframes hero-dot-orbit-reverse {
        from { transform: rotate(0deg) }
        to   { transform: rotate(-360deg) }
      }
    `}</style>
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
        className="flex-1 flex items-center justify-center relative overflow-hidden"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        style={{ background: '#F8FAFC', minHeight: 400 }}
      >
        {/* Ring 1 — Large */}
        <div style={{
          position: 'absolute', zIndex: 1,
          width: 320, height: 320, borderRadius: '50%',
          border: '1px solid rgba(37,99,235,0.12)',
          top: '50%', left: '50%',
          animation: 'hero-spin 25s linear infinite',
        }} />
        {/* Ring 2 — Medium counter-rotate */}
        <div style={{
          position: 'absolute', zIndex: 1,
          width: 210, height: 210, borderRadius: '50%',
          border: '1px solid rgba(37,99,235,0.18)',
          top: '50%', left: '50%',
          animation: 'hero-spin-reverse 18s linear infinite',
        }} />
        {/* Ring 3 — Small */}
        <div style={{
          position: 'absolute', zIndex: 1,
          width: 110, height: 110, borderRadius: '50%',
          border: '1px solid rgba(37,99,235,0.25)',
          top: '50%', left: '50%',
          animation: 'hero-spin 12s linear infinite',
        }} />
        {/* Dot 1 — orbiting large ring */}
        <div style={{
          position: 'absolute', zIndex: 1,
          width: 7, height: 7, borderRadius: '50%',
          background: '#2563EB',
          top: 'calc(50% - 160px)', left: '50%',
          transformOrigin: '0 160px',
          animation: 'hero-dot-orbit 25s linear infinite',
        }} />
        {/* Dot 2 — orbiting medium ring */}
        <div style={{
          position: 'absolute', zIndex: 1,
          width: 5, height: 5, borderRadius: '50%',
          background: 'rgba(37,99,235,0.6)',
          top: 'calc(50% - 105px)', left: '50%',
          transformOrigin: '0 105px',
          animation: 'hero-dot-orbit-reverse 18s linear infinite',
        }} />
        {/* Center glow */}
        <div style={{
          position: 'absolute', zIndex: 1,
          width: 200, height: 200, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(37,99,235,0.07) 0%, transparent 70%)',
          top: '50%', left: '50%',
          animation: 'hero-pulse-glow 4s ease-in-out infinite',
        }} />

        {/* Product image */}
        <div className="relative w-full max-w-md aspect-square rounded-card overflow-hidden shadow-hover" style={{ zIndex: 10 }}>
          <img
            src={heroImage}
            alt="Premium gadgets collection featuring earbuds, smartwatch, speaker, LED lights and power bank"
            className="w-full h-full object-cover"
            loading="eager"
          />
        </div>
      </motion.div>
    </div>
  </section>
);
