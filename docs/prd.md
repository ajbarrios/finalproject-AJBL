# Documento de Requisitos del Producto - NutriTrack Pro

## 1. Visión general del producto

### 1.1 Propósito
NutriTrack Pro es una aplicación web diseñada para profesionales de la nutrición y entrenadores deportivos que necesitan una herramienta eficaz para el seguimiento nutricional y de entrenamiento de sus pacientes o clientes. El sistema facilitará la gestión de pacientes, la creación personalizada de planes de dieta y ejercicio, el seguimiento de métricas corporales, y la comunicación efectiva mediante la generación y envío de documentos.

### 1.2 Usuarios objetivo
- **Nutricionistas**: Profesionales que necesitan crear y gestionar planes de alimentación personalizados.
- **Entrenadores personales**: Profesionales que diseñan rutinas de entrenamiento específicas.

### 1.3 Alcance del MVP
Este documento describe los requisitos para el MVP (Producto Mínimo Viable) de NutriTrack Pro, que se desarrollará en aproximadamente 30 horas con ayuda de tecnologías de IA. El MVP servirá como base para validar el concepto con usuarios reales antes de implementar funcionalidades adicionales.

## 2. Descripción del producto

### 2.1 Características y funcionalidades (Matriz MoSCoW)

#### Must Have (Debe tener)
- Registro y autenticación de profesionales (nutricionistas/entrenadores)
- Creación y gestión de perfiles de pacientes con datos básicos
- Registro de medidas biométricas iniciales (peso, porcentaje de grasa, etc.)
- Dashboard principal con listado y búsqueda de pacientes
- Visualización del perfil detallado de cada paciente
- Creación básica de planes de dieta
- Generación de documentos PDF con planes de dieta y entrenamiento
- Envío de planes por correo electrónico

#### Should Have (Debería tener)
- Visualización de la evolución del paciente mediante gráficos básicos
- Plantillas predefinidas para planes de dieta y entrenamiento
- Registro y seguimiento de medidas biométricas periódicas
- Dashboard para la generación y edición de planes de entrenamiento
- Envío de planes por WhatsApp

#### Could Have (Podría tener)
- Personalización de plantillas de PDF
- Recordatorios automáticos para actualizaciones de métricas
- Biblioteca básica de alimentos y ejercicios
- Notas de seguimiento para cada paciente
- Cálculo automático de necesidades calóricas y macronutrientes

#### Won't Have (No tendrá por ahora)
- Aplicación móvil nativa (solo web responsive)
- Integración con dispositivos de seguimiento (smartwatches, básculas inteligentes)
- Funcionalidades de pago/suscripción
- Comunicación en tiempo real (chat)
- Análisis avanzado de datos o recomendaciones automatizadas

### 2.2 Métricas de éxito
El éxito del MVP se medirá a través de:
- Feedback cualitativo de un grupo selecto de nutricionistas y entrenadores personales
- Tasa de adopción y uso continuo durante el periodo de prueba
- Número de pacientes gestionados a través de la plataforma
- Número de planes generados y enviados
- Usabilidad percibida por los profesionales

## 3. Requisitos funcionales

### 3.1 Gestión de usuarios profesionales
- **RF1.1**: El sistema permitirá a los profesionales registrarse con su nombre completo, email, contraseña y profesión.
- **RF1.2**: El sistema permitirá a los profesionales iniciar sesión mediante email y contraseña.
- **RF1.3**: El sistema permitirá a los profesionales cerrar sesión.
- **RF1.4**: El sistema permitirá a los profesionales recuperar su contraseña mediante email.

### 3.2 Gestión de pacientes
- **RF2.1**: El sistema permitirá a los profesionales registrar nuevos pacientes con información personal básica.
- **RF2.2**: El sistema permitirá a los profesionales actualizar la información de sus pacientes.
- **RF2.3**: El sistema permitirá a los profesionales buscar pacientes por nombre o algún criterio específico.
- **RF2.4**: El sistema permitirá a los profesionales registrar medidas biométricas de sus pacientes.
- **RF2.5**: El sistema permitirá a los profesionales establecer objetivos para cada paciente.

