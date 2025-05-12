// client/src/hooks/useTheme.js
import { useState, useEffect } from 'react';

export function useTheme() {
  const [theme, setTheme] = useState(() => {
    // Intenta leer desde localStorage, si no, verifica preferencia del sistema, si no, 'light'
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) return savedTheme;
    // Opcional: Detectar preferencia del sistema como valor inicial
    // const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    // return prefersDark ? 'dark' : 'light';
    return 'light'; // O simplemente empezar con 'light'
  });

  // SOLO aplicamos la clase al <html> si queremos usarla para CSS global (no para prefijos dark: de Tailwind)
  // En este enfoque, esta parte es menos crítica pero puede ser útil para estilos CSS puros.
  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark'); // Limpiar clases anteriores
    root.classList.add(theme); // Añadir 'light' o 'dark'
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  return { theme, toggleTheme };
}