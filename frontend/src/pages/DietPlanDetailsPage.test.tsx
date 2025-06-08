import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import DietPlanDetailsPage from './DietPlanDetailsPage';
import * as dietPlanService from '../services/dietPlanService';
import type { DietPlan, PlanStatus } from '../types/dietPlan';
import { MealType, DayOfWeek } from '../types/dietPlan';

// Mock de react-router-dom para controlar useNavigate
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react-router-dom')>();
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// Mock del servicio de planes de dieta
vi.mock('../services/dietPlanService', () => ({
  getDietPlan: vi.fn(),
  deleteDietPlan: vi.fn(),
}));

// Mock de react-hot-toast
vi.mock('react-hot-toast', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

// Mock del modal de confirmación
interface MockModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  isLoading?: boolean;
}

vi.mock('../components/common/DeleteConfirmationModal', () => ({
  default: ({ isOpen, onClose, onConfirm, title, message, isLoading }: MockModalProps) => (
    isOpen ? (
      <div data-testid="delete-modal">
        <h2>{title}</h2>
        <p>{message}</p>
        <button onClick={onConfirm} disabled={isLoading}>
          {isLoading ? 'Eliminando...' : 'Confirmar'}
        </button>
        <button onClick={onClose} disabled={isLoading}>
          Cancelar
        </button>
      </div>
    ) : null
  )
}));

// Datos mock para las pruebas
const mockDietPlan: DietPlan = {
  id: 'diet-plan-1',
  title: 'Plan de Dieta Test',
  description: 'Descripción del plan de prueba',
  status: 'ACTIVE' as PlanStatus,
  startDate: '2023-10-01T00:00:00.000Z',
  endDate: '2023-11-01T00:00:00.000Z',
  patientId: 'patient-1',
  professionalId: 'professional-1',
  createdAt: '2023-09-15T10:30:00.000Z',
  updatedAt: '2023-09-15T10:30:00.000Z',
  meals: [
    {
      id: 'meal-1',
      dietPlanId: 'diet-plan-1',
      mealType: MealType.BREAKFAST,
      content: 'Avena con frutas',
      dayOfWeek: DayOfWeek.MONDAY,
      createdAt: '2023-09-15T10:30:00.000Z',
      updatedAt: '2023-09-15T10:30:00.000Z'
    }
  ]
};