### 3.3 Seguimiento de métricas
- **RF3.1**: El sistema permitirá a los profesionales registrar y actualizar múltiples medidas biométricas (peso, porcentaje de grasa, porcentaje muscular, etc.).
- **RF3.2**: El sistema permitirá visualizar la evolución de las métricas a través de gráficos.
- **RF3.3**: El sistema permitirá establecer fechas de medición para el seguimiento periódico.

### 3.4 Creación de planes
- **RF4.1**: El sistema permitirá a los profesionales crear planes de dieta personalizados para sus pacientes.
- **RF4.2**: El sistema permitirá a los profesionales crear planes de entrenamiento personalizados para sus pacientes.
- **RF4.3**: El sistema permitirá a los profesionales editar planes existentes.
- **RF4.4**: El sistema permitirá a los profesionales organizar planes por días de la semana.

### 3.5 Generación y envío de documentos
- **RF5.1**: El sistema permitirá generar documentos PDF a partir de los planes de dieta.
- **RF5.2**: El sistema permitirá generar documentos PDF a partir de los planes de entrenamiento.
- **RF5.3**: El sistema permitirá enviar los documentos PDF por correo electrónico.
- **RF5.4**: El sistema permitirá enviar los documentos PDF por WhatsApp.

## 4. Requisitos no funcionales

### 4.1 Usabilidad
- **RNF1.1**: La interfaz de usuario será intuitiva y fácil de usar, con un diseño minimalista y moderno.
- **RNF1.2**: La aplicación será completamente responsive y se adaptará perfectamente a diferentes dispositivos (tablets, portátiles y pantallas de escritorio), manteniendo la coherencia visual y funcional en todas las resoluciones.
- **RNF1.3**: Los tiempos de aprendizaje para un usuario nuevo no deben superar los 30 minutos.
- **RNF1.4**: La navegación entre las diferentes secciones será intuitiva y consistente en todas las pantallas.

### 4.2 Experiencia de Usuario (UX) y Diseño de Interfaz (UI)
- **RNF1.5**: La aplicación seguirá un diseño minimalista, fresco y moderno, utilizando una paleta de colores relacionada con la salud y el bienestar.
- **RNF1.6**: Se implementarán elementos visuales consistentes (botones, tarjetas, formularios) en toda la aplicación.
- **RNF1.7**: El diseño responsive priorizará la visualización óptima de la información más relevante en cada tipo de dispositivo:
  - **Tablets**: Optimización para interacción táctil con elementos de tamaño adecuado.
  - **Portátiles**: Aprovechamiento del espacio horizontal para mostrar más información simultáneamente.
  - **Pantallas de escritorio**: Visualización completa de dashboards con múltiples secciones visibles simultáneamente.
- **RNF1.8**: Se implementarán transiciones y animaciones sutiles para mejorar la experiencia de usuario sin afectar al rendimiento.
- **RNF1.9**: Los gráficos de evolución de pacientes serán claros y legibles en todos los dispositivos, adaptando su tamaño y nivel de detalle según la resolución disponible.

### 4.3 Rendimiento
- **RNF2.1**: Los tiempos de respuesta para operaciones habituales no deben superar los 2 segundos.
- **RNF2.2**: La generación de documentos PDF no debe tardar más de 5 segundos.
- **RNF2.3**: El sistema debe poder manejar hasta 50 usuarios concurrentes en el MVP.

### 4.4 Seguridad
- **RNF3.1**: Los datos personales de los pacientes estarán protegidos según normativas de protección de datos.
- **RNF3.2**: Las contraseñas se almacenarán encriptadas.
- **RNF3.3**: Las comunicaciones cliente-servidor estarán protegidas mediante HTTPS.

### 4.5 Disponibilidad
- **RNF4.1**: El sistema estará disponible al menos el 99% del tiempo durante el horario laboral.
- **RNF4.2**: Se realizarán copias de seguridad diarias de la base de datos.

## 5. Arquitectura técnica

### 5.1 Stack tecnológico
- **Frontend**: React con Tailwind CSS
- **Backend**: Node.js con Express
- **Base de datos**: PostgreSQL con Prisma como ORM
- **Infraestructura**: Docker, Render para despliegue
- **Servicios externos**: API de correo electrónico, API de WhatsApp Business

