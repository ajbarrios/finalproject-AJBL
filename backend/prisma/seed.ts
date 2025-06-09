/// <reference types="node" />

import { PrismaClient, ProfessionType } from '../src/generated/prisma'; // PrismaClient y tipos

const prisma = new PrismaClient();

async function main() {
  console.log(`Iniciando el script de seed...`);

  // --- 0. Limpiar tablas --- 
  console.log('Limpiando la tabla Patient...');
  await prisma.patient.deleteMany({});
  console.log('Tabla Patient limpiada.');

  console.log('Limpiando la tabla Professional...');
  await prisma.professional.deleteMany({});
  console.log('Tabla Professional limpiada.');

  // --- 1. Crear/Asegurar el Profesional "ai4devs test" ---
  const professionalData = {
    id: 1, // ID especificado
    email: 'ai4devstest@email.com',
    passwordHash: '$2b$10$4CQ.1AOYRpE5M4IXFaW00.denRK1rym7gqPnpf/5WWpEbiha.ttXm',
    firstName: 'ai4devs', // Nombre interpretado
    lastName: 'test',  // Apellido interpretado
    profession: ProfessionType.NUTRITIONIST,
  };

  let professionalIdToUse: number;

  try {
    // Paso previo: Verificar si el email 'antonio@email.com' está en uso por OTRO profesional
    const conflictingProfessional = await prisma.professional.findUnique({
      where: { email: professionalData.email },
    });

    if (conflictingProfessional && conflictingProfessional.id !== professionalData.id) {
      // El email está en uso por otro profesional. Actualizar el email de ese otro profesional.
      const newEmailForConflict = `old_${Date.now()}_${conflictingProfessional.email}`;
      await prisma.professional.update({
        where: { id: conflictingProfessional.id },
        data: { email: newEmailForConflict },
      });
      console.log(`Email '${professionalData.email}' estaba en uso por ID ${conflictingProfessional.id}. Se actualizó a '${newEmailForConflict}'.`);
    }

    // Ahora proceder con el upsert para el profesional Antonio
    const professional = await prisma.professional.upsert({
      where: { id: professionalData.id },
      update: { // Campos a actualizar si el profesional con ID 1 ya existe
        email: professionalData.email,
        passwordHash: professionalData.passwordHash,
        firstName: professionalData.firstName,
        lastName: professionalData.lastName,
        profession: professionalData.profession,
      },
      create: professionalData, // Datos para crear, incluyendo el ID 1
    });
    console.log(`Profesional '${professional.firstName} ${professional.lastName}' (ID: ${professional.id}) procesado (creado/actualizado).`);
    professionalIdToUse = professional.id;
  } catch (error) {
    console.error(`Error al procesar el profesional con ID ${professionalData.id}:`, error);
    console.error('No se pudo crear/actualizar el profesional especificado. Saliendo del seed script.');
    process.exit(1); // 'process' está disponible gracias a la directiva triple-slash
  }

  // --- 2. Crear Pacientes (asignados al profesional procesado arriba) ---
  const patientsData = [
    {
      firstName: 'Elena',
      lastName: 'Gómez',
      email: 'elena.gomez@example.com',
      phone: '600111222',
      birthDate: new Date('1990-05-15'), // Formato YYYY-MM-DD
      gender: 'Femenino',
      height: 165,
      medicalNotes: 'Alergia al polen.',
      dietRestrictions: 'Ninguna conocida.',
      objectives: 'Mejorar condición física general.',
      professionalId: professionalIdToUse,
    },
    {
      firstName: 'Carlos',
      lastName: 'Ruiz',
      email: 'carlos.ruiz@example.com',
      phone: '600333444',
      birthDate: new Date('1985-11-20'),
      gender: 'Masculino',
      height: 180,
      objectives: 'Aumentar masa muscular.',
      professionalId: professionalIdToUse,
    },
    {
      firstName: 'Laura',
      lastName: 'Martínez',
      email: 'laura.martinez@example.com',
      phone: '600555666',
      birthDate: new Date('1995-02-10'),
      gender: 'Femenino',
      height: 170,
      medicalNotes: 'Asma leve, controlada.',
      dietRestrictions: 'Vegetariana.',
      objectives: 'Correr una media maratón.',
      professionalId: professionalIdToUse,
    },
    {
      firstName: 'David',
      lastName: 'Fernández',
      email: 'david.fernandez@example.com',
      // phone: null, // Opcional, se puede omitir
      birthDate: new Date('1978-09-03'),
      gender: 'Masculino',
      height: 175,
      objectives: 'Perder 5kg de peso.',
      professionalId: professionalIdToUse,
    },
    {
      firstName: 'Sofía',
      lastName: 'López',
      // email: null, // Opcional
      phone: '600777888',
      birthDate: new Date('2000-07-25'),
      gender: 'Femenino',
      height: 160,
      dietRestrictions: 'Intolerancia a la lactosa.',
      objectives: 'Tonificar y mejorar postura.',
      professionalId: professionalIdToUse,
    },
  ];

  console.log(`Creando ${patientsData.length} pacientes...`);
  for (const patientData of patientsData) {
    const patient = await prisma.patient.create({
      data: patientData,
    });
    console.log(`  Paciente creado: ${patient.firstName} ${patient.lastName} (ID: ${patient.id})`);
  }

  console.log('Seed script completado exitosamente.');
}

main()
  .catch((e) => {
    console.error('Error durante la ejecución del seed script:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 