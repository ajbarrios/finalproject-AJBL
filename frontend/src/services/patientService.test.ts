import { describe, it, expect, vi, beforeEach } from 'vitest';
import apiClient from './authService'; // Usaremos esto para mockear sus métodos
import { fetchPatients } from './patientService';
import type { Patient } from '../types/patient';
// Eliminamos AxiosRequestConfig si no se usa, mantenemos InternalAxiosRequestConfig si es la que se usa.
import type { AxiosError, InternalAxiosRequestConfig } from 'axios';

// Mockear el apiClient importado de authService
vi.mock('./authService', () => {
  return {
    default: {
      get: vi.fn(), // Mockeamos el método get de apiClient
      // Aquí podrías mockear otros métodos (post, put, delete) si fueran necesarios para otros servicios
    },
  };
});

// Mockear axios solo para isAxiosError si no se mockea globalmente en setupTests.ts
// Alternativamente, puedes definir un mock más simple para el error.
vi.mock('axios', async (importOriginal) => {
  const actualAxios = await importOriginal<typeof import('axios')>();
  return {
    ...actualAxios, // Mantenemos las exportaciones originales que no queremos mockear
    isAxiosError: (payload: unknown): payload is AxiosError => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return payload instanceof Error && 'isAxiosError' in payload && (payload as any).isAxiosError === true;
    },
    // Para Axios v1.x, config en AxiosError es AxiosRequestConfig y no InternalAxiosRequestConfig
    // Si usas una versión muy nueva de Axios, podría ser InternalAxiosRequestConfig
  };
});

describe('patientService - fetchPatients', () => {
  const mockPatients: Patient[] = [
    { id: '1', firstName: 'Ana', lastName: 'Gomez', email: 'ana@example.com', professionalId: 'prof1', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
    { id: '2', firstName: 'Luis', lastName: 'Perez', email: 'luis@example.com', professionalId: 'prof1', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  ];

  beforeEach(() => {
    // Resetear mocks antes de cada prueba
    vi.mocked(apiClient.get).mockReset();
  });

  it('debería llamar a apiClient.get sin parámetros de búsqueda si no se provee searchTerm', async () => {
    vi.mocked(apiClient.get).mockResolvedValue({ data: mockPatients });

    await fetchPatients();

    expect(apiClient.get).toHaveBeenCalledOnce();
    expect(apiClient.get).toHaveBeenCalledWith('/patients', { params: {} });
  });

  it('debería llamar a apiClient.get con el parámetro de búsqueda correcto si se provee searchTerm', async () => {
    const searchTerm = 'Ana';
    vi.mocked(apiClient.get).mockResolvedValue({ data: [mockPatients[0]] });

    await fetchPatients(searchTerm);

    expect(apiClient.get).toHaveBeenCalledOnce();
    expect(apiClient.get).toHaveBeenCalledWith('/patients', { params: { search: searchTerm } });
  });

  it('debería devolver los datos de los pacientes en una respuesta exitosa', async () => {
    vi.mocked(apiClient.get).mockResolvedValue({ data: mockPatients });

    const result = await fetchPatients();

    expect(result).toEqual(mockPatients);
  });

  it('debería lanzar un error si la llamada a la API falla (AxiosError)', async () => {
    const errorMessage = 'Error de API simulado';
    // Crear un mock de AxiosError más robusto
    const mockErrorResponse = {
      data: { message: errorMessage },
      status: 500,
      statusText: 'Internal Server Error',
      headers: {},
      config: {} as InternalAxiosRequestConfig, // Usar InternalAxiosRequestConfig o AxiosRequestConfig
    };
    const mockAxiosError: AxiosError<{ message?: string }> = {
      isAxiosError: true,
      response: mockErrorResponse,
      name: 'AxiosError',
      message: 'Request failed with status code 500',
      config: {} as InternalAxiosRequestConfig, // Usar InternalAxiosRequestConfig o AxiosRequestConfig
      code: 'ERR_BAD_RESPONSE',
      toJSON: () => ({}),
      // Simular request si es necesario por tu versión de Axios o lógica de errores
      // request: {} 
    };
    vi.mocked(apiClient.get).mockRejectedValue(mockAxiosError);

    await expect(fetchPatients()).rejects.toThrow(errorMessage);
  });

  it('debería lanzar un error genérico si la llamada a la API falla (Error no Axios)', async () => {
    const genericError = new Error('Error de red genérico');
    vi.mocked(apiClient.get).mockRejectedValue(genericError);

    // En patientService, el error no-Axios se convierte a uno genérico.
    await expect(fetchPatients()).rejects.toThrow('Error de red o problema al conectar con el servidor al obtener pacientes.');
  });

  it('debería manejar términos de búsqueda con espacios correctamente (trim)', async () => {
    const searchTermWithSpaces = '  Luis  ';
    const trimmedSearchTerm = 'Luis';
    vi.mocked(apiClient.get).mockResolvedValue({ data: [mockPatients[1]] });

    await fetchPatients(searchTermWithSpaces);

    expect(apiClient.get).toHaveBeenCalledWith('/patients', { params: { search: trimmedSearchTerm } });
  });
}); 