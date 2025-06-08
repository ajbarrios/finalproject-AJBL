import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { getDietPlan, deleteDietPlan } from '../services/dietPlanService';
import type { DietPlan } from '../types/dietPlan';
import { MEAL_TYPE_LABELS, DAY_OF_WEEK_LABELS } from '../types/dietPlan';
import DeleteConfirmationModal from '../components/common/DeleteConfirmationModal';

const DietPlanDetailsPage: React.FC = () => {
  const { patientId, dietPlanId } = useParams<{ patientId: string; dietPlanId: string }>();
  const navigate = useNavigate();
  
  const [dietPlan, setDietPlan] = useState<DietPlan | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Estados para el modal de eliminación
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const fetchDietPlanDetails = async () => {
      if (!dietPlanId) {
        setError('ID del plan de dieta no válido');
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);
        const plan = await getDietPlan(dietPlanId);
        setDietPlan(plan);
      } catch (err) {
        console.error('Error fetching diet plan:', err);
        
        if (err && typeof err === 'object' && 'response' in err) {
          const axiosErr = err as { response?: { status?: number } };
          if (axiosErr.response?.status === 404) {
            setError('Plan de dieta no encontrado');
          } else if (axiosErr.response?.status === 403) {
            setError('No tienes permisos para ver este plan de dieta');
          } else {
            setError('Error al cargar los detalles del plan de dieta');
          }
        } else {
          setError('Error al cargar los detalles del plan de dieta');
        }
        
        toast.error('Error al cargar el plan de dieta');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDietPlanDetails();
  }, [dietPlanId]);

  // Función para manejar la eliminación del plan de dieta
  const handleDeletePlan = async () => {
    if (!dietPlanId) {
      toast.error('ID del plan de dieta no válido');
      return;
    }

    try {
      setIsDeleting(true);
      await deleteDietPlan(dietPlanId);
      
      toast.success('Plan de dieta eliminado exitosamente');
      
      // Redirigir al perfil del paciente
      if (patientId) {
        navigate(`/patients/${patientId}`);
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      console.error('Error deleting diet plan:', err);
      
      if (err && typeof err === 'object' && 'response' in err) {
        const axiosErr = err as { response?: { status?: number } };
        if (axiosErr.response?.status === 403) {
          toast.error('No tienes permisos para eliminar este plan de dieta');
        } else if (axiosErr.response?.status === 404) {
          toast.error('Plan de dieta no encontrado');
        } else {
          toast.error('Error al eliminar el plan de dieta');
        }
      } else {
        toast.error('Error al eliminar el plan de dieta');
      }
    } finally {
      setIsDeleting(false);
      setShowDeleteModal(false);
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'No especificada';
    return new Date(dateString).toLocaleDateString('es-ES');
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <div className="text-red-600 text-lg font-medium mb-4">{error}</div>
          <Link
            to={patientId ? `/patients/${patientId}` : '/dashboard'}
            className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Volver al perfil del paciente
          </Link>
        </div>
      </div>
    );
  }

  if (!dietPlan) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="text-center text-gray-500">No se encontró el plan de dieta</div>
      </div>
    );
  }

  // Agrupar comidas por día de la semana
  const mealsByDay = dietPlan.meals.reduce((acc, meal) => {
    if (!acc[meal.dayOfWeek]) {
      acc[meal.dayOfWeek] = [];
    }
    acc[meal.dayOfWeek].push(meal);
    return acc;
  }, {} as Record<string, typeof dietPlan.meals>);

  const daysOfWeek = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'];

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header con navegación */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <Link
            to={patientId ? `/patients/${patientId}` : '/dashboard'}
            className="text-indigo-600 hover:text-indigo-800 flex items-center"
          >
            <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Volver al perfil
          </Link>
          <span className="text-gray-300">|</span>
          <h1 className="text-3xl font-bold text-gray-900">Plan de Dieta</h1>
        </div>
        
        <div className="flex space-x-3">
          <Link
            to={`/patients/${patientId}/diet-plans/${dietPlanId}/edit`}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Editar Plan
          </Link>
          <button
            onClick={() => setShowDeleteModal(true)}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Eliminar
          </button>
        </div>
      </div>

      {/* Información general del plan */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">{dietPlan.title}</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-1">Estado</h3>
            <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
              dietPlan.status === 'ACTIVE' 
                ? 'bg-green-100 text-green-800' 
                : 'bg-yellow-100 text-yellow-800'
            }`}>
              {dietPlan.status === 'ACTIVE' ? 'Activo' : 'Borrador'}
            </span>
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-1">Fecha de Inicio</h3>
            <p className="text-gray-900">{formatDate(dietPlan.startDate)}</p>
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-1">Fecha de Fin</h3>
            <p className="text-gray-900">{formatDate(dietPlan.endDate)}</p>
          </div>
        </div>

        {dietPlan.description && (
          <div className="mt-6">
            <h3 className="text-sm font-medium text-gray-500 mb-2">Descripción</h3>
            <p className="text-gray-900">{dietPlan.description}</p>
          </div>
        )}

        {dietPlan.objectives && (
          <div className="mt-4">
            <h3 className="text-sm font-medium text-gray-500 mb-2">Objetivos</h3>
            <p className="text-gray-900">{dietPlan.objectives}</p>
          </div>
        )}

        {dietPlan.notes && (
          <div className="mt-4">
            <h3 className="text-sm font-medium text-gray-500 mb-2">Notas</h3>
            <p className="text-gray-900">{dietPlan.notes}</p>
          </div>
        )}
      </div>

      {/* Comidas por día */}
      <div className="space-y-6">
        <h2 className="text-2xl font-semibold text-gray-900">Comidas del Plan</h2>
        
        {dietPlan.meals.length === 0 ? (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
            <p className="text-gray-500 text-lg">No hay comidas registradas en este plan</p>
          </div>
        ) : (
          <div className="grid gap-6">
            {daysOfWeek.map((day) => {
              const dayMeals = mealsByDay[day];
              if (!dayMeals || dayMeals.length === 0) return null;

              return (
                <div key={day} className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">
                    {DAY_OF_WEEK_LABELS[day as keyof typeof DAY_OF_WEEK_LABELS]}
                  </h3>
                  
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {dayMeals.map((meal) => (
                      <div key={meal.id} className="border border-gray-200 rounded-lg p-4">
                        <h4 className="font-medium text-indigo-600 mb-2">
                          {MEAL_TYPE_LABELS[meal.mealType as keyof typeof MEAL_TYPE_LABELS]}
                        </h4>
                        <p className="text-gray-700 text-sm whitespace-pre-wrap">{meal.content}</p>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Información adicional */}
      <div className="mt-8 text-sm text-gray-500 border-t pt-4">
        <p>Plan creado el {formatDate(dietPlan.createdAt)}</p>
        {dietPlan.updatedAt !== dietPlan.createdAt && (
          <p>Última actualización: {formatDate(dietPlan.updatedAt)}</p>
        )}
      </div>

      {/* Modal de confirmación para eliminación */}
      <DeleteConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDeletePlan}
        title="Eliminar Plan de Dieta"
        message={`¿Estás seguro de que quieres eliminar el plan "${dietPlan?.title}"? Esta acción no se puede deshacer.`}
        isLoading={isDeleting}
        confirmButtonText="Sí, Eliminar"
        cancelButtonText="Cancelar"
      />
    </div>
  );
};

export default DietPlanDetailsPage; 