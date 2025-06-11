import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import PasswordRecoveryPage from './PasswordRecoveryPage';

// Mock de react-router-dom para el entorno de testing
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    BrowserRouter: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
    Link: ({ children, to }: { children: React.ReactNode; to: string }) => (
      <a href={to}>{children}</a>
    ),
  };
});

const renderWithRouter = (component: React.ReactElement) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  );
};

describe('PasswordRecoveryPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the password recovery page correctly', () => {
    renderWithRouter(<PasswordRecoveryPage />);

    // Verificar que el título está presente
    expect(screen.getByText('Recuperar Contraseña')).toBeInTheDocument();
    
    // Verificar que el mensaje principal está presente
    expect(screen.getByText(/Para recuperar tu contraseña, por favor contacta con el administrador/)).toBeInTheDocument();
    
    // Verificar que el email del administrador está presente
    expect(screen.getByText('nutritrackpro.team@gmail.com')).toBeInTheDocument();
  });

  it('contains the correct email link with mailto', () => {
    renderWithRouter(<PasswordRecoveryPage />);

    const emailLink = screen.getByRole('link', { name: 'nutritrackpro.team@gmail.com' });
    expect(emailLink).toBeInTheDocument();
    expect(emailLink).toHaveAttribute('href', expect.stringContaining('mailto:nutritrackpro.team@gmail.com'));
    expect(emailLink).toHaveAttribute('href', expect.stringContaining('subject=Solicitud de recuperación de contraseña'));
  });

  it('displays instructions for password recovery request', () => {
    renderWithRouter(<PasswordRecoveryPage />);

    expect(screen.getByText('Instrucciones para la solicitud')).toBeInTheDocument();
    expect(screen.getByText('Tu email registrado en la plataforma')).toBeInTheDocument();
    expect(screen.getByText('Tu nombre completo')).toBeInTheDocument();
    expect(screen.getByText('Tu profesión (Nutricionista/Entrenador)')).toBeInTheDocument();
  });

  it('contains navigation links to login and register', () => {
    renderWithRouter(<PasswordRecoveryPage />);

    expect(screen.getByRole('link', { name: 'Volver al Login' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: '¿No tienes cuenta? Regístrate' })).toBeInTheDocument();
  });

  it('displays helpful information sections', () => {
    renderWithRouter(<PasswordRecoveryPage />);

    expect(screen.getByText('Información importante')).toBeInTheDocument();
    expect(screen.getByText('Correo del administrador:')).toBeInTheDocument();
    expect(screen.getByText(/💡 Al hacer clic en el email se abrirá tu cliente de correo/)).toBeInTheDocument();
  });
}); 