### 5.2 Descripción de componentes
El sistema sigue una arquitectura monolítica modular con separación clara entre frontend y backend. Para más detalles sobre los componentes, consultar la sección 2.2 del archivo README.md.

## 6. Flujos de usuario

### 6.1 Registro y gestión de pacientes
1. El profesional inicia sesión en la plataforma
2. Accede al dashboard principal
3. Selecciona "Añadir nuevo paciente"
4. Completa el formulario con los datos personales y biométricos iniciales
5. Establece objetivos iniciales para el paciente
6. Guarda la información

### 6.2 Creación y envío de un plan de dieta
1. El profesional inicia sesión en la plataforma
2. Busca al paciente en el dashboard
3. Selecciona el perfil del paciente
4. Accede a la sección "Planes de dieta"
5. Crea un nuevo plan con su título y descripción
6. Añade las comidas organizadas por días
7. Guarda el plan
8. Genera el documento PDF
9. Envía el documento por correo electrónico o WhatsApp

### 6.3 Seguimiento de la evolución
1. El profesional inicia sesión en la plataforma
2. Busca al paciente en el dashboard
3. Selecciona el perfil del paciente
4. Accede a la sección "Evolución"
5. Registra nuevas medidas biométricas
6. Visualiza los gráficos de evolución
7. Ajusta los objetivos si es necesario

### 6.4 Creación y envío de un plan de entrenamiento
1. El profesional inicia sesión en la plataforma
2. Busca al paciente en el dashboard
3. Selecciona el perfil del paciente
4. Accede a la sección "Planes de entrenamiento"
5. Crea un nuevo plan con su título y descripción
6. Añade sesiones de entrenamiento organizadas por días
7. Dentro de cada sesión, añade ejercicios con series, repeticiones y descanso
8. Guarda el plan
9. Genera el documento PDF
10. Envía el documento por correo electrónico o WhatsApp

## 7. Restricciones y consideraciones

### 7.1 Limitaciones de tiempo
- El desarrollo del MVP debe completarse en 30 horas, aprovechando tecnologías de IA para acelerar el proceso.

### 7.2 Consideraciones legales
- El sistema debe cumplir con las normativas de protección de datos aplicables.
- Se debe informar claramente a los usuarios sobre el uso y almacenamiento de datos personales.

### 7.3 Restricciones técnicas
- La integración con WhatsApp estará limitada por las restricciones de la API de WhatsApp Business.
- La generación de PDFs puede tener limitaciones en cuanto a personalización visual avanzada.

## 8. Roadmap y evolución futura

### 8.1 Release del MVP
- Fecha objetivo: [Definir fecha]
- Funcionalidades: Todas las marcadas como "Must Have" en la matriz MoSCoW.

### 8.2 Versiones posteriores
- **V1.1**: Incorporación de funcionalidades "Should Have" (evolución mediante gráficos, plantillas predefinidas, envío por WhatsApp).
- **V1.2**: Incorporación de algunas funcionalidades "Could Have" (biblioteca de alimentos y ejercicios, cálculos automáticos).
- **V2.0**: Evaluación para posible desarrollo de aplicación móvil nativa.

## 9. Criterios de aceptación

Para considerar el MVP como completado y listo para ser utilizado por los primeros usuarios, debe cumplir los siguientes criterios:

1. Todas las funcionalidades "Must Have" están implementadas y funcionando correctamente.
2. Los requisitos no funcionales críticos (RNF1.1, RNF1.2, RNF3.1, RNF3.2) se cumplen.
3. Los 4 flujos de usuario principales pueden completarse sin errores.
4. La aplicación puede desplegarse correctamente en el entorno de producción.
5. Al menos 3 profesionales (entre nutricionistas y entrenadores) han probado la aplicación y proporcionado feedback.

## 10. Apéndices

### 10.1 Glosario de términos
- **Plan de dieta**: Conjunto estructurado de comidas y alimentos diseñado para un paciente.
- **Plan de entrenamiento**: Conjunto estructurado de ejercicios y rutinas diseñado para un paciente.
- **Métricas biométricas**: Medidas corporales como peso, porcentaje de grasa, masa muscular, etc.

### 10.2 Referencias
- README.md del proyecto
- Diagramas de arquitectura 