import { Router } from 'express';
import { register } from '../controllers/auth.controller'; // Importar el controlador

const router = Router();

// Ruta POST /auth/register
router.post('/register', register);

// TODO: Implementar la ruta POST /login
// router.post('/login', authController.login);

export default router; 