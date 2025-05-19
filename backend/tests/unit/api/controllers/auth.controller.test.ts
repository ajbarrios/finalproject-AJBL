/// <reference types="vitest/globals" />

// Mockear bcrypt directamente como antes
vi.mock('bcrypt');

// Importaciones necesarias para los tests
import { describe, it, expect, vi, beforeEach, Mock } from 'vitest';
import { ProfessionType } from '../../../../src/generated/prisma'; // Solo el enum
import { register } from '../../../../src/api/controllers/auth.controller';
import bcrypt from 'bcrypt';
import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

// Importar la instancia mockeada de Prisma desde el archivo de setup
import { prismaMock } from '../../../config/prisma.mock'; // Ajustar la ruta según sea necesario

describe('Auth Controller - Register', () => {
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;
  let statusSpy: Mock;
  let jsonSpy: Mock;

  beforeEach(() => {
    // El reseteo de prismaMock y vi.clearAllMocks() ya se hace en prisma.mock.ts
    // y/o por la configuración de Vitest (clearMocks: true)
    // Solo necesitamos resetear bcrypt si es necesario para cada test o configurar su mock aquí.
    vi.mocked(bcrypt.hash).mockReset(); // Asegurarse que bcrypt.hash se resetea

    jsonSpy = vi.fn();
    statusSpy = vi.fn(() => ({ json: jsonSpy }));
    mockRes = {
      status: statusSpy,
    };
  });

  it('should register a new professional successfully', async () => {
    mockReq = {
      body: {
        firstName: 'Test',
        lastName: 'User',
        email: 'test@example.com',
        password: 'password123',
        profession: ProfessionType.NUTRITIONIST,
      },
    };

    const expectedHashedPassword = 'hashedPassword123';
    const mockCreatedProfessionalInDb = {
      id: 1,
      firstName: 'Test',
      lastName: 'User',
      email: 'test@example.com',
      passwordHash: expectedHashedPassword,
      profession: ProfessionType.NUTRITIONIST,
      phone: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    (prismaMock as any).professional.findUnique.mockResolvedValue(null);
    vi.mocked(bcrypt.hash).mockResolvedValue(expectedHashedPassword as any);
    (prismaMock as any).professional.create.mockResolvedValue(mockCreatedProfessionalInDb);

    await register(mockReq as Request, mockRes as Response);

    expect((prismaMock as any).professional.findUnique).toHaveBeenCalledWith({
      where: { email: 'test@example.com' },
    });
    expect(bcrypt.hash).toHaveBeenCalledWith('password123', 10);
    expect((prismaMock as any).professional.create).toHaveBeenCalledWith({
      data: {
        firstName: 'Test',
        lastName: 'User',
        email: 'test@example.com',
        passwordHash: expectedHashedPassword,
        profession: ProfessionType.NUTRITIONIST,
      },
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
    expect(statusSpy).toHaveBeenCalledWith(201);
    
    const { passwordHash, phone, ...expectedData } = mockCreatedProfessionalInDb;

    expect(jsonSpy).toHaveBeenCalledWith({
      message: 'Professional registered successfully',
      data: expect.objectContaining({
        ...expectedData,
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      }),
    });
  });

  it('should return 409 if email already exists', async () => {
    mockReq = {
      body: {
        firstName: 'Test',
        lastName: 'User',
        email: 'existing@example.com',
        password: 'password123',
        profession: ProfessionType.NUTRITIONIST,
      },
    };
    const existingProfessionalData = {
      id: 2, firstName: 'Existing', lastName: 'User', 
      email: 'existing@example.com', passwordHash: 'someotherhash',
      profession: ProfessionType.NUTRITIONIST, phone: null, 
      createdAt: new Date(), updatedAt: new Date(),
    };
    (prismaMock as any).professional.findUnique.mockResolvedValue(existingProfessionalData);

    await register(mockReq as Request, mockRes as Response);

    expect((prismaMock as any).professional.findUnique).toHaveBeenCalledWith({
      where: { email: 'existing@example.com' },
    });
    expect(bcrypt.hash).not.toHaveBeenCalled();
    expect((prismaMock as any).professional.create).not.toHaveBeenCalled();
    expect(statusSpy).toHaveBeenCalledWith(409);
    expect(jsonSpy).toHaveBeenCalledWith({ message: 'Email already registered' });
  });

  it('should return 400 for invalid input data (missing required fields)', async () => {
    mockReq = {
      body: {
        lastName: 'User',
        email: 'test@example.com',
        password: 'password123',
        profession: ProfessionType.NUTRITIONIST,
      },
    };
    await register(mockReq as Request, mockRes as Response);
    expect(statusSpy).toHaveBeenCalledWith(400);
    expect(jsonSpy).toHaveBeenCalledWith(expect.objectContaining({
      message: 'Validation failed',
      errors: expect.objectContaining({ firstName: expect.arrayContaining(['Required']) }),
    }));
  });

  it('should return 400 for invalid email format', async () => {
    mockReq = {
      body: {
        firstName: 'Test',
        lastName: 'User',
        email: 'invalidemail',
        password: 'password123',
        profession: ProfessionType.NUTRITIONIST,
      },
    };
    await register(mockReq as Request, mockRes as Response);
    expect(statusSpy).toHaveBeenCalledWith(400);
    expect(jsonSpy).toHaveBeenCalledWith(expect.objectContaining({
      message: 'Validation failed',
      errors: expect.objectContaining({ email: expect.arrayContaining(['Invalid email format']) }),
    }));
  });

  it('should return 400 for password too short', async () => {
    mockReq = {
      body: {
        firstName: 'Test',
        lastName: 'User',
        email: 'test@example.com',
        password: '123',
        profession: ProfessionType.NUTRITIONIST,
      },
    };
    await register(mockReq as Request, mockRes as Response);
    expect(statusSpy).toHaveBeenCalledWith(400);
    expect(jsonSpy).toHaveBeenCalledWith(expect.objectContaining({
      message: 'Validation failed',
      errors: expect.objectContaining({ password: expect.arrayContaining(['Password must be at least 8 characters long']) }),
    }));
  });

  it('should return 400 for invalid profession type', async () => {
    mockReq = {
      body: {
        firstName: 'Test',
        lastName: 'User',
        email: 'test@example.com',
        password: 'password123',
        profession: 'INVALID_PROFESSION',
      },
    };
    await register(mockReq as Request, mockRes as Response);
    expect(statusSpy).toHaveBeenCalledWith(400);
    expect(jsonSpy).toHaveBeenCalledWith(expect.objectContaining({
      message: 'Validation failed',
      errors: expect.objectContaining({ profession: expect.arrayContaining(['Invalid profession type']) }),
    }));
  });

  it('should return 500 if bcrypt.hash fails', async () => {
    mockReq = {
      body: {
        firstName: 'Test',
        lastName: 'User',
        email: 'bcryptfail@example.com',
        password: 'password123',
        profession: ProfessionType.NUTRITIONIST,
      },
    };
    (prismaMock as any).professional.findUnique.mockResolvedValue(null);
    vi.mocked(bcrypt.hash).mockRejectedValue(new Error('bcrypt error'));

    await register(mockReq as Request, mockRes as Response);

    expect(statusSpy).toHaveBeenCalledWith(500);
    expect(jsonSpy).toHaveBeenCalledWith({ message: 'Internal server error' });
  });

  it('should return 500 if prisma.professional.create fails', async () => {
    mockReq = {
      body: {
        firstName: 'Test',
        lastName: 'User',
        email: 'prismacreatefail@example.com',
        password: 'password123',
        profession: ProfessionType.NUTRITIONIST,
      },
    };
    const expectedHashedPassword = 'hashedPassword123';
    (prismaMock as any).professional.findUnique.mockResolvedValue(null);
    vi.mocked(bcrypt.hash).mockResolvedValue(expectedHashedPassword as any);
    (prismaMock as any).professional.create.mockRejectedValue(new Error('Prisma create error'));

    await register(mockReq as Request, mockRes as Response);

    expect(statusSpy).toHaveBeenCalledWith(500);
    expect(jsonSpy).toHaveBeenCalledWith({ message: 'Internal server error' });
  });
}); 