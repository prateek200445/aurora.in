import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { STORAGE_KEYS } from '../utils/constants';
import { getStorageItem, setStorageItem } from '../utils/helpers';

const WishlistContext = createContext(null);

function loadStoredWishlist() {
  const storedValue = getStorageItem(STORAGE_KEYS.WISHLIST, null);
  if (storedValue) {
    return storedValue;
  }

  const legacyValue = getStorageItem(STORAGE_KEYS.CART, null);
  return legacyValue?.wishlist ?? [];
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
    setStorageItem(STORAGE_KEYS.WISHLIST, wishlist);
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