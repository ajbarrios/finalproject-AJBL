import { z } from 'zod';

// Definir los tipos de días de la semana como un enum de Zod
const DayOfWeekEnum = z.enum(['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY']);

const dietMealSchema = z.object({
  mealType: z.string().min(1, 'El tipo de comida es obligatorio.'), // Podría ser un enum si los tipos son fijos
  content: z.string().min(1, 'El contenido de la comida es obligatorio.'),
  dayOfWeek: DayOfWeekEnum, // Ahora cada comida tiene un día de la semana
  // No hay created_at/updated_at/id en el input
});

// El plan de dieta ahora tiene directamente un array de comidas, cada una con su día.
export const createDietPlanSchema = z.object({
  title: z.string().min(1, 'El título del plan de dieta es obligatorio.'),
  description: z.string().optional(),
  startDate: z.string().refine((date) => !isNaN(Date.parse(date)), { message: 'Formato de fecha de inicio inválido.' }).optional(),
  endDate: z.string().refine((date) => !isNaN(Date.parse(date)), { message: 'Formato de fecha de fin inválido.' }).optional(),
  objectives: z.string().optional(),
  status: z.string().optional(), // Considerar un enum si los estados son fijos
  notes: z.string().optional(),
  meals: z.array(dietMealSchema).min(1, 'El plan de dieta debe tener al menos una comida definida.'), // Array directo de comidas
});

// Tipos inferidos para usar en la lógica
export type CreateDietPlanInput = z.infer<typeof createDietPlanSchema>;
export type DietMealInput = z.infer<typeof dietMealSchema>; 