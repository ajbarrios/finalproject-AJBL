import { Request, Response } from 'express';
import { z } from 'zod';
import { ProfessionType } from '../../generated/prisma'; // Solo importamos ProfessionType ahora
import prisma from '../../config/db/prisma.client'; // Importamos nuestra instancia singleton
import bcrypt from 'bcrypt';

const SALT_ROUNDS = 10; // Para bcrypt

const registerSchema = z.object({
  firstName: z.string().min(1, { message: 'First name is required' }),
  lastName: z.string().min(1, { message: 'Last name is required' }),
  email: z.string().email({ message: 'Invalid email format' }).min(1, { message: 'Email is required' }),
  password: z.string().min(8, { message: 'Password must be at least 8 characters long' }),
  profession: z.nativeEnum(ProfessionType, { message: 'Invalid profession type' }),
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
  // TODO: Implementar lógica de login
  res.status(501).json({ message: 'Not Implemented' });
}; 