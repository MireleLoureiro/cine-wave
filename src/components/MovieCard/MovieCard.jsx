import React from "react";
import { imageService } from "../../services/api";
import './MovieCard.css';

const MovieCard = ({ movie }) => {
    return (
        <div className="movie-card">
            <img 
                src={imageService.getPosterUrl(movie.poster_path, 'w300')} 
                alt={movie.title || movie.name} 
                className="movie-card__poster" 
            />
            <div className="movie-card__info">  
                <h3 className="movie-card__title">{movie.title || movie.name}</h3> 
                <p className="movie-card__year">  
                    {movie.release_date ? new Date(movie.release_date).getFullYear() : 'N/A'}
                </p>
                <div className="movie-card__rating">
                    ⭐ {movie.vote_average?.toFixed(1)}
                </div>
            </div>
        </div>
    );
};

export default MovieCard;