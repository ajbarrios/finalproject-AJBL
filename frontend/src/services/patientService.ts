import type { Patient } from '../types/patient';
import apiClient from './authService'; // Importar la instancia de Axios configurada
import axios from 'axios'; // Importar axios para isAxiosError

/**
 * Obtiene la lista de pacientes del backend.
 * @param searchTerm Término opcional para buscar pacientes.
 * @returns Una promesa que se resuelve con un array de pacientes.
 */
export const fetchPatients = async (searchTerm?: string): Promise<Patient[]> => {
  const url = '/patients'; // La URL base ya está en apiClient

  const params: { search?: string } = {};
  if (searchTerm && searchTerm.trim() !== '') {
    params.search = searchTerm.trim();
  }

  try {
    // Usar apiClient.get y pasar los parámetros
    const response = await apiClient.get<Patient[]>(url, { params });
    return response.data; // Axios devuelve los datos directamente en response.data
  } catch (error) {
    console.error('Error en fetchPatients:', error);
    if (axios.isAxiosError(error) && error.response) {
      // Intentar acceder a error.response.data.message si existe, de lo contrario un mensaje genérico
      const message = (error.response.data as { message?: string })?.message || 'Error al obtener pacientes';
      throw new Error(message);
    } else {
      // Para otros tipos de errores (ej. error de red genérico)
      throw new Error('Error de red o problema al conectar con el servidor al obtener pacientes.');
    }
  }
};

// Podrías añadir aquí otras funciones relacionadas con pacientes en el futuro:
// import type { NewPatientData, UpdatePatientData } from '../types/patient';

// export const getPatientById = async (id: string): Promise<Patient> => {
//   try {
//     const response = await apiClient.get<Patient>(`/patients/${id}`);
//     return response.data;
//   } catch (error) {
//     console.error(`Error en getPatientById ${id}:`, error);
//     if (axios.isAxiosError(error) && error.response) {
//       const message = (error.response.data as { message?: string })?.message || 'Error al obtener el paciente';
//       throw new Error(message);
//     } else {
//       throw new Error('Error de red o problema al conectar con el servidor.');
//     }
//   }
// };

// export const createPatient = async (patientData: NewPatientData): Promise<Patient> => {
//   try {
//     const response = await apiClient.post<Patient>('/patients', patientData);
//     return response.data;
//   } catch (error) {
//     console.error('Error en createPatient:', error);
//     if (axios.isAxiosError(error) && error.response) {
//       const message = (error.response.data as { message?: string })?.message || 'Error al crear el paciente';
//       throw new Error(message);
//     } else {
//       throw new Error('Error de red o problema al conectar con el servidor.');
//     }
//   }
// };

// etc. 