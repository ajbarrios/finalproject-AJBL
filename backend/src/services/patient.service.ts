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

/**
 * Crea un nuevo paciente para un profesional específico y opcionalmente añade un registro biométrico inicial.
 * @param professionalId El ID del profesional autenticado.
 * @param patientData Los datos del paciente a crear.
 * @param initialBiometrics Datos biométricos iniciales opcionales.
 * @returns Una promesa que resuelve al objeto del paciente creado.
 */
export const createPatientForProfessional = async (
  professionalId: number,
  patientData: {
    firstName: string;
    lastName: string;
    email?: string | null;
    phone?: string | null;
    birthDate?: Date | null;
    gender?: string | null;
    height?: number | null;
    medicalNotes?: string | null;
    dietRestrictions?: string | null;
    objectives?: string | null;
  },
  initialBiometrics?: {
    recordDate?: Date | null;
    weight?: number | null;
    bodyFatPercentage?: number | null;
    musclePercentage?: number | null;
    waterPercentage?: number | null;
    backChestDiameter?: number | null;
    waistDiameter?: number | null;
    armsDiameter?: number | null;
    legsDiameter?: number | null;
    calvesDiameter?: number | null;
    notes?: string | null;
  } | null
): Promise<Patient> => {
  try {
    // Usar una transacción para asegurar que ambas creaciones (paciente y biométrico) sean atómicas
    const result = await prisma.$transaction(async (prisma) => {
      // 1. Crear el paciente
      const createdPatient = await prisma.patient.create({
        data: {
          ...patientData,
          professionalId: professionalId, // Asociar el paciente al profesional
          // Los campos createdAt y updatedAt se llenan automáticamente por Prisma
        },
      });

      // 2. Si hay datos biométricos iniciales, crear el registro
      if (initialBiometrics) {
        // Asegurarse de que recordDate sea una fecha válida o la fecha actual si no se provee
        const recordDate = initialBiometrics.recordDate instanceof Date && !isNaN(initialBiometrics.recordDate.getTime())
                           ? initialBiometrics.recordDate
                           : new Date(); // Usar fecha actual si recordDate es null o inválido

        await prisma.biometricRecord.create({
          data: {
            ...initialBiometrics,
            patientId: createdPatient.id, // Asociar el registro biométrico al paciente creado
            recordDate: recordDate, // Usar la fecha validada/determinada
            // El campo createdAt se llena automáticamente por Prisma
            // Eliminamos patientId y recordDate si venían en initialBiometrics para evitar duplicados en el 'data' spread
            // Nota: El spread ...initialBiometrics incluirá todos los campos, así que sobreescribimos patientId y recordDate
            // asegurando que sean los correctos.
          },
        });
      }

      return createdPatient; // Retornar el paciente creado (se usará si la transacción es exitosa)
    });

    return result; // Retornar el paciente creado de la transacción

  } catch (error) {
    console.error(`Error en createPatientForProfessional: ${error}`);
    // Relanzar el error para que el controlador lo maneje
    throw error;
  }
};

// Aquí se añadirán otras funciones del servicio (updatePatient, deletePatient, etc.)
// ... existing code ... 