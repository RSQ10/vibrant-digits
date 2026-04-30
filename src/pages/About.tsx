import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import { CurrencyProvider } from './context/CurrencyContext';
import CurrencyPopup from './components/CurrencyPopup';

// Pages
import Home from './pages/Home';
import About from './pages/About';
import Product from './pages/Product';
import Contact from './pages/Contact';
import NotFound from './pages/NotFound';

// Layout (if you have one)
import Navbar from './components/Navbar';
import Footer from './components/Footer';

function App() {
  return (
    <CurrencyProvider>
      <Router>
        
        {/* 🌍 Currency Detection Popup */}
        <CurrencyPopup />

        {/* 🔝 Navbar */}
        <Navbar />

        {/* 📄 Routes */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/product/:id" element={<Product />} />
          <Route path="/contact" element={<Contact />} />
          
          {/* 404 fallback */}
          <Route path="*" element={<NotFound />} />
        </Routes>

        {/* 🔻 Footer */}
        <Footer />

      </Router>
    </CurrencyProvider>
  );
}

export default App;
