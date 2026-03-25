import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Lock, Star, Truck, Sparkles, ArrowRight } from 'lucide-react';

const HeroSvgScene = () => (
  <div className="relative w-full h-full min-h-[400px] lg:min-h-[480px] flex items-center justify-center">
    <style>{`
      @keyframes lamp-pulse {
        0%, 100% { filter: drop-shadow(0 0 12px rgba(37,99,235,0.3)); }
        50% { filter: drop-shadow(0 0 28px rgba(37,99,235,0.55)); }
      }
      @keyframes hero-float {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-10px); }
      }
      @keyframes hero-spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
      }
      @keyframes badge-pop {
        0% { transform: scale(0); opacity: 0; }
        70% { transform: scale(1.1); opacity: 1; }
        100% { transform: scale(1); opacity: 1; }
      }
    `}</style>

    <svg
      viewBox="0 0 520 420"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-full max-w-[520px]"
    >
      <defs>
        <linearGradient id="bg-grad" x1="0" y1="0" x2="520" y2="420" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#EFF6FF" />
          <stop offset="100%" stopColor="#F8FAFC" />
        </linearGradient>
        <radialGradient id="lamp-glow" cx="260" cy="195" r="70" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#BFDBFE" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#EFF6FF" stopOpacity="0" />
        </radialGradient>
        <filter id="card-shadow" x="-10%" y="-10%" width="130%" height="140%">
          <feDropShadow dx="0" dy="2" stdDeviation="6" floodColor="#2563EB" floodOpacity="0.08" />
        </filter>
        <filter id="badge-shadow" x="-20%" y="-20%" width="140%" height="150%">
          <feDropShadow dx="0" dy="1" stdDeviation="3" floodColor="#2563EB" floodOpacity="0.12" />
        </filter>
      </defs>

      {/* Background */}
      <rect width="520" height="420" rx="24" fill="url(#bg-grad)" />

      {/* Scattered decorative dots */}
      <circle cx="45" cy="60" r="3" fill="#BFDBFE" />
      <circle cx="480" cy="45" r="2.5" fill="#BFDBFE" />
      <circle cx="90" cy="350" r="2" fill="#BFDBFE" />
      <circle cx="430" cy="370" r="3" fill="#BFDBFE" />
      <circle cx="150" cy="30" r="2" fill="#BFDBFE" />
      <circle cx="370" cy="55" r="2.5" fill="#BFDBFE" />
      <circle cx="60" cy="200" r="2" fill="#BFDBFE" />
      <circle cx="470" cy="220" r="2.5" fill="#BFDBFE" />

      {/* Decorative rings behind lamp */}
      <g style={{ transformOrigin: '260px 210px' }}>
        <circle cx="260" cy="210" r="110" stroke="rgba(37,99,235,0.07)" strokeWidth="0.8" fill="none" />
        <circle cx="260" cy="210" r="80" stroke="rgba(37,99,235,0.09)" strokeWidth="0.8" fill="none" />
        <animateTransform attributeName="transform" type="rotate" values="0 260 210;360 260 210" dur="25s" repeatCount="indefinite" />
      </g>
      <circle cx="260" cy="210" r="55" stroke="rgba(37,99,235,0.10)" strokeWidth="0.8" fill="none" />

      {/* Lamp glow aura */}
      <circle cx="260" cy="195" r="70" fill="url(#lamp-glow)" />

      {/* Desk surface */}
      <rect x="80" y="310" width="360" height="6" rx="3" fill="#DBEAFE" />
      <rect x="60" y="314" width="400" height="2" rx="1" fill="#EFF6FF" />

      {/* === MOON LAMP === */}
      <g style={{ animation: 'lamp-pulse 3s ease-in-out infinite' }}>
        {/* Lamp stem */}
        <rect x="257" y="265" width="6" height="45" rx="3" fill="#CBD5E1" />
        {/* Lamp base */}
        <ellipse cx="260" cy="310" rx="22" ry="6" fill="#E2E8F0" />
        <ellipse cx="260" cy="308" rx="18" ry="4" fill="#F1F5F9" />
        {/* Moon orb */}
        <circle cx="260" cy="210" r="48" fill="white" stroke="#DBEAFE" strokeWidth="1.5" />
        <circle cx="260" cy="210" r="42" fill="white" />
        {/* Moon surface texture */}
        <circle cx="248" cy="200" r="6" fill="#F1F5F9" />
        <circle cx="272" cy="215" r="4" fill="#F1F5F9" />
        <circle cx="255" cy="225" r="3" fill="#F1F5F9" />
        <circle cx="268" cy="195" r="3.5" fill="#F1F5F9" />
        {/* Inner glow */}
        <circle cx="260" cy="210" r="30" fill="none" stroke="rgba(37,99,235,0.12)" strokeWidth="1" />
      </g>

      {/* === WATCH === */}
      <g>
        {/* Watch strap top */}
        <rect x="385" y="245" width="26" height="32" rx="4" fill="#E2E8F0" />
        {/* Watch strap bottom */}
        <rect x="385" y="296" width="26" height="18" rx="4" fill="#E2E8F0" />
        {/* Watch face */}
        <rect x="380" y="268" width="36" height="32" rx="6" fill="#1E3A5F" stroke="#CBD5E1" strokeWidth="1.5" />
        {/* Screen content */}
        <text x="398" y="289" textAnchor="middle" fill="white" fontSize="10" fontFamily="Inter, sans-serif" fontWeight="600">10:10</text>
        {/* Watch button */}
        <rect x="416" y="278" width="3" height="10" rx="1.5" fill="#CBD5E1" />
      </g>

      {/* === FLOATING CARD — top left === */}
      <g style={{ animation: 'hero-float 4s ease-in-out infinite' }} filter="url(#card-shadow)">
        <rect x="50" y="70" width="130" height="52" rx="12" fill="white" />
        <text x="68" y="92" fill="#2563EB" fontSize="10" fontFamily="Inter, sans-serif" fontWeight="600">✨ New Arrival</text>
        <text x="68" y="108" fill="#0F172A" fontSize="9" fontFamily="Inter, sans-serif" fontWeight="500">Moon Lamp Pro</text>
      </g>

      {/* === SALE BADGE === */}
      <g style={{ animation: 'badge-pop 0.5s ease-out 0.8s both, hero-float 4s ease-in-out 1.5s infinite' }} filter="url(#badge-shadow)">
        <rect x="170" y="145" width="72" height="26" rx="13" fill="#2563EB" />
        <text x="206" y="162" textAnchor="middle" fill="white" fontSize="10" fontFamily="Inter, sans-serif" fontWeight="700">56% OFF</text>
      </g>
    </svg>
  </div>
);

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
          <Sparkles className="w-4 h-4" /> New Arrivals Just Dropped
        </motion.span>

        <motion.h1
          className="text-4xl sm:text-5xl lg:text-[54px] font-extrabold text-heading leading-[1.1] mb-5"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.5 }}
        >
          Smart Gadgets,{' '}
          <span className="text-primary">Stunning</span>{' '}
          Home Décor.
        </motion.h1>

        <motion.p
          className="text-body text-lg mb-8 max-w-md leading-relaxed"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          Elevate your space with handpicked gadgets & décor pieces. Where technology meets elegance — delivered across India.
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
          <span className="flex items-center gap-1.5"><Lock className="w-4 h-4 text-primary" /> Secure Pay</span>
          <span className="flex items-center gap-1.5"><Star className="w-4 h-4 text-primary" /> 4.8★ Rated</span>
          <span className="flex items-center gap-1.5"><Truck className="w-4 h-4 text-primary" /> Fast Delivery</span>
        </motion.div>
      </motion.div>

      {/* Right Column — SVG Illustration */}
      <motion.div
        className="flex-1"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        <HeroSvgScene />
      </motion.div>
    </div>
  </section>
);
