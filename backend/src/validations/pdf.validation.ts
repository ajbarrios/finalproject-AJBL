import { z } from 'zod';

/**
 * Esquema de validación para la generación de PDFs combinados
 */
export const pdfGenerationSchema = z.object({
  dietPlanId: z.string().uuid().optional(),
  workoutPlanId: z.string().uuid().optional()
}).refine(
  (data) => data.dietPlanId || data.workoutPlanId,
  {
    message: "Al menos un plan (dieta o entrenamiento) debe ser proporcionado",
    path: ["dietPlanId", "workoutPlanId"]
  }
);

/**
 * Tipo TypeScript derivado del esquema Zod
 */
export type PdfGenerationRequest = z.infer<typeof pdfGenerationSchema>;

/**
 * Esquema para validar el parámetro patientId de la URL
 */
export const patientIdParamSchema = z.object({
  patientId: z.string().regex(/^\d+$/, "patientId debe ser un número entero").transform(Number)
});

/**
 * Tipo para los parámetros de la URL
 */
export type PatientIdParams = z.infer<typeof patientIdParamSchema>; 