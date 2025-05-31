import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import BiometricRecordForm from './BiometricRecordForm';
import { BIOMETRIC_UNITS, type BiometricRecordCreation, type BiometricRecordResponse } from '../../types/biometrics';
import * as biometricService from '../../services/biometricService';
import { toast } from 'react-hot-toast';

// Importar lo necesario de react-hook-form para tipado y mocking
import { useForm } from 'react-hook-form';
import type { SubmitHandler } from 'react-hook-form';

// Definir los mocks fuera de la factoría para poder acceder a ellos
const mockRegister = vi.fn();
const mockHandleSubmit = vi.fn();
const mockReset = vi.fn();
const mockFormState = { errors: {} };

// Mockear react-hook-form y sus dependencias
vi.mock('react-hook-form', () => ({
  useForm: vi.fn(() => ({
    register: mockRegister,
    handleSubmit: mockHandleSubmit,
    formState: mockFormState,
    reset: mockReset,
  })),
  // Mantener las exportaciones necesarias, como SubmitHandler si se usa directamente
  // en el componente (aunque aquí lo usamos como tipo)
  SubmitHandler: {} as unknown, // Mock básico si es necesario exportarlo
}));

vi.mock('@hookform/resolvers/zod', () => ({
  zodResolver: vi.fn(schema => schema),
}));

// Mockear el servicio de biometría
vi.mock('../../services/biometricService');

// Mockear react-hot-toast
vi.mock('react-hot-toast');

// Mockear react-router-dom para useParams y useNavigate
vi.mock('react-router-dom', () => ({
  useParams: vi.fn(() => ({ patientId: 'test-patient-id' })),
  useNavigate: vi.fn(() => vi.fn()),
}));

