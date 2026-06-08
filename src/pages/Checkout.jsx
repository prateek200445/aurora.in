import { useState, useMemo, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useCoupon } from '../context/CouponContext';
import { ArrowLeft, ShoppingBag } from 'lucide-react';
import { toast } from 'react-toastify';
import { STORAGE_KEYS, LABELS } from '../utils/constants';
import { isValidPincode } from '../utils/validation';
import { getDeliveryDateString, getStorageItem, setStorageItem } from '../utils/helpers';
import '../styles/checkout.css';

import PincodeChecker from '../components/checkout/PincodeChecker';
import AddressSection from '../components/checkout/AddressSection';
import PaymentSection from '../components/checkout/PaymentSection';
import OrderSummary from '../components/checkout/OrderSummary';
import SuccessModal from '../components/checkout/SuccessModal';

export default function Checkout() {
  const { cartItems, subtotal, clearCart } = useCart();
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

  const [addresses, setAddresses] = useState(() => getStorageItem(STORAGE_KEYS.CHECKOUT_ADDRESSES, []));
  const [selectedAddressId, setSelectedAddressId] = useState(() => getStorageItem(STORAGE_KEYS.CHECKOUT_SELECTED_ADDRESS_ID, null));
  const [showAddressForm, setShowAddressForm] = useState(false);

  // New Address Form State
  const [newAddress, setNewAddress] = useState({
    tag: 'Home',
    name: '',
    phone: '',
    street: '',
    city: '',
    state: '',
    pincode: ''
  });

  // Pincode State
  const [pincodeQuery, setPincodeQuery] = useState('');
  const [isPincodeChecking, setIsPincodeChecking] = useState(false);
  const [pincodeStatus, setPincodeStatus] = useState(null); // 'success', 'error', null
  const [pincodeMessage, setPincodeMessage] = useState('');

  const [paymentMethod, setPaymentMethod] = useState('cod');

  const [promoInput, setPromoInput] = useState('');
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [isOrderPlaced, setIsOrderPlaced] = useState(false);
  const [placedOrderId, setPlacedOrderId] = useState('');

  const deliveryDateString = useMemo(() => getDeliveryDateString(5), []);

  useEffect(() => {
    setStorageItem(STORAGE_KEYS.CHECKOUT_ADDRESSES, addresses);
  }, [addresses]);

  useEffect(() => {
    setStorageItem(STORAGE_KEYS.CHECKOUT_SELECTED_ADDRESS_ID, selectedAddressId);
  }, [selectedAddressId]);

  useEffect(() => {
    if (selectedAddressId && addresses.length > 0) {
      const addr = addresses.find(a => a.id === selectedAddressId);
      if (addr) {
        setPincodeQuery(addr.pincode);
        setPincodeStatus('success');
        setPincodeMessage(`Deliverable! Standard delivery guaranteed in 5 days by ${deliveryDateString}.`);
      }
    }
  }, []);

  const handleCheckPincode = (e) => {
    e.preventDefault();
    if (!pincodeQuery.trim()) {
      setPincodeStatus('error');
      setPincodeMessage('Please enter a pincode.');
      return;
    }
    
    if (!isValidPincode(pincodeQuery)) {
      setPincodeStatus('error');
      setPincodeMessage('Please enter a valid 6-digit pincode.');
      return;
    }

    setIsPincodeChecking(true);
    setTimeout(() => {
      setIsPincodeChecking(false);
      setPincodeStatus('success');
      setPincodeMessage(`Deliverable! Standard delivery guaranteed in 5 days by ${deliveryDateString}.`);
    }, 600);
  };

  const handleSelectAddress = (id) => {
    setSelectedAddressId(id);
    const addr = addresses.find(a => a.id === id);
    if (addr) {
      setPincodeQuery(addr.pincode);
      setPincodeStatus('success');
      setPincodeMessage(`Deliverable! Standard delivery guaranteed in 5 days by ${deliveryDateString}.`);
    }
  };

  const handleDeleteAddress = (id) => {
    setAddresses(prev => prev.filter(a => a.id !== id));
    if (selectedAddressId === id) {
      setSelectedAddressId(null);
      setPincodeQuery('');
      setPincodeStatus(null);
      setPincodeMessage('');
    }
  };

  const handleNewAddressSubmit = (e) => {
    e.preventDefault();
    const { tag, name, phone, street, city, state, pincode } = newAddress;

    if (!name || !phone || !street || !city || !state || !pincode) {
      toast.error('Please fill out all address fields.');
      return;
    }

    const createdAddress = {
      id: Date.now().toString(),
      tag: tag || 'Other',
      name,
      details: `${street}, ${city}, ${state}`,
      pincode,
      phone
    };

    setAddresses(prev => [...prev, createdAddress]);
    setSelectedAddressId(createdAddress.id);
    
    setPincodeQuery(pincode);
    setPincodeStatus('success');
    setPincodeMessage(`Deliverable! Standard delivery guaranteed in 5 days by ${deliveryDateString}.`);

    setNewAddress({
      tag: 'Home',
      name: '',
      phone: '',
      street: '',
      city: '',
      state: '',
      pincode: ''
    });
    setShowAddressForm(false);
  };

  const handleApplyPromoCode = (e) => {
    e.preventDefault();
    if (!promoInput.trim()) return;
    applyPromoCode(promoInput);
  };

  const handleQuickApply = (code) => {
    setPromoInput(code);
    applyPromoCode(code);
  };

  const handlePlaceOrder = () => {
    if (!selectedAddressId) {
      toast.error('Please add and select a shipping address before placing your order.');
      return;
    }
    setIsPlacingOrder(true);
    
    setTimeout(() => {
      setIsPlacingOrder(false);
      setIsOrderPlaced(true);
      setPlacedOrderId(`AUR-2026-${crypto.randomUUID().slice(0, 8).toUpperCase()}`);
    }, 1800);
  };

  const handleCloseSuccessModal = () => {
    clearCart();
    removePromoCode();
    setIsOrderPlaced(false);
    navigate('/');
  };

  const currentAddress = useMemo(() => {
    return addresses.find(a => a.id === selectedAddressId) || null;
  }, [addresses, selectedAddressId]);

  if (cartItems.length === 0 && !isOrderPlaced) {
    return (
      <div className="checkout-page empty-checkout-page">
        <div className="grid-empty-state checkout-empty-state">
          <div className="empty-icon-box">
            <ShoppingBag className="icon-lg empty-shopping-bag" />
          </div>
          <h3 className="empty-cart-title">{LABELS.CART_EMPTY}</h3>
          <p className="empty-cart-text">
            You cannot proceed to checkout without items in your cart. Add premium essentials to your bag first.
          </p>
          <Link to="/shop" className="btn btn-primary">
            <span>Shop Our Collection</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      <div className="checkout-header">
        <div>
          <span className="section-subtitle">Secure Checkout</span>
          <h1 className="section-title checkout-title">Checkout</h1>
        </div>
        <Link to="/shop" className="btn btn-outline checkout-back-btn">
          <ArrowLeft className="icon-xs" />
          <span>Back to Shop</span>
        </Link>
      </div>

      <div className="checkout-layout">
        <div className="checkout-main">
          <PincodeChecker
            pincodeQuery={pincodeQuery}
            setPincodeQuery={setPincodeQuery}
            isPincodeChecking={isPincodeChecking}
            pincodeStatus={pincodeStatus}
            pincodeMessage={pincodeMessage}
            deliveryDateString={deliveryDateString}
            handleCheckPincode={handleCheckPincode}
          />

          <AddressSection
            addresses={addresses}
            selectedAddressId={selectedAddressId}
            handleSelectAddress={handleSelectAddress}
            handleDeleteAddress={handleDeleteAddress}
            showAddressForm={showAddressForm}
            setShowAddressForm={setShowAddressForm}
            newAddress={newAddress}
            setNewAddress={setNewAddress}
            handleNewAddressSubmit={handleNewAddressSubmit}
          />

          <PaymentSection
            paymentMethod={paymentMethod}
            setPaymentMethod={setPaymentMethod}
          />
        </div>

        <OrderSummary
          cartItems={cartItems}
          subtotal={subtotal}
          total={total}
          couponApplied={couponApplied}
          isCouponLoading={isCouponLoading}
          couponMessage={couponMessage}
          discountPercent={discountPercent}
          discountAmount={discountAmount}
          promoInput={promoInput}
          setPromoInput={setPromoInput}
          handleApplyPromoCode={handleApplyPromoCode}
          handleQuickApply={handleQuickApply}
          handlePlaceOrder={handlePlaceOrder}
          isPlacingOrder={isPlacingOrder}
          selectedAddressId={selectedAddressId}
          removePromoCode={removePromoCode}
        />
      </div>

      <SuccessModal
        isOrderPlaced={isOrderPlaced}
        placedOrderId={placedOrderId}
        currentAddress={currentAddress}
        deliveryDateString={deliveryDateString}
        total={total}
        handleCloseSuccessModal={handleCloseSuccessModal}
      />
    </div>
  );
}
