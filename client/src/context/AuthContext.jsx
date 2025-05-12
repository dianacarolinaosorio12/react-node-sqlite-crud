// client/src/context/AuthContext.jsx
import React, { createContext, useState, useEffect } from 'react';
// Ejemplo en cualquier componente/página

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [authToken, setAuthToken] = useState(localStorage.getItem('authToken'));
    // Intenta parsear el usuario, si falla o no existe, usa null
    const [user, setUser] = useState(() => {
        const storedUser = localStorage.getItem('user');
        try {
            return storedUser ? JSON.parse(storedUser) : null;
        } catch (error) {
            console.error("Failed to parse user from localStorage", error);
            localStorage.removeItem('user'); // Limpiar si está corrupto
            return null;
        }
    });


    useEffect(() => {
        // Sincronizar localStorage cuando cambie el token o el user
        if (authToken) {
            localStorage.setItem('authToken', authToken);
        } else {
            localStorage.removeItem('authToken');
        }
         if (user) {
            // Asegúrate de que el objeto user sea serializable
            try {
                localStorage.setItem('user', JSON.stringify(user));
            } catch (error) {
                 console.error("Failed to stringify user for localStorage", error);
            }
        } else {
            localStorage.removeItem('user');
        }
    }, [authToken, user]);

    const login = (token, userData) => {
        if (!token || typeof token !== 'string') {
             console.error("Login attempt with invalid token");
             return;
        }
         if (!userData || typeof userData !== 'object') {
             console.error("Login attempt with invalid user data");
             // Podrías querer manejar esto de forma más robusta
             userData = {}; // O poner un valor por defecto seguro
        }
        setAuthToken(token);
        setUser(userData);
    };

    const logout = () => {
        setAuthToken(null);
        setUser(null);
        // Limpieza explícita por si acaso useEffect no se dispara a tiempo
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
    };

    // Asegúrate de que el valor proporcionado siempre sea un objeto
    const value = {
        authToken: authToken || null,
        user: user || null,
        login,
        logout
    };


    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};
