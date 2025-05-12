// client/src/pages/UserEditPage.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getUserById, updateUser } from '../services/authService';
import { useAuth } from '../hooks/useAuth'; // Para verificar si edita su propio perfil

function UserEditPage() {
  const { userId } = useParams(); // Obtener el ID del usuario de la URL
  const navigate = useNavigate();
  const { user: currentUser } = useAuth(); // Usuario logueado

  const [formData, setFormData] = useState({ username: '', email: '' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false); // Estado para guardar cambios
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Cargar datos del usuario a editar
  const fetchUserData = useCallback(async () => {
    setLoading(true);
    setError('');
    setSuccess('');
    try {
        // Verificar que userId es un número válido antes de llamar a la API
        const id = parseInt(userId, 10);
        if (isNaN(id)) {
            throw new Error("ID de usuario inválido.");
        }
        const userData = await getUserById(id);
        if (userData) {
            setFormData({ username: userData.username, email: userData.email });
        } else {
             throw new Error("Usuario no encontrado.");
        }
    } catch (err) {
        setError(err.message || 'Error al cargar los datos del usuario.');
        // Opcional: Redirigir si el usuario no se encuentra o hay error grave
        // setTimeout(() => navigate('/users'), 3000);
    } finally {
        setLoading(false);
    }
  }, [userId]); // Dependencia: userId

  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSaving(true);

     // Validaciones básicas
    if (!formData.username || !formData.email) {
        setError("El nombre de usuario y el email son obligatorios.");
        setSaving(false);
        return;
    }

    try {
       const id = parseInt(userId, 10); // Revalidar ID
       const result = await updateUser(id, { username: formData.username, email: formData.email });
       setSuccess(result.message || 'Usuario actualizado correctamente.');
       // Opcional: Si el usuario editado es el usuario actual, actualizar el contexto/localStorage?
       // if (currentUser && currentUser.id === id) {
       //    // lógica para actualizar el estado global del usuario
       // }

       // Redirigir a la lista después de un breve delay
       setTimeout(() => navigate('/users'), 1500);

    } catch (err) {
       setError(err.message || 'Error al actualizar el usuario.');
    } finally {
      setSaving(false);
    }
  };

    if (loading) {
        return (
            <div className="text-center py-10">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
                <p className="mt-2 text-gray-600">Cargando datos del usuario...</p>
            </div>
        );
    }

    // Si hubo un error al cargar y no hay datos, mostrar error y botón para volver
    if (error && !formData.username) {
         return (
            <div className="bg-white p-6 rounded-lg shadow-xl text-center">
                 <h2 className="text-2xl font-bold text-red-600 mb-4">Error al Cargar Usuario</h2>
                <p className="text-gray-700 mb-6">{error}</p>
                <Link
                    to="/users"
                    className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                    Volver a la Lista
                </Link>
            </div>
        );
    }


  return (
    <div className="bg-white p-8 rounded-lg shadow-xl max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">
          Editar Usuario <span className="text-indigo-600">#{userId}</span>
          {currentUser && currentUser.id === parseInt(userId, 10) && " (Tu Perfil)"}
      </h1>

        {error && (
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4" role="alert">
                <p className="font-bold">Error al guardar</p>
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
            name="username" // Asegúrate que 'name' coincide con el estado
            placeholder="Nombre de Usuario"
            value={formData.username}
            onChange={handleChange}
            required
          />
        </div>

        {/* Campo Email */}
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
            Email
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            id="email"
            type="email"
            name="email" // Asegúrate que 'name' coincide con el estado
            placeholder="tu@email.com"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

         {/* Advertencia sobre la contraseña */}
         <p className="text-sm text-gray-500 mb-6">
             Nota: La edición de contraseña no está implementada en este formulario.
         </p>

        {/* Botones */}
        <div className="flex items-center justify-end space-x-4">
          <Link
            to="/users"
            className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-150 ease-in-out"
          >
            Cancelar
          </Link>
          <button
            className={`bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-150 ease-in-out ${saving ? 'opacity-50 cursor-not-allowed' : ''}`}
            type="submit"
            disabled={saving}
          >
            {saving ? (
                <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white inline" /* SVG Spinner */ >
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
            ) : null}
            {saving ? 'Guardando...' : 'Guardar Cambios'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default UserEditPage;