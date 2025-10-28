import React from "react";
import { useNavigate } from "react-router-dom";

// service
import { imageService } from "../../services/api";

// components
import FavoriteButton from '../FavoriteButton/FavoriteButton';

// css
import './MovieCard.css';

const MovieCard = ({ movie }) => {
    const navigate = useNavigate();
    
    const getMediaType = () => {
        // Se veio da busca "multi", usa media_type
        if (movie.media_type) {
            return movie.media_type;
        }
        // Se tem first_air_date, é série
        if (movie.first_air_date) {
            return 'tv';
        }
        // Se tem release_date, é filme
        if (movie.release_date) {
            return 'movie';
        }
        // Padrão: assume que é filme
        return 'movie';
    };

    const mediaType = getMediaType();
    const detailUrl = `/${mediaType}/${movie.id}`;

    const handleCardClick = () => {
        console.log('🎬 Navegando para:', detailUrl, 'Tipo:', mediaType);
        console.log('📊 Dados do item:', {
            id: movie.id,
            title: movie.title || movie.name,
            media_type: movie.media_type,
            first_air_date: movie.first_air_date,
            release_date: movie.release_date
        });
        navigate(detailUrl);
    };

    const handleFavoriteClick = (e) => {
        e.stopPropagation();
    };

    return (
        <div className="movie-card" onClick={handleCardClick}>
            <img 
                src={imageService.getPosterUrl(movie.poster_path, 'w300')} 
                alt={movie.title || movie.name} 
                className="movie-card__poster" 
            />
            <div className="movie-card__favorite" onClick={handleFavoriteClick}>
                <FavoriteButton movie={movie} size="small" />
            </div>
            <div className="movie-card__info">  
                <h3 className="movie-card__title">{movie.title || movie.name}</h3> 
                <p className="movie-card__year">  
                    {movie.release_date ? new Date(movie.release_date).getFullYear() : 
                     movie.first_air_date ? new Date(movie.first_air_date).getFullYear() : 'N/A'}
                </p>
                <div className="movie-card__rating">
                    ⭐ {movie.vote_average?.toFixed(1)}
                </div>
                {/* 👇 DEBUG: mostra o tipo (opcional - pode remover depois) */}
                <div style={{fontSize: '10px', color: '#666', marginTop: '5px'}}>
                    Tipo: {mediaType}
                </div>
            </div>
        </div>
    );
};

export default MovieCard;