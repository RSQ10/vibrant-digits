import { Layout } from '@/components/Layout';
import { Star, Palette, Shield } from 'lucide-react';
import { motion } from 'framer-motion';

const About = () => (
  <Layout>
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="container mx-auto px-4 lg:px-8 py-12 lg:py-16">
      <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
        <div>
          <h1 className="text-3xl lg:text-4xl font-bold text-heading mb-4">About Glow & Gadgets</h1>
          <p className="text-body mb-4">
            We're a premium Indian D2C brand on a mission to bring the best gadgets and lifestyle products to your doorstep — fast, affordable, and with zero compromise on quality.
          </p>
          <p className="text-body">
            Every product in our store is handpicked, tested, and chosen because it adds genuine value to your life. No gimmicks, no filler — just great products that speak for themselves.
          </p>
        </div>
        <div className="aspect-video rounded-card bg-blue-soft flex items-center justify-center">
          <p className="text-4xl">🚀</p>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {[
          { icon: Star, title: 'Quality First', desc: 'Every product undergoes strict quality checks before it reaches you.' },
          { icon: Palette, title: 'Thoughtful Curation', desc: 'We don't carry everything — just things worth having.' },
          { icon: Shield, title: 'Customer Trust', desc: 'Transparent pricing, easy returns, and support that actually helps.' },
        ].map((card, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="bg-blue-soft rounded-card p-6 text-center">
            <div className="w-12 h-12 rounded-full bg-blue-soft-border flex items-center justify-center mx-auto mb-3">
              <card.icon className="w-5 h-5 text-primary" />
            </div>
            <h3 className="font-semibold text-heading mb-1">{card.title}</h3>
            <p className="text-sm text-body">{card.desc}</p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  </Layout>
);

export default About;
