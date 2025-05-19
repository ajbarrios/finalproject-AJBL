import { Router } from 'express';
import { register, login } from '../controllers/auth.controller'; // Importar register y login

const router = Router();

// Ruta POST /auth/register
router.post('/register', register);

// Ruta POST /auth/login
router.post('/login', login);

// TODO: Implementar la ruta POST /login
// router.post('/login', authController.login);

export default router; 