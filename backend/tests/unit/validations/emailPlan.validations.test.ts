import { describe, it, expect } from 'vitest';
import { 
  sendPlanEmailSchema, 
  sendEmailParamsSchema, 
  SendPlanEmailData, 
  SendEmailParams 
} from '../../../src/validations/emailPlan.validations';

describe('EmailPlan Validations', () => {
  describe('sendPlanEmailSchema', () => {
    const validEmailData: SendPlanEmailData = {
      recipientEmail: 'paciente@email.com',
      subject: 'Tu Plan Personalizado - NutriTrack Pro',
      bodyMessage: 'Mensaje personalizado para el paciente',
      dietPlanId: '123',
      workoutPlanId: '456'
    };

    it('should validate complete valid email data with both plans', () => {
      const result = sendPlanEmailSchema.safeParse(validEmailData);
      
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual(validEmailData);
      }
    });

    it('should validate with only diet plan', () => {
      const dataWithOnlyDiet = {
        recipientEmail: 'paciente@email.com',
        subject: 'Solo Plan de Dieta',
        bodyMessage: 'Aquí tienes tu plan de dieta',
        dietPlanId: '123'
      };

      const result = sendPlanEmailSchema.safeParse(dataWithOnlyDiet);
      
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.dietPlanId).toBe(dataWithOnlyDiet.dietPlanId);
        expect(result.data.workoutPlanId).toBeUndefined();
      }
    });

    it('should validate with only workout plan', () => {
      const dataWithOnlyWorkout = {
        recipientEmail: 'paciente@email.com',
        subject: 'Solo Plan de Entrenamiento',
        bodyMessage: 'Aquí tienes tu plan de entrenamiento',
        workoutPlanId: '456'
      };

      const result = sendPlanEmailSchema.safeParse(dataWithOnlyWorkout);
      
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.workoutPlanId).toBe(dataWithOnlyWorkout.workoutPlanId);
        expect(result.data.dietPlanId).toBeUndefined();
      }
    });

    it('should validate without bodyMessage (optional field)', () => {
      const dataWithoutBodyMessage = {
        recipientEmail: 'paciente@email.com',
        subject: 'Plan Personalizado',
        dietPlanId: '123'
      };

      const result = sendPlanEmailSchema.safeParse(dataWithoutBodyMessage);
      
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.bodyMessage).toBeUndefined();
      }
    });

    describe('recipientEmail validation', () => {
      it('should reject empty email', () => {
        const invalidData = { ...validEmailData, recipientEmail: '' };
        const result = sendPlanEmailSchema.safeParse(invalidData);
        
        expect(result.success).toBe(false);
        if (!result.success) {
          // Zod valida el formato de email antes que la longitud mínima
          expect(result.error.issues[0].message).toBe('Formato de email inválido');
        }
      });

      it('should reject invalid email format', () => {
        const invalidData = { ...validEmailData, recipientEmail: 'email-invalido' };
        const result = sendPlanEmailSchema.safeParse(invalidData);
        
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error.issues[0].message).toBe('Formato de email inválido');
        }
      });

      it('should reject missing email', () => {
        const { recipientEmail, ...invalidData } = validEmailData;
        const result = sendPlanEmailSchema.safeParse(invalidData);
        
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error.issues[0].code).toBe('invalid_type');
        }
      });
    });

    describe('subject validation', () => {
      it('should reject empty subject', () => {
        const invalidData = { ...validEmailData, subject: '' };
        const result = sendPlanEmailSchema.safeParse(invalidData);
        
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error.issues[0].message).toBe('El asunto es requerido');
        }
      });

      it('should reject subject too long', () => {
        const longSubject = 'a'.repeat(201); // 201 caracteres
        const invalidData = { ...validEmailData, subject: longSubject };
        const result = sendPlanEmailSchema.safeParse(invalidData);
        
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error.issues[0].message).toBe('El asunto no puede exceder 200 caracteres');
        }
      });

      it('should accept subject at max length (200 chars)', () => {
        const maxSubject = 'a'.repeat(200); // 200 caracteres exactos
        const validData = { ...validEmailData, subject: maxSubject };
        const result = sendPlanEmailSchema.safeParse(validData);
        
        expect(result.success).toBe(true);
      });

      it('should reject missing subject', () => {
        const { subject, ...invalidData } = validEmailData;
        const result = sendPlanEmailSchema.safeParse(invalidData);
        
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error.issues[0].code).toBe('invalid_type');
        }
      });
    });

    describe('bodyMessage validation', () => {
      it('should reject bodyMessage too long', () => {
        const longMessage = 'a'.repeat(1001); // 1001 caracteres
        const invalidData = { ...validEmailData, bodyMessage: longMessage };
        const result = sendPlanEmailSchema.safeParse(invalidData);
        
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error.issues[0].message).toBe('El mensaje no puede exceder 1000 caracteres');
        }
      });

      it('should accept bodyMessage at max length (1000 chars)', () => {
        const maxMessage = 'a'.repeat(1000); // 1000 caracteres exactos
        const validData = { ...validEmailData, bodyMessage: maxMessage };
        const result = sendPlanEmailSchema.safeParse(validData);
        
        expect(result.success).toBe(true);
      });

      it('should accept empty bodyMessage', () => {
        const validData = { ...validEmailData, bodyMessage: '' };
        const result = sendPlanEmailSchema.safeParse(validData);
        
        expect(result.success).toBe(true);
      });
    });

    describe('plan IDs validation', () => {
      it('should reject invalid numeric format for dietPlanId', () => {
        const invalidData = { ...validEmailData, dietPlanId: 'invalid-id' };
        const result = sendPlanEmailSchema.safeParse(invalidData);
        
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error.issues[0].message).toBe('El ID del plan de dieta debe ser un número válido');
        }
      });

      it('should reject invalid numeric format for workoutPlanId', () => {
        const invalidData = { ...validEmailData, workoutPlanId: 'invalid-id' };
        const result = sendPlanEmailSchema.safeParse(invalidData);
        
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error.issues[0].message).toBe('El ID del plan de entrenamiento debe ser un número válido');
        }
      });

      it('should reject when no plans are specified', () => {
        const { dietPlanId, workoutPlanId, ...invalidData } = validEmailData;
        const result = sendPlanEmailSchema.safeParse(invalidData);
        
        expect(result.success).toBe(false);
        if (!result.success) {
          const planError = result.error.issues.find(issue => issue.message === 'Debe especificar al menos un plan (dieta o entrenamiento)');
          expect(planError).toBeTruthy();
          expect(planError?.path).toEqual(['plans']);
        }
      });

      it('should accept valid numeric ID formats', () => {
        const validIDs = {
          dietPlanId: '123',
          workoutPlanId: '456'
        };
        
        const validData = { ...validEmailData, ...validIDs };
        const result = sendPlanEmailSchema.safeParse(validData);
        
        expect(result.success).toBe(true);
      });
    });
  });

  describe('sendEmailParamsSchema', () => {
    const validParams: SendEmailParams = {
      patientId: '123'
    };

    it('should validate valid patient ID', () => {
      const result = sendEmailParamsSchema.safeParse(validParams);
      
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual(validParams);
      }
    });

    it('should reject invalid numeric format for patientId', () => {
      const invalidParams = { patientId: 'invalid-id' };
      const result = sendEmailParamsSchema.safeParse(invalidParams);
      
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('El ID del paciente debe ser un número válido');
      }
    });

    it('should reject missing patientId', () => {
      const invalidParams = {};
      const result = sendEmailParamsSchema.safeParse(invalidParams);
      
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].code).toBe('invalid_type');
      }
    });

    it('should reject empty patientId', () => {
      const invalidParams = { patientId: '' };
      const result = sendEmailParamsSchema.safeParse(invalidParams);
      
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('El ID del paciente debe ser un número válido');
      }
    });

    it('should accept different valid numeric ID formats', () => {
      const validIDs = ['1', '123', '9999', '42'];

      validIDs.forEach(id => {
        const params = { patientId: id };
        const result = sendEmailParamsSchema.safeParse(params);
        
        expect(result.success).toBe(true);
        if (result.success) {
          expect(result.data.patientId).toBe(id);
        }
      });
    });
  });
}); 