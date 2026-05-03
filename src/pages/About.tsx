import { Layout } from '@/components/Layout';
import { motion } from 'framer-motion';

const About = () => (
  <Layout>
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="container mx-auto px-4 lg:px-8 py-12 lg:py-20"
    >
      <h1 className="text-3xl lg:text-4xl font-bold text-heading mb-6">About Us</h1>

      <div className="max-w-2xl space-y-6 text-body text-base leading-relaxed">
        <p>
          Welcome to <strong>Glow & Gadgets</strong> — your go-to destination for trending gadgets,
          ambient lighting, and lifestyle products loved by thousands of customers across the US, UK, and beyond.
        </p>
        <p>
          We handpick every product to make sure it meets our standards for quality, style, and value.
          Whether you're upgrading your desk setup, looking for the perfect gift, or just treating yourself —
          we've got something for everyone.
        </p>
        <p>
          All orders ship fast from our US warehouse, and we back every purchase with our
          30-day hassle-free return policy. Your satisfaction is our priority.
        </p>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-6 pt-6">
          {[
            { stat: '10,000+', label: 'Happy Customers' },
            { stat: '3–7 Days', label: 'US & UK Delivery' },
            { stat: '30 Days', label: 'Easy Returns' },
          ].map((item, i) => (
            <div key={i} className="bg-surface rounded-card p-5 text-center shadow-default">
              <p className="text-2xl font-bold text-primary">{item.stat}</p>
              <p className="text-sm text-muted-foreground mt-1">{item.label}</p>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  </Layout>
);

export default About;
