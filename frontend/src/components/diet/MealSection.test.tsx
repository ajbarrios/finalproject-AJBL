import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import MealSection from './MealSection';
import { MealType, DayOfWeek } from '../../types/dietPlan';

describe('MealSection component', () => {
  const defaultMeals = [
    {
      mealType: MealType.BREAKFAST,
      content: 'Avena con frutas',
      dayOfWeek: DayOfWeek.MONDAY
    }
  ];

  const defaultProps = {
    meals: defaultMeals,
    onMealsChange: vi.fn()
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('rendering', () => {
    it('renders meal section header', () => {
      render(<MealSection {...defaultProps} />);
      
      expect(screen.getByText('Comidas del Plan')).toBeInTheDocument();
      expect(screen.getByText('Añadir Comida')).toBeInTheDocument();
    });

    it('renders meal information correctly', () => {
      render(<MealSection {...defaultProps} />);
      
      expect(screen.getByText('Comida #1')).toBeInTheDocument();
      expect(screen.getByDisplayValue('Avena con frutas')).toBeInTheDocument();
    });

    it('renders content textarea with correct placeholder', () => {
      render(<MealSection {...defaultProps} />);
      
      const textarea = screen.getByRole('textbox');
      expect(textarea).toBeInTheDocument();
      expect(textarea).toHaveValue('Avena con frutas');
      expect(textarea).toHaveAttribute('placeholder', 'Describe detalladamente el contenido de esta comida...');
    });

    it('renders remove button when multiple meals exist', () => {
      const multipleMeals = [
        {
          mealType: MealType.BREAKFAST,
          content: 'Avena con frutas',
          dayOfWeek: DayOfWeek.MONDAY
        },
        {
          mealType: MealType.LUNCH,
          content: 'Ensalada',
          dayOfWeek: DayOfWeek.TUESDAY
        }
      ];
      const props = { ...defaultProps, meals: multipleMeals };
      
      render(<MealSection {...props} />);
      
      const removeButtons = screen.getAllByTitle('Eliminar comida');
      expect(removeButtons).toHaveLength(2);
    });

    it('does not render remove button when only one meal exists', () => {
      render(<MealSection {...defaultProps} />);
      
      const removeButton = screen.queryByTitle('Eliminar comida');
      expect(removeButton).not.toBeInTheDocument();
    });

    it('shows empty state when no meals', () => {
      const props = { ...defaultProps, meals: [] };
      render(<MealSection {...props} />);
      
      expect(screen.getByText('No hay comidas añadidas aún.')).toBeInTheDocument();
      expect(screen.getByText('Añadir Primera Comida')).toBeInTheDocument();
    });
  });

  describe('interaction', () => {
    it('calls onMealsChange when add meal button is clicked', () => {
      const mockOnMealsChange = vi.fn();
      const props = { ...defaultProps, onMealsChange: mockOnMealsChange };
      
      render(<MealSection {...props} />);
      
      const addButton = screen.getByText('Añadir Comida');
      fireEvent.click(addButton);
      
      expect(mockOnMealsChange).toHaveBeenCalledOnce();
      expect(mockOnMealsChange).toHaveBeenCalledWith([
        ...defaultMeals,
        {
          mealType: MealType.BREAKFAST,
          content: '',
          dayOfWeek: DayOfWeek.MONDAY
        }
      ]);
    });

    it('calls onMealsChange when content changes', () => {
      const mockOnMealsChange = vi.fn();
      const props = { ...defaultProps, onMealsChange: mockOnMealsChange };
      
      render(<MealSection {...props} />);
      
      const textarea = screen.getByRole('textbox');
      fireEvent.change(textarea, { target: { value: 'Nueva comida' } });
      
      expect(mockOnMealsChange).toHaveBeenCalledOnce();
      expect(mockOnMealsChange).toHaveBeenCalledWith([
        {
          mealType: MealType.BREAKFAST,
          content: 'Nueva comida',
          dayOfWeek: DayOfWeek.MONDAY
        }
      ]);
    });

    it('calls onMealsChange when meal type changes', () => {
      const mockOnMealsChange = vi.fn();
      const props = { ...defaultProps, onMealsChange: mockOnMealsChange };
      
      render(<MealSection {...props} />);
      
      const mealTypeSelect = screen.getByDisplayValue('Desayuno');
      fireEvent.change(mealTypeSelect, { target: { value: 'LUNCH' } });
      
      expect(mockOnMealsChange).toHaveBeenCalledOnce();
      expect(mockOnMealsChange).toHaveBeenCalledWith([
        {
          mealType: MealType.LUNCH,
          content: 'Avena con frutas',
          dayOfWeek: DayOfWeek.MONDAY
        }
      ]);
    });

    it('calls onMealsChange when day of week changes', () => {
      const mockOnMealsChange = vi.fn();
      const props = { ...defaultProps, onMealsChange: mockOnMealsChange };
      
      render(<MealSection {...props} />);
      
      const daySelect = screen.getByDisplayValue('Lunes');
      fireEvent.change(daySelect, { target: { value: 'TUESDAY' } });
      
      expect(mockOnMealsChange).toHaveBeenCalledOnce();
      expect(mockOnMealsChange).toHaveBeenCalledWith([
        {
          mealType: MealType.BREAKFAST,
          content: 'Avena con frutas',
          dayOfWeek: DayOfWeek.TUESDAY
        }
      ]);
    });

    it('calls onMealsChange when remove button is clicked', () => {
      const multipleMeals = [
        {
          mealType: MealType.BREAKFAST,
          content: 'Avena con frutas',
          dayOfWeek: DayOfWeek.MONDAY
        },
        {
          mealType: MealType.LUNCH,
          content: 'Ensalada',
          dayOfWeek: DayOfWeek.TUESDAY
        }
      ];
      const mockOnMealsChange = vi.fn();
      const props = { meals: multipleMeals, onMealsChange: mockOnMealsChange };
      
      render(<MealSection {...props} />);
      
      const removeButtons = screen.getAllByTitle('Eliminar comida');
      fireEvent.click(removeButtons[0]);
      
      expect(mockOnMealsChange).toHaveBeenCalledOnce();
      expect(mockOnMealsChange).toHaveBeenCalledWith([
        {
          mealType: MealType.LUNCH,
          content: 'Ensalada',
          dayOfWeek: DayOfWeek.TUESDAY
        }
      ]);
    });
  });

  describe('accessibility', () => {
    it('has proper labels for form controls', () => {
      render(<MealSection {...defaultProps} />);
      
      expect(screen.getByText('Tipo de Comida')).toBeInTheDocument();
      expect(screen.getByText('Día de la Semana')).toBeInTheDocument();
      expect(screen.getByText('Contenido de la Comida')).toBeInTheDocument();
    });

    it('textarea has proper attributes', () => {
      render(<MealSection {...defaultProps} />);
      
      const textarea = screen.getByRole('textbox');
      expect(textarea).toHaveAttribute('rows', '3');
    });
  });

  describe('edge cases', () => {
    it('handles empty content', () => {
      const mealsWithEmptyContent = [
        {
          mealType: MealType.BREAKFAST,
          content: '',
          dayOfWeek: DayOfWeek.MONDAY
        }
      ];
      const props = { ...defaultProps, meals: mealsWithEmptyContent };
      
      render(<MealSection {...props} />);
      
      const textarea = screen.getByRole('textbox');
      expect(textarea).toHaveValue('');
    });
  });
}); 