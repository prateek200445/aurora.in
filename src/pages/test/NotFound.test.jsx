import React from 'react'
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import NotFound from '../NotFound'

describe('NotFound Page', () => {
  it('renders 404 page title, description, and navigation links correctly', () => {
    render(
      <MemoryRouter>
        <NotFound />
      </MemoryRouter>
    )

    // Verify error code is shown
    expect(screen.getByText('Error Code 404')).toBeInTheDocument()

    // Verify main page not found title
    expect(screen.getByRole('heading', { name: 'Page Not Found' })).toBeInTheDocument()

    // Verify description
    expect(screen.getByText(/We're sorry, but the page you are looking for does not exist/i)).toBeInTheDocument()

    // Verify buttons
    const homeLink = screen.getByRole('link', { name: /return home/i })
    expect(homeLink).toBeInTheDocument()
    expect(homeLink.getAttribute('href')).toBe('/')

    const shopLink = screen.getByRole('link', { name: /go to shop/i })
    expect(shopLink).toBeInTheDocument()
    expect(shopLink.getAttribute('href')).toBe('/shop')
  })
})
