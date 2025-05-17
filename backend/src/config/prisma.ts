import { PrismaClient } from '@prisma/client';

// Instancia única de PrismaClient
const prisma = new PrismaClient({
  // Opcional: puedes añadir configuraciones aquí, como logging
  // log: ['query', 'info', 'warn', 'error'],
});

export default prisma; 