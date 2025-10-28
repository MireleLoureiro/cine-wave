import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

// service
import { movieService, imageService } from '../../services/api';

// components
import MovieCard from '../../components/MovieCard/MovieCard';
import FavoriteButton from '../../components/FavoriteButton/FavoriteButton';
import Loading from '../../components/Loading/Loading';

// css
import './MovieDetail.css';

const MovieDetail = () => {
    const { id } = useParams();
    const [movie, setMovie] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchMovieDetails = async () => {
            try {
                setLoading(true);
                console.log('🎬 Iniciando busca do filme ID:', id);
                
                // 👇 VERIFIQUE SE O SERVIÇO EXISTE
                console.log('🔧 movieService:', movieService);
                console.log('🔧 movieService.getDetails:', movieService.getDetails);
                
                const response = await movieService.getDetails(id);
                console.log('✅ Resposta da API:', response);
                console.log('📊 Dados do filme:', response.data);
                
                setMovie(response.data);
                
            } catch (err) {
                console.error('❌ Erro completo:', err);
                console.error('🔧 Response do erro:', err.response);
                console.error('🔧 Mensagem do erro:', err.message);
                setError('Erro ao carregar filme');
            } finally {
                setLoading(false);
                console.log('🏁 Busca finalizada');
            }
        };

        if (id) {
            fetchMovieDetails();
        } else {
            console.log('❌ ID não encontrado nos parâmetros');
            setError('ID do filme não especificado');
            setLoading(false);
        }
    }, [id]);

    if (loading) {
        return <Loading message="Carregando filme..." />;
    }

    if (!movie) {
        return (
            <div className="movie-detail movie-detail--error">
                <div className="movie-detail__error">
                    <h1>Filme não encontrado</h1>
                    <p>O filme solicitado não existe.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="movie-detail">
            {/* Banner Hero */}
            <div 
                className="movie-detail__hero"
                style={{
                    backgroundImage: `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.8)), url(${imageService.getBackdropUrl(movie.backdrop_path, 'w1280')})`
                }}
            >
                <div className="movie-detail__hero-content">
                    <div className="movie-detail__poster-card">
                        <MovieCard movie={movie} />
                    </div>
                    
                    <div className="movie-detail__info">
                        <h1 className="movie-detail__title">
                            {movie.title}
                            <span className="movie-detail__year">
                                ({new Date(movie.release_date).getFullYear()})
                            </span>
                        </h1>
                        
                        <div className="movie-detail__meta">
                            <span className="movie-detail__rating">
                                ⭐ {movie.vote_average?.toFixed(1)}/10
                            </span>
                            <span className="movie-detail__runtime">
                                {movie.runtime} min
                            </span>
                            <span className="movie-detail__genres">
                                {movie.genres?.map(genre => genre.name).join(', ')}
                            </span>
                        </div>

                        <p className="movie-detail__overview">
                            {movie.overview}
                        </p>

                        <div className="movie-detail__actions">
                            <button className="movie-detail__button movie-detail__button--primary">
                                ▶ Assistir
                            </button>
                            <FavoriteButton movie={movie} size="large" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Conteúdo adicional */}
            <div className="movie-detail__content">
                {/* Elenco */}
                {movie.credits?.cast?.length > 0 && (
                    <section className="movie-detail__section">
                        <h2>Elenco Principal</h2>
                        <div className="movie-detail__cast">
                            {movie.credits.cast.slice(0, 10).map(actor => (
                                <div key={actor.id} className="cast-card">
                                    <img 
                                        src={imageService.getPosterUrl(actor.profile_path, 'w185')} 
                                        alt={actor.name}
                                        className="cast-card__photo"
                                    />
                                    <div className="cast-card__info">
                                        <h3>{actor.name}</h3>
                                        <p>{actor.character}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Filmes similares */}
                {movie.similar?.results?.length > 0 && (
                    <section className="movie-detail__section">
                        <h2>Filmes Similares</h2>
                        <div className="movie-detail__similar">
                            {movie.similar.results.slice(0, 8).map(similarMovie => (
                                <MovieCard key={similarMovie.id} movie={similarMovie} />
                            ))}
                        </div>
                    </section>
                )}
            </div>
        </div>
    );
};

export default MovieDetail;