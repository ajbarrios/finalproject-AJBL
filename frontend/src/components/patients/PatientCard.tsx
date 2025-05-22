import React from 'react';
import type { Patient } from '../../types/patient'; // Importar el tipo Patient

// Props esperadas por el componente PatientCard
interface PatientCardProps {
  patient: Patient; // Usar el tipo Patient
  onSelectPatient: (patientId: string) => void; // Función para manejar clic y ver detalles
}

const PatientCard: React.FC<PatientCardProps> = ({ patient, onSelectPatient }) => {
  const handleViewProfile = () => {
    onSelectPatient(patient.id);
  };

  return (
    <div 
      className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300 ease-in-out cursor-pointer flex flex-col justify-between h-full"
      onClick={handleViewProfile}
    >
      <div> {/* Contenedor para la información superior */} 
        <div className="flex flex-col items-center text-center mb-4">
          <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center text-xl font-semibold text-indigo-700 mb-3">
            {patient.firstName?.charAt(0).toUpperCase()}{patient.lastName?.charAt(0).toUpperCase()}
          </div>
          <h2 className="text-xl font-semibold text-indigo-800">
            {patient.firstName} {patient.lastName}
          </h2>
          {patient.email && (
            <p className="text-sm text-gray-600 truncate" title={patient.email}>{patient.email}</p>
          )}
        </div>

        {/* Aquí podrías añadir más información si fuera necesario, por ejemplo:
        {patient.phone && (
          <p className="text-sm text-gray-500 mb-1 text-center">Tel: {patient.phone}</p>
        )}
        */} 
      </div>

      {/* Botón siempre al final */}
      <div className="mt-auto pt-4 flex justify-center">
        <button 
          onClick={(e) => { 
            e.stopPropagation(); // Evitar que el click se propague al div padre si es necesario
            handleViewProfile(); 
          }}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-md transition-colors duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 w-full sm:w-auto"
        >
          Ver Perfil
        </button>
      </div>
    </div>
  );
};

export default PatientCard; 