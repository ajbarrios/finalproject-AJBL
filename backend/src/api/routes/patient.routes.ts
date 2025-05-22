import { Router } from 'express';
import { listPatients } from '../controllers/patient.controller'; 

// Importaremos el middleware de autenticación aquí cuando esté listo
// import { authenticateToken } from '../../middleware/auth.middleware'; // La ruta anterior era placeholder
import { authenticateToken, AuthenticatedRequest } from '../../middleware/auth.middleware'; // Importamos AuthenticatedRequest también si es necesario tipar req en el router

const router = Router();

// Ruta para listar pacientes (GET /api/patients)
// Se aplicará el middleware de autenticación antes del controlador
router.get(
  '/', 
  authenticateToken, // Aplicamos el middleware de autenticación
  listPatients 
);

// Aquí se añadirán otras rutas de pacientes (POST para crear, GET por ID, PUT, DELETE)

export default router; 