import prisma from '../config/db/prisma.client'; // Importar cliente Prisma
import { Patient, BiometricRecord, DietPlan, WorkoutPlan } from '../generated/prisma'; // Importar los tipos necesarios generados

/**
 * Obtiene los pacientes para un profesional específico, con opción de búsqueda.
 * @param professionalId El ID del profesional.
 * @param searchQuery Término de búsqueda opcional para filtrar por nombre, apellido o email.
 * @returns Una promesa que resuelve a un array de pacientes.
 */
export const getPatientsForProfessional = async (
  professionalId: number, // Asumiendo que professionalId es numérico según el schema
  searchQuery?: string
): Promise<Patient[]> => {
  try {
    const whereClause: any = {
      professionalId: professionalId,
      // Como no hay soft delete en el schema actual, no filtramos por is_deleted
    };

    if (searchQuery && searchQuery.trim() !== '') {
      const searchCondition = {
        contains: searchQuery.trim(),
        mode: 'insensitive', // Búsqueda case-insensitive
      };
      whereClause.OR = [
        { firstName: searchCondition },
        { lastName: searchCondition },
        { email: searchCondition }, // email es String? en el schema, Prisma maneja esto bien
      ];
    }

    const patients = await prisma.patient.findMany({
      where: whereClause,
      orderBy: {
        createdAt: 'desc', // Orden por defecto: más recientes primero
      },
      // Aquí podríamos añadir `include` o `select` si queremos dar forma a la respuesta
      // de manera diferente al modelo Patient completo, pero por ahora devolvemos el modelo completo.
    });

    return patients;
  } catch (error) {
    // Podríamos tener un logger más sofisticado aquí
    console.error(`Error en getPatientsForProfessional: ${error}`);
    // Relanzar el error para que el controlador lo maneje y envíe una respuesta HTTP adecuada
    throw error; 
  }
};

/**
 * Obtiene los detalles completos de un paciente para un profesional específico.
 * Incluye el último registro biométrico y resúmenes de planes.
 * @param professionalId El ID del profesional autenticado.
 * @param patientId El ID del paciente solicitado.
 * @returns Una promesa que resuelve a los detalles del paciente o null si no se encuentra o no pertenece al profesional.
 */
export const getPatientDetailsForProfessional = async (
  professionalId: number,
  patientId: number
): Promise<(Patient & { lastBiometricRecord: BiometricRecord | null, dietPlansSummary: Partial<DietPlan>[], workoutPlansSummary: Partial<WorkoutPlan>[] }) | null> => {
  try {
    // 1. Obtener el paciente y verificar propiedad
    const patient = await prisma.patient.findFirst({
      where: {
        id: patientId,
        professionalId: professionalId,
        // Considerar añadir filtro de soft delete aquí si aplica
      },
      // Incluir campos si queremos dar forma a la respuesta más allá del modelo base
    });

    // Si el paciente no existe o no pertenece a este profesional, retornar null
    if (!patient) {
      return null;
    }

    // 2. Obtener el último registro biométrico
    const lastBiometricRecord = await prisma.biometricRecord.findFirst({
      where: {
        patientId: patientId,
      },
      orderBy: [
        { recordDate: 'desc' },
        { createdAt: 'desc' },
      ],
      take: 1,
    });

    // 3. Obtener resúmenes de planes de dieta
    const dietPlansSummary = await prisma.dietPlan.findMany({
      where: {
        patientId: patientId,
        // Considerar añadir filtro de soft delete si aplica
      },
      select: {
        id: true,
        title: true,
        isActive: true,
        startDate: true,
        endDate: true,
      },
      orderBy: {
        startDate: 'desc', // O según el criterio deseado
      },
    });

    // 4. Obtener resúmenes de planes de entrenamiento
    const workoutPlansSummary = await prisma.workoutPlan.findMany({
      where: {
        patientId: patientId,
        // Considerar añadir filtro de soft delete si aplica
      },
      select: {
        id: true,
        title: true,
        isActive: true,
        startDate: true,
        endDate: true,
      },
      orderBy: {
        startDate: 'desc', // O según el criterio deseado
      },
    });

    // 5. Combinar y retornar los resultados
    return {
      ...patient,
      lastBiometricRecord: lastBiometricRecord || null, // Asegurar que sea null si no se encuentra
      dietPlansSummary: dietPlansSummary,
      workoutPlansSummary: workoutPlansSummary,
    };

  } catch (error) {
    console.error(`Error en getPatientDetailsForProfessional: ${error}`);
    throw error;
  }
}; 