import React from 'react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import NewsletterForm from '../NewsletterForm'
import { api } from '../../data/products'

vi.mock('../../data/products', async () => {
  const actual = await vi.importActual('../../data/products')
  return {
    ...actual,
    api: {
      ...actual.api,
      subscribeNewsletter: vi.fn()
    }
  }
})

describe('NewsletterForm', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders title, subtitle, and input fields', () => {
    render(<NewsletterForm />)

    expect(screen.getByText('Stay Connected')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /Unlock 10% Off Your First Order/i })).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Enter your email address')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /subscribe/i })).toBeInTheDocument()
  })

  it('handles successful email subscription', async () => {
    const user = userEvent.setup()
    api.subscribeNewsletter.mockResolvedValue({
      success: true,
      message: 'Thank you! test@example.com has been subscribed.'
    })

    render(<NewsletterForm />)

    const input = screen.getByPlaceholderText('Enter your email address')
    const button = screen.getByRole('button', { name: /subscribe/i })

    await user.type(input, 'test@example.com')
    await user.click(button)

    await waitFor(() => {
      expect(api.subscribeNewsletter).toHaveBeenCalledWith('test@example.com')
      expect(screen.getByText('Thank you! test@example.com has been subscribed.')).toBeInTheDocument()
      expect(input.value).toBe('') // Check form reset
    })
  })

  it('handles subscription failure or invalid input', async () => {
    const user = userEvent.setup()
    api.subscribeNewsletter.mockRejectedValue(new Error('Invalid email address.'))

    render(<NewsletterForm />)

    const input = screen.getByPlaceholderText('Enter your email address')
    const button = screen.getByRole('button', { name: /subscribe/i })

    await user.type(input, 'wrong@email.com')
    await user.click(button)

    await waitFor(() => {
      expect(api.subscribeNewsletter).toHaveBeenCalledWith('wrong@email.com')
      expect(screen.getByText('Invalid email address.')).toBeInTheDocument()
    })
  })
})
