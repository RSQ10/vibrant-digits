import { Link } from 'react-router-dom';
import logo from '@/assets/logo.jpg';

export const Footer = () => (
  <footer className="w-full bg-background border-t border-border">
    <div className="container mx-auto px-4 lg:px-8 py-12 lg:py-16">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">

        {/* Brand */}
        <div className="col-span-2 lg:col-span-1">
          <img src={logo} alt="Glow & Gadgets" className="h-12 w-auto object-contain mb-3" />
          <p className="text-sm text-body max-w-xs">
            Premium gadgets & lifestyle products. Curated for the modern consumer. Shipped worldwide.
          </p>
          <div className="flex gap-3 mt-4">
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer"
              className="w-8 h-8 rounded-full bg-blue-soft flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors text-sm">
              📸
            </a>
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer"
              className="w-8 h-8 rounded-full bg-blue-soft flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors text-sm">
              👥
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-sm font-semibold text-heading mb-4">Quick Links</h4>
          <div className="flex flex-col gap-2">
            {[
              { label: 'Home', path: '/' },
              { label: 'Shop', path: '/shop' },
              { label: 'Collections', path: '/collections' },
              { label: 'About', path: '/about' },
              { label: 'Contact', path: '/contact' },
            ].map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className="text-sm text-body hover:text-primary transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Support */}
        <div>
          <h4 className="text-sm font-semibold text-heading mb-4">Support</h4>
          <div className="flex flex-col gap-2">
            <Link to="/shipping-delivery" className="text-sm text-body hover:text-primary transition-colors">
              Shipping & Delivery
            </Link>
            <Link to="/returns-exchanges" className="text-sm text-body hover:text-primary transition-colors">
              Returns & Exchanges
            </Link>
            <Link to="/faq" className="text-sm text-body hover:text-primary transition-colors">
              FAQ
            </Link>
            <Link to="/privacy-policy" className="text-sm text-body hover:text-primary transition-colors">
              Privacy Policy
            </Link>
          </div>
        </div>

        {/* Contact */}
        <div>
          <h4 className="text-sm font-semibold text-heading mb-4">Contact</h4>
          <div className="flex flex-col gap-2 text-sm text-body">
            <span>📍 New Delhi, India</span>
            <a
              href="mailto:support@glow-gadget.shop"
              className="hover:text-primary transition-colors"
            >
              📧 support@glow-gadget.shop
            </a>
            <span>🕐 Response within 24 hours</span>
            <span>🌍 Shipping to 50+ countries</span>
          </div>
        </div>
      </div>

      <div className="mt-12 pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
        <p>© {new Date().getFullYear()} Glow & Gadgets. All rights reserved.</p>
        <div className="flex items-center gap-4">
          <Link to="/privacy-policy" className="hover:text-primary transition-colors">Privacy Policy</Link>
          <Link to="/returns-exchanges" className="hover:text-primary transition-colors">Returns</Link>
          <Link to="/shipping-delivery" className="hover:text-primary transition-colors">Shipping</Link>
        </div>
      </div>
    </div>
  </footer>
);
