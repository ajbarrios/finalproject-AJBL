import { Request, Response, NextFunction } from 'express';
import { pdfService } from '../../services/pdfService';
import { PdfGenerationRequest, PatientIdParams } from '../../validations/pdf.validation';
import prisma from '../../config/db/prisma.client';

// Extender la interfaz Request para incluir información del profesional autenticado
declare global {
  namespace Express {
    interface Request {
      professional?: {
        id: number;
        email: string;
      };
    }
  }
}

/**
 * Controlador para la generación de PDFs
 */
export class PdfController {
  
  /**
   * Genera un PDF combinado de planes de dieta y entrenamiento
   * POST /api/patients/:patientId/combined-pdf
   */
  async generateCombinedPdf(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      // 1. Extraer datos de la petición
      const { patientId } = req.params as unknown as PatientIdParams;
      const { dietPlanId, workoutPlanId } = req.body as PdfGenerationRequest;
      const professionalId = req.professional?.id; // Viene del middleware de autenticación

      if (!professionalId) {
        res.status(401).json({ 
          message: 'Token de autenticación requerido' 
        });
        return;
      }

      // 2. Validar que el paciente existe y pertenece al profesional
      const patient = await prisma.patient.findFirst({
        where: {
          id: patientId,
          professionalId: professionalId
        }
      });

      if (!patient) {
        res.status(404).json({ 
          message: 'Paciente no encontrado o no autorizado' 
        });
        return;
      }

      // 3. Obtener información del profesional
      const professional = await prisma.professional.findUnique({
        where: { id: professionalId },
        select: {
          firstName: true,
          lastName: true,
          profession: true
        }
      });

      // 4. Obtener plan de dieta (si se proporcionó)
      let dietPlan = null;
      if (dietPlanId) {
        dietPlan = await prisma.dietPlan.findFirst({
          where: {
            id: parseInt(dietPlanId),
            patientId: patientId,
            professionalId: professionalId,
            isDeleted: false
          },
          include: {
            meals: {
              orderBy: [
                { dayOfWeek: 'asc' },
                { mealType: 'asc' }
              ]
            }
          }
        });

        if (!dietPlan) {
          res.status(404).json({ 
            message: 'Plan de dieta no encontrado o no autorizado' 
          });
          return;
        }
      }

      // 5. Obtener plan de entrenamiento (si se proporcionó)
      let workoutPlan = null;
      if (workoutPlanId) {
        workoutPlan = await prisma.workoutPlan.findFirst({
          where: {
            id: parseInt(workoutPlanId),
            patientId: patientId,
            professionalId: professionalId
          },
          include: {
            days: {
              include: {
                exercises: {
                  orderBy: { displayOrder: 'asc' }
                }
              },
              orderBy: { dayOfWeek: 'asc' }
            }
          }
        });

        if (!workoutPlan) {
          res.status(404).json({ 
            message: 'Plan de entrenamiento no encontrado o no autorizado' 
          });
          return;
        }
      }

      // 6. Generar PDF usando el servicio
      const pdfBuffer = await pdfService.generateCombinedPlansPDF({
        patient,
        dietPlan,
        workoutPlan,
        professional: professional || undefined
      });

      // 7. Generar nombre del archivo
      const fileName = pdfService.generateFileName(patient, true);

      // 8. Configurar headers de respuesta para PDF
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
      res.setHeader('Content-Length', pdfBuffer.length);

      // 9. Enviar PDF como respuesta
      res.status(200).send(pdfBuffer);

    } catch (error) {
      console.error('Error in generateCombinedPdf:', error);
      next(error);
    }
  }
}

// Exportar instancia del controlador
export const pdfController = new PdfController(); 