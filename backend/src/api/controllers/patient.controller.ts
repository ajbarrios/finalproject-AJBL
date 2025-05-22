import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../../middleware/auth.middleware'; // Importar para tipar req
import * as patientService from '../../services/patient.service'; // Importaremos el servicio

// Placeholder para la lógica de listar pacientes
export const listPatients = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const professionalPayload = req.professional; // Payload del JWT decodificado por el middleware

    if (!professionalPayload || !professionalPayload.professionalId) {
      // Esto no debería ocurrir si el middleware de autenticación funciona correctamente
      res.status(403).json({ message: 'Acceso denegado: Información del profesional no encontrada en el token.' });
      return;
    }

    const professionalId = professionalPayload.professionalId;
    const searchQuery = req.query.search as string | undefined;

    const patients = await patientService.getPatientsForProfessional(professionalId, searchQuery);
    
    // Por ahora, devolvemos directamente los pacientes del servicio.
    // Si necesitáramos un mapeo explícito a un PatientResponse DTO diferente al modelo de Prisma,
    // se haría aquí. Según el análisis anterior, los campos de Prisma Patient son adecuados.
    res.status(200).json(patients);

  } catch (error) {
    next(error); // Pasar errores al manejador de errores de Express
  }
};

// Aquí se añadirán otras funciones del controlador (getPatientById, createPatient, etc.) 