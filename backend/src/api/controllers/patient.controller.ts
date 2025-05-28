import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../../middleware/auth.middleware'; // Importar para tipar req
import * as patientService from '../../services/patient.service'; // Importaremos el servicio

// Placeholder para la lógica de listar pacientes
export const listPatients = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const professionalPayload = req.professional; // Payload del JWT decodificado por el middleware

    if (!professionalPayload || !professionalPayload.professionalId) {
      // Esto no debería ocurrir si el middleware de autenticación funciona correctamente
      res.status(403).json({ message: 'Acceso denegado: Información del profesional no encontrada en el token.' });
      return;
    }

    const professionalId = professionalPayload.professionalId;
    const searchQuery = req.query.search as string | undefined;

    const patients = await patientService.getPatientsForProfessional(professionalId, searchQuery);
    
    // Por ahora, devolvemos directamente los pacientes del servicio.
    // Si necesitáramos un mapeo explícito a un PatientResponse DTO diferente al modelo de Prisma,
    // se haría aquí. Según el análisis anterior, los campos de Prisma Patient son adecuados.
    res.status(200).json(patients);

  } catch (error) {
    next(error); // Pasar errores al manejador de errores de Express
  }
};

// Lógica para obtener paciente por ID y detalles asociados
export const getPatientById = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const professionalPayload = req.professional; // Payload del JWT
    const patientId = parseInt(req.params.patientId, 10); // Obtener ID del paciente de los parámetros de la ruta

    // Verificar si professionalPayload existe (aunque el middleware debería asegurar esto)
    if (!professionalPayload || !professionalPayload.professionalId) {
      res.status(403).json({ message: 'Acceso denegado: Información del profesional no encontrada.' });
      return;
    }

    // Validar si patientId es un número válido
    if (isNaN(patientId)) {
        res.status(400).json({ message: 'ID de paciente no válido.' });
        return;
    }

    // Usar el servicio para obtener los detalles del paciente con verificación de propiedad
    const patientDetails = await patientService.getPatientDetailsForProfessional(
      professionalPayload.professionalId,
      patientId
    );

    // Si el servicio retorna null, significa que el paciente no existe o no pertenece a este profesional
    if (!patientDetails) {
      // Nota: No distinguimos entre no encontrado y no autorizado por seguridad
      res.status(404).json({ message: 'Paciente no encontrado o no tiene permiso para verlo.' });
      return;
    }

    // Si se encontró y pertenece al profesional, devolver los detalles
    res.status(200).json(patientDetails);

  } catch (error) {
    next(error); // Pasar errores al manejador de errores de Express
  }
};

