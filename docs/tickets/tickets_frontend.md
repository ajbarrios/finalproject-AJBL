# Tickets de Trabajo - Frontend

### Ticket: TF-SC01
**Historia de Usuario Asociada:** N/A (Tarea de configuración inicial del proyecto)
**Título del Ticket:** Configuración Inicial y Scaffolding del Proyecto Frontend (Vite, React, TypeScript, Tailwind)
**Descripción:** Esta tarea cubre la configuración inicial completa del entorno de desarrollo frontend. El objetivo es tener un esqueleto de aplicación funcional y listo para que los desarrolladores puedan empezar a construir componentes y funcionalidades.
**Tareas Específicas:**
    1.  Inicializar un nuevo proyecto React utilizando Vite con la plantilla de TypeScript.
    2.  Integrar Tailwind CSS en el proyecto, incluyendo la configuración de `tailwind.config.js` y `postcss.config.js`.
    3.  Configurar ESLint para el linting de código TypeScript y JSX, con reglas recomendadas y plugins para React y a11y.
    4.  Configurar Prettier para el formateo automático de código, asegurando consistencia con ESLint.
    5.  Establecer una estructura de carpetas base: `/src/components` (reutilizables), `/src/pages` (vistas principales), `/src/services` (llamadas API), `/src/assets` (imágenes, estilos globales), `/src/hooks`, `/src/utils`, `/src/store` (si se decide usar context/zustand/redux).
    6.  Implementar una configuración básica de React Router (`react-router-dom`) con al menos una ruta de ejemplo (ej. página de inicio).
    7.  Asegurar que los scripts `npm run dev` (o `yarn dev`) y `npm run build` (o `yarn build`) funcionen correctamente.
    8.  Crear un archivo `README.md` dentro de la carpeta `/frontend` con instrucciones básicas sobre cómo instalar dependencias, iniciar el servidor de desarrollo y construir el proyecto.
    9.  Configurar variables de entorno básicas (ej. `VITE_API_BASE_URL` en un archivo `.env.example`).
**Criterios de Aceptación:**
    *   El proyecto se inicia sin errores con `npm run dev`.
    *   La compilación de producción (`npm run build`) se completa exitosamente.
    *   ESLint y Prettier están configurados y pueden ejecutarse para verificar y formatear el código.
    *   La estructura de carpetas inicial está creada.
    *   React Router está configurado y la navegación básica funciona.
    *   Tailwind CSS funciona y se pueden usar sus clases de utilidad.
    *   El `README.md` del frontend está presente y es informativo.
**Prioridad:** Crítica
**Estado:** Pendiente
**Estimación:** 4-6 horas
**Responsable:** Por asignar
**Etiquetas:** `frontend`, `setup`, `scaffolding`, `vite`, `react`, `typescript`, `tailwind`, `eslint`, `prettier`, `configuración`
---

## HU-001: Registro de Nuevo Profesional

---

**ID del Ticket:** TF-001
**Historia de Usuario Relacionada:** HU-001 - Registro de Nuevo Profesional
**Tipo:** Feature
**Prioridad:** Alta

**Descripción:**
Como un profesional (nutricionista/entrenador) que aún no tiene cuenta, quiero poder registrarme en la aplicación proporcionando mi nombre completo, email, una contraseña segura y mi tipo de profesión (nutricionista o entrenador), para que pueda crear mi perfil, acceder a las funcionalidades del sistema y comenzar a gestionar mis pacientes.

**Tareas Específicas (Frontend):**
1.  **Crear Página/Componente de Registro:**
    *   Diseñar y desarrollar la página de registro (`/registro` o similar).
    *   Asegurar que sea accesible y responsiva.
2.  **Desarrollar Formulario de Registro:**
    *   Implementar campos para:
        *   Nombre completo (input tipo texto).
        *   Email (input tipo email).
        *   Contraseña (input tipo password).
        *   Confirmación de contraseña (input tipo password).
        *   Profesión (selector/radio buttons: "Nutricionista", "Entrenador").
3.  **Implementar Validaciones en Cliente:**
    *   Validar campos obligatorios (todos los anteriores).
    *   Validar formato de email.
    *   Validar criterios de seguridad de contraseña (ej. longitud mínima, combinación de caracteres). Mostrar estos criterios al usuario.
    *   Validar que la confirmación de contraseña coincida.
    *   Mostrar mensajes de error claros y específicos junto a cada campo.
4.  **Manejar Envío del Formulario:**
    *   Al enviar, realizar la petición `POST` al endpoint de registro del backend (`/api/auth/register`).
    *   Mostrar un indicador de carga visual durante la petición.
5.  **Gestionar Respuestas del Backend:**
    *   **Éxito (201 Created):**
        *   Mostrar mensaje de confirmación (ej. "¡Registro completado! Ahora puedes iniciar sesión.").
        *   Redirigir al usuario a la página de inicio de sesión (`/login`).
    *   **Error de Email Duplicado (409 Conflict):**
        *   Mostrar mensaje claro (ej. "Este email ya está registrado. ¿Quieres <a href='/login'>iniciar sesión</a> o <a href='/recuperar-password'>recuperar tu contraseña</a>?").
    *   **Error de Validación (400 Bad Request):**
        *   Mostrar mensajes de error devueltos por el backend.
    *   **Error Genérico del Servidor (500 Internal Server Error):**
        *   Mostrar mensaje genérico (ej. "No se pudo completar el registro. Por favor, inténtalo de nuevo más tarde.").
6.  **Implementar Navegación:**
    *   Añadir un enlace claro a la página de "Inicio de Sesión" para usuarios existentes.
7.  **Pruebas Unitarias y de Integración (Frontend):**
    *   Probar el componente de registro, validaciones y manejo de respuestas.

**Criterios de Aceptación (Frontend):**
*   El formulario de registro es funcional y visualmente acorde al diseño.
*   Todas las validaciones en cliente funcionan como se espera.
*   La comunicación con el backend (petición de registro) se realiza correctamente.
*   Se manejan adecuadamente las respuestas de éxito y error del backend, mostrando feedback apropiado al usuario.
*   La redirección tras el registro exitoso funciona.
*   El usuario puede navegar fácilmente a la página de login.

**Consideraciones Técnicas (Frontend):**
*   Framework/Librería: (Especificar, ej: React, Vue, Angular)
*   Gestión de estado: (Especificar, ej: Context API, Redux, Zustand)
*   Librería para peticiones HTTP: (Especificar, ej: Axios, Fetch API)
*   Librería de UI/Componentes: (Especificar, ej: TailwindCSS, Material UI, Bootstrap)
*   Validación de formularios: (Especificar, ej: Formik & Yup, React Hook Form)

**Etiquetas:** `frontend`, `autenticación`, `registro`, `HU-001`

---

## HU-002: Inicio de Sesión del Profesional

---

**ID del Ticket:** TF-002
**Historia de Usuario Relacionada:** HU-002 - Inicio de Sesión del Profesional
**Tipo:** Feature
**Prioridad:** Alta

**Descripción:**
Como un profesional registrado, quiero poder iniciar sesión en la aplicación utilizando mi email y contraseña, para que pueda acceder a mi dashboard y gestionar mis pacientes.

**Tareas Específicas (Frontend):**
1.  **Crear Página/Componente de Inicio de Sesión:**
    *   Diseñar y desarrollar la página de inicio de sesión (`/login` o similar).
    *   Asegurar que sea accesible y responsiva.
2.  **Desarrollar Formulario de Inicio de Sesión:**
    *   Implementar campos para:
        *   Email (input tipo email).
        *   Contraseña (input tipo password).
3.  **Implementar Validaciones en Cliente (Básicas):**
    *   Validar campos obligatorios (email y contraseña).
    *   Validar formato de email.
    *   Mostrar mensajes de error si los campos están vacíos o el formato es incorrecto.
4.  **Manejar Envío del Formulario:**
    *   Al enviar, realizar la petición `POST` al endpoint de login del backend (`/api/auth/login`).
    *   Mostrar un indicador de carga visual durante la petición.
