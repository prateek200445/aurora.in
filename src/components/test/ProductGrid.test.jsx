import React from 'react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import ProductGrid from '../ProductGrid'
import { api } from '../../data/products'
import { MemoryRouter } from 'react-router-dom'

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

const mockProducts = [
  {
    id: 'prod-1',
    name: 'Sleek Ceramic Mug',
    category: 'Home Decor',
    price: 800,
    rating: 4.8,
    reviewsCount: 30,
    inStock: true,
    features: []
  },
  {
    id: 'prod-2',
    name: 'Cotton Linen Shirt',
    category: 'Apparel',
    price: 1800,
    rating: 4.2,
    reviewsCount: 15,
    inStock: true,
    features: []
  }
]

describe('ProductGrid', () => {
  let queryClient

  beforeEach(() => {
    queryClient = createTestQueryClient()
    vi.clearAllMocks()
  })

  it('renders loading skeletons initially', () => {
    api.getProducts.mockReturnValue(new Promise(() => {})) // Never resolves to keep it loading

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <ProductGrid
            selectedCategory="All"
            onCategorySelect={vi.fn()}
            searchQuery=""
            onSearchClear={vi.fn()}
            onQuickView={vi.fn()}
          />
        </MemoryRouter>
      </QueryClientProvider>
    )

    const skeletons = document.querySelectorAll('.skeleton-card')
    expect(skeletons.length).toBe(4)
  })

  it('renders product cards after loading succeeds', async () => {
    api.getProducts.mockResolvedValue(mockProducts)

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <ProductGrid
            selectedCategory="All"
            onCategorySelect={vi.fn()}
            searchQuery=""
            onSearchClear={vi.fn()}
            onQuickView={vi.fn()}
          />
        </MemoryRouter>
      </QueryClientProvider>
    )

    await waitFor(() => {
      expect(screen.getByText('Sleek Ceramic Mug')).toBeInTheDocument()
      expect(screen.getByText('Cotton Linen Shirt')).toBeInTheDocument()
    })
  })

  it('handles category selection tab clicks', async () => {
    api.getProducts.mockResolvedValue(mockProducts)
    const onCategorySelectMock = vi.fn()

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <ProductGrid
            selectedCategory="All"
            onCategorySelect={onCategorySelectMock}
            searchQuery=""
            onSearchClear={vi.fn()}
            onQuickView={vi.fn()}
          />
        </MemoryRouter>
      </QueryClientProvider>
    )

    const apparelTab = screen.getByRole('button', { name: /^Apparel$/i })
    fireEvent.click(apparelTab)

    expect(onCategorySelectMock).toHaveBeenCalledWith('Apparel')
  })

  it('displays empty state when no products match', async () => {
    api.getProducts.mockResolvedValue([])

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <ProductGrid
            selectedCategory="All"
            onCategorySelect={vi.fn()}
            searchQuery="matching nothing"
            onSearchClear={vi.fn()}
            onQuickView={vi.fn()}
          />
        </MemoryRouter>
      </QueryClientProvider>
    )

    await waitFor(() => {
      expect(screen.getByText('No products found')).toBeInTheDocument()
    })
  })

  it('renders error state and retries query', async () => {
    api.getProducts.mockRejectedValue(new Error('Network failure'))

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <ProductGrid
            selectedCategory="All"
            onCategorySelect={vi.fn()}
            searchQuery=""
            onSearchClear={vi.fn()}
            onQuickView={vi.fn()}
          />
        </MemoryRouter>
      </QueryClientProvider>
    )

    await waitFor(() => {
      expect(screen.getByText(/Failed to load products: Network failure/i)).toBeInTheDocument()
    })

    const retryBtn = screen.getByRole('button', { name: /retry load/i })
    api.getProducts.mockResolvedValue(mockProducts)
    fireEvent.click(retryBtn)

    await waitFor(() => {
      expect(screen.getByText('Sleek Ceramic Mug')).toBeInTheDocument()
    })
  })
})
