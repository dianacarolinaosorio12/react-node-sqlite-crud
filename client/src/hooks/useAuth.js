// src/hooks/useAuth.js
import { useContext } from 'react';
// Importa el contexto directamente desde su archivo
import { AuthContext } from '../context/AuthContext'; // Ajusta la ruta si es necesario

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    // Devuelve un objeto consistente incluso si el valor inicial es null
    return context || { authToken: null, user: null, login: () => {}, logout: () => {} };
};