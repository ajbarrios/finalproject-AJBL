import { CreateDietPlanInput, UpdateDietPlanInput, DietMealUpdateInput } from '../validations/diet.validations';
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

// Nueva función para obtener un plan de dieta por ID con autorización
const getDietPlanById = async (
  dietPlanId: number,
  professionalId: number
) => {
  // Buscar el plan de dieta e incluir las comidas y información del paciente para autorización
  const dietPlan = await prisma.dietPlan.findUnique({
    where: { 
      id: dietPlanId,
      isDeleted: false // Solo buscar planes no eliminados
    },
    include: {
      meals: {
        orderBy: [
          { dayOfWeek: 'asc' },
          { mealType: 'asc' }
        ]
      },
      patient: {
        select: { professionalId: true }
      }
    }
  });

  // Si no se encuentra el plan, retornar null
  if (!dietPlan) {
    return null;
  }

  // Verificar autorización: el plan debe pertenecer a un paciente del profesional autenticado
  if (dietPlan.patient.professionalId !== professionalId) {
    throw new Error('Acceso no autorizado: el plan no pertenece a este profesional.');
  }

  // Retornar el plan sin la información del paciente y mapear isActive a status
  const { patient, isActive, ...planWithoutPatient } = dietPlan;
  return {
    ...planWithoutPatient,
    status: isActive ? 'ACTIVE' : 'DRAFT' // Mapear isActive boolean a status string
  };
};

