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

// Configurar CORS
// Esto permitirá todas las solicitudes de origen cruzado. 
// Para producción, deberías configurarlo de forma más restrictiva, ej:
// app.use(cors({ origin: 'http://tu-dominio-frontend.com' }));
app.use(cors());

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