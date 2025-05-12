// client/src/services/authService.js
import api from '../services/api';

// Función genérica para manejar errores de API
const handleApiError = (error, defaultMessage) => {
    console.error("API Error:", error.response?.data || error.message);
    // Intenta devolver el mensaje del backend, o un mensaje por defecto
    const message = error.response?.data?.message || error.message || defaultMessage;
    // Lanza un nuevo error con un mensaje útil para el UI
    throw new Error(message);
};


// --- Autenticación ---
export const registerUser = async (userData) => {
    try {
        const response = await api.post('/register', userData);
        return response.data; // Devuelve { message: '...', userId: ... }
    } catch (error) {
        handleApiError(error, 'Falló el registro.');
    }
};

export const loginUser = async (credentials) => {
    try {
        const response = await api.post('/login', credentials);
        // Devuelve { message: '...', token: '...', user: {id, username, email} }
        return response.data;
    } catch (error) {
        handleApiError(error, 'Falló el inicio de sesión. Verifica tus credenciales.');
    }
};

// --- Gestión de Usuarios (CRUD) ---
export const getUsers = async () => {
    try {
        const response = await api.get('/users');
        return response.data; // Array de usuarios [{ id, username, email, created_at }, ...]
    } catch (error) {
        handleApiError(error, 'Falló al obtener la lista de usuarios.');
    }
};

 export const getUserById = async (userId) => {
     try {
         const response = await api.get(`/users/${userId}`);
         return response.data; // Objeto usuario { id, username, email, created_at }
     } catch (error) {
         handleApiError(error, `Falló al obtener el usuario con ID ${userId}.`);
     }
 };


 export const updateUser = async (userId, userData) => {
     // Asegúrate de enviar solo los campos que el backend espera (username, email)
     const dataToSend = {
         username: userData.username,
         email: userData.email,
     };
     try {
         const response = await api.put(`/users/${userId}`, dataToSend);
         return response.data; // { message: '...' }
     } catch (error) {
          handleApiError(error, 'Falló al actualizar el usuario.');
     }
 };


export const deleteUser = async (userId) => {
    try {
        const response = await api.delete(`/users/${userId}`);
        return response.data; // { message: '...' }
    } catch (error) {
        handleApiError(error, 'Falló al eliminar el usuario.');
    }
};