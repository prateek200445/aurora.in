import { useEffect, useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import { CouponProvider } from './context/CouponContext';
import Header from './components/Header';
import CartDrawer from './components/CartDrawer';
import QuickViewModal from './components/QuickViewModal';

import Home from './pages/Home';
import Shop from './pages/Shop';
import ProductDetails from './pages/ProductDetails';
import Wishlist from './pages/Wishlist';
import Checkout from './pages/Checkout';
import NotFound from './pages/NotFound';

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

      {/* Site Footer */}
      
      <footer className="site-footer">
        <div className="footer-container">
          <div className="footer-grid">
            <div className="footer-column footer-about">
              <h3 className="footer-brand" style={{ marginBottom: '10px' }}>
                <Link
                  to="/"
                  onClick={(e) => {
                    if (location.pathname === '/') {
                      e.preventDefault();
                      window.location.reload();
                    }
                  }}
                  style={{ color: 'inherit', textDecoration: 'none' }}
                >
                  Aurora Goods
                </Link>
              </h3>
              <p className="footer-about-desc" style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: '1.6' }}>
                Designing modern essentials that seamlessly elevate your daily life. Consciously crafted, sustainably manufactured, and built to endure.
              </p>
            </div>
            <div className="footer-column footer-links-column">
              <h4>Shop Catalog</h4>
              <ul>
                <li><Link to="/shop?category=Apparel">Apparel</Link></li>
                <li><Link to="/shop?category=Home%20Decor">Home Decor</Link></li>
                <li><Link to="/shop?category=Skincare">Skincare</Link></li>
                <li><Link to="/shop?category=Electronics">Electronics</Link></li>
              </ul>
            </div>
            <div className="footer-column footer-links-column">
              <h4>Customer Care</h4>
              <ul>
                <li><a href="#" onClick={(e) => e.preventDefault()}>Shipping Policy</a></li>
                <li><a href="#" onClick={(e) => e.preventDefault()}>Return & Exchange</a></li>
                <li><a href="#" onClick={(e) => e.preventDefault()}>Sustainable Sourcing</a></li>
                <li><a href="#" onClick={(e) => e.preventDefault()}>FAQ Help Desk</a></li>
              </ul>
            </div>
            <div className="footer-column footer-links-column">
              <h4>Contact Us</h4>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '10px' }}>Got questions or feedback? Connect with our support team.</p>
              <p className="email-contact" style={{ fontWeight: '700', color: 'var(--text-dark)' }}>hello@auroragoods.in</p>
              <p className="phone-contact" style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>+91 (800) 456-7890</p>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; {new Date().getFullYear()} Aurora Goods. All rights reserved.</p>
            <div className="footer-legal-links">
              <a href="#" onClick={(e) => e.preventDefault()} style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginRight: '16px' }}>Privacy Policy</a>
              <a href="#" onClick={(e) => e.preventDefault()} style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>
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
