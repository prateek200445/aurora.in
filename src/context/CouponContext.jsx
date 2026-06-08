import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  useTransition,
  useCallback,
} from "react";
import { api } from "../data/products";
import { useCart } from "./CartContext";
import { STORAGE_KEYS } from "../utils/constants";
import { roundMoney, getStorageItem, setStorageItem } from "../utils/helpers";

const CouponContext = createContext(null);

function loadStoredCouponState() {
  const storedValue = getStorageItem(STORAGE_KEYS.COUPON, null);
  if (storedValue) {
    return storedValue;
  }

  const legacyValue = getStorageItem(STORAGE_KEYS.CART, null);
  if (
    legacyValue &&
    typeof legacyValue === "object" &&
    ("couponCode" in legacyValue || "couponApplied" in legacyValue)
  ) {
    return legacyValue;
  }
  return null;
}

export function CouponProvider({ children }) {
  const { subtotal } = useCart();
  const latestCouponRequestId = useRef(0);
  const [couponCode, setCouponCode] = useState(
    () => loadStoredCouponState()?.couponCode ?? "",
  );
  const [discountPercent, setDiscountPercent] = useState(
    () => loadStoredCouponState()?.discountPercent ?? 0,
  );
  const [couponMessage, setCouponMessage] = useState(
    () => loadStoredCouponState()?.couponMessage ?? "",
  );
  const [couponApplied, setCouponApplied] = useState(
    () => loadStoredCouponState()?.couponApplied ?? false,
  );
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
    } catch {
      if (requestId !== latestCouponRequestId.current) {
        return;
      }

      startTransition(() => {
        setDiscountPercent(0);
        setCouponMessage("Failed to validate promo code.");
        setCouponApplied(false);
      });
    }
  }, []);

  const removePromoCode = useCallback(() => {
    setCouponCode("");
    setDiscountPercent(0);
    setCouponMessage("");
    setCouponApplied(false);
  }, []);

  const discountAmount = useMemo(
    () => roundMoney((subtotal * discountPercent) / 100),
    [subtotal, discountPercent],
  );

  const total = useMemo(
    () => roundMoney(subtotal - discountAmount),
    [subtotal, discountAmount],
  );

  useEffect(() => {
    setStorageItem(STORAGE_KEYS.COUPON, {
      couponCode,
      discountPercent,
      couponMessage,
      couponApplied,
    });
  }, [couponCode, discountPercent, couponMessage, couponApplied]);

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
