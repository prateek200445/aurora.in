import React from 'react'
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import CollectionsSection from '../CollectionsSection'

describe('CollectionsSection', () => {
  it('renders all collection cards with names, subtitles, and correct category links', () => {
    render(
      <MemoryRouter>
        <CollectionsSection />
      </MemoryRouter>
    )

    // Verify it renders our collections (Trending Now, Featured Collections, New Arrivals)
    expect(screen.getByText('Trending Now')).toBeInTheDocument()
    expect(screen.getByText('Featured Collections')).toBeInTheDocument()
    expect(screen.getByText('New Arrivals')).toBeInTheDocument()

    // Verify correct description subtitles
    expect(screen.getByText('Selected garments and everyday apparel designed to empower.')).toBeInTheDocument()
    expect(screen.getByText('Minimalist ceramics, lush plants, and modern art pieces.')).toBeInTheDocument()
    expect(screen.getByText('Premium apothecary, dropper serums, and skin hydration.')).toBeInTheDocument()

    // Verify links map to correct categories (Home Decor for Featured, Skincare for New Arrivals, Apparel for others)
    const apparelLinks = screen.getAllByRole('link', { name: /Trending Now/i })
    expect(apparelLinks[0].getAttribute('href')).toBe('/shop?category=Apparel')

    const homeDecorLinks = screen.getAllByRole('link', { name: /Featured/i })
    expect(homeDecorLinks[0].getAttribute('href')).toBe('/shop?category=Home%20Decor')

    const newArrivalsLinks = screen.getAllByRole('link', { name: /New Arrivals/i })
    expect(newArrivalsLinks[0].getAttribute('href')).toBe('/shop?category=Skincare')
  })
})
