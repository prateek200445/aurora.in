import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { act, fireEvent, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { renderAppAt } from './test/renderApp.jsx'

vi.mock('./data/products', async () => {
  const actual = await vi.importActual('./data/products')
  const { products } = actual

  const filterProducts = (filters = {}) => {
    let result = [...products]

    if (filters.category && filters.category !== 'All') {
      result = result.filter((product) => product.category === filters.category)
    }

    if (filters.search) {
      const query = filters.search.toLowerCase()
      result = result.filter(
        (product) =>
          product.name.toLowerCase().includes(query) ||
          product.description.toLowerCase().includes(query),
      )
    }

    if (filters.sortBy) {
      switch (filters.sortBy) {
        case 'price-low':
          result.sort((a, b) => (a.discountPrice ?? a.price) - (b.discountPrice ?? b.price))
          break
        case 'price-high':
          result.sort((a, b) => (b.discountPrice ?? b.price) - (a.discountPrice ?? a.price))
          break
        case 'rating':
          result.sort((a, b) => b.rating - a.rating)
          break
        case 'featured':
        default:
          result.sort((a, b) => {
            if (a.isBestSeller && !b.isBestSeller) return -1
            if (!a.isBestSeller && b.isBestSeller) return 1
            return 0
          })
          break
      }
    }

    return result
  }

  return {
    ...actual,
    api: {
      ...actual.api,
      getProducts: vi.fn(async (filters = {}) => filterProducts(products, filters)),
      getProductById: vi.fn(async (id) => products.find((product) => product.id === id)),
      getSearchSuggestions: vi.fn(async (query) => {
        if (!query) return []

        const lowerQuery = query.toLowerCase()
        return products
          .filter((product) => product.name.toLowerCase().includes(lowerQuery))
          .map((product) => ({
            id: product.id,
            name: product.name,
            category: product.category,
          }))
          .slice(0, 5)
      }),
      applyCoupon: vi.fn(async (code) => {
        const normalized = code.toUpperCase().trim()

        if (normalized === 'AURORA10') {
          return { success: true, discountPercent: 10, message: 'AURORA10 applied: 10% Discount!' }
        }

        if (normalized === 'FREESHIP') {
          return { success: true, discountPercent: 0, message: 'FREESHIP applied: Free Shipping!' }
        }

        return { success: false, message: 'Invalid or expired promo code.' }
      }),
      subscribeNewsletter: vi.fn(async (email) => {
        if (!email || !email.includes('@')) {
          throw new Error('Please enter a valid email address.')
        }

        return {
          success: true,
          message: `Thank you! ${email} has been subscribed to the Aurora Goods newsletter.`,
        }
      }),
    },
  }
})

beforeEach(() => {
  window.localStorage.clear()
  window.history.pushState({}, '', '/')
})

afterEach(() => {
  if (vi.isFakeTimers()) {
    vi.useRealTimers()
  }
})

describe('Aurora Goods app', () => {
  it('renders the home page, opens quick view, adds to cart, and subscribes to the newsletter', async () => {
    const user = userEvent.setup()

    renderAppAt('/')

    expect(await screen.findByRole('heading', { name: /essentials designed for modern living/i })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /trending best sellers/i })).toBeInTheDocument()

    await screen.findByText('Classic Camel Trench Coat')
    await user.click(screen.getAllByRole('button', { name: /quick view/i })[0])

    const modal = await screen.findByRole('dialog')
    expect(within(modal).getByText('Classic Camel Trench Coat')).toBeInTheDocument()

    await user.click(within(modal).getByRole('button', { name: /add to cart/i }))
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument())

    await user.click(screen.getByRole('button', { name: /open cart/i }))
    const cartDrawer = screen.getByRole('dialog')
    expect(within(cartDrawer).getByText('Classic Camel Trench Coat')).toBeInTheDocument()

    await user.type(screen.getByLabelText(/email address for newsletter/i), 'hello@example.com')
    await user.click(screen.getByRole('button', { name: /subscribe/i }))

    expect(await screen.findByText(/has been subscribed to the aurora goods newsletter/i)).toBeInTheDocument()
  })

  it('filters shop results from the header search and persists wishlist selections', async () => {
    const user = userEvent.setup()

    renderAppAt('/shop')

    expect(await screen.findByRole('heading', { name: /discover our essentials/i })).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: /open search bar/i }))
    const searchInput = await screen.findByPlaceholderText(/search products/i)
    await user.type(searchInput, 'speaker')

    expect(await screen.findByText('speaker', { selector: 'strong' })).toBeInTheDocument()

    const suggestionName = await screen.findByText('Acoustic Smart Speaker', { selector: '.suggestion-name' })
    await user.click(suggestionName.closest('button'))

    const modal = await screen.findByRole('dialog')
    expect(within(modal).getByText('Acoustic Smart Speaker')).toBeInTheDocument()

    await user.click(within(modal).getByRole('button', { name: /add to wishlist/i }))
    await user.click(within(modal).getByRole('button', { name: /close modal/i }))

    await user.click(screen.getByRole('link', { name: /view wishlist/i }))
    expect(await screen.findByRole('heading', { name: /my wishlist/i })).toBeInTheDocument()
    expect(screen.getByText('Acoustic Smart Speaker')).toBeInTheDocument()
  })

  it('renders the product details page and supports cart and wishlist actions', async () => {
    const user = userEvent.setup()

    renderAppAt('/product/prod-1')

    expect(await screen.findByRole('heading', { name: /classic camel trench coat/i })).toBeInTheDocument()
    expect(screen.getByText(/water-repellent storm shell coating/i)).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: /add to wishlist/i }))
    expect(screen.getByRole('button', { name: /remove from wishlist/i })).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: /add to cart/i }))
    await user.click(screen.getByRole('button', { name: /open cart/i }))
    expect(within(screen.getByRole('dialog')).getByText('Classic Camel Trench Coat')).toBeInTheDocument()
  })

  it('applies a promo code and completes checkout from the cart drawer', async () => {
    const user = userEvent.setup()

    renderAppAt('/shop')

    expect(await screen.findByRole('heading', { name: /discover our essentials/i })).toBeInTheDocument()

    await user.click(screen.getAllByRole('button', { name: /add to cart/i })[0])
    await user.click(screen.getByRole('button', { name: /open cart/i }))

    const cartDrawer = screen.getByRole('dialog')
    const promoInput = within(cartDrawer).getByPlaceholderText(/enter code/i)
    await user.type(promoInput, 'AURORA10')
    await user.click(within(cartDrawer).getByRole('button', { name: /^apply$/i }))

    expect(await within(cartDrawer).findByText(/aurora10 applied: 10% discount!/i)).toBeInTheDocument()
    expect(within(cartDrawer).getByText(/discount \(10%\)/i)).toBeInTheDocument()

    // Click "Checkout Securely" in the drawer
    await user.click(within(cartDrawer).getByRole('button', { name: /checkout securely/i }))

    // Assert that we have navigated to the Checkout page
    expect(await screen.findByRole('heading', { name: /^checkout$/i })).toBeInTheDocument()

    // The order summary should have the coupon applied
    expect(screen.getByText(/discount \(10%\)/i)).toBeInTheDocument()

    // Test pincode checking
    const pinField = screen.getByPlaceholderText(/enter 6-digit Pincode/i)
    await user.type(pinField, '201301')
    await user.click(screen.getByRole('button', { name: /^check$/i }))
    expect(await screen.findByText(/Deliverable! Standard delivery guaranteed in 5 days/i)).toBeInTheDocument()

    // Add new shipping address first
    const toggleBtn = screen.getByRole('button', { name: /Add New Address/i })
    await user.click(toggleBtn)

    fireEvent.change(screen.getByLabelText(/Address Type/i), { target: { value: 'Home' } })
    await user.type(screen.getByLabelText(/Full Name \*/i), 'Prateek Sharma')
    await user.type(screen.getByLabelText(/Phone Number \*/i), '+91 98765 43210')
    await user.type(screen.getByLabelText(/Pincode \*/i), '201301')
    await user.type(screen.getByLabelText(/Flat, House no\., Building, Street \*/i), '123, Lavender Heights, Sector 62')
    await user.type(screen.getByLabelText(/City \*/i), 'Noida')
    await user.type(screen.getByLabelText(/State \*/i), 'Uttar Pradesh')

    const saveBtn = screen.getByRole('button', { name: /Save & Use Address/i })
    await user.click(saveBtn)

    // Click "Place Order Securely"
    vi.useFakeTimers()
    fireEvent.click(screen.getByRole('button', { name: /place order securely/i }))

    await act(async () => {
      vi.advanceTimersByTime(2000)
    })

    expect(screen.getByText(/order placed successfully!/i)).toBeInTheDocument()
  }, 15000)

  it('shows the empty wishlist state and the 404 page', async () => {
    renderAppAt('/wishlist')

    expect(await screen.findByRole('heading', { name: /my wishlist/i })).toBeInTheDocument()
    expect(screen.getByText(/your wishlist is empty/i)).toBeInTheDocument()

    renderAppAt('/missing-route')
    expect(await screen.findByRole('heading', { name: /page not found/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /return home/i })).toBeInTheDocument()
  })
})