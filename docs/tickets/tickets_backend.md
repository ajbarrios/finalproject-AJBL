# Tickets de Trabajo - Backend

### Ticket: TB-SC01
**Historia de Usuario Asociada:** N/A (Tarea de configuración inicial del proyecto)
**Título del Ticket:** Configuración Inicial y Scaffolding del Proyecto Backend (Node.js, Express, TypeScript, Prisma)
**Descripción:** Esta tarea se enfoca en establecer la base del servidor backend, incluyendo la configuración del framework, ORM, y herramientas de desarrollo. El objetivo es tener un API funcional mínima y una estructura organizada para el desarrollo futuro.
**Tareas Específicas:**
    1.  Inicializar un nuevo proyecto Node.js con TypeScript.
    2.  Instalar y configurar Express.js para manejar rutas y middleware.
    3.  Integrar Prisma ORM: inicializar Prisma, conectar a una base de datos PostgreSQL de desarrollo, y definir un `schema.prisma` básico inicial (puede ser solo una entidad de prueba para empezar).
    4.  Configurar ESLint y Prettier para TypeScript en el backend.
    5.  Establecer una estructura de carpetas base: `/src/api` (rutas, controladores), `/src/services` (lógica de negocio), `/src/config` (configuración de BD, auth, etc.), `/src/middleware`, `/src/utils`, `/prisma` (schema y migraciones).
    6.  Implementar scripts de desarrollo (`npm run dev`) utilizando `nodemon` o `ts-node-dev` para reinicio automático y compilación en caliente.
    7.  Implementar un script de compilación (`npm run build`) para transpilar TypeScript a JavaScript para producción.
    8.  Configurar el manejo de variables de entorno utilizando `dotenv` y un archivo `.env.example`.
    9.  Implementar un endpoint de prueba (ej. `GET /api/health`) para verificar que el servidor está funcionando.
    10. Crear un archivo `README.md` dentro de la carpeta `/backend` con instrucciones básicas.
**Criterios de Aceptación:**
    *   El servidor backend se inicia sin errores con `npm run dev`.
    *   El script de compilación `npm run build` funciona.
    *   ESLint y Prettier están configurados y funcionales.
    *   La estructura de carpetas inicial está implementada.
    *   Prisma está configurado y puede conectarse a la BD de desarrollo.
    *   El endpoint de prueba `GET /api/health` devuelve una respuesta exitosa.
    *   El `README.md` del backend está presente.
**Prioridad:** Crítica
**Estado:** Pendiente
**Estimación:** 6-8 horas
**Responsable:** Por asignar
**Etiquetas:** `backend`, `setup`, `scaffolding`, `nodejs`, `express`, `typescript`, `prisma`, `eslint`, `prettier`, `configuración`
---

## HU-001: Registro de Nuevo Profesional

---

**ID del Ticket:** TB-001
**Historia de Usuario Relacionada:** HU-001 - Registro de Nuevo Profesional
**Tipo:** Feature
**Prioridad:** Alta

**Descripción:**
Permitir que un nuevo profesional (nutricionista/entrenador) se registre en el sistema. El backend debe validar los datos, asegurar que el email no exista previamente, hashear la contraseña de forma segura y crear el nuevo registro de profesional.

**Tareas Específicas (Backend):**
1.  **Crear Endpoint de Registro:**
    *   Definir la ruta `POST /api/auth/register`.
2.  **Implementar Validación de Datos de Entrada:**
    *   Validar que `nombreCompleto`, `email`, `password`, y `profesion` están presentes y no son vacíos.
    *   Validar el formato del `email`.
    *   Validar que `profesion` sea uno de los valores permitidos (ej. "nutricionista", "entrenador").
    *   Implementar la lógica para verificar que el `email` no exista previamente en la tabla `PROFESSIONAL`.
3.  **Implementar Seguridad de Contraseña:**
    *   Utilizar una librería robusta (ej. bcrypt) para hashear la contraseña recibida antes de almacenarla.
    *   Asegurar que la contraseña original nunca se almacene en texto plano.
4.  **Lógica de Creación de Profesional:**
    *   Si todas las validaciones son correctas, crear un nuevo registro en la tabla `PROFESSIONAL`.
    *   Almacenar `nombreCompleto`, `email` (en minúsculas o como se decida normalizar), `password` (hasheada), y `profesion`.
    *   Poblar automáticamente los campos `created_at` y `updated_at`.
5.  **Definir Respuestas del API:**
    *   **Éxito (201 Created):**
        *   Devolver un mensaje de éxito.
        *   Opcionalmente, devolver los datos del profesional creado (excluyendo la contraseña hasheada).
    *   **Error de Validación (400 Bad Request):**
        *   Devolver un cuerpo de respuesta JSON con detalles específicos sobre los campos que fallaron la validación.
    *   **Conflicto - Email Duplicado (409 Conflict):**
        *   Devolver un error específico indicando que el email ya está registrado.
    *   **Error Interno del Servidor (500 Internal Server Error):**
        *   Manejar errores inesperados durante el proceso y devolver una respuesta genérica de error.
6.  **Pruebas Unitarias y de Integración (Backend):**
    *   Probar la lógica de validación para cada campo.
    *   Probar el caso de email duplicado.
    *   Probar el hasheo de contraseña.
    *   Probar la creación exitosa del profesional.
    *   Probar todos los códigos de respuesta del API.

**Criterios de Aceptación (Backend):**
*   El endpoint `POST /api/auth/register` está funcional.
*   Las validaciones de datos de entrada son exhaustivas y correctas.
*   La verificación de email duplicado funciona como se espera.
*   La contraseña se hashea y almacena de forma segura.
*   Se crea un nuevo registro de profesional en la base de datos tras un registro exitoso.
*   Las respuestas del API (éxito y errores) son correctas y devuelven los códigos de estado y cuerpos de respuesta adecuados.

**Etiquetas:** `backend`, `autenticación`, `registro`, `seguridad`, `HU-001`

---

## HU-002: Inicio de Sesión del Profesional

---

**ID del Ticket:** TB-002
**Historia de Usuario Relacionada:** HU-002 - Inicio de Sesión del Profesional
**Tipo:** Feature
**Prioridad:** Alta

**Descripción:**
Permitir que un profesional registrado inicie sesión validando sus credenciales (email y contraseña). Si la autenticación es exitosa, generar y devolver un token de sesión (JWT).

**Tareas Específicas (Backend):**
1.  **Crear Endpoint de Inicio de Sesión:**
    *   Definir la ruta `POST /api/auth/login`.
2.  **Implementar Validación de Datos de Entrada:**
    *   Validar que `email` y `password` están presentes y no son vacíos.
    *   Validar el formato del `email`.
3.  **Lógica de Autenticación de Profesional:**
    *   Buscar al profesional en la tabla `PROFESSIONAL` por el `email` proporcionado.
    *   Si el profesional no se encuentra, devolver un error de autenticación (401).
    *   Si se encuentra, comparar la `password` proporcionada con la contraseña hasheada almacenada, usando la misma librería y algoritmo (ej. bcrypt.compare).
    *   Si las contraseñas no coinciden, devolver un error de autenticación (401).
4.  **Generación de Token de Sesión (JWT):**
    *   Si la autenticación es exitosa, generar un token JWT.
    *   Incluir en el payload del JWT información esencial del usuario (ej. `professional_id`, `email`, `profesion`).
    *   Configurar una fecha de expiración para el token (ej. 1h, 24h, configurable).
    *   Firmar el token con un secreto seguro (almacenado en variables de entorno).
5.  **Definir Respuestas del API:**
    *   **Éxito (200 OK):**
        *   Devolver el token JWT generado.
        *   Opcionalmente, devolver información básica del usuario (nombre, email, profesión) para uso inmediato en el frontend.
    *   **Error de Validación (400 Bad Request):**
        *   Devolver detalles si los campos `email` o `password` están vacíos o el formato del email es incorrecto.
    *   **Credenciales Inválidas (401 Unauthorized):**
        *   Devolver un error si el email no se encuentra o la contraseña es incorrecta. Evitar dar pistas sobre cuál de los dos falló.
    *   **Error Interno del Servidor (500 Internal Server Error):**
        *   Manejar errores inesperados.