5.  **Gestionar Respuestas del Backend:**
    *   **Éxito (200 OK):**
        *   Recibir el token de sesión (JWT) y, opcionalmente, datos básicos del usuario.
        *   Almacenar el token de sesión de forma segura en el cliente (ej. localStorage, sessionStorage o HttpOnly cookie si el backend la establece).
        *   Redirigir al usuario al dashboard principal de la aplicación (ej. `/dashboard`).
    *   **Error de Credenciales Inválidas (401 Unauthorized):**
        *   Mostrar mensaje claro (ej. "Email o contraseña incorrectos. Por favor, verifica tus credenciales.").
    *   **Error de Validación (400 Bad Request):**
        *   Mostrar mensajes de error devueltos por el backend (ej. si los campos están vacíos y la validación del cliente falló o no se hizo).
    *   **Error Genérico del Servidor (500 Internal Server Error):**
        *   Mostrar mensaje genérico (ej. "No se pudo iniciar sesión. Por favor, inténtalo de nuevo más tarde.").
6.  **Implementar Navegación:**
    *   Añadir un enlace claro a la página de "Registro" para nuevos usuarios.
    *   Añadir un enlace claro para "Recuperar Contraseña".
7.  **Manejo de Sesión (Post-Login):**
    *   Configurar el cliente HTTP (ej. Axios) para incluir automáticamente el token JWT en las cabeceras de las peticiones a endpoints protegidos.
8.  **Pruebas Unitarias y de Integración (Frontend):**
    *   Probar el componente de login, validaciones, envío de datos, manejo de respuestas y almacenamiento del token.

**Criterios de Aceptación (Frontend):**
*   El formulario de inicio de sesión es funcional.
*   Las validaciones en cliente funcionan.
*   La comunicación con el backend (petición de login) se realiza correctamente.
*   Se manejan adecuadamente las respuestas de éxito (almacenando token y redirigiendo) y error.
*   El usuario puede navegar a las páginas de registro y recuperación de contraseña.
*   El token de sesión se almacena y se utiliza para futuras peticiones.

**Consideraciones Técnicas (Frontend):**
*   Framework/Librería: (Especificar)
*   Gestión de estado: (Especificar)
*   Librería para peticiones HTTP: (Especificar)
*   Almacenamiento de token: (Especificar método, ej: localStorage, HttpOnly cookie gestionada por backend)

**Etiquetas:** `frontend`, `autenticación`, `login`, `HU-002`

---

## HU-003: Recuperación de Contraseña del Profesional

---

**ID del Ticket:** TF-003
**Historia de Usuario Relacionada:** HU-003 - Recuperación de Contraseña del Profesional
**Tipo:** Feature
**Prioridad:** Media

**Descripción:**
Como un profesional registrado que ha olvidado su contraseña, quiero poder solicitar un enlace de recuperación a mi email y luego usar ese enlace para restablecer mi contraseña, para poder volver a acceder a mi cuenta.

**Tareas Específicas (Frontend):**

**Fase 1: Solicitud de Recuperación**
1.  **Crear Página/Componente de Solicitud de Recuperación:**
    *   Diseñar y desarrollar la página (`/recuperar-password` o similar), accesible desde la página de login.
    *   Asegurar responsividad.
2.  **Desarrollar Formulario de Solicitud:**
    *   Implementar campo para "Email".
3.  **Implementar Validaciones en Cliente (Email):**
    *   Validar que el email es obligatorio y tiene formato válido.
    *   Mostrar mensaje de error claro.
4.  **Manejar Envío del Formulario de Solicitud:**
    *   Al enviar, realizar petición `POST` al endpoint `/api/auth/forgot-password` con el email.
    *   Mostrar indicador de carga.
5.  **Gestionar Respuestas del Backend (Solicitud):**
    *   **Éxito (Backend siempre responde 200 OK para no enumerar usuarios):**
        *   Mostrar mensaje genérico (ej. "Si tu email está registrado, recibirás un correo con instrucciones.").
    *   **Error Genérico (ej. fallo de red):**
        *   Mostrar mensaje (ej. "No se pudo procesar tu solicitud. Inténtalo más tarde.").

**Fase 2: Restablecimiento de Contraseña**
6.  **Crear Página/Componente de Restablecimiento:**
    *   Diseñar y desarrollar la página (`/resetear-password` o similar) que acepte un token como parámetro URL (ej. `/resetear-password?token=TOKEN_VALOR`).
    *   Asegurar responsividad.
7.  **Extraer Token de la URL:**
    *   Al cargar la página, obtener el valor del token del parámetro de la URL.
8.  **Desarrollar Formulario de Restablecimiento:**
    *   Implementar campos para "Nueva Contraseña" y "Confirmar Nueva Contraseña".
9.  **Implementar Validaciones en Cliente (Nueva Contraseña):**
    *   Validar criterios de seguridad para la nueva contraseña.
    *   Validar que ambas contraseñas coincidan.
    *   Mostrar mensajes de error claros.
10. **Manejar Envío del Formulario de Restablecimiento:**
    *   Al enviar, realizar petición `POST` al endpoint `/api/auth/reset-password` con el `token` y `newPassword`.
    *   Mostrar indicador de carga.
11. **Gestionar Respuestas del Backend (Restablecimiento):**
    *   **Éxito (200 OK):**
        *   Mostrar mensaje de éxito (ej. "Tu contraseña ha sido restablecida. Ahora puedes <a href='/login'>iniciar sesión</a>.").
        *   Redirigir a la página de login.
    *   **Error (Token Inválido/Expirado - 400 Bad Request):**
        *   Mostrar mensaje claro (ej. "El enlace de recuperación es inválido o ha expirado. Por favor, <a href='/recuperar-password'>solicita uno nuevo</a>.").
    *   **Error de Validación (Contraseña no cumple criterios - 400 Bad Request):**
        *   Mostrar mensajes de error devueltos por el backend.
    *   **Error Genérico del Servidor (500 Internal Server Error):**
        *   Mostrar mensaje genérico.
12. **Pruebas Unitarias y de Integración (Frontend):**
    *   Probar ambos formularios, validaciones, manejo de token y respuestas del backend para ambas fases.

**Criterios de Aceptación (Frontend):**
*   Ambos formularios (solicitud y restablecimiento) son funcionales.
*   Las validaciones en cliente para email y nueva contraseña funcionan.
*   Se extrae y envía correctamente el token de la URL.
*   La comunicación con los endpoints del backend (`/forgot-password`, `/reset-password`) es correcta.
*   Se manejan adecuadamente todas las respuestas del backend (éxito y errores) para ambas fases.
*   La redirección tras el restablecimiento exitoso funciona.

**Consideraciones Técnicas (Frontend):**
*   Manejo de parámetros URL para el token.
*   Comunicación clara de los criterios de seguridad de la contraseña.

**Etiquetas:** `frontend`, `autenticación`, `recuperación de contraseña`, `HU-003`

---

## HU-004: Cerrar Sesión del Profesional

---

**ID del Ticket:** TF-004
**Historia de Usuario Relacionada:** HU-004 - Cerrar Sesión del Profesional
**Tipo:** Feature
**Prioridad:** Media

**Descripción:**
Como un profesional que ha iniciado sesión, quiero poder cerrar mi sesión de forma segura para proteger mi cuenta y mis datos.

**Tareas Específicas (Frontend):**
1.  **Implementar Botón/Enlace de Cerrar Sesión:**
    *   Añadir un elemento UI (botón o enlace) claramente visible para "Cerrar Sesión" cuando el usuario está autenticado (ej. en menú de usuario, cabecera).
2.  **Manejar Acción de Cerrar Sesión:**
    *   Al hacer clic en "Cerrar Sesión":
        *   Eliminar el token JWT del almacenamiento del cliente (localStorage, sessionStorage, o invalidar cookie).
        *   Limpiar cualquier estado de la aplicación relacionado con el usuario autenticado (ej. datos de usuario en gestor de estado).
        *   Opcionalmente, llamar a un endpoint de logout en el backend si se implementa una lista negra de tokens (`POST /api/auth/logout`).
        *   Redirigir al usuario a la página de inicio de sesión (`/login`) o a la página principal pública.
        *   Opcionalmente, mostrar un mensaje breve (ej. "Has cerrado sesión correctamente.") antes de la redirección.
3.  **Asegurar Estado Post-Cierre de Sesión:**
    *   Verificar que después de cerrar sesión, el usuario no puede acceder a las secciones protegidas de la aplicación.
    *   Asegurar que cualquier intento de acceso a rutas protegidas redirige a la página de inicio de sesión.
    *   El cliente HTTP (ej. Axios) debe dejar de enviar el token JWT o enviar un token inválido/nulo.
4.  **Pruebas (Frontend):**
    *   Probar el cierre de sesión y la redirección.
    *   Verificar que el token se elimina del almacenamiento del cliente.
    *   Probar el acceso a rutas protegidas después de cerrar sesión.

