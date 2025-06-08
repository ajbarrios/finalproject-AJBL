import { Response } from 'express';
import { AuthenticatedRequest } from '../../middleware/auth.middleware';
import { sendPlanEmailSchema, sendEmailParamsSchema } from '../../validations/emailPlan.validations';
import { emailService } from '../../services/emailService';
import { pdfService } from '../../services/pdfService';
import { checkPatientOwnership } from '../../services/patient.service';
import prisma from '../../config/db/prisma.client';

/**
 * Controlador para enviar planes por email
 * POST /api/patients/:patientId/send-plans-email
 */
export const sendPlansEmail = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    // 1. Obtener profesional del token JWT
    const professionalId = req.professional?.professionalId;
    if (!professionalId) {
      res.status(401).json({ 
        message: 'Unauthorized: Professional ID not found in token' 
      });
      return;
    }

    // 2. Validar parámetros de ruta
    const paramsValidation = sendEmailParamsSchema.safeParse(req.params);
    if (!paramsValidation.success) {
      res.status(400).json({
        message: 'Invalid route parameters',
        errors: paramsValidation.error.flatten().fieldErrors
      });
      return;
    }

    const { patientId } = paramsValidation.data;
    const numericPatientId = parseInt(patientId, 10);

    // 3. Validar datos del cuerpo de la solicitud
    const bodyValidation = sendPlanEmailSchema.safeParse(req.body);
    if (!bodyValidation.success) {
      res.status(400).json({
        message: 'Validation failed',
        errors: bodyValidation.error.flatten().fieldErrors
      });
      return;
    }

    const { recipientEmail, subject, bodyMessage, dietPlanId, workoutPlanId } = bodyValidation.data;

    // 4. Verificar autorización del profesional sobre el paciente
    const hasPatientAccess = await checkPatientOwnership(professionalId, numericPatientId);
    if (!hasPatientAccess) {
      res.status(403).json({
        message: 'Forbidden: You do not have access to this patient'
      });
      return;
    }

    // 5. Obtener datos del paciente
    const patient = await prisma.patient.findUnique({
      where: { 
        id: numericPatientId,
        professionalId: professionalId
      }
    });

    if (!patient) {
      res.status(404).json({
        message: 'Patient not found'
      });
      return;
    }

    // 6. Obtener y validar los planes especificados
    let dietPlan = null;
    let workoutPlan = null;

    // Validar plan de dieta si se especifica
    if (dietPlanId) {
      const numericDietPlanId = parseInt(dietPlanId, 10);
      
      dietPlan = await prisma.dietPlan.findFirst({
        where: {
          id: numericDietPlanId,
          patientId: numericPatientId,
          professionalId: professionalId,
          isDeleted: false // Excluir planes eliminados
        },
        include: {
          meals: true // Incluir comidas para el PDF
        }
      });

      if (!dietPlan) {
        res.status(404).json({
          message: 'Diet plan not found or you do not have access to it'
        });
        return;
      }
    }

    // Validar plan de entrenamiento si se especifica
    if (workoutPlanId) {
      const numericWorkoutPlanId = parseInt(workoutPlanId, 10);
      
      workoutPlan = await prisma.workoutPlan.findFirst({
        where: {
          id: numericWorkoutPlanId,
          patientId: numericPatientId,
          professionalId: professionalId
        },
        include: {
          days: {
            include: {
              exercises: true // Incluir ejercicios para el PDF
            }
          }
        }
      });

      if (!workoutPlan) {
        res.status(404).json({
          message: 'Workout plan not found or you do not have access to it'
        });
        return;
      }
    }

    // 7. Generar PDF con los planes
    const pdfBuffer = await pdfService.generateCombinedPlansPDF({
      patient,
      dietPlan,
      workoutPlan
    });

    // 8. Generar nombre de archivo descriptivo
    const filename = pdfService.generateFileName(patient, true);

    // 9. Enviar email con PDF adjunto
    const emailResult = await emailService.sendPlanEmail({
      to: recipientEmail,
      subject: subject,
      bodyMessage: bodyMessage,
      attachments: [
        {
          filename: filename,
          content: pdfBuffer,
          contentType: 'application/pdf'
        }
      ]
    });

    // 10. Respuesta exitosa
    res.status(200).json({
      message: 'Email sent successfully',
      recipient: recipientEmail,
      messageId: emailResult.messageId,
      timestamp: emailResult.timestamp.toISOString(),
      attachment: {
        filename: filename,
        size: pdfBuffer.length
      },
      plans: {
        dietPlan: dietPlan ? {
          id: dietPlan.id,
          title: dietPlan.title
        } : null,
        workoutPlan: workoutPlan ? {
          id: workoutPlan.id,
          title: workoutPlan.title
        } : null
      }
    });

  } catch (error) {
    console.error('Error in sendPlansEmail controller:', error);

    // Manejo específico de errores de email
    if (error instanceof Error) {
      if (error.message.includes('Invalid email credentials')) {
        res.status(500).json({
          message: 'Email service configuration error',
          error: 'Invalid email credentials. Please contact administrator.'
        });
        return;
      }

      if (error.message.includes('quota exceeded')) {
        res.status(500).json({
          message: 'Email service quota exceeded',
          error: 'Daily email limit reached. Please try again tomorrow.'
        });
        return;
      }

      if (error.message.includes('connection timeout')) {
        res.status(500).json({
          message: 'Email service unavailable',
          error: 'Email service connection timeout. Please try again later.'
        });
        return;
      }

      if (error.message.includes('Failed to generate PDF')) {
        res.status(500).json({
          message: 'PDF generation failed',
          error: 'Unable to generate PDF document. Please try again.'
        });
        return;
      }
    }

    // Error genérico
    res.status(500).json({
      message: 'Internal server error',
      error: 'An unexpected error occurred while sending the email'
    });
  }
}; 