6.  **Pruebas Unitarias y de Integración (Backend):**
    *   Probar la validación de entrada.
    *   Probar la autenticación con credenciales correctas e incorrectas (email no existe, contraseña errónea).
    *   Probar la generación y estructura del JWT.
    *   Verificar todos los códigos de respuesta del API.

**Criterios de Aceptación (Backend):**
*   El endpoint `POST /api/auth/login` está funcional.
*   Las credenciales se validan correctamente contra la base de datos.
*   Se genera un JWT válido y seguro tras una autenticación exitosa.
*   Las respuestas del API (éxito y errores) son correctas y seguras (no revelan información sensible).

**Etiquetas:** `backend`, `autenticación`, `login`, `seguridad`, `jwt`, `HU-002`

---

## HU-003: Recuperación de Contraseña del Profesional

---

**ID del Ticket:** TB-003
**Historia de Usuario Relacionada:** HU-003 - Recuperación de Contraseña del Profesional (Simplificado para MVP)
**Tipo:** Task (Documentación/Proceso)
**Prioridad:** Baja (Simplificado para MVP)

**Descripción (Simplificado para MVP):**
No se implementará lógica de backend automatizada para la recuperación de contraseña. El proceso será manual, realizado por un administrador directamente en la base de datos a solicitud del usuario. Esta tarea consiste en documentar dicho proceso manual.

**Tareas Específicas (Backend - Simplificado para MVP):**
1.  **No Implementar Endpoints de Recuperación:**
    *   No se creará el endpoint `POST /api/auth/forgot-password`.
    *   No se creará el endpoint `POST /api/auth/reset-password`.
2.  **No Implementar Lógica de Tokens ni Emails:**
    *   No se generarán, almacenarán ni validarán tokens de reseteo.
    *   No se configurará ni se utilizará un servicio de envío de emails para este propósito.
3.  **Documentar el Proceso Manual de Recuperación de Contraseña:**
    *   Crear un documento interno (ej. en la wiki del proyecto o un archivo Markdown en `/docs/internal`) que describa los pasos que un administrador debe seguir para cambiar la contraseña de un profesional directamente en la base de datos (PostgreSQL).
    *   Incluir consideraciones de seguridad, como la necesidad de verificar la identidad del solicitante y cómo generar un hash seguro para la nueva contraseña si se proporciona en texto plano (o cómo guiar al usuario para que la cambie después del primer login con una temporal).
    *   Especificar las consultas SQL o comandos de Prisma necesarios para actualizar la contraseña hasheada del profesional.

**Criterios de Aceptación (Backend - Simplificado para MVP):**
*   No existe ninguna funcionalidad de API desplegada para la recuperación automática de contraseñas.
*   Existe un documento interno que detalla claramente el procedimiento manual para que un administrador restablezca la contraseña de un profesional.
*   El procedimiento documentado incluye los comandos o pasos necesarios para interactuar con la base de datos de forma segura.

**Etiquetas:** `backend`, `autenticación`, `recuperación de contraseña`, `proceso manual`, `documentación`, `HU-003`, `mvp-simplificado`

---

## HU-004: Cerrar Sesión del Profesional

---

**ID del Ticket:** TB-004
**Historia de Usuario Relacionada:** HU-004 - Cerrar Sesión del Profesional
**Tipo:** Feature
**Prioridad:** Baja

**Descripción:**
Permitir que un profesional cierre su sesión. Para el MVP, esto será principalmente una operación del lado del cliente (eliminar el token). El backend no implementará una lista negra de tokens en esta fase.

**Tareas Específicas (Backend):**
1.  **Para MVP (Sin lista negra en backend):**
    *   No se requiere un endpoint de logout específico en el backend.
    *   El cierre de sesión es manejado completamente por el cliente al descartar el token.
    *   El backend sigue validando tokens como antes (firma y expiración) en cada petición a rutas protegidas.

**Pruebas (Backend - No aplicable para MVP inicial si no se implementa lista negra):**
*   Probar que al llamar a `/api/auth/logout`, el token se añade a la lista negra.
*   Probar que un token añadido a la lista negra ya no puede usarse para acceder a endpoints protegidos (devuelve 401).
*   Probar que la lista negra maneja correctamente la expiración de los tokens (se auto-limpian).

**Criterios de Aceptación (Backend):**
*   **Para MVP:**
    *   No se requieren cambios específicos en el backend para el logout; la seguridad del JWT (firma y expiración) sigue siendo el mecanismo principal.
*   **(Post-MVP, si se implementa lista negra):**
    *   El endpoint `/api/auth/logout` funciona y añade tokens a la lista negra.
    *   Los tokens en lista negra son invalidados para accesos posteriores.

**Consideraciones Técnicas (Backend):**
*   Si se usa lista negra (Post-MVP): elección de la tecnología de almacenamiento (Redis es común por su velocidad y expiraciones nativas).
*   Impacto en el rendimiento del middleware de autenticación al tener que consultar la lista negra.

**Etiquetas:** `backend`, `autenticación`, `logout`, `seguridad`, `jwt`, `HU-004`

---

## HU-005: Registro de Nuevo Paciente

---

**ID del Ticket:** TB-005
**Historia de Usuario Relacionada:** HU-005 - Registro de Nuevo Paciente
**Tipo:** Feature
**Prioridad:** Alta

**Descripción:**
Permitir que un profesional autenticado registre un nuevo paciente, asociándolo a su cuenta. Si se proporcionan datos biométricos iniciales, crear también el primer registro biométrico.

**Tareas Específicas (Backend):**
1.  **Crear Endpoint de Creación de Paciente:**
    *   Definir la ruta `POST /api/patients` (protegida, requiere autenticación de profesional).
2.  **Implementar Validación de Datos de Entrada:**
    *   Aceptar todos los campos definidos para `PatientCreation` en el cuerpo de la solicitud (Nombre, Apellidos, Email, Teléfono, FechaNac, Género, Altura, datos biométricos iniciales, notas médicas, restricciones, objetivos).
    *   Validar campos obligatorios (ej. `firstName`, `lastName`).
    *   Validar tipos de datos y formatos (ej. email, fecha, números para altura/peso/porcentajes).
    *   Asegurar que los valores numéricos estén dentro de rangos razonables si es necesario.
3.  **Asociación con Profesional Autenticado:**
    *   Obtener el `professional_id` del token JWT del profesional autenticado.
    *   Este `professional_id` se guardará en el nuevo registro del paciente.
4.  **Lógica de Creación de Paciente:**
    *   Crear un nuevo registro en la tabla `PATIENT` con la información proporcionada y el `professional_id` asociado.
    *   Poblar `created_at` y `updated_at` para el paciente.
5.  **Lógica de Creación del Primer Registro Biométrico (Opcional):**
    *   Si en la solicitud se incluyen datos biométricos iniciales (ej. `initialBiometrics` con peso, altura, %grasa, etc.):
        *   Crear un nuevo registro en la tabla `BIOMETRIC_RECORD` asociado al `patient_id` recién creado.
        *   La `record_date` para este registro podría ser la fecha actual, o una fecha específica si se decide permitirla en `initialBiometrics`.
        *   Poblar `created_at` para el registro biométrico.
6.  **Definir Respuestas del API:**
    *   **Éxito (201 Created):**
        *   Devolver el objeto `PatientResponse` completo del paciente creado.
        *   Si se creó un registro biométrico inicial, podría incluirse también o referenciarse.
    *   **Error de Validación (400 Bad Request):**
        *   Devolver detalles específicos de los errores de validación.
    *   **No Autorizado (401 Unauthorized):**
        *   Si el profesional no está autenticado (token inválido o ausente).
    *   **Error Interno del Servidor (500 Internal Server Error):**
        *   Para errores inesperados.
