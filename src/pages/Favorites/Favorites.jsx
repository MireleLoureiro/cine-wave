import React, { useState } from 'react';
import { useFavorites } from '../../contexts/FavoritesContext';

// components
import MovieCard from '../../components/MovieCard/MovieCard';
import Loading from '../../components/Loading/Loading';

// css
import './Favorites.css';

const Favorites = () => {
    const { favorites, favoritesCount, isLoaded } = useFavorites();
    const [activeFilter, setActiveFilter] = useState('all'); // 'all', 'movies', 'tv'

    // Filtro simples
    const filteredFavorites = activeFilter === 'all' 
        ? favorites 
        : favorites.filter(movie => 
            activeFilter === 'movies' ? !movie.first_air_date : movie.first_air_date
        );

    // Contadores para os filtros
    const moviesCount = favorites.filter(movie => !movie.first_air_date).length;
    const tvShowsCount = favorites.filter(movie => movie.first_air_date).length;

    // Loading state
    if (!isLoaded) {
        return (
            <div className="favorites">
                <Loading message="Carregando sua lista..." />
            </div>
        );
    }

    // Empty state
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
                <p>{favoritesCount} {favoritesCount === 1 ? 'item' : 'itens'} favoritos</p>
                
                {/* Filtros básicos */}
                <div className="favorites__filters">
                    <button 
                        className={activeFilter === 'all' ? 'active' : ''}
                        onClick={() => setActiveFilter('all')}
                    >
                        Todos ({favoritesCount})
                    </button>
                    <button 
                        className={activeFilter === 'movies' ? 'active' : ''}
                        onClick={() => setActiveFilter('movies')}
                    >
                        Filmes ({moviesCount})
                    </button>
                    <button 
                        className={activeFilter === 'tv' ? 'active' : ''}
                        onClick={() => setActiveFilter('tv')}
                    >
                        Séries ({tvShowsCount})
                    </button>
                </div>
            </div>
            
            <div className="favorites__grid">
                {filteredFavorites.map(movie => (
                    <MovieCard key={movie.id} movie={movie} />
                ))}
            </div>

            {/* Mensagem quando não há resultados no filtro */}
            {filteredFavorites.length === 0 && activeFilter !== 'all' && (
                <div style={{textAlign: 'center', padding: '40px', color: '#aaa'}}>
                    <p>Nenhum {activeFilter === 'movies' ? 'filme' : 'série'} encontrado nos favoritos.</p>
                </div>
            )}
        </div>
    );
};

export default Favorites;