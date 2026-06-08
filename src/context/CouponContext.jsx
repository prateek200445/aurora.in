import React, { createContext, useContext, useEffect, useMemo, useRef, useState, useTransition } from 'react';
import { api } from '../data/products';
import { useCart } from './CartContext';

const CouponContext = createContext(null);
const STORAGE_KEY = "aurora-goods-coupon";
const LEGACY_STORAGE_KEY = "aurora-goods-cart";

function loadStoredCouponState() {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const storedValue = window.localStorage.getItem(STORAGE_KEY);
    if (storedValue) {
      return JSON.parse(storedValue);
    }

    const legacyValue = window.localStorage.getItem(LEGACY_STORAGE_KEY);
    return legacyValue ? JSON.parse(legacyValue) : null;
  } catch (error) {
    return null;
  }
}

function roundMoney(value) {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

const initialCouponState = {
  couponCode: "",
  discountPercent: 0,
  couponMessage: "",
  couponApplied: false,
};

function getInitialCouponState() {
  return {
    ...initialCouponState,
    ...loadStoredCouponState(),
  };
}

export function CouponProvider({ children }) {
  const { subtotal, cartItems } = useCart();

  const latestCouponRequestId = useRef(0);
  const [couponState, setCouponState] = useState(getInitialCouponState);
  const [isPending, startTransition] = useTransition();
  const { couponCode, discountPercent, couponMessage, couponApplied } =
    couponState;

  const clearCoupon = useCallback(() => {
    setCouponState(initialCouponState);
  }, []);

  // Clear coupon state when the cart is completely empty
  useEffect(() => {
    if (
      cartItems.length === 0 &&
      (couponCode || discountPercent || couponMessage || couponApplied)
    ) {
      clearCoupon();
      try {
        window.localStorage.removeItem(STORAGE_KEY);
      } catch (error) {
        // ignore
      }
    }
  }, [
    cartItems.length,
    couponCode,
    discountPercent,
    couponMessage,
    couponApplied,
    clearCoupon,
  ]);

  const applyPromoCode = useCallback(async (code) => {
    const requestId = ++latestCouponRequestId.current;

    try {
      const response = await api.applyCoupon(code);

      if (requestId !== latestCouponRequestId.current) {
        return;
      }

      startTransition(() => {
        if (response.success) {
          setCouponState({
            couponCode: code,
            discountPercent: response.discountPercent ?? 0,
            couponMessage: response.message,
            couponApplied: true,
          });
        } else {
          setCouponState((currentState) => ({
            ...currentState,
            discountPercent: 0,
            couponMessage: response.message,
            couponApplied: false,
          }));
        }
      });
    } catch (error) {
      if (requestId !== latestCouponRequestId.current) {
        return;
      }

      startTransition(() => {
        setCouponState((currentState) => ({
          ...currentState,
          discountPercent: 0,
          couponMessage: "Failed to validate promo code.",
          couponApplied: false,
        }));
      });
    }
  }, []);

  const removePromoCode = useCallback(() => {
    clearCoupon();
  }, [clearCoupon]);

  const discountAmount = useMemo(
    () => roundMoney((subtotal * discountPercent) / 100),
    [subtotal, discountPercent],
  );

  const total = useMemo(
    () => roundMoney(subtotal - discountAmount),
    [subtotal, discountAmount],
  );

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(couponState));
    } catch (error) {}
  }, [couponState]);

  const value = useMemo(
    () => ({
      couponCode,
      discountPercent,
      couponMessage,
      isCouponLoading: isPending,
      couponApplied,
      applyPromoCode,
      removePromoCode,
      discountAmount,
      total,
    }),
    [
      couponCode,
      discountPercent,
      couponMessage,
      isPending,
      couponApplied,
      applyPromoCode,
      removePromoCode,
      discountAmount,
      total,
    ],
  );

  return (
    <CouponContext.Provider value={value}>{children}</CouponContext.Provider>
  );
}

export function useCoupon() {
  const context = useContext(CouponContext);
  if (!context) {
    throw new Error("useCoupon must be used within a CouponProvider");
  }
  return context;
}
