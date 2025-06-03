import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import PatientDashboardPage from './PatientDashboardPage';
import * as patientService from '../services/patientService';
import type { Patient } from '../types/patient';

// Mockear react-router-dom
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// Mockear el servicio de pacientes
vi.mock('../services/patientService');

// Mockear componentes hijos
vi.mock('../components/common/SearchBar', () => ({
  default: ({ currentSearchTerm, onSearchChange, placeholder }: { currentSearchTerm: string; onSearchChange: (value: string) => void; placeholder: string }) => (
    <input
      type="text"
      value={currentSearchTerm}
      onChange={(e) => onSearchChange(e.target.value)}
      placeholder={placeholder || 'Buscar paciente...'}
      data-testid="search-bar"
    />
  ),
}));

vi.mock('../components/patients/PatientCard', () => ({
  default: ({ patient, onSelectPatient }: { patient: Patient; onSelectPatient: (id: string) => void; }) => (
    <div data-testid="patient-card">
      <p>{patient.firstName} {patient.lastName}</p>
      <button onClick={() => onSelectPatient(patient.id)}>Ver Perfil</button>
    </div>
  ),
}));

describe('PatientDashboardPage', () => {
  const mockPatients: Patient[] = [
    { id: '1', firstName: 'Ana', lastName: 'Gomez', email: 'ana@example.com', professionalId: 'prof1', birthDate: '1990-01-01', objectives: 'Perder peso', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), dietPlansSummary: [], workoutPlansSummary: [] },
    { id: '2', firstName: 'Luis', lastName: 'Perez', email: 'luis@example.com', professionalId: 'prof1', birthDate: '1985-05-15', objectives: 'Ganar músculo', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), dietPlansSummary: [], workoutPlansSummary: [] },
  ];

  beforeEach(() => {
    vi.resetAllMocks();
    vi.mocked(patientService.fetchPatients).mockResolvedValue(mockPatients);
  });

  it('debería renderizar el título y el buscador', async () => {
    render(
      <MemoryRouter>
        <PatientDashboardPage />
      </MemoryRouter>
    );
    expect(screen.getByText('Dashboard de Pacientes')).toBeInTheDocument();
    expect(screen.getByTestId('search-bar')).toBeInTheDocument();
    await waitFor(() => expect(patientService.fetchPatients).toHaveBeenCalledTimes(1));
  });

  it('debería mostrar "Cargando pacientes..." inicialmente', () => {
    vi.mocked(patientService.fetchPatients).mockImplementation(() => new Promise(() => {}));
    render(
      <MemoryRouter>
        <PatientDashboardPage />
      </MemoryRouter>
    );
    expect(screen.getByText('Cargando pacientes...')).toBeInTheDocument();
  });

  it('debería mostrar las tarjetas de pacientes después de la carga', async () => {
    render(
      <MemoryRouter>
        <PatientDashboardPage />
      </MemoryRouter>
    );
    await waitFor(() => {
      expect(screen.queryByText('Cargando pacientes...')).not.toBeInTheDocument();
      expect(screen.getAllByTestId('patient-card')).toHaveLength(mockPatients.length);
      expect(screen.getByText(`Tienes una agenda de ${mockPatients.length} paciente(s).`)).toBeInTheDocument();
    });
    expect(screen.getByText('Ana Gomez')).toBeInTheDocument();
    expect(screen.getByText('Luis Perez')).toBeInTheDocument();
  });

  it('debería mostrar "No se encontraron pacientes." si la lista está vacía', async () => {
    vi.mocked(patientService.fetchPatients).mockResolvedValue([]);
    render(
      <MemoryRouter>
        <PatientDashboardPage />
      </MemoryRouter>
    );
    await waitFor(() => {
      expect(screen.getByText('Aún no tienes pacientes registrados.')).toBeInTheDocument();
      expect(screen.queryByText(/Tienes una agenda de/i)).not.toBeInTheDocument();
    });
  });
  
  it('debería mostrar un mensaje de error si la API falla', async () => {
    const specificErrorMessage = 'API error';
    vi.mocked(patientService.fetchPatients).mockRejectedValue(new Error(specificErrorMessage));
    render(
      <MemoryRouter>
        <PatientDashboardPage />
      </MemoryRouter>
    );
    await waitFor(() => {
      expect(screen.getByText(specificErrorMessage)).toBeInTheDocument();
    });
  });

  it('debería llamar a fetchPatients con el término de búsqueda cuando el buscador cambie', async () => {
    render(
      <MemoryRouter>
        <PatientDashboardPage />
      </MemoryRouter>
    );
    await waitFor(() => expect(patientService.fetchPatients).toHaveBeenCalledTimes(1));
    vi.mocked(patientService.fetchPatients).mockClear();

    const searchInput = screen.getByTestId('search-bar');
    fireEvent.change(searchInput, { target: { value: 'Ana' } });

    await waitFor(() => {
      expect(patientService.fetchPatients).toHaveBeenCalledWith('Ana');
    }, { timeout: 600 });
  });

  it('debería navegar a /patients/new cuando se hace clic en "Añadir Nuevo Paciente"', async () => {
    render(
      <MemoryRouter>
        <PatientDashboardPage />
      </MemoryRouter>
    );
    await waitFor(() => expect(screen.queryByText('Cargando pacientes...')).not.toBeInTheDocument());
    
    const addButton = screen.getByRole('button', { name: /\+ Añadir Paciente/i });
    fireEvent.click(addButton);
    expect(mockNavigate).toHaveBeenCalledWith('/patients/new');
  });

  it('debería navegar al perfil del paciente cuando onSelectPatient es llamado desde PatientCard', async () => {
    render(
      <MemoryRouter>
        <PatientDashboardPage />
      </MemoryRouter>
    );
    
    await waitFor(() => {
        expect(screen.getAllByTestId('patient-card').length).toBeGreaterThan(0);
    });

    const viewProfileButtons = screen.getAllByRole('button', { name: /Ver Perfil/i });
    fireEvent.click(viewProfileButtons[0]);

    expect(mockNavigate).toHaveBeenCalledWith(`/patients/${mockPatients[0].id}`);
  });
}); 