import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search, User, Menu, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import CartDrawer from './CartDrawer';
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '@/components/ui/sheet';
import { useCartStore } from '@/stores/cartStore';
import logo from '@/assets/logo.jpg';

const navLinks = [
  { label: 'Home', path: '/' },
  { label: 'Shop', path: '/shop' },
  { label: 'Collections', path: '/collections' },
  { label: 'About', path: '/about' },
  { label: 'Contact', path: '/contact' },
];

export const Navbar = () => {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);

  const getItemCount = useCartStore((state) => state.getItemCount);
  const itemCount = getItemCount();

  return (
    <>
      <nav className="sticky top-0 z-50 w-full h-[72px] bg-background border-b border-border flex items-center">
        <div className="container mx-auto flex items-center justify-between px-4 lg:px-8">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <img src={logo} alt="Glow & Gadgets" className="h-12 sm:h-14 w-auto object-contain" />
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map(link => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-sm font-medium transition-colors duration-200 hover:text-primary ${
                  location.pathname === link.path ? 'text-primary' : 'text-body'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right Icons */}
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" className="hidden md:flex">
              <Search className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="hidden md:flex">
              <User className="h-5 w-5" />
            </Button>

            {/* Cart Button with badge */}
            <Button
              variant="ghost"
              size="icon"
              className="relative"
              onClick={() => setCartOpen(true)}
            >
              <ShoppingCart className="h-5 w-5" />
              {itemCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-primary text-primary-foreground text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center leading-none">
                  {itemCount > 9 ? '9+' : itemCount}
                </span>
              )}
            </Button>

            {/* Mobile Menu */}
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[280px]">
                <SheetTitle className="mb-6">
                  <img src={logo} alt="Glow & Gadgets" className="h-12 w-auto object-contain" />
                </SheetTitle>
                <div className="flex flex-col gap-4">
                  {navLinks.map(link => (
                    <Link
                      key={link.path}
                      to={link.path}
                      onClick={() => setMobileOpen(false)}
                      className={`text-base font-medium py-2 transition-colors ${
                        location.pathname === link.path ? 'text-primary' : 'text-body'
                      }`}
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </nav>

      {/* Cart Drawer — rendered outside nav so it overlays everything */}
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
};
