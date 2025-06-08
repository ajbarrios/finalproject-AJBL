import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import PatientProfilePage from './PatientProfilePage';
import * as patientService from '../services/patientService'; // Importar el servicio mockeable
import type { PatientDetails } from '../types/patient'; // Importar el tipo necesario
import { AuthContext } from '../contexts/AuthContextValue';
import type { AuthContextType } from '../contexts/AuthContextValue';

// Mockear react-router-dom para controlar useNavigate
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react-router-dom')>();
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    // Asegurarse de que useParams también se mockea si se usa en otros tests que no pasen route
    // o si el mock global podría afectarlo.
    // Para este caso específico, MemoryRouter y Routes manejan useParams.
  };
});

// Mock del servicio de pacientes
vi.mock('../services/patientService', () => ({
  fetchPatients: vi.fn(), // Mantener si hay tests para listar pacientes en el futuro
  fetchPatientById: vi.fn(),
}));

// Mock de un paciente detallado para las pruebas
const mockPatientDetails: PatientDetails = {
  id: 'patient1',
  firstName: 'Ana',
  lastName: 'Gomez',
  email: 'ana@example.com',
  phone: '123-456-7890',
  birthDate: '1990-01-15T00:00:00.000Z',
  gender: 'Femenino',
  height: 165.5,
  professionalId: 'prof1',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  medicalNotes: 'Ninguna conocida.',
  dietRestrictions: 'Vegetariana.',
  objectives: 'Perder 3kg.',
  lastBiometricRecord: {
    id: 'rec1',
    patientId: 'patient1',
    recordDate: '2023-10-26T00:00:00.000Z',
    weight: 60.0,
    bodyFatPercentage: 25.0,
    musclePercentage: 35.0,
    waterPercentage: 50.0,
    backChestDiameter: 90.0,
    waistDiameter: 70.0,
    armsDiameter: 28.0,
    legsDiameter: 50.0,
    calvesDiameter: 35.0,
    notes: 'Buen progreso.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  dietPlansSummary: [
    { id: 'diet1', title: 'Plan Inicial', status: 'ACTIVE', startDate: '2023-10-01T00:00:00.000Z', endDate: '2023-11-01T00:00:00.000Z' },
    { id: 'diet2', title: 'Plan Mantenimiento', status: 'DRAFT', startDate: '2023-11-02T00:00:00.000Z', endDate: '2023-12-02T00:00:00.000Z' },
  ],
  workoutPlansSummary: [
    { id: 'workout1', title: 'Rutina Fuerza', status: 'ACTIVE', startDate: '2023-10-01T00:00:00.000Z', endDate: '2023-11-01T00:00:00.000Z' },
  ],
};

// Mock AuthProvider para testing
const mockAuthContextValue: AuthContextType = {
  user: {
    id: '1',
    fullName: 'Dr. Juan Pérez',
    email: 'dr.juan@example.com',
    profession: 'Nutricionista',
  },
  token: 'mock-token',
  isAuthenticated: true,
  isLoading: false,
  login: vi.fn(),
  logout: vi.fn(),
};

// Wrapper component para proporcionar contexto de auth
const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <AuthContext.Provider value={mockAuthContextValue}>
    {children}
  </AuthContext.Provider>
);

