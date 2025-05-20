import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import RegisterForm from './RegisterForm';
import { BrowserRouter as Router } from 'react-router-dom'; // Necesario porque RegisterForm usa useNavigate
import { vi } from 'vitest'; // Importar vi de vitest para mocks
import axios, { type AxiosRequestHeaders, type InternalAxiosRequestConfig } from 'axios'; // Tipos, axios mismo será mockeado
import toast from 'react-hot-toast'; // Importar el mock de toast para verificar llamadas

// --- START AXIOS MOCK MODIFICATION ---
vi.mock('axios', async () => {
  // Mover la importación de actualAxios DENTRO de la fábrica del mock
  const actualAxios = await vi.importActual<typeof import('axios')>('axios');
  return {
    __esModule: true, // Importante para módulos ES con default export
    default: {
      post: vi.fn(),
      get: vi.fn(), 
      isAxiosError: actualAxios.isAxiosError,
    },
    isAxiosError: actualAxios.isAxiosError,
  };
});
// --- END AXIOS MOCK MODIFICATION ---

// Mockear react-hot-toast
vi.mock('react-hot-toast', () => ({
  default: {
    success: vi.fn(),
    error: vi.fn(),
  },
  Toaster: () => <div data-testid="toaster-mock" /> // Mock del componente Toaster si fuera necesario globalmente
}));

