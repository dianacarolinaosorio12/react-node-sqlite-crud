// client/src/services/api.js (Configuración base de Axios)
import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:3001/api', // URL base de tu backend corriendo en el puerto 3001
    timeout: 10000, // Espera 10 segundos antes de dar timeout
});

// Interceptor para añadir el token JWT a todas las peticiones salientes si existe
api.interceptors.request.use(
    config => {
        const token = localStorage.getItem('authToken');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    error => {
        console.error("Axios request interceptor error:", error);
        return Promise.reject(error);
    }
);

// Interceptor para manejar errores de respuesta globalmente (opcional pero útil)
api.interceptors.response.use(
    response => response, // Si la respuesta es exitosa, simplemente devuélvela
    error => {
        console.error("Axios response error:", error.response || error.message);
         if (error.response && error.response.status === 401) {
             // Si recibimos un 401 (No autorizado), podría significar que el token expiró o es inválido.
             // Podrías desloguear al usuario automáticamente aquí.
             console.warn("Received 401 Unauthorized. Token might be invalid or expired.");
             // Ejemplo de deslogueo (requeriría importar `logout` o emitir un evento):
             // logout(); // Cuidado con las dependencias circulares si importas desde AuthContext aquí
             localStorage.removeItem('authToken');
             localStorage.removeItem('user');
             // Redirigir a login (esto es mejor hacerlo en el componente que llama)
             // window.location.href = '/login';
        }
        // Rechaza la promesa para que el .catch() en la llamada original funcione
        return Promise.reject(error);
    }
);


export default api;