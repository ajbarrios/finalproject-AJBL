import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import type { Patient, UpdatePatientData } from '../types/patient';
import { fetchPatientById, updatePatient } from '../services/patientService';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'react-hot-toast';

// Esquema de validación con Zod para la actualización del paciente
const updatePatientSchema = z.object({
  firstName: z.string().min(1, "El nombre es obligatorio").optional(),
  lastName: z.string().min(1, "El apellido es obligatorio").optional(),
  email: z.string().email("Formato de email inválido").or(z.literal('')).nullable().optional(),
  phone: z.string().optional().nullable(),
  birthDate: z.string().optional().nullable(), // Podríamos añadir validación de formato de fecha si es necesario
  gender: z.string().optional().nullable(),
  height: z.number().nullable().optional(),
  medicalNotes: z.string().optional().nullable(),
  dietRestrictions: z.string().optional().nullable(),
  objectives: z.string().optional().nullable(),
});

type UpdateFormInputs = z.infer<typeof updatePatientSchema>;

const PatientEditPage: React.FC = () => {
  const { patientId } = useParams<{ patientId: string }>();
  const navigate = useNavigate();
  const [patient, setPatient] = useState<Patient | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const { register, handleSubmit, formState: { errors }, reset } = useForm<UpdateFormInputs>({
    resolver: zodResolver(updatePatientSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      birthDate: '',
      gender: '',
      height: undefined,
      medicalNotes: '',
      dietRestrictions: '',
      objectives: '',
    }
  });

  useEffect(() => {
    const loadPatient = async () => {
      if (!patientId) {
        setError('ID de paciente no proporcionado.');
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        const data = await fetchPatientById(patientId);
        setPatient(data);
        setError(null);

        // Pre-populate form with fetched data
        reset({
          firstName: data.firstName || '',
          lastName: data.lastName || '',
          email: data.email || '',
          phone: data.phone || '',
          // Convertir Date a string en formato YYYY-MM-DD para el input type="date"
          birthDate: data.birthDate ? new Date(data.birthDate).toISOString().split('T')[0] : '',
          gender: data.gender || '',
          // Asegurarse de que height sea number o undefined para el default value
          height: data.height !== null && data.height !== undefined ? data.height : undefined,
          medicalNotes: data.medicalNotes || '',
          dietRestrictions: data.dietRestrictions || '',
          objectives: data.objectives || '',
        });

      } catch (err) {
        console.error('Error loading patient:', err);
        setError('No se pudo cargar la información del paciente.');
        setPatient(null);
      } finally {
        setLoading(false);
      }
    };

    loadPatient();
  }, [patientId, reset]);

  const onSubmit: SubmitHandler<UpdateFormInputs> = async (data) => {
    if (!patientId) return;

    // Convertir height a number | null si es string (a veces los inputs number devuelven string)
    const dataWithCorrectTypes = { ...data, height: data.height ? Number(data.height) : (data.height === null ? null : undefined) };

    try {
      setIsSubmitting(true);
      setSubmitError(null);
      // Filtrar campos vacíos, null o undefined para no sobrescribir con valores vacíos innecesariamente
      const filteredData: Partial<UpdatePatientData> = Object.fromEntries(
        Object.entries(dataWithCorrectTypes).filter(([, value]) => value !== '' && value !== null && value !== undefined)
      );
      
      // Si un campo es opcional en el backend (nullable) y el usuario lo vacía en el formulario (string vacío),
      // debemos enviarlo como null explícitamente si queremos que se borre en la BD.
      // Si Zod permite string vacío y el backend espera null, hay que mapearlo.
      // Basado en el esquema de Zod y el tipo UpdatePatientData:
      // email, phone, birthDate, gender, height, medicalNotes, dietRestrictions, objectives son nullable.

       const dataToSend: UpdatePatientData = { ...filteredData as UpdatePatientData }; // Empezar con los campos no vacíos/null/undefined

       // Campos que pueden ser vaciados a null
       if ('email' in data && data.email === '') dataToSend.email = null;
       if ('phone' in data && data.phone === '') dataToSend.phone = null;
       if ('birthDate' in data && data.birthDate === '') dataToSend.birthDate = null;
       if ('gender' in data && data.gender === '') dataToSend.gender = null;
       // height ya se maneja como number | null | undefined arriba
       if ('medicalNotes' in data && data.medicalNotes === '') dataToSend.medicalNotes = null;
       if ('dietRestrictions' in data && data.dietRestrictions === '') dataToSend.dietRestrictions = null;
       if ('objectives' in data && data.objectives === '') dataToSend.objectives = null;


      await updatePatient(patientId, dataToSend);

      toast.success('Paciente actualizado con éxito!');

      setTimeout(() => {
        navigate(`/patients/${patientId}`);
      }, 1500);

    } catch (err) {
      console.error('Error updating patient:', err);
      toast.error('Error al actualizar el paciente. Inténtalo de nuevo.');
      // TODO: Manejar errores específicos del backend (ej. 400) y mostrar mensajes de error de campo
      setSubmitError('Hubo un problema al guardar los cambios.'); 

    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Editar Paciente</h1>
        <p>Cargando datos del paciente...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Editar Paciente</h1>
        <p className="text-red-500">Error: {error}</p>
      </div>
    );
  }

  if (!patient) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Editar Paciente</h1>
        <p>Paciente no encontrado.</p>
      </div>
    );
  }

  // Clases de estilo comunes inspiradas en NewPatientPage.tsx
  const labelClass = "block text-sm font-medium text-gray-700";
  const inputClass = (hasError: boolean) => 
    `mt-1 block w-full px-3 py-2 border ${hasError ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-600 focus:border-blue-600 sm:text-sm`;
  const sectionClass = "space-y-6"; // Espacio entre secciones principales
  const fieldGridClass = "grid grid-cols-1 md:grid-cols-2 gap-4"; // Grid para campos
  const sectionTitleClass = "text-xl font-semibold mb-4"; // Título de sección
  const errorTextClass = "mt-1 text-sm text-red-600"; // Estilo para mensajes de error

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Editar Paciente</h1>

      <form onSubmit={handleSubmit(onSubmit)} className={sectionClass}> {/* Usar clase de sección principal */}

        {submitError && <p className={errorTextClass}>{submitError}</p>}

        {/* Sección de Información Personal */}
        <section> {/* Usar etiqueta section */}
          <h2 className={sectionTitleClass}>Información Personal</h2>
          <div className={fieldGridClass}> {/* Usar grid para campos */}
            <div>
              <label htmlFor="firstName" className={labelClass}>Nombre</label>
              <input
                id="firstName"
                type="text"
                {...register('firstName')}
                className={inputClass(!!errors.firstName)}
              />
              {errors.firstName && <p className={errorTextClass}>{errors.firstName.message}</p>}
            </div>
            <div>
              <label htmlFor="lastName" className={labelClass}>Apellido</label>
              <input
                id="lastName"
                type="text"
                {...register('lastName')}
                className={inputClass(!!errors.lastName)}
              />
              {errors.lastName && <p className={errorTextClass}>{errors.lastName.message}</p>}
            </div>
            <div>
              <label htmlFor="email" className={labelClass}>Email</label>
              <input
                id="email"
                type="email"
                {...register('email')}
                className={inputClass(!!errors.email)}
              />
              {errors.email && <p className={errorTextClass}>{errors.email.message}</p>}
            </div>
            <div>
              <label htmlFor="phone" className={labelClass}>Teléfono</label>
              <input
                id="phone"
                type="text"
                {...register('phone')}
                className={inputClass(!!errors.phone)}
              />
              {errors.phone && <p className={errorTextClass}>{errors.phone.message}</p>}
            </div>
            <div>
              <label htmlFor="birthDate" className={labelClass}>Fecha de Nacimiento</label>
              <input
                id="birthDate"
                type="date"
                {...register('birthDate')}
                className={inputClass(!!errors.birthDate)}
              />
              {errors.birthDate && <p className={errorTextClass}>{errors.birthDate.message}</p>}
            </div>
             <div>
              <label htmlFor="gender" className={labelClass}>Género</label>
              {/* Campo Género como Select, basado en NewPatientPage.tsx */}
              <select
                id="gender"
                {...register('gender')}
                className={inputClass(!!errors.gender)}
              >
                <option value="">Seleccionar...</option>
                <option value="Masculino">Masculino</option>
                <option value="Femenino">Femenino</option>
                <option value="Otro">Otro</option>
                <option value="Prefiero no especificar">Prefiero no especificar</option>
              </select>
              {errors.gender && <p className={errorTextClass}>{errors.gender.message}</p>}
            </div>
          </div>
        </section>

        {/* Sección de Datos Físicos */}
         <section> {/* Usar etiqueta section */}
          <h2 className={sectionTitleClass}>Datos Físicos</h2>
           <div className={fieldGridClass}> {/* Usar grid para campos */}
            <div>
              <label htmlFor="height" className={labelClass}>Altura (cm)</label>
              <input
                id="height"
                type="number"
                 step="0.01"
                {...register('height', { valueAsNumber: true })}
                className={inputClass(!!errors.height)}
              />
              {errors.height && <p className={errorTextClass}>{errors.height.message}</p>}
            </div>
         </div>
         </section>

        {/* Sección de Información Adicional */}
         <section> {/* Usar etiqueta section */}
          <h2 className={sectionTitleClass}>Información Adicional</h2>
           <div className="space-y-4"> {/* Estos campos usan espacio vertical en lugar de grid */}
             <div>
              <label htmlFor="medicalNotes" className={labelClass}>Notas Médicas</label>
              <textarea
                id="medicalNotes"
                {...register('medicalNotes')}
                rows={3}
                className={inputClass(!!errors.medicalNotes)}
              ></textarea>
              {errors.medicalNotes && <p className={errorTextClass}>{errors.medicalNotes.message}</p>}
            </div>
            <div>
              <label htmlFor="dietRestrictions" className={labelClass}>Restricciones Alimentarias</label>
               <textarea
                id="dietRestrictions"
                {...register('dietRestrictions')}
                rows={3}
                className={inputClass(!!errors.dietRestrictions)}
              ></textarea>
              {errors.dietRestrictions && <p className={errorTextClass}>{errors.dietRestrictions.message}</p>}
            </div>
            <div>
              <label htmlFor="objectives" className={labelClass}>Objetivos</label>
               <textarea
                id="objectives"
                {...register('objectives')}
                rows={3}
                className={inputClass(!!errors.objectives)}
              ></textarea>
              {errors.objectives && <p className={errorTextClass}>{errors.objectives.message}</p>}
            </div>
         </div>
         </section>

        {/* Botones de Acción */}
        <div className="flex justify-end mt-6"> {/* Añadir margen superior */}
          <button
            type="button"
            onClick={() => navigate(`/patients/${patientId}`)}
            className="rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="ml-3 rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
          >
            {isSubmitting ? 'Guardando...' : 'Guardar Cambios'}
          </button>
        </div>

      </form>
      
    </div>
  );
};

export default PatientEditPage; 