// Mockear react-router-dom (específicamente useNavigate)
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react-router-dom')>();
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe('RegisterForm component', () => {
  beforeEach(() => {
    // Limpiar mocks antes de cada test
    vi.clearAllMocks();
  });

  it('renders all form fields and submit button', () => {
    render(
      <Router> {/* Envolver en Router debido a useNavigate */}
        <RegisterForm />
      </Router>
    );

    expect(screen.getByLabelText(/Nombre/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Apellidos/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Correo electrónico/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^Contraseña$/i)).toBeInTheDocument(); // Regex para "Contraseña" exacta
    expect(screen.getByLabelText(/Confirmar contraseña/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Profesión/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Crear cuenta/i })).toBeInTheDocument();
  });

  it('shows validation errors from Zod when submitting with empty or invalid fields', async () => {
    render(
      <Router>
        <RegisterForm />
      </Router>
    );

    const professionSelect = screen.getByLabelText(/Profesión/i);
    const submitButton = screen.getByRole('button', { name: /Crear cuenta/i });

    // Simular interacción con el select para asegurar que react-hook-form lo procese
    // Cambiar a un valor válido y luego a uno inválido (el valor de la opción por defecto "Selecciona tu profesión")
    // Esto es para asegurar que el campo sea "touched" y su valor sea explícitamente ""
    fireEvent.change(professionSelect, { target: { value: 'NUTRITIONIST' } });
    fireEvent.change(professionSelect, { target: { value: '' } }); // El valor de la opción "Selecciona tu profesión"

    fireEvent.click(submitButton);

    expect(await screen.findByText('El nombre es requerido')).toBeInTheDocument();
    expect(await screen.findByText('Los apellidos son requeridos')).toBeInTheDocument();
    expect(await screen.findByText('El correo electrónico no es válido')).toBeInTheDocument();
    expect(await screen.findByText('La contraseña debe tener al menos 8 caracteres')).toBeInTheDocument();
    expect(await screen.findByText('La confirmación de contraseña es requerida')).toBeInTheDocument();
    expect(await screen.findByText('Debes seleccionar una profesión')).toBeInTheDocument();
  });

  it('submits the form successfully with valid data', async () => {
    // Usar vi.mocked() para un mejor tipado del mock
    vi.mocked(axios.post).mockResolvedValueOnce({ status: 201, data: { message: 'Success' } });

    render(<Router><RegisterForm /></Router>);

    // Rellenar el formulario
    fireEvent.change(screen.getByLabelText(/Nombre/i), { target: { value: 'Test' } });
    fireEvent.change(screen.getByLabelText(/Apellidos/i), { target: { value: 'User' } });
    fireEvent.change(screen.getByLabelText(/Correo electrónico/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText(/^Contraseña$/i), { target: { value: 'password123' } });
    fireEvent.change(screen.getByLabelText(/Confirmar contraseña/i), { target: { value: 'password123' } });
    fireEvent.change(screen.getByLabelText(/Profesión/i), { target: { value: 'NUTRITIONIST' } });

    const submitButton = screen.getByRole('button', { name: /Crear cuenta/i });
    fireEvent.click(submitButton);

    // Verificar que axios.post fue llamado correctamente
    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledTimes(1);
      expect(axios.post).toHaveBeenCalledWith(
        // Asume el fallback URL si VITE_API_BASE_URL no está seteada en el entorno de test
        'http://localhost:3000/api/auth/register',
        {
          firstName: 'Test',
          lastName: 'User',
          email: 'test@example.com',
          password: 'password123',
          profession: 'NUTRITIONIST',
        }
      );
    });

    // Verificar que se llamó a toast.success
    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith('¡Registro completado! Serás redirigido para iniciar sesión.');
    });

    // Verificar que navigate fue llamado
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/login');
    });
  });

  it('handles 409 conflict error (email already registered)', async () => {
    const errorMessage = 'Este correo electrónico ya está registrado. Intenta con otro.';
    // Cambiar la forma de mockear el AxiosError
    const mockError = {
      isAxiosError: true,
      response: {
        data: { message: 'Email already in use', errors: { email: errorMessage } },
        status: 409,
        statusText: 'Conflict',
        headers: {} as AxiosRequestHeaders,
        config: { headers: {} as AxiosRequestHeaders } as InternalAxiosRequestConfig,
      },
      name: 'AxiosError',
      message: 'Request failed with status code 409',
    };

    vi.mocked(axios.post).mockRejectedValueOnce(mockError);

    render(<Router><RegisterForm /></Router>);

    // Rellenar el formulario con datos válidos (el email será el que cause conflicto)
    fireEvent.change(screen.getByLabelText(/Nombre/i), { target: { value: 'Test' } });
    fireEvent.change(screen.getByLabelText(/Apellidos/i), { target: { value: 'User' } });
    fireEvent.change(screen.getByLabelText(/Correo electrónico/i), { target: { value: 'taken@example.com' } });
    fireEvent.change(screen.getByLabelText(/^Contraseña$/i), { target: { value: 'password123' } });
    fireEvent.change(screen.getByLabelText(/Confirmar contraseña/i), { target: { value: 'password123' } });
    fireEvent.change(screen.getByLabelText(/Profesión/i), { target: { value: 'NUTRITIONIST' } });

    const submitButton = screen.getByRole('button', { name: /Crear cuenta/i });
    fireEvent.click(submitButton);

    // Verificar que axios.post fue llamado
    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledTimes(1);
    });

    // Verificar que se llamó a toast.error con el mensaje del backend o el fallback
    await waitFor(() => {
      // El RegisterForm usa responseData?.errors?.email || 'Este correo electrónico ya está registrado.'
      expect(toast.error).toHaveBeenCalledWith(errorMessage);
    });

    // Verificar que se muestra el error en el campo email
    expect(await screen.findByText(errorMessage)).toBeInTheDocument();
    
    // Verificar que no se llamó a navigate
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it('handles 400 bad request error (backend validation)', async () => {
    const backendErrors = {
      email: 'Desde el backend: el correo ya existe.',
      profession: 'Desde el backend: la profesión no es válida.'
    };
    const mockError = {
      isAxiosError: true,
      response: {
        data: { message: 'Error de validación', errors: backendErrors },
        status: 400,
        statusText: 'Bad Request',
        headers: {} as AxiosRequestHeaders,
        config: { headers: {} as AxiosRequestHeaders } as InternalAxiosRequestConfig,
      },
      name: 'AxiosError',
      message: 'Request failed with status code 400',
    };

    vi.mocked(axios.post).mockRejectedValueOnce(mockError);

    render(<Router><RegisterForm /></Router>);

    // Rellenar y enviar formulario
    fireEvent.change(screen.getByLabelText(/Nombre/i), { target: { value: 'Test' } });
    fireEvent.change(screen.getByLabelText(/Apellidos/i), { target: { value: 'User' } });
    fireEvent.change(screen.getByLabelText(/Correo electrónico/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText(/^Contraseña$/i), { target: { value: 'password123' } });
    fireEvent.change(screen.getByLabelText(/Confirmar contraseña/i), { target: { value: 'password123' } });
    fireEvent.change(screen.getByLabelText(/Profesión/i), { target: { value: 'NUTRITIONIST' } });
    fireEvent.click(screen.getByRole('button', { name: /Crear cuenta/i }));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Error de validación del backend. Por favor, revisa los campos.');
    });

    // Verificar que los errores del backend se muestran en los campos correspondientes
    expect(await screen.findByText(backendErrors.email)).toBeInTheDocument();
    expect(await screen.findByText(backendErrors.profession)).toBeInTheDocument();
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it('handles generic server error (e.g., 500)', async () => {
    const serverErrorMessage = 'Ocurrió un error en el servidor.';
    const mockError = {
      isAxiosError: true,
      response: {
        data: { message: serverErrorMessage }, // No hay objeto 'errors' aquí
        status: 500,
        statusText: 'Internal Server Error',
        headers: {} as AxiosRequestHeaders,
        config: { headers: {} as AxiosRequestHeaders } as InternalAxiosRequestConfig,
      },
      name: 'AxiosError',
      message: 'Request failed with status code 500',
    };

    vi.mocked(axios.post).mockRejectedValueOnce(mockError);

    render(<Router><RegisterForm /></Router>);
    
    // Rellenar y enviar formulario
    fireEvent.change(screen.getByLabelText(/Nombre/i), { target: { value: 'Test' } });
    fireEvent.change(screen.getByLabelText(/Apellidos/i), { target: { value: 'User' } });
    fireEvent.change(screen.getByLabelText(/Correo electrónico/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText(/^Contraseña$/i), { target: { value: 'password123' } });
    fireEvent.change(screen.getByLabelText(/Confirmar contraseña/i), { target: { value: 'password123' } });
    fireEvent.change(screen.getByLabelText(/Profesión/i), { target: { value: 'NUTRITIONIST' } });
    fireEvent.click(screen.getByRole('button', { name: /Crear cuenta/i }));

    await waitFor(() => {
      // El RegisterForm usa `Error en el registro: ${responseData.message}`
      expect(toast.error).toHaveBeenCalledWith(`Error en el registro: ${serverErrorMessage}`);
    });
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it('handles network error (no error.response)', async () => {
    const networkError = {
      isAxiosError: false, // O podría ser true, pero sin error.response
      message: 'Network Error',
      name: 'Error',
      // No hay 'response' aquí
    };

    vi.mocked(axios.post).mockRejectedValueOnce(networkError);

    render(<Router><RegisterForm /></Router>);

    // Rellenar y enviar formulario
    fireEvent.change(screen.getByLabelText(/Nombre/i), { target: { value: 'Test' } });
    fireEvent.change(screen.getByLabelText(/Apellidos/i), { target: { value: 'User' } });
    fireEvent.change(screen.getByLabelText(/Correo electrónico/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText(/^Contraseña$/i), { target: { value: 'password123' } });
    fireEvent.change(screen.getByLabelText(/Confirmar contraseña/i), { target: { value: 'password123' } });
    fireEvent.change(screen.getByLabelText(/Profesión/i), { target: { value: 'NUTRITIONIST' } });
    fireEvent.click(screen.getByRole('button', { name: /Crear cuenta/i }));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Ocurrió un error inesperado. Por favor, inténtalo de nuevo.');
    });
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  // Aquí añadiremos más tests

}); 