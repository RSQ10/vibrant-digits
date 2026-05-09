import { Layout } from '@/components/Layout';
import { motion } from 'framer-motion';
import { Truck, RotateCcw, Star, Shield } from 'lucide-react';

const stats = [
  { stat: '2,400+', label: 'Orders Shipped' },
  { stat: '5–7 Days', label: 'US Delivery' },
  { stat: '30 Days', label: 'Easy Returns' },
  { stat: '4.8 ★', label: 'Average Rating' },
];

const values = [
  {
    icon: Star,
    title: 'Curated Quality',
    desc: 'Every product goes through a review process before it makes it to our store. We only list items we\'d actually use ourselves.',
  },
  {
    icon: Truck,
    title: 'Fast & Reliable Shipping',
    desc: 'We dispatch within 24 hours and provide real tracking on every order. No vague "it\'s on the way" updates.',
  },
  {
    icon: RotateCcw,
    title: 'Hassle-Free Returns',
    desc: 'Changed your mind? Got a damaged item? We make returns simple — no long forms, no arguments.',
  },
  {
    icon: Shield,
    title: 'Secure by Default',
    desc: 'Every checkout is encrypted and processed through Shopify\'s secure payment infrastructure. Your data stays yours.',
  },
];

const About = () => (
  <Layout>
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="container mx-auto px-4 lg:px-8 py-12 lg:py-20"
    >
      {/* Header */}
      <div className="max-w-2xl mb-14">
        <span className="inline-block text-xs font-semibold text-primary bg-primary/10 px-3 py-1 rounded-pill mb-4 uppercase tracking-wide">
          Our Story
        </span>
        <h1 className="text-3xl lg:text-4xl font-bold text-heading mb-5">
          We built the store we always wanted to shop at.
        </h1>
        <p className="text-body text-base leading-relaxed mb-4">
          <strong>Glow & Gadgets</strong> started as a simple idea — find genuinely useful smart gadgets and ambient lighting products, and make them easy to discover and buy online.
        </p>
        <p className="text-body text-base leading-relaxed mb-4">
          Too many online stores sell everything to everyone, with little thought given to quality or curation. We took a different approach: a focused selection of products that actually improve your space — whether that's your desk, your living room, or your bedside table.
        </p>
        <p className="text-body text-base leading-relaxed">
          Every item in our store is something we've evaluated for build quality, real-world usefulness, and value. We skip the gimmicks and focus on products that earn their place in your home.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
        {stats.map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08 }}
            className="bg-surface rounded-card p-5 text-center shadow-default"
          >
            <p className="text-2xl font-bold text-primary">{item.stat}</p>
            <p className="text-sm text-muted-foreground mt-1">{item.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Values */}
      <div className="mb-14">
        <h2 className="text-2xl font-bold text-heading mb-8">What we stand for</h2>
        <div className="grid md:grid-cols-2 gap-6">
          {values.map((v, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="flex gap-4 p-6 rounded-card border border-border bg-white shadow-default"
            >
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                <v.icon className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-heading mb-1">{v.title}</h3>
                <p className="text-sm text-body leading-relaxed">{v.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Promise */}
      <div className="bg-blue-soft rounded-card p-8 border border-blue-soft-border">
        <h2 className="text-xl font-bold text-heading mb-3">Our promise to you</h2>
        <p className="text-body text-sm leading-relaxed max-w-2xl">
          If something goes wrong with your order — wrong item, damaged product, late delivery — reach out and we'll fix it. No runaround. We're a small team and we take every order personally. That's not a marketing line, it's just how we work.
        </p>
        <a
          href="mailto:yorrichijr@gmail.com"
          className="inline-block mt-5 text-sm font-semibold text-primary hover:underline"
        >
          yorrichijr@gmail.com →
        </a>
      </div>
    </motion.div>
  </Layout>
);

export default About;
