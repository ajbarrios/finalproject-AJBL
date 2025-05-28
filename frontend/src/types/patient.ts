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
  email?: string | null | undefined;
  firstName: string;
  lastName:string;
  phone?: string | null | undefined;
  birthDate?: Date | null | undefined; // Ajustado para coincidir con el formato enviado desde el formulario
  gender?: string | null | undefined;
  height?: number | null | undefined;
  medicalNotes?: string | null | undefined;
  dietRestrictions?: string | null | undefined;
  objectives?: string | null | undefined;
  // professionalId se tomará del usuario autenticado en el backend
  initialBiometrics?: { // Añadir estructura para datos biométricos iniciales opcionales
    recordDate?: Date | null | undefined; // Asumiendo que se podría enviar una fecha o null/undefined
    weight?: number | null | undefined;
    bodyFatPercentage?: number | null | undefined;
    musclePercentage?: number | null | undefined;
    waterPercentage?: number | null | undefined;
    backChestDiameter?: number | null | undefined;
    waistDiameter?: number | null | undefined;
    armsDiameter?: number | null | undefined;
    legsDiameter?: number | null | undefined;
    calvesDiameter?: number | null | undefined;
    notes?: string | null | undefined;
    // Añadir otros campos biométricos si se usan en el formulario
  } | null | undefined;
}

/**
 * Interfaz para actualizar un paciente existente.
 * Todos los campos son opcionales, ya que solo se envían los que cambian.
 */
export type UpdatePatientData = Partial<NewPatientData>;

// Ejemplo de cómo podrías usarlo:
// import { Patient } from './patient';
// const unPaciente: Patient = { ... }; 

// Define types for the summary information returned with patient details
export type BiometricRecord = {
  id: string;
  patientId: string;
  recordDate: string; // ISO date string
  weight: number | null;
  bodyFatPercentage: number | null;
  musclePercentage: number | null;
  waterPercentage: number | null;
  backChestDiameter: number | null;
  waistDiameter: number | null;
  armsDiameter: number | null;
  legsDiameter: number | null;
  calvesDiameter: number | null;
  notes: string | null;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
};

export type DietPlanSummary = {
  id: string;
  title: string;
  isActive: boolean;
  startDate: string | null; // ISO date string
  endDate: string | null; // ISO date string
};

export type WorkoutPlanSummary = {
  id: string;
  title: string;
  isActive: boolean;
  startDate: string | null; // ISO date string
  endDate: string | null; // ISO date string
};

// Define a type for the detailed patient response
export type PatientDetails = Patient & {
  lastBiometricRecord: BiometricRecord | null;
  dietPlansSummary: DietPlanSummary[];
  workoutPlansSummary: WorkoutPlanSummary[];
  // Add other related data if the backend returns it with the patient details
}; 