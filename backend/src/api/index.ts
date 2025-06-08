import { Router } from 'express';
import authRoutes from './routes/auth.routes'; // Asegurar que exporta por defecto
import patientRoutes from './routes/patient.routes'; // Asegurar que exporta por defecto
import dietRoutes from './routes/diet.routes'; // Asegurar que exporta por defecto
import pdfRoutes from './routes/pdf.routes'; // Rutas para generación de PDFs

const router = Router();

router.use('/auth', authRoutes);
router.use('/patients', patientRoutes);
router.use('/diets', dietRoutes);
router.use('/', pdfRoutes); // Rutas PDF en la raíz para /patients/:id/combined-pdf

export default router;