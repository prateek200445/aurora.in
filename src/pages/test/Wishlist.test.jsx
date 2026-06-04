import React from 'react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import Wishlist from '../Wishlist'
import { useWishlist } from '../../context/WishlistContext'

vi.mock('../../context/WishlistContext', () => ({
  useWishlist: vi.fn()
}))

vi.mock('../../context/CartContext', () => ({
  useCart: vi.fn(() => ({ addToCart: vi.fn() }))
}))

vi.mock('../../data/products', () => ({
  products: [
    {
      id: 'prod-1',
      name: 'Organic Woolen Scarf',
      category: 'Apparel',
      price: 2500,
      rating: 4.7,
      reviewsCount: 18,
      inStock: true,
      features: []
    },
    {
      id: 'prod-2',
      name: 'Sleek Smart Wireless Speaker',
      category: 'Electronics',
      price: 7999,
      rating: 4.9,
      reviewsCount: 65,
      inStock: true,
      features: []
    }
  ]
}))

describe('Wishlist Page', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders empty wishlist state correctly', () => {
    useWishlist.mockReturnValue({ wishlist: [] })

    render(
      <MemoryRouter>
        <Wishlist onQuickView={vi.fn()} />
      </MemoryRouter>
    )

    expect(screen.getByRole('heading', { name: 'My Wishlist' })).toBeInTheDocument()
    expect(screen.getByText('Your wishlist is empty')).toBeInTheDocument()
    expect(screen.getByText(/Browse through our catalog of sustainable garments/i)).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Explore the Shop' })).toBeInTheDocument()
  })

  it('renders grid with wishlisted product cards correctly', () => {
    useWishlist.mockReturnValue({ wishlist: ['prod-1'] })

    render(
      <MemoryRouter>
        <Wishlist onQuickView={vi.fn()} />
      </MemoryRouter>
    )

    expect(screen.getByRole('heading', { name: 'My Wishlist' })).toBeInTheDocument()
    expect(screen.getByText('Organic Woolen Scarf')).toBeInTheDocument()
    expect(screen.queryByText('Sleek Smart Wireless Speaker')).not.toBeInTheDocument()
  })
})
