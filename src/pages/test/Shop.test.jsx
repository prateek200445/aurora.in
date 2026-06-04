import React from 'react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import Shop from '../Shop'
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

const mockProductsList = [
  {
    id: 'prod-1',
    name: 'Camel Coat',
    category: 'Apparel',
    price: 3500,
    rating: 4.8,
    reviewsCount: 15,
    inStock: true,
    features: []
  },
  {
    id: 'prod-2',
    name: 'Sleek Plant Pot',
    category: 'Home Decor',
    price: 900,
    rating: 4.6,
    reviewsCount: 8,
    inStock: true,
    features: []
  }
]

describe('Shop Page', () => {
  let queryClient

  beforeEach(() => {
    queryClient = createTestQueryClient()
    vi.clearAllMocks()
  })

  it('renders shop catalog, category filters, and products grid correctly', async () => {
    api.getProducts.mockResolvedValue(mockProductsList)

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter initialEntries={['/shop']}>
          <Routes>
            <Route path="/shop" element={<Shop onQuickView={vi.fn()} />} />
          </Routes>
        </MemoryRouter>
      </QueryClientProvider>
    )

    expect(screen.getByRole('heading', { name: 'Discover Our Essentials' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /^Apparel$/i })).toBeInTheDocument()

    // Assert items load and render
    await waitFor(() => {
      expect(screen.getByText('Camel Coat')).toBeInTheDocument()
      expect(screen.getByText('Sleek Plant Pot')).toBeInTheDocument()
    })
  })

  it('filters based on search parameters from the URL', async () => {
    api.getProducts.mockResolvedValue([mockProductsList[0]])

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter initialEntries={['/shop?category=Apparel&search=coat']}>
          <Routes>
            <Route path="/shop" element={<Shop onQuickView={vi.fn()} />} />
          </Routes>
        </MemoryRouter>
      </QueryClientProvider>
    )

    // Verify search banner is rendered
    expect(screen.getByText(/showing results for/i)).toBeInTheDocument()
    expect(screen.getByText('coat', { selector: 'strong' })).toBeInTheDocument()

    await waitFor(() => {
      expect(api.getProducts).toHaveBeenCalledWith({
        category: 'Apparel',
        search: 'coat',
        sortBy: 'featured'
      })
      expect(screen.getByText('Camel Coat')).toBeInTheDocument()
      expect(screen.queryByText('Sleek Plant Pot')).not.toBeInTheDocument()
    })
  })
})
