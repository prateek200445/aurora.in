import { Link } from 'react-router-dom';
import { ArrowLeft, Home } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="not-found-page">
      <span className="not-found-subtitle">
        Error Code 404
      </span>
      <h1 className="not-found-title">
        Page Not Found
      </h1>
      <p className="not-found-desc">
        We're sorry, but the page you are looking for does not exist, has been removed, or is temporarily unavailable. Let's get you back to modern living!
      </p>
      <div className="not-found-actions">
        <Link to="/" className="btn btn-primary not-found-btn">
          <Home className="icon-sm" />
          <span>Return Home</span>
        </Link>
        <Link to="/shop" className="btn btn-outline not-found-btn">
          <ArrowLeft className="icon-sm" />
          <span>Go to Shop</span>
        </Link>
      </div>
    </div>
  );
}
