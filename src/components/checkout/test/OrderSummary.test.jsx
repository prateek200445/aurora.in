import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import OrderSummary from '../OrderSummary';

describe('OrderSummary Component', () => {
  const mockCartItems = [
    {
      product: {
        id: 'prod-1',
        name: 'Woolen Scarf',
        price: 2500,
        image: '/images/scarf.jpg'
      },
      quantity: 2
    },
    {
      product: {
        id: 'prod-2',
        name: 'Smart Speaker',
        price: 7999,
        discountPrice: 6999,
        image: '/images/speaker.jpg'
      },
      quantity: 1
    }
  ];

  const defaultProps = {
    cartItems: mockCartItems,
    subtotal: 11999,
    total: 11999,
    couponApplied: false,
    isCouponLoading: false,
    couponMessage: '',
    discountPercent: 0,
    discountAmount: 0,
    promoInput: '',
    setPromoInput: vi.fn(),
    handleApplyPromoCode: vi.fn(),
    handleQuickApply: vi.fn(),
    handlePlaceOrder: vi.fn(),
    isPlacingOrder: false,
    selectedAddressId: null,
    removePromoCode: vi.fn()
  };

  it('renders cart products list and totals correctly', () => {
    render(<OrderSummary {...defaultProps} />);

    expect(screen.getByRole('heading', { name: 'Order Summary', level: 3 })).toBeInTheDocument();
    
    // Items
    expect(screen.getByText('Woolen Scarf')).toBeInTheDocument();
    expect(screen.getByText('Qty: 2 • ₹2,500')).toBeInTheDocument();
    expect(screen.getByText('₹5,000')).toBeInTheDocument();

    expect(screen.getByText('Smart Speaker')).toBeInTheDocument();
    expect(screen.getByText('Qty: 1 • ₹6,999')).toBeInTheDocument();
    expect(screen.getByText('₹6,999')).toBeInTheDocument();

    // Cost Breakdown
    expect(screen.getByText('Subtotal')).toBeInTheDocument();
    expect(screen.getAllByText('₹11,999').length).toBe(2);
    expect(screen.getByText('Shipping')).toBeInTheDocument();
    expect(screen.getByText('FREE')).toBeInTheDocument();
    expect(screen.getByText('Total')).toBeInTheDocument();
  });

  it('handles manual promo code entry and submission', () => {
    const handleApplyPromoCodeMock = vi.fn((e) => e.preventDefault());
    render(
      <OrderSummary 
        {...defaultProps} 
        promoInput="MYCODE" 
        handleApplyPromoCode={handleApplyPromoCodeMock} 
      />
    );

    const input = screen.getByPlaceholderText('Enter code (e.g. AURORA10)');
    expect(input).toHaveValue('MYCODE');

    const form = input.closest('form');
    fireEvent.submit(form);

    expect(handleApplyPromoCodeMock).toHaveBeenCalled();
  });

  it('displays coupon applied state and allows removal', () => {
    render(
      <OrderSummary 
        {...defaultProps} 
        couponApplied={true} 
        couponMessage="Applied successfully!" 
        discountPercent={10}
        discountAmount={1200}
        total={10799}
      />
    );

    expect(screen.getByPlaceholderText('Enter code (e.g. AURORA10)')).toBeDisabled();
    expect(screen.getByText('Applied successfully!')).toBeInTheDocument();
    expect(screen.getByText('Discount (10%)')).toBeInTheDocument();
    expect(screen.getByText('-₹1,200')).toBeInTheDocument();
    expect(screen.getByText('₹10,799')).toBeInTheDocument();

    const removeBtn = screen.getByRole('button', { name: 'Remove' });
    fireEvent.click(removeBtn);

    expect(defaultProps.removePromoCode).toHaveBeenCalled();
  });

  it('renders available quick offers and triggers handleQuickApply on click', () => {
    render(<OrderSummary {...defaultProps} />);

    expect(screen.getByText('Available Offers')).toBeInTheDocument();
    
    const applyBtns = screen.getAllByRole('button', { name: 'Apply' });
    // The first button in document is for form submit, the 2nd for AURORA10, 3rd for FREESHIP
    fireEvent.click(applyBtns[1]);
    expect(defaultProps.handleQuickApply).toHaveBeenCalledWith('AURORA10');

    fireEvent.click(applyBtns[2]);
    expect(defaultProps.handleQuickApply).toHaveBeenCalledWith('FREESHIP');
  });

  it('disables Place Order button and shows helper prompt when selectedAddressId is null', () => {
    render(<OrderSummary {...defaultProps} />);

    const orderBtn = screen.getByRole('button', { name: 'Add Shipping Address to Proceed' });
    expect(orderBtn).toBeDisabled();
    expect(orderBtn).toHaveStyle({ cursor: 'not-allowed' });
  });

  it('enables Place Order button and calls handlePlaceOrder when selectedAddressId is active', () => {
    render(<OrderSummary {...defaultProps} selectedAddressId="addr-1" />);

    const orderBtn = screen.getByRole('button', { name: 'Place Order Securely' });
    expect(orderBtn).toBeEnabled();

    fireEvent.click(orderBtn);
    expect(defaultProps.handlePlaceOrder).toHaveBeenCalled();
  });

  it('shows placing loading text and spinner when isPlacingOrder is true', () => {
    render(<OrderSummary {...defaultProps} selectedAddressId="addr-1" isPlacingOrder={true} />);

    const orderBtn = screen.getByRole('button', { name: /Placing Order/i });
    expect(orderBtn).toBeDisabled();
    expect(screen.getByText('Placing Order...')).toBeInTheDocument();
  });
});
