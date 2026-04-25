import { Layout } from '@/components/Layout';
import { Star, Palette, Shield, Globe, Truck, Users, ThumbsUp } from 'lucide-react';
import { motion } from 'framer-motion';

const stats = [
  { value: '1000+', label: 'Happy Customers' },
  { value: '10+', label: 'Countries Served' },
  { value: '20+', label: 'Products Curated' },
  { value: '4.5★', label: 'Average Rating' },
];

const whyUs = [
  {
    icon: Globe,
    title: 'Global Shipping',
    desc: 'We ship to 50+ countries with fast 5-7 day delivery and real-time tracking on every order.',
  },
  {
    icon: ThumbsUp,
    title: 'Quality Guaranteed',
    desc: 'Every product is carefully vetted before it reaches our store. Not satisfied? We\'ll make it right.',
  },
  {
    icon: Shield,
    title: 'Secure Payments',
    desc: 'Shop with confidence. All transactions are encrypted and processed through trusted payment gateways.',
  },
  {
    icon: Users,
    title: '24/7 Support',
    desc: 'Our team is always here to help. Reach us anytime at support@glow-gadget.shop',
  },
];

const values = [
  { icon: Star, title: 'Quality First', desc: 'Every product undergoes strict quality checks before it reaches you.' },
  { icon: Palette, title: 'Thoughtful Curation', desc: "We don't carry everything — just things worth having." },
  { icon: Shield, title: 'Customer Trust', desc: 'Transparent pricing, easy returns, and support that actually helps.' },
];

const About = () => (
  <Layout>
    <div className="container mx-auto px-4 lg:px-8 py-12 lg:py-16">

      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="grid lg:grid-cols-2 gap-12 items-center mb-20"
      >
        <div>
          <span className="inline-block text-xs font-semibold text-primary bg-primary/10 px-3 py-1 rounded-pill mb-4 uppercase tracking-wide">
            Our Story
          </span>
          <h1 className="text-3xl lg:text-5xl font-bold text-heading mb-6 leading-tight">
            We're Glow & Gadgets
          </h1>
          <p className="text-body text-lg mb-4 leading-relaxed">
            Your go-to destination for premium lifestyle products, smart gadgets, and everyday essentials — curated for modern living.
          </p>
          <p className="text-body leading-relaxed mb-4">
            Glow & Gadgets was founded with one simple mission: to bring high-quality, innovative products to people around the world at prices that make sense. We started as a small team of product enthusiasts who were tired of overpriced gadgets and unreliable quality. So we decided to do something about it.
          </p>
          <p className="text-body leading-relaxed">
            Today, we serve customers across the USA, Europe, and beyond — carefully handpicking every product in our store to ensure it meets our standards for quality, value, and usefulness in everyday life.
          </p>
        </div>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="aspect-video rounded-card bg-gradient-to-br from-blue-soft to-primary/10 flex items-center justify-center shadow-default"
        >
          <div className="text-center">
            <p className="text-6xl mb-3">🚀</p>
            <p className="text-heading font-semibold text-lg">Built for Modern Living</p>
            <p className="text-body text-sm mt-1">Quality · Value · Trust</p>
          </div>
        </motion.div>
      </motion.div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20"
      >
        {stats.map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="bg-blue-soft rounded-card p-6 text-center shadow-default"
          >
            <p className="text-3xl font-bold text-primary mb-1">{stat.value}</p>
            <p className="text-sm text-body font-medium">{stat.label}</p>
          </motion.div>
        ))}
      </motion.div>

      {/* Why Choose Us */}
      <div className="mb-20">
        <div className="text-center mb-10">
          <span className="inline-block text-xs font-semibold text-primary bg-primary/10 px-3 py-1 rounded-pill mb-3 uppercase tracking-wide">
            Why Us
          </span>
          <h2 className="text-2xl lg:text-3xl font-bold text-heading">Why Choose Glow & Gadgets?</h2>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {whyUs.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-white border border-border rounded-card p-6 text-center shadow-default hover:shadow-hover transition-shadow"
            >
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <item.icon className="w-5 h-5 text-primary" />
              </div>
              <h3 className="font-semibold text-heading mb-2">{item.title}</h3>
              <p className="text-sm text-body leading-relaxed">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Values */}
      <div className="mb-20">
        <div className="text-center mb-10">
          <span className="inline-block text-xs font-semibold text-primary bg-primary/10 px-3 py-1 rounded-pill mb-3 uppercase tracking-wide">
            Our Values
          </span>
          <h2 className="text-2xl lg:text-3xl font-bold text-heading">What We Stand For</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {values.map((card, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-blue-soft rounded-card p-6 text-center"
            >
              <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center mx-auto mb-3 shadow-default">
                <card.icon className="w-5 h-5 text-primary" />
              </div>
              <h3 className="font-semibold text-heading mb-1">{card.title}</h3>
              <p className="text-sm text-body">{card.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Contact CTA */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="bg-gradient-to-r from-primary/10 to-blue-soft rounded-card p-10 text-center"
      >
        <h2 className="text-2xl font-bold text-heading mb-3">Have Questions?</h2>
        <p className="text-body mb-2">We'd love to hear from you. Our team responds within 24 hours.</p>
        <a
          href="mailto:support@glow-gadget.shop"
          className="inline-block mt-4 bg-primary text-primary-foreground font-semibold px-8 py-3 rounded-pill hover:bg-primary/90 transition-colors shadow-hover"
        >
          📧 support@glow-gadget.shop
        </a>
      </motion.div>

    </div>
  </Layout>
);

export default About;
