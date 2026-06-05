import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { STORAGE_KEYS } from '../utils/constants';

const WishlistContext = createContext(null);

function loadStoredWishlist() {
  if (typeof window === 'undefined') {
    return [];
  }

  try {
    const storedValue = window.localStorage.getItem(STORAGE_KEYS.WISHLIST);
    if (storedValue) {
      return JSON.parse(storedValue) ?? [];
    }

    const legacyValue = window.localStorage.getItem(STORAGE_KEYS.CART);
    if (!legacyValue) {
      return [];
    }

    const legacyState = JSON.parse(legacyValue);
    return legacyState?.wishlist ?? [];
  } catch (error) {
    return [];
  }
}

export function WishlistProvider({ children }) {
  const [wishlist, setWishlist] = useState(() => loadStoredWishlist());

  const toggleWishlist = (productId) => {
    setWishlist((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEYS.WISHLIST, JSON.stringify(wishlist));
    } catch (error) {
    }
  }, [wishlist]);

  const value = useMemo(() => ({
    wishlist,
    toggleWishlist,
    wishlistCount: wishlist.length
  }), [wishlist]);

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
}