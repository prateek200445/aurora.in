import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { collections, products, api } from '../products'

describe('products data and api', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('has valid collections structure', () => {
    expect(collections).toBeInstanceOf(Array)
    expect(collections.length).toBeGreaterThan(0)
    collections.forEach((col) => {
      expect(col).toHaveProperty('id')
      expect(col).toHaveProperty('name')
      expect(col).toHaveProperty('subtitle')
      expect(col).toHaveProperty('image')
      expect(col).toHaveProperty('tag')
      expect(col).toHaveProperty('link')
    })
  })

  it('has products array from products.json', () => {
    expect(products).toBeInstanceOf(Array)
    expect(products.length).toBeGreaterThan(0)
    products.forEach((prod) => {
      expect(prod).toHaveProperty('id')
      expect(prod).toHaveProperty('name')
      expect(prod).toHaveProperty('price')
      expect(prod).toHaveProperty('category')
    })
  })

  describe('api.getProducts', () => {
    it('returns all products when no filters are applied', async () => {
      const promise = api.getProducts()
      vi.advanceTimersByTime(500)
      const res = await promise
      expect(res.length).toBe(products.length)
    })

    it('filters products by category', async () => {
      const category = products[0].category
      const promise = api.getProducts({ category })
      vi.advanceTimersByTime(500)
      const res = await promise
      const expectedCount = products.filter(p => p.category === category).length
      expect(res.length).toBe(expectedCount)
      res.forEach(p => expect(p.category).toBe(category))
    })

    it('filters products by search term', async () => {
      const term = products[0].name.slice(0, 4)
      const promise = api.getProducts({ search: term })
      vi.advanceTimersByTime(500)
      const res = await promise
      const expectedCount = products.filter(
        p => p.name.toLowerCase().includes(term.toLowerCase()) || p.description.toLowerCase().includes(term.toLowerCase())
      ).length
      expect(res.length).toBe(expectedCount)
    })

    it('sorts products by price-low', async () => {
      const promise = api.getProducts({ sortBy: 'price-low' })
      vi.advanceTimersByTime(500)
      const res = await promise
      for (let i = 0; i < res.length - 1; i++) {
        const priceA = res[i].discountPrice ?? res[i].price
        const priceB = res[i + 1].discountPrice ?? res[i + 1].price
        expect(priceA).toBeLessThanOrEqual(priceB)
      }
    })

    it('sorts products by price-high', async () => {
      const promise = api.getProducts({ sortBy: 'price-high' })
      vi.advanceTimersByTime(500)
      const res = await promise
      for (let i = 0; i < res.length - 1; i++) {
        const priceA = res[i].discountPrice ?? res[i].price
        const priceB = res[i + 1].discountPrice ?? res[i + 1].price
        expect(priceA).toBeGreaterThanOrEqual(priceB)
      }
    })

    it('sorts products by rating', async () => {
      const promise = api.getProducts({ sortBy: 'rating' })
      vi.advanceTimersByTime(500)
      const res = await promise
      for (let i = 0; i < res.length - 1; i++) {
        expect(res[i].rating).toBeGreaterThanOrEqual(res[i + 1].rating)
      }
    })
  })

  describe('api.getProductById', () => {
    it('returns the product with the matching id', async () => {
      const target = products[0]
      const promise = api.getProductById(target.id)
      vi.advanceTimersByTime(300)
      const res = await promise
      expect(res).toEqual(target)
    })

    it('returns undefined for non-existent id', async () => {
      const promise = api.getProductById('invalid-id')
      vi.advanceTimersByTime(300)
      const res = await promise
      expect(res).toBeUndefined()
    })
  })

  describe('api.getSearchSuggestions', () => {
    it('returns empty array if no query is provided', async () => {
      const res = await api.getSearchSuggestions('')
      expect(res).toEqual([])
    })

    it('returns matching suggestions for valid query', async () => {
      const target = products[0]
      const query = target.name.slice(0, 3)
      const promise = api.getSearchSuggestions(query)
      vi.advanceTimersByTime(200)
      const res = await promise
      expect(res.length).toBeGreaterThan(0)
      expect(res.length).toBeLessThanOrEqual(5)
      res.forEach(item => {
        expect(item.name.toLowerCase()).toContain(query.toLowerCase())
        expect(item).toHaveProperty('id')
        expect(item).toHaveProperty('category')
      })
    })
  })

  describe('api.applyCoupon', () => {
    it('applies AURORA10 coupon successfully', async () => {
      const promise = api.applyCoupon('aurora10')
      vi.advanceTimersByTime(800)
      const res = await promise
      expect(res).toEqual({
        success: true,
        discountPercent: 10,
        message: 'AURORA10 applied: 10% Discount!'
      })
    })

    it('applies FREESHIP coupon successfully', async () => {
      const promise = api.applyCoupon('FREESHIP')
      vi.advanceTimersByTime(800)
      const res = await promise
      expect(res).toEqual({
        success: true,
        discountPercent: 0,
        message: 'FREESHIP applied: Free Shipping!'
      })
    })

    it('rejects invalid coupon codes', async () => {
      const promise = api.applyCoupon('INVALID')
      vi.advanceTimersByTime(800)
      const res = await promise
      expect(res).toEqual({
        success: false,
        message: 'Invalid or expired promo code.'
      })
    })
  })

  describe('api.subscribeNewsletter', () => {
    it('subscribes newsletter successfully for valid email', async () => {
      const email = 'test@example.com'
      const promise = api.subscribeNewsletter(email)
      vi.advanceTimersByTime(1500)
      const res = await promise
      expect(res).toEqual({
        success: true,
        message: `Thank you! ${email} has been subscribed to the Aurora Goods newsletter.`
      })
    })

    it('rejects invalid email addresses', async () => {
      const promise = api.subscribeNewsletter('invalid-email')
      vi.advanceTimersByTime(1500)
      await expect(promise).rejects.toThrow('Please enter a valid email address.')
    })
  })
})