7.  **Pruebas Unitarias y de Integración (Backend):**
    *   Probar la creación de paciente con y sin datos biométricos iniciales.
    *   Probar todas las validaciones de datos.
    *   Verificar la correcta asociación del paciente con el profesional.
    *   Verificar la correcta creación del registro biométrico inicial si aplica.
    *   Probar todos los códigos de respuesta del API.

**Criterios de Aceptación (Backend):**
*   El endpoint `POST /api/patients` es funcional y está protegido.
*   Los datos del paciente se validan correctamente.
*   Un nuevo paciente se crea y se asocia correctamente al `professional_id` del solicitante.
*   Si se proporcionan datos biométricos iniciales, se crea un `BIOMETRIC_RECORD` asociado.
*   Las respuestas del API (éxito y errores) son correctas.

**Consideraciones Técnicas (Backend):**
*   Manejo transaccional si la creación del paciente y su primer registro biométrico deben ser atómicos.
*   Validación de la estructura de `initialBiometrics` si se envía como un objeto anidado.

**Etiquetas:** `backend`, `pacientes`, `registro de paciente`, `biometría`, `HU-005`

---

## HU-006: Actualización de Información del Paciente

---

**ID del Ticket:** TB-006
**Historia de Usuario Relacionada:** HU-006 - Actualización de Información del Paciente
**Tipo:** Feature
**Prioridad:** Media

**Descripción:**
Permitir que un profesional autenticado actualice la información de un paciente existente que le pertenece. No se deben modificar datos biométricos aquí (eso se hace a través de `BIOMETRIC_RECORD`).

**Tareas Específicas (Backend):**
1.  **Crear Endpoint de Actualización de Paciente:**
    *   Definir la ruta `PUT /api/patients/{patientId}` (protegida).
    *   El `{patientId}` se tomará de la URL.
2.  **Implementar Validación de Datos de Entrada:**
    *   Aceptar en el cuerpo de la solicitud un subconjunto de los campos de `PatientCreation` (ej. `firstName`, `lastName`, `email`, `phone`, `birthDate`, `gender`, `height`, `medicalNotes`, `dietRestrictions`, `objectives`). Todos los campos son opcionales en una petición PUT para actualización parcial.
    *   Validar los tipos de datos y formatos para los campos que se proporcionen (ej. email, fecha).
    *   Asegurar que los valores numéricos (ej. `height`) estén dentro de rangos razonables si se proporcionan.
3.  **Verificación de Autorización y Propiedad:**
    *   Obtener el `professional_id` del token JWT.
    *   Buscar el paciente por `patientId`.
    *   Si el paciente no existe, devolver 404 Not Found.
    *   Verificar que el `professional_id` del paciente coincida con el `professional_id` del profesional autenticado. Si no coincide, devolver 403 Forbidden.
4.  **Lógica de Actualización de Paciente:**
    *   Si las validaciones y la autorización son correctas, actualizar solo los campos proporcionados en la solicitud para el paciente en la tabla `PATIENT`.
    *   Actualizar el campo `updated_at` del paciente.
5.  **Definir Respuestas del API:**
    *   **Éxito (200 OK):**
        *   Devolver el objeto `PatientResponse` completo del paciente actualizado.
    *   **Error de Validación (400 Bad Request):**
        *   Devolver detalles específicos si alguno de los campos proporcionados falla la validación.
    *   **No Autorizado (401 Unauthorized):**
        *   Si el token es inválido.
    *   **Prohibido (403 Forbidden):**
        *   Si el profesional intenta actualizar un paciente que no le pertenece.
    *   **No Encontrado (404 Not Found):**
        *   Si el `patientId` no corresponde a ningún paciente.
    *   **Error Interno del Servidor (500 Internal Server Error):**
        *   Para errores inesperados.
6.  **Pruebas Unitarias y de Integración (Backend):**
    *   Probar la actualización de diferentes campos del paciente.
    *   Probar validaciones para cada campo actualizable.
    *   Probar la lógica de autorización (éxito si es propietario, fallo si no lo es).
    *   Probar el caso de paciente no encontrado.
    *   Probar todos los códigos de respuesta del API.

**Criterios de Aceptación (Backend):**
*   El endpoint `PUT /api/patients/{patientId}` es funcional y está protegido.
*   Solo el profesional propietario puede actualizar la información de su paciente.
*   Los datos proporcionados se validan correctamente.
*   Solo los campos enviados en la petición se actualizan en la base de datos.
*   Se devuelve el paciente actualizado en la respuesta.

**Consideraciones Técnicas (Backend):**
*   Uso de `PATCH` podría ser semánticamente más correcto si se garantiza que solo se actualizan los campos enviados, pero `PUT` es común para actualizaciones completas o parciales si se maneja adecuadamente.
*   Asegurar que la lógica de actualización no permita modificar el `professional_id` del paciente u otros campos sensibles no previstos en esta HU.

**Etiquetas:** `backend`, `pacientes`, `edición de paciente`, `autorización`, `HU-006`

---

## HU-006.1 / Derivada: Eliminación de Paciente

---

**ID del Ticket:** TB-007
**Historia de Usuario Relacionada:** (Derivada de Gestión de Pacientes, implícita en CRUD)
**Tipo:** Feature
**Prioridad:** Media

**Descripción:**
Permitir que un profesional autenticado elimine (preferiblemente mediante soft delete) un paciente que le pertenece.

**Tareas Específicas (Backend):**
1.  **Crear Endpoint de Eliminación de Paciente:**
    *   Definir la ruta `DELETE /api/patients/{patientId}` (protegida).
2.  **Verificación de Autorización y Propiedad:**
    *   Obtener el `professional_id` del token JWT.
    *   Buscar el paciente por `patientId`.
    *   Si el paciente no existe (o ya está marcado como eliminado si es soft delete), devolver 404 Not Found.
    *   Verificar que el `professional_id` del paciente coincida con el `professional_id` del profesional autenticado. Si no coincide, devolver 403 Forbidden.
3.  **Lógica de Eliminación (Soft Delete Recomendado):**
    *   **Opción 1 (Soft Delete):**
        *   Añadir un campo a la tabla `PATIENT` (ej. `is_deleted` tipo booleano, o `deleted_at` tipo timestamp).
        *   Al eliminar, marcar `is_deleted = true` o establecer `deleted_at = CURRENT_TIMESTAMP`.
        *   Asegurar que los pacientes marcados como eliminados no aparezcan en las listas generales (HU-008) a menos que se indique explícitamente.
    *   **Opción 2 (Hard Delete):**
        *   Eliminar el registro del paciente de la tabla `PATIENT`.
        *   Considerar qué sucede con los registros relacionados (biométricos, planes de dieta/entrenamiento). ¿Se eliminan en cascada, se desvinculan, o se previene la eliminación si existen datos relacionados importantes?
        *   **Nota:** Soft delete es generalmente preferido para mantener la integridad referencial y la posibilidad de recuperación.
4.  **Definir Respuestas del API:**
    *   **Éxito (200 OK o 204 No Content):**
        *   Devolver un mensaje de éxito o simplemente una respuesta sin contenido.
    *   **No Autorizado (401 Unauthorized):**
        *   Si el token es inválido.
    *   **Prohibido (403 Forbidden):**
        *   Si el profesional intenta eliminar un paciente que no le pertenece.
    *   **No Encontrado (404 Not Found):**
        *   Si el `patientId` no corresponde a ningún paciente (activo).
    *   **Conflicto (409 Conflict - Opcional):**
        *   Si se intenta un hard delete y existen dependencias que lo previenen.
    *   **Error Interno del Servidor (500 Internal Server Error):**
        *   Para errores inesperados.
