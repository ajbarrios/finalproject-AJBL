import { Router } from 'express';
import { pdfController } from '../controllers/pdf.controller';
import { authenticateToken } from '../../middleware/auth.middleware';

const router = Router();

/**
 * POST /api/patients/:patientId/combined-pdf
 * Genera un PDF combinado de planes de dieta y entrenamiento para un paciente
 */
router.post(
  '/patients/:patientId/combined-pdf',
  authenticateToken,                    // Middleware de autenticación
  pdfController.generateCombinedPdf     // Controlador
);

export default router; 