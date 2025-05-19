# Historias de Usuario - NutriTrack Pro

## Gestión de Usuarios Profesionales

### HU-001: Registro de Nuevo Profesional

*   **ID:** HU-001
*   **Título:** Registro de Nuevo Profesional
*   **Como un:** Profesional (nutricionista/entrenador) que aún no tiene cuenta
*   **Quiero:** Poder registrarme en la aplicación proporcionando mi nombre completo, email, una contraseña segura y mi tipo de profesión (nutricionista o entrenador)
*   **Para que:** Pueda crear mi perfil, acceder a las funcionalidades del sistema y comenzar a gestionar mis pacientes y sus planes nutricionales o de entrenamiento.

*   **Requisitos Funcionales Asociados (PRD):**
    *   RF1.1: El sistema permitirá a los profesionales registrarse con su nombre completo, email, contraseña y profesión.

*   **Criterios de Aceptación:**

    *   **Interfaz de Usuario (Frontend):**
        1.  **Formulario de Registro:** Debe existir una página/sección de registro accesible (ej. `/registro`). Se utilizará `React Hook Form` para la gestión del estado del formulario y las validaciones.
        2.  **Campos Requeridos:** El formulario debe incluir campos para:
            *   Nombre completo (texto, obligatorio).
            *   Email (email, obligatorio, formato válido).
            *   Contraseña (password, obligatorio).
            *   Confirmación de contraseña (password, obligatorio, debe coincidir con contraseña).
            *   Profesión (selector o radio buttons: "Nutricionista", "Entrenador", obligatorio).
        3.  **Validaciones en Cliente:**
            *   Todos los campos obligatorios deben ser validados antes de enviar el formulario.
            *   El campo email debe validar el formato (ej. `usuario@dominio.com`).
            *   La contraseña debe cumplir con criterios de seguridad mínimos (ej., al menos 8 caracteres, incluir mayúsculas, minúsculas, números y un carácter especial). Estos criterios deben ser visibles para el usuario.
            *   El campo "Confirmación de contraseña" debe coincidir exactamente con el campo "Contraseña".
            *   Se deben mostrar mensajes de error claros y específicos junto a cada campo que no cumpla la validación.
        4.  **Envío del Formulario:**
            *   Al hacer clic en "Registrar", si las validaciones son correctas, los datos se envían al backend.
            *   Durante el envío, se debe mostrar un indicador de carga para feedback visual.
        5.  **Respuesta del Sistema:**
            *   **Éxito:** Si el registro es exitoso, mostrar un mensaje de confirmación (ej. "¡Registro completado! Ahora puedes iniciar sesión.") y redirigir al usuario a la página de inicio de sesión.
            *   **Error (Email Duplicado):** Si el email ya está registrado, mostrar un mensaje claro (ej. "Este email ya está registrado. ¿Quieres <a href='/login'>iniciar sesión</a> o <a href='/recuperar-password'>recuperar tu contraseña</a>?").
            *   **Error Genérico:** Si ocurre otro error, mostrar un mensaje genérico (ej. "No se pudo completar el registro. Por favor, inténtalo de nuevo más tarde.").
        6.  **Navegación:** Debe haber un enlace claro para ir a la página de "Inicio de Sesión" para usuarios que ya tienen cuenta.

    *   **Lógica de Negocio (Backend):**
        1.  **Endpoint de Registro:** Debe existir un endpoint API (ej. `POST /api/auth/register`) que acepte: `nombreCompleto`, `email`, `password`, `profesion`.
        2.  **Validación de Datos del Servidor:**
            *   Validar que todos los campos requeridos están presentes y no están vacíos.
            *   Validar que el email tiene un formato correcto.
            *   Validar que la profesión es uno de los valores permitidos ("nutricionista", "entrenador").
            *   Validar que el email no exista previamente en la tabla `PROFESSIONAL`.
        3.  **Seguridad de Contraseña:**
            *   La contraseña recibida debe ser hasheada utilizando un algoritmo seguro (ej. bcrypt) antes de ser almacenada. No se debe almacenar la contraseña en texto plano.
        4.  **Creación de Usuario:**
            *   Si todas las validaciones son correctas y el email es único, crear un nuevo registro en la tabla `PROFESSIONAL` con los datos proporcionados y la contraseña hasheada.
            *   Guardar la fecha de creación (`created_at`) y actualización (`updated_at`).
        5.  **Respuesta del API:**
            *   **Éxito (201 Created):** Devolver un mensaje de éxito y, opcionalmente, los datos del profesional creado (sin la contraseña).
            *   **Error de Validación (400 Bad Request):** Si hay errores de validación en los datos de entrada, devolver un error con detalles específicos.
            *   **Email Duplicado (409 Conflict):** Si el email ya existe, devolver un error específico.
            *   **Error del Servidor (500 Internal Server Error):** Si ocurre un error inesperado durante el proceso.

    *   **Pruebas (QA):**
        1.  **Registro Exitoso:** Verificar que un nuevo profesional puede registrarse con datos válidos para cada tipo de profesión (Nutricionista, Entrenador).
        2.  **Validaciones de Formulario (Frontend):**
            *   Probar todos los campos obligatorios dejándolos vacíos.
            *   Probar formatos de email inválidos.
            *   Probar contraseñas que no cumplen los criterios de seguridad.
            *   Probar cuando la confirmación de contraseña no coincide.
        3.  **Email Duplicado:** Intentar registrarse con un email que ya existe en el sistema. Verificar que se muestra el mensaje de error correcto.
        4.  **Seguridad de Contraseña:** Confirmar (mediante revisión de base de datos o pruebas específicas) que la contraseña se almacena hasheada y no en texto plano.
        5.  **Redirección Post-Registro:** Verificar que el usuario es redirigido a la página de inicio de sesión tras un registro exitoso.
        6.  **Flujo Completo:** Realizar el flujo de registro completo en los navegadores y dispositivos principales definidos en los requisitos no funcionales (RNF1.2, RNF1.7).
        7.  **Respuesta del API:** Verificar las respuestas del API para cada escenario (éxito, error de validación, email duplicado, error de servidor) utilizando herramientas como Postman o similar.

---

### HU-002: Inicio de Sesión del Profesional

*   **ID:** HU-002
*   **Título:** Inicio de Sesión del Profesional
*   **Como un:** Profesional registrado (nutricionista/entrenador)
*   **Quiero:** Poder iniciar sesión en la aplicación utilizando mi email y contraseña
*   **Para que:** Pueda acceder a mi dashboard, gestionar mis pacientes y utilizar todas las funcionalidades de la plataforma.

*   **Requisitos Funcionales Asociados (PRD):**
    *   RF1.2: El sistema permitirá a los profesionales iniciar sesión mediante email y contraseña.

*   **Criterios de Aceptación:**

    *   **Interfaz de Usuario (Frontend):**
        1.  **Formulario de Inicio de Sesión:** Debe existir una página/sección de inicio de sesión accesible (ej. `/login`). Se utilizará `React Hook Form` para la gestión del estado del formulario y las validaciones.
        2.  **Campos Requeridos:** El formulario debe incluir campos para:
            *   Email (email, obligatorio, formato válido).
            *   Contraseña (password, obligatorio).
        3.  **Validaciones en Cliente:**
            *   Ambos campos (email y contraseña) deben ser validados como obligatorios antes de enviar el formulario.
            *   El campo email debe validar el formato.
            *   Se deben mostrar mensajes de error claros si los campos están vacíos.
        4.  **Envío del Formulario:**
            *   Al hacer clic en "Iniciar Sesión", si las validaciones básicas son correctas, los datos se envían al backend.
            *   Durante el envío, se debe mostrar un indicador de carga.
        5.  **Respuesta del Sistema:**
            *   **Éxito:** Si el inicio de sesión es exitoso, el usuario debe ser redirigido al dashboard principal de la aplicación (ej. `/dashboard`).
            *   **Error (Credenciales Inválidas):** Si el email no existe o la contraseña es incorrecta, mostrar un mensaje claro (ej. "Email o contraseña incorrectos. Por favor, verifica tus credenciales.").
            *   **Error Genérico:** Si ocurre otro error, mostrar un mensaje genérico (ej. "No se pudo iniciar sesión. Por favor, inténtalo de nuevo más tarde.").
        6.  **Navegación:**
            *   Debe haber un enlace claro para ir a la página de "Registro" para usuarios que no tienen cuenta.
            *   Debe haber un enlace claro para "Recuperar Contraseña".

    *   **Lógica de Negocio (Backend):**
        1.  **Endpoint de Inicio de Sesión:** Debe existir un endpoint API (ej. `POST /api/auth/login`) que acepte: `email`, `password`.
        2.  **Validación de Datos del Servidor:**
            *   Validar que ambos campos (email y contraseña) están presentes y no están vacíos.
            *   Validar que el email tiene un formato correcto.
        3.  **Autenticación de Usuario:**
            *   Buscar al profesional en la tabla `PROFESSIONAL` por el email proporcionado.
            *   Si el profesional no existe, devolver un error de autenticación.
            *   Si el profesional existe, comparar la contraseña proporcionada con la contraseña hasheada almacenada en la base de datos utilizando la misma función de hash (ej. bcrypt.compare).
            *   Si las contraseñas no coinciden, devolver un error de autenticación.
        4.  **Generación de Token de Sesión:**
            *   Si la autenticación es exitosa, generar un token de sesión (ej. JWT - JSON Web Token).
            *   El token debe contener información identificativa del usuario (ej. ID del profesional, rol/profesión).
            *   El token debe tener una fecha de expiración.
        5.  **Respuesta del API:**
            *   **Éxito (200 OK):** Devolver el token de sesión y, opcionalmente, información básica del usuario (nombre, email, profesión).
            *   **Error de Validación (400 Bad Request):** Si hay errores de validación en los datos de entrada (ej. campos vacíos).
            *   **Credenciales Inválidas (401 Unauthorized):** Si el email no se encuentra o la contraseña no coincide.
            *   **Error del Servidor (500 Internal Server Error):** Si ocurre un error inesperado durante el proceso.

    *   **Pruebas (QA):**
        1.  **Inicio de Sesión Exitoso:** Verificar que un profesional registrado puede iniciar sesión con credenciales válidas.
        2.  **Redirección Post-Login:** Verificar que el usuario es redirigido al dashboard correcto tras un inicio de sesión exitoso.
        3.  **Credenciales Inválidas:**
            *   Intentar iniciar sesión con un email no registrado.
            *   Intentar iniciar sesión con un email registrado pero contraseña incorrecta.
            *   Intentar iniciar sesión con campos vacíos.
            *   Verificar que se muestran los mensajes de error apropiados en cada caso.
        4.  **Manejo del Token:**
            *   Verificar que se recibe un token JWT tras un inicio de sesión exitoso.
            *   (Más adelante, en historias de usuario de acceso a rutas protegidas) Verificar que el token es necesario y válido para acceder a secciones protegidas de la aplicación.
        5.  **Seguridad:**
            *   Asegurar que la comparación de contraseñas se hace de forma segura (comparando hashes).
        6.  **Flujo Completo:** Realizar el flujo de inicio de sesión completo en los navegadores y dispositivos principales.
        7.  **Respuesta del API:** Verificar las respuestas del API para cada escenario (éxito, error de validación, credenciales inválidas, error de servidor).
---

### HU-003: Recuperación de Contraseña del Profesional (Simplificado para MVP)

*   **ID:** HU-003
*   **Título:** Recuperación de Contraseña del Profesional (Simplificado para MVP)
*   **Como un:** Profesional registrado que ha olvidado su contraseña
*   **Quiero:** Encontrar información sobre cómo proceder para recuperar mi contraseña
*   **Para que:** Pueda eventualmente volver a acceder a mi cuenta.

*   **Requisitos Funcionales Asociados (PRD):**
    *   RF1.4: El sistema permitirá a los profesionales recuperar su contraseña mediante email. (Revisado para MVP: Proceso manual vía soporte).

*   **Criterios de Aceptación (Simplificado para MVP):**

    *   **Interfaz de Usuario (Frontend):**
        1.  **Enlace/Página de "Olvidé mi contraseña":**
            *   Debe existir un enlace "Olvidé mi contraseña" en la página de inicio de sesión (o una página `/recuperar-password` accesible).
        2.  **Información de Contacto para Soporte:**
            *   Al acceder a la opción de recuperación, se debe mostrar un mensaje claro al usuario (ej. "Para recuperar tu contraseña, por favor contacta a soporte en soporte@nutritrack.pro.").
            *   Alternativamente, puede ser una página estática con esta información.
        3.  **Navegación:** El usuario debe poder volver fácilmente a la página de inicio de sesión.

    *   **Lógica de Negocio (Backend):**
        1.  **Sin Implementación de Lógica de Recuperación Automatizada:**
            *   No se desarrollará un endpoint para solicitar tokens de reseteo.
            *   No se implementará la generación ni el envío de emails de recuperación.
            *   No se desarrollará un endpoint para restablecer la contraseña con un token.
        2.  **Proceso Manual:**
            *   La recuperación de contraseña será un proceso manual. El administrador del sistema (inicialmente, el equipo de desarrollo) deberá cambiar la contraseña directamente en la base de datos a petición del usuario.
            *   Se debe documentar internamente el procedimiento para este cambio manual.

    *   **Pruebas (QA) (Simplificado para MVP):**
        1.  **Verificación del Enlace/Página:**
            *   Comprobar que el enlace "Olvidé mi contraseña" es visible en la página de login y dirige a la información correcta.
        2.  **Verificación del Mensaje de Soporte:**
            *   Asegurar que el mensaje con la dirección de email de soporte se muestra claramente.
        3.  **Documentación del Proceso Manual:**
            *   Confirmar que el procedimiento para que el administrador cambie una contraseña manualmente está documentado.
---

### HU-004: Cerrar Sesión del Profesional

*   **ID:** HU-004
*   **Título:** Cerrar Sesión del Profesional
*   **Como un:** Profesional que ha iniciado sesión en la aplicación
*   **Quiero:** Poder cerrar mi sesión de forma segura
*   **Para que:** Pueda proteger mi cuenta y mis datos cuando termino de usar la aplicación o cambio de dispositivo.

*   **Requisitos Funcionales Asociados (PRD):**
    *   RF1.3: El sistema permitirá a los profesionales cerrar sesión.