5.  **Pruebas Unitarias y de Integración (Backend):**
    *   Probar la eliminación (soft o hard) de un paciente.
    *   Probar la lógica de autorización.
    *   Probar el caso de paciente no encontrado.
    *   Si es soft delete, verificar que el paciente se marca correctamente y no aparece en listados generales.
    *   Si es hard delete, verificar la gestión de datos relacionados.

**Criterios de Aceptación (Backend):**
*   El endpoint `DELETE /api/patients/{patientId}` es funcional y está protegido.
*   Solo el profesional propietario puede eliminar a su paciente.
*   El paciente se elimina/marca como eliminado correctamente.
*   (Si soft delete) Los pacientes eliminados no interfieren con las operaciones normales.

**Consideraciones Técnicas (Backend):**
*   Decidir estrategia de eliminación (soft vs. hard delete) y sus implicaciones.
*   Si es soft delete, actualizar todas las consultas relevantes para filtrar pacientes no eliminados por defecto.
*   Si es hard delete, definir la política de eliminación en cascada o manejo de dependencias (constraints en BD).

**Etiquetas:** `backend`, `pacientes`, `eliminación de paciente`, `soft delete`, `autorización`, `HU-006.1`

---

## HU-008: Visualización del Dashboard Principal (Listar/Buscar Pacientes)

---

**ID del Ticket:** TB-008
**Historia de Usuario Relacionada:** HU-008 - Visualización del Dashboard Principal
**Tipo:** Feature
**Prioridad:** Alta

**Descripción:**
Proporcionar un endpoint para que el profesional autenticado pueda listar sus pacientes, con opción de búsqueda. Para el MVP, se devolverán todos los pacientes del profesional que coincidan con la búsqueda, sin paginación ni ordenación avanzada por parte del backend.

**Tareas Específicas (Backend):**
1.  **Crear Endpoint de Listado de Pacientes:**
    *   Definir la ruta `GET /api/patients` (protegida).
2.  **Lógica de Obtención de Pacientes:**
    *   Obtener el `professional_id` del token JWT del profesional autenticado.
    *   Consultar la tabla `PATIENT` para obtener todos los pacientes asociados a ese `professional_id`.
    *   (Si se implementó soft delete) Asegurarse de filtrar solo los pacientes activos (ej. `is_deleted = false` o `deleted_at IS NULL`).
3.  **Implementar Búsqueda:**
    *   Aceptar un parámetro de query opcional `search` (ej. `/api/patients?search=John Doe`).
    *   Si se proporciona `search`, modificar la consulta a la BD para filtrar pacientes donde `firstName`, `lastName`, o `email` contengan el término de búsqueda (case-insensitive).
    *   La consulta devolverá todos los pacientes que coincidan, ordenados por un criterio por defecto (ej. nombre o fecha de creación).
4.  **Definir Respuesta del API:**
    *   **Éxito (200 OK):**
        *   Devolver un array de objetos `PatientResponse` (o una versión simplificada para listas) directamente. Ejemplo: `[PatientResponse, PatientResponse, ...]`
    *   **No Autorizado (401 Unauthorized):**
        *   Si el token es inválido.
    *   **Error Interno del Servidor (500 Internal Server Error):**
        *   Para errores inesperados.
5.  **Pruebas Unitarias y de Integración (Backend):**
    *   Probar el listado básico de pacientes para un profesional.
    *   Probar la búsqueda con diferentes términos.
    *   Verificar que se devuelven todos los pacientes del profesional autenticado y activos (si aplica soft delete) que coinciden con la búsqueda, y que están en el orden por defecto esperado.

**Criterios de Aceptación (Backend):**
*   El endpoint `GET /api/patients` es funcional y está protegido.
*   Devuelve solo los pacientes (activos) del profesional autenticado.
*   La búsqueda por nombre/email funciona correctamente.
*   La respuesta del API es un array de pacientes (o una estructura que contenga directamente el array) con el formato `PatientResponse`.
*   Los pacientes se devuelven con un orden por defecto.

**Consideraciones Técnicas (Backend):**
*   Optimización de consultas a la BD, especialmente con búsqueda.
*   Consistencia en el formato de `PatientResponse` devuelto aquí y en otros endpoints.

**Etiquetas:** `backend`, `pacientes`, `dashboard`, `listado`, `búsqueda`, `HU-008`

---

## HU-009: Visualización del Perfil Detallado del Paciente

---

**ID del Ticket:** TB-009
**Historia de Usuario Relacionada:** HU-009 - Visualización del Perfil Detallado del Paciente
**Tipo:** Feature
**Prioridad:** Alta

**Descripción:**
Proporcionar un endpoint para obtener los detalles completos de un paciente específico, incluyendo su información, el último registro biométrico y resúmenes de sus planes de dieta y entrenamiento.

**Tareas Específicas (Backend):**
1.  **Crear Endpoint de Obtención de Detalles del Paciente:**
    *   Definir la ruta `GET /api/patients/{patientId}` (protegida).
2.  **Verificación de Autorización y Propiedad:**
    *   Obtener el `professional_id` del token JWT.
    *   Buscar el paciente por `patientId` en la URL.
    *   Si el paciente no existe (o está soft-deleted), devolver 404 Not Found.
    *   Verificar que el `professional_id` del paciente coincida con el `professional_id` del profesional autenticado. Si no, devolver 403 Forbidden.
3.  **Obtener Datos del Paciente:**
    *   Recuperar todos los campos del paciente (equivalente a `PatientResponse`).
4.  **Obtener Último Registro Biométrico:**
    *   Consultar la tabla `BIOMETRIC_RECORD` para obtener el registro más reciente (`ORDER BY record_date DESC, createdAt DESC LIMIT 1`) para el `patientId` dado.
    *   Si no hay registros, este campo en la respuesta será `null` o se omitirá.
5.  **Obtener Resúmenes de Planes de Dieta:**
    *   Consultar la tabla `DIET_PLAN` para el `patientId`.
    *   Para cada plan, devolver un resumen (ej. `id`, `title`, `isActive` o `status`, `startDate`, `endDate`).
    *   Ordenar los planes (ej. por fecha de inicio descendente o estado activo primero).
6.  **Obtener Resúmenes de Planes de Entrenamiento:**
    *   Consultar la tabla `WORKOUT_PLAN` para el `patientId`.
    *   Para cada plan, devolver un resumen similar (ej. `id`, `title`, `isActive` o `status`, `startDate`, `endDate`).
    *   Ordenar los planes.
7.  **Definir Respuesta del API:**
    *   **Éxito (200 OK):**
        *   Devolver un objeto que contenga:
            *   Los campos de `PatientResponse`.
            *   `lastBiometricRecord`: objeto `BiometricRecordResponse` o `null`.
            *   `dietPlansSummary`: array de objetos resumen de planes de dieta.
            *   `workoutPlansSummary`: array de objetos resumen de planes de entrenamiento.
        *   Referenciar el esquema de la OpenAPI para esta respuesta combinada.
    *   **No Autorizado (401 Unauthorized).**
    *   **Prohibido (403 Forbidden).**
    *   **No Encontrado (404 Not Found).**
    *   **Error Interno del Servidor (500 Internal Server Error).**
8.  **Pruebas Unitarias y de Integración (Backend):**
    *   Probar con un paciente que tenga todos los datos (biométricos, planes).
    *   Probar con un paciente nuevo sin biométricos ni planes.
    *   Probar la lógica de autorización (propietario vs no propietario).
    *   Probar el caso de paciente no encontrado.
    *   Verificar la estructura de la respuesta y la correctitud de los datos agregados.

**Criterios de Aceptación (Backend):**
*   El endpoint `GET /api/patients/{patientId}` es funcional y está protegido.
*   Devuelve los detalles completos del paciente solicitado si el profesional es propietario.
*   Incluye correctamente el último registro biométrico y los resúmenes de planes.
*   Maneja adecuadamente los casos de paciente no encontrado o acceso no autorizado.

