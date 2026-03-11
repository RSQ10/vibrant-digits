import { Lock, Zap, Truck, RotateCcw } from 'lucide-react';

const items = [
  { icon: Lock, title: 'Secure Checkout', desc: 'UPI, Cards, Netbanking' },
  { icon: Zap, title: 'Fast Dispatch', desc: 'Within 24 hours' },
  { icon: Truck, title: 'Pan-India Delivery', desc: '3–5 days across India' },
  { icon: RotateCcw, title: 'Easy Returns', desc: '7-day hassle-free' },
];

export const TrustStrip = () => (
  <section className="w-full bg-blue-soft border-y border-blue-soft-border">
    <div className="container mx-auto px-4 lg:px-8 py-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {items.map((item, i) => (
          <div key={i} className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-soft-border flex items-center justify-center flex-shrink-0">
              <item.icon className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-sm font-semibold text-heading">{item.title}</p>
              <p className="text-xs text-muted-foreground">{item.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);
