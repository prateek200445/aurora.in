import React from 'react';
import { ShoppingBag, ShieldCheck } from 'lucide-react';
import { formatCurrency } from '../../utils/helpers';
import Spinner from '../Spinner';

export default function OrderSummary({
  cartItems,
  subtotal,
  total,
  couponApplied,
  isCouponLoading,
  couponMessage,
  discountPercent,
  discountAmount,
  promoInput,
  setPromoInput,
  handleApplyPromoCode,
  handleQuickApply,
  handlePlaceOrder,
  isPlacingOrder,
  selectedAddressId,
  removePromoCode
}) {
  return (
    <div className="checkout-sidebar">
      {/* Order Summary & Coupon Form Card */}
      <div className="checkout-card">
        <div className="card-title-area">
          <div className="card-title-icon">
            <ShoppingBag className="icon-sm" />
          </div>
          <h3>Order Summary</h3>
        </div>

        {/* Items List */}
        <div className="checkout-items-list">
          {cartItems.map((item) => {
            const activePrice = item.product.discountPrice ?? item.product.price;
            return (
              <div key={item.product.id} className="checkout-item-row">
                <img 
                  src={item.product.image} 
                  alt={item.product.name} 
                  className="checkout-item-thumb"
                />
                <div className="checkout-item-details">
                  <div className="checkout-item-title">{item.product.name}</div>
                  <div className="checkout-item-qty">Qty: {item.quantity} • {formatCurrency(activePrice)}</div>
                </div>
                <div className="checkout-item-total">
                  {formatCurrency(activePrice * item.quantity)}
                </div>
              </div>
            );
          })}
        </div>

        {/* Coupons & Promo Codes */}
        <div className="checkout-promo-section">
          <form onSubmit={handleApplyPromoCode} className="promo-form">
            <label htmlFor="checkout-promo-code" className="promo-label">
              Apply Coupon Code
            </label>
            <div className="promo-input-container">
              <input
                id="checkout-promo-code"
                type="text"
                placeholder="Enter code (e.g. AURORA10)"
                value={promoInput}
                onChange={(e) => setPromoInput(e.target.value)}
                disabled={couponApplied || isCouponLoading}
                className="promo-input-field"
              />
              {couponApplied ? (
                <button
                  type="button"
                  onClick={() => {
                    removePromoCode();
                    setPromoInput('');
                  }}
                  className="btn btn-sm btn-promo-remove"
                >
                  Remove
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={isCouponLoading || !promoInput.trim()}
                  className="btn btn-sm btn-primary btn-promo-apply"
                >
                  {isCouponLoading ? <Spinner size="sm" /> : 'Apply'}
                </button>
              )}
            </div>
            {couponMessage && (
              <p className={`promo-message ${couponApplied ? 'success' : 'error'}`}>
                {couponMessage}
              </p>
            )}
          </form>

          {/* Available Offers Quick Selection */}
          <div className="available-offers">
            <span className="offers-heading">
              Available Offers
            </span>
            
            <div className="offer-card">
              <div>
                <span className="offer-badge">AURORA10</span>
                <div className="offer-desc">10% OFF on all items.</div>
              </div>
              <button 
                className="btn btn-sm btn-outline btn-quick-apply"
                onClick={() => handleQuickApply('AURORA10')}
                disabled={couponApplied}
              >
                Apply
              </button>
            </div>

            <div className="offer-card">
              <div>
                <span className="offer-badge">FREESHIP</span>
                <div className="offer-desc">Free Delivery on all orders.</div>
              </div>
              <button 
                className="btn btn-sm btn-outline btn-quick-apply"
                onClick={() => handleQuickApply('FREESHIP')}
                disabled={couponApplied}
              >
                Apply
              </button>
            </div>
          </div>
        </div>

        {/* Cost Breakdown */}
        <div className="checkout-summary-breakdown">
          <div className="checkout-summary-row">
            <span>Subtotal</span>
            <span>{formatCurrency(subtotal)}</span>
          </div>
          {couponApplied && (
            <div className="checkout-summary-row discount">
              <span>Discount ({discountPercent}%)</span>
              <span>-{formatCurrency(discountAmount)}</span>
            </div>
          )}
          <div className="checkout-summary-row">
            <span>Shipping</span>
            <span className="shipping-free">FREE</span>
          </div>
        </div>

        <div className="checkout-summary-row total">
          <span>Total</span>
          <span>{formatCurrency(total)}</span>
        </div>

        {/* Place Order Button */}
        <button
          className="btn btn-primary btn-place-order"
          onClick={handlePlaceOrder}
          disabled={isPlacingOrder || !selectedAddressId}
          style={{
            opacity: (!selectedAddressId && !isPlacingOrder) ? 0.6 : 1,
            cursor: !selectedAddressId ? 'not-allowed' : 'pointer'
          }}
        >
          {isPlacingOrder ? (
            <>
              <Spinner size="sm" />
              <span>Placing Order...</span>
            </>
          ) : !selectedAddressId ? (
            <span>Add Shipping Address to Proceed</span>
          ) : (
            <span>Place Order Securely</span>
          )}
        </button>

        <div className="ssl-info-container">
          <ShieldCheck className="icon-xs ssl-icon" />
          <span>SSL Encrypted Payments</span>
        </div>
      </div>
    </div>
  );
}