// Nueva función para actualizar un plan de dieta existente
const updateDietPlan = async (
  dietPlanId: number,
  professionalId: number,
  updateData: UpdateDietPlanInput
) => {
  // Implementación transaccional para actualizar el plan y sincronizar sus comidas
  const updatedDietPlan = await prisma.$transaction(async (tx) => {
    // 1. Verificar que el plan existe y pertenece al profesional
    const existingPlan = await tx.dietPlan.findUnique({
      where: { 
        id: dietPlanId,
        isDeleted: false // Solo buscar planes no eliminados
      },
      include: {
        patient: { select: { professionalId: true } },
        meals: true
      }
    });

    if (!existingPlan) {
      throw new Error('Plan de dieta no encontrado.');
    }

    if (existingPlan.patient.professionalId !== professionalId) {
      throw new Error('Acceso no autorizado: el plan no pertenece a este profesional.');
    }

    // 2. Actualizar información general del plan (si se proporcionó)
    const planUpdateData: any = {};
    if (updateData.title !== undefined) planUpdateData.title = updateData.title;
    if (updateData.description !== undefined) planUpdateData.description = updateData.description;
    if (updateData.startDate !== undefined) {
      planUpdateData.startDate = updateData.startDate ? new Date(updateData.startDate) : null;
    }
    if (updateData.endDate !== undefined) {
      planUpdateData.endDate = updateData.endDate ? new Date(updateData.endDate) : null;
    }
    if (updateData.objectives !== undefined) planUpdateData.objectives = updateData.objectives;
    if (updateData.status !== undefined) {
      planUpdateData.isActive = updateData.status === 'ACTIVE';
    }
    if (updateData.notes !== undefined) planUpdateData.notes = updateData.notes;

    // Actualizar el plan solo si hay campos a actualizar
    if (Object.keys(planUpdateData).length > 0) {
      await tx.dietPlan.update({
        where: { id: dietPlanId },
        data: planUpdateData
      });
    }

    // 3. Sincronizar comidas si se proporcionaron
    if (updateData.meals !== undefined) {
      const newMeals = updateData.meals;
      const existingMeals = existingPlan.meals;

      // Clasificar comidas según su operación
      const existingMealIds = existingMeals.map(m => m.id);
      const newMealIds = newMeals.filter(m => m.id).map(m => m.id!);

      // Comidas a eliminar: existen en BD pero no en la nueva lista
      const mealsToDelete = existingMealIds.filter(id => !newMealIds.includes(id));

      // Comidas a crear: no tienen ID en la nueva lista
      const mealsToCreate = newMeals.filter(m => !m.id);

      // Comidas a actualizar: tienen ID y existen en BD
      const mealsToUpdate = newMeals.filter(m => m.id && existingMealIds.includes(m.id!));

      // Ejecutar eliminaciones
      if (mealsToDelete.length > 0) {
        await tx.dietMeal.deleteMany({
          where: {
            id: { in: mealsToDelete },
            dietPlanId: dietPlanId // Seguridad adicional
          }
        });
      }

      // Ejecutar actualizaciones
      for (const meal of mealsToUpdate) {
        await tx.dietMeal.update({
          where: { id: meal.id! },
          data: {
            mealType: meal.mealType as MealType,
            content: meal.content,
            dayOfWeek: meal.dayOfWeek as DayOfWeek
          }
        });
      }

      // Ejecutar creaciones
      if (mealsToCreate.length > 0) {
        const mealsData = mealsToCreate.map(meal => ({
          mealType: meal.mealType as MealType,
          content: meal.content,
          dayOfWeek: meal.dayOfWeek as DayOfWeek,
          dietPlanId: dietPlanId
        }));

        await tx.dietMeal.createMany({
          data: mealsData
        });
      }
    }

    // 4. Recuperar el plan actualizado con todas las comidas
    const updatedPlan = await tx.dietPlan.findUnique({
      where: { id: dietPlanId },
      include: {
        meals: {
          orderBy: [
            { dayOfWeek: 'asc' },
            { mealType: 'asc' }
          ]
        }
      }
    });

    if (!updatedPlan) {
      throw new Error('Error interno al recuperar el plan actualizado.');
    }

    // Mapear isActive a status antes de retornar
    const { isActive, ...planWithoutIsActive } = updatedPlan;
    return {
      ...planWithoutIsActive,
      status: isActive ? 'ACTIVE' : 'DRAFT'
    };
  });

  return updatedDietPlan;
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
        isActive: planData.status === 'ACTIVE', // Mapear status a isActive: 'ACTIVE' -> true, 'DRAFT' -> false
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
                orderBy: [
                    { dayOfWeek: 'asc' },
                    { mealType: 'asc' }
                ],
            }
        }
    });

    // Verificar si planWithMeals es null (no debería ocurrir en una transacción exitosa de creación)
    if (!planWithMeals) {
        throw new Error('Error interno al recuperar el plan creado.');
    }

    // Mapear isActive a status antes de retornar
    const { isActive, ...planWithoutIsActive } = planWithMeals;
    return {
      ...planWithoutIsActive,
      status: isActive ? 'ACTIVE' : 'DRAFT' // Mapear isActive boolean a status string
    };
  }); // La transacción se confirma automáticamente si el callback no arroja error

  return newDietPlan; // Retornar el plan completo con comidas
};

// Nueva función para eliminar (soft delete) un plan de dieta
const deleteDietPlan = async (
  dietPlanId: number,
  professionalId: number
): Promise<void> => {
  // Buscar el plan de dieta e incluir información del paciente para autorización
  const dietPlan = await prisma.dietPlan.findUnique({
    where: { 
      id: dietPlanId,
      isDeleted: false // Solo buscar planes no eliminados
    },
    include: {
      patient: {
        select: { professionalId: true }
      }
    }
  });

  // Si no se encuentra el plan o ya está eliminado, lanzar error
  if (!dietPlan) {
    throw new Error('Plan de dieta no encontrado.');
  }

  // Verificar autorización: el plan debe pertenecer a un paciente del profesional autenticado
  if (dietPlan.patient.professionalId !== professionalId) {
    throw new Error('Acceso no autorizado: el plan no pertenece a este profesional.');
  }

  // Realizar soft delete: marcar como eliminado
  await prisma.dietPlan.update({
    where: { id: dietPlanId },
    data: {
      isDeleted: true,
      deletedAt: new Date()
    }
  });

  // No retornamos nada, la función es void
};

export default { 
  findPatientByProfessional, 
  createDietPlan, 
  getDietPlanById,
  updateDietPlan,
  deleteDietPlan
}; 