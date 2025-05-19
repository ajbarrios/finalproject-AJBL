import { PrismaClient } from '@prisma/client';
import { mockDeep, mockReset, DeepMockProxy } from 'vitest-mock-extended';

// Crear la instancia mockeada una vez
const mockInstance = mockDeep<PrismaClient>();

// Mockear el módulo prisma.client.ts para que su export default sea nuestra mockInstance
vi.mock('../../src/config/db/prisma.client', () => ({
  __esModule: true, // Necesario para mocks de módulos con export default
  default: mockInstance,
}));

// Resetear esta instancia mockeada antes de cada test
beforeEach(() => {
  mockReset(mockInstance);
});

// Exportar la misma instancia mockeada para ser usada en los tests
export const prismaMock = mockInstance as DeepMockProxy<PrismaClient>; // Casteo para tipos, aunque mockInstance ya debería serlo 