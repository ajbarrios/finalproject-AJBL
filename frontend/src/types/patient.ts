/**
 * Interfaz que representa la estructura de un objeto Paciente en el frontend.
 * Esta interfaz debe mantenerse sincronizada con la respuesta esperada de la API
 * y el modelo Patient de Prisma, pero solo incluyendo los campos necesarios para el frontend.
 */
export interface Patient {
  id: string; // o number, dependiendo de lo que devuelva la API (Prisma usa Int, pero podría ser string en la API response)
  professionalId: string; // o number
  email?: string | null;
  firstName: string;
  lastName: string;
  phone?: string | null;
  birthDate?: string | null; // Formato ISO Date (YYYY-MM-DD) como string es común en APIs
  gender?: string | null;
  height?: number | null; // En cm
  medicalNotes?: string | null;
  dietRestrictions?: string | null;
  objectives?: string | null;
  createdAt: string; // Formato ISO DateTime como string
  updatedAt: string; // Formato ISO DateTime como string

  // Campos adicionales que podrían ser útiles en el frontend, derivados o de relaciones
  // Por ejemplo, si la API devuelve el nombre completo ya concatenado:
  // fullName?: string;
  
  // Si la API devuelve un resumen del último registro biométrico o planes:
  // lastBiometricRecordSummary?: any; 
  // activeDietPlanSummary?: any;
  // activeWorkoutPlanSummary?: any;
}

/**
 * Interfaz para la creación de un nuevo paciente.
 * Puede omitir campos generados por el servidor como id, createdAt, updatedAt.
 */
export interface NewPatientData {
  email?: string | null;
  firstName: string;
  lastName:string;
  phone?: string | null;
  birthDate?: string | null; 
  gender?: string | null;
  height?: number | null;
  medicalNotes?: string | null;
  dietRestrictions?: string | null;
  objectives?: string | null;
  // professionalId se tomará del usuario autenticado en el backend
}

/**
 * Interfaz para actualizar un paciente existente.
 * Todos los campos son opcionales, ya que solo se envían los que cambian.
 */
export type UpdatePatientData = Partial<NewPatientData>;

// Ejemplo de cómo podrías usarlo:
// import { Patient } from './patient';
// const unPaciente: Patient = { ... }; 