**Consideraciones Técnicas (Backend):**
*   Optimización de las consultas para agregar `lastBiometricRecord` y los resúmenes de planes de manera eficiente (ej. usando subconsultas, JOINs si es apropiado, o múltiples queries secuenciales si son más simples/eficientes para el ORM).
*   Asegurar que solo se devuelven planes y registros del paciente especificado.

**Etiquetas:** `backend`, `pacientes`, `perfil de paciente`, `visualización`, `agregación de datos`, `HU-009`

---

## HU-010: Registro de Nuevas Medidas Biométricas

---

**ID del Ticket:** TB-010
**Historia de Usuario Relacionada:** HU-010 - Registro de Nuevas Medidas Biométricas
**Tipo:** Feature
**Prioridad:** Alta

**Descripción:**
Permitir que un profesional autenticado registre un nuevo conjunto de medidas biométricas para un paciente específico en una fecha determinada.

**Tareas Específicas (Backend):**
1.  **Crear Endpoint de Creación de Registro Biométrico:**
    *   Definir la ruta `POST /api/patients/{patientId}/biometric-records` (protegida).
    *   El `{patientId}` se tomará de la URL.
2.  **Verificación de Autorización y Propiedad del Paciente:**
    *   Obtener el `professional_id` del token JWT.
    *   Buscar el paciente por `patientId`.
    *   Si el paciente no existe o está soft-deleted, devolver 404 Not Found.
    *   Verificar que el `professional_id` del paciente coincida con el `professional_id` del profesional autenticado. Si no, devolver 403 Forbidden.
3.  **Implementar Validación de Datos de Entrada (`BiometricRecordCreation`):**
    *   Aceptar todos los campos definidos para `BiometricRecordCreation` en el cuerpo de la solicitud (`recordDate`, `weight`, `bodyFatPercentage`, etc.).
    *   Validar que `recordDate` es obligatoria y tiene formato de fecha válido.
    *   Validar que al menos uno de los campos de medida (peso, %grasa, etc.) esté presente y tenga un valor.
    *   Validar tipos de datos (numéricos para medidas) y rangos lógicos si es necesario.
4.  **Lógica de Creación de Registro Biométrico:**
    *   Si las validaciones y la autorización son correctas, crear un nuevo registro en la tabla `BIOMETRIC_RECORD`.
    *   Asociar el registro al `patientId` de la URL.
    *   Poblar `created_at` (no `updated_at` para esta tabla usualmente).
5.  **Definir Respuestas del API:**
    *   **Éxito (201 Created):**
        *   Devolver el objeto `BiometricRecordResponse` completo del registro recién creado.
    *   **Error de Validación (400 Bad Request):** Detalles de los errores.
    *   **No Autorizado (401) / Prohibido (403) / No Encontrado (404):** Manejar errores.
    *   **Error Interno del Servidor (500 Internal Server Error).**
6.  **Pruebas Unitarias y de Integración (Backend):**
    *   Probar la creación de un registro biométrico con varios campos.
    *   Probar validaciones (fecha obligatoria, al menos una medida, formatos numéricos).
    *   Probar la lógica de autorización (propietario del paciente).
    *   Probar el caso de paciente no encontrado.

**Criterios de Aceptación (Backend):**
*   El endpoint `POST /api/patients/{patientId}/biometric-records` es funcional y protegido.
*   Solo el profesional propietario del paciente puede añadirle registros biométricos.
*   Los datos del registro biométrico se validan correctamente.
*   Se crea un nuevo registro en `BIOMETRIC_RECORD` asociado al paciente correcto.
*   Se devuelve el registro creado en la respuesta.

**Consideraciones Técnicas (Backend):**
*   Asegurar la correcta asociación con `patient_id`.
*   Manejo de la zona horaria para `recordDate` si es relevante (generalmente las fechas se almacenan en UTC o sin zona horaria y se interpretan en el frontend).

**Etiquetas:** `backend`, `pacientes`, `biometría`, `registros biométricos`, `HU-010`

---

## HU-011: Visualización de la Evolución de Métricas

---

**ID del Ticket:** TB-011
**Historia de Usuario Relacionada:** HU-011 - Visualización de la Evolución de Métricas
**Tipo:** Feature
**Prioridad:** Media

**Descripción:**
Proporcionar un endpoint para que un profesional autenticado pueda listar todos los registros biométricos de un paciente específico, con opción de filtrar por rango de fechas.

**Tareas Específicas (Backend):**
1.  **Crear/Modificar Endpoint de Listado de Registros Biométricos:**
    *   Utilizar el endpoint `GET /api/patients/{patientId}/biometric-records` (ya definido en la OpenAPI y parcialmente en TB-010, pero aquí se enfoca en el listado completo y filtrado).
2.  **Verificación de Autorización y Propiedad del Paciente:**
    *   Misma lógica que en TB-010 (obtener `professional_id` del JWT, verificar propiedad del paciente).
3.  **Lógica de Obtención de Registros Biométricos:**
    *   Consultar la tabla `BIOMETRIC_RECORD` para obtener todos los registros asociados al `patientId`.
    *   Ordenar los registros por `recordDate` (descendente o ascendente, según se prefiera para visualización, ej. más reciente primero).
4.  **Implementar Filtrado por Rango de Fechas:**
    *   Aceptar parámetros de query opcionales `startDate` y `endDate` (ej. `/api/patients/{patientId}/biometric-records?startDate=AAAA-MM-DD&endDate=AAAA-MM-DD`).
    *   Si se proporcionan, modificar la consulta a la BD para filtrar registros donde `recordDate` esté dentro del rango (inclusivo).
    *   Validar el formato de las fechas.
5.  **Definir Respuesta del API:**
    *   **Éxito (200 OK):**
        *   Devolver un array de objetos `BiometricRecordResponse`.
    *   **No Autorizado (401 Unauthorized).**
    *   **Prohibido (403 Forbidden).**
    *   **No Encontrado (404 Not Found):** Si el `patientId` no existe.
    *   **Error de Validación (400 Bad Request):** Si las fechas de filtro son inválidas.
    *   **Error Interno del Servidor (500 Internal Server Error).**
6.  **Pruebas Unitarias y de Integración (Backend):**
    *   Probar el listado completo de registros para un paciente.
    *   Probar el filtrado con `startDate` y `endDate` (casos con y sin resultados).
    *   Probar la ordenación de los registros.
    *   Probar la autorización.

**Criterios de Aceptación (Backend):**
*   El endpoint `GET /api/patients/{patientId}/biometric-records` devuelve la lista de registros biométricos del paciente (del profesional).
*   El filtrado por rango de fechas (`startDate`, `endDate`) funciona correctamente.
*   Los registros se devuelven ordenados por fecha.

**Consideraciones Técnicas (Backend):**
*   Eficiencia de la consulta, especialmente si un paciente tiene muchos registros.
*   Paginación podría considerarse aquí también si se espera un volumen muy alto de registros por paciente, aunque la HU no lo especifica explícitamente para esta vista (sí para la lista de pacientes).

**Etiquetas:** `backend`, `pacientes`, `biometría`, `historial biométrico`, `filtrado`, `HU-011`

---

## HU-012: Creación Básica de Plan de Dieta

---

**ID del Ticket:** TB-012
**Historia de Usuario Relacionada:** HU-012 - Creación Básica de Plan de Dieta
**Tipo:** Feature
**Prioridad:** Alta

**Descripción:**
Permitir que un profesional autenticado cree un nuevo plan de dieta para un paciente específico, incluyendo detalles del plan y múltiples comidas.

**Tareas Específicas (Backend):**
1.  **Crear Endpoint de Creación de Plan de Dieta:**
    *   Definir la ruta `POST /api/patients/{patientId}/diet-plans` (protegida).
    *   El `{patientId}` se toma de la URL.
2.  **Verificación de Autorización y Propiedad del Paciente:**
    *   Misma lógica que en tickets anteriores para endpoints anidados de paciente.