**Criterios de Aceptación (Frontend):**
*   El botón/enlace de cerrar sesión es funcional.
*   Al cerrar sesión, el token se elimina del cliente y se limpia el estado de usuario.
*   El usuario es redirigido a la página de login (o pública).
*   Después de cerrar sesión, no se puede acceder a rutas protegidas sin volver a autenticarse.

**Consideraciones Técnicas (Frontend):**
*   Limpieza del almacenamiento del token (localStorage/sessionStorage/cookies).
*   Actualización del estado global de la aplicación (si se usa un gestor de estado).
*   Interacción con el router para la redirección.

**Etiquetas:** `frontend`, `autenticación`, `logout`, `HU-004`

---

## HU-005: Registro de Nuevo Paciente

---

**ID del Ticket:** TF-005
**Historia de Usuario Relacionada:** HU-005 - Registro de Nuevo Paciente
**Tipo:** Feature
**Prioridad:** Alta

**Descripción:**
Como un profesional que ha iniciado sesión, quiero poder registrar un nuevo paciente proporcionando su información personal básica, datos biométricos iniciales, notas médicas, restricciones y objetivos, para tener un perfil completo y comenzar a crear planes personalizados.

**Tareas Específicas (Frontend):**
1.  **Crear Página/Componente/Modal de Registro de Paciente:**
    *   Diseñar y desarrollar la UI para el formulario de registro de paciente.
    *   Decidir si será una página dedicada (ej. `/pacientes/nuevo`) o un modal accesible desde el dashboard de pacientes.
    *   Asegurar responsividad.
2.  **Desarrollar Formulario de Registro de Paciente:**
    *   Implementar campos para (agrupados por secciones si es extenso):
        *   **Información Personal:** Nombre (obligatorio), Apellidos (obligatorio), Email (opcional, formato válido), Teléfono (opcional), Fecha de nacimiento (opcional), Género (opcional, selector).
        *   **Datos Biométricos Iniciales:** Altura (opcional, cm), Peso (opcional, kg), % Grasa corporal (opcional), % Masa muscular (opcional). (Aclarar si otros campos biométricos se incluyen aquí o se añaden después).
        *   **Información Adicional:** Notas médicas (opcional, área de texto), Restricciones alimentarias (opcional, área de texto), Objetivos del paciente (opcional pero recomendado, área de texto).
3.  **Implementar Validaciones en Cliente:**
    *   Validar campos obligatorios (Nombre, Apellidos).
    *   Validar formato de email si se proporciona.
    *   Validar campos numéricos (altura, peso, porcentajes) para aceptar solo números y decimales apropiados.
    *   Mostrar mensajes de error claros y específicos.
4.  **Manejar Envío del Formulario:**
    *   Al guardar, realizar la petición `POST` al endpoint de creación de pacientes del backend (ej. `/api/patients`).
    *   Incluir todos los datos del formulario en el cuerpo de la petición.
    *   El token JWT del profesional debe enviarse en las cabeceras para autenticación.
    *   Mostrar un indicador de carga visual.
5.  **Gestionar Respuestas del Backend:**
    *   **Éxito (201 Created):**
        *   Mostrar mensaje de confirmación (ej. "Paciente [Nombre] registrado correctamente.").
        *   Redirigir al profesional a la lista de pacientes o al perfil del paciente recién creado.
        *   Actualizar la lista de pacientes si está visible.
    *   **Error de Validación (400 Bad Request):**
        *   Mostrar mensajes de error devueltos por el backend.
    *   **No Autorizado (401 Unauthorized):**
        *   Manejar el caso (ej. redirigir a login si el token expiró).
    *   **Error Genérico del Servidor (500 Internal Server Error):**
        *   Mostrar mensaje genérico.
6.  **Integración con Dashboard de Pacientes:**
    *   Asegurar que haya un botón/enlace claro ("Añadir Paciente") en el dashboard de pacientes (HU-008) para acceder a este formulario.
7.  **Pruebas (Frontend):**
    *   Probar el formulario con datos válidos y varias combinaciones de campos opcionales.
    *   Probar todas las validaciones en cliente.
    *   Probar el manejo de respuestas de éxito y error del backend.
    *   Verificar la correcta redirección y actualización de la UI.

**Criterios de Aceptación (Frontend):**
*   El formulario de registro de paciente es funcional y fácil de usar.
*   Se pueden ingresar todos los datos especificados para un nuevo paciente.
*   Las validaciones en cliente funcionan correctamente.
*   La comunicación con el backend para crear el paciente es exitosa.
*   Se proporciona feedback adecuado al usuario tras la creación (éxito o error).
*   El profesional es redirigido apropiadamente después de crear un paciente.

**Consideraciones Técnicas (Frontend):**
*   Componente de selección de fecha.
*   Manejo de formularios extensos (posiblemente con pasos o secciones colapsables).

**Etiquetas:** `frontend`, `pacientes`, `registro de paciente`, `HU-005`

---

## HU-006: Actualización de Información del Paciente

---

**ID del Ticket:** TF-006
**Historia de Usuario Relacionada:** HU-006 - Actualización de Información del Paciente
**Tipo:** Feature
**Prioridad:** Media

**Descripción:**
Como profesional, quiero poder actualizar la información de un paciente existente (datos personales, notas, objetivos, etc.) para mantenerla precisa y al día.

**Tareas Específicas (Frontend):**
1.  **Crear/Modificar Formulario de Edición de Paciente:**
    *   Reutilizar o adaptar el formulario de registro de paciente (TF-005) para la edición.
    *   Este formulario se cargará con los datos existentes del paciente a editar.
    *   Asegurar que la navegación permita llegar a este formulario (ej. desde el perfil del paciente o lista de pacientes).
2.  **Poblar Formulario con Datos Existentes:**
    *   Al cargar el formulario de edición para un paciente específico, obtener los datos actuales del paciente (probablemente de un estado global o haciendo una petición GET al backend si no están disponibles) y rellenar los campos del formulario.
3.  **Permitir Edición de Campos:**
    *   Permitir la modificación de los campos permitidos en HU-006 (Nombre, Apellidos, Email, Teléfono, Fecha de nacimiento, Género, Altura - si se considera editable aquí-, Notas médicas, Restricciones, Objetivos).
    *   **Nota:** Clarificar qué datos biométricos (aparte de `height` si aplica) son editables aquí vs. en el historial de `BIOMETRIC_RECORD`.
4.  **Implementar Validaciones en Cliente:**
    *   Mismas validaciones que en el formulario de creación (TF-005) para los campos editables.
5.  **Manejar Envío del Formulario de Actualización:**
    *   Al guardar cambios, realizar una petición `PUT` al endpoint de actualización del backend (ej. `/api/patients/{patientId}`).
    *   Enviar solo los campos que han sido modificados o todos los campos del formulario.
    *   Incluir el `patientId` en la URL y el token JWT en las cabeceras.
    *   Mostrar un indicador de carga.
6.  **Gestionar Respuestas del Backend:**
    *   **Éxito (200 OK):**
        *   Mostrar mensaje de confirmación (ej. "Información de [Nombre Paciente] actualizada.").
        *   Redirigir al perfil del paciente actualizado o a la lista de pacientes.
        *   Actualizar los datos del paciente en el estado local/UI.
    *   **Error de Validación (400 Bad Request):**
        *   Mostrar mensajes de error específicos.
    *   **No Autorizado (401 Unauthorized) / Prohibido (403 Forbidden):**
        *   Manejar adecuadamente (ej. si el profesional no es propietario del paciente).
    *   **No Encontrado (404 Not Found):**
        *   Si el paciente no existe.
    *   **Error Genérico del Servidor (500 Internal Server Error):**
        *   Mostrar mensaje genérico.
7.  **Opción de Cancelar Edición:**
    *   Implementar un botón "Cancelar" que descarte los cambios y devuelva al usuario a la vista anterior (ej. perfil del paciente).
8.  **Pruebas (Frontend):**
    *   Probar la carga de datos existentes en el formulario.
    *   Probar la edición de cada campo permitido.
    *   Probar el guardado de cambios y la cancelación.
    *   Verificar el manejo de respuestas de éxito y error.

**Criterios de Aceptación (Frontend):**
*   El formulario de edición de paciente es funcional y se precarga con datos existentes.
*   Se pueden modificar y guardar los campos permitidos.
*   Las validaciones en cliente funcionan para los campos editados.
*   La comunicación con el backend para actualizar el paciente es exitosa.
*   Se proporciona feedback adecuado y se actualiza la UI/estado tras la actualización.

