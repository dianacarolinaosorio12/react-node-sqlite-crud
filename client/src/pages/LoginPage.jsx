// client/src/pages/LoginPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { loginUser } from '../services/authService';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login, authToken } = useAuth();
  const location = useLocation(); // Para obtener mensajes de estado (ej: después de registrarse)

  // Si ya está autenticado, redirigir a dashboard
   useEffect(() => {
        if (authToken) {
            navigate('/dashboard', { replace: true });
        }
    }, [authToken, navigate]);

  // Mostrar mensaje si viene de registro exitoso
   useEffect(() => {
       if (location.state?.message) {
           // Podrías mostrar este mensaje de forma más elegante (ej: un toast)
           console.log(location.state.message);
           // Limpiar el estado para que no persista si recarga
            navigate(location.pathname, { replace: true, state: {} });
       }
   }, [location, navigate]);


  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = await loginUser({ email, password });
      if (data.token && data.user) {
          login(data.token, data.user); // Guarda token y user en el context
          navigate('/dashboard', { replace: true }); // Redirige al dashboard
      } else {
          throw new Error("Respuesta inválida del servidor al iniciar sesión.");
      }
    } catch (err) {
      // El error ya debería venir formateado desde authService
      setError(err.message || 'Fallo al iniciar sesión.');
    } finally {
        setLoading(false);
    }
  };

   // No renderizar nada si ya está autenticado y esperando redirección
   if (authToken) return null;


  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-lg">
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Iniciar Sesión</h2>
            {error && (
                <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4" role="alert">
                    <p className="font-bold">Error</p>
                    <p>{error}</p>
                </div>
            )}
            <form onSubmit={handleSubmit} noValidate>
                <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                    Email
                </label>
                <input
                    className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    id="email"
                    type="email"
                    placeholder="tu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    aria-describedby="email-error"
                />
                {/* Aquí podrías añadir validación visual de error */}
                </div>
                <div className="mb-6">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                    Contraseña
                </label>
                <input
                    className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 mb-3 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    id="password"
                    type="password"
                    placeholder="••••••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    aria-describedby="password-error"
                />
                 {/* Aquí podrías añadir validación visual de error */}
                </div>
                <div className="flex items-center justify-between">
                <button
                    className={`w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded focus:outline-none focus:shadow-outline transition duration-150 ease-in-out ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    type="submit"
                    disabled={loading}
                >
                    {loading ? (
                         <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                    ) : null}
                    {loading ? 'Iniciando...' : 'Iniciar Sesión'}
                </button>
                </div>
                <p className="text-center text-gray-600 text-sm mt-6">
                    ¿No tienes cuenta?{' '}
                    <Link to="/register" className="font-medium text-blue-600 hover:text-blue-800 hover:underline">
                        Regístrate aquí
                    </Link>
                </p>
            </form>
        </div>
    </div>
  );
}

export default LoginPage;