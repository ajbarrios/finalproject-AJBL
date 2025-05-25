import { Response, NextFunction } from 'express';
import { getPatientById } from '../../../../src/api/controllers/patient.controller';
import { AuthenticatedRequest } from '../../../../src/middleware/auth.middleware';
import * as patientService from '../../../../src/services/patient.service';
// import { mockRequest, mockResponse } from 'express-mock-req-res'; // Eliminamos la importación de la librería no encontrada

// Mockear completamente el módulo del servicio de pacientes
vi.mock('../../../../src/services/patient.service');

describe('Patient Controller', () => {
  // Castear el servicio mockeado para usar sus métodos
  const mockPatientService = patientService as any; // Usar 'any' temporalmente si no tenemos tipos mockeados complejos

  let mockReq: Partial<AuthenticatedRequest>; // Usar Partial para mocks manuales
  let mockRes: Partial<Response>;
  let mockNext: NextFunction;

  beforeEach(() => {
    // Resetear los mocks antes de cada prueba (usando función de Vitest para mocks de módulos)
    vi.clearAllMocks(); // Limpia el historial de llamadas de todos los mocks
    // Si necesitaras resetear las implementaciones mockeadas a sus valores por defecto, podrías usar vi.resetAllMocks();
    
    // Crear nuevos mocks manuales para req, res, next
    mockReq = {
      params: {}, // Inicializar params
      professional: { professionalId: 1, email: 'pro@example.com' }, // Configurar payload profesional por defecto
      // Añadir otras propiedades de Request que puedan ser necesarias (ej. body, query) como vi.fn() o valores iniciales
    };

    mockRes = {
      status: vi.fn().mockReturnThis(), // Mockear status y encadenarlo para permitir .json()
      json: vi.fn(), // Mockear json
      // Añadir otras propiedades de Response que puedan ser necesarias (ej. send, locals)
    };

    mockNext = vi.fn(); // Un mock simple para next function
  });

  describe('getPatientById', () => {
    it('should return patient details if found and belongs to the professional', async () => {
      // Configurar el request con un patientId válido
      mockReq.params = { patientId: '123' };

      // Mockear la respuesta del servicio para un caso exitoso
      const mockPatientDetails = {
        id: 123,
        firstName: 'John',
        lastName: 'Doe',
        professionalId: 1,
        lastBiometricRecord: { id: 1, weight: 75, recordDate: new Date() },
        dietPlansSummary: [{ id: 101, title: 'Plan A', isActive: true }],
        workoutPlansSummary: [{ id: 201, title: 'Plan X', isActive: false }],
        // ... otros campos del paciente ...
      };
      mockPatientService.getPatientDetailsForProfessional.mockResolvedValueOnce(mockPatientDetails);

      // Llamar a la función controladora
      await getPatientById(mockReq as AuthenticatedRequest, mockRes as Response, mockNext);

      // Aserciones
      expect(mockPatientService.getPatientDetailsForProfessional).toHaveBeenCalledWith(
        mockReq.professional.professionalId,
        123 // Verificar que el patientId se parseó correctamente
      );
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(mockPatientDetails);
      expect(mockNext).not.toHaveBeenCalled(); // Asegurar que next no fue llamado en caso de éxito
    });

    it('should return 404 if patient is not found or does not belong to the professional', async () => {
        // Configurar el request con un patientId
        mockReq.params = { patientId: '456' };
  
        // Mockear el servicio para que retorne null (paciente no encontrado o no pertenece)
        mockPatientService.getPatientDetailsForProfessional.mockResolvedValueOnce(null);
  
        // Llamar a la función controladora
        await getPatientById(mockReq as AuthenticatedRequest, mockRes as Response, mockNext);
  
        // Aserciones
        expect(mockPatientService.getPatientDetailsForProfessional).toHaveBeenCalledWith(
          mockReq.professional.professionalId,
          456
        );
        expect(mockRes.status).toHaveBeenCalledWith(404);
        expect(mockRes.json).toHaveBeenCalledWith({ message: 'Paciente no encontrado o no tiene permiso para verlo.' });
        expect(mockNext).not.toHaveBeenCalled(); // No se llama next en caso de error controlado
      });

      it('should return 400 if patientId is invalid', async () => {
        // Configurar el request con un patientId no numérico
        mockReq.params = { patientId: 'abc' };
  
        // Llamar a la función controladora
        await getPatientById(mockReq as AuthenticatedRequest, mockRes as Response, mockNext);
  
        // Aserciones
        expect(mockPatientService.getPatientDetailsForProfessional).not.toHaveBeenCalled(); // El servicio no debería ser llamado
        expect(mockRes.status).toHaveBeenCalledWith(400);
        expect(mockRes.json).toHaveBeenCalledWith({ message: 'ID de paciente no válido.' });
        expect(mockNext).not.toHaveBeenCalled(); // No se llama next en caso de error de validación
      });

      it('should call next with error if service throws an error', async () => {
        // Configurar el request con un patientId válido
        mockReq.params = { patientId: '789' };
  
        // Mockear el servicio para que lance un error
        const serviceError = new Error('Database connection failed');
        mockPatientService.getPatientDetailsForProfessional.mockRejectedValueOnce(serviceError);
  
        // Llamar a la función controladora
        await getPatientById(mockReq as AuthenticatedRequest, mockRes as Response, mockNext);
  
        // Aserciones
        expect(mockPatientService.getPatientDetailsForProfessional).toHaveBeenCalledWith(
          mockReq.professional.professionalId,
          789
        );
        expect(mockRes.status).not.toHaveBeenCalled(); // status no debería ser llamado antes de next(error)
        expect(mockRes.json).not.toHaveBeenCalled(); // json no debería ser llamado antes de next(error)
        expect(mockNext).toHaveBeenCalledWith(serviceError); // Asegurar que el error se pasa a next
      });

  });

  // Aquí se añadirán describe blocks para otras funciones del controlador (listPatients, createPatient, etc.)
}); 