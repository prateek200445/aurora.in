import React from 'react'
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import HeroSection from '../HeroSection'

describe('HeroSection', () => {
  it('renders the hero title, subtitle, and primary call-to-actions', () => {
    render(
      <MemoryRouter>
        <HeroSection />
      </MemoryRouter>
    )

    // Heading assertions
    const heading = screen.getByRole('heading', { name: /essentials designed/i })
    expect(heading).toBeInTheDocument()
    expect(heading.textContent).toContain('For Modern Living')

    // Subtitle assertion
    expect(screen.getByText(/A curated collection of minimalist organic apparel/i)).toBeInTheDocument()

    // Action buttons assertions
    const shopLink = screen.getByRole('link', { name: /shop the catalog/i })
    expect(shopLink).toBeInTheDocument()
    expect(shopLink.getAttribute('href')).toBe('/shop')

    const collectionsLink = screen.getByRole('link', { name: /view collections/i })
    expect(collectionsLink).toBeInTheDocument()
    expect(collectionsLink.getAttribute('href')).toBe('#collections')

    // Child component (HeroGrid) renders its elements too
    expect(screen.getByAltText('Model in trench coat and sunglasses')).toBeInTheDocument()
  })
})
