import { useWishlist } from '../context/WishlistContext';
import { products } from '../data/products';
import ProductCard from '../components/ProductCard';
import { Heart, ArrowLeft, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Wishlist({ onQuickView }) {
  const { wishlist } = useWishlist();

  const wishlistedItems = products.filter((p) => wishlist.includes(p.id));

  return (
    <div className="wishlist-page">
      <div className="section-header">
        <div>
          <span className="section-subtitle">Your Saved Essentials</span>
          <h1 className="section-title">My Wishlist</h1>
        </div>
        <Link to="/shop" className="btn btn-outline">
          <ArrowLeft className="icon-xs" />
          <span>Continue Shopping</span>
        </Link>
      </div>

      

      {wishlistedItems.length === 0 ? (
                /* Empty State when no items are wishlisted */

        <div className="grid-empty-state">
          <div className="empty-search-icon">
            <Heart className="icon-lg" />
          </div>
          <h3>Your wishlist is empty</h3>
          <p>
            Browse through our catalog of sustainable garments, ceramics, and daily skincare to save your favorites!
          </p>
          <Link to="/shop" className="btn btn-primary">
            <span>Explore the Shop</span>
          </Link>
        </div>
      ) : (

        /* Wishlist Grid */
        <div className="products-grid">
          {wishlistedItems.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onQuickView={onQuickView}
            />
          ))}
        </div>
      )}
    </div>
  );
}
