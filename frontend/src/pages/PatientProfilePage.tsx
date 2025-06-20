import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchPatientById } from '../services/patientService';
import type { Patient } from '../types/patient';
import SendEmailModal from '../components/common/SendEmailModal';
import { useAuth } from '../hooks/useAuth';

const PatientProfilePage: React.FC = () => {
  const { patientId } = useParams<{ patientId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [patient, setPatient] = useState<Patient | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showEmailModal, setShowEmailModal] = useState<boolean>(false);

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
               <div className="space-y-3">
                 {patient.dietPlansSummary.map(plan => (
                   <div key={plan.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                     <div>
                       <h3 className="font-medium text-gray-900">{plan.title}</h3>
                       <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                         plan.status === 'ACTIVE' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                       }`}>
                         {plan.status === 'ACTIVE' ? 'Activo' : 'Borrador'}
                       </span>
                     </div>
                     <button
                       onClick={() => navigate(`/patients/${patientId}/diet-plans/${plan.id}`)}
                       className="px-3 py-1 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors text-sm"
                     >
                       Ver Detalles
                     </button>
                   </div>
                 ))}
               </div>
             ) : (
               <p className="text-gray-500">No hay planes de dieta asignados.</p>
             )}
           </div>

           <div className="bg-white p-6 rounded-lg shadow col-span-full">
             <h2 className="text-xl font-semibold mb-4">Planes de Entrenamiento</h2>
             {patient.workoutPlansSummary && patient.workoutPlansSummary.length > 0 ? (
               <ul>
                 {patient.workoutPlansSummary.map(plan => (
                   <li key={plan.id}>- {plan.title} ({plan.status === 'ACTIVE' ? 'Activo' : 'Borrador'})</li>
                 ))}
               </ul>
             ) : (
               <p>No hay planes de entrenamiento asignados.</p>
             )}
           </div>

           <div className="bg-white p-6 rounded-lg shadow col-span-full">
             <h3 className="text-lg font-medium text-gray-900 mb-4 text-center">Acciones del Paciente</h3>
             <div className="flex flex-wrap justify-center gap-4">
               <button 
                 onClick={() => navigate(`/patients/${patientId}/edit`)}
                 className="bg-gray-600 text-white px-6 py-2.5 rounded-lg hover:bg-gray-700 transition-colors duration-200 shadow-sm"
               >
                 Editar Paciente
               </button>
               <button 
                 onClick={() => navigate(`/patients/${patientId}/biometric-records/new`)}
                 className="bg-slate-600 text-white px-6 py-2.5 rounded-lg hover:bg-slate-700 transition-colors duration-200 shadow-sm"
               >
                 Añadir Registro Biométrico
               </button>
               <button 
                 onClick={() => navigate(`/patients/${patientId}/biometric-records`)}
                 className="bg-blue-600 text-white px-6 py-2.5 rounded-lg hover:bg-blue-700 transition-colors duration-200 shadow-sm"
               >
                 Ver Historial Biométrico
               </button>
               <button 
                 onClick={() => navigate(`/patients/${patientId}/diet-plans/new`)}
                 className="bg-indigo-600 text-white px-6 py-2.5 rounded-lg hover:bg-indigo-700 transition-colors duration-200 shadow-sm"
               >
                 Crear Plan Dieta
               </button>
               
               {/* Botón Enviar Planes por Email - Solo se muestra si hay planes */}
               {patient.dietPlansSummary && patient.dietPlansSummary.length > 0 && (
                 <button 
                   onClick={() => setShowEmailModal(true)}
                   className={`px-6 py-2.5 rounded-lg transition-colors duration-200 flex items-center shadow-sm ${
                     patient.email 
                       ? 'bg-emerald-600 text-white hover:bg-emerald-700' 
                       : 'bg-amber-600 text-white hover:bg-amber-700'
                   }`}
                   title={!patient.email ? 'El paciente no tiene email registrado. Deberás introducir el email manualmente.' : 'Enviar planes al email del paciente'}
                 >
                   <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                   </svg>
                   {patient.email ? 'Enviar Planes por Email' : 'Enviar Planes (Sin Email)'}
                 </button>
               )}
             </div>
           </div>
        </div>
      )}

      {/* Modal de Envío de Email */}
      {patient && showEmailModal && (
        <SendEmailModal
          isOpen={showEmailModal}
          onClose={() => setShowEmailModal(false)}
          onSendSuccess={() => {
            setShowEmailModal(false);
          }}
          patientId={patientId!}
          patientName={`${patient.firstName} ${patient.lastName}`}
          patientEmail={patient.email || undefined}
          professionalName={user?.fullName}
          availablePlans={{
            dietPlans: patient.dietPlansSummary || [],
            workoutPlans: patient.workoutPlansSummary || [],
          }}
        />
      )}
    </div>
  );
};

export default PatientProfilePage; 