*   **Criterios de Aceptación:**

    *   **Interfaz de Usuario (Frontend):**
        1.  **Botón/Enlace de Cerrar Sesión:** Debe existir un botón o enlace claramente visible para "Cerrar Sesión" cuando el usuario ha iniciado sesión (ej. en un menú de usuario, cabecera).
        2.  **Acción de Cierre de Sesión:** Al hacer clic en "Cerrar Sesión":
            *   Se debe invalidar la sesión del usuario en el lado del cliente (ej. eliminar el token JWT almacenado en localStorage/sessionStorage/cookies).
            *   El usuario debe ser redirigido a la página de inicio de sesión (ej. `/login`) o a la página principal pública.
            *   Opcionalmente, se puede mostrar un mensaje breve como "Has cerrado sesión correctamente." antes de la redirección.
        3.  **Estado Post-Cierre de Sesión:** Después de cerrar sesión, el usuario no debe poder acceder a las secciones protegidas de la aplicación sin volver a iniciar sesión. Cualquier intento de acceso a rutas protegidas debe redirigir a la página de inicio de sesión.

    *   **Lógica de Negocio (Backend):**
        1.  **Invalidación de Token en Cliente (Principal):**
            *   El cierre de sesión es principalmente una operación del lado del cliente al eliminar el token JWT almacenado.
        2.  **Invalidación de Token en Backend (Opcional - No para MVP inicial):**
            *   Para mayor seguridad futura (especialmente si los tokens tienen una vida útil larga o para prevenir el uso de tokens robados antes de su expiración), se podría implementar una lógica de "lista negra" de tokens en el backend.
            *   Esto implicaría un endpoint de Logout (ej. `POST /api/auth/logout`) que añada el token a una lista negra hasta que expire naturalmente.
            *   El middleware de autenticación debería consultar esta lista negra.
            *   **Para el MVP actual, esta funcionalidad de backend no se implementará.**

    *   **Pruebas (QA):**
        1.  **Cierre de Sesión Exitoso:**
            *   Iniciar sesión como profesional.
            *   Hacer clic en el botón/enlace "Cerrar Sesión".
            *   Verificar que el usuario es redirigido a la página de inicio de sesión.
            *   Verificar (usando herramientas de desarrollador del navegador) que el token JWT ha sido eliminado del almacenamiento del cliente (localStorage, sessionStorage, o que la cookie de sesión ha sido eliminada/invalidada).
        2.  **Acceso Post-Cierre de Sesión:**
            *   Después de cerrar sesión, intentar acceder a una URL protegida (ej. `/dashboard`) directamente.
            *   Verificar que se redirige al usuario a la página de inicio de sesión y no se muestra el contenido protegido.
        3.  **Invalidación del Token en Cliente:**
            *   Verificar (usando herramientas de desarrollador del navegador) que el token JWT ha sido eliminado del almacenamiento del cliente (localStorage, sessionStorage, o que la cookie de sesión ha sido eliminada/invalidada).
        4.  **Prueba con Múltiples Sesiones (si aplica y se gestiona en backend):** Si un usuario puede tener múltiples sesiones activas, verificar cómo afecta el cierre de sesión de una de ellas a las otras. (Para MVP, usualmente una sesión por token es suficiente).
        5.  **Usabilidad:** Asegurar que la opción de cerrar sesión es fácil de encontrar.

---

## Gestión de Pacientes

### HU-005: Registro de Nuevo Paciente

*   **ID:** HU-005
*   **Título:** Registro de Nuevo Paciente
*   **Como un:** Profesional que ha iniciado sesión
*   **Quiero:** Poder registrar un nuevo paciente en el sistema proporcionando su información personal básica (nombre, apellidos, email, teléfono, fecha de nacimiento, género), datos biométricos iniciales (altura, peso, etc.), notas médicas relevantes, restricciones alimentarias y sus objetivos.
*   **Para que:** Pueda tener un perfil completo del paciente y comenzar a crear planes de dieta y entrenamiento personalizados y hacer seguimiento de su progreso.

*   **Requisitos Funcionales Asociados (PRD):**
    *   RF2.1: El sistema permitirá a los profesionales registrar nuevos pacientes con información personal básica.
    *   RF2.4: El sistema permitirá a los profesionales registrar medidas biométricas de sus pacientes.
    *   RF2.5: El sistema permitirá a los profesionales establecer objetivos para cada paciente.
    *   (Implícito: El paciente está asociado al profesional que lo registra)

*   **Criterios de Aceptación:**

    *   **Interfaz de Usuario (Frontend):**
        1.  **Acceso al Formulario:**
            *   Debe haber una opción clara para añadir un nuevo paciente desde el dashboard del profesional o una sección de "Pacientes" (ej. un botón "Añadir Paciente").
        2.  **Formulario de Registro de Paciente:** La página/modal de registro de paciente debe incluir campos para (agrupados por secciones si es extenso): Se utilizará `React Hook Form` para la gestión del estado del formulario y las validaciones.
            *   **Información Personal:**
                *   Nombre (texto, obligatorio).
                *   Apellidos (texto, obligatorio).
                *   Email (email, opcional, formato válido).
                *   Teléfono (texto, opcional).
                *   Fecha de nacimiento (fecha, opcional).
                *   Género (selector/radio: "Masculino", "Femenino", "Otro", "Prefiero no decirlo", opcional).
            *   **Datos Biométricos Iniciales:**
                *   Altura (número en cm, opcional).
                *   Peso (número en kg, opcional, con decimales).
                *   Porcentaje de grasa corporal (%) (número, opcional, con decimales).
                *   Porcentaje de masa muscular (%) (número, opcional, con decimales).
                *   (Considerar si otros campos biométricos del modelo de datos como `water_percentage` o diámetros se incluyen aquí o se añaden posteriormente en "Registros Biométricos"). Para MVP, los básicos son suficientes.
            *   **Información Adicional:**
                *   Notas médicas relevantes (área de texto, opcional).
                *   Restricciones alimentarias (área de texto, opcional).
                *   Objetivos del paciente (área de texto, opcional pero recomendado).
        3.  **Validaciones en Cliente:**
            *   Los campos obligatorios (Nombre, Apellidos) deben ser validados.
            *   El email, si se proporciona, debe tener un formato válido.
            *   Los campos numéricos (altura, peso, porcentajes) deben aceptar solo números y, si aplica, decimales.
            *   Mostrar mensajes de error claros y específicos.
        4.  **Envío del Formulario:**
            *   Al hacer clic en "Guardar Paciente" o similar, si las validaciones son correctas, los datos se envían al backend.
            *   Mostrar indicador de carga.
        5.  **Respuesta del Sistema:**
            *   **Éxito:** Mostrar un mensaje de confirmación (ej. "Paciente [Nombre del Paciente] registrado correctamente."). Redirigir al profesional a la lista de pacientes o al perfil del paciente recién creado.
            *   **Error de Validación:** Si hay errores de validación no detectados en cliente, mostrar los mensajes del servidor.
            *   **Error Genérico:** Mostrar un mensaje genérico.

    *   **Lógica de Negocio (Backend):**
        1.  **Endpoint de Creación de Paciente:** Debe existir un endpoint API (ej. `POST /api/patients`) que acepte todos los campos definidos para el paciente. Este endpoint debe ser protegido y requerir autenticación del profesional.
        2.  **Asociación con Profesional:**
            *   El ID del profesional que crea el paciente (obtenido del token de autenticación) debe guardarse automáticamente en el campo `professional_id` de la tabla `PATIENT`.
        3.  **Validación de Datos del Servidor:**
            *   Validar campos obligatorios (nombre, apellidos).
            *   Validar tipos de datos (ej. email, fecha, números).
            *   Asegurar que los valores numéricos estén dentro de rangos razonables si es necesario (ej. altura > 0).
        4.  **Creación del Paciente:**
            *   Crear un nuevo registro en la tabla `PATIENT` con la información proporcionada.
            *   Guardar `created_at` y `updated_at`.
        5.  **Creación del Primer Registro Biométrico (Si se proporcionan datos biométricos iniciales):**
            *   Si se ingresan datos como peso, altura, % grasa, etc., en el formulario de creación del paciente, crear automáticamente un primer registro en la tabla `BIOMETRIC_RECORD` asociado a este nuevo paciente.
            *   La `record_date` para este primer registro biométrico podría ser la fecha actual o una fecha proporcionada en el formulario si se decide añadir ese campo.
        6.  **Respuesta del API:**
            *   **Éxito (201 Created):** Devolver los datos del paciente creado (y, opcionalmente, el primer registro biométrico si se creó).
            *   **Error de Validación (400 Bad Request):** Si los datos de entrada son inválidos.
            *   **No Autorizado (401 Unauthorized):** Si el profesional no está autenticado.
            *   **Error del Servidor (500 Internal Server Error):** Por errores inesperados.

    *   **Pruebas (QA):**
        1.  **Registro Exitoso de Paciente:**
            *   Iniciar sesión como profesional.
            *   Registrar un nuevo paciente con todos los campos opcionales y obligatorios completados.
            *   Verificar que el paciente aparece en la lista de pacientes del profesional.
            *   Verificar que los datos se guardaron correctamente en la base de datos (tabla `PATIENT` y `BIOMETRIC_RECORD` para el primer registro).
            *   Verificar que el `professional_id` se asignó correctamente.
        2.  **Registro con Campos Mínimos:** Registrar un paciente solo con los campos obligatorios.
        3.  **Validaciones de Formulario (Frontend y Backend):**
            *   Probar campos obligatorios vacíos.
            *   Probar formatos inválidos (email, números).
        4.  **Acceso No Autorizado:** Intentar acceder al endpoint de creación de pacientes sin estar autenticado.
        5.  **Flujo Completo:** Realizar el flujo en navegadores/dispositivos principales.
        6.  **Redirección y Mensajes:** Verificar las redirecciones y mensajes de éxito/error.
        7.  **Integridad de Datos:** Asegurar que un paciente solo puede ser creado por un profesional autenticado y queda asociado a él.

---

### HU-006: Actualización de Información del Paciente

*   **ID:** HU-006
*   **Título:** Actualización de Información del Paciente
*   **Como un:** Profesional que ha iniciado sesión
*   **Quiero:** Poder actualizar la información personal, datos biométricos (que no sean parte de un registro biométrico periódico), notas médicas, restricciones y objetivos de un paciente existente.
*   **Para que:** Pueda mantener la información del paciente precisa y al día.

*   **Requisitos Funcionales Asociados (PRD):**
    *   RF2.2: El sistema permitirá a los profesionales actualizar la información de sus pacientes.

*   **Criterios de Aceptación:**

    *   **Interfaz de Usuario (Frontend):**
        1.  **Acceso a la Edición:**
            *   Desde la vista de detalle de un paciente o desde una lista de pacientes, debe haber una opción clara para "Editar Paciente".
        2.  **Formulario de Edición:**
            *   El formulario de edición debe ser similar al de creación de paciente (HU-005), pre-cargado con la información existente del paciente. Se utilizará `React Hook Form` para la gestión del estado del formulario y las validaciones.
            *   Debe permitir modificar todos los campos que se permitieron en la creación (Nombre, Apellidos, Email, Teléfono, Fecha de nacimiento, Género, Altura, Notas médicas, Restricciones, Objetivos).
        3.  **Validaciones en Cliente:**
            *   Mismas validaciones que en el formulario de creación (campos obligatorios, formatos, etc.).
        4.  **Envío del Formulario:**
            *   Al hacer clic en "Guardar Cambios", si las validaciones son correctas, los datos se envían al backend.
            *   Mostrar indicador de carga.
        5.  **Respuesta del Sistema:**
            *   **Éxito:** Mostrar un mensaje de confirmación (ej. "Información del paciente [Nombre del Paciente] actualizada correctamente."). Redirigir al profesional al perfil del paciente actualizado o a la lista de pacientes.
            *   **Error de Validación:** Mostrar mensajes de error del servidor.
            *   **Error (Paciente No Encontrado):** Si por alguna razón el paciente ya no existe o no pertenece al profesional.
            *   **Error Genérico:** Mostrar un mensaje genérico.
        6.  **Cancelar Edición:** Debe haber una opción para "Cancelar" la edición, que descarte los cambios y devuelva al usuario a la vista anterior.

    *   **Lógica de Negocio (Backend):**
        1.  **Endpoint de Actualización de Paciente:** Debe existir un endpoint API (ej. `PUT /api/patients/{patientId}`) que acepte los campos actualizables del paciente. Este endpoint debe ser protegido.
        2.  **Autorización:**
            *   Verificar que el profesional autenticado es el propietario (`professional_id`) del paciente que se intenta actualizar. Si no, devolver un error 403 Forbidden o 404 Not Found.
        3.  **Validación de Datos del Servidor:**
            *   Validar los datos recibidos de forma similar a la creación.
        4.  **Actualización del Paciente:**
            *   Buscar el paciente por `patientId`. Si no existe, devolver error 404.
            *   Actualizar los campos correspondientes en la tabla `PATIENT`.
            *   Actualizar el campo `updated_at`.
        5.  **Respuesta del API:**
            *   **Éxito (200 OK):** Devolver los datos del paciente actualizado.
            *   **Error de Validación (400 Bad Request):** Si los datos son inválidos.
            *   **No Autorizado (401 Unauthorized):** Si el profesional no está autenticado.
            *   **Prohibido (403 Forbidden):** Si el profesional intenta editar un paciente que no le pertenece.
            *   **No Encontrado (404 Not Found):** Si el `patientId` no existe.
            *   **Error del Servidor (500 Internal Server Error).**

    *   **Pruebas (QA):**
        1.  **Actualización Exitosa:**
            *   Registrar un paciente.
            *   Editar varios campos del paciente (nombre, email, altura, objetivos, etc.) y guardar.
            *   Verificar que los cambios se reflejan correctamente en la interfaz y en la base de datos.
            *   Verificar que el campo `updated_at` se actualizó.
        2.  **Intentar Actualizar Paciente Ajeno:**
            *   Como Profesional A, registrar Paciente X.
            *   Como Profesional B, intentar editar Paciente X. Verificar que la operación es denegada.
        3.  **Validaciones:** Probar las validaciones de datos tanto en frontend como en backend.
        4.  **Cancelar Edición:** Verificar que la funcionalidad de cancelar descarta los cambios.
        5.  **Actualizar con Datos Inválidos:** Intentar guardar con datos que no pasen la validación (ej. email incorrecto).
        6.  **Actualizar Paciente Inexistente:** Intentar actualizar un `patientId` que no existe.
        7.  **Flujo Completo:** Probar en diferentes navegadores/dispositivos.

---

### HU-007: Búsqueda de Pacientes

*   **ID:** HU-007
*   **Título:** Búsqueda de Pacientes
*   **Como un:** Profesional que ha iniciado sesión
*   **Quiero:** Poder buscar pacientes por su nombre, apellidos o email en mi lista de pacientes
*   **Para que:** Pueda encontrar rápidamente a un paciente específico, especialmente si tengo muchos.

