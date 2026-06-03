import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import SuccessModal from '../SuccessModal';

describe('SuccessModal Component', () => {
  const defaultProps = {
    isOrderPlaced: false,
    placedOrderId: 'AUR-2026-123456',
    currentAddress: {
      name: 'Prateek Sharma',
      details: '123 Lavender Heights, Noida'
    },
    deliveryDateString: 'Tuesday, 8 June 2026',
    total: 11999,
    handleCloseSuccessModal: vi.fn()
  };

  it('renders null when isOrderPlaced is false', () => {
    const { container } = render(<SuccessModal {...defaultProps} />);
    expect(container.firstChild).toBeNull();
  });

  it('renders details success overlay when isOrderPlaced is true', () => {
    render(<SuccessModal {...defaultProps} isOrderPlaced={true} />);

    expect(screen.getByRole('heading', { name: 'Order Placed Successfully!', level: 2 })).toBeInTheDocument();
    expect(screen.getByText(/Thank you for shopping with Aurora Goods/i)).toBeInTheDocument();
    
    // Summary Cards
    expect(screen.getByText('Order Reference:')).toBeInTheDocument();
    expect(screen.getByText('AUR-2026-123456')).toBeInTheDocument();

    expect(screen.getByText('Delivery Address:')).toBeInTheDocument();
    expect(screen.getByText('Prateek Sharma')).toBeInTheDocument();

    expect(screen.getByText('Delivery Address Info:')).toBeInTheDocument();
    expect(screen.getByText('123 Lavender Heights, Noida')).toBeInTheDocument();

    expect(screen.getByText('Expected Delivery:')).toBeInTheDocument();
    expect(screen.getByText('In 5 Days (Tuesday, 8 June 2026)')).toBeInTheDocument();

    expect(screen.getByText('Paid Amount:')).toBeInTheDocument();
    expect(screen.getByText('₹11,999')).toBeInTheDocument();
  });

  it('calls handleCloseSuccessModal when continue btn is clicked', () => {
    render(<SuccessModal {...defaultProps} isOrderPlaced={true} />);

    const btn = screen.getByRole('button', { name: 'Continue Shopping' });
    fireEvent.click(btn);

    expect(defaultProps.handleCloseSuccessModal).toHaveBeenCalled();
  });
});
