import { describe, it, expect, beforeEach, vi } from 'vitest';
// Importa el cliente Prisma TAL COMO LO HACE EL SERVICIO. 
// Vitest debería reemplazar esto con el contenido de __mocks__/prisma.client.ts
import prismaFromServicePerspective from '../config/db/prisma.client'; 
import { getPatientsForProfessional, createPatientForProfessional, updatePatientForProfessional } from './patient.service';
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

describe('PatientService - createPatientForProfessional', () => {
  beforeEach(() => {
    vi.resetAllMocks(); // Resetear todos los mocks antes de cada prueba
    // Mockear la transacción de Prisma en el beforeEach
    // Esto asegura que todas las pruebas en este bloque usen el mock de transacción
    prismaClientMock.$transaction.mockImplementation(async (callback) => {
        // Ejecutar el callback que contiene las llamadas a create
        // Pasar una instancia mockeada de prisma al callback
        return callback(prismaClientMock);
    });
  });

  it('debería crear un paciente exitosamente sin datos biométricos iniciales', async () => {
    const professionalId = 1;
    const patientData = {
      firstName: 'Nuevo',
      lastName: 'Paciente',
      email: 'nuevo.paciente@example.com',
    }; // Datos mínimos para crear paciente

    // Configurar el mock de Prisma para la creación del paciente
    // Asumimos que prisma.patient.create devuelve el objeto del paciente creado con ID
    const mockCreatedPatient = {
        id: 201, // Simula un ID generado por la BD
        professionalId: professionalId,
        ...patientData,
        phone: null,
        birthDate: null,
        gender: null,
        height: null,
        medicalNotes: null,
        dietRestrictions: null,
        objectives: null,
        createdAt: new Date(),
        updatedAt: new Date(),
    };
    prismaClientMock.patient.create.mockResolvedValue(mockCreatedPatient);

    // Ejecutar la función del servicio
    const result = await createPatientForProfessional(professionalId, patientData);

    // Aserciones
    expect(result).toEqual(mockCreatedPatient); // Verificar que la función devuelve el paciente creado
    expect(prismaClientMock.patient.create).toHaveBeenCalledOnce(); // Verificar que se llamó a prisma.patient.create una vez
    expect(prismaClientMock.patient.create).toHaveBeenCalledWith({
      data: {
        ...patientData,
        professionalId: professionalId,
      },
    });
    // Verificar que NO se llamó a prisma.biometricRecord.create
    expect(prismaClientMock.biometricRecord.create).not.toHaveBeenCalled();
  });

  it('debería crear un paciente y un registro biométrico inicial exitosamente', async () => {
    const professionalId = 1;
    const patientData = {
      firstName: 'Paciente Con Bio',
      lastName: 'Inicial',
    };
    const initialBiometrics = {
      weight: 75.5,
      recordDate: new Date('2023-11-01'),
      notes: 'Primera medición',
    }; // Datos biométricos iniciales

    // Configurar el mock de Prisma para la creación del paciente
    const mockCreatedPatient = {
        id: 202,
        professionalId: professionalId,
        ...patientData,
        email: null, phone: null, birthDate: null, gender: null, height: null,
        medicalNotes: null, dietRestrictions: null, objectives: null,
        createdAt: new Date(), updatedAt: new Date(),
    };
    prismaClientMock.patient.create.mockResolvedValue(mockCreatedPatient);

    // Configurar el mock de Prisma para la creación del registro biométrico
    const mockCreatedBiometric = {
        id: 301, // Simula ID generado
        patientId: mockCreatedPatient.id,
        ...initialBiometrics,
        bodyFatPercentage: null, musclePercentage: null, waterPercentage: null,
        backChestDiameter: null, waistDiameter: null, armsDiameter: null,
        legsDiameter: null, calvesDiameter: null,
        createdAt: new Date(),
    };
    prismaClientMock.biometricRecord.create.mockResolvedValue(mockCreatedBiometric);

    // Ejecutar la función del servicio
    const result = await createPatientForProfessional(professionalId, patientData, initialBiometrics);

    // Aserciones
    expect(result).toEqual(mockCreatedPatient); // Verificar que la función devuelve el paciente creado (el resultado de la transacción)
    expect(prismaClientMock.$transaction).toHaveBeenCalledOnce(); // Verificar que se llamó a $transaction
    expect(prismaClientMock.patient.create).toHaveBeenCalledOnce(); // Verificar que se llamó a patient.create dentro de la transacción
    expect(prismaClientMock.patient.create).toHaveBeenCalledWith({
      data: {
        ...patientData,
        professionalId: professionalId,
      },
    });
    expect(prismaClientMock.biometricRecord.create).toHaveBeenCalledOnce(); // Verificar que se llamó a biometricRecord.create dentro de la transacción
    expect(prismaClientMock.biometricRecord.create).toHaveBeenCalledWith({
        data: {
            // Usamos expect.objectContaining porque la fecha actual podría ser ligeramente diferente si se usa en el servicio
            // y también para ser flexibles con otros campos que podrían ser null.
            patientId: mockCreatedPatient.id,
            recordDate: initialBiometrics.recordDate, // Esperamos la fecha proporcionada en el mock
            weight: initialBiometrics.weight,
            notes: initialBiometrics.notes,
            // Puedes añadir expect.anything() o específicos para otros campos opcionales/null
            // expect.objectContaining permite verificar un subconjunto de propiedades
        }
    });
  });

   it('debería lanzar un error si falla la creación del paciente en la transacción', async () => {
       const professionalId = 1;
       const patientData = {
         firstName: 'Falla',
         lastName: 'Creacion',
       };
       const initialBiometrics = { weight: 80 };
       const errorMessage = 'Error de base de datos simulado en transacción'; // Mensaje de error más genérico
       const mockError = new Error(errorMessage);

       // Configurar el mock de Prisma para que la transacción completa falle/rechace
       // Esto simula que algo (como patient.create) falló DENTRO de la transacción
       prismaClientMock.$transaction.mockRejectedValue(mockError);

       // Aserción de que la llamada a la función del servicio lanza el error esperado
       await expect(createPatientForProfessional(professionalId, patientData, initialBiometrics)).rejects.toThrow(errorMessage);

       // Verificar que se llamó a $transaction
       expect(prismaClientMock.$transaction).toHaveBeenCalledOnce();

       // No necesitamos verificar llamadas internas como patient.create o biometricRecord.create aquí,
       // ya que estamos mockeando el fallo de la transacción completa. Esto simplifica la prueba
       // y la hace menos frágil a la simulación exacta del comportamiento transaccional del mock.
   });

    // TODO: Añadir más pruebas para validaciones de datos biométricos, etc.

  it('debería crear un paciente exitosamente con todos los campos opcionales y datos biométricos iniciales', async () => {
    const professionalId = 1;
    const patientData = {
      firstName: 'Paciente Completo',
      lastName: 'Con Todo',
      email: 'completo@example.com',
      phone: '111222333',
      birthDate: new Date('1998-08-20'),
      gender: 'Otro',
      height: 185.5,
      medicalNotes: 'Ninguna conocida, historial familiar de diabetes.',
      dietRestrictions: 'Vegetariano',
      objectives: 'Preparación para maratón.',
    };
    const initialBiometrics = {
      recordDate: new Date('2023-11-15'),
      weight: 78.0,
      bodyFatPercentage: 18.2,
      musclePercentage: 42.1,
      waterPercentage: 55.0,
      backChestDiameter: 105.0,
      waistDiameter: 82.0,
      armsDiameter: 32.5,
      legsDiameter: 60.0,
      calvesDiameter: 40.0,
      notes: 'Muy buena hidratación',
    }; // Datos biométricos iniciales completos

     // Configurar el mock de Prisma para la creación del paciente
    const mockCreatedPatient = {
        id: 203,
        professionalId: professionalId,
        ...patientData,
        createdAt: new Date(), updatedAt: new Date(),
    };
    prismaClientMock.patient.create.mockResolvedValue(mockCreatedPatient);

    // Configurar el mock de Prisma para la creación del registro biométrico
    const mockCreatedBiometric = {
        id: 302,
        patientId: mockCreatedPatient.id,
        ...initialBiometrics,
        createdAt: new Date(),
    };
    prismaClientMock.biometricRecord.create.mockResolvedValue(mockCreatedBiometric);

    // Ejecutar la función del servicio
    const result = await createPatientForProfessional(professionalId, patientData, initialBiometrics);

    // Aserciones
    expect(result).toEqual(mockCreatedPatient); // Debería devolver el paciente creado
    expect(prismaClientMock.$transaction).toHaveBeenCalledOnce();
    expect(prismaClientMock.patient.create).toHaveBeenCalledOnce();
    expect(prismaClientMock.patient.create).toHaveBeenCalledWith({
      data: { ...patientData, professionalId: professionalId },
    });
    expect(prismaClientMock.biometricRecord.create).toHaveBeenCalledOnce();
    expect(prismaClientMock.biometricRecord.create).toHaveBeenCalledWith({
        data: { patientId: mockCreatedPatient.id, ...initialBiometrics }
    });
  });

  it('debería usar la fecha actual para el registro biométrico si recordDate es nulo o inválido', async () => {
       const professionalId = 1;
       const patientData = {
         firstName: 'Paciente Bio Sin Fecha',
         lastName: 'Testing',
       };
       const initialBiometrics = {
         weight: 65.0,
         recordDate: null, // Fecha nula
         notes: 'Medición sin fecha específica',
       }; // Datos biométricos sin fecha

       // Configurar mocks
       const mockCreatedPatient = {
         id: 204,
         professionalId: professionalId,
         ...patientData,
         email: null, phone: null, birthDate: null, gender: null, height: null,
         medicalNotes: null, dietRestrictions: null, objectives: null,
         createdAt: new Date(), updatedAt: new Date(),
       };
       prismaClientMock.patient.create.mockResolvedValue(mockCreatedPatient);

       // Configurar el mock de Prisma para la creación del registro biométrico con un valor simple
       const mockCreatedBiometric = { // Mock simple que parece un registro creado
            id: 303,
            patientId: mockCreatedPatient.id,
            recordDate: new Date(), // El servicio debería generar esto
            weight: initialBiometrics.weight || null,
            bodyFatPercentage: null, musclePercentage: null, waterPercentage: null,
            backChestDiameter: null, waistDiameter: null, armsDiameter: null,
            legsDiameter: null, calvesDiameter: null,
            notes: initialBiometrics.notes || null,
            createdAt: new Date(),
       } as any; // Usar as any para simplificar el tipo de retorno mockeado
       prismaClientMock.biometricRecord.create.mockResolvedValue(mockCreatedBiometric);

       prismaClientMock.$transaction.mockImplementation(async (callback) => {
           return callback(prismaClientMock);
       });

       // Ejecutar la función del servicio
       const result = await createPatientForProfessional(professionalId, patientData, initialBiometrics);

       // Aserciones
       expect(result).toEqual(mockCreatedPatient); // Debería devolver el paciente creado
       expect(prismaClientMock.$transaction).toHaveBeenCalledOnce();
       expect(prismaClientMock.patient.create).toHaveBeenCalledOnce();
       expect(prismaClientMock.biometricRecord.create).toHaveBeenCalledOnce();

       // Verificar la llamada a biometricRecord.create, esperando que recordDate sea un objeto Date
       expect(prismaClientMock.biometricRecord.create).toHaveBeenCalledWith({
            data: expect.objectContaining({
                patientId: mockCreatedPatient.id,
                weight: initialBiometrics.weight,
                notes: initialBiometrics.notes,
                recordDate: expect.any(Date), // Esperamos que el servicio haya usado una instancia de Date
            })
       });
   });

   it('debería lanzar un error y revertir si falla la creación del registro biométrico en la transacción', async () => {
       const professionalId = 1;
       const patientData = {
         firstName: 'Falla Bio',
         lastName: 'Creacion',
       };
       const initialBiometrics = { weight: 85 };
       const errorMessage = 'Error de base de datos al crear registro biométrico';

       // Configurar el mock de Prisma para la creación del paciente (exitosa)
       const mockCreatedPatient = {
         id: 205,
         professionalId: professionalId,
         ...patientData,
         email: null, phone: null, birthDate: null, gender: null, height: null,
         medicalNotes: null, dietRestrictions: null, objectives: null,
         createdAt: new Date(), updatedAt: new Date(),
       };
       prismaClientMock.patient.create.mockResolvedValue(mockCreatedPatient);

       // Configurar el mock de Prisma para que biometricRecord.create falle
       prismaClientMock.biometricRecord.create.mockRejectedValue(new Error(errorMessage));

       // Mockear la transacción para que simule la ejecución secuencial y propague el error
       // Aquí, la mockImplementation debe ejecutar patient.create y luego, al intentar biometricRecord.create, lanzar el error.
       prismaClientMock.$transaction.mockImplementation(async (callback) => {
            // Ejecutar el callback con el mock de prisma
            // El callback internamente llamará a patient.create (que resolverá) y luego a biometricRecord.create (que rechazará)
            return callback(prismaClientMock);
       });

       // Aserción de que la llamada a la función del servicio lanza el error
       await expect(createPatientForProfessional(professionalId, patientData, initialBiometrics)).rejects.toThrow(errorMessage);

       // Verificar que se llamó a patient.create
       expect(prismaClientMock.patient.create).toHaveBeenCalledOnce();
        expect(prismaClientMock.patient.create).toHaveBeenCalledWith({
         data: {
           ...patientData,
           professionalId: professionalId,
         },
       });
       // Verificar que se llamó a biometricRecord.create (aunque falló)
       expect(prismaClientMock.biometricRecord.create).toHaveBeenCalledOnce();
       expect(prismaClientMock.biometricRecord.create).toHaveBeenCalledWith({
            data: expect.objectContaining({
                 patientId: mockCreatedPatient.id,
                 weight: initialBiometrics.weight,
                 // recordDate será Date, no podemos verificar null aquí
            })
       });
       // Nota: Verificar la *reversión* de la transacción (que patient.create se deshace) es difícil con mocks puros.
       // Esto se verifica mejor con pruebas de integración.
   });
});

