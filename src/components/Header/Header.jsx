import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import logo from '../../assets/images/logo.png';

// context
import { useFavorites } from "../../contexts/FavoritesContext";

// components
import SearchBar from "../SearchBar/SearchBar";

// css
import './Header.css';

const Header = () => {
    const { favoritesCount } = useFavorites();
    const [isScrolled, setIsScrolled] = useState(false);
    const [showMobileSearch, setShowMobileSearch] = useState(false);
    const [showMobileMenu, setShowMobileMenu] = useState(false);
    const location = useLocation();

    // Efeito para detectar scroll
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 100);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Fechar menu mobile quando mudar de rota
    useEffect(() => {
        setShowMobileMenu(false);
        setShowMobileSearch(false);
    }, [location]);

    // Fechar menu quando clicar fora (opcional)
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (showMobileMenu && !event.target.closest('.header__nav') && !event.target.closest('.header__menu-toggle')) {
                setShowMobileMenu(false);
            }
        };

        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, [showMobileMenu]);

    return (
        <header className={`header ${isScrolled ? 'scrolled' : ''}`}>
            <div className="header__container">
                {/* Logo */}
                <Link to="/" className="header__logo">
                    <img src={logo} alt="CineWave" className="header__logo-image" />  
                </Link>

                {/* Search Bar - Desktop */}
                <div className="header__search">
                    <SearchBar />
                </div>

                {/* Botão Search Mobile */}
                <button 
                    className="header__search-toggle"
                    onClick={() => setShowMobileSearch(!showMobileSearch)}
                    aria-label="Toggle search"
                >
                    🔍
                </button>

                {/* Search Bar Mobile */}
                {showMobileSearch && (
                    <div className="header__search-mobile">
                        <SearchBar />
                        <button 
                            className="header__search-close"
                            onClick={() => setShowMobileSearch(false)}
                            aria-label="Close search"
                        >
                            ✕
                        </button>
                    </div>
                )}

                {/* Menu Hamburger Mobile */}
                <button 
                    className={`header__menu-toggle ${showMobileMenu ? 'active' : ''}`}
                    onClick={() => setShowMobileMenu(!showMobileMenu)}
                    aria-label="Toggle menu"
                >
                    <span></span>
                    <span></span>
                    <span></span>
                </button>

                {/* Navegação */}
                <nav className={`header__nav ${showMobileMenu ? 'mobile-open' : ''}`}>
                    <Link 
                        to="/" 
                        className={`header__nav-item ${location.pathname === '/' ? 'active' : ''}`}
                    >
                        Início
                    </Link>
                    <Link 
                        to="/categories" 
                        className={`header__nav-item ${location.pathname === '/categories' ? 'active' : ''}`}
                    >
                        Categorias
                    </Link>
                    <Link 
                        to="/search" 
                        className={`header__nav-item ${location.pathname === '/search' ? 'active' : ''}`}
                    >
                        Busca
                    </Link>
                    <Link 
                        to="/favorites" 
                        className={`header__nav-item ${location.pathname === '/favorites' ? 'active' : ''}`}
                    >
                        Minha Lista {favoritesCount > 0 && `(${favoritesCount})`}
                    </Link>
                </nav>
            </div>
        </header>
    );
};

export default Header;