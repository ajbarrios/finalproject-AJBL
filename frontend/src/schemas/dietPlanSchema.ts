import { z } from 'zod';
import { MealType, DayOfWeek, PlanStatus } from '../types/dietPlan';

/**
 * Esquema para validar una comida de dieta
 */
export const dietMealSchema = z.object({
  mealType: z.nativeEnum(MealType, {
    errorMap: () => ({ message: 'Debe seleccionar un tipo de comida válido.' })
  }),
  content: z.string()
    .min(1, 'El contenido de la comida es obligatorio.')
    .min(3, 'El contenido debe tener al menos 3 caracteres.')
    .max(1000, 'El contenido no debe exceder 1000 caracteres.'),
  dayOfWeek: z.nativeEnum(DayOfWeek, {
    errorMap: () => ({ message: 'Debe seleccionar un día válido.' })
  })
});

/**
 * Esquema para validar un plan de dieta
 */
export const dietPlanSchema = z.object({
  title: z.string()
    .min(1, 'El título del plan es obligatorio.')
    .min(3, 'El título debe tener al menos 3 caracteres.')
    .max(100, 'El título no debe exceder 100 caracteres.'),
  description: z.string()
    .max(500, 'La descripción no debe exceder 500 caracteres.')
    .optional()
    .or(z.literal('')),
  startDate: z.string()
    .optional()
    .refine((date) => {
      if (!date || date === '') return true;
      return !isNaN(Date.parse(date));
    }, { message: 'Formato de fecha de inicio inválido.' }),
  endDate: z.string()
    .optional()
    .refine((date) => {
      if (!date || date === '') return true;
      return !isNaN(Date.parse(date));
    }, { message: 'Formato de fecha de fin inválido.' }),
  objectives: z.string()
    .max(500, 'Los objetivos no deben exceder 500 caracteres.')
    .optional()
    .or(z.literal('')),
  status: z.nativeEnum(PlanStatus)
    .optional()
    .default(PlanStatus.ACTIVE),
  notes: z.string()
    .max(1000, 'Las notas no deben exceder 1000 caracteres.')
    .optional()
    .or(z.literal('')),
  meals: z.array(dietMealSchema)
    .min(1, 'El plan de dieta debe tener al menos una comida.')
    .max(50, 'El plan no puede tener más de 50 comidas.')
}).refine((data) => {
  // Validar que endDate no sea anterior a startDate
  if (data.startDate && data.endDate && data.startDate !== '' && data.endDate !== '') {
    const start = new Date(data.startDate);
    const end = new Date(data.endDate);
    return end >= start;
  }
  return true;
}, {
  message: 'La fecha de fin no puede ser anterior a la fecha de inicio.',
  path: ['endDate']
});

/**
 * Tipo inferido del esquema para usar en el formulario
 */
export type DietPlanFormData = z.infer<typeof dietPlanSchema>;

/**
 * Tipo inferido del esquema de comida
 */
export type DietMealFormData = z.infer<typeof dietMealSchema>; 