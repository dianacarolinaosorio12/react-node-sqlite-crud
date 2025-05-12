// client/src/App.jsx
import React from 'react';
import {
    BrowserRouter as Router,
    Routes,
    Route,
    Navigate,
    Outlet,
    Link // Importante para rutas anidadas o layout
} from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { useAuth } from '../src/hooks/useAuth'; 

// Importa tus páginas (crearemos estas a continuación)
import LoginPage from '../src/pages/LoginPage';
import RegisterPage from '../src/pages/RegisterPage';
import DashboardPage from '../src/pages/DashboardPage';
import UserListPage from '../src/pages/UserListPage';
import UserEditPage from '../src/pages/UserEditPage';
// Importa tu Navbar (lo crearemos a continuación)
import Navbar from '../src/components/Navbar';

// Componente Layout Principal (incluye Navbar)
function MainLayout() {
    const { authToken } = useAuth();

    // Si no está autenticado, no renderiza el layout (será redirigido)
    if (!authToken) return <Navigate to="/login" replace />;

    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-grow container mx-auto p-6 md:p-8 mt-6 mb-6">
                {/* El contenido de la ruta anidada se renderizará aquí */}
                <Outlet />
            </main>
             <footer className="text-center p-4 text-gray-500 text-sm">
                 Mi CRUD App © 2025 ✨
             </footer>
        </div>
    );
}


// Componente para proteger rutas que requieren autenticación
function ProtectedRoute({ children }) {
   const { authToken } = useAuth();// Asumiendo que agregas isLoading a useAuth si es necesario

  // Opcional: manejar un estado de carga inicial del contexto
  // if (isLoading) {
  //   return <div>Loading authentication...</div>;
  // }

  // Redirige a login si no hay token
  return authToken ? children : <Navigate to="/login" replace />;
}

// Contenido principal de la aplicación con definición de rutas
function AppContent() {
    const { authToken } = useAuth(); // Para la lógica de redirección inicial

    return (
        <Routes>
            {/* Rutas Públicas */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* Rutas Protegidas anidadas bajo MainLayout */}
            <Route element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/users" element={<UserListPage />} />
                <Route path="/users/edit/:userId" element={<UserEditPage />} />
                 {/* Puedes añadir /users/new aquí si es necesario */}
            </Route>

            {/* Ruta Raíz: Redirige a dashboard si está logueado, si no a login */}
            <Route
                path="/"
                element={ authToken ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace /> }
             />

             {/* Ruta Catch-all para 404 */}
             <Route path="*" element={
                 <div className="text-center mt-20">
                     <h1 className="text-4xl font-bold">404 - Página No Encontrada</h1>
                     <Link to="/" className="text-blue-500 hover:underline mt-4 inline-block">Volver al inicio</Link>
                 </div>
             } />
        </Routes>
    );
}

// Componente Raíz de la Aplicación
function App() {
  return (
    <AuthProvider> {/* Envuelve todo con el proveedor de autenticación */}
      <Router>     {/* Envuelve todo con el enrutador */}
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;