import api from './api';
import type { DietPlanCreation, DietPlan } from '../types/dietPlan';

/**
 * Servicio para manejar operaciones relacionadas con planes de dieta
 */

/**
 * Crear un nuevo plan de dieta para un paciente
 */
export const createDietPlan = async (
  patientId: string,
  planData: DietPlanCreation
): Promise<DietPlan> => {
  try {
    const response = await api.post(`/diets/patients/${patientId}/plans`, planData);
    return response.data;
  } catch (error) {
    console.error('Error creating diet plan:', error);
    throw error;
  }
};

/**
 * Obtener los detalles de un plan de dieta específico
 */
export const getDietPlan = async (dietPlanId: string): Promise<DietPlan> => {
  try {
    const response = await api.get(`/diets/plans/${dietPlanId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching diet plan:', error);
    throw error;
  }
};

/**
 * Obtener todos los planes de dieta de un paciente
 */
export const getPatientDietPlans = async (patientId: string): Promise<DietPlan[]> => {
  try {
    const response = await api.get(`/diets/patients/${patientId}/plans`);
    return response.data;
  } catch (error) {
    console.error('Error fetching patient diet plans:', error);
    throw error;
  }
};

/**
 * Actualizar un plan de dieta existente
 */
export const updateDietPlan = async (
  dietPlanId: string,
  planData: Partial<DietPlanCreation>
): Promise<DietPlan> => {
  try {
    const response = await api.put(`/diets/plans/${dietPlanId}`, planData);
    return response.data;
  } catch (error) {
    console.error('Error updating diet plan:', error);
    throw error;
  }
};

/**
 * Eliminar un plan de dieta
 */
export const deleteDietPlan = async (dietPlanId: string): Promise<void> => {
  try {
    await api.delete(`/diets/plans/${dietPlanId}`);
  } catch (error) {
    console.error('Error deleting diet plan:', error);
    throw error;
  }
}; 