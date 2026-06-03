import React from 'react'
import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { render, screen, act } from '@testing-library/react'
import { CartProvider, useCart } from '../CartContext'

// Dummy Component to use CartContext
function CartTestComponent() {
  const {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    cartCount,
    subtotal
  } = useCart()

  return (
    <div>
      <div data-testid="cart-count">{cartCount}</div>
      <div data-testid="subtotal">{subtotal}</div>
      <div data-testid="items-list">
        {cartItems.map((item) => (
          <div key={item.product.id} data-testid={`item-${item.product.id}`}>
            {item.product.name} - Qty: {item.quantity}
          </div>
        ))}
      </div>
      <button
        onClick={() =>
          addToCart({ id: 'p1', name: 'Product 1', price: 100, discountPrice: 90 })
        }
      >
        Add Product 1
      </button>
      <button
        onClick={() =>
          addToCart({ id: 'p2', name: 'Product 2', price: 50 }, 2)
        }
      >
        Add Product 2 Qty 2
      </button>
      <button onClick={() => updateQuantity('p1', 5)}>Set Product 1 Qty 5</button>
      <button onClick={() => removeFromCart('p1')}>Remove Product 1</button>
      <button onClick={clearCart}>Clear Cart</button>
    </div>
  )
}

describe('CartContext', () => {
  beforeEach(() => {
    window.localStorage.clear()
  })

  afterEach(() => {
    window.localStorage.clear()
  })

  it('provides initial empty state', () => {
    render(
      <CartProvider>
        <CartTestComponent />
      </CartProvider>
    )

    expect(screen.getByTestId('cart-count').textContent).toBe('0')
    expect(screen.getByTestId('subtotal').textContent).toBe('0')
  })

  it('adds items to the cart and calculates cartCount and subtotal correctly', () => {
    render(
      <CartProvider>
        <CartTestComponent />
      </CartProvider>
    )

    // Add Product 1 (discountPrice is 90)
    act(() => {
      screen.getByText('Add Product 1').click()
    })

    expect(screen.getByTestId('cart-count').textContent).toBe('1')
    expect(screen.getByTestId('subtotal').textContent).toBe('90')
    expect(screen.getByTestId('item-p1').textContent).toContain('Product 1 - Qty: 1')

    // Add Product 2 Qty 2 (price is 50)
    act(() => {
      screen.getByText('Add Product 2 Qty 2').click()
    })

    expect(screen.getByTestId('cart-count').textContent).toBe('3') // 1 + 2
    expect(screen.getByTestId('subtotal').textContent).toBe('190') // 90 + (50 * 2)
    expect(screen.getByTestId('item-p2').textContent).toContain('Product 2 - Qty: 2')
  })

  it('updates item quantities', () => {
    render(
      <CartProvider>
        <CartTestComponent />
      </CartProvider>
    )

    act(() => {
      screen.getByText('Add Product 1').click()
    })

    expect(screen.getByTestId('cart-count').textContent).toBe('1')

    act(() => {
      screen.getByText('Set Product 1 Qty 5').click()
    })

    expect(screen.getByTestId('cart-count').textContent).toBe('5')
    expect(screen.getByTestId('subtotal').textContent).toBe('450') // 90 * 5
  })

  it('removes item from the cart', () => {
    render(
      <CartProvider>
        <CartTestComponent />
      </CartProvider>
    )

    act(() => {
      screen.getByText('Add Product 1').click()
    })
    expect(screen.getByTestId('item-p1')).toBeInTheDocument()

    act(() => {
      screen.getByText('Remove Product 1').click()
    })
    expect(screen.queryByTestId('item-p1')).not.toBeInTheDocument()
    expect(screen.getByTestId('cart-count').textContent).toBe('0')
  })

  it('clears all items from the cart', () => {
    render(
      <CartProvider>
        <CartTestComponent />
      </CartProvider>
    )

    act(() => {
      screen.getByText('Add Product 1').click()
      screen.getByText('Add Product 2 Qty 2').click()
    })

    expect(screen.getByTestId('cart-count').textContent).toBe('3')

    act(() => {
      screen.getByText('Clear Cart').click()
    })

    expect(screen.getByTestId('cart-count').textContent).toBe('0')
    expect(screen.getByTestId('subtotal').textContent).toBe('0')
  })

  it('restores cart state from localStorage', () => {
    const storedState = {
      cartById: {
        p1: {
          product: { id: 'p1', name: 'Stored Product', price: 100 },
          quantity: 3
        }
      }
    }
    window.localStorage.setItem('aurora-goods-cart', JSON.stringify(storedState))

    render(
      <CartProvider>
        <CartTestComponent />
      </CartProvider>
    )

    expect(screen.getByTestId('cart-count').textContent).toBe('3')
    expect(screen.getByTestId('subtotal').textContent).toBe('300')
    expect(screen.getByTestId('item-p1').textContent).toContain('Stored Product - Qty: 3')
  })
})
