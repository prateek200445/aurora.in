import { vi } from 'vitest'

function filterProducts(products, filters = {}) {
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

export function createMockProductsModule(actual) {
  const { products } = actual

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
}