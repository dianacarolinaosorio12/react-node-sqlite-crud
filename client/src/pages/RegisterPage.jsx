// client/src/pages/RegisterPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { registerUser } from '../services/authService';
import { useAuth } from '../hooks/useAuth';
 // Para redirigir si ya está logueado

function RegisterPage() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
   const [success, setSuccess] = useState(''); // Mensaje de éxito
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { authToken } = useAuth();

   // Redirigir si ya está logueado
   useEffect(() => {
        if (authToken) {
            navigate('/dashboard', { replace: true });
        }
    }, [authToken, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(''); // Limpiar mensaje de éxito anterior

    // Validación simple de contraseña
    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden.');
      return;
    }
     if (password.length < 6) { // Ejemplo: Mínimo 6 caracteres
        setError('La contraseña debe tener al menos 6 caracteres.');
        return;
    }


    setLoading(true);
    try {
      const data = await registerUser({ username, email, password });
       setSuccess(data.message || '¡Registro exitoso! Ahora puedes iniciar sesión.'); // Mostrar mensaje de éxito
       // Opcional: Limpiar formulario tras éxito
       setUsername('');
       setEmail('');
       setPassword('');
       setConfirmPassword('');
       // Redirigir a login después de un breve retraso para que lean el mensaje
        setTimeout(() => {
            navigate('/login', { state: { message: '¡Registro exitoso! Por favor, inicia sesión.' } });
        }, 2000); // Espera 2 segundos

    } catch (err) {
        // El error ya viene formateado desde authService
        setError(err.message || 'Falló el registro.');
    } finally {
      setLoading(false);
    }
  };

   // No renderizar nada si ya está autenticado y esperando redirección
   if (authToken) return null;

  return (
     <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-lg">
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Crear Cuenta</h2>
             {error && (
                <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4" role="alert">
                    <p className="font-bold">Error de Registro</p>
                    <p>{error}</p>
                </div>
            )}
            {success && (
                 <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-4" role="alert">
                    <p className="font-bold">Éxito</p>
                    <p>{success}</p>
                </div>
            )}
            <form onSubmit={handleSubmit} noValidate>
                {/* Campo Username */}
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">
                        Nombre de Usuario
                    </label>
                    <input
                        className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        id="username"
                        type="text"
                        placeholder="Tu Nombre de Usuario"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </div>
                {/* Campo Email */}
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
                />
                </div>
                {/* Campo Password */}
                <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                    Contraseña
                </label>
                <input
                    className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    id="password"
                    type="password"
                    placeholder="••••••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                </div>
                 {/* Campo Confirmar Password */}
                 <div className="mb-6">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="confirmPassword">
                        Confirmar Contraseña
                    </label>
                    <input
                        className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 mb-3 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        id="confirmPassword"
                        type="password"
                        placeholder="••••••••••••"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                    />
                </div>
                <div className="flex items-center justify-between">
                <button
                    className={`w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded focus:outline-none focus:shadow-outline transition duration-150 ease-in-out ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    type="submit"
                    disabled={loading}
                >
                    {loading ? (
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            {/* SVG Spinner Icon */}
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                    ) : null}
                    {loading ? 'Registrando...' : 'Crear Cuenta'}
                </button>
                </div>
                 <p className="text-center text-gray-600 text-sm mt-6">
                    ¿Ya tienes cuenta?{' '}
                    <Link to="/login" className="font-medium text-blue-600 hover:text-blue-800 hover:underline">
                        Inicia sesión aquí
                    </Link>
                </p>
            </form>
        </div>
    </div>
  );
}

export default RegisterPage;