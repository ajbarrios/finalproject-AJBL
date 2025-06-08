import { Router } from 'express';
import { createDietPlanForPatient, getDietPlanById, updateDietPlan, deleteDietPlan } from '../controllers/diet.controller';
import { authenticateToken } from '../../middleware/auth.middleware';

const router = Router();

// Rutas bajo /api/diets
router.route('/patients/:patientId/plans').post(authenticateToken, createDietPlanForPatient);

// Nueva ruta para obtener un plan de dieta específico por ID
router.route('/:dietPlanId').get(authenticateToken, getDietPlanById);

// Nueva ruta para actualizar un plan de dieta específico por ID
router.route('/:dietPlanId').put(authenticateToken, updateDietPlan);

// Nueva ruta para eliminar un plan de dieta específico por ID (soft delete)
router.route('/:dietPlanId').delete(authenticateToken, deleteDietPlan);

export default router; 