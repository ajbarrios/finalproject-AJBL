import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import ActionButtons from '../ActionButtons';

describe('ActionButtons', () => {
  const defaultProps = {
    isLoading: false,
    hasSelectedPlans: true,
    onCancel: vi.fn(),
    onSubmit: vi.fn(),
  };

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('debería renderizar ambos botones', () => {
    render(<ActionButtons {...defaultProps} />);
    
    expect(screen.getByRole('button', { name: /cancelar/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /enviar email/i })).toBeInTheDocument();
  });

  it('debería llamar onCancel cuando se hace clic en Cancelar', () => {
    render(<ActionButtons {...defaultProps} />);
    
    const cancelButton = screen.getByRole('button', { name: /cancelar/i });
    fireEvent.click(cancelButton);
    
    expect(defaultProps.onCancel).toHaveBeenCalledTimes(1);
  });

  it('debería llamar onSubmit cuando se hace clic en Enviar Email', () => {
    render(<ActionButtons {...defaultProps} />);
    
    const submitButton = screen.getByRole('button', { name: /enviar email/i });
    fireEvent.click(submitButton);
    
    expect(defaultProps.onSubmit).toHaveBeenCalledTimes(1);
  });

  it('debería deshabilitar ambos botones cuando isLoading es true', () => {
    render(<ActionButtons {...defaultProps} isLoading={true} />);
    
    const cancelButton = screen.getByRole('button', { name: /cancelar/i });
    const submitButton = screen.getByRole('button', { name: /enviar email/i });
    
    expect(cancelButton).toBeDisabled();
    expect(submitButton).toBeDisabled();
  });

  it('debería deshabilitar el botón enviar cuando no hay planes seleccionados', () => {
    render(<ActionButtons {...defaultProps} hasSelectedPlans={false} />);
    
    const cancelButton = screen.getByRole('button', { name: /cancelar/i });
    const submitButton = screen.getByRole('button', { name: /enviar email/i });
    
    expect(cancelButton).not.toBeDisabled();
    expect(submitButton).toBeDisabled();
  });

  it('debería mostrar el spinner de carga cuando isLoading es true', () => {
    render(<ActionButtons {...defaultProps} isLoading={true} />);
    
    const spinner = screen.getByText(/enviar email/i).parentElement?.querySelector('.animate-spin');
    expect(spinner).toBeInTheDocument();
  });

  it('debería tener las clases CSS correctas para estados habilitado/deshabilitado', () => {
    const { rerender } = render(<ActionButtons {...defaultProps} />);
    
    const submitButton = screen.getByRole('button', { name: /enviar email/i });
    expect(submitButton).toHaveClass('bg-blue-600');
    
    // Test con botón deshabilitado
    rerender(<ActionButtons {...defaultProps} hasSelectedPlans={false} />);
    expect(submitButton).toHaveClass('bg-gray-400');
  });

  it('no debería llamar onCancel ni onSubmit cuando están deshabilitados', () => {
    render(<ActionButtons {...defaultProps} isLoading={true} />);
    
    const cancelButton = screen.getByRole('button', { name: /cancelar/i });
    const submitButton = screen.getByRole('button', { name: /enviar email/i });
    
    fireEvent.click(cancelButton);
    fireEvent.click(submitButton);
    
    expect(defaultProps.onCancel).not.toHaveBeenCalled();
    expect(defaultProps.onSubmit).not.toHaveBeenCalled();
  });
}); 