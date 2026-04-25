import { Layout } from '@/components/Layout';
import { Truck, Clock, Globe, Package, Mail } from 'lucide-react';
import { motion } from 'framer-motion';

const shippingOptions = [
  {
    icon: Truck,
    title: 'Standard Shipping',
    time: '5–7 Business Days',
    price: 'Free on orders above $50',
    desc: 'Reliable delivery to your doorstep. Tracking number provided via email once dispatched.',
    badge: 'Most Popular',
  },
  {
    icon: Clock,
    title: 'Express Shipping',
    time: '2–3 Business Days',
    price: '$12',
    desc: 'Need it faster? Our express option gets your order to you in no time.',
    badge: 'Fastest',
  },
];

const steps = [
  { icon: Package, step: '01', title: 'Order Placed', desc: 'Your order is confirmed and sent to our fulfilment team within minutes.' },
  { icon: Clock, step: '02', title: 'Processing', desc: 'Orders are processed and packed within 24 hours of placement.' },
  { icon: Truck, step: '03', title: 'Dispatched', desc: 'Your order is handed to our shipping partner. Tracking email sent instantly.' },
  { icon: Globe, step: '04', title: 'Delivered', desc: 'Your package arrives at your door within 5–7 business days.' },
];

const ShippingDelivery = () => (
  <Layout>
    <div className="container mx-auto px-4 lg:px-8 py-12 lg:py-16">

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-14"
      >
        <span className="inline-block text-xs font-semibold text-primary bg-primary/10 px-3 py-1 rounded-pill mb-4 uppercase tracking-wide">
          Shipping Info
        </span>
        <h1 className="text-3xl lg:text-4xl font-bold text-heading mb-4">Shipping & Delivery</h1>
        <p className="text-body text-lg max-w-xl mx-auto">
          We ship worldwide with fast, reliable delivery. Every order comes with real-time tracking so you always know where your package is.
        </p>
      </motion.div>

      {/* Shipping Options */}
      <div className="grid md:grid-cols-2 gap-6 mb-16">
        {shippingOptions.map((opt, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="bg-white border border-border rounded-card p-8 shadow-default hover:shadow-hover transition-shadow relative overflow-hidden"
          >
            <span className="absolute top-4 right-4 text-xs font-semibold text-primary bg-primary/10 px-3 py-1 rounded-pill">
              {opt.badge}
            </span>
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <opt.icon className="w-5 h-5 text-primary" />
            </div>
            <h3 className="text-xl font-bold text-heading mb-1">{opt.title}</h3>
            <p className="text-2xl font-bold text-primary mb-1">{opt.time}</p>
            <p className="text-sm font-semibold text-green-600 mb-3">{opt.price}</p>
            <p className="text-body text-sm leading-relaxed">{opt.desc}</p>
          </motion.div>
        ))}
      </div>

      {/* How it works */}
      <div className="mb-16">
        <h2 className="text-2xl font-bold text-heading text-center mb-10">How It Works</h2>
        <div className="grid md:grid-cols-4 gap-6">
          {steps.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="text-center"
            >
              <div className="relative inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-soft mb-4">
                <step.icon className="w-6 h-6 text-primary" />
                <span className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center">
                  {step.step}
                </span>
              </div>
              <h3 className="font-semibold text-heading mb-1">{step.title}</h3>
              <p className="text-sm text-body leading-relaxed">{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Important Notes */}
      <div className="bg-blue-soft rounded-card p-8 mb-10">
        <h2 className="text-xl font-bold text-heading mb-5">Important Notes</h2>
        <div className="grid md:grid-cols-2 gap-4">
          {[
            '🌍 We ship to USA, Europe, and 50+ countries worldwide',
            '📦 Orders are processed within 24 hours of placement',
            '📧 Tracking number sent via email once dispatched',
            '🛃 International orders may be subject to customs duties',
            '⏱️ Delivery times are estimates and may vary by location',
            '📞 Contact us if your order hasn\'t arrived within 10 days',
          ].map((note, i) => (
            <p key={i} className="text-sm text-body">{note}</p>
          ))}
        </div>
      </div>

      {/* Contact */}
      <div className="text-center">
        <p className="text-body mb-3">Have questions about your shipment?</p>
        <a
          href="mailto:support@glow-gadget.shop"
          className="inline-flex items-center gap-2 bg-primary text-primary-foreground font-semibold px-6 py-3 rounded-pill hover:bg-primary/90 transition-colors"
        >
          <Mail className="w-4 h-4" />
          support@glow-gadget.shop
        </a>
      </div>

    </div>
  </Layout>
);

export default ShippingDelivery;
