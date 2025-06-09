import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom'; // Usaremos MemoryRouter para envolver el componente
import Navbar from './Navbar';
import * as AuthContext from '../../hooks/useAuth'; // Importar para mockear useAuth

// Mockear react-router-dom (solo useNavigate, Link se renderiza por MemoryRouter)
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual, // Importar todo lo real
    useNavigate: () => mockNavigate, // Mockear solo useNavigate
  };
});

// Mockear el hook useAuth
// Lo hacemos a nivel global del describe o por test si es necesario
const mockUseAuth = vi.spyOn(AuthContext, 'useAuth');

describe('Navbar', () => {
  const renderNavbarWithRouter = () => {
    return render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );
  };

  beforeEach(() => {
    vi.resetAllMocks(); // Limpiar mocks antes de cada test
  });

  it('debería renderizar el título de la aplicación como un enlace a la raíz', () => {
    // Asumir estado no autenticado por defecto si no se especifica
    mockUseAuth.mockReturnValue({
      isAuthenticated: false,
      user: null,
      login: vi.fn(),
      logout: vi.fn(),
      isLoading: false,
      token: null,
      handleTokenExpired: vi.fn(),
    });
    renderNavbarWithRouter();
    const titleLink = screen.getByRole('link', { name: /NutriTrack Pro/i });
    expect(titleLink).toBeInTheDocument();
    expect(titleLink).toHaveAttribute('href', '/');
  });

  describe('Cuando el usuario no está autenticado', () => {
    beforeEach(() => {
      mockUseAuth.mockReturnValue({
        isAuthenticated: false,
        user: null,
        login: vi.fn(),
        logout: vi.fn(),
        isLoading: false,
        token: null,
        handleTokenExpired: vi.fn(),
      });
    });

    it('debería mostrar enlaces para "Iniciar Sesión" y "Registrarse"', () => {
      renderNavbarWithRouter();
      expect(screen.getByRole('link', { name: /Iniciar Sesión/i })).toHaveAttribute('href', '/login');
      expect(screen.getByRole('link', { name: /Registrarse/i })).toHaveAttribute('href', '/registro');
    });

    it('no debería mostrar el mensaje de bienvenida ni el botón de cerrar sesión', () => {
      renderNavbarWithRouter();
      expect(screen.queryByText(/Hola,/i)).not.toBeInTheDocument();
      expect(screen.queryByRole('button', { name: /Cerrar sesión/i })).not.toBeInTheDocument();
    });
  });

  describe('Cuando el usuario está autenticado', () => {
    const mockUser = { 
      id: 'user1', 
      email: 'test@example.com', 
      fullName: 'Usuario de Prueba', 
      profession: 'Nutricionista'
    };
    const mockLogout = vi.fn();

    beforeEach(() => {
      mockUseAuth.mockReturnValue({
        isAuthenticated: true,
        user: mockUser,
        login: vi.fn(),
        logout: mockLogout,
        isLoading: false,
        token: 'fake-token',
        handleTokenExpired: vi.fn(),
      });
    });

    it('debería mostrar el mensaje de bienvenida con el nombre del usuario', () => {
      renderNavbarWithRouter();
      expect(screen.getByText(`Hola, ${mockUser.fullName}`)).toBeInTheDocument();
    });

    it('debería mostrar el botón de "Cerrar sesión"', () => {
      renderNavbarWithRouter();
      expect(screen.getByRole('button', { name: /Cerrar sesión/i })).toBeInTheDocument();
    });

    it('no debería mostrar enlaces para "Iniciar Sesión" y "Registrarse"', () => {
      renderNavbarWithRouter();
      expect(screen.queryByRole('link', { name: /Iniciar Sesión/i })).not.toBeInTheDocument();
      expect(screen.queryByRole('link', { name: /Registrarse/i })).not.toBeInTheDocument();
    });

    it('debería llamar a logout y navegar a /login al hacer clic en "Cerrar sesión"', () => {
      renderNavbarWithRouter();
      const logoutButton = screen.getByRole('button', { name: /Cerrar sesión/i });
      fireEvent.click(logoutButton);
      
      expect(mockLogout).toHaveBeenCalledOnce();
      expect(mockNavigate).toHaveBeenCalledWith('/login');
    });
  });
}); 