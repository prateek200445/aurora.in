import { ArrowRight, Sparkles, Truck, ShieldCheck } from 'lucide-react';
import { api } from '../data/products';
import CollectionsSection from '../components/CollectionsSection';
import HeroSection from '../components/HeroSection';
import NewsletterForm from '../components/NewsletterForm';
import ProductCard from '../components/ProductCard';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';

export default function Home({ onQuickView }) {

  const { data: trendingProducts = [], isLoading } = useQuery({
    queryKey: ['trending-highlights'],
    queryFn: async () => {
      const all = await api.getProducts({ sortBy: 'featured' });
      return all.filter(p => p.isBestSeller || p.isNew).slice(0, 4);
    }
  });

  return (
    <div className="home-page">
      <HeroSection />
      <CollectionsSection />
      <section className="trust-badges-section">
        <div className="trust-badges-container">
          <div className="badge-item">
            <Truck className="badge-icon" />
            <div className="badge-text">
              <h4>Free Shipping</h4>
              <p>On all orders above ₹4,999</p>
            </div>
          </div>
          <div className="badge-item">
            <ShieldCheck className="badge-icon" />
            <div className="badge-text">
              <h4>Secured Checkouts</h4>
              <p>SSL bank-grade payment encryption</p>
            </div>
          </div>
          <div className="badge-item">
            <Sparkles className="badge-icon" />
            <div className="badge-text">
              <h4>Verified Premium</h4>
              <p>Hand-selected artisan quality</p>
            </div>
          </div>
        </div>
      </section>


      <section className="product-section">
        <div className="section-container">
          <div className="section-header" style={{ marginBottom: '40px' }}>
            <div>
              <span className="section-subtitle">Weekly Highlights</span>
              <h2 className="section-title">Trending Best Sellers</h2>
            </div>
            <Link to="/shop" className="btn btn-outline" style={{ padding: '8px 20px', fontSize: '0.9rem' }}>
              <span>View All Products</span>
              <ArrowRight className="icon-xs" />
            </Link>
          </div>

          {isLoading ? (
            <div className="products-grid">
              {Array.from({ length: 4 }).map((_, idx) => (
                <div key={idx} className="skeleton-card">
                  <div className="skeleton-image pulse"></div>
                  <div className="skeleton-details">
                    <div className="skeleton-line pulse w-33"></div>
                    <div className="skeleton-line pulse w-75"></div>
                    <div className="skeleton-line pulse w-50"></div>
                    <div className="skeleton-line pulse w-25"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="products-grid">
              {trendingProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onQuickView={onQuickView}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Newsletter signup banner */}
      
      <section className="newsletter-section">
        <div className="newsletter-container">
          <NewsletterForm />
        </div>
      </section>
    </div>
  );
}
