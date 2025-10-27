import React from 'react';

// context
import { useFavorites } from '../../contexts/FavoritesContext';

// component
import MovieCard from '../../components/MovieCard/MovieCard';

// css
import './Favorites.css';

const Favorites = () => {
    const { favorites, favoritesCount } = useFavorites();

    if (favoritesCount === 0) {
        return (
            <div className="favorites favorites--empty">
                <div className="favorites__empty-content">
                    <h1>Minha Lista</h1>
                    <p>🤍 Você ainda não tem filmes favoritos</p>
                    <p>Clique no coração nos filmes para adicioná-los aqui!</p>
                </div>
            </div>
        );
    }

    return (
        <div className="favorites">
            <div className="favorites__header">
                <h1>Minha Lista</h1>
                <p>{favoritesCount} {favoritesCount === 1 ? 'filme' : 'filmes'} favoritos</p>
            </div>
            
            <div className="favorites__grid">
                {favorites.map(movie => (
                    <MovieCard key={movie.id} movie={movie} />
                ))}
            </div>
        </div>
    );
};

export default Favorites;