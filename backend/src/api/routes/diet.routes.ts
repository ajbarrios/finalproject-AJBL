import { Router } from 'express';
import { createDietPlanForPatient, getDietPlanById, updateDietPlan } from '../controllers/diet.controller';
import { authenticateToken } from '../../middleware/auth.middleware';

const router = Router();

// Rutas bajo /api/diets
router.route('/patients/:patientId/plans').post(authenticateToken, createDietPlanForPatient);

// Nueva ruta para obtener un plan de dieta específico por ID
router.route('/:dietPlanId').get(authenticateToken, getDietPlanById);

// Nueva ruta para actualizar un plan de dieta específico por ID
router.route('/:dietPlanId').put(authenticateToken, updateDietPlan);

export default router; 