**Consideraciones Técnicas (Frontend):**
*   Determinar cómo se obtienen los datos iniciales del paciente para el formulario (¿del estado global, nueva petición API?).
*   Manejo del estado del formulario y detección de cambios para habilitar/deshabilitar el botón de guardar.

**Etiquetas:** `frontend`, `pacientes`, `edición de paciente`, `HU-006`

## HU-006.1 / Derivada: Eliminación de Paciente

---

**ID del Ticket:** TF-007
**Historia de Usuario Relacionada:** (Derivada de Gestión de Pacientes, implícita en CRUD)
**Tipo:** Feature
**Prioridad:** Media

**Descripción:**
Como profesional, quiero poder eliminar el registro de un paciente (soft delete preferiblemente) cuando ya no esté bajo mi cuidado o por otras razones válidas, para mantener mi lista de pacientes activa y organizada.

**Tareas Específicas (Frontend):**
1.  **Implementar Opción de Eliminar Paciente:**
    *   Añadir un botón/icono de "Eliminar" en un lugar apropiado (ej. en la lista de pacientes junto a cada paciente, o en la página de perfil del paciente).
2.  **Implementar Diálogo de Confirmación:**
    *   Al hacer clic en "Eliminar", mostrar un diálogo de confirmación modal (ej. "¿Estás seguro de que quieres eliminar a [Nombre Paciente]? Esta acción podría ser irreversible/marcará al paciente como inactivo.").
    *   El diálogo debe tener opciones claras como "Confirmar Eliminación" y "Cancelar".
3.  **Manejar Acción de Confirmar Eliminación:**
    *   Si el profesional confirma, realizar una petición `DELETE` al endpoint de eliminación del backend (ej. `/api/patients/{patientId}`).
    *   Incluir el `patientId` en la URL y el token JWT en las cabeceras.
    *   Mostrar un indicador de carga.
4.  **Gestionar Respuestas del Backend:**
    *   **Éxito (200 OK o 204 No Content):**
        *   Mostrar mensaje de confirmación (ej. "Paciente [Nombre Paciente] eliminado correctamente.").
        *   Actualizar la UI para reflejar la eliminación (ej. remover al paciente de la lista, redirigir si se estaba en el perfil del paciente eliminado).
    *   **No Autorizado (401 Unauthorized) / Prohibido (403 Forbidden):**
        *   Manejar adecuadamente (ej. si el profesional no es propietario).
    *   **No Encontrado (404 Not Found):**
        *   Si el paciente ya no existe o el ID es incorrecto.
    *   **Error Genérico del Servidor (500 Internal Server Error):**
        *   Mostrar mensaje genérico.
5.  **Pruebas (Frontend):**
    *   Probar la visualización del botón de eliminar.
    *   Probar el diálogo de confirmación (confirmar y cancelar).
    *   Probar el manejo de respuestas de éxito y error del backend.
    *   Verificar que la UI se actualiza correctamente tras la eliminación.

**Criterios de Aceptación (Frontend):**
*   El profesional puede iniciar la eliminación de un paciente.
*   Se muestra una confirmación antes de proceder con la eliminación.
*   La comunicación con el backend para eliminar el paciente es exitosa.
*   Se proporciona feedback adecuado y la UI se actualiza tras la eliminación.

**Consideraciones Técnicas (Frontend):**
*   Componente modal para la confirmación.
*   Actualización del estado local/global para reflejar la lista de pacientes actualizada.

**Etiquetas:** `frontend`, `pacientes`, `eliminación de paciente`, `HU-006.1`

---

## HU-008: Visualización del Dashboard Principal (Listar/Buscar Pacientes)

---

**ID del Ticket:** TF-008
**Historia de Usuario Relacionada:** HU-008 - Visualización del Dashboard Principal
**Tipo:** Feature
**Prioridad:** Alta

**Descripción:**
Como profesional, quiero ver un dashboard principal con una lista de mis pacientes, con opciones para buscar, filtrar y ordenar, para poder acceder y gestionar rápidamente la información de mis pacientes.

**Tareas Específicas (Frontend):**
1.  **Crear Página de Dashboard de Pacientes:**
    *   Diseñar y desarrollar la página principal del dashboard (ej. `/dashboard` o `/pacientes`).
    *   Esta página será la vista principal después del login para muchos profesionales.
2.  **Implementar Funcionalidad de Listado de Pacientes:**
    *   Al cargar la página, realizar una petición `GET` al endpoint `/api/patients` para obtener la lista de pacientes del profesional autenticado.
    *   Mostrar los pacientes en un formato claro (tabla, tarjetas, lista).
    *   Para cada paciente, mostrar información clave (ej. Nombre completo, Email, Teléfono, ¿última actividad/contacto?, ¿estado?).
    *   Incluir enlaces/botones para acciones comunes por paciente (ej. Ver Perfil, Editar, Eliminar - si ya implementado).
3.  **Implementar Paginación:**
    *   Si la lista de pacientes puede ser larga, implementar paginación (del lado del cliente o del servidor según la respuesta del API).
    *   Permitir al usuario navegar entre páginas de resultados.
4.  **Implementar Funcionalidad de Búsqueda:**
    *   Añadir un campo de búsqueda que permita al profesional buscar pacientes por nombre, apellido o email.
    *   Al ingresar un término de búsqueda, realizar una nueva petición `GET` a `/api/patients` con el parámetro `search`.
    *   Actualizar la lista de pacientes con los resultados.
5.  **Implementar Funcionalidad de Ordenación (Opcional, pero Recomendado):**
    *   Permitir al usuario hacer clic en las cabeceras de columna (si es una tabla) para ordenar la lista por ese campo (ej. Nombre, Fecha de registro).
    *   Realizar una nueva petición `GET` con los parámetros `sortBy` y `order`.
    *   Actualizar la lista.
6.  **Implementar Filtros (Opcional):**
    *   Considerar si se necesitan filtros adicionales (ej. por estado del paciente, por etiquetas, etc.).
7.  **Botón "Añadir Nuevo Paciente":**
    *   Asegurar que haya un botón prominente para "Añadir Nuevo Paciente" que lleve al formulario de TF-005.
8.  **Manejo de Estados (Carga, Error, Vacío):**
    *   Mostrar indicadores de carga mientras se obtienen los datos.
    *   Mostrar un mensaje apropiado si ocurre un error al cargar los pacientes.
    *   Mostrar un mensaje si el profesional no tiene ningún paciente registrado aún, con una llamada a la acción para añadir uno.
9.  **Pruebas (Frontend):**
    *   Probar el listado de pacientes con diferentes cantidades de datos.
    *   Probar la paginación.
    *   Probar la búsqueda con diferentes términos (coincidencias, no coincidencias).
    *   Probar la ordenación.
    *   Probar los estados de carga, error y vacío.

**Criterios de Aceptación (Frontend):**
*   El dashboard muestra una lista de los pacientes del profesional.
*   La paginación funciona correctamente si hay muchos pacientes.
*   La búsqueda por nombre/email filtra la lista de pacientes.
*   La ordenación (si se implementa) funciona.
*   Se manejan adecuadamente los diferentes estados (carga, error, vacío).
*   Hay acceso fácil para añadir un nuevo paciente.

**Consideraciones Técnicas (Frontend):**
*   Gestión del estado de la lista de pacientes, parámetros de búsqueda/paginación/ordenación.
*   Componentes de tabla/lista reutilizables.
*   Debouncing para la entrada de búsqueda para no sobrecargar el API.

**Etiquetas:** `frontend`, `pacientes`, `dashboard`, `listado`, `búsqueda`, `paginación`, `HU-008`

---

## HU-009: Visualización del Perfil Detallado del Paciente

---

**ID del Ticket:** TF-009
**Historia de Usuario Relacionada:** HU-009 - Visualización del Perfil Detallado del Paciente
**Tipo:** Feature
**Prioridad:** Alta

**Descripción:**
Como profesional, quiero poder ver el perfil detallado de un paciente específico, incluyendo su información completa, un resumen de su último registro biométrico, y resúmenes de sus planes de dieta y entrenamiento, para tener una visión integral de su estado y progreso.

**Tareas Específicas (Frontend):**
1.  **Crear Página de Perfil de Paciente:**
    *   Diseñar y desarrollar la página de perfil de paciente (ej. `/pacientes/{patientId}`).
    *   Esta página será accesible al hacer clic en un paciente desde el dashboard (TF-008).
