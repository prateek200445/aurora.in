import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import HeroGrid from './HeroGrid';

export default function HeroSection() {
  return (
    <section className="hero-section">
      <div className="hero-container">
        <div className="hero-text-content">
          <h1 className="hero-title">
            Essentials Designed <br />
            <span>For Modern Living</span>
          </h1>
          <p className="hero-subtitle">
            A curated collection of minimalist organic apparel, beautiful hand-crafted stoneware decor, and sustainable skincare solutions. Experience goods built for beauty, purpose, and longevity.
          </p>
          <div className="hero-actions">
            <Link to="/shop" className="btn btn-primary btn-lg btn-hero">
              <span>Shop the Catalog</span>
              <ArrowRight className="icon-sm" />
            </Link>
            <a href="#collections" className="btn btn-outline btn-lg">
              <span>View Collections</span>
            </a>
          </div>
        </div>

        <div className="hero-visual-collage">
          <HeroGrid />
        </div>
      </div>
    </section>
  );
}