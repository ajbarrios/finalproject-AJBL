import React, { useState, useEffect, useCallback } from 'react';

interface SearchBarProps {
  currentSearchTerm: string; // El término de búsqueda actual, controlado por el padre
  onSearchChange: (searchTerm: string) => void;
  placeholder?: string;
  debounceDelay?: number;
}

const SearchBar: React.FC<SearchBarProps> = ({
  currentSearchTerm,
  onSearchChange,
  placeholder = 'Buscar...',
  debounceDelay = 500, // 500ms de retraso por defecto para el debounce
}) => {
  const [inputValue, setInputValue] = useState<string>(currentSearchTerm);

  // Hook para debouncing
  const debouncedSearch = useCallback(
    (value: string) => {
      const handler = setTimeout(() => {
        onSearchChange(value);
      }, debounceDelay);

      return () => {
        clearTimeout(handler);
      };
    },
    [onSearchChange, debounceDelay]
  );

  useEffect(() => {
    // Sincronizar el valor interno si el término de búsqueda externo cambia
    // Esto es útil si el término de búsqueda puede ser limpiado por el componente padre
    setInputValue(currentSearchTerm);
  }, [currentSearchTerm]);

  useEffect(() => {
    // Solo llama a la función debounced si el valor del input cambia
    // y es diferente del currentSearchTerm (para evitar bucles si el padre actualiza el estado)
    if (inputValue !== currentSearchTerm) {
      const cleanup = debouncedSearch(inputValue);
      return cleanup; // Esto limpiará el timeout si el componente se desmonta o inputValue cambia de nuevo
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inputValue, debouncedSearch]); // No incluimos currentSearchTerm aquí para evitar re-trigger innecesarios

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  return (
    <div className="w-full mb-6">
      <input
        type="text"
        value={inputValue}
        onChange={handleChange}
        placeholder={placeholder}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-300"
      />
    </div>
  );
};

export default SearchBar; 