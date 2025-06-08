import { Request, Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../../middleware/auth.middleware'; // Ajusta la ruta si es necesario
import dietService from '../../services/diet.service';
import { CreateDietPlanInput, UpdateDietPlanInput, updateDietPlanSchema } from '../../validations/diet.validations'; // Actualizar la ruta de importación a la ubicación unificada

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

// Nueva función para obtener un plan de dieta por ID
export const getDietPlanById = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const dietPlanId = parseInt(req.params.dietPlanId, 10);
    const professionalId = req.professional?.professionalId;

    // Verificar si professionalId existe
    if (!professionalId) {
      res.status(401).json({ message: 'Profesional no autenticado o token inválido.' });
      return;
    }

    // Validar que dietPlanId sea un número válido
    if (isNaN(dietPlanId) || dietPlanId <= 0) {
      res.status(400).json({ message: 'ID del plan de dieta inválido.' });
      return;
    }

    // Obtener el plan de dieta con autorización
    const dietPlan = await dietService.getDietPlanById(dietPlanId, professionalId);

    // Si el plan no existe
    if (!dietPlan) {
      res.status(404).json({ message: 'Plan de dieta no encontrado.' });
      return;
    }

    // Responder con el plan encontrado
    res.status(200).json(dietPlan);
  } catch (error) {
    // Manejar error de autorización específicamente
    if (error instanceof Error && error.message.includes('Acceso no autorizado')) {
      res.status(403).json({ message: 'No tienes permisos para acceder a este plan de dieta.' });
      return;
    }

    console.error('Error obteniendo plan de dieta:', error);
    next(error); // Pasar errores al middleware de manejo de errores
  }
};

// Nueva función para actualizar un plan de dieta existente
export const updateDietPlan = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const dietPlanId = parseInt(req.params.dietPlanId, 10);
    const professionalId = req.professional?.professionalId;

    // Verificar si professionalId existe
    if (!professionalId) {
      res.status(401).json({ message: 'Profesional no autenticado o token inválido.' });
      return;
    }

    // Validar que dietPlanId sea un número válido
    if (isNaN(dietPlanId) || dietPlanId <= 0) {
      res.status(400).json({ message: 'ID del plan de dieta inválido.' });
      return;
    }

    // Validar los datos de entrada usando el schema de actualización
    const validation = updateDietPlanSchema.safeParse(req.body);
    if (!validation.success) {
      res.status(400).json({ 
        message: 'Error de validación en los datos proporcionados.',
        errors: validation.error.issues.map(issue => ({
          field: issue.path.join('.') || 'root',
          message: issue.message
        }))
      });
      return;
    }

    const updateData: UpdateDietPlanInput = validation.data;

    // Actualizar el plan de dieta
    const updatedPlan = await dietService.updateDietPlan(dietPlanId, professionalId, updateData);

    // Responder con el plan actualizado en formato estructurado
    res.status(200).json({
      message: 'Plan de dieta actualizado exitosamente.',
      data: updatedPlan
    });
  } catch (error) {
    // Manejar errores específicos
    if (error instanceof Error) {
      if (error.message.includes('Plan de dieta no encontrado')) {
        res.status(404).json({ message: 'Plan de dieta no encontrado.' });
        return;
      }
      
      if (error.message.includes('Acceso no autorizado')) {
        res.status(403).json({ message: 'No tienes permisos para actualizar este plan de dieta.' });
        return;
      }
    }

    console.error('Error actualizando plan de dieta:', error);
    res.status(500).json({ message: 'Error interno del servidor.' });
    return;
  }
};

// Nueva función para eliminar un plan de dieta (soft delete)
export const deleteDietPlan = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const dietPlanId = parseInt(req.params.dietPlanId, 10);
    const professionalId = req.professional?.professionalId;

    // Verificar si professionalId existe
    if (!professionalId) {
      res.status(401).json({ message: 'Profesional no autenticado o token inválido.' });
      return;
    }

    // Validar que dietPlanId sea un número válido
    if (isNaN(dietPlanId) || dietPlanId <= 0) {
      res.status(400).json({ message: 'ID del plan de dieta inválido.' });
      return;
    }

    // Eliminar el plan de dieta (soft delete)
    await dietService.deleteDietPlan(dietPlanId, professionalId);

    // Responder con éxito (204 No Content es apropiado para eliminaciones exitosas)
    res.status(204).send();
  } catch (error) {
    // Manejar errores específicos
    if (error instanceof Error) {
      if (error.message.includes('Plan de dieta no encontrado')) {
        res.status(404).json({ message: 'Plan de dieta no encontrado.' });
        return;
      }
      
      if (error.message.includes('Acceso no autorizado')) {
        res.status(403).json({ message: 'No tienes permisos para eliminar este plan de dieta.' });
        return;
      }
    }

    console.error('Error eliminando plan de dieta:', error);
    res.status(500).json({ message: 'Error interno del servidor.' });
    return;
  }
}; 