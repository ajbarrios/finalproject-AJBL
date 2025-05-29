import { describe, it, expect, beforeEach, vi } from 'vitest';
import { listPatients, getPatientById, createPatient, updatePatient, createBiometricRecord } from '../../../../src/api/controllers/patient.controller'; // Importamos todas las funciones necesarias
import { AuthenticatedRequest } from '../../../../src/middleware/auth.middleware'; // Para tipar req
import * as patientService from '../../../../src/services/patient.service'; // Para mockear el servicio
import { Response, NextFunction } from 'express'; // Tipos de Express
import { mockDeep, DeepMockProxy } from 'vitest-mock-extended'; // Para mocks de req/res con tipado

// Mockear completamente el módulo patient.service
vi.mock('../../../../src/services/patient.service');

// Tipos para los mocks de Express con mockDeep
type MockRequest = DeepMockProxy<AuthenticatedRequest>;
type MockResponse = DeepMockProxy<Response>;

// El tipo para next no necesita DeepMockProxy si solo usamos vi.fn()
// type MockNextFunction = vi.Mock;

describe('Patient Controller', () => {
  // Castear el servicio mockeado para usar sus métodos tipados por vi.mocked
  // No necesitamos 'as any' aquí si usamos vi.mocked en cada llamada de mock

  let mockReq: MockRequest;
  let mockRes: MockResponse;
  let mockNext: NextFunction; // Usaremos un mock simple vi.fn() compatible con NextFunction

  beforeEach(() => {
    // Resetear los mocks antes de cada prueba
    vi.clearAllMocks(); // Limpia el historial de llamadas de todos los mocks
    // Si necesitaras resetear las implementaciones mockeadas a sus valores por defecto, podrías usar vi.resetAllMocks();
    
    // Crear mocks usando mockDeep para req y res
    mockReq = mockDeep<AuthenticatedRequest>();
    mockRes = mockDeep<Response>();
    // Asignar vi.fn() a mockNext. Cast a unknown as NextFunction si TypeScript se queja
    mockNext = vi.fn() as unknown as NextFunction; 

    // Implementar el mock de res.status para encadenarlo con .json()
    mockRes.status.mockImplementation((statusCode: number) => {
        // Opcional: puedes guardar statusCode si necesitas aserción sobre él en la respuesta mockeada
        // mockRes.statusCode = statusCode; 
        return mockRes; // Permite encadenamiento como res.status(200).json(...)
    });
  });

  // Tests for listPatients (brought from the other file)
  describe('listPatients', () => {
    it('should return 200 and a list of patients for a valid professional', async () => {
      const professionalId = 1;
      const mockPatientDataFromService: any[] = [ // Usar any[] si la estructura exacta no está tipada
        { id: 1, firstName: 'Test', lastName: 'User', professionalId: 1 }, 
        { id: 2, firstName: 'Another', lastName: 'User', professionalId: 1 }
      ];
      
      mockReq.professional = { professionalId: professionalId, email: 'test@pro.com' }; 
      mockReq.query = {};

      vi.mocked(patientService.getPatientsForProfessional).mockResolvedValue(mockPatientDataFromService);

      await listPatients(mockReq, mockRes, mockNext);

      expect(vi.mocked(patientService.getPatientsForProfessional)).toHaveBeenCalledWith(professionalId, undefined);
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(mockPatientDataFromService);
      expect(vi.mocked(mockNext)).not.toHaveBeenCalled(); 
    });

    it('should return 200 and a filtered list when searchQuery is provided', async () => {
      const professionalId = 1;
      const searchQuery = 'Test';
      const mockFilteredPatients: any[] = [ // Usar any[] si la estructura exacta no está tipada
        { id: 1, firstName: 'Test', lastName: 'User', professionalId: 1 }
      ];

      mockReq.professional = { professionalId: professionalId, email: 'test@pro.com' };
      mockReq.query = { search: searchQuery }; 

      vi.mocked(patientService.getPatientsForProfessional).mockResolvedValue(mockFilteredPatients);

      await listPatients(mockReq, mockRes, mockNext);

      expect(vi.mocked(patientService.getPatientsForProfessional)).toHaveBeenCalledWith(professionalId, searchQuery);
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(mockFilteredPatients);
      expect(vi.mocked(mockNext)).not.toHaveBeenCalled();
    });

    it('should return 403 if professional info is not found in token', async () => {
      mockReq.professional = undefined; // Simular token inválido/ausente
      mockReq.query = {};

      await listPatients(mockReq, mockRes, mockNext);

      expect(vi.mocked(patientService.getPatientsForProfessional)).not.toHaveBeenCalled(); 
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

      vi.mocked(patientService.getPatientsForProfessional).mockRejectedValue(error);

      await listPatients(mockReq, mockRes, mockNext);

      expect(vi.mocked(patientService.getPatientsForProfessional)).toHaveBeenCalledWith(professionalId, undefined);
      expect(mockRes.status).not.toHaveBeenCalled(); // next fue llamado antes
      expect(mockRes.json).not.toHaveBeenCalled(); // next fue llamado antes
      expect(vi.mocked(mockNext)).toHaveBeenCalledOnce();
      expect(vi.mocked(mockNext)).toHaveBeenCalledWith(error);
    });
  });

  // Tests for getPatientById
  describe('getPatientById', () => {
    it('should return patient details if found and belongs to the professional', async () => {
      // Configurar el request con un patientId válido
      mockReq.params.patientId = '123';

      // Mockear la respuesta del servicio para un caso exitoso
      const mockPatientDetails: any = { // Usar any si la estructura exacta no está tipada
        id: 123,
        firstName: 'John',
        lastName: 'Doe',
        professionalId: 1,
        lastBiometricRecord: { id: 1, weight: 75, recordDate: new Date() },
        dietPlansSummary: [{ id: 101, title: 'Plan A', isActive: true }],
        workoutPlansSummary: [{ id: 201, title: 'Plan X', isActive: false }],
        // ... otros campos del paciente ...
      };
      vi.mocked(patientService.getPatientDetailsForProfessional).mockResolvedValueOnce(mockPatientDetails);

      // Configurar payload profesional (viene del beforeEach)
      mockReq.professional = { professionalId: 1, email: 'pro@example.com' };

      // Llamar a la función controladora
      await getPatientById(mockReq, mockRes, mockNext);

      // Aserciones
      expect(vi.mocked(patientService.getPatientDetailsForProfessional)).toHaveBeenCalledWith(
        mockReq.professional.professionalId,
        123 // Verificar que el patientId se parseó correctamente
      );
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(mockPatientDetails);
      expect(vi.mocked(mockNext)).not.toHaveBeenCalled(); // Asegurar que next no fue llamado en caso de éxito
    });

    it('should return 404 if patient is not found or does not belong to the professional', async () => {
        // Configurar el request con un patientId
        mockReq.params.patientId = '456';
  
        // Mockear el servicio para que retorne null (paciente no encontrado o no pertenece)
        vi.mocked(patientService.getPatientDetailsForProfessional).mockResolvedValueOnce(null);
        
        // Configurar payload profesional (viene del beforeEach)
        mockReq.professional = { professionalId: 1, email: 'pro@example.com' };

        // Llamar a la función controladora
        await getPatientById(mockReq, mockRes, mockNext);
  
        // Aserciones
        expect(vi.mocked(patientService.getPatientDetailsForProfessional)).toHaveBeenCalledWith(
          mockReq.professional.professionalId,
          456
        );
        expect(mockRes.status).toHaveBeenCalledWith(404);
        expect(mockRes.json).toHaveBeenCalledWith({ message: 'Paciente no encontrado o no tiene permiso para verlo.' });
        expect(vi.mocked(mockNext)).not.toHaveBeenCalled(); // No se llama next en caso de error controlado
      });

      it('should return 400 if patientId is invalid', async () => {
        // Configurar el request con un patientId no numérico
        mockReq.params.patientId = 'abc';
        
        // Configurar payload profesional (viene del beforeEach)
        mockReq.professional = { professionalId: 1, email: 'pro@example.com' };
  
        // Llamar a la función controladora
        await getPatientById(mockReq, mockRes, mockNext);
  
        // Aserciones
        expect(vi.mocked(patientService.getPatientDetailsForProfessional)).not.toHaveBeenCalled(); // El servicio no debería ser llamado
        expect(mockRes.status).toHaveBeenCalledWith(400);
        expect(mockRes.json).toHaveBeenCalledWith({ message: 'ID de paciente no válido.' });
        expect(vi.mocked(mockNext)).not.toHaveBeenCalled(); // No se llama next en caso de error de validación
      });

      it('should call next with error if service throws an error', async () => {
        // Configurar el request con un patientId válido
        mockReq.params.patientId = '789';
        
        // Configurar payload profesional (viene del beforeEach)
        mockReq.professional = { professionalId: 1, email: 'pro@example.com' };
  
        // Mockear el servicio para que lance un error
        const serviceError = new Error('Database connection failed');
        vi.mocked(patientService.getPatientDetailsForProfessional).mockRejectedValueOnce(serviceError);
  
        // Llamar a la función controladora
        await getPatientById(mockReq, mockRes, mockNext);
  
        // Aserciones
        expect(vi.mocked(patientService.getPatientDetailsForProfessional)).toHaveBeenCalledWith(
          mockReq.professional.professionalId,
          789
        );
        expect(mockRes.status).not.toHaveBeenCalled(); // status no debería ser llamado antes de next(error)
        expect(mockRes.json).not.toHaveBeenCalled(); // json no debería ser llamado antes de next(error)
        expect(vi.mocked(mockNext)).toHaveBeenCalledWith(serviceError); // Asegurar que el error se pasa a next
      });
  });

  // Tests for updatePatient (brought from the other file, replacing the existing ones)
  describe('updatePatient', () => {
    beforeEach(() => {
      // Configuración común para cada test dentro de este describe (además del beforeEach principal)
      mockReq.params.patientId = '1';
      mockReq.body = {
        firstName: 'John Updated',
        lastName: 'Doe Updated',
        email: 'john.updated@example.com'
      };
    });
  
    it('debería actualizar un paciente exitosamente', async () => {
      const mockUpdatedPatient: any = { // Usar any si la estructura exacta no está tipada
        id: 1, 
        firstName: 'John Updated', 
        lastName: 'Doe Updated',
        email: 'john.updated@example.com'
      };
      
      vi.mocked(patientService.updatePatientForProfessional).mockResolvedValue(mockUpdatedPatient);
  
      await updatePatient(mockReq, mockRes, mockNext);
  
      expect(vi.mocked(patientService.updatePatientForProfessional)).toHaveBeenCalledWith(
        mockReq.professional.professionalId,
        1,
        expect.objectContaining({
          firstName: 'John Updated',
          lastName: 'Doe Updated',
          email: 'john.updated@example.com'
        })
      );
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(mockUpdatedPatient);
      expect(vi.mocked(mockNext)).not.toHaveBeenCalled();
    });
  
    it('debería retornar 404 cuando el paciente no se encuentra o no está autorizado', async () => {
      vi.mocked(patientService.updatePatientForProfessional).mockResolvedValue(null);
  
      await updatePatient(mockReq, mockRes, mockNext);
  
      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith(expect.objectContaining({
        message: expect.stringContaining('Paciente no encontrado o no tiene permiso')
      }));
      expect(vi.mocked(mockNext)).not.toHaveBeenCalled();
    });
  
    it('debería validar el formato del email', async () => {
      mockReq.body.email = 'invalid-email';
  
      await updatePatient(mockReq, mockRes, mockNext);
  
      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith(expect.objectContaining({
        message: expect.stringContaining('Formato de correo electrónico no válido')
      }));
      expect(vi.mocked(patientService.updatePatientForProfessional)).not.toHaveBeenCalled();
      expect(vi.mocked(mockNext)).not.toHaveBeenCalled();
    });
  
    it('debería validar el formato de fecha', async () => {
      mockReq.body.birthDate = 'invalid-date';
  
      await updatePatient(mockReq, mockRes, mockNext);
  
      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith(expect.objectContaining({
        message: expect.stringContaining('Formato de fecha de nacimiento no válido')
      }));
      expect(vi.mocked(patientService.updatePatientForProfessional)).not.toHaveBeenCalled();
      expect(vi.mocked(mockNext)).not.toHaveBeenCalled();
    });
  
    it('debería validar que la altura sea un número', async () => {
      mockReq.body.height = 'not-a-number' as any; // Cast a any para simular entrada incorrecta
  
      await updatePatient(mockReq, mockRes, mockNext);
  
      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith(expect.objectContaining({
        message: expect.stringContaining('Altura debe ser un número')
      }));
      expect(vi.mocked(patientService.updatePatientForProfessional)).not.toHaveBeenCalled();
      expect(vi.mocked(mockNext)).not.toHaveBeenCalled();
    });
  
    it('debería manejar un ID de paciente inválido', async () => {
      mockReq.params.patientId = 'abc';
  
      await updatePatient(mockReq, mockRes, mockNext);
  
      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith(expect.objectContaining({
        message: expect.stringContaining('ID de paciente no válido')
      }));
      expect(vi.mocked(patientService.updatePatientForProfessional)).not.toHaveBeenCalled();
      expect(vi.mocked(mockNext)).not.toHaveBeenCalled();
    });

    it('debería manejar la actualización de un campo a null', async () => {
        mockReq.body = {
            firstName: 'John', // Mantener nombre
            email: null // Establecer email a null
        };

        const mockUpdatedPatient: any = { // Usar any si la estructura exacta no está tipada
            id: 1, 
            firstName: 'John', 
            lastName: 'Doe Updated',
            email: null
          };
          
        vi.mocked(patientService.updatePatientForProfessional).mockResolvedValue(mockUpdatedPatient);

        await updatePatient(mockReq, mockRes, mockNext);

        expect(vi.mocked(patientService.updatePatientForProfessional)).toHaveBeenCalledWith(
            mockReq.professional.professionalId,
            1,
            expect.objectContaining({
                firstName: 'John',
                email: null
            }) // Verificar que se pasa null correctamente
        );
        expect(mockRes.status).toHaveBeenCalledWith(200);
        expect(mockRes.json).toHaveBeenCalledWith(mockUpdatedPatient);
        expect(vi.mocked(mockNext)).not.toHaveBeenCalled();
    });

    it('debería lanzar un error si Prisma arroja un error', async () => {
        const error = new Error('Prisma update error');
        vi.mocked(patientService.updatePatientForProfessional).mockRejectedValue(error);

        await updatePatient(mockReq, mockRes, mockNext);

        expect(vi.mocked(mockNext)).toHaveBeenCalledWith(error);
        expect(mockRes.status).not.toHaveBeenCalled();
        expect(mockRes.json).not.toHaveBeenCalled();
    });
  });

  // Tests for createBiometricRecord (TB-010) - Adapted for mockDeep
  describe('createBiometricRecord (TB-010)', () => {
    beforeEach(() => {
      // Configuración común para cada test dentro de este describe
      mockReq.params.patientId = '123'; // Default patientId
      mockReq.professional = { professionalId: 1, email: 'pro@example.com' }; // Default professionalPayload
      mockReq.body = {}; // Inicializar body
    });
  
    it('should create a biometric record successfully and return 201', async () => {
      const patientId = 123;
      const recordData = {
        recordDate: '2023-10-27',
        weight: 70.5,
        bodyFatPercentage: 18,
      };
      mockReq.body = recordData;
  
      // Mockear el servicio para que la verificación de propiedad sea exitosa
      vi.mocked(patientService.checkPatientOwnership).mockResolvedValueOnce(true);
  
      // Mockear el servicio para que la creación del registro sea exitosa
      const createdRecord: any = { id: 1, patientId, ...recordData, createdAt: new Date() };
      vi.mocked(patientService.createBiometricRecordForPatient).mockResolvedValueOnce(createdRecord);
  
      await createBiometricRecord(mockReq, mockRes, mockNext);
  
      expect(vi.mocked(patientService.checkPatientOwnership)).toHaveBeenCalledWith(
        mockReq.professional.professionalId,
        patientId
      );
      expect(vi.mocked(patientService.createBiometricRecordForPatient)).toHaveBeenCalledWith(
        patientId,
        { ...recordData, recordDate: new Date(recordData.recordDate) } // Verificar conversión de fecha
      );
      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.json).toHaveBeenCalledWith(createdRecord);
      expect(vi.mocked(mockNext)).not.toHaveBeenCalled();
    });
  
    it('should return 400 if patientId is invalid', async () => {
      mockReq.params.patientId = 'abc';
      mockReq.body = { recordDate: '2023-10-27', weight: 70.5 };
  
      await createBiometricRecord(mockReq, mockRes, mockNext);
  
      expect(vi.mocked(patientService.checkPatientOwnership)).not.toHaveBeenCalled();
      expect(vi.mocked(patientService.createBiometricRecordForPatient)).not.toHaveBeenCalled();
      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'ID de paciente no válido.' });
      expect(vi.mocked(mockNext)).not.toHaveBeenCalled();
    });
  
    it('should return 400 if recordDate is missing or invalid', async () => {
      mockReq.body = { weight: 70.5 }; // Missing recordDate
      await createBiometricRecord(mockReq, mockRes, mockNext);
      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'Fecha de registro (recordDate) es obligatoria y debe ser una fecha válida.' });
      
      // Reset mocks for the next part of the test
      vi.clearAllMocks(); // Limpiar mocks entre aserciones del mismo test
      mockRes.status.mockImplementation((statusCode: number) => { // Re-implementar mockStatus si es necesario
          return mockRes;
      });

      mockReq.params.patientId = '123'; // Restore valid patientId

      mockReq.body = { recordDate: 'invalid-date', weight: 70.5 }; // Invalid recordDate
      await createBiometricRecord(mockReq, mockRes, mockNext);
      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'Fecha de registro (recordDate) es obligatoria y debe ser una fecha válida.' });
      
      expect(vi.mocked(patientService.checkPatientOwnership)).not.toHaveBeenCalled();
      expect(vi.mocked(patientService.createBiometricRecordForPatient)).not.toHaveBeenCalled();
      expect(vi.mocked(mockNext)).not.toHaveBeenCalled();
    });
  
    it('should return 400 if no measurements or notes are provided', async () => {
        mockReq.body = { recordDate: '2023-10-27' }; // Missing measurements and notes
        await createBiometricRecord(mockReq, mockRes, mockNext);
        expect(mockRes.status).toHaveBeenCalledWith(400);
        expect(mockRes.json).toHaveBeenCalledWith({ message: 'Se debe proporcionar al menos una medida numérica o una nota.' });
        
        expect(vi.mocked(patientService.checkPatientOwnership)).not.toHaveBeenCalled();
        expect(vi.mocked(patientService.createBiometricRecordForPatient)).not.toHaveBeenCalled();
        expect(vi.mocked(mockNext)).not.toHaveBeenCalled();
    });

    it('should return 400 if measurements are not numeric', async () => {
        mockReq.body = { recordDate: '2023-10-27', weight: 'not a number' }; // Invalid measurement type
        await createBiometricRecord(mockReq, mockRes, mockNext);
        expect(mockRes.status).toHaveBeenCalledWith(400);
        expect(mockRes.json).toHaveBeenCalledWith({ message: "El valor para 'weight' debe ser numérico si está presente." });
        
        expect(vi.mocked(patientService.checkPatientOwnership)).not.toHaveBeenCalled();
        expect(vi.mocked(patientService.createBiometricRecordForPatient)).not.toHaveBeenCalled();
        expect(vi.mocked(mockNext)).not.toHaveBeenCalled();
    });

    it('should return 400 if notes are not a string', async () => {
        mockReq.body = { recordDate: '2023-10-27', notes: 123 }; // Invalid notes type
        await createBiometricRecord(mockReq, mockRes, mockNext);
        expect(mockRes.status).toHaveBeenCalledWith(400);
        expect(mockRes.json).toHaveBeenCalledWith({ message: 'Las notas deben ser una cadena de texto si están presentes.' });
        
        expect(vi.mocked(patientService.checkPatientOwnership)).not.toHaveBeenCalled();
        expect(vi.mocked(patientService.createBiometricRecordForPatient)).not.toHaveBeenCalled();
        expect(vi.mocked(mockNext)).not.toHaveBeenCalled();
    });
  
    it('should return 403 if the patient does not belong to the professional', async () => {
      const patientId = 123;
      const recordData = {
        recordDate: '2023-10-27',
        weight: 70.5,
      };
      mockReq.body = recordData;
  
      // Mockear el servicio para que la verificación de propiedad falle
      vi.mocked(patientService.checkPatientOwnership).mockResolvedValueOnce(false);
  
      await createBiometricRecord(mockReq, mockRes, mockNext);
  
      expect(vi.mocked(patientService.checkPatientOwnership)).toHaveBeenCalledWith(
        mockReq.professional.professionalId,
        patientId
      );
      expect(vi.mocked(patientService.createBiometricRecordForPatient)).not.toHaveBeenCalled(); // No se llama al servicio de creación
      expect(mockRes.status).toHaveBeenCalledWith(403);
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'Acceso denegado: El paciente no pertenece a este profesional.' });
      expect(vi.mocked(mockNext)).not.toHaveBeenCalled();
    });
  
    it('should call next with error if service throws an error during ownership check', async () => {
      const patientId = 123;
      const recordData = {
        recordDate: '2023-10-27',
        weight: 70.5,
      };
      mockReq.body = recordData;
  
      // Mockear el servicio para que lance un error durante la verificación de propiedad
      const serviceError = new Error('DB error during ownership check');
      vi.mocked(patientService.checkPatientOwnership).mockRejectedValueOnce(serviceError);
  
      await createBiometricRecord(mockReq, mockRes, mockNext);
  
      expect(vi.mocked(patientService.checkPatientOwnership)).toHaveBeenCalledWith(
        mockReq.professional.professionalId,
        patientId
      );
      expect(vi.mocked(patientService.createBiometricRecordForPatient)).not.toHaveBeenCalled();
      expect(mockRes.status).not.toHaveBeenCalled();
      expect(mockRes.json).not.toHaveBeenCalled();
      expect(vi.mocked(mockNext)).toHaveBeenCalledWith(serviceError);
    });
  
    it('should call next with error if service throws an error during record creation', async () => {
        const patientId = 123;
        const recordData = {
          recordDate: '2023-10-27',
          weight: 70.5,
        };
        mockReq.body = recordData;
    
        // Mockear el servicio para que la verificación de propiedad sea exitosa
        vi.mocked(patientService.checkPatientOwnership).mockResolvedValueOnce(true);
    
        // Mockear el servicio para que lance un error durante la creación del registro
        const serviceError = new Error('DB error during record creation');
        vi.mocked(patientService.createBiometricRecordForPatient).mockRejectedValueOnce(serviceError);
    
        await createBiometricRecord(mockReq, mockRes, mockNext);
    
        expect(vi.mocked(patientService.checkPatientOwnership)).toHaveBeenCalledWith(
            mockReq.professional.professionalId,
            patientId
        );
        expect(vi.mocked(patientService.createBiometricRecordForPatient)).toHaveBeenCalled(); // Se llama al servicio de creación
        expect(mockRes.status).not.toHaveBeenCalled();
        expect(mockRes.json).not.toHaveBeenCalled();
        expect(vi.mocked(mockNext)).toHaveBeenCalledWith(serviceError);
      });
  });

  // You can add more describe blocks for other controller functions here
}); 