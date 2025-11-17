import React, { useState } from "react";

// context
import { useFavorites } from "../../contexts/FavoritesContext";

// css
import './FavoriteButton.css';

const FavoriteButton = ({ movie, size = 'medium' }) => {
    const { isFavorite, toggleFavorite } = useFavorites();
    const [isAnimating, setIsAnimating] = useState(false);
    const isActive = isFavorite(movie.id);

    const handleClick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        // Trigger animation
        if (!isActive) {
            setIsAnimating(true);
            setTimeout(() => setIsAnimating(false), 600);
        }
        
        toggleFavorite(movie);
    };

    const getEmoji = () => {
        if (isActive) {
            return '❤️'; // Coração preenchido
        } else {
            return '🤍'; // Coração vazio
        }
    };

    return (
        <button 
            className={`favorite-button favorite-button--${size} ${
                isActive ? 'favorite-button--active' : ''
            } ${isAnimating ? 'favorite-button--animating' : ''}`}
            onClick={handleClick}
            aria-label={isActive ? 
                `Remover ${movie.title || movie.name} dos favoritos` : 
                `Adicionar ${movie.title || movie.name} aos favoritos`
            }
            title={isActive ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
        >
            <span className="favorite-button__emoji">
                {getEmoji()}
            </span>
            
            {/* Efeito de pulso quando é ativado */}
            {isActive && <div className="favorite-button__pulse"></div>}
        </button>
    );
};

export default FavoriteButton;