*   **Requisitos Funcionales Asociados (PRD):**
    *   RF2.3: El sistema permitirá a los profesionales buscar pacientes por nombre o algún criterio específico. (Para MVP, limitaremos a nombre, apellidos, email).

*   **Criterios de Aceptación:**

    *   **Interfaz de Usuario (Frontend):**
        1.  **Control de Búsqueda:**
            *   En la página donde se listan los pacientes (Dashboard de Pacientes), debe haber un campo de entrada de texto claramente visible para la búsqueda.
            *   Un botón de "Buscar" o la búsqueda puede activarse dinámicamente mientras el usuario escribe (debounce recomendado para evitar peticiones excesivas).
        2.  **Visualización de Resultados:**
            *   La lista de pacientes se actualizará para mostrar solo aquellos pacientes que coincidan con el término de búsqueda.
            *   La búsqueda debe ser insensible a mayúsculas/minúsculas.
            *   Debe buscar coincidencias parciales (ej. buscar "Mar" debería encontrar "María", "Marcos").
            *   Si no hay resultados, mostrar un mensaje claro (ej. "No se encontraron pacientes que coincidan con tu búsqueda.").
        3.  **Limpiar Búsqueda:**
            *   Debe haber una forma de limpiar el término de búsqueda y volver a mostrar todos los pacientes (ej. un botón "X" en el campo de búsqueda o un botón "Mostrar Todos").

    *   **Lógica de Negocio (Backend):**
        1.  **Endpoint de Listado/Búsqueda de Pacientes:**
            *   El endpoint existente para listar pacientes (ej. `GET /api/patients`) debe ser modificado para aceptar un parámetro de consulta opcional para la búsqueda (ej. `?search=termino`).
            *   Este endpoint debe ser protegido y solo devolver pacientes asociados al profesional autenticado.
        2.  **Lógica de Búsqueda:**
            *   Si se proporciona el parámetro `search`, la consulta a la base de datos (tabla `PATIENT`) debe filtrar los resultados basándose en el término de búsqueda.
            *   La búsqueda debe realizarse en los campos `first_name`, `last_name`, y `email`.
            *   Utilizar consultas `LIKE` (o equivalentes de Prisma/ORM) con `%termino%` para coincidencias parciales e insensibles a mayúsculas/minúsculas (ej. `ILIKE` en PostgreSQL).
            *   La consulta siempre debe estar restringida por el `professional_id` del profesional autenticado.
        3.  **Respuesta del API:**
            *   **Éxito (200 OK):** Devolver una lista de pacientes que coincidan con la búsqueda (puede ser una lista vacía si no hay coincidencias). La estructura de cada paciente en la lista debe ser la misma que cuando se listan todos.
            *   **No Autorizado (401 Unauthorized):** Si el profesional no está autenticado.
            *   **Error del Servidor (500 Internal Server Error).**

    *   **Pruebas (QA):**
        1.  **Búsqueda Exitosa:**
            *   Registrar varios pacientes con nombres, apellidos y emails diferentes.
            *   Buscar por nombre completo, solo nombre, solo apellido, parte del nombre/apellido.
            *   Buscar por email completo o parcial.
            *   Verificar que los resultados son correctos y la búsqueda es insensible a mayúsculas/minúsculas.
        2.  **Búsqueda Sin Resultados:** Realizar una búsqueda que no debería devolver ningún paciente y verificar el mensaje apropiado.
        3.  **Búsqueda y Paginación (si se implementa paginación):** Verificar que la búsqueda funciona correctamente con la paginación (se busca dentro de todos los pacientes del profesional, no solo la página actual).
        4.  **Limpiar Búsqueda:** Verificar que se puede limpiar la búsqueda y volver a ver todos los pacientes.
        5.  **Seguridad:**
            *   Como Profesional A, buscar pacientes. Verificar que solo se muestran sus pacientes y no los del Profesional B.
        6.  **Rendimiento:** Si hay muchos pacientes, la búsqueda debería seguir siendo razonablemente rápida (para MVP, con hasta unos cientos de pacientes por profesional debería ser aceptable).
        7.  **Casos Borde:**
            *   Búsqueda con caracteres especiales (si se permiten en nombres/emails).
            *   Búsqueda con término vacío (debería mostrar todos o no hacer nada hasta que se escriba algo).

---

### HU-008: Visualización del Dashboard Principal de Pacientes

*   **ID:** HU-008
*   **Título:** Visualización del Dashboard Principal de Pacientes
*   **Como un:** Profesional que ha iniciado sesión
*   **Quiero:** Ver un dashboard principal donde se listen mis pacientes y pueda buscarlos fácilmente
*   **Para que:** Pueda tener una vista general de mis pacientes y acceder rápidamente a sus perfiles o realizar acciones comunes.

*   **Requisitos Funcionales Asociados (PRD):**
    *   "Dashboard principal con listado y búsqueda de pacientes" (Característica Must Have)
    *   Implica RF2.3 (Búsqueda) y la necesidad de listar pacientes asociados al profesional.

*   **Criterios de Aceptación:**

    *   **Interfaz de Usuario (Frontend):**
        1.  **Acceso al Dashboard:**
            *   Al iniciar sesión correctamente, el profesional debe ser redirigido a esta vista de Dashboard de Pacientes (ej. `/dashboard` o `/patients`).
            *   Debe ser la vista principal o de aterrizaje después del login.
        2.  **Componente de Búsqueda:**
            *   Incluir el campo de búsqueda y la lógica descrita en HU-007 (Búsqueda de Pacientes).
        3.  **Listado de Pacientes:**
            *   Mostrar una lista/tabla/tarjetas de los pacientes asociados al profesional.
            *   Para cada paciente en la lista, mostrar información clave como:
                *   Nombre completo del paciente.
                *   Email o teléfono (lo que sea más relevante o esté disponible).
                *   Quizás una foto de perfil placeholder o iniciales si no hay foto.
                *   Un botón/enlace para "Ver Detalles" o "Abrir Perfil" que navegue a la vista detallada del paciente (HU-009).
                *   Opcional (MVP): Acciones rápidas como "Editar" (HU-006) o "Crear Plan".
            *   **Visualización de la Lista:** Se cargarán todos los pacientes del profesional. Si la lista excede un número determinado (ej. 20 pacientes), se habilitará el scroll vertical para navegar por ella. No se implementará paginación para el MVP.
            *   **Ordenación:** La lista de pacientes se presentará con un orden por defecto (ej. alfabéticamente por nombre o por fecha de creación más reciente). No se implementará funcionalidad de ordenación interactiva para el MVP.
        4.  **Estado Vacío / Sin Pacientes:**
            *   Si el profesional aún no ha registrado ningún paciente, mostrar un mensaje amigable y una llamada a la acción clara para "Añadir Nuevo Paciente" (que lleve a HU-005).
        5.  **Botón "Añadir Paciente":**
            *   Un botón/enlace prominente para "Añadir Nuevo Paciente" que dirija al formulario de registro de paciente (HU-005).
        6.  **Diseño Responsivo:**
            *   La vista debe ser responsiva y verse bien en diferentes tamaños de pantalla (móvil, tablet, escritorio), ajustando la disposición de la lista y la búsqueda según sea necesario.

    *   **Lógica de Negocio (Backend):**
        1.  **Endpoint de Listado de Pacientes:**
            *   Utilizar el endpoint `GET /api/patients` (ya definido/modificado en HU-007) que:
                *   Requiere autenticación del profesional.
                *   Filtra pacientes por el `professional_id` del usuario autenticado.
                *   Acepta el parámetro `search` para la búsqueda.
                *   Devolverá la lista completa de pacientes del profesional que coincidan con los criterios, ordenada por defecto (ej. por nombre o fecha de creación). No soportará parámetros de paginación ni ordenación avanzada para el MVP.
        2.  **Datos Devueltos por Paciente:**
            *   Para cada paciente, devolver los campos necesarios para mostrar en la lista (ID, nombre, apellidos, email, teléfono, etc.).
        3.  **Respuesta del API:**
            *   **Éxito (200 OK):** Devolver la lista de pacientes.
            *   **No Autorizado (401 Unauthorized).**
            *   **Error del Servidor (500 Internal Server Error).**

    *   **Pruebas (QA):**
        1.  **Visualización del Dashboard:**
            *   Iniciar sesión y verificar que se muestra el dashboard.
            *   Verificar que se listan los pacientes del profesional.
            *   Si no hay pacientes, verificar el mensaje de estado vacío y el botón para añadir.
        2.  **Integración de la Búsqueda:** Probar exhaustivamente la funcionalidad de búsqueda como se detalla en HU-007 dentro de este dashboard.
        3.  **Información del Paciente en Lista:** Verificar que se muestra la información correcta para cada paciente en la lista.
        4.  **Navegación:**
            *   Verificar que el botón/enlace "Ver Detalles" para cada paciente lleva al perfil correcto.
            *   Verificar que el botón "Añadir Paciente" lleva al formulario correcto.
        5.  **Visualización con Muchos Pacientes:**
            *   Probar con una cantidad de pacientes que exceda el umbral (ej. 25 pacientes) y verificar que el scroll vertical funciona correctamente.
        6.  **Ordenación por Defecto:** Verificar que la lista se muestra en el orden por defecto esperado.
        7.  **Seguridad:** Asegurar que un profesional solo ve y puede interactuar con sus propios pacientes.
        8.  **Diseño Responsivo:** Probar en diferentes dispositivos y resoluciones de pantalla.

---

### HU-009: Visualización del Perfil Detallado del Paciente

*   **ID:** HU-009
*   **Título:** Visualización del Perfil Detallado del Paciente
*   **Como un:** Profesional que ha iniciado sesión
*   **Quiero:** Poder ver una página con el perfil detallado de un paciente específico, mostrando toda su información relevante
*   **Para que:** Pueda consultar todos los datos del paciente en un solo lugar, revisar su historial, planes y progreso.

*   **Requisitos Funcionales Asociados (PRD):**
    *   "Visualización del perfil detallado de cada paciente" (Característica Must Have)
    *   Implica mostrar datos de `PATIENT`, `BIOMETRIC_RECORD`, y enlaces/secciones para `DIET_PLAN`, `WORKOUT_PLAN`.

*   **Criterios de Aceptación:**

    *   **Interfaz de Usuario (Frontend):**
        1.  **Acceso al Perfil:**
            *   Se accede a esta vista al hacer clic en "Ver Detalles" (o similar) desde la lista de pacientes en el dashboard (HU-008).
            *   La URL debe ser específica para el paciente (ej. `/patients/{patientId}`).
        2.  **Diseño de la Página de Perfil:**
            *   La página debe estar bien organizada, posiblemente utilizando pestañas o secciones para diferentes tipos de información.
        3.  **Sección de Información Personal y de Contacto:**
            *   Mostrar claramente: Nombre completo, Email, Teléfono, Fecha de Nacimiento, Género, Altura.
            *   Mostrar: Notas médicas, Restricciones alimentarias, Objetivos generales del paciente.
            *   Botón/enlace para "Editar Información del Paciente" (que lleve a HU-006).
        4.  **Sección de Métricas Biométricas/Evolución:**
            *   Mostrar el último registro biométrico del paciente (peso, % grasa, % músculo, etc.).
            *   Enlace o botón para "Añadir Nuevo Registro Biométrico" (lleva a HU-010).
            *   Enlace o sección para "Ver Evolución / Historial de Métricas" que podría mostrar una tabla de todos los `BIOMETRIC_RECORD` y/o gráficos básicos (HU-011). Para MVP "Must Have", al menos el último registro y la opción de añadir nuevo. Los gráficos son "Should Have".
        5.  **Sección de Planes de Dieta:**
            *   Listar los planes de dieta activos e históricos del paciente (Título, fechas).
            *   Para cada plan, opción para "Ver Detalles del Plan" (lleva a HU-013), "Editar Plan" (HU-014), "Generar PDF" (HU-017), "Enviar Plan" (HU-018).
            *   Botón para "Crear Nuevo Plan de Dieta" (lleva a HU-012).
        6.  **Sección de Planes de Entrenamiento:**
            *   Listar los planes de entrenamiento activos e históricos (similar a dietas).
            *   Acciones similares: "Ver Detalles", "Editar", "Generar PDF", "Enviar Plan".
            *   Botón para "Crear Nuevo Plan de Entrenamiento" (lleva a HU-015).
        7.  **Navegación:**
            *   Un enlace "Volver a la lista de Pacientes" o breadcrumbs para fácil navegación.
        8.  **Diseño Responsivo:** La vista debe ser clara y utilizable en todos los dispositivos.

    *   **Lógica de Negocio (Backend):**
        1.  **Endpoint de Obtención de Detalles del Paciente:**
            *   Debe existir un endpoint API (ej. `GET /api/patients/{patientId}`) que devuelva toda la información detallada de un paciente específico.
            *   Este endpoint debe ser protegido.
        2.  **Autorización:**
            *   Verificar que el profesional autenticado es el propietario (`professional_id`) del paciente solicitado.
        3.  **Datos Devueltos:**
            *   El endpoint debe devolver:
                *   Todos los campos de la tabla `PATIENT`.
                *   Los registros asociados de `BIOMETRIC_RECORD` (quizás el último o todos, paginados si son muchos).
                *   Un resumen o lista de `DIET_PLAN` asociados (ID, título, fechas, estado activo/inactivo).
                *   Un resumen o lista de `WORKOUT_PLAN` asociados (ID, título, fechas, estado activo/inactivo).
        4.  **Respuesta del API:**
            *   **Éxito (200 OK):** Devolver el objeto completo del paciente con sus datos asociados.
            *   **No Autorizado (401 Unauthorized).**
            *   **Prohibido (403 Forbidden).**
            *   **No Encontrado (404 Not Found):** Si `patientId` no existe.
            *   **Error del Servidor (500 Internal Server Error).**

    *   **Pruebas (QA):**
        1.  **Visualización de Perfil Completo:**
            *   Registrar un paciente con todos los datos posibles (incluyendo un registro biométrico inicial). Crear un plan de dieta y uno de entrenamiento.
            *   Acceder a su perfil y verificar que toda la información se muestra correctamente en las secciones correspondientes.
        2.  **Perfil con Datos Mínimos:** Acceder al perfil de un paciente con solo datos obligatorios y verificar cómo se muestra (ej. mensajes de "Aún no hay planes").
        3.  **Navegación desde el Perfil:**
            *   Verificar que todos los botones de acción (Editar Paciente, Añadir Registro Biométrico, Crear Plan de Dieta/Entrenamiento) llevan a las pantallas/funcionalidades correctas.
            *   Verificar que los enlaces para ver detalles de planes específicos funcionan.
        4.  **Seguridad:**
            *   Intentar acceder al perfil de un paciente de otro profesional mediante la URL. Verificar que se deniega el acceso.
        5.  **Consistencia de Datos:** Verificar que los datos mostrados son consistentes con lo que hay en la base de datos.
        6.  **Diseño Responsivo:** Probar la visualización en diferentes dispositivos.
        7.  **Manejo de Errores:**
            *   Probar acceder a un `patientId` inexistente.

