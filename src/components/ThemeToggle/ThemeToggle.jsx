import React from 'react';

// context
import { useTheme } from '../../contexts/ThemeContext';

// css
import './ThemeToggle.css';

const ThemeToggle = () => {
    const { isDarkMode, toggleTheme } = useTheme();

    console.log('🎨 ThemeToggle renderizado - Tema atual:', isDarkMode ? 'dark' : 'light');

    const handleClick = () => {
        console.log('🖱️ Botão de tema clicado');
        toggleTheme();
    };

    return (
        <button 
            className="theme-toggle"
            onClick={handleClick}
            aria-label={isDarkMode ? 'Mudar para tema claro' : 'Mudar para tema escuro'}
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