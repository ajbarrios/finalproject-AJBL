import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchPatientById } from '../services/patientService';
import type { PatientDetails } from '../types/patient';

const PatientProfilePage: React.FC = () => {
  const { patientId } = useParams<{ patientId: string }>();
  const navigate = useNavigate();

  const [patient, setPatient] = useState<PatientDetails | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getPatientDetails = async () => {
      if (!patientId) return;
      setIsLoading(true);
      setError(null);
      try {
        const data = await fetchPatientById(patientId);
        setPatient(data);
      } catch (err) {
        console.error('Error fetching patient details:', err);
        setError(err instanceof Error ? err.message : 'Error desconocido al cargar el paciente.');
      } finally {
        setIsLoading(false);
      }
    };

    getPatientDetails();
  }, [patientId]);

  return (
    <div className="container mx-auto px-4 py-8">
      <button 
        onClick={() => navigate(-1)}
        className="mb-4 px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors duration-200"
      >
        &larr; Volver al Listado
      </button>

      <h1 className="text-2xl font-bold mb-6">Perfil del Paciente: {patientId}</h1>
      {isLoading && <p>Cargando datos del paciente...</p>}

      {error && (
        <div className="text-red-500">Error al cargar los detalles del paciente: {error}</div>
      )}

      {patient && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Información Personal</h2>
            <p><strong>Nombre:</strong> {patient.firstName} {patient.lastName}</p>
            <p><strong>Email:</strong> {patient.email}</p>
            <p><strong>Teléfono:</strong> {patient.phone || 'N/A'}</p>
            <p><strong>Fecha de Nacimiento:</strong> {patient.birthDate ? new Date(patient.birthDate).toLocaleDateString() : 'N/A'}</p>
            <p><strong>Género:</strong> {patient.gender || 'N/A'}</p>
            <p><strong>Altura:</strong> {patient.height ? `${patient.height} cm` : 'N/A'}</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Último Registro Biométrico</h2>
            {patient.lastBiometricRecord ? (
              <>
                <p><strong>Fecha:</strong> {new Date(patient.lastBiometricRecord.recordDate).toLocaleDateString()}</p>
                <p><strong>Peso:</strong> {patient.lastBiometricRecord.weight || 'N/A'} kg</p>
                <p><strong>% Grasa:</strong> {patient.lastBiometricRecord.bodyFatPercentage || 'N/A'} %</p>
              </>
            ) : (
              <p>No hay registros biométricos aún.</p>
            )}
          </div>

          <div className="bg-white p-6 rounded-lg shadow col-span-full">
             <h2 className="text-xl font-semibold mb-4">Planes de Dieta</h2>
             {patient.dietPlansSummary && patient.dietPlansSummary.length > 0 ? (
               <ul>
                 {patient.dietPlansSummary.map(plan => (
                   <li key={plan.id}>- {plan.title} ({plan.isActive ? 'Activo' : 'Borrador'})</li>
                 ))}
               </ul>
             ) : (
               <p>No hay planes de dieta asignados.</p>
             )}
           </div>

           <div className="bg-white p-6 rounded-lg shadow col-span-full">
             <h2 className="text-xl font-semibold mb-4">Planes de Entrenamiento</h2>
             {patient.workoutPlansSummary && patient.workoutPlansSummary.length > 0 ? (
               <ul>
                 {patient.workoutPlansSummary.map(plan => (
                   <li key={plan.id}>- {plan.title} ({plan.isActive ? 'Activo' : 'Borrador'})</li>
                 ))}
               </ul>
             ) : (
               <p>No hay planes de entrenamiento asignados.</p>
             )}
           </div>

           <div className="bg-white p-6 rounded-lg shadow col-span-full flex space-x-4">
               <button className="bg-blue-500 text-white px-4 py-2 rounded">Editar Paciente (TF-006)</button>
               <button className="bg-green-500 text-white px-4 py-2 rounded">Añadir Biométrica (TF-010)</button>
               <button className="bg-purple-500 text-white px-4 py-2 rounded">Ver Historial Biométrico (TF-011)</button>
               <button className="bg-yellow-500 text-white px-4 py-2 rounded">Crear Plan Dieta (TF-012)</button>
               <button className="bg-indigo-500 text-white px-4 py-2 rounded">Crear Plan Entrenamiento (TF-015)</button>
           </div>
        </div>
      )}
    </div>
  );
};

export default PatientProfilePage; 