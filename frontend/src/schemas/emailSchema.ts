import { z } from 'zod';

// Schema para validar el formulario de envío de email
export const sendEmailSchema = z
  .object({
    recipientEmail: z
      .string()
      .min(1, 'El email del destinatario es obligatorio')
      .email('Formato de email inválido'),
    subject: z
      .string()
      .min(1, 'El asunto es obligatorio')
      .max(200, 'El asunto no puede exceder 200 caracteres'),
    message: z
      .string()
      .max(1000, 'El mensaje no puede exceder 1000 caracteres')
      .optional()
      .transform(val => {
        if (!val || val.trim() === '') return undefined;
        return val.trim();
      }),
    dietPlanId: z
      .string()
      .min(1, 'ID de plan de dieta inválido')
      .optional(),
    workoutPlanId: z
      .string()
      .min(1, 'ID de plan de entrenamiento inválido')
      .optional(),
  })
  .refine(
    (data) => data.dietPlanId || data.workoutPlanId,
    {
      message: 'Debe seleccionar al menos un plan para enviar',
      path: ['dietPlanId'], // Asignamos el error al campo dietPlanId
    }
  );

// Tipo inferido del schema
export type SendEmailFormData = z.infer<typeof sendEmailSchema>;

// Schema para la respuesta del backend
export const emailResponseSchema = z.object({
  message: z.string(),
  recipient: z.string(),
  messageId: z.string().optional(),
  timestamp: z.string(),
  attachment: z.object({
    filename: z.string(),
    size: z.number(),
  }).optional(),
  plans: z.object({
    dietPlan: z.object({
      id: z.number(),
      title: z.string(),
    }).nullable(),
    workoutPlan: z.object({
      id: z.number(),
      title: z.string(),
    }).nullable(),
  }).optional(),
});

export type EmailResponse = z.infer<typeof emailResponseSchema>; 