---

## Seguimiento de Métricas

### HU-010: Registro de Nuevas Medidas Biométricas del Paciente

*   **ID:** HU-010
*   **Título:** Registro de Nuevas Medidas Biométricas del Paciente
*   **Como un:** Profesional que ha iniciado sesión
*   **Quiero:** Poder registrar nuevas medidas biométricas (peso, % grasa, % músculo, % agua, diámetros corporales, etc.) para un paciente específico, asociándolas a una fecha de medición.
*   **Para que:** Pueda llevar un seguimiento detallado de la evolución física del paciente a lo largo del tiempo.

*   **Requisitos Funcionales Asociados (PRD):**
    *   RF3.1: El sistema permitirá a los profesionales registrar y actualizar múltiples medidas biométricas (peso, porcentaje de grasa, porcentaje muscular, etc.).
    *   RF3.3: El sistema permitirá establecer fechas de medición para el seguimiento periódico.
    *   "Registro de medidas biométricas iniciales (peso, porcentaje de grasa, etc.)" (Must Have - Cubierto parcialmente en HU-005, aquí se enfoca en registros periódicos).
    *   "Registro y seguimiento de medidas biométricas periódicas" (Should Have - Esta HU es el núcleo de esta funcionalidad).

*   **Criterios de Aceptación:**

    *   **Interfaz de Usuario (Frontend):**
        1.  **Acceso al Formulario:**
            *   Desde el perfil detallado del paciente (HU-009), en la sección de "Métricas Biométricas", debe haber un botón/enlace "Añadir Nuevo Registro Biométrico" o similar.
        2.  **Formulario de Registro Biométrico:** Se utilizará `React Hook Form` para la gestión del estado del formulario y las validaciones.
            *   El formulario debe permitir ingresar:
                *   Fecha del registro (`record_date` - tipo fecha, obligatorio, por defecto la fecha actual pero editable).
                *   Peso (número en kg, opcional, con decimales).
                *   Porcentaje de grasa corporal (%) (número, opcional, con decimales).
                *   Porcentaje de masa muscular (%) (número, opcional, con decimales).
                *   Porcentaje de agua (%) (número, opcional, con decimales).
                *   Diámetro espalda/pecho (cm) (número, opcional, con decimales).
                *   Diámetro cintura (cm) (número, opcional, con decimales).
                *   Diámetro brazos (cm) (número, opcional, con decimales).
                *   Diámetro piernas (cm) (número, opcional, con decimales).
                *   Diámetro gemelos (cm) (número, opcional, con decimales).
                *   Notas adicionales para este registro (área de texto, opcional).
            *   Al menos uno de los campos de medida (peso, porcentajes, diámetros) debería ser requerido además de la fecha para que el registro tenga sentido.
        3.  **Validaciones en Cliente:**
            *   La fecha de registro es obligatoria.
            *   Los campos numéricos deben aceptar solo números y decimales en el formato correcto.
            *   Validar que al menos una medida biométrica se ha introducido.
            *   Mostrar mensajes de error claros.
        4.  **Envío del Formulario:**
            *   Al hacer clic en "Guardar Registro", si las validaciones son correctas, los datos se envían al backend.
            *   Mostrar indicador de carga.
        5.  **Respuesta del Sistema:**
            *   **Éxito:** Mostrar un mensaje de confirmación (ej. "Registro biométrico guardado correctamente para [Fecha]."). Idealmente, actualizar la vista del perfil del paciente para reflejar el nuevo registro (ej. en la lista de historial de métricas o actualizando el "último registro").
            *   **Error de Validación:** Mostrar mensajes de error del servidor.
            *   **Error Genérico:** Mostrar un mensaje genérico.

    *   **Lógica de Negocio (Backend):**
        1.  **Endpoint de Creación de Registro Biométrico:**
            *   Debe existir un endpoint API (ej. `POST /api/patients/{patientId}/biometric-records`) que acepte todos los campos del `BIOMETRIC_RECORD`.
            *   Este endpoint debe ser protegido.
        2.  **Autorización:**
            *   Verificar que el profesional autenticado es el propietario del `patientId` para el cual se está añadiendo el registro.
        3.  **Validación de Datos del Servidor:**
            *   `patientId` debe ser válido y existir.
            *   `record_date` es obligatoria y debe ser una fecha válida.
            *   Validar tipos de datos numéricos y rangos si es necesario (ej. porcentajes entre 0-100).
            *   Asegurar que al menos un valor de medida biométrica (peso, porcentaje, diámetro) esté presente.
        4.  **Creación del Registro Biométrico:**
            *   Crear un nuevo registro en la tabla `BIOMETRIC_RECORD` asociado al `patient_id` correcto, con todos los datos proporcionados.
            *   Guardar `created_at` (la `record_date` es la fecha de la medición en sí).
        5.  **Respuesta del API:**
            *   **Éxito (201 Created):** Devolver el registro biométrico creado.
            *   **Error de Validación (400 Bad Request).**
            *   **No Autorizado (401 Unauthorized).**
            *   **Prohibido (403 Forbidden).**
            *   **No Encontrado (404 Not Found):** Si `patientId` no existe.
            *   **Error del Servidor (500 Internal Server Error).**

    *   **Pruebas (QA):**
        1.  **Registro Exitoso:**
            *   Para un paciente existente, añadir un nuevo registro biométrico con todos los campos.
            *   Verificar que el registro se guarda correctamente en la BD y se asocia al paciente y profesional correctos.
            *   Verificar que la fecha de registro se guarda correctamente.
        2.  **Registro con Campos Mínimos:** Añadir un registro solo con fecha y una medida (ej. peso).
        3.  **Validaciones:**
            *   Intentar guardar sin fecha de registro.
            *   Intentar guardar sin ninguna medida biométrica.
            *   Probar formatos inválidos para números y fechas.
        4.  **Actualización en UI:** Verificar que después de guardar, la información se actualiza en el perfil del paciente (ej. el último registro visible o la lista/tabla de historial).
        5.  **Seguridad:** Intentar añadir un registro biométrico a un paciente de otro profesional.
        6.  **Consistencia de Datos:** Los datos guardados deben coincidir con los introducidos.
        7.  **Múltiples Registros:** Añadir varios registros biométricos para el mismo paciente en diferentes fechas y verificar que se almacenan correctamente.

---

### HU-011: Visualización de la Evolución de Métricas del Paciente

*   **ID:** HU-011
*   **Título:** Visualización de la Evolución de Métricas del Paciente
*   **Como un:** Profesional que ha iniciado sesión
*   **Quiero:** Poder visualizar la evolución de las métricas biométricas de un paciente a lo largo del tiempo mediante gráficos y una tabla histórica.
*   **Para que:** Pueda analizar el progreso del paciente, identificar tendencias y tomar decisiones informadas sobre sus planes.

*   **Requisitos Funcionales Asociados (PRD):**
    *   RF3.2: El sistema permitirá visualizar la evolución de las métricas a través de gráficos.
    *   "Visualización de la evolución del paciente mediante gráficos básicos" (Should Have).

*   **Criterios de Aceptación:**

    *   **Interfaz de Usuario (Frontend):**
        1.  **Acceso a la Vista de Evolución:**
            *   Desde el perfil detallado del paciente (HU-009), en la sección de "Métricas Biométricas", debe haber un enlace/botón "Ver Evolución" o la sección podría expandirse para mostrar gráficos/tabla.
            *   Podría ser una sub-página del perfil del paciente (ej. `/patients/{patientId}/evolution`).
        2.  **Selección de Métrica a Graficar:**
            *   Permitir al usuario seleccionar qué métrica principal desea ver en el gráfico (ej. Peso, % Grasa Corporal, % Masa Muscular). Un selector o botones para cambiar de métrica.
        3.  **Gráfico de Evolución:**
            *   Mostrar un gráfico de líneas (o de barras, según la métrica) que represente la evolución de la métrica seleccionada a lo largo del tiempo.
            *   El eje X debe representar la `record_date` (fecha de medición).
            *   El eje Y debe representar el valor de la métrica.
            *   El gráfico debe ser interactivo (mostrar valores al pasar el cursor sobre los puntos de datos).
            *   Debe ser claro, legible y responsivo.
            *   Utilizar una librería de gráficos de JavaScript (ej. Chart.js, Recharts, Nivo).
        4.  **Tabla de Historial de Registros Biométricos:**
            *   Mostrar una tabla con todos los registros biométricos (`BIOMETRIC_RECORD`) del paciente.
            *   Columnas: Fecha de Registro, Peso, % Grasa, % Músculo, % Agua, y los diferentes diámetros, Notas.
            *   La tabla debe ser ordenable por fecha (más reciente o más antiguo primero).
            *   Paginación si la lista es muy larga.
            *   Opción para editar o eliminar un registro biométrico individual (esto podría ser una HU separada si la lógica de edición/eliminación es compleja, pero para MVP se puede considerar aquí o como una mejora).
        5.  **Rango de Fechas (Opcional para MVP "Should Have", pero útil):**
            *   Permitir filtrar los datos del gráfico y la tabla por un rango de fechas.

    *   **Lógica de Negocio (Backend):**
        1.  **Endpoint para Obtener Registros Biométricos:**
            *   El endpoint `GET /api/patients/{patientId}/biometric-records` (que podría ser el mismo usado para obtener el último registro o una variante).
            *   Debe poder devolver todos los registros biométricos de un paciente específico, ordenados por `record_date`.
            *   Debe ser protegido y verificar la propiedad del paciente.
            *   Opcional: Aceptar parámetros para filtrar por rango de fechas.
        2.  **Datos Devueltos:**
            *   Una lista de todos los objetos `BIOMETRIC_RECORD` para el paciente, conteniendo todos sus campos.
        3.  **Respuesta del API:**
            *   **Éxito (200 OK):** Devolver la lista de registros biométricos.
            *   **No Autorizado (401 Unauthorized).**
            *   **Prohibido (403 Forbidden).**
            *   **No Encontrado (404 Not Found):** Si `patientId` no existe.

    *   **Pruebas (QA):**
        1.  **Visualización del Gráfico:**
            *   Registrar múltiples mediciones para un paciente en diferentes fechas para varias métricas (peso, grasa, músculo).
            *   Verificar que el gráfico se muestra correctamente para cada métrica seleccionable.
            *   Verificar la exactitud de los puntos de datos y las fechas en el gráfico.
            *   Probar la interactividad del gráfico (tooltips).
        2.  **Visualización de la Tabla Histórica:**
            *   Verificar que todos los registros biométricos se listan en la tabla.
            *   Verificar que los datos en la tabla son correctos.
            *   Probar la ordenación por fecha.
            *   Probar la paginación (si existe).
        3.  **Consistencia entre Gráfico y Tabla:** Los datos del gráfico deben reflejar los de la tabla.
        4.  **Sin Datos:** Si un paciente no tiene registros biométricos (aparte del inicial si no se considera periódico), mostrar un mensaje apropiado en lugar del gráfico/tabla.
        5.  **Con Pocos Datos:** Verificar cómo se ve el gráfico con solo uno o dos puntos de datos.
        6.  **Diseño Responsivo:** Probar en diferentes dispositivos, asegurando que los gráficos y tablas son legibles y usables.
        7.  **Selección de Métrica:** Verificar que al cambiar la métrica a graficar, el gráfico se actualiza correctamente.
        8.  **Filtrado por Rango de Fechas (si implementado):** Probar el filtrado y verificar su corrección. 

---

## Creación de Planes

### HU-012: Creación Básica de Plan de Dieta

*   **ID:** HU-012
*   **Título:** Creación Básica de Plan de Dieta
*   **Como un:** Profesional (especialmente nutricionista, pero también entrenador si aplica) que ha iniciado sesión
*   **Quiero:** Poder crear un nuevo plan de dieta personalizado para un paciente específico, definiendo un título, descripción, fechas de vigencia, objetivos y las comidas para diferentes momentos del día.
*   **Para que:** Pueda proporcionar al paciente una guía nutricional estructurada y adaptada a sus necesidades.

*   **Requisitos Funcionales Asociados (PRD):**
    *   RF4.1: El sistema permitirá a los profesionales crear planes de dieta personalizados para sus pacientes.
    *   RF4.4: El sistema permitirá a los profesionales organizar planes por días de la semana (para MVP básico, podemos empezar con una estructura diaria genérica o un plan semanal simple, y luego iterar a días específicos de la semana si es necesario).
    *   "Creación básica de planes de dieta" (Must Have).

