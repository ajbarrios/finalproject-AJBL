import { describe, it, expect } from 'vitest';
import { createDietPlanSchema, CreateDietPlanInput } from '../../../src/validations/diet.validations';

describe('Diet Validations', () => {
  describe('createDietPlanSchema', () => {
    const validPlanData: CreateDietPlanInput = {
      title: 'Plan de Pérdida de Peso',
      description: 'Descripción detallada del plan',
      startDate: '2025-06-01',
      endDate: '2025-06-30',
      objectives: 'Perder 5kg en un mes',
      status: 'ACTIVE',
      notes: 'Notas importantes sobre el plan',
      meals: [
        {
          mealType: 'BREAKFAST',
          content: 'Avena con frutas',
          dayOfWeek: 'MONDAY'
        },
        {
          mealType: 'LUNCH',
          content: 'Ensalada con proteína',
          dayOfWeek: 'TUESDAY'
        }
      ]
    };

    it('should validate a complete valid diet plan', () => {
      const result = createDietPlanSchema.safeParse(validPlanData);
      
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual(validPlanData);
      }
    });

    it('should validate minimal required fields', () => {
      const minimalData = {
        title: 'Plan Mínimo',
        meals: [
          {
            mealType: 'BREAKFAST',
            content: 'Contenido básico',
            dayOfWeek: 'MONDAY'
          }
        ]
      };

      const result = createDietPlanSchema.safeParse(minimalData);
      
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.title).toBe('Plan Mínimo');
        expect(result.data.status).toBe('ACTIVE'); // default value
        expect(result.data.meals).toHaveLength(1);
      }
    });

    describe('title validation', () => {
      it('should reject empty title', () => {
        const invalidData = { ...validPlanData, title: '' };
        const result = createDietPlanSchema.safeParse(invalidData);
        
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error.issues[0].message).toBe('El título del plan de dieta es obligatorio.');
        }
      });

      it('should reject missing title', () => {
        const { title, ...invalidData } = validPlanData;
        const result = createDietPlanSchema.safeParse(invalidData);
        
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error.issues[0].code).toBe('invalid_type');
        }
      });
    });

    describe('date validation', () => {
      it('should accept valid date strings', () => {
        const validData = {
          ...validPlanData,
          startDate: '2025-01-01',
          endDate: '2025-12-31'
        };
        
        const result = createDietPlanSchema.safeParse(validData);
        expect(result.success).toBe(true);
      });

      it('should reject invalid date format', () => {
        const invalidData = {
          ...validPlanData,
          startDate: 'invalid-date'
        };
        
        const result = createDietPlanSchema.safeParse(invalidData);
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error.issues[0].message).toBe('Formato de fecha de inicio inválido.');
        }
      });

      it('should reject endDate before startDate', () => {
        const invalidData = {
          ...validPlanData,
          startDate: '2025-06-01',
          endDate: '2025-05-01' // antes de startDate
        };
        
        const result = createDietPlanSchema.safeParse(invalidData);
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error.issues[0].message).toBe('La fecha de fin no puede ser anterior a la fecha de inicio.');
          expect(result.error.issues[0].path).toEqual(['endDate']);
        }
      });

      it('should accept same startDate and endDate', () => {
        const validData = {
          ...validPlanData,
          startDate: '2025-06-01',
          endDate: '2025-06-01'
        };
        
        const result = createDietPlanSchema.safeParse(validData);
        expect(result.success).toBe(true);
      });

      it('should accept optional dates', () => {
        const { startDate, endDate, ...validData } = validPlanData;
        
        const result = createDietPlanSchema.safeParse(validData);
        expect(result.success).toBe(true);
      });
    });

    describe('status validation', () => {
      it('should accept ACTIVE status', () => {
        const validData = { ...validPlanData, status: 'ACTIVE' as const };
        const result = createDietPlanSchema.safeParse(validData);
        expect(result.success).toBe(true);
      });

      it('should accept DRAFT status', () => {
        const validData = { ...validPlanData, status: 'DRAFT' as const };
        const result = createDietPlanSchema.safeParse(validData);
        expect(result.success).toBe(true);
      });

      it('should reject invalid status', () => {
        const invalidData = { ...validPlanData, status: 'INVALID' };
        const result = createDietPlanSchema.safeParse(invalidData);
        expect(result.success).toBe(false);
      });

      it('should default to ACTIVE when status is missing', () => {
        const { status, ...dataWithoutStatus } = validPlanData;
        const result = createDietPlanSchema.safeParse(dataWithoutStatus);
        
        expect(result.success).toBe(true);
        if (result.success) {
          expect(result.data.status).toBe('ACTIVE');
        }
      });
    });

    describe('meals validation', () => {
      it('should require at least one meal', () => {
        const invalidData = { ...validPlanData, meals: [] };
        const result = createDietPlanSchema.safeParse(invalidData);
        
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error.issues[0].message).toBe('El plan de dieta debe tener al menos una comida definida.');
        }
      });

      it('should reject missing meals', () => {
        const { meals, ...invalidData } = validPlanData;
        const result = createDietPlanSchema.safeParse(invalidData);
        
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error.issues[0].code).toBe('invalid_type');
        }
      });

      describe('meal validation', () => {
        it('should validate valid meal types', () => {
          const validMealTypes = ['BREAKFAST', 'MID_MORNING_SNACK', 'LUNCH', 'AFTERNOON_SNACK', 'DINNER'];
          
          validMealTypes.forEach(mealType => {
            const validData = {
              ...validPlanData,
              meals: [{
                mealType,
                content: 'Contenido válido',
                dayOfWeek: 'MONDAY'
              }]
            };
            
            const result = createDietPlanSchema.safeParse(validData);
            expect(result.success).toBe(true);
          });
        });

        it('should reject invalid meal type', () => {
          const invalidData = {
            ...validPlanData,
            meals: [{
              mealType: 'INVALID_MEAL',
              content: 'Contenido',
              dayOfWeek: 'MONDAY'
            }]
          };
          
          const result = createDietPlanSchema.safeParse(invalidData);
          expect(result.success).toBe(false);
        });

        it('should require meal content', () => {
          const invalidData = {
            ...validPlanData,
            meals: [{
              mealType: 'BREAKFAST',
              content: '',
              dayOfWeek: 'MONDAY'
            }]
          };
          
          const result = createDietPlanSchema.safeParse(invalidData);
          expect(result.success).toBe(false);
          if (!result.success) {
            expect(result.error.issues[0].message).toBe('El contenido de la comida es obligatorio.');
          }
        });

        it('should validate valid days of week', () => {
          const validDays = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'];
          
          validDays.forEach(dayOfWeek => {
            const validData = {
              ...validPlanData,
              meals: [{
                mealType: 'BREAKFAST',
                content: 'Contenido válido',
                dayOfWeek
              }]
            };
            
            const result = createDietPlanSchema.safeParse(validData);
            expect(result.success).toBe(true);
          });
        });

        it('should reject invalid day of week', () => {
          const invalidData = {
            ...validPlanData,
            meals: [{
              mealType: 'BREAKFAST',
              content: 'Contenido',
              dayOfWeek: 'INVALID_DAY'
            }]
          };
          
          const result = createDietPlanSchema.safeParse(invalidData);
          expect(result.success).toBe(false);
        });
      });
    });

    describe('optional fields validation', () => {
      it('should accept empty description', () => {
        const validData = { ...validPlanData, description: '' };
        const result = createDietPlanSchema.safeParse(validData);
        expect(result.success).toBe(true);
      });

      it('should accept missing description', () => {
        const { description, ...validData } = validPlanData;
        const result = createDietPlanSchema.safeParse(validData);
        expect(result.success).toBe(true);
      });

      it('should accept empty objectives', () => {
        const validData = { ...validPlanData, objectives: '' };
        const result = createDietPlanSchema.safeParse(validData);
        expect(result.success).toBe(true);
      });

      it('should accept empty notes', () => {
        const validData = { ...validPlanData, notes: '' };
        const result = createDietPlanSchema.safeParse(validData);
        expect(result.success).toBe(true);
      });
    });

    describe('complex scenarios', () => {
      it('should validate plan with multiple meals across different days', () => {
        const complexPlan = {
          title: 'Plan Semanal Completo',
          status: 'ACTIVE' as const,
          meals: [
            { mealType: 'BREAKFAST', content: 'Desayuno Lunes', dayOfWeek: 'MONDAY' },
            { mealType: 'LUNCH', content: 'Almuerzo Lunes', dayOfWeek: 'MONDAY' },
            { mealType: 'DINNER', content: 'Cena Lunes', dayOfWeek: 'MONDAY' },
            { mealType: 'BREAKFAST', content: 'Desayuno Martes', dayOfWeek: 'TUESDAY' },
            { mealType: 'MID_MORNING_SNACK', content: 'Snack Martes', dayOfWeek: 'TUESDAY' },
          ]
        };
        
        const result = createDietPlanSchema.safeParse(complexPlan);
        expect(result.success).toBe(true);
        if (result.success) {
          expect(result.data.meals).toHaveLength(5);
        }
      });

      it('should validate plan with only weekend meals', () => {
        const weekendPlan = {
          title: 'Plan de Fin de Semana',
          status: 'DRAFT' as const,
          startDate: '2025-06-07',
          endDate: '2025-06-08',
          meals: [
            { mealType: 'BREAKFAST', content: 'Brunch Sábado', dayOfWeek: 'SATURDAY' },
            { mealType: 'DINNER', content: 'Cena Domingo', dayOfWeek: 'SUNDAY' },
          ]
        };
        
        const result = createDietPlanSchema.safeParse(weekendPlan);
        expect(result.success).toBe(true);
      });
    });
  });
}); 