2.  **Obtener y Mostrar Datos del Paciente:**
    *   Al cargar la página, obtener el `patientId` de los parámetros de la URL.
    *   Realizar una petición `GET` al endpoint `/api/patients/{patientId}`.
    *   Mostrar la información personal completa del paciente (todos los campos de `PatientResponse`).
    *   Mostrar el último registro biométrico (`lastBiometricRecord`), si existe.
    *   Mostrar resúmenes de los planes de dieta (`dietPlansSummary`) y entrenamiento (`workoutPlansSummary`) en secciones separadas (ej. listas con título y estado, enlazando a los detalles del plan si esa HU ya está desarrollada).
3.  **Diseño de la Interfaz de Usuario:**
    *   Organizar la información de manera clara y legible (ej. usando tarjetas, secciones, pestañas).
    *   Considerar la visualización de datos biométricos (si se muestra más que solo el último aquí).
    *   Asegurar responsividad.
4.  **Navegación y Acciones:**
    *   Incluir botones/enlaces para acciones relevantes como:
        *   "Editar Información del Paciente" (lleva a TF-006).
        *   "Añadir Registro Biométrico" (lleva a TF-010).
        *   "Crear Plan de Dieta" (lleva a TF-012).
        *   "Crear Plan de Entrenamiento" (lleva a TF-015).
        *   "Ver Historial Biométrico Completo" (lleva a TF-011).
        *   Enlaces a los detalles de cada plan de dieta/entrenamiento listado.
5.  **Manejo de Estados (Carga, Error, Vacío):**
    *   Indicador de carga, manejo de errores (404 Paciente no encontrado, 403 No autorizado, etc.).
    *   Mostrar mensajes adecuados si ciertas secciones no tienen datos (ej. "No hay registros biométricos aún", "No hay planes de dieta asignados").
6.  **Pruebas (Frontend):**
    *   Probar la carga y visualización de todos los datos del perfil del paciente.
    *   Probar con pacientes con y sin registros biométricos/planes.
    *   Verificar que todos los enlaces y botones de acción navegan correctamente.
    *   Probar el manejo de errores (404, 403, etc.).

**Criterios de Aceptación (Frontend):**
*   La página de perfil de paciente muestra toda la información especificada de la HU-009.
*   Los datos son correctos y se corresponden con el paciente seleccionado.
*   Los resúmenes de biométricos y planes se muestran adecuadamente.
*   La navegación a otras secciones (editar paciente, añadir registro/plan, etc.) funciona.
*   Se manejan correctamente los estados de carga, error y datos vacíos.

**Consideraciones Técnicas (Frontend):**
*   Manejo de rutas dinámicas (`/pacientes/:patientId`).
*   Posiblemente componentes reutilizables para mostrar resúmenes de planes o datos biométricos.

**Etiquetas:** `frontend`, `pacientes`, `perfil de paciente`, `visualización`, `HU-009`

---

## HU-010: Registro de Nuevas Medidas Biométricas

---

**ID del Ticket:** TF-010
**Historia de Usuario Relacionada:** HU-010 - Registro de Nuevas Medidas Biométricas
**Tipo:** Feature
**Prioridad:** Alta

**Descripción:**
Como profesional, quiero poder registrar nuevas medidas biométricas para un paciente específico (peso, % grasa, perímetros, etc.) en una fecha determinada, para llevar un seguimiento de su evolución.

**Tareas Específicas (Frontend):**
1.  **Crear Formulario/Modal de Registro Biométrico:**
    *   Diseñar y desarrollar la UI para registrar un nuevo conjunto de medidas biométricas.
    *   Este formulario será accesible desde el perfil del paciente (TF-009) o desde la vista de historial biométrico (TF-011).
    *   Asegurar responsividad.
2.  **Desarrollar Formulario:**
    *   Implementar campos para:
        *   `recordDate` (Fecha de la medición - selector de fecha, obligatorio, default a hoy).
        *   `weight` (Peso en kg - opcional, numérico).
        *   `bodyFatPercentage` (% Grasa corporal - opcional, numérico).
        *   `musclePercentage` (% Masa muscular - opcional, numérico).
        *   `waterPercentage` (% Agua - opcional, numérico).
        *   `backChestDiameter` (Diámetro espalda/pecho - opcional, numérico).
        *   `waistDiameter` (Diámetro cintura - opcional, numérico).
        *   `armsDiameter` (Diámetro brazos - opcional, numérico).
        *   `legsDiameter` (Diámetro piernas - opcional, numérico).
        *   `calvesDiameter` (Diámetro gemelos - opcional, numérico).
        *   `notes` (Observaciones - opcional, área de texto).
    *   Al menos una medida (aparte de la fecha) debe ser requerida para que el registro sea útil.
3.  **Implementar Validaciones en Cliente:**
    *   Validar que `recordDate` es obligatoria.
    *   Validar que al menos un campo de medida biométrica tiene valor.
    *   Validar que los campos numéricos acepten solo números y decimales apropiados, dentro de rangos lógicos.
    *   Mostrar mensajes de error claros.
4.  **Manejar Envío del Formulario:**
    *   Al guardar, obtener el `patientId` (del contexto de la página actual, ej. perfil de paciente).
    *   Realizar una petición `POST` al endpoint `/api/patients/{patientId}/biometric-records`.
    *   Incluir todos los datos del formulario en el cuerpo de la petición.
    *   Enviar token JWT en cabeceras.
    *   Mostrar indicador de carga.
5.  **Gestionar Respuestas del Backend:**
    *   **Éxito (201 Created):**
        *   Mostrar mensaje de confirmación (ej. "Registro biométrico guardado.").
        *   Actualizar la vista de historial biométrico (TF-011) si está visible, o el `lastBiometricRecord` en el perfil del paciente (TF-009).
        *   Cerrar el modal/formulario o redirigir.
    *   **Error de Validación (400 Bad Request):** Mostrar errores.
    *   **No Autorizado (401) / Prohibido (403) / No Encontrado (404 Paciente):** Manejar errores.
    *   **Error Genérico del Servidor (500).**
6.  **Pruebas (Frontend):**
    *   Probar el formulario con varias combinaciones de datos.
    *   Probar validaciones.
    *   Probar el envío y manejo de respuestas.
    *   Verificar actualización de UI (lista/último registro).

**Criterios de Aceptación (Frontend):**
*   El formulario de registro biométrico es funcional.
*   Se pueden ingresar todas las medidas biométricas especificadas.
*   Las validaciones en cliente funcionan (fecha obligatoria, al menos una medida).
*   La comunicación con el backend para crear el registro es exitosa.
*   Se proporciona feedback y la UI se actualiza (ej. historial o resumen en perfil).

**Consideraciones Técnicas (Frontend):**
*   Selector de fecha.
*   Claridad en las unidades de medida (kg, cm, %).

**Etiquetas:** `frontend`, `pacientes`, `biometría`, `registros biométricos`, `HU-010`

---

## HU-011: Visualización de la Evolución de Métricas

---

**ID del Ticket:** TF-011
**Historia de Usuario Relacionada:** HU-011 - Visualización de la Evolución de Métricas
**Tipo:** Feature
**Prioridad:** Media

**Descripción:**
Como profesional, quiero poder ver el historial completo de registros biométricos de un paciente, con la opción de filtrar por rango de fechas y ver gráficos de evolución de ciertas métricas, para analizar su progreso.

**Tareas Específicas (Frontend):**
1.  **Crear Página/Sección de Historial Biométrico:**
    *   Diseñar y desarrollar una vista dedicada para el historial biométrico de un paciente.
    *   Accesible desde el perfil del paciente (TF-009).
2.  **Obtener y Listar Registros Biométricos:**
    *   Al cargar, obtener el `patientId`.
    *   Realizar petición `GET` a `/api/patients/{patientId}/biometric-records` para obtener todos los registros.
    *   Mostrar los registros en una tabla o lista, ordenados por fecha (más reciente primero).
    *   Cada registro debe mostrar la fecha y todas las métricas guardadas.
3.  **Implementar Filtro por Rango de Fechas:**
    *   Añadir selectores de fecha ("Desde", "Hasta") para filtrar los registros.
    *   Al aplicar el filtro, realizar una nueva petición `GET` con los parámetros `startDate` y `endDate`.
    *   Actualizar la lista/tabla.
4.  **Implementar Gráficos de Evolución (Opcional, pero valioso):**
    *   Seleccionar métricas clave (ej. Peso, % Grasa Corporal, Cintura) para graficar.
    *   Utilizar una librería de gráficos (ej. Chart.js, Recharts) para mostrar la evolución de estas métricas a lo largo del tiempo (usando `recordDate` para el eje X).
    *   Permitir al usuario seleccionar qué métrica(s) visualizar en el gráfico.
