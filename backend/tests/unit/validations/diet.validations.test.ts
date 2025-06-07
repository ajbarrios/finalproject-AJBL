import { describe, it, expect } from 'vitest';
import { createDietPlanSchema, CreateDietPlanInput, updateDietPlanSchema, UpdateDietPlanInput } from '../../../src/validations/diet.validations';

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

  // Tests para updateDietPlanSchema (TB-014)
  describe('updateDietPlanSchema', () => {
    const validUpdateData: UpdateDietPlanInput = {
      title: 'Plan Actualizado',
      description: 'Nueva descripción',
      startDate: '2025-07-01',
      endDate: '2025-07-31',
      objectives: 'Nuevos objetivos',
      status: 'DRAFT',
      notes: 'Nuevas notas',
      meals: [
        {
          id: 1,
          mealType: 'BREAKFAST',
          content: 'Desayuno actualizado',
          dayOfWeek: 'MONDAY'
        },
        {
          // Sin id - nueva comida
          mealType: 'LUNCH',
          content: 'Nueva comida',
          dayOfWeek: 'TUESDAY'
        }
      ]
    };

    it('should validate complete update data', () => {
      const result = updateDietPlanSchema.safeParse(validUpdateData);
      
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.title).toBe('Plan Actualizado');
        expect(result.data.meals).toHaveLength(2);
        expect(result.data.meals![0].id).toBe(1); // Comida existente
        expect(result.data.meals![1].id).toBeUndefined(); // Nueva comida
      }
    });

    it('should validate minimal update with only title', () => {
      const minimalUpdate = {
        title: 'Solo título actualizado'
      };

      const result = updateDietPlanSchema.safeParse(minimalUpdate);
      
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.title).toBe('Solo título actualizado');
        expect(result.data.meals).toBeUndefined();
      }
    });

    it('should validate update with only meals', () => {
      const mealsOnlyUpdate = {
        meals: [
          {
            id: 5,
            mealType: 'DINNER',
            content: 'Cena actualizada',
            dayOfWeek: 'FRIDAY'
          }
        ]
      };

      const result = updateDietPlanSchema.safeParse(mealsOnlyUpdate);
      
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.meals).toHaveLength(1);
        expect(result.data.title).toBeUndefined();
      }
    });

    describe('at least one field validation', () => {
      it('should reject empty object', () => {
        const emptyUpdate = {};
        const result = updateDietPlanSchema.safeParse(emptyUpdate);
        
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error.issues[0].message).toBe('Debe proporcionar al menos un campo para actualizar.');
        }
      });

      it('should reject object with only undefined values', () => {
        const undefinedUpdate = {
          title: undefined,
          description: undefined,
          meals: undefined
        };
        const result = updateDietPlanSchema.safeParse(undefinedUpdate);
        
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error.issues[0].message).toBe('Debe proporcionar al menos un campo para actualizar.');
        }
      });
    });

    describe('title validation', () => {
      it('should accept valid title', () => {
        const validUpdate = { title: 'Título válido actualizado' };
        const result = updateDietPlanSchema.safeParse(validUpdate);
        expect(result.success).toBe(true);
      });

      it('should reject empty title when provided', () => {
        const invalidUpdate = { title: '' };
        const result = updateDietPlanSchema.safeParse(invalidUpdate);
        
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error.issues[0].message).toBe('El título del plan de dieta es obligatorio.');
        }
      });
    });

    describe('date validation', () => {
      it('should accept valid date updates', () => {
        const validUpdate = {
          startDate: '2025-08-01',
          endDate: '2025-08-31'
        };
        
        const result = updateDietPlanSchema.safeParse(validUpdate);
        expect(result.success).toBe(true);
      });

      it('should reject invalid date format', () => {
        const invalidUpdate = {
          startDate: 'invalid-date-format'
        };
        
        const result = updateDietPlanSchema.safeParse(invalidUpdate);
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error.issues[0].message).toBe('Formato de fecha de inicio inválido.');
        }
      });

      it('should reject endDate before startDate', () => {
        const invalidUpdate = {
          startDate: '2025-08-01',
          endDate: '2025-07-01' // antes de startDate
        };
        
        const result = updateDietPlanSchema.safeParse(invalidUpdate);
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error.issues[0].message).toBe('La fecha de fin no puede ser anterior a la fecha de inicio.');
          expect(result.error.issues[0].path).toEqual(['endDate']);
        }
      });

      it('should accept only startDate', () => {
        const validUpdate = { startDate: '2025-08-01' };
        const result = updateDietPlanSchema.safeParse(validUpdate);
        expect(result.success).toBe(true);
      });

      it('should accept only endDate', () => {
        const validUpdate = { endDate: '2025-08-31' };
        const result = updateDietPlanSchema.safeParse(validUpdate);
        expect(result.success).toBe(true);
      });
    });

    describe('status validation', () => {
      it('should accept ACTIVE status', () => {
        const validUpdate = { status: 'ACTIVE' as const };
        const result = updateDietPlanSchema.safeParse(validUpdate);
        expect(result.success).toBe(true);
      });

      it('should accept DRAFT status', () => {
        const validUpdate = { status: 'DRAFT' as const };
        const result = updateDietPlanSchema.safeParse(validUpdate);
        expect(result.success).toBe(true);
      });

      it('should reject invalid status', () => {
        const invalidUpdate = { status: 'INVALID_STATUS' };
        const result = updateDietPlanSchema.safeParse(invalidUpdate);
        expect(result.success).toBe(false);
      });
    });

    describe('meals validation', () => {
      it('should require at least one meal when meals array is provided', () => {
        const invalidUpdate = { meals: [] };
        const result = updateDietPlanSchema.safeParse(invalidUpdate);
        
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error.issues[0].message).toBe('El plan de dieta debe tener al menos una comida definida.');
        }
      });

      it('should validate meal with existing id', () => {
        const validUpdate = {
          meals: [{
            id: 123,
            mealType: 'BREAKFAST',
            content: 'Desayuno actualizado',
            dayOfWeek: 'WEDNESDAY'
          }]
        };
        
        const result = updateDietPlanSchema.safeParse(validUpdate);
        expect(result.success).toBe(true);
        if (result.success) {
          expect(result.data.meals![0].id).toBe(123);
        }
      });

      it('should validate meal without id (new meal)', () => {
        const validUpdate = {
          meals: [{
            mealType: 'LUNCH',
            content: 'Nueva comida',
            dayOfWeek: 'THURSDAY'
          }]
        };
        
        const result = updateDietPlanSchema.safeParse(validUpdate);
        expect(result.success).toBe(true);
        if (result.success) {
          expect(result.data.meals![0].id).toBeUndefined();
        }
      });

      it('should reject meal with invalid id type', () => {
        const invalidUpdate = {
          meals: [{
            id: 'invalid-id', // debe ser número
            mealType: 'BREAKFAST',
            content: 'Contenido',
            dayOfWeek: 'MONDAY'
          }]
        };
        
        const result = updateDietPlanSchema.safeParse(invalidUpdate);
        expect(result.success).toBe(false);
      });

      it('should reject meal with negative id', () => {
        const invalidUpdate = {
          meals: [{
            id: -5,
            mealType: 'BREAKFAST',
            content: 'Contenido',
            dayOfWeek: 'MONDAY'
          }]
        };
        
        const result = updateDietPlanSchema.safeParse(invalidUpdate);
        expect(result.success).toBe(false);
      });

      it('should reject meal with zero id', () => {
        const invalidUpdate = {
          meals: [{
            id: 0,
            mealType: 'BREAKFAST',
            content: 'Contenido',
            dayOfWeek: 'MONDAY'
          }]
        };
        
        const result = updateDietPlanSchema.safeParse(invalidUpdate);
        expect(result.success).toBe(false);
      });

      it('should require meal content', () => {
        const invalidUpdate = {
          meals: [{
            id: 1,
            mealType: 'BREAKFAST',
            content: '', // vacío
            dayOfWeek: 'MONDAY'
          }]
        };
        
        const result = updateDietPlanSchema.safeParse(invalidUpdate);
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error.issues[0].message).toBe('El contenido de la comida es obligatorio.');
        }
      });

      it('should validate all meal types', () => {
        const validMealTypes = ['BREAKFAST', 'MID_MORNING_SNACK', 'LUNCH', 'AFTERNOON_SNACK', 'DINNER'];
        
        validMealTypes.forEach(mealType => {
          const validUpdate = {
            meals: [{
              mealType,
              content: 'Contenido válido',
              dayOfWeek: 'MONDAY'
            }]
          };
          
          const result = updateDietPlanSchema.safeParse(validUpdate);
          expect(result.success).toBe(true);
        });
      });

      it('should validate all days of week', () => {
        const validDays = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'];
        
        validDays.forEach(dayOfWeek => {
          const validUpdate = {
            meals: [{
              mealType: 'BREAKFAST',
              content: 'Contenido válido',
              dayOfWeek
            }]
          };
          
          const result = updateDietPlanSchema.safeParse(validUpdate);
          expect(result.success).toBe(true);
        });
      });
    });

    describe('complex update scenarios', () => {
      it('should validate mixed meals (existing and new)', () => {
        const complexUpdate = {
          title: 'Plan mixto',
          meals: [
            // Comida existente a actualizar
            {
              id: 1,
              mealType: 'BREAKFAST',
              content: 'Desayuno actualizado',
              dayOfWeek: 'MONDAY'
            },
            // Nueva comida
            {
              mealType: 'MID_MORNING_SNACK',
              content: 'Nuevo snack',
              dayOfWeek: 'MONDAY'
            },
            // Otra comida existente
            {
              id: 15,
              mealType: 'LUNCH',
              content: 'Almuerzo modificado',
              dayOfWeek: 'TUESDAY'
            }
          ]
        };
        
        const result = updateDietPlanSchema.safeParse(complexUpdate);
        expect(result.success).toBe(true);
        if (result.success) {
          expect(result.data.meals).toHaveLength(3);
          expect(result.data.meals![0].id).toBe(1);
          expect(result.data.meals![1].id).toBeUndefined();
          expect(result.data.meals![2].id).toBe(15);
        }
      });

      it('should validate partial field update with date range', () => {
        const partialUpdate = {
          description: 'Descripción actualizada',
          startDate: '2025-09-01',
          endDate: '2025-09-30',
          objectives: 'Objetivos revisados'
        };
        
        const result = updateDietPlanSchema.safeParse(partialUpdate);
        expect(result.success).toBe(true);
        if (result.success) {
          expect(result.data.title).toBeUndefined();
          expect(result.data.status).toBeUndefined();
          expect(result.data.meals).toBeUndefined();
        }
      });

      it('should validate status change only', () => {
        const statusUpdate = {
          status: 'DRAFT' as const
        };
        
        const result = updateDietPlanSchema.safeParse(statusUpdate);
        expect(result.success).toBe(true);
      });

      it('should validate clearing optional fields', () => {
        const clearingUpdate = {
          description: '',
          objectives: '',
          notes: ''
        };
        
        const result = updateDietPlanSchema.safeParse(clearingUpdate);
        expect(result.success).toBe(true);
      });
    });
  });
}); 