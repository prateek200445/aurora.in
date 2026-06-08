import React from 'react';
import { CheckCircle2 } from 'lucide-react';
import { BRAND_NAME } from '../../utils/constants';

export default function SuccessModal({
  isOrderPlaced,
  placedOrderId,
  currentAddress,
  deliveryDateString,
  total,
  handleCloseSuccessModal
}) {
  if (!isOrderPlaced) return null;

  return (
    <div className="checkout-success-modal">
      <div className="success-modal-card">
        <div className="success-icon-wrap">
          <CheckCircle2 className="icon" style={{ width: '40px', height: '40px' }} />
        </div>
        
        <h2 className="success-title">Order Placed Successfully!</h2>
        <p className="success-text">
          Thank you for shopping with {BRAND_NAME}. Your purchase is fully confirmed, and we've scheduled standard 5-day delivery to your selected address.
        </p>

        <div className="success-details-card">
          <div className="success-detail-row">
            <span>Order Reference:</span>
            <span>{placedOrderId}</span>
          </div>
          <div className="success-detail-row">
            <span>Delivery Address:</span>
            <span>{currentAddress?.name || 'Saved Address'}</span>
          </div>
          <div className="success-detail-row">
            <span>Delivery Address Info:</span>
            <span style={{ fontSize: '0.8rem', maxWidth: '240px', textAlign: 'right', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {currentAddress?.details}
            </span>
          </div>
          <div className="success-detail-row">
            <span>Expected Delivery:</span>
            <span style={{ color: 'var(--accent-color)' }}>In 5 Days ({deliveryDateString})</span>
          </div>
          <div className="success-detail-row" style={{ borderBottom: 'none' }}>
            <span>Paid Amount:</span>
            <span>₹{total.toLocaleString('en-IN')}</span>
          </div>
        </div>

        <button 
          className="btn btn-primary"
          style={{ width: '100%', padding: '12px', borderRadius: 'var(--radius-sm)' }}
          onClick={handleCloseSuccessModal}
        >
          Continue Shopping
        </button>
      </div>
    </div>
  );
}
