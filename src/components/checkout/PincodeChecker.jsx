import React from 'react';
import { Truck, CheckCircle2, AlertCircle, Calendar } from 'lucide-react';

export default function PincodeChecker({
  pincodeQuery,
  setPincodeQuery,
  isPincodeChecking,
  pincodeStatus,
  pincodeMessage,
  deliveryDateString,
  handleCheckPincode
}) {
  return (
    <div className="checkout-card">
      <div className="card-title-area">
        <div className="card-title-icon">
          <Truck className="icon-sm" />
        </div>
        <h3>1. Delivery Availability & Pincode</h3>
      </div>
      
      <div className="pincode-checker-box">
        <p className="pincode-desc">
          Enter your delivery pincode to check service availability. Enjoy static guaranteed 5-day delivery on all orders.
        </p>
        
        <form onSubmit={handleCheckPincode} className="pincode-input-row">
          <input
            type="text"
            maxLength={6}
            placeholder="Enter 6-digit Pincode (e.g. 201301)"
            className="checkout-input"
            value={pincodeQuery}
            onChange={(e) => setPincodeQuery(e.target.value.replace(/\D/g, ''))}
          />
          <button 
            type="submit" 
            className="btn btn-primary pincode-btn"
            disabled={isPincodeChecking}
          >
            {isPincodeChecking ? <span className="spinner-sm"></span> : 'Check'}
          </button>
        </form>

        {pincodeStatus && (
          <div className={`pincode-result ${pincodeStatus}`}>
            {pincodeStatus === 'success' ? (
              <CheckCircle2 className="icon-xs pincode-status-icon" />
            ) : (
              <AlertCircle className="icon-xs pincode-status-icon" />
            )}
            <span>{pincodeMessage}</span>
          </div>
        )}

        <div className="delivery-badge-card">
          <Calendar className="icon-sm delivery-icon" />
          <div className="delivery-badge-text">
            Standard Delivery Guaranteed: <span>Delivered in 5 Days</span> ({deliveryDateString})
          </div>
        </div>
      </div>
    </div>
  );
}
