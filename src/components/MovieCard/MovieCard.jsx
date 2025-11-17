import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

// service
import { imageService } from "../../services/api";

// components
import FavoriteButton from '../FavoriteButton/FavoriteButton';

// css
import './MovieCard.css';

const MovieCard = ({ movie }) => {
    const navigate = useNavigate();
    const [imageError, setImageError] = useState(false);
    const [imageLoading, setImageLoading] = useState(true);
    
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
        navigate(detailUrl);
    };

    const handleFavoriteClick = (e) => {
        e.stopPropagation();
    };

    const handleImageLoad = () => {
        setImageLoading(false);
    };

    const handleImageError = () => {
        setImageError(true);
        setImageLoading(false);
    };

    // Texto reduzido para overview se necessário
    const truncateText = (text, maxLength) => {
        if (!text) return '';
        if (text.length <= maxLength) return text;
        return text.substr(0, maxLength) + '...';
    };

    return (
        <div className="movie-card" onClick={handleCardClick}>
            <div className="movie-card__image-container">
                {imageLoading && (
                    <div className="movie-card__skeleton"></div>
                )}
                <img 
                    src={imageError 
                        ? '/images/placeholder-poster.jpg'  // Imagem fallback
                        : imageService.getPosterUrl(movie.poster_path, 'w300')
                    } 
                    alt={movie.title || movie.name} 
                    className={`movie-card__poster ${imageLoading ? 'movie-card__poster--hidden' : ''}`}
                    onLoad={handleImageLoad}
                    onError={handleImageError}
                />
                
                {/* Overlay no hover */}
                <div className="movie-card__overlay">
                    <div className="movie-card__overlay-content">
                        <h3 className="movie-card__overlay-title">
                            {movie.title || movie.name}
                        </h3>
                        <p className="movie-card__overlay-year">
                            {movie.release_date ? new Date(movie.release_date).getFullYear() : 
                             movie.first_air_date ? new Date(movie.first_air_date).getFullYear() : 'N/A'}
                        </p>
                        <p className="movie-card__overlay-rating">
                            ⭐ {movie.vote_average?.toFixed(1) || 'N/A'}
                        </p>
                        {movie.overview && (
                            <p className="movie-card__overlay-overview">
                                {truncateText(movie.overview, 120)}
                            </p>
                        )}
                        <button className="movie-card__overlay-button">
                            Ver Detalhes
                        </button>
                    </div>
                </div>
            </div>

            {/* Botão de favorito */}
            <div className="movie-card__favorite" onClick={handleFavoriteClick}>
                <FavoriteButton movie={movie} size="small" />
            </div>

            {/* Informações básicas (visíveis sempre) */}
            <div className="movie-card__info">  
                <h3 className="movie-card__title">
                    {truncateText(movie.title || movie.name, 25)}
                </h3> 
                <p className="movie-card__year">  
                    {movie.release_date ? new Date(movie.release_date).getFullYear() : 
                     movie.first_air_date ? new Date(movie.first_air_date).getFullYear() : 'N/A'}
                </p>
                <div className="movie-card__rating">
                    ⭐ {movie.vote_average?.toFixed(1) || 'N/A'}
                </div>
            </div>

            {/* Badge de tipo (opcional) */}
            <div className="movie-card__type-badge">
                {mediaType === 'tv' ? 'SÉRIE' : 'FILME'}
            </div>
        </div>
    );
};

export default MovieCard;