*   **Criterios de Aceptación:**

    *   **Interfaz de Usuario (Frontend):**
        1.  **Acceso a la Creación del Plan:**
            *   Desde el perfil del paciente (HU-009), en la sección de "Planes de Dieta", un botón "Crear Nuevo Plan de Dieta".
            *   Alternativamente, desde un dashboard de "Planes" si existiera uno general.
        2.  **Formulario de Creación de Plan de Dieta - Cabecera:** Se utilizará `React Hook Form` para la gestión del estado del formulario y las validaciones, incluyendo la gestión dinámica de comidas.
            *   Título del Plan (texto, obligatorio).
            *   Descripción general del plan (área de texto, opcional).
            *   Paciente asignado (debería estar preseleccionado si se accede desde el perfil del paciente, o ser un selector si se crea desde un dashboard general; para MVP, asumimos creación desde perfil de paciente).
            *   Fecha de inicio del plan (`start_date` - fecha, opcional).
            *   Fecha de finalización del plan (`end_date` - fecha, opcional).
            *   Objetivos específicos del plan (área de texto, opcional).
            *   Estado del plan (ej. "Activo" / "Borrador" - selector, por defecto "Activo" o "Borrador").
            *   Notas adicionales generales del plan (área de texto, opcional).
        3.  **Formulario de Creación de Plan de Dieta - Estructura de Comidas (DIET_MEAL):**
            *   Una forma dinámica de añadir/editar/eliminar comidas para el plan.
            *   Para cada comida (`DIET_MEAL`):
                *   Tipo de Comida (selector: "Desayuno", "Media Mañana", "Almuerzo", "Merienda", "Cena", "Resopón", "Pre-entreno", "Post-entreno", etc. - configurable o con valores fijos para MVP; obligatorio).
                *   Contenido de la comida (área de texto grande, obligatorio, debe permitir formato básico como listas).
                *   Opcional MVP: Hora aproximada.
            *   Permitir añadir múltiples comidas.
            *   **Organización:** Para MVP "Must Have" básico, las comidas se pueden listar secuencialmente. Para RF4.4 (organizar por días), se necesitaría una estructura más compleja (ej. pestañas para Lunes-Domingo, y dentro de cada día añadir comidas, o una lista de "Días de Dieta" y dentro de cada día sus comidas). *Decisión de diseño: Para MVP básico, un conjunto de comidas que se repiten diariamente. La organización por días específicos de la semana puede ser una mejora.*
        4.  **Validaciones en Cliente:**
            *   Título del plan es obligatorio.
            *   Para cada comida: tipo de comida y contenido son obligatorios.
            *   Fechas deben ser válidas y `end_date` posterior a `start_date` si ambas se proporcionan.
        5.  **Envío del Formulario:**
            *   Botón "Guardar Plan de Dieta".
            *   Mostrar indicador de carga.
        6.  **Respuesta del Sistema:**
            *   **Éxito:** Mensaje de confirmación. Redirigir al perfil del paciente (a la sección de planes) o a la vista detallada del plan recién creado (HU-013).
            *   **Error:** Mostrar mensajes de error.

    *   **Lógica de Negocio (Backend):**
        1.  **Endpoint de Creación de Plan de Dieta:**
            *   `POST /api/patients/{patientId}/diet-plans` o `POST /api/diet-plans` (si se envía `patientId` en el cuerpo).
            *   Aceptar datos de la cabecera del plan (`DIET_PLAN`) y una lista/array de objetos comida (`DIET_MEAL`).
            *   Endpoint protegido, requiere autenticación.
        2.  **Autorización y Asociación:**
            *   Verificar que el `patientId` pertenece al profesional autenticado.
            *   El `professional_id` se asigna automáticamente al `DIET_PLAN`.
        3.  **Validación de Datos del Servidor:**
            *   Validar campos obligatorios de `DIET_PLAN` (título, `patient_id`, `professional_id`).
            *   Validar fechas.
            *   Para cada `DIET_MEAL` en la lista: validar campos obligatorios (tipo, contenido).
        4.  **Creación del Plan y Comidas:**
            *   Crear el registro en `DIET_PLAN`.
            *   Para cada objeto comida recibido, crear un registro en `DIET_MEAL` asociado al `diet_plan_id` recién creado.
            *   Idealmente, esto debería ser una transacción para asegurar que o se crea todo o no se crea nada.
        5.  **Respuesta del API:**
            *   **Éxito (201 Created):** Devolver el plan de dieta creado, incluyendo sus comidas.
            *   **Error de Validación (400 Bad Request).**
            *   **No Autorizado (401 Unauthorized).**
            *   **Prohibido (403 Forbidden).**
            *   **No Encontrado (404 Not Found):** Si `patientId` es inválido.

    *   **Pruebas (QA):**
        1.  **Creación Exitosa de Plan Simple:**
            *   Crear un plan con título, asignado a un paciente, y 2-3 comidas.
            *   Verificar que el plan y sus comidas se guardan correctamente en la BD (`DIET_PLAN`, `DIET_MEAL`) y se asocian correctamente al paciente y profesional.
        2.  **Creación de Plan Completo:** Usar todos los campos opcionales (fechas, descripción, objetivos, notas).
        3.  **Validaciones:**
            *   Probar sin título, sin comidas, sin contenido en una comida.
            *   Probar con fechas inválidas.
        4.  **Asociación Correcta:** Verificar que el plan solo es visible/accesible para el profesional que lo creó y para el paciente asignado (en vistas futuras).
        5.  **Integridad Transaccional (si es posible probar):** Intentar simular un fallo durante la creación de las comidas para ver si el plan principal se revierte.
        6.  **Actualización en UI:** Verificar que el nuevo plan aparece en la lista de planes del paciente en su perfil.

---

### HU-013: Visualización de Detalles de un Plan de Dieta

*   **ID:** HU-013
*   **Título:** Visualización de Detalles de un Plan de Dieta
*   **Como un:** Profesional que ha iniciado sesión
*   **Quiero:** Poder ver los detalles completos de un plan de dieta específico de un paciente, incluyendo toda su información general y el listado de comidas.
*   **Para que:** Pueda revisar el plan en detalle, prepararme para una consulta o usarlo como base para futuras modificaciones o para generar un PDF.

*   **Requisitos Funcionales Asociados (PRD):**
    *   Implícito en la gestión de planes de dieta. Es necesario poder ver lo que se ha creado.

*   **Criterios de Aceptación:**

    *   **Interfaz de Usuario (Frontend):**
        1.  **Acceso a los Detalles del Plan:**
            *   Desde el perfil del paciente (HU-009), en la lista de planes de dieta, cada plan debe tener un enlace/botón "Ver Detalles".
            *   La URL podría ser algo como `/patients/{patientId}/diet-plans/{dietPlanId}`.
        2.  **Visualización de Información General del Plan:**
            *   Mostrar claramente:
                *   Título del Plan.
                *   Nombre del Paciente al que pertenece.
                *   Descripción general.
                *   Fecha de inicio y finalización.
                *   Objetivos del plan.
                *   Estado (Activo, Borrador, Histórico).
                *   Notas adicionales del plan.
        3.  **Visualización de Comidas del Plan (`DIET_MEAL`):**
            *   Listar todas las comidas asociadas al plan.
            *   Para cada comida, mostrar:
                *   Tipo de Comida (Desayuno, Almuerzo, etc.).
                *   Contenido detallado de la comida.
                *   (Opcional) Hora aproximada.
            *   La presentación debe ser clara y fácil de leer.
        4.  **Acciones Disponibles:**
            *   Botón/enlace para "Editar Plan" (lleva a HU-014).
            *   Botón/enlace para "Generar PDF del Plan" (lleva a HU-017).
            *   Botón/enlace para "Enviar Plan" (lleva a HU-018).
            *   Botón/enlace para "Eliminar Plan" (lleva a HU con confirmación, podría ser una HU separada).
            *   Botón/enlace para "Duplicar Plan" (funcionalidad avanzada, no para MVP).
        5.  **Navegación:**
            *   Enlace para "Volver al Perfil del Paciente" o a la lista de planes.
            *   Breadcrumbs si la navegación es profunda.
        6.  **Diseño Responsivo.**

    *   **Lógica de Negocio (Backend):**
        1.  **Endpoint para Obtener Detalles del Plan de Dieta:**
            *   `GET /api/diet-plans/{dietPlanId}` o `GET /api/patients/{patientId}/diet-plans/{dietPlanId}`.
            *   Endpoint protegido.
        2.  **Autorización:**
            *   Verificar que el profesional autenticado es el propietario del paciente al que pertenece el plan de dieta (verificando `professional_id` en `DIET_PLAN` o a través del `patient_id` asociado).
        3.  **Datos Devueltos:**
            *   Toda la información del registro `DIET_PLAN` solicitado.
            *   Una lista de todos los registros `DIET_MEAL` asociados a ese `diet_plan_id`, ordenados por tipo de comida o un orden predefinido.
        4.  **Respuesta del API:**
            *   **Éxito (200 OK):** Devolver el objeto completo del plan de dieta con sus comidas.
            *   **No Autorizado (401 Unauthorized).**
            *   **Prohibido (403 Forbidden).**
            *   **No Encontrado (404 Not Found):** Si `dietPlanId` no existe o no pertenece al profesional/paciente.

    *   **Pruebas (QA):**
        1.  **Visualización Correcta:**
            *   Crear un plan de dieta con varias comidas y todos los detalles.
            *   Acceder a su vista de detalles y verificar que toda la información (cabecera y comidas) se muestra correctamente y coincide con lo guardado.
        2.  **Plan Sin Comidas:** Si se permite crear un plan sin comidas (ej. un borrador), verificar cómo se visualiza.
        3.  **Navegación:**
            *   Verificar que los botones de acción (Editar, Generar PDF, etc.) están presentes y, si ya están implementados, llevan al lugar correcto.
            *   Verificar enlaces de navegación (volver al perfil).
        4.  **Seguridad:** Intentar acceder a los detalles de un plan de dieta de otro profesional/paciente mediante URL directa.
        5.  **Consistencia:** Los datos mostrados deben ser consistentes.
        6.  **Diseño Responsivo:** Probar en diferentes dispositivos.

---

### HU-014: Edición de Plan de Dieta Existente

*   **ID:** HU-014
*   **Título:** Edición de Plan de Dieta Existente
*   **Como un:** Profesional que ha iniciado sesión
*   **Quiero:** Poder editar un plan de dieta existente de un paciente, modificando su información general (título, fechas, objetivos, etc.) y las comidas (añadir, editar contenido, cambiar tipo, eliminar).
*   **Para que:** Pueda ajustar y actualizar los planes de dieta según la evolución del paciente o corregir errores.

*   **Requisitos Funcionales Asociados (PRD):**
    *   RF4.3: El sistema permitirá a los profesionales editar planes existentes.

*   **Criterios de Aceptación:**

    *   **Interfaz de Usuario (Frontend):**
        1.  **Acceso a la Edición:**
            *   Desde la vista de detalles de un plan de dieta (HU-013), un botón/enlace "Editar Plan".
            *   La URL podría ser `/patients/{patientId}/diet-plans/{dietPlanId}/edit`.
        2.  **Formulario de Edición:** Se utilizará `React Hook Form` para la gestión del estado del formulario y las validaciones, incluyendo la gestión dinámica de comidas.
            *   El formulario debe ser idéntico o muy similar al de creación de plan de dieta (HU-012), pero pre-cargado con todos los datos del plan existente, incluyendo la información general y todas sus comidas.
        3.  **Modificación de Información General:**
            *   Permitir editar todos los campos de la cabecera del plan (título, descripción, fechas, objetivos, estado, notas).
        4.  **Modificación de Comidas (`DIET_MEAL`):**
            *   Para las comidas existentes:
                *   Permitir editar el tipo de comida.
                *   Permitir editar el contenido de la comida.
                *   Permitir eliminar una comida individual del plan (con confirmación).
            *   Permitir añadir nuevas comidas al plan (misma funcionalidad que en HU-012).
            *   Permitir reordenar las comidas (opcional MVP, podría ser drag-and-drop o botones de subir/bajar).
        5.  **Validaciones en Cliente:**
            *   Mismas validaciones que en el formulario de creación.
        6.  **Envío del Formulario:**
            *   Botón "Guardar Cambios".
            *   Botón "Cancelar" que descarte los cambios y regrese a la vista de detalles del plan.
            *   Mostrar indicador de carga al guardar.
        7.  **Respuesta del Sistema:**
            *   **Éxito:** Mensaje de confirmación. Redirigir a la vista de detalles del plan actualizado (HU-013).
            *   **Error:** Mostrar mensajes de error.

    *   **Lógica de Negocio (Backend):**
        1.  **Endpoint de Actualización de Plan de Dieta:**
            *   `PUT /api/diet-plans/{dietPlanId}`.
            *   Aceptar datos de la cabecera del plan (`DIET_PLAN`) y una lista/array de objetos comida (`DIET_MEAL`) que represente el estado final del plan.
            *   Endpoint protegido.
        2.  **Autorización:**
            *   Verificar que el profesional autenticado es el propietario del plan.
        3.  **Validación de Datos del Servidor:**
            *   Validar todos los datos recibidos, similar a la creación.
        4.  **Actualización del Plan y Comidas:**
            *   Actualizar el registro en `DIET_PLAN`.
            *   Para las comidas (`DIET_MEAL`):
                *   **Estrategia de Actualización:** Decidir cómo manejar las comidas. Opciones:
                    1.  **Eliminar y Recrear:** Eliminar todas las `DIET_MEAL` existentes para ese `diet_plan_id` y luego crear nuevas basadas en la lista recibida. Simple pero puede ser ineficiente y perder IDs si son relevantes.
                    2.  **Actualizar, Añadir, Eliminar (Más Complejo):** Comparar la lista de comidas recibida con la existente. Identificar comidas a actualizar (mismo ID, contenido diferente), comidas nuevas (sin ID o con ID no existente) y comidas a eliminar (IDs existentes en BD pero no en la lista recibida). Esto es más robusto pero más complejo de implementar.
                *   Para MVP, la opción 1 (eliminar y recrear) puede ser aceptable si no hay dependencias complejas en los IDs de `DIET_MEAL`. Si se espera mantener historial de cambios a nivel de comida, la opción 2 es mejor a largo plazo.
            *   Asegurar la atomicidad de la operación (transacción).
            *   Actualizar el campo `updated_at` del `DIET_PLAN`.
        5.  **Respuesta del API:**
            *   **Éxito (200 OK):** Devolver el plan de dieta actualizado con sus comidas.
            *   **Error de Validación (400 Bad Request).**
            *   **No Autorizado (401 Unauthorized).**
            *   **Prohibido (403 Forbidden).**
            *   **No Encontrado (404 Not Found):** Si `dietPlanId` no existe.

    *   **Pruebas (QA):**
        1.  **Edición Exitosa:**
            *   Crear un plan, luego editar su título, descripción, una comida existente (tipo y contenido), añadir una nueva comida y eliminar otra. Guardar.
            *   Verificar que todos los cambios se reflejan correctamente en la vista de detalles y en la BD.
            *   Verificar que `updated_at` del plan se actualizó.
        2.  **Cancelar Edición:** Editar campos y luego cancelar. Verificar que los cambios no se guardan.
        3.  **Validaciones:** Probar guardar con datos inválidos (ej. título vacío, comida sin contenido).
        4.  **Seguridad:** Intentar editar un plan de otro profesional.
        5.  **Casos de Comidas:**
            *   Editar un plan y no modificar ninguna comida.
            *   Editar un plan y eliminar todas las comidas (si permitido).
            *   Editar un plan y solo añadir comidas.
            *   Editar un plan y solo cambiar el contenido de las comidas existentes.
        6.  **Consistencia:** Los datos deben ser consistentes antes y después de la edición (si no se guardan cambios).

---

### HU-015: Creación Básica de Plan de Entrenamiento

*   **ID:** HU-015
*   **Título:** Creación Básica de Plan de Entrenamiento
*   **Como un:** Profesional (especialmente entrenador, pero también nutricionista si aplica) que ha iniciado sesión
*   **Quiero:** Poder crear un nuevo plan de entrenamiento personalizado para un paciente, definiendo título, descripción, fechas, objetivos, y para cada día de entrenamiento, los ejercicios con sus series/repeticiones.
*   **Para que:** Pueda proporcionar al paciente una rutina de ejercicios estructurada y adaptada a sus metas.

