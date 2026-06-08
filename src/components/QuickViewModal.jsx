import { X, Heart, ShoppingBag, Check } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useEffect, useRef } from 'react';
import { formatCurrency } from '../utils/helpers';
import { LABELS } from '../utils/constants';
import { useLockBodyScroll } from '../hooks/useLockBodyScroll';
import RatingStars from './RatingStars';

export default function QuickViewModal({ product, onClose }) {
  const { addToCart } = useCart();
  const { wishlist, toggleWishlist } = useWishlist();
  const isWishlisted = wishlist.includes(product.id);
  const modalRef = useRef(null);

  const hasDiscount = product.discountPrice !== undefined;

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  // Prevent background scrolling when Quick View modal is open
  useLockBodyScroll(true);

  // Click outside modal content closes modal
  const handleOverlayClick = (e) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      onClose();
    }
  };

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal-content" ref={modalRef} role="dialog" aria-modal="true">
        {/* Close Button */}
        <button
          className="modal-close"
          onClick={onClose}
          aria-label="Close modal"
        >
          <X className="icon" />
        </button>

        <div className="modal-grid">
          {/* Left Column: Product Image */}
          <div className="modal-image-container">
            {product.isNew && <span className="modal-badge badge-new">{LABELS.NEW}</span>}
            {product.isBestSeller && <span className="modal-badge badge-bestseller">{LABELS.BEST_SELLER}</span>}
            <img src={product.image} alt={product.name} className="modal-image" />
          </div>

          {/* Right Column: Product Details */}
          <div className="modal-details">
            <span className="modal-category">{product.category}</span>
            <h2 className="modal-title">{product.name}</h2>

            {/* Star Rating */}
            <div className="modal-rating">
              <RatingStars rating={product.rating} />
              <span className="rating-value">{product.rating}</span>
              <span className="reviews-count">({product.reviewsCount} verified reviews)</span>
            </div>

            {/* Price */}
            <div className="modal-price">
              {hasDiscount ? (
                <>
                  <span className="price price-discount">{formatCurrency(product.discountPrice)}</span>
                  <span className="price price-original">{formatCurrency(product.price)}</span>
                </>
              ) : (
                <span className="price">{formatCurrency(product.price)}</span>
              )}
            </div>

            {/* Description */}
            <p className="modal-description">{product.description}</p>

            {/* Features Checklist */}
            <div className="modal-features">
              <h4 className="features-heading">Key Features:</h4>
              <ul className="features-list">
                {product.features.map((feature, i) => (
                  <li key={i} className="feature-item">
                    <Check className="feature-check" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Inventory Status */}
            <div className="modal-status">
              <span className={`status-indicator ${product.inStock ? 'in-stock' : 'out-of-stock'}`}></span>
              <span className="status-text">
                {product.inStock ? 'In Stock — Available to ship immediately' : 'Out of Stock'}
              </span>
            </div>

            {/* Action Buttons */}
            <div className="modal-actions">
              <button
                className="btn btn-primary btn-lg flex-1"
                onClick={() => {
                  addToCart(product);
                  onClose();
                }}
                disabled={!product.inStock}
              >
                <ShoppingBag className="icon-sm" />
                <span>{product.inStock ? LABELS.ADD_TO_CART : LABELS.OUT_OF_STOCK}</span>
              </button>
              <button
                className={`btn btn-outline btn-lg btn-wishlist-toggle ${isWishlisted ? 'active' : ''}`}
                onClick={() => toggleWishlist(product.id)}
                aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
              >
                <Heart className="icon-sm" fill={isWishlisted ? 'var(--accent-color)' : 'none'} />
                <span>{isWishlisted ? LABELS.WISHLISTED : LABELS.ADD_TO_WISHLIST}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
