import { useEffect, useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import { CouponProvider } from './context/CouponContext';
import Header from './components/Header';
import Footer from './components/Footer';
import CartDrawer from './components/CartDrawer';
import QuickViewModal from './components/QuickViewModal';

import Home from './pages/Home';
import Shop from './pages/Shop';
import ProductDetails from './pages/ProductDetails';
import Wishlist from './pages/Wishlist';
import Checkout from './pages/Checkout';
import NotFound from './pages/NotFound';
import Returns from './pages/Returns';
import Sustainability from './pages/Sustainability';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';

import './App.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60 * 5 
    }
  }
});

function MainApp() {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [activeQuickViewProduct, setActiveQuickViewProduct] = useState(null);
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname, location.search]);

  useEffect(() => {
    const handleHomeLogoClick = (e) => {
      const link = e.target.closest('a');
      if (link && link.getAttribute('href') === '/' && location.pathname === '/') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    };
    document.addEventListener('click', handleHomeLogoClick);
    return () => document.removeEventListener('click', handleHomeLogoClick);
  }, [location.pathname]);

  return (
    <div className="app-wrapper">
     
      <Header
        onCartToggle={() => setIsCartOpen(!isCartOpen)}
        onQuickView={setActiveQuickViewProduct}
      />

      <main className="main-content-layout">
        <Routes>
          <Route path="/" element={<Home onQuickView={setActiveQuickViewProduct} />} />
          <Route path="/shop" element={<Shop onQuickView={setActiveQuickViewProduct} />} />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/wishlist" element={<Wishlist onQuickView={setActiveQuickViewProduct} />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/returns" element={<Returns />} />
          <Route path="/sustainability" element={<Sustainability />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<TermsOfService />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      {activeQuickViewProduct && (
        <QuickViewModal
          product={activeQuickViewProduct}
          onClose={() => setActiveQuickViewProduct(null)}
        />
      )}

      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
      <ToastContainer position="bottom-right" autoClose={3000} hideProgressBar={false} />

      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <CartProvider>
        <WishlistProvider>
          <BrowserRouter>
            <CouponProvider>
              <MainApp />
            </CouponProvider>
          </BrowserRouter>
        </WishlistProvider>
      </CartProvider>
    </QueryClientProvider>
  );
}