describe('PatientProfilePage', () => {
  beforeEach(() => {
    // Limpiar el mock antes de cada prueba
    vi.mocked(patientService.fetchPatientById).mockReset();
    // Limpiar el mock de navigate antes de cada prueba
    mockNavigate.mockReset();
  });

  it('debería mostrar el estado de carga inicial', () => {
    // Configurar el mock para que no resuelva inmediatamente (simular carga)
    vi.mocked(patientService.fetchPatientById).mockReturnValue(new Promise(() => {}));

    render(
      <TestWrapper>
        <MemoryRouter initialEntries={['/pacientes/patient1']}>
          <Routes>
            <Route path="/pacientes/:patientId" element={<PatientProfilePage />} />
          </Routes>
        </MemoryRouter>
      </TestWrapper>
    );

    expect(screen.getByText('Cargando datos del paciente...')).toBeInTheDocument();
  });

  it('debería mostrar los detalles del paciente después de cargar', async () => {
    // Configurar el mock para resolver con datos
    vi.mocked(patientService.fetchPatientById).mockResolvedValue(mockPatientDetails);

    render(
      <TestWrapper>
        <MemoryRouter initialEntries={['/pacientes/patient1']}>
          <Routes>
            <Route path="/pacientes/:patientId" element={<PatientProfilePage />} />
          </Routes>
        </MemoryRouter>
      </TestWrapper>
    );

    // Esperar a que la carga termine y se muestren los datos
    await waitFor(() => {
      expect(screen.getByText('Perfil del Paciente: patient1')).toBeInTheDocument();
      expect(screen.getByText('Ana Gomez')).toBeInTheDocument();
      expect(screen.getByText('ana@example.com')).toBeInTheDocument();
      expect(screen.getByText('Último Registro Biométrico')).toBeInTheDocument();
      expect(screen.getByText('Peso:')).toBeInTheDocument();
      expect(screen.getByText('Planes de Dieta')).toBeInTheDocument();
      // Aserciones para los planes, verificando la presencia de textos y badges
      expect(screen.getByText('Plan Inicial')).toBeInTheDocument();
      expect(screen.getByText('Activo')).toBeInTheDocument(); // El badge ACTIVE se muestra como "Activo"
      expect(screen.getByText('Plan Mantenimiento')).toBeInTheDocument();
      expect(screen.getByText('Borrador')).toBeInTheDocument(); // El badge DRAFT se muestra como "Borrador"
      expect(screen.getByText('Planes de Entrenamiento')).toBeInTheDocument();
      expect(screen.getByText('- Rutina Fuerza (Activo)')).toBeInTheDocument(); // Los workout plans siguen con formato anterior
      // Verificar que el mensaje de carga desaparece
      expect(screen.queryByText('Cargando datos del paciente...')).not.toBeInTheDocument();
    });

    // Verificar que se llamó al servicio con el ID correcto
    expect(patientService.fetchPatientById).toHaveBeenCalledTimes(1);
    expect(patientService.fetchPatientById).toHaveBeenCalledWith('patient1');
  });

  it('debería navegar de vuelta al listado al hacer clic en el botón Volver', async () => {
    // Configurar el mock para resolver con datos, ya que necesitamos que el componente se renderice completamente
    vi.mocked(patientService.fetchPatientById).mockResolvedValue(mockPatientDetails);

    render(
      <TestWrapper>
        <MemoryRouter initialEntries={['/pacientes/patient1']}>
          <Routes>
            <Route path="/pacientes/:patientId" element={<PatientProfilePage />} />
          </Routes>
        </MemoryRouter>
      </TestWrapper>
    );

    // Esperar a que el componente termine de cargar y muestre los datos
    await waitFor(() => {
      expect(screen.getByText('Perfil del Paciente: patient1')).toBeInTheDocument();
    });

    // Encontrar y hacer clic en el botón de volver
    const backButton = screen.getByRole('button', { name: /Volver al Listado/i });
    fireEvent.click(backButton);

    // Verificar que mockNavigate fue llamado con -1
    expect(mockNavigate).toHaveBeenCalledTimes(1);
    expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
  });

  it('debería mostrar un mensaje de error si la carga falla', async () => {
    const errorMessage = 'Paciente no encontrado';
    // Configurar el mock para rechazar con un error
    vi.mocked(patientService.fetchPatientById).mockRejectedValue(new Error(errorMessage));

    render(
      <TestWrapper>
        <MemoryRouter initialEntries={['/pacientes/patient1']}>
          <Routes>
            <Route path="/pacientes/:patientId" element={<PatientProfilePage />} />
          </Routes>
        </MemoryRouter>
      </TestWrapper>
    );

    // Esperar a que el error se muestre
    await waitFor(() => {
      expect(screen.getByText(`Error al cargar los detalles del paciente: ${errorMessage}`)).toBeInTheDocument();
      // Verificar que el mensaje de carga desaparece y los datos no se muestran
      expect(screen.queryByText('Cargando datos del paciente...')).not.toBeInTheDocument();
      expect(screen.queryByText('Ana Gomez')).not.toBeInTheDocument();
    });
  });

  it('debería mostrar mensajes de vacío si no hay registros biométricos o planes', async () => {
    // Crear un mock de paciente sin registros biométricos ni planes
    const patientWithoutDetails: PatientDetails = {
      ...mockPatientDetails,
      lastBiometricRecord: null,
      dietPlansSummary: [],
      workoutPlansSummary: [],
    };
    vi.mocked(patientService.fetchPatientById).mockResolvedValue(patientWithoutDetails);

    render(
      <TestWrapper>
        <MemoryRouter initialEntries={['/pacientes/patient2']}>
          <Routes>
            <Route path="/pacientes/:patientId" element={<PatientProfilePage />} />
          </Routes>
        </MemoryRouter>
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByText('No hay registros biométricos aún.')).toBeInTheDocument();
      expect(screen.getByText('No hay planes de dieta asignados.')).toBeInTheDocument();
      expect(screen.getByText('No hay planes de entrenamiento asignados.')).toBeInTheDocument();
    });
  });
}); 