3.  **Implementar Validación de Datos de Entrada (`DietPlanCreation`):**
    *   Validar el cuerpo de la solicitud contra `DietPlanCreation`.
    *   Campos del plan: `title` (obligatorio), `description`, `startDate`, `endDate`, `objectives`, `status`, `notes`.
    *   Validar fechas.
    *   Campo `meals`: array de `DietMealCreation`.
        *   Para cada comida: `mealType` (obligatorio), `content` (obligatorio).
        *   Validar que `days` y `meals` no estén vacíos si es un requisito.
4.  **Lógica de Creación (Transaccional):**
    *   Obtener `professional_id` del token.
    *   Iniciar transacción.
    *   Crear registro en `DIET_PLAN` (asociado a `patientId`, `professional_id`).
    *   Para cada objeto `day` en el array `days`:
        *   Crear registro en `DIET_DAY` (asociado al `diet_plan_id`).
        *   Para cada objeto `meal` en el array `meals` del día:
            *   Crear registro en `DIET_MEAL` (asociado al `diet_day_id`).
    *   Confirmar transacción. Revertir en caso de error.
5.  **Definir Respuestas del API:**
    *   **Éxito (201 Created):**
        *   Devolver `DietPlanResponse` completo, con IDs generados para el plan, días y comidas.
    *   **Error de Validación (400).**
    *   **No Autorizado (401) / Prohibido (403) / No Encontrado (404 Paciente).**
    *   **Error Interno del Servidor (500).**
6.  **Pruebas Unitarias y de Integración (Backend):**
    *   Probar creación completa de plan con días y comidas.
    *   Probar todas las validaciones anidadas.
    *   Probar lógica transaccional.
    *   Probar autorización.

**Criterios de Aceptación (Backend):**
*   Endpoint `POST /api/patients/{patientId}/diet-plans` funcional y protegido.
*   Datos del plan, días y comidas se validan.
*   Se crea el plan, días y comidas asociados de forma transaccional.
*   Se asocia al paciente y profesional correctos.
*   Se devuelve el plan completo con todos los IDs.

**Consideraciones Técnicas (Backend):**
*   Manejo de transacciones para la creación anidada.
*   Asegurar que todos los IDs generados se devuelvan.

**Etiquetas:** `backend`, `pacientes`, `dietas`, `planes de dieta`, `creación`, `transacciones`, `HU-012`

---

## HU-013: Visualización de Detalles de un Plan de Dieta

---

**ID del Ticket:** TB-013
**Historia de Usuario Relacionada:** HU-013 - Visualización de Detalles de un Plan de Dieta
**Tipo:** Feature
**Prioridad:** Media

**Descripción:**
Proporcionar un endpoint para obtener los detalles completos de un plan de dieta específico, incluyendo todas sus comidas asociadas.

**Tareas Específicas (Backend):**
1.  **Crear Endpoint de Obtención de Detalles del Plan de Dieta:**
    *   Definir la ruta `GET /api/diet-plans/{dietPlanId}` (protegida).
2.  **Verificación de Autorización (Propiedad del Plan):**
    *   Obtener el `professional_id` del token JWT.
    *   Buscar el plan de dieta por `dietPlanId` e incluir información del profesional que lo creó (o el paciente asociado, para derivar al profesional).
    *   Si el plan no existe, devolver 404 Not Found.
    *   Verificar que el `professional_id` asociado al plan (directamente o a través del paciente del plan) coincida con el `professional_id` del profesional autenticado. Si no, devolver 403 Forbidden.
3.  **Obtener Datos del Plan de Dieta y sus Comidas:**
    *   Recuperar todos los campos del plan de dieta de la tabla `DIET_PLAN`.
    *   Recuperar todas las comidas asociadas de la tabla `DIET_MEAL` (ordenadas por `id` o un campo de orden si existe).
4.  **Definir Respuesta del API:**
    *   **Éxito (200 OK):**
        *   Devolver el objeto `DietPlanResponse` completo, que incluye los datos del plan y un array `meals` con todas sus comidas detalladas (con sus IDs).
    *   **No Autorizado (401 Unauthorized).**
    *   **Prohibido (403 Forbidden).**
    *   **No Encontrado (404 Not Found):** Si el `dietPlanId` no existe.
    *   **Error Interno del Servidor (500 Internal Server Error).**
5.  **Pruebas Unitarias y de Integración (Backend):**
    *   Probar la obtención de un plan de dieta con múltiples comidas.
    *   Probar con un plan que no tenga comidas (si es un caso válido).
    *   Probar la lógica de autorización (propietario vs no propietario).
    *   Probar el caso de plan no encontrado.
    *   Verificar que la estructura de la respuesta (`DietPlanResponse`) es correcta.

**Criterios de Aceptación (Backend):**
*   El endpoint `GET /api/diet-plans/{dietPlanId}` es funcional y está protegido.
*   Devuelve los detalles completos del plan de dieta solicitado, incluyendo todas sus comidas, si el profesional es propietario.
*   Maneja adecuadamente los casos de plan no encontrado o acceso no autorizado.

**Consideraciones Técnicas (Backend):**
*   Uso de JOINs o consultas separadas (manejadas por el ORM) para obtener el plan y sus comidas de manera eficiente.
*   Asegurar que la respuesta coincida con el esquema `DietPlanResponse` definido en la OpenAPI.

**Etiquetas:** `backend`, `dietas`, `planes de dieta`, `visualización`, `HU-013`

---

## HU-014: Modificación de un Plan de Dieta Existente

---

**ID del Ticket:** TB-014
**Historia de Usuario Relacionada:** HU-014 - Modificación de un Plan de Dieta Existente
**Tipo:** Feature
**Prioridad:** Media

**Descripción:**
Permitir que un profesional autenticado modifique un plan de dieta existente que le pertenece, incluyendo su información general y la gestión de sus comidas (añadir, editar, eliminar).

**Tareas Específicas (Backend):**
1.  **Crear Endpoint de Actualización de Plan de Dieta:**
    *   Definir la ruta `PUT /api/diet-plans/{dietPlanId}` (protegida).
2.  **Verificación de Autorización (Propiedad del Plan):**
    *   Misma lógica que en TB-013.
3.  **Implementar Validación de Datos de Entrada:**
    *   Aceptar una estructura similar a `DietPlanCreation` pero donde las comidas (`meals`) pueden opcionalmente tener un `id` (si son existentes) o no (si son nuevas).
    *   Validar todos los campos del plan y de cada comida como en TB-012.
4.  **Lógica de Actualización (Transaccional y Compleja):**
    *   Iniciar una transacción.
    *   Actualizar los campos del `DIET_PLAN` en la base de datos.
    *   **Gestión de Comidas:**
        *   Obtener todas las comidas existentes en la BD para este `dietPlanId`.
        *   Comparar con el array `meals` recibido:
            *   **Comidas Nuevas:** Si una comida en el array no tiene `id`, crearla en `DIET_MEAL` asociada al plan.
            *   **Comidas Actualizadas:** Si una comida en el array tiene un `id` que coincide con una existente en BD, actualizar sus campos (`mealType`, `content`).
            *   **Comidas Eliminadas:** Si una comida existente en la BD no está presente en el array `meals` recibido (comparando por `id`), eliminarla de `DIET_MEAL`.
        *   Alternativamente, si el frontend envía explícitamente qué comidas eliminar, procesar esas eliminaciones.
    *   Confirmar la transacción. Revertir en caso de error.
5.  **Definir Respuestas del API:**
    *   **Éxito (200 OK):**
        *   Devolver el objeto `DietPlanResponse` completo del plan actualizado, con todas sus comidas (incluyendo IDs de las nuevas y actualizadas).
    *   **Error de Validación (400 Bad Request).**
    *   **No Autorizado (401) / Prohibido (403) / No Encontrado (404 Plan).**
    *   **Error Interno del Servidor (500).**
