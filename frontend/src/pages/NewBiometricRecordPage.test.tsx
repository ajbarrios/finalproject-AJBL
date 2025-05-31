import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import NewBiometricRecordPage from './NewBiometricRecordPage';

// Definimos la interfaz para las props del BiometricRecordForm
interface BiometricRecordFormProps {
    patientId: string;
    onSuccess: () => void;
    onCancel: () => void;
}

// Primero, declaramos los mocks
vi.mock('react-router-dom', () => ({
    useParams: vi.fn(),
    useNavigate: () => vi.fn(),
    BrowserRouter: ({ children }: { children: React.ReactNode }) => <div>{children}</div>
}));

vi.mock('../components/biometrics/BiometricRecordForm', () => ({
    default: ({ patientId, onSuccess, onCancel }: BiometricRecordFormProps) => (
        <div data-testid="biometric-record-form">
            Mocked BiometricRecordForm for patient {patientId}
            <button data-testid="form-success-button" onClick={onSuccess}>Mock Success</button>
            <button data-testid="form-cancel-button" onClick={onCancel}>Mock Cancel</button>
        </div>
    )
}));

// Importamos después de los mocks para evitar problemas de hoisting
import { useParams } from 'react-router-dom';

describe('NewBiometricRecordPage', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders BiometricRecordForm when patientId is present', () => {
        // Configuramos el mock de useParams para este test específico
        (useParams as unknown as ReturnType<typeof vi.fn>).mockReturnValue({ patientId: 'patient-123' });
        
        render(<NewBiometricRecordPage />);

        expect(screen.getByTestId('biometric-record-form')).toBeInTheDocument();
        expect(screen.getByText('Mocked BiometricRecordForm for patient patient-123')).toBeInTheDocument();
        expect(screen.queryByText('No se ha especificado un ID de paciente válido.')).not.toBeInTheDocument();
    });
}); 