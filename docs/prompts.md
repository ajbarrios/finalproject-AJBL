"Quiero que el script borre a todos los profesionales y cree solo a antonioProfessionalData. Lo mismo para los pacientes, borrarlos todos y crear los 5 de ejemplo."

**Prompt 23 (Relacionado con TB-008 - Backend - Debug Listar Pacientes Devuelve `[]`):**
Contexto: Tras ejecutar el seed, el endpoint devolvía un array vacío. Se verificó el flujo del `professionalId` desde el token.
"Al listar pacientes, el endpoint me devuelve []" y posterior confirmación "Ya esta he hecho login de nuevo y funciona"

**Prompt 24 (Relacionado con TB-008 - Backend - Inicio Pruebas Unitarias Servicio `patient.service.ts`):**
"Vamos a realizar las pruebas unitarias (para `patient.service.ts`)"

**Prompt 25 (Relacionado con TB-008 - Backend - Corrección Mocks Prisma en Tests Servicio):**
Contexto: Múltiples iteraciones para corregir el mock de Prisma en `patient.service.test.ts`, lidiando con errores de inicialización (`Cannot access 'prismaMock' before initialization`) y la correcta aplicación del mock automático de Vitest (`__mocks__` directory) y la posterior corrección de la aserción (`expected undefined to deeply equal ...`).
  - "Hay un test que falla en @node (referente a `Cannot access 'prismaMock' before initialization`)"
  - "Sigue fallando @node (referente a `Cannot access '__vi_import_0__' before initialization`)"
  - "Sigue fallando, echa un vistazo a @node (referente a `Cannot access 'mockPrismaInstance' before initialization`)"
  - "Ha fallado un test en @node (referente a `AssertionError: expected undefined to deeply equal ...`)"

**Prompt 26 (Relacionado con TB-008 - Backend - Implementación Casos de Prueba Servicio `patient.service.ts`):**
"Ya pasa, fantastico!. Continuemos con el resto de unit tests (para `patient.service.ts`)"

**Prompt 27 (Relacionado con TB-008 - Backend - Inicio Pruebas Controlador `patient.controller.ts`):**
"Pasemos a las pruebas del controlador"

**Prompt 28 (Relacionado con TB-008 - Backend - Corrección Mocks/Tipos en Tests Controlador):**
Contexto: Corrección de errores de linter y tipado en `patient.controller.test.ts` al configurar mocks para `req`, `res`, `next` y la función de servicio mockeada, específicamente el uso de `vi.mocked` y el tipado de los datos devueltos por el servicio mockeado.
  - "For the code present, we get this error: La propiedad 'mockResolvedValue' no existe en el tipo..."
  - "Los test fallan, echa un vistazo a @node (referente a `TypeError: ... is not a spy or a call to a spy!` para `mockNext`)"

**Prompt 29 (Relacionado con TB-008 - Backend - Implementación Casos de Prueba Controlador `patient.controller.ts`):**
"Continua construyendo tests para el controlador por favor"

**Prompt 30 (Relacionado con TB-008 - Backend - Añadir Endpoint GET por ID a Postman):**
"¿Puedes añadir a la coleccion de postman @NutriTrack Pro.postman_collection los endpoints nuevos que hemos creado en @patient.controller.ts para probarlos a traves de postman?"

**Prompt 31 (Relacionado con TB-008 - Frontend - Actualizar Tests Service para GET por ID):**
"¿Puedes actualizar los test unitarios de @patientService.test.ts en base a los nuevos cambios de  @patient.service.ts ?"

**Prompt 32 (Relacionado con TB-008 - Frontend - Corrección Linter Tests Service):**
"Corrige los errores del linter por favor." *(Seguido de iteraciones de corrección automática)*

**Prompt 33 (Relacionado con TF-009 - Plan de Acción Inicial):**
"Lee @tickets_frontend.md y desarrolla un plan para resolver el ticket "TF-009". Iremos paso por paso."

**Prompt 34 (Relacionado con TF-009 - Creación Componente Page):**
"Implementa el primer paso del plan: crear el componente base para la página de perfil del paciente (`PatientProfilePage.tsx`)."

**Prompt 35 (Relacionado con TF-009 - Implementación Fetching y Estados):**
"Continua con el plan: implementa la lógica para obtener los datos del paciente y manejar los estados de carga, error y éxito en `PatientProfilePage.tsx`."

**Prompt 36 (Relacionado con TF-009 - Corrección Linter Tipos/Servicio):**
"Corrige los errores del linter relacionados con la función `fetchPatientById` no encontrada y los errores de tipado en `PatientProfilePage.tsx`."

**Prompt 37 (Relacionado con TF-009 - Creación Tests Unitarios):**
"Continua con el plan: crea los tests unitarios para `PatientProfilePage.tsx`."

**Prompt 38 (Relacionado con TF-009 - Implementación Navegación y Botón Volver):**
"Añade el boton de ir atras a la pagina anterior del listado cuando estes en el detalle."

**Prompt 39 (Relacionado con TF-009 - Tests Unitarios Botón Volver):**
"Añade esto ultimo a los test unitarios de @PatientProfilePage.test.tsx"

**Prompt 40 (Relacionado con TB-005 - Backend - Plan de Acción Inicial):**
"Lee el archivo @tickets_backend.md y plantea un plan para resolver el ticket TB-005"

**Prompt 41 (Relacionado con TB-005 - Backend - Inicio Implementación):**
"Empecemos!" *(Este prompt inició la implementación de la ruta y controlador, primer paso del plan)*

**Prompt 42 (Relacionado con TB-005 - Backend - Continuar Implementación):**
"Si" *(Este prompt indicó continuar tras la validación, llevando a la implementación del servicio y pruebas)*

**Prompt 43 (Relacionado con TB-005 - Backend - Pruebas Unitarias):**
"Voy a probar los test unitarios primero y luego continuamos."

**Prompt 44 (Relacionado con TB-005 - Backend - Corrección Tests Unitarios):**
"Los test relacionados con @patientService.test.ts no funcionan. Te paso ta terminal @node" *(Seguido de varias iteraciones de corrección)*

**Prompt 45 (Relacionado con TB-005 - Backend - Actualizar Documentación Postman):**
"Continuemos con el paso anterior que me sugiriste de actualizar documentacion"

---

### 7. Pull Requests 