import React, { createContext, useEffect, useMemo, useState, useContext } from 'react';
import { toast } from 'react-toastify';
import { STORAGE_KEYS } from '../utils/constants';
import { getStorageItem, setStorageItem } from '../utils/helpers';

const CartContext = createContext(null);

function loadStoredCartState() {
  return getStorageItem(STORAGE_KEYS.CART, null);
}

function hydrateCartById(storedState) {
  if (!storedState) {
    return {};
  }

  if (storedState.cartById && typeof storedState.cartById === 'object') {
    return storedState.cartById;
  }

  if (Array.isArray(storedState.cartItems)) {
    return storedState.cartItems.reduce((accumulator, item) => {
      if (item?.product?.id) {
        accumulator[item.product.id] = item;
      }
      return accumulator;
    }, {});
  }

  return {};
}

function isValidProduct(product) {
  return Boolean(
    product &&
    typeof product === 'object' &&
    product.id != null &&
    typeof product.price === 'number'
  );
}

export function CartProvider({ children }) {
  const [cartById, setCartById] = useState(() => hydrateCartById(loadStoredCartState()));

  const cartItems = useMemo(() => Object.values(cartById), [cartById]);

  const addToCart = (product, quantity = 1) => {
    if (!isValidProduct(product)) {
      return;
    }

    setCartById((prevItems) => {
      const existing = prevItems[product.id];
      return {
        ...prevItems,
        [product.id]: existing
          ? { ...existing, quantity: existing.quantity + quantity }
          : { product, quantity }
      };
    });

    toast.success(`${product.name} added to your bag!`, {
      position: "bottom-right",
      autoClose: 2500,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
  };

  const removeFromCart = (productId) => {
    setCartById((prevItems) => {
      const nextItems = { ...prevItems };
      delete nextItems[productId];
      return nextItems;
    });
  };

  const updateQuantity = (productId, quantity) => {
    const nextQuantity = Number(quantity);

    if (!Number.isInteger(nextQuantity) || nextQuantity < 1 || nextQuantity > 99) {
      return;
    }

    if (nextQuantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCartById((prevItems) => {
      const existing = prevItems[productId];

      if (!existing) {
        return prevItems;
      }

      return {
        ...prevItems,
        [productId]: { ...existing, quantity: nextQuantity }
      };
    });
  };

  const clearCart = () => {
    setCartById({});
  };

  useEffect(() => {
    setStorageItem(STORAGE_KEYS.CART, { cartById });
  }, [cartById]);

  // Derived values

  const cartCount = useMemo(
    () => cartItems.reduce((acc, item) => acc + item.quantity, 0),
    [cartItems]
  );

  const subtotal = useMemo(
    () => cartItems.reduce((acc, item) => {
      const activePrice = item.product.discountPrice ?? item.product.price;
      return acc + activePrice * item.quantity;
    }, 0),
    [cartItems]
  );

  const value = useMemo(() => ({
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    cartCount,
    subtotal
  }), [
    cartItems,
    cartCount,
    subtotal
  ]);


  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext); 
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
