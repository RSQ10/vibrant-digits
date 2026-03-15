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
    let time = 0;

    const resize = () => {
      const rect = canvas.parentElement!.getBoundingClientRect();
      canvas.width = rect.width * devicePixelRatio;
      canvas.height = rect.height * devicePixelRatio;
      canvas.style.width = rect.width + 'px';
      canvas.style.height = rect.height + 'px';
      ctx.scale(devicePixelRatio, devicePixelRatio);
    };
    resize();
    window.addEventListener('resize', resize);

    // Particles
    const particles = Array.from({ length: 55 }, () => ({
      x: Math.random() * 600,
      y: Math.random() * 600,
      r: 0.5 + Math.random() * 2.5,
      a: 0.08 + Math.random() * 0.27,
      vx: (Math.random() - 0.5) * 0.8,
      vy: (Math.random() - 0.5) * 0.8,
    }));

    // Line segments
    const lines = Array.from({ length: 12 }, () => newLine());
    function newLine() {
      const len = 20 + Math.random() * 60;
      const angle = Math.random() * Math.PI * 2;
      return {
        x: Math.random() * 600,
        y: Math.random() * 600,
        dx: Math.cos(angle) * len,
        dy: Math.sin(angle) * len,
        life: 0,
        maxLife: 120 + Math.random() * 180,
        a: 0.02 + Math.random() * 0.08,
      };
    }

    const rings = [60, 115, 170, 225];
    const speeds = [0.003, -0.005, 0.004, -0.002];

    const draw = () => {
      const w = canvas.width / devicePixelRatio;
      const h = canvas.height / devicePixelRatio;
      ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
      ctx.clearRect(0, 0, w, h);

      // BG gradient
      const grad = ctx.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, Math.max(w, h) / 2);
      grad.addColorStop(0, 'rgba(37,99,235,0.04)');
      grad.addColorStop(1, 'transparent');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);

      const cx = w / 2;
      const cy = h / 2;

      // Layer 1 — Rings
      rings.forEach((r, i) => {
        const scale = 1 + Math.sin(time * 0.01 + i) * 0.02;
        const angle = time * speeds[i];
        ctx.beginPath();
        ctx.arc(cx, cy, r * scale, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(37,99,235,0.12)';
        ctx.lineWidth = 0.5;
        ctx.stroke();
        // Orbiting dot
        const dx = Math.cos(angle) * r * scale;
        const dy = Math.sin(angle) * r * scale;
        ctx.beginPath();
        ctx.arc(cx + dx, cy + dy, 3, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(37,99,235,0.5)';
        ctx.fill();
      });

      // Layer 2 — Particles
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < -5 || p.x > w + 5 || p.y < -5 || p.y > h + 5) {
          p.x = Math.random() * w;
          p.y = Math.random() * h;
        }
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(37,99,235,${p.a})`;
        ctx.fill();
      });

      // Layer 3 — Fading lines
      lines.forEach((l, i) => {
        l.life++;
        if (l.life > l.maxLife) {
          lines[i] = newLine();
          lines[i].x = Math.random() * w;
          lines[i].y = Math.random() * h;
          return;
        }
        const progress = l.life / l.maxLife;
        const fade = progress < 0.2 ? progress / 0.2 : progress > 0.7 ? (1 - progress) / 0.3 : 1;
        ctx.beginPath();
        ctx.moveTo(l.x, l.y);
        ctx.lineTo(l.x + l.dx, l.y + l.dy);
        ctx.strokeStyle = `rgba(37,99,235,${l.a * fade})`;
        ctx.lineWidth = 0.5;
        ctx.stroke();
      });

      time++;
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
      style={{ zIndex: 1 }}
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
        className="flex-1 flex justify-center relative"
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