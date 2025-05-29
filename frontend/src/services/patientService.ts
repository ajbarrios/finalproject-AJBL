import type { Patient, NewPatientData, UpdatePatientData } from '../types/patient';
import api from './api';

const PATIENTS_API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api/patients';

/**
 * Obtiene la lista de pacientes para el profesional autenticado.
 * Opcionalmente filtra por un término de búsqueda.
 * @param searchTerm Término para buscar en nombre, apellido o email.
 * @returns Una promesa que resuelve a un array de pacientes.
 */
export const fetchPatients = async (searchQuery?: string): Promise<Patient[]> => {
  try {
    const url = PATIENTS_API_BASE_URL;
    console.log('Calling API with URL:', url);
    const response = await api.get(url, {
      params: { search: searchQuery },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching patients:', error);
    throw error;
  }
};

/**
 * Obtiene los detalles completos de un paciente específico.
 * @param patientId El ID del paciente.
 * @returns Una promesa que resuelve a los detalles del paciente.
 */
export const fetchPatientById = async (patientId: string): Promise<Patient> => {
  try {
    const response = await api.get(`${PATIENTS_API_BASE_URL}/${patientId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching patient with ID ${patientId}:`, error);
    throw error;
  }
};

// Podrías añadir aquí otras funciones relacionadas con pacientes en el futuro:

export const createPatient = async (patientData: NewPatientData): Promise<Patient> => {
  try {
    const response = await api.post(PATIENTS_API_BASE_URL, patientData);
    return response.data;
  } catch (error) {
    console.error('Error creating patient:', error);
    throw error;
  }
};

export const updatePatient = async (patientId: string, patientData: UpdatePatientData): Promise<Patient> => {
  try {
    const response = await api.put(`${PATIENTS_API_BASE_URL}/${patientId}`, patientData);
    return response.data;
  } catch (error) {
    console.error(`Error updating patient with ID ${patientId}:`, error);
    throw error;
  }
};

// etc. 