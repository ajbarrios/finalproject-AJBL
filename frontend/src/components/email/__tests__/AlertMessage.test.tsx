import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import AlertMessage from '../AlertMessage';

describe('AlertMessage', () => {
  it('debería renderizar cuando show es true', () => {
    render(<AlertMessage show={true} />);
    
    expect(screen.getByText('Paciente sin email registrado')).toBeInTheDocument();
    expect(screen.getByText(/Este paciente no tiene un email registrado/)).toBeInTheDocument();
  });

  it('no debería renderizar cuando show es false', () => {
    render(<AlertMessage show={false} />);
    
    expect(screen.queryByText('Paciente sin email registrado')).not.toBeInTheDocument();
  });

  it('debería mostrar el icono de advertencia', () => {
    const { container } = render(<AlertMessage show={true} />);
    
    const icon = container.querySelector('svg');
    expect(icon).toBeInTheDocument();
  });

  it('debería tener las clases CSS correctas para el styling amarillo', () => {
    const { container } = render(<AlertMessage show={true} />);
    
    const alertContainer = container.querySelector('.bg-yellow-50');
    expect(alertContainer).toHaveClass('bg-yellow-50', 'border', 'border-yellow-200');
  });

  it('debería mostrar el mensaje completo de instrucción', () => {
    render(<AlertMessage show={true} />);
    
    expect(screen.getByText(
      'Este paciente no tiene un email registrado. Deberás introducir manualmente el email de destino.'
    )).toBeInTheDocument();
  });
}); 