import { vi, describe, it, expect, beforeEach, afterEach, MockedFunction } from 'vitest';
import { CreateDietPlanInput, UpdateDietPlanInput } from '../../../src/validations/diet.validations';
import { mockDeep, mockReset } from 'vitest-mock-extended';
import type { PrismaClient } from '@prisma/client';

// Mock the module that exports the Prisma client using factory function
vi.mock('../../../src/config/db/prisma.client', () => ({
  default: mockDeep<PrismaClient>(),
}));

// Import after mocking
import dietService from '../../../src/services/diet.service';
import prisma from '../../../src/config/db/prisma.client';

// Get the mocked prisma instance
const prismaMock = prisma as any;

describe('Diet Service', () => {
  beforeEach(() => {
    mockReset(prismaMock);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('findPatientByProfessional', () => {
    it('should find a patient belonging to the professional', async () => {
      const mockPatient = {
        id: 19,
        professionalId: 1,
        firstName: 'Test',
        lastName: 'Patient',
        email: 'test@example.com'
      };

      prismaMock.patient.findFirst.mockResolvedValue(mockPatient);

      const result = await dietService.findPatientByProfessional(19, 1);

      expect(prismaMock.patient.findFirst).toHaveBeenCalledWith({
        where: {
          id: 19,
          professionalId: 1,
        },
      });
      expect(result).toEqual(mockPatient);
    });

    it('should return null if patient not found', async () => {
      prismaMock.patient.findFirst.mockResolvedValue(null);

      const result = await dietService.findPatientByProfessional(99, 1);

      expect(prismaMock.patient.findFirst).toHaveBeenCalledWith({
        where: {
          id: 99,
          professionalId: 1,
        },
      });
      expect(result).toBeNull();
    });

    it('should return null if patient belongs to different professional', async () => {
      prismaMock.patient.findFirst.mockResolvedValue(null);

      const result = await dietService.findPatientByProfessional(19, 2);

      expect(prismaMock.patient.findFirst).toHaveBeenCalledWith({
        where: {
          id: 19,
          professionalId: 2,
        },
      });
      expect(result).toBeNull();
    });

    it('should handle database errors', async () => {
      const dbError = new Error('Database connection failed');
      prismaMock.patient.findFirst.mockRejectedValue(dbError);

      await expect(dietService.findPatientByProfessional(19, 1)).rejects.toThrow('Database connection failed');
    });
  });

  describe('createDietPlan', () => {
    const mockPlanData: CreateDietPlanInput = {
      title: 'Plan de Pérdida de Peso',
      description: 'Descripción del plan',
      startDate: '2025-06-01',
      endDate: '2025-06-30',
      objectives: 'Perder 5kg',
      status: 'ACTIVE',
      notes: 'Notas importantes',
      meals: [
        {
          mealType: 'BREAKFAST',
          content: 'Avena con frutas',
          dayOfWeek: 'MONDAY'
        },
        {
          mealType: 'LUNCH',
          content: 'Ensalada con proteína',
          dayOfWeek: 'MONDAY'
        }
      ]
    };

    const mockCreatedPlan = {
      id: 101,
      title: 'Plan de Pérdida de Peso',
      description: 'Descripción del plan',
      startDate: new Date('2025-06-01'),
      endDate: new Date('2025-06-30'),
      objectives: 'Perder 5kg',
      isActive: true,
      notes: 'Notas importantes',
      patientId: 19,
      professionalId: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const mockPlanWithMeals = {
      ...mockCreatedPlan,
      meals: [
        {
          id: 1,
          mealType: 'BREAKFAST',
          content: 'Avena con frutas',
          dayOfWeek: 'MONDAY',
          dietPlanId: 101,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 2,
          mealType: 'LUNCH',
          content: 'Ensalada con proteína',
          dayOfWeek: 'MONDAY',
          dietPlanId: 101,
          createdAt: new Date(),
          updatedAt: new Date(),
        }
      ]
    };

    it('should create a diet plan with meals successfully', async () => {
      // Mock transaction callback execution
      const mockTransaction = vi.fn().mockImplementation(async (callback) => {
        const tx = {
          dietPlan: {
            create: vi.fn().mockResolvedValue(mockCreatedPlan),
            findUnique: vi.fn().mockResolvedValue(mockPlanWithMeals),
          },
          dietMeal: {
            createMany: vi.fn().mockResolvedValue({ count: 2 }),
          },
        };
        return await callback(tx);
      });

      prismaMock.$transaction.mockImplementation(mockTransaction);

      const result = await dietService.createDietPlan(19, 1, mockPlanData);

      expect(prismaMock.$transaction).toHaveBeenCalledTimes(1);
      
      // Expected result should have status instead of isActive
      const { isActive, ...expectedWithoutIsActive } = mockPlanWithMeals;
      const expectedResult = {
        ...expectedWithoutIsActive,
        status: 'ACTIVE' // isActive: true maps to status: 'ACTIVE'
      };
      
      expect(result).toEqual(expectedResult);
    });

    it('should create diet plan with correct data mapping', async () => {
      let capturedCreateData: any;
      let capturedMealsData: any;

      const mockTransaction = vi.fn().mockImplementation(async (callback) => {
        const tx = {
          dietPlan: {
            create: vi.fn().mockImplementation((data) => {
              capturedCreateData = data;
              return Promise.resolve(mockCreatedPlan);
            }),
            findUnique: vi.fn().mockResolvedValue(mockPlanWithMeals),
          },
          dietMeal: {
            createMany: vi.fn().mockImplementation((data) => {
              capturedMealsData = data;
              return Promise.resolve({ count: 2 });
            }),
          },
        };
        return await callback(tx);
      });

      prismaMock.$transaction.mockImplementation(mockTransaction);

      await dietService.createDietPlan(19, 1, mockPlanData);

      // Verify diet plan creation data
      expect(capturedCreateData.data).toEqual({
        title: 'Plan de Pérdida de Peso',
        description: 'Descripción del plan',
        startDate: new Date('2025-06-01'),
        endDate: new Date('2025-06-30'),
        objectives: 'Perder 5kg',
        isActive: true, // status 'ACTIVE' mapped to isActive: true
        notes: 'Notas importantes',
        patient: { connect: { id: 19 } },
        professional: { connect: { id: 1 } },
      });

      // Verify meals creation data
      expect(capturedMealsData.data).toEqual([
        {
          mealType: 'BREAKFAST',
          content: 'Avena con frutas',
          dayOfWeek: 'MONDAY',
          dietPlanId: 101,
        },
        {
          mealType: 'LUNCH',
          content: 'Ensalada con proteína',
          dayOfWeek: 'MONDAY',
          dietPlanId: 101,
        }
      ]);
    });

    it('should handle DRAFT status correctly', async () => {
      const draftPlanData = { ...mockPlanData, status: 'DRAFT' as const };
      let capturedCreateData: any;

      const mockTransaction = vi.fn().mockImplementation(async (callback) => {
        const tx = {
          dietPlan: {
            create: vi.fn().mockImplementation((data) => {
              capturedCreateData = data;
              return Promise.resolve({ ...mockCreatedPlan, isActive: false });
            }),
            findUnique: vi.fn().mockResolvedValue({ ...mockPlanWithMeals, isActive: false }),
          },
          dietMeal: {
            createMany: vi.fn().mockResolvedValue({ count: 2 }),
          },
        };
        return await callback(tx);
      });

      prismaMock.$transaction.mockImplementation(mockTransaction);

      const result = await dietService.createDietPlan(19, 1, draftPlanData);

      expect(capturedCreateData.data.isActive).toBe(false);
      expect(result.status).toBe('DRAFT'); // Check that the returned result has correct status
    });

    it('should handle plans without meals', async () => {
      const planDataWithoutMeals = { ...mockPlanData, meals: [] };

      const mockTransaction = vi.fn().mockImplementation(async (callback) => {
        const tx = {
          dietPlan: {
            create: vi.fn().mockResolvedValue(mockCreatedPlan),
            findUnique: vi.fn().mockResolvedValue({ ...mockCreatedPlan, meals: [] }),
          },
          dietMeal: {
            createMany: vi.fn(),
          },
        };
        return await callback(tx);
      });

      prismaMock.$transaction.mockImplementation(mockTransaction);

      const result = await dietService.createDietPlan(19, 1, planDataWithoutMeals);

      expect(result.meals).toEqual([]);
      expect(result.status).toBe('ACTIVE'); // Check status mapping
      
      // Verify createMany was not called since there are no meals
      const transactionCallback = prismaMock.$transaction.mock.calls[0][0];
      const mockTx = {
        dietPlan: { create: vi.fn().mockResolvedValue(mockCreatedPlan), findUnique: vi.fn().mockResolvedValue({ ...mockCreatedPlan, meals: [] }) },
        dietMeal: { createMany: vi.fn() }
      };
      await transactionCallback(mockTx);
      expect(mockTx.dietMeal.createMany).not.toHaveBeenCalled();
    });

    it('should handle optional fields correctly', async () => {
      const minimalPlanData: CreateDietPlanInput = {
        title: 'Plan Mínimo',
        status: 'ACTIVE',
        meals: [
          {
            mealType: 'BREAKFAST',
            content: 'Contenido mínimo',
            dayOfWeek: 'MONDAY'
          }
        ]
      };

      let capturedCreateData: any;

      const mockTransaction = vi.fn().mockImplementation(async (callback) => {
        const tx = {
          dietPlan: {
            create: vi.fn().mockImplementation((data) => {
              capturedCreateData = data;
              return Promise.resolve(mockCreatedPlan);
            }),
            findUnique: vi.fn().mockResolvedValue(mockPlanWithMeals),
          },
          dietMeal: {
            createMany: vi.fn().mockResolvedValue({ count: 1 }),
          },
        };
        return await callback(tx);
      });

      prismaMock.$transaction.mockImplementation(mockTransaction);

      await dietService.createDietPlan(19, 1, minimalPlanData);

      expect(capturedCreateData.data).toEqual({
        title: 'Plan Mínimo',
        description: undefined,
        startDate: undefined,
        endDate: undefined,
        objectives: undefined,
        isActive: true, // default status is ACTIVE
        notes: undefined,
        patient: { connect: { id: 19 } },
        professional: { connect: { id: 1 } },
      });
    });

    it('should handle date string conversion', async () => {
      let capturedCreateData: any;

      const mockTransaction = vi.fn().mockImplementation(async (callback) => {
        const tx = {
          dietPlan: {
            create: vi.fn().mockImplementation((data) => {
              capturedCreateData = data;
              return Promise.resolve(mockCreatedPlan);
            }),
            findUnique: vi.fn().mockResolvedValue(mockPlanWithMeals),
          },
          dietMeal: {
            createMany: vi.fn().mockResolvedValue({ count: 2 }),
          },
        };
        return await callback(tx);
      });

      prismaMock.$transaction.mockImplementation(mockTransaction);

      await dietService.createDietPlan(19, 1, mockPlanData);

      expect(capturedCreateData.data.startDate).toEqual(new Date('2025-06-01'));
      expect(capturedCreateData.data.endDate).toEqual(new Date('2025-06-30'));
    });

    it('should throw error if plan not found after creation', async () => {
      const mockTransaction = vi.fn().mockImplementation(async (callback) => {
        const tx = {
          dietPlan: {
            create: vi.fn().mockResolvedValue(mockCreatedPlan),
            findUnique: vi.fn().mockResolvedValue(null), // Plan not found
          },
          dietMeal: {
            createMany: vi.fn().mockResolvedValue({ count: 2 }),
          },
        };
        return await callback(tx);
      });

      prismaMock.$transaction.mockImplementation(mockTransaction);

      await expect(dietService.createDietPlan(19, 1, mockPlanData))
        .rejects.toThrow('Error interno al recuperar el plan creado.');
    });

    it('should handle database errors during transaction', async () => {
      const dbError = new Error('Transaction failed');
      prismaMock.$transaction.mockRejectedValue(dbError);

      await expect(dietService.createDietPlan(19, 1, mockPlanData))
        .rejects.toThrow('Transaction failed');
    });

    it('should handle errors during plan creation', async () => {
      const mockTransaction = vi.fn().mockImplementation(async (callback) => {
        const tx = {
          dietPlan: {
            create: vi.fn().mockRejectedValue(new Error('Plan creation failed')),
            findUnique: vi.fn(),
          },
          dietMeal: {
            createMany: vi.fn(),
          },
        };
        return await callback(tx);
      });

      prismaMock.$transaction.mockImplementation(mockTransaction);

      await expect(dietService.createDietPlan(19, 1, mockPlanData))
        .rejects.toThrow('Plan creation failed');
    });

    it('should handle errors during meals creation', async () => {
      const mockTransaction = vi.fn().mockImplementation(async (callback) => {
        const tx = {
          dietPlan: {
            create: vi.fn().mockResolvedValue(mockCreatedPlan),
            findUnique: vi.fn(),
          },
          dietMeal: {
            createMany: vi.fn().mockRejectedValue(new Error('Meals creation failed')),
          },
        };
        return await callback(tx);
      });

      prismaMock.$transaction.mockImplementation(mockTransaction);

      await expect(dietService.createDietPlan(19, 1, mockPlanData))
        .rejects.toThrow('Meals creation failed');
    });
  });

  describe('getDietPlanById', () => {
    const mockDietPlan = {
      id: 101,
      title: 'Plan de Pérdida de Peso',
      description: 'Descripción del plan',
      startDate: new Date('2025-06-01'),
      endDate: new Date('2025-06-30'),
      objectives: 'Perder 5kg',
      isActive: true,
      notes: 'Notas importantes',
      patientId: 19,
      professionalId: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
      meals: [
        {
          id: 1,
          mealType: 'BREAKFAST',
          content: 'Avena con frutas',
          dayOfWeek: 'MONDAY',
          dietPlanId: 101,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 2,
          mealType: 'LUNCH',
          content: 'Ensalada con proteína',
          dayOfWeek: 'MONDAY',
          dietPlanId: 101,
          createdAt: new Date(),
          updatedAt: new Date(),
        }
      ],
      patient: {
        professionalId: 1
      }
    };

    it('should return diet plan with meals for authorized professional', async () => {
      prismaMock.dietPlan.findUnique.mockResolvedValue(mockDietPlan);

      const result = await dietService.getDietPlanById(101, 1);

      expect(prismaMock.dietPlan.findUnique).toHaveBeenCalledWith({
        where: { id: 101 },
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

      // Verify the result doesn't include patient data and has status instead of isActive
      const { patient, isActive, ...planWithoutPatientAndIsActive } = mockDietPlan;
      const expectedResult = {
        ...planWithoutPatientAndIsActive,
        status: 'ACTIVE' // isActive: true maps to status: 'ACTIVE'
      };
      expect(result).toEqual(expectedResult);
    });

    it('should return null if diet plan not found', async () => {
      prismaMock.dietPlan.findUnique.mockResolvedValue(null);

      const result = await dietService.getDietPlanById(999, 1);

      expect(prismaMock.dietPlan.findUnique).toHaveBeenCalledWith({
        where: { id: 999 },
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

      expect(result).toBeNull();
    });

    it('should throw authorization error if plan belongs to different professional', async () => {
      const unauthorizedPlan = {
        ...mockDietPlan,
        patient: {
          professionalId: 2 // Different professional
        }
      };

      prismaMock.dietPlan.findUnique.mockResolvedValue(unauthorizedPlan);

      await expect(dietService.getDietPlanById(101, 1))
        .rejects.toThrow('Acceso no autorizado: el plan no pertenece a este profesional.');

      expect(prismaMock.dietPlan.findUnique).toHaveBeenCalledWith({
        where: { id: 101 },
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
    });

    it('should return plan without meals if no meals exist', async () => {
      const planWithoutMeals = {
        ...mockDietPlan,
        meals: []
      };

      prismaMock.dietPlan.findUnique.mockResolvedValue(planWithoutMeals);

      const result = await dietService.getDietPlanById(101, 1);

      const { patient, isActive, ...planWithoutPatientAndIsActive } = planWithoutMeals;
      const expectedResult = {
        ...planWithoutPatientAndIsActive,
        status: 'ACTIVE' // isActive: true maps to status: 'ACTIVE'
      };
      expect(result).toEqual(expectedResult);
      expect(result?.meals).toEqual([]);
    });

    it('should handle database errors', async () => {
      const dbError = new Error('Database connection failed');
      prismaMock.dietPlan.findUnique.mockRejectedValue(dbError);

      await expect(dietService.getDietPlanById(101, 1))
        .rejects.toThrow('Database connection failed');
    });

    it('should verify meals are ordered correctly', async () => {
      prismaMock.dietPlan.findUnique.mockResolvedValue(mockDietPlan);

      await dietService.getDietPlanById(101, 1);

      expect(prismaMock.dietPlan.findUnique).toHaveBeenCalledWith({
        where: { id: 101 },
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
    });

    it('should work with different professional IDs', async () => {
      const planForDifferentProfessional = {
        ...mockDietPlan,
        patient: {
          professionalId: 5
        }
      };

      prismaMock.dietPlan.findUnique.mockResolvedValue(planForDifferentProfessional);

      const result = await dietService.getDietPlanById(101, 5);

      const { patient, isActive, ...planWithoutPatientAndIsActive } = planForDifferentProfessional;
      const expectedResult = {
        ...planWithoutPatientAndIsActive,
        status: 'ACTIVE' // isActive: true maps to status: 'ACTIVE'
      };
      expect(result).toEqual(expectedResult);
    });
  });

  // Tests para updateDietPlan (TB-014)
  describe('updateDietPlan', () => {
    const mockExistingPlan = {
      id: 101,
      title: 'Plan Original',
      description: 'Descripción original',
      startDate: new Date('2025-06-01'),
      endDate: new Date('2025-06-30'),
      objectives: 'Objetivos originales',
      isActive: true,
      notes: 'Notas originales',
      patientId: 19,
      professionalId: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
      patient: {
        professionalId: 1
      },
      meals: [
        {
          id: 1,
          mealType: 'BREAKFAST',
          content: 'Desayuno original',
          dayOfWeek: 'MONDAY',
          dietPlanId: 101,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 2,
          mealType: 'LUNCH',
          content: 'Almuerzo original',
          dayOfWeek: 'MONDAY',
          dietPlanId: 101,
          createdAt: new Date(),
          updatedAt: new Date(),
        }
      ]
    };

    const mockUpdatedPlan = {
      id: 101,
      title: 'Plan Actualizado',
      description: 'Nueva descripción',
      startDate: new Date('2025-07-01'),
      endDate: new Date('2025-07-31'),
      objectives: 'Nuevos objetivos',
      isActive: false,
      notes: 'Nuevas notas',
      patientId: 19,
      professionalId: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
      meals: [
        {
          id: 1,
          mealType: 'BREAKFAST',
          content: 'Desayuno actualizado',
          dayOfWeek: 'TUESDAY',
          dietPlanId: 101,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 3, // Nueva comida
          mealType: 'DINNER',
          content: 'Nueva cena',
          dayOfWeek: 'TUESDAY',
          dietPlanId: 101,
          createdAt: new Date(),
          updatedAt: new Date(),
        }
      ]
    };

    it('should update plan information only when no meals provided', async () => {
      const updateData: UpdateDietPlanInput = {
        title: 'Plan Actualizado',
        description: 'Nueva descripción',
        status: 'DRAFT'
      };

      const expectedUpdatedPlan = {
        ...mockUpdatedPlan,
        title: 'Plan Actualizado',
        description: 'Nueva descripción',
        isActive: false,
        meals: mockExistingPlan.meals // Sin cambios en comidas
      };

      const mockTransaction = vi.fn(async (callback: any) => {
        const tx = {
          dietPlan: {
            findUnique: vi.fn()
              .mockResolvedValueOnce(mockExistingPlan) // Primera llamada - verificar existencia
              .mockResolvedValueOnce(expectedUpdatedPlan), // Segunda llamada - recuperar plan actualizado
            update: vi.fn().mockResolvedValue({}),
          },
        };
        return await callback(tx);
      });

      prismaMock.$transaction.mockImplementation(mockTransaction);

      const result = await dietService.updateDietPlan(101, 1, updateData);

      expect(result.title).toBe('Plan Actualizado');
      expect(result.description).toBe('Nueva descripción');
      expect(result.status).toBe('DRAFT');
    });

    it('should throw error if plan not found', async () => {
      const updateData: UpdateDietPlanInput = {
        title: 'Plan que no existe'
      };

      const mockTransaction = vi.fn(async (callback: any) => {
        const tx = {
          dietPlan: {
            findUnique: vi.fn().mockResolvedValue(null),
          },
        };
        return await callback(tx);
      });

      prismaMock.$transaction.mockImplementation(mockTransaction);

      await expect(dietService.updateDietPlan(999, 1, updateData))
        .rejects.toThrow('Plan de dieta no encontrado.');
    });

    it('should throw authorization error if plan belongs to different professional', async () => {
      const updateData: UpdateDietPlanInput = {
        title: 'Plan no autorizado'
      };

      const unauthorizedPlan = {
        ...mockExistingPlan,
        patient: {
          professionalId: 2 // Diferente profesional
        }
      };

      const mockTransaction = vi.fn(async (callback: any) => {
        const tx = {
          dietPlan: {
            findUnique: vi.fn().mockResolvedValue(unauthorizedPlan),
          },
        };
        return await callback(tx);
      });

      prismaMock.$transaction.mockImplementation(mockTransaction);

      await expect(dietService.updateDietPlan(101, 1, updateData))
        .rejects.toThrow('Acceso no autorizado: el plan no pertenece a este profesional.');
    });

    it('should update only meals when only meals provided', async () => {
      const updateData: UpdateDietPlanInput = {
        meals: [
          {
            id: 1,
            mealType: 'BREAKFAST',
            content: 'Desayuno actualizado',
            dayOfWeek: 'TUESDAY'
          },
          {
            // Nueva comida sin ID
            mealType: 'DINNER',
            content: 'Nueva cena',
            dayOfWeek: 'TUESDAY'
          }
        ]
      };

      const expectedPlanWithUpdatedMeals = {
        ...mockExistingPlan,
        meals: [
          {
            id: 1,
            mealType: 'BREAKFAST',
            content: 'Desayuno actualizado',
            dayOfWeek: 'TUESDAY',
            dietPlanId: 101,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          {
            id: 3,
            mealType: 'DINNER',
            content: 'Nueva cena',
            dayOfWeek: 'TUESDAY',
            dietPlanId: 101,
            createdAt: new Date(),
            updatedAt: new Date(),
          }
        ]
      };

      const mockTransaction = vi.fn(async (callback: any) => {
        const tx = {
          dietPlan: {
            findUnique: vi.fn()
              .mockResolvedValueOnce(mockExistingPlan) // Primera llamada - verificar existencia  
              .mockResolvedValueOnce(expectedPlanWithUpdatedMeals), // Segunda llamada - recuperar plan actualizado
          },
          dietMeal: {
            deleteMany: vi.fn().mockResolvedValue({ count: 1 }), // Eliminar comida id: 2
            update: vi.fn().mockResolvedValue({}), // Actualizar comida id: 1
            createMany: vi.fn().mockResolvedValue({ count: 1 }), // Crear nueva comida
          },
        };
        return await callback(tx);
      });

      prismaMock.$transaction.mockImplementation(mockTransaction);

      const result = await dietService.updateDietPlan(101, 1, updateData);

      expect(result.meals).toHaveLength(2);
      expect(result.meals![0].id).toBe(1); // Comida actualizada
      expect(result.meals![1].id).toBe(3); // Nueva comida
    });

    it('should handle complex meal synchronization scenario', async () => {
      const updateData: UpdateDietPlanInput = {
        title: 'Plan Complejo',
        meals: [
          {
            id: 1, // Actualizar existente
            mealType: 'BREAKFAST',
            content: 'Desayuno modificado',
            dayOfWeek: 'WEDNESDAY'
          },
          {
            // Nueva comida
            mealType: 'MID_MORNING_SNACK',
            content: 'Snack nuevo',
            dayOfWeek: 'WEDNESDAY'
          },
          {
            id: 3, // Actualizar otra existente (que no existía en el mock inicial)
            mealType: 'DINNER',
            content: 'Cena modificada',
            dayOfWeek: 'WEDNESDAY'
          }
          // La comida id: 2 se eliminará al no estar presente
        ]
      };

      const existingPlanWithMoreMeals = {
        ...mockExistingPlan,
        meals: [
          ...mockExistingPlan.meals,
          {
            id: 3,
            mealType: 'DINNER',
            content: 'Cena original',
            dayOfWeek: 'MONDAY',
            dietPlanId: 101,
            createdAt: new Date(),
            updatedAt: new Date(),
          }
        ]
      };

      const expectedComplexResult = {
        ...mockUpdatedPlan,
        title: 'Plan Complejo',
        meals: [
          {
            id: 1,
            mealType: 'BREAKFAST',
            content: 'Desayuno modificado',
            dayOfWeek: 'WEDNESDAY',
            dietPlanId: 101,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          {
            id: 3,
            mealType: 'DINNER',
            content: 'Cena modificada',
            dayOfWeek: 'WEDNESDAY',
            dietPlanId: 101,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          {
            id: 4,
            mealType: 'MID_MORNING_SNACK',
            content: 'Snack nuevo',
            dayOfWeek: 'WEDNESDAY',
            dietPlanId: 101,
            createdAt: new Date(),
            updatedAt: new Date(),
          }
        ]
      };

      const mockTransaction = vi.fn(async (callback: any) => {
        const tx = {
          dietPlan: {
            findUnique: vi.fn()
              .mockResolvedValueOnce(existingPlanWithMoreMeals) // Primera llamada - verificar existencia
              .mockResolvedValueOnce(expectedComplexResult), // Segunda llamada - recuperar plan actualizado
            update: vi.fn().mockResolvedValue({}),
          },
          dietMeal: {
            deleteMany: vi.fn().mockResolvedValue({ count: 1 }), // id: 2
            update: vi.fn()
              .mockResolvedValueOnce({}) // id: 1
              .mockResolvedValueOnce({}), // id: 3
            createMany: vi.fn().mockResolvedValue({ count: 1 }), // Nueva comida
          },
        };
        return await callback(tx);
      });

      prismaMock.$transaction.mockImplementation(mockTransaction);

      const result = await dietService.updateDietPlan(101, 1, updateData);

      expect(result.title).toBe('Plan Complejo');
      expect(result.meals).toHaveLength(3);
    });

    it('should handle update with no plan fields but only meals', async () => {
      const updateData: UpdateDietPlanInput = {
        meals: [
          {
            mealType: 'BREAKFAST',
            content: 'Solo nueva comida',
            dayOfWeek: 'FRIDAY'
          }
        ]
      };

      const expectedPlanWithOnlyNewMeal = {
        ...mockExistingPlan,
        meals: [
          {
            id: 5,
            mealType: 'BREAKFAST',
            content: 'Solo nueva comida',
            dayOfWeek: 'FRIDAY',
            dietPlanId: 101,
            createdAt: new Date(),
            updatedAt: new Date(),
          }
        ]
      };

      const mockTransaction = vi.fn(async (callback: any) => {
        const tx = {
          dietPlan: {
            findUnique: vi.fn()
              .mockResolvedValueOnce(mockExistingPlan) // Primera llamada - verificar existencia
              .mockResolvedValueOnce(expectedPlanWithOnlyNewMeal), // Segunda llamada - recuperar plan actualizado
            // No update method called since no plan fields to update
          },
          dietMeal: {
            deleteMany: vi.fn().mockResolvedValue({ count: 2 }), // Eliminar todas existentes
            createMany: vi.fn().mockResolvedValue({ count: 1 }), // Crear nueva
          },
        };
        return await callback(tx);
      });

      prismaMock.$transaction.mockImplementation(mockTransaction);

      const result = await dietService.updateDietPlan(101, 1, updateData);

      expect(result.title).toBe('Plan Original'); // Sin cambios
      expect(result.meals).toHaveLength(1);
      expect(result.meals![0].content).toBe('Solo nueva comida');
    });

    it('should handle date updates correctly', async () => {
      const updateData: UpdateDietPlanInput = {
        startDate: '2025-08-01',
        endDate: '2025-08-31'
      };

      const expectedPlanWithUpdatedDates = {
        ...mockExistingPlan,
        startDate: new Date('2025-08-01'),
        endDate: new Date('2025-08-31')
      };

      const mockTransaction = vi.fn(async (callback: any) => {
        const tx = {
          dietPlan: {
            findUnique: vi.fn()
              .mockResolvedValueOnce(mockExistingPlan) // Primera llamada - verificar existencia
              .mockResolvedValueOnce(expectedPlanWithUpdatedDates), // Segunda llamada - recuperar plan actualizado
            update: vi.fn().mockResolvedValue({}),
          },
        };
        return await callback(tx);
      });

      prismaMock.$transaction.mockImplementation(mockTransaction);

      const result = await dietService.updateDietPlan(101, 1, updateData);

      expect(result.startDate).toEqual(new Date('2025-08-01'));
      expect(result.endDate).toEqual(new Date('2025-08-31'));
    });

    it('should handle clearing optional fields', async () => {
      const updateData: UpdateDietPlanInput = {
        description: '',
        objectives: '',
        notes: ''
      };

      const expectedPlanWithClearedFields = {
        ...mockExistingPlan,
        description: '',
        objectives: '',
        notes: ''
      };

      const mockTransaction = vi.fn(async (callback: any) => {
        const tx = {
          dietPlan: {
            findUnique: vi.fn()
              .mockResolvedValueOnce(mockExistingPlan) // Primera llamada - verificar existencia
              .mockResolvedValueOnce(expectedPlanWithClearedFields), // Segunda llamada - recuperar plan actualizado
            update: vi.fn().mockResolvedValue({}),
          },
        };
        return await callback(tx);
      });

      prismaMock.$transaction.mockImplementation(mockTransaction);

      const result = await dietService.updateDietPlan(101, 1, updateData);

      expect(result.description).toBe('');
      expect(result.objectives).toBe('');
      expect(result.notes).toBe('');
    });

    it('should rollback transaction on error', async () => {
      const updateData: UpdateDietPlanInput = {
        title: 'Plan con error'
      };

      const mockTransaction = vi.fn(async (callback: any) => {
        const tx = {
          dietPlan: {
            findUnique: vi.fn().mockResolvedValue(mockExistingPlan),
            update: vi.fn().mockRejectedValue(new Error('Database update failed')),
          },
        };
        return await callback(tx);
      });

      prismaMock.$transaction.mockImplementation(mockTransaction);

      await expect(dietService.updateDietPlan(101, 1, updateData))
        .rejects.toThrow('Database update failed');
    });

    it('should throw error if updated plan retrieval fails', async () => {
      const updateData: UpdateDietPlanInput = {
        title: 'Plan test'
      };

      const mockTransaction = vi.fn(async (callback: any) => {
        const tx = {
          dietPlan: {
            findUnique: vi.fn()
              .mockResolvedValueOnce(mockExistingPlan) // First call succeeds
              .mockResolvedValueOnce(null), // Second call returns null
            update: vi.fn().mockResolvedValue({}),
          },
        };
        return await callback(tx);
      });

      prismaMock.$transaction.mockImplementation(mockTransaction);

      await expect(dietService.updateDietPlan(101, 1, updateData))
        .rejects.toThrow('Error interno al recuperar el plan actualizado.');
    });

    it('should handle status mapping correctly', async () => {
      const updateData: UpdateDietPlanInput = {
        status: 'ACTIVE'
      };

      const mockOriginalPlan = {
        ...mockExistingPlan,
        isActive: false // Original era DRAFT
      };

      const expectedPlanWithActiveStatus = {
        ...mockExistingPlan,
        isActive: true // Actualizado a ACTIVE
      };

      const mockTransaction = vi.fn(async (callback: any) => {
        const tx = {
          dietPlan: {
            findUnique: vi.fn()
              .mockResolvedValueOnce(mockOriginalPlan) // Primera llamada - verificar existencia
              .mockResolvedValueOnce(expectedPlanWithActiveStatus), // Segunda llamada - recuperar plan actualizado
            update: vi.fn().mockResolvedValue({}),
          },
        };
        return await callback(tx);
      });

      prismaMock.$transaction.mockImplementation(mockTransaction);

      const result = await dietService.updateDietPlan(101, 1, updateData);

      expect(result.status).toBe('ACTIVE');
    });
  });
}); 