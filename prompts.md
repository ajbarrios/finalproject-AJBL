> Detalla en esta sección los prompts principales utilizados durante la creación del proyecto, que justifiquen el uso de asistentes de código en todas las fases del ciclo de vida del desarrollo. Esperamos un máximo de 3 por sección, principalmente los de creación inicial o  los de corrección o adición de funcionalidades que consideres más relevantes.
Puedes añadir adicionalmente la conversación completa como link o archivo adjunto si así lo consideras


## Índice

1. [Descripción general del producto](#1-descripción-general-del-producto)
2. [Arquitectura del sistema](#2-arquitectura-del-sistema)
3. [Modelo de datos](#3-modelo-de-datos)
4. [Especificación de la API](#4-especificación-de-la-api)
5. [Historias de usuario](#5-historias-de-usuario)
6. [Tickets de trabajo](#6-tickets-de-trabajo)
7. [Pull requests](#7-pull-requests)

---

## 1. Descripción general del producto

**Prompt 1:**
"Eres un project manager experto. Tengo en mente un MVP para el seguimiento nutricional y de entranamiento de pacientes para nutricionistas y entrenadores deportivos. El proyecto se llama NutriTrack Pro. Debo de construirlo con ayuda de la IA en 30 horas. ¿Puedes darme ideas?"

**Prompt 2:**
"Complementa la seccion "Descripción general del producto" del @readme.md."

**Prompt 3:**
"Vamos a afinar las funcionalidades del sistema:
- Registro y login de nutricionistas y/o entrenadores.
- Registro de pacientes con sus datos personales, biometricos y objetivos de la dieta o del plan de entrenamiento.
- Dashboard principal de pacientes con busqueda de pacientes.
- Vista detalle de paciente con su evolución física mediante gráficas: porcentaje de grasa, porcentaje muscular, peso etc.
- Dashboard para la generación de dietas y entrenamientos para pacientes.
- Creación de la dieta mensual y el entrenamiento en formato pdf.
- Envío de la dieta y el entrenamiento mediante correo electrónico o Whatsapp mediante una plantilla."

---

## 2. Arquitectura del Sistema

### **2.1. Diagrama de arquitectura:**

**Prompt 1:**
"Tengo dudas para elegir el stack tecnologico. He pensado en React en el frontend con Tailwind y NodeJS con Express en el backend, con Posgress como base de datos. Ayudame a elegir todas las tecnologias para complimentar la arquitectura del sistema."

**Prompt 2:**
"Actua como un arquitecto software profesional. Tienes que elaborar un diagrama mermaid C4 para representar la arquitectura del sistema. Ten en cuenta lo siguiente:
- Explica si sigue algún patrón predefinido, justifica por qué se ha elegido esta arquitectura, y destaca los beneficios principales que aportan al proyecto y justifican su uso, así como sacrificios o déficits que implica."

**Prompt 3:**

### **2.2. Descripción de componentes principales:**

**Prompt 1:**
"Actua como un arquitecto software profesional. Explica de forma muy clara y concisa los componentes principales tanto backend como frontend del sistema. Lee el @readme elaborado hasta ahora por si tienes alguna duda y pregunta lo que necesites."

**Prompt 2:**

**Prompt 3:**

### **2.3. Descripción de alto nivel del proyecto y estructura de ficheros**

**Prompt 1:**
"Ahora propon una estructura de ficheros. Mi idea es tener una carpeta denominada 'frontend' y 'backend'. Dentro de estas propon una estructura de ficheros que se rija por buenas practicas y patrones estandard en ambos stacks."

**Prompt 2:**

**Prompt 3:**

### **2.4. Infraestructura y despliegue**

**Prompt 1:**

**Prompt 2:**

**Prompt 3:**

### **2.5. Seguridad**

**Prompt 1:**

**Prompt 2:**

**Prompt 3:**

### **2.6. Tests**

**Prompt 1:**

**Prompt 2:**

**Prompt 3:**

---

### 3. Modelo de Datos

**Prompt 1:**
"Actua como un experto en diseño de bases de datos. Lee el @readme.md y el documento PRD @prd.md y propon un diagrama ERD. Pregunta lo que necesites."

**Prompt 2:**
"Modifica el ERD teniendo en cuenta lo siguiente:
- Las dietas estan compuestas por diferentes comidas: desayuno, media mañana, almuerzo, merienda, cena y resopon. Dentro de cada comida, en una caja de texto tipo textarea el usuario pondra lo que debe de tomar el paciente.
- Lo mismo ocurre con las sesiones de entrenamiento. Estan divididas por dias de lunes a domingo. En cada día, el usuario añadirá una fila con un tipo de ejercicio, repeticiones, observaciones. Por ejemplo: press banca, 4*12 repeticiones, adapta el peso."

**Prompt 3:**
"El codigo Mermaid del diagrama ERD tiene errores de sintaxis al importarlos en Mermaid Live. Por favor, corrígelos".
---

### 4. Especificación de la API

**Prompt 1:**

**Prompt 2:**

**Prompt 3:**

---

### 5. Historias de Usuario

**Prompt 1:**

**Prompt 2:**

**Prompt 3:**

---

### 6. Tickets de Trabajo

**Prompt 1:**

**Prompt 2:**

**Prompt 3:**

---

### 7. Pull Requests

**Prompt 1:**

**Prompt 2:**

**Prompt 3:**