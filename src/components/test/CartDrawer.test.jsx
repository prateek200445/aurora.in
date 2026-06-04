import React from 'react'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, act, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import CartDrawer from '../CartDrawer'
import { useCart } from '../../context/CartContext'
import { useCoupon } from '../../context/CouponContext'

const mockNavigate = vi.fn()
vi.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate
}))

vi.mock('../../context/CartContext', () => ({
  useCart: vi.fn()
}))

vi.mock('../../context/CouponContext', () => ({
  useCoupon: vi.fn()
}))

const mockCartItems = [
  {
    product: {
      id: 'prod-1',
      name: 'Ceramic Stoneware Mug',
      category: 'Home Decor',
      price: 800,
      image: '/mug.png'
    },
    quantity: 2
  }
]

describe('CartDrawer', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.useFakeTimers()
    useCart.mockReturnValue({
      cartItems: [],
      updateQuantity: vi.fn(),
      removeFromCart: vi.fn(),
      clearCart: vi.fn(),
      subtotal: 0
    })
    useCoupon.mockReturnValue({
      discountPercent: 0,
      couponMessage: '',
      isCouponLoading: false,
      couponApplied: false,
      applyPromoCode: vi.fn(),
      removePromoCode: vi.fn(),
      discountAmount: 0,
      total: 0
    })
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('renders nothing when isOpen is false', () => {
    const { container } = render(<CartDrawer isOpen={false} onClose={vi.fn()} />)
    expect(container.firstChild).toBeNull()
  })

  it('renders empty cart message when cart is empty', () => {
    useCart.mockReturnValue({
      cartItems: [],
      updateQuantity: vi.fn(),
      removeFromCart: vi.fn(),
      clearCart: vi.fn(),
      subtotal: 0
    })

    useCoupon.mockReturnValue({
      discountPercent: 0,
      couponMessage: '',
      isCouponLoading: false,
      couponApplied: false,
      applyPromoCode: vi.fn(),
      removePromoCode: vi.fn(),
      discountAmount: 0,
      total: 0
    })

    render(<CartDrawer isOpen={true} onClose={vi.fn()} />)

    expect(screen.getByText('Your cart is empty')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /start shopping/i })).toBeInTheDocument()
  })

  it('renders cart items and details correctly', () => {
    useCart.mockReturnValue({
      cartItems: mockCartItems,
      updateQuantity: vi.fn(),
      removeFromCart: vi.fn(),
      clearCart: vi.fn(),
      subtotal: 1600
    })

    useCoupon.mockReturnValue({
      discountPercent: 0,
      couponMessage: '',
      isCouponLoading: false,
      couponApplied: false,
      applyPromoCode: vi.fn(),
      removePromoCode: vi.fn(),
      discountAmount: 0,
      total: 1600
    })

    render(<CartDrawer isOpen={true} onClose={vi.fn()} />)

    expect(screen.getByText('Ceramic Stoneware Mug')).toBeInTheDocument()
    expect(screen.getAllByText('₹1,600')[0]).toBeInTheDocument()
    expect(screen.getByText('(₹800 each)')).toBeInTheDocument()
    expect(screen.getByText('Subtotal')).toBeInTheDocument()
    expect(screen.getAllByText('₹1,600')[1]).toBeInTheDocument()
  })

  it('calls updateQuantity and removeFromCart when clicked', () => {
    const updateQuantityMock = vi.fn()
    const removeFromCartMock = vi.fn()

    useCart.mockReturnValue({
      cartItems: mockCartItems,
      updateQuantity: updateQuantityMock,
      removeFromCart: removeFromCartMock,
      clearCart: vi.fn(),
      subtotal: 1600
    })

    useCoupon.mockReturnValue({
      discountPercent: 0,
      couponMessage: '',
      isCouponLoading: false,
      couponApplied: false,
      applyPromoCode: vi.fn(),
      removePromoCode: vi.fn(),
      discountAmount: 0,
      total: 1600
    })

    render(<CartDrawer isOpen={true} onClose={vi.fn()} />)

    // Decrease quantity
    const decreaseBtn = screen.getByRole('button', { name: /decrease quantity/i })
    fireEvent.click(decreaseBtn)
    expect(updateQuantityMock).toHaveBeenCalledWith('prod-1', 1)

    // Increase quantity
    const increaseBtn = screen.getByRole('button', { name: /increase quantity/i })
    fireEvent.click(increaseBtn)
    expect(updateQuantityMock).toHaveBeenCalledWith('prod-1', 3)

    // Remove item
    const removeBtn = screen.getByRole('button', { name: /remove item/i })
    fireEvent.click(removeBtn)
    expect(removeFromCartMock).toHaveBeenCalledWith('prod-1')
  })

  it('handles applying promo codes', async () => {
    const applyPromoCodeMock = vi.fn()

    useCart.mockReturnValue({
      cartItems: mockCartItems,
      updateQuantity: vi.fn(),
      removeFromCart: vi.fn(),
      clearCart: vi.fn(),
      subtotal: 1600
    })

    useCoupon.mockReturnValue({
      discountPercent: 0,
      couponMessage: '',
      isCouponLoading: false,
      couponApplied: false,
      applyPromoCode: applyPromoCodeMock,
      removePromoCode: vi.fn(),
      discountAmount: 0,
      total: 1600
    })

    render(<CartDrawer isOpen={true} onClose={vi.fn()} />)

    const promoInput = screen.getByPlaceholderText('Enter code (e.g. AURORA10)')
    const applyBtn = screen.getByRole('button', { name: /apply/i })

    fireEvent.change(promoInput, { target: { value: 'AURORA10' } })
    fireEvent.click(applyBtn)

    expect(applyPromoCodeMock).toHaveBeenCalledWith('AURORA10')
  })

  it('submits checkout and navigates to checkout page', async () => {
    useCart.mockReturnValue({
      cartItems: mockCartItems,
      updateQuantity: vi.fn(),
      removeFromCart: vi.fn(),
      clearCart: vi.fn(),
      subtotal: 1600
    })

    useCoupon.mockReturnValue({
      discountPercent: 0,
      couponMessage: '',
      isCouponLoading: false,
      couponApplied: false,
      applyPromoCode: vi.fn(),
      removePromoCode: vi.fn(),
      discountAmount: 0,
      total: 1600
    })

    const onCloseMock = vi.fn()
    render(<CartDrawer isOpen={true} onClose={onCloseMock} />)

    const checkoutBtn = screen.getByRole('button', { name: /checkout securely/i })
    fireEvent.click(checkoutBtn)

    expect(onCloseMock).toHaveBeenCalled()
    expect(mockNavigate).toHaveBeenCalledWith('/checkout')
  })
})
