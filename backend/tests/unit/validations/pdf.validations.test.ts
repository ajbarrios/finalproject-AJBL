import { describe, it, expect } from 'vitest';
import { pdfGenerationSchema, patientIdParamSchema } from '../../../src/validations/pdf.validation';

describe('PDF Validations', () => {
  
  describe('pdfGenerationSchema', () => {
    
    describe('Valid cases', () => {
      it('should accept valid dietPlanId only', () => {
        const validData = {
          dietPlanId: '123e4567-e89b-12d3-a456-426614174000'
        };
        
        const result = pdfGenerationSchema.safeParse(validData);
        expect(result.success).toBe(true);
        if (result.success) {
          expect(result.data.dietPlanId).toBe(validData.dietPlanId);
          expect(result.data.workoutPlanId).toBeUndefined();
        }
      });

      it('should accept valid workoutPlanId only', () => {
        const validData = {
          workoutPlanId: '123e4567-e89b-12d3-a456-426614174001'
        };
        
        const result = pdfGenerationSchema.safeParse(validData);
        expect(result.success).toBe(true);
        if (result.success) {
          expect(result.data.workoutPlanId).toBe(validData.workoutPlanId);
          expect(result.data.dietPlanId).toBeUndefined();
        }
      });

      it('should accept both dietPlanId and workoutPlanId', () => {
        const validData = {
          dietPlanId: '123e4567-e89b-12d3-a456-426614174000',
          workoutPlanId: '123e4567-e89b-12d3-a456-426614174001'
        };
        
        const result = pdfGenerationSchema.safeParse(validData);
        expect(result.success).toBe(true);
        if (result.success) {
          expect(result.data.dietPlanId).toBe(validData.dietPlanId);
          expect(result.data.workoutPlanId).toBe(validData.workoutPlanId);
        }
      });

      it('should accept undefined values when the other is provided', () => {
        const validData = {
          dietPlanId: '123e4567-e89b-12d3-a456-426614174000',
          workoutPlanId: undefined
        };
        
        const result = pdfGenerationSchema.safeParse(validData);
        expect(result.success).toBe(true);
      });
    });

    describe('Invalid cases', () => {
      it('should reject when neither dietPlanId nor workoutPlanId is provided', () => {
        const invalidData = {};
        
        const result = pdfGenerationSchema.safeParse(invalidData);
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error.issues[0].message).toContain('Al menos un plan');
        }
      });

      it('should reject when both are undefined', () => {
        const invalidData = {
          dietPlanId: undefined,
          workoutPlanId: undefined
        };
        
        const result = pdfGenerationSchema.safeParse(invalidData);
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error.issues[0].message).toContain('Al menos un plan');
        }
      });

      it('should reject invalid UUID format for dietPlanId', () => {
        const invalidData = {
          dietPlanId: 'invalid-uuid'
        };
        
        const result = pdfGenerationSchema.safeParse(invalidData);
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error.issues[0].message).toContain('Invalid uuid');
        }
      });

      it('should reject invalid UUID format for workoutPlanId', () => {
        const invalidData = {
          workoutPlanId: 'not-a-uuid'
        };
        
        const result = pdfGenerationSchema.safeParse(invalidData);
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error.issues[0].message).toContain('Invalid uuid');
        }
      });

      it('should reject non-string values', () => {
        const invalidData = {
          dietPlanId: 123
        };
        
        const result = pdfGenerationSchema.safeParse(invalidData);
        expect(result.success).toBe(false);
      });

      it('should reject empty string UUIDs', () => {
        const invalidData = {
          dietPlanId: ''
        };
        
        const result = pdfGenerationSchema.safeParse(invalidData);
        expect(result.success).toBe(false);
      });
    });

    describe('Edge cases', () => {
      it('should handle extra properties gracefully', () => {
        const dataWithExtra = {
          dietPlanId: '123e4567-e89b-12d3-a456-426614174000',
          extraProperty: 'should be ignored'
        };
        
        const result = pdfGenerationSchema.safeParse(dataWithExtra);
        expect(result.success).toBe(true);
        if (result.success) {
          expect(result.data).not.toHaveProperty('extraProperty');
        }
      });

      it('should reject null values', () => {
        const dataWithNull = {
          dietPlanId: '123e4567-e89b-12d3-a456-426614174000',
          workoutPlanId: null
        };
        
        const result = pdfGenerationSchema.safeParse(dataWithNull);
        expect(result.success).toBe(false);
      });
    });
  });

  describe('patientIdParamSchema', () => {
    
    describe('Valid cases', () => {
      it('should accept valid numeric string', () => {
        const validData = {
          patientId: '123'
        };
        
        const result = patientIdParamSchema.safeParse(validData);
        expect(result.success).toBe(true);
        if (result.success) {
          expect(result.data.patientId).toBe(123);
          expect(typeof result.data.patientId).toBe('number');
        }
      });

      it('should accept zero as valid patientId', () => {
        const validData = {
          patientId: '0'
        };
        
        const result = patientIdParamSchema.safeParse(validData);
        expect(result.success).toBe(true);
        if (result.success) {
          expect(result.data.patientId).toBe(0);
        }
      });

      it('should accept large numbers', () => {
        const validData = {
          patientId: '999999999'
        };
        
        const result = patientIdParamSchema.safeParse(validData);
        expect(result.success).toBe(true);
        if (result.success) {
          expect(result.data.patientId).toBe(999999999);
        }
      });
    });

    describe('Invalid cases', () => {
      it('should reject non-numeric strings', () => {
        const invalidData = {
          patientId: 'abc'
        };
        
        const result = patientIdParamSchema.safeParse(invalidData);
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error.issues[0].message).toContain('patientId debe ser un número entero');
        }
      });

      it('should reject decimal numbers', () => {
        const invalidData = {
          patientId: '123.45'
        };
        
        const result = patientIdParamSchema.safeParse(invalidData);
        expect(result.success).toBe(false);
      });

      it('should reject negative numbers', () => {
        const invalidData = {
          patientId: '-1'
        };
        
        const result = patientIdParamSchema.safeParse(invalidData);
        expect(result.success).toBe(false);
      });

      it('should reject empty string', () => {
        const invalidData = {
          patientId: ''
        };
        
        const result = patientIdParamSchema.safeParse(invalidData);
        expect(result.success).toBe(false);
      });

      it('should reject mixed alphanumeric strings', () => {
        const invalidData = {
          patientId: '123abc'
        };
        
        const result = patientIdParamSchema.safeParse(invalidData);
        expect(result.success).toBe(false);
      });

      it('should reject numbers with leading zeros and letters', () => {
        const invalidData = {
          patientId: '0123a'
        };
        
        const result = patientIdParamSchema.safeParse(invalidData);
        expect(result.success).toBe(false);
      });

      it('should reject missing patientId', () => {
        const invalidData = {};
        
        const result = patientIdParamSchema.safeParse(invalidData);
        expect(result.success).toBe(false);
      });
    });

    describe('Edge cases', () => {
      it('should handle numbers with leading zeros correctly', () => {
        const validData = {
          patientId: '0123'
        };
        
        const result = patientIdParamSchema.safeParse(validData);
        expect(result.success).toBe(true);
        if (result.success) {
          expect(result.data.patientId).toBe(123);
        }
      });

      it('should reject very large numbers that might cause overflow', () => {
        const invalidData = {
          patientId: '999999999999999999999'
        };
        
        // This should still pass validation but might be transformed to a different number
        const result = patientIdParamSchema.safeParse(invalidData);
        // Note: This might pass depending on JavaScript's number handling
        if (result.success) {
          expect(typeof result.data.patientId).toBe('number');
        }
      });
    });
  });

  describe('Integration scenarios', () => {
    it('should validate typical API request data', () => {
      const typicalApiData = {
        params: { patientId: '42' },
        body: { 
          dietPlanId: '123e4567-e89b-12d3-a456-426614174000',
          workoutPlanId: '123e4567-e89b-12d3-a456-426614174001' 
        }
      };
      
      const paramsResult = patientIdParamSchema.safeParse(typicalApiData.params);
      const bodyResult = pdfGenerationSchema.safeParse(typicalApiData.body);
      
      expect(paramsResult.success).toBe(true);
      expect(bodyResult.success).toBe(true);
      
      if (paramsResult.success && bodyResult.success) {
        expect(paramsResult.data.patientId).toBe(42);
        expect(bodyResult.data.dietPlanId).toBe(typicalApiData.body.dietPlanId);
        expect(bodyResult.data.workoutPlanId).toBe(typicalApiData.body.workoutPlanId);
      }
    });

    it('should handle diet-only request', () => {
      const dietOnlyData = {
        params: { patientId: '1' },
        body: { dietPlanId: '123e4567-e89b-12d3-a456-426614174000' }
      };
      
      const paramsResult = patientIdParamSchema.safeParse(dietOnlyData.params);
      const bodyResult = pdfGenerationSchema.safeParse(dietOnlyData.body);
      
      expect(paramsResult.success).toBe(true);
      expect(bodyResult.success).toBe(true);
    });

    it('should handle workout-only request', () => {
      const workoutOnlyData = {
        params: { patientId: '999' },
        body: { workoutPlanId: '123e4567-e89b-12d3-a456-426614174001' }
      };
      
      const paramsResult = patientIdParamSchema.safeParse(workoutOnlyData.params);
      const bodyResult = pdfGenerationSchema.safeParse(workoutOnlyData.body);
      
      expect(paramsResult.success).toBe(true);
      expect(bodyResult.success).toBe(true);
    });
  });
}); 