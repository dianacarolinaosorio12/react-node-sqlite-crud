#Aplicación CRUD Full-Stack con Autenticación

una aplicación web completa (CRUD - Create, Read, Update, Delete) para la gestión de usuarios, construida con React para el frontend y Node.js/Express con SQLite para el backend. Incluye autenticación de usuarios mediante JSON Web Tokens (JWT)

#Descripción
Este proyecto sirve como un ejemplo práctico y una base sólida para construir aplicaciones web full-stack modernas. Permite a los usuarios registrarse, iniciar sesión, ver una lista de otros usuarios, editar sus propios perfiles (o perfiles de otros, dependiendo de la lógica de permisos que se implemente) y eliminar usuarios

react-node-sqlite-crud/
├── client/ # Proyecto Frontend (React con Vite)
│ ├── public/
│ ├── src/
│ │ ├── components/ # Componentes React reutilizables (Navbar, etc.)
│ │ ├── context/ # Contexto de React (AuthContext)
│ │ ├── hooks/ # Hooks personalizados (useAuth, useTheme)
│ │ ├── pages/ # Componentes que representan páginas completas
│ │ ├── services/ # Lógica para llamadas a la API (api.js, authService.js)
│ │ ├── App.jsx # Componente raíz del frontend y configuración de rutas
│ │ ├── index.css # Estilos globales y directivas de Tailwind
│ │ └── main.jsx # Punto de entrada del cliente React
│ ├── index.html
│ ├── package.json # Dependencias y scripts del frontend
│ └── vite.config.js # Configuración de Vite
│
├── server/ # Proyecto Backend (Node.js con Express)
│ ├── database.js # Configuración y conexión de SQLite, creación de tablas
│ ├── server.js # Lógica principal del servidor Express, rutas API
│ ├── package.json # Dependencias y scripts del backend
│ └── users_app.db # Archivo de la base de datos SQLite (se crea automáticamente)
│
└── README.md # Este archivo


### Frontend (Instaladas en la carpeta `client/`)

*   **React (`react`, `react-dom`):** Biblioteca para construir interfaces de usuario.
*   **Vite (`vite`):** Herramienta de frontend para desarrollo rápido y build optimizado.
*   **React Router DOM (`react-router-dom`):** Para enrutamiento del lado del cliente.
*   **Axios (`axios`):** Cliente HTTP para realizar peticiones a la API.
*   **Tailwind CSS (`tailwindcss`, `postcss`, `autoprefixer`):** Framework CSS de utilidad (instalado como dependencia de desarrollo).
*   **ESLint (`eslint` y plugins relacionados):** Para análisis estático de código (generalmente configurado por Vite).

### Backend (Instaladas en la carpeta `server/`)

*   **Express.js (`express`):** Framework para construir la API RESTful.
*   **SQLite3 (`sqlite3`):** Driver de Node.js para interactuar con bases de datos SQLite.
*   **JSON Web Token (`jsonwebtoken`):** Para la generación y verificación de tokens de autenticación.
*   **Bcrypt (`bcrypt`):** Para el hashing seguro de contraseñas.
*   **CORS (`cors`):** Middleware para habilitar el Intercambio de Recursos de Origen Cruzado.
*   **Nodemon (`nodemon`):** Para reiniciar automáticamente el servidor durante el desarrollo (instalado como dependencia de desarrollo).