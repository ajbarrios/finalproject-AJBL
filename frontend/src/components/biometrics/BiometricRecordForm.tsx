import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import type { SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { biometricRecordSchema } from '../../schemas/biometricSchema';
import { BIOMETRIC_UNITS, type BiometricRecordCreation } from '../../types/biometrics';
import { createBiometricRecord } from '../../services/biometricService';
import toast from 'react-hot-toast';

interface BiometricRecordFormProps {
  patientId: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

// Helper para extraer mensaje de error de cualquier tipo de error de react-hook-form
const getErrorMessage = (error: unknown): string => {
  if (!error) return '';
  // Intentar acceder a .message o a la propiedad raíz si es un objeto de errores anidado
  if (typeof error === 'object' && error !== null) {
    // Comprobar si es un FieldError o similar con propiedad message
    if ('message' in error && typeof error.message === 'string') {
      return error.message;
    }
    // Si es un objeto de errores anidado (como errors.root para refines)
    // se podría necesitar una lógica más compleja, pero para un mensaje simple,
    // a veces la propiedad message está directamente o en un campo conocido.
    // Para simplificar, si no tiene message, intentamos convertir el objeto a string.
    return String(error);
  }
  return String(error);
};

const BiometricRecordForm: React.FC<BiometricRecordFormProps> = ({ 
  patientId, 
  onSuccess, 
  onCancel 
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Obtener la fecha actual en formato YYYY-MM-DD para el valor por defecto
  const today = new Date().toISOString().split('T')[0];
  
  const { 
    register, 
    handleSubmit, 
    formState: { errors },
    reset
  } = useForm<BiometricRecordCreation>({
    resolver: zodResolver(biometricRecordSchema),
    defaultValues: {
      recordDate: today,
      // Establecer valores por defecto para los campos numéricos como null o undefined
      weight: null,
      bodyFatPercentage: null,
      musclePercentage: null,
      waterPercentage: null,
      backChestDiameter: null,
      waistDiameter: null,
      armsDiameter: null,
      legsDiameter: null,
      calvesDiameter: null,
      notes: null,
    }
  });

  const onSubmit: SubmitHandler<BiometricRecordCreation> = async (data) => {
    setIsSubmitting(true);
    try {
      // Los datos ya coinciden con BiometricRecordCreation debido al tipado de useForm y el resolver
      await createBiometricRecord(patientId, data);
      toast.success('Registro biométrico guardado correctamente');
      reset();
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error('Error al guardar el registro biométrico:', error);
      // Se asume que el error es de tipo Error para mostrar un mensaje genérico
      toast.error('Error al guardar el registro biométrico: ' + (error as Error).message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Nuevo Registro Biométrico</h2>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Sección: Fecha de medición */}
        <div className="mb-4">
          <label htmlFor="recordDate" className="block text-sm font-medium text-gray-700 mb-1">
            Fecha de medición <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            id="recordDate"
            className={`w-full px-3 py-2 border rounded-md ${errors.recordDate ? 'border-red-500' : 'border-gray-300'}`}
            {...register('recordDate')}
          />
          {errors.recordDate && (
            <p className="mt-1 text-sm text-red-600">{getErrorMessage(errors.recordDate)}</p>
          )}
        </div>
        
        {/* Sección: Composición Corporal */}
        <div className="border-t border-gray-200 pt-4">
          <h3 className="text-lg font-medium text-gray-800 mb-4">Composición Corporal</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Peso */}
            <div>
              <label htmlFor="weight" className="block text-sm font-medium text-gray-700 mb-1">
                Peso ({BIOMETRIC_UNITS.weight})
              </label>
              <input
                type="number"
                step="0.1"
                id="weight"
                className={`w-full px-3 py-2 border rounded-md ${errors.weight ? 'border-red-500' : 'border-gray-300'}`}
                {...register('weight', { valueAsNumber: true })}
              />
              {errors.weight && (
                <p className="mt-1 text-sm text-red-600">{getErrorMessage(errors.weight)}</p>
              )}
            </div>
            
            {/* % Grasa Corporal */}
            <div>
              <label htmlFor="bodyFatPercentage" className="block text-sm font-medium text-gray-700 mb-1">
                % Grasa Corporal ({BIOMETRIC_UNITS.bodyFatPercentage})
              </label>
              <input
                type="number"
                step="0.1"
                id="bodyFatPercentage"
                className={`w-full px-3 py-2 border rounded-md ${errors.bodyFatPercentage ? 'border-red-500' : 'border-gray-300'}`}
                {...register('bodyFatPercentage', { valueAsNumber: true })}
              />
              {errors.bodyFatPercentage && (
                <p className="mt-1 text-sm text-red-600">{getErrorMessage(errors.bodyFatPercentage)}</p>
              )}
            </div>
            
            {/* % Masa Muscular */}
            <div>
              <label htmlFor="musclePercentage" className="block text-sm font-medium text-gray-700 mb-1">
                % Masa Muscular ({BIOMETRIC_UNITS.musclePercentage})
              </label>
              <input
                type="number"
                step="0.1"
                id="musclePercentage"
                className={`w-full px-3 py-2 border rounded-md ${errors.musclePercentage ? 'border-red-500' : 'border-gray-300'}`}
                {...register('musclePercentage', { valueAsNumber: true })}
              />
              {errors.musclePercentage && (
                <p className="mt-1 text-sm text-red-600">{getErrorMessage(errors.musclePercentage)}</p>
              )}
            </div>
            
            {/* % Agua */}
            <div>
              <label htmlFor="waterPercentage" className="block text-sm font-medium text-gray-700 mb-1">
                % Agua ({BIOMETRIC_UNITS.waterPercentage})
              </label>
              <input
                type="number"
                step="0.1"
                id="waterPercentage"
                className={`w-full px-3 py-2 border rounded-md ${errors.waterPercentage ? 'border-red-500' : 'border-gray-300'}`}
                {...register('waterPercentage', { valueAsNumber: true })}
              />
              {errors.waterPercentage && (
                <p className="mt-1 text-sm text-red-600">{getErrorMessage(errors.waterPercentage)}</p>
              )}
            </div>
          </div>
        </div>
        
        {/* Sección: Perímetros Corporales */}
        <div className="border-t border-gray-200 pt-4">
          <h3 className="text-lg font-medium text-gray-800 mb-4">Perímetros Corporales</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Espalda/Pecho */}
            <div>
              <label htmlFor="backChestDiameter" className="block text-sm font-medium text-gray-700 mb-1">
                Espalda/Pecho ({BIOMETRIC_UNITS.backChestDiameter})
              </label>
              <input
                type="number"
                step="0.1"
                id="backChestDiameter"
                className={`w-full px-3 py-2 border rounded-md ${errors.backChestDiameter ? 'border-red-500' : 'border-gray-300'}`}
                {...register('backChestDiameter', { valueAsNumber: true })}
              />
              {errors.backChestDiameter && (
                <p className="mt-1 text-sm text-red-600">{getErrorMessage(errors.backChestDiameter)}</p>
              )}
            </div>
            
            {/* Cintura */}
            <div>
              <label htmlFor="waistDiameter" className="block text-sm font-medium text-gray-700 mb-1">
                Cintura ({BIOMETRIC_UNITS.waistDiameter})
              </label>
              <input
                type="number"
                step="0.1"
                id="waistDiameter"
                className={`w-full px-3 py-2 border rounded-md ${errors.waistDiameter ? 'border-red-500' : 'border-gray-300'}`}
                {...register('waistDiameter', { valueAsNumber: true })}
              />
              {errors.waistDiameter && (
                <p className="mt-1 text-sm text-red-600">{getErrorMessage(errors.waistDiameter)}</p>
              )}
            </div>
            
            {/* Brazos */}
            <div>
              <label htmlFor="armsDiameter" className="block text-sm font-medium text-gray-700 mb-1">
                Brazos ({BIOMETRIC_UNITS.armsDiameter})
              </label>
              <input
                type="number"
                step="0.1"
                id="armsDiameter"
                className={`w-full px-3 py-2 border rounded-md ${errors.armsDiameter ? 'border-red-500' : 'border-gray-300'}`}
                {...register('armsDiameter', { valueAsNumber: true })}
              />
              {errors.armsDiameter && (
                <p className="mt-1 text-sm text-red-600">{getErrorMessage(errors.armsDiameter)}</p>
              )}
            </div>
            
            {/* Piernas */}
            <div>
              <label htmlFor="legsDiameter" className="block text-sm font-medium text-gray-700 mb-1">
                Piernas ({BIOMETRIC_UNITS.legsDiameter})
              </label>
              <input
                type="number"
                step="0.1"
                id="legsDiameter"
                className={`w-full px-3 py-2 border rounded-md ${errors.legsDiameter ? 'border-red-500' : 'border-gray-300'}`}
                {...register('legsDiameter', { valueAsNumber: true })}
              />
              {errors.legsDiameter && (
                <p className="mt-1 text-sm text-red-600">{getErrorMessage(errors.legsDiameter)}</p>
              )}
            </div>
            
            {/* Gemelos */}
            <div>
              <label htmlFor="calvesDiameter" className="block text-sm font-medium text-gray-700 mb-1">
                Gemelos ({BIOMETRIC_UNITS.calvesDiameter})
              </label>
              <input
                type="number"
                step="0.1"
                id="calvesDiameter"
                className={`w-full px-3 py-2 border rounded-md ${errors.calvesDiameter ? 'border-red-500' : 'border-gray-300'}`}
                {...register('calvesDiameter', { valueAsNumber: true })}
              />
              {errors.calvesDiameter && (
                <p className="mt-1 text-sm text-red-600">{getErrorMessage(errors.calvesDiameter)}</p>
              )}
            </div>
          </div>
        </div>
        
        {/* Sección: Observaciones */}
        <div className="border-t border-gray-200 pt-4">
          <h3 className="text-lg font-medium text-gray-800 mb-4">Observaciones</h3>
          
          <div>
            <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
              Notas adicionales
            </label>
            <textarea
              id="notes"
              rows={3}
              className={`w-full px-3 py-2 border rounded-md ${errors.notes ? 'border-red-500' : 'border-gray-300'}`}
              {...register('notes')}
            ></textarea>
            {errors.notes && (
              <p className="mt-1 text-sm text-red-600">{getErrorMessage(errors.notes)}</p>
            )}
          </div>
        </div>
        
        {/* Mensajes de error generales */}
        {errors.root && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-red-600">{getErrorMessage(errors.root)}</p>
          </div>
        )}
        
        {/* Botones */}
        <div className="flex justify-end space-x-3 border-t border-gray-200 pt-4">
          <button
            type="button"
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700 disabled:opacity-50"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Guardando...' : 'Guardar Registro'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default BiometricRecordForm; 