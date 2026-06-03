import { Heart, ShoppingBag, Eye, Star } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { Link } from 'react-router-dom';

export default function ProductCard({ product, onQuickView }) {
  const { addToCart } = useCart();
  const { wishlist, toggleWishlist } = useWishlist();
  const isWishlisted = wishlist.includes(product.id);

  const hasDiscount = product.discountPrice !== undefined;

  return (
    <div className="product-card">
      <div className="product-card-image-container">
        {/* Badges */}
        <div className="product-card-badges">
          {product.isNew && <span className="badge badge-new">New</span>}
          {product.isBestSeller && <span className="badge badge-bestseller">Best Seller</span>}
          {hasDiscount && (
            <span className="badge badge-sale">
              -{Math.round(((product.price - (product.discountPrice ?? 0)) / product.price) * 100)}%
            </span>
          )}
        </div>

        {/* Product Image */}
        <Link to={`/product/${product.id}`}>
          <img
            src={product.image}
            alt={product.name}
            className="product-card-image"
            loading="lazy"
          />
        </Link>

        {/* Wishlist Button */}
        <button
          className={`product-card-wishlist ${isWishlisted ? 'active' : ''}`}
          onClick={() => toggleWishlist(product.id)}
          aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <Heart className="icon" fill={isWishlisted ? 'var(--accent-color)' : 'none'} />
        </button>

        {/* Action Overlay */}
        <div className="product-card-overlay">
          <button
            className="btn btn-icon btn-white"
            onClick={() => onQuickView(product)}
            title="Quick View"
          >
            <Eye className="icon-sm" />
            <span>Quick View</span>
          </button>
          <button
            className="btn btn-icon btn-primary"
            onClick={() => addToCart(product)}
            disabled={!product.inStock}
          >
            <ShoppingBag className="icon-sm" />
            <span>{product.inStock ? 'Add to Cart' : 'Out of Stock'}</span>
          </button>
        </div>
      </div>

      {/* Product Details */}
      <div className="product-card-details">
        <span className="product-card-category">{product.category}</span>
        <h3 className="product-card-title">
          <Link to={`/product/${product.id}`}>{product.name}</Link>
        </h3>

        {/* Ratings */}
        <div className="product-card-rating">
          <div className="stars">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={`star-icon ${i < Math.floor(product.rating) ? 'filled' : ''}`}
                fill={i < Math.floor(product.rating) ? 'var(--star-color)' : 'none'}
              />
            ))}
          </div>
          <span className="rating-value">{product.rating}</span>
          <span className="reviews-count">({product.reviewsCount})</span>
        </div>

        {/* Pricing */}
        <div className="product-card-price-container">
          {hasDiscount ? (
            <>
              <span className="price price-discount">₹{product.discountPrice?.toLocaleString('en-IN')}</span>
              <span className="price price-original">₹{product.price.toLocaleString('en-IN')}</span>
            </>
          ) : (
            <span className="price">₹{product.price.toLocaleString('en-IN')}</span>
          )}
        </div>
      </div>
    </div>
  );
}
