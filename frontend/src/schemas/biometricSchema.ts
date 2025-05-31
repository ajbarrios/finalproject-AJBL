import { z } from 'zod';

// Función para validar que al menos uno de los campos numéricos esté presente
const atLeastOneMeasurement = (data: Record<string, unknown>): boolean => {
  const measurementFields = [
    'weight',
    'bodyFatPercentage',
    'musclePercentage',
    'waterPercentage',
    'backChestDiameter',
    'waistDiameter',
    'armsDiameter',
    'legsDiameter',
    'calvesDiameter'
  ];

  return measurementFields.some(field => 
    data[field] !== undefined && 
    data[field] !== null && 
    data[field] !== ''
  );
};

// Esquema para validar datos numéricos opcionales pero con formato específico
const optionalNumberSchema = z
  .union([
    z.number()
      .min(0, 'El valor debe ser mayor o igual a 0')
      .max(1000, 'El valor es demasiado alto'),
    z.null(),
    z.undefined()
  ])
  .optional()
  .transform(val => {
    if (!val) return null;
    return val;
  });

// Esquema para validar datos de porcentaje
const percentageSchema = z
  .union([
    z.number()
      .min(0, 'El porcentaje debe estar entre 0 y 100')
      .max(100, 'El porcentaje debe estar entre 0 y 100'),
    z.null(),
    z.undefined()
  ])
  .optional()
  .transform(val => {
    if (!val) return null;
    return val;
  });

// Esquema principal para el formulario de registro biométrico
export const biometricRecordSchema = z
  .object({
    recordDate: z.string().min(1, 'La fecha es obligatoria'),
    weight: optionalNumberSchema,
    bodyFatPercentage: percentageSchema,
    musclePercentage: percentageSchema,
    waterPercentage: percentageSchema,
    backChestDiameter: optionalNumberSchema,
    waistDiameter: optionalNumberSchema,
    armsDiameter: optionalNumberSchema,
    legsDiameter: optionalNumberSchema,
    calvesDiameter: optionalNumberSchema,
    notes: z
      .union([z.string(), z.null(), z.undefined()])
      .optional()
      .transform(val => {
        if (!val) return null;
        return val;
      }),
  })
  .refine(atLeastOneMeasurement, {
    message: 'Debe proporcionar al menos una medida biométrica',
    path: ['weight'], // Asignamos el error al campo peso por defecto
  });

// Tipo inferido del esquema
export type BiometricRecordFormData = z.infer<typeof biometricRecordSchema>; 