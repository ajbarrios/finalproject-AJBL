import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// Extendemos la interfaz Request de Express para incluir la propiedad 'professional'
export interface AuthenticatedRequest extends Request {
  professional?: any; // Podríamos definir una interfaz más estricta para el payload del token
}

export const authenticateToken = (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Formato "Bearer TOKEN"

  if (token == null) {
    res.status(401).json({ message: 'Acceso no autorizado: Token no proporcionado.' });
    return;
  }

  const jwtSecret = process.env.JWT_SECRET;
  if (!jwtSecret) {
    console.error('JWT_SECRET no está definida en las variables de entorno.');
    res.status(500).json({ message: 'Error interno del servidor: Configuración de JWT ausente.' });
    return;
  }

  jwt.verify(token, jwtSecret, (err: any, decodedPayload: any) => {
    if (err) {
      if (err.name === 'TokenExpiredError') {
        res.status(401).json({ message: 'Acceso no autorizado: Token expirado.' });
        return;
      }
      if (err.name === 'JsonWebTokenError') {
        res.status(403).json({ message: 'Acceso no autorizado: Token inválido.' });
        return;
      }
      // Para otros errores inesperados durante la verificación del token
      console.error('Error al verificar el token JWT:', err);
      res.status(403).json({ message: 'Acceso no autorizado: Error al verificar el token.' });
      return;
    }

    // Si el token es válido, adjuntamos el payload decodificado al objeto request
    // El payload debería contener la información del profesional (ej. professionalId, email)
    req.professional = decodedPayload;
    next(); // Pasar al siguiente middleware o controlador
  });
}; 