/// <reference types="vitest/globals" />

// Mockear bcrypt y jsonwebtoken
vi.mock('bcrypt');
vi.mock('jsonwebtoken', () => {
  const mockSignFn = vi.fn();
  return {
    __esModule: true, // Para compatibilidad con módulos ES
    default: {        // Provee el export por defecto
      sign: mockSignFn,
      // verify: vi.fn(), // si necesitaras mockear verify en el default export
    },
    sign: mockSignFn,   // Mantiene el export nombrado `sign`
    // verify: vi.fn(), // si necesitaras mockear verify como export nombrado
  };
});

// Importaciones necesarias para los tests
import { describe, it, expect, vi, beforeEach, Mock, afterEach } from 'vitest';
import { ProfessionType } from '../../../../src/generated/prisma'; // Solo el enum
import { register, login } from '../../../../src/api/controllers/auth.controller';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken'; // Lo importamos para poder mockear jwt.sign (o jwtSign)
import { Request, Response } from 'express';

// Importar la instancia mockeada de Prisma desde el archivo de setup
import { prismaMock } from '../../../config/prisma.mock'; // Ajustar la ruta según sea necesario

// Renombrar jwt.sign a jwtSign para el mock, si es necesario para claridad, o usar vi.mocked(jwt.sign)
const mockedJwtSign = jwt.sign as Mock;

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

  // Test para asegurar que un error interno genérico en register devuelve 500
  it('should return 500 if an unexpected error occurs during registration', async () => {
    mockReq = {
      body: {
        firstName: 'Test',
        lastName: 'User',
        email: 'error@example.com',
        password: 'password123',
        profession: ProfessionType.NUTRITIONIST,
      },
    };

    // Forzar un error en la primera operación de base de datos
    (prismaMock as any).professional.findUnique.mockRejectedValue(new Error('Unexpected DB error'));

    await register(mockReq as Request, mockRes as Response);

    expect(statusSpy).toHaveBeenCalledWith(500);
    expect(jsonSpy).toHaveBeenCalledWith({ message: 'Internal server error' });
  });
});