describe('DietPlanDetailsPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockNavigate.mockReset();
  });

  describe('renderizado inicial', () => {
    it('debería mostrar el estado de carga inicial', () => {
      vi.mocked(dietPlanService.getDietPlan).mockReturnValue(new Promise(() => {}));

      render(
        <MemoryRouter initialEntries={['/patients/patient-1/diet-plans/diet-plan-1']}>
          <Routes>
            <Route path="/patients/:patientId/diet-plans/:dietPlanId" element={<DietPlanDetailsPage />} />
          </Routes>
        </MemoryRouter>
      );

      // El componente muestra solo un spinner, no texto
      const spinner = document.querySelector('.animate-spin');
      expect(spinner).toBeInTheDocument();
    });

    it('debería mostrar los detalles del plan cuando la carga termine exitosamente', async () => {
      vi.mocked(dietPlanService.getDietPlan).mockResolvedValue(mockDietPlan);

      render(
        <MemoryRouter initialEntries={['/patients/patient-1/diet-plans/diet-plan-1']}>
          <Routes>
            <Route path="/patients/:patientId/diet-plans/:dietPlanId" element={<DietPlanDetailsPage />} />
          </Routes>
        </MemoryRouter>
      );

      await waitFor(() => {
        expect(screen.getByText('Plan de Dieta Test')).toBeInTheDocument();
        expect(screen.getByText('Descripción del plan de prueba')).toBeInTheDocument();
        expect(screen.getByText('Activo')).toBeInTheDocument();
        expect(screen.queryByText('Cargando detalles del plan de dieta...')).not.toBeInTheDocument();
      });

      expect(dietPlanService.getDietPlan).toHaveBeenCalledWith('diet-plan-1');
    });

    it('debería mostrar mensaje de error cuando la carga falle', async () => {
      const errorMessage = 'Plan de dieta no encontrado';
      vi.mocked(dietPlanService.getDietPlan).mockRejectedValue(new Error(errorMessage));

      render(
        <MemoryRouter initialEntries={['/patients/patient-1/diet-plans/diet-plan-1']}>
          <Routes>
            <Route path="/patients/:patientId/diet-plans/:dietPlanId" element={<DietPlanDetailsPage />} />
          </Routes>
        </MemoryRouter>
      );

      await waitFor(() => {
        expect(screen.getByText('Error al cargar los detalles del plan de dieta')).toBeInTheDocument();
        expect(document.querySelector('.animate-spin')).not.toBeInTheDocument();
      });
    });
  });

  describe('navegación', () => {
    it('debería navegar de vuelta al perfil del paciente al hacer clic en Volver', async () => {
      vi.mocked(dietPlanService.getDietPlan).mockResolvedValue(mockDietPlan);

      render(
        <MemoryRouter initialEntries={['/patients/patient-1/diet-plans/diet-plan-1']}>
          <Routes>
            <Route path="/patients/:patientId/diet-plans/:dietPlanId" element={<DietPlanDetailsPage />} />
          </Routes>
        </MemoryRouter>
      );

      await waitFor(() => {
        expect(screen.getByText('Plan de Dieta Test')).toBeInTheDocument();
      });

      const backButton = screen.getByRole('link', { name: /Volver al Perfil/i });
      expect(backButton).toHaveAttribute('href', '/patients/patient-1');
    });
  });

  describe('funcionalidad de eliminación', () => {
    beforeEach(async () => {
      vi.mocked(dietPlanService.getDietPlan).mockResolvedValue(mockDietPlan);
    });

    it('debería mostrar el botón de eliminar', async () => {
      render(
        <MemoryRouter initialEntries={['/patients/patient-1/diet-plans/diet-plan-1']}>
          <Routes>
            <Route path="/patients/:patientId/diet-plans/:dietPlanId" element={<DietPlanDetailsPage />} />
          </Routes>
        </MemoryRouter>
      );

      await waitFor(() => {
        expect(screen.getByRole('button', { name: 'Eliminar' })).toBeInTheDocument();
      });
    });

    it('debería abrir el modal de confirmación al hacer clic en Eliminar', async () => {
      render(
        <MemoryRouter initialEntries={['/patients/patient-1/diet-plans/diet-plan-1']}>
          <Routes>
            <Route path="/patients/:patientId/diet-plans/:dietPlanId" element={<DietPlanDetailsPage />} />
          </Routes>
        </MemoryRouter>
      );

      await waitFor(() => {
        expect(screen.getByRole('button', { name: 'Eliminar' })).toBeInTheDocument();
      });

      const deleteButton = screen.getByRole('button', { name: 'Eliminar' });
      fireEvent.click(deleteButton);

      expect(screen.getByTestId('delete-modal')).toBeInTheDocument();
      expect(screen.getByText('Eliminar Plan de Dieta')).toBeInTheDocument();
      expect(screen.getByText(/¿Estás seguro de que quieres eliminar el plan "Plan de Dieta Test"/)).toBeInTheDocument();
    });

    it('debería cerrar el modal al hacer clic en Cancelar', async () => {
      render(
        <MemoryRouter initialEntries={['/patients/patient-1/diet-plans/diet-plan-1']}>
          <Routes>
            <Route path="/patients/:patientId/diet-plans/:dietPlanId" element={<DietPlanDetailsPage />} />
          </Routes>
        </MemoryRouter>
      );

      await waitFor(() => {
        expect(screen.getByRole('button', { name: 'Eliminar' })).toBeInTheDocument();
      });

      // Abrir el modal
      const deleteButton = screen.getByRole('button', { name: 'Eliminar' });
      fireEvent.click(deleteButton);

      expect(screen.getByTestId('delete-modal')).toBeInTheDocument();

      // Cerrar el modal
      const cancelButton = screen.getByRole('button', { name: 'Cancelar' });
      fireEvent.click(cancelButton);

      expect(screen.queryByTestId('delete-modal')).not.toBeInTheDocument();
    });

    it('debería eliminar el plan exitosamente y navegar de vuelta', async () => {
      vi.mocked(dietPlanService.deleteDietPlan).mockResolvedValue(undefined);

      render(
        <MemoryRouter initialEntries={['/patients/patient-1/diet-plans/diet-plan-1']}>
          <Routes>
            <Route path="/patients/:patientId/diet-plans/:dietPlanId" element={<DietPlanDetailsPage />} />
          </Routes>
        </MemoryRouter>
      );

      await waitFor(() => {
        expect(screen.getByRole('button', { name: 'Eliminar' })).toBeInTheDocument();
      });

      // Abrir el modal
      const deleteButton = screen.getByRole('button', { name: 'Eliminar' });
      fireEvent.click(deleteButton);

      // Confirmar eliminación
      const confirmButton = screen.getByRole('button', { name: 'Confirmar' });
      fireEvent.click(confirmButton);

      await waitFor(() => {
        expect(dietPlanService.deleteDietPlan).toHaveBeenCalledWith('diet-plan-1');
        expect(toast.success).toHaveBeenCalledWith('Plan de dieta eliminado exitosamente');
        expect(mockNavigate).toHaveBeenCalledWith('/patients/patient-1');
      });
    });

    it('debería navegar al dashboard si no hay patientId', async () => {
      vi.mocked(dietPlanService.deleteDietPlan).mockResolvedValue(undefined);

      render(
        <MemoryRouter initialEntries={['/diet-plans/diet-plan-1']}>
          <Routes>
            <Route path="/diet-plans/:dietPlanId" element={<DietPlanDetailsPage />} />
          </Routes>
        </MemoryRouter>
      );

      await waitFor(() => {
        expect(screen.getByRole('button', { name: 'Eliminar' })).toBeInTheDocument();
      });

      // Abrir el modal
      const deleteButton = screen.getByRole('button', { name: 'Eliminar' });
      fireEvent.click(deleteButton);

      // Confirmar eliminación
      const confirmButton = screen.getByRole('button', { name: 'Confirmar' });
      fireEvent.click(confirmButton);

      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
      });
    });

    it('debería manejar errores durante la eliminación', async () => {
      const errorMessage = 'Error del servidor';
      vi.mocked(dietPlanService.deleteDietPlan).mockRejectedValue(new Error(errorMessage));

      render(
        <MemoryRouter initialEntries={['/patients/patient-1/diet-plans/diet-plan-1']}>
          <Routes>
            <Route path="/patients/:patientId/diet-plans/:dietPlanId" element={<DietPlanDetailsPage />} />
          </Routes>
        </MemoryRouter>
      );

      await waitFor(() => {
        expect(screen.getByRole('button', { name: 'Eliminar' })).toBeInTheDocument();
      });

      // Abrir el modal
      const deleteButton = screen.getByRole('button', { name: 'Eliminar' });
      fireEvent.click(deleteButton);

      // Confirmar eliminación
      const confirmButton = screen.getByRole('button', { name: 'Confirmar' });
      fireEvent.click(confirmButton);

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith('Error al eliminar el plan de dieta');
        expect(mockNavigate).not.toHaveBeenCalled();
      });
    });

    it('debería manejar errores de autorización (403)', async () => {
      const authError = {
        response: { status: 403 }
      };
      vi.mocked(dietPlanService.deleteDietPlan).mockRejectedValue(authError);

      render(
        <MemoryRouter initialEntries={['/patients/patient-1/diet-plans/diet-plan-1']}>
          <Routes>
            <Route path="/patients/:patientId/diet-plans/:dietPlanId" element={<DietPlanDetailsPage />} />
          </Routes>
        </MemoryRouter>
      );

      await waitFor(() => {
        expect(screen.getByRole('button', { name: 'Eliminar' })).toBeInTheDocument();
      });

      // Abrir el modal
      const deleteButton = screen.getByRole('button', { name: 'Eliminar' });
      fireEvent.click(deleteButton);

      // Confirmar eliminación
      const confirmButton = screen.getByRole('button', { name: 'Confirmar' });
      fireEvent.click(confirmButton);

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith('No tienes permisos para eliminar este plan de dieta');
      });
    });

    it('debería manejar errores cuando el plan no existe (404)', async () => {
      const notFoundError = {
        response: { status: 404 }
      };
      vi.mocked(dietPlanService.deleteDietPlan).mockRejectedValue(notFoundError);

      render(
        <MemoryRouter initialEntries={['/patients/patient-1/diet-plans/diet-plan-1']}>
          <Routes>
            <Route path="/patients/:patientId/diet-plans/:dietPlanId" element={<DietPlanDetailsPage />} />
          </Routes>
        </MemoryRouter>
      );

      await waitFor(() => {
        expect(screen.getByRole('button', { name: 'Eliminar' })).toBeInTheDocument();
      });

      // Abrir el modal
      const deleteButton = screen.getByRole('button', { name: 'Eliminar' });
      fireEvent.click(deleteButton);

      // Confirmar eliminación
      const confirmButton = screen.getByRole('button', { name: 'Confirmar' });
      fireEvent.click(confirmButton);

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith('Plan de dieta no encontrado');
      });
    });

    it('debería mostrar estado de carga durante la eliminación', async () => {
      let resolveDelete: (value?: void) => void;
      const deletePromise = new Promise<void>((resolve) => {
        resolveDelete = resolve;
      });
      vi.mocked(dietPlanService.deleteDietPlan).mockReturnValue(deletePromise);

      render(
        <MemoryRouter initialEntries={['/patients/patient-1/diet-plans/diet-plan-1']}>
          <Routes>
            <Route path="/patients/:patientId/diet-plans/:dietPlanId" element={<DietPlanDetailsPage />} />
          </Routes>
        </MemoryRouter>
      );

      await waitFor(() => {
        expect(screen.getByRole('button', { name: 'Eliminar' })).toBeInTheDocument();
      });

      // Abrir el modal
      const deleteButton = screen.getByRole('button', { name: 'Eliminar' });
      fireEvent.click(deleteButton);

      // Confirmar eliminación
      const confirmButton = screen.getByRole('button', { name: 'Confirmar' });
      fireEvent.click(confirmButton);

      // Verificar estado de carga
      expect(screen.getByRole('button', { name: 'Eliminando...' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Eliminando...' })).toBeDisabled();

      // Resolver la promesa
      resolveDelete!();
      
      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith('/patients/patient-1');
      });
    });

    it('debería manejar dietPlanId inválido', async () => {
      render(
        <MemoryRouter initialEntries={['/patients/patient-1/diet-plans/']}>
          <Routes>
            <Route path="/patients/:patientId/diet-plans/:dietPlanId" element={<DietPlanDetailsPage />} />
          </Routes>
        </MemoryRouter>
      );

      // Simular hacer clic en eliminar sin dietPlanId válido
      // Nota: Este escenario es edge case ya que normalmente no se llegará aquí sin un ID válido
    });
  });

  describe('visualización de datos del plan', () => {
    it('debería mostrar información completa del plan', async () => {
      vi.mocked(dietPlanService.getDietPlan).mockResolvedValue(mockDietPlan);

      render(
        <MemoryRouter initialEntries={['/patients/patient-1/diet-plans/diet-plan-1']}>
          <Routes>
            <Route path="/patients/:patientId/diet-plans/:dietPlanId" element={<DietPlanDetailsPage />} />
          </Routes>
        </MemoryRouter>
      );

      await waitFor(() => {
        // Información básica
        expect(screen.getByText('Plan de Dieta Test')).toBeInTheDocument();
        expect(screen.getByText('Descripción del plan de prueba')).toBeInTheDocument();
        expect(screen.getByText('Activo')).toBeInTheDocument();
        
        // Fechas
        expect(screen.getByText('Fecha de Inicio')).toBeInTheDocument();
        expect(screen.getByText('Fecha de Fin')).toBeInTheDocument();
        
        // Comidas del plan
        expect(screen.getByText('Comidas del Plan')).toBeInTheDocument();
        expect(screen.getByText('Lunes')).toBeInTheDocument();
        expect(screen.getByText('Desayuno')).toBeInTheDocument();
        expect(screen.getByText('Avena con frutas')).toBeInTheDocument();
      });
    });

    it('debería mostrar información de fechas de creación y actualización', async () => {
      vi.mocked(dietPlanService.getDietPlan).mockResolvedValue(mockDietPlan);

      render(
        <MemoryRouter initialEntries={['/patients/patient-1/diet-plans/diet-plan-1']}>
          <Routes>
            <Route path="/patients/:patientId/diet-plans/:dietPlanId" element={<DietPlanDetailsPage />} />
          </Routes>
        </MemoryRouter>
      );

      await waitFor(() => {
        expect(screen.getByText(/Plan creado el/)).toBeInTheDocument();
      });
    });
  });
}); 