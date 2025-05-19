import { PrismaClient as ActualPrismaClient } from '../../generated/prisma';

// Declaración para extender el objeto global de Node.js de forma segura para tipos
declare global {
  // eslint-disable-next-line no-var
  var prisma: ActualPrismaClient | undefined;
}

let prisma: ActualPrismaClient;

if (process.env.NODE_ENV === 'production') {
  prisma = new ActualPrismaClient();
} else {
  if (!global.prisma) {
    global.prisma = new ActualPrismaClient();
  }
  prisma = global.prisma;
}

export default prisma; 