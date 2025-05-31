import type { BiometricRecordCreation, BiometricRecordResponse } from '../types/biometrics';
import api from './api';

/**
 * Crea un nuevo registro biométrico para un paciente específico
 * 
 * @param patientId - ID del paciente
 * @param biometricData - Datos del registro biométrico
 * @returns Una promesa que resuelve a los datos del registro biométrico creado
 */
export const createBiometricRecord = async (
  patientId: string,
  biometricData: BiometricRecordCreation
): Promise<BiometricRecordResponse> => {
  try {
    const response = await api.post(
      `/patients/${patientId}/biometric-records`,
      biometricData
    );
    return response.data;
  } catch (error) {
    console.error('Error creating biometric record:', error);
    throw error;
  }
};

/**
 * Obtiene el historial de registros biométricos de un paciente
 * 
 * @param patientId - ID del paciente
 * @param startDate - Fecha de inicio opcional para filtrar (formato ISO)
 * @param endDate - Fecha de fin opcional para filtrar (formato ISO)
 * @returns Una promesa que resuelve a una lista de registros biométricos
 */
export const fetchBiometricRecords = async (
  patientId: string,
  startDate?: string,
  endDate?: string
): Promise<BiometricRecordResponse[]> => {
  try {
    const params: Record<string, string> = {};
    if (startDate) params.startDate = startDate;
    if (endDate) params.endDate = endDate;

    const response = await api.get(
      `/patients/${patientId}/biometric-records`,
      { params }
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching biometric records:', error);
    throw error;
  }
}; 