// Controlador para crear un nuevo paciente (POST /api/patients)
export const createPatient = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    // Paso 3 del plan: Implementar validación de datos de entrada
    const { firstName, lastName, email, phone, birthDate, gender, height, initialBiometrics, medicalNotes, dietRestrictions, objectives } = req.body;

    // Validar campos obligatorios
    if (!firstName || !lastName) {
      res.status(400).json({ message: 'Nombre y apellido son campos obligatorios.' });
      return;
    }

    // Validar formato de email si está presente
    if (email && typeof email === 'string' && !/^[\w-]+(?:\.[\w-]+)*@(?:[\w-]+\.)+[a-zA-Z]{2,7}$/.test(email)) {
        res.status(400).json({ message: 'Formato de correo electrónico no válido.' });
        return;
    }

    // Validar formato de fecha de nacimiento si está presente
    if (birthDate && typeof birthDate === 'string' && isNaN(Date.parse(birthDate))) {
        res.status(400).json({ message: 'Formato de fecha de nacimiento no válido (esperado YYYY-MM-DD).' });
        return;
    }

    // Validar altura si está presente
    if (height !== undefined && height !== null && typeof height !== 'number') {
        res.status(400).json({ message: 'Altura debe ser un número.' });
        return;
    }

    // Validar datos biométricos iniciales si están presentes
    if (initialBiometrics !== undefined && initialBiometrics !== null) {
        if (typeof initialBiometrics !== 'object') {
            res.status(400).json({ message: 'Datos biométricos iniciales deben ser un objeto.' });
            return;
        }
        // Validar campos biométricos individuales si se proporcionan
        const { weight, bodyFatPercentage, musclePercentage, waterPercentage, backChestDiameter, waistDiameter, armsDiameter, legsDiameter, calvesDiameter, notes: bioNotes } = initialBiometrics;

        if (weight !== undefined && weight !== null && typeof weight !== 'number') {
            res.status(400).json({ message: 'Peso debe ser un número.' });
            return;
        }
        if (bodyFatPercentage !== undefined && bodyFatPercentage !== null && typeof bodyFatPercentage !== 'number') {
            res.status(400).json({ message: '% Grasa debe ser un número.' });
            return;
        }
         if (musclePercentage !== undefined && musclePercentage !== null && typeof musclePercentage !== 'number') {
            res.status(400).json({ message: '% Masa Muscular debe ser un número.' });
            return;
        }
        if (waterPercentage !== undefined && waterPercentage !== null && typeof waterPercentage !== 'number') {
            res.status(400).json({ message: '% Agua debe ser un número.' });
            return;
        }
        if (backChestDiameter !== undefined && backChestDiameter !== null && typeof backChestDiameter !== 'number') {
            res.status(400).json({ message: 'Diámetro espalda/pecho debe ser un número.' });
            return;
        }
        if (waistDiameter !== undefined && waistDiameter !== null && typeof waistDiameter !== 'number') {
            res.status(400).json({ message: 'Diámetro cintura debe ser un número.' });
            return;
        }
        if (armsDiameter !== undefined && armsDiameter !== null && typeof armsDiameter !== 'number') {
            res.status(400).json({ message: 'Diámetro brazos debe ser un número.' });
            return;
        }
        if (legsDiameter !== undefined && legsDiameter !== null && typeof legsDiameter !== 'number') {
            res.status(400).json({ message: 'Diámetro piernas debe ser un número.' });
            return;
        }
        if (calvesDiameter !== undefined && calvesDiameter !== null && typeof calvesDiameter !== 'number') {
            res.status(400).json({ message: 'Diámetro gemelos debe ser un número.' });
            return;
        }
         if (bioNotes !== undefined && bioNotes !== null && typeof bioNotes !== 'string') {
            res.status(400).json({ message: 'Notas biométricas deben ser un string.' });
            return;
        }

        // Opcional: Validar que al menos un campo biométrico esté presente si initialBiometrics está presente
        const hasBiometricData = [weight, bodyFatPercentage, musclePercentage, waterPercentage, backChestDiameter, waistDiameter, armsDiameter, legsDiameter, calvesDiameter].some(val => val !== undefined && val !== null);
        // Depende de la regla de negocio si initialBiometrics vacío está permitido. Por ahora, asumimos que si se envía el objeto, debe contener al menos una medida.
         if (!hasBiometricData && (bioNotes === undefined || bioNotes === null || bioNotes.trim() === '')) {
             res.status(400).json({ message: 'Si se proporcionan datos biométricos iniciales, debe incluir al menos una medida o nota.' });
             return;
         }
    }

    // Paso 4 del plan: Obtener professionalId del token (asumimos que authenticateToken ya lo adjuntó a req.professional)
    const professionalPayload = req.professional;
    if (!professionalPayload || !professionalPayload.professionalId) {
      // Esto no debería ocurrir si el middleware funciona, pero es una doble verificación
      res.status(403).json({ message: 'Acceso denegado: Información del profesional no encontrada.' });
      return;
    }
    const professionalId = professionalPayload.professionalId; // Asumiendo que professionalId es el nombre de la propiedad

    // Paso 5 y 6 del plan: Llamar al servicio para crear paciente y opcionalmente registro biométrico inicial
    // Nota: La lógica de creación del paciente y biométricos estará en el servicio.
    // Debemos pasar professionalId y los datos validados al servicio.
    const patientDataToCreate = {
        firstName,
        lastName,
        email,
        phone,
        birthDate: birthDate ? new Date(birthDate) : null, // Convertir fecha string a Date o null
        gender,
        height,
        medicalNotes,
        dietRestrictions,
        objectives
    };

    const createdPatient = await patientService.createPatientForProfessional(
      professionalId,
      patientDataToCreate,
      initialBiometrics // Pasar los datos biométricos iniciales al servicio
    );

    // Paso 7 del plan: Manejar respuestas de éxito (201)
    res.status(201).json(createdPatient); // Asumimos que el servicio devuelve el objeto del paciente creado (con IDs)

  } catch (error) {
    // Manejar errores del servicio o validaciones más complejas
    // Si es un error de validación específico del servicio o de negocio, manejarlo aquí
    // Por ahora, pasamos cualquier error no manejado a Express error handler
    next(error);
  }
};

