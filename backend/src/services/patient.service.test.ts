import { describe, it, expect, beforeEach, vi } from 'vitest';
// Importa el cliente Prisma TAL COMO LO HACE EL SERVICIO. 
// Vitest debería reemplazar esto con el contenido de __mocks__/prisma.client.ts
import prismaFromServicePerspective from '../config/db/prisma.client'; 
import { getPatientsForProfessional } from './patient.service';
import { type Patient } from '../generated/prisma';
import { type DeepMockProxy } from 'vitest-mock-extended'; // Solo necesitamos el tipo aquí
import { type PrismaClient } from '../generated/prisma'; // Solo el tipo

// Esta será nuestra referencia al mock, que debería ser la misma instancia que prismaFromServicePerspective
const prismaClientMock = prismaFromServicePerspective as DeepMockProxy<PrismaClient>; 

describe('PatientService - getPatientsForProfessional', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    // Si necesitas resetear específicamente el mock, ya tienes la referencia correcta:
    // prismaClientMock.patient.findMany.mockClear(); 
  });

  it('should return a list of patients for a valid professionalId', async () => {
    const professionalId = 1;
    const mockPatientsData: Patient[] = [
      {
        id: 101,
        professionalId: professionalId,
        firstName: 'Test',
        lastName: 'PatientA',
        email: 'test.patient.a@example.com',
        phone: '123456789',
        birthDate: new Date('1990-01-01'),
        gender: 'Masculino',
        height: 175,
        medicalNotes: 'None',
        dietRestrictions: 'None',
        objectives: 'Get fit',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 102,
        professionalId: professionalId,
        firstName: 'Another',
        lastName: 'PatientB',
        email: 'another.patient.b@example.com',
        phone: '987654321',
        birthDate: new Date('1992-02-02'),
        gender: 'Femenino',
        height: 165,
        medicalNotes: 'Allergy to nuts',
        dietRestrictions: 'No nuts',
        objectives: 'Lose weight',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    // Configurar el mock. Ahora estamos seguros de que es la misma instancia que usa el servicio.
    prismaClientMock.patient.findMany.mockResolvedValue(mockPatientsData);

    const result = await getPatientsForProfessional(professionalId);

    expect(result).toEqual(mockPatientsData);
    expect(prismaClientMock.patient.findMany).toHaveBeenCalledOnce();
    expect(prismaClientMock.patient.findMany).toHaveBeenCalledWith({
      where: { professionalId: professionalId },
      orderBy: { createdAt: 'desc' },
    });
  });

  it('should return a filtered list of patients when searchQuery matches a name', async () => {
    const professionalId = 1;
    const searchQuery = 'Test'; // Suponiendo que buscamos pacientes con firstName 'Test'
    
    // Paciente que esperamos encontrar
    const expectedPatient: Patient = {
      id: 101,
      professionalId: professionalId,
      firstName: 'Test',
      lastName: 'PatientA',
      email: 'test.patient.a@example.com',
      phone: '123456789',
      birthDate: new Date('1990-01-01'),
      gender: 'Masculino',
      height: 175,
      medicalNotes: 'None',
      dietRestrictions: 'None',
      objectives: 'Get fit',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Mock de Prisma devuelve solo el paciente que coincide
    prismaClientMock.patient.findMany.mockResolvedValue([expectedPatient]);

    const result = await getPatientsForProfessional(professionalId, searchQuery);

    expect(result).toEqual([expectedPatient]);
    expect(prismaClientMock.patient.findMany).toHaveBeenCalledOnce();
    expect(prismaClientMock.patient.findMany).toHaveBeenCalledWith({
      where: {
        professionalId: professionalId,
        OR: [
          { firstName: { contains: searchQuery, mode: 'insensitive' } },
          { lastName: { contains: searchQuery, mode: 'insensitive' } },
          { email: { contains: searchQuery, mode: 'insensitive' } },
        ],
      },
      orderBy: { createdAt: 'desc' },
    });
  });

  it('should return a filtered list of patients when searchQuery matches an email', async () => {
    const professionalId = 1;
    const searchQuery = 'test.patient.a@example.com';
    
    const expectedPatient: Patient = {
      id: 101,
      professionalId: professionalId,
      firstName: 'Test',
      lastName: 'PatientA',
      email: 'test.patient.a@example.com',
      phone: '123456789',
      birthDate: new Date('1990-01-01'),
      gender: 'Masculino',
      height: 175,
      medicalNotes: 'None',
      dietRestrictions: 'None',
      objectives: 'Get fit',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    prismaClientMock.patient.findMany.mockResolvedValue([expectedPatient]);

    const result = await getPatientsForProfessional(professionalId, searchQuery);

    expect(result).toEqual([expectedPatient]);
    expect(prismaClientMock.patient.findMany).toHaveBeenCalledOnce();
    expect(prismaClientMock.patient.findMany).toHaveBeenCalledWith({
      where: {
        professionalId: professionalId,
        OR: [
          { firstName: { contains: searchQuery, mode: 'insensitive' } },
          { lastName: { contains: searchQuery, mode: 'insensitive' } },
          { email: { contains: searchQuery, mode: 'insensitive' } },
        ],
      },
      orderBy: { createdAt: 'desc' },
    });
  });

  it('should return an empty array if the professionalId has no patients', async () => {
    const professionalId = 99; // Un ID que asumimos no tiene pacientes
    const mockPatientsData: Patient[] = []; // Esperamos un array vacío

    prismaClientMock.patient.findMany.mockResolvedValue(mockPatientsData);

    const result = await getPatientsForProfessional(professionalId);

    expect(result).toEqual([]);
    expect(prismaClientMock.patient.findMany).toHaveBeenCalledOnce();
    expect(prismaClientMock.patient.findMany).toHaveBeenCalledWith({
      where: { professionalId: professionalId }, // Sin cláusula OR porque no hay searchQuery
      orderBy: { createdAt: 'desc' },
    });
  });

  it('should return an empty array if searchQuery finds no matches', async () => {
    const professionalId = 1;
    const searchQuery = 'NonExistentNameOrEmail';
    const mockPatientsData: Patient[] = []; // Esperamos un array vacío

    prismaClientMock.patient.findMany.mockResolvedValue(mockPatientsData);

    const result = await getPatientsForProfessional(professionalId, searchQuery);

    expect(result).toEqual([]);
    expect(prismaClientMock.patient.findMany).toHaveBeenCalledOnce();
    expect(prismaClientMock.patient.findMany).toHaveBeenCalledWith({
      where: {
        professionalId: professionalId,
        OR: [
          { firstName: { contains: searchQuery, mode: 'insensitive' } },
          { lastName: { contains: searchQuery, mode: 'insensitive' } },
          { email: { contains: searchQuery, mode: 'insensitive' } },
        ],
      },
      orderBy: { createdAt: 'desc' },
    });
  });

  it('should throw an error if Prisma client throws an error', async () => {
    const professionalId = 1;
    const errorMessage = 'Database connection lost';

    // Configurar el mock para que lance un error
    prismaClientMock.patient.findMany.mockRejectedValue(new Error(errorMessage));

    // Verificar que la función lanza un error
    // Usamos expect(...).rejects.toThrowError() para funciones asíncronas
    await expect(getPatientsForProfessional(professionalId)).rejects.toThrowError(errorMessage);
    
    expect(prismaClientMock.patient.findMany).toHaveBeenCalledOnce();
    expect(prismaClientMock.patient.findMany).toHaveBeenCalledWith({
      where: { professionalId: professionalId },
      orderBy: { createdAt: 'desc' },
    });
  });
}); 