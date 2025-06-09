import express, { Application, Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

// Importar rutas de autenticación
import authRoutes from './api/routes/auth.routes';
// Importar rutas de pacientes
import patientRoutes from './api/routes/patient.routes';
// Importar rutas de dietas
import dietRoutes from './api/routes/diet.routes';

// Cargar variables de entorno desde .env
dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 3000; // Usar puerto de .env o 3000 por defecto

// Debug: Mostrar información del entorno
console.log('🔧 Environment Info:');
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('PORT:', PORT);
console.log('FRONTEND_URL:', process.env.FRONTEND_URL);

// Configurar CORS
const isDevelopment = process.env.NODE_ENV !== 'production';
const isProduction = process.env.NODE_ENV === 'production';

console.log('🌍 CORS Mode:', isDevelopment ? 'Development' : 'Production');

const allowedOrigins = [
  'http://localhost:5173', // Desarrollo local (Vite)
  process.env.FRONTEND_URL, // Netlify URL desde variable de entorno
];

const corsOptions = {
  origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
    // En desarrollo, permitir todas las solicitudes (incluso sin origin, como Postman)
    if (isDevelopment) {
      return callback(null, true);
    }
    
    // En producción, solo permitir orígenes específicos
    if (isProduction) {
      // Permitir solicitudes sin origin (como aplicaciones móviles)
      if (!origin) return callback(null, true);
      
      // Verificar si el origin está en la lista permitida o es de Netlify
      if (allowedOrigins.includes(origin) || origin.includes('netlify.app')) {
        return callback(null, true);
      }
      
      return callback(new Error('Not allowed by CORS'));
    }
    
    // Fallback: permitir por defecto
    callback(null, true);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));

// Middleware para parsear JSON (opcional por ahora, pero útil para APIs)
app.use(express.json());

// Ruta de bienvenida
app.get('/', (req: Request, res: Response) => {
  res.status(200).json({
    message: '¡Bienvenido a la API de NutriTrack Pro!',
    version: '1.0.0',
    status: 'running'
  });
});

// Configurar rutas de la API
app.use('/api/auth', authRoutes); // Montar rutas de autenticación bajo /api/auth
app.use('/api/patients', patientRoutes); // Montar rutas de pacientes bajo /api/patients
app.use('/api/diets', dietRoutes); // Montar rutas de dietas bajo /api/diets

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor de NutriTrack Pro corriendo en http://localhost:${PORT}`);
});

// Exportar la app puede ser útil para testing u otras integraciones (opcional)
// export default app; 