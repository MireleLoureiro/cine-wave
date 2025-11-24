import React, { useState } from "react";

// context
import { useFavorites } from "../../contexts/FavoritesContext";
import { useAuth } from "../../contexts/AuthContext";

// css
import './FavoriteButton.css';

const FavoriteButton = ({ movie, size = 'medium' }) => {
    const { isFavorite, toggleFavorite } = useFavorites();
    const { isAuthenticated } = useAuth();
    
    const [isAnimating, setIsAnimating] = useState(false);
    const isActive = isFavorite(movie.id);

    const handleClick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        if (!isAuthenticated) {
            return;
        }
        
        if (!isActive) {
            setIsAnimating(true);
            setTimeout(() => setIsAnimating(false), 600);
        }
        
        toggleFavorite(movie);
    };

    const getEmoji = () => {
        if (!isAuthenticated) return '🔒';
        if (isActive) return '❤️';
        return '🤍';
    };

    const getTooltipText = () => {
        if (!isAuthenticated) return 'Faça login para favoritar';
        if (isActive) return 'Remover dos favoritos';
        return 'Adicionar aos favoritos';
    };

    const getAriaLabel = () => {
        if (!isAuthenticated) return 'Faça login para favoritar este conteúdo';
        if (isActive) return `Remover ${movie.title || movie.name} dos favoritos`;
        return `Adicionar ${movie.title || movie.name} aos favoritos`;
    };

    return (
        <button 
            className={`favorite-button favorite-button--${size} ${
                isActive ? 'favorite-button--active' : ''
            } ${isAnimating ? 'favorite-button--animating' : ''} ${
                !isAuthenticated ? 'favorite-button--disabled' : ''
            }`}
            onClick={handleClick}
            aria-label={getAriaLabel()}
            title={getTooltipText()}
        >
            <span className="favorite-button__emoji">
                {getEmoji()}
            </span>
            
            {isActive && <div className="favorite-button__pulse"></div>}
        </button>
    );
};

export default FavoriteButton;