5.  **Navegación y Acciones:**
    *   Botón para "Añadir Nuevo Registro Biométrico" (lleva a TF-010).
    *   Posibilidad de editar/eliminar un registro biométrico individual (requeriría HUs/tickets adicionales para estas acciones específicas en registros individuales).
6.  **Manejo de Estados (Carga, Error, Vacío):**
    *   Indicador de carga, mensajes de error, mensaje si no hay registros.
7.  **Pruebas (Frontend):**
    *   Probar listado con y sin filtros de fecha.
    *   Probar visualización de gráficos (si se implementan).
    *   Probar manejo de estados.

**Criterios de Aceptación (Frontend):**
*   Se muestra el historial completo de registros biométricos de un paciente.
*   Los registros se pueden filtrar por rango de fechas.
*   (Si se implementa) Se muestran gráficos de evolución para métricas seleccionadas.
*   La interfaz es clara y permite analizar la progresión del paciente.

**Consideraciones Técnicas (Frontend):**
*   Librería de gráficos.
*   Componentes de selector de fecha/rango.
*   Manejo del estado de los filtros y datos de los gráficos.

**Etiquetas:** `frontend`, `pacientes`, `biometría`, `historial biométrico`, `gráficos`, `HU-011`

---

## HU-012: Creación Básica de Plan de Dieta

---

**ID del Ticket:** TF-012
**Historia de Usuario Relacionada:** HU-012 - Creación Básica de Plan de Dieta
**Tipo:** Feature
**Prioridad:** Alta

**Descripción:**
Como profesional, quiero poder crear un nuevo plan de dieta personalizado para un paciente, definiendo título, descripción, fechas, objetivos y las comidas para diferentes momentos del día.

**Tareas Específicas (Frontend):**
1.  **Crear Página/Formulario de Creación de Plan de Dieta:**
    *   Diseñar y desarrollar la UI para crear un nuevo plan de dieta.
    *   Accesible desde el perfil del paciente (TF-009) o una sección de "Planes de Dieta".
    *   El `patientId` para el que se crea el plan debe estar en el contexto.
2.  **Desarrollar Formulario del Plan de Dieta:**
    *   **Información General del Plan:**
        *   `title` (Título - obligatorio, texto).
        *   `description` (Descripción - opcional, área de texto).
        *   `startDate` (Fecha de inicio - opcional, selector de fecha).
        *   `endDate` (Fecha de finalización - opcional, selector de fecha).
        *   `objectives` (Objetivos del plan - opcional, área de texto).
        *   `status` (Estado: "Activo", "Borrador" - selector, default "Activo").
        *   `notes` (Notas adicionales del plan - opcional, área de texto).
    *   **Sección de Comidas (`meals`):**
        *   Permitir añadir dinámicamente múltiples comidas.
        *   Para cada comida (`DietMealCreation`):
            *   `mealType` (Tipo de comida: ej. Desayuno, Media Mañana, Almuerzo, Merienda, Cena, Resopón - selector/input, obligatorio).
            *   `content` (Contenido de la comida - área de texto, obligatorio).
            *   Botón para eliminar una comida añadida.
        *   Botón "Añadir Comida".
3.  **Implementar Validaciones en Cliente:**
    *   Validar campos obligatorios del plan (ej. `title`).
    *   Validar fechas (ej. `endDate` no puede ser anterior a `startDate`).
    *   Para cada comida, validar campos obligatorios (`mealType`, `content`).
    *   Mostrar mensajes de error claros.
4.  **Manejar Envío del Formulario:**
    *   Al guardar, construir el objeto `DietPlanCreation` con su array `meals`.
    *   Realizar petición `POST` al endpoint `/api/patients/{patientId}/diet-plans`.
    *   Enviar token JWT en cabeceras.
    *   Mostrar indicador de carga.
5.  **Gestionar Respuestas del Backend:**
    *   **Éxito (201 Created):**
        *   Mostrar mensaje de confirmación (ej. "Plan de dieta '[Título]' creado.").
        *   Redirigir al perfil del paciente (TF-009) o a la vista detallada del plan (TF-013).
        *   Actualizar la lista de planes del paciente.
    *   **Error de Validación (400):** Mostrar errores.
    *   **No Autorizado (401) / Prohibido (403) / No Encontrado (404 Paciente):** Manejar errores.
    *   **Error Genérico (500).**
6.  **Pruebas (Frontend):**
    *   Probar creación de plan con y sin campos opcionales, y con múltiples comidas.
    *   Probar validaciones (plan y comidas).
    *   Probar añadir/eliminar comidas dinámicamente.
    *   Probar envío y manejo de respuestas.

**Criterios de Aceptación (Frontend):**
*   El formulario de creación de plan de dieta es funcional.
*   Se pueden definir todos los aspectos del plan, incluyendo múltiples comidas.
*   Las validaciones en cliente funcionan.
*   La comunicación con el backend es exitosa y se crea el plan.
*   Se proporciona feedback adecuado y se actualiza/redirige la UI.

**Consideraciones Técnicas (Frontend):**
*   Manejo de formularios dinámicos para las comidas (añadir/eliminar elementos de un array en el estado).
*   Componentes de selector de fecha.
*   Podría ser un formulario largo; considerar UX (ej. colapsar secciones).

**Etiquetas:** `frontend`, `pacientes`, `dietas`, `planes de dieta`, `creación`, `HU-012`

---

## HU-013: Visualización de Detalles de un Plan de Dieta

---

**ID del Ticket:** TF-013
**Historia de Usuario Relacionada:** HU-013 - Visualización de Detalles de un Plan de Dieta
**Tipo:** Feature
**Prioridad:** Media

**Descripción:**
Como profesional, quiero poder ver los detalles completos de un plan de dieta específico, incluyendo toda su información general y el listado de todas sus comidas.

**Tareas Específicas (Frontend):**
1.  **Crear Página de Detalles del Plan de Dieta:**
    *   Diseñar y desarrollar una página para mostrar los detalles de un plan de dieta (ej. `/planes-dieta/{dietPlanId}`).
    *   Accesible desde la lista de planes en el perfil del paciente (TF-009) o desde una lista general de planes de dieta (si existe).
2.  **Obtener y Mostrar Datos del Plan de Dieta:**
    *   Al cargar la página, obtener el `dietPlanId` de los parámetros de la URL.
    *   Realizar una petición `GET` al endpoint `/api/diet-plans/{dietPlanId}`.
    *   Mostrar toda la información general del plan (`title`, `description`, `startDate`, `endDate`, `objectives`, `status`, `notes`).
    *   Listar todas las comidas (`meals`) del plan, cada una mostrando `mealType` y `content`.
3.  **Diseño de la Interfaz de Usuario:**
    *   Organizar la información del plan y la lista de comidas de forma clara.
    *   Asegurar responsividad.
4.  **Navegación y Acciones:**
    *   Botón para "Editar Plan de Dieta" (lleva a TF-014).
    *   Botón para "Eliminar Plan de Dieta" (requiere HU/ticket para eliminación).
    *   Botón para "Duplicar Plan de Dieta" (funcionalidad avanzada, opcional).
    *   Botón para "Exportar a PDF" (relacionado con HU-007).
    *   Enlace para volver al perfil del paciente o a la lista de planes.
5.  **Manejo de Estados (Carga, Error, Vacío):**
    *   Indicador de carga, manejo de errores (404 Plan no encontrado, 403 No autorizado, etc.).
6.  **Pruebas (Frontend):**
    *   Probar la carga y visualización de planes con diferentes cantidades de comidas y datos.
    *   Verificar que todos los datos del plan y las comidas se muestran correctamente.
    *   Probar la navegación y los botones de acción (si los destinos ya existen).

**Criterios de Aceptación (Frontend):**
*   La página de detalles del plan de dieta muestra toda la información especificada.
*   Se listan correctamente todas las comidas del plan.
*   La navegación a otras acciones (editar, etc.) está disponible.
*   Se manejan los estados de carga y error.

**Consideraciones Técnicas (Frontend):**
*   Rutas dinámicas (`/planes-dieta/:dietPlanId`).
*   Componentes para mostrar la información del plan y la lista de comidas.

**Etiquetas:** `frontend`, `dietas`, `planes de dieta`, `visualización`, `HU-013`

---

## HU-014: Modificación de un Plan de Dieta Existente

---

**ID del Ticket:** TF-014
**Historia de Usuario Relacionada:** HU-014 - Modificación de un Plan de Dieta Existente
**Tipo:** Feature
**Prioridad:** Media

