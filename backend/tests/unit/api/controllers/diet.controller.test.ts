import { Request, Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../../../../src/middleware/auth.middleware';
import dietService from '../../../../src/services/diet.service';
import { vi, describe, it, expect, beforeEach, Mocked } from 'vitest';
import { createDietPlanForPatient } from '../../../../src/api/controllers/diet.controller';
import { CreateDietPlanInput } from '../../../../src/validations/diet.validations';

// Mock the diet service module
vi.mock('../../../../src/services/diet.service', () => ({
  default: {
    findPatientByProfessional: vi.fn(),
    createDietPlan: vi.fn(),
  },
}));

// Cast the imported service to its mocked type
const dietServiceMock = dietService as Mocked<typeof dietService>;

describe('Diet Controller', () => {
  let mockRequest: Partial<AuthenticatedRequest>;
  let mockResponse: Partial<Response>;
  let nextFunction: NextFunction;

  const mockPlanData: CreateDietPlanInput = {
    title: 'Plan de Pérdida de Peso',
    description: 'Descripción del plan',
    startDate: '2025-06-01',
    endDate: '2025-06-30',
    objectives: 'Perder 5kg',
    status: 'ACTIVE',
    notes: 'Notas importantes',
    meals: [
      {
        mealType: 'BREAKFAST',
        content: 'Avena con frutas',
        dayOfWeek: 'MONDAY'
      },
      {
        mealType: 'LUNCH',
        content: 'Ensalada con proteína',
        dayOfWeek: 'MONDAY'
      }
    ]
  };

  beforeEach(() => {
    // Reset mocks and create fresh request/response objects before each test
    vi.clearAllMocks();
    mockRequest = {
      params: { patientId: '19' },
      body: mockPlanData,
      professional: { professionalId: 1 }, // Usar la propiedad correcta del JWT
    };
    mockResponse = {
      status: vi.fn().mockReturnThis(), // Allow chaining .status().json()
      json: vi.fn(),
    };
    nextFunction = vi.fn();
  });

  describe('createDietPlanForPatient', () => {

    it('should create a diet plan and return 201 status', async () => {
      const mockPatient = { id: 19, professionalId: 1 };
      const mockCreatedPlan = { 
        id: 101, 
        title: 'Plan de Pérdida de Peso',
        description: 'Descripción del plan',
        startDate: new Date('2025-06-01'),
        endDate: new Date('2025-06-30'),
        objectives: 'Perder 5kg',
        isActive: true,
        notes: 'Notas importantes',
        meals: [
          {
            id: 1,
            mealType: 'BREAKFAST',
            content: 'Avena con frutas',
            dayOfWeek: 'MONDAY',
            dietPlanId: 101
          },
          {
            id: 2,
            mealType: 'LUNCH',
            content: 'Ensalada con proteína',
            dayOfWeek: 'MONDAY',
            dietPlanId: 101
          }
        ]
      };

      // Configure service mock responses
      dietServiceMock.findPatientByProfessional.mockResolvedValue(mockPatient as any);
      dietServiceMock.createDietPlan.mockResolvedValue(mockCreatedPlan as any);

      // Call the controller function
      await createDietPlanForPatient(mockRequest as AuthenticatedRequest, mockResponse as Response, nextFunction);

      // Assertions
      expect(dietServiceMock.findPatientByProfessional).toHaveBeenCalledWith(
        19, // parseInt del patientId
        1   // professionalId del token
      );
      expect(dietServiceMock.createDietPlan).toHaveBeenCalledWith(
        19,
        1,
        mockPlanData
      );
      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.json).toHaveBeenCalledWith(mockCreatedPlan);
      expect(nextFunction).not.toHaveBeenCalled(); // Ensure no errors were passed to next
    });

    it('should return 404 if patient not found or does not belong to professional', async () => {
      // Configure service mock response to return null (patient not found)
      dietServiceMock.findPatientByProfessional.mockResolvedValue(null);

      // Call the controller function
      await createDietPlanForPatient(mockRequest as AuthenticatedRequest, mockResponse as Response, nextFunction);

      expect(dietServiceMock.findPatientByProfessional).toHaveBeenCalledWith(19, 1);
      expect(dietServiceMock.createDietPlan).not.toHaveBeenCalled(); // Ensure plan creation was skipped
      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Paciente no encontrado o no pertenece a este profesional.' });
      expect(nextFunction).not.toHaveBeenCalled();
    });

    it('should return 401 if professional is not authenticated', async () => {
      // Simulate unauthenticated request
      mockRequest.professional = undefined;

      // Call the controller function
      await createDietPlanForPatient(mockRequest as AuthenticatedRequest, mockResponse as Response, nextFunction);

      // Service methods should not be called
      expect(dietServiceMock.findPatientByProfessional).not.toHaveBeenCalled();
      expect(dietServiceMock.createDietPlan).not.toHaveBeenCalled();
      expect(mockResponse.status).toHaveBeenCalledWith(401);
      expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Profesional no autenticado o token inválido.' });
      expect(nextFunction).not.toHaveBeenCalled();
    });

    it('should return 401 if professionalId is missing from token', async () => {
      // Simulate request with professional object but missing professionalId
      mockRequest.professional = { email: 'test@test.com' };

      // Call the controller function
      await createDietPlanForPatient(mockRequest as AuthenticatedRequest, mockResponse as Response, nextFunction);

      // Service methods should not be called
      expect(dietServiceMock.findPatientByProfessional).not.toHaveBeenCalled();
      expect(dietServiceMock.createDietPlan).not.toHaveBeenCalled();
      expect(mockResponse.status).toHaveBeenCalledWith(401);
      expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Profesional no autenticado o token inválido.' });
      expect(nextFunction).not.toHaveBeenCalled();
    });

    it('should handle invalid patientId parameter', async () => {
      // Set invalid patientId
      mockRequest.params = { patientId: 'invalid' };

      // This should result in NaN when parseInt is called
      // The service should handle this gracefully or the controller should validate
      
      // Call the controller function
      await createDietPlanForPatient(mockRequest as AuthenticatedRequest, mockResponse as Response, nextFunction);

      // Since parseInt('invalid') = NaN, the service call will be made with NaN
      expect(dietServiceMock.findPatientByProfessional).toHaveBeenCalledWith(NaN, 1);
    });

    it('should pass errors to the next function', async () => {
      const serviceError = new Error('Service failed');

      // Configure service mock to reject
      dietServiceMock.findPatientByProfessional.mockRejectedValue(serviceError);

      // Call the controller function
      await createDietPlanForPatient(mockRequest as AuthenticatedRequest, mockResponse as Response, nextFunction);

      expect(nextFunction).toHaveBeenCalledWith(serviceError);
      expect(mockResponse.status).not.toHaveBeenCalled(); // Ensure no status/json was sent by the controller
      expect(mockResponse.json).not.toHaveBeenCalled();
    });

    it('should pass createDietPlan service errors to next function', async () => {
      const mockPatient = { id: 19, professionalId: 1 };
      const serviceError = new Error('Database error creating plan');

      // Configure service mocks
      dietServiceMock.findPatientByProfessional.mockResolvedValue(mockPatient as any);
      dietServiceMock.createDietPlan.mockRejectedValue(serviceError);

      // Call the controller function
      await createDietPlanForPatient(mockRequest as AuthenticatedRequest, mockResponse as Response, nextFunction);

      expect(dietServiceMock.findPatientByProfessional).toHaveBeenCalledWith(19, 1);
      expect(dietServiceMock.createDietPlan).toHaveBeenCalledWith(19, 1, mockPlanData);
      expect(nextFunction).toHaveBeenCalledWith(serviceError);
      expect(mockResponse.status).not.toHaveBeenCalled();
      expect(mockResponse.json).not.toHaveBeenCalled();
    });

  });
}); 