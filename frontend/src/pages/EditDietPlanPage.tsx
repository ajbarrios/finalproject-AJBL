import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { 
  PlanStatus, 
  PLAN_STATUS_LABELS,
  MealType,
  DayOfWeek,
  type DietMealCreation,
  type DietPlanCreation,
  type DietMeal
} from '../types/dietPlan';
import { dietPlanSchema, type DietPlanFormData } from '../schemas/dietPlanSchema';
import { getDietPlan, updateDietPlan } from '../services/dietPlanService';
import DateInput from '../components/common/DateInput';
import MealSection from '../components/diet/MealSection';
import Spinner from '../components/common/Spinner';

// Tipo extendido para manejar comidas con ID (existentes) y sin ID (nuevas)
interface EditableDietMeal extends DietMealCreation {
  id?: string; // Opcional - presente si es una comida existente
}

interface EditDietPlanFormData extends Omit<DietPlanFormData, 'meals'> {
  meals: EditableDietMeal[];
}



const EditDietPlanPage: React.FC = () => {
  const { patientId, dietPlanId } = useParams<{ patientId: string; dietPlanId: string }>();
  const navigate = useNavigate();

  // Estado del formulario
  const [formData, setFormData] = useState<EditDietPlanFormData>({
    title: '',
    description: '',
    startDate: '',
    endDate: '',
    objectives: '',
    status: PlanStatus.ACTIVE,
    notes: '',
    meals: []
  });

  // Estado de la UI
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [mealErrors, setMealErrors] = useState<Array<{
    mealType?: string;
    content?: string;
    dayOfWeek?: string;
  }>>([]);
  const [hasChanges, setHasChanges] = useState(false);
  const [originalData, setOriginalData] = useState<EditDietPlanFormData | null>(null);

  // Cargar datos del plan existente
  useEffect(() => {
    const fetchDietPlanData = async () => {
      if (!dietPlanId) {
        toast.error('ID del plan de dieta no válido');
        navigate(`/patients/${patientId}`);
        return;
      }

      try {
        setIsLoading(true);
        const plan = await getDietPlan(dietPlanId);
        
        // Convertir los datos del plan al formato del formulario
        const formattedData: EditDietPlanFormData = {
          title: plan.title,
          description: plan.description || '',
          startDate: plan.startDate ? new Date(plan.startDate).toISOString().split('T')[0] : '',
          endDate: plan.endDate ? new Date(plan.endDate).toISOString().split('T')[0] : '',
          objectives: plan.objectives || '',
          status: plan.status,
          notes: plan.notes || '',
          meals: plan.meals.map((meal: DietMeal) => ({
            id: meal.id,
            mealType: meal.mealType,
            content: meal.content,
            dayOfWeek: meal.dayOfWeek
          }))
        };

        setFormData(formattedData);
        setOriginalData(JSON.parse(JSON.stringify(formattedData))); // Deep copy para comparación
      } catch (error) {
        console.error('Error fetching diet plan:', error);
        
        if (error && typeof error === 'object' && 'response' in error) {
          const axiosErr = error as { response?: { status?: number } };
          if (axiosErr.response?.status === 404) {
            toast.error('Plan de dieta no encontrado');
          } else if (axiosErr.response?.status === 403) {
            toast.error('No tienes permisos para editar este plan de dieta');
          } else {
            toast.error('Error al cargar el plan de dieta');
          }
        } else {
          toast.error('Error al cargar el plan de dieta');
        }
        
        navigate(`/patients/${patientId}`);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDietPlanData();
  }, [dietPlanId, patientId, navigate]);

  // Detectar cambios en el formulario
  useEffect(() => {
    if (originalData) {
      const hasFormChanges = JSON.stringify(formData) !== JSON.stringify(originalData);
      setHasChanges(hasFormChanges);
    }
  }, [formData, originalData]);

  // Manejar cambios en campos simples
  const handleInputChange = (field: keyof Omit<EditDietPlanFormData, 'meals'>, value: string) => {
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
    // Mantener los IDs de las comidas existentes al actualizar
    const updatedMeals: EditableDietMeal[] = meals.map((meal, index) => {
      const existingMeal = formData.meals[index];
      return {
        ...meal,
        id: existingMeal?.id // Mantener ID si existe
      };
    });

    setFormData(prev => ({
      ...prev,
      meals: updatedMeals
    }));

    // Limpiar errores cuando se modifican
    setErrors({});
    setMealErrors([]);
  };

  // Validar formulario
  const validateForm = (): boolean => {
    try {
      // Convertir a formato estándar para validación
      const validationData: DietPlanFormData = {
        ...formData,
        meals: formData.meals.map(meal => ({
          mealType: meal.mealType,
          content: meal.content,
          dayOfWeek: meal.dayOfWeek
        })) // Remover IDs para validación
      };
      
      dietPlanSchema.parse(validationData);
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

    if (!dietPlanId) {
      toast.error('ID del plan de dieta no válido');
      return;
    }

    if (!validateForm()) {
      toast.error('Por favor corrige los errores en el formulario');
      return;
    }

    setIsSubmitting(true);

    try {
      // Preparar datos para enviar al backend
      const updateData: Partial<DietPlanCreation> & { meals?: Array<{ id?: number; mealType: MealType; content: string; dayOfWeek: DayOfWeek }> } = {
        title: formData.title,
        description: formData.description || undefined,
        startDate: formData.startDate || undefined,
        endDate: formData.endDate || undefined,
        objectives: formData.objectives || undefined,
        status: formData.status,
        notes: formData.notes || undefined,
        meals: formData.meals.map(meal => ({
          id: meal.id ? parseInt(meal.id) : undefined,
          mealType: meal.mealType,
          content: meal.content,
          dayOfWeek: meal.dayOfWeek
        }))
      };

      await updateDietPlan(dietPlanId, updateData);
      
      toast.success('Plan de dieta actualizado exitosamente');
      navigate(`/patients/${patientId}/diet-plans/${dietPlanId}`);
    } catch (error: unknown) {
      console.error('Error updating diet plan:', error);
      
      // Manejar errores específicos del backend
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as { response: { status: number; data?: { message?: string } } };
        if (axiosError.response?.status === 400) {
          toast.error('Error de validación. Revisa los datos ingresados.');
        } else if (axiosError.response?.status === 404) {
          toast.error('Plan de dieta no encontrado');
        } else if (axiosError.response?.status === 403) {
          toast.error('No tienes permisos para actualizar este plan de dieta');
        } else {
          toast.error('Error al actualizar el plan de dieta. Inténtalo de nuevo.');
        }
      } else {
        toast.error('Error al actualizar el plan de dieta. Inténtalo de nuevo.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Manejar cancelación
  const handleCancel = () => {
    if (hasChanges) {
      const confirmLeave = window.confirm(
        '¿Estás seguro de que quieres salir? Los cambios no guardados se perderán.'
      );
      if (!confirmLeave) return;
    }
    navigate(`/patients/${patientId}/diet-plans/${dietPlanId}`);
  };

  if (!patientId || !dietPlanId) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold text-gray-900">Error</h1>
        <p className="text-gray-600 mt-2">Parámetros de ruta no válidos</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="text-center">
          <Spinner />
          <p className="text-gray-600 mt-4">Cargando plan de dieta...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Editar Plan de Dieta</h1>
            <p className="mt-2 text-gray-600">
              Modifica el plan de dieta según las necesidades actuales del paciente.
            </p>
          </div>
          {hasChanges && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg px-4 py-2">
              <p className="text-sm text-yellow-800">Tienes cambios sin guardar</p>
            </div>
          )}
        </div>
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
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                  errors.title ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Ej: Plan de dieta para pérdida de peso"
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
                rows={3}
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-vertical ${
                  errors.description ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Descripción general del plan de dieta..."
              />
              {errors.description && (
                <p className="text-sm text-red-600 mt-1">{errors.description}</p>
              )}
            </div>

            {/* Fechas */}
            <div>
              <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">
                Fecha de Inicio
              </label>
              <DateInput
                id="startDate"
                value={formData.startDate}
                onChange={(value) => handleInputChange('startDate', value)}
                className={errors.startDate ? 'border-red-500' : ''}
              />
              {errors.startDate && (
                <p className="text-sm text-red-600 mt-1">{errors.startDate}</p>
              )}
            </div>

            <div>
              <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-1">
                Fecha de Fin
              </label>
              <DateInput
                id="endDate"
                value={formData.endDate}
                onChange={(value) => handleInputChange('endDate', value)}
                className={errors.endDate ? 'border-red-500' : ''}
              />
              {errors.endDate && (
                <p className="text-sm text-red-600 mt-1">{errors.endDate}</p>
              )}
            </div>

            {/* Objetivos */}
            <div className="md:col-span-2">
              <label htmlFor="objectives" className="block text-sm font-medium text-gray-700 mb-1">
                Objetivos del Plan
              </label>
              <textarea
                id="objectives"
                value={formData.objectives}
                onChange={(e) => handleInputChange('objectives', e.target.value)}
                rows={3}
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-vertical ${
                  errors.objectives ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Objetivos específicos que se buscan alcanzar con este plan..."
              />
              {errors.objectives && (
                <p className="text-sm text-red-600 mt-1">{errors.objectives}</p>
              )}
            </div>

            {/* Estado */}
            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                Estado del Plan
                <span className="text-red-500 ml-1">*</span>
              </label>
              <select
                id="status"
                value={formData.status}
                onChange={(e) => handleInputChange('status', e.target.value as PlanStatus)}
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                  errors.status ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                {Object.entries(PLAN_STATUS_LABELS).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
              {errors.status && (
                <p className="text-sm text-red-600 mt-1">{errors.status}</p>
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
                rows={3}
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-vertical ${
                  errors.notes ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Notas, observaciones o instrucciones adicionales..."
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
             meals={formData.meals.map(meal => ({
               mealType: meal.mealType,
               content: meal.content,
               dayOfWeek: meal.dayOfWeek
             }))} // Remover IDs para el componente
             onMealsChange={handleMealsChange}
             errors={mealErrors}
           />
        </div>

        {/* Botones de Acción */}
        <div className="flex items-center justify-end space-x-4 pt-6 border-t">
          <button
            type="button"
            onClick={handleCancel}
            className="px-6 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={isSubmitting || !hasChanges}
            className={`px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
              isSubmitting || !hasChanges
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-indigo-600 hover:bg-indigo-700'
            }`}
          >
            {isSubmitting ? (
              <div className="flex items-center">
                <Spinner />
                <span className="ml-2">Guardando...</span>
              </div>
            ) : (
              'Guardar Cambios'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditDietPlanPage; 