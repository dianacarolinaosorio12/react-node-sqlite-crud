// client/src/pages/DashboardPage.jsx
import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { Link } from 'react-router-dom'; // Importa Link

function DashboardPage() {
  const { user } = useAuth();

  return (
    <div className="bg-white p-8 rounded-lg shadow-xl animate-fade-in"> {/* Añadido animate-fade-in si tienes esa animación en Tailwind */}
      <h1 className="text-4xl font-bold text-gray-800 mb-4">
        ¡Bienvenido al Dashboard!
      </h1>
      {user && (
        <p className="text-lg text-gray-600 mb-6">
          Estás conectado como <span className="font-semibold text-indigo-600">{user.username}</span> ({user.email}).
        </p>
      )}
      <p className="text-gray-700 mb-8">
        Desde aquí puedes navegar a las diferentes secciones de la aplicación.
      </p>

      <div className="flex space-x-4">
         <Link
              to="/users"
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-6 rounded-lg focus:outline-none focus:shadow-outline transition duration-300 ease-in-out transform hover:-translate-y-1 shadow-md"
          >
              Gestionar Usuarios
          </Link>
          {/* Puedes añadir más botones/links aquí */}
          {/* <Link
              to="/profile" // Ejemplo de otra sección
              className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-6 rounded-lg focus:outline-none focus:shadow-outline transition duration-300 ease-in-out"
          >
              Mi Perfil
          </Link> */}
      </div>

    </div>
  );
}

export default DashboardPage;