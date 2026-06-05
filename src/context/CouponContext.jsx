import React, { createContext, useContext, useEffect, useMemo, useRef, useState, useTransition, useCallback } from 'react';
import { api } from '../data/products';
import { useCart } from './CartContext';
import { STORAGE_KEYS } from '../utils/constants';

const CouponContext = createContext(null);

function loadStoredCouponState() {
  if (typeof window === 'undefined') {
    return null;
  }

  try {
    const storedValue = window.localStorage.getItem(STORAGE_KEYS.COUPON);
    if (storedValue) {
      return JSON.parse(storedValue);
    }

    const legacyValue = window.localStorage.getItem(STORAGE_KEYS.CART);
    if (legacyValue) {
      const parsed = JSON.parse(legacyValue);
      if (parsed && typeof parsed === 'object' && ('couponCode' in parsed || 'couponApplied' in parsed)) {
        return parsed;
      }
    }
    return null;
  } catch (error) {
    return null;
  }
}

function roundMoney(value) {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

export function CouponProvider({ children }) {
  const { subtotal } = useCart();
  const latestCouponRequestId = useRef(0);
  const [couponCode, setCouponCode] = useState(() => loadStoredCouponState()?.couponCode ?? '');
  const [discountPercent, setDiscountPercent] = useState(() => loadStoredCouponState()?.discountPercent ?? 0);
  const [couponMessage, setCouponMessage] = useState(() => loadStoredCouponState()?.couponMessage ?? '');
  const [couponApplied, setCouponApplied] = useState(() => loadStoredCouponState()?.couponApplied ?? false);
  const [isPending, startTransition] = useTransition();

  const applyPromoCode = useCallback(async (code) => {
    const requestId = ++latestCouponRequestId.current;

    try {
      const response = await api.applyCoupon(code);

      if (requestId !== latestCouponRequestId.current) {
        return;
      }

      startTransition(() => {
        if (response.success) {
          setCouponCode(code);
          setDiscountPercent(response.discountPercent ?? 0);
          setCouponMessage(response.message);
          setCouponApplied(true);
        } else {
          setDiscountPercent(0);
          setCouponMessage(response.message);
          setCouponApplied(false);
        }
      });
    } catch (error) {
      if (requestId !== latestCouponRequestId.current) {
        return;
      }

      startTransition(() => {
        setDiscountPercent(0);
        setCouponMessage('Failed to validate promo code.');
        setCouponApplied(false);
      });
    }
  }, []);

  const removePromoCode = useCallback(() => {
    setCouponCode('');
    setDiscountPercent(0);
    setCouponMessage('');
    setCouponApplied(false);
  }, []);

  const discountAmount = useMemo(
    () => roundMoney((subtotal * discountPercent) / 100),
    [subtotal, discountPercent]
  );

  const total = useMemo(
    () => roundMoney(subtotal - discountAmount),
    [subtotal, discountAmount]
  );

  useEffect(() => {
    try {
      window.localStorage.setItem(
        STORAGE_KEYS.COUPON,
        JSON.stringify({
          couponCode,
          discountPercent,
          couponMessage,
          couponApplied
        })
      );
    } catch (error) {
    }
  }, [couponCode, discountPercent, couponMessage, couponApplied]);

  const value = useMemo(() => ({
    couponCode,
    discountPercent,
    couponMessage,
    isCouponLoading: isPending,
    couponApplied,
    applyPromoCode,
    removePromoCode,
    discountAmount,
    total
  }), [
    couponCode,
    discountPercent,
    couponMessage,
    isPending,
    couponApplied,
    applyPromoCode,
    removePromoCode,
    discountAmount,
    total
  ]);

  return <CouponContext.Provider value={value}>{children}</CouponContext.Provider>;
}

export function useCoupon() {
  const context = useContext(CouponContext);
  if (!context) {
    throw new Error('useCoupon must be used within a CouponProvider');
  }
  return context;
}