import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    // Configuración del entorno
    environment: 'node',
    globals: true,

    // Archivos de setup (ejecutados antes de cada archivo de test)
    setupFiles: ['./tests/config/prisma.mock.ts'], // Ruta al mock de Prisma

    // Patrones de archivos de prueba
    include: ['**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    exclude: ['**/node_modules/**', '**/dist/**', '**/build/**'],

    // Configuración de cobertura (si la tenías antes)
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'dist/',
        'build/',
        '**/*.d.ts',
        '**/*.test.{js,ts}',
        '**/*.spec.{js,ts}',
        '**/*.config.{js,ts}',
        '**/generated/**',
        '**/config/db/prisma.client.ts', // Excluir el cliente real de la cobertura
        '**/tests/config/**', // Excluir archivos de config de tests
      ],
    },

    // Timeouts
    testTimeout: 10000,
    hookTimeout: 10000,

    // Otras opciones
    clearMocks: true, // Vitest lo hace por defecto, pero es bueno ser explícito
    // mockReset: true, // Ya lo manejamos en prisma.mock.ts con mockReset(prismaMock)
    // restoreMocks: true,

    // Salida de los tests
    reporters: ['verbose'],
    // outputFile: {
    //   json: './test-results/results.json'
    // }
  },
});