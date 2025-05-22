import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Importar useNavigate
import type { Patient } from '../types/patient'; // Importar el tipo Patient
import { fetchPatients } from '../services/patientService'; // Importar el servicio

// Asumiremos que estos componentes se crearán/ajustarán más adelante
import SearchBar from '../components/common/SearchBar';
import PatientCard from '../components/patients/PatientCard';

const PatientDashboardPage: React.FC = () => {
  const [patients, setPatients] = useState<Patient[]>([]); // Usar el tipo Patient
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const navigate = useNavigate(); // Hook para la navegación

  useEffect(() => {
    const loadPatients = async () => {
      setIsLoading(true);
      setError(null);
      try {
        console.log(searchTerm ? `Buscando pacientes con término: ${searchTerm}` : 'Cargando todos los pacientes...');
        const data = await fetchPatients(searchTerm);
        setPatients(data);
      } catch (err) {
        // Asegurarse de que err es de tipo Error o tiene una propiedad message
        const errorMessage = err instanceof Error ? err.message : 'Error al cargar los pacientes. Por favor, inténtelo de nuevo más tarde.';
        setError(errorMessage);
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    loadPatients();
  }, [searchTerm]);

  const handleSearchChange = (newSearchTerm: string) => {
    setSearchTerm(newSearchTerm);
  };

  const handleSelectPatient = (patientId: string) => {
    console.log(`Navegar al perfil del paciente: ${patientId}`);
    navigate(`/patients/${patientId}`); // Navegar al perfil del paciente
  };

  const handleAddNewPatient = () => {
    console.log('Navegar a la página de creación de nuevo paciente');
    navigate('/patients/new'); // Navegar al formulario de nuevo paciente
  };

  return (
    <div className="container mx-auto p-4 md:p-6 lg:p-8">
      <header className="mb-8 flex flex-col sm:flex-row justify-between items-center gap-4">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800">Dashboard de Pacientes</h1>
        <button 
          onClick={handleAddNewPatient}
          className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 text-sm md:text-base"
        >
          + Añadir Paciente
        </button>
      </header>
      
      <div className="mb-8">
        <SearchBar 
          currentSearchTerm={searchTerm} 
          onSearchChange={handleSearchChange} 
          placeholder="Buscar por nombre, apellidos o email..."
        />
      </div>

      {isLoading && (
        <div className="flex justify-center items-center h-64">
          <p className="text-lg text-gray-600">Cargando pacientes...</p>
          {/* Podrías añadir un spinner aquí */}
        </div>
      )}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6" role="alert">
          <strong className="font-bold">¡Error! </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      )}
      
      {!isLoading && !error && patients.length === 0 && (
        <div className="text-center py-10">
          <p className="text-xl text-gray-500">
            {searchTerm 
              ? `No se encontraron pacientes para "${searchTerm}".` 
              : 'Aún no tienes pacientes registrados.'
            }
          </p>
          {!searchTerm && (
            <button 
              onClick={handleAddNewPatient}
              className="mt-6 bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 text-lg"
            >
              + Registrar Nuevo Paciente
            </button>
          )}
        </div>
      )}

      {!isLoading && !error && patients.length > 0 && (
        <div className="mb-6">
          <p className="text-lg text-gray-700">
            {searchTerm 
              ? `Mostrando ${patients.length} paciente(s) para tu búsqueda.`
              : `Tienes una agenda de ${patients.length} paciente(s).`
            }
          </p>
        </div>
      )}

      {!isLoading && !error && patients.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {patients.map(patient => (
            <PatientCard 
              key={patient.id} 
              patient={patient} 
              onSelectPatient={handleSelectPatient} // Pasar la función como prop
            />
          ))}
        </div>
      )}
      
      {/* El botón de añadir ya está en el header o en el mensaje de vacío */}
    </div>
  );
};

export default PatientDashboardPage; 