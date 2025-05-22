import { describe, it, expect, beforeEach, vi } from 'vitest';
import { listPatients } from './patient.controller'; // Ajusta la ruta si es necesario
import * as patientService from '../../services/patient.service'; // Para mockear el servicio
import { AuthenticatedRequest } from '../../middleware/auth.middleware'; // Para tipar req
import { Response, NextFunction } from 'express';
import { mockDeep, DeepMockProxy } from 'vitest-mock-extended'; // Para mocks de req/res si se prefiere

// Mockear completamente el módulo patient.service
vi.mock('../../services/patient.service', () => ({
  getPatientsForProfessional: vi.fn(), // Mockeamos la función específica que usa listPatients
}));

// Tipos para los mocks de Express
// type MockRequest = Partial<AuthenticatedRequest>; // Si usamos mocks parciales manuales
// type MockResponse = Partial<Response> & { // Si usamos mocks parciales manuales
//   status: vi.외부Fn<[number], MockResponse>;
//   json: vi.외부Fn<[any], MockResponse>;
// }; 

// Usaremos mockDeep para req, res para mayor facilidad y tipado
type MockRequest = DeepMockProxy<AuthenticatedRequest>;
type MockResponse = DeepMockProxy<Response>;
// No necesitamos un tipo MockNextFunction complejo si usamos vi.fn() y dejamos que se infiera o usamos un tipo funcional

describe('PatientController - listPatients', () => {
  let mockReq: MockRequest;
  let mockRes: MockResponse;
  let mockNext: NextFunction; // Tipar como NextFunction, la asignación será un mock

  beforeEach(() => {
    vi.resetAllMocks();
    
    mockReq = mockDeep<AuthenticatedRequest>();
    mockRes = mockDeep<Response>();
    // Asignar vi.fn() a mockNext. TypeScript debería permitir esto si NextFunction es un tipo de función.
    // El resultado de vi.fn() es compatible con ser llamado como NextFunction, y tiene propiedades de mock.
    mockNext = vi.fn() as unknown as NextFunction; // Usar un cast si es necesario para la asignación inicial
                                                 // pero para las aserciones, lo castearemos de nuevo a un mock. 

    mockRes.status.mockImplementation((statusCode: number) => {
        mockRes.statusCode = statusCode;
        return mockRes;
    });
  });

  it('should return 200 and a list of patients for a valid professional', async () => {
    const professionalId = 1;
    const mockPatientDataFromService: any[] = [
      {
        id: 1, firstName: 'Test', lastName: 'User', email: 'test@example.com', professionalId: 1, 
        phone: null, birthDate: new Date(), gender: null, height: null, 
        medicalNotes: null, dietRestrictions: null, objectives: null,
        createdAt: new Date(), updatedAt: new Date()
      }, 
      {
        id: 2, firstName: 'Another', lastName: 'User', email: 'another@example.com', professionalId: 1, 
        phone: null, birthDate: new Date(), gender: null, height: null, 
        medicalNotes: null, dietRestrictions: null, objectives: null,
        createdAt: new Date(), updatedAt: new Date()
      }
    ];
    
    mockReq.professional = { professionalId: professionalId, email: 'test@pro.com' }; 
    mockReq.query = {};

    vi.mocked(patientService.getPatientsForProfessional).mockResolvedValue(mockPatientDataFromService);

    await listPatients(mockReq, mockRes, mockNext);

    expect(patientService.getPatientsForProfessional).toHaveBeenCalledWith(professionalId, undefined);
    expect(mockRes.status).toHaveBeenCalledWith(200);
    expect(mockRes.json).toHaveBeenCalledWith(mockPatientDataFromService);
    // Al hacer la aserción, castear mockNext a un tipo de mock conocido por Vitest/Jest
    expect(vi.mocked(mockNext)).not.toHaveBeenCalled(); 
  });

  it('should return 200 and a filtered list when searchQuery is provided', async () => {
    const professionalId = 1;
    const searchQuery = 'Test';
    const mockFilteredPatients: any[] = [
      {
        id: 1, firstName: 'Test', lastName: 'User', email: 'test@example.com', professionalId: 1,
        phone: null, birthDate: new Date(), gender: null, height: null,
        medicalNotes: null, dietRestrictions: null, objectives: null,
        createdAt: new Date(), updatedAt: new Date()
      }
    ];

    mockReq.professional = { professionalId: professionalId, email: 'test@pro.com' };
    mockReq.query = { search: searchQuery }; // Añadir searchQuery a req.query

    vi.mocked(patientService.getPatientsForProfessional).mockResolvedValue(mockFilteredPatients);

    await listPatients(mockReq, mockRes, mockNext);

    expect(patientService.getPatientsForProfessional).toHaveBeenCalledWith(professionalId, searchQuery);
    expect(mockRes.status).toHaveBeenCalledWith(200);
    expect(mockRes.json).toHaveBeenCalledWith(mockFilteredPatients);
    expect(vi.mocked(mockNext)).not.toHaveBeenCalled();
  });

  it('should return 403 if professional info is not found in token', async () => {
    // Simular que req.professional no está definido o no tiene professionalId
    // Opción 1: mockReq.professional = undefined;
    // Opción 2: mockReq.professional = { email: 'test@pro.com' }; // Sin professionalId
    mockReq.professional = undefined; 
    mockReq.query = {};

    // No necesitamos mockear el servicio porque el controlador debería retornar antes

    await listPatients(mockReq, mockRes, mockNext);

    expect(patientService.getPatientsForProfessional).not.toHaveBeenCalled(); // El servicio no debe ser llamado
    expect(mockRes.status).toHaveBeenCalledWith(403);
    expect(mockRes.json).toHaveBeenCalledWith({ message: 'Acceso denegado: Información del profesional no encontrada en el token.' });
    expect(vi.mocked(mockNext)).not.toHaveBeenCalled();
  });

  it('should call next with error if patientService throws an error', async () => {
    const professionalId = 1;
    const errorMessage = 'Database error';
    const error = new Error(errorMessage);

    mockReq.professional = { professionalId: professionalId, email: 'test@pro.com' };
    mockReq.query = {};

    // Configurar mock del servicio para que lance un error
    vi.mocked(patientService.getPatientsForProfessional).mockRejectedValue(error);

    await listPatients(mockReq, mockRes, mockNext);

    expect(patientService.getPatientsForProfessional).toHaveBeenCalledWith(professionalId, undefined);
    // Verificar que res.status o res.json no fueron llamados directamente por este controlador
    expect(mockRes.status).not.toHaveBeenCalled();
    expect(mockRes.json).not.toHaveBeenCalled();
    // Verificar que next fue llamado con el error
    expect(vi.mocked(mockNext)).toHaveBeenCalledOnce();
    expect(vi.mocked(mockNext)).toHaveBeenCalledWith(error);
  });
}); 