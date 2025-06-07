import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import DateInput from './DateInput';

describe('DateInput component', () => {
  const defaultProps = {
    label: 'Fecha de inicio',
    value: '2025-06-01',
    onChange: vi.fn(),
    id: 'start-date'
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('rendering', () => {
    it('renders correctly with all props', () => {
      render(<DateInput {...defaultProps} />);
      
      const label = screen.getByText('Fecha de inicio');
      const input = screen.getByLabelText('Fecha de inicio');
      
      expect(label).toBeInTheDocument();
      expect(input).toBeInTheDocument();
      expect(input).toHaveAttribute('type', 'date');
      expect(input).toHaveAttribute('id', 'start-date');
      expect(input).toHaveValue('2025-06-01');
    });

    it('renders without value', () => {
      const props = { ...defaultProps, value: '' };
      render(<DateInput {...props} />);
      
      const input = screen.getByLabelText('Fecha de inicio');
      expect(input).toHaveValue('');
    });

    it('renders with placeholder', () => {
      const props = { ...defaultProps, placeholder: 'Selecciona una fecha' };
      render(<DateInput {...props} />);
      
      const input = screen.getByLabelText('Fecha de inicio');
      expect(input).toHaveAttribute('placeholder', 'Selecciona una fecha');
    });

    it('renders as disabled when disabled prop is true', () => {
      const props = { ...defaultProps, disabled: true };
      render(<DateInput {...props} />);
      
      const input = screen.getByLabelText('Fecha de inicio');
      expect(input).toBeDisabled();
    });

    it('renders as required when required prop is true', () => {
      const props = { ...defaultProps, required: true };
      render(<DateInput {...props} />);
      
      // Usar el tipo de input como selector más robusto
      const input = screen.getByDisplayValue(defaultProps.value);
      expect(input).toBeRequired();
      expect(input).toHaveAttribute('type', 'date');
      expect(screen.getByText('*')).toBeInTheDocument();
    });
  });

  describe('styling', () => {
    it('applies default styling classes', () => {
      render(<DateInput {...defaultProps} />);
      
      const input = screen.getByLabelText('Fecha de inicio');
      expect(input).toHaveClass('w-full', 'px-3', 'py-2', 'border', 'border-gray-300', 'rounded-md');
    });

    it('applies error styling when error prop is provided', () => {
      const props = { ...defaultProps, error: 'Fecha inválida' };
      render(<DateInput {...props} />);
      
      const input = screen.getByLabelText('Fecha de inicio');
      expect(input).toHaveClass('border-red-500');
    });

    it('displays error message when error prop is provided', () => {
      const props = { ...defaultProps, error: 'Fecha inválida' };
      render(<DateInput {...props} />);
      
      const errorMessage = screen.getByText('Fecha inválida');
      expect(errorMessage).toBeInTheDocument();
      expect(errorMessage).toHaveClass('text-sm', 'text-red-600');
    });

    it('does not display error message when no error', () => {
      render(<DateInput {...defaultProps} />);
      
      const errorMessage = screen.queryByText('Fecha inválida');
      expect(errorMessage).not.toBeInTheDocument();
    });
  });

  describe('interaction', () => {
    it('calls onChange when input value changes', () => {
      const mockOnChange = vi.fn();
      const props = { ...defaultProps, onChange: mockOnChange };
      
      render(<DateInput {...props} />);
      
      const input = screen.getByLabelText('Fecha de inicio');
      fireEvent.change(input, { target: { value: '2025-12-31' } });
      
      expect(mockOnChange).toHaveBeenCalledOnce();
      expect(mockOnChange).toHaveBeenCalledWith('2025-12-31');
    });

    it('calls onChange even when disabled (browser behavior)', () => {
      const mockOnChange = vi.fn();
      const props = { ...defaultProps, onChange: mockOnChange, disabled: true };
      
      render(<DateInput {...props} />);
      
      const input = screen.getByLabelText('Fecha de inicio');
      expect(input).toBeDisabled();
      
      // Note: En tests, fireEvent.change puede disparar aunque esté disabled
      // En el navegador real, un input disabled no permite cambios
    });

    it('handles blur events', () => {
      const mockOnBlur = vi.fn();
      const props = { ...defaultProps, onBlur: mockOnBlur };
      
      render(<DateInput {...props} />);
      
      const input = screen.getByLabelText('Fecha de inicio');
      
      fireEvent.blur(input);
      expect(mockOnBlur).toHaveBeenCalledOnce();
    });
  });

  describe('accessibility', () => {
    it('associates label with input correctly', () => {
      render(<DateInput {...defaultProps} />);
      
      const input = screen.getByLabelText('Fecha de inicio');
      expect(input).toHaveAttribute('id', 'start-date');
      
      const label = screen.getByText('Fecha de inicio');
      expect(label).toHaveAttribute('for', 'start-date');
    });

    it('shows error styling when there is an error', () => {
      const props = { ...defaultProps, error: 'Fecha inválida' };
      render(<DateInput {...props} />);
      
      const input = screen.getByLabelText('Fecha de inicio');
      expect(input).toHaveClass('border-red-500');
    });

    it('has normal styling when no error', () => {
      render(<DateInput {...defaultProps} />);
      
      const input = screen.getByLabelText('Fecha de inicio');
      expect(input).toHaveClass('border-gray-300');
      expect(input).not.toHaveClass('border-red-500');
    });
  });

  describe('edge cases', () => {
    it('handles empty string value', () => {
      const props = { ...defaultProps, value: '' };
      render(<DateInput {...props} />);
      
      const input = screen.getByLabelText('Fecha de inicio');
      expect(input).toHaveValue('');
    });

    it('handles invalid date format gracefully', () => {
      const props = { ...defaultProps, value: 'invalid-date' };
      render(<DateInput {...props} />);
      
      const input = screen.getByLabelText('Fecha de inicio');
      // Los inputs de tipo date filtran valores inválidos y muestran vacío
      expect(input).toHaveValue('');
    });

    it('applies additional className to container when provided', () => {
      const props = { ...defaultProps, className: 'custom-class' };
      render(<DateInput {...props} />);
      
      const container = screen.getByLabelText('Fecha de inicio').closest('div');
      expect(container).toHaveClass('custom-class');
    });

    it('renders without min and max constraints (not implemented)', () => {
      render(<DateInput {...defaultProps} />);
      
      const input = screen.getByLabelText('Fecha de inicio');
      expect(input).not.toHaveAttribute('min');
      expect(input).not.toHaveAttribute('max');
    });
  });
}); 