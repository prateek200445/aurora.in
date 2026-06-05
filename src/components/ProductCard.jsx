import { Heart, ShoppingBag, Eye } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { Link } from 'react-router-dom';
import { formatCurrency, calculateDiscountPercentage } from '../utils/helpers';
import RatingStars from './RatingStars';

export default function ProductCard({ product, onQuickView }) {
  const { addToCart } = useCart();
  const { wishlist, toggleWishlist } = useWishlist();
  const isWishlisted = wishlist.includes(product.id);

  const hasDiscount = product.discountPrice !== undefined;
  const discountPercentage = calculateDiscountPercentage(product.price, product.discountPrice);

  return (
    <div className="product-card">
      <div className="product-card-image-container">
        {/* Badges */}
        <div className="product-card-badges">
          {product.isNew && <span className="badge badge-new">New</span>}
          {product.isBestSeller && <span className="badge badge-bestseller">Best Seller</span>}
          {hasDiscount && (
            <span className="badge badge-sale">
              -{discountPercentage}%
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
          <RatingStars rating={product.rating} />
          <span className="rating-value">{product.rating}</span>
          <span className="reviews-count">({product.reviewsCount})</span>
        </div>

        {/* Pricing */}
        <div className="product-card-price-container">
          {hasDiscount ? (
            <>
              <span className="price price-discount">{formatCurrency(product.discountPrice)}</span>
              <span className="price price-original">{formatCurrency(product.price)}</span>
            </>
          ) : (
            <span className="price">{formatCurrency(product.price)}</span>
          )}
        </div>
      </div>
    </div>
  );
}
