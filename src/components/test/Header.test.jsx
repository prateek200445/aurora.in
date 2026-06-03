import React from 'react'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import Header from '../Header'
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
      getSearchSuggestions: vi.fn(),
      getProductById: vi.fn()
    }
  }
})

describe('Header', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    useCart.mockReturnValue({ cartCount: 3 })
    useWishlist.mockReturnValue({ wishlist: ['prod-1', 'prod-2'] })
  })

  it('renders site logo and navigation links', () => {
    render(
      <MemoryRouter>
        <Header onCartToggle={vi.fn()} onQuickView={vi.fn()} />
      </MemoryRouter>
    )

    expect(screen.getByText('Aurora Goods')).toBeInTheDocument()
    expect(screen.getAllByText('New Arrivals')[0]).toBeInTheDocument()
    expect(screen.getAllByText('Best Sellers')[0]).toBeInTheDocument()
    expect(screen.getAllByText('Sale')[0]).toBeInTheDocument()
  })

  it('toggles shop categories dropdown', () => {
    render(
      <MemoryRouter>
        <Header onCartToggle={vi.fn()} onQuickView={vi.fn()} />
      </MemoryRouter>
    )

    const dropdownToggle = screen.getByRole('button', { name: /shop categories/i })
    expect(screen.queryByText('Home Decor', { selector: '.dropdown-item' })).not.toBeInTheDocument()

    // Open dropdown
    fireEvent.click(dropdownToggle)
    expect(screen.getByText('Home Decor', { selector: '.dropdown-item' })).toBeInTheDocument()

    // Close dropdown
    fireEvent.click(dropdownToggle)
    expect(screen.queryByText('Home Decor', { selector: '.dropdown-item' })).not.toBeInTheDocument()
  })

  it('handles search input and displays suggestions', async () => {
    const user = userEvent.setup()
    const mockSuggestions = [
      { id: 'prod-1', name: 'Premium Ceramic Vase', category: 'Home Decor' }
    ]
    api.getSearchSuggestions.mockResolvedValue(mockSuggestions)
    api.getProductById.mockResolvedValue({ id: 'prod-1', name: 'Premium Ceramic Vase' })

    const onQuickViewMock = vi.fn()

    render(
      <MemoryRouter>
        <Header onCartToggle={vi.fn()} onQuickView={onQuickViewMock} />
      </MemoryRouter>
    )

    // Open search input
    const openSearchBtn = screen.getByRole('button', { name: /open search bar/i })
    await user.click(openSearchBtn)

    const searchInput = screen.getByPlaceholderText('Search products...')
    expect(searchInput).toBeInTheDocument()

    // Type in search query
    await user.type(searchInput, 'vase')

    await waitFor(() => {
      expect(api.getSearchSuggestions).toHaveBeenCalledWith('vase')
      expect(screen.getByText('Premium Ceramic Vase')).toBeInTheDocument()
    })

    // Click suggestion
    const suggestionBtn = screen.getByText('Premium Ceramic Vase')
    await user.click(suggestionBtn)

    expect(api.getProductById).toHaveBeenCalledWith('prod-1')
    expect(onQuickViewMock).toHaveBeenCalledWith({ id: 'prod-1', name: 'Premium Ceramic Vase' })
  })

  it('displays badge counts for cart and wishlist', () => {
    render(
      <MemoryRouter>
        <Header onCartToggle={vi.fn()} onQuickView={vi.fn()} />
      </MemoryRouter>
    )

    // Wishlist count
    expect(screen.getByLabelText(/view wishlist/i)).toHaveTextContent('2')

    // Cart count
    expect(screen.getByRole('button', { name: /open cart/i })).toHaveTextContent('3')
  })

  it('triggers onCartToggle when cart button is clicked', () => {
    const onCartToggleMock = vi.fn()

    render(
      <MemoryRouter>
        <Header onCartToggle={onCartToggleMock} onQuickView={vi.fn()} />
      </MemoryRouter>
    )

    const cartBtn = screen.getByRole('button', { name: /open cart/i })
    fireEvent.click(cartBtn)

    expect(onCartToggleMock).toHaveBeenCalledTimes(1)
  })

  it('renders hamburger menu button on the homepage', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <Header onCartToggle={vi.fn()} onQuickView={vi.fn()} />
      </MemoryRouter>
    )

    expect(screen.getByRole('button', { name: /toggle navigation menu/i })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /go back/i })).not.toBeInTheDocument()
  })

  it('renders back button on other pages', () => {
    render(
      <MemoryRouter initialEntries={['/shop']}>
        <Header onCartToggle={vi.fn()} onQuickView={vi.fn()} />
      </MemoryRouter>
    )

    expect(screen.getByRole('button', { name: /go back/i })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /toggle navigation menu/i })).not.toBeInTheDocument()
  })
})
