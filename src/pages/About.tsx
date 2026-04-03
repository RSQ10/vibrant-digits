import { Layout } from '@/components/Layout';
import { Star, Palette, Shield, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

const About = () => (
  <Layout>
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="container mx-auto px-4 lg:px-8 py-12 lg:py-16"
    >
      {/* Hero section */}
      <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
        <div>
          <span className="inline-block text-xs font-semibold text-primary bg-primary/10 px-3 py-1 rounded-full mb-4 uppercase tracking-wider">
            Our Story
          </span>
          <h1 className="text-3xl lg:text-4xl font-bold text-heading mb-4 leading-tight">
            About Glow & Gadgets
          </h1>
          <p className="text-body mb-4 leading-relaxed">
            We're a premium Indian D2C brand on a mission to bring the best gadgets and lifestyle
            products to your doorstep — fast, affordable, and with zero compromise on quality.
          </p>
          <p className="text-body leading-relaxed">
            Every product in our store is handpicked, tested, and chosen because it adds genuine
            value to your life. No gimmicks, no filler — just great products that speak for themselves.
          </p>

          <div className="flex items-center gap-6 mt-8">
            {[
              { value: '10K+', label: 'Happy Customers' },
              { value: '500+', label: 'Products' },
              { value: '4.8★', label: 'Avg Rating' },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="text-2xl font-bold text-heading">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Brand image */}
        <div className="relative">
          <div className="rounded-2xl overflow-hidden shadow-hover aspect-square max-w-md mx-auto lg:mx-0">
            <img
              src="/logo.jpg"
              alt="Glow & Gadgets"
              className="w-full h-full object-cover"
            />
          </div>
          {/* Floating badge */}
          <div className="absolute -bottom-4 -left-4 bg-white rounded-2xl shadow-hover px-5 py-3 flex items-center gap-3 border border-border">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <Zap className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-sm font-bold text-heading">Fast Delivery</p>
              <p className="text-xs text-muted-foreground">3–5 Business Days</p>
            </div>
          </div>
        </div>
      </div>

      {/* Values cards */}
      <div className="grid md:grid-cols-3 gap-6">
        {[
          {
            icon: Star,
            title: 'Quality First',
            desc: 'Every product undergoes strict quality checks before it reaches you.',
            color: 'bg-yellow-50 text-yellow-600',
          },
          {
            icon: Palette,
            title: 'Thoughtful Curation',
            desc: "We don't carry everything — just things worth having.",
            color: 'bg-purple-50 text-purple-600',
          },
          {
            icon: Shield,
            title: 'Customer Trust',
            desc: 'Transparent pricing, easy returns, and support that actually helps.',
            color: 'bg-green-50 text-green-600',
          },
        ].map((card, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="bg-white border border-border rounded-2xl p-6 hover:shadow-hover transition-shadow"
          >
            <div className={`w-12 h-12 rounded-xl ${card.color} bg-opacity-20 flex items-center justify-center mb-4`}>
              <card.icon className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-heading mb-2">{card.title}</h3>
            <p className="text-sm text-body leading-relaxed">{card.desc}</p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  </Layout>
);

export default About;
