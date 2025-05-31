import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes, useParams } from 'react-router-dom';
import PatientBiometricHistoryPage from './PatientBiometricHistoryPage';
import api from '../services/api';

// Mock the api service
vi.mock('../../services/api');

// Mock react-router-dom's useParams and Link (although Link is implicitly tested by MemoryRouter)
vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react-router-dom')>();
  return {
    ...actual,
    useParams: vi.fn(),
    Link: actual.Link, // Use actual Link but it works within MemoryRouter
  };
});

// Mock the recharts library to simplify tests (optional, but avoids complex SVG rendering)
vi.mock('recharts', () => ({
  LineChart: () => <div>LineChart</div>,
  Line: () => <div>Line</div>,
  XAxis: () => <div>XAxis</div>,
  YAxis: () => <div>YAxis</div>,
  CartesianGrid: () => <div>CartesianGrid</div>,
  Tooltip: () => <div>Tooltip</div>,
  Legend: () => <div>Legend</div>,
  ResponsiveContainer: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

const mockUseParams = vi.mocked(useParams);
const mockApiGet = vi.mocked(api.get);

describe('PatientBiometricHistoryPage', () => {
  const patientId = '123';

  beforeEach(() => {
    // Reset mocks before each test
    mockUseParams.mockReturnValue({ patientId });
    mockApiGet.mockClear();
  });

  test('renders loading state initially', () => {
    // Arrange: Make the API call pending indefinitely
    mockApiGet.mockReturnValue(new Promise(() => {}));

    // Act
    render(
      <MemoryRouter initialEntries={['/patients/${patientId}/biometric-records']}>
        <Routes>
          <Route path="/patients/:patientId/biometric-records" element={<PatientBiometricHistoryPage />} />
        </Routes>
      </MemoryRouter>
    );

    // Assert
    expect(screen.getByText('Cargando historial biométrico...')).toBeInTheDocument();
  });

  test('renders error message if fetching data fails', async () => {
    // Arrange
    const errorMessage = 'Failed to fetch data';
    mockApiGet.mockRejectedValue(new Error(errorMessage));

    // Act
    render(
      <MemoryRouter initialEntries={['/patients/${patientId}/biometric-records']}>
        <Routes>
          <Route path="/patients/:patientId/biometric-records" element={<PatientBiometricHistoryPage />} />
        </Routes>
      </MemoryRouter>
    );

    // Assert
    await waitFor(() => {
      expect(screen.getByText(`Error: ${errorMessage}`)).toBeInTheDocument();
    });
  });

  test('renders message if no biometric records are found', async () => {
    // Arrange
    mockApiGet.mockResolvedValue({ data: [] });

    // Act
    render(
      <MemoryRouter initialEntries={['/patients/${patientId}/biometric-records']}>
        <Routes>
          <Route path="/patients/:patientId/biometric-records" element={<PatientBiometricHistoryPage />} />
        </Routes>
      </MemoryRouter>
    );

    // Assert
    await waitFor(() => {
      expect(screen.getByText('Este paciente aún no tiene registros biométricos para el rango de fechas seleccionado.')).toBeInTheDocument();
    });
  });

  test('renders records in the table when data is fetched successfully', async () => {
    // Arrange
    const mockRecords = [
      {
        id: 1,
        patientId: 123,
        recordDate: '2024-01-15T00:00:00.000Z',
        weight: 75,
        bodyFatPercentage: 15,
        musclePercentage: 30,
        waterPercentage: 55,
        backChestDiameter: 100,
        waistDiameter: 80,
        armsDiameter: 25,
        legsDiameter: 50,
        calvesDiameter: 35,
        notes: 'Primer registro',
        createdAt: '2024-01-15T10:00:00.000Z',
      },
      {
        id: 2,
        patientId: 123,
        recordDate: '2024-02-20T00:00:00.000Z',
        weight: 74.5,
        bodyFatPercentage: 14.8,
        musclePercentage: 30.2,
        waterPercentage: 55.1,
        backChestDiameter: 99,
        waistDiameter: 79,
        armsDiameter: 25.1,
        legsDiameter: 50.5,
        calvesDiameter: 35.2,
        notes: 'Segundo registro',
        createdAt: '2024-02-20T10:00:00.000Z',
      },
    ];
    mockApiGet.mockResolvedValue({ data: mockRecords });

    // Act
    render(
      <MemoryRouter initialEntries={[`/patients/${patientId}/biometric-records`]}>
        <Routes>
          <Route path="/patients/:patientId/biometric-records" element={<PatientBiometricHistoryPage />} />
        </Routes>
      </MemoryRouter>
    );

    // Assert
    await waitFor(() => {
      // Check if table headers are present
      // expect(screen.getByRole('columnheader', { name: /fecha/i })).toBeInTheDocument();
      
      // Intentar obtener todos los encabezados y verificar su contenido
      const headers = screen.getAllByRole('columnheader');
      expect(headers.length).toBe(11); // Verificar que hay 11 encabezados
      expect(headers[0]).toHaveTextContent(/fecha/i); // Verificar el primer encabezado

      // Verificar los demás encabezados usando getByRole como antes
      expect(screen.getByRole('columnheader', { name: /peso \(kg\)/i })).toBeInTheDocument();
      expect(screen.getByRole('columnheader', { name: /% grasa/i })).toBeInTheDocument();
      expect(screen.getByRole('columnheader', { name: /% músculo/i })).toBeInTheDocument();
      expect(screen.getByRole('columnheader', { name: /% agua/i })).toBeInTheDocument();
      expect(screen.getByRole('columnheader', { name: /espalda\/pecho \(cm\)/i })).toBeInTheDocument();
      expect(screen.getByRole('columnheader', { name: /cintura \(cm\)/i })).toBeInTheDocument();
      expect(screen.getByRole('columnheader', { name: /brazos \(cm\)/i })).toBeInTheDocument();
      expect(screen.getByRole('columnheader', { name: /piernas \(cm\)/i })).toBeInTheDocument();
      expect(screen.getByRole('columnheader', { name: /gemelos \(cm\)/i })).toBeInTheDocument();
      expect(screen.getByRole('columnheader', { name: /notas/i })).toBeInTheDocument();

      // Check if records are displayed (checking specific data points)
      // Note: toLocaleDateString() output depends on locale, might need adjustment or mocking Date
      expect(screen.getByRole('cell', { name: '15/1/2024' })).toBeInTheDocument();
      expect(screen.getByRole('cell', { name: '75' })).toBeInTheDocument();
      expect(screen.getByRole('cell', { name: '15' })).toBeInTheDocument();
      expect(screen.getByRole('cell', { name: '30' })).toBeInTheDocument();
      expect(screen.getByRole('cell', { name: '55' })).toBeInTheDocument();
      expect(screen.getByRole('cell', { name: '100' })).toBeInTheDocument();
      expect(screen.getByRole('cell', { name: '80' })).toBeInTheDocument();
      expect(screen.getByRole('cell', { name: '25' })).toBeInTheDocument();
      expect(screen.getByRole('cell', { name: '50' })).toBeInTheDocument();
      expect(screen.getByRole('cell', { name: '35' })).toBeInTheDocument();
      expect(screen.getByRole('cell', { name: 'Primer registro' })).toBeInTheDocument();

      expect(screen.getByRole('cell', { name: '20/2/2024' })).toBeInTheDocument();
      expect(screen.getByRole('cell', { name: '74.5' })).toBeInTheDocument();
      expect(screen.getByRole('cell', { name: '14.8' })).toBeInTheDocument();
      expect(screen.getByRole('cell', { name: '30.2' })).toBeInTheDocument();
      expect(screen.getByRole('cell', { name: '55.1' })).toBeInTheDocument();
      expect(screen.getByRole('cell', { name: '99' })).toBeInTheDocument();
      expect(screen.getByRole('cell', { name: '79' })).toBeInTheDocument();
      expect(screen.getByRole('cell', { name: '25.1' })).toBeInTheDocument();
      expect(screen.getByRole('cell', { name: '50.5' })).toBeInTheDocument();
      expect(screen.getByRole('cell', { name: '35.2' })).toBeInTheDocument();
      expect(screen.getByRole('cell', { name: 'Segundo registro' })).toBeInTheDocument();

      // screen.debug(); // Añadir para depuración
    });
  });

  // TODO: Add tests for filtering by dates
  // TODO: Add tests for navigation links/buttons
  // TODO: Add tests for charts (if not mocked out)
}); 