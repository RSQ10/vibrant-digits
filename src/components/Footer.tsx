import { Link } from 'react-router-dom';
import logo from '@/assets/logo.jpg';

const YoutubeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
  </svg>
);

const TikTokIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.75a4.85 4.85 0 0 1-1.01-.06z"/>
  </svg>
);

export const Footer = () => (
  <footer className="w-full bg-background border-t border-border">
    <div className="container mx-auto px-4 lg:px-8 py-12 lg:py-16">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">

        {/* Brand */}
        <div className="col-span-2 lg:col-span-1">
          <img src={logo} alt="Glow & Gadgets" className="h-12 w-auto object-contain mb-3" />
          <p className="text-sm text-body max-w-xs">
            Smart gadgets for modern homes and workspaces. Curated for quality. Shipped fast.
          </p>
          <div className="flex gap-3 mt-4">
            <a
              href="https://youtube.com/@bacoonfilms?si=wipvKDYwaTEOM6CC"
              target="_blank"
              rel="noopener noreferrer"
              className="w-8 h-8 rounded-full bg-blue-soft flex items-center justify-center hover:bg-red-600 hover:text-white transition-colors text-body"
              aria-label="YouTube"
            >
              <YoutubeIcon />
            </a>
            <a
              href="https://tiktok.com/@mycoolgadgetsworld"
              target="_blank"
              rel="noopener noreferrer"
              className="w-8 h-8 rounded-full bg-blue-soft flex items-center justify-center hover:bg-black hover:text-white transition-colors text-body"
              aria-label="TikTok"
            >
              <TikTokIcon />
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
            <a href="mailto:yorrichijr@gmail.com" className="hover:text-primary transition-colors">
              📧 yorrichijr@gmail.com
            </a>
            <span>🕐 Response within 24–48 hours</span>
            <span>🚚 Free US shipping over $50</span>
            <span>↩️ 30-day hassle-free returns</span>
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
