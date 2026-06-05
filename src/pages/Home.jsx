import { ArrowRight, Sparkles, Truck, ShieldCheck } from 'lucide-react';
import { api } from '../data/products';
import CollectionsSection from '../components/CollectionsSection';
import HeroSection from '../components/HeroSection';
import NewsletterForm from '../components/NewsletterForm';
import ProductCard from '../components/ProductCard';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { FREE_SHIPPING_THRESHOLD } from '../utils/constants';
import { formatCurrency } from '../utils/helpers';
import { ProductSkeletonGrid } from '../components/ProductCatalogShared';

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
              <p>On all orders above {formatCurrency(FREE_SHIPPING_THRESHOLD)}</p>
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
          <div className="section-header">
            <div>
              <span className="section-subtitle">Weekly Highlights</span>
              <h2 className="section-title">Trending Best Sellers</h2>
            </div>
            <Link to="/shop" className="btn btn-outline">
              <span>View All Products</span>
              <ArrowRight className="icon-xs" />
            </Link>
          </div>

          {isLoading ? (
            <ProductSkeletonGrid count={4} />
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
