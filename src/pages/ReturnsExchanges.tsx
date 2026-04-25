import { Layout } from '@/components/Layout';
import { RefreshCw, CheckCircle, XCircle, Mail } from 'lucide-react';
import { motion } from 'framer-motion';

const steps = [
  { step: '01', title: 'Contact Us', desc: 'Email support@glow-gadget.shop with your order number and reason for return.' },
  { step: '02', title: 'Get Approval', desc: 'Our team will review and send you return instructions within 24 hours.' },
  { step: '03', title: 'Ship It Back', desc: 'Pack the item securely in original packaging and ship it back to us.' },
  { step: '04', title: 'Refund / Exchange', desc: 'Refund processed in 5–7 business days or exchange dispatched immediately.' },
];

const eligible = [
  'Item received in damaged or defective condition',
  'Wrong item delivered',
  'Item does not match the description',
  'Item unused and in original packaging within 30 days',
];

const notEligible = [
  'Items used or worn',
  'Items without original packaging',
  'Returns requested after 30 days',
  'Items damaged due to customer misuse',
];

const ReturnsExchanges = () => (
  <Layout>
    <div className="container mx-auto px-4 lg:px-8 py-12 lg:py-16">

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-14"
      >
        <span className="inline-block text-xs font-semibold text-primary bg-primary/10 px-3 py-1 rounded-pill mb-4 uppercase tracking-wide">
          Returns Policy
        </span>
        <h1 className="text-3xl lg:text-4xl font-bold text-heading mb-4">Returns & Exchanges</h1>
        <p className="text-body text-lg max-w-xl mx-auto">
          We want you to love every purchase. If something isn't right, we'll make it right — hassle-free.
        </p>
      </motion.div>

      {/* Policy highlight */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="bg-gradient-to-r from-primary/10 to-blue-soft rounded-card p-8 text-center mb-14"
      >
        <RefreshCw className="w-10 h-10 text-primary mx-auto mb-3" />
        <h2 className="text-2xl font-bold text-heading mb-2">30-Day Return Policy</h2>
        <p className="text-body max-w-lg mx-auto">
          Not happy with your purchase? Return it within 30 days for a full refund or exchange. No questions asked on damaged or wrong items.
        </p>
      </motion.div>

      {/* How to return */}
      <div className="mb-16">
        <h2 className="text-2xl font-bold text-heading text-center mb-10">How to Return</h2>
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
              <div className="w-14 h-14 rounded-full bg-primary text-primary-foreground font-bold text-lg flex items-center justify-center mx-auto mb-4">
                {step.step}
              </div>
              <h3 className="font-semibold text-heading mb-2">{step.title}</h3>
              <p className="text-sm text-body leading-relaxed">{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Eligible / Not eligible */}
      <div className="grid md:grid-cols-2 gap-6 mb-14">
        <motion.div
          initial={{ opacity: 0, x: -12 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="bg-green-50 border border-green-200 rounded-card p-6"
        >
          <h3 className="font-bold text-heading mb-4 flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-600" />
            Eligible for Return
          </h3>
          <div className="flex flex-col gap-3">
            {eligible.map((item, i) => (
              <p key={i} className="text-sm text-body flex items-start gap-2">
                <span className="text-green-600 mt-0.5">✓</span>
                {item}
              </p>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 12 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="bg-red-50 border border-red-200 rounded-card p-6"
        >
          <h3 className="font-bold text-heading mb-4 flex items-center gap-2">
            <XCircle className="w-5 h-5 text-red-500" />
            Not Eligible for Return
          </h3>
          <div className="flex flex-col gap-3">
            {notEligible.map((item, i) => (
              <p key={i} className="text-sm text-body flex items-start gap-2">
                <span className="text-red-500 mt-0.5">✗</span>
                {item}
              </p>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Refund info */}
      <div className="bg-blue-soft rounded-card p-8 mb-10">
        <h2 className="text-xl font-bold text-heading mb-4">Refund Information</h2>
        <div className="grid md:grid-cols-2 gap-4 text-sm text-body">
          <p>💳 Refunds are processed to the original payment method</p>
          <p>⏱️ Refunds take 5–7 business days to reflect</p>
          <p>🔄 Exchanges are dispatched within 1–2 business days</p>
          <p>📦 Free return shipping on damaged or wrong items</p>
        </div>
      </div>

      {/* Contact */}
      <div className="text-center">
        <p className="text-body mb-3">Ready to start a return or have questions?</p>
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

export default ReturnsExchanges;
