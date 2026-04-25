import { useState } from 'react';
import { Layout } from '@/components/Layout';
import { ChevronDown, Mail } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const faqs = [
  {
    category: 'Shipping',
    questions: [
      {
        q: 'How long does shipping take?',
        a: 'We deliver within 5–7 business days for standard shipping and 2–3 business days for express shipping. Orders are processed within 24 hours of placement.',
      },
      {
        q: 'Can I track my order?',
        a: 'Yes! You will receive a tracking number via email as soon as your order is dispatched. You can use this to track your package in real time.',
      },
      {
        q: 'Do you ship internationally?',
        a: 'Yes, we ship to USA, Europe, and 50+ countries worldwide. International orders typically arrive within 5–7 business days.',
      },
      {
        q: 'Are there customs duties for international orders?',
        a: 'International orders may be subject to customs duties depending on your country. These charges are the responsibility of the customer.',
      },
    ],
  },
  {
    category: 'Orders & Payments',
    questions: [
      {
        q: 'What payment methods do you accept?',
        a: 'We accept all major credit/debit cards (Visa, Mastercard, Amex), PayPal, and other secure payment methods. All transactions are encrypted and secure.',
      },
      {
        q: 'Can I cancel my order?',
        a: 'Orders can be cancelled within 24 hours of placement. Simply email support@glow-gadget.shop with your order number and we will process the cancellation immediately.',
      },
      {
        q: 'Is my payment information secure?',
        a: 'Absolutely. All payments are encrypted using SSL technology and processed through certified, secure payment gateways. We never store your card details.',
      },
    ],
  },
  {
    category: 'Returns & Refunds',
    questions: [
      {
        q: 'What is your return policy?',
        a: 'We offer a 30-day hassle-free return policy. If you are not satisfied with your purchase, you can return it within 30 days for a full refund or exchange.',
      },
      {
        q: 'What if my item arrives damaged?',
        a: 'Contact us within 48 hours of receiving the item with photos of the damage. We will send a free replacement immediately — no questions asked.',
      },
      {
        q: 'How long do refunds take?',
        a: 'Refunds are processed to your original payment method within 5–7 business days after we receive and inspect the returned item.',
      },
    ],
  },
  {
    category: 'Products',
    questions: [
      {
        q: 'Are your products authentic and high quality?',
        a: 'Yes! Every product in our store is carefully vetted and quality-checked before being listed. We only carry products we would use ourselves.',
      },
      {
        q: 'How do I know which size or variant to choose?',
        a: 'Each product page includes detailed descriptions and specifications. If you need help choosing, email us at support@glow-gadget.shop and we will guide you.',
      },
    ],
  },
];

const FAQItem = ({ q, a }: { q: string; a: string }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-border rounded-card overflow-hidden mb-3">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-blue-soft transition-colors"
      >
        <span className="font-medium text-heading pr-4">{q}</span>
        <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }}>
          <ChevronDown className="w-5 h-5 text-primary flex-shrink-0" />
        </motion.div>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <p className="px-6 pb-5 text-body text-sm leading-relaxed border-t border-border pt-4">
              {a}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const FAQ = () => (
  <Layout>
    <div className="container mx-auto px-4 lg:px-8 py-12 lg:py-16">

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-14"
      >
        <span className="inline-block text-xs font-semibold text-primary bg-primary/10 px-3 py-1 rounded-pill mb-4 uppercase tracking-wide">
          Help Center
        </span>
        <h1 className="text-3xl lg:text-4xl font-bold text-heading mb-4">
          Frequently Asked Questions
        </h1>
        <p className="text-body text-lg max-w-xl mx-auto">
          Find answers to the most common questions about our products, shipping, and policies.
        </p>
      </motion.div>

      {/* FAQ sections */}
      <div className="max-w-3xl mx-auto mb-14">
        {faqs.map((section, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="mb-10"
          >
            <h2 className="text-lg font-bold text-heading mb-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-primary inline-block" />
              {section.category}
            </h2>
            {section.questions.map((item, j) => (
              <FAQItem key={j} q={item.q} a={item.a} />
            ))}
          </motion.div>
        ))}
      </div>

      {/* Still have questions */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="bg-gradient-to-r from-primary/10 to-blue-soft rounded-card p-10 text-center"
      >
        <h2 className="text-2xl font-bold text-heading mb-3">Still Have Questions?</h2>
        <p className="text-body mb-6">
          Can't find what you're looking for? Our support team is happy to help.
        </p>
        <a
          href="mailto:support@glow-gadget.shop"
          className="inline-flex items-center gap-2 bg-primary text-primary-foreground font-semibold px-6 py-3 rounded-pill hover:bg-primary/90 transition-colors"
        >
          <Mail className="w-4 h-4" />
          support@glow-gadget.shop
        </a>
        <p className="text-sm text-muted-foreground mt-3">We respond within 24 hours</p>
      </motion.div>

    </div>
  </Layout>
);

export default FAQ;