*   **Requisitos Funcionales Asociados (PRD):**
    *   RF4.2: El sistema permitirá a los profesionales crear planes de entrenamiento personalizados para sus pacientes.
    *   RF4.4: El sistema permitirá a los profesionales organizar planes por días de la semana.
    *   (Implícito en PRD que un plan de entrenamiento tiene "días" y cada día "ejercicios").

*   **Criterios de Aceptación:**

    *   **Interfaz de Usuario (Frontend):**
        1.  **Acceso a la Creación del Plan:**
            *   Desde el perfil del paciente (HU-009), en la sección de "Planes de Entrenamiento", un botón "Crear Nuevo Plan de Entrenamiento".
        2.  **Formulario de Creación de Plan de Entrenamiento - Cabecera:** Se utilizará `React Hook Form` para la gestión del estado del formulario y las validaciones, incluyendo la gestión dinámica de días y ejercicios.
            *   Similar a la de planes de dieta: Título (obligatorio), Descripción, Paciente asignado (preseleccionado), Fecha de inicio, Fecha de finalización, Objetivos, Estado, Notas.
        3.  **Formulario de Creación - Estructura de Días y Ejercicios (`WORKOUT_DAY`, `EXERCISE`):**
            *   Una forma dinámica de añadir/editar/eliminar "Días de Entrenamiento".
            *   Para cada `WORKOUT_DAY`:
                *   Día de la Semana (selector: Lunes, Martes, ..., Domingo, o "Día 1", "Día 2", etc. - obligatorio).
                *   Descripción/Enfoque del día (área de texto, opcional, ej: "Pecho y Tríceps", "Cardio").
                *   Dentro de cada día, una forma dinámica de añadir/editar/eliminar `EXERCISE`.
                *   Para cada `EXERCISE`:
                    *   Nombre del ejercicio (texto, obligatorio).
                    *   Series y Repeticiones (ej. "4x10-12", "3xAMRAP") (texto, obligatorio).
                    *   Observaciones/Descanso (texto, opcional, ej. "Descanso 60s", "Concéntrate en la técnica").
                    *   Orden de visualización del ejercicio (se gestiona por el orden en que se añaden o con drag-and-drop simple si es posible en MVP).
            *   Permitir añadir múltiples días y múltiples ejercicios por día.
        4.  **Validaciones en Cliente:**
            *   Título del plan es obligatorio.
            *   Para cada día: Día de la semana/nombre es obligatorio.
            *   Para cada ejercicio: Nombre y series/repeticiones son obligatorios.
            *   Fechas válidas.
        5.  **Envío del Formulario:**
            *   Botón "Guardar Plan de Entrenamiento".
            *   Indicador de carga.
        6.  **Respuesta del Sistema:**
            *   **Éxito:** Mensaje de confirmación. Redirigir al perfil del paciente (sección de planes) o a la vista detallada del plan de entrenamiento recién creado (HU-016).
            *   **Error:** Mostrar mensajes de error.

    *   **Lógica de Negocio (Backend):**
        1.  **Endpoint de Creación de Plan de Entrenamiento:**
            *   `POST /api/patients/{patientId}/workout-plans` o `POST /api/workout-plans`.
            *   Aceptar datos de la cabecera (`WORKOUT_PLAN`) y una lista/array de objetos `WORKOUT_DAY`, donde cada día contiene una lista/array de objetos `EXERCISE`.
            *   Endpoint protegido.
        2.  **Autorización y Asociación:**
            *   Verificar que `patientId` pertenece al profesional.
            *   `professional_id` se asigna automáticamente al `WORKOUT_PLAN`.
        3.  **Validación de Datos del Servidor:**
            *   Validar campos obligatorios de `WORKOUT_PLAN`.
            *   Para cada `WORKOUT_DAY`: validar campos obligatorios.
            *   Para cada `EXERCISE`: validar campos obligatorios.
        4.  **Creación del Plan, Días y Ejercicios:**
            *   Crear el registro `WORKOUT_PLAN`.
            *   Iterar sobre los días recibidos: crear registro `WORKOUT_DAY` asociado al plan.
            *   Para cada día, iterar sobre sus ejercicios: crear registro `EXERCISE` asociado al día.
            *   Operación transaccional.
        5.  **Respuesta del API:**
            *   **Éxito (201 Created):** Devolver el plan de entrenamiento creado, incluyendo sus días y ejercicios.
            *   **Error de Validación (400 Bad Request).**
            *   **No Autorizado (401 Unauthorized).**
            *   **Prohibido (403 Forbidden).**
            *   **No Encontrado (404 Not Found):** Si `patientId` es inválido.

    *   **Pruebas (QA):**
        1.  **Creación Exitosa de Plan Simple:**
            *   Crear un plan con título, 1-2 días de entrenamiento, y 2-3 ejercicios por día.
            *   Verificar que el plan, días y ejercicios se guardan correctamente en BD (`WORKOUT_PLAN`, `WORKOUT_DAY`, `EXERCISE`) y se asocian correctamente.
        2.  **Creación de Plan Completo:** Usar todos los campos opcionales.
        3.  **Validaciones:**
            *   Probar sin título, sin días, sin nombre de ejercicio, sin series/reps.
        4.  **Asociación Correcta:** Verificar asociaciones profesional-plan y paciente-plan.
        5.  **Integridad Transaccional.**
        6.  **Actualización en UI:** Verificar que el nuevo plan aparece en la lista de planes del paciente.

---

### HU-016: Visualización de Detalles de un Plan de Entrenamiento

*   **ID:** HU-016
*   **Título:** Visualización de Detalles de un Plan de Entrenamiento
*   **Como un:** Profesional que ha iniciado sesión en el sistema
*   **Quiero:** Ver los detalles completos de un plan de entrenamiento específico de un paciente
*   **Para:** Poder revisarlo, prepararme para una consulta, o usarlo como base para futuras modificaciones, generación de PDF o envío al paciente.

*   **Requisitos Funcionales Asociados (PRD):**
    *   Implícito en la gestión de planes de entrenamiento. Es necesario poder ver lo que se ha creado.

*   **Criterios de Aceptación:**

    #### Interfaz de Usuario (UI):
    1.  **Acceso a la Vista de Detalles:**
        *   El profesional puede acceder a la vista de detalles de un plan de entrenamiento desde el perfil del paciente (donde se listan los planes de entrenamiento) o inmediatamente después de crear o editar un plan.
        *   La URL podría ser algo como `/patients/{patientId}/workout-plans/{workoutPlanId}`.
    2.  **Visualización de Información General del Plan:**
        *   Se muestra claramente la información general del plan: título, descripción (opcional), paciente asociado (nombre), fechas de inicio y fin (opcional), objetivos (opcional), estado (e.g., Activo, Borrador, Completado) y notas adicionales (opcionales).
    3.  **Visualización de la Estructura del Plan:**
        *   Se muestra de forma organizada la estructura del plan:
            *   Lista de `WORKOUT_DAY`s (Días de Entrenamiento): Cada día muestra su identificador (e.g., Día 1, Lunes, Pecho y Tríceps) y una descripción opcional.
            *   Lista de `EXERCISE`s (Ejercicios) por Día: Dentro de cada `WORKOUT_DAY`, se listan los ejercicios con su nombre, número de series, número de repeticiones/duración, observaciones/instrucciones y el orden definido.
    4.  **Acciones Disponibles:**
        *   Se muestran botones de acción claramente visibles: "Editar Plan" (lleva a HU-017), "Generar PDF" (HU-020), "Enviar Plan al Paciente" (HU-021), "Eliminar Plan", "Duplicar Plan". (La funcionalidad de cada botón se detallará en sus respectivas HUs).
    5.  **Navegación:**
        *   Debe existir una forma clara de navegar de vuelta al perfil del paciente o a la lista de planes de entrenamiento.
    6.  **Diseño Responsivo:**
        *   La vista de detalles del plan de entrenamiento debe ser completamente responsiva y usable en diferentes tamaños de pantalla (escritorio, tableta, móvil).

    #### Backend:
    1.  **Endpoint para Obtener Detalles del Plan:**
        *   Se debe exponer un endpoint (e.g., `GET /api/workout-plans/{workoutPlanId}` o `GET /api/patients/{patientId}/workout-plans/{workoutPlanId}`) para obtener los detalles completos de un plan de entrenamiento específico.
    2.  **Autorización:**
        *   El sistema debe verificar que el profesional autenticado tiene permiso para ver el plan de entrenamiento solicitado (es decir, el plan pertenece a uno de sus pacientes).
    3.  **Recuperación de Datos:**
        *   El endpoint debe recuperar toda la información del `WORKOUT_PLAN`, incluyendo los `WORKOUT_DAY`s asociados y, para cada día, los `EXERCISE`s correspondientes, manteniendo el orden especificado para días y ejercicios.
    4.  **Respuesta de la API:**
        *   La API debe devolver una respuesta JSON estructurada con todos los detalles del plan (200 OK).
        *   Si el plan no se encuentra, la API debe devolver un 404 Not Found.
        *   Si el profesional no está autorizado, la API debe devolver un 403 Forbidden.

    #### Pruebas (QA):
    1.  **Verificación de Visualización Completa:**
        *   Probar que un plan de entrenamiento con información completa (todos los campos generales, múltiples días, múltiples ejercicios por día con todos sus atributos) se muestra correctamente.
    2.  **Verificación de Visualización Mínima:**
        *   Probar que un plan de entrenamiento con la mínima información requerida se muestra correctamente.
        *   Verificar cómo se visualiza un plan que aún no tiene días de entrenamiento o ejercicios definidos.
    3.  **Navegación y Acciones:**
        *   Probar la navegación desde la lista de planes/perfil del paciente hacia la vista de detalles y viceversa.
        *   Verificar que todos los botones de acción están presentes.
    4.  **Seguridad:**
        *   Intentar acceder a los detalles de un plan de entrenamiento de un paciente que no pertenece al profesional autenticado (esperar error 403).
    5.  **Consistencia de Datos:**
        *   Verificar que la información mostrada en la UI coincide exactamente con los datos almacenados en la base de datos para ese plan.
    6.  **Diseño Responsivo:**
        *   Probar la visualización en diferentes resoluciones y dispositivos.
    7.  **Manejo de Errores:**
        *   Intentar acceder a un plan de entrenamiento con un ID que no existe (esperar error 404 o un mensaje amigable en la UI).

---

### HU-017: Edición de Plan de Entrenamiento Existente

*   **ID:** HU-017
*   **Título:** Edición de Plan de Entrenamiento Existente
*   **Como un:** Profesional (especialmente entrenador, pero también nutricionista si aplica) que ha iniciado sesión
*   **Quiero:** Poder editar un plan de entrenamiento existente de un paciente, modificando su información general (título, fechas, objetivos, etc.), los días de entrenamiento y los ejercicios dentro de cada día (añadir, editar detalles, cambiar orden, eliminar).
*   **Para que:** Pueda ajustar y actualizar las rutinas de entrenamiento según la evolución del paciente, corregir errores o adaptar el plan a nuevas circunstancias.

*   **Requisitos Funcionales Asociados (PRD):**
    *   RF4.3: El sistema permitirá a los profesionales editar planes existentes (aplicable a planes de entrenamiento).

*   **Criterios de Aceptación:**

    *   **Interfaz de Usuario (Frontend):**
        1.  **Acceso a la Edición:**
            *   Desde la vista de detalles de un plan de entrenamiento (HU-016), un botón/enlace "Editar Plan".
            *   La URL podría ser `/patients/{patientId}/workout-plans/{workoutPlanId}/edit`.
        2.  **Formulario de Edición:**
            *   El formulario debe ser idéntico o muy similar al de creación de plan de entrenamiento (HU-015), pero pre-cargado con todos los datos del plan existente: información general, todos sus `WORKOUT_DAY`s y todos los `EXERCISE`s dentro de cada día.
        3.  **Modificación de Información General del Plan:**
            *   Permitir editar todos los campos de la cabecera del plan (título, descripción, fechas, objetivos, estado, notas).
        4.  **Modificación de Días de Entrenamiento (`WORKOUT_DAY`):**
            *   Para los días existentes:
                *   Permitir editar el Día de la Semana/Nombre del día y su descripción/enfoque.
                *   Permitir eliminar un día completo del plan (con confirmación).
            *   Permitir añadir nuevos días de entrenamiento al plan (misma funcionalidad que en HU-015).
            *   Permitir reordenar los días de entrenamiento (opcional MVP, podría ser drag-and-drop o botones de subir/bajar).
        5.  **Modificación de Ejercicios (`EXERCISE`) dentro de un Día:**
            *   Para los ejercicios existentes dentro de un día:
                *   Permitir editar el nombre del ejercicio, series/repeticiones y observaciones.
                *   Permitir eliminar un ejercicio individual de un día (con confirmación).
            *   Permitir añadir nuevos ejercicios a un día existente (misma funcionalidad que en HU-015).
            *   Permitir reordenar los ejercicios dentro de un día (opcional MVP).
        6.  **Validaciones en Cliente:**
            *   Mismas validaciones que en el formulario de creación (HU-015): título del plan obligatorio, nombre/día para `WORKOUT_DAY` obligatorio, nombre y series/reps para `EXERCISE` obligatorio, fechas válidas.
        7.  **Envío del Formulario:**
            *   Botón "Guardar Cambios".
            *   Botón "Cancelar" que descarte los cambios y regrese a la vista de detalles del plan (HU-016).
            *   Mostrar indicador de carga al guardar.
        8.  **Respuesta del Sistema:**
            *   **Éxito:** Mensaje de confirmación (ej. "Plan de entrenamiento actualizado correctamente."). Redirigir a la vista de detalles del plan actualizado (HU-016).
            *   **Error:** Mostrar mensajes de error específicos si fallan las validaciones del backend o hay otros problemas.

    *   **Lógica de Negocio (Backend):**
        1.  **Endpoint de Actualización de Plan de Entrenamiento:**
            *   `PUT /api/workout-plans/{workoutPlanId}` (o similar, consistente con la creación).
            *   Aceptar datos de la cabecera del plan (`WORKOUT_PLAN`) y una lista/array de objetos `WORKOUT_DAY`, donde cada día contiene una lista/array de objetos `EXERCISE`, representando el estado final del plan.
            *   Endpoint protegido, requiere autenticación.
        2.  **Autorización:**
            *   Verificar que el profesional autenticado es el propietario del `WORKOUT_PLAN` que se intenta actualizar (a través de su `professional_id` directo o indirecto a través del `patient_id`).
        3.  **Validación de Datos del Servidor:**
            *   Validar todos los datos recibidos (cabecera del plan, cada día y cada ejercicio dentro de los días), similar a la creación (HU-015).
        4.  **Actualización del Plan, Días y Ejercicios:**
            *   Actualizar el registro principal en `WORKOUT_PLAN`.
            *   Para los `WORKOUT_DAY`s y sus `EXERCISE`s, decidir una estrategia de actualización (similar a HU-014 para planes de dieta):
                *   **Opción 1 (Eliminar y Recrear):** Eliminar todos los `WORKOUT_DAY`s y `EXERCISE`s existentes para ese `workoutPlanId` y luego crear nuevos basados en la estructura recibida. Simple para MVP.
                *   **Opción 2 (Granular):** Comparar la estructura recibida con la existente para actualizar, añadir o eliminar días y ejercicios individualmente. Más complejo pero preserva IDs.
            *   La operación completa (actualización del plan, días y ejercicios) debe ser transaccional para asegurar la integridad de los datos.
            *   Actualizar el campo `updated_at` del `WORKOUT_PLAN`.
        5.  **Respuesta del API:**
            *   **Éxito (200 OK):** Devolver el plan de entrenamiento actualizado, incluyendo su estructura completa de días y ejercicios.
            *   **Error de Validación (400 Bad Request):** Si los datos de entrada son inválidos.
            *   **No Autorizado (401 Unauthorized):** Si el profesional no está autenticado.
            *   **Prohibido (403 Forbidden):** Si el profesional intenta editar un plan que no le pertenece.
            *   **No Encontrado (404 Not Found):** Si el `workoutPlanId` no existe.
            *   **Error del Servidor (500 Internal Server Error):** Por errores inesperados.

    *   **Pruebas (QA):**
        1.  **Edición Exitosa de Varios Elementos:**
            *   Crear un plan de entrenamiento con varios días y ejercicios.
            *   Editar: el título del plan, la descripción de un día, el nombre de un ejercicio, las series/reps de otro, añadir un nuevo ejercicio a un día, añadir un nuevo día con ejercicios, eliminar un ejercicio específico, eliminar un día completo. Guardar.
            *   Verificar que todos los cambios se reflejan correctamente en la vista de detalles del plan (HU-016) y en la base de datos.
            *   Verificar que el campo `updated_at` del plan se actualizó.
        2.  **Cancelar Edición:** Realizar varias modificaciones y luego hacer clic en "Cancelar". Verificar que los cambios no se guardan y el plan permanece en su estado original.
        3.  **Validaciones (Frontend y Backend):**
            *   Intentar guardar el plan sin título.
            *   Intentar guardar un día sin nombre/identificador.
            *   Intentar guardar un ejercicio sin nombre o sin series/repeticiones.
            *   Verificar mensajes de error apropiados.
        4.  **Seguridad:**
            *   Intentar editar un plan de entrenamiento de un paciente que no pertenece al profesional autenticado (esperar error 403/404).
        5.  **Casos de Modificación de Estructura:**
            *   Editar un plan y no modificar ningún día/ejercicio (solo la información general).
            *   Editar un plan y eliminar todos los días de entrenamiento (si permitido, ¿cómo se comporta?).
            *   Editar un plan y solo añadir nuevos días/ejercicios.
        6.  **Consistencia de Datos:** Los datos deben ser consistentes antes y después de la edición (si no se guardan cambios) y después de una edición exitosa.
        7.  **Flujo Completo:** Probar todo el flujo de edición en los navegadores y dispositivos principales.