// Controlador para actualizar un paciente existente (PUT /api/patients/:patientId)
export const updatePatient = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const professionalPayload = req.professional;
    const patientId = parseInt(req.params.patientId, 10);

    // Verificar token y validar patientId
    if (!professionalPayload || !professionalPayload.professionalId) {
      res.status(403).json({ message: 'Acceso denegado: Información del profesional no encontrada.' });
      return;
    }

    if (isNaN(patientId)) {
      res.status(400).json({ message: 'ID de paciente no válido.' });
      return;
    }

    // Extraer datos de la solicitud
    const { 
      firstName, 
      lastName, 
      email, 
      phone, 
      birthDate, 
      gender, 
      height, 
      medicalNotes, 
      dietRestrictions, 
      objectives 
    } = req.body;

    // Validar formato de email si está presente
    if (email !== undefined && email !== null && typeof email === 'string' && email.trim() !== '' && 
        !/^[\w-]+(?:\.[\w-]+)*@(?:[\w-]+\.)+[a-zA-Z]{2,7}$/.test(email)) {
      res.status(400).json({ message: 'Formato de correo electrónico no válido.' });
      return;
    }

    // Validar formato de fecha de nacimiento si está presente
    if (birthDate !== undefined && birthDate !== null && typeof birthDate === 'string' && 
        isNaN(Date.parse(birthDate))) {
      res.status(400).json({ message: 'Formato de fecha de nacimiento no válido (esperado YYYY-MM-DD).' });
      return;
    }

    // Validar altura si está presente
    if (height !== undefined && height !== null && typeof height !== 'number') {
      res.status(400).json({ message: 'Altura debe ser un número.' });
      return;
    }

    // Preparar objeto con datos a actualizar
    const patientDataToUpdate: any = {};

    // Solo añadir al objeto los campos que se han proporcionado
    if (firstName !== undefined) patientDataToUpdate.firstName = firstName;
    if (lastName !== undefined) patientDataToUpdate.lastName = lastName;
    if (email !== undefined) patientDataToUpdate.email = email;
    if (phone !== undefined) patientDataToUpdate.phone = phone;
    if (birthDate !== undefined) patientDataToUpdate.birthDate = birthDate ? new Date(birthDate) : null;
    if (gender !== undefined) patientDataToUpdate.gender = gender;
    if (height !== undefined) patientDataToUpdate.height = height;
    if (medicalNotes !== undefined) patientDataToUpdate.medicalNotes = medicalNotes;
    if (dietRestrictions !== undefined) patientDataToUpdate.dietRestrictions = dietRestrictions;
    if (objectives !== undefined) patientDataToUpdate.objectives = objectives;

    // Actualizar paciente a través del servicio
    const updatedPatient = await patientService.updatePatientForProfessional(
      professionalPayload.professionalId,
      patientId,
      patientDataToUpdate
    );

    // Manejar caso de paciente no encontrado o no pertenece al profesional
    if (!updatedPatient) {
      res.status(404).json({ message: 'Paciente no encontrado o no tiene permiso para actualizarlo.' });
      return;
    }

    // Devolver paciente actualizado
    res.status(200).json(updatedPatient);

  } catch (error) {
    next(error);
  }
};

// Aquí se añadirán otras funciones del controlador (DELETE) 