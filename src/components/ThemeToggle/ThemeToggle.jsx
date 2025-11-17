// components/ThemeToggle/ThemeToggle.jsx
import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import './ThemeToggle.css';

const ThemeToggle = () => {
    const { isDarkMode, toggleTheme } = useTheme();

    return (
        <button 
            className="theme-toggle"
            onClick={toggleTheme}
            aria-label={isDarkMode ? 'Mudar para tema claro' : 'Mudar para tema escuro'}
            title={isDarkMode ? 'Tema escuro' : 'Tema claro'}
        >
            <div className="theme-toggle__track">
                <div className={`theme-toggle__thumb ${isDarkMode ? 'theme-toggle__thumb--dark' : 'theme-toggle__thumb--light'}`}>
                    <span className="theme-toggle__icon">
                        {isDarkMode ? '🌙' : '☀️'}
                    </span>
                </div>
            </div>
            <span className="theme-toggle__label">
                {isDarkMode ? 'Escuro' : 'Claro'}
            </span>
        </button>
    );
};

export default ThemeToggle;