import { Request, Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../../middleware/auth.middleware';
import dietService from '../../services/diet.service';
import { vi, Mocked } from 'vitest';
import { createDietPlanForPatient } from './diet.controller';

// Mock the diet service module
vi.mock('../../services/diet.service', () => ({
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

  beforeEach(() => {
    // Reset mocks and create fresh request/response objects before each test
    vi.clearAllMocks();
    mockRequest = {
      params: { patientId: '1' },
      body: { /* planData */ },
      professional: { id: 10 }, // Mock authenticated professional
    };
    mockResponse = {
      status: vi.fn().mockReturnThis(), // Allow chaining .status().json()
      json: vi.fn(),
    };
    nextFunction = vi.fn();
  });

  describe('createDietPlanForPatient', () => {

    it('should create a diet plan and return 201 status', async () => {
      const mockPatient = { id: 1, professionalId: 10 };
      const mockCreatedPlan = { id: 101, title: 'New Plan' };

      // Configure service mock responses
      dietServiceMock.findPatientByProfessional.mockResolvedValue(mockPatient as any);
      dietServiceMock.createDietPlan.mockResolvedValue(mockCreatedPlan as any);

      // Call the controller function
      await createDietPlanForPatient(mockRequest as AuthenticatedRequest, mockResponse as Response, nextFunction);

      // Assertions
      expect(dietServiceMock.findPatientByProfessional).toHaveBeenCalledWith(
        parseInt(mockRequest.params!.patientId, 10),
        mockRequest.professional!.id
      );
      expect(dietServiceMock.createDietPlan).toHaveBeenCalledWith(
        parseInt(mockRequest.params!.patientId, 10),
        mockRequest.professional!.id,
        mockRequest.body
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

      expect(dietServiceMock.findPatientByProfessional).toHaveBeenCalled(); // Ensure it was called
      expect(dietServiceMock.createDietPlan).not.toHaveBeenCalled(); // Ensure plan creation was skipped
      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Paciente no encontrado o no pertenece a este profesional.' });
      expect(nextFunction).not.toHaveBeenCalled();
    });

    it('should return 401 if professional is not authenticated (should be handled by middleware, but double check)', async () => {
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

     // Add more tests for validation errors if validation middleware passes them to the controller
     // (Although validation is typically handled before the controller)

  });
}); 