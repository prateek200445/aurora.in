import React from "react";
import { MapPin, Plus, Trash2 } from "lucide-react";
import AddressForm from "./AddressForm";

export default function AddressSection({
  addresses,
  selectedAddressId,
  handleSelectAddress,
  handleDeleteAddress,
  showAddressForm,
  setShowAddressForm,
  newAddress,
  setNewAddress,
  handleNewAddressSubmit,
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
        <div className="no-addresses-notice">
          <div className="no-address-icon-wrap">
            <MapPin className="icon-md" />
          </div>
          <h4 className="no-address-title">No Shipping Address Found</h4>
          <p className="no-address-desc">
            Since you are checking out as a guest, there are no saved addresses.
            Please add a shipping address to complete your order.
          </p>
        </div>
      ) : (
        <div className="addresses-grid">
          {addresses.map((address) => (
            <div
              key={address.id}
              className={`address-card ${selectedAddressId === address.id ? "selected" : ""}`}
              onClick={() => handleSelectAddress(address.id)}
            >
              <div className="address-selection-indicator"></div>
              <span className="address-tag">{address.tag}</span>
              <div className="address-name">{address.name}</div>
              <div className="address-details">
                {address.details} - {address.pincode}
              </div>
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
                <Trash2 className="icon-xs" />
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
