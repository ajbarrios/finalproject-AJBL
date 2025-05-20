// Importar matchers de jest-dom para extender expect
import '@testing-library/jest-dom';

// Aquí puedes añadir cualquier otra configuración global para tus tests
// Por ejemplo, mocks globales, limpieza después de cada test, etc.

// Ejemplo de limpieza después de cada test (Vitest lo hace por defecto para mocks de `vi.fn()` pero no para el DOM si no se usa `render` en un `afterEach`)
// import { afterEach } from 'vitest';
// import { cleanup } from '@testing-library/react';
// afterEach(() => {
//   cleanup(); // Limpia el DOM después de cada test si usas React Testing Library
// }); 