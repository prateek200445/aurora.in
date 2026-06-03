import React from 'react'
import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { render, screen, act } from '@testing-library/react'
import { WishlistProvider, useWishlist } from '../WishlistContext'

function WishlistTestComponent() {
  const { wishlist, toggleWishlist, wishlistCount } = useWishlist()

  return (
    <div>
      <div data-testid="wishlist-count">{wishlistCount}</div>
      <div data-testid="wishlist-items">{wishlist.join(',')}</div>
      <button onClick={() => toggleWishlist('prod-1')}>Toggle Prod 1</button>
      <button onClick={() => toggleWishlist('prod-2')}>Toggle Prod 2</button>
    </div>
  )
}

describe('WishlistContext', () => {
  beforeEach(() => {
    window.localStorage.clear()
  })

  afterEach(() => {
    window.localStorage.clear()
  })

  it('provides initial empty state', () => {
    render(
      <WishlistProvider>
        <WishlistTestComponent />
      </WishlistProvider>
    )

    expect(screen.getByTestId('wishlist-count').textContent).toBe('0')
    expect(screen.getByTestId('wishlist-items').textContent).toBe('')
  })

  it('toggles products in and out of the wishlist', () => {
    render(
      <WishlistProvider>
        <WishlistTestComponent />
      </WishlistProvider>
    )

    // Add prod-1
    act(() => {
      screen.getByText('Toggle Prod 1').click()
    })
    expect(screen.getByTestId('wishlist-count').textContent).toBe('1')
    expect(screen.getByTestId('wishlist-items').textContent).toBe('prod-1')

    // Add prod-2
    act(() => {
      screen.getByText('Toggle Prod 2').click()
    })
    expect(screen.getByTestId('wishlist-count').textContent).toBe('2')
    expect(screen.getByTestId('wishlist-items').textContent).toBe('prod-1,prod-2')

    // Remove prod-1
    act(() => {
      screen.getByText('Toggle Prod 1').click()
    })
    expect(screen.getByTestId('wishlist-count').textContent).toBe('1')
    expect(screen.getByTestId('wishlist-items').textContent).toBe('prod-2')
  })

  it('restores wishlist state from localStorage', () => {
    const storedState = ['prod-1', 'prod-3']
    window.localStorage.setItem('aurora-goods-wishlist', JSON.stringify(storedState))

    render(
      <WishlistProvider>
        <WishlistTestComponent />
      </WishlistProvider>
    )

    expect(screen.getByTestId('wishlist-count').textContent).toBe('2')
    expect(screen.getByTestId('wishlist-items').textContent).toBe('prod-1,prod-3')
  })
})
