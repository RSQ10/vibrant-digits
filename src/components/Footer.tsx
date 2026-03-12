import { Link } from 'react-router-dom';
import logo from '@/assets/logo.jpg';

export const Footer = () => (
  <footer className="w-full bg-background border-t border-border">
    <div className="container mx-auto px-4 lg:px-8 py-12 lg:py-16">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
        {/* Brand */}
        <div className="col-span-2 lg:col-span-1">
          <img src={logo} alt="Glow & Gadgets" className="h-12 w-auto object-contain mb-3" />
          <p className="text-sm text-body max-w-xs">Premium gadgets & lifestyle products. Curated for the modern Indian consumer.</p>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-sm font-semibold text-heading mb-4">Quick Links</h4>
          <div className="flex flex-col gap-2">
            {['/', '/shop', '/collections', '/about', '/contact'].map((path, i) => (
              <Link key={path} to={path} className="text-sm text-body hover:text-primary transition-colors">
                {['Home', 'Shop', 'Collections', 'About', 'Contact'][i]}
              </Link>
            ))}
          </div>
        </div>

        {/* Support */}
        <div>
          <h4 className="text-sm font-semibold text-heading mb-4">Support</h4>
          <div className="flex flex-col gap-2 text-sm text-body">
            <span>Shipping & Delivery</span>
            <span>Returns & Exchanges</span>
            <span>FAQ</span>
            <span>Privacy Policy</span>
          </div>
        </div>

        {/* Contact */}
        <div>
          <h4 className="text-sm font-semibold text-heading mb-4">Contact</h4>
          <div className="flex flex-col gap-2 text-sm text-body">
            <span>📍 Saket, New Delhi</span>
            <a href="mailto:glowthegadgets@gmail.com" className="hover:text-primary transition-colors">📧 glowthegadgets@gmail.com</a>
          </div>
        </div>
      </div>

      <div className="mt-12 pt-6 border-t border-border text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} Glow & Gadgets. All rights reserved.
      </div>
    </div>
  </footer>
);