describe('Auth Controller - Login', () => {
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;
  let statusSpy: Mock;
  let jsonSpy: Mock;
  const originalEnv = process.env; // Guardar el process.env original

  beforeEach(() => {
    vi.restoreAllMocks(); // Restaura todos los mocks a su estado original
                           // o usa vi.resetAllMocks() si solo quieres resetear el estado de los mocks
                           // pero no su implementación. clearAllMocks() es otra opción.
                           // Dado que prismaMock se maneja en su propio archivo y bcrypt/jwt se mockean arriba,
                           // esto debería ser seguro. Si no, ajustamos a vi.clearAllMocks().

    // Resetear mocks específicos que pueden tener estado entre tests
    vi.mocked(bcrypt.compare).mockReset();
    mockedJwtSign.mockReset(); // Usa la referencia correcta al mock de jwt.sign
    (prismaMock as any).professional.findUnique.mockReset();


    jsonSpy = vi.fn();
    statusSpy = vi.fn(() => ({ json: jsonSpy }));
    mockRes = {
      status: statusSpy,
    };
    
    // Restaurar process.env a su estado original antes de cada test de login
    // y luego permitir que cada test lo modifique si es necesario.
    process.env = { ...originalEnv }; 
  });

  afterEach(() => {
    // Asegurarse de que process.env se restaure después de cada test
    process.env = originalEnv;
  });

  const mockProfessionalData = {
    id: 'prof-123',
    firstName: 'Professional',
    lastName: 'User',
    email: 'prof@example.com',
    passwordHash: 'hashedPassword123',
    profession: ProfessionType.NUTRITIONIST,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  it('should login a professional successfully and return a token', async () => {
    mockReq = {
      body: {
        email: 'prof@example.com',
        password: 'password123',
      },
    };

    (prismaMock as any).professional.findUnique.mockResolvedValue(mockProfessionalData);
    vi.mocked(bcrypt.compare).mockResolvedValue(true as any);
    mockedJwtSign.mockReturnValue('mocked.jwt.token');
    
    process.env.JWT_SECRET = 'test-secret';
    process.env.JWT_EXPIRES_IN = '3600';

    await login(mockReq as Request, mockRes as Response);

    expect((prismaMock as any).professional.findUnique).toHaveBeenCalledWith({
      where: { email: 'prof@example.com' },
    });
    expect(bcrypt.compare).toHaveBeenCalledWith('password123', mockProfessionalData.passwordHash);
    expect(mockedJwtSign).toHaveBeenCalledWith(
      {
        professionalId: mockProfessionalData.id,
        email: mockProfessionalData.email,
        profession: mockProfessionalData.profession,
      },
      'test-secret',
      { expiresIn: 3600 }
    );
    expect(statusSpy).toHaveBeenCalledWith(200);
    expect(jsonSpy).toHaveBeenCalledWith({
      message: 'Login successful',
      token: 'mocked.jwt.token',
      data: {
        id: mockProfessionalData.id,
        firstName: mockProfessionalData.firstName,
        lastName: mockProfessionalData.lastName,
        email: mockProfessionalData.email,
        profession: mockProfessionalData.profession,
      },
    });
  });

  it('should return 401 if email is not found', async () => {
    mockReq = {
      body: {
        email: 'unknown@example.com',
        password: 'password123',
      },
    };

    (prismaMock as any).professional.findUnique.mockResolvedValue(null);

    await login(mockReq as Request, mockRes as Response);

    expect(statusSpy).toHaveBeenCalledWith(401);
    expect(jsonSpy).toHaveBeenCalledWith({ message: 'Invalid credentials' });
    expect(bcrypt.compare).not.toHaveBeenCalled();
    expect(mockedJwtSign).not.toHaveBeenCalled();
  });

  it('should return 401 if password does not match', async () => {
    mockReq = {
      body: {
        email: 'prof@example.com',
        password: 'wrongpassword',
      },
    };

    (prismaMock as any).professional.findUnique.mockResolvedValue(mockProfessionalData);
    vi.mocked(bcrypt.compare).mockResolvedValue(false as any);

    await login(mockReq as Request, mockRes as Response);

    expect(statusSpy).toHaveBeenCalledWith(401);
    expect(jsonSpy).toHaveBeenCalledWith({ message: 'Invalid credentials' });
    expect(mockedJwtSign).not.toHaveBeenCalled();
  });

  it('should return 400 for invalid input (e.g., missing email)', async () => {
    mockReq = {
      body: {
        password: 'password123',
      },
    };

    await login(mockReq as Request, mockRes as Response);

    expect(statusSpy).toHaveBeenCalledWith(400);
    expect(jsonSpy).toHaveBeenCalledWith(expect.objectContaining({
      message: 'Validation failed',
      errors: expect.objectContaining({ email: expect.arrayContaining(["Required"]) }),
    }));
  });
  
  it('should return 400 for invalid input (e.g., invalid email format)', async () => {
    mockReq = {
      body: {
        email: 'invalidemail',
        password: 'password123',
      },
    };

    await login(mockReq as Request, mockRes as Response);

    expect(statusSpy).toHaveBeenCalledWith(400);
    expect(jsonSpy).toHaveBeenCalledWith(expect.objectContaining({
      message: 'Validation failed',
      errors: expect.objectContaining({ email: expect.arrayContaining(["Invalid email format"]) }),
    }));
  });


  it('should return 500 if JWT_SECRET is not defined', async () => {
    mockReq = {
      body: {
        email: 'prof@example.com',
        password: 'password123',
      },
    };

    (prismaMock as any).professional.findUnique.mockResolvedValue(mockProfessionalData);
    vi.mocked(bcrypt.compare).mockResolvedValue(true as any);
    
    // Simular que JWT_SECRET no está definido
    delete process.env.JWT_SECRET; 

    await login(mockReq as Request, mockRes as Response);

    expect(statusSpy).toHaveBeenCalledWith(500);
    expect(jsonSpy).toHaveBeenCalledWith({ message: 'Internal server error - JWT configuration missing' });
    expect(mockedJwtSign).not.toHaveBeenCalled(); // No se debería intentar firmar si falta el secreto
  });
  
  // Test para asegurar que un error interno genérico en login devuelve 500
  it('should return 500 if an unexpected error occurs (e.g., bcrypt.compare throws)', async () => {
    mockReq = {
      body: {
        email: 'prof@example.com',
        password: 'password123',
      },
    };

    (prismaMock as any).professional.findUnique.mockResolvedValue(mockProfessionalData);
    vi.mocked(bcrypt.compare).mockRejectedValue(new Error('Unexpected bcrypt error'));

    await login(mockReq as Request, mockRes as Response);

    expect(statusSpy).toHaveBeenCalledWith(500);
    expect(jsonSpy).toHaveBeenCalledWith({ message: 'Internal server error' });
  });
}); 