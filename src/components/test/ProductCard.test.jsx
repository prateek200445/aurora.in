import React from 'react'
import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import ProductCard from '../ProductCard'
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
  inStock: true,
  isNew: true,
  isBestSeller: false,
  features: []
}

describe('ProductCard', () => {
  it('renders product details, badges, ratings, and prices', () => {
    const addToCartMock = vi.fn()
    const toggleWishlistMock = vi.fn()

    useCart.mockReturnValue({ addToCart: addToCartMock })
    useWishlist.mockReturnValue({ wishlist: [], toggleWishlist: toggleWishlistMock })

    render(
      <MemoryRouter>
        <ProductCard product={mockProduct} onQuickView={vi.fn()} />
      </MemoryRouter>
    )

    // Badges
    expect(screen.getByText('New')).toBeInTheDocument()
    expect(screen.getByText('-20%')).toBeInTheDocument() // (5000-4000)/5000 = 20%

    // Product details
    expect(screen.getByText('Classic Trench Coat')).toBeInTheDocument()
    expect(screen.getByText('Apparel')).toBeInTheDocument()
    expect(screen.getByText('4.5')).toBeInTheDocument()
    expect(screen.getByText('(12)')).toBeInTheDocument()

    // Prices (formatted in Indian Rupees)
    expect(screen.getByText('₹4,000')).toBeInTheDocument()
    expect(screen.getByText('₹5,000')).toBeInTheDocument()
  })

  it('triggers quick view, addToCart, and toggleWishlist appropriately', () => {
    const addToCartMock = vi.fn()
    const toggleWishlistMock = vi.fn()
    const onQuickViewMock = vi.fn()

    useCart.mockReturnValue({ addToCart: addToCartMock })
    useWishlist.mockReturnValue({ wishlist: [], toggleWishlist: toggleWishlistMock })

    render(
      <MemoryRouter>
        <ProductCard product={mockProduct} onQuickView={onQuickViewMock} />
      </MemoryRouter>
    )

    // Toggle Wishlist
    const wishlistBtn = screen.getByRole('button', { name: /add to wishlist/i })
    fireEvent.click(wishlistBtn)
    expect(toggleWishlistMock).toHaveBeenCalledWith('prod-1')

    // Click Add to Cart
    const cartBtn = screen.getByRole('button', { name: /add to cart/i })
    fireEvent.click(cartBtn)
    expect(addToCartMock).toHaveBeenCalledWith(mockProduct)

    // Click Quick View
    const quickViewBtn = screen.getByRole('button', { name: /quick view/i })
    fireEvent.click(quickViewBtn)
    expect(onQuickViewMock).toHaveBeenCalledWith(mockProduct)
  })

  it('renders out-of-stock state correctly', () => {
    const outOfStockProd = { ...mockProduct, inStock: false }
    useCart.mockReturnValue({ addToCart: vi.fn() })
    useWishlist.mockReturnValue({ wishlist: [], toggleWishlist: vi.fn() })

    render(
      <MemoryRouter>
        <ProductCard product={outOfStockProd} onQuickView={vi.fn()} />
      </MemoryRouter>
    )

    const cartBtn = screen.getByRole('button', { name: /out of stock/i })
    expect(cartBtn).toBeDisabled()
  })
})