---

### HU-018: Generación de PDF Combinado de Plan de Dieta y Entrenamiento

*   **ID:** HU-018
*   **Título:** Generación de PDF Combinado de Plan de Dieta y Entrenamiento
*   **Como un:** Profesional que ha iniciado sesión en el sistema
*   **Quiero:** Poder seleccionar un plan de dieta y/o un plan de entrenamiento de un paciente y generar un único archivo PDF que contenga los planes seleccionados.
*   **Para que:** Pueda proporcionar al paciente un documento consolidado y personalizado con sus pautas nutricionales y/o de ejercicio, de forma imprimible o fácilmente compartible digitalmente.

*   **Requisitos Funcionales Asociados (PRD):**
    *   RF5.1: El sistema permitirá a los profesionales generar un PDF de los planes de dieta.
    *   RF5.2: El sistema permitirá a los profesionales generar un PDF de los planes de entrenamiento.
    *   (Implícito: "PDF creation... and information sending" del MVP)

*   **Criterios de Aceptación:**

    *   **Interfaz de Usuario (Frontend):**
        1.  **Acceso a la Funcionalidad:**
            *   Desde el perfil detallado del paciente (HU-009), debe haber una opción/botón claro (ej. "Generar PDF de Planes", "Exportar Planes Seleccionados").
        2.  **Selección de Planes para el PDF:**
            *   Al activar la función, la UI debe permitir al profesional seleccionar:
                *   **Un plan de dieta:** Mediante un selector que liste los planes de dieta disponibles del paciente (ej. activos o todos). Podría incluir una opción "Ninguno" o "No incluir plan de dieta".
                *   **Un plan de entrenamiento:** Mediante un selector que liste los planes de entrenamiento disponibles del paciente. Podría incluir una opción "Ninguno" o "No incluir plan de entrenamiento".
            *   El profesional debe poder seleccionar solo un plan de dieta, solo un plan de entrenamiento, o ambos. No se debe poder generar un PDF si no se selecciona al menos un plan.
        3.  **Iniciación de la Generación:**
            *   Un botón "Generar PDF" que, una vez pulsado (y habiendo seleccionado al menos un plan), envía la solicitud al backend con los IDs de los planes elegidos (o `null` para los no elegidos).
            *   Mostrar un indicador de carga/progreso durante la generación.
        4.  **Descarga del PDF:**
            *   Una vez generado, el PDF se descarga automáticamente en el navegador.
            *   El nombre del archivo PDF debe ser descriptivo (ej. `Planes_Paciente_NombreApellido_Fecha.pdf` o `Reporte_NutriTrackPro_NombrePaciente.pdf`).
        5.  **Diseño y Contenido del PDF:**
            *   **General:** Aspecto profesional y legible. Debería incluir:
                *   Logo de "NutriTrack Pro" (si se define).
                *   Nombre del Profesional.
                *   Nombre del Paciente.
                *   Fecha de generación del PDF.
            *   **Sección del Plan de Dieta (si se incluyó):**
                *   Un título claro para esta sección (ej. "Tu Plan de Alimentación").
                *   Información del plan de dieta: Título, descripción, fechas de vigencia, objetivos, notas.
                *   Detalle de las comidas (`DIET_MEAL`): Tipo de comida, contenido detallado, hora (si existe), presentadas de forma clara y organizada.
            *   **Sección del Plan de Entrenamiento (si se incluyó):**
                *   Un título claro para esta sección (ej. "Tu Rutina de Entrenamiento").
                *   Información del plan de entrenamiento: Título, descripción, fechas, objetivos, notas.
                *   Detalle de los días de entrenamiento (`WORKOUT_DAY`): Nombre/día, descripción/enfoque.
                *   Detalle de los ejercicios (`EXERCISE`) por día: Nombre, series/repeticiones, observaciones, presentados de forma clara y organizada.
            *   **Organización:** Si ambos planes están incluidos, deben aparecer como secciones distintas y bien diferenciadas dentro del mismo PDF.
            *   **Pie de Página (Opcional):** Número de página, información de contacto del profesional.

    *   **Lógica de Negocio (Backend):**
        1.  **Endpoint para Generar PDF Combinado:**
            *   Debe existir un endpoint API, por ejemplo `POST /api/patients/{patientId}/combined-pdf`. Se usa `POST` para poder enviar los IDs de los planes seleccionados en el cuerpo de la solicitud.
            *   El cuerpo de la solicitud podría ser `{ "dietPlanId": "uuid_o_null", "workoutPlanId": "uuid_o_null" }`.
            *   Este endpoint debe ser protegido y requerir autenticación del profesional.
        2.  **Validación de Entrada:**
            *   Verificar que `patientId` es válido.
            *   Verificar que al menos uno entre `dietPlanId` o `workoutPlanId` se proporciona (no ambos `null`).
            *   Si `dietPlanId` se proporciona, debe ser un ID válido.
            *   Si `workoutPlanId` se proporciona, debe ser un ID válido.
        3.  **Autorización:**
            *   Verificar que el profesional autenticado es el propietario del `patientId`.
            *   Si se proporciona `dietPlanId`, verificar que el plan pertenece al `patientId` y que el profesional tiene acceso a él.
            *   Si se proporciona `workoutPlanId`, verificar que el plan pertenece al `patientId` y que el profesional tiene acceso a él.
        4.  **Recuperación de Datos de los Planes:**
            *   Si `dietPlanId` está presente y es válido, recuperar todos los detalles del `DIET_PLAN` y sus `DIET_MEAL`s.
            *   Si `workoutPlanId` está presente y es válido, recuperar todos los detalles del `WORKOUT_PLAN`, sus `WORKOUT_DAY`s y `EXERCISE`s.
        5.  **Generación del PDF con `pdfkit` (Node.js):**
            *   Utilizar la librería `pdfkit` para Node.js.
            *   Construir el documento PDF programáticamente:
                *   Inicializar el documento PDF.
                *   Añadir la información general (logo, profesional, paciente, fecha de generación).
                *   Si se recuperaron datos del plan de dieta, añadir una sección formateada para el plan de dieta, incluyendo todos sus detalles y comidas.
                *   Si se recuperaron datos del plan de entrenamiento, añadir una sección formateada para el plan de entrenamiento, incluyendo todos sus detalles, días y ejercicios.
                *   Manejar el flujo de texto, estilos (fuentes, tamaños), saltos de página y formato general usando las capacidades de `pdfkit`.
                *   Añadir pie de página si se definió.
                *   Finalizar el documento PDF y obtenerlo como un buffer.
        6.  **Respuesta de la API:**
            *   **Éxito (200 OK):**
                *   La API debe devolver el buffer del PDF binario directamente en el cuerpo de la respuesta.
                *   La respuesta debe incluir las cabeceras HTTP adecuadas:
                    *   `Content-Type: application/pdf`
                    *   `Content-Disposition: attachment; filename="nombre_del_archivo_sugerido.pdf"`
            *   **Error de Validación (400 Bad Request):** Si los IDs son inválidos, o no se selecciona ningún plan.
            *   **No Autorizado (401 Unauthorized).**
            *   **Prohibido (403 Forbidden):** Si el profesional no tiene permisos sobre el paciente o los planes.
            *   **No Encontrado (404 Not Found):** Si el `patientId` o alguno de los `planId`s no existen.
            *   **Error del Servidor (500 Internal Server Error):** Si ocurre un error durante la recuperación de datos o la generación del PDF.

    *   **Pruebas (QA):**
        1.  **Generación Exitosa - Ambos Planes:** Seleccionar un plan de dieta y un plan de entrenamiento. Generar PDF. Verificar descarga, nombre de archivo y contenido (ambas secciones presentes y correctas).
        2.  **Generación Exitosa - Solo Plan de Dieta:** Seleccionar solo un plan de dieta (y "Ninguno" para entrenamiento). Generar PDF. Verificar que solo la sección de dieta aparece y es correcta.
        3.  **Generación Exitosa - Solo Plan de Entrenamiento:** Seleccionar solo un plan de entrenamiento (y "Ninguno" para dieta). Generar PDF. Verificar que solo la sección de entrenamiento aparece y es correcta.
        4.  **Intento de Generación Sin Selección:** No seleccionar ningún plan e intentar generar el PDF. Verificar que la UI lo impide o el backend devuelve un error de validación.
        5.  **Contenido y Formato del PDF:**
            *   Para todas las combinaciones válidas, abrir el PDF y verificar:
                *   Toda la información general (profesional, paciente, etc.) es correcta.
                *   Las secciones de los planes incluidos son correctas, completas y bien formateadas.
                *   Legibilidad, distribución, aspecto profesional.
        6.  **PDF para Planes Complejos/Largos:** Probar con planes que tengan mucha información (descripciones largas, muchas comidas/ejercicios) para asegurar un manejo adecuado de múltiples páginas y paginación (si se implementa en el PDF).
        7.  **Caracteres Especiales y Formato:** Verificar cómo se renderizan caracteres especiales o formatos simples (listas, saltos de línea en descripciones) en el PDF.
        8.  **Seguridad:** Intentar generar un PDF para un paciente o planes a los que el profesional no debería tener acceso.
        9.  **Manejo de Errores del API:** Probar con IDs de planes inválidos, `patientId` incorrecto, sin autenticación, etc., y verificar las respuestas del API.
        10. **Usabilidad de la Selección:** La interfaz para seleccionar los planes debe ser clara e intuitiva.

---

### HU-019: Envío de Planes (PDF) por Correo Electrónico al Paciente

*   **ID:** HU-019
*   **Título:** Envío de Planes (PDF) por Correo Electrónico al Paciente
*   **Como un:** Profesional que ha iniciado sesión en el sistema
*   **Quiero:** Poder enviar al paciente por correo electrónico el PDF combinado de su plan de dieta y/o entrenamiento (generado según HU-018).
*   **Para que:** Pueda compartir de manera formal y digital los planes con el paciente, asegurando que reciba la información directamente en su email.

*   **Requisitos Funcionales Asociados (PRD):**
    *   RF6.1: El sistema permitirá a los profesionales enviar los planes a los pacientes por email.
    *   (Implícito: "PDF creation... and information sending" del MVP)

