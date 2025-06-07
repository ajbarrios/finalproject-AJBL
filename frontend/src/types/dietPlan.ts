/**
 * Enums para planes de dieta
 */

// Enum para tipos de comida - debe coincidir con el backend
export enum MealType {
  BREAKFAST = 'BREAKFAST',
  MID_MORNING_SNACK = 'MID_MORNING_SNACK',
  LUNCH = 'LUNCH',
  AFTERNOON_SNACK = 'AFTERNOON_SNACK',
  DINNER = 'DINNER',
  LATE_NIGHT_SNACK = 'LATE_NIGHT_SNACK'
}

// Enum para días de la semana - debe coincidir con el backend
export enum DayOfWeek {
  MONDAY = 'MONDAY',
  TUESDAY = 'TUESDAY',
  WEDNESDAY = 'WEDNESDAY',
  THURSDAY = 'THURSDAY',
  FRIDAY = 'FRIDAY',
  SATURDAY = 'SATURDAY',
  SUNDAY = 'SUNDAY'
}

// Enum para estado del plan
export enum PlanStatus {
  ACTIVE = 'ACTIVE',
  DRAFT = 'DRAFT'
}

/**
 * Interfaz para la creación de una comida de dieta
 */
export interface DietMealCreation {
  mealType: MealType;
  content: string;
  dayOfWeek: DayOfWeek;
}

/**
 * Interfaz para la creación de un plan de dieta
 */
export interface DietPlanCreation {
  title: string;
  description?: string;
  startDate?: string; // ISO date string
  endDate?: string; // ISO date string
  objectives?: string;
  status?: PlanStatus;
  notes?: string;
  meals: DietMealCreation[];
}

/**
 * Interfaz para una comida de dieta con ID (respuesta del servidor)
 */
export interface DietMeal extends DietMealCreation {
  id: string;
  dietPlanId: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Interfaz para un plan de dieta completo (respuesta del servidor)
 */
export interface DietPlan extends Omit<DietPlanCreation, 'meals'> {
  id: string;
  patientId: string;
  professionalId: string;
  status: PlanStatus; // Asegurar que use el enum correcto
  meals: DietMeal[];
  createdAt: string;
  updatedAt: string;
}

/**
 * Mapeo de etiquetas en español para los tipos de comida
 */
export const MEAL_TYPE_LABELS: Record<MealType, string> = {
  [MealType.BREAKFAST]: 'Desayuno',
  [MealType.MID_MORNING_SNACK]: 'Media Mañana',
  [MealType.LUNCH]: 'Almuerzo',
  [MealType.AFTERNOON_SNACK]: 'Merienda',
  [MealType.DINNER]: 'Cena',
  [MealType.LATE_NIGHT_SNACK]: 'Resopón'
};

/**
 * Mapeo de etiquetas en español para los días de la semana
 */
export const DAY_OF_WEEK_LABELS: Record<DayOfWeek, string> = {
  [DayOfWeek.MONDAY]: 'Lunes',
  [DayOfWeek.TUESDAY]: 'Martes',
  [DayOfWeek.WEDNESDAY]: 'Miércoles',
  [DayOfWeek.THURSDAY]: 'Jueves',
  [DayOfWeek.FRIDAY]: 'Viernes',
  [DayOfWeek.SATURDAY]: 'Sábado',
  [DayOfWeek.SUNDAY]: 'Domingo'
};

/**
 * Mapeo de etiquetas en español para el estado del plan
 */
export const PLAN_STATUS_LABELS: Record<PlanStatus, string> = {
  [PlanStatus.ACTIVE]: 'Activo',
  [PlanStatus.DRAFT]: 'Borrador'
}; 