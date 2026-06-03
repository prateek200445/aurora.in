import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import AddressForm from '../AddressForm';

describe('AddressForm Component', () => {
  const defaultProps = {
    newAddress: {
      tag: 'Home',
      name: 'Jane Doe',
      phone: '+91 99999 88888',
      street: '123 Lavender lane',
      city: 'Noida',
      state: 'UP',
      pincode: '201301'
    },
    setNewAddress: vi.fn(),
    handleNewAddressSubmit: vi.fn(),
    setShowAddressForm: vi.fn()
  };

  it('renders all form input fields, labels and action buttons', () => {
    render(<AddressForm {...defaultProps} />);

    expect(screen.getByLabelText(/Address Type/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Full Name \*/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Phone Number \*/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Pincode \*/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Flat, House no\., Building, Street \*/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/City \*/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/State \*/i)).toBeInTheDocument();

    expect(screen.getByRole('button', { name: /Cancel/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Save & Use Address/i })).toBeInTheDocument();
  });

  it('populates fields with active newAddress values', () => {
    render(<AddressForm {...defaultProps} />);

    expect(screen.getByLabelText(/Address Type/i)).toHaveValue('Home');
    expect(screen.getByLabelText(/Full Name \*/i)).toHaveValue('Jane Doe');
    expect(screen.getByLabelText(/Phone Number \*/i)).toHaveValue('+91 99999 88888');
    expect(screen.getByLabelText(/Pincode \*/i)).toHaveValue('201301');
    expect(screen.getByLabelText(/Flat, House no\., Building, Street \*/i)).toHaveValue('123 Lavender lane');
    expect(screen.getByLabelText(/City \*/i)).toHaveValue('Noida');
    expect(screen.getByLabelText(/State \*/i)).toHaveValue('UP');
  });

  it('triggers setNewAddress on field updates', () => {
    render(<AddressForm {...defaultProps} />);

    const nameInput = screen.getByLabelText(/Full Name \*/i);
    fireEvent.change(nameInput, { target: { value: 'Prateek Sharma' } });

    expect(defaultProps.setNewAddress).toHaveBeenCalled();
  });

  it('calls handleNewAddressSubmit on form submission', () => {
    const handleNewAddressSubmitMock = vi.fn((e) => e.preventDefault());
    render(<AddressForm {...defaultProps} handleNewAddressSubmit={handleNewAddressSubmitMock} />);

    const saveBtn = screen.getByRole('button', { name: /Save & Use Address/i });
    fireEvent.click(saveBtn);

    expect(handleNewAddressSubmitMock).toHaveBeenCalled();
  });

  it('calls setShowAddressForm(false) when cancel is clicked', () => {
    render(<AddressForm {...defaultProps} />);

    const cancelBtn = screen.getByRole('button', { name: /Cancel/i });
    fireEvent.click(cancelBtn);

    expect(defaultProps.setShowAddressForm).toHaveBeenCalledWith(false);
  });
});
