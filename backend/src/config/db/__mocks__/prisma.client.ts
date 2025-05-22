import { mockDeep, DeepMockProxy } from 'vitest-mock-extended';
import { PrismaClient } from '../../../generated/prisma'; // Ruta relativa desde __mocks__ a generated/prisma

// Creamos y exportamos la instancia mockeada del cliente Prisma.
// Vitest la usará automáticamente cuando se importe '../config/db/prisma.client' en los tests.
const prismaMockInstance = mockDeep<PrismaClient>();

export default prismaMockInstance; 