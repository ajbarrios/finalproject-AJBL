import { renderHook, act } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { usePlanSelection } from '../usePlanSelection';
import type { PlanSummary } from '../../types/emailTypes';

describe('usePlanSelection', () => {
  const mockDietPlans: PlanSummary[] = [
    { id: 'diet-1', title: 'Plan Mediterráneo', status: 'ACTIVE' },
    { id: 'diet-2', title: 'Plan Vegano', status: 'DRAFT' },
  ];

  const mockWorkoutPlans: PlanSummary[] = [
    { id: 'workout-1', title: 'Rutina Fuerza', status: 'ACTIVE' },
    { id: 'workout-2', title: 'Cardio', status: 'DRAFT' },
  ];

  const availablePlans = {
    dietPlans: mockDietPlans,
    workoutPlans: mockWorkoutPlans,
  };

  it('debería inicializar con arrays vacíos', () => {
    const { result } = renderHook(() => usePlanSelection({ availablePlans }));
    
    expect(result.current.selectedDietPlans).toEqual([]);
    expect(result.current.selectedWorkoutPlans).toEqual([]);
    expect(result.current.hasSelectedPlans).toBe(false);
  });

  it('debería agregar planes dietéticos cuando se seleccionan', () => {
    const { result } = renderHook(() => usePlanSelection({ availablePlans }));
    
    act(() => {
      result.current.handleDietPlanChange('diet-1', true);
    });
    
    expect(result.current.selectedDietPlans).toEqual(['diet-1']);
    expect(result.current.hasSelectedPlans).toBe(true);
  });

  it('debería remover planes dietéticos cuando se deseleccionan', () => {
    const { result } = renderHook(() => usePlanSelection({ availablePlans }));
    
    // Primero agregar un plan
    act(() => {
      result.current.handleDietPlanChange('diet-1', true);
    });
    
    // Luego removerlo
    act(() => {
      result.current.handleDietPlanChange('diet-1', false);
    });
    
    expect(result.current.selectedDietPlans).toEqual([]);
    expect(result.current.hasSelectedPlans).toBe(false);
  });

  it('debería agregar planes de entrenamiento cuando se seleccionan', () => {
    const { result } = renderHook(() => usePlanSelection({ availablePlans }));
    
    act(() => {
      result.current.handleWorkoutPlanChange('workout-1', true);
    });
    
    expect(result.current.selectedWorkoutPlans).toEqual(['workout-1']);
    expect(result.current.hasSelectedPlans).toBe(true);
  });

  it('debería remover planes de entrenamiento cuando se deseleccionan', () => {
    const { result } = renderHook(() => usePlanSelection({ availablePlans }));
    
    // Primero agregar un plan
    act(() => {
      result.current.handleWorkoutPlanChange('workout-1', true);
    });
    
    // Luego removerlo
    act(() => {
      result.current.handleWorkoutPlanChange('workout-1', false);
    });
    
    expect(result.current.selectedWorkoutPlans).toEqual([]);
    expect(result.current.hasSelectedPlans).toBe(false);
  });

  it('debería manejar múltiples planes seleccionados', () => {
    const { result } = renderHook(() => usePlanSelection({ availablePlans }));
    
    act(() => {
      result.current.handleDietPlanChange('diet-1', true);
      result.current.handleDietPlanChange('diet-2', true);
      result.current.handleWorkoutPlanChange('workout-1', true);
    });
    
    expect(result.current.selectedDietPlans).toEqual(['diet-1', 'diet-2']);
    expect(result.current.selectedWorkoutPlans).toEqual(['workout-1']);
    expect(result.current.hasSelectedPlans).toBe(true);
  });

  it('debería inicializar con planes activos cuando existen', () => {
    const { result } = renderHook(() => usePlanSelection({ availablePlans }));
    
    act(() => {
      result.current.initializeWithActivePlans();
    });
    
    expect(result.current.selectedDietPlans).toEqual(['diet-1']);
    expect(result.current.selectedWorkoutPlans).toEqual(['workout-1']);
    expect(result.current.hasSelectedPlans).toBe(true);
  });

  it('no debería inicializar si ya hay planes seleccionados', () => {
    const { result } = renderHook(() => usePlanSelection({ availablePlans }));
    
    // Primero seleccionar manualmente un plan
    act(() => {
      result.current.handleDietPlanChange('diet-2', true);
    });
    
    // Luego intentar inicializar
    act(() => {
      result.current.initializeWithActivePlans();
    });
    
    // Debería mantener la selección manual, no cambiar al activo
    expect(result.current.selectedDietPlans).toEqual(['diet-2']);
  });

  it('debería resetear todas las selecciones', () => {
    const { result } = renderHook(() => usePlanSelection({ availablePlans }));
    
    // Primero seleccionar algunos planes
    act(() => {
      result.current.handleDietPlanChange('diet-1', true);
      result.current.handleWorkoutPlanChange('workout-1', true);
    });
    
    expect(result.current.hasSelectedPlans).toBe(true);
    
    // Luego resetear
    act(() => {
      result.current.resetSelection();
    });
    
    expect(result.current.selectedDietPlans).toEqual([]);
    expect(result.current.selectedWorkoutPlans).toEqual([]);
    expect(result.current.hasSelectedPlans).toBe(false);
  });

  it('debería manejar planes sin estado ACTIVE para inicialización', () => {
    const plansWithoutActive = {
      dietPlans: [{ id: 'diet-1', title: 'Plan Draft', status: 'DRAFT' as const }],
      workoutPlans: [{ id: 'workout-1', title: 'Workout Draft', status: 'DRAFT' as const }],
    };
    
    const { result } = renderHook(() => usePlanSelection({ availablePlans: plansWithoutActive }));
    
    act(() => {
      result.current.initializeWithActivePlans();
    });
    
    // No debería seleccionar nada ya que no hay planes ACTIVE
    expect(result.current.selectedDietPlans).toEqual([]);
    expect(result.current.selectedWorkoutPlans).toEqual([]);
    expect(result.current.hasSelectedPlans).toBe(false);
  });

  it('debería calcular hasSelectedPlans correctamente', () => {
    const { result } = renderHook(() => usePlanSelection({ availablePlans }));
    
    // Sin selecciones
    expect(result.current.hasSelectedPlans).toBe(false);
    
    // Solo dieta seleccionada
    act(() => {
      result.current.handleDietPlanChange('diet-1', true);
    });
    expect(result.current.hasSelectedPlans).toBe(true);
    
    // Resetear y probar solo entrenamiento
    act(() => {
      result.current.resetSelection();
      result.current.handleWorkoutPlanChange('workout-1', true);
    });
    expect(result.current.hasSelectedPlans).toBe(true);
  });
}); 