import { render, screen } from '@testing-library/react';
import Spinner from './Spinner';

describe('Spinner component', () => {
  it('renders correctly with default props', () => {
    render(<Spinner />);
    const spinnerSvg = screen.getByTestId('spinner-svg');
    expect(spinnerSvg).toBeInTheDocument();
    expect(spinnerSvg).toHaveClass('animate-spin h-5 w-5 text-white');
  });

  it('applies size classes correctly', () => {
    render(<Spinner size="lg" />);
    const spinnerSvg = screen.getByTestId('spinner-svg');
    expect(spinnerSvg).toHaveClass('h-8 w-8');
  });

  it('applies color classes correctly', () => {
    render(<Spinner color="text-blue-500" />);
    const spinnerSvg = screen.getByTestId('spinner-svg');
    expect(spinnerSvg).toHaveClass('text-blue-500');
  });

  // Test para verificar que no tiene las clases de layout directamente
  it('does not have layout classes when not passed via wrapper', () => {
    render(<Spinner />);
    const spinnerSvg = screen.getByTestId('spinner-svg');
    expect(spinnerSvg).not.toHaveClass('-ml-1');
    expect(spinnerSvg).not.toHaveClass('mr-3');
  });
}); 