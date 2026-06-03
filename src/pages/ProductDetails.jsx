import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { api } from '../data/products';
import { Heart, ShoppingBag, Check, Star, ArrowLeft, Shield, RotateCcw, Truck } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';

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
    return (
      <div className="product-details-page loading" style={{ padding: '80px 24px', textAlign: 'center' }}>
        <div className="spinner" style={{ margin: '0 auto 20px', width: '40px', height: '40px' }}></div>
        <p>Loading product details...</p>
      </div>
    );
  }

  if (isError || !product) {
    return (
      <div className="product-details-page error" style={{ padding: '80px 24px', textAlign: 'center' }}>
        <p style={{ color: 'var(--error-color)', marginBottom: '20px' }}>
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
    <div className="product-details-page" style={{ padding: '40px 24px 80px', maxWidth: '1300px', margin: '0 auto' }}>
      <Link to="/shop" className="btn btn-outline" style={{ marginBottom: '32px', padding: '8px 16px', fontSize: '0.9rem', display: 'inline-flex' }}>
        <ArrowLeft className="icon-xs" />
        <span>Back to Catalog</span>
      </Link>

      <div className="modal-grid" style={{ backgroundColor: 'var(--bg-card)', borderRadius: 'var(--radius-lg)', overflow: 'hidden', border: '1px solid var(--border-card)', boxShadow: 'var(--shadow-md)', display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0' }}>
        <div className="modal-image-container" style={{ aspectRatio: '0.95', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {product.isNew && <span className="modal-badge badge-new">New</span>}
          {product.isBestSeller && <span className="modal-badge badge-bestseller">Best Seller</span>}
          <img src={product.image} alt={product.name} className="modal-image" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>

        <div className="modal-details" style={{ padding: '50px' }}>
          <span className="modal-category">{product.category}</span>
          <h1 className="modal-title" style={{ fontSize: '2.2rem', marginBottom: '16px' }}>{product.name}</h1>

          {/* Star Rating */}
          <div className="modal-rating" style={{ marginBottom: '20px' }}>
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
            <span className="reviews-count">({product.reviewsCount} verified customer reviews)</span>
          </div>

          <div className="modal-price" style={{ marginBottom: '24px' }}>
            {hasDiscount ? (
              <>
                <span className="price price-discount" style={{ fontSize: '2rem' }}>₹{product.discountPrice?.toLocaleString('en-IN')}</span>
                <span className="price price-original" style={{ fontSize: '1.25rem' }}>₹{product.price.toLocaleString('en-IN')}</span>
              </>
            ) : (
              <span className="price" style={{ fontSize: '2rem' }}>₹{product.price.toLocaleString('en-IN')}</span>
            )}
          </div>

          <p className="modal-description" style={{ fontSize: '1.02rem', lineHeight: '1.7', marginBottom: '32px' }}>{product.description}</p>

          {/* Features Checklist */}
          <div className="modal-features" style={{ marginBottom: '32px' }}>
            <h4 className="features-heading" style={{ fontSize: '1.05rem', marginBottom: '16px' }}>Product Specifications:</h4>
            <ul className="features-list">
              {product.features.map((feature, i) => (
                <li key={i} className="feature-item" style={{ marginBottom: '8px' }}>
                  <Check className="feature-check" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Inventory Status */}
          <div className="modal-status" style={{ marginBottom: '36px' }}>
            <span className={`status-indicator ${product.inStock ? 'in-stock' : 'out-of-stock'}`}></span>
            <span className="status-text">
              {product.inStock ? 'In Stock — Dispatched within 24 hours' : 'Out of Stock'}
            </span>
          </div>

          {/* Action Buttons */}
          <div className="modal-actions" style={{ gap: '20px' }}>
            <button
              className="btn btn-primary btn-lg flex-1"
              onClick={() => addToCart(product)}
              disabled={!product.inStock}
              style={{ padding: '16px' }}
            >
              <ShoppingBag className="icon-sm" />
              <span>{product.inStock ? 'Add to Cart' : 'Out of Stock'}</span>
            </button>
            <button
              className={`btn btn-outline btn-lg btn-wishlist-toggle ${isWishlisted ? 'active' : ''}`}
              onClick={() => toggleWishlist(product.id)}
              aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
              style={{ padding: '16px' }}
            >
              <Heart className="icon-sm" fill={isWishlisted ? 'var(--accent-color)' : 'none'} />
              <span>{isWishlisted ? 'Wishlisted' : 'Add to Wishlist'}</span>
            </button>
          </div>

          {/* Shipping Perks Footer Info */}
          
          <div style={{ marginTop: '40px', paddingTop: '24px', borderTop: '1px solid var(--border-card)', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', textAlign: 'center' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
              <Truck className="icon-sm" style={{ color: 'var(--accent-color)' }} />
              <span style={{ fontSize: '0.8rem', fontWeight: '600', color: 'var(--text-dark)' }}>Free Shipping</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
              <RotateCcw className="icon-sm" style={{ color: 'var(--accent-color)' }} />
              <span style={{ fontSize: '0.8rem', fontWeight: '600', color: 'var(--text-dark)' }}>7 Day Returns</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
              <Shield className="icon-sm" style={{ color: 'var(--accent-color)' }} />
              <span style={{ fontSize: '0.8rem', fontWeight: '600', color: 'var(--text-dark)' }}>Secured Checkout</span>
            </div>
          </div>
        </div>
      </div>

      {/* Related Products Showcase */}
      
      {relatedProducts.length > 0 && (
        <section className="product-section" style={{ marginTop: '80px', paddingLeft: '0', paddingRight: '0' }}>
          <div className="section-container">
            <div className="section-header" style={{ marginBottom: '40px' }}>
              <div>
                <span className="section-subtitle">Customers Also Viewed</span>
                <h2 className="section-title">Related Essentials</h2>
              </div>
            </div>

            <div className="products-grid">
              {relatedProducts.map((p) => (
                <div key={p.id} style={{ position: 'relative' }}>

                  <Link to={`/product/${p.id}`} style={{ position: 'absolute', inset: '0', zIndex: '2' }} />
                  <div style={{ position: 'relative', zIndex: '3', pointerEvents: 'none' }}>
                    <div style={{ pointerEvents: 'auto' }}>
                      <Link to={`/product/${p.id}`}>
                        <img src={p.image} alt={p.name} style={{ width: '100%', aspectRatio: '0.92', objectFit: 'cover', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-card)', marginBottom: '12px' }} />
                      </Link>
                      <span style={{ fontSize: '0.72rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: '700', letterSpacing: '1px', display: 'block', marginBottom: '4px' }}>{p.category}</span>
                      <h4 style={{ fontSize: '1rem', fontWeight: '600', color: 'var(--text-dark)', marginBottom: '6px' }}>{p.name}</h4>
                      <span style={{ fontSize: '1rem', fontWeight: '700', color: 'var(--text-dark)' }}>₹{p.price.toLocaleString('en-IN')}</span>
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
