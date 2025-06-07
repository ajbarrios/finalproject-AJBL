import { z } from 'zod';

// Definir los tipos de días de la semana como un enum de Zod
const DayOfWeekEnum = z.enum(['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY']);

const dietMealSchema = z.object({
  mealType: z.string().min(1, 'El tipo de comida es obligatorio.'), // Podría ser un enum si los tipos son fijos
  content: z.string().min(1, 'El contenido de la comida es obligatorio.'),
  dayOfWeek: DayOfWeekEnum, // Ahora cada comida tiene un día de la semana
  // No hay created_at/updated_at/id en el input
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

// Tipos inferidos para usar en la lógica
export type CreateDietPlanInput = z.infer<typeof createDietPlanSchema>;
export type DietMealInput = z.infer<typeof dietMealSchema>; 