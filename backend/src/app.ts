import express, { Application, Request, Response } from 'express';
import dotenv from 'dotenv';

// Importar rutas de autenticación
import authRoutes from './api/routes/auth.routes';

// Cargar variables de entorno desde .env
dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 3000; // Usar puerto de .env o 3000 por defecto

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

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor de NutriTrack Pro corriendo en http://localhost:${PORT}`);
});

// Exportar la app puede ser útil para testing u otras integraciones (opcional)
// export default app; 