**Descripción:**
Como profesional, quiero poder modificar un plan de dieta existente, incluyendo su información general y sus comidas, para ajustarlo o corregirlo.

**Tareas Específicas (Frontend):**
1.  **Crear/Modificar Formulario de Edición de Plan de Dieta:**
    *   Reutilizar o adaptar el formulario de creación de plan de dieta (TF-012) para la edición.
    *   Accesible desde la vista de detalles del plan de dieta (TF-013).
2.  **Poblar Formulario con Datos Existentes:**
    *   Al cargar el formulario de edición para un `dietPlanId` específico, obtener los datos actuales del plan (incluyendo todas sus comidas) mediante una petición `GET` a `/api/diet-plans/{dietPlanId}`.
    *   Rellenar todos los campos del formulario (información general y lista de comidas) con los datos recibidos.
3.  **Permitir Edición de Campos y Comidas:**
    *   Permitir la modificación de todos los campos de la información general del plan.
    *   Permitir la modificación de los campos `mealType` y `content` de las comidas existentes.
    *   Permitir añadir nuevas comidas al plan (misma funcionalidad que en TF-012).
    *   Permitir eliminar comidas existentes del plan (con confirmación si se considera necesario).
4.  **Implementar Validaciones en Cliente:**
    *   Mismas validaciones que en el formulario de creación (TF-012) para todos los campos y comidas.
5.  **Manejar Envío del Formulario de Actualización:**
    *   Al guardar cambios, construir el objeto `DietPlanCreation` (o un esquema similar para actualización que permita IDs para comidas existentes) con la información actualizada del plan y el array de comidas (incluyendo IDs para comidas existentes y datos nuevos para comidas nuevas).
    *   Realizar una petición `PUT` al endpoint `/api/diet-plans/{dietPlanId}`.
    *   Enviar token JWT en cabeceras.
    *   Mostrar indicador de carga.
6.  **Gestionar Respuestas del Backend:**
    *   **Éxito (200 OK):**
        *   Mostrar mensaje de confirmación (ej. "Plan de dieta '[Título]' actualizado.").
        *   Redirigir a la vista de detalles del plan actualizado (TF-013).
        *   Actualizar los datos del plan en el estado local/UI.
    *   **Error de Validación (400):** Mostrar errores.
    *   **No Autorizado (401) / Prohibido (403) / No Encontrado (404 Plan):** Manejar errores.
    *   **Error Genérico (500).**
7.  **Opción de Cancelar Edición:**
    *   Botón "Cancelar" que descarte los cambios y devuelva a la vista de detalles del plan.
8.  **Pruebas (Frontend):**
    *   Probar carga de datos, edición de todos los campos, añadir/editar/eliminar comidas.
    *   Probar guardado y cancelación.
    *   Verificar manejo de respuestas y actualización de UI.

**Criterios de Aceptación (Frontend):**
*   El formulario de edición de plan de dieta es funcional y se precarga correctamente.
*   Se pueden modificar todos los aspectos del plan, incluyendo añadir, editar y eliminar comidas.
*   Las validaciones funcionan.
*   La comunicación con el backend para actualizar es exitosa.
*   Se proporciona feedback y la UI se actualiza/redirige.

**Consideraciones Técnicas (Frontend):**
*   Manejo complejo del estado del formulario, especialmente el array de comidas que pueden ser existentes (con ID), nuevas (sin ID), o marcadas para eliminación.
*   Enviar los datos al backend de una manera que este pueda diferenciar entre comidas nuevas, actualizadas o eliminadas (o el backend se encarga de la lógica de sincronización).

**Etiquetas:** `frontend`, `dietas`, `planes de dieta`, `edición`, `HU-014`

## HU-014_A: Eliminación de un Plan de Dieta

---

**ID del Ticket:** TF-014A
**Historia de Usuario Relacionada:** HU-014_A - Eliminación de un Plan de Dieta
**Tipo:** Feature
**Prioridad:** Media

**Descripción:**
Como profesional, quiero poder eliminar un plan de dieta existente (preferiblemente soft delete) para mantener actualizados los planes de mis pacientes.

**Tareas Específicas (Frontend):**
1.  **Implementar Opción de Eliminar Plan de Dieta:**
    *   Añadir un botón/icono de "Eliminar" en la vista de detalles del plan de dieta (TF-013) y/o en la lista de planes del paciente.
2.  **Implementar Diálogo de Confirmación:**
    *   Al hacer clic en "Eliminar", mostrar un diálogo de confirmación (ej. "¿Estás seguro de que quieres eliminar el plan '[Título del Plan]'?").
3.  **Manejar Acción de Confirmar Eliminación:**
    *   Si se confirma, realizar una petición `DELETE` al endpoint `/api/diet-plans/{dietPlanId}`.
    *   Enviar token JWT.
    *   Mostrar indicador de carga.
4.  **Gestionar Respuestas del Backend:**
    *   **Éxito (200 OK o 204 No Content):**
        *   Mostrar mensaje de confirmación.
        *   Actualizar la UI (ej. redirigir al perfil del paciente, eliminar el plan de las listas).
    *   **No Autorizado (401) / Prohibido (403) / No Encontrado (404 Plan):** Manejar errores.
    *   **Error Genérico (500).**
5.  **Pruebas (Frontend):**
    *   Probar botón de eliminar, diálogo de confirmación.
    *   Probar manejo de respuestas y actualización de UI.

**Criterios de Aceptación (Frontend):**
*   El profesional puede iniciar la eliminación de un plan de dieta.
*   Se muestra una confirmación antes de eliminar.
*   La comunicación con el backend es exitosa.
*   La UI se actualiza para reflejar la eliminación.

**Etiquetas:** `frontend`, `dietas`, `planes de dieta`, `eliminación`, `HU-014_A`

---

## HU-015: Creación Básica de Plan de Entrenamiento

---

**ID del Ticket:** TF-015
**Historia de Usuario Relacionada:** HU-015 - Creación Básica de Plan de Entrenamiento
**Tipo:** Feature
**Prioridad:** Alta

**Descripción:**
Como profesional, quiero poder crear un nuevo plan de entrenamiento personalizado para un paciente, definiendo título, descripción, fechas, objetivos y los días de entrenamiento con sus ejercicios.

**Tareas Específicas (Frontend):**
1.  **Crear Página/Formulario de Creación de Plan de Entrenamiento:**
    *   Diseñar y desarrollar la UI para crear un nuevo plan de entrenamiento.
    *   Accesible desde el perfil del paciente (TF-009) o una sección de "Planes de Entrenamiento".
    *   El `patientId` para el que se crea el plan debe estar en el contexto.
2.  **Desarrollar Formulario del Plan de Entrenamiento:**
    *   **Información General del Plan:**
        *   `title` (Título - obligatorio, texto).
        *   `description` (Descripción - opcional, área de texto).
        *   `startDate` (Fecha de inicio - opcional, selector de fecha).
        *   `endDate` (Fecha de finalización - opcional, selector de fecha).
        *   `objectives` (Objetivos del plan - opcional, área de texto).
        *   `status` (Estado: "Activo", "Borrador" - selector, default "Activo").
        *   `notes` (Notas adicionales del plan - opcional, área de texto).
    *   **Sección de Días de Entrenamiento (`days`):**
        *   Permitir añadir dinámicamente múltiples días de entrenamiento.
        *   Para cada día (`WorkoutDayCreation`):
            *   `dayOfWeek` (Día: ej. Lunes, Martes / Día 1, Día 2 - selector/input, obligatorio).
            *   `description` (Descripción del día/enfoque - opcional, texto).
            *   **Sub-sección de Ejercicios (`exercises`):**
                *   Permitir añadir dinámicamente múltiples ejercicios a cada día.
                *   Para cada ejercicio (`ExerciseCreation`):
                    *   `name` (Nombre del ejercicio - obligatorio, texto).
                    *   `setsReps` (Series y Repeticiones - obligatorio, texto, ej. "4x10-12").
                    *   `observations` (Observaciones - opcional, texto).
                    *   Botón para eliminar un ejercicio añadido.
                *   Botón "Añadir Ejercicio" (dentro de cada día).
            *   Botón para eliminar un día de entrenamiento añadido.
        *   Botón "Añadir Día de Entrenamiento".
3.  **Implementar Validaciones en Cliente:**
    *   Validar campos obligatorios del plan (ej. `title`).
    *   Validar fechas.
    *   Para cada día, validar `dayOfWeek`.
    *   Para cada ejercicio, validar `name` y `setsReps`.
    *   Mostrar mensajes de error claros.
