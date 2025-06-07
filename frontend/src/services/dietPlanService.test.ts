import { describe, it, expect, vi, beforeEach, type Mock, type Mocked } from 'vitest';
import type { AxiosError, InternalAxiosRequestConfig } from 'axios';
import type { DietPlan, DietPlanCreation } from '../types/dietPlan';
import { PlanStatus, MealType, DayOfWeek } from '../types/dietPlan';

// Mockear el apiClient
vi.mock('./api', () => {
  const mockApiClient = {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  };
  return {
    __esModule: true,
    default: mockApiClient,
  };
});

// Mockear axios para isAxiosError
vi.mock('axios', async (importOriginal) => {
  const actualAxios = await importOriginal<typeof import('axios')>();
  return {
    ...actualAxios,
    isAxiosError: (payload: unknown): payload is AxiosError => {
      return payload instanceof Error && 'isAxiosError' in payload;
    },
  };
});

describe('dietPlanService', () => {
  let mockApiClient: Mocked<typeof import('./api').default>;
  let createDietPlan: typeof import('./dietPlanService').createDietPlan;
  let getDietPlan: typeof import('./dietPlanService').getDietPlan;
  let getPatientDietPlans: typeof import('./dietPlanService').getPatientDietPlans;
  let updateDietPlan: typeof import('./dietPlanService').updateDietPlan;
  let deleteDietPlan: typeof import('./dietPlanService').deleteDietPlan;

  const mockDietPlan: DietPlan = {
    id: 'plan1',
    title: 'Plan de Pérdida de Peso',
    description: 'Descripción del plan',
    startDate: '2025-06-01',
    endDate: '2025-06-30',
    objectives: 'Perder 5kg',
    status: PlanStatus.ACTIVE,
    notes: 'Notas importantes',
    patientId: '19',
    professionalId: '1',
    createdAt: '2025-06-01T00:00:00.000Z',
    updatedAt: '2025-06-01T00:00:00.000Z',
    meals: [
      {
        id: 'meal1',
        mealType: MealType.BREAKFAST,
        content: 'Avena con frutas',
        dayOfWeek: DayOfWeek.MONDAY,
        dietPlanId: 'plan1',
        createdAt: '2025-06-01T00:00:00.000Z',
        updatedAt: '2025-06-01T00:00:00.000Z',
      },
      {
        id: 'meal2',
        mealType: MealType.LUNCH,
        content: 'Ensalada con proteína',
        dayOfWeek: DayOfWeek.MONDAY,
        dietPlanId: 'plan1',
        createdAt: '2025-06-01T00:00:00.000Z',
        updatedAt: '2025-06-01T00:00:00.000Z',
      }
    ]
  };

  const mockDietPlanCreation: DietPlanCreation = {
    title: 'Plan de Pérdida de Peso',
    description: 'Descripción del plan',
    startDate: '2025-06-01',
    endDate: '2025-06-30',
    objectives: 'Perder 5kg',
    status: PlanStatus.ACTIVE,
    notes: 'Notas importantes',
    meals: [
      {
        mealType: MealType.BREAKFAST,
        content: 'Avena con frutas',
        dayOfWeek: DayOfWeek.MONDAY
      },
      {
        mealType: MealType.LUNCH,
        content: 'Ensalada con proteína',
        dayOfWeek: DayOfWeek.MONDAY
      }
    ]
  };

  beforeEach(async () => {
    // Importar dinámicamente el módulo mockeado
    const api = await import('./api');
    mockApiClient = api.default as Mocked<typeof import('./api').default>;

    // Resetear todos los mocks
    mockApiClient.get.mockReset();
    mockApiClient.post.mockReset();
    mockApiClient.put.mockReset();
    mockApiClient.delete.mockReset();

    // Importar dinámicamente las funciones del servicio
    const dietPlanService = await import('./dietPlanService');
    createDietPlan = dietPlanService.createDietPlan;
    getDietPlan = dietPlanService.getDietPlan;
    getPatientDietPlans = dietPlanService.getPatientDietPlans;
    updateDietPlan = dietPlanService.updateDietPlan;
    deleteDietPlan = dietPlanService.deleteDietPlan;
  });

  describe('createDietPlan', () => {
    it('should create a diet plan successfully', async () => {
      vi.mocked(mockApiClient.post).mockResolvedValue({ data: mockDietPlan });

      const result = await createDietPlan('19', mockDietPlanCreation as DietPlanCreation);

      expect(mockApiClient.post).toHaveBeenCalledOnce();
      expect(mockApiClient.post).toHaveBeenCalledWith('/diets/patients/19/plans', mockDietPlanCreation);
      expect(result).toEqual(mockDietPlan);
    });

    it('should handle API errors when creating diet plan', async () => {
      const errorMessage = 'Error creando plan de dieta';
      const mockAxiosError: AxiosError<{ message?: string }> = {
        isAxiosError: true,
        response: {
          data: { message: errorMessage },
          status: 400,
          statusText: 'Bad Request',
          headers: {},
          config: {} as InternalAxiosRequestConfig,
        },
        name: 'AxiosError',
        message: 'Request failed with status code 400',
        config: {} as InternalAxiosRequestConfig,
        code: 'ERR_BAD_REQUEST',
        toJSON: () => ({}),
      };

      vi.mocked(mockApiClient.post as Mock).mockRejectedValue(mockAxiosError);

      await expect(createDietPlan('19', mockDietPlanCreation)).rejects.toThrow();
      expect(mockApiClient.post).toHaveBeenCalledWith('/diets/patients/19/plans', mockDietPlanCreation);
    });

    it('should handle network errors when creating diet plan', async () => {
      const networkError = new Error('Network error');
      vi.mocked(mockApiClient.post as Mock).mockRejectedValue(networkError);

      await expect(createDietPlan('19', mockDietPlanCreation)).rejects.toThrow('Network error');
    });
  });

  describe('getDietPlan', () => {
    it('should get a diet plan by id successfully', async () => {
      vi.mocked(mockApiClient.get).mockResolvedValue({ data: mockDietPlan });

      const result = await getDietPlan('plan1');

      expect(mockApiClient.get).toHaveBeenCalledOnce();
      expect(mockApiClient.get).toHaveBeenCalledWith('/diets/plan1');
      expect(result).toEqual(mockDietPlan);
    });

    it('should handle API errors when getting diet plan', async () => {
      const errorMessage = 'Plan no encontrado';
      const mockAxiosError: AxiosError<{ message?: string }> = {
        isAxiosError: true,
        response: {
          data: { message: errorMessage },
          status: 404,
          statusText: 'Not Found',
          headers: {},
          config: {} as InternalAxiosRequestConfig,
        },
        name: 'AxiosError',
        message: 'Request failed with status code 404',
        config: {} as InternalAxiosRequestConfig,
        code: 'ERR_NOT_FOUND',
        toJSON: () => ({}),
      };

      vi.mocked(mockApiClient.get as Mock).mockRejectedValue(mockAxiosError);

      await expect(getDietPlan('plan1')).rejects.toThrow();
      expect(mockApiClient.get).toHaveBeenCalledWith('/diets/plan1');
    });
  });

  describe('getPatientDietPlans', () => {
    const mockDietPlans: DietPlan[] = [mockDietPlan];

    it('should get all diet plans for a patient successfully', async () => {
      vi.mocked(mockApiClient.get).mockResolvedValue({ data: mockDietPlans });

      const result = await getPatientDietPlans('19');

      expect(mockApiClient.get).toHaveBeenCalledOnce();
      expect(mockApiClient.get).toHaveBeenCalledWith('/diets/patients/19/plans');
      expect(result).toEqual(mockDietPlans);
    });

    it('should handle API errors when getting patient diet plans', async () => {
      const errorMessage = 'Paciente no encontrado';
      const mockAxiosError: AxiosError<{ message?: string }> = {
        isAxiosError: true,
        response: {
          data: { message: errorMessage },
          status: 404,
          statusText: 'Not Found',
          headers: {},
          config: {} as InternalAxiosRequestConfig,
        },
        name: 'AxiosError',
        message: 'Request failed with status code 404',
        config: {} as InternalAxiosRequestConfig,
        code: 'ERR_NOT_FOUND',
        toJSON: () => ({}),
      };

      vi.mocked(mockApiClient.get as Mock).mockRejectedValue(mockAxiosError);

      await expect(getPatientDietPlans('19')).rejects.toThrow();
      expect(mockApiClient.get).toHaveBeenCalledWith('/diets/patients/19/plans');
    });

    it('should return empty array when patient has no diet plans', async () => {
      vi.mocked(mockApiClient.get).mockResolvedValue({ data: [] });

      const result = await getPatientDietPlans('19');

      expect(result).toEqual([]);
    });
  });

  describe('updateDietPlan', () => {
    const updateData = {
      title: 'Plan Actualizado',
      description: 'Nueva descripción'
    };

    const updatedDietPlan = {
      ...mockDietPlan,
      title: 'Plan Actualizado',
      description: 'Nueva descripción'
    };

    it('should update a diet plan successfully', async () => {
      vi.mocked(mockApiClient.put).mockResolvedValue({ data: updatedDietPlan });

      const result = await updateDietPlan('plan1', updateData);

      expect(mockApiClient.put).toHaveBeenCalledOnce();
      expect(mockApiClient.put).toHaveBeenCalledWith('/diets/plan1', updateData);
      expect(result).toEqual(updatedDietPlan);
    });

    it('should handle API errors when updating diet plan', async () => {
      const errorMessage = 'Error actualizando plan';
      const mockAxiosError: AxiosError<{ message?: string }> = {
        isAxiosError: true,
        response: {
          data: { message: errorMessage },
          status: 400,
          statusText: 'Bad Request',
          headers: {},
          config: {} as InternalAxiosRequestConfig,
        },
        name: 'AxiosError',
        message: 'Request failed with status code 400',
        config: {} as InternalAxiosRequestConfig,
        code: 'ERR_BAD_REQUEST',
        toJSON: () => ({}),
      };

      vi.mocked(mockApiClient.put as Mock).mockRejectedValue(mockAxiosError);

      await expect(updateDietPlan('plan1', updateData)).rejects.toThrow();
      expect(mockApiClient.put).toHaveBeenCalledWith('/diets/plan1', updateData);
    });
  });

  describe('deleteDietPlan', () => {
    it('should delete a diet plan successfully', async () => {
      vi.mocked(mockApiClient.delete).mockResolvedValue({ data: {} });

      await deleteDietPlan('plan1');

      expect(mockApiClient.delete).toHaveBeenCalledOnce();
      expect(mockApiClient.delete).toHaveBeenCalledWith('/diets/plan1');
    });

    it('should handle API errors when deleting diet plan', async () => {
      const errorMessage = 'Error eliminando plan';
      const mockAxiosError: AxiosError<{ message?: string }> = {
        isAxiosError: true,
        response: {
          data: { message: errorMessage },
          status: 404,
          statusText: 'Not Found',
          headers: {},
          config: {} as InternalAxiosRequestConfig,
        },
        name: 'AxiosError',
        message: 'Request failed with status code 404',
        config: {} as InternalAxiosRequestConfig,
        code: 'ERR_NOT_FOUND',
        toJSON: () => ({}),
      };

      vi.mocked(mockApiClient.delete as Mock).mockRejectedValue(mockAxiosError);

      await expect(deleteDietPlan('plan1')).rejects.toThrow();
      expect(mockApiClient.delete).toHaveBeenCalledWith('/diets/plan1');
    });

    it('should handle network errors when deleting diet plan', async () => {
      const networkError = new Error('Network error');
      vi.mocked(mockApiClient.delete as Mock).mockRejectedValue(networkError);

      await expect(deleteDietPlan('plan1')).rejects.toThrow('Network error');
    });
  });
}); 