describe('BiometricRecordForm', () => {
  const patientId = 'test-patient-id';
  const onSuccessMock = vi.fn();
  const onCancelMock = vi.fn();

  // Obtener una referencia tipada al mock de useForm
  const mockedUseForm = vi.mocked(useForm);

  // Limpiar mocks antes de cada test
  beforeEach(() => {
    vi.clearAllMocks();

    // Resetear mocks específicos de useForm y su estado interno
    mockedUseForm.mockClear();
    mockRegister.mockClear();
    mockHandleSubmit.mockClear();
    mockReset.mockClear();
    mockFormState.errors = {}; // Resetear errores del formState

    // Configurar la implementación por defecto de handleSubmit para que ejecute el callback
    // Tipamos el callback para evitar implicit any y proporcionamos una estructura básica
    mockHandleSubmit.mockImplementation(
      (callback: SubmitHandler<BiometricRecordCreation>) => (e?: React.FormEvent) => {
        e?.preventDefault();
        // Proporcionar una estructura mínima que cumpla con BiometricRecordCreation
        const defaultData: BiometricRecordCreation = {
            recordDate: new Date().toISOString().split('T')[0],
            // Proporcionar null o undefined para los campos opcionales numéricos y notas
            weight: undefined,
            bodyFatPercentage: undefined,
            musclePercentage: undefined,
            waterPercentage: undefined,
            backChestDiameter: undefined,
            waistDiameter: undefined,
            armsDiameter: undefined,
            legsDiameter: undefined,
            calvesDiameter: undefined,
            notes: undefined,
        };
        return callback(defaultData);
      }
    );

    // Resetear mocks del servicio y toast
    vi.mocked(biometricService.createBiometricRecord).mockClear();
    vi.mocked(toast.success).mockClear();
    vi.mocked(toast.error).mockClear();
  });

  // Test básico de renderizado
  it('renders the form correctly', () => {
    render(<BiometricRecordForm patientId={patientId} onSuccess={onSuccessMock} onCancel={onCancelMock} />);
    expect(screen.getByText('Nuevo Registro Biométrico')).toBeInTheDocument();
    expect(screen.getByLabelText('Fecha de medición *')).toBeInTheDocument();
    expect(screen.getByLabelText(`Peso (${BIOMETRIC_UNITS.weight})`)).toBeInTheDocument();
    expect(screen.getByLabelText(`% Grasa Corporal (${BIOMETRIC_UNITS.bodyFatPercentage})`)).toBeInTheDocument();
    expect(screen.getByLabelText(`% Masa Muscular (${BIOMETRIC_UNITS.musclePercentage})`)).toBeInTheDocument();
    expect(screen.getByLabelText(`% Agua (${BIOMETRIC_UNITS.waterPercentage})`)).toBeInTheDocument();
    expect(screen.getByLabelText(`Espalda/Pecho (${BIOMETRIC_UNITS.backChestDiameter})`)).toBeInTheDocument();
    expect(screen.getByLabelText(`Cintura (${BIOMETRIC_UNITS.waistDiameter})`)).toBeInTheDocument();
    expect(screen.getByLabelText(`Brazos (${BIOMETRIC_UNITS.armsDiameter})`)).toBeInTheDocument();
    expect(screen.getByLabelText(`Piernas (${BIOMETRIC_UNITS.legsDiameter})`)).toBeInTheDocument();
    expect(screen.getByLabelText(`Gemelos (${BIOMETRIC_UNITS.calvesDiameter})`)).toBeInTheDocument();
    expect(screen.getByLabelText('Notas adicionales')).toBeInTheDocument();

    expect(screen.getByRole('button', { name: /Guardar Registro/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Cancelar/i })).toBeInTheDocument();
  });

  // Test de envío de formulario exitoso
  it('submits the form with valid data and calls onSuccess', async () => {
    const mockData: BiometricRecordCreation = {
      recordDate: '2023-10-27',
      weight: 75.5,
      bodyFatPercentage: 15.2,
      musclePercentage: 40,
      waterPercentage: 60,
      backChestDiameter: 100,
      waistDiameter: 80,
      armsDiameter: 30,
      legsDiameter: 50,
      calvesDiameter: 35,
      notes: 'Notas de prueba',
    };

    // Configurar la implementación específica de handleSubmit para este test
    mockHandleSubmit.mockImplementationOnce(
        (callback: SubmitHandler<BiometricRecordCreation>) => (e?: React.FormEvent) => {
        e?.preventDefault();
        return callback(mockData);
      }
    );

    // Configurar el mock del servicio para resolver exitosamente
    // Asegurarse de que la respuesta coincida con el tipo BiometricRecordResponse
    const mockResponse: BiometricRecordResponse = {
        id: 'new-id',
        patientId: patientId,
        recordDate: mockData.recordDate,
        weight: mockData.weight !== undefined ? mockData.weight : null,
        bodyFatPercentage: mockData.bodyFatPercentage !== undefined ? mockData.bodyFatPercentage : null,
        musclePercentage: mockData.musclePercentage !== undefined ? mockData.musclePercentage : null,
        waterPercentage: mockData.waterPercentage !== undefined ? mockData.waterPercentage : null,
        backChestDiameter: mockData.backChestDiameter !== undefined ? mockData.backChestDiameter : null,
        waistDiameter: mockData.waistDiameter !== undefined ? mockData.waistDiameter : null,
        armsDiameter: mockData.armsDiameter !== undefined ? mockData.armsDiameter : null,
        legsDiameter: mockData.legsDiameter !== undefined ? mockData.legsDiameter : null,
        calvesDiameter: mockData.calvesDiameter !== undefined ? mockData.calvesDiameter : null,
        notes: mockData.notes !== undefined ? mockData.notes : null,
        createdAt: new Date().toISOString(),
    };
    vi.mocked(biometricService.createBiometricRecord).mockResolvedValue(mockResponse);

    render(<BiometricRecordForm patientId={patientId} onSuccess={onSuccessMock} onCancel={onCancelMock} />);

    // Disparar el envío del formulario
    fireEvent.submit(screen.getByRole('button', { name: /Guardar Registro/i }));

    // Esperar a que las operaciones asíncronas se completen
    await waitFor(() => {
      expect(vi.mocked(biometricService.createBiometricRecord)).toHaveBeenCalledWith(
        patientId,
        mockData
      );
      expect(vi.mocked(toast.success)).toHaveBeenCalledWith('Registro biométrico guardado correctamente');
      expect(mockReset).toHaveBeenCalled();
      expect(onSuccessMock).toHaveBeenCalled();
    });
  });

  // Test de manejo de error en el envío del formulario
  it('handles submission error and shows error toast', async () => {
    const mockData: BiometricRecordCreation = {
        recordDate: '2023-10-27',
        weight: 75.5,
        bodyFatPercentage: 15.2,
        musclePercentage: undefined, // Ejemplo de datos parciales
        waterPercentage: undefined,
        backChestDiameter: undefined,
        waistDiameter: undefined,
        armsDiameter: undefined,
        legsDiameter: undefined,
        calvesDiameter: undefined,
        notes: undefined,
      };
    const errorMessage = 'Error al crear registro';
    const mockError = new Error(errorMessage);

    // Configurar la implementación específica de handleSubmit para este test
    mockHandleSubmit.mockImplementationOnce(
        (callback: SubmitHandler<BiometricRecordCreation>) => (e?: React.FormEvent) => {
        e?.preventDefault();
        return callback(mockData);
      }
    );

    // Configurar el mock del servicio para rechazar con un error
    vi.mocked(biometricService.createBiometricRecord).mockRejectedValue(mockError);

    render(<BiometricRecordForm patientId={patientId} onSuccess={onSuccessMock} onCancel={onCancelMock} />);

    // Disparar el envío del formulario
    fireEvent.submit(screen.getByRole('button', { name: /Guardar Registro/i }));

    // Esperar a que las operaciones asíncronas se completen
    await waitFor(() => {
      expect(vi.mocked(biometricService.createBiometricRecord)).toHaveBeenCalledWith(
        patientId,
        mockData
      );
      // El mensaje de error ahora incluye el mensaje de la excepción
      expect(vi.mocked(toast.error)).toHaveBeenCalledWith(`Error al guardar el registro biométrico: ${errorMessage}`);
      expect(mockReset).not.toHaveBeenCalled();
      expect(onSuccessMock).not.toHaveBeenCalled();
    });
  });

  // Test del botón Cancelar
  it('calls onCancel when the Cancel button is clicked', () => {
    render(<BiometricRecordForm patientId={patientId} onSuccess={onSuccessMock} onCancel={onCancelMock} />);
    fireEvent.click(screen.getByRole('button', { name: /Cancelar/i }));
    expect(onCancelMock).toHaveBeenCalled();
  });

}); 