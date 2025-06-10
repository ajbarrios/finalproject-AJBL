import React, { useState } from 'react';
import { createPatient } from '../services/patientService'; // Importar la función de servicio
import { useNavigate } from 'react-router-dom';

const NewPatientPage: React.FC = () => {
  // Estado para los datos del paciente
  const [patientData, setPatientData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    birthDate: '',
    gender: '',
    height: '' as string | number,
    medicalNotes: '',
    dietRestrictions: '',
    objectives: '',
  });

  // Estado para los datos biométricos iniciales (opcional)
  const [initialBiometrics, setInitialBiometrics] = useState({
    weight: '' as string | number,
    bodyFatPercentage: '' as string | number,
    musclePercentage: '' as string | number,
  });

  // Estado para los errores de validación
  const [errors, setErrors] = useState<{
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string;
    birthDate?: string;
    gender?: string;
    height?: string;
    weight?: string;
    bodyFatPercentage?: string;
    musclePercentage?: string;
    general?: string; // Para errores generales del formulario o biométricos
  }>({});

  // Estado para manejar el estado de carga del envío
  const [isLoading, setIsLoading] = useState(false);
  // Estado para manejar errores generales de la API
  const [apiError, setApiError] = useState<string | null>(null);

  const navigate = useNavigate();

  // Manejador genérico para actualizar el estado de patientData
  const handlePatientDataChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    // Limpiar el error específico de este campo al cambiar
    if (errors[name as keyof typeof errors]) {
        setErrors(prevErrors => ({ ...prevErrors, [name]: undefined }));
    }
    setPatientData({
      ...patientData,
      [name]: value,
    });
  };

   // Manejador genérico para actualizar el estado de initialBiometrics
   const handleBiometricsChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
     const { name, value } = e.target;
     // Limpiar el error específico de este campo al cambiar
      if (errors[name as keyof typeof errors]) {
        setErrors(prevErrors => ({ ...prevErrors, [name]: undefined }));
      }
     // Convertir a número si es un campo numérico y el valor no está vacío
     const numValue = value === '' ? '' : parseFloat(value);
     setInitialBiometrics({
       ...initialBiometrics,
       [name]: numValue,
     });
   };

  // Función de validación del formulario
  const validateForm = () => {
    const newErrors: typeof errors = {};
    let isValid = true;

    // Validación de campos obligatorios
    if (!patientData.firstName.trim()) {
      newErrors.firstName = 'El campo Nombre es obligatorio';
      isValid = false;
    }
    if (!patientData.lastName.trim()) {
      newErrors.lastName = 'El campo Apellidos es obligatorio';
      isValid = false;
    }

    // Añadir validación para otros campos obligatorios percibidos
    if (!patientData.email.trim()) {
        newErrors.email = 'El campo Email es obligatorio';
        isValid = false;
    } else if (!/^\S+@\S+\.\S+$/.test(patientData.email)) { // Validar formato si no está vacío
        newErrors.email = 'El formato del correo electrónico no es válido.';
        isValid = false;
    }

    if (!patientData.birthDate) { // La fecha vacía es una cadena vacía
        newErrors.birthDate = 'El campo Fecha de Nacimiento es obligatorio';
        isValid = false;
    }

    if (!patientData.gender) { // El valor por defecto del select es una cadena vacía
        newErrors.gender = 'El campo Género es obligatorio';
        isValid = false;
    }

    // Validación de formato de teléfono (si está presente y no vacío)
    if (patientData.phone && !/^[\d+\s()-]+$/.test(patientData.phone)) {
        newErrors.phone = 'El formato del teléfono no es válido. Use solo dígitos, espacios, guiones, paréntesis o +.';
        isValid = false;
    }

    // Validación de campos numéricos biométricos (si están presentes)
    // Altura está en patientData, el resto en initialBiometrics
    if (patientData.height !== '' && patientData.height !== null && isNaN(Number(patientData.height))) {
        newErrors.height = 'La altura debe ser un número válido.';
        isValid = false;
    }
    if (initialBiometrics.weight !== '' && initialBiometrics.weight !== null && isNaN(Number(initialBiometrics.weight))) {
        newErrors.weight = 'El peso debe ser un número válido.';
        isValid = false;
    }
     if (initialBiometrics.bodyFatPercentage !== '' && initialBiometrics.bodyFatPercentage !== null && isNaN(Number(initialBiometrics.bodyFatPercentage))) {
        newErrors.bodyFatPercentage = '% Grasa debe ser un número válido.';
        isValid = false;
    }
     if (initialBiometrics.musclePercentage !== '' && initialBiometrics.musclePercentage !== null && isNaN(Number(initialBiometrics.musclePercentage))) {
        newErrors.musclePercentage = '% Masa Muscular debe ser un número válido.';
        isValid = false;
    }

    // Validación de que al menos un campo biométrico inicial tenga valor si se empieza a rellenar la sección
    // Consideramos que la sección se 'empieza a rellenar' si al menos uno de los campos tiene un valor distinto de '' o null.
    const biometricFields = [initialBiometrics.weight, initialBiometrics.bodyFatPercentage, initialBiometrics.musclePercentage];
    const isBiometricSectionTouched = biometricFields.some(field => field !== '' && field !== null);
    const hasBiometricData = biometricFields.some(field => field !== '' && field !== null && !isNaN(Number(field))); // Verifica que al menos uno es un número válido si se tocó

    if (isBiometricSectionTouched && !hasBiometricData && (!patientData.height || isNaN(Number(patientData.height)))) {
        // Esto es una validación simplificada. Podríamos refinarla.
        // Si se ha tocado algún campo biométrico o altura, asegurar que al menos una medida numérica válida está presente.
         const allBiometricFields = [patientData.height, ...biometricFields];
         const hasAnyValidBiometricInput = allBiometricFields.some(field => field !== '' && field !== null && !isNaN(Number(field)));

         if (!hasAnyValidBiometricInput) {
             newErrors.general = 'Si proporcionas datos biométricos, al menos Altura, Peso, % Grasa o % Masa Muscular debe ser un número válido.';
             isValid = false;
         }
    }

    setErrors(newErrors);
    // Limpiar error general de API al intentar validar de nuevo
    setApiError(null);
    return isValid;
  };

  // Manejador para el envío del formulario
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (validateForm()) {
      setIsLoading(true);
      setApiError(null); // Limpiar error previo de API

      try {
        // Combinar datos del paciente y biométricos para enviar al servicio
        const patientDataToSend = {
          ...patientData,
          // Convertir los campos numéricos de string | number a number | null si son números válidos, o null si están vacíos
          height: patientData.height !== '' ? Number(patientData.height) : null,
          // initialBiometrics solo se envía si al menos un campo biométrico (aparte de altura) tiene un valor válido
          initialBiometrics: (initialBiometrics.weight !== '' && initialBiometrics.weight !== null) || 
                             (initialBiometrics.bodyFatPercentage !== '' && initialBiometrics.bodyFatPercentage !== null) ||
                             (initialBiometrics.musclePercentage !== '' && initialBiometrics.musclePercentage !== null)
                              ? {
                                  ...initialBiometrics,
                                  weight: initialBiometrics.weight !== '' ? Number(initialBiometrics.weight) : null,
                                  bodyFatPercentage: initialBiometrics.bodyFatPercentage !== '' ? Number(initialBiometrics.bodyFatPercentage) : null,
                                  musclePercentage: initialBiometrics.musclePercentage !== '' ? Number(initialBiometrics.musclePercentage) : null,
                                  // Añadir otros campos biométricos si se incluyeron en el estado y formulario
                                }
                              : undefined, // No enviar el objeto initialBiometrics si está vacío
        };

        // Ajustar el tipo de birthDate si es una cadena vacía a null, o si es una fecha válida a Date
         const finalPatientDataToSend = {
             ...patientDataToSend,
             birthDate: patientDataToSend.birthDate ? new Date(patientDataToSend.birthDate) : null,
         };

        // Llamar al servicio para crear el paciente
        const newPatient = await createPatient(finalPatientDataToSend);

        console.log('Paciente registrado con éxito:', newPatient);
        // Mostrar mensaje de éxito (usar toastify si está configurado)
        // toast.success(`Paciente ${newPatient.firstName} ${newPatient.lastName} registrado correctamente.`);

        // Redirigir al dashboard de pacientes
        navigate('/dashboard'); // Asegúrate de tener la ruta correcta

      } catch (error) {
        console.error('Error al registrar paciente:', error);
        // Manejar errores específicos de la API si es necesario
        if (error instanceof Error) {
             // Si el error es una instancia de Error (incluyendo los lanzados desde el servicio)
             setApiError(error.message || 'Ocurrió un error al registrar el paciente.');
        } else {
             // Para errores desconocidos
            setApiError('Ocurrió un error desconocido.');
        }
         // TODO: Manejar errores 400 (errores de validación del backend) y mostrarlos junto a los campos
         // Esto requiere una estructura de respuesta de error 400 estándar del backend con campos específicos.

      } finally {
        setIsLoading(false);
      }
    } else {
      console.log('--- Dentro del bloque else de handleSubmit (validación fallida) ---'); // Debug log
      console.log('Formulario inválido. Errores:', errors);
       // Si hay un error general de validación (ej. biométricos), mostrarlo
       if(errors.general) {
           setApiError(errors.general);
       } else {
            // Limpiar error general si solo hay errores de campo específicos
            setApiError(null);
       }
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Botón Volver al Dashboard - con estilos consistentes */}
      <div className="mb-4">
        <button 
          onClick={() => navigate('/dashboard')}
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
          Volver al Dashboard
        </button>
      </div>

      <h1 className="text-2xl font-bold mb-6">Registrar Nuevo Paciente</h1>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Información Personal */}
        <section>
          <h2 className="text-xl font-semibold mb-4">Información Personal</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">Nombre *</label>
              <input 
                type="text" 
                name="firstName" 
                id="firstName" 
                value={patientData.firstName} 
                onChange={handlePatientDataChange} 
                className={`mt-1 block w-full px-3 py-2 border ${errors.firstName ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-600 focus:border-blue-600 sm:text-sm`}
              />
              {errors.firstName && <p className="mt-1 text-sm text-red-600" data-testid="error-firstName">{errors.firstName}</p>}
            </div>
            <div>
              <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">Apellidos *</label>
              <input 
                type="text" 
                name="lastName" 
                id="lastName" 
                value={patientData.lastName} 
                onChange={handlePatientDataChange} 
                className={`mt-1 block w-full px-3 py-2 border ${errors.lastName ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-600 focus:border-blue-600 sm:text-sm`}
              />
               {errors.lastName && <p className="mt-1 text-sm text-red-600" data-testid="error-lastName">{errors.lastName}</p>}
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
              <input 
                type="email" 
                name="email" 
                id="email" 
                value={patientData.email} 
                onChange={handlePatientDataChange} 
                className={`mt-1 block w-full px-3 py-2 border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-600 focus:border-blue-600 sm:text-sm`}
              />
              {errors.email && <p className="mt-1 text-sm text-red-600" data-testid="error-email">{errors.email}</p>}
            </div>
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Teléfono</label>
              <input 
                type="tel" // Cambiado a tel
                name="phone" 
                id="phone" 
                value={patientData.phone} 
                onChange={handlePatientDataChange} 
                className={`mt-1 block w-full px-3 py-2 border ${errors.phone ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-600 focus:border-blue-600 sm:text-sm`}
              />
               {errors.phone && <p className="mt-1 text-sm text-red-600" data-testid="error-phone">{errors.phone}</p>} {/* Añadido mensaje de error */}
            </div>
            <div>
              <label htmlFor="birthDate" className="block text-sm font-medium text-gray-700">Fecha de Nacimiento</label>
              <input 
                type="date" 
                name="birthDate" 
                id="birthDate" 
                value={patientData.birthDate} 
                onChange={handlePatientDataChange} 
                className={`mt-1 block w-full px-3 py-2 rounded-md border ${errors.birthDate ? 'border-red-500' : 'border-gray-300'} shadow-sm focus:border-blue-600 focus:ring-blue-600 sm:text-sm`}
              />
              {errors.birthDate && <p className="mt-1 text-sm text-red-600" data-testid="error-birthDate">{errors.birthDate}</p>}
            </div>
            <div>
              <label htmlFor="gender" className="block text-sm font-medium text-gray-700">Género</label>
              <select 
                name="gender" 
                id="gender" 
                value={patientData.gender} 
                onChange={handlePatientDataChange} 
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-600 focus:border-blue-600 sm:text-sm rounded-md"
              >
                <option value="">Seleccionar...</option>
                <option value="Masculino">Masculino</option>
                <option value="Femenino">Femenino</option>
                <option value="Otro">Otro</option>
                <option value="Prefiero no especificar">Prefiero no especificar</option>
              </select>
            </div>
          </div>
        </section>

        {/* Datos Biométricos Iniciales (Opcional) */}
        <section>
          <h2 className="text-xl font-semibold mb-4">Datos Biométricos Iniciales (Opcional)</h2>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="height" className="block text-sm font-medium text-gray-700">Altura (cm)</label>
              <input 
                type="number" 
                name="height" 
                id="height" 
                value={patientData.height} 
                onChange={handlePatientDataChange} 
                step="0.1"
                className={`mt-1 block w-full px-3 py-2 border ${errors.height ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-600 focus:border-blue-600 sm:text-sm`}
              />
            </div>
             <div>
              <label htmlFor="weight" className="block text-sm font-medium text-gray-700">Peso (kg)</label>
              <input 
                type="number" 
                name="weight" 
                id="weight" 
                value={initialBiometrics.weight} 
                onChange={handleBiometricsChange} 
                 step="0.1"
                className={`mt-1 block w-full px-3 py-2 border ${errors.weight ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-600 focus:border-blue-600 sm:text-sm`}
              />
            </div>
             <div>
              <label htmlFor="bodyFatPercentage" className="block text-sm font-medium text-gray-700">% Grasa Corporal</label>
              <input 
                type="number" 
                name="bodyFatPercentage" 
                id="bodyFatPercentage" 
                value={initialBiometrics.bodyFatPercentage} 
                onChange={handleBiometricsChange} 
                 step="0.1"
                className={`mt-1 block w-full px-3 py-2 border ${errors.bodyFatPercentage ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-600 focus:border-blue-600 sm:text-sm`}
              />
            </div>
             <div>
              <label htmlFor="musclePercentage" className="block text-sm font-medium text-gray-700">% Masa Muscular</label>
              <input 
                type="number" 
                name="musclePercentage" 
                id="musclePercentage" 
                value={initialBiometrics.musclePercentage} 
                onChange={handleBiometricsChange} 
                 step="0.1"
                className={`mt-1 block w-full px-3 py-2 border ${errors.musclePercentage ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-600 focus:border-blue-600 sm:text-sm`}
              />
            </div>
          </div>
        </section>

        {/* Información Adicional (Opcional) */}
         <section>
          <h2 className="text-xl font-semibold mb-4">Información Adicional (Opcional)</h2>
           <div className="space-y-4">
             <div>
              <label htmlFor="medicalNotes" className="block text-sm font-medium text-gray-700">Notas Médicas</label>
              <textarea 
                name="medicalNotes" 
                id="medicalNotes" 
                rows={3} 
                value={patientData.medicalNotes} 
                onChange={handlePatientDataChange} 
                className="mt-1 block w-full px-3 py-2 rounded-md border-gray-300 shadow-sm focus:border-blue-600 focus:ring-blue-600 sm:text-sm"
              ></textarea>
            </div>
             <div>
              <label htmlFor="dietRestrictions" className="block text-sm font-medium text-gray-700">Restricciones Alimentarias</label>
              <textarea 
                name="dietRestrictions" 
                id="dietRestrictions" 
                rows={3} 
                value={patientData.dietRestrictions} 
                onChange={handlePatientDataChange} 
                className="mt-1 block w-full px-3 py-2 rounded-md border-gray-300 shadow-sm focus:border-blue-600 focus:ring-blue-600 sm:text-sm"
              ></textarea>
            </div>
             <div>
              <label htmlFor="objectives" className="block text-sm font-medium text-gray-700">Objetivos del Paciente</label>
              <textarea 
                name="objectives" 
                id="objectives" 
                rows={3} 
                value={patientData.objectives} 
                onChange={handlePatientDataChange} 
                className="mt-1 block w-full px-3 py-2 rounded-md border-gray-300 shadow-sm focus:border-blue-600 focus:ring-blue-600 sm:text-sm"
              ></textarea>
            </div>
           </div>
         </section>

        <div className="flex justify-end">
          <button 
            type="submit" 
            data-testid="submit-button"
            className="group relative flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            disabled={isLoading}
          >
            {isLoading ? 'Registrando...' : 'Registrar Paciente'}
          </button>
        </div>
        {apiError && (
           <div className="mt-4 text-red-600 text-sm">
               {apiError}
           </div>
        )}
      </form>
    </div>
  );
};

export default NewPatientPage; 