import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CurrencyProvider } from './context/CurrencyContext';

// Pages
import Index from './pages/Index';
import About from './pages/About';
import ProductDetail from './pages/ProductDetail';
import Contact from './pages/Contact';
import NotFound from './pages/NotFound';
import Shop from './pages/Shop';
import Collections from './pages/Collections';
import CollectionDetail from './pages/CollectionDetail';
import FAQ from './pages/FAQ';
import PrivacyPolicy from './pages/PrivacyPolicy';
import ReturnsExchanges from './pages/ReturnsExchanges';
import ShippingDelivery from './pages/ShippingDelivery';

function App() {
  return (
    <CurrencyProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/about" element={<About />} />
          <Route path="/product/:handle" element={<ProductDetail />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/collections" element={<Collections />} />
          <Route path="/collections/:handle" element={<CollectionDetail />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/returns-exchanges" element={<ReturnsExchanges />} />
          <Route path="/shipping-delivery" element={<ShippingDelivery />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </CurrencyProvider>
  );
}

export default App;
