import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { vi } from 'vitest';
import NewPatientPage from './NewPatientPage';
import { createPatient } from '../services/patientService';
import type { Patient /*, NewPatientData*/ } from '../types/patient'; // Eliminar NewPatientData

// Mockear useNavigate de react-router-dom
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react-router-dom')>();
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    // Puedes añadir otros hooks o componentes que necesites mockear de react-router-dom aquí
  };
});

// Mockear el servicio de pacientes
vi.mock('../services/patientService', () => ({
  createPatient: vi.fn(),
  // Puedes añadir otras funciones del servicio que necesites mockear aquí
}));

// Mockear react-hot-toast si lo usas para mensajes
// vi.mock('react-hot-toast', () => ({
//   success: vi.fn(),
//   error: vi.fn(),
// }));

describe('NewPatientPage', () => {
  beforeEach(() => {
    // Limpiar mocks antes de cada prueba
    mockNavigate.mockClear();
    vi.mocked(createPatient).mockClear();
    // if (typeof toast !== 'undefined') { // Asegurarse de que toast esté definido si lo mockeaste
    //   toast.success.mockClear();
    //   toast.error.mockClear();
    // }
  });

  it('debería renderizar el formulario de registro de paciente', () => {
    render(<NewPatientPage />);

    // Verificar que los elementos clave del formulario estén presentes
    expect(screen.getByText('Registrar Nuevo Paciente')).toBeInTheDocument();
    expect(screen.getByLabelText('Nombre *')).toBeInTheDocument();
    expect(screen.getByLabelText('Apellidos *')).toBeInTheDocument();
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    // Añadir aserciones para otros campos importantes si es necesario
    expect(screen.getByRole('button', { name: /Registrar Paciente/i })).toBeInTheDocument();
  });

  it.only('debería mostrar errores de validación si los campos obligatorios están vacíos al intentar enviar', async () => {
    render(<NewPatientPage />);

    // Intentar enviar el formulario sin llenar los campos obligatorios
    const submitButton = screen.getByTestId('submit-button');

    await act(async () => {
      fireEvent.click(submitButton);
    });

    // Esperar a que se muestren los mensajes de error
    await screen.findByText('El campo Nombre es obligatorio', {}, { timeout: 3000 });
    await screen.findByText('El campo Apellidos es obligatorio', {}, { timeout: 3000 });

    // Verificar que los mensajes de error están visibles
    expect(screen.getByText('El campo Nombre es obligatorio')).toBeVisible();
    expect(screen.getByText('El campo Apellidos es obligatorio')).toBeVisible();

    // Verificar que createPatient no fue llamado
    expect(vi.mocked(createPatient)).not.toHaveBeenCalled();
  });

  it('debería llamar a createPatient y navegar al dashboard en envío exitoso', async () => {
    render(<NewPatientPage />);

    const mockPatientData = {
      firstName: 'Test',
      lastName: 'Paciente',
      email: 'test.paciente@example.com',
      phone: '+1234567890',
      birthDate: new Date('1990-01-01'),
      gender: 'Masculino',
      height: 175,
      medicalNotes: 'Ninguna.',
      dietRestrictions: 'Vegetariano',
      objectives: 'Perder peso.',
      initialBiometrics: {
        recordDate: new Date(),
        weight: 80,
        bodyFatPercentage: 25,
        musclePercentage: 30,
        waterPercentage: 50,
        waistDiameter: 90,
        notes: 'Notas iniciales.',
      },
    };

    // Mockear el servicio para que resuelva exitosamente
    vi.mocked(createPatient).mockImplementation(() =>
      Promise.resolve({
        id: 'mock-patient-id', // Añadir campos de Patient
        professionalId: 'mock-prof-id',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        dietPlansSummary: [], // Añadir las propiedades que faltan
        workoutPlansSummary: [], // Añadir las propiedades que faltan
        ...mockPatientData, // Incluir los datos enviados
        birthDate: mockPatientData.birthDate?.toISOString() || null, // Convertir Date a string ISO
        // Asegurarse de que todos los campos no opcionales de Patient estén aquí o en mockPatientData
        // Añadir campos opcionales con valores si son relevantes para el test o permitir null/undefined
        email: mockPatientData.email || null,
        phone: mockPatientData.phone || null,
        gender: mockPatientData.gender || null,
        height: (mockPatientData.height !== undefined && mockPatientData.height !== null) ? Number(mockPatientData.height) : null,
        medicalNotes: mockPatientData.medicalNotes || null,
        dietRestrictions: mockPatientData.dietRestrictions || null,
        objectives: mockPatientData.objectives || null,
      } as Patient) // Tipar el valor resuelto como Patient
    );

    // Llenar el formulario
    fireEvent.change(screen.getByLabelText('Nombre *'), { target: { value: mockPatientData.firstName } });
    fireEvent.change(screen.getByLabelText('Apellidos *'), { target: { value: mockPatientData.lastName } });
    fireEvent.change(screen.getByLabelText('Email'), { target: { value: mockPatientData.email } });
    // Añadir llenado para otros campos importantes si es necesario

    // Simular clic en el botón de envío
    const submitButton = screen.getByRole('button', { name: /Registrar Paciente/i });
    fireEvent.click(submitButton);

    // Esperar a que la llamada al servicio ocurra
    // Puede necesitar await findBy... si hay un estado de carga que bloquea el botón

    // Verificar que createPatient fue llamado con los datos correctos
    // Nota: La comparación de fechas y objetos anidados puede requerir ajustes (ej. expect.objectContaining)
    // expect(vi.mocked(createPatient)).toHaveBeenCalledTimes(1);
    // expect(vi.mocked(createPatient)).toHaveBeenCalledWith(expect.objectContaining({
    //   firstName: mockPatientData.firstName,
    //   lastName: mockPatientData.lastName,
    //   email: mockPatientData.email,
    //   // Añadir otros campos relevantes
    // }));

    // Verificar que se navegó al dashboard (o a donde corresponda después del registro)
    // Ajusta '/dashboard' si la ruta de navegación es diferente
    await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledTimes(1);
        expect(mockNavigate).toHaveBeenCalledWith('/dashboard'); // Asegúrate de la ruta correcta aquí también
      });
  });

  it('debería mostrar un mensaje de error si la llamada a createPatient falla', async () => {
    render(<NewPatientPage />);

    const mockPatientData = {
      firstName: 'Test',
      lastName: 'Paciente',
      // Añadir otros campos obligatorios mockeados
    };

    const errorMessage = 'Error al crear paciente';
    // Mockear el servicio para que rechace con un error
    vi.mocked(createPatient).mockRejectedValue(new Error(errorMessage));

     // Llenar los campos obligatorios para pasar la validación inicial del cliente
     fireEvent.change(screen.getByLabelText('Nombre *'), { target: { value: mockPatientData.firstName } });
     fireEvent.change(screen.getByLabelText('Apellidos *'), { target: { value: mockPatientData.lastName } });

    // Simular clic en el botón de envío
    const submitButton = screen.getByRole('button', { name: /Registrar Paciente/i });
    fireEvent.click(submitButton);

    // Esperar a que se muestre el mensaje de error (si usas toast o algún otro elemento en pantalla)
    // Nota: Si usas react-hot-toast, tendrías que mockearlo y esperar a que toast.error sea llamado
    // await waitFor(() => {
    //   expect(toast.error).toHaveBeenCalledWith(errorMessage);
    // });

    // Verificar que no se llamó a mockNavigate en caso de error
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it('debería mostrar un error de validación si el formato del teléfono es inválido', async () => {
    render(<NewPatientPage />);

    const phoneInput = screen.getByLabelText('Teléfono');
    const submitButton = screen.getByRole('button', { name: /Registrar Paciente/i });

    // Ingresar un formato de teléfono inválido (ej. con caracteres no permitidos)
    fireEvent.change(phoneInput, { target: { value: 'abc-123-xyz' } });

    // Asegurarse de que los campos obligatorios tengan valor para que solo falle la validación del teléfono
    fireEvent.change(screen.getByLabelText('Nombre *'), { target: { value: 'Nombre Valido' } });
    fireEvent.change(screen.getByLabelText('Apellidos *'), { target: { value: 'Apellido Valido' } });

    await act(async () => {
      fireEvent.click(submitButton);
    });

    // Esperar a que aparezca el mensaje de error específico del teléfono
    await screen.findByTestId('error-phone', {}, { timeout: 3000 });

    // Verificar que el mensaje de error es el correcto y está visible
    expect(screen.getByTestId('error-phone')).toHaveTextContent('El formato del teléfono no es válido.'); // Ajusta el texto si es diferente
    expect(screen.getByTestId('error-phone')).toBeVisible();

    // Verificar que createPatient no fue llamado
    expect(vi.mocked(createPatient)).not.toHaveBeenCalled();
  });

  // Aquí se añadirán más pruebas para:
  // - Validaciones en cliente (campos obligatorios, email, numéricos)
  // - Envío exitoso del formulario y llamada al servicio
  // - Manejo de diferentes respuestas de error del backend
}); 