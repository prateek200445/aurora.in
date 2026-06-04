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
          <CheckCircle2 className="icon success-icon" />
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
            <span className="success-address-detail-text">
              {currentAddress?.details}
            </span>
          </div>
          <div className="success-detail-row">
            <span>Expected Delivery:</span>
            <span className="expected-delivery-date">In 5 Days ({deliveryDateString})</span>
          </div>
          <div className="success-detail-row border-none">
            <span>Paid Amount:</span>
            <span>₹{total.toLocaleString('en-IN')}</span>
          </div>
        </div>

        <button 
          className="btn btn-primary success-continue-btn"
          onClick={handleCloseSuccessModal}
        >
          Continue Shopping
        </button>
      </div>
    </div>
  );
}
