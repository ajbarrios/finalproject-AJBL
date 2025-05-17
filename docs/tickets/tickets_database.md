# Tickets de Trabajo - Base de Datos

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