import React from 'react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { MemoryRouter } from 'react-router-dom'
import Home from '../Home'
import { api } from '../../data/products'

vi.mock('../../context/CartContext', () => ({
  useCart: vi.fn(() => ({ addToCart: vi.fn() }))
}))

vi.mock('../../context/WishlistContext', () => ({
  useWishlist: vi.fn(() => ({ wishlist: [], toggleWishlist: vi.fn() }))
}))

vi.mock('../../data/products', async () => {
  const actual = await vi.importActual('../../data/products')
  return {
    ...actual,
    api: {
      ...actual.api,
      getProducts: vi.fn()
    }
  }
})

const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: 0
      }
    }
  })

const mockTrending = [
  {
    id: 'prod-1',
    name: 'Camel Trench Coat',
    category: 'Apparel',
    price: 4999,
    rating: 4.9,
    reviewsCount: 42,
    inStock: true,
    isBestSeller: true,
    features: []
  }
]

describe('Home Page', () => {
  let queryClient

  beforeEach(() => {
    queryClient = createTestQueryClient()
    vi.clearAllMocks()
  })

  it('renders Hero, Collections, Trust Badges, Products and Newsletter sections', async () => {
    api.getProducts.mockResolvedValue(mockTrending)

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <Home onQuickView={vi.fn()} />
        </MemoryRouter>
      </QueryClientProvider>
    )

    // Hero Header
    expect(screen.getByRole('heading', { name: /essentials designed/i })).toBeInTheDocument()

    // Collections
    expect(screen.getByText('Trending Now')).toBeInTheDocument()

    // Trust Badges
    expect(screen.getByText('Free Shipping')).toBeInTheDocument()
    expect(screen.getByText('Secured Checkouts')).toBeInTheDocument()
    expect(screen.getByText('Verified Premium')).toBeInTheDocument()

    // Weekly Highlights / Trending Products Shelf
    expect(screen.getByText('Trending Best Sellers')).toBeInTheDocument()

    await waitFor(() => {
      expect(screen.getByText('Camel Trench Coat')).toBeInTheDocument()
    })

    // Newsletter section
    expect(screen.getByRole('heading', { name: /unlock 10% off your first order/i })).toBeInTheDocument()
  })
})
