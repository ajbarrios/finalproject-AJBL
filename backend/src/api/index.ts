import { Router } from 'express';
import authRoutes from './routes/auth.routes'; // Asegurar que exporta por defecto
import patientRoutes from './routes/patient.routes'; // Asegurar que exporta por defecto
import dietRoutes from './routes/diet.routes'; // Asegurar que exporta por defecto

const router = Router();

router.use('/auth', authRoutes);
router.use('/patients', patientRoutes);
router.use('/diets', dietRoutes);

export default router;