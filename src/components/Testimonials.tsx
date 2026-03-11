import { Star } from 'lucide-react';
import { motion } from 'framer-motion';

const testimonials = [
  { name: 'Priya Sharma', quote: 'Absolutely love the quality! Fast delivery and beautiful packaging. Will definitely order again.', avatar: '👩' },
  { name: 'Rahul Verma', quote: 'Best gadgets store I\'ve found online. The products are exactly as described. Highly recommended!', avatar: '👨' },
  { name: 'Anjali Patel', quote: 'Great customer service and amazing products. The returns process was hassle-free too!', avatar: '👩‍💼' },
];

export const Testimonials = () => (
  <section className="w-full bg-surface py-16 lg:py-24">
    <div className="container mx-auto px-4 lg:px-8">
      <motion.h2
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-3xl lg:text-4xl font-bold text-heading text-center mb-12"
      >
        What Our Customers Say
      </motion.h2>
      <div className="grid md:grid-cols-3 gap-6">
        {testimonials.map((t, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="bg-background rounded-card p-6 shadow-default"
          >
            <div className="flex gap-1 mb-3">
              {[...Array(5)].map((_, j) => <Star key={j} className="w-4 h-4 fill-primary text-primary" />)}
            </div>
            <p className="text-body text-sm mb-4 italic">"{t.quote}"</p>
            <div className="flex items-center gap-3">
              <span className="text-2xl">{t.avatar}</span>
              <span className="text-sm font-semibold text-heading">{t.name}</span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);
