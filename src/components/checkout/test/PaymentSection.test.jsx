import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import PaymentSection from '../PaymentSection';

describe('PaymentSection Component', () => {
  const defaultProps = {
    paymentMethod: 'cod',
    setPaymentMethod: vi.fn()
  };

  it('renders standard secure payment method cards correctly', () => {
    render(<PaymentSection {...defaultProps} />);

    expect(screen.getByRole('heading', { name: '3. Select Payment Method', level: 3 })).toBeInTheDocument();
    expect(screen.getByText('Cash On Delivery (COD)')).toBeInTheDocument();
    expect(screen.getByText('UPI / Net Banking (Instant Pay)')).toBeInTheDocument();
    expect(screen.getByText('Credit / Debit Card')).toBeInTheDocument();
  });

  it('applies selected class to active payment method option', () => {
    render(<PaymentSection paymentMethod="upi" setPaymentMethod={defaultProps.setPaymentMethod} />);

    const codCard = screen.getByText('Cash On Delivery (COD)').closest('.payment-option-card');
    const upiCard = screen.getByText('UPI / Net Banking (Instant Pay)').closest('.payment-option-card');

    expect(codCard).not.toHaveClass('selected');
    expect(upiCard).toHaveClass('selected');
  });

  it('triggers setPaymentMethod when a card is clicked', () => {
    render(<PaymentSection {...defaultProps} />);

    const card = screen.getByText('Credit / Debit Card').closest('.payment-option-card');
    fireEvent.click(card);

    expect(defaultProps.setPaymentMethod).toHaveBeenCalledWith('card');
  });
});
