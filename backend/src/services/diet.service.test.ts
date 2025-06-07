import { describe, it, expect, beforeEach, vi, Mocked } from 'vitest';
// Importa el cliente Prisma TAL COMO LO HACE EL SERVICIO.
// Asumiendo que el servicio importa la instancia de Prisma de aquí:
import prisma from '../config/db/prisma.client';

import dietService from './diet.service';

// Importar tipos necesarios de prisma si se usan en tipados (como Prisma.TransactionClient, PrismaClient)
import { Prisma, PrismaClient } from '@prisma/client';

// Importar DeepMockProxy si vitest-mock-extended está instalado y configurado
// Si no está instalado, la línea de abajo causará un error y necesitaríamos instalarlo
import { type DeepMockProxy } from 'vitest-mock-extended';

// Mockear el módulo que exporta la instancia de Prisma
// Asegúrate de que esta ruta es correcta para donde tu servicio importa `prisma`
vi.mock('../config/db/prisma.client', () => ({
  // La exportación default debe coincidir con la estructura que espera el servicio
  default: {
    patient: {
      findFirst: vi.fn(),
    },
    dietPlan: {
      create: vi.fn(),
      findUnique: vi.fn(),
    },
    dietMeal: {
       createMany: vi.fn(),
    },
    // Mockeamos $transaction para que ejecute el callback con los mismos mocks configurados
    $transaction: vi.fn(),
  },
}));

// Cast the imported prisma client to Mocked<PrismaClient> type
// prismaMock ahora es la instancia mockeada de PrismaClient, no tiene propiedad .default
const prismaMock = prisma as Mocked<PrismaClient>;

// No necesitamos mocks locales para enums si usamos los valores literales o los importamos/tipamos correctamente desde Prisma
// Si persisten errores con enums, podríamos necesitar importar DayOfWeek, MealType si están exportados directamente desde @prisma/client o definirlos localmente de nuevo.

