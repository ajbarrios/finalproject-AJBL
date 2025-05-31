import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../services/api'; // Asumiendo que tienes un servicio api configurado
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface BiometricRecord {
  id: number;
  patientId: number;
  recordDate: string; // Usaremos string ya que así viene del backend
  weight: number | null;
  bodyFatPercentage: number | null;
  musclePercentage: number | null;
  waterPercentage: number | null;
  backChestDiameter: number | null;
  waistDiameter: number | null;
  armsDiameter: number | null;
  legsDiameter: number | null;
  calvesDiameter: number | null;
  notes: string | null;
  createdAt: string; // Usaremos string ya que así viene del backend
}

interface FetchParams {
  startDate?: string;
  endDate?: string;
}

const PatientBiometricHistoryPage: React.FC = () => {
  const { patientId } = useParams<{ patientId: string }>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [biometricRecords, setBiometricRecords] = useState<BiometricRecord[]>([]);
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');

  useEffect(() => {
    const fetchRecords = async () => {
      setLoading(true);
      setError(null);
      try {
        if (!patientId) {
          setError('Patient ID is missing');
          setLoading(false);
          return;
        }

        const params: FetchParams = {};
        if (startDate) {
          params.startDate = startDate;
        }
        if (endDate) {
          params.endDate = endDate;
        }

        const response = await api.get(`/patients/${patientId}/biometric-records`, { params });

        // Ordenar por fecha ascendente para los gráficos y descendente para la tabla
        // Clonar el array para no mutar el estado directamente antes de ordenar
        const sortedRecordsAsc = [...response.data].sort((a: BiometricRecord, b: BiometricRecord) => new Date(a.recordDate).getTime() - new Date(b.recordDate).getTime());

        setBiometricRecords(sortedRecordsAsc);

      } catch (err: unknown) { // Tipar el error como unknown según recomendación del linter
        console.error('Error fetching biometric records:', err);
        // Intentar obtener un mensaje de error más específico si la estructura de error lo permite
        const errorMessage = (err instanceof Error) ? err.message : 'Error al cargar los registros biométricos.';
        setError(errorMessage);
        setBiometricRecords([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRecords();

  }, [patientId, startDate, endDate]); // Dependencia en patientId y fechas para re-fetch si cambian

  // Preparar datos para los gráficos (formatear fecha)
  const chartData = biometricRecords.map(record => ({
    ...record,
    record_date_formatted: new Date(record.recordDate).toLocaleDateString(), // Usar recordDate
  }));

  if (loading) {
    return <div className="text-center mt-8">Cargando historial biométrico...</div>;
  }

  if (error) {
    return <div className="text-center mt-8 text-red-500">Error: {error}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      {/* Botón Volver al Perfil - arriba */}
      <div className="mb-4">
        <Link 
          to={`/patients/${patientId}`}
          className="flex items-center text-indigo-600 hover:text-indigo-800"
        >
          &larr; Volver al Perfil del Paciente
        </Link>
      </div>

      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Evolución de Métricas Biométricas</h1>
        {/* Botón para añadir nuevo registro - con estilos consistentes */}
        <Link 
          to={`/patients/${patientId}/biometric-records/new`}
          className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 text-sm md:text-base"
        >
          + Añadir Registro
        </Link>
      </div>
      
      {/* Filtro de fechas */}
      <div className="mb-4 flex items-center space-x-4">
        <div>
          <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">Desde:</label>
          <input 
            type="date" 
            id="startDate" 
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>
        <div>
          <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">Hasta:</label>
          <input 
            type="date" 
            id="endDate" 
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>
      </div>

      {biometricRecords.length === 0 ? (
        <p className="text-center mt-8">Este paciente aún no tiene registros biométricos para el rango de fechas seleccionado.</p>
      ) : (
        <div className="mt-4">
          <h2 className="text-xl font-semibold mt-6 mb-3">Gráficos de Evolución</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart
              data={chartData}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="record_date_formatted" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="weight" stroke="#8884d8" name="Peso (kg)" activeDot={{ r: 8 }} />
              <Line type="monotone" dataKey="bodyFatPercentage" stroke="#82ca9d" name="% Grasa" /> {/* Usar bodyFatPercentage */}
              <Line type="monotone" dataKey="waistDiameter" stroke="#ffc658" name="Cintura (cm)" /> {/* Usar waistDiameter */}
              <Line type="monotone" dataKey="musclePercentage" stroke="#ff7300" name="% Músculo" /> {/* Mostrar musclePercentage */}
              <Line type="monotone" dataKey="waterPercentage" stroke="#387908" name="% Agua" /> {/* Mostrar waterPercentage */}
              <Line type="monotone" dataKey="backChestDiameter" stroke="#a4de6c" name="Espalda/Pecho (cm)" /> {/* Mostrar backChestDiameter */}
              <Line type="monotone" dataKey="armsDiameter" stroke="#d0ed57" name="Brazos (cm)" /> {/* Mostrar armsDiameter */}
              <Line type="monotone" dataKey="legsDiameter" stroke="#800080" name="Piernas (cm)" /> {/* Mostrar legsDiameter */}
              <Line type="monotone" dataKey="calvesDiameter" stroke="#00bfff" name="Gemelos (cm)" /> {/* Mostrar calvesDiameter */}
            </LineChart>
          </ResponsiveContainer>


          <h2 className="text-xl font-semibold mt-6 mb-3">Registros Detallados</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white rounded-lg shadow-lg overflow-hidden">
              <thead>
                <tr>
                  <th className="py-4 px-4 bg-indigo-600 text-white font-semibold text-sm uppercase tracking-wider text-center">Fecha</th>
                  <th className="py-4 px-4 bg-indigo-600 text-white font-semibold text-sm uppercase tracking-wider text-center">Peso (kg)</th>
                  <th className="py-4 px-4 bg-indigo-600 text-white font-semibold text-sm uppercase tracking-wider text-center">% Grasa</th>
                  <th className="py-4 px-4 bg-indigo-600 text-white font-semibold text-sm uppercase tracking-wider text-center">% Músculo</th>
                  <th className="py-4 px-4 bg-indigo-600 text-white font-semibold text-sm uppercase tracking-wider text-center">% Agua</th>
                  <th className="py-4 px-4 bg-indigo-600 text-white font-semibold text-sm uppercase tracking-wider text-center">Espalda/Pecho (cm)</th>
                  <th className="py-4 px-4 bg-indigo-600 text-white font-semibold text-sm uppercase tracking-wider text-center">Cintura (cm)</th>
                  <th className="py-4 px-4 bg-indigo-600 text-white font-semibold text-sm uppercase tracking-wider text-center">Brazos (cm)</th>
                  <th className="py-4 px-4 bg-indigo-600 text-white font-semibold text-sm uppercase tracking-wider text-center">Piernas (cm)</th>
                  <th className="py-4 px-4 bg-indigo-600 text-white font-semibold text-sm uppercase tracking-wider text-center">Gemelos (cm)</th>
                  <th className="py-4 px-4 bg-indigo-600 text-white font-semibold text-sm uppercase tracking-wider text-center">Notas</th>
                  {/* TODO: Añadir columna para acciones (editar/eliminar) */}
                </tr>
              </thead>
              <tbody>
                {/* Mostrar registros en orden descendente para la tabla */}
                {[...biometricRecords].sort((a: BiometricRecord, b: BiometricRecord) => new Date(b.recordDate).getTime() - new Date(a.recordDate).getTime()).map((record) => (
                  <tr key={record.id} className="even:bg-gray-100 hover:bg-gray-200 transition-colors duration-200">
                    <td className="py-3 px-4 text-center">
                      {/* Mostrar la fecha formateada */}
                      {new Date(record.recordDate).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4 text-center">{record.weight ?? '-'}</td>
                    <td className="py-3 px-4 text-center">{record.bodyFatPercentage ?? '-'}</td> {/* Usar bodyFatPercentage */}
                    <td className="py-3 px-4 text-center">{record.musclePercentage ?? '-'}</td> {/* Usar musclePercentage */}
                    <td className="py-3 px-4 text-center">{record.waterPercentage ?? '-'}</td> {/* Usar waterPercentage */}
                    <td className="py-3 px-4 text-center">{record.backChestDiameter ?? '-'}</td> {/* Usar backChestDiameter */}
                    <td className="py-3 px-4 text-center">{record.waistDiameter ?? '-'}</td> {/* Usar waistDiameter */}
                    <td className="py-3 px-4 text-center">{record.armsDiameter ?? '-'}</td> {/* Mostrar armsDiameter */}
                    <td className="py-3 px-4 text-center">{record.legsDiameter ?? '-'}</td> {/* Mostrar legsDiameter */}
                    <td className="py-3 px-4 text-center">{record.calvesDiameter ?? '-'}</td> {/* Mostrar calvesDiameter */}
                    <td className="py-3 px-4 text-center">{record.notes ?? '-'}</td>
                    {/* TODO: Añadir botones de editar/eliminar */}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default PatientBiometricHistoryPage; 