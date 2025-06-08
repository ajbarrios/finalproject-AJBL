import { describe, it, expect, beforeEach } from 'vitest';
import { PDFService } from '../../../src/services/pdfService';
import { Patient, DietPlan, WorkoutPlan } from '../../../src/generated/prisma';

describe('PDFService', () => {
  let pdfService: PDFService;
  let mockPatient: Patient;
  let mockDietPlan: DietPlan;
  let mockWorkoutPlan: WorkoutPlan;

  beforeEach(() => {
    pdfService = new PDFService();

    // Mock de datos del paciente
    mockPatient = {
      id: 1,
      professionalId: 1,
      firstName: 'Juan',
      lastName: 'Pérez',
      email: 'juan.perez@email.com',
      phone: '+34123456789',
      birthDate: new Date('1990-05-15'),
      gender: 'Masculino',
      height: 175,
      medicalNotes: 'Sin alergias conocidas',
      dietRestrictions: 'Sin restricciones',
      objectives: 'Perder 5kg en 3 meses',
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01')
    };

    // Mock de plan de dieta
    mockDietPlan = {
      id: 101,
      professionalId: 1,
      patientId: 1,
      title: 'Plan de Pérdida de Peso',
      description: 'Plan diseñado para perder peso de forma saludable',
      startDate: new Date('2024-02-01'),
      endDate: new Date('2024-04-30'),
      objectives: 'Perder 5kg manteniendo masa muscular',
      isActive: true,
      isDeleted: false,
      deletedAt: null,
      notes: 'Seguir estrictamente las comidas',
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01')
    };

    // Mock de plan de entrenamiento
    mockWorkoutPlan = {
      id: 201,
      professionalId: 1,
      patientId: 1,
      title: 'Rutina de Fuerza y Cardio',
      description: 'Combinación de ejercicios de fuerza y cardiovasculares',
      startDate: new Date('2024-02-01'),
      endDate: new Date('2024-04-30'),
      objectives: 'Aumentar fuerza y resistencia cardiovascular',
      isActive: true,
      notes: 'Incrementar intensidad progresivamente',
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01')
    };
  });

  describe('generateCombinedPlansPDF', () => {
    it('should generate PDF with both diet and workout plans', async () => {
      const options = {
        patient: mockPatient,
        dietPlan: mockDietPlan,
        workoutPlan: mockWorkoutPlan
      };

      const result = await pdfService.generateCombinedPlansPDF(options);

      expect(result).toBeInstanceOf(Buffer);
      expect(result.length).toBeGreaterThan(0);

      // Convertir buffer a string para verificar contenido
      const pdfContent = result.toString('utf-8');
      
      // Verificar información del paciente
      expect(pdfContent).toContain('Juan Pérez');
      expect(pdfContent).toContain('juan.perez@email.com');
      expect(pdfContent).toContain('NUTRITRACK PRO - PLAN PERSONALIZADO');

      // Verificar plan de dieta
      expect(pdfContent).toContain('PLAN DE DIETA: Plan de Pérdida de Peso');
      expect(pdfContent).toContain('Plan diseñado para perder peso de forma saludable');
      expect(pdfContent).toContain('Perder 5kg manteniendo masa muscular');
      expect(pdfContent).toContain('Activo');

      // Verificar plan de entrenamiento
      expect(pdfContent).toContain('PLAN DE ENTRENAMIENTO: Rutina de Fuerza y Cardio');
      expect(pdfContent).toContain('Combinación de ejercicios de fuerza y cardiovasculares');
      expect(pdfContent).toContain('Aumentar fuerza y resistencia cardiovascular');
    });

    it('should generate PDF with only diet plan', async () => {
      const options = {
        patient: mockPatient,
        dietPlan: mockDietPlan,
        workoutPlan: null
      };

      const result = await pdfService.generateCombinedPlansPDF(options);

      expect(result).toBeInstanceOf(Buffer);
      
      const pdfContent = result.toString('utf-8');
      
      // Verificar información del paciente
      expect(pdfContent).toContain('Juan Pérez');
      
      // Verificar que incluye plan de dieta
      expect(pdfContent).toContain('PLAN DE DIETA: Plan de Pérdida de Peso');
      
      // Verificar que NO incluye plan de entrenamiento
      expect(pdfContent).not.toContain('PLAN DE ENTRENAMIENTO:');
    });

    it('should generate PDF with only workout plan', async () => {
      const options = {
        patient: mockPatient,
        dietPlan: null,
        workoutPlan: mockWorkoutPlan
      };

      const result = await pdfService.generateCombinedPlansPDF(options);

      expect(result).toBeInstanceOf(Buffer);
      
      const pdfContent = result.toString('utf-8');
      
      // Verificar información del paciente
      expect(pdfContent).toContain('Juan Pérez');
      
      // Verificar que incluye plan de entrenamiento
      expect(pdfContent).toContain('PLAN DE ENTRENAMIENTO: Rutina de Fuerza y Cardio');
      
      // Verificar que NO incluye plan de dieta
      expect(pdfContent).not.toContain('PLAN DE DIETA:');
    });

    it('should generate PDF with patient without email', async () => {
      const patientWithoutEmail = {
        ...mockPatient,
        email: null
      };

      const options = {
        patient: patientWithoutEmail,
        dietPlan: mockDietPlan,
        workoutPlan: null
      };

      const result = await pdfService.generateCombinedPlansPDF(options);
      const pdfContent = result.toString('utf-8');
      
      expect(pdfContent).toContain('Email: No especificado');
    });

    it('should handle diet plan without optional fields', async () => {
      const minimalDietPlan = {
        ...mockDietPlan,
        description: null,
        startDate: null,
        endDate: null,
        objectives: null,
        isActive: false,
        deletedAt: null
      };

      const options = {
        patient: mockPatient,
        dietPlan: minimalDietPlan,
        workoutPlan: null
      };

      const result = await pdfService.generateCombinedPlansPDF(options);
      const pdfContent = result.toString('utf-8');
      
      expect(pdfContent).toContain('Descripción: Sin descripción');
      expect(pdfContent).toContain('Fecha inicio: No especificada');
      expect(pdfContent).toContain('Fecha fin: No especificada');
      expect(pdfContent).toContain('Objetivos: No especificados');
      expect(pdfContent).toContain('Estado: Inactivo');
    });

    it('should handle workout plan without optional fields', async () => {
      const minimalWorkoutPlan = {
        ...mockWorkoutPlan,
        description: null,
        startDate: null,
        endDate: null,
        objectives: null,
        isActive: false
      };

      const options = {
        patient: mockPatient,
        dietPlan: null,
        workoutPlan: minimalWorkoutPlan
      };

      const result = await pdfService.generateCombinedPlansPDF(options);
      const pdfContent = result.toString('utf-8');
      
      expect(pdfContent).toContain('Descripción: Sin descripción');
      expect(pdfContent).toContain('Fecha inicio: No especificada');
      expect(pdfContent).toContain('Fecha fin: No especificada');
      expect(pdfContent).toContain('Objetivos: No especificados');
      expect(pdfContent).toContain('Estado: Inactivo');
    });

    it('should include current date in PDF', async () => {
      const options = {
        patient: mockPatient,
        dietPlan: mockDietPlan,
        workoutPlan: null
      };

      const result = await pdfService.generateCombinedPlansPDF(options);
      const pdfContent = result.toString('utf-8');
      
      const currentDate = new Date().toLocaleDateString('es-ES');
      expect(pdfContent).toContain(`Fecha de generación: ${currentDate}`);
      expect(pdfContent).toContain(`Generado automáticamente el ${currentDate}`);
    });

    it('should include TODO notes for TB-018 implementation', async () => {
      const options = {
        patient: mockPatient,
        dietPlan: mockDietPlan,
        workoutPlan: mockWorkoutPlan
      };

      const result = await pdfService.generateCombinedPlansPDF(options);
      const pdfContent = result.toString('utf-8');
      
      expect(pdfContent).toContain('TODO: Implementar contenido detallado de comidas en TB-018');
      expect(pdfContent).toContain('TODO: Implementar contenido detallado de ejercicios en TB-018');
      expect(pdfContent).toContain('NOTA: Este es un PDF temporal generado por el sistema');
      expect(pdfContent).toContain('La implementación completa será desarrollada en TB-018');
    });

    it('should format dates correctly in Spanish locale', async () => {
      const options = {
        patient: mockPatient,
        dietPlan: mockDietPlan,
        workoutPlan: mockWorkoutPlan
      };

      const result = await pdfService.generateCombinedPlansPDF(options);
      const pdfContent = result.toString('utf-8');
      
      // Verificar formato de fechas en español (DD/MM/YYYY o DD/M/YYYY)
      const expectedStartDate = mockDietPlan.startDate!.toLocaleDateString('es-ES');
      const expectedEndDate = mockDietPlan.endDate!.toLocaleDateString('es-ES');
      
      expect(pdfContent).toContain(`Fecha inicio: ${expectedStartDate}`);
      expect(pdfContent).toContain(`Fecha fin: ${expectedEndDate}`);
    });

    it('should handle errors gracefully', async () => {
      // Simular un error manipulando los datos
      const invalidOptions = {
        patient: null as any,
        dietPlan: mockDietPlan,
        workoutPlan: null
      };

      await expect(pdfService.generateCombinedPlansPDF(invalidOptions))
        .rejects.toThrow('Failed to generate PDF:');
    });
  });

  describe('generateFileName', () => {
    it('should generate filename with date by default', () => {
      const filename = pdfService.generateFileName(mockPatient);
      
      const expectedDate = new Date().toISOString().split('T')[0];
      const expectedName = `Juan_Pérez_plan_${expectedDate}.pdf`;
      
      expect(filename).toBe(expectedName);
    });

    it('should generate filename without date when specified', () => {
      const filename = pdfService.generateFileName(mockPatient, false);
      
      expect(filename).toBe('Juan_Pérez_plan.pdf');
      expect(filename).not.toContain('202'); // No debe contener año
    });

    it('should handle patient names with spaces correctly', () => {
      const patientWithSpaces = {
        ...mockPatient,
        firstName: 'María José',
        lastName: 'García López'
      };

      const filename = pdfService.generateFileName(patientWithSpaces, false);
      
      expect(filename).toBe('María_José_García_López_plan.pdf');
      expect(filename).not.toContain(' '); // No debe contener espacios
    });

    it('should handle patient names with special characters', () => {
      const patientWithSpecialChars = {
        ...mockPatient,
        firstName: 'José Ángel',
        lastName: 'Martínez'
      };

      const filename = pdfService.generateFileName(patientWithSpecialChars, false);
      
      // Los espacios deben ser reemplazados por guiones bajos
      expect(filename).toBe('José_Ángel_Martínez_plan.pdf');
    });

    it('should generate consistent filename format', () => {
      const filename1 = pdfService.generateFileName(mockPatient, false);
      const filename2 = pdfService.generateFileName(mockPatient, false);
      
      // Debería ser el mismo filename si es el mismo paciente y sin fecha
      expect(filename1).toBe(filename2);
      expect(filename1).toMatch(/^[A-Za-zÀ-ÿ_]+_plan\.pdf$/);
    });

    it('should include correct date format when includeDate is true', () => {
      const filename = pdfService.generateFileName(mockPatient, true);
      
      // Verificar formato YYYY-MM-DD en el filename
      const dateRegex = /\d{4}-\d{2}-\d{2}/;
      expect(filename).toMatch(dateRegex);
      
      // Verificar que la fecha es de hoy
      const today = new Date().toISOString().split('T')[0];
      expect(filename).toContain(today);
    });
  });
}); 