*   **Criterios de Aceptación:**

    *   **Interfaz de Usuario (Frontend):**
        1.  **Acceso a la Funcionalidad de Envío:**
            *   Podría haber un botón "Enviar por Email" junto al botón "Generar PDF" en la interfaz de selección de planes para el PDF (descrita en HU-018).
            *   Alternativamente, después de generar y descargar el PDF (HU-018), podría aparecer una opción "Enviar este PDF por Email al Paciente".
            *   La opción debe ser accesible desde el perfil del paciente (HU-009) o una vista relacionada con los planes.
        2.  **Interfaz de Envío de Email:**
            *   Al activar la función, se podría mostrar un modal o una sección donde:
                *   **Destinatario (Email del Paciente):** Se pre-rellena automáticamente con el email del paciente (si está registrado en `PATIENT.email`). Debe ser editable por si el profesional quiere enviarlo a otro email o corregirlo. Si el paciente no tiene email registrado, el campo estará vacío y será obligatorio.
                *   **Asunto del Email:** Pre-rellenado con un asunto descriptivo (ej. "Tus planes de NutriTrack Pro" o "Plan de [Nombre del Paciente] de [Nombre del Profesional]"). Debe ser editable.
                *   **Cuerpo del Mensaje (Opcional):** Un área de texto para que el profesional escriba un mensaje personalizado al paciente. Podría tener un texto por defecto (ej. "Hola [Nombre del Paciente], adjunto encontrarás tus planes. Saludos, [Nombre del Profesional].").
                *   **Indicador del PDF a Adjuntar:** Un aviso de que se adjuntará el PDF generado con los planes seleccionados (o un recordatorio para generar/seleccionar los planes si el flujo es diferente).
        3.  **Confirmación de Envío:**
            *   Un botón "Enviar Email".
            *   Al hacer clic, mostrar un indicador de carga.
        4.  **Respuesta del Sistema:**
            *   **Éxito:** Mostrar un mensaje de confirmación (ej. "Correo electrónico enviado correctamente a [Email del Paciente].").
            *   **Error (Email Inválido):** Si el formato del email del destinatario es incorrecto (validación en cliente y servidor).
            *   **Error (Fallo de Envío):** Si el backend reporta un problema al enviar el email, mostrar un mensaje genérico (ej. "No se pudo enviar el correo. Por favor, inténtalo de nuevo más tarde o verifica la dirección de email.").

    *   **Lógica de Negocio (Backend):**
        1.  **Endpoint para Envío de Email con PDF:**
            *   Debe existir un endpoint API, por ejemplo `POST /api/patients/{patientId}/send-plans-email`.
            *   El cuerpo de la solicitud debe incluir:
                *   `recipientEmail`: El email del destinatario.
                *   `subject`: El asunto del email.
                *   `bodyMessage`: El mensaje personalizado (opcional).
                *   `dietPlanId`: El ID del plan de dieta a incluir en el PDF (opcional, `null` si no se incluye).
                *   `workoutPlanId`: El ID del plan de entrenamiento a incluir en el PDF (opcional, `null` si no se incluye).
                *   (Al menos uno de `dietPlanId` o `workoutPlanId` debe ser proporcionado).
            *   Este endpoint debe ser protegido.
        2.  **Validación de Entrada:**
            *   Validar `patientId`, `recipientEmail` (formato y obligatorio), `subject` (obligatorio).
            *   Validar que al menos uno de `dietPlanId` o `workoutPlanId` se proporciona y que los IDs son válidos si se proporcionan.
        3.  **Autorización:**
            *   Verificar que el profesional autenticado es el propietario del `patientId` y tiene acceso a los planes especificados (similar a HU-018).
        4.  **Generación del PDF (Reutilización de Lógica HU-018):**
            *   El backend internamente llamará a la lógica de generación de PDF definida en HU-018, usando `dietPlanId` y `workoutPlanId` para crear el archivo PDF combinado (con `pdfkit`). Este PDF se generará en memoria (como un buffer) y no necesariamente se guardará en el servidor a menos que sea una estrategia temporal.
        5.  **Servicio de Envío de Email:**
            *   Utilizar un servicio de envío de correos electrónicos (ej. SendGrid, Mailgun, Amazon SES, o incluso Nodemailer con un SMTP configurado). Este servicio debe estar configurado en el backend.
            *   Componer el email:
                *   **De:** Una dirección de email configurada para la aplicación (ej. `noreply@nutritrack.pro` o el email del profesional si se configura así, aunque `noreply` es más simple para MVP).
                *   **Para:** `recipientEmail`.
                *   **Asunto:** `subject`.
                *   **Cuerpo:** El `bodyMessage` proporcionado, posiblemente con un saludo y despedida estándar. El cuerpo puede ser HTML para un mejor formato.
                *   **Adjunto:** El PDF generado (buffer) con un nombre de archivo descriptivo.
            *   Realizar el envío del email a través del servicio configurado.
        6.  **Manejo de Errores de Envío:**
            *   Capturar posibles errores del servicio de email (ej. dirección inválida, fallo del servicio) y registrarlos.
        7.  **Respuesta del API:**
            *   **Éxito (200 OK):** Devolver un mensaje de confirmación de envío.
            *   **Error de Validación (400 Bad Request):** Si los datos de entrada son inválidos.
            *   **No Autorizado (401 Unauthorized).**
            *   **Prohibido (403 Forbidden).**
            *   **No Encontrado (404 Not Found):** Si el `patientId` o alguno de los `planId`s no existen.
            *   **Error del Servidor (500 Internal Server Error):** Si ocurre un error durante la generación del PDF o el servicio de email falla.

    *   **Pruebas (QA):**
        1.  **Envío Exitoso con Ambos Planes:**
            *   Seleccionar/generar PDF con plan de dieta y entrenamiento.
            *   Introducir email del paciente (y opcionalmente mensaje y asunto personalizados). Enviar.
            *   Verificar la recepción del email en la bandeja de entrada del destinatario.
            *   Verificar que el asunto y el cuerpo del email son correctos.
            *   Verificar que el PDF está adjunto, tiene el nombre correcto y su contenido es el esperado (ambos planes).
        2.  **Envío Exitoso - Solo Dieta / Solo Entrenamiento:** Probar el envío seleccionando solo un tipo de plan. Verificar que el email y el PDF adjunto reflejan esto correctamente.
        3.  **Verificación del Email del Remitente:** Confirmar que el email se envía desde la dirección configurada.
        4.  **Personalización del Mensaje y Asunto:** Probar modificando el asunto y el cuerpo del mensaje y verificar que se reflejan en el email recibido.
        5.  **Email del Paciente Pre-rellenado:**
            *   Si el paciente tiene un email, verificar que se pre-rellena.
            *   Si el paciente no tiene email, verificar que el campo está vacío y es requerido.
        6.  **Validaciones de Formulario (UI y Backend):**
            *   Intentar enviar sin email de destinatario.
            *   Intentar enviar con un formato de email inválido.
            *   Intentar enviar sin seleccionar/especificar ningún plan.
        7.  **Manejo de Errores de Envío del Backend:**
            *   Simular un fallo en el servicio de envío de email (si es posible en entorno de prueba) y verificar que la UI muestra un error apropiado.
            *   Probar con `patientId` o `planId`s inválidos.
        8.  **Seguridad:** Asegurar que un profesional solo puede enviar planes de sus propios pacientes.
        9.  **Diseño del Email:** El email (si es HTML) debe ser responsivo y legible en clientes de correo comunes.

---

### HU-020: Eliminación de Plan de Dieta

*   **ID:** HU-020
*   **Título:** Eliminación de Plan de Dieta
*   **Como un:** Profesional que ha iniciado sesión
*   **Quiero:** Poder eliminar un plan de dieta existente de un paciente
*   **Para que:** Pueda remover planes obsoletos, incorrectos o que ya no son necesarios, manteniendo limpia y organizada la información del paciente.

*   **Requisitos Funcionales Asociados (PRD):**
    *   Implícito en la gestión completa de planes (RF4.1, RF4.3). Si se pueden crear y editar, se deben poder eliminar.

*   **Criterios de Aceptación:**

    *   **Interfaz de Usuario (Frontend):**
        1.  **Acceso a la Función de Eliminar:**
            *   Desde la vista de detalles de un plan de dieta (HU-013), debe haber un botón/enlace "Eliminar Plan".
            *   Opcionalmente, desde la lista de planes de dieta en el perfil del paciente (HU-009), podría haber una acción rápida "Eliminar" para cada plan.
        2.  **Confirmación de Eliminación:**
            *   Al hacer clic en "Eliminar Plan", se debe mostrar un diálogo de confirmación modal claramente visible (ej. "¿Estás seguro de que deseas eliminar este plan de dieta? Esta acción no se puede deshacer.").
            *   El diálogo debe tener botones para "Confirmar Eliminación" y "Cancelar".
        3.  **Proceso de Eliminación:**
            *   Si el profesional hace clic en "Confirmar Eliminación", se envía la solicitud al backend.
            *   Mostrar un indicador de carga durante el proceso.
        4.  **Respuesta del Sistema:**
            *   **Éxito:** Mostrar un mensaje de confirmación (ej. "El plan de dieta '[Título del Plan]' ha sido eliminado correctamente."). Redirigir al profesional al perfil del paciente (HU-009), idealmente a la sección de planes actualizada.
            *   **Error (Plan no encontrado):** Si el plan ya fue eliminado o no existe.
            *   **Error Genérico:** Si ocurre otro error durante la eliminación.

    *   **Lógica de Negocio (Backend):**
        1.  **Endpoint para Eliminar Plan de Dieta:**
            *   Debe existir un endpoint API (ej. `DELETE /api/diet-plans/{dietPlanId}`).
            *   Este endpoint debe ser protegido.
        2.  **Autorización:**
            *   Verificar que el profesional autenticado es el propietario del plan de dieta que se intenta eliminar (a través de su `professional_id` directo o indirecto a través del `patient_id` asociado al plan).
        3.  **Eliminación del Plan y Entidades Relacionadas:**
            *   Buscar el `DIET_PLAN` por `dietPlanId`. Si no existe, devolver 404.
            *   Eliminar todos los registros `DIET_MEAL` asociados a este `diet_plan_id`.
            *   Eliminar el registro `DIET_PLAN` de la base de datos.
            *   Esta operación (eliminar comidas y luego el plan) debe ser transaccional para asegurar la integridad de los datos.
        4.  **Respuesta del API:**
            *   **Éxito (200 OK o 204 No Content):** Devolver un mensaje de éxito o simplemente una respuesta sin contenido si la eliminación fue exitosa.
            *   **No Autorizado (401 Unauthorized).**
            *   **Prohibido (403 Forbidden):** Si el profesional no tiene permisos para eliminar el plan.
            *   **No Encontrado (404 Not Found):** Si `dietPlanId` no existe.
            *   **Error del Servidor (500 Internal Server Error):** Por errores inesperados.

    *   **Pruebas (QA):**
        1.  **Eliminación Exitosa:**
            *   Crear un plan de dieta con varias comidas.
            *   Eliminar el plan a través de la UI, confirmando la acción.
            *   Verificar que el plan ya no aparece en la lista de planes del paciente.
            *   Verificar en la base de datos que el registro `DIET_PLAN` y todos sus `DIET_MEAL`s asociados han sido eliminados.
        2.  **Cancelar Eliminación:**
            *   Iniciar el proceso de eliminación de un plan, pero hacer clic en "Cancelar" en el diálogo de confirmación.
            *   Verificar que el plan no se elimina y sigue visible.
        3.  **Seguridad:**
            *   Intentar eliminar un plan de dieta de un paciente que no pertenece al profesional autenticado (ej. manipulando la solicitud API). Verificar que la operación es denegada.
        4.  **Eliminación de Plan Inexistente:**
            *   Intentar eliminar un `dietPlanId` que ya no existe (ej. mediante una solicitud API directa después de haberlo eliminado). Verificar la respuesta 404.
        5.  **Impacto en la UI:** Asegurar que la UI se actualiza correctamente después de una eliminación exitosa (el plan desaparece de las listas).
        6.  **Integridad Transaccional (si es posible probar):** Intentar simular un fallo durante la eliminación de las comidas para ver si la eliminación del plan principal se revierte o si quedan datos huérfanos (esto último es lo que la transacción debe evitar).

---

### HU-021: Eliminación de Plan de Entrenamiento

*   **ID:** HU-021
*   **Título:** Eliminación de Plan de Entrenamiento
*   **Como un:** Profesional que ha iniciado sesión
*   **Quiero:** Poder eliminar un plan de entrenamiento existente de un paciente
*   **Para que:** Pueda remover planes obsoletos, incorrectos o que ya no son necesarios, manteniendo limpia y organizada la información del paciente.

*   **Requisitos Funcionales Asociados (PRD):**
    *   Implícito en la gestión completa de planes (RF4.2, RF4.3).

*   **Criterios de Aceptación:**

    *   **Interfaz de Usuario (Frontend):**
        1.  **Acceso a la Función de Eliminar:**
            *   Desde la vista de detalles de un plan de entrenamiento (HU-016), debe haber un botón/enlace "Eliminar Plan".
            *   Opcionalmente, desde la lista de planes de entrenamiento en el perfil del paciente (HU-009), podría haber una acción rápida "Eliminar".
        2.  **Confirmación de Eliminación:**
            *   Al hacer clic en "Eliminar Plan", se debe mostrar un diálogo de confirmación modal (ej. "¿Estás seguro de que deseas eliminar este plan de entrenamiento? Esta acción no se puede deshacer.").
            *   Botones "Confirmar Eliminación" y "Cancelar".
        3.  **Proceso de Eliminación:**
            *   Al confirmar, se envía la solicitud al backend.
            *   Indicador de carga.
        4.  **Respuesta del Sistema:**
            *   **Éxito:** Mensaje de confirmación (ej. "El plan de entrenamiento '[Título del Plan]' ha sido eliminado."). Redirigir al perfil del paciente (HU-009), a la sección de planes actualizada.
            *   **Error (Plan no encontrado).**
            *   **Error Genérico.**

    *   **Lógica de Negocio (Backend):**
        1.  **Endpoint para Eliminar Plan de Entrenamiento:**
            *   `DELETE /api/workout-plans/{workoutPlanId}`.
            *   Protegido.
        2.  **Autorización:**
            *   Verificar que el profesional autenticado es propietario del plan.
        3.  **Eliminación del Plan y Entidades Relacionadas:**
            *   Buscar el `WORKOUT_PLAN` por `workoutPlanId`. Si no existe, 404.
            *   Eliminar todos los `EXERCISE`s asociados a los `WORKOUT_DAY`s de este plan.
            *   Eliminar todos los `WORKOUT_DAY`s asociados a este `workout_plan_id`.
            *   Eliminar el registro `WORKOUT_PLAN`.
            *   Operación transaccional.
        4.  **Respuesta del API:**
            *   **Éxito (200 OK o 204 No Content).**
            *   **No Autorizado (401 Unauthorized).**
            *   **Prohibido (403 Forbidden).**
            *   **No Encontrado (404 Not Found).**
            *   **Error del Servidor (500 Internal Server Error).**

    *   **Pruebas (QA):**
        1.  **Eliminación Exitosa:**
            *   Crear un plan de entrenamiento con días y ejercicios. Eliminarlo.
            *   Verificar que ya no aparece en la UI.
            *   Verificar en BD que `WORKOUT_PLAN`, `WORKOUT_DAY`s, y `EXERCISE`s asociados han sido eliminados.
        2.  **Cancelar Eliminación:** Verificar que no se elimina al cancelar.
        3.  **Seguridad:** Intentar eliminar un plan ajeno.
        4.  **Eliminación de Plan Inexistente:** Intentar eliminar un `workoutPlanId` inexistente.
        5.  **Impacto en la UI:** La UI se actualiza correctamente.
        6.  **Integridad Transaccional.**