import { describe, it, expect } from 'vitest';
import { dietPlanSchema, dietMealSchema } from './dietPlanSchema';

describe('dietPlanSchema', () => {
  const validDietPlan = {
    title: 'Plan de Pérdida de Peso',
    description: 'Descripción del plan',
    startDate: '2025-06-01',
    endDate: '2025-06-30',
    objectives: 'Perder 5kg',
    status: 'ACTIVE',
    notes: 'Notas importantes',
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

  describe('valid diet plan', () => {
    it('should validate a complete valid diet plan', () => {
      const result = dietPlanSchema.safeParse(validDietPlan);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.title).toBe('Plan de Pérdida de Peso');
        expect(result.data.meals).toHaveLength(2);
      }
    });

    it('should validate minimal required fields', () => {
      const minimalPlan = {
        title: 'Plan Mínimo',
        meals: [
          {
            mealType: 'BREAKFAST',
            content: 'Contenido básico',
            dayOfWeek: 'MONDAY'
          }
        ]
      };

      const result = dietPlanSchema.safeParse(minimalPlan);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.status).toBe('ACTIVE'); // default value
      }
    });
  });

  describe('title validation', () => {
    it('should reject empty title', () => {
      const invalidPlan = { ...validDietPlan, title: '' };
      const result = dietPlanSchema.safeParse(invalidPlan);
      
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('El título del plan es obligatorio.');
      }
    });

    it('should reject title that is too short', () => {
      const invalidPlan = { ...validDietPlan, title: 'AB' };
      const result = dietPlanSchema.safeParse(invalidPlan);
      
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('El título debe tener al menos 3 caracteres.');
      }
    });

    it('should reject title that is too long', () => {
      const longTitle = 'A'.repeat(101);
      const invalidPlan = { ...validDietPlan, title: longTitle };
      const result = dietPlanSchema.safeParse(invalidPlan);
      
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('El título no debe exceder 100 caracteres.');
      }
    });
  });

  describe('date validation', () => {
    it('should accept valid date strings', () => {
      const validPlan = {
        ...validDietPlan,
        startDate: '2025-01-01',
        endDate: '2025-12-31'
      };
      
      const result = dietPlanSchema.safeParse(validPlan);
      expect(result.success).toBe(true);
    });

    it('should reject invalid date format', () => {
      const invalidPlan = {
        ...validDietPlan,
        startDate: 'invalid-date'
      };
      
      const result = dietPlanSchema.safeParse(invalidPlan);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Formato de fecha de inicio inválido.');
      }
    });

    it('should reject endDate before startDate', () => {
      const invalidPlan = {
        ...validDietPlan,
        startDate: '2025-06-01',
        endDate: '2025-05-01'
      };
      
      const result = dietPlanSchema.safeParse(invalidPlan);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('La fecha de fin no puede ser anterior a la fecha de inicio.');
        expect(result.error.issues[0].path).toEqual(['endDate']);
      }
    });

    it('should accept same startDate and endDate', () => {
      const validPlan = {
        ...validDietPlan,
        startDate: '2025-06-01',
        endDate: '2025-06-01'
      };
      
      const result = dietPlanSchema.safeParse(validPlan);
      expect(result.success).toBe(true);
    });

    it('should accept optional dates', () => {
      const { startDate: _, endDate: __, ...planWithoutDates } = validDietPlan;
      
      const result = dietPlanSchema.safeParse(planWithoutDates);
      expect(result.success).toBe(true);
    });
  });

  describe('meals validation', () => {
    it('should require at least one meal', () => {
      const invalidPlan = { ...validDietPlan, meals: [] };
      const result = dietPlanSchema.safeParse(invalidPlan);
      
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('El plan de dieta debe tener al menos una comida.');
      }
    });

    it('should reject more than 50 meals', () => {
      const manyMeals = Array(51).fill({
        mealType: 'BREAKFAST',
        content: 'Contenido',
        dayOfWeek: 'MONDAY'
      });
      const invalidPlan = { ...validDietPlan, meals: manyMeals };
      const result = dietPlanSchema.safeParse(invalidPlan);
      
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('El plan no puede tener más de 50 comidas.');
      }
    });
  });

  describe('optional fields', () => {
    it('should accept empty description', () => {
      const plan = { ...validDietPlan, description: '' };
      const result = dietPlanSchema.safeParse(plan);
      expect(result.success).toBe(true);
    });

    it('should accept missing description', () => {
      const { description, ...planWithoutDescription } = validDietPlan;
      const result = dietPlanSchema.safeParse(planWithoutDescription);
      expect(result.success).toBe(true);
    });

    it('should validate description length', () => {
      const longDescription = 'A'.repeat(501);
      const invalidPlan = { ...validDietPlan, description: longDescription };
      const result = dietPlanSchema.safeParse(invalidPlan);
      
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('La descripción no debe exceder 500 caracteres.');
      }
    });
  });
});

describe('dietMealSchema', () => {
  const validMeal = {
    mealType: 'BREAKFAST',
    content: 'Avena con frutas',
    dayOfWeek: 'MONDAY'
  };

  describe('valid meal', () => {
    it('should validate a valid meal', () => {
      const result = dietMealSchema.safeParse(validMeal);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.mealType).toBe('BREAKFAST');
        expect(result.data.content).toBe('Avena con frutas');
        expect(result.data.dayOfWeek).toBe('MONDAY');
      }
    });
  });

  describe('mealType validation', () => {
    it('should validate all valid meal types', () => {
      const validMealTypes = ['BREAKFAST', 'MID_MORNING_SNACK', 'LUNCH', 'AFTERNOON_SNACK', 'DINNER'];
      
      validMealTypes.forEach(mealType => {
        const meal = { ...validMeal, mealType };
        const result = dietMealSchema.safeParse(meal);
        expect(result.success).toBe(true);
      });
    });

    it('should reject invalid meal type', () => {
      const invalidMeal = { ...validMeal, mealType: 'INVALID_MEAL' };
      const result = dietMealSchema.safeParse(invalidMeal);
      expect(result.success).toBe(false);
    });
  });

  describe('content validation', () => {
    it('should require content', () => {
      const invalidMeal = { ...validMeal, content: '' };
      const result = dietMealSchema.safeParse(invalidMeal);
      
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('El contenido de la comida es obligatorio.');
      }
    });

    it('should require minimum content length', () => {
      const invalidMeal = { ...validMeal, content: 'AB' };
      const result = dietMealSchema.safeParse(invalidMeal);
      
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('El contenido debe tener al menos 3 caracteres.');
      }
    });

    it('should validate content max length', () => {
      const longContent = 'A'.repeat(1001);
      const invalidMeal = { ...validMeal, content: longContent };
      const result = dietMealSchema.safeParse(invalidMeal);
      
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('El contenido no debe exceder 1000 caracteres.');
      }
    });
  });

  describe('dayOfWeek validation', () => {
    it('should validate all valid days of week', () => {
      const validDays = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'];
      
      validDays.forEach(dayOfWeek => {
        const meal = { ...validMeal, dayOfWeek };
        const result = dietMealSchema.safeParse(meal);
        expect(result.success).toBe(true);
      });
    });

    it('should reject invalid day of week', () => {
      const invalidMeal = { ...validMeal, dayOfWeek: 'INVALID_DAY' };
      const result = dietMealSchema.safeParse(invalidMeal);
      expect(result.success).toBe(false);
    });
  });
}); 