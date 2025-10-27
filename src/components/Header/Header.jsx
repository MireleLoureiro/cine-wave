import React from "react";
import { Link } from "react-router-dom";
import logo from '../../assets/images/logo.png';

// context
import { useFavorites } from "../../contexts/FavoritesContext";

// css
import './Header.css';

const Header = () => {
    const { favoritesCount } = useFavorites();
    
    return (
        <header className="header">
            <div className="header__container">
                <Link to="/">
                    <img src={logo} alt="CineWave" className="header__logo-image" />  
                </Link>
                <nav className="header__nav">
                    <Link to="/" className="header__nav-item">Início</Link>
                    <Link to="/search" className="header__nav-item">Search</Link>
                    <Link to="/favorites" className="header__nav-item">
                        Minha Lista {favoritesCount > 0 && `(${favoritesCount})`}
                    </Link>
                </nav>
            </div>
        </header>
    );
};

export default Header;