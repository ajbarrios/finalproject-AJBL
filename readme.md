## Índice

📋 [**Resumen Ejecutivo del MVP Completado**](./docs/mvp_completion_summary.md) ⭐

0. [Ficha del proyecto](#0-ficha-del-proyecto)
1. [Descripción general del producto](#1-descripción-general-del-producto)
2. [Arquitectura del sistema](#2-arquitectura-del-sistema)
3. [Modelo de datos](#3-modelo-de-datos)
4. [Especificación de la API](#4-especificación-de-la-api)
5. [Historias de usuario](#5-historias-de-usuario)
6. [Tickets de trabajo](#6-tickets-de-trabajo)
7. [Pull requests](#7-pull-requests)

---

## 0. Ficha del proyecto

### **0.1. Tu nombre completo:**
Antonio José Barrios León

### **0.2. Nombre del proyecto:**
NutriTrack Pro

### **0.3. Descripción breve del proyecto:**
NutriTrack Pro es una aplicación web para profesionales de la nutrición y entrenadores deportivos que quieran llevar a todas partes la progresión de sus clientes.

### **0.4. URL del proyecto**
[Web Nutritrack Pro](https://nutritrack-pro.netlify.app/)

### **0.5. URL o archivo comprimido del repositorio**
[Github NutriTrack Pro](https://github.com/ajbarrios/finalproject-AJBL)

> Puedes tenerlo alojado en público o en privado, en cuyo caso deberás compartir los accesos de manera segura. Puedes enviarlos a [alvaro@lidr.co](mailto:alvaro@lidr.co) usando algún servicio como [onetimesecret](https://onetimesecret.com/). También puedes compartir por correo un archivo zip con el contenido

### **0.6. Video del Proyecto:**

Aquí puedes encontrar la versión 1.0 del proyecto NutriTrack Pro en entorno de producción: **Netlify** + **Render**:

 👉 [Youtube](https://youtu.be/wHk-Hecftak)

---

### **0.7. Instrucciones para Probar la Aplicación**

Para evaluar todas las funcionalidades de NutriTrack Pro:

1. **Accede a la aplicación web:** [nutritrack-pro.netlify.app](https://nutritrack-pro.netlify.app/)

2. **Regístrate como nutricionista:**
   - Haz clic en "Registrarse" 
   - Crea una cuenta con tipo de usuario "Nutricionista"
   - Verifica que el login funciona correctamente

3. **Prueba las funcionalidades principales:**
   - ✅ **Gestión de pacientes:** Añade varios pacientes de prueba con datos completos
   - ✅ **Registros biométricos:** Agrega medidas corporales y visualiza gráficos de evolución
   - ✅ **Planes de dieta:** Crea planes personalizados organizados por días y comidas
   - ✅ **Generación PDF:** Genera y descarga planes en formato PDF profesional
   - ✅ **Envío por email:** Prueba el envío de planes por correo electrónico. Crea un paciente con un email al que tengas acceso para ver el resultado del plan de dieta generado.
   - ✅ **Búsqueda y filtros:** Usa la funcionalidad de búsqueda en el dashboard


#### **Frontend (React con Vite y Tailwind CSS)**

1.  **Navega al directorio `frontend`:**
    ```bash
    cd frontend
    ```

2.  **Instala las dependencias:**
    ```bash
    npm install
    ```

3.  **Configura las variables de entorno:**
    Crea un archivo `.env` en el directorio `frontend` (copiando `frontend/.env.example` si existiera) y configura la URL base de la API:
    ```env
    # frontend/.env
    VITE_API_BASE_URL=http://localhost:3000/api # Asegúrate que coincide con el puerto y prefijo de tu backend
    ```

4.  **Inicia el servidor de desarrollo del frontend:**
    ```bash
    npm run dev
    ```
    La aplicación frontend debería abrirse en tu navegador (por defecto en `http://localhost:5173`).

---

## 1. Descripción general del producto

> Describe en detalle los siguientes aspectos del producto:

### **1.1. Objetivo:**

El objetivo de NutriTrack Pro es proporcionar a nutricionistas y entrenadores deportivos una herramienta eficaz para el seguimiento nutricional y de entrenamiento de sus pacientes. El producto busca facilitar la personalización de planes de dieta y ejercicio, así como el monitoreo del progreso de los pacientes, mejorando así la comunicación y la eficiencia en el manejo de la salud y el bienestar.

### **1.2. Características y funcionalidades principales:**

- **Registro y Login de Profesionales:** Permite a nutricionistas y entrenadores registrarse y acceder al sistema de manera segura.
- **Gestión Completa de Pacientes (CRUD):** Permite a los profesionales registrar nuevos pacientes, visualizar sus perfiles detallados, editar su información y eliminarlos.
- **Visualización de la Evolución Biométrica:** Muestra la progresión física del paciente a lo largo del tiempo mediante registros biométricos detallados y gráficos de evolución.
- **Dashboard de Pacientes:** Un panel principal con funcionalidad de búsqueda que permite la gestión eficiente de los pacientes.
- **Creación de Planes de Dieta:** Dashboard dedicado para crear y personalizar planes de dieta detallados para cada paciente, organizados por días de la semana y tipos de comida.
- **Generación de Documentos PDF:** Generación de planes de dieta y entrenamiento en formato PDF profesional para facilitar su distribución a los pacientes.
- **Envío por Correo Electrónico:** Envío de planes de dieta mediante correo electrónico con plantillas profesionales y documentos PDF adjuntos.
- **Gestión de Registros Biométricos:** Sistema completo para registrar y visualizar la evolución de medidas corporales (peso, grasa corporal, masa muscular, diámetros, etc.).

### **1.3. Diseño y experiencia de usuario:**

NutriTrack Pro cuenta con un diseño minimalista, fresco y moderno, que se adapta de manera responsiva a diferentes dispositivos como móviles, tablets y ordenadores. La interfaz está diseñada para ser intuitiva y fácil de usar, permitiendo a los nutricionistas y entrenadores navegar y utilizar todas las funcionalidades de manera eficiente y sin complicaciones.

### **1.4. Instrucciones de instalación:**
> Documenta de manera precisa las instrucciones para instalar y poner en marcha el proyecto en local (librerías, backend, frontend, servidor, base de datos, migraciones y semillas de datos, etc.)

(Aquí irían las instrucciones generales si las tienes)

#### **Backend (Node.js/Express con Prisma y PostgreSQL)**

1.  **Navega al directorio `backend`:**
    ```bash
    cd backend
    ```

2.  **Configura las variables de entorno:**
    Crea un archivo `.env` en el directorio `backend` (copiando `backend/.env.example` si existiera) y configura las siguientes variables, especialmente `DATABASE_URL` para apuntar a tu instancia de PostgreSQL:
    ```env
    # backend/.env
    DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE_NAME"
    PORT=3000 # O el puerto que prefieras para la API
    # Otras variables de entorno necesarias...
    ```
    Asegúrate de que los detalles de `DATABASE_URL` coincidan con la configuración de tu base de datos (local o Dockerizada).

3.  **Instala las dependencias:**
    ```bash
    npm install
    ```

4.  **Base de Datos (PostgreSQL con Docker Compose - Opcional pero recomendado para desarrollo):**
    Si aún no tienes una instancia de PostgreSQL, puedes usar el `docker-compose.yml` proporcionado en la raíz del proyecto para levantar una.
    *   Asegúrate de tener Docker y Docker Compose instalados.
    *   Crea un archivo `.env` en la **raíz del proyecto** (junto a `docker-compose.yml`) con las credenciales para la base de datos que usará Docker Compose:
        ```env
        # Raíz del proyecto .env (para Docker Compose)
        POSTGRES_USER=nutritrackuser
        POSTGRES_PASSWORD=tu_contraseña_segura
        POSTGRES_DB=nutritrack_pro_db
        DB_PORT=5432 # Puerto local para la base de datos
        ```
    *   Desde la **raíz del proyecto**, levanta el servicio de base de datos:
        ```bash
        docker-compose up -d db
        ```

5.  **Migraciones de la Base de Datos (Prisma):**
    Una vez que tu base de datos esté accesible y `DATABASE_URL` esté configurada en `backend/.env`, aplica las migraciones para crear el esquema:
    ```bash
    npm run db:migrate 
    # O directamente: npx prisma migrate dev
    ```
    Esto aplicará las migraciones existentes (definidas en `backend/prisma/migrations/`) y creará las tablas y columnas en tu base de datos según lo definido en `backend/prisma/schema.prisma`. Como resultado de la configuración actual, los nombres de las tablas, columnas y los valores de los enums en la base de datos estarán en inglés.

6.  **Datos de Semilla (Prisma - Opcional):**
    Para poblar la base de datos con datos iniciales de prueba, puedes ejecutar el script de semillas:
    ```bash
    npm run db:seed
    # O directamente: npx prisma db seed
    ```

7.  **Inicia el servidor de desarrollo del backend:**
    ```bash
    npm run dev
    ```
    El servidor debería iniciarse (por defecto en `http://localhost:3000` si usaste ese puerto).

---

## 2. Arquitectura del Sistema

### **2.1. Diagrama de arquitectura:**

NutriTrack Pro sigue una arquitectura monolítica moderna con separación clara de responsabilidades. A continuación, se presenta la arquitectura mediante diagramas C4, que permiten visualizar el sistema a diferentes niveles de abstracción.

#### Nivel 1: Diagrama de Contexto

```mermaid
C4Context
    title Diagrama de Contexto para NutriTrack Pro

    Person(nutritionist, "Nutricionista/Entrenador", "Profesional que gestiona pacientes y crea planes de dieta/entrenamiento")
    Person(patient, "Paciente", "Recibe planes de dieta y entrenamiento")
    
    System(nutritrackPro, "Sistema NutriTrack Pro", "Permite la gestión de pacientes, creación de planes de dieta/entrenamiento y seguimiento de métricas corporales")
    
    System_Ext(emailSystem, "Servicio de Email", "Envía emails con planes de dieta y entrenamiento")
    System_Ext(whatsappAPI, "API de WhatsApp", "Envía mensajes y documentos a través de WhatsApp")
    
    Rel(nutritionist, nutritrackPro, "Gestiona pacientes y crea planes usando")
    Rel(nutritrackPro, patient, "Envía planes de dieta y entrenamiento a")
    Rel(nutritrackPro, emailSystem, "Usa para enviar comunicaciones")
    Rel(nutritrackPro, whatsappAPI, "Usa para enviar comunicaciones")
```

#### Nivel 2: Diagrama de Contenedores

```mermaid
C4Container
    title Diagrama de Contenedores para NutriTrack Pro

    Person(nutritionist, "Nutricionista/Entrenador", "Profesional que gestiona pacientes y crea planes")
    Person(patient, "Paciente", "Recibe planes de dieta y entrenamiento")
    
    System_Boundary(nutritrackPro, "Sistema NutriTrack Pro") {
        Container(webApp, "Aplicación Web Frontend", "React, Tailwind CSS", "Interfaz de usuario para profesionales")
        Container(apiApp, "API Backend", "Node.js, Express", "Proporciona funcionalidad de NutriTrack Pro a través de una API REST")
        ContainerDb(database, "Base de Datos", "PostgreSQL", "Almacena información sobre profesionales, pacientes, planes y métricas")
    }
    
    System_Ext(emailSystem, "Servicio de Email", "Envía emails con planes de dieta y entrenamiento")
    System_Ext(whatsappAPI, "API de WhatsApp", "Envía mensajes y documentos a través de WhatsApp")
    
    Rel(nutritionist, webApp, "Usa", "HTTPS")
    Rel(webApp, apiApp, "Hace llamadas API a", "JSON/HTTPS")
    Rel(apiApp, database, "Lee y escribe en", "Prisma ORM")
    Rel(apiApp, emailSystem, "Envía emails usando", "SMTP/API")
    Rel(apiApp, whatsappAPI, "Envía mensajes usando", "HTTPS/API")
    Rel(emailSystem, patient, "Envía emails a")
    Rel(whatsappAPI, patient, "Envía mensajes a")
```

#### Nivel 3: Diagrama de Componentes (Backend)

```mermaid
C4Component
    title Diagrama de Componentes para NutriTrack Pro - Backend

    Container_Boundary(apiApp, "API Backend") {
        Component(apiLayer, "Capa de API", "Express Controllers", "Incluye controladores para autenticación, pacientes, dietas, entrenamientos y métricas")
        
        Component(serviceLayer, "Capa de Servicios", "Business Logic", "Implementa la lógica de negocio y procesa datos")
        
        Component(dataLayer, "Capa de Datos", "Prisma ORM", "Gestiona el acceso a la base de datos")
        
        Component(communicationServices, "Servicios de Comunicación", "Email & WhatsApp", "Gestiona el envío de información a pacientes")
        
        Component(pdfService, "Servicio PDF", "jsPDF", "Genera documentos PDF de dietas y entrenamientos")
    }
    
    ContainerDb(database, "Base de Datos", "PostgreSQL", "Almacena información sobre profesionales, pacientes, planes y métricas")
    Container(webApp, "Aplicación Web Frontend", "React", "Interfaz de usuario para profesionales")
    
    System_Ext(emailSystem, "Servicio de Email", "Envía emails con planes")
    System_Ext(whatsappAPI, "API de WhatsApp", "Envía mensajes y documentos")
    
    Rel(webApp, apiLayer, "Hace llamadas API a", "JSON/HTTPS")
    Rel(apiLayer, serviceLayer, "Usa")
    Rel(serviceLayer, dataLayer, "Usa")
    Rel(dataLayer, database, "Lee y escribe en", "SQL")
    
    Rel(serviceLayer, pdfService, "Genera PDFs")
    Rel(serviceLayer, communicationServices, "Envía comunicaciones")
    Rel(pdfService, communicationServices, "Proporciona PDFs para envío")
    
    Rel(communicationServices, emailSystem, "Usa")
    Rel(communicationServices, whatsappAPI, "Usa")
```

#### Justificación de la Arquitectura Elegida

**Patrones Arquitectónicos Utilizados:**

1. **Arquitectura Monolítica Modular**: El sistema se implementa como un monolito bien estructurado internamente, con una clara separación entre frontend y backend. Esta aproximación facilita el desarrollo rápido y la implementación inicial del MVP.

2. **Patrón MVC (Modelo-Vista-Controlador)**: En el backend, se implementa el patrón MVC donde los modelos son representados por los esquemas de Prisma, la vista es la API REST, y los controladores manejan las solicitudes HTTP.

3. **Arquitectura de Componentes**: El frontend está estructurado siguiendo los principios de React, organizando la UI en componentes reutilizables.

4. **Patrón de Repositorio**: Implementado implícitamente a través de Prisma, que abstrae el acceso a la base de datos.

5. **Patrón de Servicios**: La lógica de negocio compleja se encapsula en servicios especializados para PDF, Email y WhatsApp.

**Beneficios de esta Arquitectura:**

1. **Desarrollo Eficiente**:
   - Desarrollo rápido al evitar la complejidad de los microservicios
   - Menor sobrecarga operativa y de infraestructura
   - JavaScript en todo el stack reduce la fragmentación de conocimientos
   - Prisma ORM minimiza el código boilerplate para operaciones de base de datos

2. **Despliegue Simplificado**:
   - Una única aplicación para desplegar y mantener
   - Menor complejidad en la configuración de entornos
   - Depuración más sencilla al tener todo el código en un solo lugar

3. **Mantenibilidad**:
   - Separación clara de responsabilidades entre módulos internos
   - Estructura de carpetas consistente que facilita ubicar el código
   - Menor complejidad operativa para un equipo pequeño o un solo desarrollador

4. **Experiencia de Usuario**:
   - Frontend en React permite una experiencia fluida sin recargas de página
   - La generación de PDFs y envío por diversos canales mejora la comunicación con pacientes

**Limitaciones y Sacrificios:**

1. **Escalabilidad**: La arquitectura monolítica puede presentar desafíos de escalabilidad a largo plazo si el sistema crece significativamente, aunque para un MVP y etapas tempranas del producto es más que suficiente.

2. **Desafíos de Rendimiento Potenciales**: React puede tener desafíos con listas muy grandes, y el uso de un ORM puede no ser óptimo para consultas extremadamente complejas.

3. **Despliegue Conjunto**: Cualquier cambio, incluso pequeño, requiere el redespliegue de toda la aplicación, lo que puede ser menos eficiente para actualizaciones muy frecuentes.

4. **Limitaciones de Integración**: La API de WhatsApp Business tiene costos y limitaciones para volúmenes grandes, y pueden surgir problemas de compatibilidad con algunos clientes de email para PDFs complejos.

Esta arquitectura monolítica modular representa la opción más pragmática para un MVP que debe desarrollarse en un tiempo limitado (30 horas). Proporciona un equilibrio óptimo entre velocidad de desarrollo, simplicidad de mantenimiento y funcionalidad, sin comprometer la posibilidad de evolucionar hacia una arquitectura más distribuida en el futuro si el producto lo requiere.

### **2.2. Descripción de componentes principales:**

#### **Frontend (Cliente)**
- **React**: Framework de JavaScript para la construcción de interfaces de usuario interactivas y componentes reutilizables. Gestiona el estado de la aplicación y la renderización eficiente mediante el Virtual DOM.
- **Tailwind CSS**: Framework de utilidades CSS para crear diseños personalizados sin salir del HTML. Facilita la creación de interfaces responsivas y consistentes.
- **React Router**: Biblioteca para la gestión de rutas en aplicaciones React. Permite la navegación entre diferentes vistas sin recargar la página.
- **Axios**: Cliente HTTP basado en promesas para realizar peticiones a la API del backend de forma sencilla y con manejo de errores mejorado.
- **Recharts**: Librería de gráficos componible construida con React y D3 para visualizar datos de manera interactiva. Utilizada para mostrar la evolución de las métricas biométricas.

#### **Backend (Servidor)**
- **Node.js**: Entorno de ejecución de JavaScript del lado del servidor. Proporciona un modelo de E/S sin bloqueo y orientado a eventos para aplicaciones en tiempo real.
- **Express**: Framework minimalista para Node.js que facilita la creación de APIs RESTful. Gestiona rutas, middleware y peticiones HTTP.
- **JWT (JSON Web Tokens)**: Mecanismo para la autenticación y autorización de usuarios mediante tokens codificados. Permite verificar la identidad del usuario en cada petición sin necesidad de consultar la base de datos.
- **Bcrypt**: Librería para el hash seguro de contraseñas. Protege las credenciales de los usuarios mediante algoritmos de encriptación robustos.
- **Zod**: Librería para la declaración y validación de esquemas en TypeScript/JavaScript. Utilizada para validar los datos de entrada en las rutas API.
- **Middleware de autenticación**: Implementado para proteger rutas API que requieren que el usuario esté autenticado.

#### **Base de Datos**
- **PostgreSQL**: Sistema de gestión de bases de datos relacional. Ofrece soporte para tipos de datos avanzados, transacciones ACID y consultas complejas.
- **Prisma**: ORM (Object-Relational Mapping) moderno que simplifica el acceso a la base de datos. Proporciona un esquema declarativo, migraciones automatizadas y un cliente tipado para consultas seguras.

#### **Servicios Externos**
- **Servicio de Correo Electrónico**: Integración con Nodemailer (configurado para Gmail) para el envío de planes de dieta por correo electrónico con plantillas HTML profesionales y adjuntos PDF.
- **Generador de PDF**: Implementación completa con PDFKit para la generación de documentos PDF profesionales con planes de dieta y entrenamiento, incluyendo diseño corporativo y layout responsive.

#### **Infraestructura**
- **Docker**: Plataforma para la creación, despliegue y ejecución de aplicaciones en contenedores. Garantiza la consistencia entre entornos de desarrollo y producción.
- **Render**: Servicio de alojamiento en la nube que facilita el despliegue de aplicaciones web y APIs. Proporciona escalabilidad automática y SSL gratuito.

#### **Herramientas de Desarrollo**
- **Vitest**: Framework de pruebas unitarias para JavaScript. Ofrece ejecución rápida y soporte nativo para TypeScript y ESM. Implementado con tests unitarios completos en backend y frontend.
- **Testing Library**: Para pruebas unitarias de componentes React, integrado con Vitest para testing del frontend.
- **Git/GitHub**: Sistema de control de versiones y plataforma para la colaboración en el desarrollo. Facilita el seguimiento de cambios y la integración continua.

### **2.3. Descripción de alto nivel del proyecto y estructura de ficheros**

El proyecto NutriTrack Pro sigue una arquitectura cliente-servidor claramente separada en dos componentes principales: frontend y backend. Esta estructura modular facilita el desarrollo, mantenimiento y escalabilidad del sistema.

#### **Estructura General del Proyecto**
```
nutritrack-pro/
├── frontend/          # Aplicación React
├── backend/           # API Node.js/Express
├── .gitignore
├── docker-compose.yml
└── README.md
```

#### **Estructura del Frontend (React con Tailwind)**
```
frontend/
├── public/
│   ├── favicon.ico
│   ├── index.html
│   └── assets/
│       └── images/
├── src/
│   ├── assets/        # Recursos estáticos
│   │   ├── icons/
│   │   └── styles/
│   ├── components/    # Componentes reutilizables
│   │   ├── common/    # Botones, inputs, etc.
│   │   ├── layout/    # Header, Footer, Sidebar
│   │   └── specific/  # Componentes específicos de ciertas páginas
│   ├── hooks/         # Custom hooks de React
│   ├── pages/         # Componentes de página
│   │   ├── auth/      # Login, registro
│   │   ├── dashboard/ # Dashboard principal
│   │   ├── patients/  # Gestión de pacientes
│   │   └── plans/     # Creación de dietas y entrenamientos
│   ├── services/      # Servicios para API, PDF, etc.
│   │   ├── api.js     # Cliente Axios configurado
│   │   ├── auth.js    # Servicio de autenticación
│   │   └── pdf.js     # Generación de PDFs
│   ├── store/         # Estado global (context o redux)
│   │   ├── actions/
│   │   ├── reducers/
│   │   └── index.js
│   ├── utils/         # Funciones de utilidad
│   ├── App.jsx        # Componente principal
│   ├── index.jsx      # Punto de entrada
│   └── routes.jsx     # Configuración de rutas
├── .env               # Variables de entorno
├── .eslintrc.js       # Configuración de linting
├── package.json
├── tailwind.config.js
└── vite.config.js     # Configuración de Vite
```

#### **Estructura del Backend (Node.js/Express con Prisma)**
```
backend/
├── src/
│   ├── api/           # Rutas y controladores API
│   │   ├── auth/      # Autenticación
│   │   │   ├── auth.controller.js
│   │   │   └── auth.routes.js
│   │   ├── users/     # Gestión de usuarios
│   │   ├── patients/  # Gestión de pacientes
│   │   ├── diets/     # Planes de dieta
│   │   ├── workouts/  # Planes de entrenamiento
│   │   └── index.js   # Agregador de rutas
│   ├── config/        # Configuraciones
│   │   ├── database.js
│   │   ├── email.js
│   │   └── index.js
│   ├── middleware/    # Middleware personalizado
│   │   ├── auth.js    # Middleware de autenticación
│   │   ├── error.js   # Manejo centralizado de errores
│   │   └── validation.js
│   ├── models/        # Definición de Prisma o modelos
│   │   ├── user.js
│   │   ├── patient.js
│   │   ├── diet.js
│   │   └── workout.js
│   ├── services/      # Lógica de negocio
│   │   ├── auth.service.js
│   │   ├── email.service.js
│   │   ├── pdf.service.js
│   │   └── whatsapp.service.js
│   ├── utils/         # Funciones de utilidad
│   │   ├── asyncHandler.js
│   │   └── validators.js
│   └── app.js         # Configuración de la aplicación
├── prisma/            # Configuración de Prisma ORM
│   ├── schema.prisma  # Esquema de la base de datos
│   └── migrations/    # Migraciones de base de datos
├── tests/             # Pruebas
│   ├── unit/
│   └── integration/
├── .env               # Variables de entorno
├── .eslintrc.js       # Configuración de linting
├── package.json
└── docker-compose.yml # Configuración específica del backend
```

#### **Patrones de Arquitectura**

Esta estructura sigue varios patrones de diseño y arquitectura:

1. **Arquitectura MVC (Modelo-Vista-Controlador)** en el backend, donde:
   - Modelo: Representado por los esquemas de Prisma y la lógica de acceso a datos
   - Vista: La API REST que sirve los datos
   - Controlador: Los controladores que manejan las solicitudes HTTP

2. **Arquitectura de Componentes** en el frontend, organizando la UI en componentes reutilizables y páginas, siguiendo los principios de React.

3. **Patrón de Servicios** tanto en frontend como backend, encapsulando la lógica de negocio en servicios especializados.

4. **Patrón de Repositorio** implícito en el uso de Prisma para abstraer la capa de acceso a datos.

Esta organización facilita:
- Separación clara de responsabilidades
- Código modular y reutilizable
- Escalabilidad para añadir nuevas características
- Mantenibilidad y legibilidad del código
- Trabajo en paralelo de diferentes desarrolladores

### **2.4. Infraestructura y despliegue**

> Detalla la infraestructura del proyecto, incluyendo un diagrama en el formato que creas conveniente, y explica el proceso de despliegue que se sigue

### **2.5. Seguridad**

> Enumera y describe las prácticas de seguridad principales que se han implementado en el proyecto, añadiendo ejemplos si procede

### **2.6. Tests**

En NutriTrack Pro se ha implementado una cobertura completa de tests unitarios tanto en el backend como en el frontend para asegurar la fiabilidad y mantenibilidad del código.

#### **Tests del Backend (Vitest)**
Se han implementado tests unitarios exhaustivos para:

- **Controladores de API**: 
  - `auth.controller.test.ts`: Tests de registro, login y autenticación
  - `patient.controller.test.ts`: Tests CRUD de pacientes y registros biométricos
  - `diet.controller.test.ts`: Tests de creación, actualización y eliminación de planes de dieta
  - `pdf.controller.test.ts`: Tests de generación de PDFs combinados
  - `emailPlan.controller.test.ts`: Tests de envío de emails con planes adjuntos

- **Servicios de Negocio**:
  - Servicios de autenticación con validación de tokens JWT
  - Servicios de gestión de pacientes con mocks de Prisma
  - Servicios de manejo de archivos PDF y emails

#### **Tests del Frontend (Vitest + Testing Library)**
Se han implementado tests unitarios para:

- **Páginas principales**:
  - `PatientDashboardPage.test.tsx`: Tests del dashboard principal con búsqueda
  - `PatientProfilePage.test.tsx`: Tests del perfil detallado del paciente
  - `PatientBiometricHistoryPage.test.tsx`: Tests de visualización de métricas
  - `NewPatientPage.test.tsx`: Tests del formulario de registro de pacientes
  - `EditDietPlanPage.test.tsx`: Tests de creación/edición de planes de dieta
  - `DietPlanDetailsPage.test.tsx`: Tests de visualización de planes de dieta

- **Componentes**: Tests de componentes React con mocks de APIs y verificación de renderizado e interacciones

#### **Cobertura de Tests**
- **Backend**: >85% de cobertura en controladores y servicios críticos
- **Frontend**: >80% de cobertura en páginas y componentes principales
- **Ejecución**: `npm test` en cada directorio ejecuta todos los tests unitarios

---

## 3. Modelo de Datos

### **3.1. Diagrama del modelo de datos:**

El siguiente diagrama ERD (Entity-Relationship Diagram) representa el modelo de datos para NutriTrack Pro, con todas las entidades, atributos, relaciones y cardinalidades.

```mermaid
erDiagram
    PROFESSIONAL ||--o{ PATIENT : manages
    PATIENT ||--o{ BIOMETRIC_RECORD : has
    PATIENT ||--o{ DIET_PLAN : has
    PATIENT ||--o{ WORKOUT_PLAN : has
    DIET_PLAN ||--o{ DIET_MEAL : contains
    WORKOUT_PLAN ||--o{ WORKOUT_DAY : contains
    WORKOUT_DAY ||--o{ EXERCISE : includes

    PROFESSIONAL {
        int id PK "Identificador único"
        string email UK "Email (único)"
        string password_hash "Contraseña encriptada"
        string first_name "Nombre"
        string last_name "Apellidos"
        string phone "Teléfono de contacto"
        string profession "nutricionista/entrenador"
        datetime created_at "Fecha de creación"
        datetime updated_at "Fecha de actualización"
    }

    PATIENT {
        int id PK "Identificador único"
        int professional_id FK "Relación con profesional"
        string email "Email de contacto"
        string first_name "Nombre"
        string last_name "Apellidos"
        string phone "Teléfono de contacto"
        date birth_date "Fecha de nacimiento"
        string gender "Género"
        float height "Altura en cm"
        string medical_notes "Notas médicas"
        string diet_restrictions "Restricciones alimentarias"
        string objectives "Objetivos del paciente"
        datetime created_at "Fecha de creación"
        datetime updated_at "Fecha de actualización"
    }

    BIOMETRIC_RECORD {
        int id PK "Identificador único"
        int patient_id FK "Relación con paciente"
        date record_date "Fecha de la medición"
        float weight "Peso en kg"
        float body_fat_percentage "% de grasa corporal"
        float muscle_percentage "% de masa muscular"
        float water_percentage "% de agua"
        float back_chest_diameter "Diámetro espalda/pecho en cm"
        float waist_diameter "Diámetro cintura en cm"
        float arms_diameter "Diámetro brazos en cm"
        float legs_diameter "Diámetro piernas en cm"
        float calves_diameter "Diámetro gemelos en cm"
        string notes "Observaciones adicionales"
        datetime created_at "Fecha de registro"
    }

    DIET_PLAN {
        int id PK "Identificador único"
        int professional_id FK "Profesional que crea el plan"
        int patient_id FK "Paciente asignado"
        string title "Título del plan"
        string description "Descripción general"
        date start_date "Fecha de inicio"
        date end_date "Fecha de finalización"
        string objectives "Objetivos específicos del plan"
        boolean is_active "Plan activo o histórico"
        string notes "Notas adicionales"
        datetime created_at "Fecha de creación"
        datetime updated_at "Fecha de actualización"
    }

    DIET_MEAL {
        int id PK "Identificador único"
        int diet_plan_id FK "Relación con plan de dieta"
        string meal_type "desayuno/media_mañana/almuerzo/merienda/cena/resopón"
        string content "Contenido detallado de la comida"
        datetime created_at "Fecha de creación"
        datetime updated_at "Fecha de actualización"
    }

    WORKOUT_PLAN {
        int id PK "Identificador único"
        int professional_id FK "Profesional que crea el plan"
        int patient_id FK "Paciente asignado"
        string title "Título del plan"
        string description "Descripción general"
        date start_date "Fecha de inicio"
        date end_date "Fecha de finalización"
        string objectives "Objetivos específicos del plan"
        boolean is_active "Plan activo o histórico"
        string notes "Notas adicionales"
        datetime created_at "Fecha de creación"
        datetime updated_at "Fecha de actualización"
    }

    WORKOUT_DAY {
        int id PK "Identificador único"
        int workout_plan_id FK "Relación con plan de entrenamiento"
        string day_of_week "lunes/martes/miércoles/jueves/viernes/sábado/domingo"
        string description "Instrucciones generales del día"
        datetime created_at "Fecha de creación"
        datetime updated_at "Fecha de actualización"
    }

    EXERCISE {
        int id PK "Identificador único"
        int workout_day_id FK "Relación con día de entrenamiento"
        string name "Nombre del ejercicio"
        string sets_reps "Series y repeticiones (ej: 4x12)"
        string observations "Observaciones específicas"
        int display_order "Orden de visualización"
        datetime created_at "Fecha de creación"
        datetime updated_at "Fecha de actualización"
    }
```

### **3.2. Descripción de entidades principales:**

#### PROFESSIONAL
Almacena la información de los nutricionistas y entrenadores deportivos que utilizan el sistema.

| Campo | Tipo | Descripción | Restricciones |
|-------|------|-------------|---------------|
| id | int | Identificador único | PK, auto-increment, not null |
| email | string | Correo electrónico del profesional | UK, not null |
| password_hash | string | Hash de la contraseña (bcrypt) | not null |
| first_name | string | Nombre del profesional | not null |
| last_name | string | Apellidos del profesional | not null |
| phone | string | Número de teléfono | - |
| profession | string | Tipo de profesional (nutricionista/entrenador) | not null |
| created_at | datetime | Fecha y hora de creación del registro | not null |
| updated_at | datetime | Fecha y hora de última actualización | not null |

**Relaciones:**
- Un profesional puede tener muchos pacientes (1:N con PATIENT)

**Índices:**
- Primary Key: `id`
- Unique Key: `email`
- Index: `created_at` (para ordenación)

#### PATIENT
Almacena la información de los pacientes gestionados por los profesionales.

| Campo | Tipo | Descripción | Restricciones |
|-------|------|-------------|---------------|
| id | int | Identificador único | PK, auto-increment, not null |
| professional_id | int | ID del profesional que gestiona al paciente | FK (PROFESSIONAL.id), not null |
| email | string | Correo electrónico del paciente | - |
| first_name | string | Nombre del paciente | not null |
| last_name | string | Apellidos del paciente | not null |
| phone | string | Número de teléfono | - |
| birth_date | date | Fecha de nacimiento | - |
| gender | string | Género del paciente | - |
| height | float | Altura en centímetros | - |
| medical_notes | string | Notas médicas relevantes | - |
| diet_restrictions | string | Restricciones alimentarias | - |
| objectives | string | Objetivos del paciente | - |
| created_at | datetime | Fecha y hora de creación del registro | not null |
| updated_at | datetime | Fecha y hora de última actualización | not null |

**Relaciones:**
- Un paciente pertenece a un profesional (N:1 con PROFESSIONAL)
- Un paciente puede tener muchos registros biométricos (1:N con BIOMETRIC_RECORD)
- Un paciente puede tener muchos planes de dieta (1:N con DIET_PLAN)
- Un paciente puede tener muchos planes de entrenamiento (1:N con WORKOUT_PLAN)

**Índices:**
- Primary Key: `id`
- Foreign Key: `professional_id`
- Index: `first_name`, `last_name` (para búsquedas)
- Index: `email` (para búsquedas)
- Index: `created_at` (para ordenación)

#### BIOMETRIC_RECORD
Registra las medidas biométricas de los pacientes a lo largo del tiempo.

| Campo | Tipo | Descripción | Restricciones |
|-------|------|-------------|---------------|
| id | int | Identificador único | PK, auto-increment, not null |
| patient_id | int | ID del paciente al que pertenece el registro | FK (PATIENT.id), not null |
| record_date | date | Fecha de la medición | not null |
| weight | float | Peso en kilogramos | - |
| body_fat_percentage | float | Porcentaje de grasa corporal | - |
| muscle_percentage | float | Porcentaje de masa muscular | - |
| water_percentage | float | Porcentaje de agua | - |
| back_chest_diameter | float | Diámetro espalda/pecho en centímetros | - |
| waist_diameter | float | Diámetro cintura en centímetros | - |
| arms_diameter | float | Diámetro brazos en centímetros | - |
| legs_diameter | float | Diámetro piernas en centímetros | - |
| calves_diameter | float | Diámetro gemelos en centímetros | - |
| notes | string | Observaciones adicionales | - |
| created_at | datetime | Fecha y hora de creación del registro | not null |

**Relaciones:**
- Un registro biométrico pertenece a un paciente (N:1 con PATIENT)

**Índices:**
- Primary Key: `id`
- Foreign Key: `patient_id`
- Index: `record_date` (para ordenación y filtrado)
- Index Compuesto: `(patient_id, record_date)` (para consultas de evolución)

#### DIET_PLAN
Almacena los planes de dieta creados por los profesionales para sus pacientes.

| Campo | Tipo | Descripción | Restricciones |
|-------|------|-------------|---------------|
| id | int | Identificador único | PK, auto-increment, not null |
| professional_id | int | ID del profesional que creó el plan | FK (PROFESSIONAL.id), not null |
| patient_id | int | ID del paciente al que está asignado el plan | FK (PATIENT.id), not null |
| title | string | Título del plan de dieta | not null |
| description | string | Descripción general del plan | - |
| start_date | date | Fecha de inicio del plan | - |
| end_date | date | Fecha de finalización del plan | - |
| objectives | string | Objetivos específicos del plan | - |
| is_active | boolean | Indica si el plan está activo o es histórico | not null, default: true |
| notes | string | Notas adicionales | - |
| created_at | datetime | Fecha y hora de creación del registro | not null |
| updated_at | datetime | Fecha y hora de última actualización | not null |

**Relaciones:**
- Un plan de dieta pertenece a un paciente (N:1 con PATIENT)
- Un plan de dieta es creado por un profesional (N:1 con PROFESSIONAL)
- Un plan de dieta contiene muchas comidas (1:N con DIET_MEAL)

**Índices:**
- Primary Key: `id`
- Foreign Key: `professional_id`, `patient_id`
- Index: `is_active` (para filtrar planes activos)
- Index: `start_date`, `end_date` (para búsquedas por fecha)
- Index Compuesto: `(patient_id, is_active)` (para buscar planes activos de un paciente)

#### DIET_MEAL
Representa una comida específica dentro de un plan de dieta.

| Campo | Tipo | Descripción | Restricciones |
|-------|------|-------------|---------------|
| id | int | Identificador único | PK, auto-increment, not null |
| diet_plan_id | int | ID del plan de dieta al que pertenece | FK (DIET_PLAN.id), not null |
| meal_type | string | Tipo de comida (desayuno, almuerzo, etc.) | not null |
| content | string | Contenido detallado de la comida | not null |
| created_at | datetime | Fecha y hora de creación del registro | not null |
| updated_at | datetime | Fecha y hora de última actualización | not null |

**Relaciones:**
- Una comida pertenece a un plan de dieta (N:1 con DIET_PLAN)

**Índices:**
- Primary Key: `id`
- Foreign Key: `diet_plan_id`
- Index: `meal_type` (para filtrar por tipo de comida)

#### WORKOUT_PLAN
Almacena los planes de entrenamiento creados por los profesionales para sus pacientes.

| Campo | Tipo | Descripción | Restricciones |
|-------|------|-------------|---------------|
| id | int | Identificador único | PK, auto-increment, not null |
| professional_id | int | ID del profesional que creó el plan | FK (PROFESSIONAL.id), not null |
| patient_id | int | ID del paciente al que está asignado el plan | FK (PATIENT.id), not null |
| title | string | Título del plan de entrenamiento | not null |
| description | string | Descripción general del plan | - |
| start_date | date | Fecha de inicio del plan | - |
| end_date | date | Fecha de finalización del plan | - |
| objectives | string | Objetivos específicos del plan | - |
| is_active | boolean | Indica si el plan está activo o es histórico | not null, default: true |
| notes | string | Notas adicionales | - |
| created_at | datetime | Fecha y hora de creación del registro | not null |
| updated_at | datetime | Fecha y hora de última actualización | not null |

**Relaciones:**
- Un plan de entrenamiento pertenece a un paciente (N:1 con PATIENT)
- Un plan de entrenamiento es creado por un profesional (N:1 con PROFESSIONAL)
- Un plan de entrenamiento contiene muchos días (1:N con WORKOUT_DAY)

**Índices:**
- Primary Key: `id`
- Foreign Key: `professional_id`, `patient_id`
- Index: `is_active` (para filtrar planes activos)
- Index: `start_date`, `end_date` (para búsquedas por fecha)
- Index Compuesto: `(patient_id, is_active)` (para buscar planes activos de un paciente)

#### WORKOUT_DAY
Representa un día específico dentro de un plan de entrenamiento.

| Campo | Tipo | Descripción | Restricciones |
|-------|------|-------------|---------------|
| id | int | Identificador único | PK, auto-increment, not null |
| workout_plan_id | int | ID del plan de entrenamiento al que pertenece | FK (WORKOUT_PLAN.id), not null |
| day_of_week | string | Día de la semana (lunes, martes, etc.) | not null |
| description | string | Instrucciones generales para el día | - |
| created_at | datetime | Fecha y hora de creación del registro | not null |
| updated_at | datetime | Fecha y hora de última actualización | not null |

**Relaciones:**
- Un día de entrenamiento pertenece a un plan de entrenamiento (N:1 con WORKOUT_PLAN)
- Un día de entrenamiento incluye muchos ejercicios (1:N con EXERCISE)

**Índices:**
- Primary Key: `id`
- Foreign Key: `workout_plan_id`
- Index: `day_of_week` (para filtrar por día de la semana)

#### EXERCISE
Representa un ejercicio específico dentro de un día de entrenamiento.

| Campo | Tipo | Descripción | Restricciones |
|-------|------|-------------|---------------|
| id | int | Identificador único | PK, auto-increment, not null |
| workout_day_id | int | ID del día al que pertenece el ejercicio | FK (WORKOUT_DAY.id), not null |
| name | string | Nombre del ejercicio | not null |
| sets_reps | string | Series y repeticiones (ej: "4x12") | not null |
| observations | string | Observaciones específicas (ej: "adapta el peso") | - |
| display_order | int | Orden de visualización del ejercicio | not null, default: 0 |
| created_at | datetime | Fecha y hora de creación del registro | not null |
| updated_at | datetime | Fecha y hora de última actualización | not null |

**Relaciones:**
- Un ejercicio pertenece a un día de entrenamiento (N:1 con WORKOUT_DAY)

**Índices:**
- Primary Key: `id`
- Foreign Key: `workout_day_id`
- Index: `name` (para búsquedas por nombre de ejercicio)
- Index: `display_order` (para ordenación)

---

## 4. Especificación de la API

La especificación completa de la API en formato OpenAPI 3.0 se mantiene en el siguiente archivo. Esta especificación se ha ido actualizando a medida que se han desarrollado nuevos endpoints para funcionalidades como el registro, login, gestión de pacientes y registros biométricos:

[Ver Especificación OpenAPI](./docs/api/openapi_spec.yaml)

### **4.1. Colección de Postman**

Para facilitar las pruebas manuales de los endpoints de la API, puedes importar la siguiente colección de Postman:

[Descargar Colección de Postman](./docs/api/NutriTrack%20Pro.postman_collection.json)

Esta colección incluye ejemplos de las peticiones para los endpoints de autenticación, gestión de pacientes y registros biométricos implementados.

---

## 5. Historias de Usuario

Las historias de usuario que guían el desarrollo del proyecto se encuentran detalladas en el siguiente documento. Se han abordado varias historias clave relacionadas con la autenticación y la gestión de pacientes, incluyendo la visualización de su historial biométrico:

[Ver Historias de Usuario](./docs/user_stories.md)

---

## 6. Tickets de Trabajo

Los tickets de trabajo han sido completados exitosamente para el MVP. A continuación puedes encontrar tanto la documentación original de planificación como el estado final de implementación:

### Estado Final de Implementación ✅
[Ver Estado Final - Backend](./docs/tickets/tickets_status_backend.md)
[Ver Estado Final - Frontend](./docs/tickets/tickets_status_frontend.md)

### Documentación Original de Planificación
[Ver Tickets Originales Backend](./docs/tickets/tickets_backend.md)
[Ver Tickets Originales Frontend](./docs/tickets/tickets_frontend.md)

### Resumen Ejecutivo del MVP
- **Backend**: ✅ 9/10 tickets principales completados (90% implementado)
- **Frontend**: ✅ 11/11 tickets principales completados (100% implementado)
- **Tests**: ✅ Cobertura >80% en ambos proyectos
- **Estado general**: 🎯 **MVP COMPLETADO Y FUNCIONAL**

---

### **Estado Final del MVP - Funcionalidades Implementadas ✅**

El MVP de NutriTrack Pro ha sido completado exitosamente con todas las funcionalidades críticas implementadas y funcionando en producción.

#### **🎯 Objetivos del MVP Alcanzados**

**✅ Funcionalidades Core Implementadas:**
- Sistema completo de autenticación para profesionales
- CRUD completo de pacientes con búsqueda avanzada
- Registro y visualización de métricas biométricas con gráficos interactivos
- Creación completa de planes de dieta organizados por días/comidas
- Generación profesional de PDFs con diseño corporativo
- Envío automático por email con plantillas HTML responsive

**✅ Calidad Técnica Lograda:**
- Arquitectura escalable y modular implementada
- Base de datos optimizada con Prisma ORM
- API REST completa con documentación OpenAPI
- Tests unitarios con >80% de cobertura en frontend y backend
- Código mantenible con TypeScript y mejores prácticas
- Diseño responsive para móviles, tablets y desktop

#### **📊 Métricas del Proyecto Completado**

- **Tiempo de desarrollo:** ~30 horas (según objetivo inicial)
- **Funcionalidades "Must Have":** 100% implementadas
- **Funcionalidades "Should Have":** 90% implementadas  
- **Tests de calidad:** 85% cobertura backend, 80% frontend
- **Estado del proyecto:** 🚀 **DESPLEGADO Y FUNCIONAL**

#### **🔗 Enlaces de Demostración**
- **Web en producción:** [nutritrack-pro.netlify.app](https://nutritrack-pro.netlify.app/)
- **Repositorio GitHub:** [github.com/ajbarrios/finalproject-AJBL](https://github.com/ajbarrios/finalproject-AJBL)
- **Demo en video:** [Ver Demo del Proyecto](./docs/demo/NutriTrack-Pro-entrega2-demo.webm)

## 7. Pull requests

> Documenta 3 de las Pull Requests realizadas durante la ejecución del proyecto
Todas las pull request cerradas del proyecto estan [aqui](https://github.com/ajbarrios/finalproject-AJBL/pulls?q=is%3Apr+is%3Aclosed)

**Pull Request 1**

[Pull request documentación técnica](https://github.com/ajbarrios/finalproject-AJBL/pull/1)

**Pull Request 2**

[Pull request dashboard pacientes ](https://github.com/ajbarrios/finalproject-AJBL/pull/20)

**Pull Request 3**

[Pull request registro medidas biométricas](https://github.com/ajbarrios/finalproject-AJBL/pull/34)