import { Router } from 'express';
import { listPatients, getPatientById, createPatient, updatePatient, createBiometricRecord, getBiometricRecords } from '../controllers/patient.controller'; // Importar la nueva función controladora
import { sendPlansEmail } from '../controllers/emailPlan.controller'; // Importar controlador de email

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

// Ruta para actualizar la información de un paciente (PUT /api/patients/:patientId)
router.put(
  '/:patientId',
  authenticateToken, // Proteger esta ruta
  updatePatient // Usar la nueva función controladora
);

// Ruta para registrar nuevas medidas biométricas (POST /api/patients/:patientId/biometric-records)
router.post(
  '/:patientId/biometric-records',
  authenticateToken, // Proteger esta ruta
  createBiometricRecord
);

// Ruta para obtener registros biométricos de un paciente
router.get(
  '/:patientId/biometric-records',
  authenticateToken,
  getBiometricRecords
);

// Ruta para enviar planes por email (POST /api/patients/:patientId/send-plans-email)
router.post(
  '/:patientId/send-plans-email',
  authenticateToken, // Proteger esta ruta
  sendPlansEmail // TB-019: Controlador para envío de emails
);

// Aquí se añadirán otras rutas de pacientes (DELETE)

export default router; 