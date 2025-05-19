import { Request, Response } from 'express';
import { z } from 'zod';
import { ProfessionType } from '../../generated/prisma'; // Solo importamos ProfessionType ahora
import prisma from '../../config/db/prisma.client'; // Importamos nuestra instancia singleton
import bcrypt from 'bcrypt';
import { sign as jwtSign, SignOptions } from 'jsonwebtoken';

const SALT_ROUNDS = 10; // Para bcrypt

const registerSchema = z.object({
  firstName: z.string().min(1, { message: 'First name is required' }),
  lastName: z.string().min(1, { message: 'Last name is required' }),
  email: z.string().email({ message: 'Invalid email format' }).min(1, { message: 'Email is required' }),
  password: z.string().min(8, { message: 'Password must be at least 8 characters long' }),
  profession: z.nativeEnum(ProfessionType, { message: 'Invalid profession type' }),
});

const loginSchema = z.object({
  email: z.string().email({ message: 'Invalid email format' }).min(1, { message: 'Email is required' }),
  password: z.string().min(1, { message: 'Password is required' }), // Longitud mínima aquí es solo para presencia, la validación real es con bcrypt
});

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const validationResult = registerSchema.safeParse(req.body);

    if (!validationResult.success) {
      res.status(400).json({ 
        message: 'Validation failed',
        errors: validationResult.error.flatten().fieldErrors 
      });
      return;
    }

    const { firstName, lastName, email, password, profession } = validationResult.data;
    const lowercasedEmail = email.toLowerCase();

    // 2. Verificar si el email ya existe
    const existingProfessional = await prisma.professional.findUnique({
      where: { email: lowercasedEmail },
    });

    if (existingProfessional) {
      res.status(409).json({ message: 'Email already registered' });
      return;
    }

    // 3. Hashear la contraseña
    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

    // 4. Crear profesional en la BD
    const newProfessional = await prisma.professional.create({
      data: {
        firstName,
        lastName,
        email: lowercasedEmail,
        passwordHash,
        profession,
      },
      // Seleccionar los campos a devolver para no exponer passwordHash
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        profession: true,
        createdAt: true,
        updatedAt: true,
      }
    });

    // 5. Devolver respuesta
    res.status(201).json({
      message: 'Professional registered successfully',
      data: newProfessional,
    });

  } catch (error) {
    console.error('Error during registration:', error);
    // En un entorno de producción, usar un logger más robusto
    if (error instanceof z.ZodError) {
      // Esto es redundante si safeParse se usa arriba, pero es una doble verificación
      res.status(400).json({ message: 'Validation error (unexpected)', errors: error.flatten().fieldErrors });
    }
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    // 3.1: Validación de Entrada
    const validationResult = loginSchema.safeParse(req.body);
    if (!validationResult.success) {
      res.status(400).json({
        message: 'Validation failed',
        errors: validationResult.error.flatten().fieldErrors,
      });
      return;
    }

    const { email, password } = validationResult.data;
    const lowercasedEmail = email.toLowerCase();

    // 3.2: Búsqueda del Profesional
    const professional = await (prisma as any).professional.findUnique({
      where: { email: lowercasedEmail },
    });

    if (!professional) {
      // Email no encontrado
      res.status(401).json({ message: 'Invalid credentials' });
      return;
    }

    // 3.3: Comparación de Contraseñas
    const isPasswordValid = await bcrypt.compare(password, professional.passwordHash);
    if (!isPasswordValid) {
      // Contraseña incorrecta
      res.status(401).json({ message: 'Invalid credentials' });
      return;
    }

    // 3.4: Generación de JWT
    const jwtSecret = process.env.JWT_SECRET;
    // Modificación: esperar JWT_EXPIRES_IN como segundos (string) y parsearlo a número
    // Por defecto, 3600 segundos (1 hora) si no está definido o no es un número válido.
    const expiresInSecondsString = process.env.JWT_EXPIRES_IN || '3600';
    const expiresInNumeric = parseInt(expiresInSecondsString, 10);
    
    // Fallback a 1 hora en segundos si el parseo falla o resulta en NaN
    const finalExpiresIn = isNaN(expiresInNumeric) ? 3600 : expiresInNumeric;

    if (!jwtSecret) {
      console.error('JWT_SECRET is not defined in environment variables.');
      res.status(500).json({ message: 'Internal server error - JWT configuration missing' });
      return;
    }

    const secretForToken: string = jwtSecret;
    const tokenPayload = {
      professionalId: professional.id,
      email: professional.email,
      profession: professional.profession,
    };

    const tokenOptions: SignOptions = { expiresIn: finalExpiresIn }; // Usar el valor numérico

    const token = jwtSign(tokenPayload, secretForToken, tokenOptions);

    // 3.5: Definir Respuesta de Éxito
    res.status(200).json({
      message: 'Login successful',
      token,
      data: { // Opcional: devolver algunos datos del usuario
        id: professional.id,
        firstName: professional.firstName,
        lastName: professional.lastName,
        email: professional.email,
        profession: professional.profession,
      },
    });

  } catch (error) {
    // 3.6: Manejo de Errores Generales
    console.error('Error during login:', error);
    // En un entorno de producción, usar un logger más robusto
    if (error instanceof z.ZodError) {
      res.status(400).json({ message: 'Validation error (unexpected)', errors: error.flatten().fieldErrors });
    } else {
      res.status(500).json({ message: 'Internal server error' });
    }
  }
}; 