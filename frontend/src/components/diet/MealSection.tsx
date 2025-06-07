import React from 'react';
import { 
  MealType, 
  DayOfWeek, 
  MEAL_TYPE_LABELS, 
  DAY_OF_WEEK_LABELS,
  type DietMealCreation 
} from '../../types/dietPlan';

interface MealSectionProps {
  meals: DietMealCreation[];
  onMealsChange: (meals: DietMealCreation[]) => void;
  errors?: Array<{
    mealType?: string;
    content?: string;
    dayOfWeek?: string;
  }>;
}

const MealSection: React.FC<MealSectionProps> = ({
  meals,
  onMealsChange,
  errors = []
}) => {
  const addMeal = () => {
    const newMeal: DietMealCreation = {
      mealType: MealType.BREAKFAST,
      content: '',
      dayOfWeek: DayOfWeek.MONDAY
    };
    onMealsChange([...meals, newMeal]);
  };

  const removeMeal = (index: number) => {
    const updatedMeals = meals.filter((_, i) => i !== index);
    onMealsChange(updatedMeals);
  };

  const updateMeal = (index: number, field: keyof DietMealCreation, value: string) => {
    const updatedMeals = meals.map((meal, i) => {
      if (i === index) {
        return { ...meal, [field]: value };
      }
      return meal;
    });
    onMealsChange(updatedMeals);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-gray-900">
          Comidas del Plan
          <span className="text-red-500 ml-1">*</span>
        </h3>
        <button
          type="button"
          onClick={addMeal}
          className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Añadir Comida
        </button>
      </div>

      {meals.length === 0 && (
        <div className="text-center py-6 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
          <p className="text-gray-500">No hay comidas añadidas aún.</p>
          <p className="text-sm text-gray-400 mt-1">Haz clic en "Añadir Comida" para empezar.</p>
        </div>
      )}

      <div className="space-y-4">
        {meals.map((meal, index) => {
          const mealErrors = errors[index] || {};
          
          return (
            <div key={index} className="bg-gray-50 rounded-lg p-4 border">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-md font-medium text-gray-900">
                  Comida #{index + 1}
                </h4>
                {meals.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeMeal(index)}
                    className="text-red-600 hover:text-red-900 focus:outline-none"
                    title="Eliminar comida"
                  >
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                {/* Tipo de Comida */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tipo de Comida
                    <span className="text-red-500 ml-1">*</span>
                  </label>
                  <select
                    value={meal.mealType}
                    onChange={(e) => updateMeal(index, 'mealType', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                      mealErrors.mealType ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    {Object.entries(MEAL_TYPE_LABELS).map(([value, label]) => (
                      <option key={value} value={value}>
                        {label}
                      </option>
                    ))}
                  </select>
                  {mealErrors.mealType && (
                    <p className="text-sm text-red-600 mt-1">{mealErrors.mealType}</p>
                  )}
                </div>

                {/* Día de la Semana */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Día de la Semana
                    <span className="text-red-500 ml-1">*</span>
                  </label>
                  <select
                    value={meal.dayOfWeek}
                    onChange={(e) => updateMeal(index, 'dayOfWeek', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                      mealErrors.dayOfWeek ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    {Object.entries(DAY_OF_WEEK_LABELS).map(([value, label]) => (
                      <option key={value} value={value}>
                        {label}
                      </option>
                    ))}
                  </select>
                  {mealErrors.dayOfWeek && (
                    <p className="text-sm text-red-600 mt-1">{mealErrors.dayOfWeek}</p>
                  )}
                </div>
              </div>

              {/* Contenido de la Comida */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Contenido de la Comida
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <textarea
                  value={meal.content}
                  onChange={(e) => updateMeal(index, 'content', e.target.value)}
                  placeholder="Describe detalladamente el contenido de esta comida..."
                  rows={3}
                  className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-vertical ${
                    mealErrors.content ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {mealErrors.content && (
                  <p className="text-sm text-red-600 mt-1">{mealErrors.content}</p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {meals.length === 0 && (
        <div className="text-center mt-4">
          <button
            type="button"
            onClick={addMeal}
            className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Añadir Primera Comida
          </button>
        </div>
      )}
    </div>
  );
};

export default MealSection; 