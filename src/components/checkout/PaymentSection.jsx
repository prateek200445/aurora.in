import React from "react";
import { CreditCard } from "lucide-react";

export default function PaymentSection({ paymentMethod, setPaymentMethod }) {
  return (
    <div className="checkout-card">
      <div className="card-title-area">
        <div className="card-title-icon">
          <CreditCard className="icon-sm" />
        </div>
        <h3>3. Select Payment Method</h3>
      </div>

      <div className="payment-options-list">
        <div
          className={`payment-option-card ${paymentMethod === "cod" ? "selected" : ""}`}
          onClick={() => setPaymentMethod("cod")}
        >
          <div className="payment-radio"></div>
          <div className="payment-details">
            <span className="payment-name">Cash On Delivery (COD)</span>
            <span className="payment-desc">
              Pay cash when your order gets delivered in 5 days.
            </span>
          </div>
        </div>

        <div
          className={`payment-option-card ${paymentMethod === "upi" ? "selected" : ""}`}
          onClick={() => setPaymentMethod("upi")}
        >
          <div className="payment-radio"></div>
          <div className="payment-details">
            <span className="payment-name">
              UPI / Net Banking (Instant Pay)
            </span>
            <span className="payment-desc">
              Pay securely using Google Pay, PhonePe, Paytm, or Net Banking.
            </span>
          </div>
        </div>

        <div
          className={`payment-option-card ${paymentMethod === "card" ? "selected" : ""}`}
          onClick={() => setPaymentMethod("card")}
        >
          <div className="payment-radio"></div>
          <div className="payment-details">
            <span className="payment-name">Credit / Debit Card</span>
            <span className="payment-desc">
              All major Visa, Mastercard, and RuPay cards accepted.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
