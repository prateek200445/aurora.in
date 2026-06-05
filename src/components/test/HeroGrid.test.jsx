import React from 'react'
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import HeroGrid from '../HeroGrid'

describe('HeroGrid', () => {
  it('renders correctly with multiple showcase cards', () => {
    render(<HeroGrid />)

    const images = screen.getAllByRole('img')
    expect(images.length).toBe(6)

    expect(screen.getByAltText('Luxe Sunglasses & Knit Combo')).toBeInTheDocument()
    expect(screen.getByAltText('Sculptural Ceramic Vases')).toBeInTheDocument()
    expect(screen.getByAltText('Acoustic Smart Speaker')).toBeInTheDocument()
  })
})
