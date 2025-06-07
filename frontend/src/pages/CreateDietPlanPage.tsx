import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { 
  PlanStatus, 
  PLAN_STATUS_LABELS,
  MealType,
  DayOfWeek,
  type DietMealCreation,
  type DietPlanCreation 
} from '../types/dietPlan';
import { dietPlanSchema, type DietPlanFormData } from '../schemas/dietPlanSchema';
import { createDietPlan } from '../services/dietPlanService';
import DateInput from '../components/common/DateInput';
import MealSection from '../components/diet/MealSection';
import Spinner from '../components/common/Spinner';

const CreateDietPlanPage: React.FC = () => {
  const { patientId } = useParams<{ patientId: string }>();
  const navigate = useNavigate();

  // Estado del formulario
  const [formData, setFormData] = useState<DietPlanFormData>({
    title: '',
    description: '',
    startDate: '',
    endDate: '',
    objectives: '',
    status: PlanStatus.ACTIVE,
    notes: '',
    meals: [{
      mealType: MealType.BREAKFAST,
      content: '',
      dayOfWeek: DayOfWeek.MONDAY
    }]
  });

  // Estado de la UI
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [mealErrors, setMealErrors] = useState<Array<{
    mealType?: string;
    content?: string;
    dayOfWeek?: string;
  }>>([]);

  // Manejar cambios en campos simples
  const handleInputChange = (field: keyof Omit<DietPlanFormData, 'meals'>, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Limpiar error específico cuando el usuario empieza a escribir
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  // Manejar cambios en las comidas
  const handleMealsChange = (meals: DietMealCreation[]) => {
    setFormData(prev => ({
      ...prev,
      meals
    }));

    // Limpiar errores cuando se modifican
    setErrors({});
    setMealErrors([]);
  };

  // Validar formulario
  const validateForm = (): boolean => {
    try {
      dietPlanSchema.parse(formData);
      setErrors({});
      setMealErrors([]);
      return true;
    } catch (error: unknown) {
      const fieldErrors: Record<string, string> = {};
      const newMealErrors: Array<{
        mealType?: string;
        content?: string;
        dayOfWeek?: string;
      }> = [];

      if (error && typeof error === 'object' && 'errors' in error) {
        const zodError = error as { errors: { path: (string | number)[]; message: string }[] };
        zodError.errors.forEach((err) => {
          if (err.path[0] === 'meals' && typeof err.path[1] === 'number') {
            const mealIndex = err.path[1];
            const mealField = err.path[2] as string;
            
            if (!newMealErrors[mealIndex]) {
              newMealErrors[mealIndex] = {};
            }
            newMealErrors[mealIndex][mealField as keyof typeof newMealErrors[0]] = err.message;
          } else {
            fieldErrors[err.path.join('.')] = err.message;
          }
        });
      }

      setErrors(fieldErrors);
      setMealErrors(newMealErrors);
      return false;
    }
  };

  // Manejar envío del formulario
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!patientId) {
      toast.error('ID de paciente no válido');
      return;
    }

    if (!validateForm()) {
      toast.error('Por favor corrige los errores en el formulario');
      return;
    }

    setIsSubmitting(true);

    try {
      // Preparar datos para enviar al backend
      const planData: DietPlanCreation = {
        ...formData,
        // Convertir strings vacíos a undefined para campos opcionales
        description: formData.description || undefined,
        startDate: formData.startDate || undefined,
        endDate: formData.endDate || undefined,
        objectives: formData.objectives || undefined,
        notes: formData.notes || undefined
      };

      await createDietPlan(patientId, planData);
      
      toast.success('Plan de dieta creado exitosamente');
      navigate(`/patients/${patientId}`);
    } catch (error: unknown) {
      console.error('Error creating diet plan:', error);
      
      // Manejar errores específicos del backend
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as { response: { status: number } };
        if (axiosError.response?.status === 400) {
          toast.error('Error de validación. Revisa los datos ingresados.');
        } else if (axiosError.response?.status === 404) {
          toast.error('Paciente no encontrado');
        } else if (axiosError.response?.status === 403) {
          toast.error('No tienes permisos para crear planes para este paciente');
        } else {
          toast.error('Error al crear el plan de dieta. Inténtalo de nuevo.');
        }
      } else {
        toast.error('Error al crear el plan de dieta. Inténtalo de nuevo.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Manejar cancelación
  const handleCancel = () => {
    navigate(`/patients/${patientId}`);
  };

  if (!patientId) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold text-gray-900">Error</h1>
        <p className="text-gray-600 mt-2">ID de paciente no válido</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Crear Plan de Dieta</h1>
        <p className="mt-2 text-gray-600">
          Crea un nuevo plan de dieta personalizado para tu paciente.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Información General del Plan */}
        <div className="bg-white shadow-sm rounded-lg p-6 border">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Información General</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Título */}
            <div className="md:col-span-2">
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                Título del Plan
                <span className="text-red-500 ml-1">*</span>
              </label>
              <input
                type="text"
                id="title"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                placeholder="Ej: Plan de Pérdida de Grasa - Semana 1"
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                  errors.title ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.title && (
                <p className="text-sm text-red-600 mt-1">{errors.title}</p>
              )}
            </div>

            {/* Descripción */}
            <div className="md:col-span-2">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Descripción
              </label>
              <textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Descripción general del plan de dieta..."
                rows={3}
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-vertical ${
                  errors.description ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.description && (
                <p className="text-sm text-red-600 mt-1">{errors.description}</p>
              )}
            </div>

            {/* Fechas */}
            <DateInput
              id="startDate"
              label="Fecha de Inicio"
              value={formData.startDate}
              onChange={(value) => handleInputChange('startDate', value)}
              error={errors.startDate}
            />

            <DateInput
              id="endDate"
              label="Fecha de Fin"
              value={formData.endDate}
              onChange={(value) => handleInputChange('endDate', value)}
              error={errors.endDate}
            />

            {/* Estado */}
            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                Estado
              </label>
              <select
                id="status"
                value={formData.status}
                onChange={(e) => handleInputChange('status', e.target.value as PlanStatus)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                {Object.entries(PLAN_STATUS_LABELS).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </div>

            {/* Objetivos */}
            <div className="md:col-span-2">
              <label htmlFor="objectives" className="block text-sm font-medium text-gray-700 mb-1">
                Objetivos
              </label>
              <textarea
                id="objectives"
                value={formData.objectives}
                onChange={(e) => handleInputChange('objectives', e.target.value)}
                placeholder="Objetivos específicos del plan..."
                rows={2}
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-vertical ${
                  errors.objectives ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.objectives && (
                <p className="text-sm text-red-600 mt-1">{errors.objectives}</p>
              )}
            </div>

            {/* Notas */}
            <div className="md:col-span-2">
              <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
                Notas Adicionales
              </label>
              <textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => handleInputChange('notes', e.target.value)}
                placeholder="Notas adicionales, recomendaciones especiales..."
                rows={3}
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-vertical ${
                  errors.notes ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.notes && (
                <p className="text-sm text-red-600 mt-1">{errors.notes}</p>
              )}
            </div>
          </div>
        </div>

        {/* Sección de Comidas */}
                 <div className="bg-white shadow-sm rounded-lg p-6 border">
           <MealSection
             meals={formData.meals}
             onMealsChange={handleMealsChange}
             errors={mealErrors}
           />
         </div>

        {/* Botones de Acción */}
        <div className="flex items-center justify-end space-x-4 pt-6 border-t">
          <button
            type="button"
            onClick={handleCancel}
            disabled={isSubmitting}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <Spinner />
                <span className="ml-2">Creando Plan...</span>
              </>
            ) : (
              'Crear Plan de Dieta'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateDietPlanPage; 