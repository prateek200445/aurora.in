import React from 'react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import ProductDetails from '../ProductDetails'
import { useCart } from '../../context/CartContext'
import { useWishlist } from '../../context/WishlistContext'
import { api } from '../../data/products'

vi.mock('../../context/CartContext', () => ({
  useCart: vi.fn()
}))

vi.mock('../../context/WishlistContext', () => ({
  useWishlist: vi.fn()
}))

vi.mock('../../data/products', async () => {
  const actual = await vi.importActual('../../data/products')
  return {
    ...actual,
    api: {
      ...actual.api,
      getProductById: vi.fn(),
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

const mockProduct = {
  id: 'prod-1',
  name: 'Organic Woolen Scarf',
  category: 'Apparel',
  price: 2500,
  rating: 4.7,
  reviewsCount: 18,
  description: 'Extremely soft, ethically sourced organic woolen scarf.',
  inStock: true,
  isNew: true,
  isBestSeller: false,
  features: ['100% organic merino wool', 'Hypoallergenic dyes']
}

const mockRelated = [
  {
    id: 'prod-2',
    name: 'Woolen Beanie',
    category: 'Apparel',
    price: 1200,
    rating: 4.4,
    reviewsCount: 5,
    inStock: true,
    features: []
  }
]

describe('ProductDetails Page', () => {
  let queryClient

  beforeEach(() => {
    queryClient = createTestQueryClient()
    vi.clearAllMocks()
    useCart.mockReturnValue({ addToCart: vi.fn() })
    useWishlist.mockReturnValue({ wishlist: [], toggleWishlist: vi.fn() })
  })

  it('renders loading state initially', () => {
    api.getProductById.mockReturnValue(new Promise(() => {}))

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter initialEntries={['/product/prod-1']}>
          <Routes>
            <Route path="/product/:id" element={<ProductDetails />} />
          </Routes>
        </MemoryRouter>
      </QueryClientProvider>
    )

    expect(screen.getByText('Loading product details...')).toBeInTheDocument()
  })

  it('renders product information and related products successfully', async () => {
    api.getProductById.mockResolvedValue(mockProduct)
    api.getProducts.mockResolvedValue(mockRelated)

    const addToCartMock = vi.fn()
    const toggleWishlistMock = vi.fn()

    useCart.mockReturnValue({ addToCart: addToCartMock })
    useWishlist.mockReturnValue({ wishlist: [], toggleWishlist: toggleWishlistMock })

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter initialEntries={['/product/prod-1']}>
          <Routes>
            <Route path="/product/:id" element={<ProductDetails />} />
          </Routes>
        </MemoryRouter>
      </QueryClientProvider>
    )

    // Wait for the details to be rendered
    await waitFor(() => {
      expect(screen.getByText('Organic Woolen Scarf')).toBeInTheDocument()
      expect(screen.getByText('₹2,500')).toBeInTheDocument()
      expect(screen.getByText('Extremely soft, ethically sourced organic woolen scarf.')).toBeInTheDocument()
      expect(screen.getByText('100% organic merino wool')).toBeInTheDocument()
    })

    // Assert badges
    expect(screen.getByText('New')).toBeInTheDocument()

    // Assert related products show up
    await waitFor(() => {
      expect(screen.getByText('Related Essentials')).toBeInTheDocument()
      expect(screen.getByText('Woolen Beanie')).toBeInTheDocument()
    })

    // Test actions on page
    const addToCartBtn = screen.getByRole('button', { name: /add to cart/i })
    fireEvent.click(addToCartBtn)
    expect(addToCartMock).toHaveBeenCalledWith(mockProduct)

    const wishlistBtn = screen.getByRole('button', { name: /add to wishlist/i })
    fireEvent.click(wishlistBtn)
    expect(toggleWishlistMock).toHaveBeenCalledWith('prod-1')
  })

  it('renders error state when product is not found', async () => {
    api.getProductById.mockResolvedValue(null)

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter initialEntries={['/product/invalid-id']}>
          <Routes>
            <Route path="/product/:id" element={<ProductDetails />} />
          </Routes>
        </MemoryRouter>
      </QueryClientProvider>
    )

    await waitFor(() => {
      expect(screen.getByText('Product not found.')).toBeInTheDocument()
      expect(screen.getByRole('link', { name: /back to shop/i })).toBeInTheDocument()
    })
  })
})
