import { Star, Palette, Lock } from 'lucide-react';
import { motion } from 'framer-motion';

const cards = [
  { icon: Star, title: 'Premium Quality', desc: 'Every product is tested and curated for excellence.' },
  { icon: Palette, title: 'Elegant Design', desc: 'Products that look as good as they perform.' },
  { icon: Lock, title: 'Secure Checkout', desc: 'Shop with confidence — UPI, Cards, COD supported.' },
];

export const WhyChooseUs = () => (
  <section className="w-full bg-background py-16 lg:py-24">
    <div className="container mx-auto px-4 lg:px-8">
      <motion.h2
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-3xl lg:text-4xl font-bold text-heading text-center mb-12"
      >
        Why Choose Us
      </motion.h2>
      <div className="grid md:grid-cols-3 gap-6">
        {cards.map((card, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="bg-blue-soft rounded-card p-8 text-center"
          >
            <div className="w-14 h-14 rounded-full bg-blue-soft-border flex items-center justify-center mx-auto mb-4">
              <card.icon className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-lg font-semibold text-heading mb-2">{card.title}</h3>
            <p className="text-body text-sm">{card.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);
