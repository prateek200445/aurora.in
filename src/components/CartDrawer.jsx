import { X, Minus, Plus, Trash2, Tag, ShoppingCart, ArrowRight, ShieldCheck } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useCoupon } from '../context/CouponContext';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BRAND_NAME, PROMO_CODE_AURORA10 } from '../utils/constants';

export default function CartDrawer({ isOpen, onClose }) {
  const {
    cartItems,
    updateQuantity,
    removeFromCart,
    subtotal
  } = useCart();
  const {
    discountPercent,
    couponMessage,
    isCouponLoading,
    couponApplied,
    applyPromoCode,
    removePromoCode,
    discountAmount,
    total
  } = useCoupon();

  const navigate = useNavigate();
  const [promoInput, setPromoInput] = useState('');
  const [checkoutSuccess, setCheckoutSuccess] = useState(false);

  // Prevent background scrolling when Cart drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.classList.add('no-scroll');
      document.documentElement.classList.add('no-scroll');
    } else {
      document.body.classList.remove('no-scroll');
      document.documentElement.classList.remove('no-scroll');
    }
    return () => {
      document.body.classList.remove('no-scroll');
      document.documentElement.classList.remove('no-scroll');
    };
  }, [isOpen]);

  const handleApplyPromo = (e) => {
    e.preventDefault();
    if (!promoInput.trim()) return;
    applyPromoCode(promoInput);
  };

  const handleCheckout = () => {
    onClose();
    navigate('/checkout');
  };

  if (!isOpen) return null;

  return (
    <div className="cart-overlay" onClick={onClose}>
      <div
        className={`cart-drawer ${isOpen ? 'open' : ''}`}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <div className="cart-header">
          <div className="cart-header-title">
            <ShoppingCart className="icon-sm" />
            <h2>Your Cart</h2>
            <span className="cart-badge">{cartItems.length}</span>
          </div>
          <button className="btn-close" onClick={onClose} aria-label="Close cart">
            <X className="icon" />
          </button>
        </div>

        <div className="cart-body">
          {checkoutSuccess ? (
            <div className="checkout-success-view">
              <div className="success-icon-container">
                <ShieldCheck className="success-icon" />
              </div>
              <h3>Order Placed Successfully!</h3>
              <p>
                Thank you for shopping with {BRAND_NAME}. We have sent a confirmation email along with shipping details.
              </p>
              <button
                className="btn btn-primary"
                onClick={() => {
                  setCheckoutSuccess(false);
                  onClose();
                }}
              >
                Continue Shopping
              </button>
            </div>
          ) : cartItems.length === 0 ? (
            <div className="empty-cart-view">
              <div className="empty-icon-container">
                <ShoppingCart className="empty-icon" />
              </div>
              <h3>Your cart is empty</h3>
              <p>Explore our premium collections and find everything you love today.</p>
              <button
                className="btn btn-primary"
                onClick={() => {
                  onClose();
                  navigate('/shop');
                }}
              >
                Start Shopping
              </button>
            </div>
          ) : (
            <div className="cart-items-list">
              {cartItems.map((item) => {
                const activePrice = item.product.discountPrice ?? item.product.price;
                return (
                  <div key={item.product.id} className="cart-item">
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="cart-item-image"
                    />
                    <div className="cart-item-info">
                      <div className="cart-item-header">
                        <span className="cart-item-category">{item.product.category}</span>
                        <h4 className="cart-item-name">{item.product.name}</h4>
                      </div>
                      <div className="cart-item-actions">
                        <div className="quantity-controls">
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                            className="quantity-btn"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="icon-xs" />
                          </button>
                          <span className="quantity-value">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                            className="quantity-btn"
                            aria-label="Increase quantity"
                          >
                            <Plus className="icon-xs" />
                          </button>
                        </div>
                        <div className="cart-item-pricing">
                          <span className="cart-item-price">
                            ₹{(activePrice * item.quantity).toLocaleString('en-IN')}
                          </span>
                          {item.quantity > 1 && (
                            <span className="cart-item-unit-price">
                              (₹{activePrice.toLocaleString('en-IN')} each)
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <button
                      className="cart-item-remove"
                      onClick={() => removeFromCart(item.product.id)}
                      aria-label="Remove item"
                    >
                      <Trash2 className="icon-xs" />
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {cartItems.length > 0 && !checkoutSuccess && (
          <div className="cart-footer">
            {/* Promo Code Form */}
            <form onSubmit={handleApplyPromo} className="promo-form">
              <div className="promo-input-container">
                <Tag className="promo-icon" />
                <input
                  id="promo-code-input"
                  name="promoCode"
                  type="text"
                  placeholder={`Enter code (e.g. ${PROMO_CODE_AURORA10})`}
                  value={promoInput}
                  onChange={(e) => setPromoInput(e.target.value)}
                  disabled={couponApplied || isCouponLoading}
                  className="promo-input"
                />
                {couponApplied ? (
                  <button
                    type="button"
                    onClick={() => {
                      removePromoCode();
                      setPromoInput('');
                    }}
                    className="btn btn-sm btn-outline btn-promo"
                  >
                    Remove
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={isCouponLoading || !promoInput.trim()}
                    className="btn btn-sm btn-primary btn-promo"
                  >
                    {isCouponLoading ? <span className="spinner-sm"></span> : 'Apply'}
                  </button>
                )}
              </div>
              {couponMessage && (
                <p className={`promo-message ${couponApplied ? 'success' : 'error'}`}>
                  {couponMessage}
                </p>
              )}
              {!couponApplied && (
                <span className="promo-hint">Tip: Try promo code <strong>{PROMO_CODE_AURORA10}</strong> to get 10% off</span>
              )}
            </form>

            {/* Calculations */}

            <div className="cart-summary">
              <div className="summary-row">
                <span>Subtotal</span>
                <span>₹{subtotal.toLocaleString('en-IN')}</span>
              </div>
              {couponApplied && (
                <div className="summary-row discount">
                  <span className="flex items-center gap-1">
                    Discount ({discountPercent}%)
                  </span>
                  <span>-₹{discountAmount.toLocaleString('en-IN')}</span>
                </div>
              )}
              <div className="summary-row shipping">
                <span>Shipping</span>
                <span className="free">FREE</span>
              </div>
              <div className="summary-row total">
                <span>Total</span>
                <span>₹{total.toLocaleString('en-IN')}</span>
              </div>
            </div>

            <button
              className="btn btn-primary btn-lg btn-checkout w-full"
              onClick={handleCheckout}
            >
              <span>Checkout Securely</span>
              <ArrowRight className="icon-sm" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
