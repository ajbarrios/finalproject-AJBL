import { Router } from 'express';
import { createDietPlanForPatient } from '../controllers/diet.controller';
import { authenticateToken } from '../../middleware/auth.middleware';
import { validate } from '../../middleware/validation.middleware';
import { createDietPlanSchema } from '../../validations/diet.validations';

const router = Router();

// Rutas anidadas bajo /api/patients/:patientId/diet-plans
router.route('/:patientId/diet-plans').post(authenticateToken, validate(createDietPlanSchema), createDietPlanForPatient);

export default router; 