import React from 'react';

interface ActionButtonsProps {
  isLoading: boolean;
  hasSelectedPlans: boolean;
  onCancel: () => void;
  onSubmit: () => void;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({
  isLoading,
  hasSelectedPlans,
  onCancel,
  onSubmit
}) => {
  return (
    <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
      <button
        type="button"
        onClick={onCancel}
        disabled={isLoading}
        className={`
          px-4 py-2 text-sm font-medium rounded-lg border border-gray-300 transition-colors
          ${isLoading 
            ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
            : 'bg-white text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
          }
        `}
      >
        Cancelar
      </button>
      
      <button
        type="button"
        onClick={onSubmit}
        disabled={isLoading || !hasSelectedPlans}
        className={`
          px-4 py-2 text-sm font-medium rounded-lg transition-colors flex items-center space-x-2
          ${isLoading || !hasSelectedPlans
            ? 'bg-gray-400 text-white cursor-not-allowed'
            : 'bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
          }
        `}
      >
        {isLoading && (
          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        )}
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
        </svg>
        <span>Enviar Email</span>
      </button>
    </div>
  );
};

export default ActionButtons; 