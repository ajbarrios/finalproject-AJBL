import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchPatientById } from '../services/patientService';
import type { Patient } from '../types/patient';

const PatientProfilePage: React.FC = () => {
  const { patientId } = useParams<{ patientId: string }>();
  const navigate = useNavigate();

  const [patient, setPatient] = useState<Patient | null>(null);
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

  // Función auxiliar para formatear valores numéricos con unidades
  const formatMeasurement = (value: number | null | undefined, unit: string): string => {
    if (value === null || value === undefined) return 'N/A';
    return `${value} ${unit}`;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Botón Volver al Listado - con estilos consistentes */}
      <div className="mb-4">
        <button 
          onClick={() => navigate('/dashboard')}
          className="flex items-center text-indigo-600 hover:text-indigo-800"
        >
          {/* Puedes añadir un icono SVG aquí si quieres consistencia total */}
          &larr; Volver al Listado
        </button>
      </div>

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
            <h2 className="text-xl font-semibold mb-6">Último Registro Biométrico</h2>
            {patient.lastBiometricRecord ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Fecha del registro */}
                <div className="col-span-full bg-blue-50 p-4 rounded-lg">
                  <p className="text-blue-800 font-medium mb-2">Fecha del Registro</p>
                  <p className="text-blue-900">{new Date(patient.lastBiometricRecord.recordDate).toLocaleDateString()}</p>
                </div>

                {/* Medidas Principales */}
                <div className="bg-green-50 p-4 rounded-lg">
                  <p className="text-green-800 font-medium mb-3">Medidas Principales</p>
                  <div className="space-y-2">
                    <p><strong>Peso:</strong> {formatMeasurement(patient.lastBiometricRecord.weight, 'kg')}</p>
                    <p><strong>Altura:</strong> {formatMeasurement(patient.height, 'cm')}</p>
                  </div>
                </div>

                {/* Composición Corporal */}
                <div className="bg-purple-50 p-4 rounded-lg">
                  <p className="text-purple-800 font-medium mb-3">Composición Corporal</p>
                  <div className="space-y-2">
                    <p><strong>% Grasa:</strong> {formatMeasurement(patient.lastBiometricRecord.bodyFatPercentage, '%')}</p>
                    <p><strong>% Músculo:</strong> {formatMeasurement(patient.lastBiometricRecord.musclePercentage, '%')}</p>
                    <p><strong>% Agua:</strong> {formatMeasurement(patient.lastBiometricRecord.waterPercentage, '%')}</p>
                  </div>
                </div>

                {/* Perímetros Corporales */}
                <div className="col-span-full bg-amber-50 p-4 rounded-lg">
                  <p className="text-amber-800 font-medium mb-3">Perímetros Corporales</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p><strong>Espalda/Pecho:</strong> {formatMeasurement(patient.lastBiometricRecord.backChestDiameter, 'cm')}</p>
                      <p><strong>Cintura:</strong> {formatMeasurement(patient.lastBiometricRecord.waistDiameter, 'cm')}</p>
                    </div>
                    <div>
                      <p><strong>Brazos:</strong> {formatMeasurement(patient.lastBiometricRecord.armsDiameter, 'cm')}</p>
                      <p><strong>Piernas:</strong> {formatMeasurement(patient.lastBiometricRecord.legsDiameter, 'cm')}</p>
                      <p><strong>Gemelos:</strong> {formatMeasurement(patient.lastBiometricRecord.calvesDiameter, 'cm')}</p>
                    </div>
                  </div>
                </div>

                {/* Notas */}
                {patient.lastBiometricRecord.notes && (
                  <div className="col-span-full bg-gray-50 p-4 rounded-lg">
                    <p className="text-gray-800 font-medium mb-2">Notas</p>
                    <p className="text-gray-600">{patient.lastBiometricRecord.notes}</p>
                  </div>
                )}
              </div>
            ) : (
              <p>No hay registros biométricos aún.</p>
            )}
          </div>

          <div className="bg-white p-6 rounded-lg shadow col-span-full">
             <h2 className="text-xl font-semibold mb-4">Planes de Dieta</h2>
             {patient.dietPlansSummary && patient.dietPlansSummary.length > 0 ? (
               <ul>
                 {patient.dietPlansSummary.map(plan => (
                   <li key={plan.id}>- {plan.title} ({plan.status === 'Active' ? 'Activo' : 'Borrador'})</li>
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
                   <li key={plan.id}>- {plan.title} ({plan.status === 'Active' ? 'Activo' : 'Borrador'})</li>
                 ))}
               </ul>
             ) : (
               <p>No hay planes de entrenamiento asignados.</p>
             )}
           </div>

           <div className="bg-white p-6 rounded-lg shadow col-span-full flex flex-wrap gap-3">
              <button 
                onClick={() => navigate(`/patients/${patientId}/edit`)}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors duration-200"
              >
                Editar Paciente
              </button>
              <button 
                onClick={() => navigate(`/patients/${patientId}/biometric-records/new`)}
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors duration-200"
              >
                Añadir Registro Biométrico
              </button>
              <button 
                onClick={() => navigate(`/patients/${patientId}/biometric-records`)}
                className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600 transition-colors duration-200"
              >
                Ver Historial Biométrico
              </button>
              <button 
                onClick={() => navigate(`/patients/${patientId}/diet-plans/new`)}
                className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 transition-colors duration-200"
              >
                Crear Plan Dieta
              </button>
              <button 
              disabled 
              title="próximamente" 
              className="bg-indigo-500 text-white px-4 py-2 rounded hover:bg-indigo-600 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
              Crear Plan Entrenamiento
            </button>
           </div>
        </div>
      )}
    </div>
  );
};

export default PatientProfilePage; 