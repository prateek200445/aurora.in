import { Link } from 'react-router-dom';
import { ArrowLeft, Home } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="not-found-page" style={{ padding: '120px 24px', textAlign: 'center', maxWidth: '600px', margin: '0 auto' }}>
      <span className="section-subtitle" style={{ fontSize: '1rem', color: 'var(--accent-color)', fontWeight: '800', letterSpacing: '3px', textTransform: 'uppercase', display: 'block', marginBottom: '16px' }}>
        Error Code 404
      </span>
      <h1 className="hero-title" style={{ fontSize: '3.5rem', lineHeight: '1', marginBottom: '24px', color: 'var(--text-dark)' }}>
        Page Not Found
      </h1>
      <p className="hero-subtitle" style={{ fontSize: '1.1rem', color: 'var(--text-muted)', lineHeight: '1.6', marginBottom: '40px' }}>
        We're sorry, but the page you are looking for does not exist, has been removed, or is temporarily unavailable. Let's get you back to modern living!
      </p>
      <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
        <Link to="/" className="btn btn-primary" style={{ padding: '12px 24px' }}>
          <Home className="icon-sm" />
          <span>Return Home</span>
        </Link>
        <Link to="/shop" className="btn btn-outline" style={{ padding: '12px 24px' }}>
          <ArrowLeft className="icon-sm" />
          <span>Go to Shop</span>
        </Link>
      </div>
    </div>
  );
}
