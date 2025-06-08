/// <reference types="vitest/globals" />

// Mock de servicios - configuramos los mocks antes de los imports
vi.mock('../../../../src/services/emailService', () => ({
  EmailService: vi.fn().mockImplementation(() => ({
    sendPlanEmail: vi.fn(),
    testConnection: vi.fn(),
    getServiceInfo: vi.fn()
  })),
  emailService: {
    sendPlanEmail: vi.fn(),
    testConnection: vi.fn(),
    getServiceInfo: vi.fn()
  }
}));

vi.mock('../../../../src/services/pdfService');
vi.mock('../../../../src/services/patient.service');

// Mock de variables de entorno para evitar errores de configuración
vi.mock('../../../../src/config/environment', () => ({
  EMAIL_USER: 'test@gmail.com',
  EMAIL_PASS: 'test-password',
  FROM_NAME: 'NutriTrack Pro Test'
}));

import { describe, it, expect, vi, beforeEach, Mock } from 'vitest';
import { Request, Response } from 'express';
import { AuthenticatedRequest } from '../../../../src/middleware/auth.middleware';
import { sendPlansEmail } from '../../../../src/api/controllers/emailPlan.controller';

// Importar mocks de servicios
import { emailService } from '../../../../src/services/emailService';
import { pdfService } from '../../../../src/services/pdfService';
import { checkPatientOwnership } from '../../../../src/services/patient.service';

// Importar mock de Prisma
import { prismaMock } from '../../../config/prisma.mock';

// Tipos para los mocks
const mockedEmailService = vi.mocked(emailService);
const mockedPdfService = vi.mocked(pdfService);
const mockedCheckPatientOwnership = vi.mocked(checkPatientOwnership);

