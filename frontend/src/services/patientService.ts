import apiClient from './authService'; // Usaremos esto para mockear sus métodos
import type { Patient, PatientDetails } from '../types/patient';
// Importar tipos necesarios para detalles del paciente
// Podrías necesitar importar BiometricRecord, DietPlan, WorkoutPlan summary types
// o definir un nuevo tipo PatientDetails en types/patient.ts
import { isAxiosError } from 'axios';

/**
 * Obtiene la lista de pacientes para el profesional autenticado.
 * Opcionalmente filtra por un término de búsqueda.
 * @param searchTerm Término para buscar en nombre, apellido o email.
 * @returns Una promesa que resuelve a un array de pacientes.
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
    console.error('Error fetching patients:', error);
    if (isAxiosError(error)) {
      // Si es un error de Axios y tiene un mensaje en la respuesta
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      } else {
        // Si es AxiosError pero sin mensaje específico del backend
        throw new Error(error.message); // Lanza el mensaje genérico de Axios
      }
    } else if (error instanceof Error) {
      // Otros tipos de errores (de red, etc.) que son instancias de Error
      throw error; // Lanza el error original
    } else {
      // Si no es una instancia de Error
      throw new Error('Ha ocurrido un error desconocido al obtener pacientes.');
    }
  }
};

/**
 * Obtiene los detalles completos de un paciente específico.
 * @param patientId El ID del paciente.
 * @returns Una promesa que resuelve a los detalles del paciente.
 */
export const fetchPatientById = async (patientId: string): Promise<PatientDetails> => {
  try {
    // Asumiendo que el backend responde con el formato extendido que incluye biométricos y planes
    // El tipo de retorno debería ser PatientDetails, que definiremos en types/patient.ts
    const response = await apiClient.get<PatientDetails>(`/patients/${patientId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching patient with ID ${patientId}:`, error);
    if (isAxiosError(error)) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      } else {
        // Si es AxiosError pero sin mensaje específico del backend
        throw new Error(error.message); // Lanza el mensaje genérico de Axios
      }
    } else if (error instanceof Error) {
      // Otros tipos de errores (de red, etc.) que son instancias de Error
      throw error; // Lanza el error original
    } else {
      // Si no es una instancia de Error
      throw new Error(`Ha ocurrido un error desconocido al obtener paciente con ID ${patientId}.`);
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