import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import BiometricRecordForm from '../components/biometrics/BiometricRecordForm';

const NewBiometricRecordPage: React.FC = () => {
  const { patientId } = useParams<{ patientId: string }>();
  const navigate = useNavigate();

  if (!patientId) {
    return (
      <div className="container mx-auto p-4">
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-md">
          <h2 className="text-lg font-medium">Error</h2>
          <p>No se ha especificado un ID de paciente válido.</p>
          <button
            onClick={() => navigate(-1)}
            className="mt-2 px-4 py-2 text-sm bg-red-100 text-red-800 rounded-md hover:bg-red-200"
          >
            Volver
          </button>
        </div>
      </div>
    );
  }

  const handleSuccess = () => {
    // Redirigir al perfil del paciente después de guardar
    navigate(`/patients/${patientId}`);
  };

  const handleCancel = () => {
    // Volver a la página anterior
    navigate(-1);
  };

  return (
    <div className="container mx-auto p-4">
      <div className="mb-4">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-indigo-600 hover:text-indigo-800"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-1"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
              clipRule="evenodd"
            />
          </svg>
          Volver al perfil del paciente
        </button>
      </div>

      <BiometricRecordForm
        patientId={patientId}
        onSuccess={handleSuccess}
        onCancel={handleCancel}
      />
    </div>
  );
};

export default NewBiometricRecordPage; 