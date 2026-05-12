import { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Search, User, Menu, ShoppingCart, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import CartDrawer from './CartDrawer';
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '@/components/ui/sheet';
import { useCartStore } from '@/stores/cartStore';
import { useCurrencyContext } from '@/context/CurrencyContext';
import { storefrontApiRequest } from '@/lib/shopify';
import type { ShopifyProduct } from '@/lib/shopify';
import logo from '@/assets/logo.jpg';

const navLinks = [
  { label: 'Home', path: '/' },
  { label: 'Shop', path: '/shop' },
  { label: 'Collections', path: '/collections' },
  { label: 'About', path: '/about' },
  { label: 'Contact', path: '/contact' },
];

const SEARCH_QUERY = `
  query SearchProducts($query: String!) {
    products(first: 6, query: $query) {
      edges {
        node {
          id title handle
          priceRange { minVariantPrice { amount currencyCode } }
          images(first: 1) { edges { node { url altText } } }
          variants(first: 1) { edges { node { availableForSale } } }
        }
      }
    }
  }
`;

export const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);

  // Search state
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<ShopifyProduct[]>([]);
  const [searching, setSearching] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>();

  const getItemCount = useCartStore((state) => state.getItemCount);
  const itemCount = getItemCount();
  const { currencyCode, currencySymbol, convertPrice } = useCurrencyContext();

  // Close search on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setSearchOpen(false);
        setQuery('');
        setResults([]);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Close search on route change
  useEffect(() => {
    setSearchOpen(false);
    setQuery('');
    setResults([]);
  }, [location.pathname]);

  // Focus input when search opens
  useEffect(() => {
    if (searchOpen) setTimeout(() => inputRef.current?.focus(), 50);
  }, [searchOpen]);

  // Debounced search
  useEffect(() => {
    if (!query.trim()) { setResults([]); return; }
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      setSearching(true);
      try {
        const data = await storefrontApiRequest(SEARCH_QUERY, { query: query.trim() });
        setResults(data?.data?.products?.edges || []);
      } catch {
        setResults([]);
      } finally {
        setSearching(false);
      }
    }, 350);
    return () => clearTimeout(debounceRef.current);
  }, [query]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/shop?search=${encodeURIComponent(query.trim())}`);
      setSearchOpen(false);
      setQuery('');
      setResults([]);
    }
  };

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

            {/* Search — desktop */}
            <div ref={searchRef} className="relative hidden md:block">
              {searchOpen ? (
                <form onSubmit={handleSearchSubmit} className="flex items-center">
                  <div className="relative flex items-center">
                    <Search className="absolute left-3 h-4 w-4 text-muted-foreground pointer-events-none" />
                    <input
                      ref={inputRef}
                      type="text"
                      value={query}
                      onChange={e => setQuery(e.target.value)}
                      placeholder="Search products..."
                      className="h-9 w-56 pl-9 pr-4 rounded-full border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                    />
                    {query && (
                      <button type="button" onClick={() => { setQuery(''); setResults([]); }}
                        className="absolute right-3 text-muted-foreground hover:text-heading">
                        <X className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>
                  <Button type="button" variant="ghost" size="icon" onClick={() => { setSearchOpen(false); setQuery(''); setResults([]); }}>
                    <X className="h-4 w-4" />
                  </Button>
                </form>
              ) : (
                <Button variant="ghost" size="icon" onClick={() => setSearchOpen(true)}>
                  <Search className="h-5 w-5" />
                </Button>
              )}

              {/* Dropdown results */}
              {searchOpen && (query.trim().length > 0) && (
                <div className="absolute top-full right-0 mt-2 w-80 bg-background border border-border rounded-2xl shadow-lg overflow-hidden z-50">
                  {searching ? (
                    <div className="p-4 text-sm text-muted-foreground text-center">Searching...</div>
                  ) : results.length === 0 ? (
                    <div className="p-4 text-sm text-muted-foreground text-center">No products found</div>
                  ) : (
                    <>
                      {results.map((p) => {
                        const price = parseFloat(p.node.priceRange.minVariantPrice.amount);
                        const img = p.node.images.edges[0]?.node.url;
                        return (
                          <Link
                            key={p.node.id}
                            to={`/product/${p.node.handle}`}
                            className="flex items-center gap-3 px-4 py-3 hover:bg-blue-soft transition-colors border-b border-border last:border-0"
                          >
                            <div className="w-10 h-10 rounded-lg overflow-hidden bg-blue-soft flex-shrink-0">
                              {img && <img src={img} alt={p.node.title} className="w-full h-full object-cover" />}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-heading truncate">{p.node.title}</p>
                              <p className="text-xs text-primary font-semibold">{currencySymbol}{convertPrice(price)}</p>
                            </div>
                          </Link>
                        );
                      })}
                      <button
                        onClick={handleSearchSubmit as any}
                        className="w-full py-3 text-xs font-medium text-primary hover:bg-blue-soft transition-colors text-center"
                      >
                        See all results for "{query}" →
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>

            <Button variant="ghost" size="icon" className="hidden md:flex">
              <User className="h-5 w-5" />
            </Button>

            {/* Currency indicator */}
            <span className="text-xs text-muted-foreground font-medium px-1.5 hidden sm:inline">
              {currencyCode}
            </span>

            {/* Cart */}
            <Button variant="ghost" size="icon" className="relative" onClick={() => setCartOpen(true)}>
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
                <SheetTitle className="mb-4">
                  <img src={logo} alt="Glow & Gadgets" className="h-12 w-auto object-contain" />
                </SheetTitle>

                {/* Mobile search */}
                <form onSubmit={handleSearchSubmit} className="mb-4">
                  <div className="relative flex items-center">
                    <Search className="absolute left-3 h-4 w-4 text-muted-foreground pointer-events-none" />
                    <input
                      type="text"
                      value={query}
                      onChange={e => setQuery(e.target.value)}
                      placeholder="Search products..."
                      className="h-10 w-full pl-9 pr-4 rounded-full border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
                    />
                  </div>
                  {query.trim() && results.length > 0 && (
                    <div className="mt-2 border border-border rounded-xl overflow-hidden">
                      {results.slice(0, 4).map(p => (
                        <Link
                          key={p.node.id}
                          to={`/product/${p.node.handle}`}
                          onClick={() => setMobileOpen(false)}
                          className="flex items-center gap-3 px-3 py-2.5 hover:bg-blue-soft border-b border-border last:border-0"
                        >
                          <div className="w-8 h-8 rounded-lg overflow-hidden bg-blue-soft flex-shrink-0">
                            {p.node.images.edges[0]?.node.url && (
                              <img src={p.node.images.edges[0].node.url} alt={p.node.title} className="w-full h-full object-cover" />
                            )}
                          </div>
                          <p className="text-sm font-medium text-heading truncate">{p.node.title}</p>
                        </Link>
                      ))}
                    </div>
                  )}
                </form>

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

      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
};
