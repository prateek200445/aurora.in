import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import PincodeChecker from '../PincodeChecker';

describe('PincodeChecker Component', () => {
  const defaultProps = {
    pincodeQuery: '',
    setPincodeQuery: vi.fn(),
    isPincodeChecking: false,
    pincodeStatus: null,
    pincodeMessage: '',
    deliveryDateString: 'Tuesday, 8 June 2026',
    handleCheckPincode: vi.fn()
  };

  it('renders input field, submit button and static delivery info correctly', () => {
    render(<PincodeChecker {...defaultProps} />);

    expect(screen.getByPlaceholderText('Enter 6-digit Pincode (e.g. 201301)')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Check' })).toBeInTheDocument();
    expect(screen.getByText(/Standard Delivery Guaranteed:/i)).toBeInTheDocument();
    expect(screen.getByText('Tuesday, 8 June 2026', { exact: false })).toBeInTheDocument();
  });

  it('calls setPincodeQuery when typing in the input field', () => {
    render(<PincodeChecker {...defaultProps} />);

    const input = screen.getByPlaceholderText('Enter 6-digit Pincode (e.g. 201301)');
    fireEvent.change(input, { target: { value: '201301' } });

    expect(defaultProps.setPincodeQuery).toHaveBeenCalledWith('201301');
  });

  it('submits form on button click triggering handleCheckPincode', () => {
    const handleCheckPincodeMock = vi.fn((e) => e.preventDefault());
    render(<PincodeChecker {...defaultProps} handleCheckPincode={handleCheckPincodeMock} />);

    const button = screen.getByRole('button', { name: 'Check' });
    fireEvent.click(button);

    expect(handleCheckPincodeMock).toHaveBeenCalled();
  });

  it('displays loading spinner when isPincodeChecking is true', () => {
    render(<PincodeChecker {...defaultProps} isPincodeChecking={true} />);

    expect(screen.getByRole('button')).toBeDisabled();
    expect(screen.getByRole('button').querySelector('.spinner-sm')).toBeInTheDocument();
  });

  it('displays success message when pincodeStatus is success', () => {
    render(
      <PincodeChecker 
        {...defaultProps} 
        pincodeStatus="success" 
        pincodeMessage="Deliverable!" 
      />
    );

    const messageContainer = screen.getByText('Deliverable!');
    expect(messageContainer).toBeInTheDocument();
    expect(messageContainer.closest('.pincode-result')).toHaveClass('success');
  });

  it('displays error message when pincodeStatus is error', () => {
    render(
      <PincodeChecker 
        {...defaultProps} 
        pincodeStatus="error" 
        pincodeMessage="Invalid pincode" 
      />
    );

    const messageContainer = screen.getByText('Invalid pincode');
    expect(messageContainer).toBeInTheDocument();
    expect(messageContainer.closest('.pincode-result')).toHaveClass('error');
  });
});
