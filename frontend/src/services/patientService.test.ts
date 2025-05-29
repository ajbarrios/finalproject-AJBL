import { describe, it, expect, vi, beforeEach, type Mock, type Mocked } from 'vitest';
// import apiClient from './authService'; // Usaremos esto para mockear sus métodos
// import { fetchPatients, fetchPatientById, createPatient, updatePatient } from '../services/patientService'; // Importar funciones directamente
import type { Patient } from '../types/patient';
import type { NewPatientData } from '../types/patient'; // Importar tipo para datos de creación
// Eliminamos AxiosRequestConfig si no se usa, mantenemos InternalAxiosRequestConfig si es la que se usa.
import type { AxiosError, InternalAxiosRequestConfig } from 'axios';

// Mockear el apiClient importado de ./api
vi.mock('./api', () => {
  const mockApiClient = {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    // Si api en ./api tiene otras propiedades o métodos necesarios, añadirlos aquí
    // Por ejemplo, si `api` es una instancia completa de Axios, podría tener interceptors, defaults, etc.
    // Para este mock simple, solo necesitamos los métodos HTTP que se usan en patientService.
  };
  return {
    __esModule: true, // Indica que es un módulo ES
    default: mockApiClient, // Mockea la exportación por defecto
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
  // Importar dinámicamente la función después de configurar el mock
  let fetchPatients: typeof import('../services/patientService').fetchPatients;
   // Obtener una referencia al mock de apiClient
  let mockApiClient: Mocked<typeof import('./api').default>;

  const mockPatients: Patient[] = [
    { 
      id: '1', 
      firstName: 'Ana', 
      lastName: 'Gomez', 
      email: 'ana@example.com', 
      professionalId: 'prof1', 
      createdAt: new Date().toISOString(), 
      updatedAt: new Date().toISOString(),
      birthDate: null, 
      gender: null,
      height: null, 
      medicalNotes: null,
      dietRestrictions: null,
      objectives: null,
      lastBiometricRecord: null, 
      dietPlansSummary: [], 
      workoutPlansSummary: [], 
    },
    { 
      id: '2', 
      firstName: 'Luis', 
      lastName: 'Perez', 
      email: 'luis@example.com', 
      professionalId: 'prof1', 
      createdAt: new Date().toISOString(), 
      updatedAt: new Date().toISOString(),
      birthDate: null, 
      gender: null,
      height: null, 
      medicalNotes: null,
      dietRestrictions: null,
      objectives: null,
      lastBiometricRecord: null, 
      dietPlansSummary: [], 
      workoutPlansSummary: [], 
    },
  ];

  beforeEach(async () => {
    // Importar dinámicamente el módulo mockeado
    const api = await import('./api');
    mockApiClient = api.default as Mocked<typeof import('./api').default>;

    // Resetear el mock de apiClient.get antes de cada prueba usando la referencia al mock
    mockApiClient.get.mockReset();

     // Importar dinámicamente la función del servicio aquí
    const patientService = await import('../services/patientService');
    fetchPatients = patientService.fetchPatients;
  });

  it('debería llamar a apiClient.get sin parámetros de búsqueda si no se provee searchTerm', async () => {
    vi.mocked(mockApiClient.get).mockResolvedValue({ data: mockPatients });

    await fetchPatients();

    expect(mockApiClient.get).toHaveBeenCalledOnce();
    expect(mockApiClient.get).toHaveBeenCalledWith('http://localhost:3000/api/patients', { params: {} });
  });

  it('debería llamar a apiClient.get con el parámetro de búsqueda correcto si se provee searchTerm', async () => {
    const searchTerm = 'Ana';
    vi.mocked(mockApiClient.get).mockResolvedValue({ data: [mockPatients[0]] });

    await fetchPatients(searchTerm);

    expect(mockApiClient.get).toHaveBeenCalledOnce();
    expect(mockApiClient.get).toHaveBeenCalledWith('http://localhost:3000/api/patients', { params: { search: searchTerm } });
  });

  it('debería devolver los datos de los pacientes en una respuesta exitosa', async () => {
    vi.mocked(mockApiClient.get).mockResolvedValue({ data: mockPatients });

    const result = await fetchPatients();

    expect(result).toEqual(mockPatients);
  });

  it('debería lanzar un error si la llamada a la API falla (AxiosError)', async () => {
    const errorMessage = 'Error de API simulado';
    // Configurar el mock de apiClient.get para rechazar con un mock de AxiosError
    const mockAxiosError: AxiosError<{ message?: string }> = {
      isAxiosError: true,
      response: {
        data: { message: errorMessage },
        status: 500,
        statusText: 'Internal Server Error',
        headers: {},
        config: {} as InternalAxiosRequestConfig,
      },
      name: 'AxiosError',
      message: 'Request failed with status code 500',
      config: {} as InternalAxiosRequestConfig,
      code: 'ERR_BAD_RESPONSE',
      toJSON: () => ({}),
    };
    vi.mocked(mockApiClient.get as Mock).mockRejectedValue(mockAxiosError);

    await expect(fetchPatients()).rejects.toThrow();
  });

  it('debería lanzar un error genérico si la llamada a la API falla (Error no Axios)', async () => {
    const genericError = new Error('Error de red genérico');
    // Configurar el mock de apiClient.get para rechazar con un error genérico
    vi.mocked(mockApiClient.get as Mock).mockRejectedValue(genericError);

    await expect(fetchPatients()).rejects.toThrow();
  });

  it('debería manejar términos de búsqueda con espacios correctamente (sin trim)', async () => {
    const searchTermWithSpaces = '  Luis  ';
    vi.mocked(mockApiClient.get).mockResolvedValue({ data: [mockPatients[1]] });

    await fetchPatients(searchTermWithSpaces);

    expect(mockApiClient.get).toHaveBeenCalledWith('http://localhost:3000/api/patients', { params: { search: searchTermWithSpaces } });
  });
});

describe('patientService - fetchPatientById', () => {
  // Importar dinámicamente la función después de configurar el mock
  let fetchPatientById: typeof import('../services/patientService').fetchPatientById;
    // Obtener una referencia al mock de apiClient
  let mockApiClient: Mocked<typeof import('./api').default>;

  const mockPatientDetails = {
    id: '1',
    firstName: 'Ana',
    lastName: 'Gomez',
    email: 'ana@example.com',
    professionalId: 'prof1',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    birthDate: null, 
    gender: null,
    height: 165,
    medicalNotes: null,
    dietRestrictions: null,
    objectives: null,
    lastBiometricRecord: {
      id: 'rec1',
      patientId: '1',
      weight: 65,
      height: 165,
      recordDate: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    dietPlansSummary: [
      { id: 'diet1', title: 'Plan Keto', isActive: true, startDate: new Date().toISOString(), endDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString() },
    ],
    workoutPlansSummary: [
      { id: 'workout1', title: 'Rutina Gimnasio', isActive: true, startDate: new Date().toISOString(), endDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString() },
    ],
  };

  beforeEach(async () => {
     // Importar dinámicamente el módulo mockeado
    const api = await import('./api');
    mockApiClient = api.default as Mocked<typeof import('./api').default>;

    // Resetear el mock de apiClient.get antes de cada prueba usando la referencia al mock
    mockApiClient.get.mockReset();

     // Importar dinámicamente la función aquí
    const patientService = await import('../services/patientService');
    fetchPatientById = patientService.fetchPatientById;
  });

  it('debería llamar a apiClient.get con el ID de paciente correcto', async () => {
    const patientId = '1';
    // Mockear la función del servicio directamente
    vi.mocked(mockApiClient.get).mockResolvedValue({ data: mockPatientDetails });

    await fetchPatientById(patientId);

    // Verificar que apiClient.get fue llamado con la URL completa correcta
    expect(mockApiClient.get).toHaveBeenCalledTimes(1);
    expect(mockApiClient.get).toHaveBeenCalledWith(`http://localhost:3000/api/patients/${patientId}`);
  });

  it('debería devolver los datos del paciente en una respuesta exitosa', async () => {
    const patientId = '1';
    // Mockear la función del servicio directamente para resolver con datos
    vi.mocked(mockApiClient.get).mockResolvedValue({ data: mockPatientDetails });

    const result = await fetchPatientById(patientId);

    // Verificar que la función mockeada devolvió los datos correctos
    expect(result).toEqual(mockPatientDetails); // Ahora verificamos el resultado de la llamada real al servicio
  });

  it('debería lanzar un error si la llamada a la API falla (AxiosError)', async () => {
    const patientId = '1';
    const errorMessage = 'Paciente no encontrado';
    // Configurar el mock de apiClient.get para rechazar con un mock de AxiosError
    const mockAxiosError: AxiosError<{ message?: string }> = {
      isAxiosError: true,
      response: {
        data: { message: errorMessage },
        status: 404,
        statusText: 'Not Found',
        headers: {},
        config: {} as InternalAxiosRequestConfig,
      },
      name: 'AxiosError',
      message: 'Request failed with status code 404',
      config: {} as InternalAxiosRequestConfig,
      code: 'ERR_BAD_RESPONSE',
      toJSON: () => ({}),
    };
    vi.mocked(mockApiClient.get as Mock).mockRejectedValue(mockAxiosError);

    await expect(fetchPatientById(patientId)).rejects.toThrow();
  });

  it('debería lanzar un error genérico si la llamada a la API falla (Error no Axios)', async () => {
    const patientId = '1';
    const genericError = new Error('Error de red genérico');
    // Configurar el mock de apiClient.get para rechazar con un error genérico
    vi.mocked(mockApiClient.get as Mock).mockRejectedValue(genericError);

    await expect(fetchPatientById(patientId)).rejects.toThrow();
  });
});

describe('patientService - createPatient', () => {
  // Importar dinámicamente la función después de configurar el mock
  let createPatient: typeof import('../services/patientService').createPatient;
    // Obtener una referencia al mock de apiClient
  let mockApiClient: Mocked<typeof import('./api').default>;

  const mockPatientData: NewPatientData = {
    firstName: 'Nuevo',
    lastName: 'Paciente',
    email: 'nuevo.paciente@example.com',
    phone: '+34123456789',
    birthDate: new Date('1990-01-15'),
    gender: 'Prefiero no especificar',
    height: 170.5,
    medicalNotes: 'Historial de alergias leves.',
    dietRestrictions: 'Ninguna',
    objectives: 'Mejorar composición corporal',
    initialBiometrics: {
      recordDate: new Date('2023-11-20'),
      weight: 75.2,
      bodyFatPercentage: 20.1,
      musclePercentage: 35.5,
      waterPercentage: 50.3,
      waistDiameter: 85.0,
      notes: 'Medición inicial.',
    },
  };

  const mockCreatedPatient = {
    id: 'patient-123', // ID simulado
    professionalId: 'prof-abc', // ID profesional simulado
    ...mockPatientData,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  beforeEach(async () => {
     // Importar dinámicamente el módulo mockeado
    const api = await import('./api');
    mockApiClient = api.default as Mocked<typeof import('./api').default>;

    // Resetear el mock de apiClient.post antes de cada prueba usando la referencia al mock
    mockApiClient.post.mockReset();

     // Importar dinámicamente la función aquí
    const patientService = await import('../services/patientService');
    createPatient = patientService.createPatient;
  });

  it('debería llamar a apiClient.post con los datos correctos y devolver el paciente creado', async () => {
    // Configurar el mock de apiClient.post para resolver con el paciente creado
    vi.mocked(mockApiClient.post as Mock).mockResolvedValue({ data: mockCreatedPatient });

    // Llamar a la función del servicio
    const result = await createPatient(mockPatientData);

    // Aserciones con URL completa
    expect(mockApiClient.post).toHaveBeenCalledOnce();
    expect(mockApiClient.post).toHaveBeenCalledWith('http://localhost:3000/api/patients', mockPatientData);
    expect(result).toEqual(mockCreatedPatient);
  });

  it('debería lanzar un error si la llamada a la API falla (AxiosError)', async () => {
    const errorMessage = 'Error de creación simulado';
    // Configurar el mock de apiClient.post para rechazar con un mock de AxiosError
    const mockAxiosError: AxiosError<{ message?: string }> = {
      isAxiosError: true,
      response: {
        data: { message: errorMessage },
        status: 400,
        statusText: 'Bad Request',
        headers: {},
        config: {} as InternalAxiosRequestConfig,
      },
      name: 'AxiosError',
      message: 'Request failed with status code 400',
      config: {} as InternalAxiosRequestConfig,
      code: 'ERR_BAD_REQUEST',
      toJSON: () => ({}),
    };
    vi.mocked(mockApiClient.post as Mock).mockRejectedValue(mockAxiosError);

    // Verificar que la función lanza un error
    await expect(createPatient(mockPatientData)).rejects.toThrow();
  });

  it('debería lanzar un error genérico si la llamada a la API falla (Error no Axios)', async () => {
    const genericError = new Error('Error de red genérico');
    // Configurar el mock de apiClient.post para rechazar con un error genérico
    vi.mocked(mockApiClient.post as Mock).mockRejectedValue(genericError);

    // Verificar que la función lanza un error
    await expect(createPatient(mockPatientData)).rejects.toThrow();
  });
});

describe('patientService - updatePatient', () => {
  // Importar dinámicamente la función después de configurar el mock
  let updatePatient: typeof import('../services/patientService').updatePatient;
    // Obtener una referencia al mock de apiClient
  let mockApiClient: Mocked<typeof import('./api').default>;

  const patientId = 'patient-to-update-123';
  const updateData = {
    firstName: 'Paciente Actualizado',
    phone: '+34987654321',
  };
  const mockUpdatedPatient = {
    id: patientId,
    firstName: 'Paciente Actualizado',
    lastName: 'Original', 
    email: 'original@example.com',
    phone: '+34987654321', 
    professionalId: 'prof-abc',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    // Añadir campos opcionales/nullable con valores para satisfacer el tipo Patient
    birthDate: null, 
    gender: null,
    height: null, 
    medicalNotes: null,
    dietRestrictions: null,
    objectives: null,
    lastBiometricRecord: null, // Asumiendo que también es opcional/nullable
    dietPlansSummary: [], // Asumiendo que es un array potencialmente vacío
    workoutPlansSummary: [], // Asumiendo que es un array potencialmente vacío
  };

  beforeEach(async () => {
     // Importar dinámicamente el módulo mockeado
    const api = await import('./api');
    mockApiClient = api.default as Mocked<typeof import('./api').default>;

    // Resetear el mock de apiClient.put antes de cada prueba usando la referencia al mock
    mockApiClient.put.mockReset();

     // Importar dinámicamente la función aquí
    const patientService = await import('../services/patientService');
    updatePatient = patientService.updatePatient;
  });

  it('debería llamar a apiClient.put con el ID y los datos de actualización correctos', async () => {
    vi.mocked(mockApiClient.put as Mock).mockResolvedValue({ data: mockUpdatedPatient });

    await updatePatient(patientId, updateData);

    expect(mockApiClient.put).toHaveBeenCalledOnce();
    expect(mockApiClient.put).toHaveBeenCalledWith(`http://localhost:3000/api/patients/${patientId}`, updateData);
  });

  it('debería devolver los datos del paciente actualizado en una respuesta exitosa', async () => {
    vi.mocked(mockApiClient.put as Mock).mockResolvedValue({ data: mockUpdatedPatient });

    const result = await updatePatient(patientId, updateData);

    expect(result).toEqual(mockUpdatedPatient);
  });

  it('debería lanzar un error si la llamada a la API falla (AxiosError)', async () => {
    const errorMessage = 'Error de actualización simulado';
    const mockAxiosError: AxiosError<{ message?: string }> = {
      isAxiosError: true,
      response: {
        data: { message: errorMessage },
        status: 400,
        statusText: 'Bad Request',
        headers: {},
        config: {} as InternalAxiosRequestConfig,
      },
      name: 'AxiosError',
      message: 'Request failed with status code 400',
      config: {} as InternalAxiosRequestConfig,
      code: 'ERR_BAD_REQUEST',
      toJSON: () => ({}),
    };
    vi.mocked(mockApiClient.put as Mock).mockRejectedValue(mockAxiosError);

    await expect(updatePatient(patientId, updateData)).rejects.toThrow();
  });

  it('debería lanzar un error genérico si la llamada a la API falla (Error no Axios)', async () => {
    const genericError = new Error('Error de red genérico durante actualización');
    vi.mocked(mockApiClient.put as Mock).mockRejectedValue(genericError);

    await expect(updatePatient(patientId, updateData)).rejects.toThrow();
  });
}); 