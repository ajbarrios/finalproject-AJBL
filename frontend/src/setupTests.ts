// Importar matchers de jest-dom para extender expect
import '@testing-library/jest-dom/vitest';

// Aquí puedes añadir cualquier otra configuración global para tus tests
// Por ejemplo, mocks globales, limpieza después de cada test, etc.

// Ejemplo de limpieza después de cada test
import { afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';

afterEach(() => {
  cleanup(); // Limpia el DOM después de cada test
}); 