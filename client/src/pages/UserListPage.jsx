// client/src/pages/UserListPage.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { getUsers, deleteUser } from '../services/authService';
import { useAuth } from '../hooks/useAuth'; // Para obtener el ID del usuario actual

function UserListPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState(''); // Para la búsqueda
  const { user: currentUser } = useAuth(); // Obtener el usuario logueado

  // Función para cargar usuarios (usando useCallback para optimización)
  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await getUsers();
      setUsers(data || []); // Asegurarse que sea un array
    } catch (err) {
      setError(err.message || 'Error al cargar usuarios.');
       setUsers([]); // Limpiar usuarios en caso de error
    } finally {
      setLoading(false);
    }
  }, []); // Sin dependencias, getUsers no cambia

  // Cargar usuarios al montar el componente
  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]); // fetchUsers está memoizada con useCallback


  const handleDelete = async (userId, username) => {
      // Evitar que el usuario actual se borre a sí mismo desde la lista general
     if (currentUser && userId === currentUser.id) {
         alert("No puedes eliminar tu propia cuenta desde esta lista.");
         return;
     }

     // Confirmación antes de borrar
    if (window.confirm(`¿Estás seguro de querer eliminar al usuario "${username}" (ID: ${userId})? Esta acción no se puede deshacer.`)) {
      try {
        await deleteUser(userId);
         // Refrescar la lista después de borrar (o filtrar localmente)
         // setUsers(prevUsers => prevUsers.filter(user => user.id !== userId)); // Filtrado local
         fetchUsers(); // Volver a cargar desde el servidor (más seguro si hay cambios externos)
         alert(`Usuario "${username}" eliminado correctamente.`); // O usar un toast/notificación
      } catch (err) {
         setError(err.message || `Error al eliminar el usuario ${username}.`);
         alert(`Error al eliminar el usuario ${username}: ${err.message}`); // Mostrar error
      }
    }
  };

  // Filtrar usuarios basado en el término de búsqueda (case-insensitive)
    const filteredUsers = users.filter(user =>
        user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );


  return (
    <div className="bg-white p-6 rounded-lg shadow-xl">
      <div className="flex justify-between items-center mb-6">
         <h1 className="text-3xl font-bold text-gray-800">Lista de Usuarios</h1>
         {/* Opcional: Botón para añadir nuevo usuario si tienes esa ruta/página */}
         {/* <Link to="/users/new" className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
            Añadir Usuario
         </Link> */}
      </div>

      {/* Barra de Búsqueda */}
       <div className="mb-4">
            <input
                type="text"
                placeholder="Buscar por nombre o email..."
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
        </div>

      {loading && (
         <div className="text-center py-10">
             <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
             <p className="mt-2 text-gray-600">Cargando usuarios...</p>
         </div>
      )}
      {error && !loading && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                <strong className="font-bold">¡Error! </strong>
                <span className="block sm:inline">{error}</span>
            </div>
        )}

      {!loading && !error && (
         <div className="overflow-x-auto">
             {filteredUsers.length > 0 ? (
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                    <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Username</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Registrado</th>
                        <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                    </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                    {filteredUsers.map((user) => (
                        <tr key={user.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.id}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{user.username}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{user.email}</td>
                         <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(user.created_at).toLocaleDateString()} {/* Formatear fecha */}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                            <Link
                                to={`/users/edit/${user.id}`}
                                className="text-indigo-600 hover:text-indigo-900"
                                title="Editar Usuario"
                            >
                               Editar
                            </Link>
                            <button
                                onClick={() => handleDelete(user.id, user.username)}
                                className={`font-medium ${currentUser && user.id === currentUser.id ? 'text-gray-400 cursor-not-allowed' : 'text-red-600 hover:text-red-900'}`}
                                title={currentUser && user.id === currentUser.id ? "No puedes eliminar tu propia cuenta" : "Eliminar Usuario"}
                                disabled={currentUser && user.id === currentUser.id} // Deshabilitar botón para el usuario actual
                            >
                               Eliminar
                            </button>
                        </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
             ) : (
                <p className="text-center text-gray-500 py-5">
                    {users.length === 0 ? "No hay usuarios registrados." : "No se encontraron usuarios con ese criterio de búsqueda."}
                </p>
             )}
        </div>
      )}
    </div>
  );
}

export default UserListPage;