import React from 'react';
import { ShoppingBag, ShieldCheck } from 'lucide-react';

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
        <div className="card-title-area" style={{ marginBottom: '16px' }}>
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
                  <div className="checkout-item-qty">Qty: {item.quantity} • ₹{activePrice.toLocaleString('en-IN')}</div>
                </div>
                <div className="checkout-item-total">
                  ₹{(activePrice * item.quantity).toLocaleString('en-IN')}
                </div>
              </div>
            );
          })}
        </div>

        {/* Coupons & Promo Codes */}
        <div style={{ marginBottom: '20px' }}>
          <form onSubmit={handleApplyPromoCode} className="promo-form" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label htmlFor="checkout-promo-code" style={{ fontSize: '0.8rem', fontWeight: '600', color: 'var(--text-dark)' }}>
              Apply Coupon Code
            </label>
            <div className="promo-input-container" style={{ display: 'flex', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)', overflow: 'hidden', backgroundColor: 'var(--bg-secondary)', padding: '2px' }}>
              <input
                id="checkout-promo-code"
                type="text"
                placeholder="Enter code (e.g. AURORA10)"
                value={promoInput}
                onChange={(e) => setPromoInput(e.target.value)}
                disabled={couponApplied || isCouponLoading}
                style={{ flex: 1, padding: '10px 12px', fontSize: '0.9rem', outline: 'none', border: 'none', background: 'transparent' }}
              />
              {couponApplied ? (
                <button
                  type="button"
                  onClick={() => {
                    removePromoCode();
                    setPromoInput('');
                  }}
                  className="btn btn-sm"
                  style={{ padding: '0 16px', borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--text-muted)', color: '#fff', fontSize: '0.85rem' }}
                >
                  Remove
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={isCouponLoading || !promoInput.trim()}
                  className="btn btn-sm btn-primary"
                  style={{ padding: '0 16px', borderRadius: 'var(--radius-sm)', fontSize: '0.85rem' }}
                >
                  {isCouponLoading ? <span className="spinner-sm"></span> : 'Apply'}
                </button>
              )}
            </div>
            {couponMessage && (
              <p className={`promo-message ${couponApplied ? 'success' : 'error'}`} style={{ fontSize: '0.8rem', marginTop: '2px', color: couponApplied ? 'var(--success-color)' : 'var(--error-color)', fontWeight: '500' }}>
                {couponMessage}
              </p>
            )}
          </form>

          {/* Available Offers Quick Selection */}
          <div className="available-offers">
            <span style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Available Offers
            </span>
            
            <div className="offer-card">
              <div>
                <span className="offer-badge">AURORA10</span>
                <div className="offer-desc">10% OFF on all items.</div>
              </div>
              <button 
                className="btn btn-sm btn-outline"
                style={{ padding: '4px 10px', fontSize: '0.75rem', borderRadius: 'var(--radius-sm)' }}
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
                className="btn btn-sm btn-outline"
                style={{ padding: '4px 10px', fontSize: '0.75rem', borderRadius: 'var(--radius-sm)' }}
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
            <span>₹{subtotal.toLocaleString('en-IN')}</span>
          </div>
          {couponApplied && (
            <div className="checkout-summary-row discount">
              <span>Discount ({discountPercent}%)</span>
              <span>-₹{discountAmount.toLocaleString('en-IN')}</span>
            </div>
          )}
          <div className="checkout-summary-row">
            <span>Shipping</span>
            <span style={{ color: 'var(--success-color)', fontWeight: '600' }}>FREE</span>
          </div>
        </div>

        <div className="checkout-summary-row total" style={{ marginBottom: '24px' }}>
          <span>Total</span>
          <span>₹{total.toLocaleString('en-IN')}</span>
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
              <span className="spinner-sm"></span>
              <span>Placing Order...</span>
            </>
          ) : !selectedAddressId ? (
            <span>Add Shipping Address to Proceed</span>
          ) : (
            <span>Place Order Securely</span>
          )}
        </button>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', marginTop: '16px', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
          <ShieldCheck className="icon-xs" style={{ color: 'var(--success-color)' }} />
          <span>SSL Encrypted Payments</span>
        </div>
      </div>
    </div>
  );
}