describe('PatientService - updatePatientForProfessional', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('debería actualizar un paciente exitosamente cuando el profesional es propietario', async () => {
    const professionalId = 1;
    const patientId = 101;
    const patientDataToUpdate = {
      firstName: 'Nombre Actualizado',
      lastName: 'Apellido Actualizado',
      email: 'actualizado@example.com'
    };

    // Mock para simular que el paciente existe y pertenece al profesional
    prismaClientMock.patient.findFirst.mockResolvedValue({
      id: patientId,
      professionalId: professionalId,
      firstName: 'Nombre Original',
      lastName: 'Apellido Original',
      email: 'original@example.com',
      phone: null,
      birthDate: null,
      gender: null,
      height: null,
      medicalNotes: null,
      dietRestrictions: null,
      objectives: null,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    // Mock para simular la actualización exitosa
    const mockUpdatedPatient = {
      id: patientId,
      professionalId: professionalId,
      firstName: 'Nombre Actualizado',
      lastName: 'Apellido Actualizado',
      email: 'actualizado@example.com',
      phone: null,
      birthDate: null,
      gender: null,
      height: null,
      medicalNotes: null,
      dietRestrictions: null,
      objectives: null,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    prismaClientMock.patient.update.mockResolvedValue(mockUpdatedPatient);

    // Ejecutar la función del servicio
    const result = await updatePatientForProfessional(professionalId, patientId, patientDataToUpdate);

    // Aserciones
    expect(result).toEqual(mockUpdatedPatient);
    expect(prismaClientMock.patient.findFirst).toHaveBeenCalledOnce();
    expect(prismaClientMock.patient.findFirst).toHaveBeenCalledWith({
      where: {
        id: patientId,
        professionalId: professionalId
      }
    });
    expect(prismaClientMock.patient.update).toHaveBeenCalledOnce();
    expect(prismaClientMock.patient.update).toHaveBeenCalledWith({
      where: { id: patientId },
      data: patientDataToUpdate
    });
  });

  it('debería devolver null cuando el paciente no existe', async () => {
    const professionalId = 1;
    const patientId = 999; // ID inexistente
    const patientDataToUpdate = {
      firstName: 'Nombre Actualizado'
    };

    // Mock para simular que el paciente no existe
    prismaClientMock.patient.findFirst.mockResolvedValue(null);

    // Ejecutar la función del servicio
    const result = await updatePatientForProfessional(professionalId, patientId, patientDataToUpdate);

    // Aserciones
    expect(result).toBeNull();
    expect(prismaClientMock.patient.findFirst).toHaveBeenCalledOnce();
    expect(prismaClientMock.patient.findFirst).toHaveBeenCalledWith({
      where: {
        id: patientId,
        professionalId: professionalId
      }
    });
    expect(prismaClientMock.patient.update).not.toHaveBeenCalled();
  });

  it('debería devolver null cuando el paciente no pertenece al profesional', async () => {
    const professionalId = 1;
    const otherProfessionalId = 2; // Otro profesional
    const patientId = 101;
    const patientDataToUpdate = {
      firstName: 'Nombre Actualizado'
    };

    // Mock para simular que el paciente existe pero pertenece a otro profesional
    // En este escenario, prisma.patient.findFirst con where: { id: patientId, professionalId: professionalId }
    // debería devolver null porque professionalId no coincide con otherProfessionalId del paciente encontrado.
    prismaClientMock.patient.findFirst.mockResolvedValue(null); // Ajustado para devolver null

    // Ejecutar la función del servicio
    const result = await updatePatientForProfessional(professionalId, patientId, patientDataToUpdate);

    // Aserciones
    expect(result).toBeNull();
    expect(prismaClientMock.patient.findFirst).toHaveBeenCalledOnce();
    expect(prismaClientMock.patient.findFirst).toHaveBeenCalledWith({
      where: {
        id: patientId,
        professionalId: professionalId
      }
    });
    expect(prismaClientMock.patient.update).not.toHaveBeenCalled();
  });

  it('debería actualizar solo los campos proporcionados', async () => {
    const professionalId = 1;
    const patientId = 101;
    // Solo actualizamos email y medicalNotes
    const patientDataToUpdate = {
      email: 'nuevo.email@example.com',
      medicalNotes: 'Nuevas notas médicas'
    };

    // Mock para simular que el paciente existe y pertenece al profesional
    prismaClientMock.patient.findFirst.mockResolvedValue({
      id: patientId,
      professionalId: professionalId,
      firstName: 'Nombre Original',
      lastName: 'Apellido Original',
      email: 'original@example.com',
      phone: '123456789',
      birthDate: new Date('1990-01-01'),
      gender: 'Masculino',
      height: 175,
      medicalNotes: 'Notas originales',
      dietRestrictions: 'Sin restricciones',
      objectives: 'Objetivo original',
      createdAt: new Date(),
      updatedAt: new Date()
    });

    // Mock para simular la actualización exitosa
    const mockUpdatedPatient = {
      id: patientId,
      professionalId: professionalId,
      firstName: 'Nombre Original', // No cambia
      lastName: 'Apellido Original', // No cambia
      email: 'nuevo.email@example.com', // Cambia
      phone: '123456789', // No cambia
      birthDate: new Date('1990-01-01'), // No cambia
      gender: 'Masculino', // No cambia
      height: 175, // No cambia
      medicalNotes: 'Nuevas notas médicas', // Cambia
      dietRestrictions: 'Sin restricciones', // No cambia
      objectives: 'Objetivo original', // No cambia
      createdAt: new Date(),
      updatedAt: new Date()
    };
    prismaClientMock.patient.update.mockResolvedValue(mockUpdatedPatient);

    // Ejecutar la función del servicio
    const result = await updatePatientForProfessional(professionalId, patientId, patientDataToUpdate);

    // Aserciones
    expect(result).toEqual(mockUpdatedPatient);
    expect(prismaClientMock.patient.update).toHaveBeenCalledWith({
      where: { id: patientId },
      data: patientDataToUpdate // Solo debe contener email y medicalNotes
    });
  });

  it('debería manejar la actualización de un campo a null', async () => {
    const professionalId = 1;
    const patientId = 101;
    // Actualizamos email a null explícitamente
    const patientDataToUpdate = {
      email: null
    };

    // Mock para simular que el paciente existe y pertenece al profesional
    prismaClientMock.patient.findFirst.mockResolvedValue({
      id: patientId,
      professionalId: professionalId,
      firstName: 'Nombre',
      lastName: 'Apellido',
      email: 'email.existente@example.com', // Tiene un email
      phone: null,
      birthDate: null,
      gender: null,
      height: null,
      medicalNotes: null,
      dietRestrictions: null,
      objectives: null,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    // Mock para simular la actualización exitosa
    const mockUpdatedPatient = {
      id: patientId,
      professionalId: professionalId,
      firstName: 'Nombre',
      lastName: 'Apellido',
      email: null, // Email ahora es null
      phone: null,
      birthDate: null,
      gender: null,
      height: null,
      medicalNotes: null,
      dietRestrictions: null,
      objectives: null,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    prismaClientMock.patient.update.mockResolvedValue(mockUpdatedPatient);

    // Ejecutar la función del servicio
    const result = await updatePatientForProfessional(professionalId, patientId, patientDataToUpdate);

    // Aserciones
    expect(result).toEqual(mockUpdatedPatient);
    expect(prismaClientMock.patient.update).toHaveBeenCalledWith({
      where: { id: patientId },
      data: { email: null }
    });
  });

  it('debería lanzar un error si Prisma arroja un error', async () => {
    const professionalId = 1;
    const patientId = 101;
    const patientDataToUpdate = {
      firstName: 'Nombre Actualizado'
    };
    const errorMessage = 'Error de base de datos al actualizar';

    // Mock para simular que el paciente existe y pertenece al profesional
    prismaClientMock.patient.findFirst.mockResolvedValue({
      id: patientId,
      professionalId: professionalId,
      firstName: 'Nombre Original',
      lastName: 'Apellido Original',
      email: null,
      phone: null,
      birthDate: null,
      gender: null,
      height: null,
      medicalNotes: null,
      dietRestrictions: null,
      objectives: null,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    // Mock para simular un error en la actualización
    prismaClientMock.patient.update.mockRejectedValue(new Error(errorMessage));

    // Verificar que la función lanza un error
    await expect(updatePatientForProfessional(professionalId, patientId, patientDataToUpdate))
      .rejects.toThrow(errorMessage);

    expect(prismaClientMock.patient.findFirst).toHaveBeenCalledOnce();
    expect(prismaClientMock.patient.update).toHaveBeenCalledOnce();
  });
}); 