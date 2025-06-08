import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { Request, Response, NextFunction } from 'express';
import { PdfController } from '../../../../src/api/controllers/pdf.controller';
import { pdfService } from '../../../../src/services/pdfService';
import prisma from '../../../../src/config/db/prisma.client';

// Mock dependencies
vi.mock('../../../../src/services/pdfService');
vi.mock('../../../../src/config/db/prisma.client');

describe('PdfController', () => {
  let pdfController: PdfController;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNext: NextFunction;

  beforeEach(() => {
    pdfController = new PdfController();
    
    mockRequest = {
      params: {},
      body: {},
      professional: {
        id: 1,
        email: 'doctor@test.com'
      }
    };

    mockResponse = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn().mockReturnThis(),
      setHeader: vi.fn().mockReturnThis(),
      send: vi.fn().mockReturnThis()
    };

    mockNext = vi.fn();
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('generateCombinedPdf', () => {
    
    describe('Success cases', () => {
      it('should generate PDF with both diet and workout plans', async () => {
        // Arrange
        const mockPatient = {
          id: 1,
          firstName: 'Juan',
          lastName: 'Pérez',
          email: 'juan@test.com',
          professionalId: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
          phone: null,
          birthDate: null,
          gender: null,
          height: null,
          medicalNotes: null,
          dietRestrictions: null,
          objectives: null
        };

        const mockDietPlan = {
          id: 101,
          title: 'Plan de dieta',
          professionalId: 1,
          patientId: 1,
          description: 'Plan test',
          startDate: new Date(),
          endDate: new Date(),
          objectives: 'Test',
          isActive: true,
          isDeleted: false,
          deletedAt: null,
          notes: null,
          createdAt: new Date(),
          updatedAt: new Date(),
          meals: []
        };

        const mockWorkoutPlan = {
          id: 201,
          title: 'Plan de entrenamiento',
          professionalId: 1,
          patientId: 1,
          description: 'Plan test',
          startDate: new Date(),
          endDate: new Date(),
          objectives: 'Test',
          isActive: true,
          notes: null,
          createdAt: new Date(),
          updatedAt: new Date(),
          days: []
        };

        const mockProfessional = {
          firstName: 'Dr. María',
          lastName: 'González',
          profession: 'NUTRITIONIST'
        };

        const mockPdfBuffer = Buffer.from('mock-pdf-content');

        mockRequest.params = { patientId: '1' };
        mockRequest.body = {
          dietPlanId: '123e4567-e89b-12d3-a456-426614174000',
          workoutPlanId: '123e4567-e89b-12d3-a456-426614174001'
        };

        // Mock database calls
        (prisma.patient.findFirst as any).mockResolvedValue(mockPatient);
        (prisma.dietPlan.findFirst as any).mockResolvedValue(mockDietPlan);
        (prisma.workoutPlan.findFirst as any).mockResolvedValue(mockWorkoutPlan);
        (prisma.professional.findUnique as any).mockResolvedValue(mockProfessional);
        
        // Mock PDF service
        (pdfService.generateCombinedPlansPDF as any).mockResolvedValue(mockPdfBuffer);
        (pdfService.generateFileName as any).mockReturnValue('Juan_Pérez_plan.pdf');

        // Act
        await pdfController.generateCombinedPdf(
          mockRequest as Request,
          mockResponse as Response,
          mockNext
        );

        // Assert
        expect(prisma.patient.findFirst).toHaveBeenCalledWith({
          where: {
            id: "1",
            professionalId: 1
          }
        });

        expect(pdfService.generateCombinedPlansPDF).toHaveBeenCalledWith({
          patient: mockPatient,
          dietPlan: mockDietPlan,
          workoutPlan: mockWorkoutPlan,
          professional: mockProfessional
        });

        expect(mockResponse.setHeader).toHaveBeenCalledWith('Content-Type', 'application/pdf');
        expect(mockResponse.setHeader).toHaveBeenCalledWith('Content-Disposition', 'attachment; filename="Juan_Pérez_plan.pdf"');
        expect(mockResponse.send).toHaveBeenCalledWith(mockPdfBuffer);
        expect(mockNext).not.toHaveBeenCalled();
      });

      it('should generate PDF with diet plan only', async () => {
        // Arrange
        const mockPatient = {
          id: 1,
          firstName: 'Ana',
          lastName: 'López',
          email: 'ana@test.com',
          professionalId: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
          phone: null,
          birthDate: null,
          gender: null,
          height: null,
          medicalNotes: null,
          dietRestrictions: null,
          objectives: null
        };

        const mockDietPlan = {
          id: 101,
          title: 'Plan solo dieta',
          professionalId: 1,
          patientId: 1,
          description: 'Solo dieta',
          startDate: new Date(),
          endDate: new Date(),
          objectives: 'Test',
          isActive: true,
          isDeleted: false,
          deletedAt: null,
          notes: null,
          createdAt: new Date(),
          updatedAt: new Date(),
          meals: []
        };

        const mockPdfBuffer = Buffer.from('mock-pdf-diet-only');

        mockRequest.params = { patientId: '1' };
        mockRequest.body = {
          dietPlanId: '123e4567-e89b-12d3-a456-426614174000'
        };

        (prisma.patient.findFirst as any).mockResolvedValue(mockPatient);
        (prisma.dietPlan.findFirst as any).mockResolvedValue(mockDietPlan);
        (prisma.workoutPlan.findFirst as any).mockResolvedValue(null);
        (prisma.professional.findUnique as any).mockResolvedValue(null);
        (pdfService.generateCombinedPlansPDF as any).mockResolvedValue(mockPdfBuffer);
        (pdfService.generateFileName as any).mockReturnValue('Ana_López_plan.pdf');

        // Act
        await pdfController.generateCombinedPdf(
          mockRequest as Request,
          mockResponse as Response,
          mockNext
        );

        // Assert
        expect(pdfService.generateCombinedPlansPDF).toHaveBeenCalledWith({
          patient: mockPatient,
          dietPlan: mockDietPlan,
          workoutPlan: null,
          professional: undefined
        });

        expect(mockResponse.send).toHaveBeenCalledWith(mockPdfBuffer);
      });

      it('should generate PDF with workout plan only', async () => {
        // Arrange
        const mockPatient = {
          id: 2,
          firstName: 'Carlos',
          lastName: 'Ruiz',
          email: 'carlos@test.com',
          professionalId: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
          phone: null,
          birthDate: null,
          gender: null,
          height: null,
          medicalNotes: null,
          dietRestrictions: null,
          objectives: null
        };

        const mockWorkoutPlan = {
          id: 201,
          title: 'Solo entrenamiento',
          professionalId: 1,
          patientId: 2,
          description: 'Solo workout',
          startDate: new Date(),
          endDate: new Date(),
          objectives: 'Test',
          isActive: true,
          notes: null,
          createdAt: new Date(),
          updatedAt: new Date(),
          days: []
        };

        const mockPdfBuffer = Buffer.from('mock-pdf-workout-only');

        mockRequest.params = { patientId: '2' };
        mockRequest.body = {
          workoutPlanId: '123e4567-e89b-12d3-a456-426614174001'
        };

        (prisma.patient.findFirst as any).mockResolvedValue(mockPatient);
        (prisma.dietPlan.findFirst as any).mockResolvedValue(null);
        (prisma.workoutPlan.findFirst as any).mockResolvedValue(mockWorkoutPlan);
        (prisma.professional.findUnique as any).mockResolvedValue(null);
        (pdfService.generateCombinedPlansPDF as any).mockResolvedValue(mockPdfBuffer);
        (pdfService.generateFileName as any).mockReturnValue('Carlos_Ruiz_plan.pdf');

        // Act
        await pdfController.generateCombinedPdf(
          mockRequest as Request,
          mockResponse as Response,
          mockNext
        );

        // Assert
        expect(pdfService.generateCombinedPlansPDF).toHaveBeenCalledWith({
          patient: mockPatient,
          dietPlan: null,
          workoutPlan: mockWorkoutPlan,
          professional: undefined
        });
      });
    });

    describe('Error cases', () => {
      it('should return 404 when patient not found', async () => {
        // Arrange
        mockRequest.params = { patientId: '999' };
        mockRequest.body = {
          dietPlanId: '123e4567-e89b-12d3-a456-426614174000'
        };

        (prisma.patient.findFirst as any).mockResolvedValue(null);

        // Act
        await pdfController.generateCombinedPdf(
          mockRequest as Request,
          mockResponse as Response,
          mockNext
        );

        // Assert
        expect(mockResponse.status).toHaveBeenCalledWith(404);
        expect(mockResponse.json).toHaveBeenCalledWith({
          message: 'Paciente no encontrado o no autorizado'
        });
        expect(pdfService.generateCombinedPlansPDF).not.toHaveBeenCalled();
      });

      it('should return 404 when patient belongs to different professional', async () => {
        // Arrange
        mockRequest.params = { patientId: '1' };
        mockRequest.body = {
          dietPlanId: '123e4567-e89b-12d3-a456-426614174000'
        };

        // Mock que el paciente no se encuentra cuando se busca con el profesional actual
        (prisma.patient.findFirst as any).mockResolvedValue(null);

        // Act
        await pdfController.generateCombinedPdf(
          mockRequest as Request,
          mockResponse as Response,
          mockNext
        );

        // Assert
        expect(mockResponse.status).toHaveBeenCalledWith(404);
        expect(mockResponse.json).toHaveBeenCalledWith({
          message: 'Paciente no encontrado o no autorizado'
        });
      });

      it('should return 404 when diet plan not found', async () => {
        // Arrange
        const mockPatient = {
          id: 1,
          firstName: 'Juan',
          lastName: 'Pérez',
          email: 'juan@test.com',
          professionalId: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
          phone: null,
          birthDate: null,
          gender: null,
          height: null,
          medicalNotes: null,
          dietRestrictions: null,
          objectives: null
        };

        mockRequest.params = { patientId: '1' };
        mockRequest.body = {
          dietPlanId: '123e4567-e89b-12d3-a456-426614174000'
        };

        (prisma.patient.findFirst as any).mockResolvedValue(mockPatient);
        (prisma.dietPlan.findFirst as any).mockResolvedValue(null);

        // Act
        await pdfController.generateCombinedPdf(
          mockRequest as Request,
          mockResponse as Response,
          mockNext
        );

        // Assert
        expect(mockResponse.status).toHaveBeenCalledWith(404);
        expect(mockResponse.json).toHaveBeenCalledWith({
          message: 'Plan de dieta no encontrado o no autorizado'
        });
      });

      it('should return 404 when workout plan not found', async () => {
        // Arrange
        const mockPatient = {
          id: 1,
          firstName: 'Juan',
          lastName: 'Pérez',
          email: 'juan@test.com',
          professionalId: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
          phone: null,
          birthDate: null,
          gender: null,
          height: null,
          medicalNotes: null,
          dietRestrictions: null,
          objectives: null
        };

        mockRequest.params = { patientId: '1' };
        mockRequest.body = {
          workoutPlanId: '123e4567-e89b-12d3-a456-426614174001'
        };

        (prisma.patient.findFirst as any).mockResolvedValue(mockPatient);
        (prisma.workoutPlan.findFirst as any).mockResolvedValue(null);

        // Act
        await pdfController.generateCombinedPdf(
          mockRequest as Request,
          mockResponse as Response,
          mockNext
        );

        // Assert
        expect(mockResponse.status).toHaveBeenCalledWith(404);
        expect(mockResponse.json).toHaveBeenCalledWith({
          message: 'Plan de entrenamiento no encontrado o no autorizado'
        });
      });

      it('should handle PDF generation errors', async () => {
        // Arrange
        const mockPatient = {
          id: 1,
          firstName: 'Juan',
          lastName: 'Pérez',
          email: 'juan@test.com',
          professionalId: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
          phone: null,
          birthDate: null,
          gender: null,
          height: null,
          medicalNotes: null,
          dietRestrictions: null,
          objectives: null
        };

        const mockDietPlan = {
          id: 101,
          title: 'Plan de dieta',
          professionalId: 1,
          patientId: 1,
          description: 'Plan test',
          startDate: new Date(),
          endDate: new Date(),
          objectives: 'Test',
          isActive: true,
          isDeleted: false,
          deletedAt: null,
          notes: null,
          createdAt: new Date(),
          updatedAt: new Date(),
          meals: []
        };

        mockRequest.params = { patientId: '1' };
        mockRequest.body = {
          dietPlanId: '123e4567-e89b-12d3-a456-426614174000'
        };

        (prisma.patient.findFirst as any).mockResolvedValue(mockPatient);
        (prisma.dietPlan.findFirst as any).mockResolvedValue(mockDietPlan);
        (prisma.workoutPlan.findFirst as any).mockResolvedValue(null);
        (prisma.professional.findUnique as any).mockResolvedValue(null);
        (pdfService.generateCombinedPlansPDF as any).mockRejectedValue(new Error('PDF generation failed'));

        // Act
        await pdfController.generateCombinedPdf(
          mockRequest as Request,
          mockResponse as Response,
          mockNext
        );

        // Assert
        expect(mockNext).toHaveBeenCalledWith(expect.any(Error));
        expect(mockNext).toHaveBeenCalledWith(
          expect.objectContaining({
            message: expect.stringContaining('PDF generation failed')
          })
        );
      });

      it('should handle database errors', async () => {
        // Arrange
        mockRequest.params = { patientId: '1' };
        mockRequest.body = {
          dietPlanId: '123e4567-e89b-12d3-a456-426614174000'
        };

        (prisma.patient.findFirst as any).mockRejectedValue(new Error('Database error'));

        // Act
        await pdfController.generateCombinedPdf(
          mockRequest as Request,
          mockResponse as Response,
          mockNext
        );

        // Assert
        expect(mockNext).toHaveBeenCalledWith(expect.any(Error));
      });

      it('should handle missing professional in request', async () => {
        // Arrange
        const mockPatient = {
          id: 1,
          firstName: 'Juan',
          lastName: 'Pérez',
          email: 'juan@test.com',
          professionalId: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
          phone: null,
          birthDate: null,
          gender: null,
          height: null,
          medicalNotes: null,
          dietRestrictions: null,
          objectives: null
        };

        mockRequest.params = { patientId: '1' };
        mockRequest.body = {
          dietPlanId: '123e4567-e89b-12d3-a456-426614174000'
        };
        mockRequest.professional = undefined; // No professional in request

        (prisma.patient.findFirst as any).mockResolvedValue(mockPatient);

        // Act
        await pdfController.generateCombinedPdf(
          mockRequest as Request,
          mockResponse as Response,
          mockNext
        );

        // Assert
        expect(mockResponse.status).toHaveBeenCalledWith(401);
        expect(mockResponse.json).toHaveBeenCalledWith({
          message: 'Token de autenticación requerido'
        });
      });
    });

    describe('Edge cases', () => {
      it('should handle patient with minimal data', async () => {
        // Arrange
        const mockPatient = {
          id: 1,
          firstName: 'Test',
          lastName: 'User',
          email: null,
          professionalId: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
          phone: null,
          birthDate: null,
          gender: null,
          height: null,
          medicalNotes: null,
          dietRestrictions: null,
          objectives: null
        };

        const mockDietPlan = {
          id: 101,
          title: 'Basic Plan',
          professionalId: 1,
          patientId: 1,
          description: null,
          startDate: null,
          endDate: null,
          objectives: null,
          isActive: true,
          isDeleted: false,
          deletedAt: null,
          notes: null,
          createdAt: new Date(),
          updatedAt: new Date(),
          meals: []
        };

        const mockPdfBuffer = Buffer.from('minimal-pdf');

        mockRequest.params = { patientId: '1' };
        mockRequest.body = {
          dietPlanId: '123e4567-e89b-12d3-a456-426614174000'
        };

        (prisma.patient.findFirst as any).mockResolvedValue(mockPatient);
        (prisma.dietPlan.findFirst as any).mockResolvedValue(mockDietPlan);
        (prisma.workoutPlan.findFirst as any).mockResolvedValue(null);
        (prisma.professional.findUnique as any).mockResolvedValue(null);
        (pdfService.generateCombinedPlansPDF as any).mockResolvedValue(mockPdfBuffer);
        (pdfService.generateFileName as any).mockReturnValue('Test_User_plan.pdf');

        // Act
        await pdfController.generateCombinedPdf(
          mockRequest as Request,
          mockResponse as Response,
          mockNext
        );

        // Assert
        expect(mockResponse.send).toHaveBeenCalledWith(mockPdfBuffer);
        expect(mockNext).not.toHaveBeenCalled();
      });

      it('should handle larger PDF buffers', async () => {
        // Arrange
        const mockPatient = {
          id: 1,
          firstName: 'Juan',
          lastName: 'Pérez',
          email: 'juan@test.com',
          professionalId: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
          phone: null,
          birthDate: null,
          gender: null,
          height: null,
          medicalNotes: null,
          dietRestrictions: null,
          objectives: null
        };

        const mockDietPlan = {
          id: 101,
          title: 'Plan grande',
          professionalId: 1,
          patientId: 1,
          description: 'Plan con mucho contenido',
          startDate: new Date(),
          endDate: new Date(),
          objectives: 'Test',
          isActive: true,
          isDeleted: false,
          deletedAt: null,
          notes: null,
          createdAt: new Date(),
          updatedAt: new Date(),
          meals: []
        };

        // Simular un PDF más grande pero manejable (1KB)
        const largePdfBuffer = Buffer.alloc(1024, 'a');

        mockRequest.params = { patientId: '1' };
        mockRequest.body = {
          dietPlanId: '123e4567-e89b-12d3-a456-426614174000'
        };

        (prisma.patient.findFirst as any).mockResolvedValue(mockPatient);
        (prisma.dietPlan.findFirst as any).mockResolvedValue(mockDietPlan);
        (prisma.workoutPlan.findFirst as any).mockResolvedValue(null);
        (prisma.professional.findUnique as any).mockResolvedValue(null);
        (pdfService.generateCombinedPlansPDF as any).mockResolvedValue(largePdfBuffer);
        (pdfService.generateFileName as any).mockReturnValue('Juan_Pérez_plan.pdf');

        // Act
        await pdfController.generateCombinedPdf(
          mockRequest as Request,
          mockResponse as Response,
          mockNext
        );

        // Assert
        expect(mockResponse.send).toHaveBeenCalledWith(largePdfBuffer);
        expect(largePdfBuffer.length).toBe(1024);
      });
    });
  });
});
