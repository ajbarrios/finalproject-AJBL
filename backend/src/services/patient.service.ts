import prisma from '../config/db/prisma.client'; // Importar cliente Prisma
import { Patient } from '../generated/prisma'; // Importar el tipo Patient generado

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