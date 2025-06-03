import { CreateDietPlanInput } from '../validations/diet.validations';
import prisma from '../config/db/prisma.client'; // Importar cliente Prisma
import { MealType, DayOfWeek } from '../generated/prisma';

// Helper para encontrar un paciente por ID y profesional ID para la verificación
// Esta función puede ser movida a patient.service si solo es una verificación común
const findPatientByProfessional = async (
  patientId: number,
  professionalId: number
) => {
  return prisma.patient.findFirst({
    where: {
      id: patientId,
      professionalId: professionalId,
      // isDeleted: false, // Asumiendo soft delete si aplica
    },
  });
};

const createDietPlan = async (
  patientId: number,
  professionalId: number,
  planData: CreateDietPlanInput // Usamos el tipo importado de validaciones
) => {
  // Implementación transaccional para crear el plan y sus comidas
  const newDietPlan = await prisma.$transaction(async (tx) => {
    // 1. Crear el plan de dieta
    const createdPlan = await tx.dietPlan.create({
      data: {
        title: planData.title,
        description: planData.description,
        startDate: planData.startDate ? new Date(planData.startDate) : undefined, // Convertir a Date si existe
        endDate: planData.endDate ? new Date(planData.endDate) : undefined, // Convertir a Date si existe
        objectives: planData.objectives,
        isActive: true, // Usar isActive que existe en el schema.prisma en lugar de status
        notes: planData.notes,
        patient: { connect: { id: patientId } },
        professional: { connect: { id: professionalId } },
      },
    });

    // 2. Preparar datos para crear las comidas
    // Asegurarse de que planData.meals no sea null/undefined antes de mapear
    const mealsToCreate = planData.meals ? planData.meals.map(meal => ({
        mealType: meal.mealType as MealType, // Castear directamente al tipo enum importado
        content: meal.content,
        dayOfWeek: meal.dayOfWeek as DayOfWeek, // Castear directamente al tipo enum importado
        dietPlanId: createdPlan.id, // Asociar al plan recién creado
    })) : [];

    // 3. Crear las comidas en lote si hay alguna
    if (mealsToCreate.length > 0) {
        await tx.dietMeal.createMany({
            data: mealsToCreate,
        });
    }

    // 4. Retornar el plan creado (posiblemente con las comidas si el ORM las adjunta o si haces un find)
    // Para asegurar que la respuesta del servicio sea completa, es común hacer un find final.
    const planWithMeals = await tx.dietPlan.findUnique({
        where: { id: createdPlan.id },
        include: {
            meals: {
                orderBy: { dayOfWeek: 'asc', mealType: 'asc' }, // Ordenar comidas si es necesario
            }
        }
    });

    // Verificar si planWithMeals es null (no debería ocurrir en una transacción exitosa de creación)
    if (!planWithMeals) {
        throw new Error('Error interno al recuperar el plan creado.');
    }

    return planWithMeals;
  }); // La transacción se confirma automáticamente si el callback no arroja error

  return newDietPlan; // Retornar el plan completo con comidas
};

export default { findPatientByProfessional, createDietPlan }; 