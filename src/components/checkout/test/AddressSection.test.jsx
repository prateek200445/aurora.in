import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import AddressSection from '../AddressSection';

describe('AddressSection Component', () => {
  const mockAddresses = [
    {
      id: 'addr-1',
      tag: 'Home',
      name: 'Prateek Sharma',
      details: '123 Lavender Heights, Sector 62, Noida',
      pincode: '201301',
      phone: '+91 98765 43210'
    },
    {
      id: 'addr-2',
      tag: 'Office',
      name: 'Jane Doe',
      details: 'Block B, Sector 63, Noida',
      pincode: '201301',
      phone: '+91 98765 49999'
    }
  ];

  const defaultProps = {
    addresses: [],
    selectedAddressId: null,
    handleSelectAddress: vi.fn(),
    showAddressForm: false,
    setShowAddressForm: vi.fn(),
    newAddress: {
      tag: 'Home',
      name: '',
      phone: '',
      street: '',
      city: '',
      state: '',
      pincode: ''
    },
    setNewAddress: vi.fn(),
    handleNewAddressSubmit: vi.fn()
  };

  it('renders guest empty notice when addresses list is empty', () => {
    render(<AddressSection {...defaultProps} />);

    expect(screen.getByText('No Shipping Address Found')).toBeInTheDocument();
    expect(screen.getByText(/Since you are checking out as a guest/i)).toBeInTheDocument();
  });

  it('renders saved address cards when addresses exist', () => {
    render(<AddressSection {...defaultProps} addresses={mockAddresses} />);

    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Prateek Sharma')).toBeInTheDocument();
    expect(screen.getByText('123 Lavender Heights, Sector 62, Noida - 201301')).toBeInTheDocument();
    expect(screen.getByText('+91 98765 43210')).toBeInTheDocument();

    expect(screen.getByText('Office')).toBeInTheDocument();
    expect(screen.getByText('Jane Doe')).toBeInTheDocument();
  });

  it('highlights selected address card with selection class', () => {
    render(<AddressSection {...defaultProps} addresses={mockAddresses} selectedAddressId="addr-1" />);

    const card1 = screen.getByText('Prateek Sharma').closest('.address-card');
    const card2 = screen.getByText('Jane Doe').closest('.address-card');

    expect(card1).toHaveClass('selected');
    expect(card2).not.toHaveClass('selected');
  });

  it('triggers handleSelectAddress when card is clicked', () => {
    render(<AddressSection {...defaultProps} addresses={mockAddresses} />);

    const card2 = screen.getByText('Jane Doe').closest('.address-card');
    fireEvent.click(card2);

    expect(defaultProps.handleSelectAddress).toHaveBeenCalledWith('addr-2');
  });

  it('renders toggle button when showAddressForm is false', () => {
    render(<AddressSection {...defaultProps} />);

    const toggleBtn = screen.getByRole('button', { name: /Add New Address/i });
    expect(toggleBtn).toBeInTheDocument();
    
    fireEvent.click(toggleBtn);
    expect(defaultProps.setShowAddressForm).toHaveBeenCalledWith(true);
  });

  it('renders AddressForm component when showAddressForm is true', () => {
    render(<AddressSection {...defaultProps} showAddressForm={true} />);

    expect(screen.getByRole('heading', { name: 'New Delivery Address', level: 4 })).toBeInTheDocument();
  });

  it('triggers handleDeleteAddress when trash button is clicked', () => {
    const handleDeleteAddressMock = vi.fn();
    render(
      <AddressSection 
        {...defaultProps} 
        addresses={mockAddresses} 
        handleDeleteAddress={handleDeleteAddressMock} 
      />
    );

    const deleteBtns = screen.getAllByRole('button', { name: /Delete Address/i });
    expect(deleteBtns.length).toBe(2);

    fireEvent.click(deleteBtns[0]);
    expect(handleDeleteAddressMock).toHaveBeenCalledWith('addr-1');
  });
});
