# NutriTrack Pro - Frontend

Este directorio contiene el código fuente del frontend para NutriTrack Pro, una aplicación diseñada para ayudar a profesionales de la nutrición y el entrenamiento a gestionar a sus pacientes.

## Tecnologías Utilizadas

*   **Framework Principal:** [React](https://reactjs.org/) (v18+) con [Vite](https://vitejs.dev/) como herramienta de compilación y servidor de desarrollo.
*   **Lenguaje:** [TypeScript](https://www.typescriptlang.org/)
*   **Estilos:** [Tailwind CSS](https://tailwindcss.com/) con el plugin `@tailwindcss/vite`.
*   **Routing:** [React Router DOM](https://reactrouter.com/) (v6) para la navegación dentro de la aplicación.
*   **Peticiones HTTP:** [Axios](https://axios-http.com/) para la comunicación con el backend.
*   **Gestión de Formularios:** [React Hook Form](https://react-hook-form.com/) para la creación y validación de formularios.
*   **Validación de Esquemas:** [Zod](https://zod.dev/) para definir y validar esquemas de datos, integrado con React Hook Form.
*   **Notificaciones:** [React Hot Toast](https://react-hot-toast.com/) para mostrar notificaciones (toasts) al usuario.
*   **Testing:**
    *   [Vitest](https://vitest.dev/) como runner de tests unitarios y de integración.
    *   [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/) para testear componentes React.
    *   `@testing-library/jest-dom` para matchers de DOM adicionales.
    *   `jsdom` para simular el entorno del navegador en los tests.

## Estructura del Proyecto

La estructura principal de los directorios dentro de `src/` es la siguiente:

```
frontend/
├── public/                 # Archivos estáticos públicos
├── src/
│   ├── assets/             # Imágenes, fuentes, etc.
│   │   ├── Auth/           # Componentes específicos de autenticación (RegisterForm, LoginForm, etc.)
│   │   └── common/         # Componentes comunes (Spinner, Button, Modal, etc.)
│   ├── config/             # Configuración de la aplicación (ej. instancia de Axios)
│   ├── generated/          # Código generado (ej. cliente Prisma si se usara en frontend) - Actualmente vacío
│   ├── hooks/              # Hooks personalizados de React
│   ├── layouts/            # Componentes de layout (MainLayout, AuthLayout, etc.)
│   ├── pages/              # Componentes que representan páginas completas (RegisterPage, LoginPage, DashboardPage, etc.)
│   ├── services/           # Lógica para interactuar con APIs externas (ej. authService, patientService)
│   ├── store/              # (Opcional) Estado global si se usa Redux, Zustand, etc.
│   ├── styles/             # Archivos de estilos globales o específicos (index.css)
│   ├── types/              # Definiciones de tipos y interfaces globales
│   ├── utils/              # Funciones de utilidad
│   ├── App.tsx             # Componente raíz de la aplicación y configuración de rutas principales
│   ├── main.tsx            # Punto de entrada de la aplicación React
│   ├── vite-env.d.ts       # Definiciones de tipos para Vite
│   └── setupTests.ts       # Configuración para los tests de Vitest (ej. import @testing-library/jest-dom)
├── .eslintrc.cjs           # Configuración de ESLint
├── index.html              # Plantilla HTML principal
├── package.json            # Dependencias y scripts del proyecto
├── postcss.config.js       # Configuración de PostCSS (para Tailwind CSS)
├── tailwind.config.js      # Configuración de Tailwind CSS
├── tsconfig.app.json       # Configuración de TypeScript para la aplicación
├── tsconfig.node.json      # Configuración de TypeScript para el entorno Node (ej. vite.config.ts)
└── vite.config.ts          # Configuración de Vite
```

## Requisitos Previos

*   [Node.js](https://nodejs.org/) (v18 o superior recomendado)
*   [npm](https://www.npmjs.com/) (generalmente viene con Node.js)

## Instalación

1.  Clona el repositorio (si aún no lo has hecho).
2.  Navega al directorio `frontend`:
    ```bash
    cd frontend
    ```
3.  Instala las dependencias del proyecto:
    ```bash
    npm install
    ```

## Scripts Disponibles

En el archivo `package.json`, encontrarás varios scripts útiles:

*   **`npm run dev`**: Inicia el servidor de desarrollo de Vite con Hot Module Replacement (HMR). La aplicación estará disponible generalmente en `http://localhost:5173/`.
*   **`npm run build`**: Compila la aplicación para producción. Los archivos optimizados se generan en el directorio `dist/`.
*   **`npm run lint`**: Ejecuta ESLint para analizar el código en busca de errores y problemas de estilo.
*   **`npm run preview`**: Sirve localmente la build de producción desde el directorio `dist/` para previsualizarla.
*   **`npm run test`**: Ejecuta los tests unitarios y de integración utilizando Vitest en modo consola.
*   **`npm run test:ui`**: Ejecuta los tests utilizando Vitest con su interfaz de usuario en el navegador, lo que permite una depuración más interactiva.

## Variables de Entorno

La aplicación puede requerir ciertas variables de entorno para funcionar correctamente, especialmente para la comunicación con el backend.

Crea un archivo `.env` en la raíz del directorio `frontend` (al mismo nivel que `package.json`) y define las variables necesarias. Por ejemplo:

```env
VITE_API_BASE_URL=http://localhost:3000/api
```

*   `VITE_API_BASE_URL`: La URL base del servidor backend. Las variables de entorno en Vite que deben ser expuestas al cliente deben comenzar con el prefijo `VITE_`.

Consulta el código (especialmente los servicios o donde se use `import.meta.env`) para ver qué variables son necesarias.

## Contribuir

Si deseas contribuir al desarrollo del frontend, por favor sigue las guías de estilo de código (aseguradas por ESLint y Prettier si está configurado) y asegúrate de que todos los tests pasen antes de enviar un Pull Request.
