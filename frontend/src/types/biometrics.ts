/**
 * Tipo para la creación de un nuevo registro biométrico
 */
export interface BiometricRecordCreation {
  recordDate: string; // Fecha en formato ISO
  weight?: number | null;
  bodyFatPercentage?: number | null;
  musclePercentage?: number | null;
  waterPercentage?: number | null;
  backChestDiameter?: number | null;
  waistDiameter?: number | null;
  armsDiameter?: number | null;
  legsDiameter?: number | null;
  calvesDiameter?: number | null;
  notes?: string | null;
}

/**
 * Tipo para la respuesta del servidor al crear un registro biométrico
 */
export interface BiometricRecordResponse {
  id: string;
  patientId: string;
  recordDate: string; // Fecha en formato ISO
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
  createdAt: string; // Fecha en formato ISO
}

/**
 * Mapeo de unidades de medida para cada campo biométrico
 */
export const BIOMETRIC_UNITS = {
  weight: 'kg',
  bodyFatPercentage: '%',
  musclePercentage: '%',
  waterPercentage: '%',
  backChestDiameter: 'cm',
  waistDiameter: 'cm',
  armsDiameter: 'cm',
  legsDiameter: 'cm',
  calvesDiameter: 'cm'
} as const; 