6.  **Pruebas Unitarias y de Integración (Backend):**
    *   Probar la actualización de campos del plan.
    *   Probar añadir nuevas comidas a un plan existente.
    *   Probar actualizar comidas existentes.
    *   Probar eliminar comidas de un plan.
    *   Probar una combinación de todas las operaciones anteriores en una sola petición.
    *   Probar la lógica transaccional.
    *   Probar autorización y casos de error.

**Criterios de Aceptación (Backend):**
*   El endpoint `PUT /api/diet-plans/{dietPlanId}` es funcional y protegido.
*   Se pueden modificar los detalles del plan y sus comidas (añadir/editar/eliminar).
*   La lógica de sincronización de comidas es correcta y transaccional.
*   Solo el profesional propietario puede modificar el plan.
*   Se devuelve el plan actualizado completo.

**Consideraciones Técnicas (Backend):**
*   La lógica para sincronizar el array de comidas es la parte más compleja. Requiere comparar el estado actual en BD con el estado deseado enviado por el cliente.
*   Una estrategia podría ser: eliminar todas las comidas existentes para el plan y recrearlas según el array enviado. Esto es más simple pero puede ser ineficiente y perder IDs si no se maneja con cuidado.
*   Una estrategia más robusta es la de 3 pasos (crear nuevas, actualizar existentes, eliminar las que no vienen).

**Etiquetas:** `backend`, `dietas`, `planes de dieta`, `edición`, `transacciones`, `HU-014`

---

## HU-014_A: Eliminación de un Plan de Dieta

---

**ID del Ticket:** TB-014A
**Historia de Usuario Relacionada:** HU-014_A - Eliminación de un Plan de Dieta
**Tipo:** Feature
**Prioridad:** Media

**Descripción:**
Permitir que un profesional autenticado elimine (preferiblemente soft delete) un plan de dieta existente que le pertenece.

**Tareas Específicas (Backend):**
1.  **Crear Endpoint de Eliminación de Plan de Dieta:**
    *   Definir la ruta `DELETE /api/diet-plans/{dietPlanId}` (protegida).
2.  **Verificación de Autorización (Propiedad del Plan):**
    *   Misma lógica que en TB-013/TB-014.
3.  **Lógica de Eliminación (Soft Delete Recomendado):**
    *   **Opción 1 (Soft Delete):**
        *   Añadir un campo a `DIET_PLAN` (ej. `is_deleted` o `deleted_at`).
        *   Marcar el plan como eliminado.
        *   Considerar si las comidas (`DIET_MEAL`) asociadas también se marcan o se dejan (ya que pertenecen a un plan eliminado).
    *   **Opción 2 (Hard Delete):**
        *   Eliminar el registro de `DIET_PLAN`.
        *   Definir si las `DIET_MEAL` asociadas se eliminan en cascada (recomendado).
4.  **Definir Respuestas del API:**
    *   **Éxito (200 OK o 204 No Content).**
    *   **No Autorizado (401) / Prohibido (403) / No Encontrado (404 Plan).**
    *   **Error Interno del Servidor (500).**
5.  **Pruebas Unitarias y de Integración (Backend):**
    *   Probar la eliminación (soft/hard) de un plan.
    *   Probar autorización.
    *   Verificar el manejo de comidas asociadas.

**Criterios de Aceptación (Backend):**
*   El endpoint `DELETE /api/diet-plans/{dietPlanId}` es funcional y protegido.
*   Solo el profesional propietario puede eliminar el plan.
*   El plan (y sus comidas, si es hard delete) se elimina/marca correctamente.

**Etiquetas:** `backend`, `dietas`, `planes de dieta`, `eliminación`, `soft delete`, `HU-014_A`

---

## HU-015: Creación Básica de Plan de Entrenamiento

---

**ID del Ticket:** TB-015
**Historia de Usuario Relacionada:** HU-015 - Creación Básica de Plan de Entrenamiento
**Tipo:** Feature
**Prioridad:** Alta

**Descripción:**
Permitir que un profesional autenticado cree un nuevo plan de entrenamiento para un paciente, incluyendo detalles del plan, múltiples días de entrenamiento y múltiples ejercicios por día.

**Tareas Específicas (Backend):**
1.  **Crear Endpoint de Creación de Plan de Entrenamiento:**
    *   Definir la ruta `POST /api/patients/{patientId}/workout-plans` (protegida).
2.  **Verificación de Autorización y Propiedad del Paciente:**
    *   Misma lógica que en tickets anteriores para endpoints anidados de paciente.
3.  **Implementar Validación de Datos de Entrada (`WorkoutPlanCreation`):**
    *   Validar el cuerpo de la solicitud contra `WorkoutPlanCreation`.
    *   Campos del plan: `title` (obligatorio), `description`, `startDate`, `endDate`, `objectives`, `status`, `notes`.
    *   Validar fechas.
    *   Campo `days`: array de `WorkoutDayCreation`.
        *   Para cada día: `dayOfWeek` (obligatorio), `description` (opcional).
        *   Campo `exercises` (dentro de cada día): array de `ExerciseCreation`.
            *   Para cada ejercicio: `name` (obligatorio), `setsReps` (obligatorio), `observations` (opcional).
        *   Validar que `days` y `exercises` no estén vacíos si es un requisito.
4.  **Lógica de Creación (Transaccional):**
    *   Obtener `professional_id` del token.
    *   Iniciar transacción.
    *   Crear registro en `WORKOUT_PLAN` (asociado a `patientId`, `professional_id`).
    *   Para cada objeto `day` en el array `days`:
        *   Crear registro en `WORKOUT_DAY` (asociado al `workout_plan_id`).
        *   Para cada objeto `exercise` en el array `exercises` del día:
            *   Crear registro en `EXERCISE` (asociado al `workout_day_id`).
    *   Confirmar transacción. Revertir en caso de error.
5.  **Definir Respuestas del API:**
    *   **Éxito (201 Created):**
        *   Devolver `WorkoutPlanResponse` completo, con IDs generados para el plan, días y ejercicios.
    *   **Error de Validación (400).**
    *   **No Autorizado (401) / Prohibido (403) / No Encontrado (404 Paciente).**
    *   **Error Interno del Servidor (500).**
6.  **Pruebas Unitarias y de Integración (Backend):**
    *   Probar creación completa de plan con días y ejercicios.
    *   Probar todas las validaciones anidadas.
    *   Probar lógica transaccional.
    *   Probar autorización.

**Criterios de Aceptación (Backend):**
*   Endpoint `POST /api/patients/{patientId}/workout-plans` funcional y protegido.
*   Datos del plan, días y ejercicios se validan.
*   Se crea el plan, días y ejercicios asociados de forma transaccional.
*   Se asocia al paciente y profesional correctos.
*   Se devuelve el plan completo con todos los IDs.

**Consideraciones Técnicas (Backend):**
*   Manejo de transacciones para la creación anidada.
*   Asegurar que todos los IDs generados se devuelvan.

**Etiquetas:** `backend`, `pacientes`, `entrenamiento`, `planes de entrenamiento`, `creación`, `transacciones`, `HU-015`

---

## HU-016: Visualización de Detalles de un Plan de Entrenamiento

---

**ID del Ticket:** TB-016
**Historia de Usuario Relacionada:** HU-016: Visualización de Detalles de un Plan de Entrenamiento
**Título del Ticket:** API para Obtener Detalles del Plan de Entrenamiento
**Descripción:** Implementar el endpoint API necesario para que el frontend pueda solicitar y recibir los detalles completos de un plan de entrenamiento específico.
**Criterios de Aceptación:**
    *   Crear endpoint `GET /api/workout-plans/{workoutPlanId}` (o `GET /api/patients/{patientId}/workout-plans/{workoutPlanId}`).
    *   El endpoint debe verificar que el profesional autenticado tiene permiso para ver el plan (pertenece a uno de sus pacientes).
    *   Recuperar toda la información del `WORKOUT_PLAN`, incluyendo `WORKOUT_DAY`s asociados y sus `EXERCISE`s, manteniendo el orden.
    *   Respuesta JSON estructurada con todos los detalles (200 OK).
    *   Devolver 404 Not Found si el plan no existe.
    *   Devolver 403 Forbidden si el profesional no está autorizado.
