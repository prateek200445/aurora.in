import React from 'react'
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { render, screen, act, waitFor } from '@testing-library/react'
import { CartProvider, useCart } from '../CartContext'
import { CouponProvider, useCoupon } from '../CouponContext'
import { api } from '../../data/products'

vi.mock('../../data/products', async () => {
  const actual = await vi.importActual('../../data/products')
  return {
    ...actual,
    api: {
      ...actual.api,
      applyCoupon: vi.fn(async (code) => {
        const normalized = code.toUpperCase().trim()
        if (normalized === 'AURORA10') {
          return { success: true, discountPercent: 10, message: 'AURORA10 applied: 10% Discount!' }
        }
        if (normalized === 'FREESHIP') {
          return { success: true, discountPercent: 0, message: 'FREESHIP applied: Free Shipping!' }
        }
        return { success: false, message: 'Invalid or expired promo code.' }
      })
    }
  }
})

function CouponTestComponent() {
  const { addToCart, clearCart } = useCart()
  const {
    couponCode,
    discountPercent,
    couponMessage,
    couponApplied,
    applyPromoCode,
    removePromoCode,
    discountAmount,
    total
  } = useCoupon()

  return (
    <div>
      <div data-testid="coupon-code">{couponCode}</div>
      <div data-testid="discount-percent">{discountPercent}</div>
      <div data-testid="coupon-message">{couponMessage}</div>
      <div data-testid="coupon-applied">{couponApplied ? 'true' : 'false'}</div>
      <div data-testid="discount-amount">{discountAmount}</div>
      <div data-testid="total">{total}</div>
      <button onClick={() => addToCart({ id: 'p1', name: 'Product 1', price: 100 })}>
        Add Product 100
      </button>
      <button onClick={() => applyPromoCode('AURORA10')}>Apply AURORA10</button>
      <button onClick={() => applyPromoCode('FREESHIP')}>Apply FREESHIP</button>
      <button onClick={() => applyPromoCode('INVALID')}>Apply INVALID</button>
      <button onClick={removePromoCode}>Remove Coupon</button>
      <button onClick={clearCart}>Clear Cart</button>
    </div>
  )
}

describe('CouponContext', () => {
  beforeEach(() => {
    window.localStorage.clear()
  })

  afterEach(() => {
    window.localStorage.clear()
    vi.clearAllMocks()
  })

  it('provides initial empty state', () => {
    render(
      <CartProvider>
        <CouponProvider>
          <CouponTestComponent />
        </CouponProvider>
      </CartProvider>
    )

    expect(screen.getByTestId('coupon-code').textContent).toBe('')
    expect(screen.getByTestId('discount-percent').textContent).toBe('0')
    expect(screen.getByTestId('coupon-applied').textContent).toBe('false')
    expect(screen.getByTestId('discount-amount').textContent).toBe('0')
    expect(screen.getByTestId('total').textContent).toBe('0')
  })

  it('applies coupon successfully and updates total', async () => {
    render(
      <CartProvider>
        <CouponProvider>
          <CouponTestComponent />
        </CouponProvider>
      </CartProvider>
    )

    // Add product to get subtotal = 100
    act(() => {
      screen.getByText('Add Product 100').click()
    })

    // Apply Coupon
    await act(async () => {
      screen.getByText('Apply AURORA10').click()
    })

    await waitFor(() => {
      expect(screen.getByTestId('coupon-code').textContent).toBe('AURORA10')
      expect(screen.getByTestId('discount-percent').textContent).toBe('10')
      expect(screen.getByTestId('coupon-applied').textContent).toBe('true')
      expect(screen.getByTestId('coupon-message').textContent).toContain('AURORA10 applied: 10% Discount!')
      expect(screen.getByTestId('discount-amount').textContent).toBe('10') // 10% of 100
      expect(screen.getByTestId('total').textContent).toBe('90') // 100 - 10
    })
  })

  it('handles invalid coupon codes', async () => {
    render(
      <CartProvider>
        <CouponProvider>
          <CouponTestComponent />
        </CouponProvider>
      </CartProvider>
    )

    act(() => {
      screen.getByText('Add Product 100').click()
    })

    await act(async () => {
      screen.getByText('Apply INVALID').click()
    })

    await waitFor(() => {
      expect(screen.getByTestId('coupon-applied').textContent).toBe('false')
      expect(screen.getByTestId('coupon-message').textContent).toContain('Invalid or expired promo code.')
      expect(screen.getByTestId('discount-amount').textContent).toBe('0')
      expect(screen.getByTestId('total').textContent).toBe('100')
    })
  })

  it('removes applied coupon code', async () => {
    render(
      <CartProvider>
        <CouponProvider>
          <CouponTestComponent />
        </CouponProvider>
      </CartProvider>
    )

    act(() => {
      screen.getByText('Add Product 100').click()
    })

    await act(async () => {
      screen.getByText('Apply AURORA10').click()
    })

    await waitFor(() => {
      expect(screen.getByTestId('coupon-applied').textContent).toBe('true')
    })

    act(() => {
      screen.getByText('Remove Coupon').click()
    })

    expect(screen.getByTestId('coupon-code').textContent).toBe('')
    expect(screen.getByTestId('coupon-applied').textContent).toBe('false')
    expect(screen.getByTestId('discount-amount').textContent).toBe('0')
    expect(screen.getByTestId('total').textContent).toBe('100')
  })

  it('restores coupon state from localStorage', () => {
    const storedCart = {
      cartById: {
        'p1': {
          product: { id: 'p1', name: 'Product 1', price: 100 },
          quantity: 1
        }
      }
    }
    window.localStorage.setItem('aurora-goods-cart', JSON.stringify(storedCart))

    const storedState = {
      couponCode: 'AURORA10',
      discountPercent: 10,
      couponMessage: 'AURORA10 applied: 10% Discount!',
      couponApplied: true
    }
    window.localStorage.setItem('aurora-goods-coupon', JSON.stringify(storedState))

    render(
      <CartProvider>
        <CouponProvider>
          <CouponTestComponent />
        </CouponProvider>
      </CartProvider>
    )

    expect(screen.getByTestId('coupon-code').textContent).toBe('AURORA10')
    expect(screen.getByTestId('discount-percent').textContent).toBe('10')
    expect(screen.getByTestId('coupon-applied').textContent).toBe('true')
  })

  it('clears coupon state when the cart becomes empty', async () => {
    render(
      <CartProvider>
        <CouponProvider>
          <CouponTestComponent />
        </CouponProvider>
      </CartProvider>
    )

    // 1. Add product to the cart
    act(() => {
      screen.getByText('Add Product 100').click()
    })

    // 2. Apply Coupon
    await act(async () => {
      screen.getByText('Apply AURORA10').click()
    })

    await waitFor(() => {
      expect(screen.getByTestId('coupon-applied').textContent).toBe('true')
    })

    // 3. Clear Cart
    act(() => {
      screen.getByText('Clear Cart').click()
    })

    // 4. Verify coupon state is cleared
    await waitFor(() => {
      expect(screen.getByTestId('coupon-code').textContent).toBe('')
      expect(screen.getByTestId('discount-percent').textContent).toBe('0')
      expect(screen.getByTestId('coupon-applied').textContent).toBe('false')
      expect(screen.getByTestId('coupon-message').textContent).toBe('')
    })

    // 5. Verify localStorage for coupon is also cleared/empty
    const storedCoupon = JSON.parse(window.localStorage.getItem('aurora-goods-coupon'))
    expect(storedCoupon?.couponApplied ?? false).toBe(false)
    expect(storedCoupon?.couponCode ?? '').toBe('')
  })
})
