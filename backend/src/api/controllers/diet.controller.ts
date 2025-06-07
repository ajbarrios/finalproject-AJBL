import { Request, Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../../middleware/auth.middleware'; // Ajusta la ruta si es necesario
import dietService from '../../services/diet.service';
import { CreateDietPlanInput } from '../../validations/diet.validations'; // Actualizar la ruta de importación a la ubicación unificada

// Asumiendo que req.user.id contiene el professionalId (en realidad es req.professional.id según el middleware)
// Asumiendo que patientId viene en req.params.patientId

export const createDietPlanForPatient = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const patientId = parseInt(req.params.patientId, 10);
    const professionalId = req.professional?.professionalId; // Usar professionalId del token JWT
    const planData: CreateDietPlanInput = req.body; // Asumir que la validación ya ocurrió

    // Verificar si professionalId existe (aunque el middleware de auth debería asegurar esto)
    if (!professionalId) {
      res.status(401).json({ message: 'Profesional no autenticado o token inválido.' });
      return;
    }

    // Verificar si el paciente pertenece al profesional
    const patient = await dietService.findPatientByProfessional(patientId, professionalId);

    if (!patient) {
      res.status(404).json({ message: 'Paciente no encontrado o no pertenece a este profesional.' });
      return;
    }

    // Crear el plan de dieta
    const createdPlan = await dietService.createDietPlan(patientId, professionalId, planData);

    // Responder con el plan creado
    res.status(201).json(createdPlan);
  } catch (error) {
    console.error('Error creando plan de dieta:', error);
    next(error); // Pasar errores al middleware de manejo de errores
  }
}; 