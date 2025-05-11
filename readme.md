## Índice

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

### **0.4. URL del proyecto:**
> Puede ser pública o privada, en cuyo caso deberás compartir los accesos de manera segura. Puedes enviarlos a [alvaro@lidr.co](mailto:alvaro@lidr.co) usando algún servicio como [onetimesecret](https://onetimesecret.com/).

### 0.5. URL o archivo comprimido del repositorio
[Github NutriTrack Pro](https://github.com/ajbarrios/finalproject-AJBL)

> Puedes tenerlo alojado en público o en privado, en cuyo caso deberás compartir los accesos de manera segura. Puedes enviarlos a [alvaro@lidr.co](mailto:alvaro@lidr.co) usando algún servicio como [onetimesecret](https://onetimesecret.com/). También puedes compartir por correo un archivo zip con el contenido


---

## 1. Descripción general del producto

> Describe en detalle los siguientes aspectos del producto:

### **1.1. Objetivo:**

El objetivo de NutriTrack Pro es proporcionar a nutricionistas y entrenadores deportivos una herramienta eficaz para el seguimiento nutricional y de entrenamiento de sus pacientes. El producto busca facilitar la personalización de planes de dieta y ejercicio, así como el monitoreo del progreso de los pacientes, mejorando así la comunicación y la eficiencia en el manejo de la salud y el bienestar.

### **1.2. Características y funcionalidades principales:**

- **Registro y Login:** Permite a nutricionistas y entrenadores registrarse y acceder al sistema de manera segura.
- **Gestión de Pacientes:** Registro de pacientes con datos personales, biométricos y objetivos específicos de dieta o entrenamiento.
- **Dashboard de Pacientes:** Un panel principal que permite la búsqueda y gestión de pacientes de manera eficiente.
- **Vista Detalle de Paciente:** Muestra la evolución física del paciente mediante gráficas detalladas de porcentaje de grasa, porcentaje muscular, peso, etc.
- **Generación de Dietas y Entrenamientos:** Dashboard dedicado para crear y personalizar dietas y planes de entrenamiento para cada paciente.
- **Creación de Documentos PDF:** Generación de dietas mensuales y planes de entrenamiento en formato PDF para facilitar su distribución.
- **Envío de Información:** Envío de dietas y entrenamientos a través de correo electrónico o WhatsApp utilizando plantillas predefinidas para una comunicación efectiva.

### **1.3. Diseño y experiencia de usuario:**

NutriTrack Pro cuenta con un diseño minimalista, fresco y moderno, que se adapta de manera responsiva a diferentes dispositivos como móviles, tablets y ordenadores. La interfaz está diseñada para ser intuitiva y fácil de usar, permitiendo a los nutricionistas y entrenadores navegar y utilizar todas las funcionalidades de manera eficiente y sin complicaciones.

### **1.4. Instrucciones de instalación:**
> Documenta de manera precisa las instrucciones para instalar y poner en marcha el proyecto en local (librerías, backend, frontend, servidor, base de datos, migraciones y semillas de datos, etc.)

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

#### **Backend (Servidor)**
- **Node.js**: Entorno de ejecución de JavaScript del lado del servidor. Proporciona un modelo de E/S sin bloqueo y orientado a eventos para aplicaciones en tiempo real.
- **Express**: Framework minimalista para Node.js que facilita la creación de APIs RESTful. Gestiona rutas, middleware y peticiones HTTP.
- **JWT (JSON Web Tokens)**: Mecanismo para la autenticación y autorización de usuarios mediante tokens codificados. Permite verificar la identidad del usuario en cada petición sin necesidad de consultar la base de datos.
- **Bcrypt**: Librería para el hash seguro de contraseñas. Protege las credenciales de los usuarios mediante algoritmos de encriptación robustos.

#### **Base de Datos**
- **PostgreSQL**: Sistema de gestión de bases de datos relacional. Ofrece soporte para tipos de datos avanzados, transacciones ACID y consultas complejas.
- **Prisma**: ORM (Object-Relational Mapping) moderno que simplifica el acceso a la base de datos. Proporciona un esquema declarativo, migraciones automatizadas y un cliente tipado para consultas seguras.

#### **Servicios Externos**
- **Servicio de Correo Electrónico**: Integración con servicios como SendGrid o Nodemailer para el envío de dietas y planes de entrenamiento por correo electrónico.
- **WhatsApp API**: Integración con la API de WhatsApp Business para el envío de notificaciones y documentos a los pacientes.
- **Generador de PDF**: Utilización de bibliotecas como PDFKit o jsPDF para la generación de documentos PDF con dietas y planes de entrenamiento.

#### **Infraestructura**
- **Docker**: Plataforma para la creación, despliegue y ejecución de aplicaciones en contenedores. Garantiza la consistencia entre entornos de desarrollo y producción.
- **Render**: Servicio de alojamiento en la nube que facilita el despliegue de aplicaciones web y APIs. Proporciona escalabilidad automática y SSL gratuito.

#### **Herramientas de Desarrollo**
- **Vitest**: Framework de pruebas unitarias para JavaScript. Ofrece ejecución rápida y soporte nativo para TypeScript y ESM.
- **Cypress**: Herramienta de pruebas end-to-end. Permite automatizar la interacción con la aplicación en un navegador real.
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

> Describe brevemente algunos de los tests realizados

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

> Si tu backend se comunica a través de API, describe los endpoints principales (máximo 3) en formato OpenAPI. Opcionalmente puedes añadir un ejemplo de petición y de respuesta para mayor claridad

---

## 5. Historias de Usuario

> Documenta 3 de las historias de usuario principales utilizadas durante el desarrollo, teniendo en cuenta las buenas prácticas de producto al respecto.

**Historia de Usuario 1**

**Historia de Usuario 2**

**Historia de Usuario 3**

---

## 6. Tickets de Trabajo

> Documenta 3 de los tickets de trabajo principales del desarrollo, uno de backend, uno de frontend, y uno de bases de datos. Da todo el detalle requerido para desarrollar la tarea de inicio a fin teniendo en cuenta las buenas prácticas al respecto. 

**Ticket 1**

**Ticket 2**

**Ticket 3**

---

## 7. Pull Requests

> Documenta 3 de las Pull Requests realizadas durante la ejecución del proyecto

**Pull Request 1**

**Pull Request 2**

**Pull Request 3**
