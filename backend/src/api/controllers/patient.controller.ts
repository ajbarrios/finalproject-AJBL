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

// Lógica para obtener paciente por ID y detalles asociados
export const getPatientById = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const professionalPayload = req.professional; // Payload del JWT
    const patientId = parseInt(req.params.patientId, 10); // Obtener ID del paciente de los parámetros de la ruta

    // Verificar si professionalPayload existe (aunque el middleware debería asegurar esto)
    if (!professionalPayload || !professionalPayload.professionalId) {
      res.status(403).json({ message: 'Acceso denegado: Información del profesional no encontrada.' });
      return;
    }

    // Validar si patientId es un número válido
    if (isNaN(patientId)) {
        res.status(400).json({ message: 'ID de paciente no válido.' });
        return;
    }

    // Usar el servicio para obtener los detalles del paciente con verificación de propiedad
    const patientDetails = await patientService.getPatientDetailsForProfessional(
      professionalPayload.professionalId,
      patientId
    );

    // Si el servicio retorna null, significa que el paciente no existe o no pertenece a este profesional
    if (!patientDetails) {
      // Nota: No distinguimos entre no encontrado y no autorizado por seguridad
      res.status(404).json({ message: 'Paciente no encontrado o no tiene permiso para verlo.' });
      return;
    }

    // Si se encontró y pertenece al profesional, devolver los detalles
    res.status(200).json(patientDetails);

  } catch (error) {
    next(error); // Pasar errores al manejador de errores de Express
  }
};

// Aquí se añadirán otras funciones del controlador (createPatient, etc.) 