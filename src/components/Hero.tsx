import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Lock, Star, Truck } from 'lucide-react';
import heroImage from '@/assets/hero-image.jpg';
import { useEffect, useRef } from 'react';

const HeroCanvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let tick = 0;

    const isMobile = window.innerWidth < 768;
    const particleCount = isMobile ? 30 : 60;

    const resize = () => {
      const parent = canvas.parentElement!;
      const w = parent.offsetWidth;
      const h = parent.offsetHeight;
      const dpr = devicePixelRatio || 1;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = w + 'px';
      canvas.style.height = h + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener('resize', resize);

    // Ring config
    const ringRadii = [62, 118, 174, 230];
    const ringSpeeds = [0.006, -0.004, 0.005, -0.003];
    const ringAngles = [0, 0, 0, 0];

    // Particles
    function newParticle(w: number, h: number) {
      return {
        x: Math.random() * (w || 500),
        y: Math.random() * (h || 500),
        r: 0.6 + Math.random() * 2.2,
        alpha: 0.06 + Math.random() * 0.26,
        vx: (Math.random() - 0.5) * 0.7,
        vy: (Math.random() - 0.5) * 0.7,
        life: 0,
        maxLife: 220 + Math.random() * 280,
      };
    }
    const particles = Array.from({ length: particleCount }, () => newParticle(500, 500));

    // Lines
    function newLine(w: number, h: number) {
      const len = 24 + Math.random() * 48;
      const angle = Math.random() * Math.PI * 2;
      const x1 = Math.random() * (w || 500);
      const y1 = Math.random() * (h || 500);
      return {
        x1, y1,
        x2: x1 + Math.cos(angle) * len,
        y2: y1 + Math.sin(angle) * len,
        life: 0,
        maxLife: 80 + Math.random() * 100,
        baseAlpha: 0.03 + Math.random() * 0.06,
      };
    }
    const lines = Array.from({ length: 14 }, () => newLine(500, 500));

    const draw = () => {
      if (document.visibilityState === 'hidden') {
        animId = requestAnimationFrame(draw);
        return;
      }

      const dpr = devicePixelRatio || 1;
      const w = canvas.width / dpr;
      const h = canvas.height / dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);

      const cx = w / 2;
      const cy = h / 2;

      // Layer 1 — Orbital Rings
      const scale = 1 + Math.sin(tick * 0.018) * 0.018;
      ctx.save();
      ctx.translate(cx, cy);
      ctx.scale(scale, scale);
      ctx.translate(-cx, -cy);

      ringRadii.forEach((r, i) => {
        // Ring stroke
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(37,99,235,0.10)';
        ctx.lineWidth = 0.5;
        ctx.stroke();

        // Update angle
        ringAngles[i] += ringSpeeds[i];
        const a = ringAngles[i];
        const dotX = cx + Math.cos(a) * r;
        const dotY = cy + Math.sin(a) * r;

        // Glow behind dot
        ctx.beginPath();
        ctx.arc(dotX, dotY, 6, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(37,99,235,0.12)';
        ctx.fill();

        // Dot
        ctx.beginPath();
        ctx.arc(dotX, dotY, 2.5, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(37,99,235,0.55)';
        ctx.fill();
      });
      ctx.restore();

      // Layer 2 — Particles
      particles.forEach((p, i) => {
        p.x += p.vx;
        p.y += p.vy;
        p.life++;
        if (p.life > p.maxLife || p.x < -5 || p.x > w + 5 || p.y < -5 || p.y > h + 5) {
          particles[i] = newParticle(w, h);
          return;
        }
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(37,99,235,${p.alpha})`;
        ctx.fill();
      });

      // Layer 3 — Fading lines
      lines.forEach((l, i) => {
        l.life++;
        if (l.life > l.maxLife) {
          lines[i] = newLine(w, h);
          return;
        }
        const t = l.life / l.maxLife;
        let alpha = l.baseAlpha;
        if (t < 0.25) alpha = l.baseAlpha * (t / 0.25);
        else if (t > 0.75) alpha = l.baseAlpha * ((1 - t) / 0.25);
        ctx.beginPath();
        ctx.moveTo(l.x1, l.y1);
        ctx.lineTo(l.x2, l.y2);
        ctx.strokeStyle = `rgba(37,99,235,${alpha})`;
        ctx.lineWidth = 0.5;
        ctx.stroke();
      });

      // Layer 4 — Center radial glow
      const glow = ctx.createRadialGradient(cx, cy, 0, cx, cy, 180);
      glow.addColorStop(0, 'rgba(37,99,235,0.05)');
      glow.addColorStop(1, 'rgba(37,99,235,0.00)');
      ctx.fillStyle = glow;
      ctx.fillRect(0, 0, w, h);

      tick++;
      animId = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      style={{ zIndex: 1, pointerEvents: 'none' }}
    />
  );
};

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
        className="flex-1 flex justify-center relative overflow-hidden"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        style={{ background: '#F8FAFC' }}
      >
        <HeroCanvas />
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
