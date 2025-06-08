import React from 'react';
import type { PlanSelectorProps } from '../../types/emailTypes';

const PlanSelector: React.FC<PlanSelectorProps> = ({
  availablePlans,
  selectedDietPlans,
  selectedWorkoutPlans,
  onDietPlanChange,
  onWorkoutPlanChange
}) => {
  return (
    <div className="bg-blue-50 p-4 rounded-lg">
      <h4 className="text-sm font-medium text-blue-800 mb-3">Selecciona los planes a enviar:</h4>
      
      {/* Planes de Dieta */}
      {availablePlans.dietPlans.length > 0 && (
        <div className="mb-4">
          <p className="text-sm font-medium text-blue-700 mb-2">Planes de Dieta:</p>
          <div className="space-y-2">
            {availablePlans.dietPlans.map(plan => (
              <label key={plan.id} className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedDietPlans.includes(plan.id)}
                  onChange={(e) => onDietPlanChange(plan.id, e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-blue-700">
                  {plan.title}
                  <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
                    plan.status === 'ACTIVE' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {plan.status === 'ACTIVE' ? 'Activo' : 'Borrador'}
                  </span>
                </span>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Planes de Entrenamiento */}
      {availablePlans.workoutPlans.length > 0 && (
        <div>
          <p className="text-sm font-medium text-blue-700 mb-2">Planes de Entrenamiento:</p>
          <div className="space-y-2">
            {availablePlans.workoutPlans.map(plan => (
              <label key={plan.id} className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedWorkoutPlans.includes(plan.id)}
                  onChange={(e) => onWorkoutPlanChange(plan.id, e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-blue-700">
                  {plan.title}
                  <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
                    plan.status === 'ACTIVE' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {plan.status === 'ACTIVE' ? 'Activo' : 'Borrador'}
                  </span>
                </span>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Mensaje cuando no hay planes seleccionados */}
      {selectedDietPlans.length === 0 && selectedWorkoutPlans.length === 0 && (
        <p className="text-sm text-red-600 mt-2">
          ⚠️ Debes seleccionar al menos un plan para enviar
        </p>
      )}
    </div>
  );
};

export default PlanSelector; 