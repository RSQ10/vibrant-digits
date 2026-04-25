import { Layout } from '@/components/Layout';
import { Shield, Mail } from 'lucide-react';
import { motion } from 'framer-motion';

const sections = [
  {
    title: '1. Information We Collect',
    content: [
      'Personal identification information (name, email address, phone number)',
      'Shipping and billing address',
      'Payment information (processed securely — we never store card details)',
      'Order history and purchase preferences',
      'Device and browser information for site analytics',
    ],
  },
  {
    title: '2. How We Use Your Information',
    content: [
      'To process and fulfil your orders',
      'To send order confirmations and shipping tracking updates',
      'To respond to customer support inquiries',
      'To improve our website and product offerings',
      'To send promotional emails (only with your consent)',
    ],
  },
  {
    title: '3. How We Protect Your Information',
    content: [
      'All data is transmitted using SSL (Secure Socket Layer) encryption',
      'Payment information is processed through PCI-DSS compliant gateways',
      'We never sell, trade, or share your personal data with third parties',
      'Access to personal data is restricted to authorised team members only',
    ],
  },
  {
    title: '4. Cookies',
    content: [
      'We use cookies to enhance your browsing experience on our site',
      'Cookies help us remember your preferences and improve site performance',
      'Analytics cookies help us understand how visitors use our site',
      'You can disable cookies in your browser settings at any time',
    ],
  },
  {
    title: '5. Third-Party Services',
    content: [
      'We use Shopify to power our store (subject to Shopify\'s privacy policy)',
      'Payment processors (Stripe, PayPal) handle transactions securely',
      'We use Google Analytics for anonymous site usage statistics',
      'These services have their own privacy policies independent of ours',
    ],
  },
  {
    title: '6. Your Rights',
    content: [
      'You have the right to access the personal data we hold about you',
      'You can request correction or deletion of your personal data',
      'You can opt out of marketing emails at any time via unsubscribe link',
      'To exercise any of these rights, contact support@glow-gadget.shop',
    ],
  },
  {
    title: '7. Contact Us',
    content: [
      'For any privacy-related questions or concerns, please contact us at support@glow-gadget.shop',
      'We will respond to all privacy enquiries within 48 hours',
    ],
  },
];

const PrivacyPolicy = () => (
  <Layout>
    <div className="container mx-auto px-4 lg:px-8 py-12 lg:py-16">

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-14"
      >
        <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
          <Shield className="w-6 h-6 text-primary" />
        </div>
        <h1 className="text-3xl lg:text-4xl font-bold text-heading mb-3">Privacy Policy</h1>
        <p className="text-sm text-muted-foreground">Last updated: April 2026</p>
        <p className="text-body text-lg max-w-xl mx-auto mt-4">
          Your privacy matters to us. This policy explains how Glow & Gadgets collects, uses, and protects your personal information.
        </p>
      </motion.div>

      {/* Highlight box */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="bg-gradient-to-r from-primary/10 to-blue-soft rounded-card p-6 mb-12 flex items-start gap-4"
      >
        <Shield className="w-6 h-6 text-primary flex-shrink-0 mt-0.5" />
        <p className="text-body text-sm leading-relaxed">
          <strong className="text-heading">Our commitment:</strong> We never sell, rent, or share your personal data with third parties for marketing purposes. Your information is used solely to provide you with the best shopping experience possible.
        </p>
      </motion.div>

      {/* Sections */}
      <div className="max-w-3xl mx-auto mb-14 space-y-8">
        {sections.map((section, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.05 }}
            className="border border-border rounded-card p-6"
          >
            <h2 className="text-lg font-bold text-heading mb-4">{section.title}</h2>
            <ul className="space-y-2">
              {section.content.map((item, j) => (
                <li key={j} className="text-sm text-body flex items-start gap-2 leading-relaxed">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0 mt-2" />
                  {item}
                </li>
              ))}
            </ul>
          </motion.div>
        ))}
      </div>

      {/* Contact */}
      <div className="text-center">
        <p className="text-body mb-3">Questions about this privacy policy?</p>
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

export default PrivacyPolicy;
