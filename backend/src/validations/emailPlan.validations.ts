import { z } from 'zod';

// Schema de validación para envío de email con planes
export const sendPlanEmailSchema = z.object({
  recipientEmail: z
    .string()
    .email('Formato de email inválido')
    .min(1, 'El email del destinatario es requerido'),
  
  subject: z
    .string()
    .min(1, 'El asunto es requerido')
    .max(200, 'El asunto no puede exceder 200 caracteres'),
  
  bodyMessage: z
    .string()
    .max(1000, 'El mensaje no puede exceder 1000 caracteres')
    .optional(),
  
  dietPlanId: z
    .string()
    .regex(/^\d+$/, 'El ID del plan de dieta debe ser un número válido')
    .optional(),
  
  workoutPlanId: z
    .string()
    .regex(/^\d+$/, 'El ID del plan de entrenamiento debe ser un número válido')
    .optional()
}).refine(data => data.dietPlanId || data.workoutPlanId, {
  message: 'Debe especificar al menos un plan (dieta o entrenamiento)',
  path: ['plans']
});

// Tipo TypeScript derivado del schema
export type SendPlanEmailData = z.infer<typeof sendPlanEmailSchema>;

// Schema para parámetros de ruta
export const sendEmailParamsSchema = z.object({
  patientId: z
    .string()
    .regex(/^\d+$/, 'El ID del paciente debe ser un número válido')
});

export type SendEmailParams = z.infer<typeof sendEmailParamsSchema>; 