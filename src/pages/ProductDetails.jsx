import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { api } from '../data/products';
import { Heart, ShoppingBag, Check, ArrowLeft, Shield, RotateCcw, Truck } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { formatCurrency } from '../utils/helpers';
import Spinner from '../components/Spinner';
import RatingStars from '../components/RatingStars';

export default function ProductDetails() {
  const { id } = useParams();
  const { addToCart } = useCart();
  const { wishlist, toggleWishlist } = useWishlist();

  // Fetch product details by ID
  const { data: product, isLoading, isError, error } = useQuery({
    queryKey: ['product', id],
    queryFn: () => api.getProductById(id)
  });

  // Fetch related products of the same category

  const { data: relatedProducts = [] } = useQuery({
    queryKey: ['related-products', product?.category],
    enabled: !!product?.category,
    queryFn: async () => {
      const all = await api.getProducts({ category: product.category });
      return all.filter(p => p.id !== product.id).slice(0, 4);
    }
  });

  if (isLoading) {
    return <Spinner size="lg" message="Loading product details..." />;
  }

  if (isError || !product) {
    return (
      <div className="product-details-page error">
        <p className="product-details-error-msg">
          {error?.message || 'Product not found.'}
        </p>
        <Link to="/shop" className="btn btn-primary">
          <ArrowLeft className="icon-sm" />
          <span>Back to Shop</span>
        </Link>
      </div>
    );
  }

  const isWishlisted = wishlist.includes(product.id);
  const hasDiscount = product.discountPrice !== undefined;

  return (
    <div className="product-details-page">
      <Link to="/shop" className="btn btn-outline details-back-btn">
        <ArrowLeft className="icon-xs" />
        <span>Back to Catalog</span>
      </Link>

      <div className="details-grid">
        <div className="details-image-container">
          {product.isNew && <span className="modal-badge badge-new">New</span>}
          {product.isBestSeller && <span className="modal-badge badge-bestseller">Best Seller</span>}
          <img src={product.image} alt={product.name} className="details-image" />
        </div>

        <div className="details-info-pane">
          <span className="modal-category">{product.category}</span>
          <h1 className="details-title">{product.name}</h1>

          {/* Star Rating */}
          <div className="details-rating-row">
            <RatingStars rating={product.rating} />
            <span className="rating-value">{product.rating}</span>
            <span className="reviews-count">({product.reviewsCount} verified customer reviews)</span>
          </div>

          <div className="details-price-row">
            {hasDiscount ? (
              <>
                <span className="price price-discount details-price-discount">{formatCurrency(product.discountPrice)}</span>
                <span className="price price-original details-price-original">{formatCurrency(product.price)}</span>
              </>
            ) : (
              <span className="price details-price-regular">{formatCurrency(product.price)}</span>
            )}
          </div>

          <p className="details-description">{product.description}</p>

          {/* Features Checklist */}
          <div className="details-features-section">
            <h4 className="details-features-heading">Product Specifications:</h4>
            <ul className="features-list">
              {product.features.map((feature, i) => (
                <li key={i} className="details-feature-item">
                  <Check className="feature-check" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Inventory Status */}
          <div className="details-status-row">
            <span className={`status-indicator ${product.inStock ? 'in-stock' : 'out-of-stock'}`}></span>
            <span className="status-text">
              {product.inStock ? 'In Stock — Dispatched within 24 hours' : 'Out of Stock'}
            </span>
          </div>

          {/* Action Buttons */}
          <div className="details-actions-row">
            <button
              className="btn btn-primary btn-lg flex-1 details-action-btn"
              onClick={() => addToCart(product)}
              disabled={!product.inStock}
            >
              <ShoppingBag className="icon-sm" />
              <span>{product.inStock ? 'Add to Cart' : 'Out of Stock'}</span>
            </button>
            <button
              className={`btn btn-outline btn-lg btn-wishlist-toggle ${isWishlisted ? 'active' : ''}`}
              onClick={() => toggleWishlist(product.id)}
              aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
            >
              <Heart className="icon-sm" fill={isWishlisted ? 'var(--accent-color)' : 'none'} />
              <span>{isWishlisted ? 'Wishlisted' : 'Add to Wishlist'}</span>
            </button>
          </div>

          {/* Shipping Perks Footer Info */}
          
          <div className="details-trust-badges">
            <div className="details-trust-item">
              <Truck className="icon-sm details-trust-icon" />
              <span className="details-trust-text">Free Shipping</span>
            </div>
            <div className="details-trust-item">
              <RotateCcw className="icon-sm details-trust-icon" />
              <span className="details-trust-text">7 Day Returns</span>
            </div>
            <div className="details-trust-item">
              <Shield className="icon-sm details-trust-icon" />
              <span className="details-trust-text">Secured Checkout</span>
            </div>
          </div>
        </div>
      </div>

      {/* Related Products Showcase */}
      
      {relatedProducts.length > 0 && (
        <section className="product-section details-related-section">
          <div className="section-container">
            <div className="section-header details-related-header">
              <div>
                <span className="section-subtitle">Customers Also Viewed</span>
                <h2 className="section-title">Related Essentials</h2>
              </div>
            </div>

            <div className="products-grid">
              {relatedProducts.map((p) => (
                <div key={p.id} className="details-related-card-wrap">

                  <Link to={`/product/${p.id}`} className="details-related-link-overlay" />
                  <div className="details-related-inner">
                    <div className="details-related-interactive">
                      <Link to={`/product/${p.id}`}>
                        <img src={p.image} alt={p.name} className="details-related-img" />
                      </Link>
                      <span className="details-related-category">{p.category}</span>
                      <h4 className="details-related-name">{p.name}</h4>
                      <span className="details-related-price">{formatCurrency(p.price)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
