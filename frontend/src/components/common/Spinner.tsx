import React from 'react';

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  color?: string; // e.g., 'text-blue-500', 'text-gray-900'
  // layoutClassName ya no se usará aquí
}

const Spinner: React.FC<SpinnerProps> = ({
  size = 'md', // Default size
  color = 'text-white', // Default color
}) => {
  let sizeClasses = 'h-5 w-5'; // Default to md size
  if (size === 'sm') {
    sizeClasses = 'h-4 w-4';
  } else if (size === 'lg') {
    sizeClasses = 'h-8 w-8';
  }

  // Las clases de layout se manejarán fuera del componente
  const combinedClassName = `animate-spin ${sizeClasses} ${color}`.trim();

  return (
    <svg
      className={combinedClassName}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      data-testid="spinner-svg"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      ></circle>
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      ></path>
    </svg>
  );
};

export default Spinner; 