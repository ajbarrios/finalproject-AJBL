import React from 'react';

interface AlertMessageProps {
  show: boolean;
}

const AlertMessage: React.FC<AlertMessageProps> = ({ show }) => {
  if (!show) return null;

  return (
    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
      <div className="flex items-start">
        <svg className="w-5 h-5 text-yellow-600 mt-0.5 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
        <div>
          <h4 className="text-sm font-medium text-yellow-800">Paciente sin email registrado</h4>
          <p className="text-sm text-yellow-700 mt-1">
            Este paciente no tiene un email registrado. Deberás introducir manualmente el email de destino.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AlertMessage; 