**Prioridad:** Alta
**Estado:** Pendiente
---

## Ticket: TB-017
**Historia de Usuario Asociada:** HU-017: Edición de Plan de Entrenamiento Existente
**Título del Ticket:** API para Actualizar Planes de Entrenamiento Existentes
**Descripción:** Implementar el endpoint API para actualizar un plan de entrenamiento existente, incluyendo su información general, días de entrenamiento y ejercicios.
**Criterios de Aceptación:**
    *   Crear endpoint `PUT /api/workout-plans/{workoutPlanId}`.
    *   Aceptar datos del plan, lista de días y lista de ejercicios por día, representando el estado final.
    *   Verificar autorización del profesional.
    *   Validar datos recibidos.
    *   Actualizar `WORKOUT_PLAN`, `WORKOUT_DAY`s y `EXERCISE`s (transaccional). Considerar estrategia: eliminar y recrear días/ejercicios o actualización granular.
    *   Actualizar `updated_at` del plan.
    *   Respuesta API: 200 OK con plan actualizado, o errores (400, 401, 403, 404, 500).
**Prioridad:** Alta
**Estado:** Pendiente
---

## Ticket: TB-018
**Historia de Usuario Asociada:** HU-018: Generación de PDF Combinado de Plan de Dieta y Entrenamiento
**Título del Ticket:** API para Generar PDF Combinado de Planes
**Descripción:** Implementar el endpoint API que genere un PDF combinado a partir de un plan de dieta y/o un plan de entrenamiento seleccionados para un paciente.
**Criterios de Aceptación:**
    *   Endpoint `POST /api/patients/{patientId}/combined-pdf` (protegido).
    *   Aceptar `{ "dietPlanId": "uuid_o_null", "workoutPlanId": "uuid_o_null" }`.
    *   Validar que `patientId` es válido y al menos un `planId` se proporciona.
    *   Validar IDs de planes si se proporcionan.
    *   Verificar autorización del profesional sobre el paciente y los planes.
    *   Recuperar datos completos de los planes seleccionados.
    *   Usar `pdfkit` (o similar) para construir el PDF en memoria con la información general y secciones de planes.
    *   Respuesta API (200 OK): PDF binario con cabeceras `Content-Type: application/pdf` y `Content-Disposition: attachment; filename="nombre_sugerido.pdf"`.
    *   Manejar errores (400, 401, 403, 404, 500).
**Prioridad:** Media
**Estado:** Pendiente
---

## Ticket: TB-019
**Historia de Usuario Asociada:** HU-019: Envío de Planes (PDF) por Correo Electrónico al Paciente
**Título del Ticket:** API para Enviar PDF de Planes por Email
**Descripción:** Implementar el endpoint API que genere el PDF de planes (reutilizando lógica de HU-018) y lo envíe por correo electrónico al destinatario especificado.
**Criterios de Aceptación:**
    *   Endpoint `POST /api/patients/{patientId}/send-plans-email` (protegido).
    *   Aceptar: `recipientEmail`, `subject`, `bodyMessage` (opcional), `dietPlanId` (opcional), `workoutPlanId` (opcional). Al menos un ID de plan.
    *   Validar entradas (email, asunto, IDs de plan).
    *   Verificar autorización del profesional (paciente, planes).
    *   Reutilizar lógica de HU-018 para generar PDF en memoria.
    *   Usar servicio de email (ej. SendGrid) para enviar correo con PDF adjunto, asunto y cuerpo personalizados.
    *   Manejar errores de generación de PDF y envío de email.
    *   Respuesta API: 200 OK con confirmación, o errores (400, 401, 403, 404, 500).
**Prioridad:** Media
**Estado:** Pendiente
---

## Ticket: TB-020
**Historia de Usuario Asociada:** HU-020: Eliminación de Plan de Dieta
**Título del Ticket:** API para Eliminar Planes de Dieta
**Descripción:** Implementar el endpoint API para eliminar un plan de dieta existente y sus comidas asociadas.
**Criterios de Aceptación:**
    *   Endpoint `DELETE /api/diet-plans/{dietPlanId}` (protegido).
    *   Verificar autorización del profesional (propietario del plan).
    *   Eliminar el `DIET_PLAN` y todos sus `DIET_MEAL`s asociados de forma transaccional.
    *   Respuesta API: 200 OK/204 No Content, o errores (401, 403, 404, 500).
**Prioridad:** Media
**Estado:** Pendiente
---

## Ticket: TB-021
**Historia de Usuario Asociada:** HU-021: Eliminación de Plan de Entrenamiento
**Título del Ticket:** API para Eliminar Planes de Entrenamiento
**Descripción:** Implementar el endpoint API para eliminar un plan de entrenamiento existente, sus días y ejercicios asociados.
**Criterios de Aceptación:**
    *   Endpoint `DELETE /api/workout-plans/{workoutPlanId}` (protegido).
    *   Verificar autorización del profesional (propietario del plan).
    *   Eliminar el `WORKOUT_PLAN`, todos sus `WORKOUT_DAY`s y todos sus `EXERCISE`s asociados de forma transaccional.
    *   Respuesta API: 200 OK/204 No Content, o errores (401, 403, 404, 500).
**Prioridad:** Media
**Estado:** Pendiente
---

### Ticket: TB-DB01
**Historia de Usuario Asociada:** N/A (Tarea de configuración de la persistencia de datos)
**Título del Ticket:** Definición del Esquema de BD, Migraciones Iniciales y Semillas
**Descripción:** Esta tarea es crucial para establecer la persistencia de datos del proyecto. Implica traducir el Modelo de Entidad-Relación (ERD) a un esquema de Prisma, generar las migraciones correspondientes para estructurar la base de datos, y opcionalmente, poblarla con datos iniciales para facilitar el desarrollo y las pruebas.
**Tareas Específicas:**
    1.  Revisar y finalizar el ERD para el MVP.
    2.  Traducir el ERD al `schema.prisma`, definiendo todos los modelos (PROFESSIONAL, PATIENT, BIOMETRIC_RECORD, DIET_PLAN, DIET_MEAL, WORKOUT_PLAN, WORKOUT_DAY, EXERCISE), sus campos, tipos y relaciones.
    3.  Validar el `schema.prisma` utilizando los comandos de Prisma.
    4.  Generar la primera migración SQL utilizando `prisma migrate dev --name initial-schema`.
    5.  Aplicar la migración a la base de datos de desarrollo y verificar que las tablas se creen correctamente.
    6.  (Opcional pero Recomendado) Crear un script de semillas (`prisma/seed.ts` o `prisma/seed.js`) para poblar la base de datos con datos de prueba esenciales (ej., un usuario profesional, algunos pacientes de ejemplo).
    7.  Configurar el comando `prisma db seed` en `package.json`.
    8.  Documentar en el `README.md` del backend cómo ejecutar migraciones y el script de semillas.
    9.  Asegurar que el cliente Prisma (`@prisma/client`) se genere correctamente después de los cambios en el esquema.
**Criterios de Aceptación:**
    *   El archivo `schema.prisma` refleja completamente el ERD acordado para el MVP.
    *   La migración inicial se genera y aplica sin errores a la base de datos PostgreSQL.
    *   Las tablas y relaciones correspondientes a los modelos de Prisma existen en la base de datos.
    *   El cliente Prisma está actualizado y puede ser utilizado por el backend para interactuar con la base de datos.
    *   Si se implementan semillas, el script de semillas se ejecuta correctamente y puebla la base de datos.
    *   La documentación para migraciones y semillas está clara.
**Prioridad:** Crítica
**Estado:** Pendiente
**Estimación:** 4-6 horas
**Responsable:** Por asignar
**Etiquetas:** `backend`, `database`, `prisma`, `migrations`, `schema`, `seed`, `setup`, `postgresql`
--- 