describe('Diet Service', () => {

  beforeEach(() => {
    vi.resetAllMocks(); // Usar resetAllMocks como en patient.service.test.ts
  });

  // Tests for findPatientByProfessional
  describe('findPatientByProfessional', () => {
       it('should return a patient if found and belongs to professional', async () => {
         const mockPatient = { id: 1, professionalId: 10, firstName: 'Test' };
         // Acceder directamente a patient.findFirst en prismaMock
         prismaMock.patient.findFirst.mockResolvedValue(mockPatient);

         const patient = await dietService.findPatientByProfessional(1, 10);

         expect(patient).toEqual(mockPatient);
         // Verificar llamada directa a patient.findFirst
         expect(prismaMock.patient.findFirst).toHaveBeenCalledWith({
           where: {
             id: 1,
             professionalId: 10,
             // isDeleted: false // Añadir si aplica soft-delete y el servicio lo filtra
           },
         });
       });

       it('should return null if patient not found or does not belong to professional', async () => {
         // Acceder directamente a patient.findFirst en prismaMock
         prismaMock.patient.findFirst.mockResolvedValue(null);

         const patient = await dietService.findPatientByProfessional(1, 10);

         expect(patient).toBeNull();
         // Verificar llamada directa a patient.findFirst
         expect(prismaMock.patient.findFirst).toHaveBeenCalledWith({
           where: {
             id: 1,
             professionalId: 10,
            // isDeleted: false // Añadir si aplica soft-delete y el servicio lo filtra
           },
         });
       });
  });


  // Tests for createDietPlan
  describe('createDietPlan', () => {
    const patientId = 1;
    const professionalId = 10;
    // Asegurarse de que la estructura de planData coincida con CreateDietPlanInput
    const planData = {
      title: 'Test Plan',
      description: 'A test description',
      startDate: '2023-10-27',
      endDate: '2023-11-27',
      objectives: 'Gain weight',
      status: 'ACTIVE', // Usar el valor en inglés que espera el enum
      notes: 'Some notes',
      meals: [
        // Usamos los valores literales de string para los enums, ya que Prisma los maneja así en los datos
        // dayOfWeek ahora es una propiedad de DietMeal
        { mealType: 'BREAKFAST', content: 'Oats', dayOfWeek: 'MONDAY' },
        { mealType: 'LUNCH', content: 'Chicken Salad', dayOfWeek: 'MONDAY' },
      ],
    };

    it('should create a diet plan and its meals within a transaction', async () => {
      const mockNewDietPlan = { id: 101, ...planData, patientId, professionalId, meals: [] };

      // Configurar mocks para las operaciones dentro de la transacción
      // Acceder directamente a los métodos de prismaMock
      prismaMock.dietPlan.create.mockResolvedValue(mockNewDietPlan as any); // Usar any o tipado correcto
      prismaMock.dietMeal.createMany.mockResolvedValue({ count: planData.meals.length });
      // Mockear el findUnique final para que devuelva el plan con las comidas creadas
      const mockCreatedPlanWithMeals = {
           ...mockNewDietPlan,
           isActive: true, // Add isActive field for the mock
           meals: planData.meals.map((meal, index) => ({ id: index + 1, ...meal, dietPlanId: mockNewDietPlan.id }))
      }; // Simular el resultado con IDs generados

       // Acceder directamente a dietPlan.findUnique
       prismaMock.dietPlan.findUnique.mockResolvedValue(mockCreatedPlanWithMeals as any);

       // Configurar el mock de $transaction para que ejecute el callback con prismaMock
       prismaMock.$transaction.mockImplementation(async (callback: any) => {
         return await callback(prismaMock);
       });


      const createdPlan = await dietService.createDietPlan(patientId, professionalId, planData as any); // Usar any o tipado correcto

      expect(prismaMock.$transaction).toHaveBeenCalledOnce(); // Verificar que la transacción fue llamada

      // Verificar llamadas dentro de la transacción (al cliente mockeado pasado al callback)
      // NOTA: Con el mock actual de $transaction, las llamadas como prismaMock.dietPlan.create
      // DENTRO del callback de $transaction se registrarán directamente en prismaMock.dietPlan.create.
      // No necesitas verificar `tx.dietPlan.create` específicamente a menos que el mock de $transaction sea más sofisticado.
      expect(prismaMock.dietPlan.create).toHaveBeenCalledOnce();
      expect(prismaMock.dietPlan.create).toHaveBeenCalledWith({
        data: expect.objectContaining({ // Usamos objectContaining para flexibilidad con fechas/campos opcionales
          title: planData.title,
          description: planData.description,
          objectives: planData.objectives,
          isActive: true,
          notes: planData.notes,
          patient: { connect: { id: patientId } },
          professional: { connect: { id: professionalId } },
          // startDate y endDate se convierten a Date objects
        }),
      });

      // Preparar los datos esperados para createMany asegurando tipos correctos para los enums
      const expectedMealsData = planData.meals.map(meal => ({
          mealType: meal.mealType as any, // Castear si los enums de entrada son string literal
          content: meal.content,
          dayOfWeek: meal.dayOfWeek as any, // Castear si los enums de entrada son string literal
          dietPlanId: mockNewDietPlan.id,
      }));

      expect(prismaMock.dietMeal.createMany).toHaveBeenCalledOnce();
      expect(prismaMock.dietMeal.createMany).toHaveBeenCalledWith({
        data: expectedMealsData,
      });

      expect(prismaMock.dietPlan.findUnique).toHaveBeenCalledOnce();
      expect(prismaMock.dietPlan.findUnique).toHaveBeenCalledWith({
        where: { id: mockNewDietPlan.id },
        include: {
           meals: {
              orderBy: [
                { dayOfWeek: 'asc' },
                { mealType: 'asc' }
              ],
           }
        },
      });

      // Expect the plan with status field instead of isActive
      const { isActive, ...planWithoutIsActive } = mockCreatedPlanWithMeals;
      const expectedResult = {
        ...planWithoutIsActive,
        status: 'ACTIVE' // isActive: true maps to status: 'ACTIVE'
      };
      
      expect(createdPlan).toEqual(expectedResult); // Verificar que se devuelve el plan completo con comidas
    });

     it('should handle transaction errors and let them propagate', async () => {
         const transactionError = new Error('DB Error during transaction');

         // Configurar el mock de $transaction para que ejecute el callback con prismaMock
         prismaMock.$transaction.mockImplementation(async (callback: any) => {
           return await callback(prismaMock);
         });

         // Mockear una operación dentro de la transacción para que falle
         // Acceder directamente a dietPlan.create
         prismaMock.dietPlan.create.mockRejectedValue(transactionError);

         // Aserción de que la llamada a la función del servicio lanza el error esperado
         await expect(dietService.createDietPlan(patientId, professionalId, planData as any)).rejects.toThrow('DB Error during transaction');

         expect(prismaMock.$transaction).toHaveBeenCalledOnce(); // Verificar que la transacción fue iniciada
         // No verificamos otras llamadas internas aquí, ya que el mock de $transaction lo abstrae.
         // La prueba se centra en que el servicio inicie la transacción y que los errores se propaguen.
     });

     // TODO: Add more tests for edge cases, like empty meals array if applicable, optional fields, etc.
     // TODO: Add tests for date conversion handling

  });

  // TODO: Add tests for other diet service functions as they are implemented (e.g., getDietPlanById, updateDietPlan, deleteDietPlan)
}); 