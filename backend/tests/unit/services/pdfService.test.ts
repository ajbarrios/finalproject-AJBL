import { describe, it, expect, beforeEach } from 'vitest';
import { pdfService } from '../../../src/services/pdfService';
import { Patient, DietPlan, WorkoutPlan, DietMeal, WorkoutDay, Exercise, MealType, DayOfWeek } from '../../../src/generated/prisma';

// Tipos extendidos para tests
interface DietPlanWithMeals extends DietPlan {
  meals: DietMeal[];
}

interface WorkoutDayWithExercises extends WorkoutDay {
  exercises: Exercise[];
}

interface WorkoutPlanWithDays extends WorkoutPlan {
  days: WorkoutDayWithExercises[];
}

describe('PDFService', () => {
  let mockPatient: Patient;
  let mockDietPlan: DietPlanWithMeals;
  let mockWorkoutPlan: WorkoutPlanWithDays;

  beforeEach(() => {
    // pdfService is already imported as a singleton instance

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

    // Mock de comidas para plan de dieta
    const mockMeals: DietMeal[] = [
      {
        id: 1,
        dietPlanId: 101,
        mealType: MealType.BREAKFAST,
        content: '2 tostadas integrales con aguacate y huevo',
        dayOfWeek: DayOfWeek.MONDAY,
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01')
      },
      {
        id: 2,
        dietPlanId: 101,
        mealType: MealType.LUNCH,
        content: 'Ensalada de pollo con verduras y aceite de oliva',
        dayOfWeek: DayOfWeek.MONDAY,
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01')
      }
    ];

    // Mock de ejercicios
    const mockExercises: Exercise[] = [
      {
        id: 1,
        workoutDayId: 1,
        name: 'Sentadillas',
        setsReps: '3x12',
        observations: 'Mantener la espalda recta',
        displayOrder: 1,
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01')
      },
      {
        id: 2,
        workoutDayId: 1,
        name: 'Flexiones',
        setsReps: '3x10',
        observations: 'Bajar hasta el pecho',
        displayOrder: 2,
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01')
      }
    ];

    // Mock de días de entrenamiento
    const mockWorkoutDays: WorkoutDayWithExercises[] = [
      {
        id: 1,
        workoutPlanId: 201,
        dayOfWeek: DayOfWeek.MONDAY,
        description: 'Día de tren superior',
        exercises: mockExercises,
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01')
      }
    ];

    // Mock de plan de dieta con comidas
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
      updatedAt: new Date('2024-01-01'),
      meals: mockMeals
    };

    // Mock de plan de entrenamiento con días y ejercicios
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
      updatedAt: new Date('2024-01-01'),
      days: mockWorkoutDays
    };
  });

  describe('generateCombinedPlansPDF', () => {
    it('should generate a real PDF buffer with both diet and workout plans', async () => {
      const options = {
        patient: mockPatient,
        dietPlan: mockDietPlan,
        workoutPlan: mockWorkoutPlan
      };

      const result = await pdfService.generateCombinedPlansPDF(options);

      // Verificar que es un Buffer real
      expect(result).toBeInstanceOf(Buffer);
      expect(result.length).toBeGreaterThan(1000); // PDF real debe ser > 1KB
      
      // Verificar que tiene header PDF válido
      const pdfHeader = result.toString('hex').substring(0, 8);
      expect(pdfHeader).toBe('25504446'); // %PDF en hexadecimal
    });

    it('should generate PDF with only diet plan', async () => {
      const options = {
        patient: mockPatient,
        dietPlan: mockDietPlan,
        workoutPlan: null
      };

      const result = await pdfService.generateCombinedPlansPDF(options);

      expect(result).toBeInstanceOf(Buffer);
      expect(result.length).toBeGreaterThan(500);
      
      // Verificar header PDF
      const pdfHeader = result.toString('hex').substring(0, 8);
      expect(pdfHeader).toBe('25504446');
    });

    it('should generate PDF with only workout plan', async () => {
      const options = {
        patient: mockPatient,
        dietPlan: null,
        workoutPlan: mockWorkoutPlan
      };

      const result = await pdfService.generateCombinedPlansPDF(options);

      expect(result).toBeInstanceOf(Buffer);
      expect(result.length).toBeGreaterThan(500);
      
      // Verificar header PDF
      const pdfHeader = result.toString('hex').substring(0, 8);
      expect(pdfHeader).toBe('25504446');
    });

    it('should generate PDF with patient without optional fields', async () => {
      const patientWithoutOptionalFields = {
        ...mockPatient,
        email: null,
        phone: null,
        birthDate: null,
        gender: null,
        height: null,
        objectives: null,
        dietRestrictions: null
      };

      const options = {
        patient: patientWithoutOptionalFields,
        dietPlan: mockDietPlan,
        workoutPlan: null
      };

      const result = await pdfService.generateCombinedPlansPDF(options);
      
      expect(result).toBeInstanceOf(Buffer);
      expect(result.length).toBeGreaterThan(500);
    });

    it('should handle diet plan without optional fields', async () => {
      const minimalDietPlan: DietPlanWithMeals = {
        ...mockDietPlan,
        description: null,
        startDate: null,
        endDate: null,
        objectives: null,
        notes: null,
        meals: [] // Plan sin comidas
      };

      const options = {
        patient: mockPatient,
        dietPlan: minimalDietPlan,
        workoutPlan: null
      };

      const result = await pdfService.generateCombinedPlansPDF(options);
      
      expect(result).toBeInstanceOf(Buffer);
      expect(result.length).toBeGreaterThan(500);
    });

    it('should handle workout plan without optional fields', async () => {
      const minimalWorkoutPlan: WorkoutPlanWithDays = {
        ...mockWorkoutPlan,
        description: null,
        startDate: null,
        endDate: null,
        objectives: null,
        notes: null,
        days: [] // Plan sin días
      };

      const options = {
        patient: mockPatient,
        dietPlan: null,
        workoutPlan: minimalWorkoutPlan
      };

      const result = await pdfService.generateCombinedPlansPDF(options);
      
      expect(result).toBeInstanceOf(Buffer);
      expect(result.length).toBeGreaterThan(500);
    });

    it('should generate PDF with both plans having comprehensive data', async () => {
      // Crear plan de dieta con múltiples comidas y días
      const comprehensiveMeals: DietMeal[] = [
        {
          id: 1,
          dietPlanId: 101,
          mealType: MealType.BREAKFAST,
          content: 'Avena con frutas y nueces',
          dayOfWeek: DayOfWeek.MONDAY,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: 2,
          dietPlanId: 101,
          mealType: MealType.LUNCH,
          content: 'Pollo a la plancha con arroz integral',
          dayOfWeek: DayOfWeek.MONDAY,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: 3,
          dietPlanId: 101,
          mealType: MealType.BREAKFAST,
          content: 'Tostadas con aguacate',
          dayOfWeek: DayOfWeek.TUESDAY,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ];

      const comprehensiveExercises: Exercise[] = [
        {
          id: 1,
          workoutDayId: 1,
          name: 'Press de banca',
          setsReps: '4x8',
          observations: 'Mantener control en la bajada',
          displayOrder: 1,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: 2,
          workoutDayId: 1,
          name: 'Dominadas',
          setsReps: '3x6',
          observations: 'Usar banda elástica si es necesario',
          displayOrder: 2,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ];

      const comprehensiveDays: WorkoutDayWithExercises[] = [
        {
          id: 1,
          workoutPlanId: 201,
          dayOfWeek: DayOfWeek.MONDAY,
          description: 'Pecho y espalda',
          exercises: comprehensiveExercises,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: 2,
          workoutPlanId: 201,
          dayOfWeek: DayOfWeek.WEDNESDAY,
          description: 'Piernas y glúteos',
          exercises: [
            {
              id: 3,
              workoutDayId: 2,
              name: 'Sentadillas',
              setsReps: '4x12',
              observations: 'Bajar hasta 90 grados',
              displayOrder: 1,
              createdAt: new Date(),
              updatedAt: new Date()
            }
          ],
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ];

      const comprehensiveOptions = {
        patient: mockPatient,
        dietPlan: { ...mockDietPlan, meals: comprehensiveMeals },
        workoutPlan: { ...mockWorkoutPlan, days: comprehensiveDays },
        professional: {
          firstName: 'Dr. María',
          lastName: 'González',
          profession: 'NUTRITIONIST'
        }
      };

      const result = await pdfService.generateCombinedPlansPDF(comprehensiveOptions);

      expect(result).toBeInstanceOf(Buffer);
      expect(result.length).toBeGreaterThan(2000); // Más contenido = PDF más grande
    });

    it('should throw error when PDF generation fails', async () => {
      // Simular error pasando datos inválidos
      const invalidOptions = {
        patient: null as any, // Esto debería causar error
        dietPlan: mockDietPlan,
        workoutPlan: null
      };

      await expect(pdfService.generateCombinedPlansPDF(invalidOptions))
        .rejects
        .toThrow(/Failed to generate PDF/);
    });
  });

  describe('generateFileName', () => {
    it('should generate correct filename with date', () => {
      const fileName = pdfService.generateFileName(mockPatient, true);
      
      expect(fileName).toMatch(/^Juan_Pérez_plan_\d{4}-\d{2}-\d{2}\.pdf$/);
    });

    it('should generate correct filename without date', () => {
      const fileName = pdfService.generateFileName(mockPatient, false);
      
      expect(fileName).toBe('Juan_Pérez_plan.pdf');
    });

    it('should handle patient names with spaces', () => {
      const patientWithSpaces = {
        ...mockPatient,
        firstName: 'María José',
        lastName: 'García López'
      };

      const fileName = pdfService.generateFileName(patientWithSpaces, false);
      
      expect(fileName).toBe('María_José_García_López_plan.pdf');
    });
  });
}); 