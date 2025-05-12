// client/src/components/Navbar.jsx
import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useTheme } from '../hooks/useTheme'; // Importa el hook del tema

// Iconos simples
const SunIcon = () => <span role="img" aria-label="Light mode">☀️</span>;
const MoonIcon = () => <span role="img" aria-label="Dark mode">🌙</span>;


function Navbar() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme(); // Obtiene el estado del tema

  const handleLogout = () => {
    logout();
    window.location.href = '/login';
  };

  // --- Clases Condicionales ---
  // (Definimos las clases completas aquí para mayor claridad)

  // Estilo base de la Nav
  const navBaseClasses = "text-white p-4 shadow-lg sticky top-0 z-50 transition-colors duration-300";
  const navLightBg = "bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-700";
  const navDarkBg = "bg-gradient-to-r from-slate-800 via-indigo-900 to-slate-900"; // Usamos colores estándar

  // Clases base comunes para NavLinks
  const commonLinkClasses = "px-3 py-2 rounded-md text-sm font-medium transition duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-white/60";

  // Clases para NavLink Inactivo (dependiendo del tema)
  const inactiveLinkLightClasses = "text-purple-100 hover:bg-purple-500/30 hover:text-white";
  const inactiveLinkDarkClasses = "text-purple-300 hover:bg-purple-700/50 hover:text-white";

  // Clases para NavLink Activo (dependiendo del tema)
  const activeLinkLightClasses = "bg-purple-700/60 text-white shadow-inner";
  const activeLinkDarkClasses = "bg-purple-800/80 text-white shadow-inner";

  // Clases para el botón de tema (hover)
  const themeButtonLightHover = "hover:bg-white/20";
  const themeButtonDarkHover = "hover:bg-white/10";

   // Clases para el botón de logout (base y hover)
   const logoutBaseLight = "bg-pink-500";
   const logoutHoverLight = "hover:bg-pink-600";
   const logoutBaseDark = "bg-pink-600"; // Ligeramente diferente en dark?
   const logoutHoverDark = "hover:bg-pink-700";
   const logoutFocusRing = "focus:ring-pink-300"; // Podríamos ajustar esto también para dark

   // Clases para el saludo
   const greetingLightClasses = "text-purple-200";
   const greetingDarkClasses = "text-purple-300";


  return (
    // Aplicamos clases condicionales a la NAV
    <nav className={`${navBaseClasses} ${theme === 'dark' ? navDarkBg : navLightBg}`}>
      <div className="container mx-auto flex justify-between items-center">

        {/* Logo a la Izquierda */}
        <Link
            to="/dashboard"
            className="font-bold text-xl tracking-tight hover:opacity-80 transition duration-200"
        >
          ✨ UserMagic
        </Link>

        {/* Grupo Central: Enlaces */}
        <div className="hidden sm:flex items-center space-x-2">
           <NavLink
                to="/dashboard"
                className={({ isActive }) =>
                    `${commonLinkClasses} ${isActive
                        ? (theme === 'dark' ? activeLinkDarkClasses : activeLinkLightClasses) // Activo condicional
                        : (theme === 'dark' ? inactiveLinkDarkClasses : inactiveLinkLightClasses) // Inactivo condicional
                    }`
                }
            >
                Dashboard
            </NavLink>
           <NavLink
                to="/users"
                 className={({ isActive }) =>
                    `${commonLinkClasses} ${isActive
                        ? (theme === 'dark' ? activeLinkDarkClasses : activeLinkLightClasses)
                        : (theme === 'dark' ? inactiveLinkDarkClasses : inactiveLinkLightClasses)
                    }`
                 }
            >
                Usuarios
            </NavLink>
        </div>

        {/* Grupo Derecha: Usuario, Tema, Logout */}
        <div className="flex items-center space-x-3 md:space-x-4">
           {user && (
            <span className={`text-sm hidden md:inline ${theme === 'dark' ? greetingDarkClasses : greetingLightClasses}`}>
                Hola, {user.username}!
            </span>
            )}

          {/* Botón Toggle Tema */}
          <button
            onClick={toggleTheme}
            className={`p-2 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-white/50 transition duration-200 ${theme === 'dark' ? themeButtonDarkHover : themeButtonLightHover}`}
            title={`Cambiar a modo ${theme === 'light' ? 'oscuro' : 'claro'}`}
          >
            {theme === 'light' ? <MoonIcon /> : <SunIcon />}
          </button>

          {/* Botón Logout */}
          <button
            onClick={handleLogout}
            className={`font-semibold py-2 px-3 rounded-lg focus:outline-none focus:ring-2 ${logoutFocusRing} focus:ring-opacity-70 transition duration-200 shadow-sm text-sm text-white
                       ${theme === 'dark' ? `${logoutBaseDark} ${logoutHoverDark}` : `${logoutBaseLight} ${logoutHoverLight}`}`}
            title="Cerrar Sesión"
          >
            Salir
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;