import React from 'react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import QuickViewModal from '../QuickViewModal'
import { useCart } from '../../context/CartContext'
import { useWishlist } from '../../context/WishlistContext'

vi.mock('../../context/CartContext', () => ({
  useCart: vi.fn()
}))

vi.mock('../../context/WishlistContext', () => ({
  useWishlist: vi.fn()
}))

const mockProduct = {
  id: 'prod-1',
  name: 'Classic Trench Coat',
  category: 'Apparel',
  price: 5000,
  discountPrice: 4000,
  image: '/test.png',
  rating: 4.5,
  reviewsCount: 12,
  description: 'A beautiful trench coat for rainy days.',
  inStock: true,
  isNew: true,
  isBestSeller: true,
  features: ['Water-resistant', '100% Cotton lining']
}

describe('QuickViewModal', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders all product elements inside the dialog modal', () => {
    useCart.mockReturnValue({ addToCart: vi.fn() })
    useWishlist.mockReturnValue({ wishlist: [], toggleWishlist: vi.fn() })

    render(<QuickViewModal product={mockProduct} onClose={vi.fn()} />)

    expect(screen.getByRole('dialog')).toBeInTheDocument()
    expect(screen.getByText('Classic Trench Coat')).toBeInTheDocument()
    expect(screen.getByText('Apparel')).toBeInTheDocument()
    expect(screen.getByText('₹4,000')).toBeInTheDocument()
    expect(screen.getByText('₹5,000')).toBeInTheDocument()
    expect(screen.getByText('A beautiful trench coat for rainy days.')).toBeInTheDocument()
    expect(screen.getByText('Water-resistant')).toBeInTheDocument()
    expect(screen.getByText('100% Cotton lining')).toBeInTheDocument()
    expect(screen.getByText('In Stock — Available to ship immediately')).toBeInTheDocument()
  })

  it('calls onClose when close button is clicked', () => {
    const onCloseMock = vi.fn()
    useCart.mockReturnValue({ addToCart: vi.fn() })
    useWishlist.mockReturnValue({ wishlist: [], toggleWishlist: vi.fn() })

    render(<QuickViewModal product={mockProduct} onClose={onCloseMock} />)

    const closeBtn = screen.getByRole('button', { name: /close modal/i })
    fireEvent.click(closeBtn)
    expect(onCloseMock).toHaveBeenCalledTimes(1)
  })

  it('calls onClose when overlay background is clicked (excluding dialog content)', () => {
    const onCloseMock = vi.fn()
    useCart.mockReturnValue({ addToCart: vi.fn() })
    useWishlist.mockReturnValue({ wishlist: [], toggleWishlist: vi.fn() })

    const { container } = render(<QuickViewModal product={mockProduct} onClose={onCloseMock} />)

    // Click inside modal content shouldn't close it
    fireEvent.click(screen.getByRole('dialog'))
    expect(onCloseMock).not.toHaveBeenCalled()

    // Click overlay should close it
    const overlay = container.querySelector('.modal-overlay')
    fireEvent.click(overlay)
    expect(onCloseMock).toHaveBeenCalledTimes(1)
  })

  it('calls onClose when Escape key is pressed', () => {
    const onCloseMock = vi.fn()
    useCart.mockReturnValue({ addToCart: vi.fn() })
    useWishlist.mockReturnValue({ wishlist: [], toggleWishlist: vi.fn() })

    render(<QuickViewModal product={mockProduct} onClose={onCloseMock} />)

    fireEvent.keyDown(window, { key: 'Escape' })
    expect(onCloseMock).toHaveBeenCalledTimes(1)
  })

  it('adds item to cart and toggles wishlist inside modal', () => {
    const addToCartMock = vi.fn()
    const toggleWishlistMock = vi.fn()
    const onCloseMock = vi.fn()

    useCart.mockReturnValue({ addToCart: addToCartMock })
    useWishlist.mockReturnValue({ wishlist: [], toggleWishlist: toggleWishlistMock })

    render(<QuickViewModal product={mockProduct} onClose={onCloseMock} />)

    // Add to cart inside modal
    const addToCartBtn = screen.getByRole('button', { name: /add to cart/i })
    fireEvent.click(addToCartBtn)
    expect(addToCartMock).toHaveBeenCalledWith(mockProduct)
    expect(onCloseMock).toHaveBeenCalledTimes(1) // also closes modal on cart addition

    // Toggle wishlist inside modal
    const wishlistBtn = screen.getByRole('button', { name: /add to wishlist/i })
    fireEvent.click(wishlistBtn)
    expect(toggleWishlistMock).toHaveBeenCalledWith('prod-1')
  })
})
