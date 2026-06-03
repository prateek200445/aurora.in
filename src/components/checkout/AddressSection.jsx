import React from 'react';
import { MapPin, Plus, Trash2 } from 'lucide-react';
import AddressForm from './AddressForm';

export default function AddressSection({
  addresses,
  selectedAddressId,
  handleSelectAddress,
  handleDeleteAddress,
  showAddressForm,
  setShowAddressForm,
  newAddress,
  setNewAddress,
  handleNewAddressSubmit
}) {
  return (
    <div className="checkout-card">
      <div className="card-title-area">
        <div className="card-title-icon">
          <MapPin className="icon-sm" />
        </div>
        <h3>2. Select Shipping Address</h3>
      </div>

      {addresses.length === 0 ? (
        <div className="no-addresses-notice" style={{
          padding: '32px 24px',
          border: '1.5px dashed var(--border-color)',
          borderRadius: 'var(--radius-sm)',
          backgroundColor: 'var(--bg-secondary)',
          textAlign: 'center',
          marginBottom: '24px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '12px'
        }}>
          <div style={{
            backgroundColor: 'rgba(214, 128, 50, 0.1)',
            color: 'var(--accent-color)',
            padding: '12px',
            borderRadius: '50%',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <MapPin style={{ width: '24px', height: '24px' }} />
          </div>
          <h4 style={{ fontSize: '1.05rem', fontWeight: '700', color: 'var(--text-dark)', margin: '4px 0 0 0' }}>
            No Shipping Address Found
          </h4>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0, maxWidth: '380px', lineHeight: '1.5' }}>
            Since you are checking out as a guest, there are no saved addresses. Please add a shipping address to complete your order.
          </p>
        </div>
      ) : (
        <div className="addresses-grid">
          {addresses.map((address) => (
            <div 
              key={address.id} 
              className={`address-card ${selectedAddressId === address.id ? 'selected' : ''}`}
              onClick={() => handleSelectAddress(address.id)}
            >
              <div className="address-selection-indicator"></div>
              <span className="address-tag">{address.tag}</span>
              <div className="address-name">{address.name}</div>
              <div className="address-details">{address.details} - {address.pincode}</div>
              <div className="address-phone">{address.phone}</div>
              <button
                className="address-delete-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteAddress(address.id);
                }}
                title="Delete Address"
                aria-label={`Delete Address ${address.tag}`}
              >
                <Trash2 style={{ width: '15px', height: '15px' }} />
              </button>
            </div>
          ))}
        </div>
      )}

      {!showAddressForm ? (
        <button 
          className="address-form-toggle-btn"
          onClick={() => setShowAddressForm(true)}
        >
          <Plus className="icon-xs" />
          <span>Add New Address</span>
        </button>
      ) : (
        <AddressForm
          newAddress={newAddress}
          setNewAddress={setNewAddress}
          handleNewAddressSubmit={handleNewAddressSubmit}
          setShowAddressForm={setShowAddressForm}
        />
      )}
    </div>
  );
}
