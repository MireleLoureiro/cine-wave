import React from "react";

// context
import { useFavorites } from "../../contexts/FavoritesContext";

// css
import './FavoriteButton.css'

const FavoriteButton = ({ movie, size = 'medium' }) => {
    const { isFavorite, toggleFavorite } = useFavorites();

    const handleClick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleFavorite(movie);
    }

    return (
        <button 
            className={`favorite-button favorite-button--${size} ${
                isFavorite(movie.id) ? 'favorite-button--active' : ''
            }`}
            onClick={handleClick}
            aria-label={isFavorite(movie.id) ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
        >
            {isFavorite(movie.id) ? '❤️' : '🤍'}
        </button>
    );
};

export default FavoriteButton;