4.  **Manejar Envío del Formulario:**
    *   Construir el objeto `WorkoutPlanCreation` con su array `days`, y cada día con su array `exercises`.
    *   Realizar petición `POST` al endpoint `/api/patients/{patientId}/workout-plans`.
    *   Enviar token JWT.
    *   Mostrar indicador de carga.
5.  **Gestionar Respuestas del Backend:**
    *   **Éxito (201 Created):**
        *   Mostrar mensaje de confirmación.
        *   Redirigir al perfil del paciente o a la vista detallada del plan de entrenamiento (TF-016).
        *   Actualizar lista de planes del paciente.
    *   **Error de Validación (400):** Mostrar errores.
    *   **No Autorizado (401) / Prohibido (403) / No Encontrado (404 Paciente):** Manejar.
    *   **Error Genérico (500).**
6.  **Pruebas (Frontend):**
    *   Probar creación de plan con múltiples días y ejercicios.
    *   Probar validaciones.
    *   Probar añadir/eliminar días y ejercicios dinámicamente.
    *   Probar envío y manejo de respuestas.

**Criterios de Aceptación (Frontend):**
*   El formulario de creación de plan de entrenamiento es funcional.
*   Se pueden definir todos los aspectos del plan, incluyendo múltiples días y ejercicios por día.
*   Las validaciones funcionan.
*   La comunicación con el backend es exitosa.
*   Se proporciona feedback adecuado y se actualiza/redirige la UI.

**Consideraciones Técnicas (Frontend):**
*   Manejo de formularios anidados y dinámicos (días, y ejercicios dentro de días).
*   Componentes de selector de fecha.
*   UX para un formulario potencialmente muy complejo.

**Etiquetas:** `frontend`, `pacientes`, `entrenamiento`, `planes de entrenamiento`, `creación`, `HU-015`

---

## HU-016: Visualización de Detalles de un Plan de Entrenamiento

---

**ID del Ticket:** TF-016
**Historia de Usuario Relacionada:** HU-016: Visualización de Detalles de un Plan de Entrenamiento
**Título del Ticket:** Interfaz para Visualizar Detalles del Plan de Entrenamiento
**Descripción:** Desarrollar la interfaz de usuario que permita al profesional ver los detalles completos de un plan de entrenamiento específico de un paciente. Esto incluye la información general del plan (título, descripción, paciente, fechas, objetivos, estado, notas), la estructura del plan (días de entrenamiento y ejercicios por día), y los botones de acción disponibles (Editar, Generar PDF, Enviar, Eliminar, Duplicar).
**Criterios de Aceptación:**
    *   Se puede acceder a la vista desde el perfil del paciente o después de crear/editar un plan (e.g., `/patients/{patientId}/workout-plans/{workoutPlanId}`).
    *   Mostrar claramente la información general del plan.
    *   Mostrar de forma organizada la lista de días de entrenamiento con sus ejercicios (nombre, series, repeticiones/duración, observaciones, orden).
    *   Incluir botones de acción: "Editar Plan", "Generar PDF", "Enviar Plan al Paciente", "Eliminar Plan", "Duplicar Plan".
    *   Permitir la navegación de regreso al perfil del paciente o lista de planes.
    *   La vista debe ser responsiva.
**Prioridad:** Alta
**Estado:** Pendiente
---

### Ticket: TF-017
**Historia de Usuario Asociada:** HU-017: Edición de Plan de Entrenamiento Existente
**Título del Ticket:** Interfaz para Editar Planes de Entrenamiento Existentes
**Descripción:** Desarrollar la interfaz de usuario que permita al profesional editar un plan de entrenamiento existente. Esto incluye modificar la información general del plan, así como añadir, editar, reordenar o eliminar días de entrenamiento y los ejercicios dentro de cada día.
**Criterios de Aceptación:**
    *   Acceder a la edición desde la vista de detalles del plan (HU-016) (e.g., `/patients/{patientId}/workout-plans/{workoutPlanId}/edit`).
    *   El formulario debe ser similar al de creación (TF-015), precargado con los datos del plan existente.
    *   Permitir edición de información general del plan (título, descripción, fechas, objetivos, estado, notas).
    *   Permitir editar, eliminar y añadir nuevos días de entrenamiento. Opcional: reordenar días.
    *   Permitir editar, eliminar y añadir nuevos ejercicios dentro de un día. Opcional: reordenar ejercicios.
    *   Validaciones en cliente (similares a TF-015).
    *   Botones "Guardar Cambios" y "Cancelar".
    *   Al guardar, redirigir a la vista de detalles del plan actualizado (HU-016).
    *   Mostrar mensajes de éxito/error.
**Prioridad:** Alta
**Estado:** Pendiente
---

### Ticket: TF-018
**Historia de Usuario Asociada:** HU-018: Generación de PDF Combinado de Plan de Dieta y Entrenamiento
**Título del Ticket:** Interfaz para Generar PDF Combinado de Planes
**Descripción:** Desarrollar la interfaz que permita al profesional seleccionar un plan de dieta y/o un plan de entrenamiento de un paciente para generar y descargar un PDF combinado.
**Criterios de Aceptación:**
    *   Acceso desde el perfil del paciente (HU-009) (ej. "Generar PDF de Planes").
    *   Permitir seleccionar un plan de dieta (o ninguno) y un plan de entrenamiento (o ninguno) del paciente.
    *   Al menos un plan debe ser seleccionado para activar la generación.
    *   Botón "Generar PDF" que envía la solicitud al backend con los IDs de los planes.
    *   Mostrar indicador de carga.
    *   Al recibir el PDF del backend, iniciar la descarga automática con un nombre de archivo descriptivo.
    *   Diseño del PDF: profesional, legible, con logo, info del profesional y paciente, fecha. Secciones claras para dieta y/o entrenamiento con todos sus detalles.
**Prioridad:** Media
**Estado:** Pendiente
---

### Ticket: TF-019
**Historia de Usuario Asociada:** HU-019: Envío de Planes (PDF) por Correo Electrónico al Paciente
**Título del Ticket:** Interfaz para Enviar PDF de Planes por Email
**Descripción:** Desarrollar la interfaz que permita al profesional enviar el PDF de planes (generado en HU-018) por correo electrónico al paciente.
**Criterios de Aceptación:**
    *   Acceso a la función "Enviar por Email" junto a "Generar PDF" (HU-018) o después de generar el PDF.
    *   Modal/sección con:
        *   Destinatario (email del paciente, pre-rellenado si existe, editable, obligatorio).
        *   Asunto (pre-rellenado, editable).
        *   Cuerpo del mensaje (opcional, con texto por defecto).
        *   Indicador del PDF a adjuntar (basado en selección de HU-018).
    *   Botón "Enviar Email" con indicador de carga.
    *   Respuesta al usuario: éxito o error (email inválido, fallo de envío).
**Prioridad:** Media
**Estado:** Pendiente
---

### Ticket: TF-020
**Historia de Usuario Asociada:** HU-020: Eliminación de Plan de Dieta
**Título del Ticket:** Interfaz para Eliminar Planes de Dieta
**Descripción:** Desarrollar la interfaz que permita al profesional eliminar un plan de dieta existente de un paciente.
**Criterios de Aceptación:**
    *   Acceso desde detalles del plan de dieta (HU-013) o lista de planes del paciente (HU-009) mediante un botón "Eliminar Plan".
    *   Mostrar diálogo de confirmación modal antes de eliminar.
    *   Al confirmar, enviar solicitud al backend y mostrar indicador de carga.
    *   Respuesta al usuario: éxito (con redirección y mensaje) o error.
**Prioridad:** Media
**Estado:** Pendiente
---

### Ticket: TF-021
**Historia de Usuario Asociada:** HU-021: Eliminación de Plan de Entrenamiento
**Título del Ticket:** Interfaz para Eliminar Planes de Entrenamiento
**Descripción:** Desarrollar la interfaz que permita al profesional eliminar un plan de entrenamiento existente de un paciente.
**Criterios de Aceptación:**
    *   Acceso desde detalles del plan de entrenamiento (HU-016) o lista de planes (HU-009) con botón "Eliminar Plan".
    *   Mostrar diálogo de confirmación modal.
    *   Al confirmar, enviar solicitud al backend y mostrar indicador de carga.
    *   Respuesta al usuario: éxito (con redirección y mensaje) o error.
**Prioridad:** Media
**Estado:** Pendiente
--- 