describe('EmailPlan Controller - sendPlansEmail', () => {
  let mockReq: Partial<AuthenticatedRequest>;
  let mockRes: Partial<Response>;
  let statusSpy: Mock;
  let jsonSpy: Mock;

  // Datos de prueba
  const mockProfessionalId = 1;
  const mockPatientId = '101';
  const mockPatient = {
    id: 101,
    professionalId: mockProfessionalId,
    firstName: 'Juan',
    lastName: 'Pérez',
    email: 'juan.perez@email.com',
    phone: null,
    birthDate: new Date('1990-05-15'),
    gender: 'Masculino',
    height: 175,
    medicalNotes: null,
    dietRestrictions: null,
    objectives: 'Perder peso',
    createdAt: new Date(),
    updatedAt: new Date()
  };

  const mockDietPlan = {
    id: 201,
    professionalId: mockProfessionalId,
    patientId: 101,
    title: 'Plan de Dieta Personalizado',
    description: 'Descripción del plan',
    startDate: new Date('2024-02-01'),
    endDate: new Date('2024-04-30'),
    objectives: 'Perder 5kg',
    isActive: true,
    isDeleted: false,
    deletedAt: null,
    notes: 'Notas del plan',
    createdAt: new Date(),
    updatedAt: new Date(),
    meals: []
  };

  const mockWorkoutPlan = {
    id: 301,
    professionalId: mockProfessionalId,
    patientId: 101,
    title: 'Plan de Entrenamiento',
    description: 'Rutina de ejercicios',
    startDate: new Date('2024-02-01'),
    endDate: new Date('2024-04-30'),
    objectives: 'Ganar fuerza',
    isActive: true,
    notes: 'Notas del entrenamiento',
    createdAt: new Date(),
    updatedAt: new Date(),
    days: []
  };

  beforeEach(() => {
    vi.clearAllMocks();
    
    // Configurar variables de entorno para los tests
    process.env.EMAIL_USER = 'test@gmail.com';
    process.env.EMAIL_PASS = 'test-password';
    process.env.FROM_NAME = 'NutriTrack Pro Test';

    jsonSpy = vi.fn();
    statusSpy = vi.fn(() => ({ json: jsonSpy }));
    mockRes = {
      status: statusSpy,
    };

    // Setup básico de request
    mockReq = {
      professional: { professionalId: mockProfessionalId },
      params: { patientId: mockPatientId },
      body: {
        recipientEmail: 'paciente@email.com',
        subject: 'Tu Plan Personalizado',
        bodyMessage: 'Aquí tienes tu plan',
        dietPlanId: '201'
      }
    };
  });

  describe('successful scenarios', () => {
    it('should send email successfully with diet plan only', async () => {
      // Setup mocks
      mockedCheckPatientOwnership.mockResolvedValue(true);
      prismaMock.patient.findUnique.mockResolvedValue(mockPatient);
      prismaMock.dietPlan.findFirst.mockResolvedValue(mockDietPlan);
      mockedPdfService.generateCombinedPlansPDF.mockResolvedValue(Buffer.from('PDF content'));
      mockedPdfService.generateFileName.mockReturnValue('juan_perez_plan_2024-01-01.pdf');
      mockedEmailService.sendPlanEmail.mockResolvedValue({
        success: true,
        messageId: 'test-message-id',
        recipient: 'paciente@email.com',
        timestamp: new Date('2024-01-01T10:00:00Z')
      });

      await sendPlansEmail(mockReq as AuthenticatedRequest, mockRes as Response);

      expect(statusSpy).toHaveBeenCalledWith(200);
      expect(jsonSpy).toHaveBeenCalledWith({
        message: 'Email sent successfully',
        recipient: 'paciente@email.com',
        messageId: 'test-message-id',
        timestamp: '2024-01-01T10:00:00.000Z',
        attachment: {
          filename: 'juan_perez_plan_2024-01-01.pdf',
          size: 11 // Buffer.from('PDF content').length
        },
        plans: {
          dietPlan: {
            id: 201,
            title: 'Plan de Dieta Personalizado'
          },
          workoutPlan: null
        }
      });

      // Verificar llamadas a servicios
      expect(mockedCheckPatientOwnership).toHaveBeenCalledWith(mockProfessionalId, 101);
      expect(prismaMock.patient.findUnique).toHaveBeenCalledWith({
        where: {
          id: 101,
          professionalId: mockProfessionalId
        }
      });
      expect(prismaMock.dietPlan.findFirst).toHaveBeenCalledWith({
        where: {
          id: 201,
          patientId: 101,
          professionalId: mockProfessionalId,
          isDeleted: false
        },
        include: {
          meals: true
        }
      });
      expect(mockedPdfService.generateCombinedPlansPDF).toHaveBeenCalledWith({
        patient: mockPatient,
        dietPlan: mockDietPlan,
        workoutPlan: null
      });
      expect(mockedEmailService.sendPlanEmail).toHaveBeenCalledWith({
        to: 'paciente@email.com',
        subject: 'Tu Plan Personalizado',
        bodyMessage: 'Aquí tienes tu plan',
        attachments: [
          {
            filename: 'juan_perez_plan_2024-01-01.pdf',
            content: Buffer.from('PDF content'),
            contentType: 'application/pdf'
          }
        ]
      });
    });

    it('should send email successfully with both diet and workout plans', async () => {
      // Agregar workout plan al request
      mockReq.body!.workoutPlanId = '301';

      // Setup mocks
      mockedCheckPatientOwnership.mockResolvedValue(true);
      prismaMock.patient.findUnique.mockResolvedValue(mockPatient);
      prismaMock.dietPlan.findFirst.mockResolvedValue(mockDietPlan);
      prismaMock.workoutPlan.findFirst.mockResolvedValue(mockWorkoutPlan);
      mockedPdfService.generateCombinedPlansPDF.mockResolvedValue(Buffer.from('PDF content'));
      mockedPdfService.generateFileName.mockReturnValue('plan.pdf');
      mockedEmailService.sendPlanEmail.mockResolvedValue({
        success: true,
        messageId: 'test-id',
        recipient: 'paciente@email.com',
        timestamp: new Date()
      });

      await sendPlansEmail(mockReq as AuthenticatedRequest, mockRes as Response);

      expect(statusSpy).toHaveBeenCalledWith(200);
      expect(jsonSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Email sent successfully',
          plans: {
            dietPlan: {
              id: 201,
              title: 'Plan de Dieta Personalizado'
            },
            workoutPlan: {
              id: 301,
              title: 'Plan de Entrenamiento'
            }
          }
        })
      );

      expect(prismaMock.workoutPlan.findFirst).toHaveBeenCalledWith({
        where: {
          id: 301,
          patientId: 101,
          professionalId: mockProfessionalId
        },
        include: {
          days: {
            include: {
              exercises: true
            }
          }
        }
      });
    });

    it('should send email successfully with workout plan only', async () => {
      // Solo workout plan
      mockReq.body = {
        recipientEmail: 'paciente@email.com',
        subject: 'Tu Plan de Entrenamiento',
        workoutPlanId: '301'
      };

      mockedCheckPatientOwnership.mockResolvedValue(true);
      prismaMock.patient.findUnique.mockResolvedValue(mockPatient);
      prismaMock.workoutPlan.findFirst.mockResolvedValue(mockWorkoutPlan);
      mockedPdfService.generateCombinedPlansPDF.mockResolvedValue(Buffer.from('PDF content'));
      mockedPdfService.generateFileName.mockReturnValue('plan.pdf');
      mockedEmailService.sendPlanEmail.mockResolvedValue({
        success: true,
        messageId: 'test-id',
        recipient: 'paciente@email.com',
        timestamp: new Date()
      });

      await sendPlansEmail(mockReq as AuthenticatedRequest, mockRes as Response);

      expect(statusSpy).toHaveBeenCalledWith(200);
      expect(jsonSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          plans: {
            dietPlan: null,
            workoutPlan: {
              id: 301,
              title: 'Plan de Entrenamiento'
            }
          }
        })
      );

      expect(prismaMock.dietPlan.findFirst).not.toHaveBeenCalled();
    });
  });

  describe('authentication and authorization errors', () => {
    it('should return 401 when professional ID is missing from token', async () => {
      mockReq.professional = {}; // Sin professionalId

      await sendPlansEmail(mockReq as AuthenticatedRequest, mockRes as Response);

      expect(statusSpy).toHaveBeenCalledWith(401);
      expect(jsonSpy).toHaveBeenCalledWith({
        message: 'Unauthorized: Professional ID not found in token'
      });
    });

    it('should return 403 when professional does not own the patient', async () => {
      mockedCheckPatientOwnership.mockResolvedValue(false);

      await sendPlansEmail(mockReq as AuthenticatedRequest, mockRes as Response);

      expect(statusSpy).toHaveBeenCalledWith(403);
      expect(jsonSpy).toHaveBeenCalledWith({
        message: 'Forbidden: You do not have access to this patient'
      });
    });
  });

  describe('validation errors', () => {
    it('should return 400 for invalid patient ID format', async () => {
      mockReq.params = { patientId: 'invalid-id' };

      await sendPlansEmail(mockReq as AuthenticatedRequest, mockRes as Response);

      expect(statusSpy).toHaveBeenCalledWith(400);
      expect(jsonSpy).toHaveBeenCalledWith({
        message: 'Invalid route parameters',
        errors: expect.objectContaining({
          patientId: expect.arrayContaining([
            expect.stringContaining('número válido')
          ])
        })
      });
    });

    it('should return 400 for invalid email format', async () => {
      mockReq.body!.recipientEmail = 'invalid-email';

      await sendPlansEmail(mockReq as AuthenticatedRequest, mockRes as Response);

      expect(statusSpy).toHaveBeenCalledWith(400);
      expect(jsonSpy).toHaveBeenCalledWith({
        message: 'Validation failed',
        errors: expect.objectContaining({
          recipientEmail: expect.arrayContaining([
            expect.stringContaining('Formato de email inválido')
          ])
        })
      });
    });

    it('should return 400 when no plans are specified', async () => {
      delete mockReq.body!.dietPlanId;
      delete mockReq.body!.workoutPlanId;

      await sendPlansEmail(mockReq as AuthenticatedRequest, mockRes as Response);

      expect(statusSpy).toHaveBeenCalledWith(400);
      expect(jsonSpy).toHaveBeenCalledWith({
        message: 'Validation failed',
        errors: expect.objectContaining({
          plans: expect.arrayContaining([
            expect.stringContaining('al menos un plan')
          ])
        })
      });
    });

    it('should return 400 for empty subject', async () => {
      mockReq.body!.subject = '';

      await sendPlansEmail(mockReq as AuthenticatedRequest, mockRes as Response);

      expect(statusSpy).toHaveBeenCalledWith(400);
      expect(jsonSpy).toHaveBeenCalledWith({
        message: 'Validation failed',
        errors: expect.objectContaining({
          subject: expect.arrayContaining([
            expect.stringContaining('asunto es requerido')
          ])
        })
      });
    });
  });

  describe('not found errors', () => {
    beforeEach(() => {
      mockedCheckPatientOwnership.mockResolvedValue(true);
    });

    it('should return 404 when patient is not found', async () => {
      prismaMock.patient.findUnique.mockResolvedValue(null);

      await sendPlansEmail(mockReq as AuthenticatedRequest, mockRes as Response);

      expect(statusSpy).toHaveBeenCalledWith(404);
      expect(jsonSpy).toHaveBeenCalledWith({
        message: 'Patient not found'
      });
    });

    it('should return 404 when diet plan is not found', async () => {
      prismaMock.patient.findUnique.mockResolvedValue(mockPatient);
      prismaMock.dietPlan.findFirst.mockResolvedValue(null);

      await sendPlansEmail(mockReq as AuthenticatedRequest, mockRes as Response);

      expect(statusSpy).toHaveBeenCalledWith(404);
      expect(jsonSpy).toHaveBeenCalledWith({
        message: 'Diet plan not found or you do not have access to it'
      });
    });

    it('should return 404 when workout plan is not found', async () => {
      mockReq.body!.workoutPlanId = '999';
      delete mockReq.body!.dietPlanId;

      prismaMock.patient.findUnique.mockResolvedValue(mockPatient);
      prismaMock.workoutPlan.findFirst.mockResolvedValue(null);

      await sendPlansEmail(mockReq as AuthenticatedRequest, mockRes as Response);

      expect(statusSpy).toHaveBeenCalledWith(404);
      expect(jsonSpy).toHaveBeenCalledWith({
        message: 'Workout plan not found or you do not have access to it'
      });
    });
  });

  describe('service errors', () => {
    beforeEach(() => {
      mockedCheckPatientOwnership.mockResolvedValue(true);
      prismaMock.patient.findUnique.mockResolvedValue(mockPatient);
      prismaMock.dietPlan.findFirst.mockResolvedValue(mockDietPlan);
    });

    it('should return 500 for invalid email credentials error', async () => {
      mockedPdfService.generateCombinedPlansPDF.mockResolvedValue(Buffer.from('PDF'));
      mockedPdfService.generateFileName.mockReturnValue('plan.pdf');
      mockedEmailService.sendPlanEmail.mockRejectedValue(
        new Error('Invalid email credentials')
      );

      await sendPlansEmail(mockReq as AuthenticatedRequest, mockRes as Response);

      expect(statusSpy).toHaveBeenCalledWith(500);
      expect(jsonSpy).toHaveBeenCalledWith({
        message: 'Email service configuration error',
        error: 'Invalid email credentials. Please contact administrator.'
      });
    });

    it('should return 500 for email quota exceeded error', async () => {
      mockedPdfService.generateCombinedPlansPDF.mockResolvedValue(Buffer.from('PDF'));
      mockedPdfService.generateFileName.mockReturnValue('plan.pdf');
      mockedEmailService.sendPlanEmail.mockRejectedValue(
        new Error('quota exceeded')
      );

      await sendPlansEmail(mockReq as AuthenticatedRequest, mockRes as Response);

      expect(statusSpy).toHaveBeenCalledWith(500);
      expect(jsonSpy).toHaveBeenCalledWith({
        message: 'Email service quota exceeded',
        error: 'Daily email limit reached. Please try again tomorrow.'
      });
    });

    it('should return 500 for connection timeout error', async () => {
      mockedPdfService.generateCombinedPlansPDF.mockResolvedValue(Buffer.from('PDF'));
      mockedPdfService.generateFileName.mockReturnValue('plan.pdf');
      mockedEmailService.sendPlanEmail.mockRejectedValue(
        new Error('connection timeout')
      );

      await sendPlansEmail(mockReq as AuthenticatedRequest, mockRes as Response);

      expect(statusSpy).toHaveBeenCalledWith(500);
      expect(jsonSpy).toHaveBeenCalledWith({
        message: 'Email service unavailable',
        error: 'Email service connection timeout. Please try again later.'
      });
    });

    it('should return 500 for PDF generation error', async () => {
      mockedPdfService.generateCombinedPlansPDF.mockRejectedValue(
        new Error('Failed to generate PDF')
      );

      await sendPlansEmail(mockReq as AuthenticatedRequest, mockRes as Response);

      expect(statusSpy).toHaveBeenCalledWith(500);
      expect(jsonSpy).toHaveBeenCalledWith({
        message: 'PDF generation failed',
        error: 'Unable to generate PDF document. Please try again.'
      });
    });

    it('should return 500 for generic errors', async () => {
      mockedPdfService.generateCombinedPlansPDF.mockRejectedValue(
        new Error('Generic database error')
      );

      await sendPlansEmail(mockReq as AuthenticatedRequest, mockRes as Response);

      expect(statusSpy).toHaveBeenCalledWith(500);
      expect(jsonSpy).toHaveBeenCalledWith({
        message: 'Internal server error',
        error: 'An unexpected error occurred while sending the email'
      });
    });
  });

  describe('database query verification', () => {
    beforeEach(() => {
      mockedCheckPatientOwnership.mockResolvedValue(true);
      prismaMock.patient.findUnique.mockResolvedValue(mockPatient);
      mockedPdfService.generateCombinedPlansPDF.mockResolvedValue(Buffer.from('PDF'));
      mockedPdfService.generateFileName.mockReturnValue('plan.pdf');
      mockedEmailService.sendPlanEmail.mockResolvedValue({
        success: true,
        messageId: 'test-id',
        recipient: 'test@email.com',
        timestamp: new Date()
      });
    });

    it('should query diet plan with correct parameters including soft delete filter', async () => {
      prismaMock.dietPlan.findFirst.mockResolvedValue(mockDietPlan);

      await sendPlansEmail(mockReq as AuthenticatedRequest, mockRes as Response);

      expect(prismaMock.dietPlan.findFirst).toHaveBeenCalledWith({
        where: {
          id: 201,
          patientId: 101,
          professionalId: mockProfessionalId,
          isDeleted: false // Verificar que excluye planes eliminados
        },
        include: {
          meals: true
        }
      });
    });

    it('should query workout plan with correct parameters', async () => {
      mockReq.body!.workoutPlanId = '301';
      prismaMock.dietPlan.findFirst.mockResolvedValue(mockDietPlan);
      prismaMock.workoutPlan.findFirst.mockResolvedValue(mockWorkoutPlan);

      await sendPlansEmail(mockReq as AuthenticatedRequest, mockRes as Response);

      expect(prismaMock.workoutPlan.findFirst).toHaveBeenCalledWith({
        where: {
          id: 301,
          patientId: 101,
          professionalId: mockProfessionalId
        },
        include: {
          days: {
            include: {
              exercises: true
            }
          }
        }
      });
    });
  });
}); 