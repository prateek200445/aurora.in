import React from 'react';
import { cleanPincode } from '../../utils/validation';

export default function AddressForm({
  newAddress,
  setNewAddress,
  handleNewAddressSubmit,
  setShowAddressForm
}) {
  return (
    <div className="address-form-container">
      <h4 className="address-form-title">New Delivery Address</h4>
      <form onSubmit={handleNewAddressSubmit}>
        <div className="form-grid">
          <div className="form-group">
            <label htmlFor="address-tag">Address Type</label>
            <select 
              id="address-tag"
              className="checkout-input"
              value={newAddress.tag}
              onChange={(e) => setNewAddress(prev => ({ ...prev, tag: e.target.value }))}
            >
              <option value="Home">Home</option>
              <option value="Office">Office</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="address-name">Full Name *</label>
            <input 
              id="address-name"
              type="text" 
              required
              className="checkout-input"
              placeholder="e.g. Prateek Sharma"
              value={newAddress.name}
              onChange={(e) => setNewAddress(prev => ({ ...prev, name: e.target.value }))}
            />
          </div>

          <div className="form-group">
            <label htmlFor="address-phone">Phone Number *</label>
            <input 
              id="address-phone"
              type="tel" 
              required
              className="checkout-input"
              placeholder="e.g. +91 98765 43210"
              value={newAddress.phone}
              onChange={(e) => setNewAddress(prev => ({ ...prev, phone: e.target.value }))}
            />
          </div>

          <div className="form-group">
            <label htmlFor="address-pincode">Pincode *</label>
            <input 
              id="address-pincode"
              type="text" 
              required
              maxLength={6}
              className="checkout-input"
              placeholder="e.g. 201301"
              value={newAddress.pincode}
              onChange={(e) => setNewAddress(prev => ({ ...prev, pincode: cleanPincode(e.target.value) }))}
            />
          </div>

          <div className="form-group full-width">
            <label htmlFor="address-street">Flat, House no., Building, Street *</label>
            <input 
              id="address-street"
              type="text" 
              required
              className="checkout-input"
              placeholder="e.g. 123, Lavender Heights, Sector 62"
              value={newAddress.street}
              onChange={(e) => setNewAddress(prev => ({ ...prev, street: e.target.value }))}
            />
          </div>

          <div className="form-group">
            <label htmlFor="address-city">City *</label>
            <input 
              id="address-city"
              type="text" 
              required
              className="checkout-input"
              placeholder="e.g. Noida"
              value={newAddress.city}
              onChange={(e) => setNewAddress(prev => ({ ...prev, city: e.target.value }))}
            />
          </div>

          <div className="form-group">
            <label htmlFor="address-state">State *</label>
            <input 
              id="address-state"
              type="text" 
              required
              className="checkout-input"
              placeholder="e.g. Uttar Pradesh"
              value={newAddress.state}
              onChange={(e) => setNewAddress(prev => ({ ...prev, state: e.target.value }))}
            />
          </div>
        </div>

        <div className="form-actions">
          <button 
            type="button" 
            className="btn btn-outline address-form-btn"
            onClick={() => setShowAddressForm(false)}
          >
            Cancel
          </button>
          <button 
            type="submit" 
            className="btn btn-primary address-form-btn"
          >
            Save & Use Address
          </button>
        </div>
      </form>
    </div>
  );
}
