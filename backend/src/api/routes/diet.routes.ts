import { Router } from 'express';
import { createDietPlanForPatient } from '../controllers/diet.controller';
import { authenticateToken } from '../../middleware/auth.middleware';

const router = Router();

// Rutas bajo /api/diets
router.route('/patients/:patientId/plans').post(authenticateToken, createDietPlanForPatient);

export default router; 