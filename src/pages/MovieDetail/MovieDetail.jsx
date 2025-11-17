import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

// service
import { movieService, imageService } from '../../services/api';

// components
import MovieCard from '../../components/MovieCard/MovieCard';
import FavoriteButton from '../../components/FavoriteButton/FavoriteButton';
import Loading from '../../components/Loading/Loading';
import VideoPlayer from '../../components/VideoPlayer/VideoPlayer'; // 🎯 ADICIONADO

// css
import './MovieDetail.css';

const MovieDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [movie, setMovie] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showVideoPlayer, setShowVideoPlayer] = useState(false); // 🎯 ADICIONADO
    const [selectedVideo, setSelectedVideo] = useState(null); // 🎯 ADICIONADO
    const [videos, setVideos] = useState([]); // 🎯 ADICIONADO

    useEffect(() => {
        const fetchMovieDetails = async () => {
            try {
                setLoading(true);
                setError(null);
                
                // 🎯 Buscar todos os dados em paralelo
                const [detailsResponse, creditsResponse, similarResponse, videosResponse] = await Promise.all([
                    movieService.getDetails(id),
                    movieService.getCredits(id),
                    movieService.getSimilar(id),
                    movieService.getVideos(id) // 🎯 ADICIONADO
                ]);

                const movieData = {
                    ...detailsResponse.data,
                    credits: creditsResponse.data,
                    similar: similarResponse.data
                };

                setMovie(movieData);
                setVideos(videosResponse.data.results || []); // 🎯 ADICIONADO
                
            } catch (err) {
                console.error('❌ Erro ao carregar filme:', err);
                
                if (err.response?.status === 404) {
                    setError('Filme não encontrado');
                } else if (err.response?.status === 401) {
                    setError('Problema de autenticação com a API');
                } else {
                    setError('Erro ao carregar filme. Tente novamente.');
                }
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchMovieDetails();
        } else {
            setError('ID do filme não especificado');
            setLoading(false);
        }
    }, [id]);

    // 🎯 ABRIR PLAYER DE VÍDEO - ADICIONADO
    const handlePlayVideo = (video = null) => {
        if (video) {
            setSelectedVideo(video);
        } else if (videos.length > 0) {
            // Usar o primeiro trailer disponível
            const trailer = videos.find(v => v.type === 'Trailer' && v.site === 'YouTube');
            setSelectedVideo(trailer || videos[0]);
        }
        setShowVideoPlayer(true);
    };

    // 🎯 FECHAR PLAYER - ADICIONADO
    const handleCloseVideo = () => {
        setShowVideoPlayer(false);
        setSelectedVideo(null);
    };

    // 🎯 Função para navegar de volta
    const handleGoBack = () => {
        navigate(-1);
    };

    // 🎯 Formatar duração
    const formatRuntime = (minutes) => {
        if (!minutes) return 'N/A';
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        return `${hours}h ${mins}m`;
    };

    // 🎯 Formatar orçamento
    const formatBudget = (budget) => {
        if (!budget || budget === 0) return 'N/A';
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(budget);
    };

    if (loading) {
        return <Loading message="Carregando filme..." size="large" />;
    }

    if (error) {
        return (
            <div className="movie-detail movie-detail--error">
                <div className="movie-detail__error">
                    <h1>😕 Ops! Algo deu errado</h1>
                    <p>{error}</p>
                    <div className="movie-detail__error-actions">
                        <button 
                            className="movie-detail__button movie-detail__button--primary"
                            onClick={handleGoBack}
                        >
                            ← Voltar
                        </button>
                        <button 
                            className="movie-detail__button movie-detail__button--secondary"
                            onClick={() => window.location.reload()}
                        >
                            🔄 Tentar Novamente
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    if (!movie) {
        return (
            <div className="movie-detail movie-detail--error">
                <div className="movie-detail__error">
                    <h1>🎬 Filme não encontrado</h1>
                    <p>O filme solicitado não existe ou foi removido.</p>
                    <button 
                        className="movie-detail__button movie-detail__button--primary"
                        onClick={handleGoBack}
                    >
                        ← Voltar para a página anterior
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="movie-detail">
            {/* 🎯 PLAYER DE VÍDEO - ADICIONADO */}
            {showVideoPlayer && (
                <VideoPlayer 
                    video={selectedVideo}
                    onClose={handleCloseVideo}
                    title={movie.title}
                />
            )}

            {/* Botão Voltar */}
            <button 
                className="movie-detail__back-button"
                onClick={handleGoBack}
                aria-label="Voltar"
            >
                ← Voltar
            </button>

            {/* Banner Hero */}
            <div 
                className="movie-detail__hero"
                style={{
                    backgroundImage: `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.8)), url(${imageService.getBackdropUrl(movie.backdrop_path, 'w1280')})`
                }}
            >
                <div className="movie-detail__hero-content">
                    <div className="movie-detail__poster-section">
                        <div className="movie-detail__poster-card">
                            <img 
                                src={imageService.getPosterUrl(movie.poster_path, 'w500')} 
                                alt={movie.title}
                                className="movie-detail__poster"
                            />
                        </div>
                        
                        {/* Botão de favorito destacado */}
                        <div className="movie-detail__favorite-mobile">
                            <FavoriteButton movie={movie} size="large" />
                            <span>Minha Lista</span>
                        </div>
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
                                {formatRuntime(movie.runtime)}
                            </span>
                            <span className="movie-detail__genres">
                                {movie.genres?.map(genre => genre.name).join(' • ')}
                            </span>
                            {movie.adult && (
                                <span className="movie-detail__adult">18+</span>
                            )}
                        </div>

                        {/* Tagline */}
                        {movie.tagline && (
                            <p className="movie-detail__tagline">"{movie.tagline}"</p>
                        )}

                        <p className="movie-detail__overview">
                            {movie.overview || 'Sinopse não disponível.'}
                        </p>

                        {/* Informações adicionais */}
                        <div className="movie-detail__additional-info">
                            <div className="movie-detail__info-item">
                                <strong>Status:</strong> {movie.status || 'N/A'}
                            </div>
                            <div className="movie-detail__info-item">
                                <strong>Idioma Original:</strong> {movie.original_language?.toUpperCase() || 'N/A'}
                            </div>
                            <div className="movie-detail__info-item">
                                <strong>Orçamento:</strong> {formatBudget(movie.budget)}
                            </div>
                            <div className="movie-detail__info-item">
                                <strong>Receita:</strong> {formatBudget(movie.revenue)}
                            </div>
                        </div>

                        {/* 🎯 AÇÕES ATUALIZADAS COM PLAYER */}
                        <div className="movie-detail__actions">
                            <button 
                                className="movie-detail__button movie-detail__button--primary"
                                onClick={() => handlePlayVideo()}
                                disabled={videos.length === 0}
                            >
                                ▶ {videos.length > 0 ? 'Assistir Trailer' : 'Trailer Indisponível'}
                            </button>
                            
                            {/* 🎯 LISTA DE VÍDEOS DISPONÍVEIS */}
                            {videos.length > 1 && (
                                <div className="movie-detail__video-options">
                                    <button 
                                        className="movie-detail__button movie-detail__button--secondary"
                                        onClick={() => {
                                            const trailers = videos.filter(v => v.type === 'Trailer');
                                            if (trailers.length > 0) {
                                                handlePlayVideo(trailers[0]);
                                            }
                                        }}
                                    >
                                        🎬 Ver Trailers ({videos.filter(v => v.type === 'Trailer').length})
                                    </button>
                                </div>
                            )}
                            
                            <div className="movie-detail__favorite-desktop">
                                <FavoriteButton movie={movie} size="large" />
                                <span>Minha Lista</span>
                            </div>
                        </div>

                        {/* 🎯 INFORMAÇÃO DE VÍDEOS - ADICIONADO */}
                        {videos.length === 0 && (
                            <p className="movie-detail__no-videos">
                                ⚠️ Nenhum trailer disponível para este filme
                            </p>
                        )}
                    </div>
                </div>
            </div>

            {/* Conteúdo adicional */}
            <div className="movie-detail__content">
                {/* 🎯 SEÇÃO DE VÍDEOS - ADICIONADO */}
                {videos.length > 0 && (
                    <section className="movie-detail__section">
                        <h2>🎬 Vídeos e Trailers</h2>
                        <div className="movie-detail__videos">
                            {videos.slice(0, 6).map(video => (
                                <div key={video.id} className="video-thumbnail">
                                    <div 
                                        className="video-thumbnail__image"
                                        onClick={() => handlePlayVideo(video)}
                                    >
                                        <img 
                                            src={`https://img.youtube.com/vi/${video.key}/hqdefault.jpg`}
                                            alt={video.name}
                                        />
                                        <div className="video-thumbnail__overlay">
                                            <span className="video-thumbnail__play">▶</span>
                                        </div>
                                    </div>
                                    <div className="video-thumbnail__info">
                                        <h4>{video.name}</h4>
                                        <span className="video-thumbnail__type">
                                            {video.type} • {video.size}p
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Elenco Principal */}
                {movie.credits?.cast?.length > 0 && (
                    <section className="movie-detail__section">
                        <h2>Elenco Principal</h2>
                        <div className="movie-detail__cast">
                            {movie.credits.cast.slice(0, 12).map(actor => (
                                <div key={actor.id} className="cast-card">
                                    <img 
                                        src={actor.profile_path 
                                            ? imageService.getPosterUrl(actor.profile_path, 'w185')
                                            : '/images/placeholder-avatar.jpg'
                                        } 
                                        alt={actor.name}
                                        className="cast-card__photo"
                                        loading="lazy"
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

                {/* Equipe Técnica (Diretor) */}
                {movie.credits?.crew?.length > 0 && (
                    <section className="movie-detail__section">
                        <h2>Equipe</h2>
                        <div className="movie-detail__crew">
                            {movie.credits.crew
                                .filter(person => person.job === 'Director')
                                .slice(0, 3)
                                .map(person => (
                                <div key={person.id} className="crew-card">
                                    <h3>{person.name}</h3>
                                    <p>{person.job}</p>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Filmes similares */}
                {movie.similar?.results?.length > 0 && (
                    <section className="movie-detail__section">
                        <h2>Você Também Pode Gostar</h2>
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