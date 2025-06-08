import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import PlanSelector from '../PlanSelector';
import type { PlanSummary } from '../../../types/emailTypes';

describe('PlanSelector', () => {
  const mockDietPlans: PlanSummary[] = [
    { id: 'diet-1', title: 'Plan de Dieta Mediterránea', status: 'ACTIVE' },
    { id: 'diet-2', title: 'Plan Vegano', status: 'DRAFT' },
  ];

  const mockWorkoutPlans: PlanSummary[] = [
    { id: 'workout-1', title: 'Rutina de Fuerza', status: 'ACTIVE' },
    { id: 'workout-2', title: 'Cardio Intensivo', status: 'DRAFT' },
  ];

  const defaultProps = {
    availablePlans: {
      dietPlans: mockDietPlans,
      workoutPlans: mockWorkoutPlans,
    },
    selectedDietPlans: ['diet-1'],
    selectedWorkoutPlans: ['workout-1'],
    onDietPlanChange: vi.fn(),
    onWorkoutPlanChange: vi.fn(),
  };

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('debería renderizar el título principal', () => {
    render(<PlanSelector {...defaultProps} />);
    
    expect(screen.getByText('Selecciona los planes a enviar:')).toBeInTheDocument();
  });

  it('debería renderizar todos los planes de dieta', () => {
    render(<PlanSelector {...defaultProps} />);
    
    expect(screen.getByText('Planes de Dieta:')).toBeInTheDocument();
    expect(screen.getByText('Plan de Dieta Mediterránea')).toBeInTheDocument();
    expect(screen.getByText('Plan Vegano')).toBeInTheDocument();
  });

  it('debería renderizar todos los planes de entrenamiento', () => {
    render(<PlanSelector {...defaultProps} />);
    
    expect(screen.getByText('Planes de Entrenamiento:')).toBeInTheDocument();
    expect(screen.getByText('Rutina de Fuerza')).toBeInTheDocument();
    expect(screen.getByText('Cardio Intensivo')).toBeInTheDocument();
  });

  it('debería mostrar badges de estado correctos', () => {
    render(<PlanSelector {...defaultProps} />);
    
    expect(screen.getAllByText('Activo')).toHaveLength(2);
    expect(screen.getAllByText('Borrador')).toHaveLength(2);
  });

  it('debería marcar como checkeados los planes seleccionados', () => {
    render(<PlanSelector {...defaultProps} />);
    
    const checkboxes = screen.getAllByRole('checkbox');
    
    // Primer checkbox (diet-1) debería estar checked
    expect(checkboxes[0]).toBeChecked();
    // Segundo checkbox (diet-2) no debería estar checked
    expect(checkboxes[1]).not.toBeChecked();
    // Tercer checkbox (workout-1) debería estar checked
    expect(checkboxes[2]).toBeChecked();
    // Cuarto checkbox (workout-2) no debería estar checked
    expect(checkboxes[3]).not.toBeChecked();
  });

  it('debería llamar onDietPlanChange cuando se hace clic en un plan de dieta', () => {
    render(<PlanSelector {...defaultProps} />);
    
    const dietCheckboxes = screen.getAllByRole('checkbox').slice(0, 2);
    
    // Click en plan de dieta no seleccionado
    fireEvent.click(dietCheckboxes[1]);
    
    expect(defaultProps.onDietPlanChange).toHaveBeenCalledWith('diet-2', true);
  });

  it('debería llamar onWorkoutPlanChange cuando se hace clic en un plan de entrenamiento', () => {
    render(<PlanSelector {...defaultProps} />);
    
    const workoutCheckboxes = screen.getAllByRole('checkbox').slice(2, 4);
    
    // Click en plan de entrenamiento no seleccionado
    fireEvent.click(workoutCheckboxes[1]);
    
    expect(defaultProps.onWorkoutPlanChange).toHaveBeenCalledWith('workout-2', true);
  });

  it('debería mostrar mensaje de error cuando no hay planes seleccionados', () => {
    const propsWithoutSelection = {
      ...defaultProps,
      selectedDietPlans: [],
      selectedWorkoutPlans: [],
    };
    
    render(<PlanSelector {...propsWithoutSelection} />);
    
    expect(screen.getByText('⚠️ Debes seleccionar al menos un plan para enviar')).toBeInTheDocument();
  });

  it('no debería mostrar mensaje de error cuando hay planes seleccionados', () => {
    render(<PlanSelector {...defaultProps} />);
    
    expect(screen.queryByText('⚠️ Debes seleccionar al menos un plan para enviar')).not.toBeInTheDocument();
  });

  it('no debería renderizar sección de dietas si no hay planes de dieta', () => {
    const propsWithoutDietPlans = {
      ...defaultProps,
      availablePlans: {
        dietPlans: [],
        workoutPlans: mockWorkoutPlans,
      },
    };
    
    render(<PlanSelector {...propsWithoutDietPlans} />);
    
    expect(screen.queryByText('Planes de Dieta:')).not.toBeInTheDocument();
    expect(screen.getByText('Planes de Entrenamiento:')).toBeInTheDocument();
  });

  it('no debería renderizar sección de entrenamientos si no hay planes de entrenamiento', () => {
    const propsWithoutWorkoutPlans = {
      ...defaultProps,
      availablePlans: {
        dietPlans: mockDietPlans,
        workoutPlans: [],
      },
    };
    
    render(<PlanSelector {...propsWithoutWorkoutPlans} />);
    
    expect(screen.getByText('Planes de Dieta:')).toBeInTheDocument();
    expect(screen.queryByText('Planes de Entrenamiento:')).not.toBeInTheDocument();
  });

  it('debería tener las clases CSS correctas para los badges de estado', () => {
    render(<PlanSelector {...defaultProps} />);
    
    const activeBadges = screen.getAllByText('Activo');
    const draftBadges = screen.getAllByText('Borrador');
    
    activeBadges.forEach(badge => {
      expect(badge).toHaveClass('bg-green-100', 'text-green-700');
    });
    
    draftBadges.forEach(badge => {
      expect(badge).toHaveClass('bg-yellow-100', 'text-yellow-700');
    });
  });
}); 