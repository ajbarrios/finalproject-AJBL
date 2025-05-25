import { Router } from 'express';
import { listPatients, getPatientById, createPatient } from '../controllers/patient.controller'; // Importar la nueva función controladora

// Importaremos el middleware de autenticación aquí cuando esté listo
// import { authenticateToken } from '../../middleware/auth.middleware'; // La ruta anterior era placeholder
import { authenticateToken, AuthenticatedRequest } from '../../middleware/auth.middleware'; // Importamos AuthenticatedRequest también si es necesario tipar req en el router

const router = Router();

// Ruta para crear un nuevo paciente (POST /api/patients)
router.post(
  '/',
  authenticateToken, // Proteger esta ruta
  createPatient // Usar la nueva función controladora
);

// Ruta para listar pacientes (GET /api/patients)
// Se aplicará el middleware de autenticación antes del controlador
router.get(
  '/', 
  authenticateToken, // Aplicamos el middleware de autenticación
  listPatients 
);

// Ruta para obtener detalles de un paciente por ID (GET /api/patients/:patientId)
router.get(
  '/:patientId',
  authenticateToken, // Proteger esta ruta también
  getPatientById // Usar la nueva función controladora
);

// Aquí se añadirán otras rutas de pacientes (POST para crear, PUT, DELETE)

export default router; 