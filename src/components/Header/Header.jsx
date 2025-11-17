// components/Header/Header.jsx (ATUALIZADO)
import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { useFavorites } from "../../contexts/FavoritesContext";
import logo from '../../assets/images/logo.png';
import SearchBar from "../SearchBar/SearchBar";
import ThemeToggle from '../ThemeToggle/ThemeToggle'
import './Header.css';

const Header = () => {
    const { favoritesCount } = useFavorites();
    const { user, isAuthenticated, logout } = useAuth();
    const [isScrolled, setIsScrolled] = useState(false);
    const [showMobileSearch, setShowMobileSearch] = useState(false);
    const [showMobileMenu, setShowMobileMenu] = useState(false);
    const [showUserMenu, setShowUserMenu] = useState(false);
    
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 100);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        setShowMobileMenu(false);
        setShowMobileSearch(false);
        setShowUserMenu(false);
    }, [location]);

    const handleLogout = () => {
        logout();
        setShowUserMenu(false);
        navigate('/');
    };

    const handleUserMenuToggle = () => {
        setShowUserMenu(!showUserMenu);
    };

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
                    
                    {isAuthenticated ? (
                        <>
                            <Link 
                                to="/favorites" 
                                className={`header__nav-item ${location.pathname === '/favorites' ? 'active' : ''}`}
                            >
                                Minha Lista {favoritesCount > 0 && `(${favoritesCount})`}
                            </Link>
                            
                            {/* Menu do Usuário */}
                            <div className="header__user-menu">
                                <button 
                                    className="header__user-button"
                                    onClick={handleUserMenuToggle}
                                >
                                    <span className="header__user-avatar">
                                        {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                                    </span>
                                    <span className="header__user-name">
                                        {user?.name?.split(' ')[0] || 'Usuário'}
                                    </span>
                                </button>

                                {showUserMenu && (
                                    <div className="header__user-dropdown">
                                        <div className="header__user-info">
                                            <strong>{user?.name}</strong>
                                            <span>{user?.email}</span>
                                        </div>
                                        <Link 
                                            to="/profile" 
                                            className="header__dropdown-item"
                                            onClick={() => setShowUserMenu(false)}
                                        ></Link>
                                        <Link 
                                            to="/profile" 
                                            className="header__dropdown-item"
                                            onClick={() => setShowUserMenu(false)}
                                        >
                                            Meu Perfil
                                        </Link>
                                        <div className="header__dropdown-item header__theme-item">
                                            <ThemeToggle />
                                        </div>
                                        <Link 
                                            to="/favorites" 
                                            className="header__dropdown-item"
                                            onClick={() => setShowUserMenu(false)}
                                        >
                                            Minha Lista
                                        </Link>
                                        <button 
                                            className="header__dropdown-item header__logout"
                                            onClick={handleLogout}
                                        >
                                            Sair
                                        </button>
                                    </div>
                                )}
                            </div>
                        </>
                    ) : (
                        <div className="header__auth-buttons">
                            <Link 
                                to="/login" 
                                className="header__login-button"
                            >
                                Entrar
                            </Link>
                            <Link 
                                to="/register" 
                                className="header__register-button"
                            >
                                Cadastrar
                            </Link>
                        </div>
                    )}
                </nav>

                {/* Menu Hamburger Mobile */}
                <ThemeToggle />
                <button 
                    className={`header__menu-toggle ${showMobileMenu ? 'active' : ''}`}
                    onClick={() => setShowMobileMenu(!showMobileMenu)}
                    aria-label="Toggle menu"
                >
                    <span></span>
                    <span></span>
                    <span></span>
                </button>
            </div>
        </header>
    );
};

export default Header;