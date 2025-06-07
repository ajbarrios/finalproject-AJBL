import { vi, describe, it, expect, beforeEach, afterEach, MockedFunction } from 'vitest';
import dietService from '../../../src/services/diet.service';
import prisma from '../../../src/config/db/prisma.client';
import { CreateDietPlanInput } from '../../../src/validations/diet.validations';

// Mock Prisma client
vi.mock('../../../src/config/db/prisma.client', () => ({
  default: {
    patient: {
      findFirst: vi.fn(),
    },
    $transaction: vi.fn(),
    dietPlan: {
      create: vi.fn(),
      findUnique: vi.fn(),
    },
    dietMeal: {
      createMany: vi.fn(),
    },
  },
}));

const prismaMock = prisma as any;

describe('Diet Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
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
      expect(result).toEqual(mockPlanWithMeals);
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

      await dietService.createDietPlan(19, 1, draftPlanData);

      expect(capturedCreateData.data.isActive).toBe(false);
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
}); 