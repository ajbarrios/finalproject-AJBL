import { z } from 'zod';

// Definir los tipos de días de la semana como un enum de Zod
const DayOfWeekEnum = z.enum(['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY']);

// Definir los tipos de comida como un enum de Zod
const MealTypeEnum = z.enum(['BREAKFAST', 'MID_MORNING_SNACK', 'LUNCH', 'AFTERNOON_SNACK', 'DINNER']);

const dietMealSchema = z.object({
  mealType: MealTypeEnum, // Usar enum en lugar de string
  content: z.string().min(1, 'El contenido de la comida es obligatorio.'),
  dayOfWeek: DayOfWeekEnum, // Ahora cada comida tiene un día de la semana
  // No hay created_at/updated_at/id en el input
});

// Schema para comidas en actualización (incluye id opcional)
const dietMealUpdateSchema = z.object({
  id: z.number().int().positive().optional(), // Si existe, es actualización; si no, es creación
  mealType: MealTypeEnum,
  content: z.string().min(1, 'El contenido de la comida es obligatorio.'),
  dayOfWeek: DayOfWeekEnum,
});

// Definir enum para el status del plan (en inglés para consistencia con otros enums)
const PlanStatusEnum = z.enum(['ACTIVE', 'DRAFT']);

// El plan de dieta ahora tiene directamente un array de comidas, cada una con su día.
export const createDietPlanSchema = z.object({
  title: z.string().min(1, 'El título del plan de dieta es obligatorio.'),
  description: z.string().optional(),
  startDate: z.string().refine((date) => !isNaN(Date.parse(date)), { message: 'Formato de fecha de inicio inválido.' }).optional(),
  endDate: z.string().refine((date) => !isNaN(Date.parse(date)), { message: 'Formato de fecha de fin inválido.' }).optional(),
  objectives: z.string().optional(),
  status: PlanStatusEnum.optional().default('ACTIVE'), // Enum definido con valores válidos
  notes: z.string().optional(),
  meals: z.array(dietMealSchema).min(1, 'El plan de dieta debe tener al menos una comida definida.'), // Array directo de comidas
}).refine((data) => {
  // Validar que endDate no sea anterior a startDate
  if (data.startDate && data.endDate) {
    const start = new Date(data.startDate);
    const end = new Date(data.endDate);
    return end >= start;
  }
  return true; // Si alguna fecha falta, no validar
}, {
  message: 'La fecha de fin no puede ser anterior a la fecha de inicio.',
  path: ['endDate'], // El error se asociará al campo endDate
});

// Schema para actualización de plan de dieta (todos los campos opcionales excepto al menos uno debe estar presente)
export const updateDietPlanSchema = z.object({
  title: z.string().min(1, 'El título del plan de dieta es obligatorio.').optional(),
  description: z.string().optional(),
  startDate: z.string().refine((date) => !isNaN(Date.parse(date)), { message: 'Formato de fecha de inicio inválido.' }).optional(),
  endDate: z.string().refine((date) => !isNaN(Date.parse(date)), { message: 'Formato de fecha de fin inválido.' }).optional(),
  objectives: z.string().optional(),
  status: PlanStatusEnum.optional(),
  notes: z.string().optional(),
  meals: z.array(dietMealUpdateSchema).min(1, 'El plan de dieta debe tener al menos una comida definida.').optional(),
}).refine((data) => {
  // Validar que al menos un campo esté presente
  const hasAtLeastOneField = Object.values(data).some(value => value !== undefined);
  return hasAtLeastOneField;
}, {
  message: 'Debe proporcionar al menos un campo para actualizar.',
  path: [], // Error global
}).refine((data) => {
  // Validar que endDate no sea anterior a startDate
  if (data.startDate && data.endDate) {
    const start = new Date(data.startDate);
    const end = new Date(data.endDate);
    return end >= start;
  }
  return true;
}, {
  message: 'La fecha de fin no puede ser anterior a la fecha de inicio.',
  path: ['endDate'],
});

// Validación para parámetros de ruta
export const dietPlanParamsSchema = z.object({
  dietPlanId: z.string().refine((val) => {
    const num = parseInt(val, 10);
    return !isNaN(num) && num > 0;
  }, {
    message: 'El ID del plan de dieta debe ser un número entero positivo.'
  })
});

// Tipos inferidos para usar en la lógica
export type CreateDietPlanInput = z.infer<typeof createDietPlanSchema>;
export type UpdateDietPlanInput = z.infer<typeof updateDietPlanSchema>;
export type DietMealInput = z.infer<typeof dietMealSchema>;
export type DietMealUpdateInput = z.infer<typeof dietMealUpdateSchema>;
export type DietPlanParams = z.infer<typeof dietPlanParamsSchema>; 