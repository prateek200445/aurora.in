import React from 'react'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, act } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import Checkout from '../Checkout'
import { useCart } from '../../context/CartContext'
import { useCoupon } from '../../context/CouponContext'

// Top-level mocks (prefixed with 'mock' to bypass hoisting reference limits in Vitest)
const mockNavigate = vi.fn()

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => mockNavigate
  }
})

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
      name: 'Organic Woolen Scarf',
      price: 2500,
      image: '/images/scarf.jpg'
    },
    quantity: 2
  },
  {
    product: {
      id: 'prod-2',
      name: 'Sleek Smart Wireless Speaker',
      price: 7999,
      discountPrice: 6999,
      image: '/images/speaker.jpg'
    },
    quantity: 1
  }
]

describe('Checkout Page', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    if (vi.isFakeTimers()) {
      vi.useRealTimers()
    }
  })

  it('renders empty cart state correctly', () => {
    useCart.mockReturnValue({
      cartItems: [],
      subtotal: 0,
      clearCart: vi.fn()
    })

    useCoupon.mockReturnValue({
      couponCode: '',
      discountPercent: 0,
      couponMessage: '',
      isCouponLoading: false,
      couponApplied: false,
      applyPromoCode: vi.fn(),
      removePromoCode: vi.fn(),
      discountAmount: 0,
      total: 0
    })

    render(
      <MemoryRouter>
        <Checkout />
      </MemoryRouter>
    )

    expect(screen.getByRole('heading', { name: 'Your cart is empty' })).toBeInTheDocument()
    expect(screen.getByText(/You cannot proceed to checkout without items in your cart/i)).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Shop Our Collection' })).toBeInTheDocument()
  })

  it('renders checkout layout, shipping options, saved addresses, payment methods, and items summary correctly', () => {
    useCart.mockReturnValue({
      cartItems: mockCartItems,
      subtotal: 11999,
      clearCart: vi.fn()
    })

    useCoupon.mockReturnValue({
      couponCode: '',
      discountPercent: 0,
      couponMessage: '',
      isCouponLoading: false,
      couponApplied: false,
      applyPromoCode: vi.fn(),
      removePromoCode: vi.fn(),
      discountAmount: 0,
      total: 11999
    })

    render(
      <MemoryRouter>
        <Checkout />
      </MemoryRouter>
    )

    // Heading
    expect(screen.getByRole('heading', { name: 'Checkout', level: 1 })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Back to Shop' })).toBeInTheDocument()

    // Sections
    expect(screen.getByRole('heading', { name: '1. Delivery Availability & Pincode', level: 3 })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: '2. Select Shipping Address', level: 3 })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: '3. Select Payment Method', level: 3 })).toBeInTheDocument()

    // Saved Addresses
    expect(screen.getByText('No Shipping Address Found')).toBeInTheDocument()
    expect(screen.getByText(/Since you are checking out as a guest, there are no saved addresses/i)).toBeInTheDocument()

    // Payment Methods
    expect(screen.getByText('Cash On Delivery (COD)')).toBeInTheDocument()
    expect(screen.getByText('UPI / Net Banking (Instant Pay)')).toBeInTheDocument()
    expect(screen.getByText('Credit / Debit Card')).toBeInTheDocument()

    // Sidebar summary
    expect(screen.getByRole('heading', { name: 'Order Summary', level: 3 })).toBeInTheDocument()
    expect(screen.getByText('Organic Woolen Scarf')).toBeInTheDocument()
    expect(screen.getByText('Qty: 2 • ₹2,500')).toBeInTheDocument()
    expect(screen.getByText('₹5,000')).toBeInTheDocument()

    expect(screen.getByText('Sleek Smart Wireless Speaker')).toBeInTheDocument()
    expect(screen.getByText('Qty: 1 • ₹6,999')).toBeInTheDocument()
    expect(screen.getByText('₹6,999')).toBeInTheDocument()

    // Cost Breakdown
    expect(screen.getByText('Subtotal')).toBeInTheDocument()
    expect(screen.getAllByText('₹11,999', { selector: 'span' }).length).toBe(2)
    expect(screen.getByText('Shipping')).toBeInTheDocument()
    expect(screen.getByText('FREE')).toBeInTheDocument()
    expect(screen.getByText('Total')).toBeInTheDocument()

    // Place Order Button
    expect(screen.getByRole('button', { name: 'Add Shipping Address to Proceed' })).toBeDisabled()
  })

  it('validates pincode inputs showing error or standard success messages', async () => {
    useCart.mockReturnValue({
      cartItems: mockCartItems,
      subtotal: 11999,
      clearCart: vi.fn()
    })

    useCoupon.mockReturnValue({
      couponCode: '',
      discountPercent: 0,
      couponMessage: '',
      isCouponLoading: false,
      couponApplied: false,
      applyPromoCode: vi.fn(),
      removePromoCode: vi.fn(),
      discountAmount: 0,
      total: 11999
    })

    render(
      <MemoryRouter>
        <Checkout />
      </MemoryRouter>
    )

    const input = screen.getByPlaceholderText('Enter 6-digit Pincode (e.g. 201301)')
    const checkBtn = screen.getByRole('button', { name: 'Check' })

    // Test empty pincode
    fireEvent.click(checkBtn)
    expect(screen.getByText('Please enter a pincode.')).toBeInTheDocument()

    // Test invalid pincode (letters or wrong length)
    fireEvent.change(input, { target: { value: '123' } })
    fireEvent.click(checkBtn)
    expect(screen.getByText('Please enter a valid 6-digit pincode.')).toBeInTheDocument()

    // Test valid 6-digit pincode
    vi.useFakeTimers()
    fireEvent.change(input, { target: { value: '201301' } })
    fireEvent.click(checkBtn)
    
    // Advance timers by 600ms
    await act(async () => {
      vi.advanceTimersByTime(600)
    })

    expect(screen.getByText(/Deliverable! Standard delivery guaranteed in 5 days/i)).toBeInTheDocument()
    vi.useRealTimers()
  })

  it('automatically checks and sets delivery when selecting a saved address card', () => {
    useCart.mockReturnValue({
      cartItems: mockCartItems,
      subtotal: 11999,
      clearCart: vi.fn()
    })

    useCoupon.mockReturnValue({
      couponCode: '',
      discountPercent: 0,
      couponMessage: '',
      isCouponLoading: false,
      couponApplied: false,
      applyPromoCode: vi.fn(),
      removePromoCode: vi.fn(),
      discountAmount: 0,
      total: 11999
    })

    render(
      <MemoryRouter>
        <Checkout />
      </MemoryRouter>
    )

    // First add a new address to have it in the saved addresses list
    const toggleBtn = screen.getByRole('button', { name: /Add New Address/i })
    fireEvent.click(toggleBtn)

    // Fill form fields for the first address
    fireEvent.change(screen.getByLabelText(/Address Type/i), { target: { value: 'Office' } })
    fireEvent.change(screen.getByLabelText(/Full Name \*/i), { target: { value: 'Prateek Sharma' } })
    fireEvent.change(screen.getByLabelText(/Phone Number \*/i), { target: { value: '+91 98765 49999' } })
    fireEvent.change(screen.getByLabelText(/Pincode \*/i), { target: { value: '201301' } })
    fireEvent.change(screen.getByLabelText(/Flat, House no\., Building, Street \*/i), { target: { value: 'Block B, Sector 63' } })
    fireEvent.change(screen.getByLabelText(/City \*/i), { target: { value: 'Noida' } })
    fireEvent.change(screen.getByLabelText(/State \*/i), { target: { value: 'Uttar Pradesh' } })

    // Submit form
    const saveBtn = screen.getByRole('button', { name: /Save & Use Address/i })
    fireEvent.click(saveBtn)

    // The newly added office card is automatically selected. Let's add another one to test selecting.
    // Open form again
    const newToggleBtn = screen.getByRole('button', { name: /Add New Address/i })
    fireEvent.click(newToggleBtn)

    // Fill form fields for a second address (Home)
    fireEvent.change(screen.getByLabelText(/Address Type/i), { target: { value: 'Home' } })
    fireEvent.change(screen.getByLabelText(/Full Name \*/i), { target: { value: 'Prateek Sharma' } })
    fireEvent.change(screen.getByLabelText(/Phone Number \*/i), { target: { value: '+91 98765 43210' } })
    fireEvent.change(screen.getByLabelText(/Pincode \*/i), { target: { value: '201302' } })
    fireEvent.change(screen.getByLabelText(/Flat, House no\., Building, Street \*/i), { target: { value: '123, Lavender Heights, Sector 62' } })
    fireEvent.change(screen.getByLabelText(/City \*/i), { target: { value: 'Noida' } })
    fireEvent.change(screen.getByLabelText(/State \*/i), { target: { value: 'Uttar Pradesh' } })

    // Submit form
    fireEvent.click(saveBtn)

    // Now select the Office card
    const officeCard = screen.getByText('Office', { selector: '.address-tag' }).closest('.address-card')
    fireEvent.click(officeCard)

    // Selection class should apply
    expect(officeCard).toHaveClass('selected')

    // Pincode input should update and success message should show immediately
    expect(screen.getByPlaceholderText('Enter 6-digit Pincode (e.g. 201301)')).toHaveValue('201301')
    expect(screen.getByText(/Deliverable! Standard delivery guaranteed in 5 days/i)).toBeInTheDocument()
  })

  it('allows adding a new address and automatically selects it', () => {
    useCart.mockReturnValue({
      cartItems: mockCartItems,
      subtotal: 11999,
      clearCart: vi.fn()
    })

    useCoupon.mockReturnValue({
      couponCode: '',
      discountPercent: 0,
      couponMessage: '',
      isCouponLoading: false,
      couponApplied: false,
      applyPromoCode: vi.fn(),
      removePromoCode: vi.fn(),
      discountAmount: 0,
      total: 11999
    })

    render(
      <MemoryRouter>
        <Checkout />
      </MemoryRouter>
    )

    // Open form
    const toggleBtn = screen.getByRole('button', { name: /Add New Address/i })
    fireEvent.click(toggleBtn)

    // Form inputs should be visible
    expect(screen.getByRole('heading', { name: 'New Delivery Address', level: 4 })).toBeInTheDocument()

    // Fill form fields
    fireEvent.change(screen.getByLabelText(/Address Type/i), { target: { value: 'Other' } })
    fireEvent.change(screen.getByLabelText(/Full Name \*/i), { target: { value: 'Jane Doe' } })
    fireEvent.change(screen.getByLabelText(/Phone Number \*/i), { target: { value: '+91 99999 88888' } })
    fireEvent.change(screen.getByLabelText(/Pincode \*/i), { target: { value: '110001' } })
    fireEvent.change(screen.getByLabelText(/Flat, House no\., Building, Street \*/i), { target: { value: 'Apartment 4B, Emerald Tower' } })
    fireEvent.change(screen.getByLabelText(/City \*/i), { target: { value: 'Noida' } })
    fireEvent.change(screen.getByLabelText(/State \*/i), { target: { value: 'Uttar Pradesh' } })

    // Submit form
    const saveBtn = screen.getByRole('button', { name: /Save & Use Address/i })
    fireEvent.click(saveBtn)

    // Check that new address is displayed and selected
    expect(screen.getByText('Other')).toBeInTheDocument()
    expect(screen.getByText('Jane Doe')).toBeInTheDocument()
    expect(screen.getByText(/Apartment 4B, Emerald Tower, Noida, Uttar Pradesh - 110001/i)).toBeInTheDocument()
    expect(screen.getByText('+91 99999 88888')).toBeInTheDocument()

    // Pincode input should update and success message should show immediately
    expect(screen.getByPlaceholderText('Enter 6-digit Pincode (e.g. 201301)')).toHaveValue('110001')
    expect(screen.getByText(/Deliverable! Standard delivery guaranteed in 5 days/i)).toBeInTheDocument()
  })

  it('submits manual promo code and clicks quick apply offers successfully', () => {
    const applyPromoMock = vi.fn()

    useCart.mockReturnValue({
      cartItems: mockCartItems,
      subtotal: 11999,
      clearCart: vi.fn()
    })

    useCoupon.mockReturnValue({
      couponCode: '',
      discountPercent: 0,
      couponMessage: '',
      isCouponLoading: false,
      couponApplied: false,
      applyPromoCode: applyPromoMock,
      removePromoCode: vi.fn(),
      discountAmount: 0,
      total: 11999
    })

    render(
      <MemoryRouter>
        <Checkout />
      </MemoryRouter>
    )

    // Manual apply
    const promoInput = screen.getByPlaceholderText('Enter code (e.g. AURORA10)')
    const applyBtns = screen.getAllByRole('button', { name: 'Apply' })
    const manualApplyBtn = applyBtns[0]

    fireEvent.change(promoInput, { target: { value: 'MYCOUPON' } })
    fireEvent.click(manualApplyBtn)

    expect(applyPromoMock).toHaveBeenCalledWith('MYCOUPON')

    // Quick Apply AURORA10 Offer
    const freshApplyBtns = screen.getAllByRole('button', { name: 'Apply' })
    // The first button in the document is the manual apply, the 2nd is AURORA10 offer, 3rd is FREESHIP offer
    fireEvent.click(freshApplyBtns[1]) // AURORA10 Apply
    expect(applyPromoMock).toHaveBeenCalledWith('AURORA10')

    fireEvent.click(freshApplyBtns[2]) // FREESHIP Apply
    expect(applyPromoMock).toHaveBeenCalledWith('FREESHIP')
  })

  it('renders coupon applied state correctly and handles removal', () => {
    const removePromoMock = vi.fn()

    useCart.mockReturnValue({
      cartItems: mockCartItems,
      subtotal: 11999,
      clearCart: vi.fn()
    })

    useCoupon.mockReturnValue({
      couponCode: 'AURORA10',
      discountPercent: 10,
      couponMessage: 'AURORA10 applied: 10% Discount!',
      isCouponLoading: false,
      couponApplied: true,
      applyPromoCode: vi.fn(),
      removePromoCode: removePromoMock,
      discountAmount: 1200,
      total: 10799
    })

    render(
      <MemoryRouter>
        <Checkout />
      </MemoryRouter>
    )

    // Input should be disabled
    expect(screen.getByPlaceholderText('Enter code (e.g. AURORA10)')).toBeDisabled()
    
    // Message should be displayed
    expect(screen.getByText('AURORA10 applied: 10% Discount!')).toBeInTheDocument()

    // Discount row should render in summary breakdown
    expect(screen.getByText('Discount (10%)')).toBeInTheDocument()
    expect(screen.getByText('-₹1,200')).toBeInTheDocument()
    expect(screen.getByText('₹10,799')).toBeInTheDocument()

    // Click remove button
    const removeBtn = screen.getByRole('button', { name: 'Remove' })
    fireEvent.click(removeBtn)

    expect(removePromoMock).toHaveBeenCalled()
  })

  it('places order, displays order success modal, and continues shopping correctly', async () => {
    const clearCartMock = vi.fn()
    const removePromoMock = vi.fn()

    useCart.mockReturnValue({
      cartItems: mockCartItems,
      subtotal: 11999,
      clearCart: clearCartMock
    })

    useCoupon.mockReturnValue({
      couponCode: '',
      discountPercent: 0,
      couponMessage: '',
      isCouponLoading: false,
      couponApplied: false,
      applyPromoCode: vi.fn(),
      removePromoCode: removePromoMock,
      discountAmount: 0,
      total: 11999
    })

    render(
      <MemoryRouter>
        <Checkout />
      </MemoryRouter>
    )

    // First add a new address so the order button becomes enabled
    const toggleBtn = screen.getByRole('button', { name: /Add New Address/i })
    fireEvent.click(toggleBtn)

    // Fill form fields
    fireEvent.change(screen.getByLabelText(/Address Type/i), { target: { value: 'Home' } })
    fireEvent.change(screen.getByLabelText(/Full Name \*/i), { target: { value: 'Prateek Sharma' } })
    fireEvent.change(screen.getByLabelText(/Phone Number \*/i), { target: { value: '+91 98765 43210' } })
    fireEvent.change(screen.getByLabelText(/Pincode \*/i), { target: { value: '201301' } })
    fireEvent.change(screen.getByLabelText(/Flat, House no\., Building, Street \*/i), { target: { value: '123, Lavender Heights, Sector 62' } })
    fireEvent.change(screen.getByLabelText(/City \*/i), { target: { value: 'Noida' } })
    fireEvent.change(screen.getByLabelText(/State \*/i), { target: { value: 'Uttar Pradesh' } })

    // Submit form
    const saveBtn = screen.getByRole('button', { name: /Save & Use Address/i })
    fireEvent.click(saveBtn)

    const placeOrderBtn = screen.getByRole('button', { name: 'Place Order Securely' })
    
    vi.useFakeTimers()
    fireEvent.click(placeOrderBtn)

    // Shows placing order spinner
    expect(screen.getByText('Placing Order...')).toBeInTheDocument()
    expect(placeOrderBtn).toBeDisabled()

    // Fast forward order placement timeout (1800ms)
    await act(async () => {
      vi.advanceTimersByTime(2000)
    })

    // Success Modal elements
    expect(screen.getByRole('heading', { name: 'Order Placed Successfully!', level: 2 })).toBeInTheDocument()
    expect(screen.getByText(/Thank you for shopping with Aurora Goods/i)).toBeInTheDocument()
    expect(screen.getByText(/AUR-2026-/i)).toBeInTheDocument()
    expect(screen.getAllByText('Prateek Sharma').length).toBeGreaterThan(0)

    const continueBtn = screen.getByRole('button', { name: 'Continue Shopping' })
    fireEvent.click(continueBtn)

    expect(clearCartMock).toHaveBeenCalled()
    expect(removePromoMock).toHaveBeenCalled()
    vi.useRealTimers()
  })

  it('persists added address in localStorage and loads it back on refresh/mount', () => {
    useCart.mockReturnValue({
      cartItems: mockCartItems,
      subtotal: 11999,
      clearCart: vi.fn()
    })

    useCoupon.mockReturnValue({
      couponCode: '',
      discountPercent: 0,
      couponMessage: '',
      isCouponLoading: false,
      couponApplied: false,
      applyPromoCode: vi.fn(),
      removePromoCode: vi.fn(),
      discountAmount: 0,
      total: 11999
    })

    // 1. Clear localStorage
    window.localStorage.clear()

    const { unmount } = render(
      <MemoryRouter>
        <Checkout />
      </MemoryRouter>
    )

    // Open form and save an address
    const toggleBtn = screen.getByRole('button', { name: /Add New Address/i })
    fireEvent.click(toggleBtn)

    fireEvent.change(screen.getByLabelText(/Address Type/i), { target: { value: 'Home' } })
    fireEvent.change(screen.getByLabelText(/Full Name \*/i), { target: { value: 'Jane Persist' } })
    fireEvent.change(screen.getByLabelText(/Phone Number \*/i), { target: { value: '+91 99999 77777' } })
    fireEvent.change(screen.getByLabelText(/Pincode \*/i), { target: { value: '201308' } })
    fireEvent.change(screen.getByLabelText(/Flat, House no\., Building, Street \*/i), { target: { value: 'Flat 789, Tower C' } })
    fireEvent.change(screen.getByLabelText(/City \*/i), { target: { value: 'Noida' } })
    fireEvent.change(screen.getByLabelText(/State \*/i), { target: { value: 'Uttar Pradesh' } })

    const saveBtn = screen.getByRole('button', { name: /Save & Use Address/i })
    fireEvent.click(saveBtn)

    // Verify localStorage has saved addresses
    const savedAddressesRaw = window.localStorage.getItem('aurora-goods-checkout-addresses')
    expect(savedAddressesRaw).toBeTruthy()
    const savedAddresses = JSON.parse(savedAddressesRaw)
    expect(savedAddresses).toHaveLength(1)
    expect(savedAddresses[0].name).toBe('Jane Persist')

    const savedSelectedId = window.localStorage.getItem('aurora-goods-checkout-selected-address-id')
    expect(savedSelectedId).toBe(savedAddresses[0].id)

    // Unmount first instance
    unmount()

    // 2. Re-render Checkout to simulate page refresh / new mount
    render(
      <MemoryRouter>
        <Checkout />
      </MemoryRouter>
    )

    // The address should be loaded from localStorage and be selected
    expect(screen.getByText('Home')).toBeInTheDocument()
    expect(screen.getByText('Jane Persist')).toBeInTheDocument()
    const addressCard = screen.getByText('Jane Persist').closest('.address-card')
    expect(addressCard).toHaveClass('selected')

    // Pincode input should update and standard success message should show immediately due to mount sync
    expect(screen.getByPlaceholderText('Enter 6-digit Pincode (e.g. 201301)')).toHaveValue('201308')
    expect(screen.getByText(/Deliverable! Standard delivery guaranteed in 5 days/i)).toBeInTheDocument()
  })

  it('allows deleting an address, which resets selected selection, clears deliverability status, and synchronizes to localStorage', async () => {
    // Set initial localStorage addresses
    const testAddresses = [
      {
        id: 'addr-delete-1',
        tag: 'Home',
        name: 'Delete Target One',
        details: '123 Lavender Lane, Noida',
        pincode: '201301',
        phone: '+91 99999 88888'
      },
      {
        id: 'addr-delete-2',
        tag: 'Office',
        name: 'Keep Target Two',
        details: 'Sector 63, Noida',
        pincode: '201301',
        phone: '+91 99999 77777'
      }
    ]
    window.localStorage.setItem('aurora-goods-checkout-addresses', JSON.stringify(testAddresses))
    window.localStorage.setItem('aurora-goods-checkout-selected-address-id', 'addr-delete-1')

    render(
      <MemoryRouter>
        <Checkout />
      </MemoryRouter>
    )

    // Verify initial render
    expect(screen.getByText('Delete Target One')).toBeInTheDocument()
    expect(screen.getByText('Keep Target Two')).toBeInTheDocument()
    expect(screen.getByText('Delete Target One').closest('.address-card')).toHaveClass('selected')
    expect(screen.getByPlaceholderText('Enter 6-digit Pincode (e.g. 201301)')).toHaveValue('201301')
    expect(screen.getByText(/Deliverable! Standard delivery guaranteed in 5 days/i)).toBeInTheDocument()

    // Click delete address button on the first address
    const deleteBtns = screen.getAllByRole('button', { name: /Delete Address/i })
    expect(deleteBtns).toHaveLength(2)

    fireEvent.click(deleteBtns[0])

    // Verify first address is removed, but second address remains
    expect(screen.queryByText('Delete Target One')).toBeNull()
    expect(screen.getByText('Keep Target Two')).toBeInTheDocument()

    // Since we deleted the active selection, the selection should reset to null
    expect(screen.getByText('Keep Target Two').closest('.address-card')).not.toHaveClass('selected')
    
    // Pincode and deliverability statuses should clear
    expect(screen.getByPlaceholderText('Enter 6-digit Pincode (e.g. 201301)')).toHaveValue('')
    expect(screen.queryByText(/Deliverable! Standard delivery guaranteed in 5 days/i)).toBeNull()

    // Verify localStorage synced correctly
    const savedAddresses = JSON.parse(window.localStorage.getItem('aurora-goods-checkout-addresses'))
    expect(savedAddresses).toHaveLength(1)
    expect(savedAddresses[0].name).toBe('Keep Target Two')

    const savedSelectedId = window.localStorage.getItem('aurora-goods-checkout-selected-address-id')
    expect(savedSelectedId).toBeNull()
  })
})

