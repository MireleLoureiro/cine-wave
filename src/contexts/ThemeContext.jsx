import React, { createContext, useState, useContext, useEffect } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme deve ser usado dentro de um ThemeProvider');
    }
    return context;
};

export const ThemeProvider = ({ children }) => {
    const [isDarkMode, setIsDarkMode] = useState(true);

    // 🎯 DEBUG: Log inicial
    console.log('🎨 ThemeProvider montado');

    useEffect(() => {
        console.log('🔍 Verificando tema salvo...');
        const savedTheme = localStorage.getItem('cinewave-theme');
        console.log('📁 Tema salvo no localStorage:', savedTheme);
        
        if (savedTheme) {
            setIsDarkMode(savedTheme === 'dark');
            console.log('✅ Tema carregado:', savedTheme);
        } else {
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            console.log('🌐 Preferência do sistema:', prefersDark ? 'dark' : 'light');
            setIsDarkMode(prefersDark);
        }
    }, []);

    useEffect(() => {
        console.log('🎯 Aplicando tema:', isDarkMode ? 'dark' : 'light');
        const root = document.documentElement;
        
        if (isDarkMode) {
            root.classList.add('dark-theme');
            root.classList.remove('light-theme');
            console.log('🌙 Tema escuro aplicado');
        } else {
            root.classList.add('light-theme');
            root.classList.remove('dark-theme');
            console.log('☀️ Tema claro aplicado');
        }
        
        localStorage.setItem('cinewave-theme', isDarkMode ? 'dark' : 'light');
        console.log('💾 Tema salvo no localStorage');
    }, [isDarkMode]);

    const toggleTheme = () => {
        console.log('🔄 Alternando tema...');
        setIsDarkMode(prev => !prev);
    };

    const value = {
        isDarkMode,
        toggleTheme,
        setTheme: (theme) => setIsDarkMode(theme === 'dark'),
        currentTheme: isDarkMode ? 'dark' : 'light'
    };

    return (
        <ThemeContext.Provider value={value}>
            {children}
        </ThemeContext.Provider>
    );
};